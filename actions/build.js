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
        let list = text.split("\n")
        list.sort()

        console.log(`# Devtoberfest 2020 Project Entries`)
        for (const item of list) {
            if (item.includes('https://github.com/')) {
                const parts = gh(item)
                //console.log(`${parts.owner}, ${parts.name}`)
                let response = await octokit.request('GET /repos/{owner}/{repo}', {
                    owner: parts.owner,
                    repo: parts.name
                })
                const data = response.data
                data.created_at_formatted = new Date(data.created_at).toUTCString()
                data.updated_at_formatted = new Date(data.updated_at).toUTCString()

                data.contributors = [];
                let page = 1;
                while (true) {
                    let contributors = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
                        owner: parts.owner,
                        repo: parts.name,
                        per_page: 100,
                        page
                    })
                    if (contributors.data.length === 0) {
                      break;
                    }
                    page++;
                    data.contributors = data.contributors.concat(contributors.data)
                }

                if(data.license.url){
                    const parts = gh(data.license.url)
                   //console.log(parts.pathname)
                    let license = await octokit.request(`GET /${parts.pathname}`, {})
                    data.license.html_url = license.data.html_url
                }
                console.log(template({ data }))
            }
        }
        console.log(`![Entries builder](https://github.com/sap-samples/sap-devtoberfest-2020/workflows/Entries%20builder/badge.svg)`)
    } catch (error) {
        console.log(`${error}`)
        process.exit(1)
    }
}

main()
