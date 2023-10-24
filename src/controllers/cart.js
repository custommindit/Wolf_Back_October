const mongoose = require('mongoose')
const Cart = require('../models/cart')
const Product = require('../models/product')
const jwt = require('jsonwebtoken');
const { response } = require('express');
require("dotenv").config();

module.exports.Create_cart_item = async (req, res) => {
    const id = req.body.decoded.id;

    const body = req.body

    const isNewCart = await Cart.isThisCart(body.product_id, id, body.size, body.color)
    if (!isNewCart) {
        return res.json({
            message: 'This product is already in cart'
        })
    }

    const newCart = new Cart({
        user_id: id,
        product_id: body.product_id,
        quantity: 1,
        size: body.size,
        color: body.color,
        dressing: body.dressing
    })

    await newCart.save().then(response => {
        return res.status(200).json({ response: response })
    }).catch(err => {
        console.log('err', err)
        return res.status(200).json(err)
    })
}

module.exports.Read_cart_items = async (req, res) => {

    const id = req.body.decoded.id;

    await Cart.find({ user_id: id }).then(e => {
        return res.status(200).json({
            response: e
        })
    }).catch(err => {
        console.log(err.message)
        return res.status(200).json({ error: err.message })
    })
}

module.exports.Delete_cart_item = async (req, res) => {
    const id = req.params.id

    await Cart.findById(id).then(e => {
        if (!e) {
            return res.status(200).json({ error: 'can\'t update cart not found!' })
        }
    })

    await Cart.findByIdAndDelete(id).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        return res.status(200).json({ error: err.message })
    })
}

module.exports.add_one_quantity = async (req, res) => {
    const id = req.params.id
    await Cart.findById(id).then(e => {
        if (!e) {
            return res.status(200).json({ error: 'can\'t update cart not found!' })
        }
    })
    await Cart.findById(id).then(cart => {
        Product.findById(cart.product_id).then(async (product) => {
            await Cart.findOneAndUpdate({ _id: id, quantity: { $lt: product.quantity[cart.size] } }, { $inc: { quantity: 1 } }, { new: true }).then(e => {
                return res.status(200).json(e)
            }).catch(err => {
                console.log(err.message)
                return res.status(200).json({ error: err.message })
            })
        })
    })
}

module.exports.remove_one_quantity = async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id)
    await Cart.findById(id).then(e => {
        if (!e) {
            return res.status(200).json({ error: 'can\'t update cart not found!' })
        }
    })
    await Cart.updateOne({ _id: id, quantity: { $gt: 1 } }, { $inc: { quantity: -1 } }, { new: true }).then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(200).json({ error: err.message })
    })
}