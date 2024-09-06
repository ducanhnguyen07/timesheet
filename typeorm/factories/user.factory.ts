import { faker } from "@faker-js/faker";
import { genSaltSync, hashSync } from "bcryptjs";
import { User } from "../../src/user/entities/user.entity";
import { setSeederFactory } from "typeorm-extension";
import { uuid } from "uuidv4";
import { BranchConstant } from "../../src/common/constant/branch.constant";

export const UserFactory = setSeederFactory(User, async () => {
  const user = new User();

  user.id = uuid();
  user.name = faker.person.fullName();
  user.email = faker.internet.email();
  const salt = genSaltSync(10);
  user.password = hashSync(faker.internet.password(), salt);
  user.address = faker.location.streetAddress();
  user.gender = 'male';
  user.branch = faker.helpers.objectValue(BranchConstant);
  user.avatar = faker.image.avatar();
  user.stWork = '08:30:00';
  user.fiWork = '17:30:00';
  user.checkIn = '08:30:00';
  user.checkOut = '17:30:00';
  user.checkInDate = new Date();
  user.refreshToken = '';
  user.checkInToken = '0000';
  user.isCheckedIn = false;
  user.secretKey = '';
  user.isActive = faker.datatype.boolean();

  return user;
});