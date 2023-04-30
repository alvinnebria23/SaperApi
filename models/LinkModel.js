const Link = (sequelize, DataTypes) => {
  const Link = sequelize.define("link", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    originalUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subIds: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Link;
};

export { Link };
