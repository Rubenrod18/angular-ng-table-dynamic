(function () {
    'use strict';
    function addZero(i) {
        if (i < 10) {
            return '0' + i;
        }
        return i;
    }

    function formatDate(date, type) {
        var lang = window.navigator.userLanguage || window.navigator.language,date = new Date(date),
            day = addZero(date.getDate()).toString(),
            month = addZero(date.getMonth() + 1).toString(),
            year = date.getFullYear().toString(),
            hour = addZero(date.getHours()).toString(),
            minutes = addZero(date.getMinutes()).toString(),
            seconds = addZero(date.getSeconds()).toString();
        
        switch (type) {
            case 'dd/mm/yyyy':
                return day.concat('/', month, '/', year);
        }
    }

    function createUser($scope, $uibModalInstance, NgTableParams, SweetAlert, items) {
        $scope.user = {};
        $scope.statusOptions = ['enabled', 'disabled'];
        $scope.status = {
            opened: false
        };
        $scope.open = function($event) {
            $scope.status.opened = true;
        };

        $scope.ok = function () {
            swal({
                title: 'Created!',
                text: 'The user has been created.',
                type: 'success'
            }, function (isConfirm) {
                $uibModalInstance.close($scope.user);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    function getData($scope, SweetAlert, dataService, params) {
        if ($scope.totalData.length === 0) {
            return dataService.get().$promise.then(function (response) {
                var filters = _.pick(params.filter(), function (val, key, obj) {
                        return (!_.isNull(val) && !_.isEmpty(val)) || _.isNumber(val);
                    }),
                    sort = _.keys(params.sorting()),
                    tmp = _.chain(response.data)
                            .sortBy(function (data) {
                                return data[sort];
                            }),
                    data = _.where(tmp.value(), filters),
                    data = _.each(data, function (item) {
                        if (_.has(item, 'birth_date')) {
                            var date = null;
                            if (item['birth_date'].length === 9) {
                                date = new Date(parseInt(item['birth_date'] + '000'));
                            } else if (item['birth_date'].length === 10) {
                                date = new Date(parseInt(item['birth_date'] + '00'));
                            }
                            item['birth_date'] = date;
                        }
                    }),
                    result = [],
                    pageIndex = params.count() * params.page() - params.count();
                
                if ( params.sorting()[sort] === 'asc' ) {
                    data.reverse();
                }

                for (var i = pageIndex; i < data.length; i++){
                    if (result.length === params.count()) {
                        break;
                    }
                    result.push(data[i]);
                }
                
                params.total(response.data.length);
                $scope.totalData = response.data;
                $scope.originalData = angular.copy(result);
                $scope.page = params.page();
                
                if ($scope.isFiltering(filters, 'yes')) {
                    $scope.subTotal = data.length;
                    $scope.total = response.data.length;
                    $scope.start = $scope.calculate('start', params);
                    $scope.end = $scope.calculate('end', params);
                } else {
                    $scope.start = $scope.calculate('start', params);
                    $scope.end = $scope.calculate('end', params);
                    $scope.subTotal = data.length;
                }
                swal.close();
                return angular.copy(result);
            });
        } else {
            var filters = _.pick(params.filter(), function (val, key, obj) {
                        return (!_.isNull(val) && !_.isEmpty(val)) || _.isNumber(val);
                    }),
                    sort = _.keys(params.sorting()),
                    tmp = _.chain(angular.copy($scope.totalData))
                            .sortBy(function (data) {
                                return data[sort];
                            })
                            .map(function (data) {
                                var tmp = formatDate(data['birth_date'], 'dd/mm/yyyy');
                                data['birth_date'] = tmp;
                                return data;
                            }),
                    data = _.where(tmp.value(), filters),
                    result = [],
                    pageIndex = params.count() * params.page() - params.count();
                
                if ( params.sorting()[sort] === 'asc' ) {
                    data.reverse();
                }

                data = _.map(data, function (data) {
                    if (typeof data['birth_date'] === 'string') {
                        var t = data['birth_date'].split('/');
                        data['birth_date'] = new Date(t[2], t[1] - 1, t[0]);
                    }
                    return data;
                });

                for (var i = pageIndex; i < data.length; i++){
                    if (result.length === params.count()) {
                        break;
                    }
                    result.push(data[i]);
                }
                
                params.total(data.length);
                $scope.originalData = angular.copy(result);
                $scope.page = params.page();
                
                if ($scope.isFiltering(filters, 'yes')) {
                    $scope.subTotal = data.length;
                    $scope.total = $scope.totalData.length;
                    $scope.start = $scope.calculate('start', params);
                    $scope.end = $scope.calculate('end', params);
                } else {
                    $scope.start = $scope.calculate('start', params);
                    $scope.end = $scope.calculate('end', params);
                    $scope.subTotal = data.length;
                }
                swal.close();
                return angular.copy(result);
        }
    }

    angular
        .module('angularNgTable')
        .controller('usersCtrl', ['$scope', '$uibModal', '$element', 'NgTableParams', 'SweetAlert', 'dataService', function ($scope, $uibModal, $element,  NgTableParams, SweetAlert, dataService) {
            var self = this;
            $scope.end = 0;
            $scope.options = ['enabled', 'disabled'];
            $scope.header = [
                {dataType: 'selector', field: 'selector', title: '', headerTemplateURL: 'headerCheckbox.html', show: true},
                {dataType: 'number', field: 'age', filter: {'age': 'number'}, show: true, sortable: 'age', title: 'Age'},
                {dataType: 'email', field: 'email', filter: {'email': 'text'}, show: true, sortable: 'email', title: 'Email'},
                {dataType: 'text', field: 'last_name', filter: {'last_name': 'text'}, show: true, sortable: 'last_name', title: 'Last name'},
                {dataType: 'text', field: 'name', filter: {'name': 'text'}, show: true, sortable: 'name', title: 'Name'},
                {dataType: 'date', field: 'birth_date', filter: {'birth_date': 'text'}, show: true, sortable: 'birth_date', title: 'Birth date'},
                {dataType: 'select', field: 'status', filter: {'status': 'select'}, filterData: [{title: '', id: ''}, {title: 'enabled', id: 'enabled'}, {title: 'disabled', id: 'disabled'}], title: 'Status', show: true},
                {dataType: undefined, field: '_id', filter: {}, show: false, sortable: 'id', title: 'id'},
                {dataType: 'command', field: 'action', title: 'Actions'}
            ];
            $scope.totalData = [];
            $scope.originalData = [];
            $scope.page = 0;
            $scope.start = 0;
            $scope.subTotal = 0;
            $scope.total = 0;

            /* Datepicker */
            $scope.status = {
                opened: false
            };
            $scope.open = function($event) {
                $scope.status.opened = true;
            };

            self.checkboxes = {checked: false, items: {}, someChecked: false};
            // watch for check all checkbox
            $scope.$watch(function () {
                return self.checkboxes.checked;
            }, function (value) {
                angular.forEach($scope.tableParams.data, function(item) {
                    self.checkboxes.items[item.id] = value;
                });
            });
            // watch for data checkboxes
            $scope.$watch(function() {
                return self.checkboxes.items;
            }, function (values) {
                if (!$.isEmptyObject(values)) {
                    var checked = 0, unchecked = 0, total = $scope.originalData.length;
                    angular.forEach($scope.tableParams.data, function (item) {
                        checked += (self.checkboxes.items[item.id]) || 0;
                        unchecked += (!self.checkboxes.items[item.id]) || 0;
                    });
                    if (checked > 0) {
                        self.checkboxes.someChecked = true;
                    } else {
                        self.checkboxes.someChecked = false;
                    }
                    if ((unchecked == 0) || (checked == 0)) {
                        self.checkboxes.checked = (checked == total);
                    }
                    // grayed checkbox
                    angular.element($element[0].getElementsByClassName('select-all')).prop('indeterminate', (checked != 0 && unchecked != 0));
                }
            }, true);

            $scope.getArray = function () {
                var data = [], row = {}, headers = [], i, j, checked = [], rowValues = {}, dateTemp = null;
                for (i in $scope.header) {
                    if ($scope.header[i].show === true && $scope.header[i].field !== 'selector') {
                        headers.push($scope.header[i].field);
                    }
                }
                checked = _.map(self.checkboxes.items, function (value, key) {
                    if (value === true) {
                        return _.find($scope.tableParams.data, function (data) {
                            return data.id === parseInt(key);
                        });
                    }
                });

                for (i in checked) {
                    if (checked.hasOwnProperty(i) && checked[i] !== undefined) {
                        rowValues = {};
                            for (j in headers) {
                                if (checked[i][headers[j]] instanceof Date) {
                                    dateTemp = formatDate(checked[i][headers[j]], 'dd/mm/yyyy');
                                    rowValues[headers[j]] = dateTemp;
                                } else {
                                    rowValues[headers[j]] = checked[i][headers[j]];
                                }
                            }
                            data.push(rowValues);
                    }
                }
                return data;
            };

            $scope.getHeader = function () {
                var header = [];
                for (var i in $scope.header) {
                    if ($scope.header[i].show === true && $scope.header[i].field !== 'selector') {
                        header.push($scope.header[i].title);
                    }
                }
                return header;
            };

            $scope.csvFilename = function () {
                var lang = window.navigator.userLanguage || window.navigator.language,
                    date = new Date(),
                    day = date.getDate(),
                    monthIndex = date.getMonth(),
                    year = date.getFullYear().toString(),
                    hour = addZero(date.getHours()),
                    minutes = addZero(date.getMinutes()),
                    seconds = addZero(date.getSeconds());

                if (lang.indexOf('es') !== -1) {
                    monthIndex = date.getMonth()+1;
                }
                return year.concat(monthIndex, day, '_', hour, minutes, seconds, '.csv');
            };

            swal({
                html: true,
                showConfirmButton: false,
                text: 'Loading results<div class="sk-circle"><div class="sk-circle1 sk-child"></div><div class="sk-circle2 sk-child"></div><div class="sk-circle3 sk-child"></div><div class="sk-circle4 sk-child"></div><div class="sk-circle5 sk-child"></div><div class="sk-circle6 sk-child"></div><div class="sk-circle7 sk-child"></div><div class="sk-circle8 sk-child"></div><div class="sk-circle9 sk-child"></div><div class="sk-circle10 sk-child"></div><div class="sk-circle11 sk-child"></div><div class="sk-circle12 sk-child"></div</div>',
                title: 'Info',
                type: 'info'
            });
            $scope.tableParams = new NgTableParams({
                count: 10,
                sorting: { age: 'desc' }
            }, {
                filterDelay: 0,
                getData: function (params) {
                    return getData($scope, SweetAlert, dataService, params);
                }
            });

            function cancel(row, rowForm) {
                var originalRow = resetRow(row, rowForm);
                angular.extend(row, originalRow);
            }

            function del(row) {
                swal({
                    title: 'Are you sure?',
                    text: 'Do you want delete the user <i>' + row.email + '</i>?<br/>You will not be able to recover this user.',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#F8C886',
                    confirmButtonText: 'Yes, I\'m sure!',
                    closeOnConfirm: false,
                    html: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        _.remove($scope.tableParams.data, function(item) {
                            return row === item;
                        });
                        _.extend(_.remove($scope.totalData, {id: row.id}), row);
                        $scope.tableParams.reload().then(function(data) {
                            if (data.length === 0 && $scope.tableParams.total() > 0) {
                                $scope.tableParams.page($scope.tableParams.page() - 1);
                                $scope.tableParams.reload();
                            }
                        });
                    }
                });
            }

            function multipleDel() {
                var users = [], i, rows = [], row = {};

                _.map(self.checkboxes.items, function (value, key) {
                    if (value === true) {
                        users.push(key);
                        i = _.findWhere($scope.tableParams.data, {'id': key});
                        rows.push(parseInt(i));
                    }
                });
                swal({
                    title: 'Are you sure?',
                    text: 'Do you want delete these <strong>' + users.length + '</strong> users?<br/>You will not be able to recover these user.',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#F8C886',
                    confirmButtonText: 'Yes, I\'m sure!',
                    closeOnConfirm: false,
                    html: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        for (i in users) {
                            row = _.findWhere($scope.tableParams.data, function (item) {
                                return item.id === users[i];
                            });
                            _.remove($scope.tableParams.data, function(item) {
                                return row === item;
                            });
                            _.extend(_.remove($scope.totalData, {id: row.id}), row);
                        }
                        swal({
                            title: 'Deleted!',
                            text: 'The users selected has been deleted',
                            type: 'success'
                        }, function (isConfirm) {
                            if (isConfirm) {
                                $scope.tableParams.reload().then(function(data) {
                                    if (data.length === 0 && $scope.tableParams.total() > 0) {
                                        $scope.tableParams.page($scope.tableParams.page() - 1);
                                        $scope.tableParams.reload();
                                    }
                                });
                                self.checkboxes.checked = false;
                                self.checkboxes.items = [];
                            }
                        });
                    }
                });
            }

            function resetRow(row, rowForm) {
                row.isEditing = false;
                rowForm.$setPristine();
                self.tableTracker.untrack(row);
                return _.findWhere($scope.originalData, function (r) {
                    return r.id === row.id;
                });
            }

            function update(row, rowForm) {
                var originalRow = resetRow(row, rowForm);
                angular.extend(originalRow, row);
                _.extend(_.findWhere($scope.totalData, {id: row.id}), row);
            }

            $scope.cancel = cancel;
            $scope.del = del;
            $scope.multipleDel = multipleDel;
            $scope.update = update;

            $scope.isFiltering = function (obj, filterText) {
                var prop, showText = [];
                if (filterText === 'no') {
                    for (prop in obj) {
                        if (obj.hasOwnProperty(prop) && Boolean(obj[prop]) !== false) {
                            return false;
                        }
                    }
                    return true;
                } else if (filterText === 'yes') {
                    for (prop in obj) {
                        if (obj.hasOwnProperty(prop) && Boolean(obj[prop]) !== false) {
                            return true;
                        }
                    }
                    return false;
                }
            };

            $scope.calculate = function (type, params) {
                switch (type) {
                    case 'start':
                        var start = params.count() * params.page() - params.count() + 1,
                            end = params.count() * params.page();
                        if (start > end || $scope.subTotal === 0) {
                            return 0;
                        }
                        return start;
                    case 'end':
                        var tmp = params.count() * params.page();
                        if (tmp < params.total()) {
                            return tmp;
                        }
                        return params.total();
                }
            };

            $scope.createModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: false,
                    templateUrl: 'views/users/modals/create.html',
                    controller: createUser,
                    size: 'lg',
                    resolve: {
                        items: function () {
                            return $scope.header;
                        }
                    }
                });
                modalInstance.result.then(function (doc) {
                    $scope.totalData.push(doc);
                });
            };
        }]);
}());
