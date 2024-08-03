import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumndateToRequestTable1721875036509 implements MigrationInterface {
    name = 'AddColumndateToRequestTable1721875036509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" ADD "requestDay" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" DROP COLUMN "requestDay"`);
    }

}
