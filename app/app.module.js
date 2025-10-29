var app = angular.module('myApp', ['ngRoute']);
app.factory('AuthInterceptor',function($location){
    return{
        request:function(config){
            const token=localStorage.getItem('authToken');
            if(token){
                config.headers['Authorization']='Bearer ' + token;
            }
            return config;
        },

        responseError:function(response){
            if(response.status === 401){
                // ModalService.showMessage('error','Unauthorized! Please login again')
                alert("Unauthorized! please login again");
                $location.path("/login");
            }

            return Promise.reject(response);
        }
    }
})

app.run(function($rootScope, $location,$timeout) {

  // Logout function available anywhere in the app
  $rootScope.logout = function() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    $rootScope.currentUser = null;
    console.log("logout");
    
    localStorage.clear();
    sessionStorage.clear();
    $timeout(function() {
      $location.path('/login');
    }, 100);
  };

   // Hide sidebar when on login or activation page
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        const path = $location.path();
        // Hide sidebar only for login or activation pages
        $rootScope.showSidebar = !(path === '/login' || path === '/activate-user');
    });

 
});

app.run(function($rootScope,$location){
    $rootScope.isActive=function(viewLocation){
        return $location.path()===viewLocation;
    };
});

app.config(function($routeProvider,$locationProvider,$httpProvider){
    $locationProvider.html5Mode(false);
    $httpProvider.interceptors.push('AuthInterceptor');

    $routeProvider
        .when('/users',{
            templateUrl:"app/views/users.html",
            controller:"UsersController"
        })
        .when('/add-user',{
            templateUrl:"app/views/add-user.html",
            controller:"AddUserController"
        })
        .when('/edit-user/:userId',{
            templateUrl:"app/views/add-user.html",
            controller:"EditUserController"
        })
        .when('/add-book',{
            templateUrl:"app/views/add-book.html",
            controller:"AddBookController",

        })
        .when('/edit-book/:bookId',{
            templateUrl:"app/views/add-book.html",
            controller:"EditBookController"

        })
        .when('/genres',{
            templateUrl:"app/views/generes.html",
            controller:"GenreController"
        })
        .when('/authors',{
            templateUrl:"app/views/authors.html",
            controller:"AuthorController"
        })
        .when('/add-author',{
            templateUrl:"app/views/add-author.html",
            controller:"EditAuthorController"
        })
        .when('/edit-author/:id',{
            templateUrl:"app/views/add-author.html",
            controller:"EditAuthorController"
        })
        .when('/books',{
            templateUrl:"app/views/books.html",
            controller:"BookController"
        })
        .when('/orders',{
            templateUrl:"app/views/order.html",
            controller:"OrderController"
        })
        .when('/orders-list',{
            templateUrl:"app/views/order-list.html",
            controller:"OrderController"
        })
        .when('/order-details/:id',{
            templateUrl:"app/views/order-details.html",
            controller:"OrderController"
        })
        .when('/carts',{
            templateUrl:"app/views/cart.html",
            controller:"OrderController"
        }).when('/activate-user',{
            templateUrl:"app/views/activate-user.html",
            controller:"ActivateUserController"

        }).when('/login',{
            templateUrl:"app/views/login.html",
            controller:"LoginController"
        })
        
        .otherwise({
            redirectTo: '/login'
        });

        

    
        
        
})

app.run(function($rootScope){
    $rootScope.isCollapsed = true; // default expanded
});