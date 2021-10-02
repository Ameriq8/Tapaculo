const router = require('express').Router();
const Form = require("../Database/Schema/Form");
const CheckAuth = require("../Middleware/CheckAuth");

router.get("/", CheckAuth, async (req, res) => {
  let forms = await Form.findOne({userID: req.user});
  res.status(200).json(forms);
});

router.post("/new-form", CheckAuth, async (req, res) => {
  let {questions} = req.body;

  if (!questions.length) return res.status(400).json({ msg: "Questions field is empty" });

  let form = {
    userID: req.user,
    status: true,
    createAt: new Date().getTime(),
    questions
  }

  let newForm = new Form(form);
  newForm.save({}, (err) => {
    if (err) {
      res.status(400).json({ msg: err.message });
    }

    res.status(200).json({ msg: "Successfully create the form and save it in the database" });
  });
});

router.put("/update-form/:formID", CheckAuth, async (req, res) => {
  let { formID } = req.params;
  let { questions } = req.body

  if (!questions.length) return res.status(400).json({ msg: "Questions field is empty" });

  let form = await Form.findOneAndUpdate({ _id: formID }, {questions: questions}, {new: true});

  res.status(200).json({ msg: "Successfully create the form and save it in the database" });
});

router.delete("/delete-form/:formID", CheckAuth, async (req, res) => {
  const form = await Form.findOne({ _id: req.params.formID });
  if (!form) return res.status(400).json({ msg: "No form found!!" });
  const deletedForm = await Form.findByIdAndDelete({ _id: form._id });
  res.status(200).json({ msg: "Successfully deleted the form from the database" });
})

module.exports = router;
