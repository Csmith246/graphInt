/*Code partly modified from: 
  https://jsfiddle.net/duhaime/q51ok9jc/
  https://bl.ocks.org/mbostock/3371592
*/

import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ProductsService } from '../services/products.service';
import { data } from '../models/data';
import { objData } from '../models/objData';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  
  products;
  prodArray: Array<Object> = [];

  constructor(
    ps:ProductsService
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
      // console.log(this.products);
    });
  }

  ngOnInit() {
    this.setupCanvas();
  }


  processProducts(){
    var prodTemp = this.products.rows;

    for(var i=0; i<prodTemp.length; i++){
      this.prodArray.push(prodTemp[i].doc);
    }
    console.log(this.prodArray);
  }
  
  setupCanvas = function(){
    
    // container target
    var elem = "#canvas";
    
    var props = {
      width: 1000,
      height: 600,
      class: "timeline-point",
    
      // margins
      marginTop: 100,
      marginRight: 40,
      marginBottom: 100,
      marginLeft: 60,
    
      // data inputs
      data: this.prodArray,
    
      // y label
      yLabel: "Y label",
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
      var domain = self.getDomain(props);// PUT THE X AND Y ATTRIBUTES IN HERE
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
      domain.x = props.xDomain || d3.extent(props.data, function(d) { return d[x]; });
      domain.y = props.yDomain || d3.extent(props.data, function(d) { return d[y]; });
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
    
      var x = d3.scale.linear()
        .range([0, width])
        .domain(domain.x);
    
      var y = d3.scale.linear()
        .range([height, 0])
        .domain(domain.y);
    
      return {x: x, y: y};
    };
    
    
    /***
    *
    * Create the chart axes
    *
    ***/
    
    Timeline.axes = function(props, scales) {
    
      var xAxis = d3.svg.axis()
        .scale(scales.x)
        .orient("bottom")
        .ticks(props.xTicks)
        .tickFormat(d3.format("d"));
    
      var yAxis = d3.svg.axis()
        .scale(scales.y)
        .orient("left")
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
      var color = d3.scale.category10();
    
      // add images
      var image = g.selectAll('.image')
        .data(props.data)
    
      image.enter()
        .append("pattern")
        .attr("id", function(d) {return d.id})
        .attr("class", "svg-image")
        .attr("x", "0")
        .attr("y", "0")
        .attr("height", "1")
        .attr("width", "1")
        .append("image")
          .attr("x", "0")
          .attr("y", "0")
          .attr("height", "70px")
          .attr("width", "70px")
          .attr("xlink:href", function(d) {return d.image})
    
      var point = g.selectAll('.point')
        .data(props.data);
    
      // enter
      point.enter()
        .append("circle")
          .attr("class", "point")
          .on('mouseover', function(d) {
            d3.select(elem).selectAll(".point").classed("active", false);
            d3.select(this).classed("active", true);
            if (props.onMouseover) {
              props.onMouseover(d)
            };
          })
          .on('mouseout', function(d) {
            if (props.onMouseout) {
              props.onMouseout(d)
            };
          })
    
      // enter and update
      point.transition()
        .duration(1000)
        .attr("cx", function(d) {
          return scales.x(d.x); 
        })
        .attr("cy", function(d) { 
          return scales.y(d.y); 
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
          if (d.image) {
            return ("url(#" + d.id + ")");
          }
    
          if (props.pointFill) {
            return d.color = props.pointFill;
          } else {
            return d.color = color(d.key);
          }
        });
    
      // exit
      point.exit()
        .remove();
    
      // update the axes
      var axes = this.axes(props, scales);
      d3.select(elem).selectAll('g.x.axis')
        .transition()
        .duration(1000)
        .call(axes.xAxis);
    
      d3.select(elem).selectAll('g.y.axis')
        .transition()
        .duration(1000)
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
