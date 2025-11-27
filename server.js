const express = require("express");
const dotenv = require('dotenv');
const appRouter = require("./routes/app")
const cors = require("cors")
const jwt = require("jsonwebtoken");
const cookieParser =require("cookie-parser");
dotenv.config();

const app = express();
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 3000;

app.use("/app", appRouter)

app.listen(port, ()=>{
    console.log(`Server Up At ${port}`);
})