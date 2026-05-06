const express= require('express');
const cors= require("cors")
const cron= require('node-cron');
const serviceRoutes= require("./routes/serviceRoutes");
const middleware= require("./middleware/auth_log");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/evaluation-service/",(req,res)=>{
     serviceRoutes()
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});