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
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }

  if (isEmpty(data.password)) errors.password = "Must not be Empty";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must Match";
  if (isEmpty(data.fullname)) errors.fullname = "Must not be Empty";
  if (isEmpty(data.number)) errors.number = "Must not be Empty";
  if (isEmpty(data.username)) errors.userName = "Must not be Empty";
  if (isEmpty(data.userstatus)) errors.userstatus = "Must not be Empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
