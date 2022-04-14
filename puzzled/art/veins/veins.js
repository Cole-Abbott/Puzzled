const fs = require('fs')

const randInt = (a) => Math.floor(Math.random() * (a + 1))


const SIDE = 400
const header = `<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${SIDE}" width="${SIDE}">\n`
const footer = '</svg>'

const path = (x, y, length, color) => {
    const points = []
    for (let i = 0; i < length; i++) {
        if (x < 0 || x > 39 || y < 0 || y > 39) {break}
        if(grid[x][y].empty){
            grid[x][y].empty = false
            points.push(`${grid[x][y].coord}`)
            x += Math.round(Math.random()) + 1
            y += Math.round(Math.random())
        } else{break}
    }
    return (`<polyline points="${points.join('')}" style = "fill:none;stroke:${color};stroke-width:2"/>\n`)
}

const grid = []
const layers = []

for (let i = 0; i < SIDE / 10; i++) {
    grid.push([])
    for (let j = 0; j < SIDE / 10; j++) {
        grid[i].push({empty: true, coord: `${i * 10},${j * 10} `})
    }
}


layers.push(path(20, 20, 40, '#ff0088'))


//stringifys layers
const content = (layers) => {
    file = header
    for (let i of layers) {
        file += i
    }
    file += footer
    return file
}

fs.writeFile(`veins.svg`, content(layers), err => {
    if (err) {
        console.error(err)
        return
    }
})