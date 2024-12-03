import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").primary();
      table.string("email").unique().notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("wallets", (table) => {
      table.uuid("id").primary();
      table
        .uuid("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.float("balance").defaultTo(0).notNullable();
      table.string("address").notNullable();
      table.integer("emojiId").notNullable();
      table.enum("currency", ["ETH", "SOL", "USDT"]).notNullable();
      table.float("usd_balance").defaultTo(0).notNullable();

      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {}
