app.controller("EditAuthorController", function($scope, $routeParams, $location, AuthorService,ModalService) {
    const authorId = parseInt($routeParams.id);
    $scope.isEdit = !!authorId;
    console.log("authoeId",authorId);
    $scope.author={};
    $scope.loading=false;
    $scope.submitted=false;
    $scope.getAuthors=[];

    function loadAuthor(){
        $scope.loading=true;
        AuthorService.getAll()
            .then(function(response){
                $scope.getAuthors=response.data;
            }).catch(function(error){
                console.error("error loading books:",error);
                
            }).finally(function(){
                $scope.loading=false;
            })
    }

    loadAuthor();
    
    if ($scope.isEdit) {
        // const existingAuthor = AuthorService.getById(authorId);
        // console.log("existingAuthor",existingAuthor);
        
        // if (existingAuthor) {
        //     $scope.author = angular.copy(existingAuthor);
        // } else {
        //     alert("Author not found!");
        //     $location.path("/authors");
        //     return;
        // }

        $scope.loading=true;
        AuthorService.getById(authorId)
                .then(function(respone){
                    $scope.author=respone.data;
                }).catch(function(error){
                    console.error("Error fetching author:",error);
                    $location.path("/authors");   
                }).finally(function(){
                    $scope.loading=false;
                });
    } else {
        $scope.author = { name: "", penName: "" };
    }

    $scope.saveAuthor = function(authorForm) {
        $scope.submitted=true;
        if (!authorForm || !authorForm.$valid) {
        return; // stop execution if invalid
    }
             if($scope.isEdit){
            AuthorService.update(authorId,$scope.author)
            .then(function(){
                        
                        // authorForm.$setPristine();
                        // authorForm.$setUntouched();
                ModalService.showMessage('success', 'Author updated successfully');
                $location.path("/authors");
            }).catch(function(error){
                console.error("Error updating author:",error);
                ModalService.showMessage('error', 'Failed to update author');
                
            })
        } else{
            
                 AuthorService.create($scope.author)
                    .then(function(){
                        $scope.submitted = false;
                        ModalService.showMessage('success', 'Author added successfully!');
                        return AuthorService.getAll();
                       
                        
                    }).then(function(response){
                        $scope.getAuthors=response.data;
                        authorForm.$setPristine();
                         authorForm.$setUntouched();
                        $location.path("/authors");
                       
                    })
                    .catch(function(error){
                        console.error("Error adding author:",error);
                        ModalService.showMessage('error', 'Failed to add author!');
                        
                    })
            }
         
        
        
       
        
    };

    $scope.cancel = function() {
        $location.path("/authors");
    };
});
