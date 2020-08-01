var express = require('express');
const Item = require('../models/Item');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Restrau' });
});


router.get('/add',async (req,res)=>{
  const items = await Item.find()
  res.send({"message":"Done",'items':items})
})
module.exports = router;
