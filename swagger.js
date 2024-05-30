const swaggerJSDoc=require('swagger-jsdoc');
//const swaggerUi=require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Employee Project',
        version: '1.0.0',
        description: "An Employee API Application",
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }
    },
    security: [{
        bearerAuth: []
    }],
    servers: [
        {
            url: "http://localhost:3000/",
        },
    ],
};


const options = {
    swaggerDefinition,
    apis: ['./api.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;