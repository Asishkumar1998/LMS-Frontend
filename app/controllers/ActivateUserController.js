app.controller('ActivateUserController', function($scope, $http,$timeout,$location,UserService) {
    $scope.initializing=true;
    $scope.loading = false;
    $scope.message = '';
    $scope.error = '';
    $scope.users=[];
    $scope.formData = {}; 
    $scope.showPasswordForm = false;

    

    
    var hash = window.location.hash; 
    var query = hash.split('?')[1];  
    var urlParams = new URLSearchParams(query);
    var token = urlParams.get('token');
    console.log("token", token);
    
    if (!token) {
        $scope.error = 'Invalid activation link. Token missing.';
        $scope.showPasswordForm = false;
        $scope.initializing=false;
        return;
    }

    function loadUsers(){
        $scope.loading=true;
        UserService.getAll()
            .then(function(response){
                console.log("userpassword",response.data);
            }).catch(function(error){
                console.error("error loading books:",error);
            }).finally(function(){
                $scope.loading=false;
            });
    }

    $timeout(function(){

        $http.get('http://localhost:5211/api/users/validate-activation-token?token='+token)
    .then(function(response){
        console.log("validation api response",response.data);

        if(response.data.status==="alreadyActivated"){
            $scope.message=response.data.message;
            $scope.showPasswordForm=false;
        }
        else if(response.data.status==="invalid"){
            $scope.error=response.data.message;
            $scope.showPasswordForm=false;
        }
        else if(response.data.status==="expired"){
            $scope.error=response.data.message;
            $scope.showPasswordForm=false;
        }
        else if (response.data.status === "valid") {
       
        $scope.showPasswordForm = true;
    } 
        
        
    }).catch(function(error){
        console.error("Token validation failed",error);
        $scope.error="Invalid or expired activation link";
        $scope.showPasswordForm=false;
        
    }).finally(function(){
        $scope.initializing = false;
    })

    },1500);
    




    $scope.submitPassword = function() {
        if ($scope.formData.password !== $scope.formData.confirmPassword) {
            $scope.error = "Passwords do not match!";
            $scope.message = '';
            return;
        }

        $scope.loading = true;
        $scope.error = '';
        $scope.message = '';

        var payload = { token: token, password: $scope.formData.password };
        console.log("payload", payload);
        
        $http.post('http://localhost:5211/api/auth/activate-and-set-password', payload)
        .then(function(response) {
            console.log("response", response.data);
            $scope.loading = false;
            $scope.message = "Your password has been set successfully";
            $scope.showPasswordForm=false;
            loadUsers();
            // $timeout(function(){
            //     $location.path("/login");
            // },3000)
        })
        // .catch(function(error) {
        //     $scope.loading = false;
        //     if (error.status === 400 && error.data === "Account already activated.") {
        //         $scope.error = "This account has already been activated.";
        //     } else if(error.status === 404 && error.data === "User not found"){
        //         $scope.error=error.data
        //     } 
        //     else {
        //         $scope.error = "Failed to activate account. Please try again.";
        //     }
        //     console.error("Activation error:", error);
        // });

        .catch(function(error) {
            $scope.loading = false;

            
            const errMsg =  error?.data || "Failed to activate account.";

            if (errMsg.includes("Account already activated")) {
                $scope.error = "This account has already been activated.";
                $scope.showPasswordForm = false; 
            } else if (errMsg.includes("User not found")) {
                $scope.error = "User not found.";
                $scope.showPasswordForm = false;
            } else if (errMsg.includes("Invalid token")) {
                $scope.error = "Invalid or expired activation link.";
                $scope.showPasswordForm = false;
            } else {
                $scope.error = "Failed to activate account. Please try again.";
            }

            console.error("Activation error:", error);
        }).finally(function(){
            $scope.loading=false;
        });

    };
});
