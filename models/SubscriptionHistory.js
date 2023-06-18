const SubscriptionHistory = (sequelize, DataTypes) => {
  const SubscriptionHistory = sequelize.define("subscriptionHistory", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return SubscriptionHistory;
};

export { SubscriptionHistory };
