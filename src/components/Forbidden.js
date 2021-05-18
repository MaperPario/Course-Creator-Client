import React from 'react'

/*
  this functional component is strictly for displaying a page
  letting the user know that they aren't authenticated.
*/
const Forbidden = () =>  {
  return (
    <main>
      <div className="wrap">
        <h2>Forbidden</h2>
        <p>Hey! You can't access this page.</p>
      </div>
    </main>
  )
}

export default Forbidden;
