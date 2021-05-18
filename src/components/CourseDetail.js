import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown'
import { NavLink, Link, withRouter } from 'react-router-dom';

//this component is for showing the course information submitted by a user.
class CourseDetail extends Component {

  constructor() {
    super();
    this.state = {
      course: null
    }
  }

  //finds the course upon component mounting based off its id
  async componentDidMount() {
    try {
      const course = await this.getCourseById()
      this.setState({ course })
      if (!course) {
        this.props.history.push('/notfound')
        
        return
      }
    } catch (err) {
      this.props.history.push('/error')
    }
  }

  /*
    function for rendering course detail ui based on if user is logged in
    along with rendering the "Update" and "Delete" links.
    the deleteCourse function gets called upon clicking the "Delete Course" link.
  */
  renderIfLoggedIn = (course) => {
    return (
      <div className="wrap">
        <Link className="button" to={`/courses/${course.id}/update`}>Update Course</Link>
        <NavLink className="button" to="" onClick={(e) => {this.deleteCourse(e)}} >Delete Course</NavLink> 
        <NavLink className="button button-secondary" to="/">Return to List</NavLink>
      </div>
    )
  }

  //function for rendering course detail ui based on if user is logged out. (no update/delete links)
  renderIfLoggedOut = () => {
    return (
        <div className="wrap">
          <NavLink className="button button-secondary" to="/">Return to List</NavLink>
        </div>
    )
  }

  //function for retreiving the courses ID from the API
  getCourseById = async () => {
    const response = await fetch(`https://jackson-course-creator-api.herokuapp.com/api/courses/${this.props.id}`, {
      'Content-Type': 'application/json'
    })
    if (response.status === 500) {
      throw Error('Something happened')
    }

    return await response.json()
  }

  //function that sends a delete request to the api's DELETE path, deleting the course associated with the id.
  deleteCourse = (e) => {
    e.preventDefault();
    const encodedCredentials = this.props.getEncodedCredentials();

    if (!encodedCredentials) {
      this.props.history.push('/signin');
      return
    }
    fetch(`https://jackson-course-creator-api.herokuapp.com/api/courses/${this.props.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${encodedCredentials}`
      }
    })
    .then(response => {

      if (response.status === 500) {
        this.props.history.push('/error')

        return
      }

      if (response.status !== 204) {
        throw new Error();
      }

      try{
        this.props.fetchCourses();
        this.props.history.push('/');
      } catch (err) {
        this.props.history.push('/error')
      }
      
    })
    .catch(err => {
      console.log(err)
      alert('There was an error deleting this course.')
    })
  }
  
  render() {
    if (!this.state.course) {
      return (
        <div>
          ...Loading
        </div>
      )
    }
    const course = this.state.course;

    return (
      <div>
        <div className="actions--bar">
          {this.props.user && this.props.user.id === course.userId ? this.renderIfLoggedIn(course) : this.renderIfLoggedOut()}
        </div>
        <div className="wrap">
          <h2>Course Detail</h2>
          <form>
            <div className="main--flex">
              <div>
                <h3 className="course--detail--title">Course</h3>
                <h4 className="course--name">{course.title}</h4>
                <p>By {course.User.firstName} {course.User.lastName}</p>
                <ReactMarkdown>{course.description}</ReactMarkdown>
              </div>
              <div>
                <h3 className="course--detail--title">Estimated Time</h3>
                <p>{course.estimatedTime}</p>   
                <h3 className="course--detail--title">Materials Needed</h3>
                <ul className="course--detail--list">
                  <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
                </ul>
              </div>
            </div>
          </form>
        </div>
        
      </div>
    );
  }
}

export default withRouter(CourseDetail);