import React, { Component } from 'react';

import Cookies from 'js-cookie';

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import Courses from './components/Courses'
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import CourseDetail from './components/CourseDetail';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      courses: [],
      users: [],
      loading: true,
      user: Cookies.getJSON('authenticatedUser') || null,
      loadError: false
    };
  }

  signIn = (emailAddress, password) => {
    const encodedCredentials = btoa(`${emailAddress}:${password}`)
    return fetch('https://jackson-course-creator-api.herokuapp.com/api/users', {
      headers: {
        Authorization: `Basic ${encodedCredentials}`
      }
    })
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Failed to Sign In User. Try Again.')
      }
      return response;
    })
    .then(response => response.json())
    .then(user => {
      this.onSignInSuccess(user, password);
    })
  }

  getEncodedCredentials = () => {
    if (!this.state.user) {
      return null
    }
    return btoa(`${this.state.user.email}:${this.state.user.password}`);
  }

  onSignInSuccess = (user, password) => {
    user.password = password
    this.setState({
      user
    })
    const cookieOptions = {
      expires: 1 // 1 day
    };
    Cookies.set('authenticatedUser', JSON.stringify(user), cookieOptions);
  }

  onSignOut = () => {
    this.setState({
      user: null,
      password: null
    })
    Cookies.set('authenticatedUser', null)
  }

  fetchCourses = async () => {
    const response = await fetch('https://jackson-course-creator-api.herokuapp.com/api/courses')

    if (response.status === 500) {
      throw Error('There was a problem with your request. Try again.')
    }
    
    const courses = await response.json();
    this.setState({ courses, loading: false });

    return response
  }

  async componentDidMount() {
    try {
      await this.fetchCourses();
    } catch (err) {
      this.setState({ loadError: true })
    }
  }
  
  render() {
    if(this.state.loadError) {
      return (
        <Router>
          <Redirect to='/error' />
          <Route path="/error" component={UnhandledError} />
        </Router>
      )
    }
    
    if (this.state.loading) {
      return (
        <div>
          Loading...
        </div>
      )
    }

    return (
      <Router>
        <div>
        <Header user={this.state.user} />
          <Switch>
            <Route exact path="/" render={() => (
              <Courses 
                courses={this.state.courses}
                getEncodedCredentials={this.getEncodedCredentials}  
              />)}
            />
            <PrivateRoute user={this.state.user} exact path="/courses/create" render={() => (
              <CreateCourse 
                courses={this.state.courses}
                user={this.state.user}
                fetchCourses={this.fetchCourses}
                getEncodedCredentials={this.getEncodedCredentials}
              />)} 
            />
            <PrivateRoute user={this.state.user} exact path="/courses/:id/update" render={({match}) => (
              <UpdateCourse 
                courses={this.state.courses}
                user={this.state.user}
                id={match.params.id} 
                fetchCourses={this.fetchCourses} 
                getEncodedCredentials={this.getEncodedCredentials}  
              />)}
            />
            <Route exact path="/courses/:id" render={({match}) => (
              <CourseDetail 
                courses={this.state.courses} 
                id={match.params.id}
                user={this.state.user}
                getEncodedCredentials={this.getEncodedCredentials}
                fetchCourses={this.fetchCourses}
              />)} 
            />
            <Route exact path="/signin" render={() => (
              <UserSignIn signIn={this.signIn}/>
            )} />
            <Route exact path="/signup" render={() => (
              <UserSignUp signIn={this.signIn}/>
            )} />
            <Route exact path="/signout" render={() => (
              <UserSignOut onSignOut={this.onSignOut}/>
            )} />
            <Route path="/forbidden" component={Forbidden} />
            <Route path="/error" component={UnhandledError} />
            <Route component={NotFound}/>
          </Switch>
        </div>
      </Router>

    );
  }
}


