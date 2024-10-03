const { isTokenValid } = require("../utility/index");
const {
  getUserByAccesToken,
  refreshByRefreshToken,
  Insert_image_to_public_storage,
} = require("./user-model");
const {
  deleteUserPrivateModel,
  deleteUserPublicModel,
} = require("../auth/model");

const GetLoggedInUserController = (req, res) => {
  let token = req.headers;
  let authHeader = token["authorization"];

  if (!authHeader) {
    return res.send({
      status: false,
      message: "Missing authorization!",
    });
  }

  let accessToken = authHeader.split(" ")[1];

  if (isTokenValid(accessToken) == false) {
    return res.send({
      success: false,
      message: "user session expired",
    });
  }
  getUserByAccesToken(accessToken).then((response) => {
    if (response.error) {
      res.send({
        success: false,
        message: response.error.message,
      });
    }

    let userData = { ...response.data.user.user_metadata };
    res.send(userData);
  });
};

const refreshAccessController = (req, res) => {
  let { refresh } = req.body;

  refreshByRefreshToken(refresh)
    .then((response) => {
      if (response.error) {
        res.send({
          success: false,
          message: response.error.message,
          data: null,
        });
      }

      res.send({
        accessToken: response.data.session.access_token,
        refreshToken: response.data.session.refresh_token,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.send({
        success: false,
        message: "a server error occured",
        data: null,
      });
    });
};

const deleteUserController = (req, res) => {
  let { userid } = req.body;
  deleteUserPrivateModel(userid)
    .then((response) => {
      if (response.error) {
        return res.send({
          success: false,
          message: response.error.message,
          data: null,
        });
      }
      if (response.data.length < 1) {
        return res.send({
          success: false,
          message: "User id not found",
        });
      }
      deleteUserPublicModel(userid)
        .then((response2) => {
          if (response2.error) {
            return res.send({
              success: false,
              message: response2.error.message,
              data: null,
            });
          }
          res.send({
            success: true,
            message: "User deleted!",
          });
        })
        .catch((error) => {
          console.log(error);
          return res.send({
            success: false,
            message: "a server error occured",
            data: null,
          });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.send({
        success: false,
        message: "a server error occured",
        data: null,
      });
    });
};

const uploadFileController = (req, res) => {
  if (!req.file) {
    return res.send({
      success: false,
      message: "No file uploaded!",
    });
  }

  let bufferData = req.file.buffer;
  //convert bufferData to base64 encoded string
  let base64Image = Buffer.from(bufferData).toString("base64"); // an alphanumeric string would be created.
  // retrive the mimetype, e.g: image/png, video/mp4...., of the uploaded file from the request object.
  const fileType = req.file.mimetype;
  //determine the file/field name to check if it's an image or video
  let fieldName = fileType.startsWith("image") ? "image" : "video";
  // extract the file extension using the split method.
  let fileExtension = fileType.split("/").pop();
  //create a new object to hold the file data
  let fileName = `${Math.random()}.${fileExtension}`;

  // create a function that converts the base64 data to a blob.
  const Base64ToBlob = (base64Data, contentType = fileType) => {
    const byteCharacters = atob(base64Data); // atob means a string of bytes
    // create an array with the same length as byteCharacters and iterate over it, converting each character to its unicode code point(an integer between 0 aand 65535) using the character code.
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    // create a typed array which is an int8 type which represents an 8-bit unsigned integer. this array is used to construct a blob.
    const byteArray = new Uint8Array(byteNumbers);
    // create a new blob object from the byteArray and it's going to specify the mimetype and the object type.
    return new Blob([byteArray], { type: contentType });
  };

  const blob = Base64ToBlob(base64Image);
  // create a form data object and append the blob as a file.
  let formData = new FormData();
  formData.append(fieldName, blob, fileName);

  const payload = { fileName, formData };

  console.log(payload);

  Insert_image_to_public_storage(payload)
    .then((response) => {
      if (response.error) {
        return res.send({
          success: false,
          message: response.error.message,
          data: null,
        });
      }

      return res.send({
        success: true,
        message: "Upload Successful",
        data: response,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.send({
        success: false,
        message: "a server error has occurred 1",
        data: null,
      });
    });
};

module.exports = {
  GetLoggedInUserController,
  refreshAccessController,
  deleteUserController,
  uploadFileController,
};
