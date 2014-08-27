require './log'
require './source_data'
require 'github_api'
require 'rufus/scheduler'

class GithubSource
  def initialize(conf, scheduler)
    @scheduler = scheduler
    @github = {}

    conf.each do |repo_conf|
      user = repo_conf['user']
      @github[user] = {}
      @github[user]['repos'] = repo_conf['repos']
      $logger.info "connecting to github: %s" % user
      @github[user]['connection'] = Github.new do |config|
        config.oauth_token = repo_conf['token']
      end
      $logger.debug @github[user]['connection']
    end

    scheduler.every '1m', :first_at => :now do |job|
      $logger.info "Loading..."
      @github_data = load
    end if scheduler

    @projects = {}
    @members = {}
  end

  def members
    @members
  end

  def projects
    @projects
  end

  def events
    {}
  end

  def load
    @github.each do |user,conf|
      github = conf['connection']
      conf['repos'].each do |repo|
        proj_name = repo[0]
        repo_name = repo[1]
        $logger.debug "getting repo data: %s/%s" % [user, repo_name]
        repo_info = github.repos.get(user, repo_name)

        project = SourceProject.new(proj_name)
        if !project.info.key? 'github_projects'
          project.info['github_projects'] = []
        end
        github_project = {}
        project.info['github_projects'] << github_project
        [["name", "full_name"],
         ["description", "description"],
         ["url", "html_url"]].each do | info_field, github_field |
          github_project[info_field] = repo_info.body[github_field]
        end
        languages = []
        github.repos.languages(user, repo_name).each { |lang, chars|
          languages.append({'name' => lang, 'usage' => chars})
        }
        project.info['languages'] = languages

        # Reconsiliate project object
        if @projects.has_key?(project.info['id'])
          @projects[project.info['id']].merge_with(project)
        else
          @projects[project.info['id']] = project
        end
        project = @projects[project.info['id']]

        contributors = github.repos.contributors(user, repo_name)
        $logger.debug "user: %s repo_name: %s" % [user, repo_name]
        contributors.each do |contributor|
          $logger.debug "%s contributor for project %s" % [contributor.login, proj_name]
          member = SourceMember.new(contributor.login)
          member.projects[project.info['id']] = project
          if @members.has_key?(member.info['id'])
            @members[member.info['id']].merge_with(member)
          else
            @members[member.info['id']] = member
          end
          project.members[member.info['id']] = @members[member.info['id']]
        end
      end 

      @members.each do |id, member|
        user_info = github.users.get(id)
        $logger.debug "user info %s" % user_info
        [["avatar_url", "avatar_url"],
         ["url", "html_url"],
         ["github_public_repos", "public_repos"],
         ["name", "name"]].each do | info_field, github_field |
          member.info[info_field] = user_info.body[github_field]
        end
      end
    end
  end
end
