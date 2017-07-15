const osa = require('./osa')
const parseTrack = require('./parseTrack')
const fs = require('fs')
const itunes = require('itunes-data')

async function run() {
	const library = `${process.env.HOME}/Music/iTunes/iTunes Music Library.xml`
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
		stream.pipe(parser)
		stream.on('error', reject)
		stream.on('end', resolve)
	})

	for(const update of updates) {
		console.log('Processing', update)

		await osa(function(iTunes, data) {
			const track = iTunes.tracks.whose({
				persistentID: data.persistentID
			})()[0]

			if(data.changes.name) {
				try {
					track.name = data.changes.name
				} catch(e) { }
			}

			if(data.changes.album) {
				try {
					track.album = data.changes.album
				} catch(e) { }
			}

			if(data.changes.genre) {
				try {
					track.genre = data.changes.genre
				} catch(e) { }
			}
		}, update)
	}
}

run().catch(console.error).then(() => console.log('Done'))
