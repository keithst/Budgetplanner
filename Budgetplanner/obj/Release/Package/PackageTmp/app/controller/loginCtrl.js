'use strict';
angular.module('app').controller('loginCtrl', ['localStorageService', 'userSvc', 'authSvc', '$q', '$scope', '$timeout', '$state', function (localStorageService, userSvc, authSvc, $q, $scope, $timeout, $state) {

    this.model = {
        Username: '',
        Password: ''
    }

    this.house = {
        id: ""
    }

    this.message = "Login to your account";
    this.isError = false;
    this.alter = '';

    this.login = function () {
        var scope = this;

        authSvc.login(this.model).then(function (response) {
            $q.all([userSvc.getUser({ userid: scope.model.Username })]).then(function (data) {
                if (data[0][0].HouseId != null)
                {
                    localStorageService.set('home', { id: data[0][0].HouseId, HoH: data[0][0].isHoH, Invited: data[0][0].isInvited });
                    scope.house.id = data[0][0].HouseId;
                    if (data[0][0].isHoH)
                    {
                        $state.go('house', scope.house);
                    }
                    else {
                        $state.go('userhouse');
                    }
                }
                else
                {
                    localStorageService.set('home', { id: data[0][0].HouseId, HoH: data[0][0].isHoH, Invited: data[0][0].isInvited });
                    $state.go('userhouse');
                }
            })
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