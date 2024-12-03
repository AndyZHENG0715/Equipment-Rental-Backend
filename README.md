# Assignment 1 - Equipment Rental System for Science Faculty

This project involves developing a web system to manage equipment rentals for the Science Faculty. The system tracks faculty-owned equipment and rentals to staff and students.

## Checklist

### Functional Requirements

- **Homepage**:
  - [x] Display highlighted equipment available for rent using Bootstrap 5 Carousel.
  - [x] Display a calendar under the Carousel showing rented equipment.

- **Pages**:
  - [x] **All Equipment**: Display all available equipment with URL `/equipments`.
  - [x] **Add Equipment**: Allow adding new equipment with URL `/equipment/add`.
  - [x] **Edit Equipment**: Allow editing and deleting equipment with URL `/equipment/edit/:id`.
  - [x] **View Equipment**: Display equipment details and rental status with URL `/equipment/detail/:id`.
  - [x] **User Management**: For admin to manage users with URL `/users`.
    - [x] **Add User**: Allow admin to add new users with URL `/user/new`.
    - [x] **Edit User**: Allow admin to edit or delete users with URL `/user/edit/:id`.
  - [x] **Search Equipment**: Allow users to search equipment with URL `/search/:query`.

- **Authentication and Authorization**:
  - [x] Implement login functionality with email and password.
  - [x] Implement role-based access control with roles: admin and user.
    - **Admin**:
      - [x] Access to all pages.
      - [x] Navigation bar includes links to user management pages.
    - **User**:
      - [x] Access to homepage, search, equipment list, and equipment detail page.
      - [x] Navigation bar excludes admin links.
  - [x] Implement logout functionality with redirection to the homepage.

- **Equipment Rental**:
  - [x] Users can rent equipment by clicking the "Rent!" button on the equipment detail page.
  - [x] Store rental information, including user, rental date, and expected return date.
  - [x] Display rented equipment on the calendar on the homepage.

- **Validation**:
  - [x] Provide necessary validation for input fields; most fields are required.

- **Responsive Design**:
  - [x] Ensure all pages are responsive using Bootstrap 5.
  - [x] Use a single-column layout for mobile devices.

- **Navigation Bar**:
  - [x] Add a navbar with links appropriate to the user's role.
  - [x] Include a logout button.

### Technical Requirements

- **Frontend**:
  - [x] Use Vue 3 with Vue Router and Bootstrap 5 for the UI.
  - [x] Communicate with the backend using RESTful APIs.
  - [x] Maintain the frontend code in a Git repository.

- **Backend**:
  - [x] Use Node.js and Express.js for the server.
  - [x] Connect to MongoDB to store equipment and user information.
  - [x] Implement RESTful API endpoints:
    - [x] `GET /api/equipments`: Get all equipment, optionally handle search queries.
    - [x] `POST /api/equipments`: Add a new equipment.
    - [x] `GET /api/equipments/:id`: Get equipment by ID.
    - [x] `PUT /api/equipments/:id`: Update equipment by ID.
    - [x] `DELETE /api/equipments/:id`: Delete equipment by ID.
    - [x] `POST /api/equipments/:id/rent`: Rent equipment by ID.
    - [ ] `GET /api/users`: Get all users (admin only).
    - [ ] `POST /api/users`: Add a new user (admin only).
    - [ ] `GET /api/users/:id`: Get user by ID (admin only).
    - [ ] `PUT /api/users/:id`: Update user by ID (admin only).
    - [ ] `DELETE /api/users/:id`: Delete user by ID (admin only).
    - [ ] `POST /api/login`: Authenticate user and generate JWT token.
  - [x] Implement role-based access control to protect sensitive API endpoints.
  - [x] Maintain the backend code in a Git repository.

- **General**:
  - [x] Frontend and backend should run independently.
  - [x] Code should be well-organized and follow best practices.
  - [x] Regularly commit code with meaningful messages.

### Git Repositories for Submission

- **Express Backend**: [Backend Repository](https://classroom.github.com/a/hKS8g7jL)
- **Vue Frontend**: [Frontend Repository](https://classroom.github.com/a/p7PSD34y)
