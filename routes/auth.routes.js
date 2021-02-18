const router = require('express').Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model.js')
const RecipeModel = require('../models/Recipe.model.js')


// GET Route Sign-up Page
router.get('/signup', (req, res, next) => {
  res.render('auth/signup.hbs')
});

// GET Route for Sign-in
router.get('/signin', (req, res, next) => {
  res.render('auth/signin.hbs')
});

// POST Route for Sign-up
router.post('/signup', (req, res, next) => {
  const{username, email, password} = req.body
  
  // Validating
  if(!username.length || !email.length || !password.length){
    res.render('auth/signup.hbs', {msg: 'Please enter all fields'})
    return
  }

  // Email Validation
  let re = /\S+@\S+\.\S+/;
  if(!re.test(email)){
    res.render('auth/signup', {msg: 'Email not in valid format'})
    return
  }

  // PASSWORD VALIDATION
  // let regexPass = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/;
  // if (!regexPass.test(password)) {
  //    res.render('auth/signup', {msg: 'Password needs to have special characters, some numbers and be 6 characters atleast'})
  //    return;
  // }

  //Hashing the password
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  UserModel.create({username, email, password: hash})
    .then(() => {
      console.log(hash)
      res.redirect('/')
    })
    .catch((err) => {
      next(err)
    })
});

// POST Route for Sign-in
router.post('/signin', (req, res, next) => {
  const{email, password} = req.body

  UserModel.findOne({email})
    .then((result) => {
      if(result){
        let isMatching = bcrypt.compare(password, result.password)
          if(isMatching){
            req.session.loggedInUser = result
            res.redirect('/selector')
          }
          else {
            res.render('auth/signin.hbs', {msg: 'Wrong password'})
          }
      }
      else {
        res.render('auth/signin.hbs', {msg: 'This email does not exist'})
      }
    
    })
    .catch((err) => {
      next(err)
    })
});

// PROTECTED ROUTES
const checkLoggedInUser = (req, res, next) => {
  if(req.session.loggedInUser){
    next();
  } else {
    res.redirect('/signin')
  }
};

// GET profile
router.get('/profile', checkLoggedInUser, (req, res, next) => {
  let email = req.session.loggedInUser.email;
  let username = req.session.loggedInUser.username;
  
  res.render('private/profile.hbs', {email});
});

// LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;