angular.module('app')
    // Path: /
    .controller('menuCtrl', ['$scope', '$state', '$stateParams', 'authSvc', 'localStorageService', function ($scope, $state, $stateParams, authSvc, localStorageService) {
        $scope.authentication = authSvc.authentication;
        $scope.logout = authSvc.logout;
        var self = this;

        self.selected = {
            id: "",
            HoH: "",
            Invited: ""
        }

        self.go = {
            id: ""
        }

        self.gotoHome = function () {
            self.selected = localStorageService.get('home');
            self.go.id = self.selected.id;
            if (self.selected.id != null)
            {
                if (self.selected.HoH) {
                    $state.go('house', self.go);
                }
                else {
                    $state.go('userhouse', self.go);
                }
            }
            else
            {
                $state.go('nohouse')
            }
        }
    }])