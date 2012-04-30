# gitit
Command line tool to quickly open a browser to a project's github page. 
`gitit` examines a folder's .git/config and package.json file to determine its repository url and 
launches a browser to that url for quick access.

## Examples

    $ cd ~/Path/To/Some/Project
    $ gitit

* Executes system's `open` command launching default browser to project's URL


Relative paths can also optionally be provided to quickly jump to a module's page

    $ gitit ./node_modules/coffee-script

* Executes system's `open` command launching default browser to https://github.com/jashkenas/coffee-script



## Installation

    npm install -g gitit


## Roadmap

    - Multiplatform support
    - Ruby gemspec evaluation
    - Support for other git hosting services

