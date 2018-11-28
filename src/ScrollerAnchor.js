import React, { Component } from 'react'
import ScrollableAnchor from 'react-scrollable-anchor'
 
export default class ScorllerAnchor extends Component {
  render() {
    return (
      <div>
        <a href='#section1'> Go to section 1 </a>
        <a href='#section2'> Go to section 2 </a>
        <ScrollableAnchor id={'section-1'}>
          <div> Hello World </div>
        </ScrollableAnchor>
        <ScrollableAnchor id={'section-2'}>
          <div> How are you world? </div>
        </ScrollableAnchor>
      </div>
    )
  }
}