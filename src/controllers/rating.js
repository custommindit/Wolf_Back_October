const Rating = require('../models/rating')

module.exports.createRate = (req, res, next) => {
    try {
        const body = req.body;

        let rating = Rating({
            product_id: req.params.product_id,
            user_id: body.decoded.id,
            user_name: body.decoded.name,
            rate: body.rate,
            addres_rate: body.addres_rate,
            text_rate: body.text_rate,
        })

        rating.save().then(response => {
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