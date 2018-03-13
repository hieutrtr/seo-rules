const cheerio = require('cheerio')
var rules = {
  img: {
    attr:{alt:1}
  },
  a: {
    attr:{ref:1}
  },
  title:1,
  meta:{
    attr: {name:["descriptions","keywords"]}
  },
  strong: {gte:15},
  H1: {gte:1}
}

function mergeRules(html,userRules) {
  return new Promise((resolve,reject) => {
    Object.keys(rules).forEach((k) => {
      if (rules[key]) {
        rules[key] = Object.assign(rules[key],userRules[key])
      } else {
        rules[key] = userRules[key]
      }
    })
    resolve({rules,html})
  })
}

function parseHTML(payload) {
  return new Promise((resolve,reject) => {
    $ = cheerio.load(html)
    resolve({rules:payload.rules,$})
  })
}

function validateTag(payload) {
  return new Promise((resolve,reject) => {
    resolve(payload)
  })
}

function validateAttr(payload) {
  return new Promise((resolve,reject) => {
    resolve(payload.$.html())
  })
}

function errorHandling(err) {
  if (err.type == "validate") {
    return {"message": err.message, type: "invalid validation"}
  } else if (err.type == "parse") {
    return {"message": err.message, type: "invalid parsing"}
  }
}

var seoRules = {}

seoRules.validate = (html,userRules) => {
  return new Promise((resolve,reject) => {
    mergeRules(html,userRules)
    .then(parseHTML)
    .then((payload) => {
      payload.filter((e) => {

      })
    })
    .then(validateAttr)
    .then((res) => {
      resolve(res)
    })
    .catch((err) => {
      reject(errorHandling(err))
    })
  })
}


var html = "<html> \
<head> \
<title>All our wooden furniture is water proof.</title> \
<meta name=\"descriptions\" content=\"This is where you add your meta description. Make it count.\"> \
<meta name=\"descriptions\" content=\"This is where you add your meta description. Make it count.\"> \
<meta name=\"keywords\" content=\"wood, furniture, garden, garden-table, etc.\"> \
</head> \
<H1></H1> \
<body> \
<img> \
<H1> \
<img alt=\"h1 fuck\"> \</H1> \
<img alt=\"Smiley face\"> \
</body> \
</html>"
var userRules = {
  H1:{lte:10},
  H2:1
}

$ = cheerio.load(html)
// console.log($.html())
// console.log($('head').children().length)
// console.log($('body').children().length)
// console.log($('img').length)
// $('img').each((i, elem) => {
//     console.log(i,elem.attribs)
// })
Object.keys(rules).forEach((k) => {
  if (typeof(rules[k]) === 'object') {
    if (rules[k].attr) {
      Object.keys(rules[k].attr).forEach((a) => {
        if (typeof(rules[k].attr[a]) === 'number') {
          $(k).each((i, elem) => {
            if (Object.keys(elem.attribs).indexOf(a) < 0) {
              console.log(`no attribute ${a} in ${elem.name}`)
            }
          })
        } else if (Array.isArray(rules[k].attr[a])) {
          var attrs = rules[k].attr[a]
          $(k).each((i, elem) => {
            if (Object.keys(elem.attribs).indexOf(a) >= 0) {
              var i = rules[k].attr[a].indexOf(elem.attribs[a])
              if (i >= 0) {
                attrs.splice(i,1)
              }
            }
          })
          if (attrs.length > 0) {
            console.log(`attribute ${a} in ${k} doesnt contain any of name ${rules[k].attr[a]}`)
          }
        }
      })
    }
  }
})
// console.log($.attr('H1'))
// mergeRules(html,userRules)
// .then(parseHTML)
// .then(validateTag)
// .then(validateAttr)
// .then((res) => {
//   // resolve(res)
//   console.log({"res":res})
// })
// .catch((err) => {
//   console.error({"err":err})
// })

// console.log(rules)



module.exports = seoRules
