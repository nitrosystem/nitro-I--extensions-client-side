import template from "./bind-entity.html";
import { bindEntity_baseQuery } from './sql-query-template.js';

class BindEntityServiceController {
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

        this.baseQueryTemplate = bindEntity_baseQuery;

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
                "GetBindEntityService", {
                    serviceID: this.service.ServiceID,
                }
            )
            .then((data) => {
                this.bindEntityService = data;

                if (!this.service.ServiceID) {
                    this.bindEntityService.BaseQuery = this.baseQueryTemplate;

                    _.filter(this.scenarios, (s) => {
                        return s.ScenarioID == this.service.ScenarioID;
                    }).map((s) => {
                        this.bindEntityService.Settings = {
                            StoredProcedurePrefixName: s.DatabaseObjectPrefix,
                            StoredProcedurePostfixName: this.service.ServiceName,
                        };
                    });
                } else if (!this.bindEntityService.BaseQuery) this.bindEntityService.BaseQuery = this.baseQueryTemplate;

                (this.bindEntityService.Entities || []).forEach((e) => {
                    _.filter(this.entities, (ee) => {
                        return ee.EntityID == e.EntityID;
                    }).map((ee) => {
                        e.Columns = ee.Columns;
                    });
                });

                (this.bindEntityService.EntityColumns || []).forEach((prop) => {
                    this.onSelectedEntityAliasChange(prop);
                });
            });
    }

    setForm() {
        this.form = this.validationService.init({
                DatabaseObjectType: {
                    id: "drpDatabaseObjectType",
                    required: true,
                },
                Entities: {
                    rule: (value) => {
                        if (value && value.length) {
                            return true;
                        }
                    },
                    required: true,
                },
                EntityID: {
                    id: "drpEntityID",
                    required: true,
                },
                EntityColumns: {
                    rule: (value) => {
                        if (value && value.length) {
                            return true;
                        }
                    },
                },
                "Settings.StoredProcedurePrefixName": {
                    rule: (value) => {
                        if (this.bindEntityService.DatabaseObjectType == 0 && !value)
                            return "Sp prefix is required.!";
                        else return true;
                    },
                    id: "txtSpPrefix",
                },
                "Settings.StoredProcedurePostfixName": {
                    rule: (value) => {
                        if (this.bindEntityService.DatabaseObjectType == 0 && !value)
                            return "Sp postfix is required.!";
                        else return true;
                    },
                    id: "txtSpPostfix",
                },
            },
            true,
            this.$scope,
            "$.bindEntityService"
        );

        this.selectedEntityForm = this.validationService.init({
                EntityName: {
                    required: true,
                },
                AliasName: {
                    id: "txtselectedEntityAliasName",
                    required: true,
                },
                TableName: {
                    required: true,
                },
            },
            true,
            this.$scope,
            "$.selectedEntity"
        );

        this.entityJoinRelationshipForm = this.validationService.init({
            JoinType: {
                id: "drpJoinType",
                required: true,
            },
            RightEntityAliasName: {
                id: "drpRightEntityAliasName",
                required: true,
            },
            JoinConditions: {
                rule: (value) => {
                    return true;
                },
                id: "txtJoinConditions",
                required: true,
            },
        });
    }

    onQueryTypeChange() {
        if (
            this.bindEntityService.QueryType == 1 &&
            !this.bindEntityService.CustomQuery
        )
            this.datasourceservice.CustomQuery =
            "CREATE PROCEDURE {Schema}.{ProcedureName}\nAS BEGIN\n\t\nEND";
    }

    onResetBaseQueryClick() {
        this.bindEntityService.BaseQuery = this.baseQueryTemplate;
    }

    onAddServiceParamClick() {
        this.service.Params = this.service.Params || [];

        this.service.Params.push({});
    }

    onSelectedEntityChange() {
        this.onRefreshEntityClick();
    }

    onRefreshEntityClick() {
        var result = [];

        const entity = _.find(this.entities, (v) => {
            return v.EntityID == this.bindEntityService.EntityID;
        });

        _.forEach(entity.Columns, (prop) => {
            var column = {
                ColumnID: prop.ColumnID,
                ColumnName: prop.ColumnName,
                ValueType: "DataSource",
            };

            _.filter(this.bindEntityService.EntityColumns, (p) => {
                return p.ColumnID == prop.ColumnID;
            }).map((p) => {
                column.IsSelected = p.IsSelected;
                column.ValueType = p.ValueType;
                column.EntityAliasName = p.EntityAliasName;
                column.ColumnName = p.ColumnName;
                column.Value = p.Value;
            });

            result.push(column);
        });

        this.bindEntityService.EntityColumns = result;
    }

    onSelectedEntityAliasChange(prop) {
        _.filter(this.bindEntityService.Entities, (e) => {
            return e.AliasName == prop.EntityAliasName;
        }).map((e) => {
            prop.Columns = e.Columns;
        });
    }

    onAddEntityClick() {
        this.selectedEntity = {};
        this.searchEntities = "";
        this.entities.forEach((e) => {
            e.IsSelected = false;
        });

        window["wnSelectEntity"].show();

        this.$timeout(() => {
            this.$scope.$broadcast("focusSearchEntity");
        }, 500);
    }

    onEntityItemClick(entity) {
        this.entities.forEach((e) => {
            e.IsSelected = false;
        });

        entity.IsSelected = !entity.IsSelected;

        this.selectedEntity.EntityID = entity.EntityID;
        this.selectedEntity.TableName = entity.TableName;
        this.selectedEntity.EntityName = entity.EntityName;
        this.selectedEntity.Columns = entity.Columns;

        this.$scope.$broadcast("focusEntityAliasName");
    }

    onSelectEntityClick() {
        this.selectedEntityForm.validated = true;
        this.selectedEntityForm.validator(this.selectedEntity);
        if (this.selectedEntityForm.valid) {
            if (
                _.filter(this.bindEntityService.Entities, (e) => {
                    return e.AliasName == this.selectedEntity.AliasName;
                }).length == 0
            ) {
                this.bindEntityService.Entities = this.bindEntityService.Entities || [];
                this.bindEntityService.Entities.push(angular.copy(this.selectedEntity));

                delete this.selectedEntity;
            }

            window["wnSelectEntity"].hide();
        }
    }

    onEntityExpandClick(entity) {
        _.filter(this.entities, (e) => {
            return e.EntityID == entity.EntityID;
        }).map((e) => {
            entity.Columns = e.Columns;
        });
    }

    onDeleteEntityClick(entity, $index) {
        this.bindEntityService.Entities.splice($index, 1);
    }

    onAddJoinRelationshipClick(entity) {
        entity.JoinRelationships = entity.JoinRelationships || [];
        entity.JoinRelationships.push({});
    }

    onAddJoinRelationshipClick2() {
        this.bindEntityService.JoinRelationships =
            this.bindEntityService.JoinRelationships || [];
        this.bindEntityService.JoinRelationships.push({});
    }

    onJoinRelationshipEntityChange(relationship, type) {
        _.filter(this.bindEntityService.Entities, (e) => {
            return (
                (type == 1 && e.AliasName == relationship.LeftEntityAliasName) ||
                (type == 2 && e.AliasName == relationship.RightEntityAliasName)
            );
        }).map((e) => {
            if (type == 1) relationship.LeftEntityTableName = e.TableName;
            else if (type == 2) relationship.RightEntityTableName = e.TableName;
        });
    }

    onAddFilterClick() {
        this.bindEntityService.Filters = this.bindEntityService.Filters || [];
        this.bindEntityService.Filters.push({
            Type: 1,
            ConditionGroupName: "ConditionGroup" + (this.bindEntityService.Filters.length + 1),
        });
    }

    validationJoinRelationship() {
        var isValid = true;

        var existsEntities = [];

        (this.bindEntityService.Entities || []).forEach((e) => {
            e.JoinRelationships || [].forEach((r) => {
                this.entityJoinRelationshipForm.validated = true;
                this.entityJoinRelationshipForm.validator(r);
                if (!this.entityJoinRelationshipForm.valid ||
                    existsEntities.indexOf(e.AliasName) >= 0 ||
                    existsEntities.indexOf(e.RightEntityAliasName) >= 0
                )
                    isValid = false;

                existsEntities = existsEntities.concat([
                    e.AliasName,
                    r.RightEntityAliasName,
                ]);
            });
        });

        return isValid;
    }

    validateService(task, args) {
        task.wait(() => {
            var defer = this.$q.defer();

            this.form.validated = true;
            this.form.validator(this.bindEntityService);
            if (this.form.valid && this.validationJoinRelationship())
                defer.resolve(true);

            return defer.promise;
        });
    }

    saveService(task, args) {
        task.wait(() => {
            var defer = this.$q.defer();

            this.bindEntityService.Service = this.service;
            this.bindEntityService.StoredProcedureName = this.bindEntityService.Settings.StoredProcedurePrefixName + this.bindEntityService.Settings.StoredProcedurePostfixName;
            this.bindEntityService.ServiceID = this.service.ServiceID;

            this.apiService.postApi("BusinessEngineBasicServices", "Service", "CreateBindEntityService", this.bindEntityService, { isNewService: args.isNewService }).then(
                (data) => {
                    this.bindEntityService.ItemID = data;

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

const BindEntityService = {
    bindings: {
        service: "<",
        scenarios: "<",
        entities: "<",
        entities: "<",
    },
    controller: BindEntityServiceController,
    controllerAs: "$",
    templateUrl: template,
};

export default BindEntityService;