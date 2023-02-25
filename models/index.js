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
db.verificationLinks = require("./VerificationLinkModel.js")(
  sequelize,
  DataTypes
);

//Relations
db.users.hasOne(db.shopeeApis, {
  sourceKey: "id",
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
db.shopeeApis.belongsTo(db.users, {
  sourceKey: "id",
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
db.users.hasOne(db.verificationLinks, {
  sourceKey: "id",
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
db.verificationLinks.belongsTo(db.users, {
  sourceKey: "id",
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

db.sequelize.sync({ force: false }).then(() => {
  console.log("Re-sync donce!");
});

module.exports = db;
