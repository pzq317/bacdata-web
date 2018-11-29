import React, { Component } from 'react';
import * as d3 from 'd3'
import categoryData from './data/category.csv'

export default class Pie extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count:0,
            category: []
		}
        this.upDate = this.upDate.bind(this);
        this.drawChart = this.drawChart.bind(this);
        //this.drawCategoryChart = this.drawCategoryChart.bind(this);
        this.convert = this.convert.bind(this);
	}

    shouldComponentUpdate(nextProps){
        if(this.props.trade !== nextProps.trade || this.props.year !== nextProps.year || this.props.country !== nextProps.country){
            return true;
        }
        else{
            return false;
        }
    }
    componentDidMount(){
        this.setData().then(()=>{
            this.drawChart()
            //this.drawCategoryChart()
        })
        window.addEventListener('resize', this.upDate)
    }	
	componentDidUpdate() {
        this.setData().then(()=>{
            this.upDate()
            //this.drawCategoryChart()
        })
	}
    setData(data) {
        return new Promise(resolve=>{
            d3.csv(categoryData,function(d){
                var year = this.props.year
                if(d.Trade == this.props.trade)
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

	drawChart() {

		console.log('draw pie')
        var dataUS = this.state.category.filter(d => d.Reporter == this.props.country && d.Product != 'AllProducts' && d.Partner == "United-States")
        var dataCN = this.state.category.filter(d => d.Reporter == this.props.country && d.Product != 'AllProducts' && d.Partner == "China")
        
       
        //var data = this.props.category.filter(d=>d.Reporter == this.props.country && d.Product != 'AllProducts' && d.Partner == "United-States")
        //console.log(data)
        var margin = { top: 0, bottom: 0, left: 0, right: 0 },
        width = +d3.select('#section2').style('width').slice(0, -2) * 0.35 - margin.left - margin.right,
        height = +d3.select('#section2').style('height').slice(0, -2) *0.35 - margin.top - margin.bottom;

        // var width = 300 - margin.left - margin.right;
        // var height = 300 - margin.top - margin.bottom;

        // Define the div for the tooltip
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        
        var radius = Math.min(width, height) / 2

        console.log(width,height,radius)
        //var colorImport = d3.scaleOrdinal(['#ffffe0', '#ffd59b', '#ffa474', '#f47461', '#db4551', '#b81b34', '#8b0000']);
        var colorExport = d3.scaleOrdinal(["#f0ffff","#cdeafd","#acd5f9","#8fbff2","#75a9e6","#5e94d5","#4682b4"]);

        var pie= d3.pie() //pie generator
            //.sort(null)
            .sort(function (a, b) { return (a.value < b.value) ? -1 : 1; })
            .padAngle(0.005)
            .value(function (d) { return d['Value']; });

        var path = d3.arc()
            .outerRadius(radius*0.9)
            .innerRadius(radius*0.5);

        var label = d3.arc()
            .outerRadius(radius*0.5)
            .innerRadius(radius*0.5)

        function updateTween (d) {
            var i = d3.interpolate(this._current, d);
            this._current = i(0);
            return function(t) {
              return path(i(t));
            };
        }

        var svg1 = d3.select('#pieUS')
            .append('svg')
            .attr('width', width)
            .attr('height', height + margin.bottom)
            .attr('id', 'pieUS-svg-svg')
            .append('g')
            .attr('id', 'pieUS-svg')
            .attr('transform', 'translate(' + (width) / 2 + ',' + (height) / 2 + ')')

        var svg2 = d3.select('#pieCN')
            .append('svg')
            .attr('width', width)
            .attr('height', height + margin.bottom)
            .attr('id', 'pieCN-svg-svg')
            .append('g')
            .attr('id', 'pieCN-svg')
            .attr('transform', 'translate(' + (width) / 2 + ',' + (height) / 2 + ')')

        d3.select('#pieUS-svg-svg').append('text')
            .attr('x', width/2)
            .attr('y', height -10)
            .attr('id','ins')
            .text('Please Select a Country')
            .attr('font-size','15')
            .attr("text-anchor", "middle")
            

        /*var arc1 = svg1.selectAll('.arc')
            //.data(pie(dataUS))
            .enter()
            .append('g')
            .attr('class', 'arc')

        var arc2 = svg2.selectAll('.arc')
            //.data(pie(dataCN))
            .enter()
            .append('g')
            .attr('class', 'arc')

        arc1.append('path')
            .attr('d', path)
            .attr('fill', function (d) {
                return colorExport(d['data'].Value)
            })
            .each(function(d) {
                this._current = d;
            })
            .on("mouseover", function (d) {
                div.html(d['data'].Product + ": <br>" + "$ " + convert(d['data'].Value))
                    .style("opacity", 1);
            })
            .on("mousemove", function () {
                div.style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 10) + "px")
            })
            .on("mouseout", function () {
                div.style("opacity", 0);
            });

        arc2.append('path')
            .attr('d', path)
            .attr('fill', function (d) {
                return colorExport(d['data'].Value)
            })
            .on("mouseover", function (d) {
                div.html(d['data'].Product + ": <br>" + "$ " + convert(d['data'].Value))
                    .style("opacity", 1);
            })
            .on("mousemove", function () {
                div.style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 10) + "px")
            })
            .on("mouseout", function () {
                div.style("opacity", 0);
            });
        */
        var t1 = svg1.append("text")
            .attr('id','con-US')
            //.attr("dy", ".35em")
            .attr("text-anchor", "middle")
        t1.append('tspan')
            .attr('id','from-US')
            .attr("dy", "-1.2em")
            .attr("x", 0)
            

        t1.append('tspan')
            .attr('id','text-US')
            .attr("dy", "1.2em")
            .attr("x", 0)
            

        t1.append('tspan')
            .attr('id','total-US')
            .attr("dy", "1.2em")
            .attr("x", 0)
            

             
        var t2 = svg2.append("text")
            .attr('id','con-CN')
            //.attr("dy", ".35em")
            .attr("text-anchor", "middle") 

        t2.append('tspan')
            .attr('id','from-CN')
            .attr("dy", "-1.2em")
            .attr("x", 0)

        t2.append('tspan')
            .attr('id','text-CN')
            .attr("dy", "1.2em")
            .attr("x", 0)

        t2.append('tspan')
            .attr('id','total-CN')
            .attr("dy", "1.2em")
            .attr("x", 0)

        
	}

	upDate() {
        //console.log(this.state.category,this.props.country)
        console.log('update pie')
        var totalUS = this.state.category.filter(d => d.Reporter == this.props.country && d.Product == 'AllProducts' && d.Partner == "United-States")[0] ? this.convert(this.state.category.filter(d => d.Reporter == this.props.country && d.Product == 'AllProducts' && d.Partner == "United-States")[0]['Value']):'NaN'
        var totalCN = this.state.category.filter(d => d.Reporter == this.props.country && d.Product == 'AllProducts' && d.Partner == "China")[0] ? this.convert(this.state.category.filter(d => d.Reporter == this.props.country && d.Product == 'AllProducts' && d.Partner == "China")[0]['Value']):'NaN'

        var dataUS = this.state.category.filter(d => d.Reporter == this.props.country && d.Product != 'AllProducts' && d.Partner == "United-States")
        var dataCN = this.state.category.filter(d => d.Reporter == this.props.country && d.Product != 'AllProducts' && d.Partner == "China")
        var margin = { top: 0, bottom: 0, left: 0, right: 0 },
            width = +d3.select('#section2').style('width').slice(0, -2) * 0.35 - margin.left - margin.right,
            height = +d3.select('#section2').style('height').slice(0, -2) *0.35 - margin.top - margin.bottom;

        // var width = 250 - margin.left - margin.right;
        // var height = 250 - margin.top - margin.bottom;
        d3.select('#ins').remove()
        var div = d3.select(".tooltip")


        var radius = Math.min(width, height) / 2
        var colorImport = d3.scaleOrdinal(['#ffffe0', '#ffd59b', '#ffa474', '#f47461', '#db4551', '#b81b34', '#8b0000']);
        var colorExport = d3.scaleOrdinal(["#f0ffff","#cdeafd","#acd5f9","#8fbff2","#75a9e6","#5e94d5","#4682b4"]);

        var color = this.props.trade == 'Import'? colorImport : colorExport
        var pie= d3.pie() //pie generator
            .sort(null)
            //.sort(function (a, b) { return (a.value < b.value) ? -1 : 1; })
            .padAngle(0.005)
            .value(function (d) { return d['Value']; });

        var path = d3.arc()
            .outerRadius(radius*0.9)
            .innerRadius(radius*0.5);

        var label = d3.arc()
            .outerRadius(radius*0.5)
            .innerRadius(radius*0.5)

        function arcTween(a) {
            const i = d3.interpolate(this._current, a);
            this._current = i(1);
            return (t) => path(i(t));
        }

        /*function exitTween (d) {
            var end = Object.assign({}, this._current, { startAngle: this._current.endAngle });
            var i = d3.interpolate(d, end);
            return function(t) {
              return path(i(t));
            };
        }*/

        var svg1 = d3.select('#pieUS-svg-svg')
                    .attr('width', width)
                    .attr('height', height)
                    .select('g')
                    .attr('transform', 'translate(' + (width) / 2 + ',' + (height) / 2 + ')')
                    // .style('top',height*0.2)
                    // .style('left',width*0.6)


        var svg2 = d3.select('#pieCN-svg-svg')
                    .attr('width', width)
                    .attr('height', height)
                    .select('g')
                    .attr('transform', 'translate(' + (width) / 2 + ',' + (height) / 2 + ')')
                    // .style('top',height*0.5)
                    // .style('left',width*0.6)

            
        var arc1 = svg1.selectAll('path').data(pie(dataUS))
        var arc2 = svg2.selectAll('path').data(pie(dataCN))

        arc1.attr("d", path)
            .transition().duration(1000).attrTween("d", arcTween)
            .attr("fill", function(d, i) { return color(i); })
            

        arc2.attr("d", path)
            .transition().duration(1000).attrTween("d", arcTween)
            .attr("fill", function(d, i) { return color(i); })

        arc1.enter()
            .append('path')
            .attr("d", path)
            .each(function(d) { this._current = d; })
            .attr("fill", function(d, i) { return color(i); })
            //.attr("d", path)
            .on("mouseover", function (d) {
                div.html(d['data'].Product + ": <br>" + "$ " + convert(d['data'].Value))
                    .style("opacity", .9)
                    .style('z-index',10)
            })
            .on("mousemove", function () {
                div.style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 10) + "px")
            })
            .on("mouseout", function () {
                div.style("opacity", 0)
                    .style('z-index',-10)
            });

        arc2.enter()
            .append('path')
            .attr("fill", function(d, i) { return color(i); })
            .attr("d", path)
            .each(function(d) {this._current = d;})
            .on("mouseover", function(d) {
                div.html(d['data'].Product + ": <br>" + "$ " + convert(d['data'].Value))
                    .style("opacity", 1)
                    .style('z-index',10)
            })
            .on("mousemove", function () {
                div.style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 10) + "px")
            })
            .on("mouseout", function () {
                div.style("opacity", 0)
                    .style('z-index',-10)
            });
        
        arc1.exit()
            .remove()

        arc2.exit()
            .remove()

        d3.select('#from-US').text('US and')
        d3.select('#from-CN').text('CN and')
        d3.select('#text-US').text(this.props.country)
        d3.select('#text-CN').text(this.props.country)
        d3.select('#total-US').text(totalUS)
        d3.select('#total-CN').text(totalCN)
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
	}
    /*drawCategoryChart() {

        var margin = { top: 0, bottom: 30, left: 0, right: 0 }
        var width = 150 - margin.left - margin.right;
        var height = 200 - margin.top - margin.bottom;

        var dataUS = this.state.category.filter(d => d.Reporter == this.props.country && d.Product != 'AllProducts' && d.Partner == "United-States")
        var dataCN = this.state.category.filter(d => d.Reporter == this.props.country && d.Product != 'AllProducts' && d.Partner == "China")
    
        var cateData = []
        var colorExport = d3.scaleOrdinal().domain(['United-States','China']).range(["#2166CC","#CC5343"]);
        var radius = Math.min(width, height) / 2

        var pie= d3.pie()
            .sort(function (a, b) { return (a.Country < b.Country) ? -1 : 1; })
            .padAngle(0.005)
            .value(function (d) { return d['Value']; });

        var path = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(0);

        var div = d3.select("body").append("div")
            .attr("class", "catetooltip")
            .style("opacity", 0);

        for(var i=0; i<Math.max(dataUS.length, dataCN.length); i++){
            var t = {}
            t['data'] = []
            if(dataUS.length > 0){
                var temp = {}
                t['Product'] = dataUS[i].Product
                temp['Country'] = dataUS[i].Partner
                temp['Value'] = dataUS[i].Value
                t['data'].push(temp)
            }
            if(dataCN.length > 0){
                var temp = {}
                temp['Country'] = dataCN[i].Partner
                temp['Value'] = dataCN[i].Value
                t['data'].push(temp)
            }
            cateData.push(t)
        }
        console.log(cateData)

        for(var i=0;i<cateData.length;i++){
            var svg = d3.select('#category-container')
                .append('svg')
                .attr('width', width)
                .attr('height', height + margin.bottom)
                .append('g')
                .attr('id', 'category-pie-svg'+i)
                .attr('transform', 'translate(' + (width) / 2 + ',' + (height) / 2 + ')')

            var arc = svg.selectAll('.arc')
                .data(pie(cateData[i]['data']))
                .enter()
                .append('path')
                .attr('d', path)
                .attr('fill',(d)=> {
                    return colorExport(d['data'].Country)
                })
                .each(function(d) {
                    this._current = d;
                })
                .on("mouseover", (d)=> {
                    div.html("$ " + this.convert(d['data'].Value))
                        .style("opacity", 1);
                })
            svg.append('text')
                //.attr("dy", ".35em")
                .attr("text-anchor", "middle") // text-align: right
                .text(cateData[i]['Product'])
                .attr('y', 60)

        }
    }*/
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


    


	render() {
		return (
            <div id='pieContainer'>
    			<div id='pieUS'></div>
                <div id='pieCN'></div>
                {/*<div id='category-container'></div>*/}
            </div>
		)
	}

}