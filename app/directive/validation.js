app.directive('onlyLetters', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$validators.onlyLetters = function(modelValue) {
                if (!modelValue) return true; // allow empty if not required
                return /^[a-zA-Z]+$/.test(modelValue);
            };
        }
    };
});

// Phone number validation (10 digits)
app.directive("validPhone", function() {
    var PHONE_REGEX = /^\d{10}$/;
    return {
        require: "ngModel",
        link: function(scope, element, attrs, ctrl) {
            ctrl.$validators.validPhone = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) return true; // allow empty until required triggers
                return PHONE_REGEX.test(viewValue);
            };
        }
    };
});



app.directive('duplicateName', function() {
    return {
        require: 'ngModel',
        scope: {
            existingUsers: '=duplicateName'
        },
        link: function(scope, element, attrs, ngModel) {
            ngModel.$validators.duplicateName = function(modelValue) {
                if (!modelValue) return true;

                
                if (!Array.isArray(scope.existingUsers)) return true;

                let exists = scope.existingUsers.some(u =>
                    u.profile && u.profile.firstName && 
                    u.profile.firstName.toLowerCase() === modelValue.toLowerCase()
                );

                return !exists;
            };

            
            scope.$watchCollection('existingUsers', function() {
                ngModel.$validate();
            });
        }
    };
});

// Duplicate Email
app.directive('duplicateEmail', function() {
    return {
        require: 'ngModel',
        scope: { existingUsers: '=duplicateEmail' },
        link: function(scope, element, attrs, ngModel) {
            ngModel.$validators.duplicateEmail = function(modelValue) {
                if (!modelValue) return true;
                if (!Array.isArray(scope.existingUsers)) return true;

                const exists = scope.existingUsers.some(u =>
                    u.email &&
                    u.email.toLowerCase() === modelValue.toLowerCase()
                );
                return !exists; // invalid if duplicate
            };

            scope.$watchCollection('existingUsers', function() {
                ngModel.$validate();
            });
        }
    };
});

// Duplicate Contact Number
app.directive('duplicateContact', function() {
    return {
        require: 'ngModel',
        scope: { existingUsers: '=duplicateContact' },
        link: function(scope, element, attrs, ngModel) {
            ngModel.$validators.duplicateContact = function(modelValue) {
                if (!modelValue) return true;
                if (!Array.isArray(scope.existingUsers)) return true;

                const exists = scope.existingUsers.some(u =>
                    u.contactNo &&
                    u.contactNo === modelValue
                );
                return !exists; // invalid if duplicate
            };

            scope.$watchCollection('existingUsers', function() {
                ngModel.$validate();
            });
        }
    };
});

app.directive('duplicateBookName', function() {
    return {
        require: 'ngModel',
        scope: {
            existingBooks: '=duplicateBookName'
        },
        link: function(scope, element, attrs, ngModel) {
            ngModel.$validators.duplicateName = function(modelValue) {
                if (!modelValue) return true;

                if (!Array.isArray(scope.existingBooks)) return true;

                let exists = scope.existingBooks.some(b =>
                    b && b.title &&
                    b.title.toLowerCase() === modelValue.toLowerCase()
                );

                return !exists; 
            };

            
            scope.$watchCollection('existingBooks', function() {
                ngModel.$validate();
            });
        }
    };
});

app.directive('duplicateAuthorName', function() {
    return {
        require: 'ngModel',
        scope: {
            existingAuthors: '=duplicateAuthorName', 
            currentAuthorId: '<' 
        },
        link: function(scope, element, attrs, ngModel) {
            ngModel.$validators.duplicateAuthorName = function(modelValue) {
                if (!modelValue) return true;

                if (!Array.isArray(scope.existingAuthors)) return true;

                
                let exists = scope.existingAuthors.some(a =>
                    a && a.name &&
                    a.name.toLowerCase() === modelValue.toLowerCase() &&
                    a.id !== scope.currentAuthorId
                );

                return !exists; 
            };

            scope.$watchCollection('existingAuthors', function() {
                ngModel.$validate();
            });
        }
    };
});


app.directive('duplicateGenreName', function() {
  return {
    require: 'ngModel',
    scope: {
      duplicateGenreName: '=' 
    },
    link: function(scope, element, attrs, ngModel) {
      ngModel.$validators.duplicateGenre = function(value) {
        if (!value) return true; 

        
        const existing = scope.duplicateGenreName.some(function(g) {
          return g.name && g.name.trim().toLowerCase() === value.trim().toLowerCase();
        });

        
        if (scope.$parent.editingGenre && scope.$parent.newGenre.originalName) {
          if (value.trim().toLowerCase() === scope.$parent.newGenre.originalName.trim().toLowerCase()) {
            return true;
          }
        }

        return !existing;
      };

      
      scope.$watch('duplicateGenreName.length', function() {
        ngModel.$validate();
      });
    }
  };
});




