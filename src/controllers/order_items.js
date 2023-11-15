const Order_items = require("../models/Order_items");
const Cart = require("../models/cart");
const Product = require("../models/product.js");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const emailController = require("./ordermail");
require("dotenv").config();

module.exports.Create_order_item = async (req, res) => {
  const body = req.body;

  let list = [];
  let suppliers = [];

  for (var i = 0; i < body.cartItems.length; i++) {
    await Product.findById(body.cartItems[i].product_id).then(
      async (product) => {
        var quantity = product.quantity;
        quantity[body.cartItems[i].size] =
          quantity[body.cartItems[i].size] - body.cartItems[i].quantity;
        body.cartItems[i].image = product.images[0];
        body.cartItems[i].SKU = product.SKU;
        body.cartItems[i].name = product.name;
        if (!suppliers.includes(product.supplier)) {
          suppliers.push(product.supplier);
        }
        await Product.findByIdAndUpdate(body.cartItems[i].product_id, {
          $set: { quantity: quantity },
        }).then(async (product1) => {
          await Cart.findOneAndDelete({
            product_id: body.cartItems[i].product_id,
            user_id: req.body.decoded.id,
          }).then((e) => {
            list.push("Done");
          });
        });
      }
    );
  }

  if (list.length === body.cartItems.length) {
    await add_order_item(
      body,
      req.body.decoded.id,
      suppliers,
      req.body.decoded.email
    )
      .then((e) => {
        // emailController.sendMail(
        //   req.body.decoded.email,
        //   e.firstName,
        //   e._id,
        //   e.totalPrice
        //);
        return res.status(200).json(e);
      })
      .catch((err) => {
        console.log("err", err);
        return res.json(err);
      });
  }
};

const add_order_item = async (body, id, suppliers, email) => {
  const newOrder_item = new Order_items({
    user_id: id,
    email: email,
    products: body.cartItems,
    phone: body.phone,
    country: body.country,
    house: body.house,
    name: body.name,
    // lastName: body.lastName,
    address: body.address,
    city: body.city,
    // zipCode: body.zipCode,
    payment: body.payment,
    totalPrice: body.totalPrice,
    status: "processing",
    suppliers: suppliers,
    returnrequest: "none",
  });
  await newOrder_item.save();
  return newOrder_item;
};

module.exports.Read_order_items = async (req, res) => {
  await Order_items.find({ returnrequest: "none" })
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(401).json({ error: err.message });
    });
};

module.exports.getOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order_items.findOne({ _id: id });
    res.status(200).json(order);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports.Supplier_order_items = async (req, res) => {
  await Order_items.find({
    suppliers: req.body.decoded.name,
    returnrequest: "none",
  })
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(401).json({ error: err.message });
    });
};
module.exports.Supplier_return_items = async (req, res) => {
  await Order_items.find({
    suppliers: req.body.decoded.name,
    returnrequest: { $ne: "none" },
  })
    .then((e) => {
      console.log(e);
      return res.status(200).json(e);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(401).json({ error: err.message });
    });
};

module.exports.Delete_order_item = async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  const oi = await Order_items.findById(_id);
  if (!oi) {
    return res.status(404).json({ error: "can't delete order item not found" });
  }
  await Order_items.findByIdAndDelete(_id)
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(401).json({ error: err.message });
    });
};

module.exports.Update_order_item = async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  const order_item = req.body;
  const oi = await Order_items.findById(_id);
  if (!oi) {
    return res.status(404).json({ error: "can't update order item not found" });
  }
  await Order_items.findByIdAndUpdate(_id, order_item, { new: true })
    .then((e) => {
      ///   if(e.returnrequest==="accepted"|| e.returnrequest==="denied"){
      ///    emailController.returnsMail(e.firstName,e._id,e.returnrequest)}
      return res.status(200).json(e);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(401).json({ error: err.message });
    });
};
module.exports.start_return = async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  const oi = await Order_items.findById(_id);
  if (!oi) {
    return res.status(404).json({ error: "can't update order item not found" });
  }
  await Order_items.findByIdAndUpdate(
    _id,
    { returnrequest: "requested" },
    { new: true }
  )
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(401).json({ error: err.message });
    });
};
module.exports.User_Orders = async (req, res) => {
  const id = req.body.decoded.id;
  await Order_items.find({ user_id: id, returnrequest: "none" })
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(401).json({ error: err.message });
    });
};
module.exports.User_returns = async (req, res) => {
  const id = req.body.decoded.id;
  await Order_items.find({ user_id: id, returnrequest: { $ne: "none" } })
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(401).json({ error: err.message });
    });
};
module.exports.returns = async (req, res) => {
  await Order_items.find({ returnrequest: { $ne: "none" } })
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(401).json({ error: err.message });
    });
};

module.exports.User_Admin_OView = async (req, res) => {
  if (req.body.decoded.admin) {
    const id = req.body.id;
    await Order_items.find({ user_id: id, returnrequest: "none" })
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err.message);
        return res.status(401).json({ error: err.message });
      });
  } else {
    return res.status(401).json({ error: "Auth problem" });
  }
};
module.exports.User_Admin_RView = async (req, res) => {
  if (req.body.decoded.admin) {
    const id = req.body.id;
    console.log(id);
    await Order_items.find({ user_id: id, returnrequest: { $ne: "none" } })
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err.message);
        return res.status(401).json({ error: err.message });
      });
  } else {
    return res.status(401).json({ error: "Auth problem" });
  }
};
module.exports.stat = async (req, res) => {
  try {
    if (req.body.decoded.admin) {
      const all = await Order_items.count({ returnrequest: "none" });
      const completed = await Order_items.count({
        status: "completed",
        returnrequest: "none",
      });
      const cancelled = await Order_items.count({
        status: "cancelled",
        returnrequest: "none",
      });
      const arr = [all, completed, cancelled];
      console.log(arr);
      return res.json({
        response: arr,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({ msg: "err" });
  }
};

module.exports.Update_many = async (req, res) => {
  const ids = req.body.ids;
  const stat = req.body.status;
  await Order_items.updateMany(
    { _id: { $in: ids } },
    { status: stat },
    { new: true }
  )
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(401).json({ error: err.message });
    });
};

module.exports.filter = async (req, res) => {
  const queryObject = req.body.query;
  var query = { returnrequest: "none" };
  if (queryObject.month !== undefined) {
    const [month, year] = queryObject.month.split("/");
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    query.createdAt = { $gte: startDate, $lte: endDate };
  }
  if (queryObject.status !== undefined) {
    query.status = queryObject.status;
  }
  console.log(query);
  await Order_items.find(query)
    .then((e) => {
      console.log(e);
      return res.status(200).json(e);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(401).json({ error: err.message });
    });
};
