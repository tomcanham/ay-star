import { STATES, Pos } from './PathMap'
import PosMap from './PosMap'
const FibonacciHeap = require('@tyriar/fibonacci-heap').FibonacciHeap

const cost = ([x1, y1], [x2, y2]) => {
  const distX = x1 - x2
  const distY = y1 - y2

  return Math.sqrt((distX * distX) + (distY * distY))
}

const heuristic = ([x1, y1], [x2, y2]) => {
  const distX = Math.abs(x1 - x2)
  const distY = Math.abs(y1 - y2)

  return distX + distY
}

const findPath = async function (cells, setState = () => {}) {
  const posEqual = ([x1, y1], [x2, y2]) => {
    return (x1 === x2) && (y1 === y2)
  }

  const reconstructPath = (cameFrom, current) => {
    while (cameFrom.has(current)) {
      setState(current, STATES.PATH)
      current = cameFrom.get(current)
    }
  }

  let current
  const open = new PosMap()
  const closed = new PosMap()
  const cameFrom = new PosMap()

  const fscore = new FibonacciHeap()
  const gscore = new PosMap()

  const start = cells.start.toXY()
  const goal = cells.end.toXY()

  open.add(start)
  setState(start, STATES.OPEN)
  fscore.insert(cost(start, goal), start)

  gscore.add(start, 0)

  while (!fscore.isEmpty()) {
    const current = fscore.extractMinimum().value

    if (posEqual(current, goal)) {
      return reconstructPath(cameFrom, current)
    }

    open.remove(current)
    closed.add(current)

    if (!posEqual(current, start)) {
      setState(current, STATES.CLOSED)
    } else {
      setState(current, STATES.PATH)
    }

    const pos = new Pos(current)
    const neighbors = cells.around(pos, false).map((pos) => pos.toXY())
    for (const neighbor of neighbors) {
      if (closed.has(neighbor)) {
        continue
      }
      
      // estimated neighbor gscore, by "Manhattan Distance"
      const estimatedNeighborGScore = heuristic(neighbor, goal)

      // The distance from start to a neighbor
      //the "dist_between" function may vary as per the solution requirements.
      const currentGScore = gscore.get(current, Number.POSITIVE_INFINITY)
      const tentativeGScore = currentGScore + estimatedNeighborGScore
      const neighborGScore = gscore.get(neighbor, Number.POSITIVE_INFINITY)

      if (!open.has(neighbor)) {
        open.add(neighbor)
        setState(neighbor, STATES.OPEN)
      }

      if (tentativeGScore >= neighborGScore) {
        continue		// This is not a better path.
      }

      // This path is the best until now. Record it!
      cameFrom.add(neighbor, current)
      gscore.set(neighbor, tentativeGScore)
      fscore.insert(tentativeGScore + cost(neighbor, goal), neighbor)
      setState(neighbor, STATES.TENTATIVE)
    }
  }

  return []
}

export default findPath