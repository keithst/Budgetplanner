angular.module('app').controller('budgetmonthCtrl', ['$timeout', '$q', '$state', '$filter', 'BudgetSvc', '$stateParams', function ($timeout, $q, $state, $filter, BudgetSvc, $stateParams) {
    var self = this;

    self.budgets = [];
    self.trans = [];

    self.selected = {
        month: "",
        year: "",
        house: ""
    }

    self.populate = function () {
        self.selected = $stateParams;
        self.getBudgetData();
    }

    self.getBudgetData = function () {
        $q.all([BudgetSvc.getBudgets(self.selected)]).then(function (data) {
            self.budgets = data[0];
        });
    }

    self.getTransData = function () {
        $q.all([BudgetSvc.getTrans({ id: self.selected.house })]).then(function (data) {
            self.trans = data[0];
        });
    }

}])