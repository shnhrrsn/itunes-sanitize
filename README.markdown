# itunes-sanitize

## Prerequisites
1. [Node 8+](https://nodejs.org/)
2. Make sure your iTunes installation is setup to [generate an XML library](https://support.apple.com/en-us/HT201610).

## Running
```bash
yarn install && node src/run.js
```

## What It Does
`itunes-sanetize` will run through your music tracks in iTunes and normalize their metadata:

* The various formats for indicating a song feature (featuring, feat., feat, etc) are changed to (Feat. Artist)
* Song features are stripped from album names for singles.  Example: Song Name (Feat. Artist) - Single => Song Name - Single
* Square brackets are replaced with parentheses
* Repeated whitespace is replaced with a single space
* Attempts to replace dumb quotes with smart quotes
* The oxford comma is stripped in song features.  Example: (Feat. A, B, & C) becomes (Feat. A, B & C)
* Generes are normalized and simplified:
	* Soundtrack, Singer, Songwriter => Pop
	* Electronic, House => Dance
	* R&B/Soul => R&B
	* Hip Hop, Rap, Hip-Hop/Rap => Hip-Hop
