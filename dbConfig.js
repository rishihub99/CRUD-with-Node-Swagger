var config = {
    
    //type: "default",
    user: "sqladministrator", // Update with your username
    password: "P@ssw0rd1234", // Update with your password
    server: "nodepoc0001.database.windows.net", // Update with your server name
    database: "employee",// Update with your database name
    
    options: {
      encrypt: true, // For Microsoft Azure
     trustedconnection :true,
    },
    port: 1433
  };

  module.exports=config;