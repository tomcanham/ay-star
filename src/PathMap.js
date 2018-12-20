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
  constructor(width, height, start, end, blockFrequency = 0.2) {
    this.width = width
    this.height = height
    this.start = start
    this.end = end
    this.blockFrequency = blockFrequency
    this.buildBlocks()
  }

  buildMap() {
    let width = this.width
    let height = this.height
    const map = []
    for (let x = 0; x < width; ++x) {
      map.push(new Array(height))
    }

    while (width > 2 && height > 2) {
      let newWidth = Math.floor(width / 2)
      let newHeight = Math.floor(height / 2)
      const kept = Math.floor(Math.random() * 4)

      for (let x = 0; x < width; ++x) {

      }
      for (let i = 0; i < 4; ++i) {
        if (i == kept) {
          continue
        }

        switch (i) {
          case 0:
          break

          case 1:
          break

          case 2:
          break

          case 3:
          break
        }
      }
    }
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

  clearStates() {
    for (let y = 0; y < this.height; ++y) {    
      for (let x = 0; x < this.width; ++x) {
        const pos = new Pos([x, y])
        const existingState = this.getState(pos)

        if ([
          STATES.OPEN,
          STATES.CLOSED,
          STATES.TENTATIVE,
          STATES.PATH
        ].includes(existingState)) {
          if (pos.isEqual(this.start)) {
            this.setState(pos, STATES.START)
          } else if (pos.isEqual(this.end)) {
            this.setState(pos, STATES.END)
          } else {
            this.setState(pos, STATES.CLEAR)
          }
        }
      }
    }
  }

  around(rawPos, requireClear = true, includeDiagonals = true) {
    const pos = Pos.toPos(rawPos)

    const results = []
    let neighbors = [
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, 0]
    ]

    if (includeDiagonals) {
      neighbors = neighbors.concat([
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
      ])
    }

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