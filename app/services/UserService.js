app.factory("UserService",function($http){
    // var users=JSON.parse(localStorage.getItem("users")) || [];
    var baseUrl="http://localhost:5211/api/users";

    function save(){
        localStorage.setItem("users",JSON.stringify(users));
    }

    return{
        getAll:function(){
            return $http.get(baseUrl);
        },

        // add:function(user){
        //     if (!user.id) user.id = Date.now();
        //     users.push(user);
        //     save();
        // },

        add:function(user){
            return $http.post(baseUrl,user);
        },

        update:function(user){
            return $http.put(baseUrl+"/"+user.id,user)
            
        },

        getById:function(id) {
        // return users.find(u => u.id === id);
            return $http.get(baseUrl+"/"+id);
         },

        delete:function(id){
            // users=users.filter(u=>u.id !==id);
            // save();
            return $http.delete(baseUrl+"/"+id);
        },
        resendActivationLink:function(email){
            const token = localStorage.getItem('authToken');
            return $http.post(baseUrl + "/resendActivationLink",{email:email},{
                 headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
        }
    };
});