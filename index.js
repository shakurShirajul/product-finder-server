import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { database } from './database/mongodb.js';

// Schema
import { Products } from './models/products';

const app = express();
const PORT = process.env.PORT || 5000;

database();

// MiddleWares
app.use(express.json());
app.use(cookieParser());

app.get("/", async(req,res)=>{
    res.send("Hello World");
});

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}` );
})