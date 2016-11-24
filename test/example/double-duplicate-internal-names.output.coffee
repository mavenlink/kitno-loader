View = require './my/awesome/view.coffee'
OtherView = require './this/other/view.coffee'


class AwesomeView extends View
  render: ->
    myView = new OtherView


module.exports = AwesomeView
