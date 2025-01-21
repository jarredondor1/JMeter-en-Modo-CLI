/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.79937452056411, "KoPercent": 0.20062547943588835};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4241163627780728, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5042140750105352, 500, 1500, "Visitar Sin miedo a nada"], "isController": false}, {"data": [0.37272350993377484, 500, 1500, "Visitar Actualidad"], "isController": false}, {"data": [0.7223592272914098, 500, 1500, "Visitar Comunidad-0"], "isController": false}, {"data": [0.3487464036169338, 500, 1500, "Visitar Comunidad-1"], "isController": false}, {"data": [0.4377281947261663, 500, 1500, "Visitar Portada"], "isController": false}, {"data": [0.28741638795986624, 500, 1500, "Visitar Páginas Nuevas"], "isController": false}, {"data": [0.2948665297741273, 500, 1500, "Visitar Comunidad"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 16947, 34, 0.20062547943588835, 1929.7783678527196, 81, 51733, 1005.0, 4413.200000000001, 6518.19999999999, 13941.600000000013, 6.708826935067249, 903.1170547440199, 1.3933613814168226], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Visitar Sin miedo a nada", 2373, 6, 0.2528445006321112, 1500.7707543194274, 120, 27160, 705.0, 3045.0, 4715.69999999999, 12153.65999999999, 0.946462074510855, 84.02259451670707, 0.18346653363649634], "isController": false}, {"data": ["Visitar Actualidad", 2416, 3, 0.12417218543046357, 2009.9184602649011, 149, 24699, 951.5, 4521.700000000002, 7066.950000000003, 13114.069999999976, 0.9612985806919838, 163.29909382203027, 0.18752049125699738], "isController": false}, {"data": ["Visitar Comunidad-0", 2433, 0, 0.0, 728.3419646526922, 81, 10056, 205.0, 2006.7999999999997, 2512.299999999997, 5305.159999999996, 0.9700214337658362, 1.3339749247166883, 0.19135188439521375], "isController": false}, {"data": ["Visitar Comunidad-1", 2433, 5, 0.20550760378133992, 2171.7073571722144, 171, 36286, 1011.0, 4825.5999999999985, 7191.499999999996, 14891.679999999942, 0.963668928826336, 186.13818645877313, 0.1305417028422094], "isController": false}, {"data": ["Visitar Portada", 2465, 7, 0.2839756592292089, 1770.829614604465, 116, 34422, 821.0, 3886.600000000001, 5831.999999999993, 12877.160000000047, 0.9810914034900585, 121.09469449326133, 0.1910752622479212], "isController": false}, {"data": ["Visitar Páginas Nuevas", 2392, 6, 0.2508361204013378, 2424.042642140467, 514, 51733, 1330.0, 4683.700000000001, 7071.199999999999, 15235.27000000001, 0.9531718466827866, 163.14615360591444, 0.19498437397888677], "isController": false}, {"data": ["Visitar Comunidad", 2435, 7, 0.2874743326488706, 2902.438193018486, 274, 40859, 1277.0, 6685.4, 9219.799999999992, 17956.47999999998, 0.9644041784246745, 187.45482333593247, 0.32062153448190506], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 34, 100.0, 0.20062547943588835], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 16947, 34, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 34, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Visitar Sin miedo a nada", 2373, 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Visitar Actualidad", 2416, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Visitar Comunidad-1", 2433, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Visitar Portada", 2465, 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Visitar Páginas Nuevas", 2392, 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Visitar Comunidad", 2435, 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
