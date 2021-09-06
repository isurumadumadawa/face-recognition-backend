var admin = require("firebase-admin");

const serviceAccount = require("../face-login-app-firebase-adminsdk-l58wh-180703cfef.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "face-login-app.appspot.com",
});

const bucket = admin.storage().bucket();

exports.uploadImageToStorage = (file, fileName) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(false);
    }
    let newFileName =
      Date.now() + JSON.parse(JSON.stringify(file.originalname).trim());

    let fileUpload = bucket.file(newFileName);
    return fileUpload
      .getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      })
      .then((signedUrls) => {
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        blobStream.on("error", (error) => {
          reject(false);
        });

        blobStream.on("finish", () => {
          resolve(signedUrls[0]);
        });

        blobStream.end(file.buffer);
      })
      .catch((err) => {
        reject(false);
       
      });
  });
};
