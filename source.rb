require './trello_source'
require 'yaml'

class Source
  def initialize()
    File.open("sources.yml", "r") do |infile|
      conf = YAML.load(infile.read())
      @trello_source = TrelloSource.new(conf['trello'])
    end
  end 

  def members()
    @trello_source.all_members
  end

  def projects()
    @trello_source.boards_status
  end
end
