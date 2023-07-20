const express = require('express');
const fs = require('fs')
const path = require('path')

const app = express();
const PORT = 2083;

app.use(express.static('public'));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

async function readingDirectory(directory) {
    let fileList = [];
    const fileNames = await fs.promises.readdir(directory);

    for (let file of fileNames) {
        fileList.push(file);
    }

    return fileList;
}

async function readingImageFiles(directory) {
    let fileList = [];
    const fileNames = await fs.promises.readdir(directory);

    for (let file of fileNames) {
        fileList.push(file);
    }

    return fileList;
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/home', (req, res) => {
    res.send('Home');
});

app.get('/portfolio/projects', async (req, res) => {
    let resData = [];
    let filterList = [];
    let selectList = [];
    let projList = [];
    let srcPath;
    let despTxt = "";
    let imgList = [];
    let tmpItem = {};
    let tmpUrl = "";
    let tmpSkills = "";
    let tmpDesp = "";
    let bumpArr = [];
    let bumpImgArr = [];

    srcPath = path.join(__dirname, './public/projects');
    filterList = await readingDirectory(srcPath);

    for (let filter of filterList) {
        filter = filter.split('\\');
        filter = filter[(filter.length - 1)].toUpperCase();

        tmpItem = {
            name: filter,
            isActive: false
        }

        bumpArr.push(tmpItem);

        tmpItem = {
            text: filter,
            dataAttribute: filter
        }
        selectList.push(tmpItem);

        srcPath = path.join(__dirname, `./public/projects/${filter}`);
        projList = await readingDirectory(srcPath);

        for (let proj of projList) {
            proj = proj.split('\\');
            proj = proj[(proj.length - 1)];

            srcPath = path.join(__dirname, `./public/projects/${filter}/${proj}/images`);
            imgList = await readingDirectory(srcPath);

            for (let img of imgList) {
                img = `/projects/${filter}/${proj}/images/${img}`;
                console.log("img", img)
                bumpImgArr.push(img);
            }

            let currentList = bumpImgArr;
            bumpImgArr = [];

            srcPath = path.join(__dirname, `./public/projects/${filter}/${proj}`);

            fs.readFile(`${srcPath}/description.txt`, (err, buff) => {
                if (err) {
                    console.error(err);
                    return;
                }

                despTxt = buff.toString();

                let regex = /Url:\s*(\S+)/i;
                let match = regex.exec(despTxt);

                match && match[1] ? tmpUrl = match[1] : tmpUrl = "";

                regex = /Skills:(.*?)(?=Description:)/s;
                match = regex.exec(despTxt);
                match && match[1] ? tmpSkills = match[1] : tmpSkills = "";

                regex = /Description:\s+([\s\S]+)/;
                match = regex.exec(despTxt);
                match && match[1] ? tmpDesp = match[1] : tmpDesp = "";

                tmpItem = {
                    category: filter,
                    title: proj,
                    url: tmpUrl,
                    imageSrc: currentList,
                    skills: tmpSkills,
                    details: tmpDesp,
                }

                resData.push(tmpItem);
            });
        }
    }

    tmpItem = {
        name: "All",
        isActive: true,
    }

    bumpArr.unshift(tmpItem);
    filterList = bumpArr;
    bumpArr = [];

    // console.log(filterList);
    // console.log(selectList);
    // console.log(resData);

    fs.writeFile('./test.json', JSON.stringify(resData), err => {
        if (err) {
            console.error(err);
        }
        console.log('success');
    });

    res.send({
        filterList: filterList,
        selectList: selectList,
        projList: resData
    });
});

app.get('/reference', (req, res) => {
    res.send('reference');
});

app.get('/resume', (req, res) => {
    res.send('resume');
});

app.get('/skill', (req, res) => {
    res.send('skill');
});

app.listen(PORT, async () => {
    console.log(`Server running on port: ${PORT}`)
});