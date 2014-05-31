require 'sinatra'
require './source'
require 'json'
require 'rufus/scheduler'

SCHEDULER = Rufus::Scheduler.new

class Pulse < Sinatra::Base
  def initialize()
    super
    @source = Source.new
    @projects = @source.projects.to_json
    @members = @source.members.to_json

    SCHEDULER.every '10s', :first_in => 0 do |job|
      @projects = @source.projects
    end
    SCHEDULER.every '10s', :first_in => 0 do |job|
      @members = @source.members
    end
  end

  get '/projects' do
    @projects
  end

  get '/members' do
    @members
  end
end
