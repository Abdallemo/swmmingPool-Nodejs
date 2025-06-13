const mysql = require("mysql2/promise");
require("dotenv").config();
let isBookCreated = false;
let isUserCreated = false;
let isPaymentCreated = false;
let isFeedbackCreated = false;
let isDateCreated = false;
let isAdminCreated = false;
let isReportCreated = false;

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "swimmingpool",
});

async function createDatabaseIfNotExist() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });
  await connection.query(`
           CREATE DATABASE IF NOT EXISTS swimmingpool;
        `);
  await connection.end();
}
async function createBookingTableIfNotExists() {
  if (isBookCreated) {
    console.log("Booking table already created. Skipping...");
    return;
  }
  const connection = await pool.getConnection();
  // TODO this is commented becuase its development related query ..
  // await connection.query(`DROP TABLE IF EXISTS booking;`);
  try {
    await connection.query(`
        CREATE TABLE IF NOT EXISTS booking (
            id INT AUTO_INCREMENT PRIMARY KEY,
            role VARCHAR(30) NOT NULL,
            booking_date DATE NOT NULL,
            slot_time VARCHAR(30) NOT NULL,
            num_people INT NOT NULL,
            gender VARCHAR(10) NOT NULL,
            matric_no VARCHAR(100) NOT NULL,
            user_id VARCHAR(200),
            CONSTRAINT FK_booking_user FOREIGN KEY (user_id) 
            REFERENCES users(email)
            ON DELETE CASCADE
            
        );
    `);
    await connection.query(`
        ALTER TABLE booking
        ADD INDEX (booking_date);
      `);
    console.log("Booking table created successfully.");
    isBookCreated = true;
  } catch (e) {
    console.error("Error creating booking table:", e);
  } finally {
    connection.release();
  }
}

async function createFeebackTableIfNotExists() {
  if (isFeedbackCreated) {
    console.log("Feeback table already created. Skipping...");
    return;
  }
  const connection = await pool.getConnection();
  // TODO this is commented becuase its development related query ..
  // await connection.query(`DROP TABLE IF EXISTS feeback;`);
  try {
    await connection.query(`
        CREATE TABLE IF NOT EXISTS feedback (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            email VARCHAR(200) NOT NULL,
            feedback VARCHAR(200) NOT NULL

            
        );
    `);
    console.log("Feedback table created successfully.");
    isFeedbackCreated = true;
  } catch (e) {
    console.error("Error creating feeback table:", e);
  } finally {
    connection.release();
  }
}
async function createDateIfNotExists() {
  if (isDateCreated) {
    console.log("Dates table already created. Skipping...");
    return;
  }
  const connection = await pool.getConnection();
  // TODO this is commented becuase its development related query ..
  // await connection.query(`DROP TABLE IF EXISTS feeback;`);
  try {
    await connection.query(`
                  CREATE TABLE IF NOT EXISTS sessions  (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(100) NOT NULL,
                    description TEXT,
                    start_time TIME NOT NULL,
                    end_time TIME NOT NULL,
                    days_of_week VARCHAR(20) NOT NULL,
                    color VARCHAR(7), 
                    recurrence_rule VARCHAR(255) 
                  );
    `);
    console.log("Dates table created successfully.");
    isDateCreated = true;
  } catch (e) {
    console.error("Error creating feeback table:", e);
  } finally {
    connection.release();
  }
}

async function createUserTableIfNotExists() {
  if (isUserCreated) {
    console.log("users table already created. Skipping...");
    return;
  }
  const connection = await pool.getConnection();
  // TODO this is commented becuase its development related query ..
  // await connection.query(`DROP TABLE IF EXISTS users;`);
  try {
    await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                uid VARCHAR(240) NOT NULL ,
                email VARCHAR(200) NOT NULL PRIMARY KEY ,
                name VARCHAR(200) NOT NULL

            );
        `);
    console.log("users table created successfully.");
    isUserCreated = true;
  } catch (e) {
    console.error("Error creating users table:", e);
  } finally {
    connection.release();
  }
}
async function createPayemtnTableIfNotExists() {
  if (isPaymentCreated) {
    console.log("payment table already created. Skipping...");
    return;
  }
  const connection = await pool.getConnection();
  // TODO this is commented becuase its development related query ..
  // await connection.query(`DROP TABLE IF EXISTS payment;`);
  try {
    await connection.query(`
            CREATE TABLE IF NOT EXISTS payment (
                id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(200) ,
                card_number VARCHAR(30) NOT NULL,
                total INt NOT NULL,
                date DATE NOT NULL,
                CONSTRAINT FK_payment_user FOREIGN KEY (user_id) 
                REFERENCES users(email)
                ON DELETE CASCADE,
                CONSTRAINT FK_bookdate_user FOREIGN KEY (date) 
                REFERENCES booking(booking_date)
                ON DELETE CASCADE
                 
            );
        `);
    console.log("payment table created successfully.");
    isPaymentCreated = true;
  } catch (e) {
    console.error("Error creating payment table:", e);
  } finally {
    connection.release();
  }
}
async function createAdminTableIfNotExists() {
  if (isAdminCreated) {
    console.log("users table already created. Skipping...");
    return;
  }
  const connection = await pool.getConnection();
  // TODO this is commented becuase its development related query ..
  // await connection.query(`DROP TABLE IF EXISTS payment;`);
  try {
    await connection.query(`
            CREATE TABLE IF NOT EXISTS admin (
                id int auto_increment primary key not null,
                email varchar(200) not null,
                password varchar(200) not null
                );
        `);
    await connection.query(`
          INSERT INTO admin (email, password)
          SELECT * FROM (SELECT 'swm@uthm.edu.my' AS email, '123' AS password) AS tmp
          WHERE NOT EXISTS (
            SELECT 1 FROM admin WHERE email = 'swm@uthm.edu.my'
          ) LIMIT 1;
        `);
    console.log("admin table created successfully.");
    isAdminCreated = true;
  } catch (e) {
    console.error("Error creating admin table:", e);
  } finally {
    connection.release();
  }
}

async function createReportTableIfNotExists() {
  if (isReportCreated) {
    console.log("report table already created. Skipping...");
    return;
  }
  const connection = await pool.getConnection();
  // TODO this is commented becuase its development related query ..
  // await connection.query(`DROP TABLE IF EXISTS booking;`);
  try {
    await connection.query(`
        CREATE TABLE IF NOT EXISTS report (
            report_id INT AUTO_INCREMENT PRIMARY KEY,
            admin_id int ,
            date_generated VARCHAR(40),
            content VARCHAR(200),
            CONSTRAINT FK_report_id FOREIGN KEY (admin_id) 
            REFERENCES admin(id)
        );
    `);
    console.log("report table created successfully.");
    isReportCreated = true;
  } catch (e) {
    console.error("Error creating report table:", e);
  } finally {
    connection.release();
  }
}

async function initializeDatabase() {
  await createDatabaseIfNotExist();
  await createUserTableIfNotExists();
  await createBookingTableIfNotExists();
  await createPayemtnTableIfNotExists();
  await createFeebackTableIfNotExists();
  await createAdminTableIfNotExists();
  await createReportTableIfNotExists();
  await createDateIfNotExists();
}

initializeDatabase();

async function CreateBookslot(
  role,
  bookingDate,
  slotTime,
  numPeople,
  gender,
  email,
  metrciNo
) {
  const result = await pool.query(
    `
            INSERT INTO booking (role,booking_date, slot_time, num_people,gender,user_id,matric_no)
            VALUES (?,?,?,?,?,?,?)
        `,
    [role, bookingDate, slotTime, numPeople, gender, email,metrciNo]
  );

  return result;
}

async function inserPaymentTable(user_id, card_Number, total, date) {
  const result = await pool.query(
    `
              INSERT INTO payment (user_id, card_number ,total, date )
              VALUES(?,?,?,?)
    `,
    [user_id, card_Number, total, date]
  );
  return result;
}
async function inserfeedbackTable(name, email, feeback) {
  const result = await pool.query(
    `
              INSERT INTO feedback (name,email,feedback )
              VALUES(?,?,?)
    `,
    [name, email, feeback]
  );
  return result;
}
async function inserReportTable(admin_id, date_generated, content) {
  const result = await pool.query(
    `
              INSERT INTO report (admin_id,date_generated,content )
              VALUES(?,?,?)
    `,
    [admin_id, date_generated, content]
  );
  return result;
}

async function saveUsersFromFirebase(uid, email, name) {
  const [existuser] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (existuser.length > 0) {
    console.log("user exist in the table no need to add him again");
  } else {
    const result = await pool.query(
      `
                INSERT INTO users (uid,email,name)
                VALUES (?,?,?)
                ON DUPLICATE KEY UPDATE name = VALUES(name);
            `,
      [uid, email, name]
    );
    return result;
  }
}

async function getSwimmingPool(email) {
  const [rows] = await pool.query(`SELECT * FROM booking WHERE user_id = ?`, [
    email,
  ]);
  return rows;
}
async function DisplaySwimmingPool() {
  const [rows] = await pool.query(`SELECT * FROM booking`, []);
  return rows;
}
async function DisplayUsers() {
  const [rows] = await pool.query(`SELECT * FROM users`, []);
  return rows;
}
async function DisplayPayment() {
  const [rows] = await pool.query(`SELECT * FROM payment`, []);
  return rows;
}
async function DisplayAdmins() {
  const [rows] = await pool.query(`SELECT * FROM admin`, []);
  return rows;
}
async function DisplayFeedback() {
  const [rows] = await pool.query(`SELECT * FROM feedback`, []);
  return rows;
}
async function DisplayCurrentAdmin_ID(email) {
  const [rows] = await pool.query(`SELECT * FROM admin where email =? `, [email]);
  return rows[0].id;
}

async function deleteUser(uid) {
  await pool.query(
    `DELETE FROM users WHERE uid = ?;
      `,
    [uid]
  );
}
async function updateAdmin(new_email, new_password, curr_email) {
  try {
    await pool.query(
      'UPDATE admin SET email = ?, password = ? WHERE email = ?',
      [new_email, new_password, curr_email]
    );
  } catch (error) {
    console.error('Error updating admin password:', error);
  }
}


async function deleteUsersBooking(id) {
  await pool.query(
    `DELETE FROM booking WHERE id = ?;
    `,
    [id]
  );
}
async function deleteUsersPayment(user_id) {
  await pool.query(
    `DELETE FROM payment WHERE user_id = ?;
    `,
    [user_id]
  );
}
async function countNumberOfColumn(db, table) {
  const [result] = await pool.query(
    `
    SELECT COUNT(*) AS row_count
    FROM ${db}.${table};
    `
  );

  return result[0].row_count;
}

//this is for devlopment purpose

async function dropDatabase() {
  const connection = await pool.getConnection();
  try {
    const databaseName = 'swimmingpool'; // Replace with your database name
    console.log(`Dropping database: ${databaseName}...`);
    await connection.query(`DROP DATABASE IF EXISTS ${databaseName};`);
    console.log(`Database ${databaseName} dropped successfully.`);
  } catch (error) {
    console.error("Error dropping database:", error);
  } finally {
    connection.release();
  }
}
// dropDatabase(); 
async function DropAllTables() {
  const connection = await pool.getConnection();
  await connection.query(`DROP TABLE IF EXISTS booking;`);
  await connection.query(`DROP TABLE IF EXISTS feedback;`);
  await connection.query(`DROP TABLE IF EXISTS users;`);
  await connection.query(`DROP TABLE IF EXISTS payment;`);
  console.log("deleted all tables");
}

// DropAllTables();

module.exports = {
  getSwimmingPool,
  CreateBookslot,
  saveUsersFromFirebase,
  inserPaymentTable,
  inserfeedbackTable, 
  DisplaySwimmingPool,
  DisplayUsers,
  DisplayPayment,
  deleteUser,
  deleteUsersBooking,
  deleteUsersPayment,
  countNumberOfColumn,
  DisplayAdmins,
  DisplayFeedback,
  updateAdmin,
  inserReportTable,
  DisplayCurrentAdmin_ID,
  createBookingTableIfNotExists,
  createUserTableIfNotExists,
  createPayemtnTableIfNotExists
};
