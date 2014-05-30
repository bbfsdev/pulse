Simple tool for creating open source developers community.
The tool designed to be automatic, grep data from Trello, Github and other project/people information sources which have API.
This data is shown to everyone to enable sharing and helping each other.

Create a sources.yml file in the same directory and put the following content: 
# This is Pulse config file
trello: 
  developer_public_key: <developer public key> 
  member_token: <member token>
  boards:
    pulse: <board id>
    groupcam: <boards id>
# End of pulse config file
