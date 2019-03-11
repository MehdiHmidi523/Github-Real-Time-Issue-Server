"use strict";

//For the environment variable
require('dotenv').config();

const router = require('express').Router();
const rp = require('request-promise');

router.route('/')
    .get(function (req, res) {
        let key = process.env.GITHUB_ACCESS_KEY;
        console.log(key);
        let options = {
            uri: 'https://api.github.com/repos/1dv523/mh223vk-examination-3/issues',
            headers: {
                'Authorization': 'Basic ' + key,
                'User-Agent': 'Github-Issues-Real-Time-app'
            },
            json: true
        };

        rp(options)
            .then(function(resp) {
                let context = {
                    issues: resp.map(function (issue) {
                        return {
                            id: issue.id,
                            title: issue.title,
                            issueBody: issue.body,
                            comments: issue.comments,
                            issueUrl: issue.url,
                            created_at: issue.created_at,
                            updated_at: issue.updated_at
                        }
                    })
                };
                res.render('home/index.hbs', context);
            })
            .catch(function (err) {
                console.log(err);
            });
    });

module.exports = router;