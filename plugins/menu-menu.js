import fs from 'fs'
import translate from '@vitalets/google-translate-api'
import moment from 'moment-timezone'
import ct from 'countries-and-timezones'
import { parsePhoneNumber } from 'libphonenumber-js'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
const { levelling } = '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
import chalk from 'chalk'

let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, command }) => {
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
let bot = global.db.data.settings[conn.user.jid] || {}

const commandsConfig = [
{ comando: (bot.restrict ? 'off ' : 'on ') + 'restringir , restrict', descripcion: bot.restrict ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Permisos para el Bot', showPrefix: true },
{ comando: (bot.antiCall ? 'off ' : 'on ') + 'antillamar , anticall', descripcion: bot.antiCall ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Evitar recibir llamadas en el Bot', showPrefix: true },
{ comando: (bot.temporal ? 'off ' : 'on ') + 'temporal', descripcion: bot.temporal ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Ingreso del Bot temporalmente en grupos', showPrefix: true },
{ comando: (bot.jadibotmd ? 'off ' : 'on ') + 'serbot , jadibot', descripcion: bot.jadibotmd ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Permitir o no Sub Bots en este Bot', showPrefix: true },
{ comando: (bot.antiSpam ? 'off ' : 'on ') + 'antispam', descripcion: bot.antiSpam ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Dar advertencia por hacer Spam', showPrefix: true },
{ comando: (bot.antiSpam2 ? 'off ' : 'on ') + 'antispam2', descripcion: bot.antiSpam2 ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Omitir resultado de comandos consecutivos', showPrefix: true },
{ comando: (bot.antiPrivate ? 'off ' : 'on ') + 'antiprivado , antiprivate', descripcion: bot.antiPrivate ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Prohibe que este Bot sea usado en privado', showPrefix: true },
{ comando: (global.opts['self'] ? 'on ' : 'off ') + 'publico , public', descripcion: global.opts['self'] ? '❌' + 'Desactivado || Disabled' : '✅' + 'Activado || Activated', contexto: 'Permitir que todos usen el Bot', showPrefix: true },
{ comando: (global.opts['autoread'] ? 'off ' : 'on ') + 'autovisto , autoread', descripcion: global.opts['autoread'] ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Mensajes leídos automáticamente', showPrefix: true },
{ comando: (global.opts['gconly'] ? 'off ' : 'on ') + 'sologrupos , gconly', descripcion: global.opts['gconly'] ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Hacer que funcione sólo en grupos', showPrefix: true },
{ comando: (global.opts['pconly'] ? 'off ' : 'on ') + 'soloprivados , pconly', descripcion: global.opts['pconly'] ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Hacer que funcione sólo al privado', showPrefix: true },
 
{ comando: m.isGroup ? (chat.welcome ? 'off ' : 'on ') + 'bienvenida , welcome' : false, descripcion: m.isGroup ? (chat.welcome ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Establecer bienvenida en grupos', showPrefix: true },
{ comando: m.isGroup ? (chat.detect  ? 'off ' : 'on ') + 'avisos , detect' : false, descripcion: m.isGroup ? (chat.detect  ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Avisos importantes en grupos', showPrefix: true },
{ comando: m.isGroup ? (chat.autolevelup  ? 'off ' : 'on ') + 'autonivel , autolevelup' : false, descripcion: m.isGroup ? (chat.autolevelup  ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Subir de nivel automáticamente', showPrefix: true },
{ comando: m.isGroup ? (chat.modoadmin  ? 'off ' : 'on ') + 'modoadmin , modeadmin' : false, descripcion: m.isGroup ? (chat.modoadmin  ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Sólo admins podrán usar en grupo', showPrefix: true },

{ comando: m.isGroup ? (chat.stickers ? 'off ' : 'on ') + 'stickers' : false, descripcion: m.isGroup ? (chat.stickers ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Stickers automáticos en chats', showPrefix: true }, 
{ comando: m.isGroup ? (chat.autosticker ? 'off ' : 'on ') + 'autosticker' : false, descripcion: m.isGroup ? (chat.autosticker ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Multimedia a stickers automáticamente', showPrefix: true }, 
{ comando: m.isGroup ? (chat.reaction ? 'off ' : 'on ') + 'reacciones , reaction' : false, descripcion: m.isGroup ? (chat.reaction ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Reaccionar a mensajes automáticamente', showPrefix: true }, 
{ comando: m.isGroup ? (chat.audios ? 'off ' : 'on ') + 'audios' : false, descripcion: m.isGroup ? (chat.audios ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Audios automáticos en chats', showPrefix: true }, 
{ comando: m.isGroup ? (chat.modohorny ? 'off ' : 'on ') + 'modocaliente , modehorny' : false, descripcion: m.isGroup ? (chat.modohorny ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Comandos con contenido para adultos', showPrefix: true }, 
{ comando: m.isGroup ? (chat.antitoxic ? 'off ' : 'on ') + 'antitoxicos , antitoxic' : false, descripcion: m.isGroup ? (chat.antitoxic ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Sancionar/eliminar a usuarios tóxicos', showPrefix: true },
{ comando: m.isGroup ? (chat.antiver ? 'off ' : 'on ') + 'antiver , antiviewonce' : false, descripcion: m.isGroup ? (chat.antiver ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: ' No acultar mensajes de \"una sola vez\"', showPrefix: true }, 
{ comando: m.isGroup ? (chat.delete ? 'off ' : 'on ') + 'antieliminar , antidelete' : false, descripcion: m.isGroup ? (chat.delete ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Mostrar mensajes eliminados', showPrefix: true },
{ comando: m.isGroup ? (chat.antifake ? 'off ' : 'on ') + 'antifalsos , antifake' : false, descripcion: m.isGroup ? (chat.antifake ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar usuarios falsos/extranjeros', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTraba ? 'off ' : 'on ') + 'antitrabas , antilag' : false, descripcion: m.isGroup ? (chat.antiTraba ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Enviar mensaje automático en caso de lag', showPrefix: true },
{ comando: m.isGroup ? (chat.simi ? 'off ' : 'on ') + 'simi' : false, descripcion: m.isGroup ? (chat.simi ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'SimSimi responderá automáticamente', showPrefix: true },
{ comando: m.isGroup ? (chat.modoia ? 'off ' : 'on ') + 'ia' : false, descripcion: m.isGroup ? (chat.modoia ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Inteligencia artificial automática', showPrefix: true },

{ comando: m.isGroup ? (chat.antilink ? 'off ' : 'on ') + 'antienlace , antilink' : false, descripcion: m.isGroup ? (chat.antilink ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de WhatsApp', showPrefix: true },
{ comando: m.isGroup ? (chat.antilink2 ? 'off ' : 'on ') + 'antienlace2 , antilink2' : false, descripcion: m.isGroup ? (chat.antilink2 ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces que contenga \"https\"', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTiktok ? 'off ' : 'on ') + 'antitiktok , antitk' : false, descripcion: m.isGroup ? (chat.antiTiktok ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de TikTok', showPrefix: true },
{ comando: m.isGroup ? (chat.antiYoutube ? 'off ' : 'on ') + 'antiyoutube , antiyt' : false, descripcion: m.isGroup ? (chat.antiYoutube ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de YouTube', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTelegram ? 'off ' : 'on ') + 'antitelegram , antitg' : false, descripcion: m.isGroup ? (chat.antiTelegram ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de Telegram', showPrefix: true },
{ comando: m.isGroup ? (chat.antiFacebook ? 'off ' : 'on ') + 'antifacebook , antifb' : false, descripcion: m.isGroup ? (chat.antiFacebook ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de Facebook', showPrefix: true },
{ comando: m.isGroup ? (chat.antiInstagram ? 'off ' : 'on ') + 'antinstagram , antig' : false, descripcion: m.isGroup ? (chat.antiInstagram ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de Instagram', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTwitter ? 'off ' : 'on ') + 'antiX' : false, descripcion: m.isGroup ? (chat.antiTwitter ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de X (Twitter)', showPrefix: true },
]
 
try {
let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
let { exp, limit, level, role } = global.db.data.users[m.sender]
let { min, xp, max } = xpRange(level, global.multiplier)
let name = await conn.getName(m.sender)
let d = new Date(new Date + 3600000)
let locale = 'es'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
day: 'numeric',
month: 'long',
year: 'numeric'
})
let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
day: 'numeric',
month: 'long',
year: 'numeric'
}).format(d)
let time = d.toLocaleTimeString(locale, {
hour: 'numeric',
minute: 'numeric',
second: 'numeric'
})
let _uptime = process.uptime() * 1000
let _muptime
if (process.send) {
process.send('uptime')
_muptime = await new Promise(resolve => {
process.once('message', resolve)
setTimeout(resolve, 1000)
}) * 1000
}
let { money, joincount } = global.db.data.users[m.sender]
let muptime = clockString(_muptime)
let uptime = clockString(_uptime)
let totalreg = Object.keys(global.db.data.users).length
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
let replace = {
'%': '%',
p: _p, uptime, muptime,
me: conn.getName(conn.user.jid),
npmname: _package.name,
npmdesc: _package.description,
version: _package.version,
exp: exp - min,
maxexp: xp,
totalexp: exp,
xp4levelup: max - exp,
github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
readmore: readMore
}
text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
let taguser = '@' + m.sender.split("@s.whatsapp.net")[0]
let pp = "./Menu2.jpg"
let pareja = global.db.data.users[m.sender].pasangan 
const numberToEmoji = { "0": "0️⃣", "1": "1️⃣", "2": "2️⃣", "3": "3️⃣", "4": "4️⃣", "5": "5️⃣", "6": "6️⃣", "7": "7️⃣", "8": "8️⃣", "9": "9️⃣", }
let lvl = level
let emoji = Array.from(lvl.toString()).map((digit) => numberToEmoji[digit] || "❓").join("")

let fechaMoment, formatDate, nombreLugar, ciudad = null
const phoneNumber = '+' + m.sender
const parsedPhoneNumber = parsePhoneNumber(phoneNumber)
const countryCode = parsedPhoneNumber.country
const countryData = ct.getCountry(countryCode)
const timezones = countryData.timezones
const zonaHoraria = timezones.length > 0 ? timezones[0] : 'UTC'
moment.locale(mid.idioma_code)
let lugarMoment = moment().tz(zonaHoraria)
if (lugarMoment) {
fechaMoment = lugarMoment.format('llll [(]a[)]')
formatDate = fechaMoment.charAt(0).toUpperCase() + fechaMoment.slice(1) 
nombreLugar = countryData.name
const partes = zonaHoraria.split('/')
ciudad = partes[partes.length - 1].replace(/_/g, ' ')
}else{
lugarMoment = moment().tz('America/Lima')
fechaMoment = lugarMoment.format('llll [(]a[)]')
formatDate = fechaMoment.charAt(0).toUpperCase() + fechaMoment.slice(1) 
nombreLugar = 'America'
ciudad = 'Lima'
}	
let margen = '*··················································*'
let menu = `${lenguajeGB['smsConfi2']()} *${user.genero === 0 ? '👤' : user.genero == 'Ocultado 🕶️' ? `🕶️` : user.genero == 'Mujer 🚺' ? `🚺` : user.genero == 'Hombre 🚹' ? `🚹` : '👤'} ${user.registered === true ? user.name : taguser}* ${(conn.user.jid == global.conn.user.jid ? '' : `\n*SOY SUB BOT DE: https://wa.me/${global.conn.user.jid.split`@`[0]}*`) || ''}

*¡HOLA! ${taguser}* 
*BIENVENIDO AL MENU DE TILIN*

*··················································*

╭━━━━━━━━━━━━━━━━━━━╮
┃    🌟TU INFORMACION:🌟    ┃
╰━━━━━━━━━━━━━━━━━━━╯

*➺ NIVEL: ${level} 💹*
*➺ EXPERIENCIA: ${exp} ⚡*
*➺ROL: ${role} 🤠*
*➺DIAMANTES: ${limit} 💎*
*➺TILINCoins: ${money} 🪙*
*➺TOKENS: ${joincount} 💲*
*➺PREMIUM:* ${user.premiumTime > 0 ? '✅' : (isPrems ? '✅' : '❌') || ''}

*··················································*

> *📋LISTA DE MENUS📋* 
 
╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}menuaudios🔊_
┃➺ _${usedPrefix}menuanimes🖥️_
┃➺ _${usedPrefix}glx🌠_
╰━━━━━ • ◆ • ━━━━━╯
 
*··················································*

> *❗SOBRE EL BOT❗* 
 
╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}grupos_
┃➺ _${usedPrefix}estado_
┃➺ _${usedPrefix}infobot_
┃➺ _${usedPrefix}speedtest_
┃➺ _${usedPrefix}donar_
┃➺ _${usedPrefix}owner_
┃➺ _${usedPrefix}reporte *<txt>*_
┃➺ _${usedPrefix}fixmsgespera_
┃➺ _bot_ (sin prefijo)
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *🎮COMANDOS DE FF Y SORTEOS🎮* 

╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}donarsala_
┃➺ _${usedPrefix}3ganadores_
┃➺ _${usedPrefix}scrim_
┃➺ _${usedPrefix}4vs4_
┃➺ _${usedPrefix}6vs6_
┃➺ _${usedPrefix}8vs8_
┃➺ _${usedPrefix}12vs12_
┃➺ _${usedPrefix}16vs16_
┃➺ _${usedPrefix}20vs20_
┃➺ _${usedPrefix}24vs24_
┃➺ _${usedPrefix}internafem_
┃➺ _${usedPrefix}internamasc_
┃➺ _${usedPrefix}internamixta_
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *🎲JUEGOS🎲* 
 
╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}mates *<noob / easy / medium / hard / extreme /impossible /impossible2>*_
┃➺ _${usedPrefix}fake *<txt1> <@tag> <txt2>*_
┃➺ _${usedPrefix}ppt *<papel / tijera /piedra>*_
┃➺ _${usedPrefix}prostituto *<nombre / @tag>*_
┃➺ _${usedPrefix}prostituta *<nombre / @tag>*_
┃➺ _${usedPrefix}gay2 *<nombre / @tag>*_
┃➺ _${usedPrefix}lesbiana *<nombre / @tag>*_
┃➺ _${usedPrefix}pajero *<nombre / @tag>*_
┃➺ _${usedPrefix}pajera *<nombre / @tag>*_
┃➺ _${usedPrefix}puto *<nombre / @tag>*_
┃➺ _${usedPrefix}puta *<nombre / @tag>*_
┃➺ _${usedPrefix}manco *<nombre / @tag>*_
┃➺ _${usedPrefix}manca *<nombre / @tag>*_
┃➺ _${usedPrefix}rata *<nombre / @tag>*_
┃➺ _${usedPrefix}love *<nombre / @tag>*_
┃➺ _${usedPrefix}doxear *<nombre / @tag>*_
┃➺ _${usedPrefix}pregunta *<txt>*_
┃➺ _${usedPrefix}suitpvp *<@tag>*_
┃➺ _${usedPrefix}slot *<apuesta>*_
┃➺ _${usedPrefix}ttt ${tradutor.texto1[32]}
┃➺ _${usedPrefix}delttt_
┃➺ _${usedPrefix}acertijo_
┃➺ _${usedPrefix}simi *<txt>*_
┃➺ _${usedPrefix}top *<txt>*_
┃➺ _${usedPrefix}topgays_
┃➺ _${usedPrefix}topotakus_
┃➺ _${usedPrefix}formarpareja_
┃➺ _${usedPrefix}verdad_
┃➺ _${usedPrefix}reto_
┃➺ _${usedPrefix}cancion_
┃➺ _${usedPrefix}pista_
┃➺ _${usedPrefix}akinator_
┃➺ _${usedPrefix}wordfind_
┃➺ _${usedPrefix}glx (RPG Mundo)_
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *⚠️ACTIVAR O DESCTIVAR FUNCIONES⚠️* 
 
╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}enable *welcome*_
┃➺ _${usedPrefix}disable *welcome*_
┃➺ _${usedPrefix}enable *modohorny*_
┃➺ _${usedPrefix}disable *modohorny*_
┃➺ _${usedPrefix}enable *antilink*_
┃➺ _${usedPrefix}disable *antilink*_
┃➺ _${usedPrefix}enable *antilink2*_
┃➺ _${usedPrefix}disable *antilink2*_
┃➺ _${usedPrefix}enable *detect*_
┃➺ _${usedPrefix}disable *detect*_
┃➺ _${usedPrefix}enable *audios*_
┃➺ _${usedPrefix}disable *audios*_
┃➺ _${usedPrefix}enable *autosticker*_
┃➺ _${usedPrefix}disable *autosticker*_
┃➺ _${usedPrefix}enable *antiviewonce*_
┃➺ _${usedPrefix}disable *antiviewonce*_
┃➺ _${usedPrefix}enable *antitoxic*_
┃➺ _${usedPrefix}disable *antitoxic*_
┃➺ _${usedPrefix}enable *antitraba*_
┃➺ _${usedPrefix}disable *antitraba*_
┃➺ _${usedPrefix}enable *antiarabes*_
┃➺ _${usedPrefix}disable *antiarabes*_
┃➺ _${usedPrefix}enable *modoadmin*_
┃➺ _${usedPrefix}disable *modoadmin*_
┃➺ _${usedPrefix}enable *antidelete*_
┃➺ _${usedPrefix}disable *antidelete*_
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *📥DESCARGAS📥* 

╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}play *<txt>*_
┃➺ _${usedPrefix}play2 *<txt>*_
┃➺ _${usedPrefix}play.1 *<txt>*_
┃➺ _${usedPrefix}play.2 *<txt>*_
┃➺ _${usedPrefix}playdoc *<txt>*_
┃➺ _${usedPrefix}playdoc2 *<txt>*_
┃➺ _${usedPrefix}playlist *<txt>*_
┃➺ _${usedPrefix}ytshort *<url>*_
┃➺ _${usedPrefix}ytmp3 *<url>*_
┃➺ _${usedPrefix}ytmp3doc *<url>*_
┃➺ _${usedPrefix}ytmp4 *<url>*_
┃➺ _${usedPrefix}ytmp4doc *<url>*_
┃➺ _${usedPrefix}videodoc *<url>*_
┃➺ _${usedPrefix}spotify *<txt>*_
┃➺ _${usedPrefix}facebook *<url>*_
┃➺ _${usedPrefix}instagram *<url>*_
┃➺ _${usedPrefix}igstory *<usr>*_
┃➺ _${usedPrefix}tiktok *<url>*_
┃➺ _${usedPrefix}tiktokimg *<url>*_
┃➺ _${usedPrefix}pptiktok *<usr>*_
┃➺ _${usedPrefix}mediafire *<url>*_ 
┃➺ _${usedPrefix}pinterest *<txt>*_
┃➺ _${usedPrefix}gitclone *<url>*_
┃➺ _${usedPrefix}gdrive *<url>*_
┃➺ _${usedPrefix}twitter *<url>*_
┃➺ _${usedPrefix}ringtone *<txt>*_
┃➺ _${usedPrefix}soundcloud *<txt>*_
┃➺ _${usedPrefix}stickerpack *<url>*_
┃➺ _${usedPrefix}wallpaper *<txt>*_ 
┃➺ _${usedPrefix}dapk2 *<url>*_
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *🔎BUSCADORES🔍* 
  
╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}pelisplus *<txt>*_
┃➺ _${usedPrefix}modapk *<txt>*_
┃➺ _${usedPrefix}stickersearch *<txt>*_
┃➺ _${usedPrefix}stickersearch2 *<txt>*_
┃➺ _${usedPrefix}xnxxsearch *<txt>*_
┃➺ _${usedPrefix}animeinfo *<txt>*_
┃➺ _${usedPrefix}google *<txt>*_
┃➺ _${usedPrefix}letra *<txt>*_
┃➺ _${usedPrefix}wikipedia *<txt>*_
┃➺ _${usedPrefix}ytsearch *<txt>*_
┃➺ _${usedPrefix}playstore *<txt>*_
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *🤖FUNCIONES EN GRUPOS🤖* 
 
╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}add *num>*_
┃➺ _${usedPrefix}kick *<@tag>*_
┃➺ _${usedPrefix}kick2 *<@tag>*_
┃➺ _${usedPrefix}listanum *<txt>*_
┃➺ _${usedPrefix}kicknum *<txt>*_
┃➺ _${usedPrefix}grupo *<abrir/cerrar>*_
┃➺ _${usedPrefix}grouptime  ${tradutor.texto1[30]}
┃➺ _${usedPrefix}promote *<@tag>*_
┃➺ _${usedPrefix}demote *<@tag>*_
┃➺ _${usedPrefix}infogroup_
┃➺ _${usedPrefix}resetlink_
┃➺ _${usedPrefix}link_
┃➺ _${usedPrefix}setname *<txt>*_
┃➺ _${usedPrefix}setdesc *<txt>*_
┃➺ _${usedPrefix}invocar *<txt>*_
┃➺ _${usedPrefix}setwelcome *<txt>*_
┃➺ _${usedPrefix}setbye *<txt>*_
┃➺ _${usedPrefix}hidetag *<txt>*_
┃➺ _${usedPrefix}hidetag *<audio>*_
┃➺ _${usedPrefix}hidetag *<video>*_
┃➺ _${usedPrefix}hidetag *<img>*_
┃➺ _${usedPrefix}warn *<@tag>*_
┃➺ _${usedPrefix}unwarn *<@tag>*_
┃➺ _${usedPrefix}listwarn_
┃➺ _${usedPrefix}fantasmas_
┃➺ _${usedPrefix}destraba_
┃➺ _${usedPrefix}setpp *<img>*_
┃➺ _admins *<txt>*_ ${tradutor.texto1[31]}
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *💱CONVERTIDORES💱* 
 
╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}toanime *<img>*_
┃➺ _${usedPrefix}togifaud *<video>*_
┃➺ _${usedPrefix}toimg *<sticker>*_
┃➺ _${usedPrefix}tomp3 *<video>*_
┃➺ _${usedPrefix}tomp3 *<nota de voz>*_
┃➺ _${usedPrefix}toptt *<video / audio>*_
┃➺ _${usedPrefix}tovideo *<sticker>*_
┃➺ _${usedPrefix}tourl *<video / img / audio>*_
┃➺ _${usedPrefix}tts *<idioma> <txt>*_
┃➺ _${usedPrefix}tts *<efecto> <txt>*_
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *🎨EFECTOS Y LOGOS🎨* 
 
╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}logos *<efecto> <txt>*_
┃➺ _${usedPrefix}logochristmas *<txt>*_
┃➺ _${usedPrefix}logocorazon *<txt>*_
┃➺ _${usedPrefix}ytcomment *<txt>*_
┃➺ _${usedPrefix}hornycard *<@tag>*_
┃➺ _${usedPrefix}simpcard *<@tag>*_
┃➺ _${usedPrefix}lolice *<@tag>*_
┃➺ _${usedPrefix}itssostupid_
┃➺ _${usedPrefix}pixelar_
┃➺ _${usedPrefix}blur_
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *✍️FRASES Y TEXTOS✍️* 
 
╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}piropo_
┃➺ _${usedPrefix}consejo_
┃➺ _${usedPrefix}fraseromantica_
┃➺ _${usedPrefix}historiaromantica_
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *👀ALEATORIO👀* 
 
╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}kpop *<blackpink/exo/bts>*_
┃➺ _${usedPrefix}cristianoronaldo_
┃➺ _${usedPrefix}messi_
┃➺ _${usedPrefix}cat_
┃➺ _${usedPrefix}dog_
┃➺ _${usedPrefix}meme_
┃➺ _${usedPrefix}itzy_
┃➺ _${usedPrefix}blackpink_
┃➺ _${usedPrefix}navidad_
┃➺ _${usedPrefix}wpmontaña_
┃➺ _${usedPrefix}pubg_
┃➺ _${usedPrefix}wpgaming_
┃➺ _${usedPrefix}wpaesthetic_
┃➺ _${usedPrefix}wpaesthetic2_
┃➺ _${usedPrefix}wprandom_
┃➺ _${usedPrefix}wallhp_
┃➺ _${usedPrefix}wpvehiculo_
┃➺ _${usedPrefix}wpmoto_
┃➺ _${usedPrefix}coffee_
┃➺ _${usedPrefix}pentol_
┃➺ _${usedPrefix}caricatura_
┃➺ _${usedPrefix}ciberespacio_
┃➺ _${usedPrefix}technology_
┃➺ _${usedPrefix}doraemon_
┃➺ _${usedPrefix}hacker_
┃➺ _${usedPrefix}planeta_
┃➺ _${usedPrefix}randomprofile_
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *🎧EFECTOS PARA AUDIOS🎧* 
> *Responde a un audio o nota de voz.*  

╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}bass_
┃➺ _${usedPrefix}blown_
┃➺ _${usedPrefix}deep_
┃➺ _${usedPrefix}earrape_
┃➺ _${usedPrefix}fast_
┃➺ _${usedPrefix}fat_
┃➺ _${usedPrefix}nightcore_
┃➺ _${usedPrefix}reverse_
┃➺ _${usedPrefix}robot_
┃➺ _${usedPrefix}slow_
┃➺ _${usedPrefix}smooth_
┃➺ _${usedPrefix}tupai_
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *🤔CHAT ANONIMO🤔* 
  
╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}start_
┃➺ _${usedPrefix}next_
┃➺ _${usedPrefix}leave_
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *🛠️HERRAMIENTAS🛠️* 
  
╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}inspect *<wagc_url>*_
┃➺ _${usedPrefix}chatgpt *<txt>*_
┃➺ _${usedPrefix}delchatgpt_
┃➺ _${usedPrefix}gptvoz *<txt>*_
┃➺ _${usedPrefix}dall-e *<txt>*_
┃➺ _${usedPrefix}spamwa *num|txt|cant>*_
┃➺ _${usedPrefix}tamaño *<cant> <img / video>*_
┃➺ _${usedPrefix}readviewonce *<img / video>*_
┃➺ _${usedPrefix}clima *<país> <ciudad>*_
┃➺ _${usedPrefix}encuesta *<txt1|txt2>*_
┃➺ _${usedPrefix}afk *<motivo>*_
┃➺ _${usedPrefix}ocr *<responde a img>*_
┃➺ _${usedPrefix}hd *<responde a img>*_
┃➺ _${usedPrefix}acortar *<url>*_
┃➺ _${usedPrefix}calc *<operacion>*_
┃➺ _${usedPrefix}del *<msj>*_
┃➺ _${usedPrefix}whatmusic *<audio>*_
┃➺ _${usedPrefix}readqr *<img>*_
┃➺ _${usedPrefix}qrcode *<txt>*_
┃➺ _${usedPrefix}readmore *<txt1|txt2>*_
┃➺ _${usedPrefix}styletext *<txt>*_
┃➺ _${usedPrefix}traducir *<txt>*_
┃➺ _${usedPrefix}nowa *num>*_
┃➺ _${usedPrefix}covid *<pais>*_
┃➺ _${usedPrefix}horario_
┃➺ _${usedPrefix}dropmail_
┃➺ _${usedPrefix}igstalk *<usr>*_
┃➺ _${usedPrefix}tiktokstalk *<usr>*_
┃➺ _${usedPrefix}img *<txt>*_
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *💸ECONOMIA💸* 

╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}adventure_
┃➺ _${usedPrefix}cazar_
┃➺ _${usedPrefix}cofre_
┃➺ _${usedPrefix}balance_
┃➺ _${usedPrefix}claim_
┃➺ _${usedPrefix}heal_
┃➺ _${usedPrefix}lb_
┃➺ _${usedPrefix}levelup_
┃➺ _${usedPrefix}myns_
┃➺ _${usedPrefix}perfil_
┃➺ _${usedPrefix}work_
┃➺ _${usedPrefix}minar_
┃➺ _${usedPrefix}minar2_
┃➺ _${usedPrefix}buy_
┃➺ _${usedPrefix}buyall_
┃➺ _${usedPrefix}verificar_
┃➺ _${usedPrefix}robar *<cant> <@tag>*_
┃➺ _${usedPrefix}crime
┃➺ _${usedPrefix}transfer *<tipo> <cant> <@tag>*_
┃➺ _${usedPrefix}unreg *<sn>*_
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *👹STICKERS👹* 
  
╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}sticker *<responder a img o video>*_
┃➺ _${usedPrefix}sticker *<url>*_
┃➺ _${usedPrefix}sticker2 *<responder a img o video>*_
┃➺ _${usedPrefix}sticker2 *<url>*_
┃➺ _${usedPrefix}s *<responder a img o video>*_
┃➺ _${usedPrefix}s *<url>*_
┃➺ _${usedPrefix}emojimix *<emoji 1>&<emoji 2>*_
┃➺ _${usedPrefix}scircle *<img>*_
┃➺ _${usedPrefix}sremovebg *<img>*_
┃➺ _${usedPrefix}semoji *<tipo> <emoji>*_
┃➺ _${usedPrefix}qc *<txt>*_
┃➺ _${usedPrefix}attp *<txt>*_
┃➺ _${usedPrefix}attp2 *<txt>*_
┃➺ _${usedPrefix}attp3 *<txt>*_
┃➺ _${usedPrefix}ttp *<txt>*_
┃➺ _${usedPrefix}ttp2 *<txt>*_
┃➺ _${usedPrefix}ttp3 *<txt>*_
┃➺ _${usedPrefix}ttp4 *<txt>*_
┃➺ _${usedPrefix}ttp5 *<txt>*_
┃➺ _${usedPrefix}pat *<@tag>*_
┃➺ _${usedPrefix}slap *<@tag>*_
┃➺ _${usedPrefix}kiss *<@tag>*_
┃➺ _${usedPrefix}dado_
┃➺ _${usedPrefix}wm *<packname> <autor>*_
┃➺ _${usedPrefix}stickermarker *<efecto> <img>*_
┃➺ _${usedPrefix}stickerfilter *<efecto> <img>*_
╰━━━━━ • ◆ • ━━━━━╯

*··················································*

> *🚫SOLO PARA EL CREADOR🚫* 
  
╭━━━━━ • ◆ • ━━━━━╮
┃➺ _${usedPrefix}dsowner_
┃➺ _${usedPrefix}setprefix *<prefijo>*_
┃➺ _${usedPrefix}resetprefix_
┃➺ _${usedPrefix}autoadmin_
┃➺ _${usedPrefix}grouplist_
┃➺ _${usedPrefix}chetar_
┃➺ _${usedPrefix}leavegc_
┃➺ _${usedPrefix}cajafuerte_
┃➺ _${usedPrefix}blocklist_
┃➺ _${usedPrefix}addowner *<@tag / num>*_
┃➺ _${usedPrefix}delowner *<@tag / num>*_
┃➺ _${usedPrefix}block *<@tag / num>*_
┃➺ _${usedPrefix}unblock *<@tag / num>*_
┃➺ _${usedPrefix}enable *restrict*_
┃➺ _${usedPrefix}disable *restrict*_
┃➺ _${usedPrefix}enable *autoread*_
┃➺ _${usedPrefix}disable *autoread*_
┃➺ _${usedPrefix}enable *public*_
┃➺ _${usedPrefix}disable *public*_
┃➺ _${usedPrefix}enable *pconly*_
┃➺ _${usedPrefix}disable *pconly*_
┃➺ _${usedPrefix}enable *gconly*_
┃➺ _${usedPrefix}disable *gconly*_
┃➺ _${usedPrefix}enable *anticall*_
┃➺ _${usedPrefix}disable *anticall*_
┃➺ _${usedPrefix}enable *antiprivado*_
┃➺ _${usedPrefix}disable *antiprivado*_
┃➺ _${usedPrefix}enable *modejadibot*_
┃➺ _${usedPrefix}disable *modejadibot*_
┃➺ _${usedPrefix}enable *audios_bot*_
┃➺ _${usedPrefix}disable *audios_bot*_
┃➺ _${usedPrefix}enable *antispam*_
┃➺ _${usedPrefix}disable *antispam*_
┃➺ _${usedPrefix}msg *<txt>*_
┃➺ _${usedPrefix}banchat_
┃➺ _${usedPrefix}unbanchat_
┃➺ _${usedPrefix}resetuser *<@tag>*_
┃➺ _${usedPrefix}banuser *<@tag>*_
┃➺ _${usedPrefix}unbanuser *<@tag>*_
┃➺ _${usedPrefix}dardiamantes *<@tag> <cant>*_
┃➺ _${usedPrefix}añadirxp *<@tag> <cant>*_
┃➺ _${usedPrefix}banuser *<@tag>*_
┃➺ _${usedPrefix}bc *<txt>*_
┃➺ _${usedPrefix}bcchats *<txt>*_
┃➺ _${usedPrefix}bcgc *<txt>*_
┃➺ _${usedPrefix}bcgc2 *<aud>*_
┃➺ _${usedPrefix}bcgc2 *<vid>*_
┃➺ _${usedPrefix}bcgc2 *<img>*_
┃➺ _${usedPrefix}bcbot *<txt>*_
┃➺ _${usedPrefix}cleartpm_
┃➺ _${usedPrefix}restart_
┃➺ _${usedPrefix}update_
┃➺ _${usedPrefix}banlist_
┃➺ _${usedPrefix}addprem *<@tag> <tiempo>*_
┃➺ _${usedPrefix}addprem2 *<@tag> <tiempo>*_
┃➺ _${usedPrefix}addprem3 *<@tag> <tiempo>*_
┃➺ _${usedPrefix}addprem4 *<@tag> <tiempo>*_
┃➺ _${usedPrefix}delprem *<@tag>*_
┃➺ _${usedPrefix}listcmd_
┃➺ _${usedPrefix}setppbot *<responder a img>*_
┃➺ _${usedPrefix}addcmd *<txt>*_
┃➺ _${usedPrefix}delcmd_
┃➺ _${usedPrefix}saveimage_
┃➺ _${usedPrefix}viewimage_
╰━━━━━ • ◆ • ━━━━━╯`.trim()
await conn.sendFile(m.chat, gataImg, 'lp.jpg', menu, m, fakeChannel, false, { contextInfo: {mentionedJid, externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: gt, body: wm, previewType: 0, thumbnail: imagen4, sourceUrl: redesMenu }}})
//conn.sendFile(m.chat, gataVidMenu.getRandom(), 'gata.mp4', menu, fkontak)
} catch (e) {
await m.reply(lenguajeGB['smsMalError3']() + '\n*' + lenguajeGB.smsMensError1() + '*\n*' + usedPrefix + `${lenguajeGB.lenguaje() == 'es' ? 'reporte' : 'report'}` + '* ' + `${lenguajeGB.smsMensError2()} ` + usedPrefix + command)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}


}

//handler.command = /^(menu|menú|memu|memú|help|info|comandos|2help|menu1.2|ayuda|commands|commandos|menucompleto|allmenu|allm|m|\?)$/i
handler.command = /^(menucompleto|allmenu|\?)$/i
handler.register = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}  

// Función para formatear arrays de comandos
function generateCommand(commandsArray, usedPrefix) {
const formattedCommands = commandsArray
.filter(command => {
const comandoValido = command.comando && typeof command.comando === 'function' && command.comando()
const descripcionValida = command.descripcion && typeof command.descripcion === 'function'
const contextoValido = typeof command.contexto === 'string' && command.contexto.trim() !== ''
return comandoValido || descripcionValida || contextoValido
})
.map((command, index, array) => {
const prefix = (command.showPrefix === true && ((typeof command.comando === 'function' && typeof command.comando() === 'string' && command.comando().trim() !== '') ||
(typeof command.comando === 'string' && command.comando.trim() !== ''))) ? usedPrefix : ''
let formattedCommand = ''
if (command.comando) {
if (typeof command.comando === 'function') {
const commandResult = command.comando()
if (typeof commandResult === 'string') {
formattedCommand = commandResult.trim()
}} else if (typeof command.comando === 'string') {
formattedCommand = command.comando.trim()
}}
if (formattedCommand.includes(',')) {
formattedCommand = mid.idioma_code === 'es' ? formattedCommand.split(',')[0].trim() : formattedCommand.split(',')[1].trim()
}
let formattedDescription = ''
if (command.descripcion) {
if (typeof command.descripcion === 'function') {
const descriptionResult = command.descripcion()
if (typeof descriptionResult === 'string') {
formattedDescription = descriptionResult.trim()
}} else if (typeof command.descripcion === 'string') {
formattedDescription = command.descripcion.trim()
}}
if (formattedDescription.includes('||')) {
formattedDescription = mid.idioma_code === 'es' ? formattedDescription.split('||')[0].trim() : formattedDescription.split('||')[1].trim()
}
let formattedContext = ''
if (command.contexto) {
if (typeof command.contexto === 'function') {
const contextResult = command.contexto()
if (typeof contextResult === 'string') {
formattedContext = contextResult.trim()
}} else if (typeof command.contexto === 'string' && command.contexto.trim() !== '') {
formattedContext = command.contexto.trim()
}}
let message = ''
if (formattedCommand) {
message += `✓ \`${prefix}${formattedCommand}\``
if (formattedDescription) {
message += `\n${(command.descripcion && typeof command.descripcion === 'function') ? '𖡡' : '≡'} \`\`\`${formattedDescription}\`\`\``
}
if (formattedContext) {
message += '\nⓘ _' + formattedContext + '_' + (index !== array.length - 1 ? '\n' : '')
}}
return message
})
.filter(message => message !== '')
return formattedCommands.join('\n')
}

// comando: Si hay comando en español y inglés separar por (,) máximo 2 comandos 
// descripcion: Parámetros para usar el comando. Separar por (||) máximo 2 descripciones 
// contexto: Explicación de que trata el comando
// showPrefix: Usar true para que muestre el prefijo, de lo contrario usar false
// Si algún objeto no se va usar dejar en false, menos el objeto "comando" ya que si es false no mostrará nada
const commandsInfo = [
{ comando: 'cuentasgatabot , accounts', descripcion: false, contexto: 'Cuentas oficiales', showPrefix: true },
{ comando: 'grupos , linkgc', descripcion: false, contexto: 'Grupos oficiales', showPrefix: true },
{ comando: 'donar , donate', descripcion: false, contexto: 'Apoya al proyecto donando', showPrefix: true },
{ comando: 'listagrupos , grouplist', descripcion: false, contexto: 'Grupos en donde estoy', showPrefix: true },
{ comando: 'estado , status', descripcion: false, contexto: 'Información de mí estado', showPrefix: true },
{ comando: 'infogata , infobot', descripcion: false, contexto: 'Información sobre el Bot', showPrefix: true },
{ comando: 'instalarbot , installbot', descripcion: false, contexto: 'Información y métodos de instalación', showPrefix: true },
{ comando: 'creadora , owner', descripcion: false, contexto: 'Información sobre mí Creadora', showPrefix: true },
{ comando: 'velocidad , ping', descripcion: false, contexto: 'Verifica la velocidad de este Bot', showPrefix: true },
{ comando: 'Bot', descripcion: false, contexto: 'Mensaje predeterminado del Bot', showPrefix: false },
{ comando: 'términos y condiciones , terms and conditions', descripcion: false, contexto: 'Revisa detalles al usar este Bot', showPrefix: false },
]
const commandsJadiBot = [
{ comando: 'serbot , jadibot', descripcion: false, contexto: 'Reactiva o Conviértete en Bot secundario', showPrefix: true },
{ comando: 'serbot --code , jadibot --code', descripcion: false, contexto: 'Solicita código de 8 dígitos', showPrefix: true },
{ comando: 'detener , stop', descripcion: false, contexto: 'Dejar de ser temporalmente Sub Bot', showPrefix: true },
{ comando: 'bots , listjadibots', descripcion: false, contexto: 'Lista de Bots secundarios', showPrefix: true },
{ comando: 'borrarsesion , delsession', descripcion: false, contexto: 'Borrar datos de Bot secuandario', showPrefix: true },
{ comando: 'bcbot', descripcion: false, contexto: 'Notificar a usuarios Sub Bots', showPrefix: true },
]
const commandsReport = [
{ comando: 'reporte , report', descripcion: '[texto] || [text]', contexto: 'Reportar comandos con errores', showPrefix: true },
]
const commandsLink = [
{ comando: 'botemporal , addbot', descripcion: '[enlace] [cantidad] || [link] [amount]', contexto: 'Agregar Bot temporalmente a un grupo', showPrefix: true },
]
const commandsPrem = [
{ comando: 'pase premium , pass premium', descripcion: false, contexto: 'Planes para adquirir premium', showPrefix: true },
{ comando: 'listavip , listprem', descripcion: false, contexto: 'Usuarios con tiempo premium', showPrefix: true },
{ comando: 'listapremium , listpremium', descripcion: false, contexto: 'Lista de usuarios premium', showPrefix: true },
]
const commandsGames = [
{ comando: 'matematicas , math', descripcion: '"noob, medium, hard"', contexto: 'Operaciones matemáticas 🧮', showPrefix: true },
{ comando: 'lanzar , launch', descripcion: '"cara" o "cruz"', contexto: 'Moneda de la suerte 🪙', showPrefix: true },
{ comando: 'ppt', descripcion: '"piedra", "papel" o "tijera"', contexto: 'Un clásico 🪨📄✂️', showPrefix: true },
{ comando: 'ttt', descripcion: '[Nombre de la sala] || [Room name]', contexto: 'Tres en línea/rayas ❌⭕', showPrefix: true },
{ comando: 'delttt', descripcion: false, contexto: 'Cerrar/abandonar la partida 🚪', showPrefix: true },
{ comando: 'topgays', descripcion: false, contexto: 'Clasificación de usuarios Gays 🏳️‍🌈', showPrefix: true },
{ comando: 'topotakus', descripcion: false, contexto: 'Clasificación de usuarios Otakus 🎌', showPrefix: true },
{ comando: 'toppajer@s', descripcion: false, contexto: 'Clasificación de usuarios pajeros 🥵', showPrefix: true },
{ comando: 'topintegrantes', descripcion: false, contexto: 'Mejores usuarios 👑', showPrefix: true },
{ comando: 'toplagrasa', descripcion: false, contexto: 'Usuarios más grasosos XD', showPrefix: true },
{ comando: 'toplind@s', descripcion: false, contexto: 'Los más lindos 😻', showPrefix: true },
{ comando: 'topput@s', descripcion: false, contexto: 'Los más p**** 🫣', showPrefix: true },
{ comando: 'toppanafrescos', descripcion: false, contexto: 'Los que más critican 🗿', showPrefix: true },
{ comando: 'topshiposters', descripcion: false, contexto: 'Los que se creen graciosos 🤑', showPrefix: true },
{ comando: 'topfamosos', descripcion: false, contexto: 'Los más conocidos ☝️', showPrefix: true },
{ comando: 'topparejas', descripcion: false, contexto: 'Las 5 mejores 💕', showPrefix: true },
{ comando: 'gay', descripcion: '[@tag]', contexto: 'Perfil Gay 😲', showPrefix: true },
{ comando: 'gay2', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Gay', showPrefix: true },
{ comando: 'lesbiana', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Lesbiana', showPrefix: true },
{ comando: 'manca', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Manca', showPrefix: true },
{ comando: 'manco', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Manco', showPrefix: true },
{ comando: 'pajero', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Pajero', showPrefix: true },
{ comando: 'pajera', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Pajera', showPrefix: true },
{ comando: 'puto', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Puto', showPrefix: true },
{ comando: 'puta', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Puta', showPrefix: true },
{ comando: 'rata', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Rata', showPrefix: true },
{ comando: 'love', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Love', showPrefix: true },
{ comando: 'doxxear', descripcion: '[@tag]', contexto: 'Simular Doxxeo falso 🕵️‍♀️', showPrefix: true },
{ comando: 'pregunta', descripcion: '[texto] || [text]', contexto: 'Pregunta ❔ y responderá', showPrefix: true },
{ comando: 'apostar , slot', descripcion: '[cantidad] || [amount]', contexto: 'Apuesta a la suerte 🎰', showPrefix: true },
{ comando: 'formarpareja', descripcion: false, contexto: 'Une a dos personas 💞', showPrefix: true },
{ comando: 'dado', descripcion: false, contexto: 'Envía un dado aleatorio 🎲', showPrefix: true },
{ comando: 'piropo', descripcion: false, contexto: 'Enviar un piropo 🫢', showPrefix: true },
{ comando: 'chiste', descripcion: false, contexto: 'Envía chistes 🤡', showPrefix: true },
{ comando: 'reto', descripcion: false, contexto: 'Pondrá un reto 😏', showPrefix: true },
{ comando: 'frases', descripcion: '[cantidad 1 al 99] || [amount 1-99]', contexto: 'Envía frases aleatorias 💐', showPrefix: true },
{ comando: 'acertijo', descripcion: false, contexto: 'Responde al mensaje del acertijo 👻', showPrefix: true },
{ comando: 'cancion', descripcion: false, contexto: 'Adivina la canción 🎼', showPrefix: true },
{ comando: 'trivia', descripcion: false, contexto: 'Preguntas con opciones 💭', showPrefix: true },
{ comando: 'pelicula', descripcion: false, contexto: 'Descubre la película con emojis 🎬', showPrefix: true },
{ comando: 'adivinanza', descripcion: false, contexto: 'Adivina adivinador 🧞‍♀️', showPrefix: true },
{ comando: 'ruleta', descripcion: false, contexto: 'Suerte inesperada 💫', showPrefix: true },
{ comando: 'ahorcado', descripcion: false, contexto: 'Adivina la palabras antes de que el ahorcado te atrape 😱', showPrefix: true },
{ comando: 'ruletadelban', descripcion:false, contexto: 'Elimina un usuario al azar, solo para admins ☠️', showPrefix: true }
]
const commandsAI = [
{ comando: 'simi', descripcion: '[texto] || [text]', contexto: 'Conversa con SimSimi', showPrefix: true },
{ comando: 'ia , ai', descripcion: '[texto] || [text]', contexto: 'Tecnología de ChatGPT', showPrefix: true },
{ comando: 'delchatgpt', descripcion: false, contexto: 'Eliminar historial de la IA', showPrefix: true },  
{ comando: 'iavoz , aivoice', descripcion: '[texto] || [text]', contexto: 'Respuestas en audios', showPrefix: true },
{ comando: 'calidadimg , qualityimg', descripcion: '(responde con una imagen) || (responds with an image)', contexto: 'Detalles de resolución de imagen', showPrefix: true },
{ comando: 'dalle', descripcion: '[texto] || [text]', contexto: 'Genera imagen a partir de texto', showPrefix: true },
{ comando: 'gemini', descripcion: '[texto] || [text]', contexto: 'IA, Tecnología de Google', showPrefix: true },
{ comando: 'geminimg', descripcion: '(imagen) + [texto] || (image) + [text]', contexto: 'Busca información de una imagen', showPrefix: true },
{ comando: 'hd', descripcion: '(responde con una imagen) || (responds with an image)', contexto: 'Mejorar calidad de imagen', showPrefix: true },
]
