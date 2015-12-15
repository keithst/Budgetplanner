var app = angular.module('app', ['ui.router', 'trNgGrid', 'nvd3', 'LocalStorageModule']);

app.config(function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
      .state('trans', {
          url: "/trans/{house}/{id}",
          templateUrl: "/app/view/trans.html",
          controller: "transCtrl as tr"
      })
      .state('acct', {
          url: "/acct/{id}",
          templateUrl: "/app/view/acct.html",
          controller: "acctCtrl as act"
      })
      .state('budget', {
          url: "/budget/{id}",
          templateUrl: "/app/view/budget.html",
          controller: "budgetCtrl as budget"
      })
      .state('budgetmonth', {
          url: "/budgetmonth/{month}/{year}/{house}",
          templateUrl: "/app/view/budgetmonth.html",
          controller: "budgetmonthCtrl as budgetmonth"
      })
      .state('house', {
          url: "/house/{id}",
          templateUrl: "/app/view/house.html",
          controller: "houseCtrl as house"
      })
      .state('userhouse', {
          url: "/userhouse",
          templateUrl: "/app/view/userhouse.html",
          controller: "userhouseCtrl as userhouse"
      })
      .state('login', {
                url: "/login",
                templateUrl: "/app/view/login.html",
                controller: "loginCtrl as login"
      })
      .state('register', {
            url: "/register",
            templateUrl: "/app/view/register.html",
            controller: "registerCtrl as register"
      })
      .state('splash', {
          url: "/",
          templateUrl: "/app/view/splash.html"
      })
//      .state('default', {
//          url: "/",
//          templateUrl: "",
//      });
});
//var serviceBase = 'http://localhost:49531/';
var serviceBase = 'http://ksturzenbecker-budget.azurewebsites.net/';

app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorSvc');
});

app.run(['authSvc', function (authService) {
    authService.fillAuthData();
}]);