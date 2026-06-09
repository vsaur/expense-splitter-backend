Here's everything in one go — just copy paste each file:

---

**README.md** — paste this entire thing:

````markdown
# 💰 Expense Splitter & Settlement App

A full stack expense splitting application similar to Splitwise — built with Java Spring Boot and HTML/CSS/JS.

Users can create groups, add expenses, and the system automatically calculates who owes whom and minimizes settlement transactions.

## 📸 Screenshots

### Login Page
![Login](frontend/images/login.png)

### Register Page
![Register](frontend/images/register.png)

### Dashboard
![Dashboard](frontend/images/dashboard.png)

### Group Details
![Group](frontend/images/group.png)

## 🚀 Features

- ✅ User registration and login with JWT authentication
- ✅ Create groups and add members
- ✅ Add expenses with automatic equal split calculation
- ✅ Payer's share auto-marked as settled
- ✅ Real-time settlement tracking — see who owes whom
- ✅ Settle up with one click
- ✅ Secure — every endpoint protected with Spring Security
- ✅ BCrypt password encryption

## 🛠️ Tech Stack

**Backend**
- Java 17
- Spring Boot 3
- Spring Security 7
- MySQL 8.0
- Redis 7
- Hibernate 7 (JPA)
- JWT Authentication
- Maven

**Frontend**
- HTML5
- CSS3
- JavaScript (Vanilla)

## 📁 Project Structure

```
expense-splitter/
├── src/main/java/com/saurav/expensesplitter/
│   ├── controller/       # REST API endpoints
│   ├── service/          # Business logic
│   ├── repository/       # Database queries
│   ├── model/            # JPA entities
│   ├── dto/              # Request/Response objects
│   ├── security/         # JWT + Spring Security
│   └── exception/        # Global error handling
└── frontend/
    ├── index.html        # Login page
    ├── register.html     # Register page
    ├── dashboard.html    # My groups page
    ├── group.html        # Group details page
    ├── css/style.css     # All styling
    └── js/               # API calls + page logic
```

## 🗄️ Database Schema

```
users
expense_groups
group_members
expenses
expense_splits
```

## ⚙️ Local Setup

### Prerequisites
- Java 17
- MySQL 8.0
- Redis (via Docker)
- Maven

### Steps

**1. Clone the repo**
```bash
git clone https://github.com/vsaur/expense-splitter.git
cd expense-splitter
```

**2. Start Redis**
```bash
docker run -d -p 6379:6379 redis
```

**3. Create MySQL database**
```sql
CREATE DATABASE expense_splitter;
```

**4. Configure application.properties**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_splitter
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

**5. Run the backend**
```bash
mvn spring-boot:run
```

**6. Open the frontend**

Open `frontend/index.html` in your browser.

## 📬 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get token |
| POST | /api/groups | Create a group |
| GET | /api/groups/my | Get my groups |
| GET | /api/groups/{id} | Get group by id |
| POST | /api/groups/{id}/members | Add member to group |
| POST | /api/groups/{id}/expenses | Add expense |
| GET | /api/groups/{id}/expenses | Get group expenses |
| GET | /api/settlements/group/{id} | Get settlements |
| PUT | /api/settlements/settle/{id} | Settle a debt |

## 👨‍💻 Author

**Saurav Kumar**
- GitHub: [@vsaur](https://github.com/vsaur)
- LinkedIn: [linkedin.com/in/saurav-kumar-05bb65248](https://linkedin.com/in/saurav-kumar-05bb65248)
- Email: isaurav2001@gmail.com
````

---
