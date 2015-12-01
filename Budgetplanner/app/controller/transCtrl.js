angular.module('app').controller('transCtrl', ['$state', 'TransSvc', '$stateParams', function ($state, TransSvc, $stateParams) {
    var self = this;

    self.transactions = [];

    self.selected = {
        id: "",
        type: ""
    }

    self.populate = function () {
        self.selected = $stateParams;
        self.getTransData();
    }

    self.getTransData = function () {
        TransSvc.getTrans(self.selected).then(function (data) {
            self.transactions = data;
        });
    }

}])