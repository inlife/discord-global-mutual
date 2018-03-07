# discord-global-mutual

Repo consists of 3 different scripts.

1. **export** - lists and exports all people from all guilds/servers you are joined to, in the json format
2. **compare** - compares people across all servers, and reduces list to people that have one than more shared server with you, saves in the json format
3. **print** - prints list in the console

# usage

```sh
$ node export.js [YOUR_DISCORD_USER_AUTH_TOKEN]
$ node compare.js
$ node print.js > output.txt
```
