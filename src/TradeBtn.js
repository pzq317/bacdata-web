import React, { Component } from 'react';


export default class TimeLine extends Component{

	render(){
		return(
			
			<select id='trade-selector' value={this.props.trade} onChange={(e)=>this.props.onClick(e.target.value)}>
		  		<option value='Import' id='import'>Import</option>
		  		<option value='Export' id='export'>Export</option>
			</select>
			

		)
	}

}