"use strict";
const dotenv = require("dotenv");
const compression = require('compression');
const express = require("express");
const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');
const app = express();

dotenv.config({ path: "./config/config.env" });


//connecting the database
connectDB();

app.use(express.static(__dirname + '/public'));
app.use(compression());
app.use(cookieParser());
app.set('view engine', 'ejs');

app.listen(process.env.PORT,console.log(`Started running in ${process.env.NODE_ENV} mode on port http://localhost:${process.env.PORT}.`));

// initiateSubmissionTracker();

app.use(require('./routes/auth')); // routes related to authorization states
app.use(require('./routes/index')); // routes related to finding contests
app.use(require('./routes/virtual')); // routes related to virtual contest