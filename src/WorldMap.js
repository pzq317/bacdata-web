import React, { Component } from 'react';
import * as d3 from 'd3'
import TimeLine from './TimeLine'
import TradeBtn from './TradeBtn'
import json from './data/world.json'
import csv from './data/world_trade_value.csv'

export default class WorldMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {},
			json:{}
		}
		this.drawChart = this.drawChart.bind(this);
		this.upDate = this.upDate.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		if (this.props.trade !== nextProps.trade || this.props.year !== nextProps.year) {
			return true;
		}
		else {
			return false;
		}
	}

	componentDidMount() {
		console.log(this.props.year)
		this.drawChart();
		window.addEventListener('resize', this.upDate)
	}
	componentDidUpdate() {
		//console.log(this.drawChart)
		this.upDate();
		this.upDateTitle();
	}
	upDateTitle(){
		d3.select('#year').html(this.props.year)
		d3.select('#trade').html( ' '+this.props.trade)


	}

	drawChart() {

		d3.csv(csv, function (d) {
			return {
				Country: d.Country,
				Year: +d.Year,
				Trade: d.Trade,
				Value: +d.Value

			}
		}.bind(this)).then(function (data) {
			this.setState({
				data: data
			})

			var margin = { top: 20, left: 0, bottom: 0, right: 0 },
				width = +d3.select('#worldmap').style('width').slice(0, -2) - margin.left - margin.right,
            	height = +d3.select('#worldmap').style('height').slice(0, -2) - margin.top - margin.bottom;
        
			//var h = +d3.select('#linechart').style('height').slice(0, -2)
			//var width = 620 - margin.left - margin.right;
			//var height = 450 - margin.top - margin.bottom;


			var svg1 = d3.select("#worldmap").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr('id','worldmap-svg')
				.append('g')
				.attr('id', 'worldmap-g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

			var scaleData = data.filter(d => d.Trade == this.props.trade && d.Year == this.props.year);

			// var colorScale = d3.scaleSequential(d3.interpolateBlues)
			// .domain([d3.min(scaleData, function (d) { return d[Object.keys(d)[3]] }), d3.max(scaleData, function (d) { return d[Object.keys(d)[3]] })])

			var colorScale = d3.scaleSequential(d3.interpolateYlGnBu)
				.domain([d3.min(scaleData, function (d) { return d[Object.keys(d)[3]] }), d3.max(scaleData, function (d) { return d[Object.keys(d)[3]] })])

			var populationById = {};
			console.log(populationById)
			data.forEach(function (d) {
				//populationById[d.Country] = d.Value
				populationById[d.Year + '_' + d.Country + '_' + d.Trade] = d.Value
				// year_value[d.Year] = d.Value
				// trade_year[d.Trade] = year_value
			})
			console.log(populationById)
			json.features = json.features.filter(x => x.properties.sovereignt !== 'Antarctica')

			console.log(json)

			json.features.forEach(function (d) {
				var trade = 'Import'
				for (var i = 2006; i < 2017; i++) {
					let year = i.toString()
					d.properties[year + '_' + trade] = populationById[year + '_' + d.properties.name + '_' + trade]
				}

				trade = 'Export'
				for (var i = 2006; i < 2017; i++) {
					let year = i.toString()
					d.properties[year + '_' + trade] = populationById[year + '_' + d.properties.name + '_' + trade]
				}
				//d.properties.value = populationById[d.properties.name]

			})

			this.setState({
				json:json
			})
			console.log(json)

			var projection = d3.geoMercator()
				.fitSize([width, height], json); //fit svg size!

			var path = d3.geoPath()
				.projection(projection);

			var country = svg1.selectAll("path")
				.data(json.features) //data join with features
				.enter()

			var div = d3.select("body").append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);

			country.append("path")
				.attr('class', 'country')
				.attr("fill", "#E5E3E3")
				// .attr("stroke", "#404244")
				.attr("stroke", "grey")
				.attr("stroke-width", 0.5)
				.attr("d", path)
				// .attr('id','tooltip')
				.on("mouseover", (d) => {
					div.style("opacity", .9)
						.style('z-index',10)

					div.html(this.props.year + " " + d.properties['name'] + "<br>"  + this.props.trade + " Value:" + this.convert(d.properties[this.props.year + '_' + this.props.trade]))	
				})
				.on("mousemove", function () {
					div.style("left", (d3.event.pageX + 10) + "px")
						.style("top", (d3.event.pageY - 10) + "px")
				})
				.on("mouseout", function () {
					div.style("opacity", 0)
						.style('z-index',-10)
				});

			console.log(this.props)
			var year = this.props.year
			var trade = this.props.trade
			svg1.selectAll('.country')
				.attr('fill', function (d) { return d.properties[year + '_' + trade] ? colorScale(d.properties[year + '_' + trade]) : '#E5E3E3' })

			var g = svg1.append("g").attr('id', 'legend_group')

			var unit = Math.min(height *0.04,width*0.03)

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 4*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', 'lightyellow')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 3*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', '#f2ffcc')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 2*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', 'rgb(147,213,170)')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 1*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', 'rgb(67,173,180)')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 0*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', 'rgb(30,114,171)')

			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*4.7)
				.attr('font-size', '12')
				.text('less than $ 10M')
			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*3.7)
				.attr('font-size', '12')
				.text('$ 100M')
			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*2.7)
				.attr('font-size', '12')
				.text('$ 400M')

			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*1.7)
				.attr('font-size', '12')
				.text('$ 800M')
				
			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*0.7)
				.attr('font-size', '12')
				.text('more than $ 1B')

		}.bind(this))
		
	}

	upDate() {

		var data = this.state.data
		var json = this.state.json
		var margin = { top: 20, left: 0, bottom: 0, right: 0 },
				width = +d3.select('#worldmap').style('width').slice(0, -2) - margin.left - margin.right,
            	height = +d3.select('#worldmap').style('height').slice(0, -2) - margin.top - margin.bottom;
        
		var svg = d3.select('#worldmap-svg')
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)

		d3.select('#worldmap-g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

		var trade = this.props.trade
		var scaleData = data.filter(d => d.Trade == trade && d.Year == this.props.year)

		if (trade == 'Export') {
			var colorScale = d3.scaleSequential(d3.interpolateYlGnBu)
				.domain([d3.min(scaleData, function (d) { return d[Object.keys(d)[3]] }), d3.max(scaleData, function (d) { return d[Object.keys(d)[3]] })])
		}
		else {
			var colorScale = d3.scaleSequential(d3.interpolateOrRd)
				.domain([d3.min(scaleData, function (d) { return d[Object.keys(d)[3]] }), d3.max(scaleData, function (d) { return d[Object.keys(d)[3]] })])
			
			}
		var year = this.props.year

		var projection = d3.geoMercator()
				.fitSize([width, height], json); //fit svg size!

		var path = d3.geoPath()
			.projection(projection);

		svg.selectAll('.country')
			.attr("d", path)
			.attr('fill', function (d) { return d.properties[year + '_' + trade] ? colorScale(d.properties[year + '_' + trade]) : '#E5E3E3' })

		var unit = Math.min(height *0.04,width*0.03)

		if (trade == 'Export') {
			var g = d3.select('#legend_group');
			g.selectAll('*').remove();
			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 4*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', 'lightyellow')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 3*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', '#f2ffcc')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 2*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', 'rgb(147,213,170)')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 1*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', 'rgb(67,173,180)')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 0*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', 'rgb(30,114,171)')

			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*4.7)
				.attr('font-size', '12')
				.text('less than $ 10M')
			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*3.7)
				.attr('font-size', '12')
				.text('$ 100M')
			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*2.7)
				.attr('font-size', '12')
				.text('$ 400M')

			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*1.7)
				.attr('font-size', '12')
				.text('$ 800M')
				
			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*0.7)
				.attr('font-size', '12')
				.text('more than $ 1B')
		}
		else {
			var g = d3.select('#legend_group');
			g.selectAll('*').remove();
			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 4*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', 'rgb(255,243,226)')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 3*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', 'rgb(253,232,200)')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 2*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', 'rgb(252,205,149)')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 1*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', 'rgb(241,102,66)')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit/2)
				.attr('y', height*0.7 + 0*unit)
				.attr('height', unit)
				.attr('width', unit)
				.attr('fill', 'rgb(106,0,2)')

			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*4.7)
				.attr('font-size', '12')
				.text('less than $ 10M')
			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*3.7)
				.attr('font-size', '12')
				.text('$ 100M')
			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*2.7)
				.attr('font-size', '12')
				.text('$ 400M')

			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*1.7)
				.attr('font-size', '12')
				.text('$ 800M')
				
			g.append('text')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', unit*1.8)
				.attr('y', height*0.7 + unit*0.7)
				.attr('font-size', '12')
				.text('more than $ 1B')
			
			/*g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', 10)
				.attr('y', 375)
				.attr('height', '20')
				.attr('width', '20')
				.attr('fill', 'rgb(255,243,226)')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', 10)
				.attr('y', 355)
				.attr('height', '20')
				.attr('width', '20')
				.attr('fill', 'rgb(253,232,200)')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', 10)
				.attr('y', 335)
				.attr('height', '20')
				.attr('width', '20')
				.attr('fill', 'rgb(252,205,149)')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', 10)
				.attr('y', 315)
				.attr('height', '20')
				.attr('width', '20')
				.attr('fill', 'rgb(241,102,66)')

			g.append('rect')
				.transition()
				.duration(1000)
				.attr('class', 'legend')
				.attr('x', 10)
				.attr('y', 295)
				.attr('height', '20')
				.attr('width', '20')
				.attr('fill', 'rgb(106,0,2)')

			g.append('text')
				.transition()
				.duration(1000)
				.attr('x', 40)
				.attr('y', 392)
				.attr('font-size', '12')
				.text('less than $ 1M')
			g.append('text')
				.transition()
				.duration(1000)
				.attr('x', 40)
				.attr('y', 370)
				.attr('font-size', '12')
				.text('$ 200M')
			g.append('text')
				.transition()
				.duration(1000)
				.attr('x', 40)
				.attr('y', 350)
				.attr('font-size', '12')
				.text('$ 500M')

			g.append('text')
				.transition()
				.duration(1000)
				.attr('x', 40)
				.attr('y', 330)
				.attr('font-size', '12')
				.text('$ 1B')

			g.append('text')
				.transition()
				.duration(1000)
				.attr('x', 40)
				.attr('y', 309)
				.attr('font-size', '12')
				.text('more than $ 1B')*/
		}

	}
	convert(labelValue) {

		// Nine Zeroes for Billions
		return Math.abs(Number(labelValue)) >= 1.0e+9

			? Math.round((Math.abs(Number(labelValue)) / 1.0e+9) * 10) / 10 + "B"
			// Six Zeroes for Millions 
			: Math.abs(Number(labelValue)) >= 1.0e+6

			? Math.round((Math.abs(Number(labelValue)) / 1.0e+6) * 10) / 10 + "M"
			// Three Zeroes for Thousands
			: Math.abs(Number(labelValue)) >= 1.0e+3

			? Math.round((Math.abs(Number(labelValue)) / 1.0e+3) * 10) / 10 + "K"

			: Math.abs(Number(labelValue));

	}

	render() {
		return (
			<div id='worldmap'>
				
				{/*<h6 id='sub-title1'>siuhglsdfjjlf lrguhalsj gklaghjsjklf</h6>*/}
				{/*<h6 id='sub-title2'>fgskdjfgnlsdkfjng gsldkjfng</h6>*/}

				
			</div>



		)
	}

}