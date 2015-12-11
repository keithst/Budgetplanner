(function () {
    angular.module("app").factory('BudgetSvc', ['$http', function ($http) {
        var f = {};

        f.getBudgets = function (selected) {
            return $http.post('/api/budget/GetBudgetMonth', selected).then(function (response) {
                return response.data;
            });
        }

        f.getBudget = function (selected) {
            return $http.post('/api/budget/GetBudgetForHouse', selected).then(function (response) {
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

        f.addBudget = function (updated) {
            return $http.post('/api/budget/AddBudget', updated)
        }

        f.editBudget = function (updated) {
            return $http.post('/api/budget/EditBudget', updated)
        }

        f.deleteBudget = function (updated) {
            return $http.post('/api/budget/DeleteBudget', updated)
        }

        return f;

    }
    ])
})();