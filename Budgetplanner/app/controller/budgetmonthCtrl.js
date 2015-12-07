angular.module('app').controller('budgetmonthCtrl', ['$timeout', '$q', '$state', '$filter', 'BudgetSvc', '$stateParams', function ($timeout, $q, $state, $filter, BudgetSvc, $stateParams) {
    var self = this;

    self.budgets = [];

    self.selected = {
        month: "",
        year: ""
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

}])