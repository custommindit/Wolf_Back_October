const Order_items = require("../models/Order_items");
const Cart = require("../models/cart");
const Product = require("../models/product.js");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
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
  Order_items.find({})
    .sort({ updatedAt: -1 })
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
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
      return res.status(401).json({ error: err.message });
    });
};
module.exports.Supplier_return_items = async (req, res) => {
  await Order_items.find({
    suppliers: req.body.decoded.name,
    returnrequest: { $ne: "none" },
  })
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
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
      return res.status(401).json({ error: err.message });
    });
};

const handleWallet = async (oldOrder, order) => {
  if (order.returnrequest !== "none") {
    const { user_id } = order;
    const user = await User.findOne({ _id: user_id });
    const wallet = user?.wallet || 0;

    if (order.returnrequest === "returned") {
      await User.updateOne(
        { _id: user_id },
        { $set: { wallet: wallet + Number.parseInt(order.totalPrice) } }
      );
    } else if (
      oldOrder.returnrequest === "returned" &&
      order.returnrequest !== "returned"
    ) {
      await User.updateOne(
        { _id: user_id },
        { $set: { wallet: wallet - Number.parseInt(order.totalPrice) } }
      );
    }
  }
};

const addOrderItemsToStock = async (order) => {
  let status = true;
  await Promise.all(
    order.products.map(async (product) => {
      const oldProduct = await Product.findOne({ _id: product.product_id });
      await Product.updateOne(
        { _id: product.product_id },
        {
          $set: {
            quantity: {
              [product.size]:
                oldProduct.quantity[product.size] +
                Number.parseInt(product.quantity),
            },
          },
        }
      );
    })
  );
  return status;
};

const subtractOrderItemsFromStock = async (order) => {
  let status = true;
  await Promise.all(
    order.products.map(async (product) => {
      const oldProduct = await Product.findOne({ _id: product.product_id });
      if (
        oldProduct.quantity[product.size] - Number.parseInt(product.quantity) <
        1
      ) {
        status = false;
      } else {
        await Product.updateOne(
          { _id: product.product_id },
          {
            $set: {
              quantity: {
                [product.size]:
                  oldProduct.quantity[product.size] -
                  Number.parseInt(product.quantity),
              },
            },
          }
        );
      }
    })
  );
  return status;
};
const handleReplaceRequest = async (oldOrder, order) => {
  const REQUESTED = "requested";
  const WAITING_FOR_PICK_UP = "waiting for pick up";
  const PICKED_UP = "picked up";
  const REPLACED = "replaced";
  let status = true;

  if (order.replacerequest === REQUESTED) {
    if (
      oldOrder.replacerequest === WAITING_FOR_PICK_UP ||
      oldOrder.replacerequest === PICKED_UP
    ) {
      return await addOrderItemsToStock(order);
    }
  } else if (order.replacerequest === WAITING_FOR_PICK_UP) {
    if (
      oldOrder.replacerequest === REQUESTED ||
      oldOrder.replacerequest === REPLACED
    ) {
      return await subtractOrderItemsFromStock(order);
    }
  } else if (order.replacerequest === PICKED_UP) {
    if (
      oldOrder.replacerequest === REQUESTED ||
      oldOrder.replacerequest === REPLACED
    ) {
      return await subtractOrderItemsFromStock(order);
    }
  } else if (order.replacerequest === REPLACED) {
    if (
      oldOrder.replacerequest === WAITING_FOR_PICK_UP ||
      oldOrder.replacerequest === PICKED_UP
    ) {
      return await addOrderItemsToStock(order);
    }
  }
  return status;
};

const handleReturnRequest = async (oldOrder, order) => {
  const REQUESTED = "requested";
  const WAITING_FOR_PICK_UP = "waiting for pick up";
  const PICKED_UP = "picked up";
  const RETURNED = "returned";
  let status = true;

  if (order.returnrequest === RETURNED && oldOrder.returnrequest !== RETURNED) {
    return await addOrderItemsToStock(order);
  } else if (
    order.returnrequest !== RETURNED &&
    oldOrder.returnrequest === RETURNED
  ) {
    return await subtractOrderItemsFromStock(order);
  }
  return status;
};

const handleBuyRequest = async (oldOrder, order) => {
  // status: processing, shipped, delivered, cancelled
  const PROCESSING = "processing";
  const SHIPPED = "shipped";
  const DELIVERED = "delivered";
  const CANCELLED = "cancelled";
  let status = true;

  if (order.status === PROCESSING) {
    if (oldOrder.status === SHIPPED || oldOrder.status === DELIVERED) {
      return await addOrderItemsToStock(order);
    }
  } else if (order.status === SHIPPED) {
    if (oldOrder.status === PROCESSING || oldOrder.status === CANCELLED) {
      return await subtractOrderItemsFromStock(order);
    }
  } else if (order.status === DELIVERED) {
    if (oldOrder.status === PROCESSING || oldOrder.status === CANCELLED) {
      return await subtractOrderItemsFromStock(order);
    }
  } else if (order.status === CANCELLED) {
    if (oldOrder.status === SHIPPED || oldOrder.status === DELIVERED) {
      return await addOrderItemsToStock(order);
    }
  }
  return status;
};

const handleOrderStatus = async (oldOrder, order) => {
  if (order.replacerequest !== "none") {
    // Replace Request
    return await handleReplaceRequest(oldOrder, order);
  } else if (order.returnrequest !== "none") {
    // Return Request
    return await handleReturnRequest(oldOrder, order);
  } else {
    // Buy Request
    return await handleBuyRequest(oldOrder, order);
  }
};

module.exports.Update_order_item = async (req, res) => {
  const { id } = req.params;
  try {
    const oldOrder = await Order_items.findOne({ _id: id });
    await Order_items.updateOne({ _id: id }, { $set: { ...req.body } });
    const order = await Order_items.findOne({ _id: id });
    const status = await handleOrderStatus(oldOrder, order);
    if (!status) {
      await Order_items.updateOne({ _id: id }, { $set: { ...oldOrder } });
      throw new Error("No Sufficient Quantity");
    }
    await handleWallet(oldOrder, order);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error.message);
  }
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
      return res.status(401).json({ error: err.message });
    });
};
module.exports.returns = async (req, res) => {
  await Order_items.find({ returnrequest: { $ne: "none" } })
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((err) => {
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
        return res.status(401).json({ error: err.message });
      });
  } else {
    return res.status(401).json({ error: "Auth problem" });
  }
};
module.exports.User_Admin_RView = async (req, res) => {
  if (req.body.decoded.admin) {
    const id = req.body.id;
    await Order_items.find({ user_id: id, returnrequest: { $ne: "none" } })
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((err) => {
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
      return res.json({
        response: arr,
      });
    }
  } catch (err) {
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
      return res.status(401).json({ error: err.message });
    });
};

module.exports.filter = async (req, res) => {
  const date = req.query.date;
  const now = Date.now();
  let day = new Date(now).getDate();
  let month = new Date(now).getMonth();
  let year = new Date(now).getFullYear();
  try {
    if (date === "24 Hours") {
      if (day - 1 <= 0) {
        month--;
      } else {
        day--;
      }
      const orders = await Order_items.find({
        createdAt: {
          $gte: new Date(year, month, day),
          $lte: now,
        },
      }).sort({ updatedAt: -1 });
      res.status(200).json(orders);
    } else if (date === "7 Days") {
      if (day - 7 <= 0) {
        month--;
        const offset = day - 7 - 1;
        day = 30 + offset;
      } else {
        day -= 7;
      }
      const orders = await Order_items.find({
        createdAt: {
          $gte: new Date(year, month, day - 7),
          $lte: now,
        },
      }).sort({ updatedAt: -1 });
      res.status(200).json(orders);
    } else if (date === "30 Days") {
      const orders = await Order_items.find({
        createdAt: {
          $gte: new Date(year, month - 1, day),
          $lte: now,
        },
      }).sort({ updatedAt: -1 });
      res.status(200).json(orders);
    } else if (date === "12 Months") {
      const orders = await Order_items.find({
        createdAt: {
          $gte: new Date(year - 1, month, day),
          $lte: now,
        },
      }).sort({ updatedAt: -1 });
      res.status(200).json(orders);
    } else {
      const orders = await Order_items.find({}).sort({ updatedAt: -1 });
      res.status(200).json(orders);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }

  // const queryObject = req.body.query;
  // var query = { returnrequest: "none" };
  // if (queryObject.month !== undefined) {
  //   const [month, year] = queryObject.month.split("/");
  //   const startDate = new Date(year, month - 1, 1);
  //   const endDate = new Date(year, month, 0);
  //   query.createdAt = { $gte: startDate, $lte: endDate };
  // }
  // if (queryObject.status !== undefined) {
  //   query.status = queryObject.status;
  // }
  // await Order_items.find(query)
  //   .then((e) => {
  //     return res.status(200).json(e);
  //   })
  //   .catch((err) => {
  //     return res.status(401).json({ error: err.message });
  //   });
};

module.exports.numOfOrdersWithinDay = async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Set the time to the beginning of the day (midnight)
    currentDate.setHours(0, 0, 0, 0);

    // Find orders created today
    const numOfOrders = await Order_items.countDocuments({
      createdAt: { $gte: currentDate },
    });

    res.json({ numOfOrders });
  } catch (error) {
    console.error("Error in numOfOrdersWithinDay:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.totalPricesWithinDay = async (req, res) => {
  try {
    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    const orders = await Order_items.find({
      createdAt: { $gte: currentDate },
    });

    // Calculate total prices
    const total_Prices_Today = orders.reduce(
      (total, order) => total + parseInt(order.totalPrice),
      0
    );

    res.json({ total_Prices_Today });
  } catch (error) {
    console.error("Error in totalPricesWithinDay:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.totalNumOfOrders = async (req, res) => {
  try {
    // Find the total number of orders
    const totalNumOfOrders = await Order_items.countDocuments();

    res.json({ totalNumOfOrders });
  } catch (error) {
    console.error("Error in totalNumOfOrders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.totalPrices = async (req, res) => {
  try {
    const orders = await Order_items.find();
    const totalPrice = orders.reduce(
      (total, order) => total + parseInt(order.totalPrice),
      0
    );

    res.json({ totalPrice });
  } catch (error) {
    console.error("Error in totalPriceOfAllOrders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.totalPricesByMonthWithinYear = async (req, res) => {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Aggregate to calculate total prices by month within the year
    const result = await Order_items.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: { $toDouble: "$totalPrice" } },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Calculate the total price for the entire year
    const totalYearlyPrice = result.reduce(
      (totalPrice, item) => totalPrice + item.total,
      0
    );

    // Prepare the result to have month names and corresponding total prices
    const formattedResult = result.map((item) => {
      return {
        month: new Date(`${currentYear}-${item._id}-01`).toLocaleString(
          "en-US",
          { month: "long" }
        ),
        totalPrice: item.total.toFixed(2), // Convert back to string with 2 decimal places if needed
      };
    });

    res.json({ totalPricesByMonth: formattedResult, totalYearlyPrice });
  } catch (error) {
    console.error("Error in totalPricesByMonthWithinYear:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.show = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order_items.find({ user_id: id }).sort({
      updateAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
