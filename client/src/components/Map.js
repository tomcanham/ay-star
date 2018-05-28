import React from 'react'
import PropTypes from 'prop-types'

const cellStyle = {
  border: '1px solid black'
}

const MapCell = (props) => {
  const { style, onChange, children } = props

  return children ? 
    <span style={style} onClick={() => onChange()}>{children}</span> : 
    <span style={style} onClick={() => onChange()}>&nbsp;</span>
}

MapCell.propTypes = {
  style: PropTypes.object,
  onChange: PropTypes.func,
  children: PropTypes.any
}

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
  width: '100%'
}

const MapRow = (props) => {
  const { width, rowNumber, cells, style, start, end, onCellChange } = props
  const cellObjects = []
  const percent = Math.floor((1 / width) * 100)

  for (let x = 0; x < width; ++x) {
    let content

    const styleAdd = { width: `${percent}%` }
    if (start[0] === x && start[1] === rowNumber) {
      content = 'START'
      styleAdd.background = 'lime'
    } else if (end[0] === x && end[1] === rowNumber) {
      content = 'END'
      styleAdd.background = 'lime'
    } else if (cells[x]) {
      styleAdd.background = 'silver'
    }
  
    const style = Object.assign({}, cellStyle, styleAdd)

    cellObjects.push(<MapCell
      key={`cell-${x}-${rowNumber}`}
      isBlocked={cells[x]}
      style={style}
      onChange={() => onCellChange(x, rowNumber)}>{content}</MapCell>)
  }

  return <div style={style}>{cellObjects}</div>
}

MapRow.propTypes = {
  width: PropTypes.number,
  rowNumber: PropTypes.number,
  cells: PropTypes.arrayOf(PropTypes.bool),
  style: PropTypes.object,
  start: PropTypes.arrayOf(PropTypes.number),
  end: PropTypes.arrayOf(PropTypes.number),
  onCellChange: PropTypes.func
}

const mapStyle = {
  display: 'flex',
  flexDirection: 'column'
}

class Map extends React.Component {
  static propTypes = {
    cells: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.bool)),
    start: PropTypes.arrayOf(PropTypes.number),
    end: PropTypes.arrayOf(PropTypes.number),
    onCellChange: PropTypes.func
  }

  onCellChange(x, y) {
    this.props.onCellChange(x, y)
    this.forceUpdate()
  }

  render() {
    const { cells, start, end } = this.props
    const height = cells.length
    const width = cells[0].length
    const percent = Math.floor((1 / width) * 100)
    const style = Object.assign({}, rowStyle, { height: `${percent}%` })

    let rows = []
    for (let y = 0; y < height; ++y) {
      rows.push(<MapRow
        key={`row-${y}`}
        width={width}
        rowNumber={y}
        cells={cells[y]}
        style={style}
        start={start}
        end={end}
        onCellChange={(x, y) => this.onCellChange(x, y)} />)
    }

    return <div style={mapStyle}>{rows}</div>
  }
}

export default Map;