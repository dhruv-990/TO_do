# Todo List Application

A beautiful and modern todo list application built with Express.js, featuring a responsive design and smooth animations.

## Features

- ✅ **User Authentication** - Secure login and signup with JWT tokens
- ✅ **User Management** - Each user has their own private todo list
- ✅ **Add new todos** - Create new tasks with a clean input interface
- ✅ **Mark as complete** - Toggle todo completion status with smooth animations
- ✅ **Edit todos** - Double-click or use edit button to modify existing todos
- ✅ **Delete todos** - Remove individual todos with fade-out animation
- ✅ **Filter todos** - View all, pending, or completed todos
- ✅ **Clear completed** - Bulk delete all completed todos
- ✅ **Real-time stats** - See total, completed, and pending todo counts
- ✅ **Responsive design** - Works perfectly on desktop and mobile devices
- ✅ **Modern UI** - Beautiful gradient design with smooth animations
- ✅ **RESTful API** - Full CRUD operations via REST endpoints
- ✅ **Password Security** - Bcrypt hashing for secure password storage
- ✅ **Session Management** - JWT-based authentication with automatic logout

## Screenshots

The application features:
- Gradient background with modern glassmorphism effects
- Smooth hover animations and transitions
- Clean, intuitive interface
- Real-time statistics dashboard
- Responsive design for all devices

## Installation

1. **Clone or download the project files**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up MongoDB:**
   - Install MongoDB Community Server or use MongoDB Atlas
   - See `DATABASE_SETUP.md` for detailed instructions

4. **Configure environment variables:**
   - Edit `config.env` file with your MongoDB connection string
   - Update JWT secret for production

5. **Seed the database:**
   ```bash
   npm run seed
   ```

6. **Start the application:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

7. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

8. **Sign up for a new account or use the demo account:**
   - Email: `demo@example.com`
   - Password: `password`

## API Endpoints

The application provides a RESTful API with the following endpoints:

### Authentication Endpoints

#### POST `/api/auth/signup`
- Creates a new user account
- Body: `{ "username": "user", "email": "user@example.com", "password": "password" }`

#### POST `/api/auth/login`
- Authenticates a user
- Body: `{ "email": "user@example.com", "password": "password" }`

### Todo Endpoints (Require Authentication)

#### GET `/api/todos`
- Returns all todos for the authenticated user
- Headers: `Authorization: Bearer <token>`

#### POST `/api/todos`
- Creates a new todo for the authenticated user
- Headers: `Authorization: Bearer <token>`
- Body: `{ "text": "Todo description" }`

#### PUT `/api/todos/:id`
- Updates a todo for the authenticated user
- Headers: `Authorization: Bearer <token>`
- Body: `{ "text": "Updated text", "completed": true }`

#### DELETE `/api/todos/:id`
- Deletes a specific todo for the authenticated user
- Headers: `Authorization: Bearer <token>`

#### DELETE `/api/todos`
- Deletes all completed todos for the authenticated user
- Headers: `Authorization: Bearer <token>`

## Project Structure

```
todo-list-app/
├── server.js              # Express.js server
├── package.json           # Dependencies and scripts
├── config.env             # Environment variables
├── models/                # Database models
│   ├── User.js           # User model
│   └── Todo.js           # Todo model
├── utils/                 # Utility functions
│   ├── database.js       # Database connection
│   └── seeder.js         # Database seeder
├── public/                # Frontend files
│   ├── index.html        # Main HTML file
│   ├── login.html        # Login page
│   ├── signup.html       # Signup page
│   ├── styles.css        # CSS styles
│   ├── auth.css          # Authentication styles
│   ├── script.js         # Main JavaScript
│   └── auth.js           # Authentication JavaScript
├── DATABASE_SETUP.md     # Database setup guide
└── README.md             # This file
```

## Technologies Used

- **Backend:** Express.js, Node.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Styling:** Custom CSS with modern design patterns
- **Icons:** Font Awesome
- **Fonts:** Inter (Google Fonts)

## Features in Detail

### Adding Todos
- Type in the input field and press Enter or click the + button
- Input validation prevents empty todos
- Maximum 100 characters per todo

### Managing Todos
- **Complete:** Click the checkbox to toggle completion
- **Edit:** Double-click the todo text or click the edit button
- **Delete:** Click the trash button to remove a todo
- **Bulk Delete:** Use "Clear Completed" to remove all completed todos

### Filtering
- **All:** Shows all todos
- **Pending:** Shows only incomplete todos
- **Completed:** Shows only completed todos

### Statistics
Real-time counters showing:
- Total number of todos
- Number of completed todos
- Number of pending todos

## Development

To run the application in development mode with auto-reload:

```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

## Customization

### Styling
The application uses a modern design with:
- Gradient backgrounds
- Glassmorphism effects
- Smooth animations
- Responsive layout

You can customize the appearance by modifying `public/styles.css`.

### Functionality
The JavaScript functionality is organized in a class-based structure in `public/script.js`. You can extend the features by adding new methods to the `TodoApp` class.

## Browser Support

The application works in all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application! 