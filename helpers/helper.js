const Table = require('cli-table3');
const ExcelJS = require("exceljs");


function generateReport(booking_table, user_table, date, time) {
  let content = `Report Generated on: ${time} ${date}\n\n`;

  // Booking Table
  const bookingTable = new Table({
    head: ['User ID', 'Role', 'Booked Date', 'Slot Time', 'No. of People', 'Gender'],
    colWidths: [10, 15, 15, 15, 15, 10], 
    style: { head: [], border: [] },
  });

  booking_table.forEach((book) => {
    bookingTable.push([
      book.user_id,
      book.role,
      book.booking_date,
      book.slot_time,
      book.num_people,
      book.gender,
    ]);
  });

  content += `Booking Details:\n${bookingTable.toString()}\n\n`;

  // User Table
  const userTable = new Table({
    head: ['Email', 'Name'],
    colWidths: [30, 20],
    style: { head: [], border: [] },
  });

  user_table.forEach((user) => {
    userTable.push([user.email, user.name]);
  });

  content += `User Details:\n${userTable.toString()}\n`;

  return content;
}

async function generateExcelReport(booking_table, user_table, filePath) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report");

  // Add Header
  sheet.addRow(["Report Generated on", new Date().toLocaleString()]);
  sheet.addRow([]);

  // Add Booking Table
  sheet.addRow(["Booking Details"]);
  sheet.addRow([
    "User ID",
    "Role",
    "Booked Date",
    "Slot Time",
    "No. of People",
    "Gender",
  ]);
  booking_table.forEach((book) => {
    sheet.addRow([
      book.user_id,
      book.role,
      book.booking_date,
      book.slot_time,
      book.num_people,
      book.gender,
    ]);
  });

  sheet.addRow([]);

  // Add User Table
  sheet.addRow(["User Details"]);
  sheet.addRow(["Email", "Name"]);
  user_table.forEach((user) => {
    sheet.addRow([user.email, user.name]);
  });

  await workbook.xlsx.writeFile(filePath);
}

module.exports = {
  generateReport,
  generateExcelReport
};
