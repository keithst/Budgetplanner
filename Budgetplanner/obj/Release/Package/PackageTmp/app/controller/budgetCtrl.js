angular.module('app').controller('budgetCtrl', ['$timeout', '$q', '$state', '$filter', 'TransSvc', 'BudgetSvc', '$stateParams', function ($timeout, $q, $state, $filter, TransSvc, BudgetSvc, $stateParams) {
    var self = this;

    self.months = [];
    self.budgets = [];
    self.types = [];
    self.increate = false;
    self.createmode = false;
    self.style = { 'background-color': '#46b946' };
    self.error = "";
    self.returnmsg = "";
    self.date = "";
    self.month = "";
    self.year = "";
    self.prevent = true;
    self.hide = false;
    self.found = false;

    self.selected = {
        id: ""
    }

    self.passparm = {
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

    self.gotoBudget = function (month, year) {
        self.passparm.month = month;
        self.passparm.year = year;
        self.passparm.house = self.selected.id;
        $state.go('budgetmonth', self.passparm)
    }

    self.sendcreate = function () {
        self.update.type = self.createtemp.type;
        self.update.house = self.selected.id;
        self.update.amount = self.amt;
        self.update.year = self.year;
        self.update.month = self.month;
        $q.all([BudgetSvc.addBudget(self.update)]).then(function (data) {
            if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                self.returnmsg = "Budget entry successfully created";
                self.budgets = [];
                self.months = [];
                self.populate();
            }
        })
    }

    self.createtoggle = function () {
        self.inedit = true;
        self.createmode = true;
        self.increate = true;
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
            self.nullcheck(self.createtemp.amount, "Amount: ");
            self.amt = self.validateamt(self.createtemp.amount, "Amount: ");
            self.validatedate(self.date, "Date: ");
            self.checkdup(self.createtemp.type);
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
        for (x = 0; x < self.budgets.length; x++) {
            if (type == self.budgets[x].TypeId && self.year == self.budgets[x].year_b && self.month == self.budgets[x].month_b) {
                self.style = { 'background-color': '#cc3333' };
                self.error = "Budget type already assigned for this month"
                self.hide = true;
                self.found = true;
            }
            else
            {
                if (!self.found)
                {
                    self.hide = false;
                }
            }
        }
        self.found = false;
    }

    self.nullcheck = function (field, fieldname) {
        if (self.error.length == 0) {
            if (!field) {
                self.style = { 'background-color': '#cc3333' };
                self.error = fieldname + "Null value entered"
            }
            else {
                self.style = { 'background-color': '#46b946' };
                self.error = "";
            }
        }
    }

    self.validatedate = function (date, fieldname) {
        if (self.error.length == 0) {
            var temp = date.split('/');
            var totaler = 0;
            if (temp.length == 2) {
                for (x = 0; x < temp.length; x++) {
                    if (isNaN(temp[x])) {
                        self.style = { 'background-color': '#cc3333' };
                        self.error = fieldname + "Bad date, non numeric value detected";
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
                            self.error = fieldname + "Invalid month";
                        }

                    }
                    else {
                        self.style = { 'background-color': '#cc3333' };
                        self.error = fieldname + "Invalid year";
                    }
                }
            }
            else {
                self.style = { 'background-color': '#cc3333' };
                self.error = fieldname + "Incorrect Date Format use MM/YYYY";
            }
        }
    }

    self.validateamt = function (amt, fieldname) {
        if (self.error.length == 0) {
            var temp = amt;
            if (temp.charAt(0) == '$') {
                temp = temp.substr(1, temp.length)
                temp = temp.replace(",", "");
                if (isNaN(temp) || isNaN(parseFloat(temp)) || parseFloat(temp) < 0) {
                    self.style = { 'background-color': '#cc3333' };
                    self.error = fieldname + "Amount not a decimal value or negative";
                }
                else {
                    self.style = { 'background-color': '#46b946' };
                    self.error = "";
                }
            }
            else {
                self.style = { 'background-color': '#cc3333' };
                self.error = fieldname + "Missing $ sign";
            }
        }
        return temp;
    }

    self.populate = function () {
        self.populatemonth();
        self.getBudgetData();
    }

    self.populatemonth = function () {
        self.selected = $stateParams;
        $q.all([BudgetSvc.getMonths(self.selected)]).then(function (data) {
            self.months = data[0];
        });
    }

    self.getBudgetData = function () {
        $q.all([BudgetSvc.getBudget(self.selected), TransSvc.getTypes()]).then(function (data) {
            self.budgets = data[0];
            self.types = data[1];
        });
    }

}])