import { BaseEntity } from './base-entity.model';

export class UserEntity extends BaseEntity {
  email!: string;
  firstName!: string;
  lastName!: string;
  password!: string;
  role!: string;
}