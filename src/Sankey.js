import React, { Component } from 'react';
import * as d3 from 'd3'
import json from './data/world.json'
import csv from './data/world_trade_value.csv'
import categoryData from './data/category.csv'
import sankeyJson from './data/sankeyTest.json'
//import {sankey as Sankey, sankeyLinkHorizontal} from 'd3-sankey'
import {Sankey} from './d3.sankey.js'
import TimeLine from './TimeLine'
import TradeBtn from './TradeBtn'
import Pie from './PieChart'
import Line from './BarChart'
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
        	margin:{},
        	country:'',
        	y:'',
        	count:0,
        	piechartshow:0
        }
        this.upDate = this.upDate.bind(this);
        this.setData = this.setData.bind(this);
        this.drawChart = this.drawChart.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState){
        if(this.props.trade !== nextProps.trade || this.props.year !== nextProps.year || this.props.country !== nextProps.country ){
            return true;
        }
        else{
            return false;
        }
    }
  	componentDidMount() {

  		/*var margin = {top: 50, right: 0, bottom: 0, left: 0},
			width = 700 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;*/
		//console.log('sankey width', +d3.select('#section2').style('width').slice(0, -2))
		var margin = {top: 50, right: 0, bottom: 0, left: 0},
			width = +d3.select('#section2').style('width').slice(0, -2) * 0.65 - margin.left - margin.right,
			height = +d3.select('#section2').style('height').slice(0, -2) *0.7 - margin.top - margin.bottom;

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
    		this.setData(data).then(()=>{
    			this.setState({
    				data:data
    			})
    			this.drawChart()
    		});
    	}.bind(this))
    	window.addEventListener('resize', this.upDate)
  	}
  	componentDidUpdate(){
  		this.setData(this.state.data).then(()=>{
			this.upDate()
			this.upDateTitle()
		});
		
  	}


  	setData(data) {
			return new Promise(resolve=>{
				var countries = data.filter(d=>d.Trade == this.props.trade && d.Year == this.props.year).sort((a,b)=>{ return b.Value-a.Value }).slice(0,10).map(d=>d.Country)
				this.setState({
					countries: countries
				})
				d3.csv(categoryData,function(d){
					var year = this.props.year
					if(d.Trade == this.props.trade && countries.includes(d.Reporter) )
					return {
						Reporter : d.Reporter,
						Partner : d.Partner,
						Product : d.Product,
						Trade : d.Trade,
						Value : +d[year],
						Year: year
					}
				}.bind(this)).then(function(category){
					this.setState({
						category: category
					})
					resolve('ture')
				}.bind(this))
				
			})
	}

	drawChart(){

		var category = this.state.category.filter(d=>d.Product == 'AllProducts')
		this.createSankeyJson(category).then(sankeydata=>{
			//console.log(sankeydata)
			var trade = this.props.trade
			var width = this.state.width,
				height = this.state.height,
				margin = this.state.margin

			var formatNumber = d3.format(",.0f"),
			    format = function(d) { return formatNumber(d) + " TWh"; },
			    color = d3.scaleOrdinal(["#191970","#000080","#00008B","#0000CD","#0000FF","#4169E1","#6495ED","#1E90FF","#00BFFF","#87CEFA"]);

			var svg = d3.select("#sankey-container")
				.append('svg')
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			    .attr('id','sankey-svg')

			d3.select("#sankey-container")
				.append('canvas')
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			    .attr('id','sankey-canvas')

			// var sankey = Sankey()
			//     .nodeWidth(15)
			//     .nodePadding(10)
			//     .size([width, height]);
			var sankey = this.state.sankey

			var path = sankey.link();

			var freqCounter = 1;


			sankey.nodes(sankeydata.nodes)
				.links(sankeydata.links)
				.layout(32);

			var div = d3.select('.tooltip')

			var link = svg.selectAll(".link")
			    .data(sankeydata.links)
			    .enter()
			    .append("path")
			  	.attr("class", "link")
				.attr("d", path)
				.attr('id', function(d){ return d.source.name})
				.style('fill','none')
				.style('stroke','#000')
				.style('stroke-opacity',0.05)
				.attr("stroke-width", function(d) { return Math.max(1, d.dy); })
				.on("click", function() {
					setCountry(this.id)
				})
				.on("mouseover", function(d){
					d3.selectAll('#'+this.id)
				    	.style('stroke-opacity',0.25)
					
					div.style("opacity", .9)
						.style('z-index',10)
					div.html(d.source.name + ' to ' + d.target.name+ '<br>'+'Value: ' + convert(d.value))

					function convert(labelValue) {
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
				})
				.on("mousemove", ()=>{
					div.style("left", (d3.event.pageX + 10) + "px")
						.style("top", (d3.event.pageY - 10) + "px")
				})              
				.on("mouseleave",function(d){
					d3.selectAll('#'+this.id)
				    	.style('stroke-opacity',0.05)

					div.style("opacity", 0)
						.style('z-index',-10)
				    
				})

			
			var rect = svg.selectAll("rect")
			  	.data(sankeydata.nodes)
			    .enter()

			var text = svg.selectAll("text")
			  	.data(sankeydata.nodes)
			    .enter()
			    //.append("g")
				//.attr("class", "node")
				//.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


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

			var setCountry = (e)=> {
				/*console.log('set country')
				if(this.state.count == 0){
					this.setState({
						country: e,
						count:1,
						piechartshow:1
					},this.drawPieChart)
				}
				else{
					this.setState({
						country: e
					})
				}*/
				this.props.countryStatus(e)
			}


			var linkExtent = d3.extent(sankeydata.links, function (d) {return d.value});
			var frequencyScale = d3.scaleLinear().domain(linkExtent).range([1,100]);
			var particleSize = d3.scaleLinear().domain(linkExtent).range([1,5]);


			sankeydata.links.forEach(function (link) {
				link.freq = frequencyScale(link.value);
				link.particleSize = particleSize(link.value);
				link.particleColor = d3.scaleLinear().domain([0,1000]).range([link.source.color, link.target.color]);
			})

			var t = d3.timer(tick, 2000);
			var particles = [];

			function tick(elapsed, time) {
			    particles = particles.filter(function (d) {return d.time > (elapsed - 2000)});

			    if (freqCounter > 200) {
			      	freqCounter = 1;
			    }

			    d3.selectAll("path.link")
			    	.each(function (d) {
		        		if (d.freq >= freqCounter) {
			          		var offset = (Math.random() - .5) * d.dy;
			          		particles.push({link: d, time: elapsed, offset: offset, path: this})
			        	}
			      	});
			    	particleEdgeCanvasPath(elapsed);
			    	freqCounter++;
			}

			function particleEdgeCanvasPath(elapsed) {
			    var context = d3.select("canvas").node().getContext("2d")

			    context.clearRect(0,0,2000,2000);

			      	context.fillStyle = "gray";
			      	context.lineWidth = "1px";
			    for (var x in particles) {
			        var currentTime = elapsed - particles[x].time;
			        var currentPercent = currentTime / 2000 * particles[x].path.getTotalLength();
			        var currentPos = particles[x].path.getPointAtLength(currentPercent)
			        context.beginPath();
			      	context.fillStyle = particles[x].link.particleColor(currentTime);
			        context.arc(currentPos.x,currentPos.y + particles[x].offset,particles[x].link.particleSize,0,2*Math.PI);
			        context.fill();
			    }
			}
		})
	}
	upDate(){
		console.log('sankey update')
		//d3.select('#sankey-discription-container').style('height',+d3.select('#section2').style('width').slice(0, -2) * 0.3)
		var trade = this.props.trade
		var category = this.state.category.filter(d=>d.Product == 'AllProducts')
		this.createSankeyJson(category).then(sankeydata=>{
			//console.log('sankey update width',+d3.select('#section2').style('width').slice(0, -2))
			var margin = {top: 50, right: 0, bottom: 0, left: 0},
				width = +d3.select('#section2').style('width').slice(0, -2) * 0.65 - margin.left - margin.right,
				height = +d3.select('#section2').style('height').slice(0, -2) *0.7 - margin.top - margin.bottom;

			    // width = 1000 - margin.left - margin.right,
			    // height = 500 - margin.top - margin.bottom;

			d3.select("#sankey-svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)

			d3.select("#sankey-canvas")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)

			console.log(trade)
			var formatNumber = d3.format(",.0f"),
			    format = function(d) { return formatNumber(d) + " TWh"; },
			    color = trade == 'Import'? d3.scaleOrdinal(["#800000","#A52A2A","#B22222","#FF0000","#DC143C","#FFA07A","#FA8072","#F08080","#CD5C5C","#D2691E"]): d3.scaleOrdinal(["#191970","#000080","#00008B","#0000CD","#0000FF","#4169E1","#6495ED","#1E90FF","#00BFFF","#87CEFA"]);
			console.log('color',color('China'))
			var svg = d3.select("#sankey-container")

			//var sankey = this.state.sankey
			var sankey = Sankey()
						    .nodeWidth(15)
						    .nodePadding(10)
						    .size([width, height]);
			var freqCounter = 1;

			sankey.nodes(sankeydata.nodes)
				.links(sankeydata.links)
				.layout(32);

			sankey.relayout();

			var path = sankey.link();

			var link = svg.selectAll(".link").data(sankeydata.links)
			    
			link.transition()
				.duration(1000)
				.attr("d", path)
				.attr("stroke-width", function(d) { return Math.max(1, d.dy); })
				.attr('id', function(d){ return trade=='Export' ? d.source.name:d.target.name})
				//.sort(function(a, b) { return b.dy - a.dy; })
				

			link.enter()
			    .append("path")
			    .attr("class", "link")
				.attr("d", path)
				.attr('id', function(d){ return trade=='Export' ? d.source.name:d.target.name})
				.attr("stroke-width", function(d) { return Math.max(1, d.dy); })
				//.sort(function(a, b) { return b.dy - a.dy; })
				

			
			var rect = svg.selectAll("#sankey-rect")
			  	.data(sankeydata.nodes)


			var text = svg.selectAll("#sankey-text")
			  	.data(sankeydata.nodes)
				//.attr("class", "node")
				//.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


			rect.transition()
				.duration(1000)
				.attr('x',function(d){ return d.x })
				.attr('y',function(d){ return d.y })
				.attr("height", function(d) { return d.dy; })
				//.attr("width", sankey.nodeWidth())
				.style("fill", function(d) { return d.color = color(d.name);})
				/*.attr("stroke", "none")
				.append("title")*/
				.text(function(d) { return d.name + "\n" + format(d.value); });

			text.transition()
				.duration(1000)
				.attr('x',function(d){ return d.x-6 })
				.attr('y',function(d){ return d.y + (d.dy / 2) })
				.attr("dy", ".35em")
				.attr("text-anchor", "end")
				.attr("transform", null)
				.text(function(d) { return d.name; })
				.filter(function(d) { return d.x < width / 2; })
				.attr("x", 6 + sankey.nodeWidth())
				.attr("text-anchor", "start");

			rect.enter()
				.append("rect")
				.transition()
				.duration(1000)
				.attr('id','sankey-rect')
				.attr('x',function(d){ return d.x })
				.attr('y',function(d){ return d.y })
				.attr("height", function(d) { return d.dy; })
				.attr("width", sankey.nodeWidth())
				//.style("fill", function(d) { return d.color = color(d.name); })
				.style("fill", function(d) { return d.color = color(d.name);})
				.style("stroke", "none")
				//.append("title")
				//.text(function(d) { return d.name + "\n" + format(d.value); });

			text.enter()
				.append("text")
				.transition()
				.duration(1000)
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

			rect.exit()
				.remove();

			text.exit()
				.remove();

			link.exit()
				.remove();

			var linkExtent = d3.extent(sankeydata.links, function (d) {return d.value});
			var frequencyScale = d3.scaleLinear().domain(linkExtent).range([1,100]);
			var particleSize = d3.scaleLinear().domain(linkExtent).range([1,5]);


			sankeydata.links.forEach(function (link) {
				link.freq = frequencyScale(link.value);
				link.particleSize = particleSize(link.value);
				link.particleColor = d3.scaleLinear().domain([0,1000]).range([link.source.color, link.target.color]);
			})

			var t = d3.timer(tick, 2000);
			var particles = [];

			function tick(elapsed, time) {
			    particles = particles.filter(function (d) {return d.time > (elapsed - 2000)});

			    if (freqCounter > 200) {
			      	freqCounter = 1;
			    }

			    d3.selectAll("path.link")
			    	.each(function (d) {
		        		if (d.freq >= freqCounter) {
			          		var offset = (Math.random() - .5) * d.dy;
			          		particles.push({link: d, time: elapsed, offset: offset, path: this})
			        	}
			      	});
			    	particleEdgeCanvasPath(elapsed);
			    	freqCounter++;
			}

			function particleEdgeCanvasPath(elapsed) {
			    var context = d3.select("canvas").node().getContext("2d")

			    context.clearRect(0,0,2000,2000);

			      	context.fillStyle = "gray";
			      	context.lineWidth = "1px";
			    for (var x in particles) {
			        var currentTime = elapsed - particles[x].time;
			        var currentPercent = currentTime / 2000 * particles[x].path.getTotalLength();
			        var currentPos = particles[x].path.getPointAtLength(currentPercent)
			        context.beginPath();
			      	context.fillStyle = particles[x].link.particleColor(currentTime);
			        context.arc(currentPos.x,currentPos.y + particles[x].offset,particles[x].link.particleSize,0,2*Math.PI);
			        context.fill();
			    }
			}
		})
		
    }

	createSankeyJson(category){
		return new Promise(resolve=>{
			//console.log(category)

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

			data['nodes'] = temp

			if(index['China'] > index['Germany']){
				var c = index['Germany']
				index['Germany'] = index['China']
				index['China'] = c

				var d = data['nodes'][index['Germany']]
				data['nodes'][index['Germany']] = data['nodes'][index['China']]
				data['nodes'][index['China']] = d
			}
			if(index['United-States'] > index['Germany']){
				var c = index['Germany']
				index['Germany'] = index['United-States']
				index['United-States'] = c

				var d = data['nodes'][index['Germany']]
				data['nodes'][index['Germany']] = data['nodes'][index['United-States']]
				data['nodes'][index['United-States']] = d
			}
			var chinaIndex = index['China']
			var usIndex = index['United-States']


			temp = []

			//category.forEach(d=>temp.push({"source":index[d.Reporter],"target":index[d.Partner],"value":d.Value}))
			for(i=0 ; i < category.length; i++){
				var source = index[category[i].Reporter]
				if(source==chinaIndex){
					source = 11
				}
				else if(source==usIndex){
					source = 10
				}
				temp.push({"source":source,"target":index[category[i].Partner],"value":category[i].Value})
			}
			
			//temp.push({"source":12,"target":index['China'],"value":category[i].Value})
			//temp.push({"source":13,"target":index['United-States'],"value":category[i].Value})
			
			data['links'] = temp

			//console.log(data,index)

			//data['links'] = data['links'].filter(d=>d.source != 0 && d.source != 1)
			//console.log(data)
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

	upDateTitle(){
		d3.select('#year').html(this.props.year)
		d3.select('#trade').html( ' '+this.props.trade)
		if(this.props.trade =='Import'){
			d3.select('#direction').html('from')
		}else{
			d3.select('#direction').html('to')
		}
	}


	render(){
		return(

			<div id='sankey'>

				<div id='sankey-discription-container'>
					<h2><span id='year'>{this.props.year} </span><span id='trade'>{this.props.trade}</span> Flow <span id='direction'>to</span> U.S. & China</h2>
					<p>Sankey diagram shows how the trade flow from the top 10 countries (with the highest trade value) to the U.S. and China.<br></br>The donut chart(s) will show the breakdown trade information by category.</p> {/*The top donut chart<br></br> is a trade value breakdown by category, from each country to the U.S., the bottom donut chart shows the same trade information for China.</p>*/} 
					<div id='instruction-box'><p>Instruction: Choose Year, Trade(Export/Import), Country on sidebar, the trading flow will be shown <br></br> on the sankey diagram, donut chart(s) will show the breakdown trade information by category.</p></div>
				</div>
				
				<div id='sankey-container'></div>  
				<Pie year={this.props.year} trade={this.props.trade} country={this.props.country}/>
			</div>
		)
	}

}