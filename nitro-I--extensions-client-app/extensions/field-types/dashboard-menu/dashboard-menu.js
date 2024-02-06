function DashboardMenuController(field, $scope, moduleController, $element) {
    this.init = () => {};

    $scope.onMenuClick = (pageID) => {
        $scope.$emit('onGotoDashboardPage', { pageID: pageID, isUpdatePageParams: true });
    }
}