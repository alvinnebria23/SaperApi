const ShopeeApi = (sequelize, DataTypes) => {
  const ShopeeApi = sequelize.define("shopeeApi", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    appId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secretKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return ShopeeApi;
};

export { ShopeeApi };