const dotenv = require("dotenv");
const path = require('path');
const morgan = require('morgan');
const express = require("express");


dotenv.config({ path: "./config/config.env" });

const app = express();

app.set('view engine', 'ejs');

app.listen(process.env.PORT,console.log(`Started running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}.`));

app.get('/',(req,res)=>{res.render('index');});