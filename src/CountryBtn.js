import React, { Component } from 'react';


export default class CountryBtn extends Component{

	render(){
		return(
			
			<select id='country-selector' value={this.props.country} onChange={(e)=>this.props.onClick(e.target.value)}>
		  		<option value='United-States' >United-States</option>
		  		<option value='China' >China</option>
		  		<option value='Korea' >Korea</option>
		  		<option value='Germany' >Germany</option>
		  		<option value='Poland' >Poland</option>
		  		<option value='Indonesia' >Indonesia</option>
		  		<option value='Mexico' >Mexico</option>
		  		<option value='Belgium' >Belgium</option>
		  		<option value='Canada' >Canada</option>
		  		<option value='Turkey' >Turkey</option>
		  		<option value='Russia' >Russia</option>
		  		<option value='Italy' >Italy</option>
		  		<option value='Japan' >Japan</option>
		  		<option value='United-Kingdom' >United-Kingdom</option>
		  		<option value='France' >France</option>
		  		<option value='Switzerland' >Switzerland</option>
		  		<option value='Netherlands' >Netherlands</option>
		  		<option value='Spain' >Spain</option>
		  		<option value='India' >India</option>
			</select>

		)
	}

}