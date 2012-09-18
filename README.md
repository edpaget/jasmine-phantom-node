# Jasmine Phantom Node

This is a node.js based headless runner for using jasmine specs in phantomjs, specifically when using the [hem](https://github.com/maccman/hem/) server to manage your javascripts and dependencies. 

I'm definitely accepting ideas for a better name 

# Installation

Add as a `devDependency` to your `package.json`:
```
"devDependencies" : {
  "jasmine-phantom-node" : "git://github.com/edpaget/jasmine-phantom-node.git"
}
```

# Usage

At the moment jasmine-phantom-node has only been tested alongside the hem server. Since this started as a quick hack, I'll probably eventually add test cases and try it with other in-browser dependency management tools. 

However, since it's just connecting to a server hosting the jasmine test page. You should be able to use it with any jasmine test page, as long as it doesn't have it's own window.onload block. 

My prefered method of using jasmine-phantom-node with as a `npm test` script. 

     
