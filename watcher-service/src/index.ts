import dotenv from "dotenv";
dotenv.config();

import { connectMongoDB } from "./config/mongo";
import { initializeWorker } from "./services/email-queue/worker";

import cron from "node-cron";
import { pollPendingJobs } from "./services/polling/poll-pending-jobs";

cron.schedule("*/5 * * * * *", pollPendingJobs, { scheduled: true });

connectMongoDB();
initializeWorker();


// const port = process.env.APP_PORT || 3000

// app.listen(port, async () => {
//     await 
//     await 

//     // Schedule weather updates


//     // await startAgenda();

//     console.log('App running on port ' + port);
// })
