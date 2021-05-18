import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
//done

export default class UserSignOut extends Component {
  componentDidMount() {
    this.props.onSignOut();
  }
  
  render() {
    return(
      <div>
        <Redirect to="/"/>
      </div>
    );
  }
}