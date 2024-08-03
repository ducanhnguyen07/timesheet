import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { RequestType } from '../../common/constant/request-type.constant';
import { User } from '../../user/entities/user.entity';
import { StatusConstant } from '../../../src/common/constant/status.constant';

@Entity('request')
export class Request extends BaseEntity {
  @Column({ name: 'note' })
  note: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: RequestType,
    default: RequestType.OFF,
  })
  type: number;

  @Column({ name: 'requestDay', default: () => 'CURRENT_TIMESTAMP', })
  requestDay: Date;

  @Column({ name: 'time' })
  time: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: StatusConstant,
    default: StatusConstant.PENDING,
  })
  status: number;

  @ManyToOne(() => User, (user) => user.requests, { cascade: true })
  @JoinColumn({ name: 'userId' })
  userId: User;
}
