const { Schema, model } = require('mongoose')

const formSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        required: true
    },
    questions: [
        {
            questionID: String,
            questionRequired: Boolean,
            questionType: String
        }
    ],
    responses: [
        {
            userID: String,
            questionID: String,
            response: String
        }
    ]
})

module.exports = model('Form', formSchema)
