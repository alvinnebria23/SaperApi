module.exports = (sequelize, DataTypes) => {
  const VerificationLink = sequelize.define("verificationLink", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  return VerificationLink;
};
