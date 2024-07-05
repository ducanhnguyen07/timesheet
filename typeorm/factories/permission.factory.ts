import { uuid } from "uuidv4";
import { Permission } from "../../src/permission/entities/permission.entity";
import { setSeederFactory } from "typeorm-extension";
import { faker } from "@faker-js/faker";

export const PermissionFactory = setSeederFactory(Permission, async () => {
  const permission = new Permission();

  permission.id = uuid();
  permission.name = faker.word.words(2);

  return permission;
});