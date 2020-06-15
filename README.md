

# NO LONGER FUNCTIONAL

This application was dependent on an API that was housed behind a firewall only available through a VPN provided by my university, which is no longer accessible

# React_Dynamic_Stocks_Application_BackEnd
An Express.js application that facilitates queries to an SQL database to imitate the functionality of React_Dynamic_Stocks_Application_FrontEnd

# Application description
This Express application replicates the services provided by a given API. These services include five main endpoints , divided into two groups: Query and Users. The Query endpoints involve accessing data from an SQL database, and include retrieving the name, symbol and industry of every available company, retrieving the latest timestamp, name, symbol, industry, open, high, low, close and volumes of a specific company identified by its symbol and retrieving all the fields from a specific company identified by its symbol after authenticated the user. The User endpoints involve accessing and providing data to the same SQL database, including adding a email and hashed password for a newly registered user and authenticating a user through the generation of a token.     

# Uses the following technologies/libraries:
•	The application use the knex query builder to implement the appropriate queries whenever the database is required to be accessed, and no raw SQL is present
•	Helmet is used with the default settings
•	Morgan is used with the ‘common’ logging style
•	Passwords are not stored in plain text within the database, instead a hash is generated based on the user’s circumstances of registration, and this hash is used to authenticate the user whenever they attempt to log in 
•	SSL functionality is also included so that the server operates on a https address, using a private key and certificate. 



