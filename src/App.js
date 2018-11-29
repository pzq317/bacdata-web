import React, { Component } from 'react';
import './App.css';
//import './test.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WorldMap from './WorldMap'
//import TimeLine from './TimeLine'
//import TradeBtn from './TradeBtn'
import Ranking from './Ranking'
import SparkLines from './SparkLines'
import Value from './Value'
import SankeyGraph from './Sankey'
import Bar from './BarChart'
import Line from './LineChart'
//import SankeyGraph from './SankeyTest'
//import ScrollerAnchor from './ScrollerAnchor'
import ScrollableAnchor,{goToTop, goToAnchor} from 'react-scrollable-anchor'
import Title from './Title'
import SideBar from './SideBar'

class App extends Component {

    constructor(props){
        super(props);
        this.state={
            year:2016,
            trade:'Export',
            Country:'United-States'
        }
        this.yearStatus = this.yearStatus.bind(this);
        this.tradeStatus = this.tradeStatus.bind(this);
        this.countryStatus = this.countryStatus.bind(this);
    }

    yearStatus(year){
        console.log('clicked',year)
        this.setState({
            year:year
        })
    }

    tradeStatus(trade){
        console.log('clicked',trade)
        this.setState({
            trade:trade
        })
    }
    countryStatus(country){
        console.log('clicked',country)
        this.setState({
            country:country
        })
    }
    toTop(){
        goToTop()
    }
    goTo(e){
        goToAnchor(e)
    }

    render() {
        return(
            /*<div className='vis'>
                <div class="sidenav">
                    <a onClick={()=>this.toTop()}>Title</a>
                    <a onClick={()=>this.goTo('section1')}>Section1</a>
                    <a onClick={()=>this.goTo('section2')}>Section2</a>
                    <a onClick={()=>this.goTo('section3')}>Section3</a>
                </div>
                <ScrollableAnchor id={'title'}>
                    <Title onclick={this.goTo}/>
                </ScrollableAnchor>
                <ScrollableAnchor id={'section1'}>
                    <div className='section-1'>
                        <div className='world-container'>
                            <WorldMap year={this.state.year} trade={this.state.trade}/>
                            <Ranking year={this.state.year} trade={this.state.trade}/>
                            <SparkLines year={this.state.year} trade={this.state.trade}/>
                            <Value year={this.state.year} trade={this.state.trade}/>
                        </div>
                    </div>
                </ScrollableAnchor>*/
                    /*<div className='selector'>
                        <TimeLine year={this.state.year} trade={this.state.trade} onClick={this.yearStatus}/>
                        <TradeBtn year={this.state.year} trade={this.state.trade} onClick={this.tradeStatus}/>
                        <button onClick={()=>this.toTop()}>hhhhhh</button>
                        <button onClick={()=>this.goTo('section1')}>1</button>
                        <button onClick={()=>this.goTo('section2')}>2</button>
                        <button onClick={()=>this.toTop()}>3</button>
                    </div>*/
                /*<ScrollableAnchor id={'section2'}>
                    <div className='section-2'>
                        <SankeyGraph year={this.state.year} trade={this.state.trade}/>
                    </div>
                </ScrollableAnchor>
                <ScrollableAnchor id={'section3'}>
                    <div className='section3'>
                    </div>
                </ScrollableAnchor>
            </div>*/
            <div id="wrapper">
                <SideBar goTo={this.goTo} toTop={this.toTop} year={this.state.year} trade={this.state.trade} country={this.state.country} yearStatus={this.yearStatus} tradeStatus={this.tradeStatus} countryStatus={this.countryStatus}/>
                <div id="page-content-wrapper">
                    <Title/>
                    <div className='world-container' id='section1'>
                        <div id='worldmap-text-container'>
                            <div id='worldmap-text'>
                                <h2><span id='year'>{this.state.year} </span><span id='trade'>{this.state.trade}</span> Total Value Rankings by Country</h2>
                                <p>This visualization is an overview of the total trade value around the world from 2006 to 2016<br></br>Ranking of the top 10 countries with the highest trade value is on the right hand side. <br></br>Sparklines show the trend from 2006 to 2016 for the top 10 countries.</p>
                            </div>

                            <div id='instruction-box'><p>Instruction: Choose Year, Trade (Export/Import) on the sidebar to show information</p></div>
                        </div>
                        <WorldMap year={this.state.year} trade={this.state.trade} yearStatus={this.yearStatus} tradeStatus={this.tradeStatus}/>
                        <div id='worldmap-info-container'>
                            <Ranking year={this.state.year} trade={this.state.trade}/>
                            <SparkLines year={this.state.year} trade={this.state.trade}/>
                            <Value year={this.state.year} trade={this.state.trade}/>
                        </div>
                    </div>
                
                
                    <div id='section2'>
                        <SankeyGraph year={this.state.year} trade={this.state.trade} country={this.state.country} yearStatus={this.yearStatus} tradeStatus={this.tradeStatus} countryStatus={this.countryStatus}/>
                    </div>
                    <div id='section3'>
                        <Bar year={this.state.year} trade={this.state.trade} country={this.state.country} />
                    </div>

                    {/*<div id='section4'>
                        <Line year={this.state.year} trade={this.state.trade} country={this.state.country} />
                    </div>*/}
                </div>

            </div>
        )
    }
}

export default App;
