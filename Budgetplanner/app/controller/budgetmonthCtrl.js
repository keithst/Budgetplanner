angular.module('app').controller('budgetmonthCtrl', ['$timeout', '$q', '$state', '$filter', 'BudgetSvc', 'TransSvc', '$stateParams', function ($timeout, $q, $state, $filter, BudgetSvc, TransSvc, $stateParams) {
    var self = this;

    self.budgets = [];
    self.trans = [];
    self.temp = [];
    self.arrayfilter = [];
    self.types = [];
    self.filter = "";

    self.selected = {
        month: "",
        year: "",
        house: ""
    }

    self.deleteparm = {
        id: ""
    }

    self.delete = function (item) {
        self.deleteparm.id = item.rec.id;
        $q.all([TransSvc.deleteTrans(self.deleteparm), item]).then(function (data) {
            if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                self.budgets.splice(self.budgets.indexOf(data[1]), 1);
            }
        })
    }

    self.clearfilter = function () {
        self.filter = ""
        if (self.arrayfilter.length != 0) {
            self.trans = self.arrayfilter;
        }
    }

    self.restore = function () {
        if (self.arrayfilter.length != 0) {
            self.trans = self.arrayfilter;
        }
    }

    self.dofilter = function () {
        self.arrayfilter = self.trans;
        self.trans = [];
        for (x = 0; x < self.arrayfilter.length; x++) {
            if (self.arrayfilter[x].type == self.filter) {
                self.trans.push(self.arrayfilter[x])
            }
        }
    }

    self.getParms = function () {
        self.selected = $stateParams;
        $timeout($q.all([TransSvc.getTypes()]).then(function (data) {
            self.types = data[0];
        }), 100);
    }

    self.populate = function () {
        self.getBudgetData();
    }

    self.getBudgetData = function () {
        $q.all([BudgetSvc.getBudgets(self.selected)]).then(function (data) {
            self.temp = data[0];
            for (x = 0; x < self.temp.length; x++) {
                if (self.temp[x].month_b == self.selected.month && self.temp[x].year_b == self.selected.year) {
                    self.temp[x].Amount = $filter('currency')(self.temp[x].Amount, '$', 2);
                    for (y = 0; y < self.types.length; y++) {
                        if (self.types[y].id == self.temp[x].TypeId) {
                            self.budgets.push({ rec: self.temp[x], date: self.temp[x].month_b + "/" + self.temp[x].year_b, type: self.types[y].name });
                        }
                    }
                }
            }
        });
    }

    self.getTransData = function () {
        $q.all([BudgetSvc.getTrans({ id: self.selected.house })]).then(function (data) {
            self.temp = data[0];
            for (x = 0; x < self.temp.length; x++)
            {
                if (self.temp[x].month_t == self.selected.month && self.temp[x].year_t == self.selected.year) {
                    self.temp[x].Amount = $filter('currency')(self.temp[x].Amount, '$', 2);
                    self.temp[x].ReconcileAmount = $filter('currency')(self.temp[x].ReconcileAmount, '$', 2);
                    for (y = 0; y < self.types.length; y++) {
                        if (self.types[y].id == self.temp[x].TypeId) {
                            self.trans.push({ rec: self.temp[x], date: self.temp[x].month_t + "/" + self.temp[x].year_t, type: self.types[y].name });
                        }
                    }
                }
            }
        });
    }

}])