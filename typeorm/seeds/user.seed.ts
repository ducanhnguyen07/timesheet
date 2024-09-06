import { genSaltSync, hashSync } from "bcryptjs";
import { User } from "../../src/user/entities/user.entity";
import { DataSource } from "typeorm";
import { SeederFactoryManager } from "typeorm-extension";
import { Role } from "../../src/role/entities/role.entity";
import { RoleConstant } from "../../src/common/constant/role.constant";

export default class UserSeeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager) {
    const userRepository = dataSource.getRepository(User);
    const userFactory = factoryManager.get(User);

    const roleRepository = dataSource.getRepository(Role);

    const salt = genSaltSync(10);
    const admin = {
      name: 'admin-seed',
      password : hashSync('123', salt),
      email: "admin.seed@gmail.com",
      address: "123 Admin St.",
      gender: "male",
      branch: 1,  // Assuming branch 1 corresponds to a valid branch in BranchConstant
      avatar: "",
      stWork: "08:30:00",
      fiWork: "17:30:00",
      checkIn: "08:30:00",
      checkOut: "17:30:00",
      checkInDate: new Date(),
      refreshToken: "",
      checkInToken: "0000",
      isCheckedIn: false,
      secretKey: "",
      isActive: false,
    };

    const roleAdmin = await roleRepository.findOne({
      where: {
        roleEnum: RoleConstant.ADMIN,
      },
    });

    admin['roles'] = [roleAdmin];

    await userFactory.save(admin);
  }
}