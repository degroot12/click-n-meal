const router = require('express').Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model.js')
const IngredientsModel = require('../models/Ingredients.model.js')
const RecipeModel = require('../models/Recipe.model.js')
const uploader = require('../middlewares/cloudinary.config');

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

// GET create
router.get('/create', checkLoggedInUser, (req, res, next) => {
  let username = req.session.loggedInUser.username;
  
  IngredientsModel.find({})
  .then((data) => {
    let allIngr = data
    res.render('private/create.hbs', {allIngr, username})
  })
  .catch((err) => {
    console.log(err)
  })
})

// GET edit
router.get('/edit/:id', checkLoggedInUser, (req, res, next) => {
  let username = req.session.loggedInUser.username;
  const id = req.params.id

  RecipeModel.findById(id)
    .populate('allIngr')
    .then((recipe) => {
      res.render('private/edit.hbs', {recipe, username})
      // console.log(recipe)
    })
    .catch((err) => {
      next(err)
    })  
})

// POST edit
router.post('/edit/:id', checkLoggedInUser, (req, res, next) => {
  const{recipeName} = req.body
  const id = req.params.id

  let updateRecipe = {
    name: recipeName
  }

  RecipeModel.findByIdAndUpdate(id, updateRecipe)
    .then(() => {
      res.redirect('/selector')
      console.log('save ', updateRecipe)
    })
    .catch((err) => {
      next(err)
    })
})

// router.get('/', checkLoggedInUserHome, (req, res, next) => {
//   let email = req.session.loggedInUser.email;
//   res.render('public/selector.hbs', {email})
// })

//GET ROUTE FOR UPLOADING PHOTO
router.get('/upload', (req, res, next) => {
  res.render('private/uploading.hbs')
})

// POST ROUTE OR CLOUDINARY UPLOAD
router.post('/upload', uploader.single('image'), (req, res, next) => {
  console.log('pic info',req.file)
  let picUrl = req.file.path
  const picSend = encodeURIComponent(picUrl)
  console.log('The is the pic we want to send', picSend)
  console.log(decodeURIComponent(picSend))
  res.redirect('/create/?picture=' + picSend)
  // RecipeModel.findByIdAndUpdate(req.session.recipe._id, {recipePic:req.file.path})
  //   .then(() => {
  //     res.redirect('/create')
  //   })
})


// LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;