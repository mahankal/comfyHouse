//  variables 
const cartBtn = document.querySelector('.cart-btn')
const closeCartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.querySelector('.clear-cart')

//  cart dom
const cartDOM = document.querySelector('.cart')
const cartOverlay = document.querySelector('.cart-overlay')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')

const ProductsDOM = document.querySelector('.products-center')


const shopNowBtn = document.querySelector(".banner-btn")
//console.log(shopNowBtn)


shopNowBtn.addEventListener("click",()=>{
    moveDown()
}) 

function moveDown(){
      document.body.scrollBy(0,1000)
     // console.log("hello harshit");
}

// emppty cart 
let cart = []


//buttons
let buttonsDOM = []

// getting the products 
class Products {
    // method
    // async always return promise .. 
    // 1
    async getProducts() {
        try {
            let result = await fetch('products.json')
           // console.log(result)
            let data = await result.json()
            //console.log(data)
            // array
            let products = data.items;
            // console.log(products)

            // method --> array 
            products = products.map(item => {
                // destructuring 
                const { title, price } = item.fields;
                const { id } = item.sys
                const image = item.fields.image.fields.file.url
                return { title, price, id, image }
            })
            return products

        } catch (error) {
            console.log(error)
        }
    }
}


// display products 
class UI {
    // 2 
    displayProducts(products) {
        // console.log("products ...", products)


        let result = ""
        products.forEach(product => {
            // template literals 
            result += `
        <artictle class="product">
        <div class="img-container">
            <img src=${product.image} alt="product" class="product-img">
            <button class="bag-btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart"></i>
                add to cart
            </button>
        </div>
        <h3>${product.title}</h3>
        <h4>${product.price}</h4>
</artictle> `

        })
        // having class product center  
        ProductsDOM.innerHTML = result
    }

    // 4
    getBagButtons() {
        // querySelectorAll --> return nodeList 
        // const btns = document.querySelectorAll(".bag-btn")

        // we use ... ( spread operator ) to change ++ node -----> array ++
        const buttons = [...document.querySelectorAll(".bag-btn")]

         //console.log(buttons)


        // buttonsDOM --> empty array , buttons --> contains array with all classes having name " bag-btn " 
        buttonsDOM = buttons

    

        buttons.forEach(button => {
             //console.log(button)
            let id = button.dataset.id
            // console.log(id) // 1,2,3,4,5,6,7,8 ---> id one by one 

            // at that time empty ...-->[]
            // check product is present in cart 
            let inCart = cart.find(item => item.id === id)
            if (inCart) {
                // if already present in cart 
                button.innerText = "In Cart"
                button.disabled = true
            }

            // event --> object
            // we find which btn is clicked by user
            button.addEventListener('click', (event) => {
                //console.log(event)
                // console.log(event.target)
                 //console.log(event.target.innerText)

                event.target.innerText = "In Cart"
                event.target.disabled = true

                // -------------------get product from products ( based on id ) ----------------------
                // id --> that is we get from button.dataset.id mean 1,2,3,4,5,6,7,8

                // console.log(id) // id of btn that is clicked
                // let cartItem = Storage.getProduct(id) 
                //  console.log(cartItem)



                // spread operator 
                // amount property added to this object ( or say merge with properties of this object )
                let cartItem = { ...Storage.getProduct(id), amount: 1 }



                // ------------------ add product to the cart ------------------
                //  ...cart -> products which are currently present
                // cartitem -> added cartItem to this currently present state
                cart = [...cart, cartItem]
                 //console.log(cart)   // [{} , {} , {} so on ....... ]




                // -------------- save the cart in local storage -------------------
                Storage.saveCart(cart);
                

                // ---------------------- set cart values ---------------
                // this function is define in this class itself
                this.setCartValues(cart)


                // -------------------- display cart item  -------------------
                // we pass cartItem as a argument 
                // cartItem -> clicked product + amount property ( added above )
                this.addCartItem(cartItem)



                // show the cart 
                this.showCart()



            })
        }
        )
    }

    setCartValues(cart) {
        let tempTotal = 0
        let itemsTotal = 0

        cart.map(item => {
            // console.log(item)

            // for ex.) temptotal += 50*1
            tempTotal += item.price * item.amount
            itemsTotal += item.amount    // 1 , 2 , 3 , 4 , 5 ( simply no. of items ) 
        })
        // variable define at top 
        // toFixed --> return string 
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        cartItems.innerText = itemsTotal

        // console.log(cartTotal);
        // console.log(cartItems);

    }


    addCartItem(item) {
        // to create div 
        const div = document.createElement('div')
         // add class 
        div.classList.add('cart-item')
        div.innerHTML = `
        <img src=${item.image} alt="product">
        <div>
            <h4>${item.title}</h4> 
            <h5>${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down"  data-id=${item.id}></i>
        </div>`


        // append this newly created div in cartContent variable 
        // clicked item added to the cart ( in slidebar )

        cartContent.appendChild(div)
         //console.log(cartContent)
    }




    // this method is used in this class  (  itself ).. 
    // when user click on "add to cart" then , cart will open automatically 
    showCart() {
        // add class to cartoverlayvariable ...
        //  look class at style.css 
        cartOverlay.classList.add('transparentBcg')
        // console.log(cartOverlay)

        cartDOM.classList.add('showCart')
        // console.log(cartDOM)
    }


    setupApp() {
        cart = Storage.getCart();  // get carts from the localstorage 
        this.setCartValues(cart)   // we reuse this method --> cart total , amount total , 
        this.populateCart(cart)        // define below


        cartBtn.addEventListener("click", this.showCart)
        closeCartBtn.addEventListener("click", this.hideCart)

    }


    // here cart argument contain values which are we get from localstorage to cart 
    populateCart(cart) {
        // item --> access all products one by one 
        //  for each product , we run addCartItem ...
        //  addCartItem method add products in cart
        cart.forEach(item => this.addCartItem(item))
    }


    // to close the cart
    hideCart() {
        cartOverlay.classList.remove('transparentBcg')
        cartDOM.classList.remove('showCart')
    }


    // whole logic of the cart 
    // clear cart , increase amount , decrease amount , remove product 
    // important topic -- event bubbling ( on w3school )
    cartLogic() {
        // not point to the class 
        // clearCartBtn.addEventListener("click",this.clearCart) 

        // point to the class 
        clearCartBtn.addEventListener("click", () => {
            this.clearCart()
        })



        //cart functionality
        // remove cart , increase , decrease 
        cartContent.addEventListener("click", event => {
            // console.log(event.target)

            // if target class is remove-item
            if (event.target.classList.contains("remove-item")) {
                let removeItem = event.target
                console.log(removeItem)

                let id = removeItem.dataset.id
                console.log(cartContent)
                cartContent.removeChild(removeItem.parentElement.parentElement)

                //   call function that is remove perticular clicked item by id 
                this.removeItem(id)
            }
            else if (event.target.classList.contains("fa-chevron-up")) {
                let addAmount = event.target
                //   console.log(addAmount)
                let id = addAmount.dataset.id

                let tempItem = cart.find(item => item.id === id)
                tempItem.amount += 1

                // save updated cart in localstorage 
                Storage.saveCart(cart)

                // we also want to update total hence 
                this.setCartValues(cart)


                addAmount.nextElementSibling.innerText = tempItem.amount

            } else if (event.target.classList.contains("fa-chevron-down")) {
                let lowerAmount = event.target
                let id = lowerAmount.dataset.id

                //    clicked id 
                let tempItem = cart.find(item => item.id === id)
                tempItem.amount = tempItem.amount - 1
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart)
                    this.setCartValues(cart)
                    lowerAmount.previousElementSibling.innerText = tempItem.amount

                } else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement)
                    this.removeItem(id)
                }

            }
        })
    }

    clearCart() {
        // this is point to the btn not the class 
        // console.log(this)

        //  this will now point to the class
        // console.log(this)


        let cartItems = cart.map(item => item.id)
        // console.log(cartItems); // return ids

        // here cartItems is a array of ids .. hence for each id we run removeItem method 
        cartItems.forEach(id => this.removeItem(id))


        // remove or clear all products
        console.log(cartContent.children)   // return htmlcollection
        while (cartContent.children.length>0) {
            // if it has children , keep on removing 
            cartContent.removeChild(cartContent.children[0])
        }

        this.hideCart()


    }

    // remove perticular product with the help of id
    removeItem(id) {
        cart = cart.filter(item => item.id !== id)

        // bcz we want to update values after the removing products from the cart 
        this.setCartValues(cart)
        Storage.saveCart(cart);

        let button = this.getSingleButton(id)

        // after removing we have to false the disabled property , it allows us to click on btn again
        button.disabled = false
        button.innerHTML = `<i class ="fas fa-shopping-cart"></i>add to cart`
    }



    // here id argument is that which is passed in removeItem method ...
    getSingleButton(id) {
        // buttionDom contain are the buttons 
        return buttonsDOM.find(button => button.dataset.id === id)
    }

}


// local storage 
class Storage {
    // 3
    static saveProducts(products) {
        // it has key value pair 
        // for static methods we do not need instance 
        localStorage.setItem("products", JSON.stringify(products))
    }


    // method that is used in ui class
    static getProduct(id) {

        // we have to parse , bcz we store in localstorage as a string 
        // return array ,, find --> method of array
        let products = JSON.parse(localStorage.getItem('products'))

        console.log(id);
        // return that product whose id is === to id that is passed in getProducts()
        //we can console log product here 
        return products.find(product => product.id === id)

    }


    // to save cart in localstorage ( this method used in above class )
    static saveCart(cart) {
        // add this perticular clicked cart into localstorage 
        localStorage.setItem("cart", JSON.stringify(cart))
    }



    // get items to cart from localstorage 
    // ternary operator 
    // if item available in localstorage then get that cart
    // else return empty array [] 
    // although user refresh the page , items in cart remain cons n tant 
    static getCart() {
        return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")) : []
    }

}
// after loading the content 
document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI()    //instance 
    const products = new Products()


    // setup app 
    ui.setupApp()

    // get all products 
    // products.getProducts().then(products => console.log(products))
    products.getProducts().then(products => {
       
        ui.displayProducts(products)

        // call another method --> static method ( do not need instance )
        Storage.saveProducts(products)
    }).then(() => {
        ui.getBagButtons()
        ui.cartLogic()
    })
})
