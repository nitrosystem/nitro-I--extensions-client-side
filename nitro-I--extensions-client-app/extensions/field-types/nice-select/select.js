function NiceSelectController(field, $scope, moduleController, $element) {
    var niceSelect;

    this.init = function() {
        if (!field.Settings.AllowMultiple && field.Settings.ShowAll && field.DataSource && field.DataSource.Items) {
            var item = {};
            item[field.Settings.DataSource.TextField] = field.Settings.AllText;
            item[field.Settings.DataSource.ValueField] = null;
            field.DataSource.Items.splice(0, 0, item);
        }

        var $niceSelect = $(`#nice-select-${field.FieldName}`).niceSelect();

        //niceSelect = $niceSelect[0].niceSelect;

        //if (field.Value) setFieldValue(field);

        $scope.$watch(`Field.${field.FieldName1}`, (newVal, oldVal) => {
            if (newVal.Value != oldVal.Value) setFieldValue(newVal);
            if (newVal.DataSource != oldVal.DataSource) setOptions(newVal, newVal.DataSource.Items);
        }, true);
    }

    function setFieldValue(field) {
        niceSelect.setValue(field.Value, false);
    }

    function setOptions(field, newOptions) {
        if (newOptions) {
            if (Array.isArray(newOptions) && newOptions.length === 0) {
                niceSelect.clearOptions();
            }
            niceSelect.addOption(newOptions);
            niceSelect.refreshOptions(false);

            setFieldValue(field);
        }
    }
}