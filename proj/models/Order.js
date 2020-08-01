const mongoose = require('mongoose') ;

const OrderSchema = mongoose.Schema({
   user :{
       type : mongoose.Schema.Types.ObjectId,
       ref : 'User'
   },
   items : [{
       item :{
       type :mongoose.Schema.Types.ObjectId,
       ref : 'Item'
       },qty:{
           type : Number ,
           default : 0       
       }
   }],
   totalPrice : {
       type : Number ,
       default : 0 
   }
},{
    timestamps:true
})

const Order= mongoose.model('Order', OrderSchema);
module.exports = Order ;