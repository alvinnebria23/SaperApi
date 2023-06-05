import { genSaltSync, compareSync, hashSync } from 'bcrypt';

const User = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isValidEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    hooks: {
      beforeCreate: (user) => {
        const salt = genSaltSync(2);
        user.password = hashSync(user.password, salt);
      },
      beforeUpdate: async (user) => {
        if(user.changed('password')){
          const salt = genSaltSync(2);
          user.password = hashSync(user.password, salt);
        }
      }
    }
  });

  User.validPassword = function (password, hashedPassword) {
    return compareSync(password, hashedPassword);
  }

  return User;
};

export { User };
