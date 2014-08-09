require './trello_source'
require './github_source'
require 'yaml'

class Source
  def initialize(scheduler)
    File.open("sources.yml", "r") do |infile|
      conf = YAML.load(infile.read())
      @trello_source = TrelloSource.new(conf['trello'])
      @github_source = GithubSource.new(conf['github'], scheduler)
    end
  end

  def merge(hash1, hash2)
    ret = {}
    handle_hash = Proc.new do |key, value|
      if ret.has_key?(key) then
        ret[key].merge_with(value)
      else
        ret[key] = value
      end
    end
    hash1.each &handle_hash
    hash2.each &handle_hash
    ret
  end

  def members()
    github_members = @github_source.members()
    trello_members = @trello_source.members()
    merge(github_members, trello_members)
  end

  def projects()
    puts 'Getting projects'
    trello_projects = @trello_source.projects()
    puts trello_projects
    github_projects = @github_source.projects()
    puts github_projects
    merge(github_projects, trello_projects)
  end

  def events()
    trello_events = @trello_source.events()
    guthub_events = @github_source.events()
    merge(guthub_events, trello_events)
  end
end

