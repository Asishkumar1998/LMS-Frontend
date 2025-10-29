
app.controller('logOutController', function($scope, $rootScope, $location) {

 
    $rootScope.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    $scope.currentUser = $rootScope.currentUser;

 
    $scope.showLogout=false;
    $scope.toggleLogoutMenu=function(){
        $scope.showLogout=!$scope.showLogout;
    }
    $scope.showSidebar = !!$rootScope.currentUser;

    
    $scope.logout = function() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        $rootScope.currentUser = null;
        $scope.currentUser = null;
        $scope.showSidebar = false;
        $location.path('/login');
    }

    // Watch for changes in currentUser
    $rootScope.$watch('currentUser', function(newVal) {
        $scope.showSidebar = !!newVal;
        $scope.currentUser = newVal;
    });
});
