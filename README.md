# Padel-Booking

Padel-Booking is a Node.js application developed using the NestJS framework and Typescript, designed to simplify the booking process for a single padel court. Utilizing a user-friendly interface, the application generates hourly slots from 9 AM to 10 PM (due to the court closing at 11 PM) starting from the day after the current date. Users can reserve a slot to play padel after logging in. A booking is confirmed once at least 4 users have reserved the same slot. Upon confirmation, the slot becomes unavailable for further bookings, and a mock email is sent (simulated by a log in the application console) to the users confirming the reservation.

## Features

- **No Database Required**: Data is mocked in memory for simplicity, and bookings are temporarily stored in a JSON file.
- **Mock Email Notifications**: Instead of sending actual emails, the application logs the notification for confirmation.
- **Containerization with Docker**: The application is containerized, making it easy to test locally.
- **AWS ECS Deployment**: Files are provided for deploying the application on AWS ECS.
- **Automated Release Workflow**: A GitHub Actions workflow is set up for automating releases.

**Please note**: Due to issues with the AWS free-tier it was not possible to fully test the deployment on ECS, however the Cloudformation template was included anyway for demonstration purposes

## Run the Application locally

To run the project locally, you will need to follow these steps:

1. Clone this repository.

2. On project root create a ```.env``` file and copy the contents of the ```.env.sample``` file (already present in the repository).

3. Make sure you have Docker installed on your machine.

4. Run the following command to start the project:

    ```docker-compose up```

The project will start on the default port 3000.

## Postman Collection

In the repository's root folder, you will find a "postman" directory that contains a Postman collection. This collection allows you to test the project locally.

## Testing

Some unit tests have been developed for methods with logic.

To run automated tests (developer with Jest), use the following command:

    npm run test

## Endpoints

- **POST /auth/login**: Returns a JWT token to be used in the Authorization header for other endpoints. 
  - **Request Body**: 
    ```json
    {
        "username": "user1",
        "password": "password"
    }
    ```
  - **Response Body**: 
    ```json
    {  
        "token": "jwt token"
    }
    ```
  - **Mocked Users**: `user1`, `user2`, `user3`, `user4` (Any string can be passed as a password, the authentication is only for demonstration purposes).

- **GET /slot**: Retrieves available slots for a specified date. If no date is provided, the default is set to tomorrow's date (Require authentication token in the header).

The selected date must be passed as parameter, for example 
    
    GET http://localhost:3000/slot?date=2024-03-19

- **POST /booking**: Books a slot (Require authentication token in the header).
  - **Request Body**: 
    ```json
    {
        "slot": {
            "date": "2024-03-19",
            "hour": 19
        }
    }
    ```
  - **Response Body**: 
    ```json
    {
        "id": 1,
        "slot": {
            "date": "2024-03-19T00:00:00.000Z",
            "hour": 19
        },
        "confirmed": false,
        "missingPlayersToConfirm": 3
    }
    ```
  - Returns a 400 error for invalid slots (e.g., not available).

## Closed Days

Use the `.env` file to pass a list (separated by comma) of closed days (format: `YYYY-MM-DD`) via the `CLOSED_DAYS` variable. Slots will not be available on these days.