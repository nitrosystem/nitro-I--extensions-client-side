import template from "./typeahead.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";

class TypeaheadAutocompleteFieldController {
    constructor($scope, $timeout) {
        "ngInject";

        this.$scope = $scope;
        this.$timeout = $timeout;
    }

    $onInit() {
        this.$scope.$on(
            "onBindFieldSettings_" + this.field.FieldName,
            (e, args) => {
                this.field.CustomSettings = sidebarSettingsTemplate;
            }
        );
    }
}

const TypeaheadAutocompleteFieldComponent = {
    bindings: {
        field: "<",
    },
    controller: TypeaheadAutocompleteFieldController,
    controllerAs: "$",
    templateUrl: template,
};

export default TypeaheadAutocompleteFieldComponent;