import React, { Component } from 'react';
import {NavLink, withRouter} from 'react-router-dom';

//this component handles signing in an already established user.
class UserSignIn extends Component {
  constructor() {
    super();
    this.state = {
      emailAddress: '',
      password: '',
      errorMessage: ''
    };
  }
  
  /* 
    function that signs user in based on previously created
    credentials, along with sending them to the homepage.
  */
  signIn = (e) => {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    e.preventDefault();

    this.props.signIn(this.state.emailAddress, this.state.password)
      .then(() => {
        this.props.history.push(from);
      })
      .catch(err => {
        this.setState({ errorMessage: err.message })
      });
  }

  /*
    cancel function executes when user clicks the cancel button,
    returning them to the home location.
  */
  cancel = (e) => {
    e.preventDefault();
    this.props.history.push('/');
  }
  
  render() {

    return (
        <div className="form--centered">
          <h2>Sign In</h2>
          <form>
            <label htmlFor="emailAddress">Email Address</label>
            <input id="emailAddress" name="emailAddress" type="email" onChange={(e) => {
              this.setState({emailAddress: e.target.value})
            }}/>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" onChange={(e) => {
              this.setState({password: e.target.value})
            }}/>
            <button className="button" type="submit" onClick={this.signIn}>Sign In</button>
            <button className="button button-secondary" onClick={this.cancel}>Cancel</button>
            <p>{this.state.errorMessage}</p>
          </form>
          <p>Don't have a user account? Click here to <NavLink to="/signup">sign up</NavLink>!</p>
        </div>
    );
  }
}

export default withRouter(UserSignIn);