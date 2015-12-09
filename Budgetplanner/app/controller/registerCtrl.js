'use strict';
angular.module('app').controller('registerCtrl', ['authSvc', '$timeout', '$state', function (authSvc, $timeout, $state) {

    this.savedSuccessfully = false;
    this.message = "Register a new account";
    this.isError = false;

    this.model = {
        Username: "",
        FirstName: "",
        LastName: "",
        Email: "",
        Password: "",
        ConfirmPassword: "",
    };
    var self = this;
    this.register = function () {

        var scope = this;

        authSvc.register(this.model).then(function (response) {

            self.savedSuccessfully = true;
            scope.message = "User has been registered successfully, you will be redicted to login page in 2 seconds.";
            messageDelay(2, redirectCallback);
        },
            function (response) {
                var errors = [];
                for (var key in response.data.ModelState) {
                    for (var i = 0; i < response.data.ModelState[key].length; i++) {
                        errors.push(response.data.ModelState[key][i]);
                    }
                }
                scope.message = "Failed to register user due to:" + errors.join(' ');
                scope.isError = true;
                messageDelay(2, registerErrorCallback, scope);
            });
    };

    var messageDelay = function (interval, callBack, scope) {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            callBack(scope);
        }, 1000 * interval);
    }

    var registerErrorCallback = function (scope) {
        scope.message = "Register a new account";
        scope.isError = false;
    }

    var redirectCallback = function () {
        $state.go('login');
    }
}])