app.factory("AuthorService",function($http){
    // let authors=[
    //     { id: 9, name: "J.K. Rowling", penName: "Robert Galbraith", books: [] },
    //     { id: 10, name: "George R.R. Martin", penName: "", books: [] },
    //     { id: 11, name: "Romario B. Dosel", penName: "Rose", books: [] }
    // ];

    var baseUrl="http://localhost:5211/api/authors";

    return {
        getAll:function(){
            return $http.get(baseUrl);
        },
        
        getById:function(id){
            return $http.get(baseUrl +"/"+id);
        },
        create:function(author){
            return $http.post(baseUrl,author);
        },

        update:function(id,updatedAuthor){
            return $http.put(baseUrl +"/"+id,updatedAuthor);
        },

        delete:function(id){
            return $http.delete(baseUrl + "/" +id);
        }
    };
});