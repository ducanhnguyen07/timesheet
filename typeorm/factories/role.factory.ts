import { uuid } from "uuidv4";
import { Role } from "../../src/role/entities/role.entity";
import { setSeederFactory } from "typeorm-extension";
import { faker } from "@faker-js/faker";

export const RoleFactory = setSeederFactory(Role, async () => {
  const role = new Role();

  role.id = uuid();
  role.name = faker.person.jobTitle();
  role.roleEnum = 0;

  return role;
});
  