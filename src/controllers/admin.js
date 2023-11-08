const Admin = require("../models/admin");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { hashSync, genSaltSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const login = async (req, res, next) => {
  try {
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;

    Admin.findOne({ $or: [{ email: email }, { password: password }] }).then(
      (admin) => {
        if (admin) {
          bcrypt.compare(password, admin.password, function (err, result) {
            if (err) {
              res.json({
                error: err,
              });
            }

            if (result) {
              let token = jwt.sign(
                { email: admin.email, id: admin._id, role: admin.role },
                process.env.JWT_KEY
              ); //,
              res.json({
                message: "Login Successful!",
                token: token,
                firstName: admin.firstName,
                lastName: admin.lastName,
              });
            } else {
              res.json({
                message: "Id or password is invalid",
              });
            }
          });
        } else {
          res.json({
            message: "Id or password is invalid",
          });
        }
      }
    );
  } catch (error) {
    res.json({
      message: "Id or password is invalid",
    });
  }
};

const signUp = async (req, res) => {
  try {
    const body = req.body;
    if (body.role == "user") {
      return res.json({
        message: "You Are Not Allowed To SignUp Here",
      });
    }
    const isEmailExistInUser = await User.isThisEmailUse(body.email);
    if (isEmailExistInUser) {
      return res.json({
        success: false,
        message: "This email is already in use by another user",
      });
    }
    const isEmailExistInAdmin = await Admin.findOne({ email: body.email });
    if (isEmailExistInAdmin) {
      return res.json({
        success: false,
        message: "This email is already in use by another admin",
      });
    }
    const salt = genSaltSync(10);

    try {
      body.password = hashSync(body.password, salt);
    } catch (error) {
      res.json({
        message: "password error",
      });
    }
    let admin = new Admin({
      email: body.email,
      password: body.password,
      role: body.role,
      firstName: body.firstName,
      lastName: body.lastName,
    });

    admin.save().then((response) => {
      res.json({
        message: "Sign up is successfully",
        obj: response,
      });
    });
  } catch (error) {
    res.json({
      message: "error",
    });
  }
};

const auth = async (req, res) => {
  try {
    if (req.body.decoded.admin) {
      res.json({
        auth: true,
      });
    } else {
      res.json({
        auth: false,
      });
    }
  } catch (error) {
    res.json({
      auth: false,
    });
  }
};

module.exports = {
  login,
  signUp,
  auth,
};
