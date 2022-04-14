const fs = require('fs')

const SIDE = 400
const header = `<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${SIDE}" width="${SIDE}">\n`
const footer = '</svg>'
const background = (color) => {
    return (
        `<rect width="${SIDE}" height="${SIDE}" style="fill:${color};stroke-width:1;stroke:rgb(0,0,0)" />\n`
    )
}
const randInt = (a) => {
    return (Math.floor(Math.random() * (a + 1)))
}
//stringifys layers
const content = (layers) => {
    file = ''
    for (let i of layers) {
        file += i
    }
    file += footer
    return file
}
const pen = {
    angle: 0,
    x: 0,
    y: 0,
    draw: false,
    path: [header, background('#000000')],
    moveTo: function (x, y) {
        this.x = x
        this.y = y
        if (this.draw) {
            this.path.push(`${this.x.toFixed(1)},${this.y.toFixed(1)} `)
        }
    },
    forward: function (distance = 10) {
        this.x += Math.cos(this.angle) * distance
        this.y += Math.sin(this.angle) * distance
        if (this.draw) {
            this.path.push(`${this.x.toFixed(1)},${this.y.toFixed(1)} `)
        }
    },
    turn: function (angle) { this.angle += angle },
    setAngle: function (angle) { this.angle = angle },
    up: function (width = 1) {
        this.draw = false
        this.path.push(`" style = "fill:none; stroke:#212529;stroke-width:${width}" />\n`)
    },
    down: function () {
        this.draw = true
        this.path.push(`<polyline points="${this.x.toFixed(1)},${this.y.toFixed(1)} `)
    },
}
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
//Return true if line segments AB and CD intersect
const intersect = (A, B, C, D) => {
    switch(A) {
        case C:
            return(false)
            break;
        case D:
            return (false)
            break;
    }
    switch (B) {
        case C:
            return (false)
            break;
        case D:
            return (false)
            break;
    }
    return ccw(A, C, D) != ccw(B, C, D) && ccw(A, B, C) != ccw(A, B, D)
}
const ccw = (A, B, C) => {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x)
}
const lineTo = (point, next) => {
    for (let line of lines) {
        if (intersect(point, next, line.a, line.b)) {
            return
        }
    }
    pen.moveTo(point.x, point.y)
    pen.down()
    pen.moveTo(next.x, next.y)
    pen.up(2)
    lines.push({ a: point, b: next })

}
let lines
for (let count = 0; count < 1000; count++){
    lines = []
    const points = []
    for (let i = 0; i <= 4; i++) {
        for (let j = 0; j <= 4; j++) {
            let point = { x: i * 100 + randInt(50) - 25, y: j * 100 + randInt(50) - 25 }
            points.push(point)
        }
    }

    let point

    nearPoints = []
    for (let i = 0; i < points.length; i++) {
        point = points[i]
        nearPoints.push([])
        for (let j = 0; j < points.length; j++) {
            let next = points[j]
            nearPoints[i].push({point: next, distance: Math.round(Math.sqrt((next.x - point.x) ** 2 + (next.y - point.y) ** 2))})
        }
    }



    for (let len = 0; len < 400; len += 10) {
        for (let i = 0; i < points.length; i++) {
            point = points[i]
            nearPoint = nearPoints[i]
            nearPoint.sort((a, b) => {return a.distance - b.distance})
            for (let j = 0; j < nearPoint.length; j ++) {
                if (nearPoint[j].distance < len) {
                    lineTo(point, nearPoint[j].point)
                    //remove nearPoint[j]
                    nearPoint.shift()
                }
            }
        }
    }

    //chose 2 random lines that share a point
    const newLines = []
    lines.filter( (line) => {
        if (line.a === line.b) {return false}
        let good = true
        newLines.forEach((element) => {
            if (line.a === element.b && line.b === element.a) { good = false }
        })
        if (good) {
            newLines.push(line)
        }


    })

    colors = []
    let h = randInt(360)
    const s = randInt(40) + 60
    const l = randInt(50) + 25
    for (let i = 0; i < 4; i++) {
        colors.push(hslToHex(h, s, l))
        h += 90
    }

    for (let j = 0; j < randInt(10) + 13; j++){
        let p1, p2, p3
        const l1 = lines[randInt(lines.length - 1)]
        for (let i = 0; i < lines.length; i++) {
            const element = lines[i]
            if(element === l1) {continue}
            switch(l1.a) {
                case element.a:
                    p1 = l1.a
                    p2 = element.b
                    p3 = l1.b
                    break
                case element.b:
                    p1 = l1.a
                    p2 = element.a
                    p3 = l1.b
                    break
            }
            switch (l1.b) {
                case element.a:
                    p1 = l1.b
                    p2 = element.b
                    p3 = l1.a
                    break
                case element.b:
                    p1 = l1.b
                    p2 = element.a
                    p3 = l1.a
                    break
            }
        }

        for (let i = 0; i < lines.length; i++){
            const element = lines[i]
            if (element.a === p2 && element.b === p3) {
                pen.path.push(`<polyline points="${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" fill="${colors[j % 4]}" stroke="none" />`)
                break
            } else if (element.b === p2 && element.a === p3) {
                pen.path.push(`<polyline points="${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" fill="${colors[j % 4]}" stroke="none" />`)
                break
            }
        }
    }

    //check for a line that forms a triangle
    //draw polyline to connect 3 points

    fs.writeFile(`./images/${count}.svg`, content(pen.path), err => {
        if (err) {
            console.error(err)
            return
        }
    })
    pen.path = [header, background('#000000')]

}