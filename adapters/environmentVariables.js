const config = require("config");

exports.email = config.get("email");
exports.password = config.get("password");
exports.private_key = config.get("jwtPrivateKey");
exports.databaseConnectionString =config.get("databaseConnectionString");
exports.azurePrivateKey = config.get("azurePrivateKey");
exports.azureEndPoint =config.get("azureEndPointword");
