import React, { Component } from 'react'
import TimeLine from './TimeLine'
import TradeBtn from './TradeBtn'
import CountryBtn from './CountryBtn'




export default class SideBar extends Component {

    render() {


        return (


            <div id="sidebar-wrapper" >
                <ul className="sidebar-nav">
                    <li className="sidebar-brand">
                        
                    </li>
                    <li>
                        <a onClick={()=>this.props.toTop()}><span>Introduction</span></a>
                    </li>
                    <li>
                        <a onClick={()=>this.props.goTo('section1')}><span>Section1</span></a>
                    </li>
                    <li>
                        <a onClick={()=>this.props.goTo('section2')}><span>Section2</span></a>
                    </li>
                    <li>
                        <a onClick={()=>this.props.goTo('section3')}><span>Section3</span></a>
                    </li>
                    <li>
                        <TimeLine year={this.props.year} trade={this.props.trade} onClick={this.props.yearStatus}/>
                    </li>
                    <li>
                        <TradeBtn year={this.props.year} trade={this.props.trade} onClick={this.props.tradeStatus}/>
                    </li>
                    <li>
                        <CountryBtn year={this.props.year} trade={this.props.trade} country={this.props.country} onClick={this.props.countryStatus}/>
                    </li>
                </ul>
            </div>
        )
    }
}