/**
 * Dummy data for HRMS Lite when API is unavailable or returns empty.
 * Matches functional requirements:
 *
 * 1. Employee Management
 *    - Employee ID (unique), Full Name, Email Address, Department
 *    - View list, Add, Delete
 *
 * 2. Attendance Management
 *    - Date, Status (Present / Absent) per employee
 *    - View attendance records for each employee
 */

export const dummyEmployees = [
  { id: '1', employeeId: 'EMP001', fullName: 'Jane Smith', email: 'jane.smith@company.com', department: 'Engineering' },
  { id: '2', employeeId: 'EMP002', fullName: 'John Doe', email: 'john.doe@company.com', department: 'Engineering' },
  { id: '3', employeeId: 'EMP003', fullName: 'Alice Brown', email: 'alice.brown@company.com', department: 'HR' },
  { id: '4', employeeId: 'EMP004', fullName: 'Bob Wilson', email: 'bob.wilson@company.com', department: 'Operations' },
  { id: '5', employeeId: 'EMP005', fullName: 'Carol Davis', email: 'carol.davis@company.com', department: 'Engineering' },
]

export const dummyAttendance = [
  { id: 'a1', date: '2026-02-28', employeeId: 'EMP001', employeeName: 'Jane Smith', departmentName: 'Engineering', status: 'Present' },
  { id: 'a2', date: '2026-02-28', employeeId: 'EMP002', employeeName: 'John Doe', departmentName: 'Engineering', status: 'Present' },
  { id: 'a3', date: '2026-02-28', employeeId: 'EMP003', employeeName: 'Alice Brown', departmentName: 'HR', status: 'Absent' },
  { id: 'a4', date: '2026-02-28', employeeId: 'EMP004', employeeName: 'Bob Wilson', departmentName: 'Operations', status: 'Present' },
  { id: 'a5', date: '2026-02-28', employeeId: 'EMP005', employeeName: 'Carol Davis', departmentName: 'Engineering', status: 'Absent' },
  { id: 'a6', date: '2026-02-27', employeeId: 'EMP001', employeeName: 'Jane Smith', departmentName: 'Engineering', status: 'Present' },
  { id: 'a7', date: '2026-02-27', employeeId: 'EMP002', employeeName: 'John Doe', departmentName: 'Engineering', status: 'Absent' },
  { id: 'a8', date: '2026-02-27', employeeId: 'EMP003', employeeName: 'Alice Brown', departmentName: 'HR', status: 'Present' },
]
