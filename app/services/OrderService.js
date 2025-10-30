app.factory("OrderService",function(BooksService,UserService,$http,API_BASE_URL){
//     var orders=[
//         {
//             "id": 9,
//             "createdAt": "2025-10-06T05:31:05.2306165",
//             "userId": 6,
//             "user": {
//                 "id": 6,
//                 "email": "john@example.com",
//                 "contactNo": "1234567890",
//                 "profile": {
//                     "id": 4,
//                     "fullName": "John Doe"
//                 }
//             },
//             "items": [
//                 {
//                     "id": 11,
//                     "bookId": 6,
//                     "book": {
//                         "id": 6,
//                         "title": "Game of Thrones",
//                         "author": {
//                             "id": 10,
//                             "name": "George R.R. Martin"
//                         }
//                     },
//                     "quantity": 2
//                 }
//             ]
//         }
// ];

var baseUrl=API_BASE_URL + "/orders";


    function save(){
        localStorage.setItem("orders",JSON.stringify(orders));
    }

    return {
        getAll: function() {
            return $http.get(baseUrl);
        },


        getById: function(id) {
            return $http.get(baseUrl +"/"+id);
        },

        create:function(payload) {
            return $http.post(baseUrl,payload);
        },
        delete: function(id) {
            // const index = orders.findIndex(o => o.id === id);
            // if (index !== -1) {
            //     orders.splice(index, 1);
            //     save();
            //     return true;
            // }
            // return false;
            return $http.delete(baseUrl+"/"+id);
        },
        update:function(order){
            return $http.put(baseUrl+"/"+order.id,order)
            
        },

    

    }
})