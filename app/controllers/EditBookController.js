app.controller("EditBookController",function($scope,$routeParams,$location,BooksService,AuthorService,GenreService,ModalService){

    $scope.authors=[];
    $scope.genres=[];
    $scope.editingBook=false;
    // $scope.existingBook=null;
    $scope.loading=true;
    $scope.book={};
    const bookId=parseInt($routeParams.bookId);




    
   



    function loadAuthors(){
        $scope.loading=true;
        AuthorService.getAll()
            .then(function(response){
                $scope.authors=response.data;
            }).catch(function(error){
                console.error("Error AuthorLoading",error);
                
            }).finally(function(){
                $scope.loading=false;
            })
    }

    function loadGenres(){
        $scope.loading=true;
        GenreService.getAll()
            .then(function(response){
                $scope.genres=response.data;
                console.log("genre",$scope.genres);
                 // Pre-fill genre after genres load
            if($scope.book && $scope.book.genreId) {
                $scope.book.genreId = parseInt($scope.book.genreId);
            }
                
            }).catch(function(error){
                console.error("Error genre Loading",error);
                
            }).finally(function(){
                $scope.loading=false;
            })
    }



    BooksService.getById(bookId)
      .then(function(respone){
        const existingBook=respone.data;
       if(!existingBook){
                ModalService.showMessage('error','Book not found !');
                // alert("Book not found!");
                $location.path("/books");
                return;
            }
          $scope.book = angular.copy(existingBook);

          $scope.book.authorId = existingBook.author ? existingBook.author.id : "";
          $scope.book.genreId=existingBook.bookTags.length>0 ? existingBook.bookTags[0].tagId:"";
        
          console.log("Prefilled Book",$scope.book);
          
      }).catch(function(error){
        console.error("Erro fetching Book",error);
        $location.path("/books");
      })
    $scope.goToBook = function(bookId) {
    $location.path('/books')
    };
    
    

   

    // $scope.book=angular.copy(existingBook);
//     $scope.book.genreId=existingBook.bookTags.length ? existingBook.bookTags[0].tagId:"";
//     console.log("genreId",$scope.book.genreId);
    
//     console.log("book.authorId:", $scope.book.authorId, typeof $scope.book.authorId);
// console.log("book.genreId:", $scope.book.genreId, typeof $scope.book.genreId);

    $scope.saveBook = function() {
    if ($scope.book.title && $scope.book.authorId && $scope.book.genreId) {
        $scope.editingBook=true;
      

        const selectedAuthor=$scope.authors.find(a=>a.id===parseInt($scope.book.authorId));
        const selectedGenre=$scope.genres.find(g=>g.id===parseInt($scope.book.genreId));
        
        console.log("selectedgene",selectedGenre);
        
      const updatedBook = {
        id:bookId,
        title:$scope.book.title,
        authorId:selectedAuthor.id,
        bookTags:[{tagId:selectedGenre.id,tagName:selectedGenre.name}]
      };

      BooksService.update(bookId, updatedBook)
        .then(function(respone){
          $location.path("/books");
          console.log("updatedbook",updatedBook);
          ModalService.showMessage('success','Book update successfully')
          
          
        }).catch(function(error){
          console.error("Erro updating book",error);
          
        })
     
    } else {
        $scope.editingBook=true;
        ModalService.showMessage('error','Please fill all fields');
      // alert("Please fill all fields");
    }
  };

  loadAuthors();
    loadGenres();
});