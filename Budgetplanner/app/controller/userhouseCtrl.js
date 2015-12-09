angular.module('app').controller('userhouseCtrl', ['$q', '$state', 'HouseSvc', '$stateParams', function ($q, $state, HouseSvc, $stateParams) {
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

    self.gotoView = function (view, id) {
        self.passparm.id = id;
        $state.go(view, self.passparm)
    }

    self.populate = function () {
        self.selected = $stateParams;
        self.getHouseData();
        self.getUsers();
    }

    self.getUsers = function () {
        self.users = [];
        $q.all([HouseSvc.getUsers(self.selected)]).then(function (data) {
            for (x = 0; x < data[0].length; x++) {
                self.users.push(data[0][x]);
            }
        })
    }

    self.getHouseData = function () {
        $q.all([HouseSvc.getHouse(self.selected)]).then(function (data) {
            self.house = data[0][0];
            self.disabled = false;
        });
    }

}])