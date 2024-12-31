# Shipping Service Project

## Overview
The Shipping Service Project is a comprehensive application for managing shipments. This project uses cutting-edge technologies to provide efficient shipping services with functionalities like creating shipments, tracking shipments, and updating shipment statuses. 

### Key Features
- User authentication with JWT tokens.
- Shipment creation with sender and receiver details.
- Integration with Google APIs for route calculation and latitude/longitude fetching.
- Shipment tracking using a unique shipping ID.
- Admin functionality to update shipment statuses.
- RESTful API implementation.
- OpenAPI documentation for API endpoints.

## Technology Stack

### Frontend
- **Framework:** Svelte 5

### Backend
- **Runtime Environment:** Node.js
- **Framework:** Express

### Database
- **Database:** PostgreSQL

### Additional Integrations
- **Google APIs:** Used for fetching latitude/longitude and calculating distances.
- **Authentication:** JWT tokens.
- **API Documentation:** OpenAPI.

## Features in Detail

### 1. User Authentication
- JWT-based authentication ensures secure login and session management.
- Users need to log in to access shipment creation and tracking features.

### 2. Shipment Creation
- Users can create shipments by providing sender and receiver details.
- Google APIs are used to autofetch latitude and longitude based on provided addresses.
- A unique shipping ID is generated for each shipment.

### 3. Shipment Tracking
- Users can track their shipments using the unique shipping ID.

### 4. Admin Privileges
- Admins have the ability to update the status of shipments.

### 5. RESTful APIs
- Backend is implemented with RESTful API standards for seamless integration.

### 6. OpenAPI Documentation
- All APIs are documented using OpenAPI for easy understanding and testing.

#### OpenAPI Details
**Version:** 3.1.0  
**Title:** Shipping API Documentation  
**Description:** Comprehensive documentation for all API endpoints in the Shipping API.  
**Server:** [http://localhost:3000](http://localhost:3000)  

#### API Endpoints

##### Authentication
- **POST** `/api/signup`  
  - **Summary:** User signup  
  - **Request Body:**  
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string",
      "confirmPassword": "string",
      "role": "user|admin"
    }
    ```
  - **Responses:**  
    - `201`: User signed up successfully.

- **POST** `/api/login`  
  - **Summary:** User login  
  - **Request Body:**  
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - **Responses:**  
    - `200`: Login successful.

##### Shipments
- **POST** `/api/shipping`  
  - **Summary:** Create a new shipment  
  - **Request Body:**  
    ```json
    {
      "sender_id": "integer",
      "reciver_name": "string",
      "reciver_address": "string",
      "status": "Placed|In Transit|Delivered",
      "sender_address": "string",
      "sender_latitude": "number",
      "sender_longitude": "number",
      "reciver_latitude": "number",
      "reciver_longitude": "number"
    }
    ```
  - **Responses:**  
    - `201`: Shipment created successfully.

- **GET** `/api/shipping/{tracking_id}`  
  - **Summary:** Get shipment by tracking ID  
  - **Parameters:**  
    - `tracking_id`: `string` (required)  
  - **Responses:**  
    - `200`: Shipment details retrieved.

- **GET** `/api/shipping`  
  - **Summary:** Get all shipments  
  - **Responses:**  
    - `200`: List of shipments retrieved.

- **PUT** `/api/shipping/{id}/status`  
  - **Summary:** Update shipment status  
  - **Parameters:**  
    - `id`: `integer` (required)  
  - **Request Body:**  
    ```json
    {
      "status": "Placed|In Transit|Delivered"
    }
    ```
  - **Responses:**  
    - `200`: Shipment status updated successfully.

- **DELETE** `/api/shipping/{id}`  
  - **Summary:** Delete a shipment  
  - **Parameters:**  
    - `id`: `integer` (required)  
  - **Responses:**  
    - `200`: Shipment deleted successfully.

- **GET** `/api/shipping/{id}/location`  
  - **Summary:** Get shipment location  
  - **Parameters:**  
    - `id`: `integer` (required)  
  - **Responses:**  
    - `200`: Shipment location retrieved.

## Setup Instructions

### Prerequisites
- Node.js
- PostgreSQL
- Google API Key

### Steps to Run the Project
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/shipping-service.git
   ```
2. Navigate to the project directory:
   ```bash
   cd shipping-service
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     PORT=4000
     DATABASE_URL=your_postgresql_connection_string
     JWT_SECRET=your_jwt_secret
     GOOGLE_API_KEY=your_google_api_key
     ```
5. Run the database migrations (if applicable):
   ```bash
   npx sequelize-cli db:migrate
   ```
6. Start the backend server:
   ```bash
   npm start
   ```
7. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Project Snapshots

### Login Page
![image](https://github.com/user-attachments/assets/28ffe72b-2d9d-4925-80de-8f591f45545f)

### Dashboard
![image](https://github.com/user-attachments/assets/9836c111-b5c8-432f-9b8c-d3a12461f6d4)

### Shipment Creation
![image](https://github.com/user-attachments/assets/96cc40cb-5668-459b-a1c3-1bb2e9c70899)

### Shipment Tracking
![image](https://github.com/user-attachments/assets/c35c18dd-89a2-4bb7-920b-6325a89fac4d)

### View All shipment
![image](https://github.com/user-attachments/assets/4828a7f9-40eb-4a0c-8ad5-e203c0bfb384)

## customer service
![image](https://github.com/user-attachments/assets/5f5631e8-7a03-49f0-a7b1-202a9cc33e2c)

##Admin view all shipment with status controll
![image](https://github.com/user-attachments/assets/83c05dc1-be75-4bb5-ae5b-1f0acac1d884)


## Future Enhancements
- Integration with third-party logistics services.
- Real-time status updates via WebSocket.
- Enhanced admin dashboard with analytics.



## Contact
For further queries, contact [nayakradhanath@example.com].

