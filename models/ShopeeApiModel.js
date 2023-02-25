module.exports = (sequelize, DataTypes) => {
  const ShopeeApi = sequelize.define("shopeeApi", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
  });
};
