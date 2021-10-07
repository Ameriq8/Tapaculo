const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const CheckAuth = require('../Middleware/CheckAuth')
const User = require('../Database/Schema/User')

router.get('/', CheckAuth, async (req, res) => {
    const user = await User.findById(req.user)
    res.json({
        userName: user.userName,
        id: user._id
    })
})

router.post('/register', async (req, res) => {
    try {
        let { email, password, userName } = req.body
        let emailRegex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        let passwordRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$'

        // validate
        if (!userName || !email || !password) return res.status(400).json({ msg: 'Not all fields have been entered.' })
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: 'Enter a correct email' })
        }
        if (!passwordRegex.test(password))
            return res.status(400).json({
                msg: 'Minimum eight characters, at least one uppercase letter, one lowercase letter and one number'
            })

        const existingUser = await User.findOne({ email: email })
        if (existingUser) return res.status(400).json({ msg: 'An account with this email already exists.' })

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            userName,
            email,
            password: passwordHash,
            role: 'user'
        })

        const savedUser = await newUser.save()
        res.json(savedUser)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        // validate
        if (!email || !password) return res.status(400).json({ msg: 'Not all fields have been entered.' })

        const user = await User.findOne({ email: email })
        if (!user) return res.status(400).json({ msg: 'No account with this email has been registered.' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        console.log('token', token)

        res.json({
            token,
            user: {
                id: user._id,
                userName: user.userName
            }
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.delete('/delete', CheckAuth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user)
        res.json(deletedUser)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) return res.json(false)

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) return res.json(false)

        const user = await User.findById(verified.id)
        if (!user) return res.json(false)

        return res.json(true)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
