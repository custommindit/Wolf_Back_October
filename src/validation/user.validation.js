var joi = require("joi");
var globalValidationFields = require("./main.validation").globalValidationFields;

exports.sign_up = joi.object({
    email: globalValidationFields.email,
    password: globalValidationFields.password,
    username: globalValidationFields.name,
    telephone: globalValidationFields.phone,
    gender: globalValidationFields.gender,
    last_name: globalValidationFields.name,
    first_name: globalValidationFields.name
}).required();
