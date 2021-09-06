const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("config");
const app = express();

// if(!config.get("jwtPrivateKey")){
//   console.log("FATAL ERROR: jwtPrivateKey not defined ")
//   process.exit(1);
// }

// if(!config.get("email")){
//   console.log("FATAL ERROR: email not defined ")
//   process.exit(1);
// }
// if(!config.get("password")){
//   console.log("FATAL ERROR: password not defined ")
//   process.exit(1);
// }

const environmentVariable = require("./adapters/environmentVariables");

const Auth = require("./routes/Auth");

app.set("view engine", "ejs");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/html"));
app.use(express.static(__dirname + "/uploads/profileImages"));

app.use("/api/auth", Auth);

mongoose.connect(
  environmentVariable.databaseConnectionString,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err) => {
    if (err) return console.log(err);

    console.log("database connection stablish...");
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server running in port " + port);
});
