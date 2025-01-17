import voucherSchema from "../models/voucherSchema.js";

class VoucherController {
  async getAllVoucher(req, res) {
    try {
      const data = await voucherSchema.find({}).sort({ createdAt: -1 });
      if (data) {
        return res.status(201).send({
          message: "GetAll Voucher Successfully",
          data,
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  async getVoucherById(req, res) {
    try {
      const data = await voucherSchema.findById(req.params.id);
      if (data) {
        return res.status(201).send({
          message: "GetVoucherById Successfully",
          data,
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
  async getVoucherByCode(req, res) {
    try {
      const data = await voucherSchema.findOne({ code: req.params.code });
      if (data) {
        return res.status(201).send({
          message: "GetVoucherByCode Successfully",
          data,
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
  async postVoucher(req, res) {
    try {
      // Thêm voucher
      const data = await voucherSchema.create(req.body);
      if (!data) {
        return res.status(400).json({ message: "Add Voucher False" });
      }
      return res.status(200).json({
        status: true,
        message: "Add Voucher Successfully",
        data,
      });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  async updateVoucher(req, res) {
    try {
      const data = await voucherSchema.findByIdAndUpdate(
        `${req.params.id}`,
        req.body,
        {
          new: true,
        }
      );
      if (data) {
        return res.status(200).send({
          status: true,
          message: "Update Voucher Successfully",
          data,
        });
      } else {
        return res
          .status(400)
          .send({ status: false, message: "Update Voucher False" });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  async updateStatusVoucher(req, res) {
    try {
      const { status } = req.body;
      const data = await voucherSchema.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (data) {
        return res.status(200).send({
          message: "Update Status Voucher Successfully",
          data,
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  // Xóa cứng
  async removeVoucherById(req, res) {
    try {
      const data = await voucherSchema.findByIdAndDelete(req.params.id);
      if (data) {
        return res.send({
          message: "Remove Voucher Successfully",
          data: data,
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  // Xóa mềm Voucher trong MongoDB
  async softRemoveVoucherById(req, res) {
    try {
      const data = await voucherSchema.findByIdAndUpdate(
        `${req.params.id}`,
        req.body.status,
        {
          new: true,
        }
      );
      if (data) {
        return res.status(200).send({
          status: true,
          message: "Soft Remove Voucher Successfully",
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
}

export default VoucherController;
