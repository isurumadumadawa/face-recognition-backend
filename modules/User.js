const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    userEmail: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    profileurl: {
      type: String,
      required: false,
      default:"https://johnskillerprotein.com/wp-content/uploads/2018/07/User-Icon-e1530808489436.png"
    }
  });

  module.exports.userSchema = userSchema;