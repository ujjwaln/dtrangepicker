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
                //console.log(d, d.valueOf());
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
            
            scope : {
                selectedDates: '=',
                inactiveDates: '='
            },
            
            link : function(scope, elem, attrs) {
                
                scope.dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                scope.mode = 'end';
                
                scope.$watch('inactiveDates', function(val) {
                    if (scope.inactiveDates.length > 0) {
                        scope.dt_calendar = scope.inactiveDates[0][0];
                    }
                });
                
                scope.$watch('selectedDates', function(val) {
                    if (!val) {
                        scope.selectedDates = [];
                        scope.dt_calendar = new Date();
                        scope.calendar = constructCalendar(scope.dt_calendar);
                    }
                });
                
                scope.prevMonth = function() {
                    var d = new Date(scope.dt_calendar);
                    var val = new Date(d.getFullYear(), d.getMonth() - 1, 1, 0, 0, 0).valueOf();
                    scope.dt_calendar = val;
                    scope.calendar = constructCalendar(val);
                };

                scope.nextMonth = function() {
                    var d = new Date(scope.dt_calendar);
                    var val = new Date(d.getFullYear(), d.getMonth() + 1, 1, 0, 0, 0).valueOf();
                    scope.dt_calendar = val;
                    scope.calendar = constructCalendar(val);
                };

                scope.select = function(dt) {
                    if (scope.selectedDates.length == 1) {
                        if (dt > scope.selectedDates[0]) {
                            scope.selectedDates.push(dt);
                        } else {
                            if (dt < scope.selectedDates[0]) {
                                scope.selectedDates.splice(0,0,dt);
                            }
                            //if dt == scope.selectedDates[0] do nothing
                        }
                        
                        $timeout(function(){
                            scope.$apply();
                        });
                        
                    } else {
                        scope.selectedDates = [dt];
                        
                    }
                    console.log(scope.selectedDates);
                };

                scope.getDateClass = function(dt) {
                    var inrange = false,
                        selected = false;
                        
                    for (var i=0, il=scope.inactiveDates.length; i<il; i++) {
                        if (dt.value >= scope.inactiveDates[i][0] && dt.value <= scope.inactiveDates[i][1]) {
                          inrange=true;
                          break;
                        }
                    }
                    
                    if ((dt.value == scope.selectedDates[0]) ||
                        (dt.value >= scope.selectedDates[0] && dt.value <= scope.selectedDates[1])) 
                    {
                        selected = true;
                    }
                    
                    var classes = "";
                    if (inrange) {
                        classes = 'inactive';
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




                
               /*
                scope.paintCalendar = function() {
                                   
                                   if (!scope.dt_start)
                                       return;
               
                                   if (!scope.dt_end) {
                                       for (var i = 0; i < scope.calendar.length; i++) {
                                           for (var j = 0; j < scope.calendar[i].length; j++) {
                                               var o = scope.calendar[i][j];
                                               var startDOY = getDOY(scope.dt_start);
                                               var endDOY = getDOY(scope.dt_end);
               
                                               if ((o.doy == startDOY) || (o.doy == endDOY)) {
                                                   o.current = true;
                                               } else {
                                                   o.current = false;
                                               }
                                               if ((o.doy >= startDOY) && (o.doy <= endDOY)) {
                                                   o.inrange = true;
                                               } else {
                                                   o.inrange = false;
                                               }
                                           }
                                       }
                                   }
                               };*/
               