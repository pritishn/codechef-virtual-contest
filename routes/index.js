const express = require('express');
const https = require('https')
const request = require('request');
const router = express.Router();

router.get('/dashboard', (req,res)=>{
    res.render('dashboard');
});

router.get('/authFailed', (req,res)=>{
    res.render('dashboard');
});


module.exports = router;