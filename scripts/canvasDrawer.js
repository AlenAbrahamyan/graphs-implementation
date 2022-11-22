//GRAPH_COORDS getMapData(2)
const canvas = document.getElementById("map-canvas")
const ctx = canvas.getContext("2d")

canvas.width = 1100
canvas.height = 600

const background = new Image()
background.src = "./background.png"

function line(x1, y1, x2, y2) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

function drawConections() {
  ctx.strokeStyle = "grey"
  ctx.lineWidth = 5
  for (let i = 0; i < GRAPH.length; i++) {
    for (let j = 0; j < GRAPH.length; j++) {
      if (GRAPH[i][j] != 0) {
        line(
          GRAPH_COORDS[i].x,
          GRAPH_COORDS[i].y,
          GRAPH_COORDS[j].x,
          GRAPH_COORDS[j].y
        )
      }
    }
  }
}

function drawGraphVertices(graph) {
  for (let i = 0; i < GRAPH.length; i++) {
    ctx.fillStyle = "grey"
    ctx.beginPath()
    ctx.arc(GRAPH_COORDS[i].x, GRAPH_COORDS[i].y, 20, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = "white"
    ctx.font = "30px Arial"
    ctx.fillText(i, GRAPH_COORDS[i].x - 10, GRAPH_COORDS[i].y + 10)
  }
}

function drawChoosedVertices() {
  for (let i = 0; i < CHOOSED_PATH.length; i++) {
    ctx.fillStyle = "blue"
    const { x, y } = GRAPH_COORDS[CHOOSED_PATH[i]]
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = "white"
    ctx.font = "30px Arial"
    ctx.fillText(CHOOSED_PATH[i], x - 10, y + 10)
  }
}

function drawChoosedConections() {
  for (let i = 0; i < CHOOSED_PATH.length; i++) {
    ctx.strokeStyle = "#10adf8"
    const point1 = GRAPH_COORDS[CHOOSED_PATH[i]]
    const point2 = GRAPH_COORDS[CHOOSED_PATH[i + 1]]

    if (point2) {
      line(point1.x, point1.y, point2.x, point2.y)
    }
  }
}

function drawChoosedPath() {
  drawChoosedConections()
  drawChoosedVertices()
}

DRAW_MAP = () => {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
  drawConections()
  drawGraphVertices()
  drawChoosedPath()
  console.log(CHOOSED_PATH)
}

DRAW_MAP()

background.onload = DRAW_MAP
