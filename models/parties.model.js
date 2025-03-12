module.exports = (sequelize, Sequelize) => {
  const Parties = sequelize.define(
    "parties",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      abbreviation: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "parties",
      timestamps: false,
      engine: "InnoDB",
    }
  );
  return Parties;
};
