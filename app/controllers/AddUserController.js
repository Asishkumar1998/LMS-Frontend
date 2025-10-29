var app=angular.module('myApp');



app.controller("AddUserController", function($scope, $location, UserService,ModalService) {
    $scope.users=[];
    $scope.loading=false;
    $scope.newUser = {
        email: "",
        contactNo: "",
        lastModifiedBy: 0,
        profile: {
            fullName: "",
            firstName: "",
            lastName: "",
            place: ""
        }
    };

    $scope.submitted = false;
console.log("add");

 UserService.getAll()
        .then(function(response) {
            $scope.users = response.data || [];
            console.log("Loaded users:", $scope.users);
        })
        .catch(function(error) {
            console.error("Error loading users:", error);
        });


    $scope.addUser = function(userForm) {
        $scope.submitted = true;
        $scope.loading=true;
        // Basic validation
        if(userForm && userForm.$valid){
             if ($scope.newUser.email && $scope.newUser.contactNo &&
            $scope.newUser.profile.firstName &&
            $scope.newUser.profile.lastName &&
            $scope.newUser.profile.place) {

            $scope.newUser.profile.fullName=$scope.newUser.profile.firstName +" "+$scope.newUser.profile.lastName;
    

            UserService.add($scope.newUser)
                        .then(function(response){
                            {
                                console.log("response",response.data);
                                // alert(response.data.message)
                                
                            ModalService.showMessage('success',response.data.message,3000)
                            $scope.newUser={
                                email:"",
                                contactNo:"",
                                lastModifiedBy:0,
                                profile:{
                                    fullName:"",
                                    firstName:"",
                                    lastName:"",
                                    place:""
                                }
                            }
                        };
                        $scope.submitted = false;
                        $scope.loading=false;
                        userForm.$setPristine();
                        userForm.$setUntouched();
                        return UserService.getAll();
                        }).then(function(response){
                            $scope.users=response.data;
                            console.log("usersssss",$scope.users);
                            
                            $location.path("/users");
                        })
                        .catch(function(error){
                            $scope.loading=false;
                            console.error("error adding user:",error);
                            ModalService.showMessage('error',error.data)
                        })
        } 
        }
       
    };

    $scope.cancel = function() {
        $location.path("/users");
    };
});
