import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1720149114423 implements MigrationInterface {
    name = 'CreateTable1720149114423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."project_status_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "description" character varying NOT NULL, "budget" integer NOT NULL, "status" "public"."project_status_enum" NOT NULL DEFAULT '0', CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."timesheet_status_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "timesheet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "status" "public"."timesheet_status_enum" NOT NULL DEFAULT '0', "note" character varying NOT NULL, "workingTime" integer NOT NULL, "taskId" uuid, CONSTRAINT "PK_53c30fa094ae81f166955fb1036" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "description" character varying NOT NULL, "requirement" TIMESTAMP NOT NULL, "status" "public"."task_status_enum" NOT NULL DEFAULT '0', "projectId" uuid, "userId" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."request_type_enum" AS ENUM('0', '1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TABLE "request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "note" character varying NOT NULL, "type" "public"."request_type_enum" NOT NULL DEFAULT '0', "time" integer NOT NULL, "userId" uuid, CONSTRAINT "PK_167d324701e6867f189aed52e18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_branch_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "address" character varying NOT NULL, "gender" character varying NOT NULL, "branch" "public"."user_branch_enum" NOT NULL DEFAULT '0', "avatar" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."role_roleenum_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "roleEnum" "public"."role_roleenum_enum" NOT NULL DEFAULT '0', CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission_role" ("permissionId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_51d32d42a2ef7d1bc085da1510d" PRIMARY KEY ("permissionId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1886001bdced4ea977b9f1b97c" ON "permission_role" ("permissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1dd59c61aec4fc206bc43a3115" ON "permission_role" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "role_user" ("roleId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_bd1bd925dd24214f451e44259ed" PRIMARY KEY ("roleId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_89e55dae19555d0d5fe8602b28" ON "role_user" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2a23ceb75c7511d0523c4aaf49" ON "role_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "timesheet" ADD CONSTRAINT "FK_a147ecd5c870c35058f8437b425" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_38554ade327a061ba620eee948b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_role" ADD CONSTRAINT "FK_1886001bdced4ea977b9f1b97c1" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "permission_role" ADD CONSTRAINT "FK_1dd59c61aec4fc206bc43a31153" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_user" ADD CONSTRAINT "FK_89e55dae19555d0d5fe8602b281" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_user" ADD CONSTRAINT "FK_2a23ceb75c7511d0523c4aaf492" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_user" DROP CONSTRAINT "FK_2a23ceb75c7511d0523c4aaf492"`);
        await queryRunner.query(`ALTER TABLE "role_user" DROP CONSTRAINT "FK_89e55dae19555d0d5fe8602b281"`);
        await queryRunner.query(`ALTER TABLE "permission_role" DROP CONSTRAINT "FK_1dd59c61aec4fc206bc43a31153"`);
        await queryRunner.query(`ALTER TABLE "permission_role" DROP CONSTRAINT "FK_1886001bdced4ea977b9f1b97c1"`);
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_38554ade327a061ba620eee948b"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe"`);
        await queryRunner.query(`ALTER TABLE "timesheet" DROP CONSTRAINT "FK_a147ecd5c870c35058f8437b425"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a23ceb75c7511d0523c4aaf49"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_89e55dae19555d0d5fe8602b28"`);
        await queryRunner.query(`DROP TABLE "role_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1dd59c61aec4fc206bc43a3115"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1886001bdced4ea977b9f1b97c"`);
        await queryRunner.query(`DROP TABLE "permission_role"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TYPE "public"."role_roleenum_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_branch_enum"`);
        await queryRunner.query(`DROP TABLE "request"`);
        await queryRunner.query(`DROP TYPE "public"."request_type_enum"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
        await queryRunner.query(`DROP TABLE "timesheet"`);
        await queryRunner.query(`DROP TYPE "public"."timesheet_status_enum"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TYPE "public"."project_status_enum"`);
        await queryRunner.query(`DROP TABLE "permission"`);
    }

}
