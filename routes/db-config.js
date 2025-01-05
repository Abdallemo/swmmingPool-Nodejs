const mysql = require("mysql2/promise");
require("dotenv").config();
let isBookCreated = false;
let isUserCreated = false;
let isPaymentCreated = false
let isFeedbackCreated = false

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
            booking_date VARCHAR(30) NOT NULL,
            slot_time VARCHAR(30) NOT NULL,
            num_people INT NOT NULL,
            gender VARCHAR(10) NOT NULL,
            user_id VARCHAR(200)
            
        );
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
    console.log("users table already created. Skipping...");
    return;
  }
  const connection = await pool.getConnection();
  // TODO this is commented becuase its development related query ..
  // await connection.query(`DROP TABLE IF EXISTS payment;`);
  try {
    await connection.query(`
            CREATE TABLE IF NOT EXISTS payment (
                id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(200) NOT NULL,
                card_number VARCHAR(30) NOT NULL,
                total INt NOT NULL,
                date VARCHAR(200) NOT NULL
                
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

async function initializeDatabase() {
  await createDatabaseIfNotExist();
  await createBookingTableIfNotExists();
  await createUserTableIfNotExists();
  await createPayemtnTableIfNotExists();
  await createFeebackTableIfNotExists();
}

initializeDatabase();

async function getSwimmingPool(email) {
  const [rows] = await pool.query(`SELECT * FROM booking WHERE user_id = ?`, [
    email,
  ]);
  return rows;
}
async function CreateBookslot(role,bookingDate, slotTime, numPeople, gender, email) {
  const result = await pool.query(
    `
            INSERT INTO booking (role,booking_date, slot_time, num_people,gender,user_id)
            VALUES (?,?,?,?,?,?)
        `,
    [role,bookingDate, slotTime, numPeople, gender, email]
  );

  return result;
}

async function inserPaymentTable(user_id, card_Number,total, date) {
  const result = await pool.query(
    `
              INSERT INTO payment (user_id, card_number ,total, date )
              VALUES(?,?,?,?)
    `,[user_id,card_Number ,total,date]
  );
  return result;
}
async function inserfeedbackTable(name, email,feeback) {
  const result = await pool.query(
    `
              INSERT INTO feedback (name,email,feedback )
              VALUES(?,?,?)
    `,[name, email,feeback]
  );
  return result;
}


async function saveUsersFromFirebase(uid,email, name) {
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
      [uid,email, name]
    );
    return result;
  }
}

module.exports = {
  getSwimmingPool,
  CreateBookslot,
  saveUsersFromFirebase,
  inserPaymentTable,
  inserfeedbackTable
};
