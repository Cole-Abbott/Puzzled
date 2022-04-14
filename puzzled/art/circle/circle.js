const fs = require('fs')

const SIDE = 400
const header = `<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${SIDE}" width="${SIDE}">\n`
const footer = '</svg>'
const randInt = (a) => {
    return (Math.floor(Math.random() * (a + 1)))
}
const background = () => {
    return (
        `<rect width="${SIDE}" height="${SIDE}" style="fill:${Math.random() >= 0.5 ? 'black' : 'white'};stroke-width:1;stroke:rgb(0,0,0)" />\n`
    )
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

for (let j = 0; j < 10; j++) {
    const layers = [header]
    layers.push(background())
    const radius = randInt(100) + 50
    let angle = randInt(30)

    let x, y = 0
    dots = randInt(5) + Math.round(radius / 10)
    let h = Math.random() * 360
    const s = (Math.random() * 40) + 60
    const l = (Math.random() * 50) + 25
    const pattern = Math.random() >= 0.5 ? true : false

    for (let i = 0; i < dots; i++) {
        x = Math.cos(angle) * radius + 200
        y = Math.sin(angle) * radius + 200
        layers.push(`<circle cx="${x}" cy="${y}" r="${pattern ? randInt(10) + radius / 10 : i / 5 + 10}" stroke="black" stroke-width="0" fill="${hslToHex(h, s, l)}" />\n`)
        h += 360 / dots
        angle += 2 * Math.PI / dots
    }

    fs.writeFile(`./images/${j}.svg`, content(layers), err => {
        if (err) {
            console.error(err)
            return
        }
    })
}