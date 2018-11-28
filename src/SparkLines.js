import React, { Component } from 'react';
import * as d3 from 'd3'
import json from './data/world.json'
import csv from './data/world_trade_value.csv'

export default class SparkLines extends Component{
	constructor(props){
        super(props);
        this.state={
        	data:{}
        }
        this.drawChart = this.drawChart.bind(this);
        this.drawSparkLine = this.drawSparkLine.bind(this);
        this.upDate = this.upDate.bind(this);
    }


    shouldComponentUpdate(nextProps){
        if(this.props.trade !== nextProps.trade || this.props.year !== nextProps.year){
            return true;
        }
        else{
            return false;
        }
    }

  	componentDidMount() {
    	this.drawChart();
    	window.addEventListener('resize', ()=>{
    		console.log('sparkline resize')
    		var data = this.state.data
	  		var filteredData = data.filter(d=>d.Trade == this.props.trade && d.Year == this.props.year).sort((a,b)=>{ return b.Value-a.Value }).slice(0,12);
	  		filteredData.forEach((target, i)=>{
				var temp = data.filter(d=> d.Country == target.Country && d.Trade == this.props.trade)
				this.upDate(temp,i);
			})
    	})
  	}
  	componentDidUpdate(){
  		var data = this.state.data
  		var filteredData = data.filter(d=>d.Trade == this.props.trade && d.Year == this.props.year).sort((a,b)=>{ return b.Value-a.Value }).slice(0,12);
  		filteredData.forEach((target, i)=>{
			var temp = data.filter(d=> d.Country == target.Country && d.Trade == this.props.trade)
			this.upDate(temp,i);
		})
  	}

  	drawChart() {

		d3.csv(csv,function(d){
			return {
				Country : d.Country,
				Year : +d.Year,
				Trade : d.Trade,
				Value : +d.Value

			}
		}.bind(this)).then(function(data){
			this.setState({
				data: data
			}) 

			var filteredData = data.filter(d=>d.Trade == this.props.trade && d.Year == this.props.year).sort((a,b)=>{ return b.Value-a.Value }).slice(0,10);

			var margin = { top: 50, left: 0, bottom: 0, right: 0 },
			width = +d3.select('#worldmap-info-container').style('width').slice(0, -2)*0.3 - margin.left - margin.right,
        	height = +d3.select('#worldmap-info-container').style('height').slice(0, -2) - margin.top - margin.bottom;
        	console.log('draw',height)
        	var unit = height/10.8


			/*var div = d3.select("#sparklines-container").append("div")
			    .style("width", width + margin.left + margin.right + 'px')
			    .style("height", height + margin.top + margin.bottom + 'px')
			    .attr("id",'sparklines')
			    
			
			div.selectAll('rect')
				.data(filteredData,function(d){ return d.Country })
				.enter()
				.append('div')
				.attr('id',function(d,i){ return 'div' + i })
				.style("height", unit + 'px')
				.style("height", width + 'px')
				//.text(function(d){ return d.Country })

			filteredData.forEach((target,i)=>{
				var temp = data.filter(d=> d.Country == target.Country && d.Trade == this.props.trade)
				//console.log(temp,target.Country)
				this.drawSparkLine(temp,i)
			})*/

			var svg = d3.select("#sparklines-container")
				.append("svg")
			    .style("width", width + margin.left + margin.right)
			    .style("height", height + margin.top + margin.bottom)
			    .attr("id",'sparklines')
			    .append('g')
	  			.attr('id','sparklines-svg')
				.attr('transform','translate(' +margin.left+ ','+margin.top+')')

			filteredData.forEach((target,i)=>{
				var temp = data.filter(d=> d.Country == target.Country && d.Trade == this.props.trade)
				//console.log(temp,target.Country)
				this.drawSparkLine(temp,i)
			})
			

			/*var svg = d3.select("#sparklines-container").append("svg")
			    .style("width", width + margin.left + margin.right + 'px')
			    .style("height", height + margin.top + margin.bottom + 'px')
			    .append('g')
	  			.attr('id','sparklines')
				.attr('transform','translate(' +margin.left+ ',0)')*/

			/*var x = d3.scaleOrdinal().domain([2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016]).range([0, 150]);
			console.log(d3.extent(filteredData,function(d){ return d[Object.keys(d)[3]]}))
			var y = d3.scaleLinear().domain(d3.extent(filteredData,function(d){ return d[Object.keys(d)[3]]})).range([0, 30]);*/


			/*var svg = d3.select("#sparklines").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			    .append('g')
	  			.attr('id','ranking-svg')
				.attr('transform','translate(' +margin.left+ ',' +margin.top+ ')')*/
			    

			


			
		}.bind(this))
	}

	drawSparkLine(data,i){
		//console.log(data)
		var margin = { top: 50, left: 0, bottom: 0, right: 0 },
			width = +d3.select('#worldmap-info-container').style('width').slice(0, -2)*0.3 - margin.left - margin.right,
        	height = +d3.select('#worldmap-info-container').style('height').slice(0, -2) - margin.top - margin.bottom;
        
       	console.log('draw spark line',height)
        d3.select('#sparklines')
        	.style("width", width + margin.left + margin.right)
			.style("height", height + margin.top + margin.bottom)
       	var unit = height/10.8

       	var xScale = d3.scalePoint().domain([2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016]).range([5, width-5]);
		var yScale = d3.scaleLinear().domain(d3.extent(data,function(d){ return d.Value})).range([(i+0.5)*unit-5, (i-0.5)*unit+5]);

       	var svg = d3.select('#sparklines-svg')

       	var line = d3.line()
		    .x(function(d) { return xScale(d.Year); }) 
		    .y(function(d) { return yScale(d.Value); })
		    .curve(d3.curveMonotoneX)

		var value = data.filter(d=>d.Year == this.props.year)[0].Value
       	svg.append("path")
		    .datum(data)
		    .attr("id", "sparkline-"+i)
		    .attr("d", line)
		    .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("fill", "none")

        var div = d3.select('.tooltip')
        svg.append('circle')
			.attr('cx',xScale(this.props.year))
			.attr('cy',yScale(value))
			.attr('id',"circle-"+i)
			.attr('r',2)
			.attr('fill','red')
			.on("mouseover", (d) => {
				
				div.style("opacity", .9)
					.style('z-index',10)
				div.html(this.props.year)
				// data.filter(d=>d.Year == this.props.year)[0].Value	
			})
			.on("mousemove", function () {
				div.style("left", (d3.event.pageX + 10) + "px")
					.style("top", (d3.event.pageY - 10) + "px")
			})
			.on("mouseout", function () {
				div.style("opacity", 0)
					.style('z-index',-10)
			});
		/*var svg = d3.select('#div'+i)
			.append('svg')
			.attr('width',width)
			.attr('height',unit)
			.attr('id','svg' + i)

		var value = data.filter(d=>d.Year == this.props.year)[0].Value

		var xScale = d3.scalePoint().domain([2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016]).range([5, width-5]);
		var yScale = d3.scaleLinear().domain(d3.extent(data,function(d){ return d.Value})).range([unit-5, 5]);

		//console.log(d3.extent(data,function(d){ return d.Value}))
		
		var line = d3.line()
		    .x(function(d) { return xScale(d.Year); }) 
		    .y(function(d) { return yScale(d.Value); })
		    .curve(d3.curveMonotoneX)

		d3.select('#sparklines').style("height", height + 'px').style('width',width + 'px')
		d3.select('#div'+i).style("height", unit + 'px').style('width',width + 'px')
		svg.append("path")
		    .datum(data)
		    .attr("id", "sparkline-"+i)
		    .attr("d", line)
		    .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("fill", "none")
   
        var div = d3.select('.tooltip')
        svg.append('circle')
			.attr('cx',xScale(this.props.year))
			.attr('cy',yScale(value))
			.attr('r',2)
			.attr('fill','red')
			.on("mouseover", (d) => {
				
				div.style("opacity", .9)
					.style('z-index',10)
				div.html(this.props.year)
				// data.filter(d=>d.Year == this.props.year)[0].Value	
			})
			.on("mousemove", function () {
				div.style("left", (d3.event.pageX + 10) + "px")
					.style("top", (d3.event.pageY - 10) + "px")
			})
			.on("mouseout", function () {
				div.style("opacity", 0)
					.style('z-index',-10)
			});*/
	
	}

	upDate(data,i){

		var margin = { top: 50, left: 0, bottom: 0, right: 0 },
			width = +d3.select('#worldmap-info-container').style('width').slice(0, -2)*0.3 - margin.left - margin.right,
        	height = +d3.select('#worldmap-info-container').style('height').slice(0, -2) - margin.top - margin.bottom;
       	console.log(width,height)
       	var unit = height/10.8
		//console.log(data,i)
		var value = data.filter(d=>d.Year == this.props.year)[0].Value
		var xScale = d3.scalePoint().domain([2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016]).range([5, width-5]);
		var yScale = d3.scaleLinear().domain(d3.extent(data,function(d){ return d.Value})).range([(i+0.5)*unit-5, (i-0.5)*unit+5]);

		//console.log(d3.extent(data,function(d){ return d.Value}))
		d3.select('#sparklines')
			.style("width", width + margin.left + margin.right)
			.style("height", height + margin.top + margin.bottom)

		var line = d3.line()
		    .x(function(d) { return xScale(d.Year); }) 
		    .y(function(d) { return yScale(d.Value); })
		    .curve(d3.curveMonotoneX)

		/*var svg = d3.select('#svg'+i)
					.attr('width',width)
					.attr('height',unit)

		d3.select('#sparklines').style("height", height + 'px').style('width',width + 'px')
		d3.select('#div'+i).style("height", unit + 'px').style('width',width + 'px')*/

		d3.select('#sparkline-'+i)
			.datum(data)
		    //.attr("id", "sparkline-"+i)
		    .transition() 
		    .duration(500)
		    .attr("d", line)
		    .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("fill", "none")

        d3.select('#circle-'+i)
        	.transition()
		    .duration(500)
			.attr('cx',xScale(this.props.year))
			.attr('cy',yScale(value))
			.attr('r',2)
			.attr('fill','red')
		
    }

	render(){
		return(
			<div id='sparklines-container'>

			</div>
		)
	}

}