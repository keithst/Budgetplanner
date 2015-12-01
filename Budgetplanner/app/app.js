var app = angular.module('app', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
      .state('trans', {
          url: "/trans",
          templateUrl: "/app/view/trans.html",
          controller: "transCtrl as tr"
      })
      .state('default', {
          url: "/",
          templateUrl: "",
      });
});