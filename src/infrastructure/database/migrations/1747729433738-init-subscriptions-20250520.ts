import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSubscriptions202505201747729433738
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "subscriptions_frequency_enum" AS ENUM ('hourly', 'daily');
    `);

    await queryRunner.query(`
      CREATE TABLE "subscriptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "city" character varying NOT NULL,
        "email" character varying NOT NULL,
        "subscription_token" character varying NOT NULL,
        "frequency" "subscriptions_frequency_enum" NOT NULL,
        "subscribed" boolean NOT NULL DEFAULT false,
        "unsubscribed_at" TIMESTAMP,
        CONSTRAINT "PK_subscriptions_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_subscription_token" UNIQUE ("subscription_token")
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_subscription_token" ON "subscriptions" ("subscription_token");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_frequency" ON "subscriptions" ("frequency");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_frequency"`);
    await queryRunner.query(`DROP INDEX "IDX_subscription_token"`);
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TYPE "subscriptions_frequency_enum"`);
  }
}
