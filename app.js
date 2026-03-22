const express = require("express");
const app = express();
const path = require("path");
const studentModel = require("./models/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {
    success: req.query.success,
    error: req.query.error,
  });
});

// app.post("/create", async (req, res) => {
//   let { name, email, course } = req.body;
//   let createdStudent = await studentModel.create({
//     name,
//     email,
//     course,
//   });
//   res.send(alert(`Student with ${name} has been registered`));
//   res.redirect("/read");
// });

app.post("/create", async (req, res) => {
  try {
    let { name, email, course } = req.body;

    await studentModel.create({ name, email, course });

    res.redirect("/read?success=Student added successfully");
  } catch (err) {
    if (err.code === 11000) {
      // duplicate email error
      res.redirect("/?error=Email already exists");
    } else {
      res.redirect("/?error=Something went wrong");
    }
  }
});

app.get("/read", async (req, res) => {
  let students = await studentModel.find();
  res.render("read", { students });
});

app.get("/delete/:id", async (req, res) => {
  let students = await studentModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/read");
});


app.get("/edit/:id", async (req, res) => {
  let student = await studentModel.findOne({ _id: req.params.id });
  res.render("edit", { student });
});

app.post("/update/:id", async (req, res) => {
  let { name, email, course } = req.body;
  let students = await studentModel.findOneAndUpdate(
    { _id: req.params.id },
    { name, email, course },
    { new: true },
  );
  res.redirect("/read");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
