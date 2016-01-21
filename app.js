var app = angular.module('libraryApp', ['ngRoute', 'ngResource']);

// Routes

app.config(['$routeProvider', '$locationProvider', 
  function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/books/index.html',
        controller: 'BooksIndexCtrl'
      })
      .when('/books/:id', {
        templateUrl: 'templates/books/show.html',
        controller: 'BooksShowCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider
      .html5Mode({
        enabled: true,
        requireBase: false
      });
  }]);

// Factory

app.factory("Book", ["$resource", function($resource) {
  return $resource("https://super-crud.herokuapp.com/books/:id", { id: "@_id" }, {
    query: {
      isArray: true,
      transformResponse: function(data) { return angular.fromJson(data).books; }
    },
    update: { method: 'PUT' }
  });
}]);

// Controllers

app.controller('BooksIndexCtrl', ['$scope', 'Book',
  function($scope, Book) {
    $scope.allBooks = Book.query();

    $scope.saveBook = function() {
      var savedBook = Book.save($scope.newBook);
      $scope.newBookForm = false;
      $scope.allBooks.push(savedBook);
      $scope.newBook = {};
    };

  }
]);

app.controller('BooksShowCtrl', ['$scope', '$routeParams', '$location', 'Book', 
  function($scope, $routeParams, $location, Book) {
    var bookId = $routeParams.id;

    book = Book.get({ id: bookId },
      function(data) {
        $scope.book = data;
      },
      function(error) {
        $location.path('/');
      }
    );

    $scope.deleteBook = function () {
      Book.delete({ id: bookId });
      $location.path('/');
    };

    $scope.updateBook = function() {
      Book.update({ id: bookId }, $scope.bookToUpdate,
        function(data) {
          $location.path('/');
        }
      );
    };


  }
]);







