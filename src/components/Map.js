import React from 'react'
import PropTypes from 'prop-types'
import GoButton from './GoButton'
import { STATES, WALLS, Pos, PathMap } from '../PathMap'
import findPath from '../findPath'
import './Map.css'

const CELL_SIZE = 20
const LINE_THICKNESS = 1

const MapCell = ({color, walls, x, y}) => {
  const w1 = walls & WALLS.NORTH ? 'l' : 'm'
  const w2 = walls & WALLS.EAST ? 'l' : 'm'
  const w3 = walls & WALLS.SOUTH ? 'l' : 'm'
  const w4 = walls & WALLS.WEST ? 'l' : 'm'

  const definition = `M ${x * CELL_SIZE} ${y * CELL_SIZE} ${w1} ${CELL_SIZE} 0 ${w2} 0 ${CELL_SIZE} ${w3} ${-(CELL_SIZE)} 0 ${w4} 0 ${-(CELL_SIZE)}`
  return <g>
    <rect x={`${x * CELL_SIZE}`} y={`${y * CELL_SIZE}`} width={`${CELL_SIZE}`} height={`${CELL_SIZE}`} key={`cell-${x},${y}`} fill={color} />
    <path d={definition} stroke="black" strokeWidth={LINE_THICKNESS} fill="transparent" />
  </g>
}

const getStateStyle = (state) => {
  switch(state) {
    case STATES.START:
      return 'pink'

    case STATES.END:
      return 'pink'

    case STATES.BLOCKED:
      return 'silver'

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

const INITIAL_STATES = [
  STATES.START,
  STATES.END,
  STATES.CLEAR,
  STATES.BLOCKED
]

class Map extends React.Component {
  static propTypes = {
    cells: PropTypes.instanceOf(PathMap).isRequired,
    start: PropTypes.instanceOf(Pos).isRequired,
    end: PropTypes.instanceOf(Pos).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { includeDiagonals: false }
  }

  async solve() {
    const { cells } = this.props
    const { includeDiagonals } = this.state

    const setCellState = async (pos, state) => {
      cells.setState(pos, state)
    }

    const neighbors = ([x, y]) => cells.around([x, y], includeDiagonals).map((pos) => pos.toXY())
    const start = cells.start.toXY()
    const goal = cells.end.toXY()
  
    const path = await findPath({ start, goal, neighbors, setState: setCellState })
    this.setState(Object.assign({}, this.state, { path }))
  }

  unsolve(clearAll = false) {
    const { cells, start, end } = this.props
    const height = cells.height
    const width = cells.width

    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        const state = cells.getState([x, y])
        if (clearAll || !INITIAL_STATES.includes(state)) {
          cells.setState([x, y], STATES.CLEAR)
        }
      }
    }

    cells.setState(start, STATES.START)
    cells.setState(end, STATES.END)
    this.setState(Object.assign({}, this.state, { path: null }))
  }

  rebuild() {
    const { cells } = this.props

    cells.build()
    this.setState(Object.assign({}, this.state, { path: null }))
  }

  getSvgPath(nodes = []) {
    const parts = []
    const root = nodes.shift()
    const [rootX, rootY] = root
    
    // helper function
    const getDelta = ([x1, y1], [x2, y2]) => {
      return `l ${(x2 - x1) * CELL_SIZE} ${(y2 - y1) * CELL_SIZE}`
    }

    parts.push(`M ${rootX * CELL_SIZE + (CELL_SIZE / 2)} ${rootY * CELL_SIZE + (CELL_SIZE / 2)}`)
    let current = root
    for (const node of nodes) {
      const [x1, y1] = current
      const [x2, y2] = node
      parts.push(getDelta([x1, y1], [x2, y2]))
      current = node
    }

    const definition = parts.join(' ')
    return <path d={definition} stroke="purple" strokeWidth={LINE_THICKNESS} strokeDasharray="5,5" fill="transparent" />
  }

  render() {
    const { cells } = this.props
    const height = cells.height
    const width = cells.width

    let rows = []
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        const state = cells.getState([x, y])
        const color = getStateStyle(state)
        const walls = cells.getWalls([x, y])

        rows.push(
          <MapCell
            key={`node-${x}-${y}`}
            color={color}
            x={x}
            y={y}
            walls={walls} />
        )
      }
    }

    let pathElements
    if (this.state.path && this.state.path.length > 0) {
      pathElements = this.getSvgPath(this.state.path)
    }

    return <div className="map-container">
      <div className="map-buttons">
        <GoButton onClick={() => this.solve()} />
        <button className="rebuild-button" onClick={() => this.rebuild()}>Rebuild</button>
      </div>
      <div className="map-image">
        <svg width="100%" height={`${CELL_SIZE * height}px`} xmlns="http://www.w3.org/2000/svg">
          {rows}
          {pathElements}
        </svg>
      </div>
    </div>
  }
}

export default Map;