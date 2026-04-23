# QuickMart

QuickMart is a modern, full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). It provides a seamless shopping experience for users, featuring product browsing, a shopping cart, secure checkout, payment processing, user profiles, and an admin dashboard for inventory and order management.

## 🌟 Features

*   **User Authentication**: Secure signup and login using JWT (JSON Web Tokens).
*   **Product Catalog**: Browse and search a comprehensive catalog of products.
*   **Shopping Cart**: Add, remove, and update quantities of items in the cart.
*   **Secure Checkout & Payments**: Integrated with Razorpay for secure and reliable payment processing.
*   **User Profiles**: Manage personal information and view order history.
*   **Admin Dashboard**: Dedicated interface for administrators to manage products and monitor orders.
*   **Responsive Design**: Mobile-friendly, responsive user interface built with Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
*   **React (v19)**: Component-based UI library.
*   **React Router Dom**: For seamless client-side routing.
*   **Tailwind CSS**: Utility-first CSS framework for rapid and responsive styling.
*   **Axios**: For making API requests to the backend.
*   **React Hot Toast**: For interactive, modern notifications.

### Backend
*   **Node.js & Express**: Fast and scalable server environment and framework.
*   **MongoDB & Mongoose**: NoSQL database and object data modeling (ODM) library.
*   **JSON Web Token (JWT)**: For secure authentication and authorization.
*   **Bcrypt.js**: For secure password hashing.
*   **Razorpay**: Integrated payment gateway for secure transactions.

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   MongoDB (Local installation or MongoDB Atlas cluster)
*   Razorpay Account (For payment gateway credentials)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SowmithReddyYelapati/Zyra.git
    cd quickmart_backend
    ```

2.  **Setup Backend:**
    ```bash
    cd quickmart/backend
    npm install
    ```
    *   Create a `.env` file in the `quickmart/backend` directory and add the following environment variables:
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret_key
        RAZORPAY_KEY_ID=your_razorpay_key_id
        RAZORPAY_KEY_SECRET=your_razorpay_key_secret
        ```
    *   Start the backend server:
        ```bash
        npm run dev
        ```

3.  **Setup Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```
    *   Create a `.env` file in the `quickmart/frontend` directory (if needed, e.g., for API URLs):
        ```env
        REACT_APP_API_URL=http://localhost:5000/api
        ```
    *   Start the React development server:
        ```bash
        npm start
        ```

## 📂 Project Structure

```text
quickmart_backend/
├── quickmart/
│   ├── backend/
│   │   ├── controllers/      # Route controllers (logic)
│   │   ├── middleware/       # Custom middleware (auth, etc.)
│   │   ├── models/           # Mongoose models (database schema)
│   │   ├── routes/           # API routes definitions
│   │   ├── server.js         # Entry point for backend
│   │   └── package.json
│   └── frontend/
│       ├── public/           # Public assets
│       ├── src/
│       │   ├── pages/        # React components for pages
│       │   ├── App.js        # Main React component
│       │   └── index.css     # Global styles and Tailwind configuration
│       ├── package.json
│       └── tailwind.config.js # Tailwind CSS configuration
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/SowmithReddyYelapati/Zyra/issues) if you want to contribute.

## 📝 License

This project is licensed under the ISC License.
