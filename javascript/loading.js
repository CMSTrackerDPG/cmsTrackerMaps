$(document).ready(function() {

    loadCheckboxes();
    decodeOptions();

    $(".panel-extend-checkbox").on('click', function(e) {

        var refPath = $('#refRunNumberInput').val();
        var currPath = $('#currRunNumberInput').val();

        AddRmTkMapPanel(this.id, $(this).prop('checked'), refPath, currPath);
        console.log($(this).parent().text());
    });

    $("#link-me").click(function(e) {
        var url = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.location.href = url + encodeOptions();

        alert('Link created, ready to share your findings!\n');
    });

    //FIXME: this ugliness ... ew
    var firstclick = true;
    $("#diff-me").click(function(e) {
                if (firstclick) {
                    var d1 = $('.imgRef').prop('src');
                    var d2 = $('.imgCurr').prop('src');

                    console.log('image1: ' + d1);
                    console.log('image2: ' + d2);

                    $('.refCol').html("");
                    $('.currCol').html("");
                    $('.refCol').html("<div class='imgContainer'><div class='diffimg' >\
            <img class='diffimg' src='" + d1 + "'/>\
            <img class='diffimg' src='" + d2 + "'/> </div></div>");
                    firstclick = false;
                } else {
                    location.reload();
                }
    });


    $("#refRunNumberInputBrowse, #currRunNumberInputBrowse").click(function() {
        $("#runNumberInputBrowseCaller").val($(this).attr('data-ref'));
        $("#myModal").modal();
    });

    $("#dataBrowseOKbtn").click(function() {
        var pathToPaste = $("#runNumberInputBrowseCaller").attr("data-path");
        var inputObj = $("#" + $("#runNumberInputBrowseCaller").val());

        inputObj.val(pathToPaste);

        var activeTabID = $('.extandable-tab-list-ref .active > a').prop('id');

        $("#checkboxAccordion input:checked").each(function() {
            var id = $(this).attr("id");

            var refPath = $('#refRunNumberInput').val();
            var currPath = $('#currRunNumberInput').val();

            AddRmTkMapPanel(id, false, refPath, currPath);
            AddRmTkMapPanel(id, true, refPath, currPath);
        });

        $('#' + activeTabID).click();

        disableCheckboxes("checkboxAccordion", false);
    });

    $('#treeContainer').fileTree({
        root: '/data/users/event_display/',
        multiFolder: false
    }, function(file) {
        $("#runNumberInputBrowseCaller").attr("data-path", file.split("users")[1]);
    });

    if($('#refRunNumberInput').val() === "") {
        disableCheckboxes("checkboxAccordion", true);
    }
});