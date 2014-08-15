require 'trello'

include Trello

class TrelloSource
  def initialize(conf)
    Trello.configure do |config|
      config.developer_public_key = conf['developer_public_key']
      config.member_token = conf['member_token']
    end
    @boards = conf['boards']
  end

  def events
    []
  end

  def projects
    []
  end

  def members
    []
  end

  def boards
    @boards.keys
  end

  def status_list(board_name)
    status = Array.new
    Board.find(@boards[board_name]).lists.each do |list|
      status.push({label: list.name, value: list.cards.size})
    end
    status
  end

  def boards_status()
    status = Array.new
    @boards.each do |name, id|
      status.push({project: name, boards: status_list(name)})
    end
    status
  end

  def trello_members(board_name)
    Board.find(@boards[board_name]).members(params={limit: 1000})
  end

  def all_members
    all_members = {}
    @boards.each_key do |board_name|
      members(board_name).each do |member|
        all_members[member.username] = member
      end
    end
    members_list = Array.new
    all_members.each_value do |member|
      member_actions = member.actions(params={limit: 1000})
      week_ago = (Time.now - 7*24*60*60)
      last_week = member_actions.select { |action| action.date > week_ago }
      two_weeks_ago = (Time.now - 2*7*24*60*60)
      before_last_week = member_actions.select { |action| action.date > two_weeks_ago && action.date < week_ago }
      members_list.push({label: member.full_name, value: last_week.length - before_last_week.length})
    end
    members_list
  end
end
