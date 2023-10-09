const User = require("../models/User");
const product = require("../models/product");
const bcrypt = require("bcrypt");
const { hashSync, genSaltSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const viewProfile = (req, res, next) => {
  try {
    const id = req.body.decoded.id;

    User.findById(id).then((response) => {
      res.json({
        response,
        success: true,
      });
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error",
    });
  }
};

const signUp = async (req, res) => {
  try {
    const body = req.body;
    const isNewUser = await User.isThisEmailUse(body.email);
    if (!isNewUser) {
      return res.json({
        success: false,
        message: "This email is already in use",
      });
    }

    const salt = genSaltSync(10);

    try {
      body.password = hashSync(body.password, salt);
    } catch (error) {
      res.json({
        success: false,
        message: "password error",
      });
    }

    let user = new User({
      username: body.username,
      email: body.email,
      password: body.password,
      first_name: body.first_name,
      last_name: body.last_name,
      telephone: body.telephone,
    });
    user.save().then((response) => {
      res.json({
        success: true,
        message: "Signed up successfully",
        email: response.email
      });
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const body = req.body;
    const id = body.decoded.id;
    let update = {
      first_name: body.first_name,
      last_name: body.last_name,
      telephone: body.telephone,
    };
    User.findByIdAndUpdate(id, { $set: update }).then(() => {
      res.json({
        success: true,
        message: "User updated successfully",
      });
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error",
    });
  }
};

const deleteProfile = (req, res, next) => {
  try {
    const id = req.body.decoded.id;
    User.findByIdAndRemove(id).then((respone) => {
      res.json({
        success: true,
        message: "User deleted successfully",
      });
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error",
    });
  }
};

const login = async (req, res, next) => {
  try {
    var email = req.body.email;
    var password = req.body.password;
    const isNewUser = await User.isThisEmailUse(email);
    if (isNewUser) {
      return res.json({
        success: false,
        message: "Id or password is invalid",
      });
    }
    User.findOne({ $or: [{ email: email }, { password: password }] }).then(
      (user) => {
        if (user) {
          bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
              res.json({
                error: err,
              });
            }

            if (result) {
              let token = jwt.sign(
                { email: user.email, id: user._id, name: user.first_name + " " + user.last_name },
                process.env.JWT_KEY
              );
              res.json({
                success: true,
                message: "Login Successful!",
                token: token,
              });
            } else {
              res.json({
                success: false,
                message: "Id or password is invalid",
              });
            }
          });
        } else {
          res.json({
            success: false,
            message: "Id or password is invalid",
          });
        }
      }
    );
  } catch (error) {
    res.json({
      success: false,
      message: "Error",
    });
  }
};

/////pagination correction
const getall = async (req, res) => {
  try {
    if (req.body.decoded.admin)
      User.find()
        .select("-password")
        .then((response) => {
          res.json({
            response,
          });
        })
        .catch((error) => {
          console.log(error);
          res.json({
            message: "An error Occured!",
          });
        });
    else res.json({ message: "An error Occured!" });
  } catch (error) {
    res.json({
      message: "Error",
    });
  }
};

/////pagination correction

const search = async (req, res) => {
  try {
    console.log(req.body);

    if (req.body.decoded.admin) {
      User.find({
        email: { $regex: ".*" + req.body.query + ".*", $options: "i" },
      })
        .select("-password")
        .then((response) => {
          res.json({
            response,
          });
        })
        .catch((error) => {
          console.log(error);
          res.json({
            message: "An error Occured!",
          });
        });
    } else res.json({ message: "An error Occured!" });
  } catch (error) {
    res.json({
      message: "Error 500",
    });
  }
};

const view = async (req, res) => {
  try {
    const user = await User.findById(req.body.decoded.id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const updatedViewed = [
      req.body.id,
      ...user.viewed.filter((id) => id !== req.body.id),
    ].slice(0, 8);

    await User.findByIdAndUpdate(
      req.body.decoded.id,
      {
        $set: { viewed: updatedViewed },
      },
      { new: true }
    );

    return res.json({ message: "Viewed array updated successfully", success: true, });
  } catch (error) {
    res.json({ success: false, message: "Error 500" });
  }
};
const viewed = async (req, res) => {
  try {
    const user = await User.findById(req.body.decoded.id);

    if (!user) {
      return json({ success: false, message: "User not found" });
    } else {
      product
        .find({
          _id: {
            $in: user.viewed,
          },
          view: true,
        })
        .then((response) => {
          res.json({
            response,
          });
        });
    }
  } catch (error) {
    res.status(200).json({ success: false, message: "Error 500" });
  }
};
const changepassword = async (req, res) => {
  try {
    const id = req.body.decoded.id;
    if (req.body.password) {
      const salt = genSaltSync(10);
      const password = hashSync(req.body.password, salt);

      User.findByIdAndUpdate(id, { password: password }).then(() => {
        res.json({
          message: "Success",
        });
      });
    }
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(200).json({ message: "Error 500" });
  }
};

module.exports = {
  viewProfile,
  signUp,
  updateProfile,
  deleteProfile,
  login,
  getall,
  search,
  view,
  viewed,
  changepassword,
};
