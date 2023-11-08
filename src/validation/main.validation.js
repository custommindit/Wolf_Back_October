var joi = require("joi");
var Types = require("mongoose").Types;

// exports.validation = function (schema, considerHeaders) {
//     if (considerHeaders === void 0) { considerHeaders = false; }
//     return function (req, res, next) {
//         var dataFromAllMethods = Object.assign({}, req.body, req.params, req.query);
//         if (req.file || req.files) {
//             dataFromAllMethods.file = req.file || req.files;
//         }
//         if (req.headers.authorization && considerHeaders) {
//             dataFromAllMethods = { authorization: req.headers.authorization };
//         }
//         var validationResult = schema.validate(dataFromAllMethods, { abortEarly: false });
//         if (validationResult.error) {
//             return res.json({ message: "Validation Error", ERR: validationResult.error.details });
//         }
//         return next();
//     };
// };
exports.validation = function (schema, considerHeaders = false) {
    return function (req, res, next) {
      const dataFromAllMethods = Object.assign({}, req.body, req.params, req.query);
      if (req.file || req.files) {
        dataFromAllMethods.file = req.file || req.files;
      }
      if (req.headers.authorization && considerHeaders) {
        dataFromAllMethods.authorization = req.headers.authorization;
      }
  
      const validationResult = schema.validate(dataFromAllMethods, { abortEarly: false });
      if (validationResult.error) {
        const formattedErrors = {};
  
        validationResult.error.details.forEach((error) => {
          const key = error.path[0];
          const customErrorMessage = error.message.replace(/["']/g, ''); // Remove quotes from error message
  
          if (!formattedErrors[key]) {
            formattedErrors[key] = customErrorMessage;
          }
        });
  
        return res.status(200).json({ success: false, errors: formattedErrors });
      }
      return next();
    };
  };
var validateObjectId = function (value, helper) {
    return Types.ObjectId.isValid(value) ? true : helper.message('In-Valid object-Id from validation');
};

exports.globalValidationFields = {
    email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'edu', 'eg', 'net'] } }).required(),
    password: joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
    cpassword: joi.string().valid(joi.ref("password")).required(),
    userName: joi.string().alphanum().min(3).max(15).required(),
    name: joi.string().min(3).max(20),
    fName: joi.string().min(3).max(15).required(),
    lName: joi.string().min(3).max(15).required(),
    age: joi.number().integer().positive().min(18).max(95),
    phone: joi.string().min(11).max(11).required(),
    id: joi.string().custom(validateObjectId).required(),
    gender: joi.string().valid("Male", "Female"),
    code: joi.string().min(6).max(6).required(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required(),
    }),
    authorization: joi.string().required(),
    headers: joi.string().required(),
};
