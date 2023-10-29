var path = require("path");
var url = require("url");
var dotenv = require("dotenv");
var cloudinary = require("cloudinary").v2;


dotenv.config({ path: path.join(__dirname, "./env") });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

module.exports = cloudinary;
