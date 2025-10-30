app.factory("BooksService",function($http,API_BASE_URL){
    var baseUrl=API_BASE_URL + "/books";


    // function save() {
    //     localStorage.setItem("books",JSON.stringify(books));
    // }

    return{
        getAll:function(){
            return $http.get(baseUrl);
        },

        add:function(book){
           return $http.post(baseUrl,book);
        },

        delete:function(id){
           return $http.delete(baseUrl+"/"+id);
        },

        getById:function(id){
            return $http.get(baseUrl+"/"+id);
        },

        update:function(id,updatedbook){
            return $http.put(baseUrl+"/"+id,updatedbook);
        }
    }
})