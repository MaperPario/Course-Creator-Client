import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

//this component handles signing up a new user
class UserSignUp extends Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      validationErrorMessages: []
    };
  }

  /*
    function that sends a POST request to the api, sending the
    information entered into the form fields and, including a custom
    validationErrorMessage for if the passwords entered don't match,
    preventing users from making a mistake in making a new account.
    Immediately after sign up, the user is signed in with the
    email and password they created so they don't have to return
    to the sign in screen to sign in.
  */
  onSubmit = async (e) => { 
    e.preventDefault();

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        validationErrorMessages: [
          'Passwords do not match.'
        ]
      })

      return;
    }

    try {
      const signUpResponse = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          emailAddress: this.state.emailAddress,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        })
      });

      if (signUpResponse.status === 500) {
        this.props.history.push('/error')

        return
      }

      if (signUpResponse.status === 400) {
        const json = await signUpResponse.json();
        this.setState({ validationErrorMessages: json.errors });

        return;
      }

      if (signUpResponse.status !== 201) {
        throw new Error('Error signing up.');
      }
    
      await this.props.signIn(this.state.emailAddress, this.state.password)
      this.props.history.push('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
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
    <main>
      <div className="form--centered">
        <h2>Sign Up</h2>

        <form>
          <label htmlFor="firstName">First Name</label>
          <input 
            id="firstName" 
            name="firstName" 
            type="text" 
            onChange={(e) => {
              this.setState({firstName: e.target.value})
            }}/>
          <label htmlFor="lastName">Last Name</label>
          <input 
            id="lastName"
            name="lastName" 
            type="text"
            onChange={(e) => {
              this.setState({lastName: e.target.value})
            }}/>
          <label htmlFor="emailAddress">Email Address</label>
          <input
            id="emailAddress" 
            name="emailAddress" 
            type="email"
            onChange={(e) => {
              this.setState({emailAddress: e.target.value})
            }}/>
          <label htmlFor="password">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password"
            onChange={(e) => {
              this.setState({password: e.target.value})
            }}/>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            id="confirmPassword" 
            name="confirmPassword" 
            type="password"
            onChange={(e) => {
              this.setState({confirmPassword: e.target.value})
            }}/>
            
        <button className="button" type="submit" onClick={this.onSubmit}>Sign Up</button>
        <button className="button button-secondary" onClick={this.cancel}>Cancel</button>

        <p>{this.state.errorMessage}</p>

        { this.renderValidationErrors() }

        </form>

        <p>Already have a user account? Click here to <NavLink to="/signin">sign in</NavLink>!</p>
      </div>
    </main> 
    );
  }

  renderValidationErrors = () => {
    if (!this.state.validationErrorMessages.length) {
      return null;
    }

    return (
      <ul>
        { this.state.validationErrorMessages.map((errorMessage, index) => (<li key={index}>{errorMessage}</li>)) }
      </ul>
    )
  }
}

export default withRouter(UserSignUp);