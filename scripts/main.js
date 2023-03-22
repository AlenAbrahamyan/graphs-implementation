const fromSelector = document.getElementById("from-selector")
const toSelector = document.getElementById("to-selector")
const notFoundPathText = document.getElementById("notFoundPath")
const canvas = document.getElementById("map")
const ctx = canvas.getContext("2d")
canvas.width = 1100
canvas.height = 600
//
const locationIcon = new Image()
locationIcon.src = "./images/location.png"

const background = new Image()
background.src = "./images/background.png"

const interactiveParams = {
  targetingVertex: null,
  selectedVertex: null,
  mouse: { x: 0, y: 0 },
}

let highlightingPath

function checkingTargetingVertex() {
  requestAnimationFrame(checkingTargetingVertex)
  interactiveParams.targetingVertex = null
  for (let i = 0; i < GRAPH.verticesCoords.length; i++) {
    const mouseDistance =
      ((interactiveParams.mouse.x - GRAPH.verticesCoords[i].x) ** 2 +
        (interactiveParams.mouse.y - GRAPH.verticesCoords[i].y) ** 2) **
      (1 / 2)
    if (mouseDistance < 20) {
      interactiveParams.targetingVertex = {
        index: i,
        coord: GRAPH.verticesCoords[i],
      }
    }
  }
}

function drawHighlightingPath() {
  if (highlightingPath.value === Number.MAX_VALUE) {
    notFoundPathText.style.display = "block"
    return
  }
  notFoundPathText.style.display = "none"

  ctx.strokeStyle = "#b0c9e5"
  ctx.lineWidth = 12
  ctx.beginPath()
  highlightingPath.path.forEach((vertex) => {
    ctx.lineTo(GRAPH.verticesCoords[vertex].x, GRAPH.verticesCoords[vertex].y)
  })
  ctx.stroke()

  highlightingPath.path.forEach((vertex, index) => {
    ctx.fillStyle = "blue"
    ctx.beginPath()
    ctx.arc(
      GRAPH.verticesCoords[vertex].x,
      GRAPH.verticesCoords[vertex].y,
      20,
      0,
      2 * Math.PI
    )
    ctx.fill()

    ctx.fillStyle = "white"
    ctx.font = "30px Arial"
    ctx.fillText(
      vertex,
      GRAPH.verticesCoords[vertex].x - ctx.measureText(vertex).width / 2,
      GRAPH.verticesCoords[vertex].y + 10
    )
  })

  const toCoord =
    GRAPH.verticesCoords[
      highlightingPath.path[highlightingPath.path.length - 1]
    ]
  ctx.drawImage(locationIcon, toCoord.x - 15, toCoord.y - 55, 30, 40)
}

function fillSelectorItems(selectorDom) {
  const value = selectorDom.value
  selectorDom.innerHTML = ""
  GRAPH.verticesCoords.forEach((_, i) => {
    const option = document.createElement("option")
    option.text = option.value = i
    selectorDom.appendChild(option)
  })
  selectorDom.value = value
}

function line(x1, y1, x2, y2) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

function drawConnections() {
  for (let i = 0; i < GRAPH.verticesCoords.length; i++) {
    for (let j = 0; j < GRAPH.verticesCoords.length; j++) {
      if (GRAPH.adjacencyMatrix[i][j] != 0) {
        ctx.strokeStyle = "#eaeaea"
        ctx.lineWidth = GRAPH.adjacencyMatrix[j][i] ? 12 : 4
        line(
          GRAPH.verticesCoords[i].x,
          GRAPH.verticesCoords[i].y,
          GRAPH.verticesCoords[j].x,
          GRAPH.verticesCoords[j].y
        )
        ctx.strokeStyle = "white"
        ctx.lineWidth = GRAPH.adjacencyMatrix[j][i] ? 8 : 2
        line(
          GRAPH.verticesCoords[i].x,
          GRAPH.verticesCoords[i].y,
          GRAPH.verticesCoords[j].x,
          GRAPH.verticesCoords[j].y
        )
      }
    }
  }
}

function drawVertices() {
  GRAPH.verticesCoords.forEach((vertex, i) => {
    ctx.fillStyle = "gray"
    ctx.beginPath()
    ctx.arc(vertex.x, vertex.y, 20, 0, 2 * Math.PI)
    ctx.fill()

    ctx.fillStyle = "white"
    ctx.font = "30px Arial"
    ctx.fillText(i, vertex.x - ctx.measureText(i).width / 2, vertex.y + 10)
  })
}

function drawGraph() {
  drawConnections()
  drawVertices()
}

function drawHoveringVertex() {
  ctx.strokeStyle = "red"
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(
    interactiveParams.targetingVertex.coord.x,
    interactiveParams.targetingVertex.coord.y,
    20,
    0,
    2 * Math.PI
  )
  ctx.stroke()
}

function drawPotentialConnection() {
  ctx.strokeStyle = "#ffffff"
  ctx.lineWidth = 12
  line(
    interactiveParams.mouse.x,
    interactiveParams.mouse.y,
    interactiveParams.selectedVertex.coord.x,
    interactiveParams.selectedVertex.coord.y
  )
}

function drawMap() {
  requestAnimationFrame(drawMap)
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
  interactiveParams.selectedVertex && drawPotentialConnection()
  drawGraph()
  highlightingPath && drawHighlightingPath()
  interactiveParams.targetingVertex && drawHoveringVertex()
}

function renderAdjacencyMatrixController() {
  const container = document.getElementById("adjacencyMatrixController")
  container.innerHTML = ""

  const table = document.createElement("table")

  container.appendChild(table)
  const tableHeader = document.createElement("tr")
  const emptyCell = document.createElement("td")
  tableHeader.appendChild(emptyCell)
  table.appendChild(tableHeader)

  GRAPH.verticesCoords.forEach((_, vertexId) => {
    const cell = document.createElement("td")
    cell.innerHTML = vertexId
    tableHeader.appendChild(cell)
  })

  GRAPH.verticesCoords.forEach((_, vertexId) => {
    const row = document.createElement("tr")
    const cell = document.createElement("td")
    cell.innerHTML = vertexId
    row.appendChild(cell)
    table.appendChild(row)

    for (let i = 0; i < GRAPH.verticesCoords.length; i++) {
      const cell = document.createElement("td")
      const checkbox = document.createElement("input")
      checkbox.type = "checkbox"
      checkbox.checked = GRAPH.adjacencyMatrix[vertexId][i]
      checkbox.onclick = () => {
        highlightingPath = null
        checkbox.checked
          ? GRAPH.createEdge(vertexId, i)
          : (GRAPH.adjacencyMatrix[vertexId][i] = 0)
      }
      cell.appendChild(checkbox)
      row.appendChild(cell)
    }
  })
}

function updateMapCanvas() {
  const from = fromSelector.value
  const to = toSelector.value
  from != "" && to != "" ? (highlightingPath = GRAPH.getPath(from, to)) : null
}

fromSelector.onchange = updateMapCanvas
toSelector.onchange = updateMapCanvas

canvas.addEventListener("click", (e) => {
  if (interactiveParams.targetingVertex) {
    if (interactiveParams.selectedVertex) {
      GRAPH.createTwoSidedEdge(
        interactiveParams.targetingVertex.index,
        interactiveParams.selectedVertex.index
      )
      interactiveParams.selectedVertex = null
    } else {
      interactiveParams.selectedVertex = {
        ...interactiveParams.targetingVertex,
      }
    }

    renderAdjacencyMatrixController()
    return
  }

  if (GRAPH.verticesCoords.length > GRAPH.maxVertexCount) {
    alert(GRAPH.maxVertexCount + " գրաֆի գագաթից ավել չեք կարող ավելացնել")
    return
  }

  GRAPH.addVertex(e.offsetX, e.offsetY)

  if (interactiveParams.selectedVertex) {
    const newVertexIndex = GRAPH.verticesCoords.length - 1
    GRAPH.createTwoSidedEdge(
      newVertexIndex,
      interactiveParams.selectedVertex.index
    )
    interactiveParams.selectedVertex = null
  }

  renderAdjacencyMatrixController()
  fillSelectorItems(fromSelector)
  fillSelectorItems(toSelector)
})

canvas.addEventListener("mousemove", (e) => {
  interactiveParams.mouse = { x: e.offsetX, y: e.offsetY }
})

checkingTargetingVertex()
drawMap()
