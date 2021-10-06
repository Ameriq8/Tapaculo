const router = require("express").Router();
const Form = require("../Database/Schema/Form");
const CheckAuth = require("../Middleware/CheckAuth");
const GenKey = require("../Utils/GenKey");

// Get forms 
router.get("/", CheckAuth, async (req, res) => {
  let forms = await Form.findOne({ userID: req.user });
  res.status(200).json(forms);
});

// Get form data
router.get("/get-form/:id", CheckAuth, async (req, res) => {
  let form = await Form.findOne({ _id: req.params.id });
  if (!form) return res.status(400).json({ msg: "No form found!!" })
  res.status(200).json(form);
});

// Create new form
router.post("/new", CheckAuth, async (req, res) => {
  let { description, questions } = req.body;

  if (!description.length)
    return res.status(400).json({ msg: "No description found!!" });
  if (!questions.length)
    return res.status(400).json({ msg: "No questions found!!" });

  let newQuestionsArray = [];

  for (let q in questions) {
    newQuestionsArray.push({
      questionID: GenKey(),
      questionRequired: q.questionRequired,
      questionType: q.questionType,
    })
  }

  let form = {
    userID: req.user,
    description: description,
    status: true,
    createAt: new Date().getTime(),
    questions: newQuestionsArray,
  };

  let newForm = new Form(form);
  newForm.save({}, (err) => {
    if (err) {
      res.status(400).json({ msg: err.message });
    }

    res.status(200).json({
      msg: "Successfully create the form and save it in the database",
    });
  });
});

// Edit form
router.put("/:formID", CheckAuth, async (req, res) => {
  let { formID } = req.params;
  let { data } = req.body;

  if (!data.length)
    return res.status(400).json({ msg: "No data found!!" });

  let form = await Form.findOneAndUpdate(
    { _id: formID },
    {
      description: data.description,
      questions: data.questions
    },
    { new: true }
  );

  res
    .status(200)
    .json({ msg: "Successfully create the form and save it in the database" });
});

// Delete form
router.delete("/:formID", CheckAuth, async (req, res) => {
  const form = await Form.findOne({ _id: req.params.formID });
  if (!form) return res.status(400).json({ msg: "No form found!!" });
  const deletedForm = await Form.findByIdAndDelete({ _id: form._id });
  res
    .status(200)
    .json({ msg: "Successfully deleted the form from the database" });
});

// Add response
router.post("/add-response/:formID", CheckAuth, async (req, res) => {
  let form = await Form.findOne({ _id: req.params.formID });
  if (!form) return res.status(400).json({ msg: "No form found!!" });

  let response = {
    userID: req.user,
    responseID: GenKey(),
    response: req.body.response
  }

  form.responses.push(response);
  form.markModified("response");
  form.save();

  res
    .status(200)
    .json({ msg: "Successfully add the response to database" });
});

module.exports = router;
