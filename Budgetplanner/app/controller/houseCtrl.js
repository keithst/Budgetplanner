angular.module('app').controller('houseCtrl', ['localStorageService', '$scope', '$q', '$state', 'HouseSvc', 'userSvc', '$stateParams', function (localStorageService, $scope, $q, $state, HouseSvc, userSvc, $stateParams) {
    var self = this;

    self.house = {};
    self.invites = [];
    self.disabled = true;
    self.nokick = true;
    self.reject = true;
    self.users = [];
    self.allusers = [];
    self.user = "";
    self.invite = "";

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

    self.set = function () {
        if(self.invite)
        {
            self.reject = false;
        }
        else
        {
            self.reject = true;
        }
    }

    self.kickUser = function (user, source) {
        self.update.user = user;
        self.update.id = self.selected.id;
        $q.all([HouseSvc.kickUser(self.update)]).then(function (data) {
            if (parseInt(data[0].status) >= 200 && parseInt(data[0].status) <= 299) {
                self.getUsers();
                self.getAllUsers();
                if (source)
                {
                    self.nokick = true;
                    self.msg = "User has been kicked";
                }
                else
                {
                    self.reject = true;
                    self.msg = "User invite has been rejected";
                }
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
        $q.all([HouseSvc.getUsers(self.selected), HouseSvc.getInvites(self.selected)]).then(function (data) {
            for (x = 0; x < data[0].length; x++)
            {
                if(!data[0][x].isHoH)
                {
                    self.users.push(data[0][x]);
                }
            }
            self.invites = data[1];
        })
    }

    self.delete = function () {
        if (self.users.length == 0 && self.invites.length == 0)
        {
            $q.all([userSvc.getUser({ userid: $scope.authentication.userName })]).then(function (data) {
                $q.all([HouseSvc.deleteHouse({ user: data[0][0].Id, id: self.selected.id })]).then(function () {
                    self.cookie = localStorageService.get('home')
                    self.cookie.id = null;
                    self.cookie.Invited = false;
                    self.cookie.HoH = false;
                    localStorageService.set('home', self.cookie)
                    $state.go('userhouse');
                })
            })
        }
        else
        {
            self.error = "In order to leave all users must be removed including invites";
        }
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