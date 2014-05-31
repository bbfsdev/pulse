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
