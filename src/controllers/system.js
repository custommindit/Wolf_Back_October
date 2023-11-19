const System = require("../models/system");

const index = async (req, res) => {
  try {
    const systems = await System.findOne({});
    res.status(200).json(systems);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const edit = async (req, res) => {
  const body = req.body;
  try {
    const systems = await System.updateMany({}, { $set: { ...body } });
    res.status(200).json(systems);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = { index, edit };
