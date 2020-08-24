const main = async _ => {

    try {
        const fs = require("fs")
        const { Octokit } = require("@octokit/core")
        const { createActionAuth } = require("@octokit/auth-action")

        const auth = createActionAuth()
        const authentication = await auth()
        const octokit = new Octokit({ auth: authentication.token })
        const gh = require('parse-github-url')

        const Handlebars = require('handlebars')
        const source = require('./template')
        const template = Handlebars.compile(source)


        text = fs.readFileSync("./entry.txt", "utf8")
        let list = text.split("\r\n")
        list.sort()

        for (const item of list) {
            if (item.includes('https://github.com/')) {
                const parts = gh(item)
                console.log(`${parts.owner}, ${parts.name}`)
                let response = await octokit.request('GET /repos/{owner}/{repo}', {
                    owner: parts.owner,
                    repo: parts.name
                })
                const data = response.data
                console.log(template({ data }))
            }
        }
    } catch (error) {
        console.log(`${error}`)
        process.exit(1)
    }
}

main()
