(function () {
    'use strict';
    angular
        .module('angularNgTable')
        .directive('demoTrackedTableCell', demoTrackedTableCell);

    demoTrackedTableCell.$inject = [];

    function demoTrackedTableCell() {
        return {
            restrict: 'A',
            priority: -1,
            scope: true,
            require: ['^demoTrackedTableRow', 'ngForm'],
            controller: demoTrackedTableCellController
        };
    }

    demoTrackedTableCellController.$inject = ['$attrs', '$element', '$scope'];

    function demoTrackedTableCellController($attrs, $element, $scope) {
        var self = this;
        var cellFormCtrl = $element.controller('form');
        var cellName = cellFormCtrl.$name;
        var trackedTableRowCtrl = $element.controller('demoTrackedTableRow');

        if (trackedTableRowCtrl.isCellDirty(cellName)) {
            cellFormCtrl.$setDirty();
        } else {
            cellFormCtrl.$setPristine();
        }
        // note: we don't have to force setting validaty as angular will run validations
        // when we page back to a row that contains invalid data
        $scope.$watch(function() {
            return cellFormCtrl.$dirty;
        }, function (newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
        trackedTableRowCtrl.setCellDirty(cellName, newValue);
        });

        $scope.$watch(function() {
            return cellFormCtrl.$invalid;
        }, function (newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }
        trackedTableRowCtrl.setCellInvalid(cellName, newValue);
      });
    }
}());
