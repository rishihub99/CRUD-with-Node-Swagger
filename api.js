const UserDbOperations = require("./UserDbOperations");
const dbOperations = require("./dbOperations");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./jwtmiddleware");

var app = express();
var router = express.Router();
app.set("view engine", "ejs");

const jwtSecret = "your_jwt_secret"; // Use an environment variable in production

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/", router);
app.use("/user/signup", router);
app.use("/user/login", router);

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});

router.use((request, response, next) => {
  console.log("Employee middleware");
  next();
});

// Define a schema for the response object
/**
 * @swagger
 * components:
 *   schemas:
 *     Employees:
 *       type: object
 *       properties:
 *         EmployeeID:
 *           type: string
 *           description: The ID of the Employee.
 *         EmployeeName:
 *           type: string
 *           description: The name of the Employee.
 *         PhoneNumber:
 *           type: string
 *           description: The Phone Number of the Employee.
 */

/** GET Methods */
/**
 * @openapi
 * /employee:
 *   get:
 *     tags:
 *       - Employee Details
 *     summary: Retrieve all employees
 *     description: Get all employee details.
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employees'
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Server Error
 */

router.route("/employee/").get(authenticateToken, (request, response) => {
  dbOperations.getDetails().then((result) => {
    //console.log(result);
    response.json(result);
  });
});

/** GET Methods */
/**
 * @openapi
 * /employee/{EmployeeID}:
 *   get:
 *     tags:
 *       - Employee Details
 *     summary: Get an Employee by EmployeeID
 *     parameters:
 *       - name: EmployeeID
 *         in: path
 *         description: ID of the Employee to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employees'
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Server Error
 */

router
  .route("/employee/:EmployeeID")
  .get(authenticateToken, (request, response) => {
    dbOperations.getDetail(request.params.EmployeeID).then((result) => {
      console.log(result);
      if (result[0].length) {
        response.json(result);
      } else {
        console.warn(`Employee with ID ${request.params.EmployeeID} not found`);
        response.status(404).json({ error: "Employee not found" });
      }
    });
  });

/** DELETE Methods */
/**
 * @openapi
 * '/employee/{EmployeeID}':
 *  delete:
 *     tags:
 *     - Employee Details
 *     summary: Delete Employee Details by Employee Id
 *     parameters:
 *      - name: EmployeeID
 *        in: path
 *        description: The unique Id of the Employee
 *        required: true
 *     responses:
 *      200:
 *        description: Removed
 *      400:
 *        description: Bad request
 *      404:
 *        description: Employee Not Found
 *      500:
 *        description: Server Error
 */
router
  .route("employee/:EmployeeID")
  .delete(authenticateToken, (request, response) => {
    dbOperations.deleteDetail(request.params.EmployeeID).then((result) => {
      console.log("api.js,deleteDetail", result);
      if (result) {
        response.json(result);
      } else {
        console.warn(`Employee with ID ${request.params.EmployeeID} not found`);
        response.status(404).json({ error: "Employee not found" });
      }
    });
  });

/** POST Methods */
/**
 * @openapi
 * '/employee':
 *  post:
 *     tags:
 *     - Employee Details
 *     summary: Create an Employee Details
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - EmployeeID
 *              - EmployeeName
 *              - PhoneNumber
 *            properties:
 *              EmployeeID:
 *                type: string
 *
 *              EmployeeName:
 *                type: string
 *
 *              PhoneNumber:
 *                type: string
 *
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.route("/employee").post((request, response) => {
  let emp = { ...request.body };

  dbOperations.addDetail(emp).then((result) => {
    response.json(emp);
  });
});

/** PUT Methods */
/**
 * @openapi
 * '/employee/{EmployeeID}':
 *   put:
 *     tags:
 *       - Employee Details
 *     summary: Modify an Employee Details
 *     parameters:
 *       - in: path
 *         name: EmployeeID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Employee to be modified
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               EmployeeName:
 *                 type: string
 *               PhoneNumber:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Modified
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Server Error
 */

router
  .route("/employee/:EmployeeID")
  .put(authenticateToken, (request, response) => {
    const data = request.body;

    dbOperations
      .updateDetail(request.params.EmployeeID, data)
      .then((result) => {
        //console.log(result);

        if (result) {
          response.status(200).json({ error: "Employee modified" });
        } else {
          console.warn(
            `Employee with ID ${request.params.EmployeeID} not found`
          );
          response.status(404).json({ error: "Employee not found" });
        }
      });
  });

// Define a schema for the response object
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         EmployeeID:
 *           type: string
 *           description: The ID of the Employee.
 *         EmailID:
 *           type: string
 *           description: The email id of the Employee.
 *         Password:
 *           type: string
 *           description: The password of the Employee.
 */

//Create an User

/** POST Methods */
/**
 * @openapi
 * '/usersignup':
 *  post:
 *     tags:
 *     - User Details
 *     summary: Create an User Details
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - EmployeeID
 *              - EmailID
 *              - Password
 *            properties:
 *              EmployeeID:
 *                type: string
 *
 *              EmailID:
 *                type: string
 *
 *              Password:
 *                type: string
 *
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.route("/usersignup").post(async (request, response) => {
  const { EmployeeID, EmailID, Password } = request.body;
  const user = await UserDbOperations.getUserByEmail(EmailID);
  const user1 = await dbOperations.getUserByEmpID(EmployeeID);
  

  if (!EmailID || !Password) {
    return response
      .status(400)
      .json({ error: "EmailID and Password are required" });
  }

  try {
    if (user==false) {
      return response.status(409).json({ error: "Email ID already exists" });
    } else if (user1==false) {
      return response.status(404).json({ error: "Employee ID not found" });
    } else {
      const passwordHash = await bcrypt.hash(Password, 10);
      await UserDbOperations.addUserDetail(EmployeeID, EmailID, passwordHash);
      response.status(201).json({ message: "User registered successfully" });
    }
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/user/signup").get((request, response) => {
  return response.render("signup");
});

/** POST Methods */
/**
 * @openapi
 * '/userlogin':
 *  post:
 *     tags:
 *     - User Details
 *     summary: User Log In
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - EmailID
 *              - Password
 *            properties:
 *              EmailID:
 *                type: string
 *              Password:
 *                type: string
 *
 *     responses:
 *      201:
 *        description: Logged In
 *      409:
 *        description: Conflict
 *      404:
 *        description: Email or Password doesn't match
 *      500:
 *        description: Server Error
 */
router.route("/userlogin").post(async (request, response) => {
  const { EmailID, Password } = request.body;

  if (!EmailID || !Password) {
    return response
      .status(400)
      .json({ error: "EmailID and Password are required" });
  }

  try {
    const user = await UserDbOperations.getUserByEmail(EmailID);
    //console.log('apilayer',user);
    if (!user) {
      return response
        .status(404)
        .json({ error: "Email or Password doesn't match" });
    }
    const isPasswordValid = bcrypt.compare(Password, user[0].Password);

    if (!isPasswordValid) {
      return response
        .status(401)
        .json({ error: "Email or Password doesn't match" });
    }

    const token = jwt.sign(
      { EmployeeId: user[0].EmployeeID, email: user[0].EmailID },
      jwtSecret,
      { expiresIn: "5m" }
    );
    response.status(200).json({ message: "Successfully logged in", token });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/user/login").get((request, response) => {
  return response.render("login");
});

module.exports = router;
