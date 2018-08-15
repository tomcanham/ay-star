# ay-star
Graphical Demo of A* Pathfinding Algorithm

This is a React web app running against a Node.js API. It is a demonstration of the famous A* pathfinding algorithm. For details on A*, see here: https://en.wikipedia.org/wiki/A*_search_algorithm.

It's interesting to note that although perhaps the most famous use of A* is for pathfinding through virtual (computer game) or physical (robotics) spaces, the general case of pathfinding algorithms has applications far beyond simple navigation; any operation that can be represented as a sequence of decisions ('locations') with a cost between decision points ('distance') can be improved with pathfinding algorithms.

Note that in order to allow the user to see "progress" by A*, I had to slow the render performance down by several orders of magnitude! I want to more tightly integrate the algorithmic components (open nodes, closed nodes, etc.) with React components, and allow a frame-by-frame "replay."

Also, I would love to redo this using something "pretty" like SVG. Anyone wanna fork this and "spruce it up?"

To build, clone the repository, run ```npm install && npm run build``` and then (assuming all goes well), open the file ```./dist/index.html```.
