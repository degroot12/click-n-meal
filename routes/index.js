const router = require("express").Router();

/* GET home page */

const checkLoggedInUserHome = (req, res, next) => {
  if(!req.session.loggedInUser){
    next();
  } else {
    res.redirect('/selector')
  }
};

router.get("/", checkLoggedInUserHome,(req, res, next) => {
  res.render("public/home");
});

module.exports = router;
