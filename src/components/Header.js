import React from 'react';
import { NavLink } from 'react-router-dom';

/*
  this component renders UI at the top of the page
  with Sign Up, Sign In and a Courses link to return to
  the home page. It persists across all routes.
*/
const Header = (props) => {
  function renderLoggedOut() {
    return(
      <header>
        <div className="wrap header--flex">
            <h1 className="header--logo"><NavLink to="/">Courses</NavLink></h1>
            <nav>
                <ul className="header--signedout">
                    <li><NavLink to="/signup">Sign Up</NavLink></li>
                    <li><NavLink to="/signin">Sign In</NavLink></li>
                </ul>
            </nav>
        </div>
      </header>
    )
  }

  function renderLoggedIn() {
    return(
      <header>
        <div className="wrap header--flex">
            <h1 className="header--logo"><NavLink to="/">Courses</NavLink></h1>
            <nav>
                <ul className="header--signedin">
                    <li>Welcome, {`${props.user.firstName} ${props.user.lastName}`}!</li>
                    <li><NavLink to="/signout">Sign Out</NavLink></li>
                </ul>
            </nav>
        </div>
      </header>
    )
  }

  return(
    <div>
      {props.user ? renderLoggedIn() : renderLoggedOut()}
    </div>
  );
}

export default Header;