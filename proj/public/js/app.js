
//cart 
const axios = require('axios')
const Noty = require('noty')


var cartTotal = document.querySelector("#cart_total")
const addToCart= async (item)=>{
    const res = await axios.post("/add_to_cart",item)
   

    const data = res.data
        console.log(data) ;
        cartTotal.innerText = data.total
    
    new Noty({
        type:"success",
        text:"Added to cart 🍔🍔🍔 !!!",
        theme:'relax',
        timeout:1000,
        progressBar:false
        
    }).show()
    
    
}

let add_buttons = document.querySelectorAll("#cart_add")

add_buttons.forEach(btn=>{
   
    btn.addEventListener('click',(e)=>{
        console.log(e,btn.dataset.item)
        var item = JSON.parse(btn.dataset.item) ;
        addToCart(item) ;
    })
})




//order 


var order_required= document.querySelector('.order_required')
var order_error = document.querySelector('.error')
var item_added= document.querySelector('.item_added')
var add_error = document.querySelector('.item_error')
if(order_error){
order_error.style.color = 'red'
}

if(order_required){
    try{
var placed_info = JSON.parse(order_required.dataset.info)
console.log(placed_info)
if(placed_info){
    new Noty({
        type:"success",
        text:"Order Placed 🍔🍔🍔 !!!",
        theme:'relax',
        timeout:1000,
        progressBar:false
        
    }).show()

}
    }catch{
        console.log("continued")
    }
}



if(item_added){
    try{
    var placed_info = JSON.parse(item_added.dataset.add)
    if(placed_info){
        new Noty({
            type:"success",
            text:"New Item Added 🍔🍔🍔 !!!",
            theme:'relax',
            timeout:1000,
            progressBar:false
            
        }).show()
    
    }
}catch{
    console.log('continued')
}

}


if(add_error){
    try{
    var placed_info = JSON.parse(add_error.dataset.add)
    if(placed_info){
        new Noty({
            type:"error",
            text:"Couldn't place order 😥😥😥.Try pic with smaller size. !!!",
            theme:'relax',
            timeout:1000,
            progressBar:false
            
        }).show()
    
    }
}catch{
    console.log('continued')
}

}















//order