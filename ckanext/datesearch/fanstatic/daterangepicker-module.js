this.ckan.module('daterangepicker-module', function ($) {
    return {
        initialize: function () {

            // Define a new jQuery function to parse parameters from URL
            $.urlParam = function(name) {
                var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
                if (results == null) { return null; } else { return decodeURIComponent(results[1]) || 0; }
            };

            // Pick out relevant parameters
            var param_start = $.urlParam('ext_pub_start');
            var param_end = $.urlParam('ext_pub_end');

            // Populate the datepicker and hidden fields
            if (param_start) {
                $('#start').val(moment.utc(param_start).year());
                $('#ext_pub_start').val(param_start);
            }
            if (param_end) {
                $('#end').val(moment.utc(param_end).year());
                $('#ext_pub_end').val(param_end);
            }

            // Add hidden <input> tags #ext_pub_start and #ext_pub_end, if they don't already exist.
            var form = $("#dataset-search");
            // CKAN 2.1
            if (!form.length) {
                form = $(".search-form");
            }
            if ($("#ext_pub_start").length === 0) {
                $('<input type="hidden" id="ext_pub_start" name="ext_pub_start" />').appendTo(form);
            }
            if ($("#ext_pub_end").length === 0) {
                $('<input type="hidden" id="ext_pub_end" name="ext_pub_end" />').appendTo(form);
            }

	        var earliest_publication_year = this.options.earliest_publication_year.toString();

            // Add a date-range picker widget to the <input> with id #daterange
            $('#start').datepicker({
		        startDate: earliest_publication_year,
                endDate: "+0d",
		        format: "yyyy",
                startView: 3,
                minViewMode: 2,
                keyboardNavigation: false,
                autoclose: true
	        }).on('changeDate', function (ev) {
                var start_date = moment(ev.date);
                var start_date_str = start_date.format('YYYY')
                var end_date_str = $('#end').val();
                var end_date = moment(end_date_str, 'YYYY');

                // Flip the dates if end date is before start date, this ensures correct order in search view for results.
                if(end_date_str && start_date.isAfter(end_date, 'year')) {
                    $('#ext_pub_start').val(end_date_str);
                    $('#ext_pub_end').val(start_date_str);
                }
                else {
                    $('#ext_pub_start').val(start_date_str);
                }
                form.submit();
            });

            // Add a year picker widget to the <input> with id #end
            $('#end').datepicker({
		        startDate: earliest_publication_year,
                endDate: "+0d",
		        format: "yyyy",
                startView: 3,
                minViewMode: 2,
                keyboardNavigation: false,
                autoclose: true
	        }).on('changeDate', function (ev) {
                var end_date = moment(ev.date);
                var end_date_str = end_date.format('YYYY')
                var start_date_str = $('#start').val();
                var start_date = moment(start_date_str, 'YYYY');

                //Flip the dates if end date is before start date, this ensures correct order in search view for results.
                if(start_date_str && start_date.isAfter(end_date, 'year')) {
                    $('#ext_pub_start').val(end_date_str);
                    $('#ext_pub_end').val(start_date_str);
                }
                else {
                    $('#ext_pub_end').val(end_date_str);
                }
                form.submit();
            });

        }
    }
});
