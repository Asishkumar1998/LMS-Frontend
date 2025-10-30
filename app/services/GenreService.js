app.factory("GenreService",function($http,API_BASE_URL){
    // var generes = [
    //     { id: 9, name: "Fantasy", bookTags: [] },
    //     { id: 10, name: "Adventure", bookTags: [] },
    //     { id: 11, name: "Romance", bookTags: [] },
    //     { id: 12, name: "Horror", bookTags: [] },
    //     { id: 13, name: "Comedy", bookTags: [] },
    //     { id: 14, name: "Suspense", bookTags: [] }
    // ];

    var baseUrl=API_BASE_URL + "/tags";

    function save(){
        localStorage.setItem("generes",JSON.stringify(generes));
    }

    return {
        getAll:function(){
            return $http.get(baseUrl);
        },

        getById:function(id){
           return $http.get(baseUrl +"/"+id);
        },

        add:function(genre){
            // genre.id=generes.length ? generes[generes.length-1].id+1:1;
            // generes.push(genre);
            // save();
            return $http.post(baseUrl,genre);
        },

        update:function(id,updatedGenre) {
            // var index=generes.findIndex(g=>g.id===id);
            // if(index !==-1) {
            //     generes[index]=angular.copy(updatedGenre);
            //     save();
            // }
            return $http.put(baseUrl +"/"+id,updatedGenre);
        },

        delete:function(id) {
            // var index = generes.findIndex(g=>g.id === id);
            // if(index !==-1){
            //     generes.splice(index,1);
            //     save();
            // }

            return $http.delete(baseUrl +"/"+id);
        }
    };
});