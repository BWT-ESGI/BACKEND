import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  BadRequestException,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@/users/enums/role.enum';
import { ProjectService } from '@/project/project.service'; 
import { GroupService } from '@/group/group.service';

@Injectable()
export class DeadlineNotExpiredGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    let projectId: string | undefined;

    // On cherche le projectId depuis params, sinon via le group
    if (req.params.projectId) {
      projectId = req.params.projectId;
    } else if (req.params.idGroup) {
      const group = await this.groupService.findOne(req.params.idGroup);
      projectId = group?.project?.id;
    }

    if (!projectId) return true; // impossible de vérifier

    // Récupère le projet
    const project = await this.projectService.findOne(projectId);
    if (
      user?.role === Role.Student &&
      project?.deadlineGroupSelection &&
      project?.groupCompositionType == "student_choice" &&
      new Date(project.deadlineGroupSelection) < new Date()
    ) {
      throw new BadRequestException(
        "La deadline de sélection des groupes est dépassée."
      );
    }
    return true;
  }
}