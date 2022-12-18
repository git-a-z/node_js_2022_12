import colors from 'colors'

const args = process.argv.slice(2)
const a1 = +args[0]
const a2 = +args[1]

if (a1 === undefined || a2 === undefined || !Number.isInteger(a1) || !Number.isInteger(a2)) {
	console.log(colors.red('You need to enter 2 integers!'))
} else {
	const primes = []
	let i = Math.max(a1, 2)

	for (i; i <= a2; i++) {
		if (isPrime(i)) primes.push(i)
	}

	if (!primes.length) {
		console.log(colors.red(`No prime numbers found between ${a1} and ${a2}`))
	} else {
		for (let i = 0; i < primes.length; i++) {
			const n = (i + 1) % 3

			if (n % 3 == 0) console.log(colors.red(primes[i]))
			else if (n % 2 == 0) console.log(colors.yellow(primes[i]))
			else console.log(colors.green(primes[i]))
		}
	}
}

function isPrime(i) {
	let isPrime = true

	for (let j = 2; j < i; j++) {
		if (i % j == 0) {
			isPrime = false
			break
		}
	}

	return isPrime
}
