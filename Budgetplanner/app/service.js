angular.module('app').service('accountService', function () {
    var account = "";

    var addAccount = function (id) {
        account = id;
    };

    var getAccount = function () {
        return account;
    };

    return {
        addAccount: addAccount,
        getAccount: getAccount
    };

});