function GridController(field, $scope, moduleController, $element) {
    var pageIndexKey = 'bGridPageIndex_' + field.FieldID;
    var pageSizeKey = 'bGridPageSize_' + field.FieldID;
    var initialPaging = 0;
    var paging;
    var fieldName = field.FieldName;

    this.init = function() {
        $scope.gridPageSizes = [10, 20, 30, 50, 100];

        if (field.Settings.EnablePaging) {
            if (field.Settings.SaveCurrentPageInStorage) {
                var pageIndex = localStorage.getItem(pageIndexKey);
                if (pageIndex) field.Settings.PageIndex = parseInt(pageIndex);

                var pageSize = localStorage.getItem(pageSizeKey);
                if (pageSize) field.Settings.PageSize = parseInt(pageSize);
            }

            field.Settings.PageCount = Math.ceil(field.DataSource.TotalCount / field.Settings.PageSize);

            renderPaging();
        }
    }

    function renderPaging() {
        if (field.Settings.PageCount > 1) {
            paging = $('#paging' + fieldName).twbsPagination({
                totalPages: field.Settings.PageCount,
                visiblePages: field.Settings.VisiblePages || 5,
                startPage: field.Settings.PageIndex || 1,
                pageClass: field.Settings.PageClass || 'page-item',
                first: field.Settings.FirstPageLabel || 'اولین صفحه',
                prev: field.Settings.PreviousPageLabel || 'قبلی ',
                next: field.Settings.NextPageLabel || 'بعدی',
                last: field.Settings.LastPageLabel || 'آخرین صفحه',
                onPageClick: function(event, page) {
                    if (++initialPaging > 1) {
                        field.Settings.PageIndex = page + 1;
                        $scope.bGrid_onPageChange(field);
                        if (!$scope.$$phase) $scope.$apply();
                    }
                }
            });
        }
    }

    $scope.bGrid_onPageChange = function(field) {
        moduleController.getFieldDataSource(field.FieldID, field.Settings.PageIndex - 1);

        if (field.Settings.SaveCurrentPageInStorage) localStorage.setItem(pageIndexKey, field.Settings.PageIndex);
    };

    //Event dropdown page size change
    $scope.bGrid_onPageSizeChange = function(field, pageSize) {
        $('#paging' + fieldName).twbsPagination('destroy');

        field.Settings.PageSize = pageSize;
        field.Settings.PageCount = Math.ceil(field.DataSource.TotalCount / pageSize);

        field.Settings.PageIndex = 1;
        initialPaging = 0;

        $scope.bGrid_onPageChange(field);

        renderPaging();
    };
}