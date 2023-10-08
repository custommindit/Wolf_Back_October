const User = require("../models/User")
const supplier = require("../models/supplier")
const bcrypt = require("bcrypt")
const { hashSync, genSaltSync } = require("bcrypt");
const jwt = require('jsonwebtoken');
const Product = require("../models/product");
const mongoose = require('mongoose')
require("dotenv").config();

const signUp = async (req, res) => {
    try {
        const body = req.body;
        const isNewUser = await User.isThisEmailUse(body.email)
        const isNewsupplier = await supplier.isThisEmailUse(body.email)
        if (!isNewUser && !isNewsupplier && req.body.decoded.admin) {
            return res.json({
                message: 'This email is already in use'
            })
        }

        const salt = genSaltSync(10);

        try {
            body.password = hashSync(body.password, salt);
        } catch (error) {
            res.json({
                message: "password error"
            })
        }

        let supp = new supplier({
            name: body.name,
            email: body.email,
            password: body.password,
            enabled: true
        })
        supp.save()
            .then(response => {
                res.json({
                    message: "Sign up is successfully"
                })
            })
    } catch (error) {
        res.json({
            message: "Error"
        })
    }
}

const show = async (req, res) => {
    try {
        const usertoken = req.headers.authorization;
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], process.env.JWT_KEY);
        const id = decoded.id;
        const _id = new mongoose.Types.ObjectId(req.params.id)

        const body = req.body;
        Product.findById(_id).then((product) => {
            if (product.supplier !== decoded.name) {
                return res.json({
                    message: "Error"
                })
            }

        })

        Product.findByIdAndUpdate(_id, { $set: { view: true } })
            .then(() => {
                res.json({
                    message: 'Shown'
                })
            })
            .catch(error => {
                console.log(error);
                res.json({

                    message: 'An error Occured!'
                })
            })
    } catch (error) {
        res.json({
            message: "Error"
        })
    }
}
const hide = async (req, res) => {
    try {
        const usertoken = req.headers.authorization;
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], process.env.JWT_KEY);
        const _id = new mongoose.Types.ObjectId(req.params.id)

        Product.findById(_id).then((product) => {
            if (product.supplier !== decoded.name) {
                return res.json({
                    message: "UNAUTHED"
                })
            }

        })

        Product.findByIdAndUpdate(_id, { $set: { view: false } })
            .then(() => {
                res.json({
                    message: 'Hidden'
                })
            })
            .catch(error => {
                console.log(error);
                res.json({

                    message: 'An error Occured!'
                })
            })
    } catch (error) {
        console.log(error)
        res.json({
            message: "Error"
        })
    }
}
const CreateProduct = async (req, res, next) => {
    const body = req.body
    body.supplier = req.body.decoded.name
    const product = new Product(body)

    await product.save()
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {

            res.json({
                message: error.message
            })
        })
}


const login = async (req, res, next) => {
    try {
        var email = req.body.email
        var password = req.body.password
        const isNewSupplier = await supplier.isThisEmailUse(email)
        if (isNewSupplier) {
            return res.json({
                message: 'Id or password is invalid'
            })
        }
        supplier.findOne({ $or: [{ email: email }, { password: password }] })
            .then(supp => {
                if (supp) {
                    bcrypt.compare(password, supp.password, function (err, result) {
                        if (err) {
                            res.json({
                                error: err
                            })
                        }

                        if (result && supp.enabled) {
                            let token = jwt.sign({ email: supp.email, id: supp._id, name: supp.name }, process.env.JWT_KEY)
                            res.json({
                                message: 'Login Successful!',
                                token: token,
                            })
                        } else {
                            res.json({
                                message: "Id or password is invalid"
                            })
                        }
                    })
                } else {
                    res.json({
                        message: 'No User'
                    })
                }
            })
    } catch (error) {
        res.json({
            message: "Error"
        })
    }
}

const myProducts = async (req, res) => {
    try {
        const usertoken = req.headers.authorization;
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], process.env.JWT_KEY);

        const name = decoded.name;
        Product.find({ supplier: name }).then((response) => {
            res.json(response)
        })

    } catch (error) {
        res.json({
            message: "Error"
        })
    }
}

const Allsuppliers = (req, res) => {
    supplier.find()
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: 'An error Occured!'
            })
        })


}


const enable = async (req, res) => {
    try {
        const _id = new mongoose.Types.ObjectId(req.params.id)

        supplier.findByIdAndUpdate(_id, { $set: { enabled: true } })
            .then(() => {
                res.json({
                    message: 'enabled'
                })
            })
            .catch(error => {
                console.log(error);
                res.json({

                    message: 'An error Occured!'
                })
            })
    } catch (error) {
        res.json({
            message: "Error"
        })
    }
}
const disable = async (req, res) => {
    try {

        const _id = new mongoose.Types.ObjectId(req.params.id)

        const name = req.body.name
        supplier.findByIdAndUpdate(_id, { $set: { enabled: false } })
            .then(() => {
                Product.updateMany({ supplier: name }, { $set: { view: false } }).then(() => {
                    res.json({
                        message: 'disabled'
                    })
                })

            })
            .catch(error => {
                console.log(error);
                res.json({

                    message: 'An error Occured!'
                })
            })
    } catch (error) {
        console.log(error)
        res.json({
            message: "Error"
        })
    }
}
module.exports = {
    signUp, login, show, hide, CreateProduct, myProducts, Allsuppliers, enable, disable
}