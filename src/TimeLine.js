import React, { Component } from 'react';


export default class TimeLine extends Component{


	render(){
		return(
			<select value={this.props.year} id='year-selector' onChange={(e)=>this.props.onClick(e.target.value)}>
		  		<option value='2006' >2006</option>
				<option value='2007' >2007</option>
				<option value='2008' >2008</option>
				<option value='2009' >2009</option>
				<option value='2010' >2010</option>
				<option value='2011' >2011</option>
				<option value='2012' >2012</option>
				<option value='2013' >2013</option>
				<option value='2014' >2014</option>
				<option value='2015' >2015</option>
				<option value='2016' >2016</option>
			</select>
		)
	}

}