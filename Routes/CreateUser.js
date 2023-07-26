const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

const bcrypt =require("bcrypt");
const jwt=require("jsonwebtoken");
const jwtsecret = "Thereisnosecrethere";

router.post("/createuser", [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'Incorrect password').isLength({ min: 5 })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({ errors: errors.array() });
        }
        const salt=await bcrypt.genSalt(10);
        let secpassword = await bcrypt.hash(req.body.password,salt);
        try {
            await User.create({
                name: req.body.name,
                password: secpassword,
                email: req.body.email,
                location: req.body.location
            })
            res.json({ success: true });
        } catch (error) {
            console.error();
            res.json({ success: false });
        }
    })

router.post("/loginuser", [
    body('email').isEmail(),
    body('password', 'Incorrect password').isLength({ min: 5 })
], async (req, res) => {
    let email = req.body.email;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ errors: errors.array() });
    }
    try {
        let userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ errors: "This email isn't registered yet" });
        }

        const pwdcompare = await bcrypt.compare(req.body.password,userData.password);
        if (!pwdcompare) {
            return res.status(400).json({ errors: "Incorrect Password" });
        }
        const data={
            user:{
                id:userData.id
            }
        }
        const authToken = jwt.sign(data,jwtsecret);
        res.json({ success: true ,authToken:authToken});
        

    } catch (error) {
        console.error();
        res.json({ success: false });
    }
})

module.exports = router;