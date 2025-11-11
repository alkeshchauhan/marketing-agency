import express from "express";
import { getUsers, addUser, updateUser, deleteUser, getUserDetail } from "../controllers/userController.js";
import { addProduct, getProducts } from "../controllers/productController.js";
import { saveSearch } from "../controllers/searchController.js";
import upload from "../middleware/upload.js";
// import auth from "../middleware/auth.js";

const router = express.Router();
router.get("/users/", getUsers);
router.post("/users/", addUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/users/:id", getUserDetail);

/* product routes */
router.get('/products/:id', getProducts);
// router.post('/products/', upload.single("image"), addProduct);
/* search routes */
router.post('/log/', saveSearch);

export default router;
