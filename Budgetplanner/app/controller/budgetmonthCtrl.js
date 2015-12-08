﻿angular.module('app').controller('budgetmonthCtrl', ['$timeout', '$q', '$state', '$filter', 'BudgetSvc', 'TransSvc', '$stateParams', function ($timeout, $q, $state, $filter, BudgetSvc, TransSvc, $stateParams) {
    var self = this;

    self.budgets = [];
    self.trans = [];
    self.temp = [];
    self.arrayfilter = [];
    self.types = [];
    self.budgetcheck = [];
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
    self.edit = {};
    self.messages = [];

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

    self.master = {
        id: "",
        amt: "",
        date: "",
        type: ""
    }

    self.edits = {
        budget: "",
        type: "",
        house: "",
        amount: "",
        year: "",
        month: ""
    }

    self.buildmessages = function () {
        self.messages = [];
        for(x = 0; x < self.budgetcheck.length; x++)
        {
            if(parseFloat(self.parsecurrency(self.budgetcheck[x].budget)) < parseFloat(self.parsecurrency(self.budgetcheck[x].amount)))
            {
                if(self.budgetcheck[x].type.isWithdrawl)
                {
                    self.messages.push("Budget for " + self.budgetcheck[x].type.name + " has been exceeded.")
                }
                else
                {
                    self.messages.push(self.budgetcheck[x].type.name + " is greater than the budget amount, you made more money!")
                }
            }
        }
    }

    self.toggleedit = function (item) {
        self.editmode = true;
        self.inedit = true;
        self.increate = true;
        self.edit = item;
        self.master.id = self.edit.rec.id;
        self.master.amt = self.edit.rec.Amount;
        self.master.type = self.edit.type;
        self.master.date = self.edit.date;
        self.fullvalidate();
    }

    self.closeedit = function () {
        self.edit.rec.Amount = self.master.amt;
        self.edit.type = self.master.type;
        self.edit.date = self.master.date;
        self.error = ""
        self.editmode = false;
        self.inedit = false;
        self.increate = false;
    }

    self.fullvalidate = function () {
        self.error = "";
        self.returnmsg = "";
        self.nullcheck(self.edit.rec.Amount, "Amount: ");
        self.amt = self.validateamt(self.edit.rec.Amount, "Amount: ");
        self.validatedate(self.edit.date, "Date: ");
    }

    self.updateRec = function () {
        self.returnmsg = "";
        self.error = "Processing request"
        self.edits.budget = self.edit.rec.id;
        self.edits.year = self.year;
        self.edits.month = self.month;
        self.edits.amount = self.amt;
        self.edits.house = self.selected.house;
        for (x = 0; x < self.types.length; x++) {
            if (self.edit.type == self.types[x].name) {
                self.edits.type = self.types[x].id;
                self.budgetcheck[x].budget = $filter('currency')(self.amt, '$', 2);
            }
        }
        $q.all([BudgetSvc.editBudget(self.edits)]).then(function (data) {
            if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                self.returnmsg = "Edit applied";
                self.master.id = self.edit.rec.id;
                self.master.amt = self.edit.rec.Amount;
                self.master.type = self.edit.type;
                self.master.date = self.edit.date;
                self.buildmessages();
            }
            self.error = "";
        })
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
                self.buildmessages();
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
            self.nullcheck(self.createtemp.amount, "Amount: ");
            self.amt = self.validateamt(self.createtemp.amount, "Amount: ");
            self.validatedate(self.date, "Date: ");
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

    self.nullcheck = function (field, fieldname) {
        if (self.error.length == 0) {
            if (!field) {
                self.style = { 'background-color': '#cc3333' };
                self.error = fieldname + "Null value entered"
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

    self.parsecurrency = function (amt) {
        var temp = amt;
        if (temp.charAt(0) == '$') {
            temp = temp.substr(1, temp.length)
            temp = temp.replace(",", "");
        }
        if (temp.charAt(0) == '-') {
            temp = temp.substr(2, temp.length)
            temp = temp.replace(",", "");
        }
        return temp;
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

    self.delete = function (item) {
        self.deleteparm.id = item.rec.id;
        $q.all([BudgetSvc.deleteBudget(self.deleteparm), item]).then(function (data) {
            if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                for (x = 0; x < self.budgetcheck.length; x++)
                {
                    if(self.budgetcheck[x].type.name == item.type)
                    {
                        self.budgetcheck[x].budget = 0;
                        self.budgetcheck[x].budget = $filter('currency')(self.budgetcheck[x].budget, '$', 2);
                    }
                }
                self.buildmessages();
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
            for(x = 0; x < self.types.length; x++)
            {
                self.budgetcheck.push({ type: self.types[x], amount: 0, budget: 0 });
                self.budgetcheck[x].budget = $filter('currency')(self.budgetcheck[x].budget, '$', 2);
            }
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
                            self.budgetcheck[y].budget = self.temp[x].Amount;
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
                    for (y = 0; y < self.types.length; y++) {
                        if (self.types[y].id == self.temp[x].TypeId) {
                            self.budgetcheck[y].amount += self.temp[x].Amount + self.temp[x].ReconcileAmount;
                            self.temp[x].Amount = $filter('currency')(self.temp[x].Amount, '$', 2);
                            self.temp[x].ReconcileAmount = $filter('currency')(self.temp[x].ReconcileAmount, '$', 2);
                            self.trans.push({ rec: self.temp[x], date: self.temp[x].month_t + "/" + self.temp[x].year_t, type: self.types[y].name });
                        }
                    }
                }
            }
            for (y = 0; y < self.budgetcheck.length; y++)
            {
                self.budgetcheck[y].amount = $filter('currency')(self.budgetcheck[y].amount, '$', 2);
            }
            self.buildmessages();
        });
    }

}])