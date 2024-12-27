const mysql = require("mysql2/promise");
require("dotenv").config();
let isBookCreated = false;
let isUserCreated = false;

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
//   await connection.query(`DROP TABLE IF EXISTS booking;`);
  try{
  await connection.query(`
        CREATE TABLE IF NOT EXISTS booking (
            id INT AUTO_INCREMENT PRIMARY KEY,
            booking_date DATE NOT NULL,
            slot_time VARCHAR(30) NOT NULL,
            num_people INT NOT NULL,
            user_id VARCHAR(200)
            
        );
    `);
    console.log("Booking table created successfully.");
    isBookCreated = true; 
  }catch(e){
    console.error("Error creating booking table:", e);
  }finally{
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
    //   await connection.query(`DROP TABLE IF EXISTS booking;`);
      try{
      await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                
                email VARCHAR(200) NOT NULL PRIMARY KEY,
                name VARCHAR(200) NOT NULL

            );
        `);
        console.log("users table created successfully.");
        isUserCreated = true; 
      }catch(e){
        console.error("Error creating users table:", e);
      }finally{
        connection.release();
      }
}


async function initializeDatabase() {
    await createDatabaseIfNotExist();
    await createBookingTableIfNotExists();
    await createUserTableIfNotExists();
}



initializeDatabase();


async function getSwimmingPool(email) {
  const [rows] = await pool.query(`SELECT * FROM booking WHERE user_id = ?`,[email]);
  return rows;
}
async function CreateBookslot(bookingDate, slotTime, numPeople,email) {
  const result = await pool.query(
    `
            INSERT INTO booking (booking_date, slot_time, num_people,user_id)
            VALUES (?,?,?,?)
        `,
    [bookingDate, slotTime, numPeople,email]
  );

  return result;
}
async function saveUsersFromFirebase(email,name) {
    const [existuser] =  await pool.query('SELECT * FROM users WHERE email = ?',[email]);

    if(existuser.length>0){
        console.log('user exist in the table no need to add him again');

    }else{
        const result = await pool.query(`
                INSERT INTO users (email,name)
                VALUES (?,?)
                ON DUPLICATE KEY UPDATE name = VALUES(name);
            `,[email,name]);
            return result;
    }
}

module.exports = {
  getSwimmingPool,
  CreateBookslot,
  saveUsersFromFirebase,
};
