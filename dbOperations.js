const { result } = require("lodash");
var config = require("./dbConfig");
const sql = require("mssql");



async function getDetails() {
  try {
    let pool = await sql.connect(config);
    let emp = await pool.request().query("SELECT * from EmployeeDetails");
    return emp.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getDetail(EmployeeID) {
  try {
    let pool = await sql.connect(config);
    let emp = await pool
      .request()
      .input("input_parameter", sql.NVarChar, EmployeeID)
      .query(
        "SELECT * from EmployeeDetails where EmployeeID= @input_parameter"
      );

    return emp.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function deleteDetail(EmployeeID) {
  let isSuccess = false;
  try {
    let pool = await sql.connect(config);

    let emp = await pool
      .request()
      .input("input_parameter", sql.NVarChar, EmployeeID)
      .query("delete from EmployeeDetails where EmployeeID= @input_parameter");

    isSuccess = emp.rowsAffected > 0;
    return isSuccess;
  } catch (error) {
    console.log(error);
    return isSuccess;
  }
}

async function addDetail(Employee) {
  try {
    let pool = await sql.connect(config);
    let emp = await pool
      .request()
      .input("EmployeeID", sql.NVarChar, Employee.EmployeeID)
      .input("EmployeeName", sql.NVarChar, Employee.EmployeeName)
      .input("PhoneNumber", sql.NChar, Employee.PhoneNumber)
      .query(
        "SET ANSI_WARNINGS OFF INSERT INTO EmployeeDetails VALUES(@EmployeeID,@EmployeeName,@PhoneNumber)"
      );

    return emp.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function updateDetail(EmployeeId, data) {
  let column = [];
  let value = [];
  let isSuccess = false;
  
  try {
    for (let i = 0; i < Object.keys(data).length; i++) {
      column.push(Object.keys(data)[i]);
      value.push(Object.values(data)[i]);
    }
    
    let pool = await sql.connect(config);
    const request = pool.request();
    let result;
    for (let i = 0; i < column.length; i++) {
      let query = `UPDATE EmployeeDetails SET ${column[i]} = '${value[i]}' WHERE EmployeeID = '${EmployeeId}'`;
      result = await request.query(query);
    }
    isSuccess=result.rowsAffected>0;
    console.log(isSuccess);
    return isSuccess;
  } catch (error) {
    console.log(error);
    return isSuccess;
  }
}


async function getUserByEmpID(EmployeeID) {
  try {
    
    let pool = await sql.connect(config);
    let b = await pool
      .request()
      .input("EmployeeID", sql.NVarChar, EmployeeID)
      .query(
        "SELECT * FROM EmployeeDetails WHERE EmployeeID = @EmployeeID"
      );
      console.log(b.rowsAffected);
    if(b.rowsAffected[1]==0){
      return true;
    }
    else{
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error; // Optionally re-throw the error after logging it
  }
}

module.exports = {
  getDetails: getDetails,
  getDetail: getDetail,
  deleteDetail: deleteDetail,
  addDetail: addDetail,
  updateDetail: updateDetail,
  getUserByEmpID: getUserByEmpID,
};
