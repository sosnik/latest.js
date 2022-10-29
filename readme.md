# `latest.js`
`latest.js` is a simple node.js redirect server to obtain a specific asset from the latest release of a Github Repo.

There are two versions of `latest.js`: 

 * `app.js` using both `express.js` and `got.js`; and 
 * `simple.js` using native node.js modules with no further dependencies.

# Why
`latest.js` was created for convenient docker container builds.
While you can get the latest tarball or zipball for a particular repo directly from Github, there is no convenient way to retrieve a specific asset (such as an architecture-dependent binary).

I started with `express`/`got` for proof of concept and then rewrote the script with native tools because 79 dependencies is complete overkill. 

# Usage
Once either `app.js` or `simple.js` is running somewhere, send a GET to: `hostname.tld/:owner/:repo/filter`.
You will be redirected to the direct download url of the first asset to match `:filter`.  

`:filter` is a text (**not regex**) search string, such as `linux-musl-x64`.

# License
MIT
