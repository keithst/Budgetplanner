angular.module('app').controller('transCtrl', ['$q', '$filter', '$state', 'TransSvc', '$stateParams', function ($q, $filter, $state, TransSvc, $stateParams) {
    var self = this;

    self.transactions = [];
    self.types = [];
    self.merge = [];

    self.selected = {
        id: "",
        type: ""
    }

    self.populate = function () {
        self.selected = $stateParams;
        self.getTransData();
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
                        self.merge.push({ tr: self.transactions[x], type: self.types[y] });
                    }
                }
            }
        });
    }

}])