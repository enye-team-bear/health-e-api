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
  const { mustNotBeEmpty, passwordMustMatch, mustBeValidEmail } = message

  if (isEmpty(email)) {
    errors.email = mustNotBeEmpty;
  } else if (!isEmail(email)) {
    errors.email =mustBeValidEmail;
  }

  if (isEmpty(password)) errors.password = mustNotBeEmpty;
  if (password !== confirmPassword)
    errors.confirmPassword = passwordMustMatch;
  if (isEmpty(fullName)) errors.fullname = mustNotBeEmpty;
  if (isEmpty(number)) errors.number = mustNotBeEmpty;
  if (isEmpty(userName)) errors.userName = mustNotBeEmpty;
  if (isEmpty(userStatus)) errors.userstatus = mustNotBeEmpty;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = data => {
  let errors = {};
  const {email, password} = data
  const { mustBeValidEmail, mustNotBeEmpty } = message

  if (isEmpty(email)) {
    errors.email = mustNotBeEmpty;
  }else if (!isEmail(email)) {
    errors.email = mustBeValidEmail;
  }
  if (isEmpty(password)) errors.password = mustNotBeEmpty;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};