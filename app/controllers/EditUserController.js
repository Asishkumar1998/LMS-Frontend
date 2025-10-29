

app.controller("EditUserController", function($scope, $routeParams, $location, UserService,ModalService) {
    var userId = parseInt($routeParams.userId);
    
    $scope.users=[];
    $scope.newUser={};
    $scope.loading=true;
    var email=null;

    // Get existing user
    // var existingUser = UserService.getById(userId);

    // if (!existingUser) {
    //     alert("User not found!");
    //     $location.path("/users");
    //     return;
    // }

    const userStatusOption={
        1:[
            {
                id:1,name:"Ready For Activation",
            }
        ],
        2:[
            
               { id:2,name:"Active"},
                {id:3,name:"Suspend"},
                {id:4,name:"Terminated"}
            
        ],
        3:[
            
                {id:3,name:"Suspend"},
               { id:4,name:"Terminated"}
            
        ],
        4:[
            {
                id:4,name:"Terminated"
            }
        ]

    };

    $scope.getUserStatus=function(currentStatus){
        console.log("currentStatus",currentStatus);
        
        return userStatusOption[currentStatus];
    }
    

    

    UserService.getById(userId)
            .then(function(respone){
                if(!respone.data){
                    ModalService.showMessage('error','User not Found !')
                    // alert("User not Found !");
                    $location.path("/users");
                    return;
                }

                $scope.newUser=angular.copy(respone.data);
                console.log("newUser",$scope.newUser.profile);
                
                $scope.statusOptions=$scope.getUserStatus($scope.newUser.status);
                console.log("statusOptions",$scope.statusOptions);
                
                if (!$scope.newUser.profile) {
                    $scope.newUser.profile = {
                        fullName: "",
                        firstName: "",
                        lastName: "",
                        place: ""
                    };
                 } 
                //  $scope.newUser.status = parseInt($scope.newUser.status);
                 console.log("newUserStatus",$scope.newUser.email);
                 email=$scope.newUser.email;
                 console.log("email",email);
                 

                //  $scope.statusOptions = $scope.getUserStatus($scope.newUser.status);

                 

            })
            .catch(function(error){
                console.error("Error fetching User:",error);
                $location.path("/users");
            })
            .finally(function(){
                $scope.loading=false;
            })


    $scope.resendLink = function(email) {
    if(!email) return ModalService.showMessage('error','Email not found!');

    $scope.loading = true;

    UserService.resendActivationLink(email)
        .then(function(response){
            $scope.loading = false;
            // alert("Activation link resent successfully to " + email);
        })
        .catch(function(error){
            $scope.loading = false;
            console.error("Resend link failed", error);
            ModalService.showMessage('error',"Failed to resend activation link.")
            // alert("Failed to resend activation link.");
        });
};


   

    
    

    // Save (Update) user
    $scope.saveUser = function() {
        console.log("saveuser");
        
        if ($scope.newUser.email && $scope.newUser.contactNo &&
            $scope.newUser.profile.fullName &&
            $scope.newUser.profile.firstName &&
            $scope.newUser.profile.lastName &&
            $scope.newUser.profile.place) {

            $scope.newUser.profile.fullName =
                $scope.newUser.profile.firstName + " " + $scope.newUser.profile.lastName;
                console.log($scope.newUser.profile.fullName);
                
            UserService.update($scope.newUser)
                .then(function(respone){
                    console.log("response updateeee",respone.data);
                    $location.path("/users");
                    ModalService.showMessage('success','User update successfully')
                })
                .catch(function(error){
                    console.error("Error updating user",error);
                })
        } 
    };

    // Cancel
    $scope.cancel = function() {
        $location.path("/users");
    };
});
