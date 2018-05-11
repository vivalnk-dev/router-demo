

$(document).ready(function() {

$(function() {
    // initialize input widgets first
    $('#timeslot .time-start').timepicker({
        'showDuration': true,
        'timeFormat': 'g:i a'

    });

    $('#timeslot .date-start').datepicker({
        'format': 'mm/dd/yyyy',
        'autoclose': true

    });

    $('#timeslot .time-end').timepicker({
        'showDuration': true,
        'timeFormat': 'g:i a'

    });

    $('#timeslot .date-end').datepicker({
        'format': 'mm/dd/yyyy',
        'autoclose': true

    });

    // initialize datepair
    $('#timeslot').datepair();

  });

$( "#generate" ).click(function() {
    getGraphTimes();
});

function renderLoadingAnimation() {
    $('.lds-container').show();
}

function deleteLoadingAnimation() {
    $('.lds-container').hide();
}

function checkInputs(id, start, end)
{
    if(id == ''){
      alert('Device ID cannot be left blank');
      return false;
    }

    if(start > end){
      alert('Invalid range');
      return false;
    }

    return true;
}

function getGraphTimes() {

    var startDate = $('#timeslot .date-start').val();
    var startTime = $('#timeslot .time-start').val();

    var endDate = $('#timeslot .date-end').val();
    var endTime = $('#timeslot .time-end').val();

    var start = unixTime(startDate, startTime);
    var end = unixTime(endDate, endTime);

    var id = $('#device .serial').val();

    if (checkInputs(id, start, end))
    {
        generateGraph(id, start, end);
    }

}

function unixTime(date, time) {
    return new Date(date + " " + time).getTime() / 1000;
}

function generateGraph(id, start, end)
{
    renderLoadingAnimation()
        $.getJSON('https://fever-rest.herokuapp.com/feverscout?id=' + id + '&start=' + start + '&end=' + end, function(data) {

            if(data.data.length == 0)
            {
                alert('No data found');
            }
        console.log(data.data);

        var chart = AmCharts.makeChart("chartdiv", {
    "type": "serial",
    "theme": "light",
    "marginTop":0,
    "marginRight": 80,
    "dataProvider": data.data,
    "graphs": [{
        "id":"g1",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 8,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "type": "smoothedLine",
        "valueField": "value"
    }],
    "chartScrollbar": {
        "graph":"g1",
        "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1

    },
    "chartCursor": {
        "categoryBalloonDateFormat": "Temperature",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
    },
    "categoryField": "timestamp",
    "categoryAxis": {
        "minPeriod": "ss",
        "parseDates": true,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
    },
    "export": {
        "enabled": true
    }
});


chart.addListener("rendered", zoomChart);
if(chart.zoomChart){
    chart.zoomChart();
}

function zoomChart(){
    chart.zoomToIndexes(Math.round(chart.dataProvider.length * 0.4), Math.round(chart.dataProvider.length * 0.55));
}

deleteLoadingAnimation();
        
    });
}

});



