angular.module('app').controller('budgetCtrl', ['$q', '$state', '$filter', 'BudgetSvc', '$stateParams', function ($q, $state, $filter, BudgetSvc, $stateParams) {
    var self = this;

    self.budgets = [];
    self.months = [];
    self.post = false;

    self.selected = {
        id: ""
    }

    self.populate = function () {
        self.selected = $stateParams;
        self.getBudgetData();
    }

    self.populatemonth = function () {
        $q.all([BudgetSvc.getMonths(self.selected)]).then(function (data) {
            self.months = data[0];
            self.post = true;
        });
    }

    self.getBudgetData = function () {
        $q.all([BudgetSvc.getBudgets(self.selected)]).then(function (data) {
            self.budgets = data[0];
        });
    }

}])