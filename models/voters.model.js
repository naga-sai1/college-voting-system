module.exports = (sequelize, Sequelize) => {
  const Voters = sequelize.define(
    "voters",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      party_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      voted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      aadhar: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone_no: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: true
      }
    },
    {
      tableName: "voters",
      timestamps: false,
      engine: "InnoDB",
    }
  );
  return Voters;
};
