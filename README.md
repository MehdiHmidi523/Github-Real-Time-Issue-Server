# mh223vk-examination-3
Real time github todo list issue server.

## What is the URL to your application?
Use the provided ubuntu server [mh223vk](https://cscloud401.lnu.se/).
## Describe what you have done to make your application secure, both in code and when configuring your application server
I do not ship or deploy with any default credentials, particularly for admin users.

Check my SSL certificates
https://www.ssllabs.com/ssltest/analyze.html?d=cscloud401.lnu.se

I have the nginx proxy run requests to HTTP app server, and then itself respond to clients over HTTPS. When doing this, I was sure that the nginx<->proxy connection is unlikely to be sniffed by whomever is an expected attacker. Safe-enough approaches might include: 
 - proxying to the same host (as you do) :+1:
 - proxying to other hosts behind your firewall

 => Proxying to another host on the public Internet is unlikely to be safe-enough

In addition I used Certbot, which is an automated python script to set up #letsencrypt# certificates on the website. These SSL certificates are recognized by every major browsers, which means we will get the green lock on our website once installed. As I did when I run my tests on the ssl certificates. 

The packages that I use could contain critical security vulnerabilities that could affect my application. The security of the app is as strong as the “weakest link” in the dependencies.

Since npm@6, npm automatically reviews every install request. Also we can use ‘npm audit’ to analyze the dependency tree.
   
   === npm audit security report ===
       found 0 vulnerabilities
       in 403 scanned packages

## Describe the following parts, how you are using them and what their purpose
    Reversed proxy 
+We add the .well-known location described in RFC-5785 in our Nginx configuration  which sets up a webroot on the Nginx server instead of proxying it to the backend server. This folder will allow us to validate the SSL certificate 
using the Automatic Certificate Management Environment with Certbot.

    Process manager
+we can increase the performance of a Node app by many times by launching a cluster of processes.The Cluster mode is a special mode when starting a Node.js application, it starts multiple processes and load-balance HTTP/TCP/UDP queries between them
+Hot Reload allows to update an application without any downtime
    TLS certificates
    Environment variables
## What differs in your application when running it in development from running it in production?
Setting NODE_ENV to “production” makes Express:
+Cache view templates.
+Cache CSS files generated from CSS extensions.
+Generate less verbose error messages

avoid using synchronous functions or methods that might take milliseconds or microseconds. For a high traffic website it will compound and may lead to high latency or response time of the API 

## Which extra modules did you use in the assignment? Motivate the use of them and how you have make sure that they are secure enough for production

## Have you implemented any extra features (see below) that could motivate a higher grade of this assignment? If so, describe them.

