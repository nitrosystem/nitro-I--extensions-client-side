import template from "./custom-query.html";

class CustomQueryServiceController {
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

        $scope.$watch('$.service.ServiceName', (newVal, oldVal) => {
            if (newVal != oldVal && !this.customQueryService.Settings.StoredProcedureNameModified) this.customQueryService.Settings.StoredProcedurePostfixName = newVal;
        });

        this.setForm();
    }

    $onInit() {
        this.onPageLoad();
    }

    onPageLoad() {
        if (!this.service.ServiceID) {
            this.customQueryService = {
                DatabaseObjectType: 0,
                Query: "CREATE PROCEDURE {Schema}.{ProcedureName}\nAS BEGIN\n\t\nEND",
                Settings: {},
            };

            _.filter(this.scenarios, (s) => {
                return s.ScenarioID == this.service.ScenarioID;
            }).map((s) => {
                this.customQueryService.Settings = {
                    StoredProcedurePrefixName: s.DatabaseObjectPrefix,
                    StoredProcedurePostfixName: this.service.ServiceName,
                };
            });
        } else {
            this.apiService
                .getApi("BusinessEngineBasicServices", "Service", "GetCustomQuery", {
                    serviceID: this.service.ServiceID,
                })
                .then((data) => {
                    this.globalService.parseJsonItems(data);
                    this.customQueryService = data;
                });
        }
    }

    setForm() {
        this.form = this.validationService.init({
                DatabaseObjectType: {
                    id: "drpDatabaseObjectType",
                    required: true,
                },
                Query: {
                    id: "editorSqlQuery",
                    required: true,
                },
                "Settings.StoredProcedurePrefixName": {
                    rule: (value) => {
                        if (this.customQueryService.DatabaseObjectType == 0 && !value)
                            return "Sp prefix is required.!";
                        else return true;
                    },
                    id: "txtSpPrefix",
                },
                "Settings.StoredProcedurePostfixName": {
                    rule: (value) => {
                        if (this.customQueryService.DatabaseObjectType == 0 && !value)
                            return "Sp postfix is required.!";
                        else return true;
                    },
                    id: "txtSpPostfix",
                },
            },
            true,
            this.$scope,
            "$.customQueryService"
        );
    }

    onGDetectServiceParams() {
        this.service.Params = this.globalService.getParamsFromSqlQuery(
            this.customQueryService.Query
        );
    }

    validateService(task, args) {
        task.wait(() => {
            var defer = this.$q.defer();

            this.form.validated = true;
            this.form.validator(this.customQueryService);
            if (this.form.valid) defer.resolve(true);

            return defer.promise;
        });
    }

    saveService(task, args) {
        task.wait(() => {
            var defer = this.$q.defer();

            if (this.customQueryService.DatabaseObjectType == 1) {
                this.service.Params = this.globalService.getParamsFromSqlQuery(
                    this.customQueryService.Query
                );
            }

            this.customQueryService.Service = this.service;
            this.customQueryService.StoredProcedureName =
                this.customQueryService.Settings.StoredProcedurePrefixName +
                this.customQueryService.Settings.StoredProcedurePostfixName;

            this.apiService
                .postApi(
                    "BusinessEngineBasicServices",
                    "Service",
                    "CreateCustomQuery",
                    this.customQueryService, { isNewService: args.isNewService }
                )
                .then(
                    (data) => {
                        this.customQueryService.ItemID = data.ItemID;
                        this.service.Params = data.ServiceParams;
                        defer.resolve(data);
                    },
                    (error) => {
                        defer.reject(error);
                    }
                );

            return defer.promise;
        });
    }
}

const CustomQueryService = {
    bindings: {
        service: "<",
        scenarios: "<",
    },
    controller: CustomQueryServiceController,
    controllerAs: "$",
    templateUrl: template,
};

export default CustomQueryService;