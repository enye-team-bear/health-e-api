/* eslint-disable max-len */
/* eslint-disable no-useless-escape */
const { message } = require('./constants');

const isEmpty = string => {
    if (string.trim() === '') return true;
    return false;
};
const isEmail = email => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    return false;
};

const { mustNotBeEmpty, passwordMustMatch, mustBeValidEmail } = message;

// eslint-disable-next-line max-lines-per-function
exports.validateSignUpData = data => {
    // input validation
    const errors = {};
    const {
        password,
        confirmPassword,
        fullName,
        userName,
        number,
        userStatus,
        email,
    } = data;

    if (isEmpty(email)) {
        errors.email = mustNotBeEmpty;
    } else if (!isEmail(email)) {
        errors.email = mustBeValidEmail;
    }

    if (isEmpty(password)) errors.password = mustNotBeEmpty;
    if (password !== confirmPassword) {
        errors.confirmPassword = passwordMustMatch;
    }
    if (isEmpty(fullName)) errors.fullname = mustNotBeEmpty;
    if (isEmpty(number)) errors.number = mustNotBeEmpty;
    if (isEmpty(userName)) errors.userName = mustNotBeEmpty;
    if (isEmpty(userStatus)) errors.userstatus = mustNotBeEmpty;

    return {
        errors,
        valid: Object.keys(errors).length === 0,
    };
};

exports.validateLoginData = data => {
    const errors = {};
    const { email, password } = data;

    if (isEmpty(email)) {
        errors.email = mustNotBeEmpty;
    } else if (!isEmail(email)) {
        errors.email = mustBeValidEmail;
    }
    if (isEmpty(password)) errors.password = mustNotBeEmpty;

    return {
        errors,
        valid: Object.keys(errors).length === 0,
    };
};
