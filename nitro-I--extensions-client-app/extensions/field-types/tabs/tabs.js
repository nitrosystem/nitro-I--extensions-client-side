function TabsController(field, $scope, moduleController, $element) {
    this.init = () => {
        if (field.Settings.Tabs && field.Settings.Tabs.length) field.Settings.CurrentTab = field.Settings.Tabs[0].Name;

        field.Tab = {};
        for (var i = 0; i < field.Settings.Tabs.length; i++) {
            field.Tab[field.Settings.Tabs[i].Name] = field.Settings.Tabs[i];

            $scope.tabsShowHideTab(i);
            $scope.tabsEnableDisableTab(i);
        }
    };

    $scope.tabsShowHideTab = (tabIndex) => {
        field.Settings.Tabs[tabIndex].IsShow = moduleController.expressionService.checkConditions(field.Settings.Tabs[tabIndex].ShowConditions, $scope);
    };

    $scope.tabsEnableDisableTab = (tabIndex) => {
        field.Settings.Tabs[tabIndex].IsEnable = moduleController.expressionService.checkConditions(field.Settings.Tabs[tabIndex].EnableConditions, $scope);
    };

    $scope.bTabs_onTabClick = (field, tab, $event) => {
        field.Settings.CurrentTab = tab.Name;

        var currentTab = _.find(field.Settings.Tabs, (s) => { return s.Name == field.Settings.CurrentTab });
        var currentTabIndex = field.Settings.Tabs.indexOf(currentTab);

        if (field.Settings.Tabs.indexOf(tab) > currentTabIndex) {
            const paneName = `TabsTab_${currentTab.Name}`;

            moduleController.validatePane(paneName).then((isValid) => {
                if (isValid && tab.IsShow && tab.IsEnable) {
                    field.Settings.CurrentTab = tab.Name;
                }
            });
        } else if (tab.IsShow && tab.IsEnable) {
            field.Settings.CurrentTab = tab.Name;
        }
    };
}