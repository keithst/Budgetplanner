angular.module('app').controller('acctCtrl', ['$q', '$state', '$filter', 'AccountSvc', '$stateParams', function ($q, $state, $filter, AccountSvc, $stateParams) {
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
        $q.all([AccountSvc.getAccounts(self.selected)]).then(function (data) {
            self.accounts = data[0];
            for(x = 0; x < self.accounts.length; x++)
            {
                self.accounts[x].Total = $filter('currency')(self.accounts[x].Total, '$', 2);
            }
        });
    }

}])