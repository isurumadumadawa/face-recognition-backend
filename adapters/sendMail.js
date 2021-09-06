const nodemailer = require("nodemailer");

exports.sendMail = (email, password, userEmail, subject, text) => {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: password,
      },
    });

    var mailOptions = {
      from: email,
      to: userEmail,
      subject: subject,
      text: text,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
};
