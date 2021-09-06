const mongoose = require("mongoose");
path = require("path");

const { userSchema } = require("../modules/User");

const User = mongoose.model("User", userSchema);

const mailAdapter = require("../adapters/sendMail");
const tokenAdapter = require("../adapters/token");
const incriptAdapter = require("../adapters/incript");
const environmentVariable = require("../adapters/environmentVariables");
const { uploadImageToStorage } = require("../adapters/uploadImage");
const { detectfaceWithBuffer,detectfaceWithUrl,recognizeface } = require("../adapters/detectFace");


exports.userRegistration = async (req, res) => {
  try {
    const { userEmail, userName, password } = req.body;

    let file = req.file;

    if (file) {

  const detectionAndImageResult= await Promise.all([uploadImageToStorage(file, userEmail),detectfaceWithBuffer(file.buffer)])

const [imageUrl,detection] = detectionAndImageResult


      if(!detection || !imageUrl){
        return res.status(500).json({
        isregister: false,
        token: null,
        error: "Internal server error",
      });
      }

      if (detection.length > 1)
        return res.status(423).json({
          isregister: false,
          token: null,
          error:
            "ditected morethan one face. Please Upload image of the you'r face",
        });

      if (detection.length == 0)
        return res.status(424).json({
          isregister: false,
          token: null,
          error: "can't ditect face. Please Upload image of the you'r face",
        });

      const hashPassword = await incriptAdapter.passwordIncript(password);

      const user = new User({
        userName: userName,
        userEmail: userEmail,
        password: hashPassword,
        profileurl: imageUrl,
      });

      const result = await user.save();

      const token = tokenAdapter.genarateToken(result._id, result.userEmail);
      if (token)
        return res.status(200).json({
          isregister: true,
          token: token,
          error: null,
        });

      res.status(500).json({
        isregister: false,
        token: null,
        error: "Internal server error",
      });
    } else {
      return res.status(424).json({
        isregister: false,
        token: null,
        error: "Please Upload image of the you'r face",
      });
    }
  } catch (err) {
    res.status(500).json({
      isregister: false,
      token: null,
      error: "Internal server error",
    });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    const result = await User.findOne({ userEmail: userEmail });

    if (!result) {
      res.status(401).json({
        isValid: false,
        error: "No account found. Create account using this email",
        userName: null,
        userEmail: null,
        faceId:null
      });
      return;
    }

    const isEqual = await incriptAdapter.passwordDecript(
      password,
      result.password
    );

    if (isEqual) {


  const detection= await detectfaceWithUrl(result.profileurl)

      if(!detection){
        return res.status(500).json({
        isValid: false,
        error: "Internal server error",
        userName: null,
        userEmail: null,
        faceId:null
      });
      }

      if (detection.length > 1)
        return res.status(423).json({
        isValid: false,
        error:
            "ditected morethan one face. Please Upload image of the you'r face",
        userName: null,
        userEmail: null,
        faceId:null
        });

      if (detection.length == 0)
        return res.status(424).json({
         isValid: false,
         error: "can't ditect face. Please Upload image of the you'r face",
         userName: null,
         userEmail: null,
         faceId:null
        });



      return res.status(200).json({
        isValid: true,
        error: null,
        userName: result.userName,
        userEmail: result.userEmail,
        faceId:detection[0].faceId
      });
    } else {
      return res.status(401).json({
        isValid: false,
        error: "Invalid password",
        userName: null,
        userEmail: null,
        faceId:null
      });
    }
  } catch (err) {
    res.status(500).json({
      isValid: false,
      error: "Internal server error",
      userName: null,
      userEmail: null,
      faceId:null
    });
  }
};

exports.faceLogin = async (req, res) => {
  try {
    const { faceId,userEmail } = req.body;

    let file = req.file;

    const detection = await detectfaceWithBuffer(file.buffer)

     if(!detection){
        return res.status(500).json({
        isLogin: false,
        token: null,
        error: "Internal server error",
      });
      }

      if (detection.length > 1)
        return res.status(423).json({
          isLogin: false,
          token: null,
          error:
            "ditected morethan one face. Please Upload image of the you'r face",
        });

      if (detection.length == 0)
        return res.status(424).json({
          isLogin: false,
          token: null,
          error: "can't ditect face. Please Upload image of the you'r face",
        });
   

    const recognition = await recognizeface(faceId, detection[0].faceId);

    
    if (!recognition)  return res.status(500).json({
        isLogin: false,
        token: null,
        error: "Internal server error",
      });

    if (recognition.length > 1)
      return res.status(423).json({
        isregister: false,
        token: null,
        error:
          "recognize morethan one face. Please Upload image of the you'r face",
      });

    if (recognition.length == 0){
       const email = environmentVariable.email;
      const password = environmentVariable.password;

      const mailsStatus = await mailAdapter.sendMail(
        email,
        password,
        userEmail,
        "Unautherized Login",
        "Unautherized person try to login your account. " 
      );

      if (!mailsStatus) {
        return res.status(500).json({
          isLoged: false,
          token: null,
          error: "Unautherized Login-Internal server error",
        });
      } else {
        return res.status(401).json({
          isLoged: false,
          token: null,
          error: "Unautherized Login",
        });
      }
  }

    
   const confidence = recognition[0].confidence
  

   if(confidence>=0.75){

    const result = await User.findOne({ userEmail: userEmail });

 const token = tokenAdapter.genarateToken(result._id, result.userEmail);
    if (token) {
      return res.status(200).json({
        isLoged: true,
        token: token,
        error: null,
      });
    } else {
    return res.status(500).json({
        isLoged: false,
        token: null,
        error: "Internal server error",
      });
    }
   }
else{
   return res.status(422).json({
        isLoged: false,
        token: null,
        error: "recognize you'r face with minimum confidant. please try again..",
      });

    }
   
  } catch (err) {
   
    res.status(500).json({
      isSend: false,
      token: null,
      error: "Internal server error",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userEmail } = req.body;

    const email = environmentVariable.email;
    const password = environmentVariable.password;

    const result = await User.findOne({ userEmail: userEmail });

    if (!result) {
      res.status(401).json({
        isSend: false,
        error: "No account found. Create account using this email",
      });
      return;
    }

    mailAdapter
      .sendMail(
        email,
        password,
        userEmail,
        "Change you'r password",
        "use this link to change password - http://" +
          req.headers.host +
          "/api/auth/new-password/" +
          result._id
      )
      .then(() => {
        return res.status(200).json({
          isSend: true,
          error: null,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          isSend: false,
          error: "Internal server error",
        });
      });
  } catch (err) {
    res.status(500).json({
      isSend: false,
      error: "Internal server error",
    });
  }
};

exports.newPassword = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(500).send("something wrong !. Try again");

    res.render("index", { route: "/api/auth/reset-password/" + req.params.id });
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

exports.resetPassword = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(500).send("something wrong !. Try again");

   
     const hashPassword = await incriptAdapter.passwordIncript(req.body.password);

    User.findByIdAndUpdate(
      { _id: req.params.id },
      { password: hashPassword },
      function (err, result) {
        if (err) {
          res.status(404).send("Not Found!");
        } else {
          res.status(200).send("changed password. Use new password to login");
        }
      }
    );
  } catch (err) {
    
    res.status(500).send("Internal server error");
  }
};
