Rosetta
=======

Rosetta is a DNS management tool that is still in the planning stages. The idea is for it support managing DNS for
multiple providers (Stones) such as Bind, Powerdns, Route53, DynDNS, and ms dns.  This allows for a single tool to manage
your internal dns on your bind servers as well your external dns on DynDNS.

### Planned Features
----------------
* Support for Multiple DNS Providers (Bind and DynDNS to start)
* Views
* Role Based Access
* LDAP Authorization

### Requirements
------------
* NodeJS
* MongoDB
* Bower (to install client side libraries)
* Grunt (for easier local dev)

### Installation
------------
* git clone 
* cd rosetta
* bower install
* npm install
* node server.js (or grunt for development)
