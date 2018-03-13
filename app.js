var rules = {
  img: {
    attr:[{alt:1}]
  },
  a: {
    attr:[{ref:1}]
  },
  head: {
    tag: [
      {title:1},
      {
        meta:{
          attr: [{name:["descriptions","keywords"]}]
        }
      }
    ]
  },
  strong: {gte:15},
  H1: {gte:1}
}

// var userRules = {
//   H1: {lte:10},
//   H2:2
// }
//
// html = "<html><H1>Something</H1></html>"

function mergeRules(html,userRules) {
  return new Promise((resolve,reject) => {
    for (var key in userRules) {
      if (rules[key]) {
        rules[key] = Object.assign(rules[key],userRules[key])
      } else {
        rules[key] = userRules[key]
      }
    }
    resolve({rules,html})
  })
}

function parseHTML(payload) {
  return new Promise((resolve,reject) => {
    resolve(payload)
  })
}

function validateTag(payload) {
  return new Promise((resolve,reject) => {
    resolve(payload)
  })
}

function validateAttr(payload) {
  return new Promise((resolve,reject) => {
    resolve(payload)
  })
}

var seoRules = {}

seoRules.validate = (html,userRules) => {
  return new Promise((resolve,reject) => {
    mergeRules(userRules)
    .then(parseHTML)
    .then(validateTag)
    .then(validateAttr)
    .then((res) => {
      resolve(res)
    })
    .catch((err) => {
      reject(errorHandling(err))
    })
  })
}

// mergeRules(userRules)
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
