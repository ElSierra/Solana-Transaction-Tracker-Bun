import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  knex.schema.alterTable("wallets", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"))
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
