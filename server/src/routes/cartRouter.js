import { Router } from "express";
import CartController from "../controllers/CartController.js";

const cartRouter = Router();
const CartModel = new CartController();

// Lấy tất cả giỏ hàng
cartRouter.get("/", CartModel.getAllCart);
// Lấy giỏ hàng theo user
cartRouter.get("/:userId", CartModel.getCartByUser);
// Xóa sản phẩm khỏi giỏ hàng
cartRouter.put("/:userId/:idPro", CartModel.deleteProductCart);
// Thêm giỏ hàng
cartRouter.post("/", CartModel.addProductToCart);
// Sửa giỏ hàng
cartRouter.put("/:cartId", CartModel.updateCart);

export default cartRouter;