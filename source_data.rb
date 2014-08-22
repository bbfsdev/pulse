require "./log"

class SourceData
  attr_accessor :info

  def initialize(id)
    @info = {'id' => id}
  end

  def merge_with(other)
    $logger.debug "merge_with: %s %s %s %s %s %s" % [self.info["id"], self, self.info, other.info["id"], other, other.info]
    return if self.equal? other
    other.info.each do |key, value|
      if @info.key? key 
        if value.class == Hash
          @info.merge(value) { |key, old_val, new_val|
            msg = "Info hash value disagree: %s %s %s" % [key, old_val, new_val]
            $logger.debug msg
            throw :bad_merge, msg
          }
        elsif value.class == Array
          $logger.debug "%s %s %s" % [key, @info[key], value]
          $logger.debug "%s %s" % [self, other]
          if @info.key? key
            @info[key] = (@info[key] + value).uniq
          else
            @info[key] = value.uniq
          end
        else
          if @info[key] != value
            msg = "Info value not hash and not an Array. key:%s class:%s value:%s old value %s" % [key, value.class, value, @info[key]]
            $logger.debug msg
            throw :bad_merge, msg
          end
        end
      else
        @info[key] = value
      end
    end
  end
end

def merge_source_data_maps(first, second)
  $logger.debug "merge source data maps: %s %s" % [first, second]
  second.each do |id, source_data|
    if first.has_key?(id)
      $logger.debug "%s %s %s" % [id, first[id], source_data]
      first[id].merge_with(source_data)
    else
      first[id] = source_data
    end
  end
end

class SourceMember < SourceData
  attr_accessor :projects
  attr_accessor :events

  def initialize(id)
    super(id)
    @projects = {}
    @events = {}
  end

  def to_json(options={})
    begin
      $logger.debug "%s" % @info["id"]
      { 'info' => @info, 'projects' => @projects, 'events' => @events }.to_json(options)
    rescue JSON::NestingError => e
      $logger.debug "%s %s" % [@info["id"], e]
      { 'info' => @info }.to_json()
    end
  end

  def merge_with(other)
    return if self.equal? other
    super  # Merge info
    merge_source_data_maps(@projects, other.projects)
    merge_source_data_maps(@events, other.events)
    $logger.debug "merge_with_end: %s %s %s %s %s %s" % [self.info["id"], self, self.info, other.info["id"], other, other.info]
  end
end

class SourceProject < SourceData
  attr_accessor :members
  attr_accessor :events

  def initialize(id)
    super(id)
    @members = {}
    @events = {}
  end

  def to_json(options={})
    begin
      $logger.debug "%s" % @info["id"]
      { 'info' => @info, 'members' => @members, 'events' => @events }.to_json(options)
    rescue JSON::NestingError => e
      $logger.debug "%s %s" % [@info["id"], e]
      { 'info' => @info }.to_json()
    end
  end

  def merge_with(other)
    return if self.equal? other
    super  # Merge info
    merge_source_data_maps(@members, other.members)
    merge_source_data_maps(@events, other.events)
    $logger.debug "merge_with_end: %s %s %s %s %s %s" % [self.info["id"], self, self.info, other.info["id"], other, other.info]
  end
end

class SourceEvent < SourceData
  attr_accessor :members
  attr_accessor :projects

  def initialize(id)
    super(id)
    @members = {}
    @projects = {}
  end

  def to_json(options={})
    begin
      $logger.debug "%s" % @info["id"]
      { 'info' => @info, 'members' => @members, 'projects' => @projects }.to_json(options)
    rescue JSON::NestingError => e
      $logger.debug "%s %s" % [@info["id"], e]
      { 'info' => @info }.to_json()
    end
  end

  def merge_with(other)
    return if self.equal? other
    super  # Merge info
    merge_source_data_maps(@members, other.members)
    merge_source_data_maps(@events, other.events)
    $logger.debug "merge_with_end: %s %s %s %s %s %s" % [self.info["id"], self, self.info, other.info["id"], other, other.info]
  end
end

