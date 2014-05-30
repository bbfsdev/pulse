# pulse.rb
require 'sinatra'
require './source'

class Pulse < Sinatra::Base
  def initialize()
    super
    @source = Source.new
  end

  get '/' do
    'Hello world!<br>' +
    'Members:' + @source.members.join('<br>') + '<br>' +
    'Projects:' + @source.projects.join('<br>')
  end
end
