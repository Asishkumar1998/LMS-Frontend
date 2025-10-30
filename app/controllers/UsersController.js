var app=angular.module('myApp');

// app.controller("UsersController",function($scope,UserService){
//     $scope.users=UserService.getAll();
//     $scope.newUser={};
//     $scope.editIndex=-1;

//     // Add user
//     $scope.addUser=function(){
//         if($scope.newUser.name && $scope.newUser.email){
//             UserService.add(angular.copy($scope.newUser));
//             $scope.newUser={};
//         }
//     };

//     // edit user
// })

app.controller("UsersController", function($scope,$location, UserService,ModalService) {
    $scope.users=[];
    $scope.loading=true;
  
  $scope.newUser = {};
  $scope.editIndex = -1;
  $scope.editingUser=null;

  $scope.currentPage=1;
  $scope.itemsPerPage=5;

  $scope.showAddForm=false;
  $scope.showTable=false;

  $scope.statusMap = {
    1: "Ready For Activation",
    2: "Active",
    3: "Suspended",
    4: "Terminated"
};

  $scope.loadUsers=function(){
      $scope.loading=true;
      UserService.getAll()
        .then(function(response){
          $scope.users=response.data;
          console.log("data user",response.data);
          console.log("users",$scope.users);
        })
        .catch(function(error){
          console.error("Error loading users",error);
          ModalService.showMessage('error','Failed to load users from server')
          // alert("Failed to load users from server");
        })
        .finally(function(){
          $scope.loading=false;
        })
  }

  $scope.loadUsers();

  console.log("users",$scope.users);

  $scope.goToAddUser = function() {
    $location.path("/add-user");
};

$scope.goToEditUser = function(userId) {
  
  
    $location.path("/edit-user/" + userId);
};

  $scope.totalPages=function(){
    return Math.ceil($scope.users.length / $scope.itemsPerPage);
  }

  $scope.prevPage=function(){
    if($scope.currentPage>1) $scope.currentPage--;
  };

  $scope.nextPage=function(){
    if($scope.currentPage<$scope.totalPages()) $scope.currentPage++;
  }

  $scope.setPage=function(page){
        if(page>=1 && page<=$scope.totalPages()){
            $scope.currentPage=page;
        }
    };

  $scope.toggleAddForm=function(){
    $scope.showAddForm=!$scope.showAddForm;
    $scope.newUser={};
  }
  console.log("Controller");
  // Add user
  $scope.addUser = function() {
  
    
    if ($scope.newUser.name && $scope.newUser.email) {
        // $scope.newUser.id=$scope.users.length ? $scope.users[$scope.users.length-1].id+1:1;
      UserService.add(angular.copy($scope.newUser));
      $scope.newUser = {};
      $scope.showAddForm=false;
      $scope.showTable=true;
    }
  };

  $scope.getPageNumbers=function(){
    var total=$scope.totalPages();
    var current=$scope.currentPage;
    var start=Math.max(current-2,1);
    var end=Math.min(start+4,total);

    start=Math.max(end-4,1);
    var pages=[];
    for(var i=start;i<=end;i++){
        pages.push(i);
    }
    return pages;    
}



  // Edit user
  
  $scope.editUser = function(user) {
        $scope.editingUser = angular.copy(user);
    };

  // Update user
$scope.updateUser = function() {
    if($scope.editingUser){
        UserService.update($scope.editingUser)
        .then(function(response){
            // Update the user in $scope.users
            for (let i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i].id === $scope.editingUser.id) {
                    $scope.users[i] = angular.copy($scope.editingUser);
                    break;
                }

            }
            $scope.editingUser = null;  // hide edit form
            ModalService.showMessage('success',"User update successfully")
        })
        .catch(function(error){
            console.error("Error updating user:",error);
            ModalService.showMessage('error', 'Failed to update user!');
        });
    }
};



$scope.deleteUser=function(id){
  ModalService.confirm("Are you sure you want to delete this User?")
  .then(function(confirmed){
    if(confirmed){
      UserService.delete(id)
        .then(function(response){
          console.log("delete respone",response);
          $scope.loadUsers();
        })
        .catch(function(error){
          console.error("Error deleting user:",error);
        })
    }
  })
}


  // Delete user
  // $scope.deleteUser = function(id) {
  //   if (confirm("Are you sure you want to delete this user?")) {
  //     UserService.delete(id)
  //       .then(function(response){
  //         console.log("delete respone",response);
  //         $scope.loadUsers();
  //       })
  //       .catch(function(error){
  //         console.error("Error deleting user:",error);
  //       })
       
  //   }
  // };

  // Cancel editing
  $scope.cancelEdit = function() {
    // $scope.newUser = {};
    // $scope.editIndex = -1;
    $scope.editingUser=null;
  };
});
