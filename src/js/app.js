"use strict";
/*global angular, app*/
/*jslint nomen: true*/

var app = angular.module('book-list', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "./src/templates/book-list.html",
            controller : "bookListCtrl"
        })
        .when("/books", {
            templateUrl : "./src/templates/book-list.html",
            controller : "bookListCtrl"
        })
        .when("/book/:name", {
            templateUrl : "./src/templates/book.html",
            controller : "bookCtrl"
        });
});