# Job Hunter

A comprehensive job hunting platform backend built with Spring Boot, providing RESTful APIs for job seekers and employers to connect, manage job postings, and handle resume submissions.

## 🚀 Technologies

### Backend Stack
- **Java 21** - Modern Java with latest features
- **Spring Boot 3.2.4** - Enterprise-grade application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction layer
- **MySQL 8.0** - Relational database
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Gradle** - Build automation tool
- **Docker & Docker Compose** - Containerization and orchestration
- **Lombok** - Reduces boilerplate code
- **Spring Filter** - Advanced filtering and querying capabilities

### Frontend Stack
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

## Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication with access and refresh tokens
- Role-based access control (RBAC)
- Permission-based authorization
- Secure password hashing with BCrypt
- Token refresh mechanism
- Logout functionality

## Prerequisites

- **Java 21** or higher
- **Docker** and **Docker Compose** (for containerized setup)
- **MySQL 8.0** (if running without Docker)
- **Gradle** (or use Gradle Wrapper)

## 🚀 Getting Started

### Option 1: Run with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BackEnd
   ```

2. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```
   This will start:
   - MySQL database on port `3307`
   - Spring Boot application on port `8080`

3. **Access the application**
   - API Base URL: `http://localhost:8080`
   - Health Check: `http://localhost:8080/actuator/health`

4. **Stop services**
   ```bash
   docker-compose down
   ```

### Option 2: Run Locally (Without Docker)

1. **Start MySQL database**
   - Install MySQL 8.0
   - Create database: `jobhunter`
   - Update `application.properties` with your database credentials

2. **Update database configuration**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/jobhunter
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

3. **Build the project**
   ```bash
   ./gradlew build
   ```

4. **Run the application**
   ```bash
   ./gradlew bootRun
   ```
   Or use your IDE to run `JobhunterApplication.java`

5. **Access the application**
   - API Base URL: `http://localhost:8080`

## Security

- JWT-based authentication
- Role-based access control
- Permission-based authorization
- Password encryption with BCrypt
- CORS configuration
- Secure cookie handling for refresh tokens
- API endpoint protection

### Environment Variables
For Docker deployment, you can override:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `PORT` (for cloud platforms like Render)

