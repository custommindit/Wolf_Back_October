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
        secure_url: data.secure_url,
        public_id: data.public_id,
      });
    }
  } catch (error) {
    res.status(500);
  }
};

const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      res.status(400).json("No Files");
    } else {
      const urls = await Promise.all(
        req.files.map(async (file) => {
          const data = await cloudinary.uploader.upload(file.path, {
            folder: `${process.env.FOLDER_CLOUD_NAME}/images/`,
          });
          await unlinkAsync(file.path);
          return {
            secure_url: data.secure_url,
            public_id: data.public_id,
          };
        })
      );

      res.status(200).json(urls);
    }
  } catch (error) {
    res.status(500);
  }
};

module.exports = {
  uploadFile,
  uploadFiles,
};
