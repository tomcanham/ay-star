import React from 'react'
import ReactDOM from 'react-dom'
import Map from './components/Map'
import findPath from './findPath'
import { STATES, Pos, PathMap } from './PathMap'

const WIDTH = 30
const HEIGHT = 30

const start = new Pos([0, HEIGHT - 1])
const end = new Pos([WIDTH - 1, 0])
const BLOCKFREQUENCY = 0.25
const includeDiagonals = true

//width, height, start, end, blockFrequency = 0.2
const cells = new PathMap(WIDTH, HEIGHT, start, end, BLOCKFREQUENCY)

ReactDOM.render(
  <div>
    <Map cells={cells} />
  </div>,
  document.getElementById('root')
)

module.hot.accept();