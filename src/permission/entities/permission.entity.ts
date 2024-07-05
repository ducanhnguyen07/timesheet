import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { BaseEntity } from "../../common/entity/base.entity";
import { Role } from "../../role/entities/role.entity";

@Entity('permission')
export class Permission extends BaseEntity {
  @Column({ name: 'name' })
  name: string

  @ManyToMany(() => Role, role => role.permissions)
  @JoinTable({
    name: "permisson_role",
    joinColumn: {
      name: "permissionId",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "roleId",
      referencedColumnName: "id"
    }
  })
  roles: Role[]
}
