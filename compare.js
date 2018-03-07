const fs = require('fs')

async function main(resultFolder) {
    const guild_ids = [];
    const guild_map = {};

    const files   = fs.readdirSync(resultFolder);
    const guilds  = JSON.parse(fs.readFileSync('data/guilds.json').toString('utf8'))
        .map(guild => guild_map[guild.id] = guild.name)

    const members = files
        .map(file => { guild_ids.push(guild_map[file.replace('.json', '')]); return file })
        .map(file => fs.readFileSync(`${resultFolder}/${file}`))
        .map(file => file.toString('utf8'))
        .map(file => JSON.parse(file))


    const total     = {}
    const userbase  = {}

    members.map((users, i) =>
        users.map(user => {
            if (!total.hasOwnProperty(user.id)) {
                total[user.id] = [guild_ids[i]];
            } else {
                total[user.id].push(guild_ids[i])
            }

            userbase[user.id] = user;
        })
    )

    // remove users w/ 1 similar server
    Object.keys(total).map(userid => {
        if (total[userid].length == 1) {
            delete total[userid]
            delete userbase[userid]
        } else {
            userbase[userid].shared_servers = total[userid]
        }
    })

    fs.writeFileSync('data/users.json', JSON.stringify(userbase, null, 4))
}

main('data/members')
