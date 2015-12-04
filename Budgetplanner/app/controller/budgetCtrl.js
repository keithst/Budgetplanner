angular.module('app').controller('budgetCtrl', ['$q', '$state', '$filter', 'BudgetSvc', '$stateParams', function ($q, $state, $filter, BudgetSvc, $stateParams) {
    var self = this;

    self.budgets = [];

    self.selected = {
        id: ""
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