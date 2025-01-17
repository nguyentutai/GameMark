import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
import validBodyRequest from "../middlewares/vlidateBodyReq.js";
import productSchemaValid from "../validations/productValidate.js";

const productRouter = Router();
const ProductModel = new ProductController();
// http://localhost:3000/api/products/pagination?page=1
productRouter.get("/pagination", ProductModel.pageProduct);
// Lấy tất cả sản phẩm
productRouter.get("/", ProductModel.getAllProduct);
// Lấy sản phẩm theo slug
productRouter.get("/detail/:slug", ProductModel.getProductBySlug);
// Lấy sản phẩm theo id
productRouter.get("/:id", ProductModel.getProductById);
//update status sản phẩm
productRouter.patch("/:id", ProductModel.updateStatusProduct);
// Validate
// productRouter.use("/", validBodyRequest(productSchemaValid));
// Thêm sản phẩm
productRouter.post("/", ProductModel.postProduct);
// Sửa sản phẩm
productRouter.put("/:id", ProductModel.updateProduct);
// Xóa cứng sản phẩm
productRouter.delete("/:id", ProductModel.removeProductById);
// Xóa mềm sản phẩm
productRouter.patch("/:id", ProductModel.softRemoveProductById);
// Tìm kiếm sản phẩm theo tên
productRouter.get("/search/pro", ProductModel.searchProduct);
// Đường dẫn
// http://localhost:3000/api/product/search?keyword="${keyword}"

// Phân trang sản phẩm

export default productRouter;
