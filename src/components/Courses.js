import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

//this component renders a list of all availables courses on one page.
class Courses extends Component {

  render() {

    const courses = this.props.courses.map(course => {
      return (
        <NavLink 
          className="course--module course--link" 
          to={`/courses/${course.id}`} key={course.id}>
          <h2 className="course--label">Course</h2>
          <h3 className="course--title">{course.title}</h3>
        </NavLink>
      )
    })

    return (
      <div className="wrap main--grid">
        {courses}
        <NavLink className="course--module course--add--module" to="/courses/create">
          <span className="course--add--title">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
              viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon></svg>
              New Course
          </span>
        </NavLink> 
      </div>
    );
  }
}

export default withRouter(Courses);