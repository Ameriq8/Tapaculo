const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const checkAuth = require('../Middleware/CheckAuth')
const user = require('../Database/Schema/User')
const genKey = require('../Utils/GenKey')
const { validateNewUser, validateLoginForm } = require('../Utils/Validates')

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body

        // validate
        const { error } = validateNewUser(req.body)
        if (error) return res.status(400).json({ msg: error.details[0].message })

        const existingUser = await user.findOne({ email: email })
        if (existingUser) return res.status(400).json({ msg: 'An account with this email already exists.' })

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new user({
            username,
            email,
            password: passwordHash,
            role: 'user',
            authKey: genKey(128)
        })

        const savedUser = await newUser.save()
        res.json(savedUser)
    } catch (err) {
        res.status(500).json({ error: err.message })
        console.log(err.message)
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        // validate
        const { error } = validateLoginForm(req.body)
        if (error) return res.status(400).json({ msg: error.details[0].message })

        const userDoc = await user.findOne({ email: email })
        if (!userDoc) return res.status(400).json({ msg: 'No account with this email has been registered.' })

        const isMatch = await bcrypt.compare(password, userDoc.password)
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        console.log('token', token)

        return res.json({
            token,
            user: {
                id: userDoc._id,
                username: userDoc.username
            }
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
        console.log(err)
    }
})

router.delete('/delete', checkAuth, async (req, res) => {
    try {
        const deletedUser = await user.findByIdAndDelete(req.user)
        return res.status(200).json(deletedUser)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) return res.status(400).json(false)

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) return res.status(400).json(false)

        const userDoc = await user.findById(verified.id)
        if (!userDoc) return res.status(400).json(false)

        return res.status(200).json(true)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
