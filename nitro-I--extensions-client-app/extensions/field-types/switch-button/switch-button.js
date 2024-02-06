function SwitchButtonController(field, $scope, moduleController) {
    this.init = () => {
        if (field.Settings.DataSource && !field.Settings.DataSource.TextField) field.Settings.DataSource.TextField = 'Text';
        if (field.Settings.DataSource && !field.Settings.DataSource.ValueField) field.Settings.DataSource.ValueField = 'Value';
    }

    $scope.bSwitchButton_onChange = (field) => {
        if (field.Value == false) delete field.Value;
    };
}