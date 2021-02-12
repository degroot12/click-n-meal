// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// default value for title local
const projectName = "click-n-meal";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Get your recipe in one click`;


const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const  mongoose = require("mongoose");


app.use(session({
  secret: 'secretMeal',
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  cookie: {
    maxAge: 1000*3600*24// in miliseconds
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 3600*24, // expiring in 1 day
  })
}));


// 👇 Start handling routes here
// const index = require("./routes/index");
// app.use("/", index);

const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

const publicRoutes = require('./routes/public.routes')
app.use('/', publicRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

//test test

module.exports = app;
