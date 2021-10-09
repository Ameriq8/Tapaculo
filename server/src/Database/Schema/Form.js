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
            id: String,
            required: Boolean,
            type: String
        }
    ],
    responses: [
        {
            id: String,
            userID: String,
            response: [
                {
                    questionID: String,
                    content: String
                }
            ]
        }
    ]
})

module.exports = model('Form', formSchema)
