import template from "./selectize.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";

class SelectizeFieldController {
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

const SelectizeFieldComponent = {
    bindings: {
        field: "<",
    },
    controller: SelectizeFieldController,
    controllerAs: "$",
    templateUrl: template,
};

export default SelectizeFieldComponent;