Rosetta
=======

Rosetta is a DNS management tool that is still in the planning stages. The idea is for it support managing DNS for
multiple providers (Stones) such as Bind, Powerdns, Route53, DynDNS, and ms dns.  This allows for a single tool to manage
your internal dns on your bind servers as well your external dns on DynDNS.

### Planned Features
----------------
* Builtin DNS Server written in node for transfers and nsupdates (in progress)
* Support for Multiple DNS Providers (Bind and DynDNS to start)
* Views
* Role Based Access
* LDAP Authorization

### Requirements
------------
* NodeJS
* MongoDB
* Bower (easier installation of client side libraries)
* Grunt (for easier local dev)
* Jasmine-Node (for unit testing)

### Installation
------------
* git clone https://github.com/truesneel/rosetta.git
* cd rosetta
* bower install
* npm install
* node server.js (or grunt for development)
