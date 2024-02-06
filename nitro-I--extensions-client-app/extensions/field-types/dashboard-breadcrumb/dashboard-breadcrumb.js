function DashboardBreadcrumbController(field, $scope, moduleController, $element) {
    this.init = function() {
        $scope.DashboardBreadcrumb = {};
        raiseElement(field);
    }

    $scope.$watch('currentPageID', function(newVal, oldVal) {
        if (newVal != oldVal)
            raiseElement(field);
    });

    function raiseElement(field) {
        // Parse Current Page
        if ($scope.currentPage) {
            $scope.DashboardBreadcrumb.CurrentPage = {
                Title: $scope.currentPage.Title,
                Icon: $scope.currentPage.Settings ? $scope.currentPage.Settings.Icon : ''
            };

            //Parse Page Parents Path
            $scope.DashboardBreadcrumb.ParentsPath = getPageParentsPath($scope.currentPage);

            const $breadcrumb = moduleController.$compile('<span>' + field.Settings.BreadcrumbTemplate + '</span>')($scope);
            $(`#bDashboardBreadcrumb_${field.FieldName}`).html($breadcrumb);
        }
    }

    function getPageParentsPath(page) {
        var parents = [
            { PageID: page.PageID, Title: page.Title, Icon: page.Settings ? page.Settings.Icon : '' }
        ];

        const findParents = (parentID) => {
            const parent = getPageByPageID(parentID);

            parents.push({ PageID: parent.PageID, Title: parent.Title, Icon: parent.Settings ? parent.Settings.Icon : '' });

            if (parent.ParentID)
                findParents(parent.ParentID);
            else
                return parents
        }

        if (!page.ParentID)
            return parents;
        else
            return findParents(page.ParentID);
    }

    function getPageByPageID(pageID) {
        var result;

        const findNestedPage = (pages) => {
            _.forEach(pages, (p) => {
                if (p.PageID == pageID) result = p;
                else return findNestedPage(p.Pages);
            });
        };

        findNestedPage($scope.pages);

        return result;
    }

    $scope.onDashboardMenuClick = (pageID) => {
        $scope.$emit('onGotoDashboardPage', { pageID: pageID, isUpdatePageParams: true });
    }
}