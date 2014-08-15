require './log'
require './source_data'
require 'json'

$logger.level = Logger::DEBUG

describe SourceProject, "SourceData" do
  it "json with up to depth level 3" do
    project = SourceProject.new("proj_a")
    member = SourceMember.new("mem_a")
    project.members[member.info["id"]] = member
    member.projects[project.info["id"]] = project
    json = project.to_json({max_nesting: 4})
    $logger.debug json
    obj = JSON.parse(json)
    $logger.debug obj
    expect(obj.key? "members").to be true
    expect(obj["members"].key? "mem_a").to be true
    expect(obj["members"]["mem_a"].key? "projects").to be true
    expect(obj["members"]["mem_a"]["projects"].key? "proj_a").to be true
    expect(obj["members"]["mem_a"]["projects"]["proj_a"].key? "members").to be false
  end

  it 'merges two projects well' do
    p1 = SourceProject.new("p1")
    p1.info['github_projects'] = [{'a'=>'a', 'b'=>'b'}]
    p2 = SourceProject.new("p1")
    p2.info['github_projects'] = [{'a'=>'c', 'b'=>'d'}]
    p1.merge_with p2 
    json = p1.to_json({max_nesting: 4})
    obj = JSON.parse(json)
    $logger.debug obj
    expect(obj["info"]["github_projects"].class).to be Array
    expect(obj["info"]["github_projects"].length).to be 2
  end

  it 'merge two source data maps with recursive loop' do
    p1 = SourceProject.new("p")
    p2 = SourceProject.new("p")
    m1 = SourceMember.new("m1")
    m2 = SourceMember.new("m2")
    p1.members[m1.info["id"]] = m1
    p1.members[m2.info["id"]] = m2
    p2.members[m1.info["id"]] = m1
    p2.members[m2.info["id"]] = m2
    m1.projects[p1.info["id"]] = p1
    m2.projects[p2.info["id"]] = p2
    p1.merge_with p2 
    json = p1.to_json({max_nesting: 4})
    obj = JSON.parse(json)
    $logger.debug obj
    expect(obj["members"].key? "m1").to be true
    expect(obj["members"].key? "m2").to be true
    expect(obj["members"]["m1"].key? "projects").to be true
    expect(obj["members"]["m2"].key? "projects").to be true
  end

  it 'when merging array element in info, should add elements only if such element does not exists' do
  end
end
