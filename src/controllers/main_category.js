const mongoose = require('mongoose')
const MainCategory = require('../models/main_category')

module.exports.add_mainCategory = async (req, res) => {
    const { name, view } = req.body
    const isCategoryExist = MainCategory.findOne({name})
    if (isCategoryExist) {
        return res.json({message:"this name is exist before enter another name"})
    }
    const main_category = new MainCategory({ name: name, view: view })
    main_category.save().then(e => {
        return res.status(200).json({message:"Category Created Successfuly"})
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({ error: err.message })
    })
}

module.exports.get_mainCategory = async (req, res) => {
    await MainCategory.find({view: true}).then(e => {
        res.status(200).json({
            response: e
        })
    }).catch(err => {
        console.log(err.message)
        res.status(404).json({ error: err.message })
    })
}

module.exports.get_mainCategory_by_id = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    await MainCategory.findById(_id).then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({ error: err.message })
    })
}

module.exports.update_mainCategory = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    const data = req.body
    await MainCategory.findByIdAndUpdate(_id, data, { new: true }).then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({ error: err.message })
    })
}

module.exports.viewMainCategory = async (req, res) => {
    await MainCategory.findByIdAndUpdate(req.params.id, {$set: {view: true}}, { new: true }).then(e => {
        res.status(200).json({
            response: e
        })
    }).catch(err => {
        console.log(err.message)
        res.status(404).json({ error: err.message })
    })
}

module.exports.hiddenMainCategory = async (req, res) => {
    await MainCategory.findByIdAndUpdate(req.params.id, {$set: {view: false}}, { new: true }).then(e => {
        res.status(200).json({
            response: e
        })
    }).catch(err => {
        console.log(err.message)
        res.status(404).json({ error: err.message })
    })
}

module.exports.delete_mainCategory = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    await MainCategory.findByIdAndDelete(_id).then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({ error: err.message })
    })
}
