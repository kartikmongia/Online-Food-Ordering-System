# 🛒 Online Food Ordering System (Backend)

A backend application built with **Node.js**, **Express.js**, and **MongoDB** that allows users to browse restaurants and vote for them.

## 🔧 Features
- User Sign Up/Login
- View Restaurants with Filters
- Vote & Leave Ratings
- Admin: Add/Edit/Delete Restaurants
- JWT-based Authentication

## 🚀 Technologies Used
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for Authentication

## 📂 API Endpoints
- `POST /signup` – User Registration
- `POST /login` – User Login
- `GET /restaurants` – View Restaurants
- `POST /restaurants/vote/:id` – Vote
- `GET /restaurants/vote/count` – Vote Count
- `GET /users/profile` – User Profile

## 📌 Run Locally
```bash
npm install
npm start
