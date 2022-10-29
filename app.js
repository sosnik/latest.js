// latest.js - a simple redirect tool to obtain a specific asset from the latest release of a Github Repo
// This version uses external modules
const express = require('express')
const got = require('got')
const package = require('./package.json')
const app = express()
const port = 3000
const ua = `${package.name} - v${package.version}-app - by ${package.author}`

app.get('/:owner/:repo/:filter', async (req, res) => {
	try {
		let data = await got(`https://api.github.com/repos/${req.params.owner}/${req.params.repo}/releases`, {headers: {'user-agent': ua}}).json()
		for (asset of data[0].assets) {
			if (asset.name.includes(req.params.filter)) {
				res.redirect(asset.browser_download_url)
				break;
			}
		}
		if (!res.writableEnded)
			res.status(404).send('404: No asset found corresponding to supplied filter')
	} catch (e) {
		if (e.response && e.response.statusCode == 404) {
			res.status(404).send('404: repo not found')
		} else {
			res.status(500).send('500: Likely an error dealing with github API')
		}
	}
})
app.all('*', (req, res) => {res.status(400).send('400: Bad request.<br/>Usage: hostname.tld/:owner/:repo/:filter')})

app.listen(port, () => {
	console.log(`${package.name}-app version ${package.version} listening on port ${port}`)
})