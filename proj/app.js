var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-sessions')
var expressejsLayout = require('express-ejs-layouts')
var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
require('dotenv').config()
var app = express();
require('./db/db')
const Item = require('./models/Item')
const User = require('./models/user')
const Order = require('./models/Order')





// view engine setup
app.use(expressejsLayout)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




var	passport = require("passport") 
const	LocalStrategy = require("passport-local")
app.use(require('express-session')({ 
	secret: "Rusty is a dog", 
	resave: false, 
	saveUninitialized: false
})); 

app.use(passport.initialize()); 
app.use(passport.session()); 

passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 


app.get('*',function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});



//===================== 
// ROUTES 
//===================== 

// Showing home page 
app.get("/", async (req, res)=> { 
  var items = await Item.find()
	res.render("index",{'items':items}); 
}); 
app.get("/contact", function (req, res) { 
	res.render("contact"); 
}); 
app.get("/cart", function (req, res) { 
	res.render("cart");
}); 
// Showing secret page 
app.get("/secret", isLoggedIn, async(req, res)=> { 
	var orders = await Order.find();
	var items = await Item.find();
	orders.sort(function(a,b){
    if(a._id > b._id) return -1;
    if(a._id < b._id) return 1;
    return 0;
});
	res.render("secret",{'orders':orders,'items':items}); 
}); 

// Showing register form 
app.get("/account/register", function (req, res) { 
	res.render("register"); 
}); 

// Handling user signup 
app.post("/account/register", function (req, res) { 
	var username = req.body.username 
	var password = req.body.password 
	User.register(new User({ username: username }), 
			password, function (err, user) { 
		if (err) { 
			console.log(err); 
			return res.render("register"); 
		} 

		passport.authenticate("local")( 
			req, res, function () { 
			res.render("secret"); 
		}); 
	}); 
}); 

//Showing login form 
app.get("/account/login", function (req, res) { 
	res.render("login"); 
}); 

//Handling user login 
app.post("/account/login", passport.authenticate("local", { 
	successRedirect: "/secret", 
	failureRedirect: "/account/login"
}), function (req, res) { 
}); 

//Handling user logout 
app.get("/logout", function (req, res) { 
	req.logout(); 
	res.redirect("/"); 
}); 

function isLoggedIn(req, res, next) { 
	if (req.isAuthenticated())
		req.isLogged = true; return next();
	res.redirect("/login"); 
} 




app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3000);

module.exports = app;
 