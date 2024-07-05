import { ProjectStatusConstant } from '../../common/constant/status.constant';
import { BaseEntity } from "../../common/entity/base.entity";
import { Task } from '../../task/entities/task.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('project')
export class Project extends BaseEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'budget' })
  budget: number;

  @Column({
    name: 'status', 
    type: 'enum',
    enum: ProjectStatusConstant,
    default: ProjectStatusConstant.ACTIVE
  })
  status: number;

  @OneToMany(() => Task, task => task.projectId)
  tasks: Task[]
}
