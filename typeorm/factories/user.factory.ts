import { faker } from "@faker-js/faker";
import { genSaltSync, hashSync } from "bcryptjs";
import { User } from "../../src/user/entities/user.entity";
import { setSeederFactory } from "typeorm-extension";
import { uuid } from "uuidv4";

export const UserFactory = setSeederFactory(User, async () => {
  const user = new User();

  user.id = uuid();
  user.name = faker.person.fullName();
  user.email = faker.internet.email();
  const salt = genSaltSync(10);
  user.password = hashSync(faker.internet.password(), salt);
  user.address = faker.location.streetAddress();
  user.gender = 'male';

  return user;
})