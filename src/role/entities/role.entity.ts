import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { BaseEntity } from "../../common/entity/base.entity";
import { Permission } from "../../permission/entities/permission.entity";
import { User } from "../../user/entities/user.entity";
import { RoleConstant } from "../../common/constant/role.constant";

@Entity('role')
export class Role extends BaseEntity {
  @Column({ name: 'name' })
  name: string

  @Column({
    name: 'roleEnum',
    type: "enum",
    enum: RoleConstant,
    default: RoleConstant.USER
  })
  roleEnum: number

  @ManyToMany(() => Permission, permission => permission.roles)
  permissions: Permission[]

  @ManyToMany(() => User, user => user.roles)
  @JoinTable({
    name: "role_user",
    joinColumn: {
      name: "roleId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "userId",
      referencedColumnName: "id"
    }
  })
  users: User[]
}
