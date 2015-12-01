angular.module('app').controller('acctCtrl', ['$state', 'AccountSvc', function ($state, AccountSvc) {
    var self = this;

    self.accounts = [];

    self.selected = {
        id : ""
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