import React from 'react'

//this component strictly renders UI when an invalid URL is trying to be accessed by a user
const NotFound = () =>  {
  return (
    <main>
      <div className="wrap">
        <h2>Not Found</h2>
        <p>Sorry! We couldn't find the page you're looking for.</p>
      </div>
    </main>
  )
}

export default NotFound;
