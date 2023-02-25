const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("authenticated");
  })
  .catch((err) => console.log("Error " + err));

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./UserModel.js")(sequelize, DataTypes);
db.shopeeApis = require("./ShopeeApiModel.js")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("Re-sync donce!");
});

module.exports = db;
