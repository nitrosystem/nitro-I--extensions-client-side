function CheckBoxListController(field, $scope, moduleController) {
    this.init = () => {
        if (field.Settings.DataSource && !field.Settings.DataSource.TextField) field.Settings.DataSource.TextField = 'Text';
        if (field.Settings.DataSource && !field.Settings.DataSource.ValueField) field.Settings.DataSource.ValueField = 'Value';

        if (field.Value && typeof field.Value == 'string') {
            field.Value = field.Value.split(',');
        }
    }

    $scope.$watch('Field.' + field.FieldName + '.Value', function(newVal, oldVal) {
        newVal = newVal || [];
        var values = (newVal instanceof Array) == false ? [newVal] : newVal;

        angular.forEach(field.DataSource.Items, function(o) {
            o.Selected = false;

            $.grep(values, function(a) {
                return o[field.Settings.DataSource.ValueField] == a
            }).map(function(a) {
                o.Selected = true;
            });
        });
    }, true);

    $scope.bCheckBoxList_onOptionChange = function(field) {
        var values = [];
        angular.forEach($.grep(field.DataSource.Items, function(o) { return o.Selected }), function(o) {
            values.push(o[field.Settings.DataSource.ValueField]);
        });

        field.Value = values;
    };
}