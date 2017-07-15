const tidy = require('./tidy')

module.exports = function parseTrack(track) {
	if(track.Movie !== void 0 || track['TV Show'] !== void 0 || track['Music Video'] !== void 0) {
		return null
	}

	if(track['Date Added'] === void 0) {
		return null
	}

	const changes = { }
	const original = { }

	if(!tidy(track, changes, original)) {
		return null
	}

	return {
		original: original,
		changes: changes,
		persistentID: track['Persistent ID']
	}
}
