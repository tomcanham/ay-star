import React from 'react'
import PropTypes from 'prop-types'
import GoButton from './GoButton'
import { STATES, Pos, PathMap } from '../PathMap'
import findPath from '../findPath'

const cellStyle = {
  border: '1px solid black'
}

const getStateStyle = (state) => {
  switch(state) {
    case STATES.START:
      return { background: 'pink' }

    case STATES.END:
      return { background: 'pink' }

    case STATES.BLOCKED:
      return { background: 'black' }

    case STATES.OPEN:
      return { background: 'blue' }

    case STATES.CLOSED:
      return { background: 'red' }

    case STATES.TENTATIVE:
      return { background: 'yellow' }

    case STATES.PATH:
      return { background: 'green' }

    default:
      return {}
  }
}

class MapCell extends React.Component {
  static propTypes = {
    pos: PropTypes.instanceOf(Pos).isRequired,
    cells: PropTypes.instanceOf(PathMap).isRequired,
    style: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render() {
    const { pos, cells, style, onChange } = this.props
    const state = cells.getState(pos)
    const styleAdd = getStateStyle(state)
    const finalStyle = Object.assign({}, style, styleAdd)
  
    return <span style={finalStyle} title={state} onClick={() => onChange(pos)}>&nbsp;</span>
  }
}

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
  width: '100%'
}

class MapRow extends React.Component {
  static propTypes = {
    cells: PropTypes.instanceOf(PathMap).isRequired,
    rowNumber: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
    onCellChange: PropTypes.func.isRequired
  }

  render() {
    const { cells, rowNumber, style, onCellChange } = this.props
    const { width, height } = cells
  
    const cellObjects = []
    const percent = Math.floor((1 / width) * 100)

    for (let x = 0; x < width; ++x) {
      const style = Object.assign({}, cellStyle, { width: `${percent}%` })
      const pos = new Pos([x, rowNumber])
    
      cellObjects.push(<MapCell
        key={`cell-${x}-${rowNumber}`}
        pos={pos}
        cells={cells}
        style={style}
        onChange={onCellChange} />)
    }

    return <div style={style}>{cellObjects}</div>
  }
}

const mapStyle = {
  display: 'flex',
  flexDirection: 'column'
}

class Map extends React.Component {
  static propTypes = {
    cells: PropTypes.instanceOf(PathMap).isRequired,
    includeDiagonals: PropTypes.bool.isRequired
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async onGoClicked() {
    const { cells, includeDiagonals } = this.props
    let counter = 0
    const setCellState = async (pos, state) => {
      cells.setState(pos, state)

      ++counter
      if (counter % 100 === 0) {
        await this.sleep(1)
        this.forceUpdate()
      }
    }

    await findPath(cells, includeDiagonals, setCellState)
    this.forceUpdate()
  }

  render() {
    const { cells } = this.props
    const onCellChange = (pos) => cells.toggleBlocked(pos)
    const height = cells.height
    const width = cells.width
    const percent = Math.floor((1 / width) * 100)
    const style = Object.assign({}, rowStyle, { height: `${percent}%` })

    let rows = []
    for (let y = 0; y < height; ++y) {
      rows.push(<MapRow
        key={`row-${y}`}
        rowNumber={y}
        cells={cells}
        style={style}
        onCellChange={onCellChange} />)
    }

    return <div>
      <div style={mapStyle}>{rows}</div>
      <GoButton onClick={() => this.onGoClicked()} />
    </div>
  }
}

export default Map;