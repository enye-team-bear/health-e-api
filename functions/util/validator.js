const {message} = require('./constants')
const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};
const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

exports.validateSignUpData = data => {
  //input validation
  const errors = {};
  const {password, confirmPassword, fullName, userName, number, userStatus, email} = data

  if (isEmpty(email)) {
    errors.email = message.mustNotBeEmpty;
  } else if (!isEmail(email)) {
    errors.email = message.mustBeValidEmail;
  }

  if (isEmpty(password)) errors.password = message.mustNotBeEmpty;
  if (password !== confirmPassword)
    errors.confirmPassword = message.passwordMustMatch;
  if (isEmpty(fullName)) errors.fullname = message.mustNotBeEmpty;
  if (isEmpty(number)) errors.number = message.mustNotBeEmpty;
  if (isEmpty(userName)) errors.userName = message.mustNotBeEmpty;
  if (isEmpty(userStatus)) errors.userstatus = message.mustNotBeEmpty;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = data => {
  let errors = {};
  const {email, password} = data

  if (isEmpty(email)) {
    errors.email = message.mustNotBeEmpty;
  }else if (!isEmail(D_email)) {
    errors.email = message.mustBeValidEmail;
  }
  if (isEmpty(password)) errors.password = message.mustNotBeEmpty;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};