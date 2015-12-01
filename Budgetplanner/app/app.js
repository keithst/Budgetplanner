var app = angular.module('app', ['ui.router', 'trNgGrid']);

app.config(function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
      .state('trans', {
          url: "/trans/{id}/{type}",
          templateUrl: "/app/view/trans.html",
          controller: "transCtrl as tr"
      })
      .state('acct', {
          url: "/acct",
          templateUrl: "/app/view/acct.html",
          controller: "acctCtrl as act"
      })
      .state('default', {
          url: "/",
          templateUrl: "",
      });
});