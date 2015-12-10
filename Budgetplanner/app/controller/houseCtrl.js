angular.module('app').controller('houseCtrl', ['localStorageService', '$scope', '$q', '$state', 'HouseSvc', 'userSvc', '$stateParams', function (localStorageService, $scope, $q, $state, HouseSvc, userSvc, $stateParams) {
    var self = this;

    self.house = {};
    self.disabled = true;
    self.nokick = true;
    self.users = [];
    self.allusers = [];
    self.user = "";

    self.update = {
        user: "",
        id: ""
    }

    self.selected = {
        id: ""
    }

    self.passparm = {
        id: ""
    }

    self.cookie = {
        id: "",
        HoH: "",
        Invited: ""
    }

    self.gotoView = function (view, id) {
        self.passparm.id = id;
        $state.go(view, self.passparm)
    }

    self.populate = function () {
        self.selected = $stateParams;
        self.getHouseData();
        self.getUsers();
        self.getAllUsers();
    }

    self.checkuser = function () {
        for(x = 0; x < self.users.length; x++)
        {
            if(self.user == self.users[x].Id)
            {
                if(self.users[x].isHoH)
                {
                    self.nokick = true;
                }
                else
                {
                    self.nokick = false;
                }
            }
        }
    }

    self.kickUser = function () {
        self.update.user = self.user;
        self.update.id = self.selected.id;
        $q.all([HouseSvc.kickUser(self.update)]).then(function (data) {
            if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                self.msg = "User has been kicked"
                self.getUsers();
                self.getAllUsers();
                self.nokick = true;
            }
        })
    }

    self.inviteuser = function (id) {
        self.update.user = id;
        self.update.id = self.selected.id;
        $q.all([HouseSvc.inviteUser(self.update)]).then(function (data) {
            if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                self.msg = "User has been invited"
                self.getUsers();
                self.getAllUsers();
            }
        })
    }

    self.getUsers = function () {
        self.users = [];
        $q.all([HouseSvc.getUsers(self.selected)]).then(function (data) {
            for (x = 0; x < data[0].length; x++)
            {
                if(!data[0][x].isHoH)
                {
                    self.users.push(data[0][x]);
                }
            }
        })
    }

    self.delete = function () {
            $q.all([userSvc.getUser({ userid: $scope.authentication.userName })]).then(function (data) {
                $q.all([HouseSvc.deleteHouse({ user: data[0][0].Id, id: self.selected.id })]).then(function () {
                    self.cookie = localStorageService.get('home')
                    self.cookie.house = null;
                    self.cookie.Invited = false;
                    self.cookie.HoH = false;
                    localStorageService.set('home', self.cookie)
                    $state.go('userhouse');
                })
            })
    }

    self.getAllUsers = function () {
        $q.all([HouseSvc.getAllUsers()]).then(function (data) {
            self.allusers = data[0];
        })
    }

    self.getHouseData = function () {
        $q.all([HouseSvc.getHouse(self.selected)]).then(function (data) {
            self.house = data[0][0];
            self.disabled = false;
        });
    }

}])