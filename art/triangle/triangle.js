const fs = require('fs')

const SIDE = 400
const header = `<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${SIDE}" width="${SIDE}">\n`
const footer = '</svg>'
const gradient = (color1, color2) => {
    return(
    `<defs>
         <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
             <stop offset="0%" stop-color="${color1}" />
             <stop offset="100%" stop-color="${color2}" />
         </linearGradient>
     </defs>\n`
    )
}
const pen = {
    angle: 0,
    x: 0,
    y: 0,
    draw: false,
    path: [header, gradient('#ff0000', '#0000ff')],
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
    up: function() {
        this.draw = false
        this.path.push(`" style = "fill:none; stroke:url(#linear);stroke-width:8" />\n`)
    },
    down: function() {
        this.draw = true
        this.path.push(`<polyline points="`)
    },
}

let turns = 'x'
let copy = ''
const x = 'y+x+y'
const y = 'x-y-x'
//const x = 'y+-y'
//const y = 'x+-'
for (let i = 0; i < 4; i++){
    for(let j = 0; j < turns.length; j++){
        if (turns[j] === 'x'){
            copy += x
        } else if(turns[j] === 'y'){
            copy += y
        }
        else {
            copy += turns[j]
        }
    }
    turns = copy
    copy = ''
}
console.log(turns.length)


pen.moveTo(10, 390)
pen.down()
for (let j = 0; j < turns.length; j++) {
    if (turns[j] === '+') {
        pen.turn(Math.PI / 3)
        pen.forward(24)
    } else if (turns[j] === '-') {
        pen.turn(-Math.PI / 3)
        pen.forward(24)
    }
}
pen.up()
//stringifys layers
const content = (layers) => {
    file = ''
    for (let i of layers) {
        file += i
    }
    file += footer
    return file
}

fs.writeFile(`4.svg`, content(pen.path), err => {
    if (err) {
        console.error(err)
        return
    }
})