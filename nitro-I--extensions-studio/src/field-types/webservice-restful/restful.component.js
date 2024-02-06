import template from "./restful.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";

class WebserviceResutfulFieldController {
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

const WebserviceResutfulFieldComponent = {
    bindings: {
        field: "<",
        actions: "<",
    },
    controller: WebserviceResutfulFieldController,
    controllerAs: "$",
    templateUrl: template,
};

export default WebserviceResutfulFieldComponent;