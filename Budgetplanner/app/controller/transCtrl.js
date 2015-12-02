angular.module('app').controller('transCtrl', ['$q', '$filter', '$state', 'TransSvc', '$stateParams', function ($q, $filter, $state, TransSvc, $stateParams) {
    var self = this;

    self.transactions = [];
    self.types = [];
    self.merges = [];
    self.user = [];
    self.selected = "";

    self.selected = {
        id: "",
        type: ""
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
            for(x = 0; x < self.transactions.length; x++)
            {
                for(y = 0; y < self.types.length; y++)
                {
                    if(self.transactions[x].TypeId == self.types[y].id)
                    {
                        if (self.types[y].isWithdrawl)
                        {
                            self.transactions[x].Amount *= -1;
                            self.transactions[x].ReconcileAmount *= -1;
                        }
                        self.transactions[x].Amount = $filter('currency')(self.transactions[x].Amount, '$', 2);
                        self.transactions[x].ReconcileAmount = $filter('currency')(self.transactions[x].ReconcileAmount, '$', 2);
                        var date = self.transactions[x].month_t + '/' + self.transactions[x].day_t + '/' + self.transactions[x].year_t;
                        var record = { tr: self.transactions[x], type: self.types[y], date: date };
                        $q.all([TransSvc.getUser({ userid: self.transactions[x].UserId }), record]).then(function (data) {
                            console.log(data);
                            self.user = data[0];
                            var name = self.user[0].fname + ' ' + self.user[0].lname;
                            self.settable(data[1], name);
                        });
                    }
                }
            }
        });
    }

}])