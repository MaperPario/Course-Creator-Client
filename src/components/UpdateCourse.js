import React, { Component } from 'react';
import { withRouter } from 'react-router';

//this component allows the user to update a course that belongs to them
class UpdateCourse extends Component {
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

  /*
    finds the course associated with the courses ID from the Course Detail page
    along with filling in the form with the courses exising details.
  */
  componentDidMount() {
    const course = this.props.courses.find(course => {
      return course.id === parseInt(this.props.id)
    });
    if (!course) {
      this.props.history.push('/notfound')

      return
    }

    if (this.props.user.id !== course.userId) {
      this.props.history.push('/forbidden');

      return
    }

    this.setState({
      id: course.id,
      courseTitle: course.title,
      courseAuthor: `${course.User.firstName} ${course.User.lastName}`,
      courseDescription: course.description,
      estimatedTime: course.estimatedTime,
      materialsNeeded: course.materialsNeeded,
      errorMessage: '',
      validationErrorMessages: []
    });
  }

  /*
    function that sends a PUT request to the api allowing the 
    users newly changed information to be set to state.
    Upon updating, the user will be sent to their newly updated course detail page.
  */
  updateCourse = async (e) => {
    e.preventDefault();
    const encodedCredentials = this.props.getEncodedCredentials();

    if (!encodedCredentials) {
      this.props.history.push('/signin');
      return
    }

    try {
      const response = await fetch(`https://jackson-course-creator-api.herokuapp.com/api/courses/${this.props.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${encodedCredentials}`
        },
        body: JSON.stringify({
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

      if (response.status !== 204) {
        throw new Error('Failed to Update Course. Try Again.')
      }
      
      try {
        await this.props.fetchCourses()
        this.props.history.push(`/courses/${this.state.id}`);
      } catch (err) {
        this.props.history.push('/error');
      }

    }
    catch (err) {
      console.log(err)
      alert('There was an error updating this course.')
    }
  }

  /*
    cancel function executes when user clicks the cancel button,
    returning them to the home location.
  */
  cancel = (e) => {
    e.preventDefault();
    this.props.history.push(`/courses/${this.state.id}`);
  }

  render() {

    return (
      <main>
        <div className="wrap">
          <h2>Update Course</h2>

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
                  }}
                />

                <label htmlFor="courseAuthor">Course Author</label>
                <input 
                  id="courseAuthor" 
                  name="courseAuthor"
                  defaultValue={this.state.courseAuthor}
                  readOnly={true}
                />

                <label htmlFor="courseDescription">Course Description</label>
                <textarea 
                  id="courseDescription" 
                  name="courseDescription"
                  value={this.state.courseDescription}
                  onChange={(e) => {
                    this.setState({courseDescription: e.target.value})
                  }}
                />

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
            <button className="button" type="submit" onClick={this.updateCourse}>Update Course</button><button className="button button-secondary" onClick={this.cancel}>Cancel</button>
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

export default withRouter(UpdateCourse);