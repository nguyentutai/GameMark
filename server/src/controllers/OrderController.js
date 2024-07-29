import orderSchema from "../models/orderSchema.js";

class OrderController {
  async getAllOrders(req, res) {
    try {
      const data = await orderSchema
        .find()
        .populate("userId")
        .populate("cartItem");
      if (data) {
        return res.status(200).json({
          message: "GetAllOrders Successfully",
          data: data,
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
  async getOrderById(req, res) {
    try {
      const data = await orderSchema
        .findById(req.params.id)
        .populate("userId")
        .populate("cartItem");
      if (data) {
        return res.status(200).json({
          message: "GetOrderById Successfully",
          data: data,
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
  async getOrderByUser(req, res) {
    try {
      const data = await orderSchema
        .findOne({ userId: req.params.userId })
        .populate("userId")
        .populate("cartItem");
      if (data) {
        return res.status(200).json({
          message: "GetOrderByUser Successfully",
          data: data,
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
  async addOrder(req, res) {
    try {
      const data = await orderSchema.create(req.body);
      if (data) {
        return res.status(200).json({
          message: "GetOrderByUser Successfully",
          data: data,
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
  async updateStatusOrder(req, res) {
    try {
      const data = await orderSchema.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
        },
        {
          new: true,
        }
      );
      if (data) {
        return res.status(200).json({
          message: "Update Status Order Successfully",
          data: data,
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
}

export default OrderController;