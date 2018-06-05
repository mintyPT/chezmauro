const rp = require('request-promise')
const confession = require('confession')
const cheerio = require("cheerio");
const moment = require("moment");

const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

const fetchWeekMenu = async () =>{   
    const content = await rp('http://www.maurotraiteur.com/menus-du-jour-service-traiteur-specialite-italienne-lausanne/')

    const res = confession.confess(content, {
        title: ['selector:h3', 'text'],
        menu: [(html)=>{
            const $ = cheerio.load(html);
            return $('p').contents().map((i, el) => $(el).text()).get()
        }]
    }, '#main-content .entry-content .et_pb_section_1 .et_pb_module, #main-content .entry-content .et_pb_section_2 .et_pb_module')

    const menu = {}
    res
        .filter(r => {
            return days.indexOf(r.title.toLowerCase()) != -1
        })
        .forEach(r => {
            r.title = r.title.toLowerCase()
            menu[r.title] = r.menu
        })
    return menu
}

const fetchTodaysMenu = async ()=>{
    const menu = await fetchWeekMenu()
    var date = moment();
    var dow = date.day();
    const strDow = days[dow]
    const todaysMenu = menu[strDow]
    return todaysMenu
}

// fetchWeekMenu()
// fetchTodaysMenu()

module.exports = {
    fetchWeekMenu,
    fetchTodaysMenu
}