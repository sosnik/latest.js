// latest.js - a simple redirect tool to obtain a specific asset from the latest release of a Github Repo
// This version uses native modules only
const http = require('http')
const https = require('https')
const package = require('./package.json')
const port = 3000
const ua = `${package.name} - v${package.version}-app - by ${package.author}`

async function get(url) {
	return new Promise((resolve) => {
		let data = ''
		https.get(url, {headers: {'user-agent': ua}}, res => {
			res.on('data', chunk => { data += chunk }) 
			res.on('end', () => {
				resolve(data)
			})
		}) 
	})
}

function respondWithError(res, code, message) {
	res.writeHead(code, {'Content-Type': 'text/html'})
	res.write(message)
	res.end()
}

http.createServer(async function (req, res) {
	let args = req.url.split("/").slice(1)
	if (args.length !== 3)
		respondWithError(res, 400, '400: Bad request.<br/>Usage: hostname.tld/:owner/:repo/:filter')

	try {
		let data = JSON.parse(await get(`https://api.github.com/repos/${args[0]}/${args[1]}/releases`))
		for (asset of data[0].assets) {
			if (asset.name.includes(args[2])) {
				res.writeHead(302, {
				  'Location': asset.browser_download_url
				})
				res.end()
				break
			}
		}
		if (!res.writableEnded)
			respondWithError(res, 404, '404: No asset found corresponding to supplied filter')
	} catch (e) {
		if (e.response && e.response.statusCode == 404) {
			respondWithError(res, 404, '404: repo not found')
		} else {
			respondWithError(res, 500, '500: Likely an error dealing with github API')
		}
	}
})
.listen(port, function(){
	console.log(`${package.name}-simple version ${package.version} listening on port ${port}`)
})