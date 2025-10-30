app.controller("AuthorController",function($scope,AuthorService,$location,ModalService){
    $scope.authors=[];

    $scope.filteredAuthors=[];
    $scope.newAuthor={};
    $scope.editIndex=-1;
    $scope.editingAuthor=null;

    $scope.currentPage=1;
    $scope.itemsPerPage=5;
    $scope.searchText="";

    $scope.showAddForm=false;
    $scope.showTable=true;


    function loadAuthors(){
        AuthorService.getAll()
            .then(function(respone){
                $scope.authors=respone.data;
                $scope.filteredAuthors=angular.copy($scope.authors);
            }).catch(function(error){
                console.error("Error fetching authors:",error);
            });
    }


    $scope.addAuthor=function(){
        $location.path("/add-author");
    };

    $scope.editAuthor=function(id){
        $location.path("/edit-author/"+id);
    };

    // $scope.deleteAuthor=function(id){
    //     if(confirm("Are you sure want to delete this author?")){
    //         AuthorService.delete(id)
    //             .then(function(){
    //                 loadAuthors();
    //             }).catch(function(error){
    //                 console.error("Error deleting author:",error);
                    
    //             });
    //     };
    // };
    $scope.deleteAuthor=function(id){
        ModalService.confirm("Are you sure want to delete this author?")
        .then(function(confirmed){
            if(confirmed){
                 AuthorService.delete(id)
                .then(function(){
                    loadAuthors();
                    ModalService.showMessage('success','Author delete successfully')
                }).catch(function(error){
                    console.error("Error deleting author:",error);
                    ModalService.showMessage('error',error.data)
                    
                });
            }
        })
    };

    $scope.totalPages=function(){
        return Math.ceil($scope.filteredAuthors.length/$scope.itemsPerPage);
    }

    $scope.paginatedAuthors=function(){
        const start=($scope.currentPage-1) * $scope.itemsPerPage;
        return $scope.filteredAuthors.slice(start,start+$scope.itemsPerPage);
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

  $scope.applyFilter = function() {
        const text = $scope.searchText.toLowerCase();
        $scope.filteredAuthors = $scope.authors.filter(a =>
            a.name.toLowerCase().includes(text) || a.penName.toLowerCase().includes(text)
        );
        $scope.currentPage = 1;
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

    // Watch search text changes automatically
    $scope.$watch('searchText', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.applyFilter();
        }
    });

  $scope.toggleAddForm=function(){
    $scope.showAddForm=!$scope.showAddForm;
    $scope.newUser={};
  }

  loadAuthors();
})