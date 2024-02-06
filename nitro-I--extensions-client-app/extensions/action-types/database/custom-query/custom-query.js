function CustomQueryActionController(actionService, $scope) {
    this.execute = (action, params, defer) => {
        if (action.Settings && typeof action.Settings == "object")
            action.Settings = JSON.stringify(action.Settings);

        const postData = {
            ActionID: action.ActionID,
            ModuleID: action.ModuleID,
            ParentID: action.ParentID,
            ServiceID: action.ServiceID,
            FieldID: action.FieldID,
            ConnectionID: $scope.connectionID,
            PageUrl: document.URL,
            Settings: action.Settings,
            Params: params,
        };

        actionService.apiService.postApi("BusinessEngineBasicActions", "Service", "CallCustomQueryAction", postData).then((data) => {
                if (data) {
                    actionService.globalService.parseJsonItems(data.DataRow);
                    actionService.globalService.parseJsonItems(data.DataList);
                }

                defer.resolve(data);
            },
            (error) => {
                defer.reject(error.data);
            }
        );

        return defer.promise;
    }
}