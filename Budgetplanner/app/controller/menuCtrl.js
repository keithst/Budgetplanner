angular.module('app')
    // Path: /
    .controller('menuCtrl', ['$scope', '$state', '$stateParams', 'authSvc', 'localStorageService', function ($scope, $state, $stateParams, authSvc, localStorageService) {
        $scope.authentication = authSvc.authentication;
        $scope.logout = authSvc.logout;
        var self = this;

        self.selected = {
            id: ""
        }

        self.gotoHome = function () {
            self.selected.id = localStorageService.get('home');
            $state.go('house', self.selected);
        }
    }])