(function () {
    angular.module("app").factory('TransSvc', ['$http', function ($http) {
        var f = {};

        f.getTrans = function (selected) {
            return $http.post('/api/budget/GetTransFromType', selected).then(function (response) {
                return response.data;
            });
        }

        f.getAccount = function (selected) {
            return $http.post('/api/budget/GetSingleAccount', selected).then(function (response) {
                return response.data;
            });
        }

        f.getTypes = function () {
            return $http.get('/api/budget/GetTransType').then(function (response) {
                return response.data;
            });
        }

        f.getUser = function (selected) {
            return $http.post('/api/budget/GetUser', selected).then(function (response) {
                return (response.data);
            });
        }

        f.editTrans = function (updates) {
            return $http.post('api/budget/EditTrans', updates);
        }

        f.deleteTrans = function (updates) {
            return $http.post('api/budget/DeleteTrans', updates);
        }

        f.getUsersHouse = function (id) {
            return $http.post('api/budget/GetUsersInHouse', id).then(function (response) {
                return (response.data);
            });
        }

        f.addTrans = function (addition) {
            return $http.post('api/budget/AddTrans', addition);
        }

        f.updateAcct = function (updates) {
            return $http.post('api/budget/UpdateAccountTotal', updates);
        }

        return f;

    }
    ])
})();