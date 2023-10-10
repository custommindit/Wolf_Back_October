const User = require("../models/User")
const supplier = require("../models/supplier")
const bcrypt = require("bcrypt")
const { hashSync, genSaltSync } = require("bcrypt");
const jwt = require('jsonwebtoken');
const Product = require("../models/product");
const mongoose = require('mongoose')
require("dotenv").config();

const allSuppliers = async (req, res) => {
    try {
        supplier.find().then((product) => {
            if (product.supplier !== decoded.name) {
                return res.json({
                    message: "Error"
                })
            }

        })
    } catch (error) {
        res.json({
            message: "Error"
        })
    }
}

const createSupplier = async (req, res) => {
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
            ban: false
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

const banSupplier = async (req, res) => {
    try {
        supplier.findByIdAndUpdate(req.params.id, { $set: { ban: true } }, { new: true })
            .then(() => {
                res.json({
                    message: 'ban'
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

const unbanSupplier = async (req, res) => {
    try {
        supplier.findByIdAndUpdate(req.params.id, { $set: { ban: false } }, { new: true })
            .then(() => {
                res.json({
                    message: 'unban'
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

const updateSupplier = async (req, res) => {
    try {
        supplier.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name} }, { new: true })
            .then(() => {
                res.json({
                    message: 'updated'
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

const deleteSupplier = async (req, res) => {
    try {
        supplier.findByIdAndDelete(req.params.id)
            .then(() => {
                res.json({
                    message: 'Deleted'
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

module.exports = {
    allSuppliers, createSupplier, login, banSupplier, unbanSupplier, updateSupplier, deleteSupplier
}