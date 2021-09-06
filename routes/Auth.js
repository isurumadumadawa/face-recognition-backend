const express = require("express");
const { body } = require("express-validator");
const mongoose = require("mongoose");

const validator = require("../middleware/Validater");
const Auth = require("../controlers/Auth");
const { userSchema } = require("../modules/User");

const { localStorage } = require("../adapters/localStorage");

const User = mongoose.model("User", userSchema);

const router = express.Router();

router.post(
  "/register",
  localStorage.single("file"),
  [
    (body("userName").not().isEmpty(),
    body("password").isLength({ min: 6 }).not().isEmpty(),
    body("userEmail")
      .isEmail()
      .custom((value) => {
        return User.findOne({ userEmail: value }).then((user) => {
          if (user) {
            return Promise.reject("E-mail already in use");
          }
        });
      })),
  ],
  validator,
  Auth.userRegistration
);

router.post(
  "/pasword-login",
  [
    body("password").isLength({ min: 6 }).not().isEmpty(),
    body("userEmail").isEmail(),
  ],
  validator,
  Auth.userLogin
);

router.post(
  "/face-login",
  localStorage.single("file"),
  [
  body("faceId").not().isEmpty(),
 ],
  validator,
  Auth.faceLogin
);

router.post(
  "/change-password",
  [
 body("userEmail")
      .isEmail()
 ],
  validator,
  Auth.changePassword
);

router.get(
  "/new-password/:id",
  Auth.newPassword
);

router.post(
  "/reset-password/:id",
  Auth.resetPassword
);

module.exports = router;
