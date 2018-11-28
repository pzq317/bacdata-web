import React, { Component } from 'react';
import * as d3 from 'd3'
import categoryData from './data/category.csv'
import dd from './data/linechartdata.csv'

export default class Line extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count:0,
            category: [],
            product: []
		}
        this.upDate = this.upDate.bind(this);
        this.drawChart = this.drawChart.bind(this);
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
        this.setData().then((d)=>{
            this.drawChart(d)
            //this.drawCategoryChart()
        })
    }	
	componentDidUpdate() {
        this.setData().then((d)=>{
            this.upDate(d)
            //this.drawCategoryChart()
        })
	}
    setData(data) {
        return new Promise(resolve=>{
            /*d3.csv(categoryData,function(d){
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
                var flags = [],
                    product = [], 
                    l = category.length, 
                    i;
                for( i=0; i<l; i++) {
                    if( flags[category[i].Product]) continue;
                    flags[category[i].Product] = true;
                    product.push(category[i].Product);
                }
                product = product.filter(d=> d!='AllProducts')
                console.log('product',product)

                this.setState({
                    category: category,
                    product: product
                })
                resolve('ture')
            }.bind(this))*/
            /*d3.csv(dd).then(function (data) {

                console.log(data)
                var countries = data.columns.slice(1).map(function(c){
                    return{
                        country: c,
                        value : data.map(function(d){
                            return{
                                year: +d.Year,
                                ap: +d[c]
                            }
                        })
                    }
                })
                console.log(countries)
                resolve(countries)
            })*/

            d3.csv(categoryData).then(function (data) {
                //Change partner
                var dataUS = data.filter(d=>d['Reporter']!='China'&&d['Partner']=='United-States'&&d['Trade']==this.props.trade&&d['Product']=='AllProducts')
                var dataCN = data.filter(d=>d['Reporter']!='United-States'&&d['Partner']=='China'&&d['Trade']==this.props.trade&&d['Product']=='AllProducts')
                console.log(dataUS,dataCN)
                dataUS['value'] = []
                var countriesUS = dataUS.map((d)=>{
                    d['value'] = []
                    for(var i=2016;i>2005;i--){
                        d['value'].push({
                            year: i.toString(),
                            ap:+d[i.toString()]
                        })
                    }
                    return ({
                        country:d['Reporter'],
                        value: d['value']
                    })
                })
                
                 
                //var cc = data.row(function(d) { return {key: d.key}; })
                console.log(countriesUS)
                resolve(countriesUS)
            }.bind(this))

            
        })
    }

	drawChart(countries) {
        console.log('draw line',countries)
        var margin = { top: 10, bottom: 80, left: 80, right: 80 }
        var width = 1000 - margin.left - margin.right;
        var height = 1000 - margin.top - margin.bottom;

        var x = d3.scalePoint().range([width, 0])
        var y = d3.scaleLinear().range([height, 0])
        var z = d3.scaleOrdinal(d3.schemeCategory10)

        x.domain([2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006])
        y.domain([
            //d3.max(countries,function(d){ return d3.max(d.value,function(e){ return e.ap })}),
            d3.min(countries,function(d){ return d3.min(d.value,function(e){ return e.ap })}),
            d3.max(countries,function(d){ return d3.max(d.value,function(e){ return e.ap })})
            
        ])

        z.domain(countries.map(function(d){return d.country}))

        var xAxis = d3.axisBottom(x)
        var yAxis = d3.axisLeft(y)

        var lineAll = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d['year']); })
            .y(function(d) { return y(d['ap']); });

        /*var lineCat = d3.line()
            .x(function(d) { return x(d['year']); })
            .y(function(d) { return y(d['gdp']); });*/

        

        var svg = d3.select('#line')
            .append('svg')
            .attr('width',width + margin.left + margin.right)
            .attr('height',height + margin.top + margin.bottom)
            .append('g')
            .attr('id','line-svg')
            .attr('transform','translate(' +margin.left+ ',' +margin.top+ ')')

        svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append('text')
            .attr('id','text-x')
            .attr("transform", "translate("+(width/2)+",15)")
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .style("text-anchor", "middle")
            .text("Years");

        svg.append("g")
            .attr("class", "yAxis")
            .call(yAxis)
            .selectAll("text")
            .text((d)=>{ return this.convert(d) })

        svg.select('.yAxis')
            .append("text")
            .attr('id','text-y')
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("US Dollars");

        var country = svg.selectAll('.country')
            .data(countries,function(d){ return d.country })
            .enter()
            .append('g')
            .attr('class','country')

        country.append('path')
            .attr('fill','none')
            .attr('class','line')
            .attr('id',function(d){ return 'line-'+d.country })
            .attr('d',function(d){ return lineAll(d.value)})
            .attr('opacity',1)
            .attr('stroke-width',3)
            .style("stroke", function(d) { return z(d.country); })
            .on('mouseover',function(){
                d3.select(this).attr('stroke-width',6);
            })
            .on('mouseout',function(){
                d3.select(this).attr('stroke-width', 3);
            })

        //legend

        /*var g = country.append('g')
            .attr('id',function(d){ return 'legend'+d.country })
            .on("click",function(d){
                //console.log(d3.select('#line-'+d.country).attr('opacity'))
                if(d3.select('#line-'+d.country).attr('opacity') == '0'){
                    d3.select('#line-'+d.country).attr('opacity',1)
                }else if(d3.select('#line-'+d.country).attr('opacity') == '1'){
                    d3.select('#line-'+d.country).attr('opacity',0)
                }
                
            })

        g.append('circle')
            .attr('class','lcircle')
            .attr('cx',width + margin.right/5)
            .attr('cy',function(d,i){ return i*(height/15) })
            .attr('fill', function(d) { return z(d.country); })
            .attr('r',8)

        g.append('text')
            .attr('class','ltext')
            .attr('x',width + margin.right/4)
            .attr('y',function(d,i){ return i*(height/15) })
            .attr("fill", "#000")
            .attr("alignment-baseline","middle")
            .text(function(d){ return d.country })*/

	}

	upDate(countries) {
        console.log('update line',countries)
        countries = countries.filter(d=>d!=null)
        var margin = { top: 10, bottom: 80, left: 80, right: 80 }
        var width = 1000 - margin.left - margin.right;
        var height = 1000 - margin.top - margin.bottom;

        var x = d3.scalePoint().range([width, 0])
        var y = d3.scaleLinear().range([height, 0])
        var z = d3.scaleOrdinal(d3.schemeCategory10)

        x.domain([2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006])
        y.domain([
            //d3.max(countries,function(d){ return d3.max(d.value,function(e){ return e.ap })}),
            d3.min(countries,function(d){ return d3.min(d.value,function(e){ return e.ap })}),
            d3.max(countries,function(d){ return d3.max(d.value,function(e){ return e.ap })})
            
        ])

        z.domain(countries.map(function(d){return d.country}))

        var xAxis = d3.axisBottom(x)
        var yAxis = d3.axisLeft(y)

        var lineAll = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d['year']); })
            .y(function(d) { return y(d['ap']); });

        var svg = d3.select('#line-svg')
        
        svg.selectAll('path')
            .data(countries,function(d){
                //console.log(d)
                if(d){
                    return d.country
                } 
            })
            .transition()
            .duration(1000)
            .attr('d',function(d){ return lineAll(d.value)})

        svg.select('.yAxis')
            .transition()
            .duration(1000)
            .call(yAxis)
            .selectAll("text")
            .text((d)=>{ return this.convert(d) })



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


    


	render() {
		return (
            <div>
                <h3>Trade Overview for China, U.S. & the World</h3>
                    
                <p>A global trade war could hurt consumers around the world by making it harder for all companies to operate,<br></br> forcing them to push higher prices onto their customers,This project<br></br>intends to visualize trading value around the world,</p>
                <br></br>
                <div id='lineContainer'>
        			
                    <div id='line'></div>
                </div>
            </div>
		)
	}

}