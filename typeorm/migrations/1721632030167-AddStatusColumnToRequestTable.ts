import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusColumnToRequestTable1721632030167 implements MigrationInterface {
    name = 'AddStatusColumnToRequestTable1721632030167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."request_status_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "request" ADD "status" "public"."request_status_enum" NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."request_status_enum"`);
    }

}
