const router = require('express').Router()
const form = require('../Database/Schema/Form')
const checkAuth = require('../Middleware/CheckAuth')
const genKey = require('../Utils/GenKey')

// Get forms
router.get('/', checkAuth, async (req, res) => {
    let forms = await form.findOne({ userID: req.user })
    return res.status(200).json({forms})
})

// Get form data
router.get('/get-form/:id', checkAuth, async (req, res) => {
    let formDoc = await form.findOne({ _id: req.params.id })
    if (!formDoc) return res.status(400).json({ msg: 'No form found!!' })
    return res.status(200).json(formDoc)
})

// Create new form
router.post('/new', checkAuth, async (req, res) => {
    let { description, questions } = req.body

    if (!description.length) return res.status(400).json({ msg: 'No description found!!' })
    if (!questions.length) return res.status(400).json({ msg: 'No questions found!!' })

    let newQuestionsArray = []

    for (let q in questions) {
        newQuestionsArray.push({
            id: genKey(26),
            required: q.required,
            type: q.type
        })
    }

    let formDoc = {
        userID: req.user,
        description: description,
        status: true,
        createAt: new Date().getTime(),
        questions: newQuestionsArray
    }

    let newForm = new form(formDoc)
    newForm.save({}, err => {
        if (err) {
            res.status(400).json({ msg: err.message })
        }

        return res.status(200).json({
            msg: 'Successfully create the form and save it in the database'
        })
    })
})

// Edit form
router.put('/:formID', checkAuth, async (req, res) => {
    let { formID } = req.params
    let { data } = req.body

    if (!data.length) return res.status(400).json({ msg: 'No data found!!' })

    await form.findOneAndUpdate(
        { _id: formID },
        {
            description: data.description,
            questions: data.questions
        },
        { new: true }
    )

    return res.status(200).json({ msg: 'Successfully create the form and save it in the database' })
})

// Delete form
router.delete('/:formID', checkAuth, async (req, res) => {
    const form = await form.findOne({ _id: req.params.formID })
    if (!form) return res.status(400).json({ msg: 'No form found!!' })
    await form.findByIdAndDelete({ _id: form._id })
    return res.status(200).json({ msg: 'Successfully deleted the form from the database' })
})

// Add response
router.post('/add-response/:formID', checkAuth, async (req, res) => {
    let form = await form.findOne({ _id: req.params.formID })
    let response = req.body.response

    if (!form) return res.status(400).json({ msg: 'No form found!!' })

    if (response.response.questionID) return res.status(400).json({ msg: 'No question found!!' })
    if (response.response.content) return res.status(400).json({ msg: 'No content found!!' })

    let responseObj = {
        id: genKey(26),
        userID: req.user || 'anonymous',
        response: response
    }

    form.responses.push(responseObj)
    form.markModified('response')
    form.save()

    return res.status(200).json({ msg: 'Successfully add the response to database' })
})

module.exports = router
