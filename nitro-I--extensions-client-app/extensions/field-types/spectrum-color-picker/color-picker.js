function SpectrumColorPickerController(field, $scope, moduleController, $element) {
    this.init = () => {
        const $input = $('#colorPicker' + field.FieldName);
        $input.spectrum({
            type: "component",
            color: field.Value ? field.Value : 'transparent',
        });

        $input.on('change', function (e, color) {
            field.Value = color ? color.toHexString() : null;
            $scope.$apply();
        });

        $scope.$watch('Field.' + field.FieldName + '.Value', function (newVal, oldVal) {
            debugger
            if (newVal) $input.spectrum("set", newVal);
        }, true);
    };
}
