var app=angular.module('myApp');
 app.controller('MainController', function($scope) {
      $scope.message = "Hello AngularJS";
  });

  app.controller("page1Controller",function($scope){
            $scope.message = "This is Page 1";
  })

   app.controller("page2Controller",function($scope){
            $scope.message = "This is Page 2";
  })