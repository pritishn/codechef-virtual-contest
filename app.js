const dotenv = require("dotenv");
const path = require('path');
const morgan = require('morgan');
const express = require("express");
const connectDB = require('./config/db.js')

dotenv.config({ path: "./config/config.env" });

//connecting the database
connectDB();

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.listen(process.env.PORT,console.log(`Started running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}.`));

app.use(require('./routes/auth'));
app.use(require('./routes/index'));