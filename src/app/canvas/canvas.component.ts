/*Code partly modified from: 
  https://jsfiddle.net/duhaime/q51ok9jc/
  https://bl.ocks.org/mbostock/3371592
*/


/*
TODO:
  - need to figure out how to default main-page's select boxes to the values picked on landing page


2. Have on the sidebar, ordinal attributes, (also probably scale attributes as well)

3b. What to do when ? is a value for one of the attr

4. Work on binning and then on the product selection overlays that come up when bins are clicked on



Revised TODO:
2a. Product selection overlay
2b. Brush select
*/




import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';
import { ProductsService } from '../services/products.service';
import { AxesService } from '../services/axes.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  products;
  prodArray: Array<Object> = [];
  axes;

  tempArr:string[] = "yoloswaggins is the best".split(" ");
  num:number = this.tempArr[this.tempArr.length-1].length;
  constructor(
    ps: ProductsService,
    axs: AxesService
  ) {
    console.log(this.num);
    // Get initial data, prep it and setup Canvas
    ps.getFromDB().subscribe(item => {
      this.products = item;
      this.processProducts();

      this.axes = axs.getAxes();

      console.log("Right before Canvas Setup");

      // _F because need to format this parameter input properly to retrieve formatted vals in subsequent functions
      this.setupCanvas(this.axes["x-axis"] + "_F", this.axes["y-axis"] + "_F", this.prodArray);
    });


    // Listener for when axis attributes or constraints updated
    ps.getComm().subscribe(
      (val) => {
        console.log("Update done: " + val);
        this.axes = axs.getAxes();

        // Need to remove old svg //
        var canvas = document.getElementById("canvas")
        canvas.removeChild(canvas.firstChild);

        this.setupCanvas(this.axes["x-axis"] + "_F", this.axes["y-axis"] + "_F", this.prodArray); // CHG PRODARRAY HERE to abstract
      }
    );
  }

  ngOnInit() {
  }

  /* Helper for processProducts */
  prepAttribute(attr: String) {
    if (!isNaN(parseFloat(attr.substring(0, 1)))) { // if 1st char coerced to number is not NaN 
      return parseFloat(attr.split(" ")[0]);
    } else if ("?" === attr.substring(0, 1)) {
      return null;
    } else { // 1st char is NaN, (probably price, $)
      return parseFloat(attr.substring(1))
    }
  }

  processProducts() {
    var prodTemp = this.products.rows;

    //PREP IMPORTANT DATA ATTRIBUTES HERE AND STORE THEM IN NEW PROPERTIES TO USE
    for (var i = 0; i < prodTemp.length; i++) {
      var temp_prod = prodTemp[i].doc;

      temp_prod["Price_F"] = this.prepAttribute(temp_prod["Price"]);
      temp_prod["Hard Drive Capacity_F"] = this.prepAttribute(temp_prod["Hard Drive Capacity"]);
      temp_prod["Processor Speed_F"] = this.prepAttribute(temp_prod["Processor Speed"]);
      temp_prod["System Memory(RAM)_F"] = this.prepAttribute(temp_prod["System Memory(RAM)"]);
      temp_prod["Battery Life_F"] = this.prepAttribute(temp_prod["Battery Life"]);
      temp_prod["Screen Size_F"] = this.prepAttribute(temp_prod["Screen Size"]);
      temp_prod["Height_F"] = this.prepAttribute(temp_prod["Height"]);
      temp_prod["Width_F"] = this.prepAttribute(temp_prod["Width"]);
      temp_prod["Depth_F"] = this.prepAttribute(temp_prod["Depth"]);
      temp_prod["Weight_F"] = this.prepAttribute(temp_prod["Weight"]);


      // console.log(temp_prod["Price_F"]);
      // console.log(temp_prod["Hard Drive Capacity_F"]);
      // console.log(temp_prod["Processor Speed_F"]);
      // console.log(temp_prod["System Memory(RAM)_F"]);
      // console.log(temp_prod["Battery Life_F"]);
      // console.log(temp_prod["Screen Size_F"]);
      //console.log(temp_prod["Height"]);
      //console.log(temp_prod["Height_F"]);
      // console.log(temp_prod["Width_F"]);
      // console.log(temp_prod["Depth_F"]);
      // console.log(temp_prod["Weight_F"]);


      this.prodArray.push(temp_prod);
    }
    console.log(this.prodArray);
  }

  setupCanvas = function (currX, currY, currProds) {

    // container target
    var elem = "#canvas";

    var canvasCont = document.getElementById("CanvasDiv");

    var width = canvasCont.clientWidth;
    var height = canvasCont.clientHeight;

    console.log(width);
    console.log(height);

    var props = {
      width: width - 175,
      height: height - 300,//140,
      class: "timeline-point",

      // margins
      marginTop: 10,
      marginRight: 0,
      marginBottom: 30,
      marginLeft: 0,

      axisBuffer: 40,

      // data inputs
      data: currProds, // MIGHT NEED TO ABSTRACT THIS TO DO PRODUCT SUBSETS

      // y label
      yLabel: "",//"Ylabel",
      yLabelLength: 50,

      // axis ticks
      xTicks: 10,
      yTicks: 10,

      pointFill: "#000000",

      popup: {
        width: 130,
        height: 90,
        xOffset: () => {
          return 130 / 2;
        },
        yOffset: () => {
          return 100 + 10;
        },
        isInside: false
      }
    }

    // component start
    var Timeline: any = {};

    /***
    *
    * Create the svg canvas on which the chart will be rendered
    *
    ***/

    Timeline.create = function (elem, props) {

      // build the chart foundation
      var svg = d3.select(elem).append('svg')
        .attr('width', props.width)
        .attr('height', props.height)
        .attr('class', 'svgSpace');

      var gP = svg.append('g')
        .attr('class', 'point-container')
        .attr("transform",
        "translate(" + props.marginLeft + "," + props.marginTop + ")");

      var gL = svg.append('g')
        .attr('class', 'line-container')
        .attr("transform",
        "translate(" + props.marginLeft + "," + props.marginTop + ")");

      var xAxis = gL.append('g')
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (props.height - props.marginTop - props.marginBottom) + ")");

      var yAxis = gL.append('g')
        .attr("class", "y axis");

      svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 1)
        .attr("x", 0 - ((props.height - props.yLabelLength) / 2))
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text(props.yLabel);

      // add placeholders for the axes
      this.update(elem, props, { svg: svg, x: xAxis, y: yAxis, gP: gP });
    };

    /***
    *
    * Update the svg scales and lines given new data
    *
    ***/

    Timeline.update = function (elem, props, components) {
      var self = this;
      var domain = self.getDomain(props, currX, currY);
      var scales = self.scales(elem, props, domain);

      //Setup Zoom behavior////////
      var zoom = d3.zoom()
        .scaleExtent([1, 5])
        .translateExtent([[-5, -5], [props.width, props.height]]) // height is signifcantly larger than actual graph
        .on("zoom", zoomed);

      // update the axes///////////////
      var axes = this.axes(props, scales);
      d3.select(elem).selectAll('g.x.axis')
        .call(axes.xAxis);

      d3.select(elem).selectAll('g.y.axis')
        .call(axes.yAxis);

      ///////////////////


      components.svg.call(zoom);


      var brush_p1;
      var brush_p2;

      var brush = d3.brush()
        .on("start", brushstart)
        .on("brush",brushing)
        .on("end", brushended);

      function brushstart(){
        console.log("IN BRUSHSTART");
        console.log(d3.event);
        brush_p1 = [d3.event.sourceEvent.clientX, d3.event.sourceEvent.clientY];
        console.log(brush_p1);
      }

      function brushing (){
        console.log("IN BRUSHING");
        console.log(d3.event);
      }


      var toggle = document.getElementById("brushToggle"),
        isSelect = false;

      toggle.onclick = function () {
        isSelect = !isSelect;
        if (isSelect) {
          zoom.on("zoom", null);
          components.svg.append("g")
            .attr("class", "brush")
            .call(brush);
        } else {
          zoom.on("zoom", zoomed);
          d3.selectAll(".brush").remove();//.attr("display", "none");
        }
      };


      var currentTransform;

     // svg.select(".brush").call(brush.move, null);//cancels out brush i think, use atger / before model
      function brushended() {
        console.log("IN BRUSHEND");
        console.log(d3.event);
        var s = d3.event.selection,
          x0 = s[0][0],
          y0 = s[0][1],
          x1 = s[1][0],
          y1 = s[1][1];

        // console.log(s[0]);
        // console.log(s[1]);

        brush_p2 = [d3.event.sourceEvent.clientX, d3.event.sourceEvent.clientY];
        console.log(brush_p2);


        console.log("TopLeft Point: " + brush_p1[0] + " : " + brush_p1[1]);
        console.log("Bottom Right Point: " + brush_p2[0] + " : " + brush_p2[1]);

        var transform = d3.zoomTransform(components.svg);
        console.log("TRANSFORM");
        console.log(transform);
        console.log(currentTransform);

        //console.log(d3.brushSelection(d3.select(".brush").node()));
        var pointArr = d3.selectAll(".point")._groups[0]; // all the current points drawn
        console.log(pointArr);
        
        var TempArr = [];
        var svgclientOffset = $('.svgSpace').offset();

        for (var x = 0; x < 300; x++) {
          
          var svgCordPnt = [parseInt(pointArr[x].attributes.cx.value), parseInt(pointArr[x].attributes.cy.value)];
          var zoomedCordPnt = currentTransform.apply(svgCordPnt);
          var clientCordPnt = [zoomedCordPnt[0] + svgclientOffset.left, zoomedCordPnt[1] + svgclientOffset.top];

          

          if (brush_p1[0] <= clientCordPnt[0] && clientCordPnt[0] <= brush_p2[0] && brush_p1[1] <= clientCordPnt[1] 
            && clientCordPnt[1] <= brush_p2[1]) {
             TempArr.push(pointArr[x].__data__);
             console.log("Client Cord for curr point: " + clientCordPnt);
           }

        }

        console.log("RESULTS");
        console.log(TempArr);

        if (!d3.event.selection) {
          // histoarea.attr("d", null);
          // histoline.attr("d", null);
        }
      }


      function zoomed() {
        console.log("in zoom");
        currentTransform = d3.event.transform;
        components.gP.attr("transform", d3.event.transform);
        components.x.call(axes.xAxis.scale(d3.event.transform.rescaleX(scales.x)));
        components.y.call(axes.yAxis.scale(d3.event.transform.rescaleY(scales.y)));
      }

      ////////////////////////

      self.drawPoints(elem, props, scales);
    };


    /***
    *
    * Use the range of values in the x,y attributes
    * of the incoming data to identify the plot domain
    *
    ***/

    Timeline.getDomain = function (props, x, y) {
      var domain = { x, y };
      domain.x = d3.extent(props.data, function (d) { return d[x]; });
      domain.y = d3.extent(props.data, function (d) { return d[y]; });
      console.log("X domain:" + domain.x);
      console.log(typeof (domain.x[2]));
      console.log("Y domain:" + domain.y);
      return domain;
    };


    /***
    *
    * Compute the chart scales
    *
    ***/

    Timeline.scales = function (elem, props, domain) {

      if (!domain) {
        return null;
      }

      var width = props.width - props.marginRight - props.marginLeft;
      var height = props.height - props.marginTop - props.marginBottom;

      var x = d3.scaleLinear()
        .range([props.axisBuffer, width - props.axisBuffer])
        .domain(domain.x);

      var y = d3.scaleLinear()
        .range([height - props.axisBuffer, props.axisBuffer])
        .domain(domain.y);

      return { x: x, y: y };
    };


    /***
    *
    * Create the chart axes
    *
    ***/

    Timeline.axes = function (props, scales) {

      var xAxis = d3.axisBottom(scales.x)
        .ticks(props.xTicks);
      //.tickFormat(d3.format("d"));

      var yAxis = d3.axisRight(scales.y)
        .ticks(props.yTicks);

      return {
        xAxis: xAxis,
        yAxis: yAxis
      }
    };


    /***
    *
    * Use the general update pattern to draw the points
    *
    ***/

    Timeline.drawPoints = function (elem, props, scales, prevScales, dispatcher) {
      var g = d3.select(elem).selectAll('.point-container');
      var color = d3.scaleOrdinal(d3.schemeCategory10);

      // add images
      var image = g.selectAll('.image')
        .data(props.data)

      image.enter()
        .append("pattern")
        .attr("id", function (d) { return d["_id"] })
        .attr("class", "svg-image")
        .attr("x", "0")
        .attr("y", "0")
        .attr("height", "1")
        .attr("width", "1")
        .append("image")
        .attr("x", "0")//""+scales.x(300))
        .attr("y", "0")//""+scales.y(5))
        .attr("height", "70px")
        .attr("width", "70px")
        .attr("xlink:href", function (d) { // console.log(d["imageURLs"].split("@")[1]);
          return d["imageURLs"].split("@")[1];
        })//need to separate the image urls and prep them. DID that above.

      var point = g.selectAll('.point')
        .data(props.data);

      // enter
      point.enter()
        .append("circle")
        .attr("class", "point")
        .on('mouseover', function (d) {
          props["isInside" + d["_id"]] = false;
          // console.log("In mouseover function");
          d3.select(elem).selectAll(".point").classed("active", false);
          var selection = d3.select(this);
          selection.classed("active", true);
          console.log("IN mouseover");
          console.log(d);
          console.log(selection);
          console.log(props.popup.xOffset());
          console.log(props.popup.yOffset());

          g.append("rect")
            .attr("class", "popup" + d["_id"])
            .attr("id", "test")
            .attr("x", selection._groups[0][0].attributes[1].value - props.popup.xOffset())//-11)
            .attr("y", selection._groups[0][0].attributes[2].value - props.popup.yOffset())//-28)
            .attr("width", props.popup.width)
            .attr("height", props.popup.height)
            .attr("fill", "white")
            .attr("stroke", "#000");
          //             .on("mouseover", function(){
          //               props["isInside"+d["_id"]] = true;
          //               console.log("In mouseover popup");
          //             })
          //             .on("mouseout", function(){
          //               console.log("In mouseout Popup");
          //               props["isInside"+d["_id"]] = false;
          // setTimeout(function(){
          //   console.log("In settime b4 if");
          //   if (!props["isInside"+d["_id"]]) {
          //     console.log("In settime after if");
          //     d3.selectAll(".popup"+d["_id"]).remove();
          //   };
          // }, 500);
          //             });

          g.append("rect")
            .attr("width", 75)
            .attr("height", 75)
            .attr("class", "popup" + d["_id"])
            .attr("x", selection._groups[0][0].attributes[1].value - props.popup.xOffset() + 25)
            .attr("y", selection._groups[0][0].attributes[2].value - props.popup.yOffset() + 1)
            .style("fill", function () {
              //Fills point with URL image
              if (d.imageURLs) {
                console.log(d["_id"]);
                return ("url(#" + d["_id"] + ")");
              }
            });
          // .on("mouseover", function(){
          //   props["isInside"+d["_id"]] = true;
          //   console.log("In mouseover popup");
          // });

          g.append("text")
            .attr("class", "popup" + d["_id"])
            .attr("x", selection._groups[0][0].attributes[1].value - props.popup.xOffset() + 10)
            .attr("y", selection._groups[0][0].attributes[2].value - props.popup.yOffset() + 75)
            .attr("font-size", 7)
            .text(currX.substr(0, currX.length - 2) + ": " + d[currX.substr(0, currX.length - 2)]);
          // .on("mouseover", function(){
          //   props["isInside"+d["_id"]] = true;
          //   console.log("In mouseover popup");
          // });

          g.append("text")
            .attr("class", "popup" + d["_id"])
            .attr("x", selection._groups[0][0].attributes[1].value - props.popup.xOffset() + 10)
            .attr("y", selection._groups[0][0].attributes[2].value - props.popup.yOffset() + 85)
            .attr("font-size", 7)
            //             .attr("textLength", "70px")
            .text(currY.substr(0, currY.length - 2) + ": " + d[currY.substr(0, currY.length - 2)]);
          // .on("mouseover", function(){
          //   props["isInside"+d["_id"]] = true;
          //   console.log("In mouseover popup");
          // });

          if (props.onMouseover) {
            props.onMouseover(d)
          };
        })
        .on('mouseout', function (d) {
          setTimeout(function () {
            console.log("In settime b4 if");
            // if (!props["isInside"+d["_id"]]) {
            console.log("In settime after if");
            d3.selectAll(".popup" + d["_id"]).remove();
            //clearInterval(interval);
            //}
          }, 500);
        })
        .attr("cx", function (d) {
          // console.log("In cx positioning function");
          var xTemp = d[currX];
          //console.log("xTemp: " + xTemp);
          var xPos = scales.x(xTemp);//d.y); 
          //console.log("xPos: " + xPos);
          if (isNaN(xPos)) {
            return scales.x(300);
          } else {
            return xPos;
          }
        })
        .attr("cy", function (d) {
          var yTemp = d[currY];
          //console.log("yTemp: " + yTemp);
          var yPos = scales.y(yTemp);//d.y); 
          //console.log("yPos: " + yPos);
          if (isNaN(yPos)) {
            return scales.y(5);
          } else {
            return yPos;
          }
        })
        .attr("r", 2)
        .style("stroke", function (d) {
          if (props.pointStroke) {
            return d.color = props.pointStroke;
          } else {
            return d.color = color(d.key);
          }
        })
        .style("fill", function (d) {
          //Fills point with URL image
          /*if (d.imageURLs) {
            // console.log(d["_id"]);
            return ("url(#" + d["_id"] + ")");
          }*/

          if (props.pointFill) {
            console.log("pointFill is defined");
            return d.color = props.pointFill;
          }
          //} else {
          //  return d.color = color(d.key);
          //}
        });

      // exit
      point.exit()
        .remove();
    };

    // Start
    Timeline.create(elem, props);


  }


  /*Stuff ToDo: 1. X-axis' two end labels over hang and get cut off
  2. More Generally, need to make this code more general to allow it to take in new scales based on 
  attributes and adjust accordingly.
  
  setupCanvas = function(){
    var svg = d3.select("#canvas").append("svg").attr("width", 800).attr("height", 470),
      margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = svg.attr("width") - margin.left - margin.right,
      height = svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var formatNumber = d3.format(".1f");
    
    var x = d3.scaleLinear()
        .domain([0, 2000])
        .range([0, width]);
    
    var y = d3.scaleLinear()
        .domain([0, 3000])
        .range([height, 0]);
    
    var xAxis = d3.axisBottom(x)
        .ticks(5);
    
    var yAxis = d3.axisRight(y)
        .tickSize(width)
        .tickFormat(function(d) {
          //var s = formatNumber(d);
          return this.parentNode.nextSibling
              ?  d
              : "$" + d;
        });
    
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(customXAxis);
    
    g.append("g")
        .call(customYAxis);
    
    function customXAxis(g) {
      g.call(xAxis);
      g.select(".domain").remove();
    }
    
    function customYAxis(g) {
      g.call(yAxis);
      g.select(".domain").remove();
      g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
      g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
    }
  };

  */

}
