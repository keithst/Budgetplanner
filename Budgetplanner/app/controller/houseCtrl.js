angular.module('app').controller('houseCtrl', ['$q', '$state', 'HouseSvc', '$stateParams', function ($q, $state, HouseSvc, $stateParams) {
    var self = this;

    self.house = {};

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
        self.selected.id = 2;
        self.getHouseData();
    }

    self.getHouseData = function () {
        $q.all([HouseSvc.getHouse(self.selected)]).then(function (data) {
            self.house = data[0][0];
        });
    }

}])