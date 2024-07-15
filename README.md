# ToDo App

This is a ToDo application built with Node.js, Express, MongoDB, and React. 

## Setup Instructions

### 1. Extract the Files

1. Extract the contents of the provided `.rar` file.
2. Create a directory named `todo-app` and move the extracted contents into this directory.

### 2. Install Node.js

1. Download and install Node.js from [nodejs.org](https://nodejs.org/).
2. After installation, add Node.js to your system's PATH

### 3. Setup MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) and sign up for an account.
2. In the "Deploy your first cluster" section, choose the free tier and click "Create Cluster" (leave all settings as default, including the cluster name `Cluster0` and provider `AWS`).
3. Once the cluster is created, create a database user with a username and password of your choice.
5. Choose a connection method and select "Drivers". Copy the connection string.
6. Update the `.env` file located in the `todo-app/backend` directory with your connection string


### 4. Install Dependencies

1. Open a terminal and navigate to the `todo-app/backend` directory:

    cd todo-app/backend
    npm install
   
2. Then, navigate to the `todo-app/frontend` directory:

    cd ../frontend
    npm install

### 5. Start the Application

1. Open two terminal windows
2. Start backend and frontend with npm start

## Dependencies and Technologies

### Backend

- Node.js: JavaScript runtime environment
- Express: Web framework for Node.js
- MongoDB: NoSQL database
- Mongoose: MongoDB object modeling tool
- JWT (jsonwebtoken): For user authentication
- bcrypt: Password hashing
- Joi: Data validation
- multer: Middleware for handling file uploads

### Frontend

- React: JavaScript library for building user interfaces
- axios: Promise-based HTTP client for the browser and Node.js
- react-icons: Icons for React

