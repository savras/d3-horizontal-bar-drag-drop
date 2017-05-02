$('#xChecked').click(function() {
    isXChecked = !isXChecked;
     dragbarleft 
        .attr("fill-opacity", (isXChecked ? 0.5 : 0))
        .attr("cursor", (isXChecked ? "ew-resize" : "move"));
     dragbarright 
        .attr("fill-opacity", (isXChecked ? 0.5 : 0))
        .attr("cursor", (isXChecked ? "ew-resize" : "move"));
});

$('#yChecked').click(function() {
    isYChecked = !isYChecked;
     dragbartop 
        .attr("fill-opacity", (isYChecked ? 0.5 : 0))
        .attr("cursor", (isYChecked ? "ns-resize" : "move"));
     dragbarbottom 
        .attr("fill-opacity", (isYChecked ? 0.5 : 0))
        .attr("cursor", (isYChecked ? "ns-resize" : "move"));
});