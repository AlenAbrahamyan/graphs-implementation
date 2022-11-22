//canvas 1100 600
GRAPH_COORDS = [
  { x: 55, y: 315 },
  { x: 180, y: 150 },
  { x: 520, y: 65 },
  { x: 800, y: 110 },
  { x: 1040, y: 250 },
  { x: 610, y: 300 },
  { x: 560, y: 400 },
  { x: 400, y: 500 },
  { x: 490, y: 220 },
]

GRAPH = [
  [0, 4, 0, 0, 0, 0, 0, 8, 0],
  [4, 0, 8, 0, 0, 0, 0, 11, 0],
  [0, 8, 0, 7, 0, 4, 0, 0, 2],
  [0, 0, 7, 0, 9, 14, 0, 0, 0],
  [0, 0, 0, 9, 0, 10, 0, 0, 0],
  [0, 0, 4, 14, 10, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 1, 6],
  [8, 11, 0, 0, 0, 0, 1, 0, 7],
  [0, 0, 2, 0, 0, 0, 6, 7, 0],
]

let V = GRAPH.length

function minDistance(dist, sptSet) {
  let min = Number.MAX_VALUE
  let min_index = -1

  for (let v = 0; v < V; v++) {
    if (sptSet[v] == false && dist[v].value <= min) {
      min = dist[v].value
      min_index = v
    }
  }
  return min_index
}

function printSolution(dist, src) {
  for (let i = 0; i < V; i++) {
    console.log("_______________")
    console.log(`${src}->${i}`)
    console.log(dist[i])
  }
}

function dijkstra(GRAPH, src) {
  if (src < 0 || src >= GRAPH.length) {
    return "error"
  }

  let dist = new Array(V)
  let sptSet = new Array(V)

  for (let i = 0; i < V; i++) {
    dist[i] = { value: Number.MAX_VALUE, path: [i], archive: [] }
    sptSet[i] = false
  }

  dist[src].value = 0

  for (let count = 0; count < V - 1; count++) {
    let u = minDistance(dist, sptSet)
    sptSet[u] = true

    for (let v = 0; v < V; v++) {
      if (
        !sptSet[v] &&
        GRAPH[u][v] != 0 &&
        dist[u].value != Number.MAX_VALUE &&
        dist[u].value + GRAPH[u][v] < dist[v].value
      ) {
        dist[v].path = [...dist[u].path, v]
        dist[v].value = dist[u].value + GRAPH[u][v]
        dist[v].archive.push({ path: dist[v].path, value: dist[v].value })
      }
    }
  }

  //printSolution(dist, src)

  return dist
}

getMapData = (src) => dijkstra(GRAPH, src)

getPats = (from, to) => {
  return dijkstra(GRAPH, from)[to]
}
