const Face = require("@azure/cognitiveservices-face");
const msRest = require("@azure/ms-rest-js");

const environmentVariable = require("../adapters/environmentVariables");


const key = environmentVariable.azurePrivateKey;
const endpoint = environmentVariable.azureEndPoint;

// <credentials>
const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
const client = new Face.FaceClient(credentials, endpoint);
// </credentials>


exports.detectfaceWithBuffer = (imageBuffer) => {
  return new Promise(async (resolve, reject) => {
    try {
      
     let detected_faces = await client.face.detectWithStream(imageBuffer,
		{
			detectionModel: "detection_03",
			recognitionModel: "recognition_04"
		});


if(detected_faces){
 resolve(detected_faces);
}
else{
  reject(false)
}

      
    } catch (err) {
      console.log(err);
      reject(false);
    }
  });
};

exports.detectfaceWithUrl = (imageurl) => {
  return new Promise(async (resolve, reject) => {
    try {
      
     let detected_faces = await client.face.detectWithUrl(imageurl,
		{
			detectionModel: "detection_03",
			recognitionModel: "recognition_04"
		});

if(detected_faces){
 resolve(detected_faces);
}
else{
  reject(false)
}

      
    } catch (err) {
      console.log(err);
      reject(false);
    }
  });
};

exports.recognizeface = (profileFaceId,UqeryImageFaceId ) => {
  return new Promise(async (resolve, reject) => {
    try {
     
 const result = await client.face.findSimilar(profileFaceId, { faceIds : [UqeryImageFaceId] });
      
if(result){
 resolve(result);
}
else{
  reject(false)
}
     
    } catch (err) {
      
      reject(false);
    }
  });
};
