const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

dotenv.config({ path: path.join(__dirname, "./env") });

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});

const uploadFile = async (req, res) => {
  try {
    if (!req.file || req.file?.filename == undefined) {
      res.status(400).json("No File");
    } else {
      const data = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.FOLDER_CLOUD_NAME}/images/`,
      });
      await unlinkAsync(req.file.path);
      res.status(200).json({
        url: data.url,
      });
    }
  } catch (error) {
    res.status(500);
  }
};

module.exports = {
  uploadFile,
};
