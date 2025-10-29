app.controller("OrderController",function($scope,$routeParams,$location,OrderService,BooksService,UserService,ConfirmedOrderService,CartService,ModalService){

    $scope.books = [];
    $scope.users=[];
    $scope.orders=[];
    $scope.orderList = ConfirmedOrderService.getOrders() || [];
    $scope.getAll=[];
    $scope.cart=[];
    $scope.cartCount=0;
    $scope.loading=true;
    $scope.currentPage=1;
    $scope.itemsPerPage=5;
    $scope.searchText="";
    const orderId = parseInt($routeParams.id);
    console.log("orderId",orderId);
    // $scope.order.createdAt = new Date($scope.order.createdAt);

    $scope.order=null;

    $scope.cartItems=CartService.getCart();
    console.log("cartItems",$scope.cartItems);
    const currentUser=JSON.parse(localStorage.getItem("currentUser") || "{}");
    console.log("currentUser",currentUser?.id);
    

    $scope.updateCartCount = function() {
    $scope.cartCount = $scope.cartItems.reduce((sum, item) => sum + item.quantity, 0);
};
$scope.updateCartCount();


    $scope.removeItem=function(bookId){
        CartService.removeItem(bookId);
        $scope.cartItems=CartService.getCart();
    }

    $scope.clearCart=function(){
        if(confirm("Do you want to clear all items?")){
            CartService.clearCart();
            $scope.cartItems=[];
            $scope.updateCartCount();
        }
    }


    // function loadBooks(){
    //     $scope.loading=true;
    //     BooksService.getAll()
    //         .then(function(response){
    //             $scope.books=response.data;
    //             // $scope.filteredBooks=angular.copy($scope.books);
    //             // $scope.applyFilter();
                
                
    //         }).catch(function(error){
    //             console.error("error loading books:",error);
    //         }).finally(function(){
    //             $scope.loading=false;
    //         });
    // }

    function loadBooks() {
    $scope.loading = true;
    BooksService.getAll()
        .then(function(response) {
            $scope.books = response.data;
            const cart = CartService.getCart();

            // Sync book quantities with cart
            $scope.books.forEach(book => {
                const cartItem = cart.find(item => item.book.id === book.id);
                book.quantity = cartItem ? cartItem.quantity : 0;
                book._lastQuantity = book.quantity; // keep it consistent for the add logic
            });
        })
        .catch(function(error) {
            console.error("Error loading books:", error);
        })
        .finally(function() {
            $scope.loading = false;
        });
}


    function loadUsers(){
        $scope.loading=true;
        UserService.getAll()
            .then(function(response){
                $scope.users=response.data;
            }).catch(function(error){
                console.error("error loading books:",error);
                
            }).finally(function(){
                $scope.loading=false;
            })
    }

    function loadOrder(){
        $scope.loading=true;
        OrderService.getAll()
            .then(function(response){
                $scope.orders=response.data;
                console.log("Ordersssss",$scope.orders);
                
                // $scope.cartCount=$scope.orders.length;
            }).catch(function(error){
                console.error("erro loading orders",error);
                
            }).finally(function(){
                $scope.loading=false;
            })
    }

    console.log("orderIddddddddddddddddddddddd",orderId);
    
    function getOrderById(){
        if (!orderId) return;
        OrderService.getById(orderId)
    .then(function(response){
        $scope.order=response.data;
        if ($scope.order.createdAt) {
          const utcDate = new Date($scope.order.createdAt);
          const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
          $scope.order.createdAt = localDate;
      }

      console.log("Local Order Date:", $scope.order.createdAt);
        console.log("OrderById",$scope.order);
        
    }).catch(function(error){
        console.error("Error loading order:",error);
        
        
    }).finally(function(){
                $scope.loading=false;
    })
    }
   


    $scope.getTotalItems=function(items){
        return items?.reduce((total,item)=>total+item.quantity,0);
    }
    $scope.goBack = function() {
        $location.path('/orders-list');
    };
    $scope.printBill = function() {
        window.print();
    };
   
    $scope.totalPages = function() {
        const filteredCount = $scope.orders.filter($scope.searchFilter).length;
        return Math.ceil(filteredCount / $scope.itemsPerPage) || 1;
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalPages()) $scope.currentPage++;
    };

    $scope.prevPage = function() {
        if ($scope.currentPage > 1) $scope.currentPage--;
    };

    $scope.searchFilter = function(order) {
        if (!$scope.searchText) return true;
        const text = $scope.searchText.toLowerCase();
        const usernameMatch = order.user.profile.fullName.toLowerCase().includes(text);
        const bookMatch = order.items.some(item => item.book.title.toLowerCase().includes(text));
        return usernameMatch || bookMatch;
    };
   


// $scope.addToOrder = function(book, quantity) {
//     quantity = parseInt(quantity) || 1;
//     CartService.addToCart(book, quantity);
//     $scope.cartItems = CartService.getCart();
//     // $scope.cartCount = CartService.getCart().length;
//     $scope.updateCartCount();
//     // alert(book.title + " added to cart!");
// //    book.quantity = (book.quantity || 0) + 1;
// };

// $scope.addToOrder = function(book) {
    
//     if (!book.quantity || book.quantity < 1) {
//         book.quantity = 0;
//     }

   
//     if (!book._lastQuantity || book.quantity !== book._lastQuantity) {
        
//         const addedQty = parseInt(book.quantity) || 1;
//         CartService.addToCart(book, addedQty);
//         book._lastQuantity = book.quantity;
//         $scope.cartItems = CartService.getCart();
//         $scope.updateCartCount();
        
//         book._lastQuantity = book.quantity;
//     } else {
        
//         book.quantity += 1;
//         CartService.addToCart(book, 1);
//         book._lastQuantity = book.quantity;
//         $scope.cartItems = CartService.getCart();
//         $scope.updateCartCount();
       
//         book._lastQuantity = book.quantity;

//     }
// };

$scope.addToOrder = function(book) {
    const cart = CartService.getCart();
    const existingItem = cart.find(item => item.book.id === book.id);

    
    if (!book.quantity || book.quantity < 1) {
        book.quantity = 0;
    }

    let quantityToAdd = 0;

    if (!book._lastQuantity || book.quantity !== book._lastQuantity) {
        quantityToAdd = parseInt(book.quantity) || 1;
    } else {
        quantityToAdd = 1;
    }
    CartService.addToCart(book, quantityToAdd);

    const updatedCart = CartService.getCart();
    const updatedItem = updatedCart.find(item => item.book.id === book.id);
    book.quantity = updatedItem ? updatedItem.quantity : quantityToAdd;
    book._lastQuantity = book.quantity;

    
    $scope.cartItems = updatedCart;
    $scope.updateCartCount();

    // Optional console debug
    console.log(`Added ${quantityToAdd} of "${book.title}". Total in cart: ${book.quantity}`);
};





// $scope.editOrder = function(existingOrder, book, quantity) {
//     console.log("Updating order with book:", book.title, "quantity:", quantity);

//     // Ensure order has items array
//     if (!existingOrder.items) existingOrder.items = [];

//     // Find if book already exists in order
//     let existingItem = existingOrder.items.find(item => item.bookId === book.id);

//     if (existingItem) {
//         // Increase quantity
//         existingItem.quantity += quantity;
//         console.log("Updated existing book quantity:", existingItem.quantity);
//     } else {
//         // Add new item
//         existingOrder.items.push({ bookId: book.id, quantity: quantity });
//         console.log("Added new book to order:", book.title);
//     }

//     // Prepare payload for backend
//     const updatedOrder = {
//         id: existingOrder.id,
//         userId: existingOrder.user.id,
//         items: existingOrder.items.map(item => ({
//             bookId: item.bookId,
//             quantity: item.quantity
//         }))
//     };

//     // Send update request
//     OrderService.update(updatedOrder)
//         .then(function(response) {
//             console.log("Order updated successfully:", response.data);
//             loadOrder(); // Refresh orders
//         })
//         .catch(function(error) {
//             console.error("Error updating order:", error);
//         });
// };








    $scope.toggleDetails=function(order){
        order.showMore=!order.showMore;

        if(order.showMore){
            OrderService.getById(order.id)
                .then(function(respone){
                    order.details=respone.data;
                    console.log("order.details",order.details);
                    
                }).catch(function(error){
                    console.error("Error loading order details",error);
                    
                });
        }
    };
    
    
    // $scope.deleteOrder=function(orderId){
    //     if(confirm("Are you sure you want to delete this order ?")){
    //         OrderService.delete(orderId)
    //             .then(function(response){
    //                 $scope.orders=$scope.orders.filter(o=>o.id!=orderId);
    //                 $scope.cartCount=$scope.orders.length;
    //             }).catch(function(error){
    //                 console.error("Error deleting order",error);
                    
    //             })
    //     }
    // }

    $scope.deleteOrder = function(bookId) {
        CartService.removeItem(bookId);
        $scope.cartItems = CartService.getCart();
        $scope.updateCartCount();
        ModalService.showMessage('success','order deleted successfully')
    };



//     $scope.confirmSelectedOrders = function() {
//     // Take all items in the cart
//     const allItems = $scope.cartItems;

//     if (allItems.length === 0) {
//         // alert("Your cart is empty!");
//         ModalService.showMessage('success','Your cart is empty')
//         return;
//     }

//     // Optional: remove confirmation popup if you want it fully automatic
//     // If you still want one final confirmation, keep the below line:
//     ModalService.confirm("Confirm all items in cart as order?")
//     .then(function(confirmed){
//         if(!confirmed) return;
//     })
//     // if (!confirm("Confirm all items in cart as order?")) return;

//     const payload = {
//         userId: currentUser?.id, // replace with logged-in user ID if needed
//         items: allItems.map(item => ({
//             bookId: item.book.id,
//             quantity: item.quantity,
//         }))
//     };

//     console.log("payload", payload);

//     OrderService.create(payload)
//         .then(function(response) {
//             // alert("Order placed successfully!");
//             ModalService.showMessage('success','Order placed successfully')
//             console.log("Order created:", response.data);
//             // Clear the cart after order placement
//             allItems.forEach(item => CartService.removeItem(item.book.id));
//             $scope.cartItems = CartService.getCart();
//             $location.path("/orders-list");
//         })
//         .catch(function(error) {
//             console.error("Error creating order:", error);
//             // alert("Failed to place order");
//             ModalService.showMessage('error','failed to place order')
//         });
// };


$scope.confirmSelectedOrders = function () {
    const allItems = $scope.cartItems;

    if (allItems.length === 0) {
        ModalService.showMessage('error', 'Your cart is empty!');
        return;
    }

    
    ModalService.confirmOrder("Confirm all items in cart as order?")
        .then(function (confirmed) {
            if (!confirmed) return; 

            const payload = {
                userId: currentUser?.id, 
                items: allItems.map(item => ({
                    bookId: item.book.id,
                    quantity: item.quantity,
                })),
            };

            console.log("payload", payload);

            OrderService.create(payload)
                .then(function (response) {
                    ModalService.showMessage('success', 'Order placed successfully!');
                    console.log("Order created:", response.data);

                    
                    allItems.forEach(item => CartService.removeItem(item.book.id));
                    $scope.cartItems = CartService.getCart();

                    
                    setTimeout(() => {
                        $scope.$apply(() => $location.path("/orders-list"));
                    }, 1500);
                })
                .catch(function (error) {
                    console.error("Error creating order:", error);
                    ModalService.showMessage('error', 'Failed to place order.');
                });
        });
};

    $scope.deleteSelectedOrders=function(){
        const selectedOrders=$scope.cartItems.filter(c=>c.selected);

        if(selectedOrders.length ===0){
            // alert("Please select at least one order to delete.");
            ModalService.showMessage('error','Please select at least one order to delete.');
            return;
        }

        ModalService.confirm("Are you sure you want to delete selected orders?",'Delete selected')
        .then(function(confirmed){
            if(!confirmed) return;
            selectedOrders.forEach(order=>{
            CartService.removeItem(order.book.id);
                
        })
        $scope.cartItems=CartService.getCart();
        })

        // if (!ModalService.confirm("Are you sure you want to delete selected orders?")) return;

        // selectedOrders.forEach(order=>{
        //     CartService.removeItem(order.book.id);
                
        // })
        // $scope.cartItems=CartService.getCart();
        
    }

    $scope.clearConfirmedOrders = function() {
    if(confirm("Do you want to clear all confirmed orders?")) {
        ConfirmedOrderService.clearOrders();
        $scope.orderList = [];
    }
};

$scope.viewOrderDetails=function(orderId){
    console.log("orderrrr",orderId);
    
    $location.path('/order-details/'+orderId);
}

    loadBooks();
    loadOrder();
    loadUsers();
    getOrderById();
})