function Loader() {
    this.mapDescriptions;
}

// TODO: make into singleton, and load mapDescr properly (make into json)
// without assigning it as global var in index.html
Loader.prototype.loadData = function() {
    this.mapDescriptions = mapDescriptions;
};

Loader.prototype.loadCheckboxes = function() {
    var groupID = 0;
    var detID = 0;
    var checkboxID = 0;
    for (var detector in this.mapDescriptions) {
        var detPanel =  buildCheckboxPanel("det" + detID, detector, "checkboxPlaceholder");
        $("#checkboxPlaceholder").append(detPanel);

        for (var group in this.mapDescriptions[detector]) {
            var groupPanel = buildCheckboxPanelSub("group" + groupID, group, "det" + detID);
            $("#det" + detID).append(groupPanel);

            for (var elem in this.mapDescriptions[detector][group]) {
                var elem_name = this.mapDescriptions[detector][group][elem].name;
                var elem_res  = this.mapDescriptions[detector][group][elem].resource;

                // build the little icon next to the text based on ext
                var ext = getExtensionFromFilename(elem_res);
                var display_elem;
                switch(ext) {
                    case "png":
                        display_elem = "glyphicon-picture";
                        break;

		    case "jsroot":
		        display_elem = "glyphicon-hand-left";
		        break;

                    case "txt":
                    case "log":
                    case "out":
                        display_elem = "glyphicon-list-alt";
                        break;

                    case "html":
                        display_elem = "glyphicon-tags";
                        break;
                        
                    default:
                        display_elem = "glyphicon-ban-circle";                    
                }



                var elemPanel = "<div class='panel-title checkbox small'>" +
                                "<label><input type='checkbox' id='checkbox" + checkboxID + "' label='"+ elem_name +"' class='panel-extend-checkbox'>" +
                                 elem_name + " " +
                                 "<span class='glyphicon " + display_elem + " displayfiletype'></span>    " +
                                 "</label>" +
                                 "</div>";

                $("#group" + groupID).append(elemPanel);
                checkboxID++;
            }
            groupID++;
        }
        detID++;
    }
};

function loadImagesToImagePlayer(id, resname, startRunPath, endRunPath) {
    // Get List Of Runs to displaya
    var path = startRunPath;
    var start_run_nr = getRunNumberFromString(startRunPath);
    var end_run_nr = getRunNumberFromString(endRunPath);

    $.post('php/loadListNeighbourRuns.php', { dir : path, startRunNumber : start_run_nr, endRunNumber : end_run_nr, resource: resname },
        function(data) {
            var obj = jQuery.parseJSON(data);

            for(var i=0; i<obj.length; ++i){
                // COMMENT ON FIREFOX BEHAVIOUR:
                // EVEN IF ALL IMAGES WILL BE DISPLAYED FROM THE BEGINNING
                // THOSE THAT ARE 'DEEPER' (HIGHER NUMBER) WILL HAVE GLITCHES 
                if(i==0)
                    var newimage ="<img src='" + obj[i] +"' style='display:initial;'>";
                else
                    var newimage ="<img src='" + obj[i] +"' style='display: none;'>";

                $('#timelineContainer'+id).find('#timelineImages').append(newimage);
            }
            var startAt = obj.length>0 ? 1 : 0;
                            
            var newslider= "<input id='slider'  type='text' data-slider-min='0' "+
                                   "data-slider-max='"+(obj.length-1)+"' data-slider-step='1' data-slider-value='0' data-slider-tooltip='hide'/>";

            $('#timelineContainer'+id).find('#sliderGroup').append(newslider);
            $('#timelineContainer'+id).find('#sliderGroup').find('#slider').bootstrapSlider();
            $('#timelineContainer'+id).find('#sliderGroup').find('#progresslabel').append(startAt+"/"+obj.length);
        }
    );
}

// return the the adjacent run (since the numbering is not strictly continuous)
// where direction refers to either previous or next run (-1/+1)
Loader.prototype.loadNeighbourRun = function(id, direction) {
    var path = $('#' + id).val();
    if (path.length == 0) return;
    var curr_run_str = getRunNumberFromString(path);
    var self = this;
    $.post('php/loadNeighbourRun.php', { dir : path, startRunNumber : curr_run_str, direction : direction },
        function(data) {
            $('#' + id).val(data);
            self.reloadCheckedTabs();
        }
    );
}

Loader.prototype.reloadCheckedTabs = function(){
    var activeTabID = $('.extandable-tab-list-ref .active > a').prop('id');
    $("#checkboxPlaceholder input:checked").each(function() {
        var id = $(this).attr("id");
        var refPath = $('#refRunPath').val();
        var currPath = $('#currRunPath').val();
        rmPanel(id,  refPath, currPath);
        addPanel(id, refPath, currPath);
    });
    $('#' + activeTabID).click();
}
