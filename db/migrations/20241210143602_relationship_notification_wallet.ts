import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("notification", (table) => {
    table
      .uuid("wallet_id")
      .references("id")
      .inTable("wallets")
      .nullable()
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {}
