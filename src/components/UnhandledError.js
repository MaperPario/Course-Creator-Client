import React from 'react'

//this component is strictly for rendering UI when the server has an unexpected 500 error.
const UnhandledError = () =>  {
  return (
    <main>
      <div className="wrap">
        <h2>Error</h2>
        <p>Sorry! We just encountered an unexpected error.</p>
      </div>
    </main>
  )
}

export default UnhandledError;
