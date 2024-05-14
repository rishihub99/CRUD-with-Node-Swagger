const dbOperations = require("./dbOperations");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

var app = express();
var router = express.Router();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});

router.use((request, response, next) => {
  console.log("middleware");
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
 * /api/details:
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

router.route("/details").get((request, response) => {
  dbOperations.getDetails().then((result) => {
    //console.log(result);
    response.json(result[0]);
  });
});

/** GET Methods */
/**
 * @openapi
 * /api/detail/{EmployeeID}:
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

router.route("/detail/:EmployeeID").get((request, response) => {
  dbOperations.getDetail(request.params.EmployeeID).then((result) => {
    if (Object.keys(result.keys).length == 0) {
      console.warn(`Employee with ID ${request.params.EmployeeID} not found`);
      response.status(404).json({ error: "Employee not found" });
    } else response.json(result);
  });
});

/** DELETE Methods */
/**
 * @openapi
 * '/api/delete/{EmployeeID}':
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
router.route("/delete/:EmployeeID").delete((request, response) => {
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
 * '/api/add/':
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
router.route("/add").post((request, response) => {
  let emp = { ...request.body };

  dbOperations.addDetail(emp).then((result) => {
    response.json(emp);
  });
});

/** PUT Methods */
/**
 * @openapi
 * '/api/update/{EmployeeID}':
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

router.route("/update/:EmployeeID").put((request, response) => {
  const data = request.body;

  dbOperations.updateDetail(request.params.EmployeeID, data).then((result) => {
    //console.log(result);

    
    if (result) {
      response.json(result);
    } else {
      console.warn(`Employee with ID ${request.params.EmployeeID} not found`);
      response.status(404).json({ error: "Employee not found" });
    }
  });
});
