const express = require('express');
const https = require('https')
const request = require('request');
const router = express.Router();


router.get('/', (req,res)=>{
    const data = {client_id:process.env.CLIENT_ID, redirectURI:process.env.REDIRECT_URI};
    res.render('index',data);
});

router.get('/dashboard', (req,res)=>{
    res.render('dashboard');
});

router.get('/authFailed', (req,res)=>{
    res.render('failed');
});


module.exports = router;