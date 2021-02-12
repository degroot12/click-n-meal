const router = require('express').Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model.js')


// GET route Profile
router.get('/profile', (req, res, next) => {
  res.render('private/profile.hbs')
});



module.exports = router;
