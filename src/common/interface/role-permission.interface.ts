import { ResponseRoleDto } from "src/role/dto/response/response-role.dto";
import { ResponsePermissionDto } from "../../../src/permission/dto/response/response-permission.dto";

export interface IRolePermission {
  role: ResponseRoleDto,
  permissions: ResponsePermissionDto[],
}