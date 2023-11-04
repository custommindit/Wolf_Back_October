const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const product = require("../models/product");
const Rating = require("../models/rating");
const bcrypt = require("bcrypt");
const { hashSync, genSaltSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const viewProfile = (req, res, next) => {
  try {
    const id = req.body.decoded.id;

    User.findById(id).select("-password").then((response) => {
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
    if (isNewUser) {
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
      gender:"",
      ban: false,
      viewed:[]
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
    User.findByIdAndUpdate(id,  update ).then(() => {
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
    if (!isNewUser) {
      return res.json({
        success: false,
        message: "Id or password is invalid",
      });
    }
///////////////////////////////////////////////////////////////////soft delete
    // Check if the user is marked as deleted
    const user = await User.findOne({ email: email });
    if (user && user.isDeleted) {
      return res.json({
        success: false,
        message: "User is marked as deleted. Login not allowed.",
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

const banUser = async (req, res) => {
  try {
    if (req.body.decoded.admin)
      User.findByIdAndUpdate(req.params.id, { $set: { ban: true } }, { new: true })
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

const unbanUser = async (req, res) => {
  try {
    if (req.body.decoded.admin)
      User.findByIdAndUpdate(req.params.id, { $set: { ban: false } }, { new: true })
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
    ].slice(0, 4);
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
        .then(async (documents) => {
          let rates1 = [];
          for (var i = 0; i < documents.length; i++) {
            await Rating.find({ product_id: documents[i]._id }).then(
              async (rates) => {
                let total = 0;
                let totalRate = 0;
                if (rates.length > 0) {
                  rates.forEach((rate) => {
                    total = total + rate.rate;
                  });
                  totalRate = total / rates.length;
                }
                rates1.push(totalRate);
              }
            );
          }
          return await res.json({
            response: documents,
            rates: rates1,
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

    if (req.body.password===req.body.cPassword && req.body.password) {
      const salt = genSaltSync(10);
      const password = hashSync(req.body.password, salt);
      User.findByIdAndUpdate(id, { password: password }).then(() => {
        res.json({
          message: "Success",
        });
      });
    }else{
      res.status(200).json({ message: "password doesnt match comfirm password" });
    }
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(200).json({ message: "Error 500" });
  }
};


const softDeleteUser = async (req, res) => {
  try {
    const userId = req.body.decoded.id; // Assuming you're passing the user ID in the URL parameters

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({ message: "User not found." });
    }

    // Soft delete the user by marking them as deleted
    user.isDeleted = true;
    user.deletedAt = new Date();

    // Save the updated user document
    await user.save();

    res.json({ message: "User has been soft deleted." });
  } catch (error) {
    res.status(200).json({ message: "Internal Server Error" });
  }
};

///////////////////////////////////////////////////////////social Login//////////////////////////////
const CLIENT_ID =process.env.CLIENT_ID// Replace with your actual Google Client ID
const client = new OAuth2Client(CLIENT_ID);
async function verifyIdToken(token) {

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of your app that accesses the backend
    });
    const payload = ticket.getPayload();
    return payload;

}

const googleSocialLogin=async(req,res,next)=>{
  const { idToken } = req.body;
  try {
    const {name,email,email_verified,given_name,family_name} = await verifyIdToken(idToken);
    // Process the decoded information as needed
    // ...
    // Respond with success or processed data
    if(!email_verified){
      return res.status(200).json({ success: false, error: 'in-valid email' })
    }
    const user = await User.findOne({email:email})
    //if user  exist in system
    if(user){
      if(user?.provider!=="google"){
        return res.status(200).json({ success: false, error: `in-valid provider, provider is ${user.provider}`})
      }
      let token = jwt.sign(
        { email: user.email, id: user._id, name: user.first_name + " " + user.last_name },
        process.env.JWT_KEY
      );
      return res.json({
        success: true,
        message: "Login Successful!",
        token: token,
      });
    }
    //if user doesnt exist in system
    const randomPassword = Math.random().toString(36).slice(-8); // Generate a random 8-character password
    const salt = genSaltSync(10);
    const hashedPassword =  hashSync(randomPassword, salt); // Hash the password
     let newUser = new User({
      username:name,
      email:email,
      password: hashedPassword,
      first_name: given_name,
      last_name: family_name,
      provider:"google",
      ban: false,
      viewed:[]
    });
    await newUser.save();
    let token = jwt.sign(
      { email: newUser.email, id: newUser._id, name: newUser.first_name + " " + newUser.last_name },
      process.env.JWT_KEY
    );
    // return res.status(200).json({ success: true, message: 'Token verified successfully', payload });
    return res.status(200).json({
      success: true,
      message: "Signed up successfully",
      // email: newUser.email,
      token
    });
  } catch (error) {
    // Handle verification error
    console.error('Verification error:', error);
    // return Respond with an error to the client
    return res.status(200).json({ success: false, error: 'Unauthorized' ,error});
  }

}

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
  banUser,
  unbanUser,
  softDeleteUser,
  googleSocialLogin
};
