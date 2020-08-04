const mongoose = require('mongoose') ;

const OrderSchema = mongoose.Schema({
  name : {type:String,
      required:true
  },
  isCompleted: {type:Number,
      required:true
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
   },
   totalQty:{
       type:Number ,
       default : 0 
   }
},{
    timestamps:true
})

const Order= mongoose.model('Order', OrderSchema);
module.exports = Order ;