app.controller('LoginController',function($scope,$http,$location,$rootScope){
    $scope.user={};
    $scope.loading=false;
    $scope.errorMessage='';
    $scope.submitted = false;
    $rootScope.currentUser=null;

    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    $scope.loginUser=function(loginForm){
         $scope.submitted = true;
        // $scope.loading=true;
        $scope.errorMessage='';
        if(loginForm && loginForm.$valid){
            $scope.loading=true;
                $http.post('http://localhost:5211/api/auth/login',$scope.user)
            .then(function(response){
                $scope.loading=false;
                console.log("response formlogin",response.data);

                localStorage.setItem("authToken",response.data.token);
                const userInfo = parseJwt(response.data.token);
                localStorage.setItem("currentUser",JSON.stringify(userInfo));
                console.log("Decoded user info:", userInfo.userId);
                // console.log("token",response.data.token);
                $scope.message='Login Successfully';

                const userId=userInfo.userId;

                $http.get('http://localhost:5211/api/users/'+userId)
                .then(function(resp){
                    const user=resp.data;
                    localStorage.setItem('currentUser',JSON.stringify(user));
                    $rootScope.currentUser=user;
                    $location.path('/users');
                })

                
            }).catch(function(error){
                $scope.loading=false;
                console.error("Login failed",error);
                
                if(error.data){
                    $scope.errorMessage=error.data;
                } else{
                    $scope.error="Invalid email or password."
                }
            })
        }
        
    }
})