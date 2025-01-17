import categorySchema from "../models/categorySchema.js";
import productSchema from "../models/productSchema.js";
class CategoryController {
  async getAllCategorys(req, res) {
    try {
      const data = await categorySchema
        .find()
        .populate("productId")
        .sort({ createdAt: -1 });
      if (data) {
        return res.status(201).send({
          message: "GetAll Categorys Successfully",
          data,
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  async getCategoryById(req, res) {
    try {
      const data = await categorySchema
        .findById(req.params.id)
        .populate("productId");
      if (data) {
        return res.status(201).send({
          message: "GetCategoryById Successfully",
          data,
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  async getCategoryBySlug(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 4;
      const data = await categorySchema
        .findOne({ slug: req.params.slug })
        .populate({
          path: "productId",
          options: {
            skip: (page - 1) * limit,
            limit: limit,
          },
        });
      const dataCate = await categorySchema.findOne({ slug: req.params.slug });
      const count = dataCate.productId.length;
      if (data) {
        return res.status(201).send({
          message: "GetCategoryBySlug Successfully",
          data: {
            ...data.data,
            productId: [
              data.productId,
              {
                totalPages: Math.ceil(count / limit), // Làm tròn tổng số trang
                currentPage: page,
              },
            ],
          },
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  async postCategory(req, res) {
    try {
      const checkSlug = await categorySchema.findOne({ slug: req.body.slug });
      if (checkSlug) {
        return res.status(400).send({
          message: "Slug is infected",
        });
      }
      const data = await categorySchema.create(req.body);
      return res.status(200).json({
        status: true,
        message: "Add Category Successfully",
        data,
      });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  async updateCategory(req, res) {
    try {
      const data = await categorySchema.findByIdAndUpdate(
        `${req.params.id}`,
        req.body,
        {
          new: true,
        }
      );
      if (data) {
        return res.status(200).send({
          status: true,
          message: "Update Category Successfully",
          data,
        });
      } else {
        return res
          .status(400)
          .send({ status: false, message: "Update Category False" });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  //update status category

  async updateStatusCategory(req, res) {
    try {
      const { status } = req.body;
      const data = await categorySchema.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (data) {
        return res.status(200).send({
          message: "Update Status Successfully !",
          data,
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  async removeCategoryById(req, res) {
    try {
      if (req.params.id === "66979f7841d46e0b5018548f") {
        return res.status(400).json({
          message: "Không thể xoá danh mục mặc định",
        });
      }

      // Cập nhật lại sản phẩm trong danh mục bị xóa về danh mục mặc định
      // B1: Lấy ra tất cả sản phẩm trong danh mục bị xóa
      const categorysToUpdate = await productSchema.find({
        category: req.params.id,
      });
      // B2: Thực hiện cập nhật lại sản phẩm đó về danh mục mặc định
      await Promise.all(
        categorysToUpdate.map(async (product) => {
          product.categoryId = "66979f7841d46e0b5018548f";
          await product.save();
        })
      );

      const data = await categorySchema.findByIdAndDelete(req.params.id);
      if (data) {
        return res.status(200).json({
          message: "Delete Category Successfully!",
          data,
        });
      }
      return res.status(400).json({ message: "Xóa danh mục thất bại" });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  // Xóa mềm Category trong MongoDB
  async softRemoveCategoryById(req, res) {
    try {
      const data = await categorySchema.findByIdAndUpdate(
        `${req.params.id}`,
        req.body.status,
        {
          new: true,
        }
      );
      if (data) {
        return res.status(200).send({
          status: true,
          message: "Soft Remove Category Successfully",
        });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
}

export default CategoryController;
