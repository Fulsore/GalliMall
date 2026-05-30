# Galli Mall – AI-Powered Hyperlocal E-Commerce Marketplace
Live Link:
https://gallimall.vercel.app/

## Overview

Galli Mall is a full-stack AI-powered hyperlocal e-commerce platform designed to connect local vendors and customers within their surrounding area. The platform enables vendors to manage products, inventory, and orders while allowing customers to discover products through AI-powered semantic search, place orders, and make secure online payments.

The system was built to solve the problem of local businesses lacking a modern digital presence and customers struggling to discover nearby products efficiently.

---

## Key Highlights

* Multi-Vendor Marketplace
* Customer & Vendor Dashboards
* AI Semantic Product Search
* RAG-Based AI Shopping Assistant
* Secure Authentication & Authorization
* Multi-Factor Authentication
* Razorpay Payment Integration
* Shopping Cart & Checkout
* Order Management System
* Product Recommendation Engine
* Responsive Mobile-First UI
* SEO Optimized Architecture
* Production-Oriented API Design

---

## Business Problem

Traditional local stores often depend on walk-in customers and have limited online visibility.

Customers face challenges such as:

* Finding nearby products quickly
* Comparing products from multiple vendors
* Receiving personalized recommendations
* Accessing reliable local delivery options

Galli Mall addresses these challenges through:

* Hyperlocal product discovery
* AI-powered search capabilities
* Digital storefronts for vendors
* Real-time order management

---

# System Architecture

User
↓
Frontend (Next.js + React)
↓
Django REST Framework APIs
↓
Business Services Layer
↓
├── Authentication Service
├── Product Service
├── Order Service
├── Payment Service
├── AI Search Service
├── RAG Chatbot Service
└── Notification Service
↓
MySQL Database

---

## User Roles

### Customer

Features:

* Registration & Login
* Browse Products
* Search Products
* AI Semantic Search
* AI Chat Assistant
* Add to Cart
* Place Orders
* Track Orders
* Manage Profile

### Vendor

Features:

* Vendor Registration
* Product Management
* Inventory Management
* Order Management
* Dashboard Analytics
* Revenue Monitoring

### Delivery Partner

Features:

* Order Assignment
* Delivery Status Updates
* Order Tracking

### Administrator

Features:

* User Management
* Vendor Approval
* Product Monitoring
* Platform Analytics
* Order Oversight

---

# AI Features

## AI Semantic Search

Traditional search:

Search: "red shoes"

Returns exact keyword matches.

AI Semantic Search:

Search:
"comfortable running shoes"

Returns:

* Running shoes
* Sports shoes
* Fitness footwear

even if exact keywords do not exist.

Technologies:

* Sentence Transformers
* Vector Embeddings
* Similarity Search

---

## RAG Chatbot

The chatbot helps customers discover products and receive shopping assistance.

Capabilities:

* Product Recommendations
* Store Information
* Product Availability Queries
* Order Assistance

Pipeline:

User Query
↓
Embedding Generation
↓
Vector Search
↓
Context Retrieval
↓
LLM Response Generation
↓
Response Delivery

Technologies:

* LangChain
* FAISS / Vector Database
* Hugging Face Embeddings
* Groq / OpenRouter / OpenAI

---

# Authentication & Security

Implemented security features:

* JWT Authentication
* Refresh Tokens
* Protected APIs
* Role-Based Access Control (RBAC)
* Multi-Factor Authentication
* Password Encryption
* Input Validation
* API Security Controls

---

# Payment System

Integrated Razorpay Payment Gateway.

Supported:

* UPI
* Credit Cards
* Debit Cards
* Net Banking
* Wallet Payments

Features:

* Payment Verification
* Transaction Validation
* Secure Checkout
* Payment Status Tracking

---

# Technology Stack

## Frontend

* Next.js
* React.js
* JavaScript
* TypeScript
* Tailwind CSS
* Redux Toolkit

## Backend

* Python
* Django
* Django REST Framework

## Database

* MySQL
* PostgreSQL (Supported)

## AI & Machine Learning

* LangChain
* Hugging Face
* Groq
* OpenRouter
* OpenAI
* Vector Embeddings
* Semantic Search
* RAG

## Payment

* Razorpay

## Tools

* Git
* GitHub
* Postman
* VS Code

---

# Major Modules

## Authentication Module

* Login
* Registration
* MFA
* Role Management

## Product Management

* Product Creation
* Product Editing
* Product Categorization
* Inventory Tracking

## Shopping Cart

* Add to Cart
* Quantity Updates
* Remove Products

## Checkout

* Address Selection
* Payment Processing
* Order Confirmation

## Order Management

* Order Creation
* Order Tracking
* Status Updates
* Delivery Tracking

## AI Module

* Semantic Search
* RAG Chatbot
* Product Recommendation

---

# Database Design

Core Entities:

* Users
* Vendors
* Customers
* Products
* Categories
* Cart
* Orders
* Payments
* Reviews
* Deliveries

Relationships:

Customer → Orders

Vendor → Products

Order → Payments

Product → Reviews

---

# API Highlights

Authentication APIs

* Register
* Login
* Logout
* Refresh Token

Product APIs

* Create Product
* Update Product
* Delete Product
* Search Product

Order APIs

* Create Order
* Track Order
* Cancel Order

AI APIs

* Semantic Search
* Chatbot Query

Payment APIs

* Create Payment
* Verify Payment

---

# Performance Optimizations

Implemented:

* Lazy Loading
* Optimized API Calls
* Pagination
* Caching Strategies
* SEO Metadata
* Responsive Design

Performance Goals:

* Lighthouse Score 90+
* Mobile Friendly
* Fast Initial Load

---

# Project Outcomes

* Built a complete production-oriented hyperlocal marketplace.
* Implemented AI-powered product discovery.
* Developed vendor and customer ecosystems.
* Integrated secure payment processing.
* Created scalable backend APIs.
* Delivered a real-world business-focused solution.

---

# Screenshots

Add screenshots here:

* Home Page
* Customer Dashboard
* Vendor Dashboard
* Product Detail Page
* Cart
* Checkout
* Order Management
* AI Semantic Search
* RAG Chatbot
* Mobile View

---

# Future Enhancements

* Recommendation Engine
* Real-Time Notifications
* Voice-Based Search
* Delivery Partner Mobile App
* AI Demand Forecasting
* Advanced Analytics Dashboard

---

# Author

Fulsore Anil Kumar

Full Stack AI Engineer

Technologies:
React.js | Next.js | Django REST Framework | AI Agents | RAG | LLMs | Semantic Search | Razorpay | MySQL
