#!/usr/bin/env node

import colors from 'colors'
import fs from 'fs';
import fsp from 'fs/promises';
import readline from 'readline';
import inquirer from 'inquirer';
import path from 'path';
import { EOL } from 'os';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question(colors.yellow('Enter the path to the directory: '), async (__dirname) => {
    if (!__dirname) __dirname = process.cwd();
    else {
        try {
            await fsp.access(__dirname);
        } catch (error) {
            console.log(colors.red('Directory not found, current directory will be used.'));
            __dirname = process.cwd();
        }
    }
    readdir(__dirname);
})

const readdir = (__dirname) => {
    fsp.readdir(__dirname)
        .then((choices) => {
            return inquirer
                .prompt({
                    name: "chosenItem",
                    type: 'list',
                    message: "Choose a file or directory",
                    choices
                })
        })
        .then(async ({ chosenItem }) => {
            const chosenPath = path.join(__dirname, chosenItem);
            const src = await fsp.stat(chosenPath);
            if (src.isFile()) return chosenPath;
            readdir(chosenPath);
        })
        .then((chosenPath) => {
            if (chosenPath) findInFile(chosenPath);
        });
}

const findInFile = (fileName) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    rl.question(colors.yellow('Enter search pattern: '), (pattern) => {
        if (!pattern) pattern = '89.123.1.41';
        const rs = fs.createReadStream(fileName);
        const ws = fs.createWriteStream(`logs/${pattern}.log`, { encoding: 'utf8', flags: 'a' });
        const rlrs = readline.createInterface({ input: rs });

        rlrs.on('line', (line) => {
            if (line.includes(pattern)) ws.write(`${line}${EOL}`);
        }).on('close', () => {
            console.log(colors.green('File reading completed'));
            rl.close();
        });
    })
}
