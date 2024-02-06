function LeafletjsMapRoutingController(field, $scope, moduleController, $element) {

    this.init = () => {
        createMap(field);
    };
    //let map;
    function createMap(field) {

        function createButton(label, className, container) {
            // var btn = L.DomUtil.create('button', '', container);
            // btn.setAttribute('type', 'button');
            // btn.innerHTML = label;
            // return btn;

            var btn = L.DomUtil.create('span', className, container);
            btn.innerHTML = label;
            return btn;
        }



        L.Map.addInitHook(function () {
            // Generate global variable.
            if (!window.leafletjsMaps || !window.leafletjsMaps.find(x => x.mapId === "map" + field.FieldID)) {
                window.leafletjsMaps = [];
                window.leafletjsMaps.push({ mapId: "map" + field.FieldID, map: this });
            } else {
                window.leafletjsMaps.splice(window.leafletjsMaps.findIndex(x => x.mapId === "map" + field.FieldID), 1);
                window.leafletjsMaps.push({ mapId: "map" + field.FieldID, map: this });
            }
        });

        map = L.map("map" + field.FieldName, {
            //scrollWheelZoom: false,
        });

        var defaultLocation = { lat: 51.505, lng: -0.09 };
        if (field.Settings.DefaultLocationLat && field.Settings.DefaultLocationLng)
            defaultLocation = {
                lat: field.Settings.DefaultLocationLat,
                lng: field.Settings.DefaultLocationLng,
            };

        if (!field.Value) field.Value = defaultLocation;

        var position = field.Value || defaultLocation;
        map.setView([position.lat, position.lng], field.Settings.DefaultZoom);

        // var marker = L.marker([position.lat, position.lng], {
        //     draggable: true,
        //     name: "marker",
        // }).addTo(map);

        // marker.on("dragend", function (e) {
        //     var marker = e.target;
        //     field.Value = marker.getLatLng();
        //     $scope.$apply();
        // });

        // map.on("click", function (e) {
        //     marker.setLatLng(new L.LatLng(e.latlng.lat, e.latlng.lng));

        //     field.Settings.DefaultLocationLat = e.lat;
        //     field.Lng = e.lng;
        //     field.Value = e.latlng;

        //     $scope.$apply();
        // });

        if (!!field.Settings.EnableFitBounds && field.Settings.EnableFitBounds) {
            if (!!field.Settings.FitBoundsFromLat && field.Settings.FitBoundsFromLng &&
                field.Settings.FitBoundsToLat && field.Settings.FitBoundsToLng) {
                map.fitBounds([
                    [field.Settings.FitBoundsFromLat, field.Settings.FitBoundsFromLng],
                    [field.Settings.FitBoundsToLat, field.Settings.FitBoundsToLng]
                ]);
            }
        }


        var waypoints = [];
        let _control = L.Routing.control({
            routeWhileDragging: true,
            show: false,

            plan: L.Routing.plan(waypoints, {
                createMarker: function (i, wp) {

                    if (wp.name == 'start') {
                        return L.marker(wp.latLng, {
                            draggable: true,
                            icon: L.icon.glyph({ glyph: 'مبدا' })
                        });
                    }
                    if (wp.name == 'dest') {
                        return L.marker(wp.latLng, {
                            draggable: true,
                            icon: L.icon.glyph({ glyph: 'مقصد' })
                        });
                    }
                    if (wp.name == 'stop') {
                        return L.marker(wp.latLng, {
                            draggable: true,
                            icon: L.icon.glyph({ glyph: 'مبدا ' + i })
                        });
                    }
                },
                //geocoder: L.Control.Geocoder.nominatim(),
                routeWhileDragging: true
            }),
        }).on('routesfound', function (e) {
            var routes = e.routes;
            //محاسبه فاصله و زمان
            $scope.Form[field.FieldName].totalDistance = e.routes[0].summary.totalDistance;
            //$scope.Form[field.FieldName].totalDistanceAsKM = (e.routes[0].summary.totalDistance / 1000).toFixed(1) + ' km';
            $scope.Form[field.FieldName].totalTime = e.routes[0].summary.totalTime;
            //$scope.Form[field.FieldName].totalTimeAsHour = (e.routes[0].summary.totalTime / 60).toFixed(1) + ' min';
            $scope.$apply();


        })
            .addTo(map);

        map.on('click', function (e) {
            var container = L.DomUtil.create('div');
            if (waypoints.length == 0) {
                container.innerHTML = "<div class='tooltip-info'>" + field.Settings.ToolTipFromText + "</div>"
            }

            if (waypoints.length != 0 && waypoints[1].latLng == null) {
                container.innerHTML = "<div class='tooltip-info'>" + field.Settings.ToolTipToText + "</div>"
            }

            if (waypoints.length != 0 && waypoints[1].latLng != null) {
                container.innerHTML = "<div class='tooltip-info'>" + field.Settings.ToolTipClearText + "</div>"
            }

            var startBtn = waypoints.length == 0 ? createButton(field.Settings.ToolTipOKText, 'btn-start', container) : createButton('', '', container),
                destBtn = (waypoints.length != 0 && waypoints[1].latLng == null)
                    ? createButton(field.Settings.ToolTipOKText, 'btn-dest', container) : createButton('', '', container),
                clearBtn = (waypoints.length != 0 && waypoints[1].latLng != null)
                    ? createButton(field.Settings.ToolTipOKText, 'btn-clear', container) : createButton('', '', container);
            //midBtn = createButton('توقف',container);

            L.popup()
                .setContent(container)
                .setLatLng(e.latlng)
                .openOn(map);

            L.DomEvent.on(startBtn, 'click', function () {
                _control.spliceWaypoints(0, 1, { latLng: e.latlng, name: 'start' });
                waypoints = _control.getWaypoints();
                map.closePopup();
            });

            L.DomEvent.on(destBtn, 'click', function () {
                _control.spliceWaypoints(_control.getWaypoints().length - 1, 1, { latLng: e.latlng, name: 'dest' });
                waypoints = _control.getWaypoints();
                map.closePopup();
            });

            L.DomEvent.on(clearBtn, 'click', function () {
                _control.setWaypoints([]);
                waypoints = [];
                map.closePopup();
            });

            // L.DomEvent.on(midBtn, 'click', function () {
            //     var arr = [];
            //     var flag = 0;

            //     arr.push(_control.getWaypoints().findLast(x => x.name == 'start'));
            //     if (_control.getWaypoints().length > 2) {
            //         for (i = 0; i < _control.getWaypoints().length; i++) {
            //             if (i > 0 && i < _control.getWaypoints().length && _control.getWaypoints()[i].name != 'start' && _control.getWaypoints()[i].name != 'dest' && _control.getWaypoints()[i].name != '') {
            //                 arr.push(_control.getWaypoints()[i]);
            //             }
            //         }
            //     }
            //     arr.push({ latLng: e.latlng, name: 'stop' });
            //     arr.push(_control.getWaypoints().findLast(x => x.name == 'dest'));
            //     _control.setWaypoints(arr);
            //     waypoints = _control.getWaypoints();
            //     map.closePopup();
            // });


        });
        var osmLayer = new L.TileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                minZoom: 1,
                maxZoom: 18,
                attribution:
                    'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
            });
        map.addLayer(osmLayer);
    }


    // let lat;
    // let lng;
    // $scope.bLeafletjsMapRouting_onKeyUp = (field, $event, fieldName) => {
    //     switch (fieldName) {
    //         case 'Lat':
    //             lat = $event.target.value;
    //             break;
    //         case 'Lng':
    //             lng = $event.target.value;
    //             break;
    //     }

    //     if (!!+lat && !!+lng) {
    //         let map = window.leafletjsMaps.find(x => x.mapId === "map" + field.FieldID).map;
    //         map.eachLayer(function (layer) {
    //             if (layer.options.name === 'marker') {
    //                 layer.setLatLng([lat, lng])
    //             }
    //         });
    //     }

    // }

    if (!!field.Settings.EnableFitBounds && field.Settings.EnableFitBounds) {
        $scope.$watch('Field.' + field.FieldName + '.Settings.FitBoundsFromLat', function () {
            if (!!field.Settings.FitBoundsFromLat && !!window.leafletjsMaps) {
                let map = window.leafletjsMaps.find(x => x.mapId === "map" + field.FieldID).map;
                map.fitBounds([
                    [field.Settings.FitBoundsFromLat, field.Settings.FitBoundsFromLng],
                    [field.Settings.FitBoundsToLat, field.Settings.FitBoundsToLng]
                ]);
            }
        });
    }

    /*
    var obj = JSON.parse($scope.Field.DropDownList1.Value);
    $scope.Field.LeafletjsMap1.Settings.FitBoundsFromLat=obj.flat
    $scope.Field.LeafletjsMap1.Settings.FitBoundsFromLng=obj.flng
    $scope.Field.LeafletjsMap1.Settings.FitBoundsToLat=obj.tlat
    $scope.Field.LeafletjsMap1.Settings.FitBoundsToLng=obj.tlng
    */

    // $scope.$on('test123', function (e, args) {
    //     console.log($scope);
    // });
    //$scope.$broadcast('test123',{a:123});
}
