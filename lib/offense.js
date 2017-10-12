const util = require('util')

const request = require('request')
const cheerio = require('cheerio')


const get = function(cb) {
  request({
    url: 'http://www.footballoutsiders.com/stats/teamoff'
  }, function(err, res, html) {
    if (err)
      return cb(err)

    const $ = cheerio.load(html)
    const result = {}

    $('table tr').each(function(index, element) {
      const tds = $(this).children()      

      if (!tds.eq(0).text())
	return

      result[tds.eq(1).text()] = {
	rank: parseInt(tds.eq(0).text(), 10),
	dvoa: tds.eq(2).text(),
	last_week: parseInt(tds.eq(3).text(), 10),
	offense_dave: tds.eq(4).text(),
	dave_rank: parseInt(tds.eq(5).text(), 10),
	pass_off: tds.eq(6).text(),
	pass_rank: parseInt(tds.eq(7).text(), 10),
	rush_off: tds.eq(8).text(),
	rush_rank: parseInt(tds.eq(9).text(), 10)
      }
    })

    cb(null, result)
  })
}

module.exports = {
  get: get
}

if (!module.parent) {
  get((err, result) => {
    if (err)
      console.log(err)

    console.log(util.inspect(result, false, null))    
  })
}
