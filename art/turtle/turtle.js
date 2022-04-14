const fs = require('fs')

const SIDE = 400
const header = `<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${SIDE}" width="${SIDE}">\n`
const footer = '</svg>'

const pen = {
    angle: 0,
    x: 0,
    y: 0,
    draw: false,
    path: [header],
    moveTo: function(x, y) {
        if (this.draw) {
            this.path.push(`<line x1="${this.x.toFixed(1)}" y1="${this.y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" style="stroke:rgb(255,0,0);stroke-width:1"/>\n`)
        }
        this.x = x
        this.y = y
    },
    forward: function(distance = 10) {
        if (this.draw) {
            this.path.push(`<line x1="${this.x.toFixed(1)}" y1="${this.y.toFixed(1)}" x2="${(this.x + Math.cos(this.angle) * distance).toFixed(1)}" y2="${(this.y + Math.sin(this.angle) * distance).toFixed(1)}" style="stroke:rgb(255,0,0);stroke-width:1"/>\n`)
        }
        this.x += Math.cos(this.angle) * distance
        this.y += Math.sin(this.angle) * distance
    },
    turn: function(angle) {this.angle += angle},
    setAngle: function(angle) {this.angle = angle},
}

pen.moveTo(200, 350)
pen.draw = true
pen.setAngle(-Math.PI / 2)

let branchPoint = []

for (var i = 0; i < 40; i++) {
    pen.forward()
    pen.turn(Math.random() - .4)
    if (Math.random().toFixed(1) == .1){
        branchPoint.push({x: pen.x, y: pen.y, angle: pen.angle})
    }
}

branchPoint.forEach(element => {
    pen.draw = false
    pen.moveTo(element.x, element.y)
    pen.setAngle(element.angle)
    pen.draw = true
    for (var i = 0; i < 10; i++) {
        pen.forward()
        pen.turn(Math.random() - .5)
    }
});


//stringifys layers
const content = (layers) => {
    file = ''
    for (let i of layers) {
        file += i
    }
    file += footer
    return file
}

fs.writeFile(`turtle.svg`, content(pen.path), err => {
    if (err) {
        console.error(err)
        return
    }
})