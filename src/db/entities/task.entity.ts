import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TaskStatusEnum } from 'src/task/enum/task-status.enum';

@Entity({ name: 'task' })
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id?: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'enum', enum: TaskStatusEnum, default: TaskStatusEnum.TO_DO })
  status: string;

  @Column({ type: 'timestamptz', name: 'expiration_date' })
  expirationDate: Date;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.tasks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  readonly user?: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt?: Date;
}
