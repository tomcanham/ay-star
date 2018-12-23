import React from 'react'
import PropTypes from 'prop-types'
import './GoButton.css'

// const style = {
//   flexBasis: '50%',
//   display: 'flex',
//   flexDirection: 'row',
//   justifyContent: 'space-around',
//   width: '99%',
//   margin: '10px',
//   height: '50px',
//   backgroundColor: 'yellow',
//   fontSize: '1.5rem',
//   borderRadius: '10px'
// }

const GoButton = ({ onClick }) => {
  return <button className="go-button" onClick={onClick}>Go!</button>
}

GoButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default GoButton;