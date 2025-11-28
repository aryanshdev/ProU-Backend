const router = require("express").Router();
const dbCon = require("../database/dbConnection");

router.post("/createEmp", async (req, res) => {
  console.log("req rec")
  const data = req.body;
  console.log(data)
  try {
   const genID= await dbCon.one(
      "INSERT INTO employees(name, role, department, status, salary) VALUES($1, $2, $3, $4, $5) RETURNING id;",
      [data.name, data.role, data.department, data.status, data.salary]
    );
    console.log("Created")
    res.json({ id: genID.id });
  } catch (err) {
    console.error("DATABASE ERROR:", err);
    res.status(500);
  }
});

router.get("/allEmp", async (_, res) => {
  try {
    const data = await dbCon.any("SELECT * FROM employees");

    res.json(data);
  } catch (error) {
    res.status(500);
  }
});

router.put("/updateDetails", async (req, res) => {
  const data = req.body;
  try {
    await dbCon.none(
      "UPDATE employees set name= $2, role = $3, department = $4, status = $5, salary=$6 WHERE id = $1",
      [data.id, data.name, data.role, data.dept, data.status, data.salary]
    );
    res.status(200);
  } catch (err) {
    res.status(500);
  }
});

router.delete("/rmEmp", (req, res) => {});

module.exports = router;
