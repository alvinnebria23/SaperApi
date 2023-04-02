import { DB, USER, PASSWORD, HOST, DIALECT as _dialect, POOL as _pool, PORT as _port} from "../config/dbConfig.js";
import { Sequelize, DataTypes } from "sequelize";
import { User } from "./UserModel.js";
import { ShopeeApi } from "./ShopeeApiModel.js";
import { USER_TABLE_VALUES } from "../constants/DbConstants.js";
const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  dialect: _dialect,
  operatorsAliases: false,
  pool: {
    max: _pool.max,
    min: _pool.min,
    acquire: _pool.acquire,
    idle: _pool.idle,
  },
  port: _port,
  logging: true,
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

db.users = User(sequelize, DataTypes);
db.shopeeApis = ShopeeApi(sequelize, DataTypes);

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

(async () => {
  await sequelize.sync();
  await db.users.bulkCreate(USER_TABLE_VALUES, {
    updateOnDuplicate: ['id'],
  });
})();

export default db;
