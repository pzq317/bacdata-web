import React, { Component } from 'react'

export default class Title extends Component {
    componentDidMount() {
        this.drawChart();
    }
    drawChart() {
        //var svg = d3.select('#title')
    }
    render() {
        return (
            /*<div className='title'></div>*/

            /*<div className='title'>
                <span><h1>Trade Overview for China, U.S. & the World</h1></span>
                <span><h4> In 2018, the president of the United States has placed tariffs on billions of dollars’ worth of goods from around the world,<br></br> in particular, China, the second-largest economy in the world. <br></br>Mr. Trump wanted to cut the trade deficit with China - a country he had accused of unfair trade practices since before he became president.<br></br> Up until September 2018, U.S. slapped tariffs on $200 billion of Chinese imports. <br></br>Those tariffs will increase to 25% from 10% at the start of next year unless the two countries agree on a deal. <br></br>China has retaliated by placing tariffs on US agricultural and industrial products, <br></br>from soybeans, pork and cotton to aeroplanes, cars and steel pipes (BBC).</h4></span>
                <span><h4>A global trade war could hurt consumers around the world by making it harder for all companies to operate,<br></br> forcing them to push higher prices onto their customers.</h4></span>
                <span><h4>This project intends to visualize trading value around the world, with a focus on China, U.S.,<br></br> and the trading relationships between other countries with China and U.S.</h4></span>
            </div>*/

            <div className="container-fluid" id='title'>
                <h1>Trade Overview for China, U.S. & the World</h1>
                <br></br>
                <p>In 2018, the president of the United States has placed tariffs on billions of dollars’ worth of goods from around the world, in particular, China, the second-largest economy in the world. Mr. Trump wanted to cut the trade deficit with China - a country he had accused of unfair trade practices since before he became president. Up until September 2018, U.S. slapped tariffs on $200 billion of Chinese imports. Those tariffs will increase to 25% from 10% at the start of next year unless the two countries agree on a deal. China has retaliated by placing tariffs on US agricultural and industrial products, from soybeans, pork and cotton to aeroplanes, cars and steel pipes (BBC).</p>
                <p>The US-China trade war clearly would have broader, lasting effects on the world. It would hurt consumers around the world by making it harder for all companies to operate, forcing them to push higher prices onto their customers. “When you have the world’s two largest economies at odds, that’s a situation where everyone suffers,” Maurice Obstfeld, the International Monetary Fund (IMF) chief economist commented during an interview of a report that projected the global economy. He added that global growth could further drop “close to a percentage point” if the trade war continues.</p>
                <p>This project aims to visualize trading value around the world, with a focus on China, U.S., and the trading relationships between other countries with China and U.S. Navigation bar is on the left, please feel free to scroll down this web page to learn more, or click the video link and the report link for a more comprehensive demonstration of this visulizations.</p>
                <br></br>
                <br></br>
                <a href="">Video link</a>
                <br></br>
                <a href="">Report link</a>
                <br></br>
                <br></br>
                <p>source: https://www.vox.com/2018/10/9/17955106/imf-economy-trump-trade-war-growth<br></br>https://www.bbc.com/news/world-43512098</p>
            </div>
        )
    }
}