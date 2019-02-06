const router = require('express').Router()
const request = require('request')
const env = require('dotenv')
env.config()

router.route('/')
    .get((req, res) => {
        let issue = ''
        let issues = []
        request({
            method: 'GET',
            url: process.env.MY_PATH,
            headers: {
                'Authorization': 'token ' + req.user.accessToken,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'node project'
            }
        }, (err, response, body) => {
            if (err) {
                console.log(err)
                return
            } else if (response.statusCode === 200) {
                let json = JSON.parse(body)
                json.forEach(content => {
                    issue = {
                        title: content.title,
                        author: content.user.login,
                        message: content.body,
                        comment: content.comments,
                        url: content.url,
                        create: content.created_at,
                        update: content.updated_at,
                        issue_id: content.id
                    }
                    issues.push(issue)
                })
                res.status(200).render('github', { contents: issues })
            }
        })
    })
    .post((req, res) => {
        let io =  req.app.get('socketio')
        let content = req.body
        let title = content.action
        let type = 'issue'
        let message =  content.issue.title
        let author = content.sender.login
        let url = content.issue.url
        if (title === 'created') {
            message = content.comment.body
            type = 'comment'
        }
        io.emit('notification', {
            title: title,
            type: type,
            message: message,
            author: author,
            url: url,
            created: content.issue.created_at,
            updated: content.issue.updated_at,
            comments: content.issue.comments, 
            issue_id: content.issue.id
        })
        res.status(200).end()
    })

module.exports = router