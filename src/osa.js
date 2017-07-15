const { spawn } = require('child_process')

module.exports = function osa(func, data) {
	// Ideally this should reuse the repl, but unable to get it to
	// respond without calling `stdin.end()`
	const child = spawn('osascript', [ '-l', 'JavaScript', '-i' ])

	return new Promise(resolve => {
		child.stdout.once('data', result => {
			child.kill()
			return resolve(result.toString())
		})

		child.stdin.write(`(${func})(Application('iTunes'), ${JSON.stringify(data || { })})\n`, 'utf8')
		child.stdin.end()
	})
}
