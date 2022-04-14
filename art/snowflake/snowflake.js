const fs = require('fs')

const SIDE = 400
const header = `<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${SIDE}" width="${SIDE}">\n<g id="branch">\n`
const footer = '</svg>'
const reflections = [
    `</g>\n`,
    `<use xlink:href="#branch" transform='rotate(60 200 200)' fill="none" stroke="red"/>\n`,
    `<use xlink:href="#branch" transform='rotate(120 200 200)' fill="none" stroke="red"/>\n`,
    `<use xlink:href="#branch" transform='rotate(180 200 200)' fill="none" stroke="red"/>\n`,
    `<use xlink:href="#branch" transform='rotate(240 200 200)' fill="none" stroke="red"/>\n`,
    `<use xlink:href="#branch" transform='rotate(300 200 200)' fill="none" stroke="red"/>\n`,
]

const pen = {
    angle: 0,
    x: 0,
    y: 0,
    draw: false,
    path: [header],
    moveTo: function (x, y) {
        if (this.draw) {
            this.path.push(`<line x1="${this.x.toFixed(1)}" y1="${this.y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" style="stroke:rgb#92d3ea;stroke-width:5; stroke-linecap:round"/>\n`)
        }
        this.x = x
        this.y = y
    },
    forward: function (distance = 10) {
        if (this.draw) {
            this.path.push(`<line x1="${this.x.toFixed(1)}" y1="${this.y.toFixed(1)}" x2="${(this.x + Math.cos(this.angle) * distance).toFixed(1)}" y2="${(this.y + Math.sin(this.angle) * distance).toFixed(1)}" style="stroke:#92d3ea;stroke-width:5; stroke-linecap:round"/>\n`)
        }
        this.x += Math.cos(this.angle) * distance
        this.y += Math.sin(this.angle) * distance
    },
    turn: function (angle) { this.angle += angle },
    setAngle: function (angle) { this.angle = angle },
}


pen.moveTo(200, 200)
pen.draw = true
const branches = []
const branchLengths = [35, 30, 45, 30, 0]
pen.forward(20)

for (let i = 0; i < 4; i++) {
    branches.push({x: pen.x, y: pen.y, angle: pen.angle, len: branchLengths[i] })
    pen.forward(25)
}


branches.forEach(element => {
    pen.draw = false
    pen.moveTo(element.x, element.y)
    pen.setAngle(element.angle + Math.PI / 4)
    pen.draw = true
    pen.forward(element.len)
    pen.draw = false
    pen.moveTo(element.x, element.y)
    pen.setAngle(element.angle - Math.PI / 4)
    pen.draw = true
    pen.forward(element.len)
})


//stringifys layers
const content = (layers) => {
    file = ''
    for (let i of layers) {
        file += i
    }
    for (let i of reflections){
        file += i
    }
    file += footer
    return file
}

fs.writeFile(`snowflake.svg`, content(pen.path), err => {
    if (err) {
        console.error(err)
        return
    }
})