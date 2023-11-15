import mysql from "mysql2";
import fs from "fs";

const pool = mysql
  .createPool({
    host: "vpgesgpowerappdb.mysql.database.azure.com",
    user: "esg",
    password: "Vpg123!@",
    database: "towngas-poc-testing",
    port: 3306,
    ssl: {
      ca: fs.readFileSync("DigiCertGlobalRootCA.crt.pem"),
    },
  })
  .promise();

export async function getAllusers() {
  const [rows] = await pool.query("select * from users");
  return rows;
}

export async function getUser(id) {
  const [rows] = await pool.query(
    `
  SELECT * 
  FROM users
  WHERE id = ${id}
  `
  );
  return rows[0];
}

export async function updateUsersTokenUsage(token, id) {
  const [result] = await pool.query(
    `
    Update users 
    SET total_token_usage = ${token}
    WHERE id = ${id}
    `
  );
  return getUser(id);
}

export async function getAllUserchats(userid) {
  const [rows] = await pool.query(
    `select * from chats where user_id = ${userid} AND deleted = false`
  );
  return rows;
}

export async function getChat(id) {
  const [rows] = await pool.query(
    `
  SELECT * 
  FROM chats
  WHERE id = ${id}
  `
  );
  return rows[0];
}

export async function createChat(name, prompt, userid) {
  const [result] = await pool.query(
    `
  INSERT INTO chats (name, prompt, user_id)
  VALUES (?, ?, ?)
  `,
    [name, prompt, userid]
  );
  const result_id = result.insertId;
  return getChat(result_id);
}

export async function deleteChat(chatid) {
  await pool.query(
    `
    Update chats 
    SET deleted = true
    WHERE id = ${chatid}
    `,
    [chatid]
  );
}

export async function getChatDetail(id) {
  const [rows] = await pool.query(`
  SELECT * 
  FROM chat_details
  WHERE chat_id = ${id}
  `);
  return rows;
}

export async function createChatDetail(
  chatid,
  question,
  answer,
  thoughts,
  tokenusage
) {
  await pool.query(
    `
  INSERT INTO chat_details (chat_id, question, answer, thoughts, token_usage)
  VALUES (?, ?, ?, ?, ?)
  `,
    [chatid, question, answer, thoughts, tokenusage]
  );
}

export async function createChatDetailDatasource(chatdetailsid, datasource) {
  const [result] = await pool.query(
    `
  INSERT INTO chat_detail_datasources (chat_details_id, datasource)
  VALUES (?, ?)
  `,
    [chatdetailsid, datasource]
  );
}
