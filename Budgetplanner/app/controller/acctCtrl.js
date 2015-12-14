angular.module('app').controller('acctCtrl', ['$q', '$state', '$filter', 'AccountSvc', '$stateParams', function ($q, $state, $filter, AccountSvc, $stateParams) {
    var self = this;

    self.accounts = [];
    self.createmode = false;
    self.inedit = false;
    self.increate = false;
    self.editmode = false;
    self.style = { 'background-color': '#46b946' };
    self.error = "";
    self.returnmsg = "";
    self.amt = "";
    self.edit = {};
    self.nodelete = true;
    self.indelete = false;

    self.selectacct = {};

    self.create = {
        desc: "",
        amt: ""
    }
    self.selected = {
        id : ""
    }

    self.passparm = {
        house: "",
        id: ""
    }

    self.update = {
        id: "",
        desc: "",
        total: ""
    }

    self.deleteparm = {
        id: ""
    }

    self.toggledelete = function () {
        if (self.nodelete) {
            self.nodelete = false;
            self.indelete = true;
        }
        else {
            self.nodelete = true;
            self.indelete = false;
        }
        if (self.increate) {
            self.increate = false;
        }
        else {
            self.increate = true;
        }
    }

    self.toggleedit = function (item) {
        self.editmode = true;
        self.inedit = true;
        self.increate = true;
        self.edit = item;
        self.master = self.edit.Description_ba;
        self.fullvalidate();
    }

    self.closeedit = function () {
        self.edit.Description_ba = self.master;
        self.error = ""
        self.editmode = false;
        self.inedit = false;
        self.increate = false;
    }

    self.fullvalidate = function () {
        self.error = "";
        self.returnmsg = "";
        self.nullcheck(self.edit.Description_ba, "Description: ");
    }

    self.updateRec = function () {
        self.returnmsg = "";
        self.error = "Processing request"
        self.update.desc = self.edit.Description_ba;
        self.update.id = self.edit.id;
        $q.all([AccountSvc.editAccount(self.update)]).then(function (data) {
            if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                self.returnmsg = "Edit applied";
                self.master = self.edit.Description_ba;
            }
            self.error = "";
        })
    }


    self.delete = function (item) {
        self.deleteparm.id = item.id;
        $q.all([AccountSvc.deleteAccount(self.deleteparm), item]).then(function (data) {
            if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                self.accounts.splice(self.accounts.indexOf(data[1]), 1);
                self.toggledelete();
            }
        })
    }

    self.sendcreate = function () {
        self.update.total = self.amt;
        self.update.desc = self.create.desc;
        self.update.id = self.selected.id;
        $q.all([AccountSvc.addAccount(self.update)]).then(function (data) {
            if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                self.returnmsg = "Budget entry successfully created";
                self.accounts = [];
                self.populate();
            }
        })
    }

    self.nullcheck = function (field, fieldname) {
        if (self.error.length == 0) {
            if (!field) {
                self.style = { 'background-color': '#cc3333' };
                self.error = fieldname + "Null value entered"
            }
            else
            {
                self.style = { 'background-color': '#46b946' };
                self.error = "";
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
            self.error = "";
            self.returnmsg = "";
            self.nullcheck(self.create.desc, "Description: ");
            self.nullcheck(self.create.amt, "Amount: ");
            self.amt = self.validateamt(self.create.amt, "Amount: ");
    }

    self.gotoView = function (id) {
        self.passparm.id = id;
        self.passparm.house = self.selected.id;
        $state.go('trans', self.passparm)
    }

    self.populate = function () {
        self.selected = $stateParams;
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