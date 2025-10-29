
app.controller("GenreController",function($scope,GenreService,ModalService){


  $scope.generes=[];
  $scope.filteredGeneres=[];


  // Pagination
  $scope.currentPage=1;
  $scope.itemsPerPage=5;

  $scope.showAddForm=false;
  $scope.showViewPopup=false;
  $scope.searchText="";
  $scope.newGenre={name:""};
  $scope.genreForm = { name: "" };
  $scope.selectedGenre=null;
  $scope.editingGenre = null;
  $scope.generId="";
  $scope.submitted = false;

console.log("editingGenre",$scope.editingGenre);

  function loadGenres(){
    GenreService.getAll()
                .then(function(respone){
                  $scope.generes=respone.data;
                  console.log("genre",$scope.generes);
                  
                  $scope.applyFilter();
                }).catch(function(error){
                  console.error("Error loading genres:",error);
                })
  }


  $scope.applyFilter = function(){
    const text=$scope.searchText.toLowerCase();
    $scope.filteredGeneres=$scope.generes.filter(g=>g.name.toLowerCase().includes(text));
    $scope.currentPage=1;
  };

  $scope.paginatedGeneres=function(){
    const start=($scope.currentPage-1) * $scope.itemsPerPage;
    const end=start+$scope.itemsPerPage;
    return $scope.filteredGeneres.slice(start,end);
  };

  $scope.totalPages = function(){
    return Math.ceil($scope.filteredGeneres.length / $scope.itemsPerPage) || 1;
  };

  $scope.nextPage = function(){
    if($scope.currentPage < $scope.totalPages()) $scope.currentPage++;
  };

  $scope.prevPage=function(){
    if($scope.currentPage > 1) $scope.currentPage--;
  };

  // $scope.toggleAddForm = function(){
  //   $scope.showAddForm = !$scope.showAddForm;
  //   // $scope.newGenre={name:""};
  //   $scope.editingGenre=false;
  //   $scope.newGenre=null;
  //   $scope.submitted=false;
  // }

  $scope.toggleAddForm = function(form) {
  $scope.showAddForm = !$scope.showAddForm;
  
  // Reset state only when closing form
  if (!$scope.showAddForm) {
    $scope.newGenre = { name: "" };
    $scope.editingGenre = false;
    $scope.submitted = false;

    if (form) {
      form.$setPristine();
      form.$setUntouched();
    }
  }
};


  $scope.addGenre=function(form){
    $scope.submitted=true;
     if (form.$invalid) {
    // ModalService.showMessage('error', 'Please fix validation errors');
    return;
  }
    if($scope.newGenre.name){
      GenreService.add($scope.newGenre)
          .then(function(respone){
            console.log("Genre add",respone.data);
            loadGenres();
            if (form) {
              form.$setPristine();
              form.$setUntouched();
            }
            $scope.toggleAddForm(form); 
            $scope.submitted = false;
            ModalService.showMessage('success','Genre added successfully')
          }).catch(function(error){
            console.error("Error adding genre:",error);
            ModalService.showMessage('error','failed to add genre')
          });
    } else{
      // alert("Please enter a genre name !");
      ModalService.showMessage('error','Please enter a genre name')
    };
  };
  

  $scope.closeViewPopup = function (){
    $scope.showViewPopup = false;
    $scope.selectedGenre =null;
  };

  $scope.deletedGenre=function(id){
    // if(confirm("Are you sure you want to delete this genre?")){
    //   GenreService.delete(id);
    //   $scope.generes = angular.copy(GenreService.getAll());
    //   $scope.applyFilter();
    //   if ($scope.currentPage > $scope.totalPages()) {
    //             $scope.currentPage = $scope.totalPages();
    //   }
    // }
    ModalService.confirm("Are you sure want to delte this genre ?").
    then(function(confirmed){
      if(confirmed){
         GenreService.delete(id)
            .then(function(){
              loadGenres();
              ModalService.showMessage('success','Genre deleted successfully')
            }).catch(function(error){
              console.error("Error deleting genre:",error);
              ModalService.showMessage('error','failed to delete genre')
              
            });
      }
    })
    // if(confirm("Are you sure want to delte this genre ?")){
    //     GenreService.delete(id)
    //         .then(function(){
    //           loadGenres();
    //         }).catch(function(error){
    //           console.error("Error deleting genre:",error);
              
    //         });
    // }
  };


$scope.editGenre = function(id) {
  // const genre = GenreService.getById(id);
  // console.log("genre", genre);

  // if (genre) {
  //   $scope.newGenre = angular.copy(genre); // copy both id and name
  //   $scope.showAddForm = true;
  //   $scope.editingGenre = true;
  // }

    GenreService.getById(id)
              .then(function(respone){
                $scope.newGenre=respone.data;
                $scope.showAddForm=true;
                $scope.editingGenre=true;
              }).catch(function(error){
                console.error("Error fetching genre:",error);
              });
};



  $scope.updateGenre = function() {
  

  if($scope.newGenre && $scope.newGenre.name){
    GenreService.update($scope.newGenre.id,$scope.newGenre)
                .then(function(response){
                  console.log("Genre updated",response.data);
                  loadGenres();
                  $scope.toggleAddForm();
                  $scope.submitted = false;
                  ModalService.showMessage('success','Genre update successfully');
                }).catch(function(error){
                  console.error("Error updating genre",error);
                  ModalService.showMessage('error','failed to update genre');
                  
                });
  } else {
    // alert("Please enter a genre name !");
    // ModalService.showMessage('error','Please enter a genre name')
  }
};

  $scope.cancelEdit = function () {
        $scope.editingGenre = null;
        $scope.toggleAddForm();
    };

  $scope.applyFilter();
  loadGenres();
})