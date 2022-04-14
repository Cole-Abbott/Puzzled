const fs = require('fs')

const SIDE = 400
const header = `<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${SIDE}" width="${SIDE}">\n`
const footer = '</svg>'
const background = (color) => {
    return (
        `<rect width="${SIDE}" height="${SIDE}" style="fill:${color};stroke-width:1;stroke:rgb(0,0,0)" />\n`
    )
}

const pen = {
    angle: 0,
    x: 0,
    y: 0,
    draw: false,
    path: [header, background('#ffffff')],
    moveTo: function (x, y) {
        if (this.draw) {
            this.path.push(`${this.x.toFixed(1)},${this.y.toFixed(1)} `)
        }
        this.x = x
        this.y = y
    },
    forward: function (distance = 10) {
        if (this.draw) {
            this.path.push(`${this.x.toFixed(1)},${this.y.toFixed(1)} `)
        }
        this.x += Math.cos(this.angle) * distance
        this.y += Math.sin(this.angle) * distance
    },
    turn: function (angle) { this.angle += angle },
    setAngle: function (angle) { this.angle = angle },
    up: function (width) {
        this.draw = false
        this.path.push(`" style = "fill:#035E7B; stroke:#ffffff;stroke-width:${width}" />\n`)
    },
    down: function () {
        this.draw = true
        this.path.push(`<polyline points="`)
    },
}

let sideLength = 350

pen.turn(Math.PI)
pen.moveTo(375, 350)
pen.down()

for (let i = 0; i < 50; i++) {
    pen.forward(sideLength)
    pen.turn(Math.PI / 1.5)
    pen.forward(sideLength)
    pen.turn(Math.PI / 1.5)
    pen.forward(sideLength)
    pen.turn(Math.PI / 1.5)

    pen.forward(sideLength * .1)
    sideLength *= 0.8544
    pen.turn(0.10153)
}
pen.up(10)

//stringifys layers
const content = (layers) => {
    file = ''
    for (let i of layers) {
        file += i
    }
    file += footer
    return file
}

fs.writeFile(`logo.svg`, content(pen.path), err => {
    if (err) {
        console.error(err)
        return
    }
})