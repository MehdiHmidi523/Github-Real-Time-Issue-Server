const router = require('express').Router()
const passport = require('passport')

router.get('/', passport.authenticate('github', { scope: ['repo, admin:repo_hook', 'admin:org_hook'] }))
router.get('/redirect', passport.authenticate('github'), (req, res) => { res.redirect('/webhook') })

module.exports = router
