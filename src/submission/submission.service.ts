import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { DeliverableService } from '@/deliverable/deliverable.service';
import { MinioService } from '@/minio/minio.service';
import { RuleService } from '@/rule/rule.service';
import { RuleType } from '@/rule/entities/rule.entity';
import { RuleResultService } from '@/rule-result/rule-result.service';
import { COMMON_ARCHITECTURES } from '@/rule/rule-suggestions';
import * as zipUtils from './zip-utils';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
    private readonly deliverableService: DeliverableService,
    private readonly minioService: MinioService,
    private readonly ruleService: RuleService,
    private readonly ruleResultService: RuleResultService,
  ) { }

  async checkRules(submission: Submission, fileBuffer: Buffer) {
    try {
      const rules = await this.ruleService.findByDeliverable(submission.deliverableId);
      if (!rules || rules.length === 0) {
        console.warn(`Aucune règle trouvée pour le livrable ${submission.deliverableId}`);
        await this.ruleResultService.create({
          submissionId: submission.id,
          ruleId: null,
          passed: true,
          message: 'Aucune règle à valider, soumission conforme.'
        });
        return;
      }
      for (const rule of rules) {
        let passed = false;
        let message = '';
        try {
          switch (rule.type) {
            case RuleType.FILE_EXISTS: {
              const file = rule.preset || rule.config.file;
              passed = zipUtils.fileExistsInZip(fileBuffer, file);
              message = passed ? `Fichier ${file} présent.` : `Fichier ${file} manquant.`;
              break;
            }
            case RuleType.DIR_STRUCTURE: {
              let structure = rule.config.structure;
              if (rule.preset) {
                const preset = COMMON_ARCHITECTURES.find(a => a.name === rule.preset);
                structure = preset ? preset.structure : structure;
              }
              passed = zipUtils.dirStructureMatches(fileBuffer, structure);
              message = passed ? `Structure conforme.` : `Structure non conforme.`;
              break;
            }
            case RuleType.CONTENT_REGEX: {
              const file = rule.config.file;
              const matcher = rule.config.matcher;
              passed = zipUtils.fileContentMatches(fileBuffer, file, matcher);
              message = passed ? `Contenu conforme.` : `Contenu non conforme.`;
              break;
            }
            default:
              passed = true;
              message = 'Règle non supportée.';
          }
        } catch (e) {
          passed = false;
          message = `Erreur lors de la vérification: ${e}`;
          console.error(`Erreur lors de la vérification de la règle ${rule.id} pour la soumission ${submission.id}:`, e);
        }
        try {
          await this.ruleResultService.create({
            submissionId: submission.id,
            ruleId: rule.id,
            passed,
            message,
          });
        } catch (err) {
          console.error(`Erreur lors de la création du RuleResult pour la règle ${rule.id} et la soumission ${submission.id}:`, err);
        }
      }
    } catch (err) {
      console.error('Erreur globale dans checkRules:', err);
    }
  }

  async create(dto: CreateSubmissionDto, fileBuffer?: Buffer, fileName?: string, fileSize?: number): Promise<Submission> {
    const deliverable = await this.deliverableService.findOne(dto.deliverableId);
    let submission = this.submissionRepository.create({
      ...dto,
      deliverable,
      deliverableId: dto.deliverableId,
      groupId: dto.groupId,
      submittedAt: new Date(),
      isLate: false,
      penaltyApplied: 0,
    });
    submission.isLate = submission.submittedAt > deliverable.deadline;
    if (submission.isLate && !deliverable.allowLateSubmission) {
      throw new BadRequestException('Soumission tardive non autorisée');
    }
    submission.penaltyApplied = submission.isLate
      ? ((submission.submittedAt.getTime() - deliverable.deadline.getTime()) / 1000 / 3600) * deliverable.penaltyPerHourLate
      : 0;
    submission = await this.submissionRepository.save(submission);

    if (fileBuffer && fileName) {
      const objectName = `submissions/${submission.id}/${fileName}`;
      await this.minioService.upload('bwt', objectName, fileBuffer, fileSize);
      submission.archiveObjectName = objectName;
      submission.filename = fileName;
      submission.size = fileSize;
      await this.submissionRepository.save(submission);
      await this.checkRules(submission, fileBuffer);
    } else if (dto.gitRepoUrl) {
      const tmp = require('tmp');
      const simpleGit = require('simple-git');
      const fs = require('fs');
      const path = require('path');
      const AdmZip = require('adm-zip');
      const tmpDir = tmp.dirSync({ unsafeCleanup: true });
      const repoPath = tmpDir.name;
      await simpleGit().clone(dto.gitRepoUrl, repoPath);
      const zip = new AdmZip();
      const addDirToZip = (dir, zipPath = '') => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const relPath = path.join(zipPath, file);
          if (fs.statSync(fullPath).isDirectory()) {
            addDirToZip(fullPath, relPath);
          } else {
            zip.addLocalFile(fullPath, zipPath);
          }
        }
      };
      addDirToZip(repoPath);
      const zipBuffer = zip.toBuffer();
      const zipFileName = `repo-${submission.id}.zip`;
      const objectName = `submissions/${submission.id}/${zipFileName}`;
      await this.minioService.upload('bwt', objectName, zipBuffer, zipBuffer.length);
      submission.archiveObjectName = objectName;
      submission.filename = zipFileName;
      submission.size = zipBuffer.length;
      submission.gitRepoUrl = dto.gitRepoUrl;
      await this.submissionRepository.save(submission);
      console.log('Déclenchement checkRules (git-archive)', { submissionId: submission.id });
      await this.checkRules(submission, zipBuffer);
      tmpDir.removeCallback();
    } else {
      console.warn('Aucun fichier ni repo git fourni pour la soumission', { submissionId: submission.id });
    }

    const projectId = deliverable.projectId;

    return submission;
  }

  findAll(): Promise<Submission[]> {
    return this.submissionRepository.find();
  }

  findOne(id: string): Promise<Submission> {
    return this.submissionRepository.findOne({ where: { id } });
  }

  findByGroupId(groupId: string): Promise<Submission[]> {
    return this.submissionRepository.find({
      where: { groupId },
      relations: ['deliverable', 'student', 'group'],
    });
  }

  async findByDeliverable(deliverableId: string): Promise<Submission[]> {
    return this.submissionRepository.find({ where: { deliverableId } });
  }

  async update(id: string, dto: UpdateSubmissionDto): Promise<Submission> {
    await this.submissionRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.submissionRepository.delete(id);
  }

  
}