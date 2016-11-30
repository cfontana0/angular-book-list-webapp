"use strict";
/*global angular, app, document, window*/

app.controller('bookListCtrl', function ($scope, $http, $location, $filter, $document) {

    $scope.categories = ["Non-Fiction", "Fiction"];
    $scope.about = ["Fantasy", "Technology", "Christian Books", "History", "Arts", "Sciences", "Children's Books", "Health", "Calendars", "Business", "Spirituality", "Law", "Parenting"];
    $scope.placeholder = "search books";
    $scope.pagin = {items: 4, pages: [1], selectedPage: 1};
    $scope.itemsOptions = [4, 8, 16, 32];
    $scope.search = {name: undefined, genre: undefined};

    /**
    * Runs the main task of the controller, including fetching all available books
    * 
    * @author  cfontana0
    * @method start
    * @return (null)
    */
    $scope.start = function () {
        $http.get('./src/static/books.json').then(function (books) {
            $scope.books = books.data;
            angular.forEach($scope.books, function (book, key) {
                book.cover = book.cover + '?' + key;
                book.coverThumbnail = book.cover.replace('500/700', '150/210');
                book.author.avatar = book.author.avatar + '?' + key;
                book.author.avatarThumbnail = book.author.avatar.replace('250/250', '30/30');
            });

            $scope.changeItems();

        });
    };

    /**
    * Navigates to the requested book single page.
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
    * Runs when the values on the current scope model changes. this function filters all books 
    * according to filter configuration and then calculates the number of pages based on pagin 
    * confguration. Finally it selects page 1.
    * 
    * @author  cfontana0
    * @method changeItems
    * @return (null)
    */
    $scope.changeItems = function () {

        var i, filtered = $filter('filter')($scope.books, { name: $scope.search.name }), pages = 1;

        if ($scope.search && $scope.search.genre && $scope.search.genre && $scope.search.genre.category) {
            filtered = $filter('filter')(filtered, { genre: { category: $scope.search.genre.category } }, true);
        }

        if ($scope.search && $scope.search.genre && $scope.search.genre && $scope.search.genre.name) {
            filtered = $filter('filter')(filtered, { genre: { name: $scope.search.genre.name } }, true);
        }

        pages = Math.ceil(filtered.length / $scope.pagin.items);

        $scope.pagin.pages = [];

        for (i = 0; i < pages; i = i + 1) {
            $scope.pagin.pages.push(i + 1);
        }

        $scope.filteredBooks = filtered;

        $scope.pagin.selectedPage = 1;
        $scope.goToPage();

    };

    /**
    * Change the pagin and slices the filtered books according to the number of items shown by page.
    * 
    * @author  cfontana0
    * @method goToPage
    * @return (null)
    */
    $scope.goToPage = function () {
        var booksOnPage;
        $scope.first = ($scope.pagin.selectedPage - 1) * $scope.pagin.items;
        $scope.last = $scope.first +  $scope.pagin.items;
        booksOnPage = $scope.filteredBooks.slice($scope.first, $scope.last);
        $scope.booksOnPage = booksOnPage;
    };

    /**
    * Clears current pagin information restarting it to default (4 items by page, page 1 selected).
    * 
    * @author  cfontana0
    * @method clearPaginOnFilter
    * @return (null)
    */
    $scope.clearPaginOnFilter = function () {
        $scope.pagin = {items: 4, pages: [1], selectedPage: 1};
        $scope.changeItems();
    };

    /**
    * Gets the DOM selector for all book-items on viewport.
    * 
    * @author  cfontana0
    * @method getItemsOnViewport
    * @return (null)
    */
    $scope.getItemsOnViewport = function () {
        var elements = document.querySelectorAll(".book-item"), element, w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0), i;
        if (w > 360) {
            return;
        }
        for (i = 0; i < elements.length; i = i + 1) {
            element = elements[i];
            if ($scope.elementInViewport(element)) {
                angular.element(element).addClass('active-item');
            } else {
                angular.element(element).removeClass('active-item');
            }
        }
    };

    /**
    * Returns true/false if the provided body element is visible on current viewport
    * 
    * @author  cfontana0
    * @method elementInViewport
    * @return (Boolean)
    */
    $scope.elementInViewport = function (el) {
        var top = el.offsetTop, left = el.offsetLeft, width = el.offsetWidth, height = el.offsetHeight;
        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }
        return (
            top >= window.pageYOffset &&
            left >= window.pageXOffset &&
            (top + height) <= (window.pageYOffset + window.innerHeight) &&
            (left + width) <= (window.pageXOffset + window.innerWidth)
        );
    };

    /**
    * Binds a scroll event to detect existing book-items when scrolling.
    * 
    * @author  cfontana0
    */
    $document.bind('scroll', $scope.getItemsOnViewport);

    /**
    * Unbinds scroll event when leaving current page. 
    * 
    * @author  cfontana0
    */
    $scope.$on('$destroy', function () {
        $document.unbind('scroll');
    });

    /**
    * Starts controller logic.
    * 
    * @author  cfontana0
    */
    $scope.start();

});
