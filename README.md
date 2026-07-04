# 🚀 Employee Tracker

A modern Employee Tracker built with **Next.js** and **Supabase** to efficiently manage employee records, attendance, salaries, and authentication. The application provides a secure admin dashboard to monitor daily attendance, calculate monthly work records, and manage employee information in real time.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📖 Overview

Employee Tracker is a complete workforce management solution that allows administrators to:

- Manage employee records
- Track employee attendance
- Record daily check-in and check-out times
- Calculate monthly attendance automatically
- Manage employee salaries
- Secure admin authentication
- Store all data in Supabase

---

## ✨ Features

- 🔐 Secure Admin Authentication
- 👨‍💼 Employee Management
- 🆔 Store Aadhaar Number
- 📱 Mobile Number Management
- ⏰ Daily Check-In & Check-Out
- 📅 Attendance History
- 📊 Monthly Attendance Calculation
- 💰 Salary Management
- 🔎 Search Employees
- 📈 Dashboard Analytics
- ⚡ Real-Time Database
- 📱 Fully Responsive UI

---

## 🛠 Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Supabase

### Database
- PostgreSQL (Supabase)

### Authentication
- Supabase Auth

### Deployment
- Vercel

---

## 📂 Project Structure

```
employee-tracker/
│
├── app/
├── components/
├── lib/
│   └── supabase.ts
├── hooks/
├── public/
├── styles/
├── utils/
├── types/
├── .env.local
└── README.md
```

---

## 📸 Modules

### 🏠 Dashboard
- Total Employees
- Today's Attendance
- Present Employees
- Absent Employees
- Monthly Statistics

### 👨 Employee Management
- Add Employee
- Update Employee
- Delete Employee
- Employee Details

### ⏰ Attendance
- Check In
- Check Out
- Attendance Records
- Monthly Reports

### 💰 Salary
- Employee Salary
- Monthly Salary Overview
- Salary Records

### 🔐 Authentication
- Secure Login
- Protected Dashboard
- Session Management

---

## ⚙️ Environment Variables

Create a `.env.local` file.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/employee-tracker.git
```

Navigate to the project

```bash
cd employee-tracker
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Visit

```
http://localhost:3000
```

---

## 📊 Database

The application stores:

- Employee Details
- Attendance Records
- Salary Information
- Admin Authentication
- Monthly Attendance

---

## 🔒 Security

- Supabase Authentication
- Protected Admin Routes
- Secure Environment Variables
- Row Level Security (RLS)
- PostgreSQL Database

---

## 🎯 Future Enhancements

- 📄 PDF Salary Slips
- 📤 Excel Export
- 📈 Attendance Charts
- 📅 Leave Management
- 🔔 Notifications
- 📧 Email Reports
- 🌙 Dark Mode
- 📱 PWA Support
- 👥 Multiple Admin Roles
- 📍 GPS Attendance
- 📸 Face Recognition Attendance

---

## 🌐 Deployment

Deploy easily using **Vercel**.

```bash
npm run build
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Ayush Kumar**

- 🌐 Portfolio: https://ayushin.vercel.app
- 💼 GitHub: https://github.com/codewithayush-04

---

⭐ If you found this project useful, don't forget to **Star** the repository!
