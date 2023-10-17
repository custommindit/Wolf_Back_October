const Rating = require('../models/rating')

module.exports.createRate = (req, res, next) => {
    try {
        const body = req.body;

        const rateFound = Rating.findOne({ product_id: req.params.product_id, user_id: body.decoded.id })

        if (rateFound !== null) {
            return res.json({
                status: true,
                message: "You have already rated this product"
            })
        }

        let rating = Rating({
            product_id: req.params.product_id,
            user_id: body.decoded.id,
            user_name: body.decoded.name,
            rate: body.rate,
            address_rate: body.address_rate,
            text_rate: body.text_rate,
        })

        rating.save().then(response => {
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

module.exports.deleteRate = (req, res, next) => {
    try {
        Rating.findByIdAndDelete(req.params.id).then(response => {
            res.json({
                status: true,
                message: "Your rate is deleted"
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