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

const findPath = async function ({ start,
  goal,
  neighbors,
  includeDiagonals = true, 
  setState = async () => {}
}) {
  const posEqual = ([x1, y1], [x2, y2]) => {
    return (x1 === x2) && (y1 === y2)
  }

  const reconstructPath = async (cameFrom, current) => {
    const path = []
    while (cameFrom.has(current)) {
      path.unshift(current)
      await setState(current, STATES.PATH)
      current = cameFrom.get(current)
    }

    path.unshift(start)
    return path
  }

  let current
  const open = new PosMap()
  const closed = new PosMap()
  const cameFrom = new PosMap()

  const fscore = new FibonacciHeap()
  const gscore = new PosMap()

  open.add(start)
  await setState(start, STATES.OPEN)
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
      await setState(current, STATES.CLOSED)
    } else {
      await setState(current, STATES.PATH)
    }

    const neighborCells = neighbors(current)
    for (const neighbor of neighborCells) {
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
        await setState(neighbor, STATES.OPEN)
      }

      if (tentativeGScore >= neighborGScore) {
        continue		// This is not a better path.
      }

      // This path is the best until now. Record it!
      cameFrom.add(neighbor, current)
      gscore.set(neighbor, tentativeGScore)
      fscore.insert(tentativeGScore + cost(neighbor, goal), neighbor)
      await setState(neighbor, STATES.TENTATIVE)
    }
  }

  return []
}

export default findPath