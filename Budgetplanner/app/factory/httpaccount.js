(function () {
    angular.module("app").factory('AccountSvc', ['$http', function ($http) {
        var f = {};

        f.getAccounts = function (selected) {
            return $http.post('/api/budget/GetAccount', selected).then(function (response) {
                return response.data;
            });
        }

        return f;

    }
    ])
})();