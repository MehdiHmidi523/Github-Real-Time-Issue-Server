# mh223vk-examination-3
Real time github todo list issue server.

## What is the URL to your application?
Use the provided ubuntu server [mh223vk](https://cscloud401.lnu.se/).
## Describe what you have done to make your application secure, both in code and when configuring your application server

can have nginx proxy requests to HTTP servers, and then itself respond to clients over HTTPS. When doing this, you will want to be sure that the nginx<->proxy connect is unlikely to be sniffed by whoever is your expected attacker. Safe-enough approaches might include:
     proxying to the same host (as you do)
     proxying to other hosts behind your firewall

Proxying to another host on the public Internet is unlikely to be safe-enough
## Describe the following parts, how you are using them and what their purpose
    Reversed proxy 
```` Java
add the .well-known location described in RFC-5785 in our Nginx configuration 
which sets up a webroot on the Nginx server instead of proxying it to the backend server.
This folder will allow us to validate the SSL certificate 
using the Automatic Certificate Management Environment with Certbot.
````
    Process manager
    TLS certificates
    Environment variables
## What differs in your application when running it in development from running it in production?



## Which extra modules did you use in the assignment? Motivate the use of them and how you have make sure that they are secure enough for production

## Have you implemented any extra features (see below) that could motivate a higher grade of this assignment? If so, describe them.

