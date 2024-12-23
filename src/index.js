import express from "express"
import app from "./app.js"
import connectDB from './config/db.js'

import dotenv from "dotenv"
import bodyParser from "body-parser"
dotenv.config({
    path: './.env'
})


const Port = process.env.PORT || 8081

connectDB()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.listen(Port, () => {
    console.log(`port is${Port}`)
})
