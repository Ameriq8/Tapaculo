const router = require('express').Router()
const checkAuth = require('../Middleware/CheckAuth')
const user = require('../Database/Schema/User')
const genKey = require('../Utils/GenKey')

router.get('/', checkAuth, async (req, res) => {
    const userDoc = await user.findById(req.user)
    return res.status(200).json({
        userName: userDoc.userName,
        id: userDoc._id
    })
})

router.put('/username', checkAuth, async (req, res) => {
    let { username } = req.body
    if (!username) return res.status(400).send({ msg: 'Username required' })
    const newUsername = await findOneAndUpdate({ _id: req.user }, { username: username }, { new: true })
    return res.status(200).json(newUsername)
})

router.get('/auth-key', checkAuth, async (req, res) => {
    const userDoc = await user.findOne({ _id: req.user })
    return res.status(200).json({
        authKey: userDoc.authkey
    })
})

router.post('/reset', checkAuth, async (req, res) => {
    await user.findOneAndUpdate({ _id: req.user }, { authkey: genKey(128) }, { new: true })
    return res.status(200)
})

module.exports = router
