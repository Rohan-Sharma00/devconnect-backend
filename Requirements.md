# DevTinder Requirements Documentation

## Overview

**DevTinder** is a developer networking platform where developers can:

- Connect with other developers
- Collaborate on projects
- Ask for help
- Contribute to open-source
- Build professional relationships

Users can create profiles, discover developers, and send connection requests.

---

# API Structure

## Auth Router

Handles authentication and session management.

### POST /signup

Register a new user.

#### Request Body

{
  "firstName": "Rohan",
  "lastName": "Sharma",
  "userName": "rohan123",
  "emailId": "rohan@gmail.com",
  "password": "123456",
  "age": 25,
  "gender": "male",
  "mobileNo": "9876543210",
  "skills": ["NodeJS","Angular"]
}

#### Features

- Creates new user account
- Email must be unique
- Username must be unique
- Password stored as hashed value
- Age must be 18+

---

### POST /login

Login existing user.

#### Request Body

{
  "emailId": "rohan@gmail.com",
  "password": "123456"
}

#### Features

- Validates credentials
- Generates JWT token
- Creates user session

---

### POST /logout

Logout user.

#### Features

- Invalidates JWT or session
- Clears cookies

---

# Profile Router

Handles profile operations.

---

### GET /profile/view

Get logged-in user's profile.

#### Features

Returns:

- firstName
- lastName
- userName
- emailId
- age
- gender
- mobileNo
- photoUrl
- skills

Authentication Required

---

### PATCH /profile/edit

Update user profile.

#### Editable Fields

- firstName
- lastName
- age
- gender
- mobileNo
- photoUrl
- skills

#### Features

- Validates input
- Updates user profile

Authentication Required

---

### PATCH /profile/password

Change password.

#### Request Body

{
 "oldPassword":"123456",
 "newPassword":"abcdef"
}

#### Features

- Verifies old password
- Hashes new password
- Updates password

Authentication Required

---

# Connection Request Router

Handles connection requests.

---

### POST /request/send/:status/:userId

Send request to another user.

#### Status Values

- interested
- ignored

#### Example

POST /request/send/interested/USER_ID

POST /request/send/ignored/USER_ID

#### Features

- Cannot send request to yourself
- Cannot send duplicate requests
- Creates connection request

Authentication Required

---

### POST /request/review/:status/:requestId

Review received request.

#### Status Values

- accepted
- rejected

#### Example

POST /request/review/accepted/REQUEST_ID

POST /request/review/rejected/REQUEST_ID

#### Features

- Accept request → users become connections
- Reject request → request closed

Authentication Required

---

# User Router

Handles user data APIs.

---

### GET /user/requests/received

Get received connection requests.

#### Features

Returns:

- requestId
- sender details
- status

Authentication Required

---

### GET /user/connections

Get accepted connections.

#### Features

Returns:

- Connected users list
- Only accepted connections included

Authentication Required

---

### GET /user/feed

Get developer feed.

#### Features

Returns developer profiles excluding:

- Logged-in user
- Ignored users
- Already connected users
- Already requested users

Authentication Required

---

# Request Status Values

Connection request statuses:

- ignored
- interested
- accepted
- rejected

---

# Database Structure

## User Collection

Fields:

- _id
- firstName
- lastName
- userName
- emailId
- password
- age
- gender
- mobileNo
- photoUrl
- skills
- createdAt
- updatedAt

---

## ConnectionRequest Collection

Fields:

- _id
- senderId
- receiverId
- status
- createdAt
- updatedAt

Status Values:

- interested
- ignored
- accepted
- rejected

---

# Functional Requirements

Users must be able to:

- Signup
- Login
- Logout
- View profile
- Edit profile
- Change password
- Browse developers
- Send requests
- Ignore users
- Accept requests
- Reject requests
- View connections
- View received requests

---

# Non Functional Requirements

## Security

- Password stored using bcrypt hashing
- JWT authentication
- Protected routes require login
- Input validation required

---

## Performance

- Feed API should support pagination
- Fast API responses

---

# Default Values

photoUrl default:

https://ohmylens.com/wp-content/uploads/2017/06/dummy-profile-pic.png