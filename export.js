const r2 = require('r2')
const fs = require('fs')

const baseurl = 'https://discordapp.com/api'
const headers = { 'authorization': process.argv[2] }

async function getMembers(id, headers, after = '') {
    console.log(`[info] requesting users for guild: ${id}`);
    try {
        const response = await r2(`${baseurl}/guilds/${id}/members?limit=1000${after}`, { headers }).response
        const results  = (await response.json()) || []
        const users    = results.map(record => record.user)

        if (users.length === 1000) {
            const lastid = users[users.length - 1].id;
            return users.concat(await getMembers(id, headers, `&after=${lastid}`))
        }

        return users
    } catch (e) {
        console.log(e)
        return []
    }
}

async function main(resultFolder) {
    if (!headers.authorization) {
        console.warn('[warn] you must provide a user discord auth token: node export.js [YOURTOKEN]')
        return
    }

    // remove old data
    fs.mkdir(resultFolder, () => {})
    fs.readdirSync(resultFolder).map(file => fs.unlinkSync(`${resultFolder}/${file}`));

    // get new data
    const response = await r2(`${baseurl}/users/@me/guilds`, { headers }).json
    const guildids = response.map(guild => guild.id)
    const promises = guildids.map(async id => await getMembers(id, headers))
    const results  = await Promise.all(promises);

    fs.writeFileSync('data/guilds.json', JSON.stringify(response, null, 4))

    // save new data
    results.map((members, i) => {
        fs.writeFileSync(`${resultFolder}/${guildids[i]}.json`, JSON.stringify(members))
    })
}

main('data/members')
