app.controller("BookController",function($scope,$location,BooksService,AuthorService,GenreService,ModalService){
    $scope.books=[];
    $scope.authors=[];
    $scope.genres=[];
    $scope.filteredBooks=[];
    


    $scope.searchText="";
    $scope.currentPage=1;
    $scope.itemsPerPage=5;
    $scope.loading=true;

    function loadBooks(){
        $scope.loading=true;
        BooksService.getAll()
            .then(function(response){
                $scope.books=response.data;
                console.log("books",$scope.books);
                
                $scope.filteredBooks=angular.copy($scope.books);
                $scope.applyFilter();
            }).catch(function(error){
                console.error("error loading books:",error);
            }).finally(function(){
                $scope.loading=false;
            });
    }

    function loadAuthor(){
        $scope.loading=true;
        AuthorService.getAll()
            .then(function(response){
                $scope.authors=response.data;
            }).catch(function(error){
                console.error("error loading books:",error);
                
            }).finally(function(){
                $scope.loading=false;
            })
    }

    function loadGenres(){
        $scope.loading=true;
        GenreService.getAll()
            .then(function(response){
                $scope.genres=response.data;
            }).catch(function(error){
                console.error("Erro loading Genres:",error);
                
            }).finally(function(){
                $scope.loading=false;
            })
    }


    $scope.goToAddBook = function() {
    $location.path("/add-book");
    };

    $scope.goToEditBook = function(bookId) {
    $location.path("/edit-book/" + bookId);
    };

    // pagination
    $scope.paginatedBooks=function(){
        const start=($scope.currentPage-1)*$scope.itemsPerPage;
        return $scope.filteredBooks.slice(start,start+$scope.itemsPerPage);
    };

    $scope.totalPages=function(){
        return Math.ceil($scope.filteredBooks.length/$scope.itemsPerPage) || 1;
    };

    $scope.setPage=function(page){
        if(page>=1 && page<=$scope.totalPages()){
            $scope.currentPage=page;
        }
    };
    $scope.prevPage = function() {
        if ($scope.currentPage > 1) $scope.currentPage--;
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalPages()) $scope.currentPage++;
    };

    // filter by title,author name and genre
    $scope.applyFilter=function(){
        const text=$scope.searchText.toLowerCase();
        $scope.filteredBooks=$scope.books.filter(book=>{
            const authorName=book.author?.name?.toLowerCase() || "";
            const tagNames=book.bookTags.map(t=>t.tagName.toLowerCase()).join(", ");
            return(
                book.title.toLowerCase().includes(text) ||
                authorName.includes(text) ||
                tagNames.includes(text)
            );
        });
    };

    // Add new book
    $scope.newBook = { title: "", authorId: "", bookTags: [] };

    $scope.addBook = function () {
        // if ($scope.newBook.title && $scope.newBook.authorId) {
        //     BooksService.add($scope.newBook);
        //     $scope.books = BooksService.getAll();
        //     $scope.applyFilter();
        //     $scope.newBook = { title: "", authorId: "", bookTags: [] };
        // } else {
        //     alert("Please fill in title and authorId");
        // }

        if($scope.newBook.title && $scope.newBook.authorId){
            BooksService.add($scope.newBook)
                .then(function(){
                    loadBooks();
                    $scope.newBook={ title: "", authorId: "", bookTags: [] };
                }).catch(function(error){
                    console.error("Error adding book:",error); 
                });
        } else{
            alert("Please fill in title and authorId");
        }
    };

    
    // $scope.deleteBook = function (id) {
    //     if (ModalService.confirm("Delete this book?")) {
    //         BooksService.delete(id)
    //             .then(function(){
    //                 loadBooks();
    //             }).catch(function(error){
    //                 console.error("Error deleting book:",error);
                    
    //             })
            
    //     }
    // };

    $scope.deleteBook = function (id) {
    ModalService.confirm("Are you sure you want to delete this book?")
        .then(function(confirmed) {
            if (confirmed) {
                BooksService.delete(id)
                    .then(function() {
                        loadBooks();
                        ModalService.showMessage("success", "Book deleted successfully!");
                    })
                    .catch(function(error) {
                        console.error("Error deleting book:", error);
                        ModalService.showMessage("error", "Failed to delete book!");
                    });
            }
        });
};



    loadBooks();
    loadAuthor();
    loadGenres();
})