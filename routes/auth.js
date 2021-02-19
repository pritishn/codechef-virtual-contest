const express = require('express');
const router = express.Router();
const {initiateAuthorization} = require('../api_helpers/token');

router.get('/authDone', async (req,res)=>{
    let authCode = req.query.code, state = req.query.state;
    let done = await initiateAuthorization(authCode,state);
    if(done){
        res.redirect('/dashboard');

    }else{
        res.redirect('/authFailed');
    }
});


module.exports = router;