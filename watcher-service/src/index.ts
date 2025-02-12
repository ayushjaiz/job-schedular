import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectMongoDB } from "./config/mongo";
import { initializeWorker } from "./services/email-queue/worker";
import { startAgenda } from "./services/agenda/agenda-schedular";
const port = process.env.APP_PORT || 3000

app.listen(port, async () => {
    await connectMongoDB();
    await initializeWorker();
    await startAgenda();
   
    console.log('App running on port ' + port);
})
