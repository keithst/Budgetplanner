angular.module('app').controller('acctCtrl', ['$state', 'AccountSvc', '$stateParams', function ($state, AccountSvc, $stateParams) {
    var self = this;

    self.accounts = [];

    self.selectacct = {};

    self.selected = {
        id : ""
    }

    self.gotoView = function (id) {
        $state.go('trans', {id: id, type: null})
    }

    self.populate = function () {
        self.selected.id = 2;
        self.getAccountData();
    }

    self.getAccountData = function () {
        AccountSvc.getAccounts(self.selected).then(function (data) {
            self.accounts = data;
        });
    }

}])