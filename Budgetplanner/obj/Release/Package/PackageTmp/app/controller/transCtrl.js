angular.module('app').controller('transCtrl', ['$q', '$filter', '$state', 'TransSvc', '$stateParams', function ($q, $filter, $state, TransSvc, $stateParams) {
    var self = this;

    self.transactions = [];
    self.types = [];
    self.merges = [];
    self.user = [];
    self.filter = "";
    self.temp = [];
    self.editmode = false;
    self.edit = {};
    self.error = "";
    self.style = { 'background-color': '#46b946' };
    self.month = "";
    self.day = "";
    self.year = "";
    self.days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    self.leap = 0;
    self.prev = "";
    self.save = "";
    self.amt = "";
    self.ramt = "";
    self.returnmsg = "";
    self.inedit = false;
    self.createmode = false;
    self.increate = false;
    self.date = "";
    self.prevent = true;
    self.account = {};
    self.saveamount = 0;
    self.promise = {};
    self.nodelete = true;
    self.indelete = false;

    self.master = {
        id: "",
        amt: "",
        ramt: "",
        desc: "",
        date: "",
        type: ""
    }

    self.edits = {
        id: "",
        user: "",
        type: "",
        amount: "",
        ramount: 0,
        accountid: "",
        desc: "",
        year: "",
        month: "",
        day: ""
    }

    self.selected = {
        house: "",
        id: ""
    }

    self.create = {
        id: "",
        user: "",
        type: "",
        amount: "",
        ramount: "",
        accountid: "",
        desc: "",
        year: "",
        month: "",
        day: ""
    }

    self.createtemp = {
        amount: "",
        ramount: ""
    }

    self.deleteparm = {
        id: ""
    }

    self.updateacct = {
        id: "",
        desc: "",
        total: ""
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

    self.createvalidate = function () {
        if (self.create.type)
        {
            self.error = "";
            self.returnmsg = "";
            self.nullcheck(self.createtemp.amount, "Amount: ");
            self.amt = self.validateamt(self.createtemp.amount, true, false, self.create.type, "Amount: ");
            self.nullcheck(self.createtemp.ramount, "Reconcile:");
            self.ramt = self.validateamt(self.createtemp.ramount, false, true, self.create.type, "Reconcile");
            self.nullcheck(self.create.desc, "Description: ");
            self.validatedate(self.date, "Date: ");
            self.nullcheck(self.create.user, "User: ");
            self.prevent = false;
        }
        else
        {
            self.returnmsg = "";
            self.style = { 'background-color': '#cc3333' };
            self.error = "Please select a transaction type"
            self.prevent = true;
        }
    }

    self.nullcheck = function (field, fieldname) {
        if (self.error.length == 0)
        {
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

    self.updateaccount = function (amount) {
        $q.all([TransSvc.getAccount({ id: self.selected.id }), amount]).then(function (data) {
            self.account = data[0][0];
            self.account.Total = parseFloat(self.account.Total);
            self.account.Total += parseFloat(data[1]);
            self.updateacct.id = self.selected.id;
            self.updateacct.total = self.account.Total;
            $q.all([TransSvc.updateAcct(self.updateacct)]).then(function (data) {
                if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                    self.returnmsg += ", Account updated successfully";
                }
            });
        });
    }

    self.sendcreate = function () {
        self.create.accountid = self.selected.id;
        self.create.year = self.year;
        self.create.month = self.month;
        self.create.day = self.day;
        self.create.amount = self.amt;
        self.create.ramount = self.ramt;
        $q.all([TransSvc.addTrans(self.create)]).then(function (data) {
            if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                self.returnmsg = "Transaction created";
                var temp = parseFloat(self.amt) + parseFloat(self.ramt);
                self.updateaccount(temp);
                self.merges = [];
                self.populate();
            }
        });
    }

    self.createtoggle = function () {
        self.inedit = true;
        self.createmode = true;
        self.increate = true;
        $q.all([TransSvc.getUsersHouse({ id: self.selected.house })]).then(function (data) {
            self.user = data[0];
            self.createvalidate();
        });
    }

    self.exitcreate = function () {
        self.inedit = false;
        self.createmode = false;
        self.increate = false;
    }

    self.delete = function (item) {
        self.deleteparm.id = item.rec.tr.id;
        self.amt = self.validateamt(item.rec.tr.Amount, true, false, item.rec.type);
        self.ramt = self.validateamt(item.rec.tr.ReconcileAmount, false, true, item.rec.type);
        var temp = (parseFloat(self.amt) + parseFloat(self.ramt)) * -1;
        $q.all([TransSvc.deleteTrans(self.deleteparm), item, temp]).then(function (data) {
            if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                self.merges.splice(self.merges.indexOf(data[1]), 1);
                self.updateaccount(parseFloat(data[2]));
                self.toggledelete();
            }
        })
    }

    self.updateRec = function () {
        self.returnmsg = "";
        self.error = "Processing request"
        self.edits.id = self.edit.rec.tr.id;
        self.edits.year = self.year;
        self.edits.month = self.month;
        self.edits.day = self.day;
        self.edits.accountid = self.edit.rec.tr.AccountId;
        self.edits.desc = self.edit.rec.tr.Description_t;
        self.edits.amount = self.amt;
        self.edits.ramount = self.ramt;
        for (x = 0; x < self.types.length; x++) {
            if (self.edit.rec.type == self.types[x].name) {
                self.edits.type = self.types[x].id;
            }
        }
        self.edits.user = self.edit.rec.tr.UserId;
        $q.all([TransSvc.editTrans(self.edits)]).then(function (data) {
            if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                self.returnmsg = "Edit applied";
                var temp = (parseFloat(self.saveamount) - (parseFloat(self.amt) + parseFloat(self.ramt))) * -1;
                self.updateaccount(temp);
                self.saveamount = parseFloat(self.amt) + parseFloat(self.ramt);
                self.master.id = self.edit.rec.tr.id;
                self.master.amt = self.edit.rec.tr.Amount;
                self.master.ramt = self.edit.rec.tr.ReconcileAmount;
                self.master.desc = self.edit.rec.tr.Description_t;
                self.master.type = self.edit.rec.type;
                self.master.date = self.edit.rec.date;
            }
            else
            {
                self.returnmsg = "Error applying edit";
            }
            self.error = "";
            self.edits.ramount = 0;
        })
    }

    self.setall = function () {
        self.edit.rec.tr.Amount = self.setamtchg(self.edit.rec.tr.Amount)
        self.prev = self.save;
    }

    self.setamt = function () {
        for (x = 0; x < self.types.length; x++) {
            if (self.edit.rec.type == self.types[x].name) {
                self.prev = self.types[x].isWithdrawl;
            }
        }
    }

    self.setamtchg = function (amt) {
        var temp = "";
        var temp2 = amt;
        for (x = 0; x < self.types.length; x++) {
            if (self.edit.rec.type == self.types[x].name) {
                if(self.prev != self.types[x].isWithdrawl)
                {
                    if(self.types[x].isWithdrawl)
                    {
                        temp = temp.concat("-", temp2);
                    }
                    else
                    {
                        temp = temp2.substr(1, temp2.length);
                    }
                    self.save = self.types[x].isWithdrawl;
                }
            }
        }
        return temp;
    }

    self.fullvalidate = function () {
        self.error = "";
        self.returnmsg = "";
        self.nullcheck(self.edit.rec.tr.Amount, "Amount: ");
        self.amt = self.validateamt(self.edit.rec.tr.Amount, true, false, self.edit.rec.type, "Amount: ");
        self.nullcheck(self.edit.rec.tr.ReconcileAmount, "Reconcile: ");
        self.ramt = self.validateamt(self.edit.rec.tr.ReconcileAmount, false, true, self.edit.rec.type, "Reconcile: ");
        self.nullcheck(self.edit.rec.tr.Description_t, "Description: ");
        self.validatedate(self.edit.rec.date, "Date: ");
    }

    self.validateamt = function (amt, fixedsign, wildsign, type, fieldname) {
        if (self.error.length == 0)
        {
            var temp = amt;
            var negative = false;
            for (x = 0; x < self.types.length; x++) {
                if (type == self.types[x].name || type == self.types[x].id) {
                    negative = self.types[x].isWithdrawl;
                }
            }
            if (negative && fixedsign) {
                if (temp.charAt(0) == '-') {
                    if (temp.charAt(1) == '$') {
                        temp = temp.substr(2, temp.length)
                        temp = temp.replace(",", "");
                        if (isNaN(temp) || isNaN(parseFloat(temp))) {
                            self.style = { 'background-color': '#cc3333' };
                            self.error = fieldname + "Amount not a decimal value";
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
                else {
                    self.style = { 'background-color': '#cc3333' };
                    self.error = fieldname + "Missing - sign";
                }
                temp *= -1;
            }
            else {
                if (wildsign)
                {
                    if(temp.charAt(0) == "-")
                    {
                        if (temp.charAt(1) == '$') {
                            temp = temp.substr(2, temp.length)
                            temp = temp.replace(",", "");
                            if (isNaN(temp) || isNaN(parseFloat(temp))) {
                                self.style = { 'background-color': '#cc3333' };
                                self.error = fieldname + "Amount not a decimal value";
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
                        temp *= -1
                    }
                    else {
                        if (temp.charAt(0) == '$') {
                            temp = temp.substr(1, temp.length)
                            temp = temp.replace(",", "");
                            if (isNaN(temp) || isNaN(parseFloat(temp))) {
                                self.style = { 'background-color': '#cc3333' };
                                self.error = fieldname + "Amount not a decimal value";
                            }
                            else {
                                self.style = { 'background-color': '#46b946' };
                                self.error = "";
                            }
                        }
                        else {
                            self.style = { 'background-color': '#cc3333' };
                            self.error = fieldname + "Invalid sign detected";
                        }
                    }
                }
                else
                {
                    if (temp.charAt(0) == '$') {
                        temp = temp.substr(1, temp.length)
                        temp = temp.replace(",", "");
                        if (isNaN(temp) || isNaN(parseFloat(temp))) {
                            self.style = { 'background-color': '#cc3333' };
                            self.error = fieldname + "Amount not a decimal value";
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
            }
        }
        return temp;
    }

    self.toggleedit = function (item) {
        self.editmode = true;
        self.inedit = true;
        self.increate = true;
        self.edit = item;
        self.master.id = self.edit.rec.tr.id;
        self.master.amt = self.edit.rec.tr.Amount;
        self.master.ramt = self.edit.rec.tr.ReconcileAmount;
        self.master.desc = self.edit.rec.tr.Description_t;
        self.master.type = self.edit.rec.type;
        self.master.date = self.edit.rec.date;
        self.fullvalidate();
        self.saveamount = parseFloat(self.amt) + parseFloat(self.ramt);
    }

    self.validatedate = function (date, fieldname) {
        if (self.error.length == 0)
        {
            var temp = date.split('/');
            var totaler = 0;
            if (temp.length == 3) {
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
                                self.day = temp[x];
                                break;
                            case 2:
                                self.year = temp[x];
                                break;
                        }
                        totaler++;
                    }
                }
                if (totaler == temp.length) {
                    if (parseInt(self.year) >= 1900) {
                        self.leap = self.year % 4
                        if (parseInt(self.leap) == 0) {
                            self.days[1] = 29;
                        }
                        if (parseInt(self.month) > 0 && parseInt(self.month) < 13) {
                            self.month--;
                            if (self.day > 0 && self.day <= self.days[self.month]) {
                                self.style = { 'background-color': '#46b946' };
                                self.error = "";
                                self.month++;
                            }
                            else {
                                self.style = { 'background-color': '#cc3333' };
                                self.error = fieldname + "Invalid day";
                            }
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
                self.error = fieldname + "Incorrect Date Format use MM/DD/YYYY";
            }
        }
    }

    self.closeedit = function (){
        self.edit.rec.tr.Amount = self.master.amt;
        self.edit.rec.tr.ReconcileAmount = self.master.ramt;
        self.edit.rec.tr.Description_t = self.master.desc;
        self.edit.rec.type = self.master.type;
        self.edit.rec.date = self.master.date;
        self.error = ""
        self.editmode = false;
        self.inedit = false;
        self.increate = false;
    }

    self.clearfilter = function () {
        self.filter = ""
        if (self.temp.length != 0) {
            self.merges = self.temp;
        }
    }

    self.restore = function () {
        if(self.temp.length != 0)
        {
            self.merges = self.temp;
        }
    }

    self.dofilter = function () {
        self.temp = self.merges;
        self.merges = [];
        for(x = 0; x < self.temp.length; x++)
        {
            if(self.temp[x].rec.type == self.filter)
            {
                self.merges.push(self.temp[x])
            }
        }
    }

    self.populate = function () {
        self.selected = $stateParams;
        self.getTransData();
    }

    self.settable = function (record, name) {
        self.merges.push({ rec: record, user: name });
    }

    self.getTransData = function () {
        $q.all([TransSvc.getTrans(self.selected), TransSvc.getTypes()]).then(function (data) {
            console.log(data);
            self.transactions = data[0];
            self.types = data[1];
            for (x = 0; x < self.transactions.length; x++)
            {
                for(y = 0; y < self.types.length; y++)
                {
                    if(self.transactions[x].TypeId == self.types[y].id)
                    {
                        self.transactions[x].Amount = $filter('currency')(self.transactions[x].Amount, '$', 2);
                        self.transactions[x].ReconcileAmount = $filter('currency')(self.transactions[x].ReconcileAmount, '$', 2);
                        var date = self.transactions[x].month_t + '/' + self.transactions[x].day_t + '/' + self.transactions[x].year_t;
                        var record = { tr: self.transactions[x], type: self.types[y].name, date: date };
                        self.merges.push({ rec: record, user: "" })
                    }
                }
            }
                for(x = 0; x < self.merges.length; x++)
                {
                    $q.all([TransSvc.getUser({ userid: self.merges[x].rec.tr.UserId }), self.merges[x]]).then(function (data) {
                        var tempuser = data[0][0];
                        var temp = data[1];
                        temp.user = tempuser.fname + ' ' + tempuser.lname;
                    })
                }
        });
    }

}])