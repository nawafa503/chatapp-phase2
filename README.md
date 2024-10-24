# Assignment Phase 2 Documentation

## Introduction

In **Assignment Phase 2**, the functionality of the chat system is extended to include:
- Persistent data storage using **MongoDB**
- Real-time chat communication through **Sockets**
- Image support for profile pictures and image sharing in chat
- **Video chat** functionality using APIs such as **PeerJS**
- Comprehensive testing for both client and server sides
- Usage of **Git** for version control and tracking development progress

---


## 1. Data Structures

### Client-Side Data Structures

**User**
- `username` (string): Unique identifier for the user.
- `email` (string): User email address.
- `roles[]` (array): Roles assigned to the user (e.g., Super Admin, Group Admin, User).
- `groups[]` (array): Groups the user belongs to.
- `profileImage` (string): Path to the user's profile image.

**Group**
- `groupId` (string): Unique identifier for the group.
- `groupName` (string): Name of the group.
- `groupAdmin` (string): User ID of the group admin.
- `channels[]` (array): List of channels in the group.

**Channel**
- `channelId` (string): Unique identifier for the channel.
- `channelName` (string): Name of the channel.
- `messages[]` (array): History of chat messages in the channel, including text and image messages.

### Server-Side Data Structures (MongoDB)

**User Schema**
- `username` (string): Unique identifier for the user.
- `email` (string): User email.
- `passwordHash` (string): Hashed user password for secure storage.
- `roles[]` (array): Roles assigned to the user.
- `groups[]` (array): List of group IDs the user is associated with.
- `profileImage` (string): Path to the user's profile image stored on the server.

**Group Schema**
- `groupId` (string): Unique identifier for the group.
- `name` (string): Group name.
- `adminId` (string): User ID of the group admin.
- `channels[]` (array): List of channel IDs associated with the group.

**Channel Schema**
- `channelId` (string): Unique identifier for the channel.
- `name` (string): Channel name.
- `messages[]` (array): Array of message objects.
  - `userId` (string): ID of the user who sent the message.
  - `content` (string): Message content or image path.
  - `timestamp` (Date): Time the message was sent.

---

## 2. Client-Server Responsibility Division

The client and server have clearly defined roles to optimize performance and security:

### Client Responsibilities (Angular):
- **User Interface**: Render group/channel selection, chat interfaces, and forms for login/registration.
- **Real-time Updates**: Receive real-time chat updates through sockets.
- **Profile Management**: Allow users to upload profile images and send images in chat.
- **API Calls**: Communicate with the server for data such as group details, chat history, and image upload through REST APIs.
- **Video Chat**: Initiate and manage video chats via PeerJS integration.

### Server Responsibilities (Node.js + Express):
- **Data Management**: Handle CRUD operations for users, groups, and channels through a **MongoDB** database.
- **Socket Management**: Manage real-time chat communications, including sending/receiving messages and notifying channel joins/leaves.
- **File Management**: Store and serve images (profile images and chat images) from a specified directory.
- **REST APIs**: Provide JSON responses for client requests such as retrieving groups, channels, and chat history.
- **Video Chat Setup**: Set up video chat capabilities using PeerJS server.

---

## 3. API Routes

### User Routes
- **POST /api/v1/users/login**  
  **Parameters**: `username`, `password`  
  **Response**: User data, authentication token.

- **POST /api/v1/users/register**  
  **Parameters**: `username`, `email`, `password`  
  **Response**: Newly created user data.

### Group Routes
- **POST /api/v1/groups**  
  **Parameters**: `groupName`, `adminId`  
  **Response**: Created group details.

- **GET /api/v1/groups/:groupId**  
  **Parameters**: `groupId`  
  **Response**: Group details and list of channels.

### Channel Routes
- **POST /api/v1/groups/:groupId/channels**  
  **Parameters**: `groupId`, `channelName`  
  **Response**: Created channel details.

- **GET /api/v1/groups/:groupId/channels/:channelId**  
  **Parameters**: `groupId`, `channelId`  
  **Response**: Channel messages and details.

### Image Routes
- **POST /api/v1/users/uploadProfileImage**  
  **Parameters**: `userId`, `image`  
  **Response**: Path to the uploaded profile image.

- **POST /api/v1/groups/:groupId/channels/:channelId/uploadImage**  
  **Parameters**: `groupId`, `channelId`, `image`  
  **Response**: Path to the uploaded image in the channel.

---

## 4. Angular Architecture

### Components

- **App Component**: Root component that handles routing and manages state across the application.
- **Login Component**: Handles user login by making API calls and storing user session information.
- **Register Component**: Allows new users to register and communicates with the backend for creating new users.
- **Group List Component**: Displays a list of all groups the user is part of and fetches group data via the GroupService.
- **Channel List Component**: Displays the list of channels within a selected group and uses the ChannelService to get the data.
- **Chat Component**: Displays real-time chat messages, including text and images, and communicates with the server via WebSocket for live updates.
- **Profile Component**: Allows users to upload profile images and display them in their chat messages.

### Services

- **User Service**: Manages API calls for user login, registration, and profile updates.
- **Group Service**: Manages CRUD operations related to groups.
- **Channel Service**: Handles the creation of channels and fetching of channel messages.
- **Socket Service**: Establishes socket connections for real-time communication.
- **Video Chat Service**: Manages video chat setup using PeerJS.

### Models

- **User Model**: Represents user information, including `username`, `email`, `roles`, `groups`, and `profileImage`.
- **Group Model**: Represents group data with `groupId`, `groupName`, and `channels`.
- **Channel Model**: Represents channels with `channelId`, `channelName`, and `messages`.

### Routes

- `/login`: Renders the login page.
- `/register`: Renders the registration page.
- `/groups`: Displays the list of groups the user is a member of.
- `/groups/:groupId/channels`: Displays channels in a specific group.
- `/groups/:groupId/channels/:channelId/chat`: Loads the chat interface for a selected channel.

---

## 5. Client-Server Interaction Details

### Server-Side Changes:
- **File Management**: Files such as images uploaded by users are saved in a dedicated directory on the server. The paths are then saved in the MongoDB database.
- **Global Vars**: Socket connections are maintained for all users, and real-time updates are pushed when any user sends a message, joins, or leaves a channel.

### Client-Side Display Updates:
- The chat component listens for WebSocket messages and dynamically updates the message feed in real-time.
- When a user uploads an image, the file is first sent to the server, which saves it and sends back the image path to be displayed in the chat window.
- Profile images are displayed next to the messages in chat, enhancing user interaction.

---

## 6. Testing

- **Server-Side**: Tests are implemented using **Mocha** and **Chai** to ensure that all API routes function as expected, especially for user authentication, group creation, and channel messaging.
- **Client-Side**: Unit tests and end-to-end (E2E) tests are implemented using **Jasmine** and **Karma** to ensure components render properly, API services return correct data, and the application functions smoothly in various user scenarios.

---

This documentation summarizes the technical details and implementation of Phase 2 of the MEAN stack chat system.
