var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressejsLayout = require('express-ejs-layouts')
var flash = require('express-flash')
//var usersRouter = require('./routes/users');
require('dotenv').config()
var app = express();
const db=require('./db/db')
const Item = require('./models/Item')
const User = require('./models/user')
const Order = require('./models/Order')
var session = require('express-session')
var	passport = require("passport") 
const LocalStrategy = require("passport-local");
const MongoStore= require('connect-mongo')(session);





// view engine setup
app.use(expressejsLayout)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash())


//session-store
const mongostore =new MongoStore({
	mongooseConnection: db ,
	collection : "session"

})
app.use(session({ 
	secret: "Rusty is a dog", 
	resave: false, 
	saveUninitialized: false,
	cookie:{maxAge:1000*24*60*60*2},
	//cookie:{maxAge:1000},

	store:mongostore
})); 

app.use(passport.initialize()); 
app.use(passport.session()); 

passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 




//===================== 
// ROUTES 
//===================== 

// Showing home page 

app.use((req,res,next)=>{
	try{
	res.locals.session = req.session ;
	res.locals.user = req.user || null;
	next()
	}catch{
		res.send("Error")
	}
})
app.get("/", async (req, res)=> { 
  var items = await Item.find()
	res.render("index",{'items':items}); 
}); 
app.get("/contact", function (req, res) { 
	res.render("contact"); 
}); 

// Showing secret page 
app.get("/secret", isLoggedIn, function (req, res) { 
	res.render("secret"); 
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


//cart 

app.get("/cart", function (req, res) { 
	res.render("cart");
}); 

app.post("/add_to_cart",(req,res)=>{
	
	const item = req.body ;
	console.log(item)
	if(!req.session.cart){
		req.session.cart ={
			items :{},
			totalQty : 0 ,
			totalPrice :0 
		}
	}
	let cart = req.session.cart ;
	if(!cart.items[item._id]){
        cart.items[item._id]={
			item : item ,
			qty : 1
		}
		cart.totalQty+=1 ;
		cart.totalPrice += item.price ;
		
	}else{
		cart.items[item._id].qty+=1 ;
		cart.totalQty+=1 ;
		cart.totalPrice += item.price ;
	}

	req.session.cart = cart ;
	console.log(cart)
	res.send({
		"total" :cart.totalQty
	})
})

app.post('/order',async (req,res)=>{
	const cart = req.session.cart ;

	const {name }= req.body ;
	if(!name){
		req.flash('error',"Name is required")
		res.redirect('/cart')
	}
	const order = await new Order({
		items :[],
		name :name ,
		totalPrice :cart.totalPrice,
		totalQty : cart.totalQty

	})

	for(let item of Object.values(cart.items)){
		order.items.push({
			item : item.item._id,
			qty:item.qty
		})
	}
	req.session.cart ={
		items:{},
		totalQty : 0 ,
		totalPrice :0 

	}
	order.save()
	req.flash('info',"Order placed")
	res.redirect('/cart')
	
})

function isLoggedIn(req, res, next) { 
	if (req.isAuthenticated())
		req.isLogged = true; return next();
	res.redirect("/login"); 
} 






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




module.exports = app;
 