const jwt = require("jsonwebtoken");
const environmentVariable = require("../adapters/environmentVariables");

exports.genarateToken = (userId, userEmail) => {
  return jwt.sign({ userEmail, _id: userId }, environmentVariable.private_key);
};

exports.decodeToken = (token) => {
  return jwt.verify(token, environmentVariable.private_key);
};
