const util = require('util')

const request = require('request')
const cheerio = require('cheerio')


const get = function(cb) {
  request({
    url: 'http://www.footballoutsiders.com/stats/teamdef'
  }, function(err, res, html) {
    if (err)
      return cb(err)

    const $ = cheerio.load(html)
    const result = {
      team: {},
      position: {},
      pass_direction: {}
    }

    const tables = $('table')

    const team = tables.eq(0)
    const position = tables.eq(1)
    const pass_direction = tables.eq(2)

    $('tr', team).each(function(index, element) {
      const tds = $(this).children()
      if (!tds.eq(0).text())
	return

      result.team[tds.eq(1).text()] = {
	rank: parseInt(tds.eq(0).text(), 10),
	def_dvoa: tds.eq(2).text(),
	last_week: parseInt(tds.eq(3).text(), 10),
	def_dave: tds.eq(4).text(),
	def_dave_rank: tds.eq(5).text(),
	pass_def: tds.eq(6).text(),
	pass_rank: parseInt(tds.eq(7).text(), 10),
	rush_def: tds.eq(8).text(),
	rush_rank: parseInt(tds.eq(9).text(), 10)
      }
    })

    $('tr', position).each(function(index, element) {
      const tds = $(this).children()
      if (index < 2)
	return

      if (!tds.eq(0).text())
	return

      if (tds.eq(1).text() === 'Team')
	return

      result.position[tds.eq(1).text()] = {
	rank: parseInt(tds.eq(0).text(), 10),
	wr_1: {
	  dvoa: tds.eq(2).text(),
	  rank: parseInt(tds.eq(3).text(), 10),
	  pa_g: parseFloat(tds.eq(4).text()),
	  yd_g: parseFloat(tds.eq(5).text())
	},
	wr_2: {
	  dvoa: tds.eq(6).text(),
	  rank: parseInt(tds.eq(7).text(), 10),
	  pa_g: parseFloat(tds.eq(8).text()),
	  yd_g: parseFloat(tds.eq(9).text())
	},
	wr_other: {
	  dvoa: tds.eq(10).text(),
	  rank: parseInt(tds.eq(11).text(), 10),
	  pa_g: parseFloat(tds.eq(12).text()),
	  yd_g: parseFloat(tds.eq(13).text())
	},
	te: {
	  dvoa: tds.eq(14).text(),
	  rank: parseInt(tds.eq(15).text(), 10),
	  pa_g: parseFloat(tds.eq(16).text()),
	  yd_g: parseFloat(tds.eq(17).text())
	},
	rb: {
	  dvoa: tds.eq(18).text(),
	  rank: parseInt(tds.eq(19).text(), 10),
	  pa_g: parseFloat(tds.eq(20).text()),
	  yd_g: parseFloat(tds.eq(21).text())
	}
      }
    })

    $('tr', pass_direction).each(function(index, element) {
      const tds = $(this).children()

      if (index < 1)
	return

      if (tds.eq(1).text() === 'Team')
	return      

      result.pass_direction[tds.eq(1).text()] = {
	rank: parseInt(tds.eq(0).text(), 10),
	left: tds.eq(2).text(),
	left_rank: parseInt(tds.eq(3).text(), 10),
	middle: tds.eq(3).text(),
	middle_rank: parseInt(tds.eq(4).text(), 10),
	right: tds.eq(5).text(),
	right_rank: parseInt(tds.eq(6).text(), 10),
	deep: tds.eq(7).text(),
	deep_rank: parseInt(tds.eq(8).text(), 10),
	short: tds.eq(9).text(),
	short_rank: parseInt(tds.eq(10).text(), 10),
	deep_left: tds.eq(11).text(),
	deep_middle: tds.eq(12).text(),
	deep_right: tds.eq(13).text(),
	short_left: tds.eq(14).text(),
	short_middle: tds.eq(15).text(),
	short_right: tds.eq(16).text()
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
