const fs = require('fs')

const SIDE = 400

//art functions
const wavePath = (shift) => {
    waves = {
        A: randInt(10),
        a: Math.random() / 10,
        B: randInt(10),
        b: Math.random() / 10,
        C: randInt(10),
        c: Math.random() / 10,
    }
    const points = [`-40,${SIDE+40} `]
    for (let i = -20; i <= SIDE + 20; i += 2) {
        points.push(` ${i},${(sin(i, waves) + shift).toFixed(2)} ` )
    }
    points.push(`${SIDE+40},${SIDE+40}`)
    return(points)
}

const circles = () => {
    return (
        [
            circle(randInt(SIDE), 50, 'url(#grad4)'),
            circle(randInt(SIDE), 150, 'url(#grad1)'),
            circle(randInt(SIDE), 250, 'url(#grad2)'),
            circle(randInt(SIDE), 350, 'url(#grad3)')
        ]
    )
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

//math functions
const sin = (x, waves)  => {
    return (waves.A * Math.sin(waves.a * x) + waves.B * Math.sin(waves.b * x) + waves.C * Math.sin(waves.c * x))
}
const randInt = (a) => {
    return(Math.floor(Math.random() * (a + 1)))
}


//svg strings
const circle = (x, y, color) => `<circle cx="${x}" cy="${y}" r="${randInt(15) + 10}" stroke="${color}" stroke-width="3" fill="${color}" />`
const background = (color) => `<rect width="${SIDE}" height="${SIDE}" style="fill:${color};stroke-width:3;stroke:${color};" />\n`
const wave = (height, color) => `<polyline points="${wavePath(height)}" style = "fill:${color};stroke:${color};stroke-width:4"/>\n`
const header = `<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${SIDE}" width="${SIDE}">\n`
const footer = '</g>\n</svg>'
const transform = () => `<g transform="rotate(${randInt(20) - 10} 200 200)">\n`

//stringifys layers
const content = (layers) => {
    file = ''
    for (let i of layers) {
        file += i
    }
    return file
}

for (let i = 0; i < 10000; i++){
    //random parameters
    let h = randInt(360)
    const s = randInt(50) + 50
    const l = randInt(50) + 25
    const baseColor = hslToHex(h, s, l)
    h += 90
    const color2 = hslToHex(h, s, l)
    h += 90
    const color3 = hslToHex(h, s, l)
    h += 90
    const color4 = hslToHex(h, s, l)


    layers = [
        header,
        `<defs>\n`,
        `<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">\n<stop offset="0%" style="stop-color:${baseColor};stop-opacity:1" />\n<stop offset="100%" style="stop-color:${baseColor};stop-opacity:1" />\n</linearGradient>\n`,
        `<linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">\n<stop offset="0%" style="stop-color:${color2};stop-opacity:1" />\n<stop offset="100%" style="stop-color:${color2};stop-opacity:1" />\n</linearGradient>\n`,
        `<linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">\n<stop offset="0%" style="stop-color:${color3};stop-opacity:1" />\n<stop offset="100%" style="stop-color:${color3};stop-opacity:1" />\n</linearGradient>\n`,
        `<linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%">\n<stop offset="0%" style="stop-color:${color4};stop-opacity:1" />\n<stop offset="100%" style="stop-color:${color4};stop-opacity:1" />\n</linearGradient>\n`,
        `</defs>\n`,
        background('url(#grad1)'),
        transform(),
        wave(100, 'url(#grad2)'),
        wave(200, 'url(#grad3)'),
        wave(300, 'url(#grad4)'),
        circles(),
        footer,
    ]

    fs.writeFile(`./images/${i}.svg`, content(layers), err => {
        if (err) {
            console.error(err)
            return
        }
    })
}
