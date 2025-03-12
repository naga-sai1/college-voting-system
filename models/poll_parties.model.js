module.exports = (sequelize, Sequelize) => {
  const PollParties = sequelize.define(
    "poll_parties",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      poll_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'polls',
          key: 'id'
        }
      },
      party_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'parties',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.BOOLEAN,
        default: true,
      }
    },
    {
      tableName: "poll_parties",
      timestamps: false,
      engine: "InnoDB",
      indexes: [
        {
          // unique: true,
          fields: ['poll_id', 'party_id', 'state_id']
        }
      ]
    }
  );
  return PollParties;
}; 