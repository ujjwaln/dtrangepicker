(function(angular) {
    'use strict';
    function getDOY(dt) {
        var jan1dt = new Date(dt.getFullYear(), 0, 1);
        var dt_start = new Date(dt.getTime());
        dt_start.setHours(0);
        dt_start.setMinutes(0);
        dt_start.setSeconds(0);
        dt_start.setMilliseconds(0);
        var doy = (dt_start.getTime() - jan1dt.getTime()) / (3600 * 1000 * 24);
        return Math.floor(doy) + 1;
    };
    function constructCalendar(dt_utc) {
        var dt = new Date(dt_utc);
        var year = dt.getFullYear();
        var month = dt.getMonth();
        var firstDay = new Date(year, month, 1, 0, 0, 1);
        var firstDay_dow = firstDay.getDay();
        var calendar = [];
        for (var j = 0; j < 6; j++) {
            var week = [];
            for (var i = 0; i < 7; i++) {
                var d = new Date(firstDay.getTime() + (i + j * 7 - firstDay_dow) * 3600 * 24 * 1000);
                var obj = {
                    value : d.valueOf(),
                    current : false,
                    doy : getDOY(d)
                };
                week[i] = obj;
            }
            calendar[j] = week;
        }
        return calendar;
    }

    var module = angular.module('dtrangepicker', []);
    module.directive('dtrange', function($timeout) {
        return {
            restrict : 'E',
            templateUrl : './src/dtrangepicker.html', 
            //templateUrl : './bower_components/dtrangepicker/src/dtrangepicker.html',
            scope : {
                selectedDates: '=',
                inactiveDates: '=',
                minDate: '@'
            },
            link : function(scope, elem, attrs) {
                scope.dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                scope._selectedDates = [];
                scope.prevMonth = function(ev) {
                    ev.preventDefault();
                    var d = new Date(scope.dt_calendar);
                    var val = new Date(d.getFullYear(), d.getMonth() - 1, 1, 0, 0, 0).valueOf();
                    scope.dt_calendar = val;
                    scope.calendar = constructCalendar(val);
                };
                scope.nextMonth = function(ev) {
                    ev.preventDefault();
                    var d = new Date(scope.dt_calendar);
                    var val = new Date(d.getFullYear(), d.getMonth() + 1, 1, 0, 0, 0).valueOf();
                    scope.dt_calendar = val;
                    scope.calendar = constructCalendar(val);
                };
                scope.$watch('inactiveDates', function(val) {
                    if (val && val.length>0) {
                        scope._inactiveDates = val;
                        if (scope._inactiveDates && scope._inactiveDates.hasOwnProperty('length') 
                            && scope._inactiveDates.length > 0) {
                            scope.dt_calendar = scope._inactiveDates[0][0];
                        }   
                    }
                });
                scope.$watch('_selectedDates', function(val) {
                    //console.log('selcteddates', val);
                    if (!val || val.length == 0) {
                        scope.dt_calendar = new Date();
                    } else {
                        scope.dt_calendar = scope._selectedDates[0];
                    }
                    scope.calendar = constructCalendar(scope.dt_calendar);
                });
                scope.select = function(ev, dt) {
                    ev.preventDefault();
                    if (scope._selectedDates.length == 1) {
                        if (scope._inactiveDates && scope._inactiveDates.length > 0) {
                            for (var i=0; i<scope._inactiveDates.length; i++) {
                                var range = scope._inactiveDates[i];
                                var dt2 = dt;
                                var dt1 = scope._selectedDates[0];
                                if (scope._selectedDates[0] > dt) {
                                    dt1 = dt;
                                    dt2 = scope._selectedDates[0];
                                }
                                if ( (dt1 >= range[0] && dt1 <= range[1]) || 
                                     (dt2 >= range[0] && dt2 <= range[1]) ||
                                     (dt1 <= range[0] && dt2 >= range[1])) {
                                    //overlap, clear dates
                                    scope._selectedDates = [];
                                    return false;
                                }
                            }
                        }
                        if (dt > scope._selectedDates[0]) {
                            scope._selectedDates.push(dt);
                        } 
                        else {
                            if (dt < scope._selectedDates[0]) {
                                scope._selectedDates.splice(0, 0, dt);
                                console.log(scope._selectedDates);
                            }
                            //if dt == scope.selectedDates[0] do nothing
                        }
                        $timeout(function(){
                            scope.$apply();
                        });
                    } else {
                        scope._selectedDates = [dt];
                    }
                    
                    $timeout(function() {
                        scope.selectedDates = [];
                        for (var j=0; j<scope._selectedDates.length; j++) {
                            scope.selectedDates.push(scope._selectedDates[j]);
                        }
                        scope.$apply();
                    });
                };
                scope.getDateClass = function(dt) {
                    var inrange = false,
                        selected = false;
                    if (scope._inactiveDates && scope._inactiveDates.length) {
                        for (var i=0, il=scope._inactiveDates.length; i<il; i++) {
                            if (dt.value >= scope._inactiveDates[i][0] && dt.value <= scope._inactiveDates[i][1]) {
                              inrange=true;
                              break;
                            }
                        }
                    }
                    if (scope._selectedDates && scope._selectedDates.length) {
                        if ((dt.value == scope._selectedDates[0]) || (dt.value >= scope._selectedDates[0] 
                            && dt.value <= scope._selectedDates[1])) {
                            selected = true;
                        }
                    }
                    var classes = "";
                    if (scope.minDate && (dt.value < scope.minDate)) {
                        classes = "disabled";
                    }
                    if (inrange) {
                        classes = "inactive";
                    }
                    if (selected) {
                        classes = "selected";
                    }
                    return classes;
                };
            }
        };
    });
})(window.angular);
