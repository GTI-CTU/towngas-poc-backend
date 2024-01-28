import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {
  getUser,
  getUserByToken,
  checkRegister,
  createUser,
  getAllusers,
  getChat,
  getUserChats,
  getUserChatID,
  getAllUserchats,
  createChat,
  deleteChat,
  updateUsersTokenUsage,
  createChatDetail,
  clearChatDetails,
  createChatDetailDatasource,
  getChatDetail,
} from "./database.js";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: true, credentials: true }));

app.get("/allusers", async (req, res) => {
  const users = await getAllusers();
  res.send(users);
});

app.post("/user", async (req, res) => {
  const { id } = req.body;
  const user = await getUser(id);
  res.status(201).send(user);
});

app.post("/userbytoken", async (req, res) => {
  const { authtoken } = req.body;
  const user = await getUserByToken(authtoken);
  res.status(201).send(user);
});

app.post("/checkregister", async (req, res) => {
  const { authtoken } = req.body;
  const registered = await checkRegister(authtoken);
  res.status(201).send(registered);
});

app.post("/createuser", async (req, res) => {
  const { name, authtoken } = req.body;
  const user = await createUser(name, authtoken);
  res.status(201).send(user);
});

app.post("/updatetoken", async (req, res) => {
  const { token, userid } = req.body;
  const user = await updateUsersTokenUsage(token, userid);
  res.status(201).send(user);
});

app.post("/userchat", async (req, res) => {
  const { userid } = req.body;
  const chats = await getUserChats(userid);
  res.status(201).send(chats);
});

app.post("/userchatid", async (req, res) => {
  const { userid } = req.body;
  const chats = await getUserChatID(userid);
  res.status(201).send(chats);
});

app.post("/alluserchats", async (req, res) => {
  const { userid } = req.body;
  const chats = await getAllUserchats(userid);
  res.status(201).send(chats);
});

app.post("/userchat", async (req, res) => {
  const { chatid } = req.body;
  const chat = await getChat(chatid);
  res.status(201).send(chat);
});

app.post("/createchat", async (req, res) => {
  const { name, prompt, userid } = req.body;
  const chat = await createChat(name, prompt, userid);
  res.status(201).send(chat);
});

app.post("/deletechat", async (req, res) => {
  const { chatid } = req.body;
  const chat = await deleteChat(chatid);
  res.status(201).send(chat);
});

app.post("/createchatdetail", async (req, res) => {
  const { chatid, question, answer, thought, tokenusage } = req.body;
  const chatdetail = await createChatDetail(
    chatid,
    question,
    answer,
    thought,
    tokenusage
  );
  res.status(201).send(chatdetail);
});

app.post("/clearchatdetail", async (req, res) => {
  const { userid } = req.body;
  const chatdetail = await clearChatDetails(userid);
  res.status(201).send(chatdetail);
});

app.post("/createchatdetaildatasource", async (req, res) => {
  const { chatdetailsid, datasource } = req.body;
  const chatdetaildatasource = await createChatDetailDatasource(
    chatdetailsid,
    datasource
  );
  res.status(201).send(chatdetaildatasource);
});

app.post("/getchatdetail", async (req, res) => {
  const { chatid } = req.body;
  const chatdetails = await getChatDetail(chatid);
  res.send(chatdetails);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
