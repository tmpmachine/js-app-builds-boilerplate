import { glob } from 'glob'
import { transform } from 'lightningcss';
import * as fs from 'fs';
import Path from 'path'
import { minify } from 'uglify-js';
import * as htmlMinifier from 'html-minifier';
import * as fsExtra from 'fs-extra';

let relativeBasePath = "app/src/";

function minifyCSS(srcPath, outputDir) {
    const filename = Path.basename(srcPath);
    const relativePath = Path.relative(relativeBasePath, srcPath);
    const outputPath = Path.join(outputDir, relativePath);
    const outputDirPath = Path.dirname(outputPath);

    fs.readFile(srcPath, 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return;
        }

        let { code, map } = transform({
            filename,
            targets: { 
                chrome: 95, 
            },
            code: Buffer.from(data),
            minify: true,
            sourceMap: false
        });

        if (!fs.existsSync(outputDirPath)){
            fs.mkdirSync(outputDirPath, { recursive: true });
        }

        fs.writeFile(outputPath, code, () => {
            console.log(`Minified ${srcPath} -> ${outputPath}`);
        });

    })
}

function minifyHTML(srcPath, outputDir) {
    const filename = Path.basename(srcPath);
    const relativePath = Path.relative(relativeBasePath, srcPath);
    const outputPath = Path.join(outputDir, relativePath);
    const outputDirPath = Path.dirname(outputPath);

    fs.readFile(srcPath, 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        let content = htmlMinifier.minify(data, {
            removeComments: true,
            collapseWhitespace: true,
        })

        if (!fs.existsSync(outputDirPath)){
            fs.mkdirSync(outputDirPath, { recursive: true });
        }

        fs.writeFile(outputPath, content, () => {
            console.log(`Minified ${srcPath} -> ${outputPath}`);
        });
    })
}

// Function to minify files
function minifyFile(filePath, outputDir) {
    const relativePath = Path.relative(relativeBasePath, filePath);
    const outputPath = Path.join(outputDir, relativePath);
    const outputDirPath = Path.dirname(outputPath);

    if (!fs.existsSync(outputDirPath)){
        fs.mkdirSync(outputDirPath, { recursive: true });
    }

    const result = minify(fs.readFileSync(filePath, 'utf8'));

    if (result.error) {
        console.error(`Error minifying ${filePath}:`, result.error);
        return;
    }
    fs.writeFileSync(outputPath, result.code, 'utf8');
    console.log(`Minified ${filePath} -> ${outputPath}`);
}

async function readBuildVersion() {

    return new Promise(resolve => {
        // Path to the version.json file
        const versionFilePath = `app/src/build-version.json`;

        // Read the version from the version.json file
        fs.readFile(versionFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading version file: ${err.message}`);
                return;
            }

            const {version} = JSON.parse(data);
            resolve(version);
        })
    })
}

(async function () {

    let version = await readBuildVersion();
    let outputDir = `public/solid/v${version}`;

    await fsExtra.remove(outputDir)

    const jsfiles = await glob('app/src/**/*.js', { ignore: '**/sw.js' })
    const cssfiles = await glob('app/src/**/*.css')
    const htmlfiles = await glob('app/src/**/*.html', { ignore: '.divless' })
    const jsonfiles = await glob('app/src/**/*.json',  { ignore: ['**/build-version.json', '**/jsconfig.json'] })

    htmlfiles.forEach(filePath => {
        minifyHTML(filePath, outputDir);
    });

    cssfiles.forEach(filePath => {
        minifyCSS(filePath, outputDir);
    });

    jsfiles.forEach(filePath => {
        minifyFile(filePath, outputDir);
    });

    jsonfiles.forEach(filePath => {
        const relativePath = Path.relative("app/src/", filePath);
        const outputPath = Path.join(outputDir, relativePath);
        fsExtra.copySync(filePath, outputPath);
    });

    await fsExtra.remove(outputDir+'/assets/shared/');

})();