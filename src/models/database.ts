import { Sequelize } from "sequelize";

const _host = process.env.DB_HOST_NAME || "127.0.0.1";
const _name = process.env.DB_NAME || "vmeeting";
const _username = process.env.DB_USER || "root";
const _password = process.env.PASSWORD || "hieu1995";

export const sequelize = new Sequelize(_name, _username, _password, {
  dialect: "mysql",
});

module.exports = {
  sequelize,
};
