angular.module('app').controller('budgetmonthCtrl', ['$timeout', '$q', '$state', '$filter', 'BudgetSvc', 'TransSvc', '$stateParams', function ($timeout, $q, $state, $filter, BudgetSvc, TransSvc, $stateParams) {
    var self = this;

    self.budgets = [];
    self.trans = [];
    self.temp = [];
    self.arrayfilter = [];
    self.types = [];
    self.filter = "";
    self.createmode = false;
    self.inedit = false;
    self.increate = false;
    self.editmode = false;
    self.prevent = true;
    self.noedit = true;
    self.style = { 'background-color': '#46b946' };
    self.date = "";
    self.month = "";
    self.year = "";
    self.error = "";
    self.returnmsg = "";
    self.amt = "";

    self.selected = {
        month: "",
        year: "",
        house: ""
    }

    self.update = {
        budget: "",
        type: "",
        house: "",
        amount: "",
        year: "",
        month: ""
    }

    self.createtemp = {
        amount: "",
        type: ""
    }

    self.deleteparm = {
        id: ""
    }

    self.sendcreate = function () {
        self.update.type = self.createtemp.type;
        self.update.house = self.selected.house;
        self.update.amount = self.amt;
        self.update.year = self.year;
        self.update.month = self.month;
        $q.all([BudgetSvc.addBudget(self.update)]).then(function (data) {
            if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                self.returnmsg = "Budget entry successfully created";
                self.budgets = [];
                self.populate();
            }
        })
    }

    self.createtoggle = function () {
        self.inedit = true;
        self.createmode = true;
        self.increate = true;
        self.date = self.selected.month + "/" + self.selected.year;
        self.createvalidate();
    }

    self.exitcreate = function () {
        self.inedit = false;
        self.createmode = false;
        self.increate = false;
    }

    self.createvalidate = function () {
        if (self.createtemp.type) {
            self.error = "";
            self.returnmsg = "";
            self.checkdup(self.createtemp.type);
            self.nullcheck(self.createtemp.amount);
            self.amt = self.validateamt(self.createtemp.amount);
            self.validatedate(self.date);
            self.prevent = false;
        }
        else {
            self.returnmsg = "";
            self.style = { 'background-color': '#cc3333' };
            self.error = "Please select a budget type"
            self.prevent = true;
        }
    }

    self.checkdup = function (type) {
        for(x = 0; x < self.budgets.length; x++)
        {
            if(type == self.budgets[x].rec.TypeId && self.date == self.budgets[x].date)
            {
                self.style = { 'background-color': '#cc3333' };
                self.error = "Budget type already assigned for this month"
            }
        }
    }

    self.nullcheck = function (field) {
        if (self.error.length == 0) {
            if (!field) {
                self.style = { 'background-color': '#cc3333' };
                self.error = "Null value entered"
            }
        }
    }

    self.validatedate = function (date) {
        if (self.error.length == 0) {
            var temp = date.split('/');
            var totaler = 0;
            if (temp.length == 2) {
                for (x = 0; x < temp.length; x++) {
                    if (isNaN(temp[x])) {
                        self.style = { 'background-color': '#cc3333' };
                        self.error = "Bad date, non numeric value detected";
                    }
                    else {
                        switch (x) {
                            case 0:
                                self.month = temp[x];
                                break;
                            case 1:
                                self.year = temp[x];
                                break;
                        }
                        totaler++;
                    }
                }
                if (totaler == temp.length) {
                    if (parseInt(self.year) >= 1900) {
                        if (parseInt(self.month) > 0 && parseInt(self.month) < 13) {
                                self.style = { 'background-color': '#46b946' };
                                self.error = "";
                        }
                        else {
                            self.style = { 'background-color': '#cc3333' };
                            self.error = "Invalid month";
                        }

                    }
                    else {
                        self.style = { 'background-color': '#cc3333' };
                        self.error = "Invalid year";
                    }
                }
            }
            else {
                self.style = { 'background-color': '#cc3333' };
                self.error = "Incorrect Date Format use MM/YYYY";
            }
        }
    }

    self.validateamt = function (amt) {
        if (self.error.length == 0) {
            var temp = amt;
            if (temp.charAt(0) == '$') {
                temp = temp.substr(1, temp.length)
                temp = temp.replace(",", "");
                if (isNaN(temp) || isNaN(parseFloat(temp))) {
                    self.style = { 'background-color': '#cc3333' };
                    self.error = "Amount not a decimal value";
                }
                else {
                    self.style = { 'background-color': '#46b946' };
                    self.error = "";
                }
            }
            else {
                self.style = { 'background-color': '#cc3333' };
                self.error = "Missing $ sign";
            }
        }
        return temp;
    }

    self.delete = function (item) {
        self.deleteparm.id = item.rec.id;
        $q.all([BudgetSvc.deleteBudget(self.deleteparm), item]).then(function (data) {
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