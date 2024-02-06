function MatrixController(field, $scope, moduleController, $element) {
    this.init = () => {
        field.Value = field.Value || {};
        field.Value.Columns = [];

        angular.forEach(field.Settings.Columns, function(column) {
            if (column.Options) {
                var list = [];
                angular.forEach(column.Options.split('\n'), function(o) {
                    list.push({ Value: o, Text: o });
                });

                column.DataSource = { Items: list };
            }
        });

        //if (field.Settings.DataSource) {
        //    $scope.$watch('Field.' + field.FieldName + '.Options', function (newValue, oldValue) {
        //        if (newValue != oldValue) {
        //            field.Value.Data = newValue || [];
        //        }
        //    }, true);
        //}

        //angular.forEach(field.Settings.Columns, function (c) {
        //    c.Settings = c.Settings || {};
        //    c.Settings = $scope.service.getJsonString(c.Settings);

        //    if (c.Settings.ShowCondition)
        //        c.Settings.ShowCondition = $scope.getValueOf(c.Settings.ShowCondition);
        //    else
        //        c.Settings.ShowCondition = true;

        //    if (c.Options && typeof c.Options == 'string') {
        //        if ($scope.service.isJsonString(c.Options))
        //            c.Options = $scope.service.getJsonString(c.Options);
        //        else if (/{(\w+([\.|\[\]\w]*))?}/gim.test(c.Options)) {
        //            let match = /{(\w+([\.|\[\]\w]*))?}/gim.exec(c.Options);
        //            if (match) {
        //                c.Options = $scope.service.getScopePropertyValue($scope, c.Options);

        //                $scope.$watch(match[1], function (newVal, oldVal) {
        //                    if (newVal != oldVal) c.Options = newVal;
        //                })
        //            }
        //        }
        //        else {
        //            var list = [];
        //            angular.forEach(c.Options.split('\n'), function (o) {
        //                list.push({ OptionValue: o, OptionText: o });
        //            });
        //            c.Options = list;
        //        }
        //    }

        //    field.Value.Columns.push({ ColumnName: c.ColumnName, ColumnTitle: c.ColumnTitle });
        //});
    }

    $scope.bMatrix_onAddMatrixRowClick = function(field) {
        field.Value = field.Value || {};
        field.Value.Data = field.Value.Data || [];

        field.Value.Data.push({});
    };

    $scope.bMatrix_onDeleteRowClick = function(field, $index) {
        if (confirm('Are you sure?')) {
            field.RemovedData = field.RemovedData || [];
            field.RemovedData.push(angular.copy(field.Value.Data[$index]));

            field.Value.Data.splice($index, 1);
        }
    };

    $scope.$on("onValidateMatrixField", (e, task, args) => {
        $scope.bMatrix_validateMatrix(field, task, args)
    });

    $scope.bMatrix_validateMatrix = function(field, task, args) {
        task.wait(() => {
            var defer = moduleController.$q.defer();

            var isValid = true;

            if (field.IsRequired && (!field.Value || !field.Value.Data || !field.Value.Data.length))
                isValid = false;
            else
                angular.forEach(field.Value.Data, function(row) {
                    angular.forEach(field.Settings.Columns, function(column) {
                        if (column.IsRequired && (row[column.ColumnName] === '' || row[column.ColumnName] === undefined || row[column.ColumnName] === null))
                            isValid = false;
                    });
                });

            defer.resolve(isValid);

            return defer.promise;
        });
    };
}