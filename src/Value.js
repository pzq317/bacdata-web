import React, { Component } from 'react';
import * as d3 from 'd3'
import json from './data/world.json'
import csv from './data/world_trade_value.csv'

export default class Value extends Component{
	constructor(props){
        super(props);
        this.state={
        	data:{}
        }
        this.drawChart = this.drawChart.bind(this);
        this.upDate = this.upDate.bind(this);
        this.convert = this.convert.bind(this);
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

			var filteredData = data.filter(d=>d.Trade == this.props.trade && d.Year == this.props.year);

			/*var margin = { top: 20, left: 0, bottom: 0, right: 0 };
			var width = 65 - margin.left - margin.right;
			var height = 520 - margin.top - margin.bottom;*/
			var margin = { top: 50, left: 0, bottom: 0, right: 0 },
				width = +d3.select('#worldmap-info-container').style('width').slice(0, -2)*0.4 - margin.left - margin.right,
	        	height = +d3.select('#worldmap-info-container').style('height').slice(0, -2) - margin.top - margin.bottom;
	    	
	    	var unit = height/10.8

			var svg = d3.select("#value-container").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			    .attr('id','value-svg')
			    .append('g')
	  			.attr('id','value')
				.attr('transform','translate(' +margin.left+ ','+margin.top+')')

			svg.selectAll('text')
				.data(filteredData.sort((a,b)=>{ return b.Value-a.Value }).slice(0,10),function(d){ return d.Country })
				.enter()
				.append('text')
				//.attr('x',10)
				//.attr('y',function(d,i){ return i*50 + 10})
				.attr('x',unit*1/4)
				.attr('y',function(d,i){ return i*unit - 10})
				.attr('id','value-text')
				.attr("dy", "1em")
				//.attr('fill','#e0e0e0')
				.style("opacity","0")
				.text(function(d){ return '$ '+ this.convert(d.Value)}.bind(this))
				.transition()
				.delay(500)
				.duration(500/2)
				.style("opacity",1);

		}.bind(this))
	}

	upDate(){
		var animation = 500

		var margin = { top: 50, left: 0, bottom: 0, right: 0 },
			width = +d3.select('#worldmap-info-container').style('width').slice(0, -2)*0.4 - margin.left - margin.right,
        	height = +d3.select('#worldmap-info-container').style('height').slice(0, -2) - margin.top - margin.bottom;
    	
    	var unit = height/10.8
		var data = this.state.data

		d3.select('#value-svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		var svg = d3.select('#value')
		var trade = this.props.trade

		var filteredData = data.filter(d=>d.Trade == this.props.trade && d.Year == this.props.year);

		var text = svg.selectAll('text')
        	.data(filteredData.sort((a,b)=>{ return b.Value-a.Value }).slice(0,10),function(d){ return d.Country })
		
		var scaleData = data.filter(d=>d.Trade == trade && d.Year == this.props.year)

		
		text.attr('x',unit*1/4)
			.attr('y',function(d,i){ return i*unit - 10})
			.attr("dy", "1em")
			.attr('id','value-text')
			//.attr('fill','#e0e0e0')
			.style("opacity","0")
			.text(function(d){ return '$ '+ this.convert(d.Value) }.bind(this))
			.transition()
			.delay(animation)
			.duration(animation/2)
			.style("opacity",1);

		text.enter()
    		.append('text')
			.attr('x',unit*1/4)
			.attr('y',function(d,i){ return i*unit - 10})
			.attr("dy", "1em")
			.attr('id','value-text')
			//.attr('fill','#e0e0e0')
			.style("opacity","0")
			.text(function(d){ return '$ '+this.convert(d.Value) }.bind(this))
			.transition()
			.delay(animation)
			.duration(animation/2)
			.style("opacity",1);


		text.exit()
			.remove();
			
		
    }
    convert(labelValue) {

	    // Nine Zeroes for Billions
	    return Math.abs(Number(labelValue)) >= 1.0e+9

	    ? Math.round((Math.abs(Number(labelValue)) / 1.0e+9)*10)/10 + "B"
	    // Six Zeroes for Millions 
	    : Math.abs(Number(labelValue)) >= 1.0e+6

	    ? Math.round((Math.abs(Number(labelValue)) / 1.0e+6)*10)/10 + "M"
	    // Three Zeroes for Thousands
	    : Math.abs(Number(labelValue)) >= 1.0e+3

	    ? Math.round((Math.abs(Number(labelValue)) / 1.0e+3)*10)/10 + "K"

	    : Math.abs(Number(labelValue));

	}

	render(){
		return(
			<div id='value-container'></div>
		)
	}

}