import React, { Component } from 'react';
import * as d3 from 'd3'
import categoryData from './data/category.csv'
export default class Bar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count:0,
            category: [],
            product: [],
            stateSelect:1
		}
        this.upDate = this.upDate.bind(this);
        this.drawChart = this.drawChart.bind(this);
        this.convert = this.convert.bind(this);
	}

    shouldComponentUpdate(nextProps,nextState){
        if(this.props.trade !== nextProps.trade || this.props.year !== nextProps.year || this.props.country !== nextProps.country || this.state.stateSelect !== nextState.stateSelect){
            return true;
        }
        else{
            return false;
        }
    }
    componentDidMount(){
        this.setData().then(()=>{
            this.drawChart()
            this.drawLegend()
            //this.drawCategoryChart()
        })
        window.addEventListener('resize', this.upDate)
    }	
	componentDidUpdate() {
        this.setData().then(()=>{
            this.upDate()
            this.upDateTitle()
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
                //console.log('product',product)

                this.setState({
                    category: category,
                    product: product
                })
                resolve('ture')
            }.bind(this))
            
        })
    }

	drawChart() {
        console.log('draw bar')

        var dataUS = this.state.category.filter(d => d.Reporter == this.props.country && d.Product != 'AllProducts' && d.Partner == "United-States")
        var dataCN = this.state.category.filter(d => d.Reporter == this.props.country && d.Product != 'AllProducts' && d.Partner == "China")
    
        var cateData = []

        
        
        var margin = { top: 30, bottom: 80, left: 80, right: 30 },
            width = +d3.select('#section3').style('width').slice(0, -2) - margin.left - margin.right,
            height = +d3.select('#section3').style('height').slice(0, -2)*0.7 - margin.top - margin.bottom;
        
        // var width = 1000 - margin.left - margin.right;
        // var height = 500 - margin.top - margin.bottom;

        var svg = d3.select('#bar')
            .append('svg')
            .attr('width',width + margin.left + margin.right)
            .attr('height',height + margin.top + margin.bottom)
            .attr('id','bar-svg-svg')
            .append('g')
            .attr('id','bar-svg')
            .attr('transform','translate(' +margin.left+ ',' +margin.top+ ')')

        svg.select('rect')
            .data(cateData)
            .append('g')

        svg.append('g')
            .attr("class", "yAxis")

        svg.append('g')
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "xAxis")

        svg.append('text')
            .attr('x', width/2)
            .attr('y', height/2)
            .attr('id','ins')
            .text('Please Select a Country')
            .attr('font-size','25')
            .attr("text-anchor", "middle")

        /*var max = d3.max(data,function(d){return d['2017_RuralPopulation']})

        var yAxisScale = d3.scaleLinear()
            .domain([max +20,0])
            .range([0,height])

        var xBarAxisScale = d3.scaleBand()
            .domain(countries)
            .range([0,width])
            .paddingInner(0.05)
            .paddingOuter(0.1)*/

        
	}

	upDate() {
        //console.log('update bar')
        // var margin = { top: 30, bottom: 80, left: 80, right: 30 }
        // var width = 1000 - margin.left - margin.right;
        // var height = 500 - margin.top - margin.bottom;
        var margin = { top: 30, bottom: 80, left: 80, right: 30 },
            width = +d3.select('#section3').style('width').slice(0, -2) - margin.left - margin.right,
            height = +d3.select('#section3').style('height').slice(0, -2)*0.7 - margin.top - margin.bottom;
        
        console.log(width,height)
            //width = +d3.select('#bar').style('width').slice(0, -2) - margin.left - margin.right,
            //height = +d3.select('#bar').style('height').slice(0, -2) - margin.top - margin.bottom;
        d3.select('#ins').remove()

        var colorExport = d3.scaleOrdinal().domain(['United-States','China']).range(["#2166CC","#CC5343"]);

        var dataUS = this.state.category.filter(d => d.Reporter == this.props.country && d.Product != 'AllProducts' && d.Partner == "United-States")
        var dataCN = this.state.category.filter(d => d.Reporter == this.props.country && d.Product != 'AllProducts' && d.Partner == "China")
    
        var cateData = []
        var div = d3.select('.tooltip')
        
        for(var i=0; i<Math.max(dataUS.length, dataCN.length); i++){
            var t = {}
            t['data'] = []
            var total = 0
            if(dataUS.length > 0){
                var temp = {}
                total = total + dataUS[i].Value
                t['Product'] = dataUS[i].Product
                temp['Country'] = dataUS[i].Partner
                temp['Value'] = dataUS[i].Value
                temp['Product'] = dataUS[i].Product
                t['data'].push(temp)
            }
            if(dataCN.length > 0){
                var temp = {}
                total = total + dataCN[i].Value
                t['Product'] = dataCN[i].Product
                temp['Country'] = dataCN[i].Partner
                temp['Value'] = dataCN[i].Value
                temp['Product'] = dataCN[i].Product
                t['data'].push(temp)
            }
            t['total'] = total
            cateData.push(t)
        }
        //console.log(cateData)

        d3.select('#bar-svg-svg')
            .attr('width',width + margin.left + margin.right)
            .attr('height',height + margin.top + margin.bottom)

        var svg = d3.select('#bar-svg')

        var bar_g = svg.selectAll('#bar-g')
            .data(cateData,function(d){return d.Product})

        if(this.state.stateSelect == 2){
            cateData = cateData.sort(this.descNum).slice(0, 10)
        }
        if(this.state.stateSelect == 3){
            cateData = cateData.sort(this.descNum).slice(10, 20)
        }

        var max = d3.max(cateData,function(d){return d['total']})

        var yAxisScale = d3.scaleLinear()
            .domain([max +20,0])
            .range([0,height]);

        var xAxisScale = d3.scaleBand()
            .domain(cateData.map((d)=>{return d.Product}))
            .range([0,width])
            .paddingInner(0.05)
            .paddingOuter(0.1);

        var yAxis = d3.axisLeft(yAxisScale); 
        var xAxis = d3.axisBottom(xAxisScale); 

        var svg = d3.select('#bar-svg')

        var bar_g = svg.selectAll('#bar-g')
            .data(cateData,function(d){return d.Product})

        
        
        console.log('all-update')
        bar_g.selectAll('#cate-r-text')
            .remove()
        bar_g//.attr('transform',function(d){return 'translate(' +xAxisScale(d['Product'])+ ',' +(yAxisScale(d['total']))+ ')'})
            .selectAll('#cate-rect')
            .data(function(d){ return d['data']},function(d){ return d['Country']})
            .transition()
            .duration(1000)
            .attr('x',function(d){return xAxisScale(d['Product'])})
            .attr('y', (d, i )=>{
                var temp = cateData.filter(l=>l['Product']==d['Product'])
                //console.log(temp[0]['data'][0],temp[0]['total'], d)
                return i ? yAxisScale(temp[0]['total'])+(height-yAxisScale(temp[0]['data'][0]['Value'])+1) : yAxisScale(temp[0]['total'])+0
            })
            .attr('height', function(d){ return height - yAxisScale(d['Value'])})
            .attr('width', function(d ,i){ return xAxisScale.bandwidth() })
            .attr('fill', function(d){ return colorExport(d.Country)})

        var tt = bar_g.selectAll('#cate-rect')
            .data(function(d){ 
                //console.log('here rect',d)
                return d['data']},function(d){ return d['Country']})
            .enter()
            .append('rect')
            .attr('id','cate-rect')
            .on("mouseover", function(d){
                div.style("opacity", .9)
                    .style('z-index',10)
                div.html(d.Product + '<br>'+'Value: ' + convert(d.Value))

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
                div.style("opacity", 0)
                    .style('z-index',-10)
                
            })

        tt.attr('x',function(d){return xAxisScale(d['Product'])})
            .attr('y', (d, i )=>{
                var temp = cateData.filter(l=>l['Product']==d['Product'])
                return i ? yAxisScale(temp[0]['total'])+(height-yAxisScale(temp[0]['data'][0]['Value'])+1) : yAxisScale(temp[0]['total'])+0
            })
            .transition()
            .duration(1000)
            .attr('height', function(d){ return height - yAxisScale(d['Value'])})
            .attr('width', function(d ,i){ return xAxisScale.bandwidth() })
            .attr('fill', function(d){ return colorExport(d.Country)})

        bar_g.selectAll('#cate-rect')
            .data(function(d){ return d['data']},function(d){ return d['Country']})
            .exit()
            .remove()

        bar_g.select('#cate-g-text')
            .transition()
            .duration(1000)
            .attr('x',function(d){return xAxisScale(d['Product'])+xAxisScale.bandwidth()/2})
            .attr('y',function(d){return yAxisScale(d['total'])})
            .text((d)=>{return this.convert(d['total'])})
            

        bar_g = svg.selectAll('#bar-g')
            .data(cateData,function(d){return d.Product})

        //initial
        var bar_gg = bar_g.enter()
            .append('g')
            .attr('id','bar-g')
            //.attr('transform',function(d){return 'translate(' +xAxisScale(d['Product'])+ ',' +(yAxisScale(d['total']))+ ')'})

        var t = bar_gg.selectAll('#cate-rect')
            .data(function(d){ return d['data']},function(d){ return d['Country']})
            .enter()
            .append('rect')
            .attr('id','cate-rect')
            .on("mouseover", function(d){
                div.style("opacity", .9)
                    .style('z-index',10)
                div.html(d.Product + '<br>'+'Value: ' + convert(d.Value))

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
                div.style("opacity", 0)
                    .style('z-index',-10)
                
            })


        t.transition()
            .duration(1000)
            .attr('x',function(d){return xAxisScale(d['Product'])})
            .attr('y', (d, i )=>{ 
                console.log('init')
                var temp = cateData.filter(l=>l['Product']==d['Product'])
                return i ? yAxisScale(temp[0]['total'])+(height-yAxisScale(temp[0]['data'][0]['Value'])+1) : yAxisScale(temp[0]['total'])+0
            })
            .attr('height', function(d){ return height - yAxisScale(d['Value'])})
            .attr('width', function(d ,i){ return xAxisScale.bandwidth() })
            .attr('fill', function(d){ return colorExport(d.Country)})
            
            
            //.on('mouseover', tip.show)
            //.on('mouseout', tip.hide)

        
        bar_gg.append('text')
            .transition()
            .duration(1000)
            .attr('id','cate-g-text')
            .text((d)=>{return this.convert(d['total'])})
            .attr('x',function(d){return xAxisScale(d['Product'])+xAxisScale.bandwidth()/2})
            .attr('y',function(d){return yAxisScale(d['total'])})
            .attr('dy','-0.2em')
            .attr('font-size','12')
            .attr("text-anchor", "middle")


        bar_g.exit()
            .remove()

        svg.select('.yAxis')
            .transition()
            .duration(1000)
            .call(yAxis)
            .selectAll("text")
            .text((d)=>{ return this.convert(d) })

        svg.select('.xAxis')
            .transition()
            .duration(1000)
            .call(xAxis)
            .attr("transform", "translate(0," + height + ")")
            .selectAll("text")
            .attr("y", 10)
            .attr("x", 7)
            .attr("dy", ".35em")
            .attr("transform", "rotate(45)")
            .style("text-anchor", "start");


        svg.select('#year')
            .attr('x',width*0.65)
            .text(this.props.year)

        svg.select('#us-r-legend')
            .attr('x', width*0.65)
            .attr('opacity',1)

        svg.select('#cn-r-legend')
            .attr('x',width*0.65)
            .attr('opacity',1)

        svg.select('#us-legend')
            .attr('opacity',1)
            .attr('x',width*0.65 + 30)
            .text( this.props.trade == 'Export' ?  'Value '+ this.props.trade + ' from ' + this.props.country +' to United-States' : 'Value '+ this.props.trade + ' from United-States to ' + this.props.country )

        svg.select('#cn-legend')
            .attr('opacity',1)
            .attr('x',width*0.65 + 30)
            .text( this.props.trade == 'Export' ?  'Value '+ this.props.trade + ' from ' + this.props.country +' to China' : 'Value '+ this.props.trade + ' from China to ' + this.props.country )

        if(this.props.country == "China"){
            svg.select('#cn-r-legend')
                .attr('opacity',0)
            
            svg.select('#cn-legend')
                .attr('opacity',0)
        }else if (this.props.country == "United-States"){
            svg.select('#us-r-legend')
                .attr('opacity',0)
            
            svg.select('#us-legend')
                .attr('opacity',0)
        }

	}
    drawLegend(){
        var svg = d3.select('#bar-svg')

        var margin = { top: 30, bottom: 80, left: 80, right: 30 },
            width = +d3.select('#section3').style('width').slice(0, -2) - margin.left - margin.right,
            height = +d3.select('#section3').style('height').slice(0, -2)*0.7 - margin.top - margin.bottom;
        

        svg.append('rect')
            .attr('id','us-r-legend')
            .attr('x', width*0.65)
            .attr('y', 7)
            .attr('height','25')
            .attr('width','25')
            .attr('fill', "#2166CC")
            .attr('opacity',0)
        
        svg.append('rect')
            .attr('id','cn-r-legend')
            .attr('x', width*0.65)
            .attr('y', 35)
            .attr('height','25')
            .attr('width','25')
            .attr('fill', "#CC5343")
            .attr('opacity',0)
        
        svg.append('text')
            .attr('id','us-legend')
            .attr('x',width*0.65 + 30)
            .attr('y',21)
            .attr('font-size','12')
            .attr("text-anchor", "left")
            //.text('Value '+ this.props.trade + ' from ' + this.props.country +' to United-States')

        
        svg.append('text')
            .attr('id','cn-legend')
            .attr('x',width*0.65 +30)
            .attr('y',50)
            .attr('font-size','12')
            .attr("text-anchor", "left")
            .attr('color', '#CC5343')
            //.text('Value '+ this.props.trade + ' from ' + this.props.country +' to China')
        
        svg.append('text')
            .attr('id','year')
            .attr('x',width*0.65)
            .attr('y',0)
            .attr('font-size','40')
            .attr("text-anchor", "left")
            .attr('color', '#CC5343')
            //.text('2016')
    }
    descNum(a, b) {
        // Use toUpperCase() to ignore character casing
        const ca = a['total']
        const cb = b['total']

        let comparison = 0;
        if (ca > cb) {
            comparison = -1;
        } else if (ca < cb) {
            comparison = 1;
        }
        return comparison;
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

    upDateTitle(){
        d3.select('#country').html(this.props.country)
        if(this.props.trade =='Import'){
            d3.select('#d').html('from')
        }else{
            d3.select('#d').html('to')
        }
    }
    


	render() {
		return (
            <div id='barchart'>
                <div id='bar-discription-container'>
                <h2><span id='country'></span><span id='trade'> {this.props.trade}</span> Category <span id='d'>to</span> U.S. & China</h2>
                
                    
                <p>This bar chart shows the total trade value from the top 10 countries (with the highest trade value) to the U.S. and China by category. Three buttons provide detailed information about the top 10 categories with the highest trade value, the bottom 10 categories with the lowest trade value, and trade value by all 20 categories. The blue bars represent trade value to the U.S., while the red ones represent trade value to China.</p>
                <div id='instruction-box'><p>Instruction: Choose Year, Trade(Export/Import), Country at the sidebar on the left, categorical trade value will be shown in the bar chart.</p></div>
                </div>
                <br></br>
                <div id='barContainer'>
        			<button type="button" id='top5' className="btn btn-secondary" onClick={()=>{this.setState({stateSelect:2})}}>TOP 10</button>
                    <button type="button" id='bot5' className="btn btn-secondary" onClick={()=>{this.setState({stateSelect:3})}}>BOTTOM 10</button>
                    <button type="button" id='all10' className="btn btn-secondary" onClick={()=>{this.setState({stateSelect:1})}}>ALL 20</button>
                    <div id='bar'></div>
                </div>
            </div>
		)
	}

}