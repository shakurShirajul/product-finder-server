import express from "express";
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
app.get("/products", async (req, res) => {
  let products = [];
  if (req.query.name) {
    console.log("Search");
    products = await Products.find({
      $text: {
        $search: req.query.name,
        $caseSensitive: false,
      },
    });
  } else if (req.query.filters) {
    const filter = req.query.filters;
    console.log(filter);
    if (filter === "LowToHigh") {
        products = await Products.find({}).sort({price: 1});
        console.log(products);
    } else if (filter === "HighToLow") {
    } else if (filter === "NewFirst") {
    }
  } else {
    products = await Products.find({});
  }
  res.send(products);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
