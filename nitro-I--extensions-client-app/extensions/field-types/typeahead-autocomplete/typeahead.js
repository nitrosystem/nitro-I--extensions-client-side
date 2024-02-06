function TypeaheadAutocompleteController(field, $scope, moduleController, $element) {
    this.init = function() {
        const textField = field.Settings.DataSource.TextField;

        var substringMatcher = function(items) {
            return function findMatches(q, cb) {
                var matches, substrRegex;

                // an array that will be populated with substring matches
                matches = [];

                // regex used to determine if a string contains the substring `q`
                substrRegex = new RegExp(q, 'i');

                // iterate through the pool of strings and for any string that
                // contains the substring `q`, add it to the `matches` array
                $.each(items, function(i, item) {
                    if (substrRegex.test(item[textField])) {
                        matches.push(item[textField]);
                    }
                });

                cb(matches);
            };
        };

        $(`#txtTypeahead_${field.FieldName}`).typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'items',
            source: substringMatcher(field.DataSource.Items || []),
        });

        $(`#txtTypeahead_${field.FieldName}`).bind('typeahead:select', function(ev, suggestion) {
            field.Value = suggestion;
            $scope.$apply();
        });

        //if (field.Value) setFieldValue(field);

        $scope.$watch(`Field.${field.FieldName1}`, (newVal, oldVal) => {
            //if (newVal.Value != oldVal.Value) setFieldValue(newVal);
            //if (newVal.DataSource != oldVal.DataSource) setOptions(newVal, newVal.DataSource.Items);
        }, true);
    }

    function setFieldValue(field) {
        //niceSelect.setValue(field.Value, false);
    }

    function setOptions(field, newOptions) {
        // if (newOptions) {
        //     if (Array.isArray(newOptions) && newOptions.length === 0) {
        //         niceSelect.clearOptions();
        //     }
        //     niceSelect.addOption(newOptions);
        //     niceSelect.refreshOptions(false);

        //     setFieldValue(field);
        // }
    }
}