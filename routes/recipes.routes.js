const router = require('express').Router();
const RecipeModel = require('../models/Recipe.model.js')
const IngredientsModel = require('../models/Ingredients.model.js')
const axios = require('axios')
const uploader = require('../middlewares/cloudinary.config');
const UserModel = require('../models/User.model.js')

// PROTECTED ROUTES
const checkLoggedInUser = (req, res, next) => {
  if(req.session.loggedInUser){
    next();
  } else {
    res.redirect('/signin')
  }
};

// GET create
router.get('/create', checkLoggedInUser, (req, res, next) => {
  let username = req.session.loggedInUser.username;

  let pictureUploaded 
  if (Object.keys(req.query).length!=0) {
    pictureUploaded = req.query.picture
  }
  console.log('The picture has been uploaded',pictureUploaded)
  // 
  IngredientsModel.find({})
  .then((data) => {
    let allIngr = data

    res.render('private/create.hbs', {allIngr, username, pictureUploaded})
  })
  .catch((err) => {
    console.log(err)
  })
})

// POST route for create
router.post('/create', (req, res, next) => {
  let username = req.session.loggedInUser.username;
  let userPerson = req.session.loggedInUser

  const {newIngredients, elemenRecipeName, elemenDescription,
    elemenInstructions, elemenMealType, elemenTime, elemenPrice, elemenImage, elemenCreator, elemenSource} = req.body
  
    const newRecipe = {
    name:elemenRecipeName, 
    description:elemenDescription,
    ingredients: newIngredients,
    time: elemenTime,
    source:elemenSource,
    creator:username,
    mealType:elemenMealType,
    priceCategory: elemenPrice,
    instructions: elemenInstructions,
    image: elemenImage
  }
  const msg = 'Your recipe has succesfully been created'

  console.log('check here')
  
  RecipeModel.create(newRecipe)
    .then(() => {      
    //   // after creating, show message of succesfully created     
    //   // render does not work because of using axios.post in handlebar 'create' 
    console.log('-----', UserModel)
      // UserModel.findOneAndUpdate({creator: username}, {favoRecipe: newRecipe}, {new: true})
      // //console.log(newRecipe)
      userPerson.favoRecipe.push(newRecipe)
      console.log(userPerson.favoRecipe)
    })
    
    .then((recipe) => {
      console.log('---yeahhh----')
      res.render('private/create.hbs', {recipe, username, msg})
    })

    .catch((err) => {
      next(err)
    })

  // UserModel.findOneAndUpdate({creator: username}, {$push: {favoRecipe: newRecipe}}, {new: true}
  // )
  //   console.log("userMOdel",UserModel)

})

// GET /edit/:id
router.get('/edit/:id', checkLoggedInUser, (req, res, next) => {
  let username = req.session.loggedInUser.username;
  const id = req.params.id

  RecipeModel.findById(id)
    .populate('allIngr')
    .then((recipe) => {
      res.render('private/edit.hbs', {recipe, username})
      console.log('id (get): ', recipe.id)
    })
    .catch((err) => {
      next(err)
    })  
})

//POST route for editing
router.post('/edit/:id', (req, res, next) => {
  const id = req.params.id;
 
  // todo: adding updating drop down list 
  const editedRecipe = {
    name:req.body.recipeName, 
    description:req.body.description,
    // mealType: req.body.mealType, 
    time: req.body.time,
    // price: req.body.price,
    instructions: req.body.instructions,
    source: req.body.source   
  }

  // price, image, instructions, creator, source
  console.log('editR: ', editedRecipe)
  const msgEdit = 'Your recipe is succesfully updated!'

  RecipeModel.findByIdAndUpdate(id, editedRecipe)
    .then(() => {
      res.redirect(`/recipe/${id}/?passMsgEdit=${msgEdit}`)
      console.log('check 2: ', editedRecipe, msgEdit)
    })
    .catch((err) => {
      next(err)
    })
})

// POST /recipe/delete
router.post('/recipe/delete/:id', (req, res, next) => {
  const id = req.params.id;
  const msgDeleted = decodeURIComponent('Your recipe is succesfully deleted!')
  console.log('check delete ---------------')

  RecipeModel.findByIdAndDelete(id)
    .then(() => {
      res.redirect(`/selector`)
      // res.redirect(`/selector/${id}/?passMsgEdit=${msgDeleted}`)

      console.log('deleted ok')
    })
    .catch((err) => {
      next(err)
    })

})

//GET ROUTE FOR UPLOADING
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



module.exports = router
