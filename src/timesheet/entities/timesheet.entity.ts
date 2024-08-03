import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/entity/base.entity";
import { StatusConstant } from "../../../src/common/constant/status.constant";
import { Task } from "../../task/entities/task.entity";

@Entity('timesheet')
export class Timesheet extends BaseEntity {
  @Column({
    name: 'status',
    type: "enum",
    enum: StatusConstant,
    default: StatusConstant.PENDING,
  })
  status: number

  @Column({ name: 'note' })
  note: string

  @Column({ name: 'workingTime' })
  workingTime: number

  @ManyToOne(() => Task, task => task.timesheets, { cascade: true })
  @JoinColumn({ name: 'taskId' })
  taskId: string;
}
