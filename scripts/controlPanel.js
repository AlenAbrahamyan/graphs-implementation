CHOOSED_PATH = []
const fromSelector = document.getElementById("from-selector")
const toSelector = document.getElementById("to-selector")

function updateMapCanvas() {
  const from = fromSelector.value
  const to = toSelector.value

  CHOOSED_PATH = getPats(from, to).path
  DRAW_MAP()
}

fromSelector.onchange = updateMapCanvas
toSelector.onchange = updateMapCanvas
