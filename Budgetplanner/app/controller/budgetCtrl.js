angular.module('app').controller('budgetCtrl', ['$timeout', '$q', '$state', '$filter', 'BudgetSvc', '$stateParams', function ($timeout, $q, $state, $filter, BudgetSvc, $stateParams) {
    var self = this;

    self.months = [];

    self.selected = {
        id: ""
    }

    self.gotoBudget = function () {

    }

    self.populatemonth = function () {
        self.selected = $stateParams;
        $timeout($q.all([BudgetSvc.getMonths(self.selected)]).then(function (data) {
            self.months = data[0];
        }), 100);
    }

    self.getBudgetData = function () {
        $q.all([BudgetSvc.getBudgets(self.selected)]).then(function (data) {
            self.budgets = data[0];
        });
    }

}])