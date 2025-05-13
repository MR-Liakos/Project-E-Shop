# E-Shop

A full-stack e-commerce web application featuring a Django REST Framework backend and a React/Vite frontend.  
Users can browse products, manage their cart, authenticate via JWT, and checkout with PayPal (tester).

## Features

- **Product Catalog**: List products with images, descriptions, price, stock, category & brand.  
- **Product Detail**: View individual product pages by slug.  
- **User Authentication**: Sign up / log in via JWT (Django Simple JWT).  
- **Shopping Cart**: Add/remove items, update quantities.  
- **Checkout**: PayPal integration (`@paypal/react-paypal-js`).  
- **Admin Panel**: Managed with Django Admin + Jazzmin theme.  
- **CORS**: Configured to allow your React app origins.  

## Tech Stack

- **Backend**: Django 5.1, Django REST Framework, Simple JWT, SQLite (dev), Django-Jazzmin, django-cors-headers  
- **Frontend**: React 18, Vite, React Router, Axios, js-cookie, react-hook-form, React Icons  
- **Payments**: PayPal React SDK  
- **Other**: Python 3.10+, Node 18+, npm/yarn  
