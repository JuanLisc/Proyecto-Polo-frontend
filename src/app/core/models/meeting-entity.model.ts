import { BaseEntity } from './base-entity.model';

export class MeetingEntity extends BaseEntity {
  detail!: string;
  date!: Date;
  hour!: number;
  duration!: number;
}