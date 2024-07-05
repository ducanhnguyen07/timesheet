import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnRoleEnumToRoleTable1719474039261 implements MigrationInterface {
    name = 'AddColumnRoleEnumToRoleTable1719474039261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."role_roleenum_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "role" ADD "roleEnum" "public"."role_roleenum_enum" NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "roleEnum"`);
        await queryRunner.query(`DROP TYPE "public"."role_roleenum_enum"`);
    }

}
