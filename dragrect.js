// viewport
var w = 750,
    h = 150,
    r = 120;

// back reactangle (rectangle with lower z-index)
var brwidth = 450,
    brheight = 40,
    brdragbarw = 10;

// rectangle (rectangle with higher z-index) a.k.a.
// rectangle in front overlaying the back rectangle.
var width = 300,
    height = 30,
    dragbarw = 10;

// data driven thus:
var data = [
    {   
        text: "One", 
        data: {
            xStart: 200,
            xEnd: 530,
            yStart: 20,
            yEnd: 50,
            x: width/2 + (brwidth - width)/2,
            y: height/2 + (brheight - height)/2,
            brX: width / 2, 
            brY: height / 2,
            brXStart: 150,
            brXEnd: 600,
            brYStart: 15,
            brYEnd: 55,

            // drag handles cannot be horizontally dragged past obstacle rectangle
            obsX: 290,
            obsY: 15,
            obsXStart: 290,
            obsXEnd: 330,
            obsYStart: 15,
            obsYEnd: 55
        }
    },
    {   
        text: "two",
        data: {            
            xStart: 200,
            xEnd: 530,
            yStart: 20,
            yEnd: 50,
            x: width/2 + (brwidth - width)/2,
            y: height/2 + (brheight - height)/2,
            brX: width / 2, 
            brY: height / 2,
            brXStart: 150,
            brXEnd: 650,
            brYStart: 15,
            brYEnd: 55,
            obsX: 390,
            obsY: 15,
            obsXStart: 390,
            obsXEnd: 430,
            obsYStart: 15,
            obsYEnd: 55
        }
    }
]

// table - http://stackoverflow.com/questions/33856687/append-an-svg-element-to-html-table-cell-using-d3-js
var table = d3.select("body")
    .append("table")
    .attr("id", "table");

var thead = table.append("thead").append("tr");
thead.selectAll("th")
    .data(data)
    .enter()
    .append("th")
    .text(function(d) {
        return d.text;
    });

var tbody = table.append("tbody");
var trows = tbody.selectAll("tr")
    .data(data)
    .enter()
    .append("tr");

trows.selectAll("td")
    .data(function(d) {
        return [d.text, d.data];
    })
    .enter()
    .append("td")
    .append(function(d, i) {
        if(i === 0) {
            return createCheckbox(d).node();
        } else {
            return createSvg(d).node();
        }
    });

// end table

function createCheckbox(d) {
    var checkbox = d3.select("body").append("input")
        .attr("type", "checkbox")
        .remove();
    
    return checkbox;
}

function createSvg(d) {
    /**
     * Drag objects
     */
    var brdrag = d3.drag()
        .subject(Object)    // short hand for function(d) { return d; }
        .on("drag", brdragmove);

    var brdragright = d3.drag()
        .subject(Object)
        .on("drag", brrdragresize);

    var brdragleft = d3.drag()
        .subject(Object)
        .on("drag", brldragresize);

    var drag = d3.drag()
        .subject(Object)    // short hand for function(d) { return d; }
        .on("drag", dragmove);

    var dragright = d3.drag()
        .subject(Object)
        .on("drag", rdragresize);

    var dragleft = d3.drag()
        .subject(Object)
        .on("drag", ldragresize);

//    var dragtop = d3.drag()
//        .subject(Object)
//        .on("drag", tdragresize);
//
//    var dragbottom = d3.drag()
//        .subject(Object)
//        .on("drag", bdragresize);
    
    /**
     * SVG shapes
     */
    // svg
    var svg = d3.select("body").append("svg")
        .attr("width", w)
        .attr("height", h)      
        .remove();
   
    svg.append("defs") // texture fill - http://stackoverflow.com/questions/17776641/fill-rect-with-pattern?rq=1
        .append("pattern")
            .attr("id", "diagonalPatterns")
            .attr("patternUnits", "userSpaceOnUse")
            .attr("width", 4)
            .attr("height", 4)
        .append("path")
            .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
            .attr('stroke', '#000000')
            .attr('stroke-width', 1);
   
    var newg = svg.append("g");
    
    // tooltip
    var tooltipDiv = d3.select("body").append("div")
        .data({
            brXStart: d.brXStart,
        })
        .attr("id", "brltooltip")
        .attr("class", "tooltip")
        .style("left", function(d) { return d.brXStart + "px";})
        .style("opacity", 0);

    var ltooltip = d3.select("body").append("div")
        .data({
            xStart: d.xStart
        })
        .attr("id", "ltooltip")
        .attr("class", "tooltip")
        .style("left", d.xStart + "px")
        .style("opacity", 0);
    
    // bar underneadth the back rectangle
    var brunderbar = newg.append("rect")    
        .attr("id", "brunderbar")
        .attr("x", d.brX)
        .attr("y", d.brY + d.obsYEnd - d.obsYStart)
        .attr("height", 5)
        .attr("width", d.brXEnd - d.brXStart)
        .attr("fill", "url(#diagonalPatterns)");

    // back rectangle
    var brdragrect = newg.append("rect")
        .attr("id", "backRect")
        .attr("x", d.brX)
        .attr("y", d.brY)
        .attr("height", brheight)
        .attr("width", d.brXEnd - d.brXStart)
        .attr("fill", "orange")
        .attr("fill-opacity", .8)
        .attr("cursor", "move")
        .call(brdrag);

    var brdragbarright = newg.append("rect")
          .attr("x", d.brX + d.brXEnd - d.brXStart - (brdragbarw / 2))
          .attr("y", d.brY + (brdragbarw/2))
          .attr("id", "brdragright")
          .attr("height", brheight - brdragbarw)
          .attr("width", brdragbarw)
          .attr("fill", "blue")
          .attr("fill-opacity", .8)
          .attr("cursor", "ew-resize")
          .call(brdragright);

    var brdragbarleft = newg.append("rect")
            .attr("x", d.brX - (brdragbarw / 2))
            .attr("y", d.brY + (dragbarw/2))
            .attr("id", "brdragright")
            .attr("height", brheight - brdragbarw)
            .attr("width", brdragbarw)
            .attr("fill", "blue")
            .attr("fill-opacity", .8)
            .attr("cursor", "ew-resize")
            .call(brdragleft)
            .on("mouseover", function() {  // tooltip
                tooltipDiv.transition()
                    .duration(200)
                    .style("opacity", .9);

                d3.select("#brltooltip")        
                    .html(d.brXStart);
            })
            .on("mouseout", function() {
                tooltipDiv.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

    // rectangle
    var dragrect = newg.append("rect")
          .attr("id", "active")
          .attr("x", d.x)
          .attr("y", d.y)
          .attr("height", height)
          .attr("width", width)
          .attr("fill", "seagreen")
          .attr("fill-opacity", 0.8)
          .attr("cursor", "move")
          .call(drag);

    var dragbarleft = newg.append("rect")
            .attr("x", d.x - (dragbarw/2))
            .attr("y", d.y + (dragbarw/2))
            .attr("height", height - dragbarw)
            .attr("id", "dragleft")
            .attr("width", dragbarw)
            .attr("fill", "purple")
            .attr("fill-opacity", .8)
            .attr("cursor", "ew-resize")
            .call(dragleft)
            .on("mouseover", function() {  // tooltip
                ltooltip.transition()
                    .duration(200)
                    .style("opacity", .9);

                d3.select("#ltooltip")        
                    .html(d.xStart);
            })
            .on("mouseout", function() {
                ltooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

    var dragbarright = newg.append("rect")
          .attr("x", d.x + width - (dragbarw/2))
          .attr("y", d.y + (dragbarw/2))
          .attr("id", "dragright")
          .attr("height", height - dragbarw)
          .attr("width", dragbarw)
          .attr("fill", "purple")
          .attr("fill-opacity", .8)
          .attr("cursor", "ew-resize")
          .call(dragright);


//    var dragbartop = newg.append("rect")
//          .attr("x", function(d) { return d.x + (dragbarw/2); })
//          .attr("y", function(d) { return d.y - (dragbarw/2); })
//          .attr("height", dragbarw)
//          .attr("id", "dragleft")
//          .attr("width", width - dragbarw)
//          .attr("fill", "lightgreen")
//          .attr("fill-opacity", .0)
//          .attr("cursor", "ns-resize")
//          .call(dragtop);
//
//    var dragbarbottom = newg.append("rect")
//          .attr("x", function(d) { return d.x + (dragbarw/2); })
//          .attr("y", function(d) { return d.y + height - (dragbarw/2); })
//          .attr("id", "dragright")
//          .attr("height", dragbarw)
//          .attr("width", width - dragbarw)
//          .attr("fill", "lightgreen")
//          .attr("fill-opacity", .0)
//          .attr("cursor", "ns-resize")
//          .call(dragbottom);

    // obstacle rectangle
    var obsrect = newg.append("rect")
        .attr("id", "obsRect")
        .attr("x", d.obsX)
        .attr("y", d.obsY)
        .attr("height", d.obsYEnd - d.obsYStart)
        .attr("width", d.obsXEnd - d.obsXStart)
        .attr("fill", "red")
        .attr("fill-opacity", .9)

    return svg;
    
    /**
     * drag behaviours
     */
    function hasCollidedWithObstacle(oldx, currentDragXPos) {
        var stopDrag = false;
        var isCursorLeftOfObstable = oldx <= d.obsXStart;
        var isCursorRightOfObstable = oldx >= d.obsXEnd;

        if(isCursorLeftOfObstable && currentDragXPos >= d.obsXStart) {
            return stopDrag = true;
        }

        if(isCursorRightOfObstable && currentDragXPos <= d.obsXEnd) {
            return stopDrag = true;
        }
        return stopDrag;
    }

    // back rectangle
    function brdragmove() {
        return;
//          brdragrect
//              .attr("x", d.x = Math.max(0, Math.min(w - brwidth, d3.event.x)));
//
//          brdragbarleft
//              .attr("x", function(d) { return d.x - (brdragbarw / 2); })
//
//          brdragbarright
//              .attr("x", function(d) { return d.x + brwidth - (brdragbarw / 2); })
    }

    function brldragresize() {
        var oldx = d.brX;

        if(hasCollidedWithObstacle(oldx, d3.event.x)) {
            return;
        }    

        //Max x on the right is x + width - dragbarw
        //Max x on the left is 0 - (dragbarw/2)
        d.brX = Math.max(0, Math.min(d.brX + brwidth - (brdragbarw / 2), d3.event.x)); 

        brwidth = brwidth + (oldx - d.brX);

        brdragbarleft
            .attr("x", d.brX - (brdragbarw / 2));

        brunderbar
            .attr("x", d.brX)
            .attr("width", brwidth);

        brdragrect
            .attr("x", d.brX)
            .attr("width", brwidth);

        d3.select("#brltooltip")
            .html(d.brX)
            .style("left", (d3.event.x) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");	
    }

    function brrdragresize() {
        //Max x on the left is x - width 
        //Max x on the right is width of screen + (dragbarw/2)
        var dragx = Math.max(d.brX + (brdragbarw/2), Math.min(w, d.brX + brwidth + d3.event.dx));

        //recalculate width
        brwidth = dragx - d.brX;

        //move the right drag handle
        brdragbarright
            .attr("x", dragx - (brdragbarw / 2));

        brunderbar
            .attr("width", brwidth);

        //resize the drag rectangle
        //as we are only resizing from the right, the x coordinate does not need to change
        brdragrect
            .attr("width", brwidth);    
    }

    // rectangle
    function dragmove() {
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

    function ldragresize() {   
        var oldx = d.x; 

        if(hasCollidedWithObstacle(oldx, d3.event.x)) {
            return;
        }    

        //Max x on the right is x + width - dragbarw
        //Max x on the left is 0 - (dragbarw/2)
        d.x = Math.max(0, Math.min(d.x + width - (dragbarw / 2), d3.event.x)); 
        width = width + (oldx - d.x);

        dragbarleft
            .attr("x", d.x - (dragbarw / 2));

        dragrect
            .attr("x", d.x)
            .attr("width", width);

//        dragbartop 
//            .attr("x", d.x + (dragbarw/2))
//            .attr("width", width - dragbarw)
//
//        dragbarbottom 
//            .attr("x", d.x + (dragbarw/2))
//            .attr("width", width - dragbarw)

        d3.select("#ltooltip")
            .html(d.x)
            .style("left", (d3.event.x) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");        
    }

    function rdragresize() {
        //Max x on the left is x - width 
        //Max x on the right is width of screen + (dragbarw/2)
        var dragx = Math.max(d.x + (dragbarw/2), Math.min(w, d.x + width + d3.event.dx));

        //recalculate width
        width = dragx - d.x;

        //move the right drag handle
        dragbarright
            .attr("x", dragx - (dragbarw/2));

        //resize the drag rectangle
        //as we are only resizing from the right, the x coordinate does not need to change
        dragrect
            .attr("width", width);  
    }   
}