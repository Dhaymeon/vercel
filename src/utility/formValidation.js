const { request } = require("express");
const { responseObject } = require(".");

function fullNameValidation(name) {
  //check for name length
  if (name.length < 6) {
    return false;
  }
  //check for first and last name
  if (name.split(" ").length < 2) {
    return false;
  }

  return true;
}

function emailValidation(email) {
  if (email.length < 6 || !email.includes("@") || !email.includes(".")) {
    return false;
  } else {
    return true;
  }
}

function passwordValidation(password) {
  // checking password length
  if (
    password.length < 6 ||
    !/\d/.test(password) ||
    !/[A-Za-z]/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    // return res.send(
    //   responseObject(
    //     "invalid password, password should be atleast 6 characters long",
    //     false,
    //     null
    //   )
    // );
    return false;
  } else {
    return true;
  }
}

module.exports = { fullNameValidation, emailValidation, passwordValidation };
