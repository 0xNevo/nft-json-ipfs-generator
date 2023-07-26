const express = require('express');
const fs = require('fs')
const path = require('path')

const app = express();
const PORT = 2083;

// app.use(express.static('public'));
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
// });

async function generateTxtfiles() {
    let cnt = 40;

    async function writeTextToFile(filePath, text) {
        fs.writeFile(filePath, JSON.stringify(text), (err) => {
            if (err) {
                console.error(`Error writing to file ${filePath}: ${err}`);
            } else {
                console.log(`Text written to ${filePath} successfully.`);
            }
        });
    }

    async function padWithLeadingZeros(num, totalLength) {
        return tmpVal = String(num).padStart(totalLength, '0');
    }

    let filesAndText = [];
    let tmpObj = {};

    for (let i = 0; i < cnt; i++) {
        let pathVal = await padWithLeadingZeros((i + 1), 5);

        tmpObj = {};
        tmpObj.filePath = `./jsonData/${(i + 1)}.json`;
        tmpObj.text = {
            "id": `${i + 1}`,
            "name": "JellyDawgs",
            "descrition": "This is a NFT for inkwork collection with custom NFT",
            "image": "https://gateway.pinata.cloud/ipfs/",
            "image": `https://sapphire-tremendous-bonobo-765.mypinata.cloud/ipfs/QmTVfjTpZyFJtTtMPxXo3ohTXypVdMH8cztVsxFagjTyn9/${(i + 1)}.jpg`
        }

        filesAndText.push(tmpObj);
    }

    filesAndText.forEach(({ filePath, text }) => {
        writeTextToFile(filePath, text);
    });
}

app.get('/generate-json', async (req, res) => {
    await generateTxtfiles();

    res.send('successed');
});

app.listen(PORT, async () => {
    console.log(`Server running on port: ${PORT}`)
});