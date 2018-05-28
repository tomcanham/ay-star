import React from 'react'
import PropTypes from 'prop-types'

const style = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  width: '99%',
  margin: '10px',
  height: '50px',
  backgroundColor: 'yellow',
  fontSize: '2rem'
}

const GoButton = (props) => {
  const { onClick } = props

  return <button style={style} onClick={onClick}>Go!</button>
}

export default GoButton;