(function () {
    angular.module("app").factory('BudgetSvc', ['$http', function ($http) {
        var f = {};

        f.getBudgets = function (selected) {
            return $http.post('/api/budget/GetBudgetMonth', selected).then(function (response) {
                return response.data;
            });
        }

        f.getMonths = function (selected) {
            return $http.post('/api/budget/GetBudgetDist', selected).then(function (response) {
                return response.data;
            });
        }

        f.getTrans = function (selected) {
            return $http.post('/api/budget/GetTransFromHouse', selected).then(function (response) {
                return response.data;
            });
        }

        return f;

    }
    ])
})();