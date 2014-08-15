require './log'
require './github_source'
require 'hashie'
require 'json'

$logger.level = Logger::DEBUG

describe GithubSource, "GithubSource" do
  it "load don't duplicates data" do

    github_mock = Object.new
    allow(Github).to receive_messages(:new => github_mock)

    gs = GithubSource.new [{
      'user'=>'tet',
      'repos'=> ['a', 'b', 'c'],
      'token'=>'token'}], nil

    repos = { :body => {
      :full_name => 'fn',
      :description => 'desc',
      :html_url => 'hurl',
    }}
    repos_mock = Object.new
    allow(repos_mock).to receive_messages(:get => Hashie::Mash.new(repos))
    allow(github_mock).to receive_messages(:repos => repos_mock)

    languages_mock = Object.new
    languages = {
      'C++' => '3431',
      'Java' => '1234'
    }
    allow(repos_mock).to receive_messages(:languages => Hashie::Mash.new(languages))

    contributors_mock = Object.new
    contributors = {
    }    
    allow(repos_mock).to receive_messages(:contributors => Hashie::Mash.new(contributors))

    gs.load
    gs.load
    gs.load

    $logger.debug "Projects json: %s" % gs.projects.to_json
    $logger.debug "Projects: %s" % gs.projects['a']
    $logger.debug "Projects 'a' json: %s" % gs.projects['a'].to_json
    $logger.debug "Projects 'a' info: %s" % gs.projects['a'].info
    $logger.debug "Projects 'a' info github_projects: %s" % gs.projects['a'].info['github_projects']
    $logger.debug gs.projects['a'].info['github_projects']

    expect(gs.projects['a'].info['github_projects'].length).to be 1
  end
end

