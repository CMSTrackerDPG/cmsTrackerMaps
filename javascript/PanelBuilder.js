function addPanel(id, refPath, currPath){
    var currID = "inputCheckBoxPanel" + id;

    var info = getConfigInfoFromName($('#'+id).attr('label'));
    var filename = info.res;
    var ext = getExtensionFromFilename(filename);

    var layout;
    if(ModeHandler.getMode()==='compare')  {
        switch(ext) {
            case "png":
            case "html":
            case "root":
                layout = buildPanelWithImages(currID);
                break;

            case "txt":
            case "log":
            case "out":
                layout = buildPanelWithText(currID);
                break;

            default:
                console.log("Unsupported filetype");
                return;
        }
        $(".extandable-tab-list-content").append(layout);
        $(".extandable-tab-list-ref").append(buildTab(id, currID));            
        
        addToPanel(currID, refPath, currPath, info);
    }

    if(ModeHandler.getMode()==='timeline') {
        switch(ext) {
            case "png":
                layout = buildTimelinePanel(currID);
                break;

            case "txt":
            case "log":
            case "out":
                console.log('Cannot display timeline for textfiles files (txt/log/out)');
                return;

            default:
                console.log("Unsupported filetype");
                return;
            }

        $(".extandable-tab-list-content").append(layout);
        $(".extandable-tab-list-ref").append(buildTab(id, currID));
        var startRunPath = $('#refRunPath').val();
        var endRunPath = $('#currRunPath').val();
        
        loadImagesToImagePlayer(currID, filename, startRunPath, endRunPath);            
    }    
}

function rmPanel(id, refPath, currPath) {
    var currID = "inputCheckBoxPanel" + id;
    $("#" + currID).remove();
    $("#" + currID + "lnk").remove();
}

function closeTab(panelId) {
    $('#'+panelId).click();
}

// ------------------------------------------------------------------------- //

function addToPanel(id, rsrc, csrc, info) {
    var filename = info.res;
    var ext = getExtensionFromFilename(filename);

    var refsrc  = rsrc + filename;
    var currsrc = csrc + filename;
    switch(ext){
        case "root":
            addRootToPanel(refsrc, currsrc, id);
            break;

        case "png":
            var refFinal  = refsrc;
            var currFinal = currsrc;
            if (filename === "PCLBadComponents_Run_.png") {
                // special snowflake case where filename = PCLBadComponents_Run_XXXXXX.png
                refFinal  = buildFileNameWithRunNr(refsrc, ext);
                currFinal = buildFileNameWithRunNr(currsrc, ext);
            }

            addPngToPanel(refFinal, currFinal, id, info.map);
            break;

        case "txt":
            if (!filename.startsWith("Masked")){//INCOSISTENCIES IN FILE NAMING...
                refsrc  = buildFileNameWithRunNr(refsrc, ext);
                currsrc = buildFileNameWithRunNr(currsrc, ext);
            }
            this.addTextToPanel(refsrc, currsrc, id);
            break;

        case "log":
            addTextToPanel(refsrc, currsrc, id);
            break;

        case "out":
            addTextToPanel(refsrc, currsrc, id);
            break;

        case "html":
            addHtmlToPanel(refsrc, currsrc, id, info.map);
            break;        

        default:
            console.log("Unsupported filetype: " + ext);
    }
}

function addRootToPanel(refFinal, currFinal, id){
    //Rremove useless text to id --> number only
    var nID = id.replace(/^\D+/g, '');

    //Create 3 html objects for the 3 plots
    $('#' + id + ' .refCol').html("<div class='root-plot' id='draw-refRoot_"+nID+"'></div>");
    $('#' + id + ' .currCol').html("<div class='root-plot' id='draw-curRoot_"+nID+"'></div>");
    $('#' + id + ' .diffCol').append("<div class='root-plot-dif' id='draw-difRoot_"+nID+"'></div>");

    //Script to include jsroot (open root files and draw them)
    let scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'module');

    //Script content (START)
    scriptElement.textContent = `

    //Import jsroot v7.4.0
    import { settings } from 'https://root.cern/js/7.4.0/modules/core.mjs';
    settings.Palette = 55; //Rainbow color palette
    import{ openFile, draw } from 'https://root.cern/js/7.4.0/modules/main.mjs';

    //File 1 = reference run
    let file1 = await openFile("${refFinal}");
    let canvas1 = await file1.readObject("MyT");
    let hist1 = await draw('draw-refRoot_${nID}', canvas1, 'colz');

    //File 2 = current run
    let file2 = await openFile("${currFinal}");
    let canvas2 = await file2.readObject("MyT");
    let hist2 = await draw('draw-curRoot_${nID}', canvas2, 'colz');

    //File 3 = difference between reference and current run = (ref - cur)
    let canvas3 = await file2.readObject("MyT");

    var arr1 = canvas1.fPrimitives.arr[1].fBins.arr;
    var arr2 = canvas2.fPrimitives.arr[1].fBins.arr;
    var arr3 = canvas3.fPrimitives.arr[1].fBins.arr;
    var length = arr1.length;

    for (var i = 0; i < length; i++) {
        arr3[i].fContent = arr1[i].fContent - arr2[i].fContent;
    }

    let hist3 = await draw('draw-difRoot_${nID}', canvas3, 'colz');

    //Zooming handled in frame painter now
    let frame2 = hist2.getFramePainter();
    let frame3 = hist3.getFramePainter();

    //Keep old function to be able invoke it again
    frame2.hist1zoomZ = frame2.zoom;
    frame3.hist1zoom = frame3.zoom;

    //Redefine zoom function of TH2 painter to make synchronous zooming of TH1 object
    frame2.zoom = function(xmin,xmax,ymin,ymax) {
        hist1.getFramePainter().zoom(xmin,xmax,ymin,ymax);
        hist3.getFramePainter().zoom(xmin,xmax,ymin,ymax);
        return this.hist1zoomZ(xmin,xmax,ymin,ymax);
    }

    frame3.zoom = function(xmin,xmax,ymin,ymax) {
        hist1.getFramePainter().zoom(xmin,xmax,ymin,ymax);
        return this.hist1zoom(xmin,xmax,ymin,ymax);
    }

    `;
    //Script content (END)

    document.head.appendChild(scriptElement);

    attachWheelZoomListeners('#' + id);
}

function addPngToPanel(refFinal, currFinal, id, emptyMap){
    $('#' + id + ' .refCol').html("<div class='imgContainer'>\
                                           <img class='imgRef' src='"   + refFinal  + "'/>\
                                    </div>");

    $('#' + id + ' .currCol').html("<div class='imgContainer'>\
                                       <img class='imgCurr' src='" + currFinal + "'/>\
                                    </div>");

    $('#' + id + " .diffCol").append("\
                            <div  class='imgContainer '>\
                                <div class='imgDiffWrapper imgDiff' style='background-image: url(\"" + refFinal + "\"),
                                    <div class='cleanRef ' style='background-image: url(\"" + emptyMap + "\")'></div>\
                                </div>\
                            </div>");

    //Activated automatic show of Diff plot --> therefore hide it
    $('#' + id + ' .diffCol').hide();

    attachWheelZoomListeners('#' + id);
}

function addHtmlToPanel(refFinal, currFinal, id, emptyMap){
    // REFERENCE
    $('#' + id + ' .refCol').append("<div class='imgContainer'></div>").find('.imgContainer').load(refFinal, function(){
        refFinalNew = substituteHtmlImgPath(refFinal, $(this));
        $(this).find('img').addClass('imgRef');

        currImg = $(this).find('img').first();

        createAnchorMap(this);
        $(this).find('map').remove();

        // CURRENT
        $('#' + id + ' .currCol').append("<div class='imgContainer'></div>").find('.imgContainer').load(currFinal, function(){
            currFinalNew = substituteHtmlImgPath(currFinal, $(this));
            $(this).find('img').addClass('imgCurr');

            //CANNOT JUST REUSE <MAPCONTAINER> SINCE ITS CONTENT IS LIKELY TO CHANGE WHEN OPENING LINK WITH >= 2 INTERACTIVE VIEW TABS
            var anchorMapClone = $(this).closest(".row").find(".refCol .anchorMap").clone();

            if ($(this).find('map').length)
            {
                if (anchorMapClone.find(".scaledAnchorMap").children().length)
                {
                    anchorMapClone.appendTo($(this));
                }
                else
                {
                    createAnchorMap(this);
                }
                $(this).find('map').remove();
            }
            
            // DIFF
            // SAME ADNOTATION AS FOR <MAPCONTAINER>
            
            refFinalNew = $(this).closest(".row").find(".refCol .imgRef").attr("src");
            currFinalNew = $(this).closest(".row").find(".currCol .imgCurr").attr("src");

            // console.log($(this).closest(".row").find(".currCol"));

            $('#' + id + " .diffCol").append("\
                <div  class='imgContainer '>\
                    <div class='imgDiffWrapper imgDiff' style='background-image: url(\"" + refFinalNew + "\"), url(\"" + currFinalNew + "\")'>\
                        <div class='cleanRef ' style='background-image: url(\"" + emptyMap + "\")'></div>\
                    </div>\
                </div>");

            attachWheelZoomListeners('#' + id);

            $("#" + id + " .toggleDifferenceView").change(function(e) {
                var refCol = $(this).closest(".panel").closest(".row").find(".refCol");
                $(this).closest(".panel").find(".currCol").toggle();
                $(this).closest(".panel").find(".diffCol").toggle().css("height", refCol.height());
            });

            $('#' + id + ' .refCol .imgContainer').resize();
            $('#' + id + ' .currCol .imgContainer').resize();

            $('#' + id + ' .refCol .anchorMap a.neon').tooltip({viewport : '#' + id + ' .refCol .anchorMap',
                                                                container : '#' + id + ' .refCol .imgContainer',
                                                                trigger: "hover click manual focus",
                                                                position: "top auto"});
            $('#' + id + ' .currCol .anchorMap a.neon').tooltip({viewport : '#' + id + ' .currCol .anchorMap',
                                                                container : '#' + id + ' .currCol .imgContainer',
                                                                trigger: "hover click manual focus",
                                                                position: "top auto"});

            // make sure we keep track of changing column size to adjust scale of the overlays
            CreateInteractiveViewImageSizeChangeEventHandling($('#' + id + ' .refCol .imgContainer'));
            CreateInteractiveViewImageSizeChangeEventHandling($('#' + id + ' .currCol .imgContainer'));

        });
    });
}

function substituteHtmlImgPath(thePath, obj){
    currImg = obj.find('img').first();

    thePathSpl = thePath.split('/');
    imgSrc = currImg.attr('src');
    thePathSpl[thePathSpl.length - 1] = imgSrc;

    newPath = "";
    for (i = 1; i < thePathSpl.length; ++i){
        newPath = newPath + "/" + thePathSpl[i];
    }
    currImg.attr('src', newPath);

    // console.log(currImg[0].width);

    return newPath;
}

function addTextToPanel(refsrc, currsrc, id) {
    jQuery.get(refsrc, function(data) {
        $('#ref' + id).val(data);
    });

    jQuery.get(currsrc, function(data) {
        $('#curr' + id).val(data);
    });
}

function createAnchorMap(obj)
{
    mapContainer = $(obj).append("<div class='anchorMap'><div class='scaledAnchorMap'></div></div>").find('.scaledAnchorMap');
        
    $(obj).find('area').each(function(idx){
        c = $(this).attr("coords");
        t = $(this).attr("title").trim();
        tSmall = t.split(" ").join("");

        xy = c.split(",");

        for (i = 0; i < xy.length; ++i) {
            xy[i] = Number(xy[i]);
        }

        w = xy[2] - xy[0];
        h = xy[3] - xy[1];

        anchor = $("<a class='neon' href='#' title='" + t + "' data-original-title='" + t + "' data-toggle='tooltip' id='" + tSmall + "'></a>").css({"left" : xy[0], "top" : xy[1], "width" : w, "height" : h});
        mapContainer.append(anchor);
    });
}
