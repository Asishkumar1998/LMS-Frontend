app.controller("AddBookController",function($scope,$location,BooksService,AuthorService,GenreService,ModalService){

    // get All required Services
    $scope.authors=[];
    $scope.genres=[];
    $scope.loading=true;
    $scope.submitted = false;
    $scope.books=[];


    function loadBooks(){
        $scope.loading=true;
        BooksService.getAll()
            .then(function(response){
                $scope.books=response.data;
                // $scope.filteredBooks=angular.copy($scope.books);
                // $scope.applyFilter();
            }).catch(function(error){
                console.error("error loading books:",error);
            }).finally(function(){
                $scope.loading=false;
            });
    }

    loadBooks();

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
                
            }).catch(function(error){
                console.error("Error genre Loading",error);
                
            }).finally(function(){
                $scope.loading=false;
            })
    }

    loadAuthors();
    loadGenres();

    $scope.goToBook = function(bookId) {
    $location.path('/books')
    };

    $scope.book={
        title:"",
        authorId:"",
        genreId:"",
    };

   

    $scope.saveBook=function(bookForm) {

        $scope.submitted = true;
        
        
        if(bookForm.$valid && $scope.book.title && $scope.book.authorId && $scope.book.genreId){
           console.log("add");
            const selectedAuthor=$scope.authors.find(a=>a.id===parseInt($scope.book.authorId));
            const selectedGenres=$scope.genres.find(g=>g.id===parseInt($scope.book.genreId));
            // const selectedGenres=$scope.genres.filter(g=>$scope.book.genreId.includes(g.id));

            
            console.log("selectedAuthor",selectedAuthor);
            console.log("selectedGenre",selectedGenres);

            const newBook = {
            title: $scope.book.title,
            authorId: selectedAuthor.id,
            // author: selectedAuthor,
            bookTags: [
            { tagId: selectedGenres.id, tagName: selectedGenres.name }
            ]
            // bookTags:selectedGenres.map(g=>({tagId:g.id,tagName:g.name}))
            };
            console.log("newBook",newBook);
            
        BooksService.add(newBook)
        .then(function(response){
                        $scope.submitted = false;
                        bookForm.$setPristine();
                        bookForm.$setUntouched();
                        $scope.book = { title: "", authorId: "", genreIds: [] };
                        return BooksService.getAll();
            // $location.path("/books");
        })
        .then(function(respone){
            $scope.books=respone.data;
            ModalService.showMessage('success','Book added successfully!');
            $location.path("/books");
        })
        .catch(function(error){
            console.error("Error adding book:",error);
        })
           
        } 
    };

   
});