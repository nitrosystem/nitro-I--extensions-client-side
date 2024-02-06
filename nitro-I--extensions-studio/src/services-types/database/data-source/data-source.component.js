import template from "./data-source.html";
import { baseQuery } from './sql-query-template.js';

class DataSourceServiceController {
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

        this.baseQueryTemplate = baseQuery;

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
                "GetDataSourceService", {
                    serviceID: this.service.ServiceID,
                }
            )
            .then((data) => {
                this.dataSourceService = data;

                if (!this.service.ServiceID) {
                    this.dataSourceService.BaseQuery = this.baseQueryTemplate;

                    if (this.service.ResultType == 2) {
                        this.service.Params = [
                            { ParamName: "@PageIndex", ParamType: "int", DefaultValue: 1 },
                            { ParamName: "@PageSize", ParamType: "int", DefaultValue: 10 },
                        ];

                        this.dataSourceService.EnablePaging = true;
                        this.dataSourceService.PageIndexParam = "@PageIndex";
                        this.dataSourceService.PageSizeParam = "@PageSize";
                    }

                    _.filter(this.scenarios, (s) => {
                        return s.ScenarioID == this.service.ScenarioID;
                    }).map((s) => {
                        this.dataSourceService.Settings = {
                            StoredProcedurePrefixName: s.DatabaseObjectPrefix,
                            StoredProcedurePostfixName: this.service.ServiceName,
                        };
                    });
                } else if (!this.dataSourceService.BaseQuery) this.dataSourceService.BaseQuery = this.baseQueryTemplate;

                (this.dataSourceService.Entities || []).forEach((e) => {
                    _.filter(this.entities, (ee) => {
                        return ee.EntityID == e.EntityID;
                    }).map((ee) => {
                        e.Columns = ee.Columns;
                    });
                });

                (this.dataSourceService.ViewModelProperties || []).forEach((prop) => {
                    this.onSelectedEntityAliasChange(prop);
                });

                (this.dataSourceService.SortItems || []).forEach((s) => {
                    this.onSortItemSelectedEntityAliasChange(s);
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
                ViewModelID: {
                    id: "drpViewModelID",
                    required: true,
                },
                ViewModelProperties: {
                    rule: (value) => {
                        if (value && value.length) {
                            return true;
                        }
                    },
                },
                // SortItems: {
                //   rule: (value) => {
                //     if (this.service.ResultType == 2 && value && value.length) {
                //       return true;
                //     }

                //     return true;
                //   },
                // },
                "Settings.StoredProcedurePrefixName": {
                    rule: (value) => {
                        if (this.dataSourceService.DatabaseObjectType == 0 && !value)
                            return "Sp prefix is required.!";
                        else return true;
                    },
                    id: "txtSpPrefix",
                },
                "Settings.StoredProcedurePostfixName": {
                    rule: (value) => {
                        if (this.dataSourceService.DatabaseObjectType == 0 && !value)
                            return "Sp postfix is required.!";
                        else return true;
                    },
                    id: "txtSpPostfix",
                },
            },
            true,
            this.$scope,
            "$.dataSourceService"
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

    onResetBaseQueryClick() {
        this.dataSourceService.BaseQuery = this.baseQueryTemplate;
    }

    onQueryTypeChange() {
        if (this.dataSourceService.QueryType == 1 && !this.dataSourceService.CustomQuery)
            this.datasourceservice.CustomQuery = "CREATE PROCEDURE {Schema}.{ProcedureName}\nAS BEGIN\n\t\nEND";
    }

    onAddServiceParamClick() {
        this.service.Params = this.service.Params || [];

        this.service.Params.push({});
    }

    onSelectedViewModelChange() {
        this.onRefreshViewModelClick();
    }

    onRefreshViewModelClick() {
        var result = [];

        const viewModel = _.find(this.viewModels, (v) => {
            return v.ViewModelID == this.dataSourceService.ViewModelID;
        });

        _.forEach(viewModel.Properties, (prop) => {
            var property = {
                PropertyID: prop.PropertyID,
                PropertyName: prop.PropertyName,
                ValueType: "DataSource",
            };

            _.filter(this.dataSourceService.ViewModelProperties, (p) => {
                return p.PropertyID == prop.PropertyID;
            }).map((p) => {
                property.IsSelected = p.IsSelected;
                property.ValueType = p.ValueType;
                property.EntityAliasName = p.EntityAliasName;
                property.ColumnName = p.ColumnName;
                property.Value = p.Value;
            });

            result.push(property);
        });

        this.dataSourceService.ViewModelProperties = result;
    }

    onSelectedEntityAliasChange(prop) {
        _.filter(this.dataSourceService.Entities, (e) => {
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
                _.filter(this.dataSourceService.Entities, (e) => {
                    return e.AliasName == this.selectedEntity.AliasName;
                }).length == 0
            ) {
                this.dataSourceService.Entities = this.dataSourceService.Entities || [];
                this.dataSourceService.Entities.push(angular.copy(this.selectedEntity));

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
        this.dataSourceService.Entities.splice($index, 1);
    }

    onAddJoinRelationshipClick(entity) {
        entity.JoinRelationships = entity.JoinRelationships || [];
        entity.JoinRelationships.push({});
    }

    onAddJoinRelationshipClick2() {
        this.dataSourceService.JoinRelationships =
            this.dataSourceService.JoinRelationships || [];
        this.dataSourceService.JoinRelationships.push({});
    }

    onJoinRelationshipEntityChange(relationship, type) {
        _.filter(this.dataSourceService.Entities, (e) => {
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
        this.dataSourceService.Filters = this.dataSourceService.Filters || [];
        this.dataSourceService.Filters.push({
            Type: 1,
            ConditionGroupName: "ConditionGroup" + (this.dataSourceService.Filters.length + 1),
        });
    }

    onAddSortItemClick() {
        this.dataSourceService.SortItems = this.dataSourceService.SortItems || [];
        this.dataSourceService.SortItems.push({ Type: 0, SortType: "Asc" });
    }

    onSortItemSelectedEntityAliasChange(sortItem) {
        _.filter(this.dataSourceService.Entities, (e) => {
            return e.AliasName == sortItem.EntityAliasName;
        }).map((e) => {
            sortItem.Columns = e.Columns;
        });
    }

    onEnablePagingChange() {
        if (this.dataSourceService.EnablePaging) {
            if (
                _.filter(this.service.Params, (p) => {
                    return p.ParamName.toLowerCase() == "@pageindex";
                }).length == 0
            )
                this.service.Params.push({
                    ParamName: "@PageIndex",
                    ParamType: "int",
                    DefaultValue: 1,
                    IsSystemParam: true,
                });

            if (
                _.filter(this.service.Params, (p) => {
                    return p.ParamName.toLowerCase() == "@pagesize";
                }).length == 0
            )
                this.service.Params.push({
                    ParamName: "@PageSize",
                    ParamType: "int",
                    DefaultValue: 1,
                    IsSystemParam: true,
                });
        } else {
            _.filter(this.service.Params, (p) => {
                return p.ParamName.toLowerCase() == "@pageindex";
            }).map((p) => {
                this.service.Params.splice(this.service.Params.indexOf(p), 1);
            });

            _.filter(this.service.Params, (p) => {
                return p.ParamName.toLowerCase() == "@pagesize";
            }).map((p) => {
                this.service.Params.splice(this.service.Params.indexOf(p), 1);
            });
        }
    }

    validationJoinRelationship() {
        var isValid = true;

        var existsEntities = [];

        (this.dataSourceService.Entities || []).forEach((e) => {
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
            this.form.validator(this.dataSourceService);
            if (this.form.valid && this.validationJoinRelationship())
                defer.resolve(true);

            return defer.promise;
        });
    }

    saveService(task, args) {
        task.wait(() => {
            var defer = this.$q.defer();

            this.dataSourceService.Service = this.service;
            this.dataSourceService.StoredProcedureName =
                this.dataSourceService.Settings.StoredProcedurePrefixName +
                this.dataSourceService.Settings.StoredProcedurePostfixName;
            this.dataSourceService.ServiceID = this.service.ServiceID;

            this.apiService
                .postApi(
                    "BusinessEngineBasicServices",
                    "Service",
                    "CreatedataSourceService",
                    this.dataSourceService, { isNewService: args.isNewService }
                )
                .then(
                    (data) => {
                        this.dataSourceService.ItemID = data;

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

const DataSourceService = {
    bindings: {
        service: "<",
        scenarios: "<",
        entities: "<",
        viewModels: "<",
    },
    controller: DataSourceServiceController,
    controllerAs: "$",
    templateUrl: template,
};

export default DataSourceService;