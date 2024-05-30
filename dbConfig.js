var config = {
    
    //type: "default",
    user: "sqladmin", // Update with your username
    password: "P@ssw0rd1234", // Update with your password
    server: "employee-db001.database.windows.net", // Update with your server name
    database: "sqldb-employeedb",// Update with your database name
    
    options: {
      encrypt: true, // For Microsoft Azure
     trustedconnection :true,
    },
    port: 1433
  };

  module.exports=config;