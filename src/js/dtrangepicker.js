(function(angular) {
    'use strict';
    
    function constructCalendar(dt) {
        var year = dt.getFullYear();
        var month = dt.getMonth();
        var firstDay = new Date(year, month, 1, 0, 0, 0);
        var firstDay_dow = firstDay.getDay();
        var calendar = [];
        for (var j=0; j<6; j++) {
            var week = [];
            for (var i=0; i < 7; i++) {
                var d = new Date(firstDay.getTime() + (i + j * 7 - firstDay_dow) * 3600 * 24 * 1000);
                week[i] = d;
            }
            calendar[j] = week;
        }
        return calendar;
    }
    
    var module = angular.module('dtrangepicker', []);
    
    module.directive('dtrange', function() {
       return {
           restrict: 'E',
           templateUrl: './src/dtrangepicker.html',  
           scope: {
               startDt:'=',
               endDt:'='
           },
           controller: function($scope) {
               $scope.select = function(){};
           },
           link: function(scope, elem, attrs) {
               scope.$watch('startDt', function(val) {
                   scope.dt_start = val;
               });
               scope.$watch('endDt', function(val) {
                   scope.dt_end = val;
               });
           }
       };
    });
    
    module.directive('dtime', function(){
        return {
            restrict: 'E',
            templateUrl: './src/dtime.html',
            scope: {
                dt:'='
            },
            link: function(scope, elem, attrs) {
                scope.dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                scope.$watch('dt', function(val) {
                    if (val) {
                        scope.selectedDate = val;
                    }
                });
                scope.prevMonth = function() {
                    scope.selectedDate = new Date(scope.selectedDate.setMonth(scope.selectedDate.getMonth()-1));
                };
                scope.nextMonth = function() {
                    scope.selectedDate = new Date(scope.selectedDate.setMonth(scope.selectedDate.getMonth()+1));
                };
                scope.$watch("selectedDate", function(val) {
                    if (val) {
                        scope.calendar = constructCalendar(val);
                    }
                });
            }
        };
    });
    
})(window.angular);
