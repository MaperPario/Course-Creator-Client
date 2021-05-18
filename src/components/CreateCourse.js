import React, { Component } from 'react';
import { withRouter } from 'react-router';

//this component produces a form for creating a couse as a logged in user.
class CreateCourse extends Component {
  constructor() {
    super();
    this.state = {
      courseTitle: '',
      courseAuthor: '',
      courseDescription: '',
      estimatedTime: '',
      materialsNeeded: '',
      errorMessage: '',
      validationErrorMessages: []
    };
  }

  //sets the state of whoever is currently logged in so it can be loaded in the form
  componentDidMount() {
    this.setState({
      courseAuthor: `${this.props.user.firstName} ${this.props.user.lastName}`
    })
  }

  /*
    function that sends a post request to the api with information input
    into each field on the form upon clicking the "Create Course" button
    along with sending the user to a new course detail page containing
    the information they just submitted.
  */
  createCourse = async (e) => {
    e.preventDefault();
    
    const encodedCredentials = this.props.getEncodedCredentials();

    if (!encodedCredentials) {
      this.props.history.push('/signin');
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${encodedCredentials}`
        },
        body: JSON.stringify({
          userId: this.props.user.id,
          title: this.state.courseTitle,
          description: this.state.courseDescription,
          estimatedTime: this.state.estimatedTime,
          materialsNeeded: this.state.materialsNeeded
        }),
      })

      if (response.status === 400) {
        const json = await response.json();
        this.setState({ validationErrorMessages: json.errors });

        return;
      }

      if (response.status === 500) {
        this.props.history.push('/error')

        return
      }

      if (response.status !== 201) {
        throw new Error('Error Creating Course');
      }

      //use location header to redirect to new course's detail page
      for (let [key, value] of response.headers.entries()) {
        if (key === 'location') {
          try {         
            await this.props.fetchCourses()
            this.props.history.push(value);
          } catch (err) {
            this.props.history.push('/error');
          }
        }
      }
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
        <div className="wrap">
        <h2>Create Course</h2>

        { this.renderValidationErrors() }

          <form>
            <div className="main--flex">
              <div>
                <label htmlFor="courseTitle">Course Title</label>
                <input 
                  id="courseTitle" 
                  name="courseTitle"
                  value={this.state.courseTitle}     
                  onChange={(e) => {
                    this.setState({courseTitle: e.target.value})
                  }}/>

                <label htmlFor="courseAuthor">Course Author</label>
                <input 
                  id="courseAuthor" 
                  name="courseAuthor"
                  readOnly={true}
                  defaultValue={this.state.courseAuthor}
                />
                <label htmlFor="courseDescription">Course Description</label>
                <textarea 
                  id="courseDescription" 
                  name="courseDescription"
                  value={this.state.courseDescription}
                  onChange={(e) => {
                    this.setState({courseDescription: e.target.value})
                  }}/>
              </div>
              <div>
                <label htmlFor="estimatedTime">Estimated Time</label>
                <input 
                  id="estimatedTime" 
                  name="estimatedTime"
                  value={this.state.estimatedTime}
                  onChange={(e) => {
                    this.setState({estimatedTime: e.target.value})
                  }}/>

                <label htmlFor="materialsNeeded">Materials Needed</label>
                <textarea 
                  id="materialsNeeded" 
                  name="materialsNeeded"
                  value={this.state.materialsNeeded}
                  onChange={(e) => {
                    this.setState({materialsNeeded: e.target.value})
                  }}/>
              </div>
            </div>
            <button className="button" type="submit" onClick={this.createCourse}>Create Course</button>
            <button className="button button-secondary" onClick={this.cancel}>Cancel</button>
          </form>
        </div>
      </main>
    )
  }

  renderValidationErrors = () => {
    if (!this.state.validationErrorMessages.length) {
      return null;
    }

    return (
      <div className="validation--errors">
        <h3>Validation Errors</h3>
          <ul>
            { this.state.validationErrorMessages.map((errorMessage, index) => (<li key={index}>{errorMessage}</li>)) }
          </ul>
      </div>
    )
  }
}

export default withRouter(CreateCourse);