import Product from "../models/Product.js";
import crypto from "crypto";

export const getProducts = async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
};

export const addProduct = async (req, res) => {
  try {
    // destructure request body
    const { name, price, description  , company_id } = req.body;

    // ✅ Validate required fields
    if (!name || !price || !company_id ) {
      return res.status(400).json({ message: "Name, price, company, social media type, and social media product link are required." });
    }

    // if image uploaded
    const image = req.file ? req.file.filename : null;
    // res.json(req);
    // ✅ Create product with defaults
    const product = await Product.create({
      name,
      price,
      description: description || "",
      company_id: req.body.company_id || null,
    //   social_media_type: req.body.social_media_type || "unknown",
    //   social_media_product_link: req.body.social_media_product_link || "unknown",
      image,
      encrypt_id: crypto
        .createHash("md5")
        .update(Date.now().toString())
        .digest("hex"),
      status: "active", // ✅ default custom field
      stock: 0,         // ✅ example default value
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


