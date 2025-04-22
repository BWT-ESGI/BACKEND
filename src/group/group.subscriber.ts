// src/group/group.subscriber.ts
import { Injectable } from '@nestjs/common';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Group } from './entities/group.entity';
import { Defense } from '@/defense/entities/defense.entity';
import { Month } from '@/defense/enums/month.enum';

@Injectable()
@EventSubscriber()
export class GroupSubscriber implements EntitySubscriberInterface<Group> {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
    @InjectRepository(Defense)
    private readonly defenseRepo: Repository<Defense>,
  ) {}

  /**  
   * Spécifie que ce subscriber « écoute » l’entité Group
   */
  listenTo() {
    return Group;
  }

  /**
   * Après chaque update de groupe, on veille à :
   * - créer une soutenance si le groupe a des membres mais aucune defense
   * - supprimer toutes les soutenances si le groupe n'a plus de membres
   */
  async afterUpdate(event: UpdateEvent<Group>) {
    const groupId = event.entity?.id;
    if (!groupId) return;

    // On recharge le groupe avec ses membres et ses defenses
    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ['members', 'defenses'],
    });
    if (!group) return;

    const hasMembers = group.members.length > 0;
    const defenses = group.defenses ?? [];

    if (hasMembers) {
      if (defenses.length === 0) {
        // Crée une nouvelle defense par défaut
        const now = new Date();
        const def = this.defenseRepo.create({
          name: `${group.name} – Soutenance`,
          start: now,
          end: new Date(now.getTime() + 30 * 60000), // +30 min
          month: Month[now.getMonth()], // ajuster selon votre enum
          group,
        });
        await this.defenseRepo.save(def);
      }
    } else {
      // plus de membres → on supprime toutes les defenses liées
      if (defenses.length > 0) {
        await this.defenseRepo.remove(defenses);
      }
    }
  }
}