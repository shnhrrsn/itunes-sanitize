const osa = require('./osa')
const parseTrack = require('./parseTrack')
const fs = require('fs')
const itunes = require('itunes-data')

async function run() {
	const library = `${process.env.HOME}/Music/iTunes/iTunes Library.xml`
	const stream = fs.createReadStream(library)
	const parser = itunes.parser()
	const updates = [ ]

	parser.on('track', track => {
		const update = parseTrack(track)

		if(!update) {
			return
		}

		updates.push(update)
	})

	await new Promise((resolve, reject) => {
		parser.on('error', reject)
		stream.on('error', reject)
		stream.on('end', resolve)
		stream.pipe(parser)
	})

	for(const update of updates) {
		console.log('Processing', update)

		await osa(function(iTunes, data) {
			const query = iTunes.tracks.whose({ persistentID: data.persistentID })
			const track = query()[0]

			for(const field of Object.keys(data.changes)) {
				try {
					track[field] = data.changes[field]
				} catch(e) { }
			}
		}, update)
	}
}

run().catch(console.error).then(() => console.log('Done'))
