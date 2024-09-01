import { MigrationInterface, QueryRunner } from "typeorm";

export class DbInit1724948759722 implements MigrationInterface {
    name = 'DbInit1724948759722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "health_logs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" datetime NOT NULL, "mood" text NOT NULL, "anxietyLevel" text NOT NULL, "sleepHours" integer NOT NULL, "sleepQuality" text NOT NULL, "sleepDisturbances" varchar, "physicalActivity" varchar NOT NULL, "socialInteractionsFrequency" text NOT NULL, "stressLevel" text NOT NULL, "anxietyDepressionSymptoms" varchar NOT NULL, "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_health_logs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" datetime NOT NULL, "mood" text NOT NULL, "anxietyLevel" text NOT NULL, "sleepHours" integer NOT NULL, "sleepQuality" text NOT NULL, "sleepDisturbances" varchar, "physicalActivity" varchar NOT NULL, "socialInteractionsFrequency" text NOT NULL, "stressLevel" text NOT NULL, "anxietyDepressionSymptoms" varchar NOT NULL, "userId" integer, CONSTRAINT "FK_5f81e87d5ee65f5f5a39cf28dfa" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_health_logs"("id", "date", "mood", "anxietyLevel", "sleepHours", "sleepQuality", "sleepDisturbances", "physicalActivity", "socialInteractionsFrequency", "stressLevel", "anxietyDepressionSymptoms", "userId") SELECT "id", "date", "mood", "anxietyLevel", "sleepHours", "sleepQuality", "sleepDisturbances", "physicalActivity", "socialInteractionsFrequency", "stressLevel", "anxietyDepressionSymptoms", "userId" FROM "health_logs"`);
        await queryRunner.query(`DROP TABLE "health_logs"`);
        await queryRunner.query(`ALTER TABLE "temporary_health_logs" RENAME TO "health_logs"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "health_logs" RENAME TO "temporary_health_logs"`);
        await queryRunner.query(`CREATE TABLE "health_logs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" datetime NOT NULL, "mood" text NOT NULL, "anxietyLevel" text NOT NULL, "sleepHours" integer NOT NULL, "sleepQuality" text NOT NULL, "sleepDisturbances" varchar, "physicalActivity" varchar NOT NULL, "socialInteractionsFrequency" text NOT NULL, "stressLevel" text NOT NULL, "anxietyDepressionSymptoms" varchar NOT NULL, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "health_logs"("id", "date", "mood", "anxietyLevel", "sleepHours", "sleepQuality", "sleepDisturbances", "physicalActivity", "socialInteractionsFrequency", "stressLevel", "anxietyDepressionSymptoms", "userId") SELECT "id", "date", "mood", "anxietyLevel", "sleepHours", "sleepQuality", "sleepDisturbances", "physicalActivity", "socialInteractionsFrequency", "stressLevel", "anxietyDepressionSymptoms", "userId" FROM "temporary_health_logs"`);
        await queryRunner.query(`DROP TABLE "temporary_health_logs"`);
        await queryRunner.query(`DROP TABLE "health_logs"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
