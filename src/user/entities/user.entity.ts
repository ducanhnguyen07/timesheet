import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { BranchConstant } from '../../common/constant/branch.constant';
import { Task } from '../../task/entities/task.entity';
import { Role } from '../../role/entities/role.entity';
import { Request } from '../../request/entities/request.entity';

@Entity('user')
export class User extends BaseEntity {
  static delete(arg0: {}) {
    throw new Error("Method not implemented.");
  }
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'address' })
  address: string;

  @Column({ name: 'gender' })
  gender: string;

  @Column({
    name: 'branch',
    type: 'enum',
    enum: BranchConstant,
    default: BranchConstant.HANOI1,
  })
  branch: number;

  @Column({ name: 'avatar', default: '' })
  avatar: string;

  @OneToMany(() => Task, (task) => task.userId)
  tasks: Task[];

  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];

  @OneToMany(() => Request, (request) => request.userId)
  requests: Request[];
  createdUser: Task;
}
