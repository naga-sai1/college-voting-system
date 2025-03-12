const express = require("express");
const app = express();
const dotenv = require("dotenv");
const sequelizeDatabase = require("./misc/db");
const bodyParser = require("body-parser");
const cors = require("cors");


dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const statesRoute = require("./routes/states.route");
const votersRoute = require("./routes/voters.route");
const partiesRoute = require("./routes/parties.route");
const pollsRoute = require("./routes/polls.route")

const port = process.env.PORT || 5002;
const corsOptions = {
  origin: "*",
  credentials: true,
};



app.use(cors(corsOptions));

app.use(statesRoute);
app.use(votersRoute);
app.use(partiesRoute);
app.use(pollsRoute);


app.get("/", (req, res) => {
  res.send("Hello this is online voting system API!");
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



