const fs = require('fs')


const waves = 'Qmb9LdKxC3QmWJmm9FneF5LVNUumiMTAzTDmBaWTMoW7YT'
const wavesPNG = 'QmYxa5qzXdio7G1B7xa8LkCtQXNUaguVwnMpKu65fuuHVS'
const network = 'Qmeipmy5mn1ENrTwhE1XZoMpk5F1DLrWjNN8cud2dCxSoA'
const networkPNG = 'QmUCYMn7nCvUAQaUFbz1M49g6moFBwAvoxR8g26wS87kr8'
const circle = 'QmXQSb2inDYQw9abix8WajNAjWUeSTn1Vd2SwHPvxPX1SM'
const circlePNG = 'QmUpGJXV8ycQeDYvZKV7LnsJDghxNtmQC77qAikAV7Ndkp'
const triangle = 'QmSTCJqFRBjhTSYYDoytARCWYpda7MAE4dLofPrUzKnNny'
const trianglePNG = 'QmYhKVNuS1mfw9FunzYitQR5Xt4XyH8xuyQ3b7FFhJEdHZ'

let metadata

for (let i = 0; i < 10000; i++) {
    metadata = {
        image: `ipfs://${wavesPNG}/${i}.png`,
        name: `Puzzled level 1 #${i}`,
        svg: `ipfs://${waves}/${i}.svg`,
        attributes: [
            {
                "trait_type": "Difficulty",
                "value": "Level 1"
            }
        ]
    }
    fs.writeFile(`./data/${i}.json`, JSON.stringify(metadata), err => {
        if (err) {
            console.error(err)
            return
        }
    })
}


for (let i = 0; i < 1000; i++) {
    metadata = {
        image: `ipfs://${networkPNG}/${i}.png`,
        name: `Puzzled level 2 #${i}`,
        svg: `ipfs://${network}/${i}.svg`,
        attributes: [
            {
                "trait_type": "Difficulty",
                "value": "Level 2"
            }
        ]
    }
    fs.writeFile(`./data/${i + 10000}.json`, JSON.stringify(metadata), err => {
        if (err) {
            console.error(err)
            return
        }
    })
}



for (let i = 0; i < 100; i++) {
    metadata = {
        image: `ipfs://${circlePNG}/${i}.png`,
        name: `Puzzled level 3 #${i}`,
        svg: `ipfs://${circle}/${i}.svg`,
        attributes: [
            {
                "trait_type": "Difficulty",
                "value": "Level 3"
            }
        ]
    }
    fs.writeFile(`./data/${i + 11000}.json`, JSON.stringify(metadata), err => {
        if (err) {
            console.error(err)
            return
        }
    })
}


for (let i = 0; i < 10; i++) {
    metadata = {
        image: `ipfs://${trianglePNG}/${i}.png`,
        name: `Puzzled level 4 #${i}`,
        svg: `ipfs://${triangle}/${i}.svg`,
        attributes: [
            {
                "trait_type": "Difficulty",
                "value": "Level 4"
            }
        ]
    }
    fs.writeFile(`./data/${i + 11100}.json`, JSON.stringify(metadata), err => {
        if (err) {
            console.error(err)
            return
        }
    })
}