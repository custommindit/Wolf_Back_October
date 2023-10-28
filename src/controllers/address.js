const Address = require('../models/address')

module.exports.createAddress = (req, res, next) => {
    try {
        const body = req.body;

        let address = Address({
            user_id: body.decoded.id,
            type: body.type,
            city: body.city,
            area: body.area,
            address: body.address,
            house_no: body.house_no
        })

        address.save().then(response => {
            res.json({
                status: true,
                response: response
            })
        })
    } catch (error) {
        console.log(error.message)
        return res.json({
            status: false,
            message: "Error"
        })
    }
}

module.exports.getAddesses = (req, res, next) => {
    try {
        Address.find({ user_id: req.body.decoded.id }).then(response => {
            res.json({
                status: true,
                response: response
            })
        })
    } catch (error) {
        console.log(error.message)
        return res.json({
            status: false,
            message: "Error"
        })
    }
}

module.exports.updateAddress = (req, res, next) => {
    try {
        const body = req.body;

        let address = Address({
            type: body.type,
            city: body.city,
            area: body.area,
            address: body.address,
            house_no: body.house_no
        })

        Address.findByIdAndUpdate(req.params.id, { $set: address }, { new: true }).then(response => {
            return res.json({
                status: true,
                response: response
            })
        })
    } catch (error) {
        console.log(error.message)
        return res.json({
            status: false,
            message: "Error"
        })
    }
}

module.exports.deleteAddress = (req, res, next) => {
    try {
        Address.findByIdAndDelete(req.params.id).then(response => {
            return res.json({
                status: true,
                message: "Address is deleted"
            })
        })
    } catch (error) {
        console.log(error.message)
        return res.json({
            status: false,
            message: "Error"
        })
    }
}