import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map';
import GoButton from './components/GoButton'

const cells = [
  [true, false, false, false, false, true, false, false, false, false],
  [false, true, false, false, false, true, false, false, false, false],
  [false, false, true, false, false, true, false, false, false, false],
  [false, false, false, true, false, true, false, false, false, false],
  [false, false, false, false, true, true, false, false, false, false],
  [true, false, false, false, false, true, false, false, false, false],
  [false, true, false, false, false, true, false, false, false, false],
  [false, false, true, false, false, true, false, false, false, false],
  [false, false, false, true, false, true, false, false, false, false],
  [false, false, false, false, true, true, false, false, false, false]
]

const start = [0, cells.length - 1]
const end = [cells[0].length - 1, 0]

const onCellChange = (x, y) => {
  if (!(y === start[1] && x === start[0]) && 
  !(y === end[1] && x === end[0])) {
    cells[y][x] = !cells[y][x]
  }
}

const handleClick = () => {
  console.log("GO!")
}

ReactDOM.render(
  <div>
    <Map start={start} end={end} cells={cells} onCellChange={onCellChange} />
    <GoButton onClick={handleClick} />
  </div>,
  document.getElementById('root')
);

module.hot.accept();