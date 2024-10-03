const {
  signup_public_model,
  signup_private_model,
  signup_public_model2,
  signup_private_model2,
  login_model,
  fetchUserPublicModel,
  updateOTPmodel,
  updateDetailsmodel,
} = require("./model");
const {
  fullNameValidation,
  emailValidation,
  passwordValidation,
} = require("../utility/formValidation");
const { responseObject } = require("../utility");

const loginController = (req, res) => {
  let { email, password } = req.body;
  if (!emailValidation(email)) {
    return res.send(responseObject("Invalid email", false, null));
  }

  fetchUserPublicModel(email).then((checkResponse) => {
    if (checkResponse.error) {
      return res.send(responseObject(checkResponse.error.message, false, null));
    }
    if (checkResponse.data < 1) {
      return res.send(responseObject("No user found!", false, null));
    }
    let userdata = checkResponse.data[0];
    let actualEmail = userdata.email;

    login_model({ email: actualEmail, password })
      .then((loginResponse) => {
        if (loginResponse.error) {
          return res.send(
            responseObject(loginResponse.error.message, false, null)
          );
        }

        res.send(
          responseObject("Success", true, {
            ...loginResponse.data.user.user_metadata,
            accessToken: loginResponse.data.session.access_token,
            UUID: loginResponse.data.user.id,
            refreshToken: loginResponse.data.session.refresh_token,
          })
        );
      })
      .catch((error) => {
        console.log(error);
        responseObject("A server error occured", false, null);
      });
  });
};

const signupController = (req, res) => {
  let { fullName, email, password, data, phone_number } = req.body;
  let newPhone = `0${phone_number.slice(-10)}`;
  if (!fullNameValidation(fullName)) {
    return res.send(responseObject("Invalid name", false, null));
  } else if (!emailValidation(email)) {
    return res.send(responseObject("Invalid email", false, null));
  } else if (passwordValidation(password)) {
    return res.send(responseObject("Invalid password", false, null));
  }

  let payload = { email, password, data: { ...data, wallet: 0, newPhone } };
  signup_private_model(payload)
    .then((signUpResponse) => {
      if (signUpResponse.error) {
        return res.send({
          success: false,
          message: signUpResponse.error.message,
          data: null,
        });
      }

      //public signup
      signup_public_model({
        fullName,
        password,
        email,
        phone: newPhone,
        UUID: signUpResponse.data.user.id,
      })
        .then((response) => {
          if (response.error) {
            return res.send({
              success: false,
              message: response.error.message,
              data: null,
            });
          } else {
            res.send({
              success: true,
              message: "record created",
              data: {
                ...signUpResponse.data.user.user_metadata,
                accessToken: signUpResponse.data.session.access_token,
                UUID: signUpResponse.data.user.id,
                refreshToken: signUpResponse.data.session.refresh_token,
              },
            });
          }
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

const signupController2 = (req, res) => {
  let { fullName, password, phone_number, data } = req.body;

  // after validation
  // private sign up

  let payload2 = { password, phone_number, data };
  signup_private_model2(payload2)
    .then((signUpResponse) => {
      if (signUpResponse.error) {
        return res.send({
          success: false,
          message: signUpResponse.error.message,
          data: null,
        });
      }

      //public signup
      signup_public_model2({ fullName, phone_number, password })
        .then((response) => {
          if (response.error) {
            return res.send({
              success: false,
              message: response.error.message,
              data: null,
            });
          } else {
            res.send({
              success: true,
              message: "record created",
              data: {
                ...signUpResponse.data.user.user_metadata,
                accessToken: signUpResponse.data.session.access_token,
                UUID: signUpResponse.data.user.id,
                refreshToken: signUpResponse.data.session.refresh_token,
              },
            });
          }
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

const resetPassword = (req, res) => {
  let { username, oldpassword, newpassword } = req.body;
  res.send({
    status: true,
    message: "Password changed, successfully!",
    data: {
      username,
      newpassword,
    },
  });
};

const RequestOTPController = (req, res) => {
  const OTP = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
  let { email } = req.body;
  if (!emailValidation(email)) {
    return res.send(responseObject("Invalid Email", false, null));
  }

  fetchUserPublicModel(email).then((response) => {
    if (response.error) {
      // response.error.message
      return res.send(responseObject(response.error.message, false, null));
    }

    // check if there's a user
    if (response.data.length < 1) {
      // no user
      return res.send(responseObject("User does not exist", false, null));
    }

    //send otp via NodeMailer

    let otpObj = { OTP, time: new Date().getTime() };

    updateOTPmodel({ OTP: otpObj, email })
      .then((response) => {
        if (response.error) {
          return res.send(responseObject(response.error.message, false, null));
        }

        res.send({
          success: true,
          message: "OTP sent",
          data: {
            user: email,
            OTP,
          },
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
  });
};

const changeDetails = (req, res) => {
  let { email, newfullName, newphone_number } = req.body;

  fetchUserPublicModel(email).then((response) => {
    if (response.error) {
      // response.error.message
      return res.send(responseObject(response.error.message, false, null));
    }

    // check if there's a user
    if (response.data.length < 1) {
      // no user
      return res.send(responseObject("User does not exist", false, null));
    }

    updateDetailsmodel({
      newfullName: newfullName,
      newphone_number: newphone_number,
      email,
    }).then((response) => {
      if (response.error) {
        return res.send(responseObject(response.error.message, false, null));
      }

      res.send({
        success: true,
        message: "Details updated",
        newdata: {
          newfullName: newfullName,
          newphone_number: newphone_number,
        },
      });
    });
  });
};
// const verifyOTP = (req, res)=>{
//     updateOTPmodel
// }

module.exports = {
  loginController,
  signupController,
  signupController2,
  resetPassword,
  RequestOTPController,
  changeDetails,
};
