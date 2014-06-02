require 'sinatra'
require './source'
require 'json'
require 'rufus/scheduler'

SCHEDULER = Rufus::Scheduler.new

class Pulse < Sinatra::Base

  set :public_folder, 'public'

  def initialize()
    super
    @source = Source.new
    @projects = ''
    @members = ''

    SCHEDULER.every '10s', :first_in => 0 do |job|
      @projects = @source.projects.to_json
    end
    SCHEDULER.every '10s', :first_in => 0 do |job|
      @members = @source.members.to_json
    end

  end

  get '/projects' do
    @projects
  end

  get '/members' do
    @members
  end
end
