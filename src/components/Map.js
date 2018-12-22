import React from 'react'
import PropTypes from 'prop-types'
import GoButton from './GoButton'
import { STATES, Pos, PathMap } from '../PathMap'
import findPath from '../findPath'

const getStateStyle = (state) => {
  switch(state) {
    case STATES.START:
      return 'pink'

    case STATES.END:
      return 'pink'

    case STATES.BLOCKED:
      return 'black'

    case STATES.OPEN:
      return 'blue'

    case STATES.CLOSED:
      return 'red'

    case STATES.TENTATIVE:
      return 'yellow'

    case STATES.PATH:
      return 'green'

    default:
      return 'white'
  }
}

const mapStyle = {
  display: 'flex',
  flexDirection: 'column'
}

class Map extends React.Component {
  static propTypes = {
    cells: PropTypes.instanceOf(PathMap).isRequired
  }

  constructor(props) {
    super(props)
    this.state = { includeDiagonals: true }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async onGoClicked() {
    const { cells } = this.props
    const { includeDiagonals } = this.state

    let counter = 0
    const setCellState = async (pos, state) => {
      cells.setState(pos, state)

      ++counter
      if (false && counter % 10 === 0) {
        await this.sleep(1)
        this.forceUpdate()
      }
    }
    const neighbors = ([x, y]) => cells.around([x, y], false, includeDiagonals).map((pos) => pos.toXY())
    const start = cells.start.toXY()
    const goal = cells.end.toXY()
  
    await findPath({ start, goal, neighbors, setState: setCellState })
    this.forceUpdate()
  }

  handleIncludeDiagonalsChanged(event) {
    const newChecked = event.target.checked

    if (newChecked !== this.state.includeDiagonals) {
      const { cells } = this.props
      cells.clearStates()
      this.setState({ includeDiagonals: newChecked })
    }
  }

  render() {
    const { cells } = this.props
    const { includeDiagonals } = this.state
    const onCellChange = (pos) => cells.toggleBlocked(pos)
    const height = cells.height
    const width = cells.width
    const cellSize = 32

    let rows = []
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        const state = cells.getState([x, y])
        const color = getStateStyle(state)
        rows.push(
          <rect x={`${x * cellSize}`} y={`${y * cellSize}`} width={`${cellSize}`} height={`${cellSize}`} key={`cell-${x},${y}`} fill={color} />
        )
      }
    }

    return <div>
      <div style={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <GoButton onClick={() => this.onGoClicked()} />
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <div style={{flexBasis: '50%'}}>
            <input
              type="checkbox"
              checked={includeDiagonals}
              onChange={(e) => this.handleIncludeDiagonalsChanged(e)} />
            <label>Include diagonals?</label>
          </div>
          <button
            style={{backgroundColor: 'green', fontSize: '1.2rem', height: '50px', borderRadius: '10px'}}
            onClick={() => location.reload()}>Rebuild</button>
        </div>
      </div>
      <div>
        <div style={{ width: `${width * cellSize + 1}px`, height: `${height * cellSize + 1}px` }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width={`${cellSize}`} height={`${cellSize}`} patternUnits="userSpaceOnUse">
                <path d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`} fill="none" stroke="black" stroke-width="2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {rows}
          </svg>
        </div>
      </div>
      <div style={mapStyle}>{rows}</div>
    </div>
  }
}

export default Map;