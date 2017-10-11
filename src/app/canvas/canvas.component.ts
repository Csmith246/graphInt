/*Code partly modified from: 
  https://jsfiddle.net/duhaime/q51ok9jc/
  https://bl.ocks.org/mbostock/3371592
*/


/*
TODO:
1. Get the attribute inputs all set up
  - need to figure out how to get the selected attributes out of the forms
  - need ot make a data service to track currently selected attributes


2. Have on the sidebar, ordinal attributes, (also probably scale attributes as well)
3. Work on abstracting the code for the graph right now to accept any 2 attributes
    3b. What to do when ? is a value for one of the attr
4. Work on binning and then on the product selection overlays that come up when bins are clicked on
5. 
*/




import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
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

  constructor(
    ps:ProductsService,
    axs:AxesService
  ) {
    ps.getFromDB().subscribe(item => {
    //  console.log("In the observable");
    //  console.log(item);
      this.products = item;
      this.processProducts();
      // var dataHolder:data = <data> item;
      // var tempObjs: objData[] = <objData[]> dataHolder.products['rows'];
      // for(var i=0; i<tempObjs.length; i++){
      //   this.products.push(tempObjs[i].doc);
      // }
      
      this.axes = axs.getAxes();

      console.log("Right before Canvas Setup");

      // _F because need to format properly to retrieve formatted vals in canvas
      this.setupCanvas(this.axes["x-axis"] + "_F", this.axes["y-axis"] + "_F");
    });
  }

  ngOnInit() {
    //this.setupCanvas();
  }


  prepAttribute(attr:String){
    if(!isNaN(parseFloat(attr.substring(0,1)))){ // if 1st char coerced to number is not NaN 
      return parseFloat(attr.split(" ")[0]);
    }else if("?" === attr.substring(0,1)){
      return null;
    }else{ // 1st char is NaN, (probably price, $)
      return parseFloat(attr.substring(1))
    }
  }


  processProducts(){
    var prodTemp = this.products.rows;

    //PREP INMPORTANT DATA ATTRIBUTES HERE AND STORE THEM IN NEW PROPERTIES TO USE IN SCALING


    for(var i=0; i<prodTemp.length; i++){
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
      console.log(temp_prod["Height"]);
      console.log(temp_prod["Height_F"]);
      // console.log(temp_prod["Width_F"]);
      // console.log(temp_prod["Depth_F"]);
      // console.log(temp_prod["Weight_F"]);
      

      this.prodArray.push(temp_prod);
    }
    console.log(this.prodArray);
  }
  
  setupCanvas = function(currX, currY){
    
    // container target
    var elem = "#canvas";
    
    var props = {
      width: 700,
      height: 500,
      class: "timeline-point",
    
      // margins
      marginTop: 10,
      marginRight: 0,
      marginBottom: 30,
      marginLeft: 0,

      axisBuffer: 40,
    
      // data inputs
      data: this.prodArray,
    
      // y label
      yLabel: "",
      yLabelLength: 50,
    
      // axis ticks
      xTicks: 10,
      yTicks: 10
    }
    
    // component start
    var Timeline:any = {};
    
    /***
    *
    * Create the svg canvas on which the chart will be rendered
    *
    ***/
    
    Timeline.create = function(elem, props) {
    
      // build the chart foundation
      var svg = d3.select(elem).append('svg')
          .attr('width', props.width)
          .attr('height', props.height);
    
      var g = svg.append('g')
          .attr('class', 'point-container')
          .attr("transform",
                  "translate(" + props.marginLeft + "," + props.marginTop + ")");
    
      var g = svg.append('g')
          .attr('class', 'line-container')
          .attr("transform", 
                  "translate(" + props.marginLeft + "," + props.marginTop + ")");
    
      var xAxis = g.append('g')
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (props.height - props.marginTop - props.marginBottom) + ")");
    
      var yAxis = g.append('g')
        .attr("class", "y axis");
    
      svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 1)
        .attr("x", 0 - ((props.height - props.yLabelLength)/2) )
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text(props.yLabel);
    
      // add placeholders for the axes
      this.update(elem, props);
    };
    
    /***
    *
    * Update the svg scales and lines given new data
    *
    ***/
    
    Timeline.update = function(elem, props) {
      var self = this;
      var domain = self.getDomain(props, currX, currY);// PUT THE X AND Y ATTRIBUTES IN HERE
      var scales = self.scales(elem, props, domain);
    
      self.drawPoints(elem, props, scales);
    };
    
    
    /***
    *
    * Use the range of values in the x,y attributes
    * of the incoming data to identify the plot domain
    *
    ***/
    
    Timeline.getDomain = function(props, x, y) {
      var domain = {x , y};
      domain.x = d3.extent(props.data, function(d) { return d[x]; });
      domain.y = d3.extent(props.data, function(d) { return d[y]; });
      console.log("X domain:" + domain.x);
      console.log("Y domain:" + domain.y);
      return domain;
    };
    
    
    /***
    *
    * Compute the chart scales
    *
    ***/
    
    Timeline.scales = function(elem, props, domain) {
    
      if (!domain) {
        return null;
      }
    
      var width = props.width - props.marginRight - props.marginLeft;
      var height = props.height - props.marginTop - props.marginBottom;
    
      var x = d3.scaleLinear()
        .range([props.axisBuffer, width-props.axisBuffer])
        .domain(domain.x);
    
      var y = d3.scaleLinear()
        .range([height-props.axisBuffer, props.axisBuffer])
        .domain(domain.y);
    
      return {x: x, y: y};
    };
    
    
    /***
    *
    * Create the chart axes
    *
    ***/
    
    Timeline.axes = function(props, scales) {
    
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
    
    Timeline.drawPoints = function(elem, props, scales, prevScales, dispatcher) {
      var g = d3.select(elem).selectAll('.point-container');
      var color = d3.scaleOrdinal(d3.schemeCategory10);
    
      // add images
      var image = g.selectAll('.image')
        .data(props.data)
    
      image.enter()
        .append("pattern")
        .attr("id", function(d) {return d["_id"]})
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
          .attr("xlink:href", function(d) { // console.log(d["imageURLs"].split("@")[1]);
            return d["imageURLs"].split("@")[1];
        })//need to separate the image urls and prep them. DID that above.
      
      var point = g.selectAll('.point')
        .data(props.data);
    
      // enter
      point.enter()
        .append("circle")
          .attr("class", "point")
          .on('mouseover', function(d) {
            // console.log("In mouseover function");
            d3.select(elem).selectAll(".point").classed("active", false);
            d3.select(this).classed("active", true);
            console.log("IN mouseover");
            if (props.onMouseover) {
              props.onMouseover(d)
            };
          })
          .on('mouseout', function(d) {
            if (props.onMouseout) {
              props.onMouseout(d)
            };
          })
          .attr("cx", function(d) {
            // console.log("In cx positioning function");
            var xTemp = d[currX];
            console.log("xTemp: " + xTemp);
            var xPos = scales.x(xTemp);//d.y); 
            console.log("xPos: " + xPos);
            if (isNaN(xPos)){
              return scales.x(300);
            }else{
              return xPos;
            }
          })
          .attr("cy", function(d) { 
            var yTemp = d[currY];
            //console.log("yTemp: " + yTemp);
            var yPos = scales.y(yTemp);//d.y); 
            //console.log("yPos: " + yPos);
            if (isNaN(yPos)){
              return scales.y(5);
            }else{
              return yPos;
            }
          })
          .attr("r", 30)
          .style("stroke", function(d) {
            if (props.pointStroke) {
              return d.color = props.pointStroke;
            } else {
              return d.color = color(d.key);
            }
          })
          .style("fill", function(d) {
  
            // console.log("In filling function");
  
            if (d.imageURLs) {
              // console.log(d["_id"]);
              return ("url(#" + d["_id"] + ")");
            }
  
            if (props.pointFill) {
              return d.color = props.pointFill;
            } else {
              return d.color = color(d.key);
            }
          });
        
      console.log("Before transition function");
    
      // enter and update
      // point.transition()
      //   .duration(1000)
      //   .attr("cx", function(d) {
      //     console.log("In cx positioning function");
      //     return scales.x(300);//d.x); 
      //   })
      //   .attr("cy", function(d) { 
      //     return scales.y(5);//d.y); 
      //   })
      //   .attr("r", 30)
      //   .style("stroke", function(d) {
      //     if (props.pointStroke) {
      //       return d.color = props.pointStroke;
      //     } else {
      //       return d.color = color(d.key);
      //     }
      //   })
      //   .style("fill", function(d) {

      //     console.log("In filling function");

      //     if (d.imageURLs) {
      //       console.log(d["_id"]);
      //       return ("url(#" + d["_id"] + ")");
      //     }

      //     if (props.pointFill) {
      //       return d.color = props.pointFill;
      //     } else {
      //       return d.color = color(d.key);
      //     }
      //   });
    
      // exit
      point.exit()
        .remove();
      
      
    
      // update the axes
      var axes = this.axes(props, scales);
      d3.select(elem).selectAll('g.x.axis')
        .call(axes.xAxis);
    
      d3.select(elem).selectAll('g.y.axis')
        .call(axes.yAxis);
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
