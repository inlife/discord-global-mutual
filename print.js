const fs = require('fs')

function main() {
    const data      = JSON.parse(fs.readFileSync('data/users.json').toString('utf8'))
    const results   = Object.values(data).sort((a, b) => {
        if (a.shared_servers.length < b.shared_servers.length) {
            return 1
        } else if (a.shared_servers.length > b.shared_servers.length) {
            return -1
        }

        return 0
    }).slice(1)

    const spaces = results.map(user => user.username.length).reduce((a, b) => a > b ? a : b)

    console.log(`results: total people with shared servers found: ${results.length}`)
    results.map(user => {
        console.log(`user: ${user.username}, ${' '.repeat(spaces - user.username.length)}servers: [${user.shared_servers.join(', ')}]`)
    })
}

main()
