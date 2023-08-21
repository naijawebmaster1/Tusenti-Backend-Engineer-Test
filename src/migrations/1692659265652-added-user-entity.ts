import { MigrationInterface, QueryRunner } from "typeorm";

export class addedUserEntity1692659265652 implements MigrationInterface {
    name = 'addedUserEntity1692659265652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying NOT NULL, "amount" integer NOT NULL, "transaction_type" "public"."transaction_transaction_type_enum" NOT NULL, "userId" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "photo" character varying NOT NULL DEFAULT 'default.png', "verified" boolean NOT NULL DEFAULT false, "verificationCode" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "email_index" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "verificationCode_index" ON "users" ("verificationCode") `);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`INSERT INTO "users" ("id", "created_at", "updated_at", "name", "email", "password", "role", "photo", "verified", "verificationCode") VALUES ('58df14d1-8012-484c-a408-2b66c05b8891', '2023-06-03T21:13:59.431Z', '2023-06-03T21:13:59.950Z', 'Test User', 'clement@mail.com', '$2a$12$UeFpKyfxLc/wHnZY/e/ekuhbunB8vL8Io2O6P9rT8Ycxg1fuVGe7W', 'user', 'default.png', true, 'e31501808f5afe3a6942816c9dc53ce4df3340ed9a1517d55a87295d9a35c9ea')`);
        await queryRunner.query(`INSERT INTO "transaction" ("id", "created_at", "updated_at", "description", "amount", "transaction_type", "userId") VALUES ('c9f0c187-8fbf-4497-be5c-00952c84010e', '2023-06-03T20:30:36.094Z', '2023-06-03T20:30:36.094Z', 'clement description', 50000, 'credit', '58df14d1-8012-484c-a408-2b66c05b8891') `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
        await queryRunner.query(`DROP INDEX "public"."verificationCode_index"`);
        await queryRunner.query(`DROP INDEX "public"."email_index"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
    }

}
