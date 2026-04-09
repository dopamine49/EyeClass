# Setup Guide

## Prerequisites

- **Java**: JDK 21 (Latest LTS)
- **Node.js**: v18+
- **Maven**: 3.9.0+
- **MySQL**: 8.0+
- **Git**: Latest version

---

## Backend Setup

### 1. Install Java 21

#### macOS (Homebrew)
```bash
brew install openjdk@21
# Add to shell profile (~/.zshrc or ~/.bash_profile)
export PATH="/usr/local/opt/openjdk@21/bin:$PATH"
```

#### Windows (Chocolatey)
```bash
choco install openjdk21
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install openjdk-21-jdk
```

### 2. Verify Java Installation
```bash
java -version
# Expected: openjdk version "21" LTS
```

### 3. Setup MySQL Database

#### macOS
```bash
brew install mysql@8.0
brew services start mysql@8.0
mysql -u root
```

#### Create Database
```sql
CREATE DATABASE eyecare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eyecare_db;
```

### 4. Configure Backend

Edit `backend/src/main/resources/application.properties`:
```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/eyecare_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.root=INFO
logging.level.com.eyecare=DEBUG

# Firebase (if using)
firebase.config.path=path/to/firebase-config.json
```

### 5. Build and Run Backend

```bash
cd backend

# Build
mvn clean package

# Run
mvn spring-boot:run

# Or run JAR directly
java -jar target/eyecare-glass-backend-1.0.0.jar
```

Backend should be running at: `http://localhost:8080`

---

## Frontend Setup

### 1. Install Node.js

#### macOS
```bash
brew install node@18
node -v  # v18.x.x
```

#### Windows/Linux
Download from: https://nodejs.org/

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Create Environment File

Create `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Eyecare Glass Website
```

### 4. Run Development Server

```bash
cd frontend
npm run dev
```

Frontend should be running at: `http://localhost:5173`

### 5. Build for Production

```bash
cd frontend
npm run build

# Preview build
npm run preview
```

---

## Database Setup

### 1. Start MySQL Service

```bash
# macOS
brew services start mysql@8.0

# Linux
sudo systemctl start mysql

# Windows
net start MySQL80  # (as Administrator)
```

### 2. Create Database and User

```sql
CREATE DATABASE eyecare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'eyecare_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON eyecare_db.* TO 'eyecare_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Verify Connection

```bash
mysql -u eyecare_user -p eyecare_db

# Or from Java:
# Spring Boot will auto-test connection and create tables
```

---

## Docker Setup (Optional)

### Backend Docker Build

```bash
cd backend

# Build Docker image
docker build -t eyecare-backend:1.0.0 .

# Run container
docker run -d \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/eyecare_db \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=password \
  --name eyecare-backend \
  eyecare-backend:1.0.0
```

### Frontend Docker Build

```bash
cd frontend

# Build Docker image
docker build -t eyecare-frontend:1.0.0 .

# Run container
docker run -d \
  -p 3000:80 \
  -e VITE_API_BASE_URL=http://localhost:8080/api \
  --name eyecare-frontend \
  eyecare-frontend:1.0.0
```

---

## IDE Setup

### IntelliJ IDEA

1. Open project: File > Open > Select `backend/pom.xml`
2. Maven will auto-download dependencies
3. Configure SDK: File > Project Structure > Project > SDK > JDK 21
4. Run: Run > Run 'EyecareApplication'

### VS Code

1. Install extensions:
   - Extension Pack for Java
   - Maven for Java
   - Thunder Client (or REST Client)

2. Open workspace: `File > Open Folder` > Select project root

3. Build: `Ctrl+Shift+B` (Trigger Build)

### Visual Studio Code Frontend

1. Install extensions:
   - ES7+ React/Redux/React-Native snippets
   - Vite
   - Tailwind CSS IntelliSense

2. Open `frontend` folder

3. Run: `npm run dev`

---

## Troubleshooting

### MySQL Connection Error
```
java.sql.SQLException: Access denied for user 'root'@'localhost'

# Solution:
1. Verify MySQL is running: brew services list
2. Check credentials in application.properties
3. Reset MySQL password if needed
```

### Port Already in Use
```
Address already in use: bind
:8080

# Solution:
# macOS/Linux
lsof -i :8080
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Frontend API Connection Error
```
Failed to fetch from http://localhost:8080/api

# Solution:
1. Verify backend is running
2. Check .env file VITE_API_BASE_URL
3. Check CORS configuration in backend
```

### Java Version Mismatch
```
Unsupported class version (version 65.0)

# Solution:
1. Verify JAVA_HOME: echo $JAVA_HOME
2. Use correct Java 21: update-alternatives --config java (Linux)
3. Rebuild: mvn clean package
```

---

## First Run Checklist

- [ ] JDK 21 installed and set in PATH
- [ ] MySQL running and database created
- [ ] Backend dependencies resolved: `mvn clean install`
- [ ] Backend running on port 8080
- [ ] Frontend dependencies installed: `npm install`
- [ ] Frontend environment variables configured
- [ ] Frontend running on port 5173
- [ ] Backend API accessible at `http://localhost:8080/api`
- [ ] CORS properly configured
- [ ] Database tables auto-created

---

## Production Deployment

See: [ARCHITECTURE.md](../ARCHITECTURE.md) for deployment strategy

For CI/CD setup, refer to: [IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md)
