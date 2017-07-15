const featRegex = /\((featuring|feat\.|feat)\s+/i
const albumFeatRegex = /\s*\(feat([^\)]+)\)/i
const whitespaceRegex = /\s+/g
const apostropheRegex = /([a-z])'(s|t)/g
const oxfordCommaRegex = /([a-z\.]), (&|and)/g
const acceptableGenres = new Set([
	'Alternative',
	'Comedy',
	'Country',
	'Dance',
	'Hip-Hop',
	'Pop',
	'R&B',
	'Reggae',
	'Rock'
])

function tidyName(track, changes, original) {
	const originalName = track.Name

	if(!originalName) {
		return
	}

	let sanitizedName = originalName.trim().replace(whitespaceRegex, ' ')

	sanitizedName = sanitizedName.replace('[', '(')
	sanitizedName = sanitizedName.replace(']', ')')
	sanitizedName = sanitizedName.replace(featRegex, '(Feat. ')
	sanitizedName = sanitizedName.replace(apostropheRegex, '$1’$2')
	sanitizedName = sanitizedName.replace(oxfordCommaRegex, '$1 $2')

	if(originalName != sanitizedName) {
		original.name = originalName
		changes.name = sanitizedName
		return true
	}
}

function tidyAlbum(track, changes, original) {
	const originalAlbum = track.Album

	if(!originalAlbum) {
		return
	}

	let sanitizedAlbum = originalAlbum.trim().replace(whitespaceRegex, ' ')

	sanitizedAlbum = sanitizedAlbum.replace('[', '(')
	sanitizedAlbum = sanitizedAlbum.replace(']', ')')
	sanitizedAlbum = sanitizedAlbum.replace(featRegex, '(Feat. ')
	sanitizedAlbum = sanitizedAlbum.replace(albumFeatRegex, '')
	sanitizedAlbum = sanitizedAlbum.replace(apostropheRegex, '$1’$2')
	sanitizedAlbum = sanitizedAlbum.replace(oxfordCommaRegex, '$1 $2')

	if(originalAlbum != sanitizedAlbum) {
		original.album = originalAlbum
		changes.album = sanitizedAlbum
		return true
	}
}

function tidyGenre(track, changes, original) {
	const originalGenre = track.Genre

	if(!originalGenre || acceptableGenres.has(originalGenre)) {
		return
	}

	const lowerGenre = originalGenre.toLowerCase()
	let normalizedGenre = originalGenre

	if(lowerGenre.includes('r&b')) {
		normalizedGenre = 'R&B'
	} else if(lowerGenre.includes('hip-hop') || lowerGenre.includes('hip hop') || lowerGenre.includes('rap')) {
		normalizedGenre = 'Hip-Hop'
	} else if(lowerGenre.includes('electronic') || lowerGenre.includes('house')) {
		normalizedGenre = 'Dance'
	} else if(lowerGenre.includes('soundtrack') || lowerGenre.includes('singer') || lowerGenre.includes('songwriter')) {
		normalizedGenre = 'Pop'
	}

	if(originalGenre != normalizedGenre) {
		original.genre = originalGenre
		changes.genre = normalizedGenre
		return true
	}
}

module.exports = function tidy(track, changes, original) {
	let count = 0

	count += tidyName(track, changes, original) === true ? 1 : 0
	count += tidyAlbum(track, changes, original) === true ? 1 : 0
	count += tidyGenre(track, changes, original) === true ? 1 : 0

	return count > 0
}
