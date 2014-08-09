require 'sinatra'
require './source'
require 'json'
require 'rufus/scheduler'

SCHEDULER = Rufus::Scheduler.new

class Pulse < Sinatra::Base

  set :public_folder, 'public'

  def initialize()
    super
    @source = Source.new(SCHEDULER)
  end

  get '/projects' do
    @source.projects.to_json({max_nesting: 5})
  end

  get '/projects/:id' do |id|
    if @source.projects.key? id 
      {id => @source.projects[id]}.to_json({max_nesting: 5})
    else
      '{}'
    end
  end

  get '/members' do
    @source.members.to_json({max_nesting: 4})
  end

  get '/members/:id' do |id|
    if @source.members.key? id 
      {id => @source.members[id]}.to_json({max_nesting: 4})
    else
      '{}'
    end
  end

  get '/events' do
    @source.events.to_json({max_nesting: 4})
  end
end
