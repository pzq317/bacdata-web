import React, { Component } from 'react';
import * as d3 from 'd3'
import json from './data/world.json'
import csv from './data/world_trade_value.csv'
import categoryData from './data/category.csv'
import sankeyJson from './data/sankeyTest.json'
import {Sankey} from './d3.sankey.js'
export default class SankeyGraph extends Component{
	constructor(props){
        super(props);
        this.state={
        	data:[],
        	category:[],
        	countries:[],
        	sankey:{},
        	width :'',
        	height: '',
        	margin:{}
        }
        
        this.setData = this.setData.bind(this);
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

  		var margin = {top: 50, right: 0, bottom: 0, left: 0},
			width = 1000 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

  		var sankey = Sankey()
			    .nodeWidth(15)
			    .nodePadding(10)
			    .size([width, height]);

		this.setState({
			sankey :sankey,
			width: width,
			height:height,
			margin:margin
		})

  		d3.csv(csv,function(d){
			return {
				Country : d.Country,
				Year : +d.Year,
				Trade : d.Trade,
				Value : +d.Value

			}
		}.bind(this)).then(function(data){
			console.log()
    		this.setData(data).then(()=>{
    			this.setState({
    				data:data
    			})
    			this.drawChart()
    		});
    	}.bind(this))
  	}
  
  	setData(data) {

			return new Promise(resolve=>{
				var countries = data.filter(d=>d.Trade == this.props.trade && d.Year == this.props.year).sort((a,b)=>{ return b.Value-a.Value }).slice(0,12).map(d=>d.Country)
				this.setState({
					countries: countries
				})
				d3.csv(categoryData,function(d){
					var year = this.props.year
					if(d.Trade == this.props.trade && countries.includes(d.Reporter) && d.Product == 'AllProducts')
					return {
						Reporter : d.Reporter,
						Partner : d.Partner,
						Trade : d.Trade,
						Value : +d[year]
					}
				}.bind(this)).then(function(category){
					this.setState({
						category: category
					})
					resolve('ture')
				}.bind(this))
				
			})
		//}.bind(this))
	}

	drawChart(){

		var category = this.state.category
		this.createSankeyJson(category).then(sankeydata=>{
			console.log(sankeydata)
			
			var width = this.state.width,
				height = this.state.height,
				margin = this.state.margin


			console.log(width, height, margin)

			var formatNumber = d3.format(",.0f"),
			    format = function(d) { return formatNumber(d) + " TWh"; },
			    color = d3.scaleOrdinal(d3.schemeBlues[9]);

			var svg = d3.select("#sankey-container")
				.append('svg')
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			    .attr('id','sankey-svg')



			var sankey = this.state.sankey

			var path = sankey.link();

			var freqCounter = 1;


			sankey.nodes(sankeydata.nodes)
				.links(sankeydata.links)
				.layout(32);

			var link = svg.selectAll(".link")
			    .data(sankeydata.links)
			    .enter()
			    .append("path")
			  	.attr("class", "link")
				.attr("d", path)
				.attr("stroke-width", function(d) { return Math.max(1, d.dy); })
				//.sort(function(a, b) { return b.dy - a.dy; });

			
			var rect = svg.selectAll("rect")
			  	.data(sankeydata.nodes)
			    .enter()

			var text = svg.selectAll("text")
			  	.data(sankeydata.nodes)
			    .enter()
			    

			rect.append("rect")
				.attr('id','sankey-rect')
				.attr('x',function(d){ return d.x })
				.attr('y',function(d){ return d.y })
				.attr("height", function(d) { return d.dy; })
				.attr("width", sankey.nodeWidth())
				.style("fill", function(d) { return d.color = color(d.name); })
				.style("stroke", "none")
				.append("title")
				.text(function(d) { return d.name + "\n" + format(d.value); });

			text.append("text")
				.attr('id','sankey-text')
				.attr('x',function(d){ return d.x-6 })
				.attr('y',function(d){ return d.y + (d.dy / 2) })
				.attr("dy", ".35em")
				.attr("text-anchor", "end")
				.attr("transform", null)
				.text(function(d) { return d.name; })
				.filter(function(d) { return d.x < width / 2; })
				.attr("x", 6 + sankey.nodeWidth())
				.attr("text-anchor", "start");

		})
	}
	
		
    

	createSankeyJson(category){
		return new Promise(resolve=>{
			console.log(category)

			var data = {}
				data['nodes'] = []
				data['links'] = []
			var	temp = []
			var index = {}



			for(var i=0 ; i < this.state.countries.length; i++){
				temp.push({'name': this.state.countries[i]}) 
				index[this.state.countries[i]] = i
			}
			temp.push({'name': 'United-States'})
			temp.push({'name': 'China'})  
			/*this.state.countries.forEach((d,i)=>{ 
				temp.push({'names': d}) 
				index[d] = i
			})*/
			data['nodes'] = temp

			if(index['China'] > index['Germany']){
				var c = index['Germany']
				index['Germany'] = index['China']
				index['China'] = c

				var d = data['nodes'][index['Germany']]
				data['nodes'][index['Germany']] = data['nodes'][index['China']]
				data['nodes'][index['China']] = d
			}
			var chinaIndex = index['China']
			var usIndex = index['United-States']


			temp = []

			//category.forEach(d=>temp.push({"source":index[d.Reporter],"target":index[d.Partner],"value":d.Value}))
			for(i=0 ; i < category.length; i++){
				var source = index[category[i].Reporter]
				if(source==chinaIndex){
					source = 13
				}
				else if(source==usIndex){
					source = 12
				}
				temp.push({"source":source,"target":index[category[i].Partner],"value":category[i].Value})
			}
			
			//temp.push({"source":12,"target":index['China'],"value":category[i].Value})
			//temp.push({"source":13,"target":index['United-States'],"value":category[i].Value})
			
			data['links'] = temp

			console.log(data,index)

			//data['links'] = data['links'].filter(d=>d.source != 0 && d.source != 1)
			console.log(data)
			if(this.props.trade == 'Import'){
				for(var i=0; i < data['links'].length ; i++){
					var temp = 20
					temp = data['links'][i]['source']
					data['links'][i]['source'] = data['links'][i]['target']
					data['links'][i]['target'] = temp
				}
			}
			resolve(data)
		})
	}

	render(){
		return(
			<div id='sankey-container'></div>
			/*<div id='worldmap1'></div>*/
		)
	}

}