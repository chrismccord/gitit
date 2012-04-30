fs      = require 'fs'
path    = require 'path'
{spawn, exec} = require 'child_process'


@Gitit = 

  opened: false

  open: (url) ->  
    return if @opened
    @opened = true
    exec "open #{url}"


  hostURL: (host, user, repo) ->
    switch host
      when "github.com" then "https://#{host}/#{user}/#{repo}"
      else # TODO: Support more services


  actions:
    ".git/config": (filePath) ->
      fs.readFile filePath, (err, data) =>
        matches = data.toString().match ///.*
          \[remote\s[\"\']origin[\"\']\]        # origin declaration
          [^\[]*                                # match anything until next config declaration
          .*url\s?=\s?.*@(.*):(.*)/(.*)\.git\n  # extract remote url details 
        ///
        return unless matches
        [matched, host, user, repo] = matches       
        @open(@hostURL(host, user, repo)) if host? and user? and repo?


    "package.json": (filePath) -> 
      package = require(filePath)
      repo = package.repository ? {}
      url = if typeof(repo) is 'string' then repo else repo.url ? ""
      if url.length > 0
        matches = url.match(/.*:\/\/(.*)\/(.*)\/([^\.]+)(.*)?/)
        return unless matches
        [match, host, user, repoName, ext] = matches
        url = @hostURL(host, user, repoName)
      else if package.name.toString().length > 0
        url = "'https://github.com/search?utf8=✓&q=#{package.name}&type=Everything&start_value=1'"
      @open(url) if url.length > 0


  run: ->
    relativePath = process.argv[2] ? ""
    for file, action of @actions
      do (file, action) =>
        filePath = path.resolve(path.join(relativePath, file))
        path.exists filePath, (exists) => action.call(this, filePath) if exists and not @opened


