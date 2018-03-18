var immutable = require('immutable')
const cheerio = require('cheerio')
var preRules = {
  img: {
    attr:{alt:1}
  },
  a: {
    attr:{ref:1}
  },
  head:{children:{
    meta:{attr: {name:["descriptions","keywords"]}},
    title:1
  }},
  strong:{lte:15},
  H1:1
}

function mergeRules(userRules) {
  return new Promise((resolve,reject) => {
    Object.keys(userRules).forEach((k) => {
      if (preRules[k]) {
        preRules[k] = Object.assign(preRules[k],userRules[k])
      } else {
        preRules[k] = userRules[k]
      }
    })
    resolve(preRules)
  })
}

function validateAttr($,payload) {
  var attrs = immutable.Map(payload.get("rule").get("attr"))
  var elems = payload.get("e")
  attrs.forEach((a,k) => {
    if (typeof(a) === 'number') {
      if (Object.keys(elems.attribs).indexOf(k) < 0) {
        console.log(`no attribute ${k} in <${elems.name}>`)
      }
    } else if (Array.isArray(a)) {
      var iA = [...a]
      elems.forEach((elem) => {
        if (Object.keys(elem.attribs).indexOf(k) >= 0) {
          var i = iA.indexOf(elem.attribs[k])
          if (i >= 0) {
            iA.splice(i,1)
          }
        }
      })
      if (iA.length > 0) {
        console.log(`attribute ${k} in <${elems[0].name}> doesnt contain one of names "${a}"`)
      }
    }
  })
}

function validateChildren($,payload) {
  var children = payload.get("rule")[1].children
  var elem = payload.get("e")
  Object.keys(children).forEach((a) => {
    if (typeof(children[a]) === "number") {
      validateOps({name:a,e:$(a),cond:children[a]})
    } else {
      eMap = elem.children.filter(child => {
        return child.name == a
      })
      validateAttr($,immutable.Map({rule:immutable.Map(children[a]),e:eMap}))
    }
  })
}

function validateOps(payload) {
  if (typeof(payload.cond) === "number") {
    if (payload.e.length !== payload.cond) {
      console.log(`<${payload.name}> is not equal ${payload.cond}`)
    }
  } else {
    Object.entries(payload.cond).forEach((cond) => {
      if (cond[0] == "gte") {
        if (payload.e.length < cond[1]) {
          console.log(`<${payload.name}> is not greater than ${cond[1]}`)
        }
      } else if (cond[0] == "lte") {
        if (payload.e.length > cond[1]) {
          console.log(`<${payload.name}> is not less than ${cond[1]}`)
        }
      } else if (cond[0] == "eq") {
        if (payload.e.length !== cond[1]) {
          console.log(`<${payload.name}> is not equal ${cond[1]}`)
        }
      }
    })
  }
}

function parseHTML(html) {
  return new Promise((resolve,reject) => {
    var $ = cheerio.load(html)
    resolve($)
  })
}

exports.seoRules = function(html,userRules) {
  parseHTML(html).then(($) => {
    mergeRules(userRules).then((rules) => {
      Object.entries(rules).forEach((rule) => {
        var allMap = $(rule[0]).map((i,e) => {
          return e
        })

        var attrMap = allMap.filter((i,e) => {
          return rule[1].attr != undefined
        }).each((i,e) => {
          validateAttr($,immutable.Map({rule:immutable.Map(rule[1]),e}))
        })

        var childMap = allMap.filter((i,e) => {
          return rule[1].children != undefined
        }).each((i,e) => {
          validateChildren($,immutable.Map({rule,e}))
        })

        if (rule[1].children == undefined && rule[1].attr == undefined) {
          validateOps({name:rule[0],e:$(rule[0]),cond:rule[1]})
        }
      })
    })
  })
}

// seoRules(html,userRules)
