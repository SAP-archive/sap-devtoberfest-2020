module.exports = `
## {{data.name}}: {{data.description}}
[{{data.html_url}}]({{data.html_url}})

* Stars: {{data.stargazers_count}}, Forks: {{data.forks_count}}, Watchers: {{data.watchers_count}}
* Open Issues: {{data.open_issues_count}}, Has Projects: {{data.has_projects}}, Has Wiki: {{data.has_wiki}}
* Created At: {{data.created_at}}, Updated At: {{data.updated_at}}
* License: [{{data.license.name}}]({{data.license.url}})
* Owner: [{{data.owner.login}}]({{data.owner.url}})
* Contributors: [{{data.contributors_url}}]({{contributors_url}})

`