import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("notification", (table) => {
    table.enum("type", ["sent", "receive"]).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
