import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map';
import GoButton from './components/GoButton'

const cells = []

for (let i = 0; i < 50; ++i) {
  const row = []
  for (let j = 0; j < 50; ++j) {
    row.push(Math.random() > 0.8)
  }

  cells.push(row)
}

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