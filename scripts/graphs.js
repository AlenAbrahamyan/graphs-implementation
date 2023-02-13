///
GRAPH = {
  maxVertexCount: 30,
  verticesCoords: [],
  adjacencyMatrix: [],
  addVertex: function (x, y) {
    this.verticesCoords.push({ x, y })
    this.adjacencyMatrix.push([])
    this.adjacencyMatrix.forEach((row) => {
      for (let i = 0; i < this.adjacencyMatrix.length; i++) {
        if (!row[i]) {
          row[i] = 0
        }
      }
    })
  },
  getVerticesDistance: function (v1, v2) {
    return ((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2) ** (1 / 2)
  },
  createEdge: function (from, to) {
    this.adjacencyMatrix[from][to] = this.getVerticesDistance(
      this.verticesCoords[from],
      this.verticesCoords[to]
    )
  },
  createTwoSidedEdge: function (v1, v2) {
    this.createEdge(v1, v2)
    this.createEdge(v2, v1)
  },
  getPath: function (from, to) {
    return dijkstra(this.adjacencyMatrix, from)[to]
  },
}

function minDistance(dist, sptSet) {
  let min = Number.MAX_VALUE
  let min_index = -1

  for (let v = 0; v < GRAPH.adjacencyMatrix.length; v++) {
    if (sptSet[v] == false && dist[v].value <= min) {
      min = dist[v].value
      min_index = v
    }
  }
  return min_index
}

function dijkstra(graph, src) {
  if (src < 0 || src >= graph.length) {
    return "error"
  }

  let dist = new Array(graph.length)
  let sptSet = new Array(graph.length)

  for (let i = 0; i < graph.length; i++) {
    dist[i] = { value: Number.MAX_VALUE, path: [i], archive: [] }
    sptSet[i] = false
  }

  dist[src].value = 0

  for (let count = 0; count < graph.length - 1; count++) {
    let u = minDistance(dist, sptSet)
    sptSet[u] = true

    for (let v = 0; v < graph.length; v++) {
      if (
        !sptSet[v] &&
        graph[u][v] != 0 &&
        dist[u].value != Number.MAX_VALUE &&
        dist[u].value + graph[u][v] < dist[v].value
      ) {
        dist[v].path = [...dist[u].path, v]
        dist[v].value = dist[u].value + graph[u][v]
        dist[v].archive.push({ path: dist[v].path, value: dist[v].value })
      }
    }
  }

  return dist
}
