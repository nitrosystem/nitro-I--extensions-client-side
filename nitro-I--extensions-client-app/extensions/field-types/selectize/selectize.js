function SelectizeController(field, $scope, moduleController, $element) {
    var selectize;

    this.init = function() {
        if (!field.Settings.AllowMultiple && field.Settings.ShowAll && field.DataSource && field.DataSource.Items) {
            var item = {};
            item[field.Settings.DataSource.TextField] = field.Settings.AllText;
            item[field.Settings.DataSource.ValueField] = null;
            field.DataSource.Items.splice(0, 0, item);
        }

        var $selectize = $('#selectize').selectize({
            valueField: 'Value',
            labelField: 'Text',
            searchField: 'Text',
            options: items || [],
            create: false,
            plugins: ['remove_button'],
            onChange: (value) => {
                // your code
                if (!$scope.$$phase) $scope.$apply();
            }
        });

        selectize = $selectize[0].selectize;

        if (field.Value) setFieldValue(field);

        $scope.$watch(`Field.${field.FieldName}.DataSource.Items`, (newVal, oldVal) => {
            if (newVal !== oldVal)
                setOptions(field, newVal);
        }, true);

        $scope.$watch(`Field.${field.FieldName}.Value`, (newVal, oldVal) => {
            if (newVal !== oldVal)
                setFieldValue(field, newVal);
        }, true);
    }


    function onOptionChange(field) {
        if (!field.isProccessAction && field.Actions && field.Actions.length && _.filter(field.Actions, (a) => { return a.Event == 'OnOptionChange' }).length)
            moduleController.callActionByEvent(field.Actions, field.FieldID, 'OnOptionChange').then((data) => {
                delete field.isProccessAction;
            });
    }

    function setFieldValue(field) {
        selectize.setValue(field.Value, false);
    }

    function setOptions(field, newOptions) {

        if (newOptions) {
            if (Array.isArray(newOptions) && newOptions.length !== 0) {
                selectize.clearOptions();
            }
            selectize.addOption(newOptions);
            selectize.refreshOptions(false);
            setFieldValue(field);
        }
    }
}