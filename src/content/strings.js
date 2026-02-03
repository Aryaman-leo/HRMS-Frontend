/**
 * Centralized static text for HRMS Lite.
 * All user-facing copy lives here; components import from this file only.
 */

export const appTitle = 'HRMS Lite'

export const nav = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  attendance: 'Attendance',
  departments: 'Departments',
  adminLogs: 'Admin logs',
}

export const adminLogs = {
  title: 'Admin logs',
  loading: 'Loading…',
  empty: 'No admin actions recorded yet.',
  searchPlaceholder: 'Search by action, entity, or details…',
  time: 'Time',
  action: 'Action',
  entity: 'Entity',
  details: 'Details',
}

export const dashboard = {
  title: 'Dashboard',
  loading: 'Loading…',
  overview: 'Overview',
  totalEmployees: 'Total employees',
  totalDepartments: 'Total departments',
  todayPresent: 'Present today',
  todayAbsent: 'Absent today',
  today: 'Today',
  quickLinks: 'Quick links',
  goToEmployees: 'Employees',
  goToDepartments: 'Departments',
  goToAttendance: 'Attendance',
  goToAdminLogs: 'Admin logs',
  attendanceSummary: 'Present days per employee',
  searchPlaceholder: 'Search by name or ID',
  employee: 'Employee',
  presentDays: 'Present days',
  absentDays: 'Absent days',
  noData: 'No data yet.',
}

export const tabs = {
  markAttendance: 'Mark attendance',
  records: 'Records',
  employeeDatabase: 'Employee database',
  departments: 'Departments',
}

export const employees = {
  title: 'Employees',
  add: 'Add employee',
  empty: 'No employees yet.',
  emptyAction: 'Add your first employee',
  usingSampleRecords: 'Showing sample employee list. Connect the backend to see live data.',
  deleteConfirm: 'Delete this employee?',
  deleteSuccess: 'Employee removed.',
  addSuccess: 'Employee added.',
  formTitle: 'Add new employee',
  employeeId: 'Employee ID',
  fullName: 'Full Name',
  email: 'Email Address',
  department: 'Department',
  departmentPlaceholder: 'Select department',
  actions: 'Actions',
  noDepartments: 'Add departments first, then add employees.',
  importCsv: 'Import CSV',
  importCsvHint: 'CSV: employee_id, full_name, email, department_id or department_name',
  bulkResult: (created, failed) => (failed > 0 ? `Created ${created}, skipped ${failed} (duplicates/invalid).` : `Created ${created} employee(s).`),
  searchPlaceholder: 'Search by name or ID',
}

export const departments = {
  title: 'Departments',
  formTitle: 'Add department',
  name: 'Department name',
  namePlaceholder: 'e.g. Engineering, HR',
  empty: 'No departments yet.',
  emptyAction: 'Add your first department',
  deleteConfirm: 'Delete this department? Employees must be reassigned or removed first.',
  deleteSuccess: 'Department removed.',
  addSuccess: 'Department added.',
  actions: 'Actions',
  employees: 'Employees',
  noEmployees: 'No employees in this department.',
  employeeCount: (n) => (n === 1 ? '1 employee' : `${n} employees`),
  expand: 'Expand',
  collapse: 'Collapse',
  importCsv: 'Import CSV',
  importCsvHint: 'CSV with a "name" column (or first column = department name)',
  bulkResult: (created, failed) => (failed > 0 ? `Created ${created}, skipped ${failed} (duplicates).` : `Created ${created} department(s).`),
}

export const attendance = {
  title: 'Attendance',
  mark: 'Mark attendance',
  records: 'Attendance records',
  empty: 'No attendance records.',
  emptyAction: 'Mark attendance above to get started.',
  formTitle: 'Mark attendance',
  formSubtitle: 'Set status for each employee for the selected date, then save.',
  selectEmployee: 'Select employee',
  date: 'Date',
  dateLabel: 'Attendance for date',
  status: 'Status',
  statusPlaceholder: 'Select status',
  statusPresent: 'Present',
  statusAbsent: 'Absent',
  markSuccess: 'Attendance recorded.',
  saveAttendance: 'Save attendance',
  saveAllSuccess: 'Attendance saved for all selected.',
  dateColumn: 'Date',
  employeeColumn: 'Employee',
  departmentColumn: 'Department',
  statusColumn: 'Status',
  noEmployees: 'No employees. Add employees first.',
  usingSampleRecords: 'Showing sample attendance records. Connect the backend to see live data.',
  filterByEmployee: 'View records for',
  allEmployees: 'All employees',
  filterByStatus: 'Status',
  filterStatusAll: 'All',
  filterByDateRange: 'Filter by date range',
  filterByDateFrom: 'From date',
  filterByDateTo: 'To date',
  filterDatePlaceholder: 'All dates',
  dateFromAfterTo: 'From date must be before or equal to To date.',
  dateFuture: 'Future dates cannot be selected.',
  clearFilters: 'Clear filters',
}

export const common = {
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  add: 'Add',
  error: 'Something went wrong. Please try again.',
  loading: 'Loading…',
  retry: 'Retry',
  search: 'Search',
  searchPlaceholder: 'Search…',
  noMatches: 'No matches',
  clearFilter: 'Clear filter',
  paginationPrev: 'Previous',
  paginationNext: 'Next',
  paginationPageOf: (current, total) => `Page ${current} of ${total}`,
  paginationShowing: (from, to, total) => `Showing ${from}–${to} of ${total}`,
  paginationRowsPerPage: 'Rows per page',
}

export const datePicker = {
  clear: 'Clear',
  today: 'Today',
  placeholder: 'Select date',
}

export const validation = {
  required: 'This field is required.',
  emailInvalid: 'Please enter a valid email address.',
  emailExists: 'This email is already in use.',
  selectEmployee: 'Please select an employee.',
  selectDate: 'Please select a date.',
  selectStatus: 'Please select a status.',
  dateFuture: 'Future dates cannot be selected.',
  dateFromBeforeTo: 'From date must be before or equal to To date.',
}
