const bcrypt = require("bcrypt");

exports.passwordIncript = async (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      resolve(hashPassword);
    } catch (err) {
      console.log(err);
      reject(false);
    }
  });
};

exports.passwordDecript = async (passwordgot, passwordSaved) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isEqual = await bcrypt.compare(passwordgot, passwordSaved);
      resolve(isEqual);
    } catch (err) {
      console.log(err);
      reject(false);
    }
  });
};
