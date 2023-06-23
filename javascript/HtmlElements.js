function buildCheckboxPanel(id, displayname, dataParent) { 
    return  "<div class='panel'>" +
                    "<a class='btn btn-primary btn-block detectorleveltree' data-toggle='collapse' data-parent='#" + dataParent + "' href='#"+id+"'>"+
                    "<span class='glyphicon glyphicon-triangle-right'></span> "+ displayname+"</a>" +
                "<div id='" + id + "' class='panel-collapse collapse panel-group'></div>" +
            "</div>";
}

function buildCheckboxPanelSub(id, displayname, dataParent) { 
    return  "<div class='panel'>" +
                    "<a class='btn btn-light btn-block moduleleveltree' data-toggle='collapse' data-parent='#" + dataParent + "' href='#"+id+"'>" + 
                        "<span class='glyphicon glyphicon-menu-right'></span>    " +
                        displayname +
                    "</a>" +
                "<div id='" + id + "' class='panel-collapse collapse'></div>" +
            "</div>";
}

function buildTimelinePanel(id) {
    return "<div id='" + id + "' class='tab-pane fade extandable-tab-list-element'>" +
                      "<div class='timelineContainer' id='timelineContainer" + id + "'>" + 

                          "<div id='timelineImages'>" + 
                          "</div>"+

                          "<div id='timelineControls'>" + 
                                "<button type='button' class='btn btn-link playbutton' isplaying='false' currentframe='0' title='Play/Pause/Repeat'><span class='glyphicon glyphicon-play'></span></button>" + 
                                "<div id='sliderGroup'><label id='progresslabel' class='label' title='Progress'> </label></div>" +

                                "<div class='dropup'>" +
                                "  <button class='btn btn-link dropdown-toggle' type='button' data-toggle='dropdown' title='Options'>" +
                                "  <span class='glyphicon glyphicon-cog'></span></button>" +
                                "  <ul class='dropdown-menu' id='timelineSettings'>" +
                                "   <li>" + 
                                "    <div class='col-md-8'>Enable looping</div>" + 
                                "    <div class='col-md-4'><input class='form-control' id='loopingEnabled' type='checkbox'/></div>" + 
                                "   </li>" +
                                "   <li>" + 
                                "     <div class='col-md-8'>Playback TkMPS</div>" + 
                                "     <div class='col-md-4'><input class='form-control' id='fpssetting' type='number' value='3' min='1' max='25'/></div>" + 
                                "   </li>" +
                                // Maybe for later if mp4 is really needed
                                // "   <li>" + 
                                // "     <div class='col-md-8'>Download as</div>" + 
                                // "     <div class='btn-group btn-group-xs downloadFormatSetting' role='group' style='float:right;'>" +
                                // "        <button type='button' class='btn btn-primary' downloadAs='gif'> gif </button>" +
                                // "        <button type='button' class='btn' downloadAs='mp4'> mp4 </button>" +
                                // "     </div>" +
                                // "   </li>" +
                                "  </ul>" +
                                "</div>" + 

                                "<button type='button' class='btn btn-link' id='downloadAsFile' title='Download slideshow as gif'><span class='glyphicon glyphicon-save'></span></button>" +                                 
                                "<button type='button' class='btn btn-link fullscreenSwitch' title='Toggle Fullscreen Mode'><span class='glyphicon glyphicon-resize-full'></span></button>" + 
                       
                          "</div>" + 
                      "</div>"+
            "</div>";
}

function buildPanelWithImages(id) {
    return "<div id='" + id + "' class='tab-pane fade extandable-tab-list-element active in'>" +
            // "<div class='row'>" + 
                "<div class='viewType'>" +
                    "<div style='text-align: center;'>"+
                        "<div><label style='margin-bottom:-10;'>Difference Mode</label></div>"+
                        "<div class='btn-group btn-group-sm' role='group' id='diffButtonGroup'>" +
                            "<button type='button' class='btn btn-primary disableDiffImg' toToggle='toggle"+id+"'> Disabled </button>" +
                            "<button type='button' class='btn enableDiffImg' toToggle='toggle"+id+"'> Enabled </button>" +
                        "</div>" +
                    "</div>" +
                "</div>" +

                "<div class='row'>" +
                    "<div class='col-md-6'>" +
                        "<div class='panel panel-default'>" +
                            "<div class='panel-heading'>" +
                                "Reference" +
                            "</div>" +
                            "<div class='panel-body refCol'></div>" +
                        "</div>"+
                    "</div>" +
                    "<div class='col-md-6'>" +
                        "<div class='panel panel-default'>" +
                            "<div class='panel-heading' style='display: inherit;'>" +
                                "Current" +
                            "</div>" +
                            "<div class='panel-body currCol'></div>" +
                            "<div class='panel-body diffCol'></div>" +
                        "</div>"+
                    "</div>" +
                "</div>" +

            "</div>";
}

function buildPanelWithText(id) {
    return "<div id='" + id + "' class='tab-pane fade extandable-tab-list-element'>" +
            
            "<div class='row'>" + 
            "<label style='margin-bottom:-10px;'>Difference Mode</label>"+

                "<div class='viewType'>" +
                  "<div style='text-align: center;'>"+
                        "<div class='btn-group btn-group-sm' role='group' id='diffButtonGroup'>" +
                            "<button type='button' id='noneDiffButton'   class='btn btn-primary' onclick='hideDiff(\"true\",\""+id+"\");'> Disabled </button>" +
                            "<button type='button' id='sideDiffButton'   class='btn' onclick='diffUsingJS(0,\""+id+"\");'> Side by Side</button>" +
                            "<button type='button' id='inlineDiffButton' class='btn' onclick='diffUsingJS(1,\""+id+"\");'> Combined Inline</button>" +
                        "</div>" +
                    "</div>" +
                "</div>" +

            "<div class='row' id='rawtext"+id+"'>" +
                "<div class='col-md-6'>" +
                    "<div class='panel panel-default'>" +
                        "<div class='panel-heading'>" +
                                   "Reference " +
                        "</div>" +
                        "<div class='panel-body'>" +  
                            "<textarea id='ref"+id+"' readonly></textarea>" +
                        "</div>" +
                    "</div>"+
                "</div>" +

                "<div class='col-md-6'>" +
                    "<div class='panel panel-default'>" +
                        "<div class='panel-heading'>" +

                                "Current " +
                        "</div>" +
                        "<div class='panel-body'>" +  
                            "<textarea id='curr"+id+"' readonly></textarea>" +
                        "</div>" +
                    "</div>"+
                "</div>" +

            "</div>" +
            "<div class='row'>" + 
                "<div id='diff"+id+"'> </div>" +
            "</div>" + 

            "</div>";
}

function buildTab(id,currID) {
    return "<li><a class='tab-pane' data-toggle='tab' href='#" + currID + "' id='" + currID + "lnk'>" + 
            "<button class='close closeTab' toClose='"+id+"' type='button'>X</button>" + $('#' + id).attr('label')+
            "</a></li>";
}
