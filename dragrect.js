// viewport
var w = 1450,
    h = 700,
    r = 120;

var isXChecked = true,
    isYChecked = false;

// data driven
var data = [
    {
        xStart: 200,
        xEnd: 530,
        yStart: 20,
        yEnd: 50,
        brXStart: 150,
        brXEnd: 600,
        brYStart: 15,
        brYEnd: 55,
        
        // back rectangle cannot be dragged past obstacle rectangle
        obsXStart: 290,
        obsXEnd: 330,
        obsYStart: 15,
        obsYEnd: 55
    }
]

/**
 * Drag objects
 */
// back reactangle (rectangle with lower z-index)
var brwidth = 450,
    brheight = 40,
    brdragbarw = 10;

var brdrag = d3.drag()
    .subject(Object)
    .on("drag", brdragmove);

var brdragright = d3.drag()
    .subject(Object)
    .on("drag", brrdragresize);

var brdragleft = d3.drag()
    .subject(Object)
    .on("drag", brldragresize);


// rectangle (rectangle with higher z-index) a.k.a.
// rectangle in front overlaying the back rectangle.
var width = 300,
    height = 30,
    dragbarw = 10;

var drag = d3.drag()
    .subject(Object)
    .on("drag", dragmove);

var dragright = d3.drag()
    .subject(Object)
    .on("drag", rdragresize);

var dragleft = d3.drag()
    .subject(Object)
    .on("drag", ldragresize);

var dragtop = d3.drag()
    .subject(Object)
    .on("drag", tdragresize);

var dragbottom = d3.drag()
    .subject(Object)
    .on("drag", bdragresize);

/**
 * SVG shapes
 */
// tooltip
var tooltipDiv = d3.select("body").append("div")
    .attr("id", "brltooltip")
    .attr("class", "tooltip")
    .style("left", function(d) { return (data[0].brXStart) + "px";})
    .style("opacity", 0);

var ltooltip = d3.select("body").append("div")
    .attr("id", "ltooltip")
    .attr("class", "tooltip")
    .style("left", function(d) { return (data[0].xStart) + "px";})
    .style("opacity", 0);

var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h)

var brg = svg.append("g")
    .data([{x: width / 2, y: height / 2}]);

var newg = svg.append("g")
      .data([{x: ((width/2) + (brwidth - width)/2), y: (height/2) + (brheight - height)/2}]);

var staticg = svg.append("g")
      .data([{x: data[0].obsXStart, y: data[0].obsYStart}]);

// obstacle rectangle
var obsrect = staticg.append("rect")
    .attr("id", "obsRect")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("height", data[0].obsYEnd - data[0].obsYStart)
    .attr("width", data[0].obsXEnd - data[0].obsXStart)
    .attr("fill", "red")
    .attr("fill-opacity", .9)

// back rectangle
var brdragrect = brg.append("rect")
    .attr("id", "backRect")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("height", brheight)
    .attr("width", brwidth)
    .attr("fill", "orange")
    .attr("fill-opacity", .8)
    .attr("cursor", "move")
    .call(brdrag);

var brdragbarright = brg.append("rect")
      .attr("x", function(d) { return d.x + brwidth - (brdragbarw / 2); })
      .attr("y", function(d) { return d.y + (dragbarw/2); })
      .attr("id", "brdragright")
      .attr("height", brheight - brdragbarw)
      .attr("width", brdragbarw)
      .attr("fill", "blue")
      .attr("fill-opacity", .8)
      .attr("cursor", "ew-resize")
      .call(brdragright);

var brdragbarleft = brg.append("rect")
        .attr("x", function(d) { return d.x - (brdragbarw / 2); })
        .attr("y", function(d) { return d.y + (dragbarw/2); })
        .attr("id", "brdragright")
        .attr("height", brheight - brdragbarw)
        .attr("width", brdragbarw)
        .attr("fill", "blue")
        .attr("fill-opacity", .8)
        .attr("cursor", "ew-resize")
        .call(brdragleft)
        .on("mouseover", function(d) {  // tooltip
            tooltipDiv.transition()
                .duration(200)
                .style("opacity", .9);
              
            d3.select("#brltooltip")        
                .html(data[0].brXStart);
        })
        .on("mouseout", function(d) {
            tooltipDiv.transition()
                .duration(500)
                .style("opacity", 0);
        });

// rectangle
var dragrect = newg.append("rect")
      .attr("id", "active")
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("height", height)
      .attr("width", width)
      .attr("fill", "seagreen")
      .attr("fill-opacity", 0.8)
      .attr("cursor", "move")
      .call(drag);

var dragbarleft = newg.append("rect")
        .attr("x", function(d) { return d.x - (dragbarw/2); })
        .attr("y", function(d) { return d.y + (dragbarw/2); })
        .attr("height", height - dragbarw)
        .attr("id", "dragleft")
        .attr("width", dragbarw)
        .attr("fill", "purple")
        .attr("fill-opacity", .8)
        .attr("cursor", "ew-resize")
        .call(dragleft)
        .on("mouseover", function(d) {  // tooltip
            ltooltip.transition()
                .duration(200)
                .style("opacity", .9);
            
            d3.select("#ltooltip")        
                .html(data[0].xStart);
        })
        .on("mouseout", function(d) {
            ltooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

var dragbarright = newg.append("rect")
      .attr("x", function(d) { return d.x + width - (dragbarw/2); })
      .attr("y", function(d) { return d.y + (dragbarw/2); })
      .attr("id", "dragright")
      .attr("height", height - dragbarw)
      .attr("width", dragbarw)
      .attr("fill", "purple")
      .attr("fill-opacity", .8)
      .attr("cursor", "ew-resize")
      .call(dragright);


var dragbartop = newg.append("rect")
      .attr("x", function(d) { return d.x + (dragbarw/2); })
      .attr("y", function(d) { return d.y - (dragbarw/2); })
      .attr("height", dragbarw)
      .attr("id", "dragleft")
      .attr("width", width - dragbarw)
      .attr("fill", "lightgreen")
      .attr("fill-opacity", .0)
      .attr("cursor", "ns-resize")
      .call(dragtop);

var dragbarbottom = newg.append("rect")
      .attr("x", function(d) { return d.x + (dragbarw/2); })
      .attr("y", function(d) { return d.y + height - (dragbarw/2); })
      .attr("id", "dragright")
      .attr("height", dragbarw)
      .attr("width", width - dragbarw)
      .attr("fill", "lightgreen")
      .attr("fill-opacity", .0)
      .attr("cursor", "ns-resize")
      .call(dragbottom);

/**
 * drag behaviours
 */
function hasCollidedWithObstacle(oldx, currentDragXPos) {
    var stopDrag = false;
    var isCursorLeftOfObstable = oldx <= data[0].obsXStart;
    var isCursorRightOfObstable = oldx >= data[0].obsXEnd;
    
    if(isCursorLeftOfObstable && currentDragXPos >= data[0].obsXStart) {
        return stopDrag = true;
    }
    
    if(isCursorRightOfObstable && currentDragXPos <= data[0].obsXEnd) {
        return stopDrag = true;
    }
    return stopDrag;
}

// back rectangle
function brdragmove(d) {
      brdragrect
          .attr("x", d.x = Math.max(0, Math.min(w - brwidth, d3.event.x)));
    
      brdragbarleft
          .attr("x", function(d) { return d.x - (brdragbarw / 2); })
    
      brdragbarright
          .attr("x", function(d) { return d.x + brwidth - (brdragbarw / 2); })
}

function brldragresize(d) {
    var oldx = d.x;
    
    if(hasCollidedWithObstacle(oldx, d3.event.x)) {
        return;
    }    
    
    //Max x on the right is x + width - dragbarw
    //Max x on the left is 0 - (dragbarw/2)
    d.x = Math.max(0, Math.min(d.x + brwidth - (brdragbarw / 2), d3.event.x)); 
    
    brwidth = brwidth + (oldx - d.x);

    brdragbarleft
        .attr("x", function(d) { return d.x - (brdragbarw / 2); });

    brdragrect
        .attr("x", function(d) { return d.x; })
        .attr("width", brwidth);
    

    d3.select("#brltooltip")
        .html(d.x)
        .style("left", (d3.event.x) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");	
}

function brrdragresize(d) {
    //Max x on the left is x - width 
    //Max x on the right is width of screen + (dragbarw/2)
    var dragx = Math.max(d.x + (brdragbarw/2), Math.min(w, d.x + brwidth + d3.event.dx));

    //recalculate width
    brwidth = dragx - d.x;

    //move the right drag handle
    brdragbarright
        .attr("x", function(d) { return dragx - (brdragbarw / 2) });

    //resize the drag rectangle
    //as we are only resizing from the right, the x coordinate does not need to change
    brdragrect
        .attr("width", brwidth);    
}

// rectangle
function dragmove(d) {
  if (isXChecked) {
      dragrect
          .attr("x", d.x = Math.max(0, Math.min(w - width, d3.event.x)))
      dragbarleft 
          .attr("x", function(d) { return d.x - (dragbarw/2); })
      dragbarright 
          .attr("x", function(d) { return d.x + width - (dragbarw/2); })
      dragbartop 
          .attr("x", function(d) { return d.x + (dragbarw/2); })
      dragbarbottom 
          .attr("x", function(d) { return d.x + (dragbarw/2); })          
  }
  if (isYChecked) {
      dragrect
          .attr("y", d.y = Math.max(0, Math.min(h - height, d3.event.y)));
      dragbarleft 
          .attr("y", function(d) { return d.y + (dragbarw/2); });
      dragbarright 
          .attr("y", function(d) { return d.y + (dragbarw/2); });
      dragbartop 
          .attr("y", function(d) { return d.y - (dragbarw/2); });
      dragbarbottom 
          .attr("y", function(d) { return d.y + height - (dragbarw/2); });
  }
}

function ldragresize(d) {   
    var oldx = d.x; 

    if(hasCollidedWithObstacle(oldx, d3.event.x)) {
        return;
    }    

    //Max x on the right is x + width - dragbarw
    //Max x on the left is 0 - (dragbarw/2)
    d.x = Math.max(0, Math.min(d.x + width - (dragbarw / 2), d3.event.x)); 
    width = width + (oldx - d.x);
    
    dragbarleft
        .attr("x", function(d) { return d.x - (dragbarw / 2); });

    dragrect
        .attr("x", function(d) { return d.x; })
        .attr("width", width);

    dragbartop 
        .attr("x", function(d) { return d.x + (dragbarw/2); })
        .attr("width", width - dragbarw)
    
    dragbarbottom 
        .attr("x", function(d) { return d.x + (dragbarw/2); })
        .attr("width", width - dragbarw)
    
    d3.select("#ltooltip")
        .html(d.x)
        .style("left", (d3.event.x) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");        
}

function rdragresize(d) {
    //Max x on the left is x - width 
    //Max x on the right is width of screen + (dragbarw/2)
    var dragx = Math.max(d.x + (dragbarw/2), Math.min(w, d.x + width + d3.event.dx));

    //recalculate width
    width = dragx - d.x;

    //move the right drag handle
    dragbarright
        .attr("x", function(d) { return dragx - (dragbarw/2) });

    //resize the drag rectangle
    //as we are only resizing from the right, the x coordinate does not need to change
    dragrect
        .attr("width", width);
    dragbartop 
        .attr("width", width - dragbarw)
    dragbarbottom 
        .attr("width", width - dragbarw)
}

function tdragresize(d) {
 
   if (isYChecked) {
      var oldy = d.y; 
     //Max x on the right is x + width - dragbarw
     //Max x on the left is 0 - (dragbarw/2)
      d.y = Math.max(0, Math.min(d.y + height - (dragbarw / 2), d3.event.y)); 
      height = height + (oldy - d.y);
      dragbartop
        .attr("y", function(d) { return d.y - (dragbarw / 2); });
       
      dragrect
        .attr("y", function(d) { return d.y; })
        .attr("height", height);

      dragbarleft 
        .attr("y", function(d) { return d.y + (dragbarw/2); })
        .attr("height", height - dragbarw);
      dragbarright 
        .attr("y", function(d) { return d.y + (dragbarw/2); })
        .attr("height", height - dragbarw);
  }
}

function bdragresize(d) {
   if (isYChecked) {
     //Max x on the left is x - width 
     //Max x on the right is width of screen + (dragbarw/2)
     var dragy = Math.max(d.y + (dragbarw/2), Math.min(h, d.y + height + d3.event.dy));

     //recalculate width
     height = dragy - d.y;

     //move the right drag handle
     dragbarbottom
        .attr("y", function(d) { return dragy - (dragbarw/2) });

     //resize the drag rectangle
     //as we are only resizing from the right, the x coordinate does not need to change
     dragrect
        .attr("height", height);
     dragbarleft 
        .attr("height", height - dragbarw);
     dragbarright 
        .attr("height", height - dragbarw);
  }
}