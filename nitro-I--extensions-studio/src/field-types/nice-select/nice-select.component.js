import template from "./nice-select.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";

class NiceSelectFieldController {
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

const NiceSelectFieldComponent = {
    bindings: {
        field: "<",
    },
    controller: NiceSelectFieldController,
    controllerAs: "$",
    templateUrl: template,
};

export default NiceSelectFieldComponent;