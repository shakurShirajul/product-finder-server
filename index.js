import express, { response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { database } from "./database/mongodb.js";

// Schema
import { Products } from "./models/products.js";

const app = express();
const PORT = process.env.PORT || 5000;

database();

// MiddleWares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.send("Hello World");
});

// Products Routes

app.get("/products-length", async (req, res) => {
  const products = await Products.find({});
  res.send(products);
});

app.get("/products", async (req, res) => {
  let products = [];

  if (req.query.name) {
    /// Search Functionality
    // console.log("Search");
    products = await Products.find({
      $text: {
        $search: req.query.name,
        $caseSensitive: false,
      },
    });
  } else if (req.query.filters) {
    /// Filter Functionality
    const filter = req.query.filters;
    if (filter === "LowToHigh") {
      products = await Products.find({}).sort({ price: 1 });
    } else if (filter === "HighToLow") {
      products = await Products.find({}).sort({ price: -1 });
    } else if (filter === "NewFirst") {
      products = await Products.find({}).sort({ date: -1 });
    }
    /* Brand and Category Checked Box */
  } else if (
    req.query.brandChecked ||
    req.query.categoryChecked ||
    req.query.minPrice ||
    req.query.maxPrice ||
    req.query.page
  ) {
    console.log(req.query.brandChecked, "--", req.query.categoryChecked);

    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

    const page = parseInt(req.query.page);

    let checkedBrand = [],
      checkedCategory = [];

    if (req.query.brandChecked) {
      checkedBrand = req.query.brandChecked.split(",");
    }
    if (req.query.categoryChecked) {
      checkedCategory = req.query.categoryChecked.split(",");
    }

    const query = {};

    if (checkedBrand.length > 0) query.brand = { $in: checkedBrand };

    if (checkedCategory.length > 0) query.category = { $in: checkedCategory };

    query.price = {
      $gte: minPrice,
      $lte: maxPrice,
    };

    products = await Products.find(query)
      .skip(page * 10)
      .limit(10);
  } else {
    products = await Products.find({}).skip(0 * 10)
    .limit(10);
  }
  res.send(products);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
