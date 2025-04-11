import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1744061360663 implements MigrationInterface {
    name = 'CreateUserTable1744061360663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "leaderId" integer, "projectId" integer, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "promotionId" uuid, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "promotion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "teacherId" integer, CONSTRAINT "PK_fab3630e0789a2002f1cadb7d38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deliverable" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, "deadline" TIMESTAMP NOT NULL, "allowLateSubmission" boolean NOT NULL DEFAULT false, "penaltyPerHourLate" double precision NOT NULL DEFAULT '0', CONSTRAINT "PK_fbed21e1ad3464d9fb7729ad51d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "submission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "submittedAt" TIMESTAMP NOT NULL DEFAULT now(), "fileUrl" character varying, "gitRepoUrl" character varying, "isLate" boolean NOT NULL DEFAULT false, "deliverableId" uuid, "groupId" uuid, "studentId" integer, CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying, "googleId" character varying, "role" character varying NOT NULL DEFAULT 'regular', "isTfaEnabled" boolean NOT NULL DEFAULT false, "tfaSecret" character varying, "promotionId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "groupId" uuid, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "evaluation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "criteria" character varying NOT NULL, "weight" double precision NOT NULL, "score" double precision, "comment" character varying, "projectId" integer, "groupId" uuid, CONSTRAINT "PK_b72edd439b9db736f55b584fa54" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group_members_user" ("groupId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_7170c9a27e7b823d391d9e11f2e" PRIMARY KEY ("groupId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bfa303089d367a2e3c02b002b8" ON "group_members_user" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_427107c650638bcb2f1e167d2e" ON "group_members_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_27981cbbe3d6514418e9c67f963" FOREIGN KEY ("leaderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_eab1ac7e29cfe9e26fc99f6926c" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_1f45efef2dfb11bb8154decfeae" FOREIGN KEY ("promotionId") REFERENCES "promotion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "promotion" ADD CONSTRAINT "FK_6bbf961e3a429f6e1c2e4515558" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_58d0f809b3e5644e98c82329373" FOREIGN KEY ("deliverableId") REFERENCES "deliverable"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_9a7928e5935c4cd5f02edaaa139" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_a174d175dc504dce8df5c217014" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5e77fcc83edd57160f4eba83f06" FOREIGN KEY ("promotionId") REFERENCES "promotion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_7a8e0cac9d701fdb852b7c45541" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evaluation" ADD CONSTRAINT "FK_e398dbaa5aceac029791c7401d2" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evaluation" ADD CONSTRAINT "FK_26ec9268d28c8bf5bf2a41832c0" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_members_user" ADD CONSTRAINT "FK_bfa303089d367a2e3c02b002b8f" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "group_members_user" ADD CONSTRAINT "FK_427107c650638bcb2f1e167d2e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_members_user" DROP CONSTRAINT "FK_427107c650638bcb2f1e167d2e5"`);
        await queryRunner.query(`ALTER TABLE "group_members_user" DROP CONSTRAINT "FK_bfa303089d367a2e3c02b002b8f"`);
        await queryRunner.query(`ALTER TABLE "evaluation" DROP CONSTRAINT "FK_26ec9268d28c8bf5bf2a41832c0"`);
        await queryRunner.query(`ALTER TABLE "evaluation" DROP CONSTRAINT "FK_e398dbaa5aceac029791c7401d2"`);
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_7a8e0cac9d701fdb852b7c45541"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5e77fcc83edd57160f4eba83f06"`);
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_a174d175dc504dce8df5c217014"`);
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_9a7928e5935c4cd5f02edaaa139"`);
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_58d0f809b3e5644e98c82329373"`);
        await queryRunner.query(`ALTER TABLE "promotion" DROP CONSTRAINT "FK_6bbf961e3a429f6e1c2e4515558"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_1f45efef2dfb11bb8154decfeae"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_eab1ac7e29cfe9e26fc99f6926c"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_27981cbbe3d6514418e9c67f963"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_427107c650638bcb2f1e167d2e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bfa303089d367a2e3c02b002b8"`);
        await queryRunner.query(`DROP TABLE "group_members_user"`);
        await queryRunner.query(`DROP TABLE "evaluation"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "submission"`);
        await queryRunner.query(`DROP TABLE "deliverable"`);
        await queryRunner.query(`DROP TABLE "promotion"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "group"`);
    }

}
