import Knex from "knex";
import config from "../knexfile";

const environment = process.env.NODE_ENV || "development";
console.log(process.env.DATABASE_URL);
const knex = Knex(config[environment]);

export default knex;
