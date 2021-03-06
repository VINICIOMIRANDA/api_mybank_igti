export const swaggerDocument = 
{
    "swagger": "2.0",
    "info": {
      "description": "My Bank API",
      "version": "1.0.0",
      "title": "My Bank API description"
    },
    "host": "localhost:3000",
    "tags": [
      {
        "name": "account",
        "description": "Account management"
      }
    ],
    "paths": {
      "/account": {
  
        "get": {
          "tags": [
            "account"
          ],
          "sumary": "Get exisiting accounts",
          "description": "Get existing account description",
          "produces": [
            "application/json"
          ]
        },
        "responses": {
          "200": {
            "description": "succesfull operation",
            "schema": null,
            "type": "array",
            "items": {
              "ref": "#/definitions/Account"
            }
          },
          "400": {
            "description": "Error ocurred"
          }
    }
    
     
      }
    }
  }