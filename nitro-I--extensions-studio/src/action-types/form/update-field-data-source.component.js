import template from "./update-field-data-source.html";

class UpdateFieldDataSourceController {
  constructor() {
    "ngInject";
  }

  $onInit() {}
}

const UpdateFieldDataSource = {
  bindings: {
    action: "<",
    fields: "<",
  },
  controller: UpdateFieldDataSourceController,
  controllerAs: "$",
  templateUrl: template,
};

export default UpdateFieldDataSource;
