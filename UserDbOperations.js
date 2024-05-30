const { result } = require("lodash");
var config = require("./dbConfig");
const sql = require("mssql");
const { json } = require("body-parser");

async function addUserDetail(EmployeeID,EmailID,Password) {
  try {
    let pool = await sql.connect(config);
    let user = await pool
      .request()
      .input("EmployeeID", sql.NVarChar, EmployeeID)
      .input("EmailID", sql.NVarChar, EmailID)
      .input("Password", sql.NVarChar, Password)
      .query(
        "INSERT INTO UserDetails VALUES(@EmployeeID,@EmailID,@Password)"
      );

    return user.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getUser(EmailID, Password) {
  try {
    let pool = await sql.connect(config);
    let user = await pool
      .request()
      .input("EmailID", sql.NVarChar, EmailID)
      .input("Password", sql.NVarChar, Password)
      .query(
        "SET ANSI_WARNINGS OFF SELECT * FROM UserDetails WHERE EmailID = @EmailID AND Password = @Password"
      );

    return user.rowsAffected; // Return the records found
  } catch (error) {
    console.log(error);
    throw error; // Optionally re-throw the error after logging it
  }
}

async function getUserByEmail(EmailID) {
  try {
    
    let pool = await sql.connect(config);
    let a = await pool
      .request()
      .input("EmailID", sql.NVarChar, EmailID)
      .query(
        "SELECT * FROM UserDetails WHERE EmailID = @EmailID"
      );
      //console.log("DbOperations",user);
    if(a.rowsAffected==0){
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
  addUserDetail: addUserDetail,
  getUser: getUser,
  getUserByEmail: getUserByEmail,
  
};
