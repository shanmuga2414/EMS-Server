const Joi = require('joi');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: 'spriya.hby@gmail.com', // generated ethereal user
    pass: 'sweetFriends24' // generated ethereal password
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res.send(token);
});

router.post('/checkEmail', async (req, res) => {

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email not registered create a new account');

  if (!user.password) {

    const msg = `<p><a href="http://localhost:3000/createPassword">Click here to create new pasword</a></p>`;


    let mailOptions = {
      from: '"Ilife" <shanmuga.hdb@gmail.com>',
      to: user.email,
      subject: 'Create your new pasword',
      html: msg
    };
    console.log(mailOptions);
    // let info = await transporter.sendMail(mailOptions)
    // if (info) {
    //   console.log(info);
    // } else {
    //   console.log('error');
    // }
    return res.status(400).send('Check your email to create your new password');
  } else {
    const token = user.generateAuthToken();
    res.send(token);
  }

  // if (!user.password) {
  //   return res.status(400).send('Email not registered create a new account');
  // } else {
  //   const validPassword = await bcrypt.compare(req.body.password, user.password);
  //   if (!validPassword) return res.status(400).send('Invalid email or password.');
  //   const token = user.generateAuthToken();
  //   res.send(token);
  // }

});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
