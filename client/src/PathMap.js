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
}

export class PathMap {
  constructor(width, height, start, end, blockFrequency = 0.2) {
    this.width = width
    this.height = height
    this.start = start
    this.end = end
    this.blockFrequency = blockFrequency
    this.buildBlocks()

    // console.log("New pathmap built:", this)
  }

  buildBlocks() {
    this.state = []

    for (let y = 0; y < this.height; ++y) {
      const row = []
    
      for (let x = 0; x < this.width; ++x) {
        const pos = new Pos([x, y])
    
        if (pos.isEqual(this.start)) {
          row.push(STATES.START)
        } else if (pos.isEqual(this.end)) {
          row.push(STATES.END)
        } else if (Math.random() < this.blockFrequency) {
          row.push(STATES.BLOCKED)
        } else {
          row.push(STATES.CLEAR)
        }
      }
      
      this.state.push(row)
    }
  }

  toggleBlocked(rawPos) {
    const pos = Pos.toPos(rawPos)

    if (!pos.isEqual(this.start) && !pos.isEqual(this.end)) {
      const newState = this.state[pos.y, pos.x] === STATES.CLEAR ? STATES.BLOCKED : STATES.CLEAR
    }
  }

  getState(rawPos) {
    const pos = Pos.toPos(rawPos)

    return this.state[pos.y][pos.x]
  }

  setState(rawPos, newState) {
    const pos = Pos.toPos(rawPos)

    this.state[pos.y][pos.x] = newState
  }

  isBlocked(rawPos) {
    return this.getState(pos) === STATES.BLOCKED
  }

  isValid(rawPos, requireClear = true) {
    // console.log("ISVALID:", rawPos)
    const pos = Pos.toPos(rawPos)

    if (!(pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height )) {
      return false
    }
    
    const state = this.getState(pos)
    if (state === STATES.BLOCKED) {
      return false
    } else if (state !== STATES.CLEAR && requireClear) {
      return false
    } else {
      return true
    }
  }

  around(pos, requireClear = true) {
    const results = []
    const neighbors = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ]

    for (const neighbor of neighbors) {
      const [x, y] = neighbor
      const testPos = new Pos([pos.x + x, pos.y + y])
  
      if (this.isValid(testPos, requireClear)) {
        results.push(testPos)
      }
    }
  
    return results
  }
}