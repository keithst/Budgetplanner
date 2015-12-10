angular.module('app').controller('userhouseCtrl', ['userSvc', 'localStorageService', '$scope', '$q', '$state', 'HouseSvc', '$stateParams', function (userSvc, localStorageService, $scope, $q, $state, HouseSvc, $stateParams) {
    var self = this;

    self.house = {};
    self.disabled = true;
    self.users = [];

    self.update = {
        user: "",
        id: ""
    }

    self.selected = {
        id: ""
    }

    self.passparm = {
        id: ""
    }

    self.cookie = {
        id: "",
        HoH: "",
        Invited: ""
    }

    self.get = function () {
        self.cookie = localStorageService.get('home')
    }

    self.gotoView = function (view, id) {
        self.passparm.id = id;
        $state.go(view, self.passparm)
    }

    self.populate = function () {
        self.selected = $stateParams;
        self.get();
        self.getHouseData();
        if (!self.cookie.Invited) {
            self.getUsers();
        }
    }

    self.getUsers = function () {
        self.users = [];
        $q.all([HouseSvc.getUsers(self.selected)]).then(function (data) {
            for (x = 0; x < data[0].length; x++) {
                self.users.push(data[0][x]);
            }
        })
    }

    self.setuser = function () {
        $q.all([userSvc.getUser({ userid: $scope.authentication.userName })]).then(function (data) {
            $q.all([HouseSvc.joinUser({ user: data[0][0].Id, id: null })]).then(function () {
                self.cookie.Invited = false;
                localStorageService.set('home', self.cookie);
                self.populate();
            })
        })
    }

    self.getHouseData = function () {
        $q.all([HouseSvc.getHouse(self.selected)]).then(function (data) {
            self.house = data[0][0];
            self.disabled = false;
        });
    }

}])