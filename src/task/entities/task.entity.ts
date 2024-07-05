import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/entity/base.entity";
import { Project } from "../../project/entities/project.entity";
import { User } from "../../user/entities/user.entity";
import { Timesheet } from "../../timesheet/entities/timesheet.entity";
import { TaskStatusConstant } from "../../common/constant/status.constant";

@Entity('task')
export class Task extends BaseEntity {
  @Column({ name: 'name' })
  name: string

  @Column({ name: 'description' })
  description: string

  @Column({ name: 'requirement' })
  requirement: Date

  @Column({
    name: 'status', 
    type: 'enum',
    enum: TaskStatusConstant,
    default: TaskStatusConstant.ACTIVE
  })
  status: number;

  @ManyToOne(() => Project, project => project.tasks, { cascade: true })
  @JoinColumn({ name: 'projectId' })
  projectId: Project;

  @ManyToOne(() => User, user => user.tasks, { cascade: true })
  @JoinColumn({ name: 'userId' })
  userId: User;

  @OneToMany(() => Timesheet, timesheet => timesheet.taskId)
  timesheets: Timesheet[]
}
