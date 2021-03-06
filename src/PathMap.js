import { posix } from "path";

export const STATES = {
  BLOCKED: 'blocked',
  CLEAR: 'clear',
  START: 'start',
  END: 'end',
  OPEN: 'open',
  CLOSED: 'closed',
  TENTATIVE: 'tentative',
  PATH: 'path'
}

export const DIRECTIONS = {
  NORTH: 1,
  EAST: 2,
  SOUTH: 4,
  WEST: 8,
  NONE: 0,
  ALL: 15
}

DIRECTIONS.OPPOSITE = {
  [DIRECTIONS.NORTH]: DIRECTIONS.SOUTH,
  [DIRECTIONS.EAST]: DIRECTIONS.WEST,
  [DIRECTIONS.SOUTH]: DIRECTIONS.NORTH,
  [DIRECTIONS.WEST]: DIRECTIONS.EAST
}

DIRECTIONS.IN_ORDER = [DIRECTIONS.NORTH, DIRECTIONS.EAST, DIRECTIONS.SOUTH, DIRECTIONS.WEST]
export const WALLS = DIRECTIONS

export class Pos {
  constructor([x, y]) {
    this.x = x
    this.y = y
  }

  isEqual(rawPos) {
    const pos = Pos.toPos(rawPos)
  
    return this.x === pos.x && this.y === pos.y
  }

  static toXY(pos) {
    if (pos instanceof Pos) {
      return [pos.x, pos.y]
    } else if (pos instanceof Array && pos.length === 2) {
      return pos
    }
  }

  inDirection(direction) {
    let dX = 0, dY = 0
    switch (direction) {
      case DIRECTIONS.NORTH:
        dY = -1
        break
      
      case DIRECTIONS.EAST:
        dX = 1
        break

      case DIRECTIONS.SOUTH:
        dY = 1
        break

      case DIRECTIONS.WEST:
        dX = -1
        break
    }
    const x = this.x + dX
    const y = this.y + dY

    return new Pos([x, y])
  }

  toXY() {
    return Pos.toXY(this)
  }

  static toPos(pos) {
    if (pos instanceof Pos) {
      return pos
    } else if (pos instanceof Array && pos.length === 2) {
      return new Pos([pos[0], pos[1]])
    }
  }

  manhattanDistance(rawPos) {
    const pos = Pos.toPos(rawPos)

    return Math.abs(this.x - pos.x) + Math.abs(this.y - pos.y)
  }

  euclideanDistance(rawPos) {
    const pos = Pos.toPos(rawPos)

    const distX = this.x - pos.x
    const distY = this.y - pos.y

    return Math.sqrt(distX ** 2 + distY ** 2)
  }
  
  directionTo(rawTo) {
    const to = Pos.toPos(rawTo)

    let dX = to.x - this.x
    let dY = to.y - this.y
    if (Math.abs(dX) + Math.abs(dY) == 1) {
      if (dX == 1) {
        return DIRECTIONS.EAST
      } else if (dX == -1) {
        return DIRECTIONS.WEST
      } else if (dY == 1) {
        return DIRECTIONS.SOUTH
      } else if (dY == -1) {
        return DIRECTIONS.NORTH
      }
    }

    return DIRECTIONS.NONE
  }
}

class Chamber {
  constructor(width, height, offsetX, offsetY) {
    this.width = width
    this.height = height
    this.offsetX = offsetX
    this.offsetY = offsetY
  }

  subdivide() {
    let chambers
    if (this.width > 2 && this.height > 2) {
      const newWidth = Math.floor(this.width / 2)
      const newHeight = Math.floor(this.height / 2)
      
      chambers = []
      chambers.push(new Chamber(newWidth, newHeight, this.offsetX, this.offsetY))
      chambers.push(new Chamber(newWidth, newHeight, this.offsetX + newWidth + 1, this.offsetY))
      chambers.push(new Chamber(newWidth, newHeight, this.offsetX, this.offsetY + newHeight + 1))
      chambers.push(new Chamber(newWidth, newHeight, this.offsetX + newWidth + 1, this.offsetY + newHeight + 1))
    }

    return chambers
  }

  getInnerWalls() {
    const kept = Math.floor(Math.random() * 4)

    const points = []
    let x = this.offsetX + Math.floor(this.width / 2)
    let y
    for (y = this.offsetY; y < this.offsetY + this.height; ++y) {
      // todo: add logic for "punching a hole" in each quadrant
      if (kept !== 0 && y < this.offsetY + Math.floor(this.height / 2)) {

      }
      points.push([x, y])
    }

    y = this.offsetY + Math.floor(this.height / 2)
    for (x = this.offsetX; x < this.offsetX + this.width; ++x) {
      points.push([x, y])
    }

    return points
  }
}

export class PathMap {
  constructor(width, height, start, end, blockFrequency = 0.2, handleUpdate = () => {}) {
    this.width = width
    this.height = height
    this.start = start
    this.end = end
    this.blockFrequency = blockFrequency
    this.handleUpdate = handleUpdate
    this.build()
  }

  build() {
    this.state = Array(this.height)
    this.walls = Array(this.height)

    for (let y = 0; y < this.height; ++y) {
      this.state[y] = Array(this.width)
      this.state[y].fill(STATES.CLEAR, 0, this.width - 1)

      this.walls[y] = Array(this.width)
      this.walls[y].fill(WALLS.NONE, 0, this.width - 1)
    }

    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        const pos = new Pos([x, y])

        if (pos.isEqual(this.start)) {
          this.state[y][x] = STATES.START
        } else if (pos.isEqual(this.end)) {
          this.state[y][x] = STATES.END
        } else if (Math.random() < this.blockFrequency) {
          const choices = WALLS.IN_ORDER
          const choice = choices[Math.floor(Math.random() * choices.length)]
          this.setWall(pos, choice)
        }
      }
    }
  }

  setWall(rawPos, direction) {
    const pos = Pos.toPos(rawPos)

    if (this.isInBounds(pos)) {
      this.walls[pos.y][pos.x] |= direction

      const neighbor = pos.inDirection(direction) // get neighboring cell
      if (this.isInBounds(neighbor)) {
        this.walls[neighbor.y][neighbor.x] |= DIRECTIONS.OPPOSITE[direction]
      }
    }
  }

  clearWall(rawPos, direction) {
    const pos = Pos.toPos(rawPos)

    if (this.isInBounds(pos)) {
      this.walls[pos.y][pos.x] &= ~direction

      const neighbor = pos.inDirection(direction) // get neighboring cell
      if (this.isInBounds(neighbor)) {
        this.walls[neighbor.y][neighbor.x] &= ~DIRECTIONS.OPPOSITE[direction]
      }
    }
  }

  getState(rawPos) {
    const pos = Pos.toPos(rawPos)

    return this.state[pos.y][pos.x]
  }

  getWalls(rawPos) {
    const pos = Pos.toPos(rawPos)

    let extra = 0
    if (pos.x == 0) {
      extra = extra | WALLS.WEST
    } else if (pos.x == this.width - 1) {
      extra = extra | WALLS.EAST
    }

    if (pos.y == 0) {
      extra = extra | WALLS.NORTH
    } else if (pos.y == this.height - 1) {
      extra = extra | WALLS.SOUTH
    }

    return this.walls[pos.y][pos.x] | extra
  }

  setState(rawPos, newState) {
    const pos = Pos.toPos(rawPos)

    this.state[pos.y][pos.x] = newState
  }

  isInBounds(pos) {
    return pos.x >= 0 && pos.x < this.width && pos.y >=0 && pos.y < this.height
  }

  canMove(rawFromPos, direction) {
    const fromPos = Pos.toPos(rawFromPos)
    const toPos = fromPos.inDirection(direction)
    
    if (!(this.isInBounds(fromPos) && this.isInBounds(toPos)))  {
      return false
    }

    if (this.walls[fromPos.y][fromPos.x] & direction) {
      return false
    } else {
      return true
    }
  }

  around(rawPos) {
    const from = Pos.toPos(rawPos)

    const results = []
    for (const direction of DIRECTIONS.IN_ORDER) {  
      if (this.canMove(from, direction)) {
        const neighbor = from.inDirection(direction)
        results.push(neighbor)
      }
    }
  
    return results
  }
}