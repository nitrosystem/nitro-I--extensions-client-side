function Select2Controller(field, $scope, moduleController, $element) {
    this.init = function() {
        field.select2Options = {
            placeholder: field.Settings.Placeholder,
            allowClear: field.Settings.ShowCleanIcon,
        };
    }
}