const mongoose = require("mongoose");
const Banner = require("../models/banner");
const { removeFile } = require("./upload");

const create = async (req, res) => {
  const { category, img } = req.body;
  try {
    const banner = new Banner({
      category: category || null,
      img: img,
    });
    banner.save();
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const index = async (req, res) => {
  const id = req.query.categoryId;
  try {
    if (id) {
      if (id === "7483") {
        const banner = await Banner.find({ category: null });
        res.status(200).json(banner);
      } else {
        const banners = await Banner.find({ category: id });
        res.status(200).json(banners);
      }
    } else {
      const banners = await Banner.find({});
      res.status(200).json(banners);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const show = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await Banner.findOne({ _id: id });
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const edit = async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  try {
    const banner = await Banner.updateOne(
      { _id: id },
      { $set: { ...body, category: body.category || null } }
    );
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const destroy = async (req, res) => {
  try {
    const id = req.query.id;
    const banner = await Banner.findOne({ _id: id });
    const img = banner.img;
    const _res = await removeFile(img.public_id);
    const deleteRes = await Banner.deleteOne({ _id: id });
    res.status(200).json(deleteRes);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = { create, index, show, edit, destroy };
