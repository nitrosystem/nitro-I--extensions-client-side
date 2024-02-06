function PersianDateTimePickerController(field, $scope, moduleController, $element) {
    var $bDateTime;

    this.init = function() {
        if (field.Settings && !field.Settings.DateType) field.Settings.DateType = 'date';

        initPersianDatePicker(field);

        var dt = field.Value;
        if (dt)
            setTimeout(() => {
                $bDateTime.setDate(new Date(dt).getTime());
            }, 500);

        //$('#bPersianDateTime' + field.FieldName).inputmask({ regex: '^([01][0-9]|2[0-3]):([0-5][0-9])$' });

        $("#bPersianDate" + field.FieldName).change(function() {
            var dt = moment($(this).val(), 'jYYYY/jM/jD');
            if (dt.isValid() && dt.year() > 1920)
                field.Value = dt.format('MM/DD/YYYY');
            else {
                delete field.Value;
                $('#bPersianDate' + field.FieldName).val('');
            }

            if (!$scope.$$phase) $scope.$apply();
        });
    }

    $scope.$watch('Field.' + field.FieldName + '.Value', function(newVal, oldVal) {
        if (newVal != oldVal && newVal) {
            $bDateTime.setDate(moment(newVal).unix() * 1000);

            field.ValueTime = moment(newVal).format("HH:mm");

            setFieldValue(field);
        } else
            $('#bPersianDate' + field.FieldName).val('');
    });

    $scope.$watch('Field.' + field.FieldName + '.ValueTime', function(newVal, oldVal) {
        if (newVal != oldVal && /^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(newVal)) {
            setFieldValue(field);
        }
    });

    var template = `
        <div id="plotId" class="datepicker-plot-area {{cssClass}}">
        {{#navigator.enabled}}
            <div data-navigator class="datepicker-navigator">
                <div class="pwt-btn pwt-btn-next">{{navigator.text.btnNextText}}</div>
                <div class="pwt-btn pwt-btn-switch">{{navigator.switch.text}}</div>
                <div class="pwt-btn pwt-btn-prev">{{navigator.text.btnPrevText}}</div>
            </div>
        {{/navigator.enabled}}
        <div class="datepicker-grid-view" >
        {{#days.enabled}}
            {{#days.viewMode}}
            <div class="datepicker-day-view" >    
                <div class="month-grid-box">
                    <div class="header">
                        <div class="title"></div>
                        <div class="header-row">
                            {{#weekdays.list}}
                                <div class="header-row-cell">{{.}}</div>
                            {{/weekdays.list}}
                        </div>
                    </div>    
                    <table cellspacing="0" class="table-days">
                        <tbody>
                            {{#days.list}}
                            
                                <tr>
                                    {{#.}}
                                        {{#enabled}}
                                            <td data-date="{{dataDate}}" data-unix="{{dataUnix}}" >
                                                <span  class="{{#otherMonth}}other-month{{/otherMonth}}">{{title}}</span>
                                                {{#altCalendarShowHint}}
                                                <i  class="alter-calendar-day">{{alterCalTitle}}</i>
                                                {{/altCalendarShowHint}}
                                            </td>
                                        {{/enabled}}
                                        {{^enabled}}
                                            <td data-date="{{dataDate}}" data-unix="{{dataUnix}}" class="disabled">
                                                <span class="{{#otherMonth}}other-month{{/otherMonth}}">{{title}}</span>
                                                {{#altCalendarShowHint}}
                                                <i  class="alter-calendar-day">{{alterCalTitle}}</i>
                                                {{/altCalendarShowHint}}
                                            </td>
                                        {{/enabled}}
                                        
                                    {{/.}}
                                </tr>
                            {{/days.list}}
                        </tbody>
                    </table>
                </div>
            </div>
            {{/days.viewMode}}
        {{/days.enabled}}

        {{#month.enabled}}
            {{#month.viewMode}}
                <div class="datepicker-month-view">
                    {{#month.list}}
                        {{#enabled}}               
                            <div data-month="{{dataMonth}}" class="month-item {{#selected}}selected{{/selected}}">{{title}}</small></div>
                        {{/enabled}}
                        {{^enabled}}               
                            <div data-month="{{dataMonth}}" class="month-item month-item-disable {{#selected}}selected{{/selected}}">{{title}}</small></div>
                        {{/enabled}}
                    {{/month.list}}
                </div>
            {{/month.viewMode}}
        {{/month.enabled}}

        {{#year.enabled }}
            {{#year.viewMode }}
                <div class="datepicker-year-view" >
                    {{#year.list}}
                        {{#enabled}}
                            <div data-year="{{dataYear}}" class="year-item {{#selected}}selected{{/selected}}">{{title}}</div>
                        {{/enabled}}
                        {{^enabled}}
                            <div data-year="{{dataYear}}" class="year-item year-item-disable {{#selected}}selected{{/selected}}">{{title}}</div>
                        {{/enabled}}                    
                    {{/year.list}}
                </div>
            {{/year.viewMode }}
        {{/year.enabled }}

        </div>
        {{#time}}
        {{#enabled}}
        <div class="datepicker-time-view">
            {{#hour.enabled}}
                <div class="hour time-segment" data-time-key="hour">
                    <div class="up-btn" data-time-key="hour">▲</div>
                    <input value="{{hour.title}}" type="text" placeholder="hour" class="hour-input">
                    <div class="down-btn" data-time-key="hour">▼</div>                    
                </div>       
                <div class="divider">
                    <span>:</span>
                </div>
            {{/hour.enabled}}
            {{#minute.enabled}}
                <div class="minute time-segment" data-time-key="minute" >
                    <div class="up-btn" data-time-key="minute">▲</div>
                    <input disabled value="{{minute.title}}" type="text" placeholder="minute" class="minute-input">
                    <div class="down-btn" data-time-key="minute">▼</div>
                </div>        
                <div class="divider second-divider">
                    <span>:</span>
                </div>
            {{/minute.enabled}}
            {{#second.enabled}}
                <div class="second time-segment" data-time-key="second"  >
                    <div class="up-btn" data-time-key="second" >▲</div>
                    <input disabled value="{{second.title}}"  type="text" placeholder="second" class="second-input">
                    <div class="down-btn" data-time-key="second" >▼</div>
                </div>
                <div class="divider meridian-divider"></div>
                <div class="divider meridian-divider"></div>
            {{/second.enabled}}
            {{#meridian.enabled}}
                <div class="meridian time-segment" data-time-key="meridian" >
                    <div class="up-btn" data-time-key="meridian">▲</div>
                    <input disabled value="{{meridian.title}}" type="text" class="meridian-input">
                    <div class="down-btn" data-time-key="meridian">▼</div>
                </div>
            {{/meridian.enabled}}
        </div>
        {{/enabled}}
        {{/time}}

        {{#toolbox}}
        {{#enabled}}
        <div class="toolbox">
            {{#toolbox.submitButton.enabled}}
                <div class="pwt-btn-submit">{{submitButtonText}}</div>
            {{/toolbox.submitButton.enabled}}        
            {{#toolbox.todayButton.enabled}}
                <div class="pwt-btn-today">{{todayButtonText}}</div>
            {{/toolbox.todayButton.enabled}}        
            {{#toolbox.calendarSwitch.enabled}}
                <div class="pwt-btn-calendar">{{calendarSwitchText}}</div>
            {{/toolbox.calendarSwitch.enabled}}
        </div>
        {{/enabled}}
        {{^enabled}}
            {{#onlyTimePicker}}
            <div class="toolbox">
                <div class="pwt-btn-exit">{{text.btnExit}}</div>
            </div>
            {{/onlyTimePicker}}
        {{/enabled}}
        {{/toolbox}}
        </div>

    
    `

    function initPersianDatePicker(field) {
        $bDateTime = $("#bPersianDate" + field.FieldName).pDatepicker({
            autoClose: true,
            format: field.Settings.Format || 'YYYY/MM/DD',
            template: template,
            initialValue: false,
            navigator: {
                text: {
                    btnPrevText: 'قبلی',
                    btnNextText: 'بعدی'
                },
                scroll: {
                    enabled: false
                }
            },
            onSelect: function(unix) {
                setFieldValue(field);
            }
        });
    }

    function setFieldValue(field) {
        if ($('#bPersianDate' + field.FieldName).val()) {
            field.Value = moment(moment.unix($bDateTime.getState().selected.unixDate / 1000).format('MM/DD/YYYY') + ' ' + (field.ValueTime ? field.ValueTime : '00:00')).format('MM/DD/YYYY HH:mm');
            if (!$scope.$$phase) $scope.$apply();
        }
    }
}