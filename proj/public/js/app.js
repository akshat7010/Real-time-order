
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
if(order_error){
order_error.style.color = 'red'
}

if(order_required){
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
}
















//order