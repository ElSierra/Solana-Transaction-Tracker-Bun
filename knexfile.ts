import type { Knex } from "knex";
import * as dotenv from "dotenv";
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg", // or 'mysql', 'sqlite3', etc.
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname +"/db/migrations",
    },
    seeds: {
      directory: __dirname +"/db/seeds",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL, // Ensure this is set in your environment
    migrations: {
      directory: __dirname +"/db/migrations",
    },
    seeds: {
      directory: __dirname +"/db/seeds/production",
    },
    pool: {
      afterCreate: function (conn: any, done: any) {
        // in this example we use pg driver's connection API
        conn.query('SET timezone="UTC";', function (err: Error) {
          if (err) {
            // first query failed,
            // return error and don't try to make next query
            done(err, conn);
          } else {
            // do the second query...
            conn.query("SELECT set_limit(0.01);", function (err: Error) {
              // if err is not falsy,
              //  connection is discarded from pool
              // if connection aquire was triggered by a
              // query the error is passed to query promise
              done(err, conn);
            });
          }
        });
      },
    },
  },
};

export default config;
