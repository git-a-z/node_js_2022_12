import colors from 'colors'
import EventEmitter from "events"

const args = process.argv.slice(2)

if (!args.length) {
    console.log(colors.red('You need to enter at least 1 argument!'))
    process.exit(0)
}

class Handler {
    static timeLeft(payload) {
        console.log(`${payload}`)
    }
    static timeIsUp(payload) {
        console.log(colors.red(`${payload}`))
    }
}

const emitter = new class extends EventEmitter { }
emitter.on('timeLeft', Handler.timeLeft)
emitter.on('timeIsUp', Handler.timeIsUp)

for (let arg of args) {
    const arr = arg.split('-').map(a => +a)

    if (arr.length !== 4) {
        console.log(colors.red(`The date format includes 4 elements. \nYou must enter the date in the format "hour-day-month-year"!`))
        process.exit(0)
    }

    for (let a of arr) {
        if (!Number.isInteger(a)) {
            console.log(colors.red(`Date elements must be integers. \nYou must enter the date in the format "hour-day-month-year"!`))
            process.exit(0)
        }
    }

    let [hour, day, month, year] = arr
    const timer = new Date(year, --month, day, hour)
    timeLeft(timer, `Timer ${args.indexOf(arg) + 1}`)
}

function timeLeft(timer, name) {
    const now = new Date()
    const diff = timer - now

    if (diff >= 1000) {
        let sum = 0
        const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24))
        sum = sum + dayDiff * 1000 * 60 * 60 * 24
        const hourDiff = Math.floor((diff - sum) / (1000 * 60 * 60))
        sum = sum + hourDiff * 1000 * 60 * 60
        const minDiff = Math.floor((diff - sum) / (1000 * 60))
        sum = sum + minDiff * 1000 * 60
        const secDiff = Math.floor((diff - sum) / 1000)

        emitter.emit('timeLeft', `${name}: ${dayDiff} days ${hourDiff} hours ${minDiff} minutes ${secDiff} seconds left`)

        setTimeout(() => {
            timeLeft(timer, name)
        }, 1000)
    } else {
        emitter.emit('timeIsUp', `${name}: Time is up!`)
    }
}
