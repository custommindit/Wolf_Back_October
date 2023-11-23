const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const User = require("../models/User");
const supplier = require("../models/supplier");
const roles = {
  admin: "admin",
  user: "user",
  supplier: "supplier",
};
Object.freeze(roles);

const checkToken = (authorizedRoles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.get("authorization");
      if (token) {
        const tokenParts = token.split(" ");
        if (tokenParts.length === 2 && tokenParts[0] === "Bearer") {
          const tokenString = tokenParts[1];

          jwt.verify(tokenString, process.env.JWT_KEY, async (err, decoded) => {
            if (err) {
              console.error(err);
              return res.json({
                success: 0,
                message: "Invalid Token...",
              });
            }
            req.body.decoded = decoded;

            let user;
            if (decoded.role === roles.admin) {
              user = await Admin.findById(decoded.id);
            }
            if (decoded.role === roles.supplier) {
              user = await supplier.findById(decoded.id);
            }
            if (decoded.role === roles.user) {
              user = await User.findById(decoded.id);
            }
            console.log(user);
            if (!user) {
              return res.json({
                success: 0,
                message: "User Not Exist...",
              });
            }
            if (!authorizedRoles.includes(user.role)) {
              return res.json({
                success: 0,
                message: "Not Authorized User To Access Here...",
              });
            }
            next();
          });
        } else {
          return res.json({
            success: 0,
            message: "Invalid Token Format",
          });
        }
      } else {
        return res.json({
          success: 0,
          message: "Access Denied! Unauthorized User",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: 0,
        message: "Internal Server Error",
      });
    }
  };
};

module.exports = {
  checkToken,
  roles,
};

// module.exports = {
//   checkToken:async (req, res, next) => {
//     let token = req.get("authorization");
//     if (token) {
//       token = token.slice(7);

//       jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
//         if (err) {
//           console.log(err);
//           return res.json({
//             success: 0,
//             message: "Invalid Token..."
//           });
//         }
//         let user;
//     if (decoded.role == roles.admin) {
//       user = await Admin.findById(decoded.id);
//     }
//     if (decoded.role == roles.user) {
//       user = await User.findById(decoded.id);
//     }
//     if (!user) {
//       return res.json({
//         success: 0,
//         message: "User Not Exist..."
//       });
//     }
//     if (!roles.includes(decoded.role)) {
//       return res.json({
//         success: 0,
//         message: "Not Authorized User To Access Here..."
//       });
//     }
//     req.body.decoded = decoded;
//     next();
//       });
//     } else {
//       return res.json({
//         success: 0,
//         message: "Access Denied! Unauthorized User"
//       });
//     }
//   }}
// const jwt = require("jsonwebtoken");
// module.exports = {
//   checkToken: (req, res, next) => {
//     let token = req.get("authorization");
//     if (token) {
//       token = token.slice(7);

//       jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
//         if (err) {
//           console.log(err);
//           return res.json({
//             success: 0,
//             message: "Invalid Token..."
//           });
//         } else {
//           req.body.decoded = decoded;
//           next();
//         }
//       });
//     } else {
//       return res.json({
//         success: 0,
//         message: "Access Denied! Unauthorized User"
//       });
//     }
//   }
// };
