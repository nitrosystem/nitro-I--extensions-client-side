import template from "./restful.html";

class RestFulServiceController {
    constructor(
        $scope,
        $q,
        $timeout,
        $deferredEmit,
        globalService,
        apiService,
        validationService
    ) {
        "ngInject";

        this.$scope = $scope;
        this.$q = $q;
        this.$timeout = $timeout;
        this.$deferredEmit = $deferredEmit;
        this.globalService = globalService;
        this.apiService = apiService;
        this.validationService = validationService;

        $scope.$on("onValidateService", (e, task, args) => {
            this.validateService.apply(this, [task, args]);
        });

        $scope.$on("onSaveService", (e, task, args) => {
            this.saveService.apply(this, [task, args]);
        });

        this.setForm();
    }

    $onInit() {
        this.onPageLoad();
    }

    onPageLoad() {
        if (!this.service.ServiceID) {
            this.service.Settings.WebServiceOptions = {
                Params: [],
                Authorization: {
                    BasicAuth: {}
                },
                Headers: [
                    { ParamName: 'Content-Type', ParamValue: 'application/json', IsSelected: true, IsSystem: true },
                    { ParamName: 'Content-Length', IsSystem: true },
                    { ParamName: 'Accept', IsSystem: true },
                    { ParamName: 'Connection', IsSystem: true },
                    { ParamName: 'Date', IsSystem: true },
                    { ParamName: 'Expect', IsSystem: true },
                    { ParamName: 'Host', IsSystem: true },
                    { ParamName: 'If-Modified-Since', IsSystem: true },
                    { ParamName: 'Range', IsSystem: true },
                    { ParamName: 'Referer', IsSystem: true },
                    { ParamName: 'Transfer-Encoding', IsSystem: true },
                    { ParamName: 'User-Agent', IsSystem: true },
                    { ParamName: 'Proxy-Connection', IsSystem: true }
                ],
                BodyFormDataItems: [],
            };
        }
    }

    setForm() {
        this.form = this.validationService.init({
                Provider: {
                    required: true,
                },
            },
            true,
            this.$scope,
            "$.customQueryService"
        );
    }

    onAddServiceParamClick() {
        this.service.Params = this.service.Params || [];

        this.service.Params.push({});
    }

    validateService(task, args) {
        task.wait(() => {
            var defer = this.$q.defer();

            this.form.validated = true;
            this.form.validator(this.service);
            if (this.form.valid || 1 == 1) defer.resolve(true);

            this.service.Settings.SaveParams = true;

            return defer.promise;
        });
    }

    saveService(task, args) {
        task.wait(() => {
            var defer = this.$q.defer();

            defer.resolve(data);

            return defer.promise;
        });
    }
}

const RestFulService = {
    bindings: {
        service: "<",
        scenarios: "<",
    },
    controller: RestFulServiceController,
    controllerAs: "$",
    templateUrl: template,
};

export default RestFulService;