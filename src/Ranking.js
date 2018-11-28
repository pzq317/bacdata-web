import React, { Component } from 'react';
import * as d3 from 'd3'
import json from './data/world.json'
import csv from './data/world_trade_value.csv'

export default class WorldMap extends Component{
	constructor(props){
        super(props);
        this.state={
        	data:{}
        }
        this.drawChart = this.drawChart.bind(this);
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
    	window.addEventListener('resize', this.upDate)
  	}
  	componentDidUpdate(){
  		this.upDate();
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

			// var margin = { top: 20, left: 0, bottom: 0, right: 0 };
			// var width = 150 - margin.left - margin.right;
			// var height = 520 - margin.top - margin.bottom;
			var margin = { top: 50, left: 0, bottom: 0, right: 0 },
				width = +d3.select('#worldmap-info-container').style('width').slice(0, -2)*0.4 - margin.left - margin.right,
            	height = +d3.select('#worldmap-info-container').style('height').slice(0, -2) - margin.top - margin.bottom;
        


			var scaleData = data.filter(d=>d.Trade == this.props.trade && d.Year == this.props.year);

			var colorScale = d3.scaleSequential(d3.interpolateYlGnBu)
            	.domain([d3.min(scaleData,function(d){ return d[Object.keys(d)[3]]}), d3.max(scaleData,function(d){return d[Object.keys(d)[3]]})])

	  		var svg = d3.select("#ranking").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			    .attr('id','ranking-svg-svg')
			    .append('g')
	  			.attr('id','ranking-svg')
				.attr('transform','translate(' +margin.left+ ','+margin.top+')')
			/*var svg = d3.select("#ranking").append("div")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			    .append('g')
	  			.attr('id','ranking-svg')
				.attr('transform','translate(' +margin.left+ ',' +margin.top+ ')')*/

			var filteredData = data.filter(d=>d.Trade == this.props.trade && d.Year == this.props.year);

			/*svg.selectAll('rect')
				.data(filteredData.sort((a,b)=>{ return b.Value-a.Value }).slice(0,9),function(d){ return d.Country })
				.enter()
				.append('rect')
				.attr('x',0)
				.attr('y',function(d,i){ return i*30 })
				.attr('width',100)
				.attr('height',30)
				.attr('fill','blue')*/

			/*svg.selectAll('#country')
				.data(filteredData.sort((a,b)=>{ return b.Value-a.Value }).slice(0,12),function(d){ return d.Country })
				.enter()
				.append('div')
				.attr('width',100)
				.attr('height',40)
				.attr('background','blue')*/
			var unit = height/10.8
			svg.selectAll('circle')
				.data(filteredData.sort((a,b)=>{ return b.Value-a.Value }).slice(0,10),function(d){ return d.Country })
				.enter()
				.append('circle')
				.attr('cx',15)
				.attr('cy',function(d,i){ return i*unit })
				.attr('r',(unit/2)<10?(unit/2):10)
				.attr('fill',function(d){ return colorScale(d.Value)} )

			svg.selectAll('text')
				.data(filteredData.sort((a,b)=>{ return b.Value-a.Value }).slice(0,10),function(d){ return d.Country })
				.enter()
				.append('text')
				.attr('x',unit*2/3)
				.attr('y',function(d,i){ return i*unit - 10})
				.attr("dy", "1em")
				.attr("id","country-name")
				//.attr('fill','#e0e0e0')
				.text(function(d){ return d.Country });
			/*svg.selectAll('div')
				.data(filteredData.sort((a,b)=>{ return b.Value-a.Value }).slice(0,12),function(d){ return d.Country })
				.enter()
				.append('div')
				.style('position','absolute')
				.style('top', function(d,i){ return i*40 + 20 })
				.style('width', 100 + "px")
				.style('height', 40 + "px")
				.style('background-color', 'blue')*/


			
		}.bind(this))
	}

	upDate(){
		var margin = { top: 50, left: 0, bottom: 0, right: 0 },
			width = +d3.select('#worldmap-info-container').style('width').slice(0, -2)*0.4 - margin.left - margin.right,
        	height = +d3.select('#worldmap-info-container').style('height').slice(0, -2) - margin.top - margin.bottom;
    	var unit = height/10.8

		var data = this.state.data

		d3.select('#ranking-svg-svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)

		var svg = d3.select('#ranking-svg')

		var trade = this.props.trade

		var filteredData = data.filter(d=>d.Trade == this.props.trade && d.Year == this.props.year);

		var circle = svg.selectAll('circle')
        	.data(filteredData.sort((a,b)=>{ return b.Value-a.Value }).slice(0,10),function(d){ return d.Country })
		
		var text = svg.selectAll('text')
        	.data(filteredData.sort((a,b)=>{ return b.Value-a.Value }).slice(0,10),function(d){ return d.Country })
		
		var scaleData = data.filter(d=>d.Trade == trade && d.Year == this.props.year)

		if(trade=='Export'){
			var colorScale = d3.scaleSequential(d3.interpolateYlGnBu)
	        	.domain([d3.min(scaleData,function(d){ return d[Object.keys(d)[3]]}), d3.max(scaleData,function(d){return d[Object.keys(d)[3]]})])
        }
        else{
        	var colorScale = d3.scaleSequential(d3.interpolateOrRd)
	        	.domain([d3.min(scaleData,function(d){ return d[Object.keys(d)[3]]}), d3.max(scaleData,function(d){return d[Object.keys(d)[3]]})])
        }

		circle.transition()
			.duration(500)
			.attr('cx',15)
			.attr('cy',function(d,i){ return i*unit })
			.attr('r',(unit/2)<10?(unit/2):10)
			.attr('fill',function(d){ return colorScale(d.Value)} )

		circle.enter()
    		.append('circle')
    		.transition()
			.duration(500) 
			.attr('cx',15)
			.attr('cy',function(d,i){ return i*unit })
			.attr('r',(unit/2)<10?(unit/2):10)
			.attr('fill',function(d){ return colorScale(d.Value)} )

		text.transition()
			.duration(500)
			.attr('x',unit*2/3)
			.attr('y',function(d,i){ return i*unit - 10})
			.attr("dy", "1em")
			.attr("id","country-name")
			//.attr('fill','#e0e0e0')
			.text(function(d){ return d.Country });

		text.enter()
    		.append('text')
    		.transition()
			.duration(500) 
			.attr('x',unit*2/3)
			.attr('y',function(d,i){ return i*unit - 10})
			.attr("dy", "1em")
			.attr("id","country-name")
			//.attr('fill','#e0e0e0')
			.text(function(d){ return d.Country });


			/*attr('x',0)
			.attr('y',function(d,i){ return i*30 })
			.attr("dy", "1em")
			.attr("id","country-name")
			.text(function(d){ return d.Country });*/

			circle.exit()
				.remove();

			text.exit()
				.remove();
    }

	render(){
		return(
			<div id='ranking'></div>
		)
	}

}