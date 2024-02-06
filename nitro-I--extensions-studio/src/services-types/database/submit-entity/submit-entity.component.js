import template from "./submit-entity.html";
import { baseQuery_insert, baseQuery_insertupdate, baseQuery_update } from './sql-query-template.js';

class SubmitEntityServiceController {
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

        this.baseQueryInsertTemplate = baseQuery_insert;
        this.baseQueryInsertUpdateTemplate = baseQuery_insertupdate;
        this.baseQueryUpdateTemplate = baseQuery_update;

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
        this.apiService
            .getApi(
                "BusinessEngineBasicServices",
                "Service",
                "GetSubmitEntityService", {
                    serviceID: this.service.ServiceID,
                }
            )
            .then((data) => {
                this.submitEntityService = data;

                if (!this.service.ServiceID) {
                    this.submitEntityService.ActionType = undefined;

                    _.filter(this.scenarios, (s) => {
                        return s.ScenarioID == this.service.ScenarioID;
                    }).map((s) => {
                        this.submitEntityService.Settings = {
                            StoredProcedurePrefixName: s.DatabaseObjectPrefix,
                            StoredProcedurePostfixName: this.service.ServiceName,
                        };
                    });
                }

                _.filter(this.entities, (e) => {
                    return this.submitEntityService.EntityID == e.EntityID;
                }).map((ee) => {
                    e.Columns = ee.Columns;
                });
            });
    }

    setForm() {
        this.form = this.validationService.init({
                DatabaseObjectType: {
                    id: "drpDatabaseObjectType",
                    required: true,
                },
                ActionType: {
                    id: "rdActionType",
                    required: true,
                },
                EntityID: {
                    id: "drpEntityID",
                    required: true,
                },
                Entity: {
                    required: true,
                },
                "Entity.InsertColumns": {
                    rule: (value) => {
                        if (
                            (this.submitEntityService.ActionType == 0 ||
                                this.submitEntityService.ActionType == 1) &&
                            _.filter(value || [], (c) => {
                                return c.IsSelected;
                            }).length == 0
                        )
                            return "Select column(s) for insert query.";
                        else return true;
                    },
                },
                "Entity.UpdateColumns": {
                    rule: (value) => {
                        if (
                            (this.submitEntityService.ActionType == 0 ||
                                this.submitEntityService.ActionType == 2) &&
                            _.filter(value || [], (c) => {
                                return c.IsSelected;
                            }).length == 0
                        )
                            return "Select column(s) for update query.";
                        else return true;
                    },
                },
                "Settings.StoredProcedurePrefixName": {
                    rule: (value) => {
                        if (this.submitEntityService.DatabaseObjectType == 0 && !value)
                            return "Sp prefix is required.!";
                        else return true;
                    },
                    id: "txtSpPrefix",
                },
                "Settings.StoredProcedurePostfixName": {
                    rule: (value) => {
                        if (this.submitEntityService.DatabaseObjectType == 0 && !value)
                            return "Sp postfix is required.!";
                        else return true;
                    },
                    id: "txtSpPostfix",
                },
            },
            true,
            this.$scope,
            "$.submitEntityService"
        );
    }

    onResetBaseQueryClick() {
        this.submitEntityService.BaseQuery = '';
        this.onActionTypeChange();
    }

    onQueryTypeChange() {
        if (
            this.submitEntityService.QueryType == 1 &&
            !this.submitEntityService.CustomQuery
        )
            this.datasourceservice.CustomQuery =
            "CREATE PROCEDURE {Schema}.{ProcedureName}\nAS BEGIN\n\t\nEND";
    }

    onAddServiceParamClick() {
        this.service.Params = this.service.Params || [];

        this.service.Params.push({});
    }

    onAddColumnsAsParamsClick() {
        this.service.Params = this.service.Params || [];

        _.forEach(this.submitEntityService.Entity.Columns, (c) => {
            var paramName = "@" + c.ColumnName;
            if (
                _.filter(this.service.Params, (p) => {
                    return p.ParamName == paramName;
                }).length == 0
            ) {
                this.service.Params.push({
                    ParamName: paramName,
                    ParamType: c.ColumnType,
                });
            }
        });
    }

    onSelectedEntityChange() {
        _.filter(this.entities, (e) => {
            return e.EntityID == this.submitEntityService.EntityID;
        }).map((e) => {
            this.submitEntityService.Entity = e;

            this.submitEntityService.Entity.InsertColumns = [];
            this.submitEntityService.Entity.UpdateColumns = [];

            this.service.Params = this.service.Params || [];

            _.forEach(e.Columns, (c) => {
                var paramName = "@" + c.ColumnName;
                if (
                    _.filter(this.service.Params, (p) => {
                        return p.ParamName == paramName;
                    }).length == 0
                ) {
                    this.service.Params.push({
                        ParamName: paramName,
                        ParamType: c.ColumnType,
                    });
                }
            });

            _.filter(e.Columns, (c) => {
                return c.IsPrimary;
            }).map((c) => {
                this.submitEntityService.Entity.PrimaryKeyParam = "@" + c.ColumnName;

                this.submitEntityService.Entity.InsertConditions = [{
                    SqlQuery: "NOT EXISTS(\n\t\tSELECT [" +
                        c.ColumnName +
                        "] FROM {Schema}.{TableName} \n\t\tWHERE [" +
                        c.ColumnName +
                        "] = @" +
                        c.ColumnName +
                        "\n\t)",
                    GroupName: "Group1",
                }, ];

                this.submitEntityService.Entity.UpdateConditions = [{
                    SqlQuery: "[" + c.ColumnName + "] = @" + c.ColumnName,
                    GroupName: "Group1",
                }, ];
            });

            _.forEach(e.Columns, (c) => {
                if (!c.IsIdentity) {
                    this.submitEntityService.Entity.InsertColumns.push(angular.copy(c));
                    this.submitEntityService.Entity.UpdateColumns.push(angular.copy(c));
                }
            });
        });
    }

    onUpdateEntityColumnsClick() {
        _.filter(this.entities, (e) => {
            return e.EntityID == this.submitEntityService.EntityID;
        }).map((e) => {
            _.filter(e.Columns, (c) => {
                return !c.IsIdentity;
            }).map((c) => {
                var result = _.filter(
                    this.submitEntityService.Entity.InsertColumns,
                    (i) => {
                        return i.ColumnID == c.ColumnID;
                    }
                );
                if (!result.length)
                    this.submitEntityService.Entity.InsertColumns.push(angular.copy(c));

                result = _.filter(
                    this.submitEntityService.Entity.UpdateColumns,
                    (u) => {
                        return u.ColumnID == c.ColumnID;
                    }
                );
                if (!result.length)
                    this.submitEntityService.Entity.UpdateColumns.push(angular.copy(c));
            });
        });
    }

    onActionTypeChange(actionType) {
        if (!this.submitEntityService.BaseQuery || this.submitEntityService.ActionType != actionType) {
            switch (actionType) {
                case 0:
                    this.submitEntityService.BaseQuery = this.baseQueryInsertUpdateTemplate;
                    break;
                case 1:
                    this.submitEntityService.BaseQuery = this.baseQueryInsertTemplate;
                    break;
                case 2:
                    this.submitEntityService.BaseQuery = this.baseQueryUpdateTemplate;
                    break;
            }
        }
    }

    onSelectedInsertEntityAllColumnsChange() {
        _.forEach(this.submitEntityService.Entity.InsertColumns, (c) => {
            c.IsSelected = !c.IsSelected;

            this.onSelectedInsertEntityColumnChange(c);
        });
    }

    onSelectedInsertEntityColumnChange(c) {
        var paramName = "@" + c.ColumnName;

        if (
            c.IsSelected &&
            _.filter(this.service.Params, (p) => {
                return p.ParamName == paramName;
            }).length
        ) {
            c.ColumnValue = paramName;
        }
    }

    onSelectedUpdateEntityAllColumnsChange() {
        _.forEach(this.submitEntityService.Entity.UpdateColumns, (c) => {
            c.IsSelected = !c.IsSelected;

            this.onSelectedUpdateEntityColumnChange(c);
        });
    }

    onSelectedUpdateEntityColumnChange(c) {
        var paramName = "@" + c.ColumnName;

        if (
            c.IsSelected &&
            _.filter(this.service.Params, (p) => {
                return p.ParamName == paramName;
            }).length
        ) {
            c.ColumnValue = paramName;
        }
    }

    //Service Params
    onAddServiceParamClick() {
        this.service.Params = this.service.Params || [];
        this.service.Params.push({});
    }

    validateService(task, args) {
        task.wait(() => {
            var defer = this.$q.defer();

            this.form.validated = true;
            this.form.validator(this.submitEntityService);
            if (this.form.valid) defer.resolve(true);

            return defer.promise;
        });
    }

    saveService(task, args) {
        task.wait(() => {
            var defer = this.$q.defer();

            this.submitEntityService.Service = this.service;
            this.submitEntityService.StoredProcedureName =
                this.submitEntityService.Settings.StoredProcedurePrefixName +
                this.submitEntityService.Settings.StoredProcedurePostfixName;
            this.submitEntityService.ServiceID = this.service.ServiceID;

            this.apiService
                .postApi(
                    "BusinessEngineBasicServices",
                    "Service",
                    "CreatesubmitEntityService",
                    this.submitEntityService, { isNewService: args.isNewService }
                )
                .then(
                    (data) => {
                        this.submitEntityService.ItemID = data;

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

const SubmitEntityService = {
    bindings: {
        service: "<",
        scenarios: "<",
        entities: "<",
        viewModels: "<",
    },
    controller: SubmitEntityServiceController,
    controllerAs: "$",
    templateUrl: template,
};

export default SubmitEntityService;