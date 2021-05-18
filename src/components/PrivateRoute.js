import React, { Component } from 'react'
import { Redirect, Route } from 'react-router'

/*
  this component uses a ternary to determine if someone if someone is logged in or not
  then either show information available to them, dependent on the Private route or
  send them to the sign in page.
*/
export class PrivateRoute extends Component {
  render() {
    return this.props.user ? this.renderLoggedIn() : this.renderLoggedOut()
  }

  //function that renders information to those who are logged in.
  renderLoggedIn = () => {
    const {children, ...rest} = this.props;
    
    return (
      <Route {...rest}>
        {children}
      </Route>
    )
  }

  //function that sends user to the /signin route to those who are logged out.
  renderLoggedOut = () => {
    return (
      <Redirect to= {{
        pathname:'/signin',
        state: {from: this.props.location}
      }} />
    )
  }
}

export default PrivateRoute
