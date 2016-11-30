"use strict";
/*global angular, app, window*/

app.controller('bookCtrl', function ($scope, $http, $routeParams, $location, $timeout) {
    $scope.similars = [];
    window.scrollTo(0, 0);

    /**
    * Runs the main task of the controller, executes the getBook method.
    * 
    * @author  cfontana0
    * @method start
    * @return (null)
    */
    $scope.start = function () {
        window.scrollTo(0, 0);
        $scope.getBook($routeParams.name, function () {
            $timeout(function () {
                $scope.getSimilars();
            }, 0);
        });
    };


    /**
    * Fetchs existing books and gets the book objects related to the provided name identifier,
    * then calls the provided callback.
    * 
    * @author  cfontana0
    * @method getBook
    * @param name (String)
    * @param onComplete (Function)
    * @return (null)
    */
    $scope.getBook = function (name, onComplete) {
        $http.get('./src/static/books.json').then(function (books) {
            angular.forEach(books.data, function (book) {
                if (encodeURIComponent(book.name.replace(/\s/g, "_")) === encodeURIComponent(name)) {

                    //workaround solution to improve the performance of the list view creating the thumbnail images.
                    book.coverThumbnail = book.cover.replace('500/700', '150/210');
                    book.author.avatarThumbnail = book.author.avatar.replace('250/250', '80/80');

                    $scope.book = book;
                }
            });
            onComplete();
        });
    };

    /**
    * Gets 3 similar books related to current book.
    * 
    * @author  cfontana0
    * @method getSimilars
    * @return (null)
    */
    $scope.getSimilars = function () {
        var count = 0;
        $http.get('./src/static/books.json').then(function (books) {
            angular.forEach(books.data, function (book, key) {
                if ((encodeURIComponent(book.name.replace(/\s/g, "_")) !== (encodeURIComponent($scope.book.name.replace(/\s/g, "_")))) &&  count < 3 && ((book.genre.name === $scope.book.genre.name) || (book.genre.category === $scope.book.genre.category))) {
                    count = count + 1;
                    book.cover = book.cover + '?' + key;

                    //workaround solution to improve the performance of the list view creating the thumbnail images.
                    book.coverThumbnail = book.cover.replace('500/700', '150/210');

                    $scope.similars.push(book);
                }
            });
        });
    };

    /**
    * Navigates to the provided book.
    * 
    * @author  cfontana0
    * @method openBook
    * @param book (Object)
    * @return (null)
    */
    $scope.openBook = function (book) {
        var bookName = encodeURIComponent(book.name.replace(/\s/g, "_"));
        $location.url('book/' + bookName);
    };

    /**
    * Navigates to the provided url, in this case to the book marketplace.
    * 
    * @author  cfontana0
    * @method openBook
    * @param book (Object)
    * @return (null)
    */
    $scope.go = function (url) {
        $location.url(url);
    };

    /**
    * Starts the controller logic.
    * 
    * @author  cfontana0
    */
    $scope.start();
});
