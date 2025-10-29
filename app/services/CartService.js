app.factory("CartService",function(){
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    function save() {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    return{
        getCart:function(){
          return cartItems;
        },

        addToCart:function(book,quantity){
            const existingItem=cartItems.find(i=>i.book.id===book.id);
            if(existingItem){
                existingItem.quantity+=quantity;
            } else{
                cartItems.push({book:book,quantity:quantity});
            }
            save();
        },

        removeItem:function(bookId){
            cartItems=cartItems.filter(i=>i.book.id!=bookId);
            save();
        },
        clearCart:function(){
            cartItems=[];
            localStorage.removeItem("cartItems");
        }

        
    };
})