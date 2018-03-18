# SEO Rules

# Install
```
npm i --save seo_rules
```

# Example
```javascript
var sr = require('seo_rules');
const cheerio = require('cheerio')

var html = "<html> \
<head> \
<title>All our wooden furniture is water proof.</title> \
<meta name=\"descriptions\" content=\"This is where you add your meta description. Make it count.\"> \
<meta name=\"keywords\" content=\"wood, furniture, garden, garden-table, etc.\"> \
</head> \
<H1> \
<div> \
<img alt=\"chick\"> \
</div> \
</H1> \
<body> \
<img> \
<H1> </H1> \
<div> \
<img alt=\"chick\"> \
<img alt=\"smiley\"> \
</div> \
</body> \
</html>"
var userRules = {
  H1:{lte:1},
  H2:1,
  div: {children :{
      img: {
        attr:{alt:["chick","smiley"]}
      }
    }
  }
}

sr.seoRules(html,userRules)
```

# Explanation

## Libraries
* immutable.js : For keep applying one rule on multiple tags or elements.
* cheerio : For parsing HTML to object.

## Configuration
```javascript
var preRules = {
  img: {
    attr:{alt:1} // need one alt attribute
  },
  a: {
    attr:{ref:1}
  },
  head:{children:{ // need children like below
    meta:{attr:
       {name:["descriptions","keywords"]}}, // need two meta tag with name attributes in array
    title:1
  }},
  strong:{lte:15}, // need less than or equal 15 strong tags
  H1:1 // need only one tag H1
}
```
