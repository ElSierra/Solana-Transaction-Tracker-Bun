import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    
    return knex.schema.createTable("balance", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()")).notNullable();
        table
          .uuid("user_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table.float("total_balance").defaultTo(0).notNullable();
        table.float('total_balance_usd').defaultTo(0).notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      });

}


export async function down(knex: Knex): Promise<void> {
}

