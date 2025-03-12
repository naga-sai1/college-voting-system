const sequilize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const partiesModel = require("../models/parties.model");
const statesModel = require("../models/states.model");
const usersModel = require("../models/users.model");
const votersModel = require("../models/voters.model");
const pollsModel = require("../models/polls.model");
const pollPartiesModel = require("../models/poll_parties.model");

const sequelizeDatabase = new sequilize.Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

const Parties = partiesModel(sequelizeDatabase, sequilize.DataTypes);
const States = statesModel(sequelizeDatabase, sequilize.DataTypes);
const Users = usersModel(sequelizeDatabase, sequilize.DataTypes);
const Voters = votersModel(sequelizeDatabase, sequilize.DataTypes);
const Polls = pollsModel(sequelizeDatabase, sequilize.DataTypes);
const PollParties = pollPartiesModel(sequelizeDatabase, sequilize.DataTypes);

const Models = {
  Parties,
  States,
  Users,
  Voters,
  Polls,
  PollParties,
};

// Define associations
Parties.belongsTo(States, {
    foreignKey: 'state_id',
    as: 'state'
});

States.hasMany(Parties, {
    foreignKey: 'state_id',
    as: 'parties'
});

Parties.hasMany(Voters, {
    foreignKey: 'party_id',
    as: 'voters'
});

Voters.belongsTo(Parties, {
    foreignKey: 'party_id',
    as: 'party'
});

// Poll associations
Polls.belongsToMany(Parties, {
  through: PollParties,
  foreignKey: 'poll_id',
  as: 'parties'
});

Parties.belongsToMany(Polls, {
  through: PollParties,
  foreignKey: 'party_id',
  as: 'polls'
});

Polls.belongsTo(States, {
  foreignKey: 'state_id',
  as: 'state'
});

PollParties.belongsTo(Polls, {
  foreignKey: 'poll_id',
  as: 'poll'
});

PollParties.belongsTo(Parties, {
  foreignKey: 'party_id',
  as: 'party'
});

Polls.hasMany(PollParties, {
  foreignKey: 'poll_id',
  as: 'poll_parties'
});

const connection = {};

const connectToDatabase = async () => {
  try {
    if (connection.isConnected) {
      console.log("=> Using existing connection.");
      return { ...Models, sequelizeDatabase };
    }
    await sequelizeDatabase.sync();
    await sequelizeDatabase.authenticate();
    connection.isConnected = true;
    console.log("=> New connection to the database.");
    return { ...Models, sequelizeDatabase };
  } catch (error) {
    console.log("=> Error connecting to the database.", error);
    throw error;
  }
};

module.exports = connectToDatabase;
