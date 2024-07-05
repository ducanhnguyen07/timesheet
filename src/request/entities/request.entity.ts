import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/entity/base.entity";
import { RequestType } from "../../common/constant/request-type.constant";
import { User } from "../../user/entities/user.entity";

@Entity('request')
export class Request extends BaseEntity {
  @Column({ name: 'note' })
  note: string

  @Column({
    name: 'type',
    type: "enum",
    enum: RequestType,
    default: RequestType.OFF
  })
  type: number

  @Column({ name: 'time' })
  time: number

  @ManyToOne(() => User, user => user.requests, { cascade: true })
  @JoinColumn({ name: 'userId' })
  userId: User
}
