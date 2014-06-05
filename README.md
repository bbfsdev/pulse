Simple tool for creating open source developers community.
The tool designed to be automatic, grep data from Trello, Github and other project/people information sources which have API.
This data is shown to everyone to enable sharing and helping each other.

Install Ruby: https://www.ruby-lang.org/en/installation/

Install bundler:

    > gem install bundler

Get and build the project:

    > mkdir pulse
    > git clone git@github.com:bbfsdev/pulse.git
    > bundle
    
Create a sources.yml file in the same directory and put the following content: 

    # This is Pulse config file
    trello: 
      developer_public_key: <developer public key>
      member_token: <member token>
      boards:
        pulse: <board id>
        groupcam: <boards id>
    # End of pulse config file

Run sinatra:

    > rackup
    
You will get the following output:

    Thin web server (v1.6.2 codename Doc Brown)
    Maximum connections set to 1024
    Listening on 0.0.0.0:9292, CTRL+C to stop
    
Open browser on port localhost:9292



**How to add more content?**

The <searchable-content> directive:
Loads data through an ajax call into the directive, and allows to filter it by name, through a text input.

How to use it?

This will load JSON data from http://<server_address>/%contentModel into a variable called **data**,
You can then use it to access its members using angular {{ }} notation.
The **data** variable is used to refer to a single object in the recieved JSON data.

    <searchable-content type="%tagType" title="%title" model="%contentModel">
	%contentTemplate
    </searchable-content>

Where: %tagType - either "ul" or "div" to either load it as an unordered list or just a div per data line.
       %title - will be shown as the title of the element
       %contentModel - a name for the model of data to load through AJAX call

For example:

    // loading http://localhost/wantHelp
    // recieved response should be an array of objects, and each of the objects has properties user, skill, time .
    <searchable-content type="ul" title="We want to help!" model="wantHelp">
	{{data.user }} with {{data.skill}} ({{ data.time}})
    </searchable-content>

