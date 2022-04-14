const fs = require('fs')

const SIDE = 400
const header = `<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${SIDE}" width="${SIDE}">\n`
const footer = '\n</g>\n</svg>'
const gradient = (color) => {
    return (
    `<defs>
        <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${color[0]}" />
            <stop offset="100%" stop-color="${color[1]}" />
        </linearGradient>
    </defs>\n`
    )
}
const background = (color) => {
    return(
        `<rect width="${SIDE}" height="${SIDE}" style="fill:${'white'};stroke-width:1;stroke:rgb(0,0,0)" />\n`
    )
}
const randInt = (a) => {
    return (Math.floor(Math.random() * (a + 1)))
}
const transform = () => {
    return(
        `<g transform="rotate(${randInt(360)} 200 200) scale(${Math.random() + 1}) translate(${randInt(50 - 25)} ${randInt(50 - 25)})">\n`
    )
}
//stringifys layers
const content = (layers) => {
    file = ''
    file += header
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
const colors = () => {
    const color = []
    let h = Math.random() * 360
    const s = (Math.random() * 40) + 60
    const l = (Math.random() * 50) + 25
    for (let i = 0; i < 2; i++) {
        color.push(hslToHex(h, s, l))
        h += 90
    }
    return(color)
}

for (let i = 0; i < 10; i++) {
    const layers = []
    let color = colors()
    layers.push(background(color))
    layers.push(gradient(color))
    layers.push(transform())
    layers.push(fs.readFileSync(`${Math.floor(Math.random() * 5 + 4)}.svg`).toString())

    fs.writeFile(`./images/h${i}.svg`, content(layers), err => {
        if (err) {
            console.error(err)
            return
        }
    })
}