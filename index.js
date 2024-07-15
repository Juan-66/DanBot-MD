import { join, dirname } from 'path'
import { createRequire } from 'module';
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts';
import { createInterface } from 'readline'
import yargs from 'yargs'
import express from 'express'
import chalk from 'chalk'
import path from 'path'
import os from 'os'
import { promises as fsPromises } from 'fs'

// https://stackoverflow.com/a/50052194
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname) //Incorpora la capacidad de crear el método 'requerir'
const { name, author } = require(join(__dirname, './package.json')) //https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)

//const app = express()
//const port = process.env.PORT || 8080;

say('Dan\nBot\nMD', {
font: 'chrome',
align: 'center',
gradient: ['#bd6a6e', '#c33e4d']})
say(`Por Juan-66`, {
font: 'console',
align: 'center',
gradient: ['#ed434b', '#5e978b']})

var isRunning = false

async function start(file) {
if (isRunning) return
isRunning = true
const currentFilePath = new URL(import.meta.url).pathname
let args = [join(__dirname, file), ...process.argv.slice(2)]
say([process.argv[0], ...args].join(' '), {
font: 'console',
align: 'center',
gradient: ['#ce444c', '#4a5e67']
})
setupMaster({exec: args[0], args: args.slice(1),
})
let p = fork()
p.on('message', data => {
switch (data) {
case 'reset':
p.process.kill()
isRunning = false
start.apply(this, arguments)
break
case 'uptime':
p.send(process.uptime())
break
}})

p.on('exit', (_, code) => {
isRunning = false
console.error('⚠️ ERROR ⚠️ >> ', code)
start('main.js'); //

if (code === 0) return
watchFile(args[0], () => {
unwatchFile(args[0])
start(file)
})})

const ramInGB = os.totalmem() / (1024 * 1024 * 1024)
const freeRamInGB = os.freemem() / (1024 * 1024 * 1024)
const packageJsonPath = path.join(path.dirname(currentFilePath), './package.json')
try {
const packageJsonData = await fsPromises.readFile(packageJsonPath, 'utf-8')
const packageJsonObj = JSON.parse(packageJsonData)
const currentTime = new Date().toLocaleString()
let lineM = '⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》'
console.log(chalk.yellow(`╭${lineM}
┊${chalk.hex("#e9653e")('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊${chalk.hex("#e9653e")('┊')}${chalk.orange(`🖥️ ${os.type()}, ${os.release()} - ${os.arch()}`)}
┊${chalk.hex("#e9653e")('┊')}${chalk.orange(`💾 Total RAM: ${ramInGB.toFixed(2)} GB`)}
┊${chalk.hex("#e9653e")('┊')}${chalk.orange(`💽 Free RAM: ${freeRamInGB.toFixed(2)} GB`)}
┊${chalk.hex("#e9653e")('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊${chalk.hex("#e9653e")('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊${chalk.hex("#e9653e")('┊')} ${chalk.blue.bold(`🟢INFORMACIÓN :`)}
┊${chalk.hex("#e9653e")('┊')} ${chalk.blueBright('┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')} 
┊${chalk.hex("#e9653e")('┊')}${chalk.cyan(`💚 Nombre: ${packageJsonObj.name}`)}
┊${chalk.hex("#e9653e")('┊')}${chalk.cyan(`🐉 Versión: ${packageJsonObj.version}`)}
┊${chalk.hex("#e9653e")('┊')}${chalk.cyan(`💜 Descripción: ${packageJsonObj.description}`)}
┊${chalk.hex("#e9653e")('┊')}${chalk.cyan(`🐲 Project Author: ${packageJsonObj.author.name} (@gata_dios)`)}
┊${chalk.hex("#e9653e")('┊')}${chalk.blueBright('┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')} 
┊${chalk.hex("#e9653e")('┊')}${chalk.orange(`💜 Colaboradores:`)}
┊${chalk.hex("#e9653e")('┊')}${chalk.orange(`• GataNina-Li (Gata Dios)`)}
┊${chalk.hex("#e9653e")('┊')}${chalk.orange(`• elrebelde21 (Mario ofc)`)}
┊${chalk.hex("#e9653e")('┊')}${chalk.orange(`• KatashiFukushima (Katashi)`)}
┊${chalk.hex("#e9653e")('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')} 
┊${chalk.hex("#e9653e")('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊${chalk.hex("#e9653e")('┊')}${chalk.cyan(`⏰ Hora Actual :`)}
┊${chalk.hex("#e9653e")('┊')}${chalk.cyan(`${currentTime}`)}
┊${chalk.hex("#e9653e")('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')} 
╰${lineM}`));
setInterval(() => {}, 1000)
} catch (err) {
console.error(chalk.red(`❌ No se pudo leer el archivo package.json: ${err}`))
}

let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
if (!opts['test'])
if (!rl.listenerCount()) rl.on('line', line => {
p.emit('message', line.trim())
})}

start('main.js')
