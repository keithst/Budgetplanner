'use strict';
angular.module('app').controller('loginCtrl', ['authSvc', '$scope', '$timeout', '$state', function (authSvc, $scope, $timeout, $state) {

    this.model = {
        Username: '',
        Password: ''
    }

    this.message = "Login to your account";
    this.isError = false;
    this.alter = '';

    this.login = function () {
        var scope = this;

        authSvc.login(this.model).then(function (response) {
            $state.go('house');
        },
            function (err) {
                scope.message = err.error_description;
                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    //Anything I need to do
                    scope.message = "Login to your account"
                }, 1000 * 2);
            });
    };

}])