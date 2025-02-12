import Agenda from "agenda";
import mongoose from "../../config/mongo";
import { pollPendingJobs } from "./poll-pending-jobs";

const mongoConnectionString = process.env.MONGO_URI || '';

const agenda = new Agenda({ db: { address: mongoConnectionString, collection: 'agenda-tasks' } });

// Define the polling job
agenda.define("poll jobs", async (job, done) => {
    try {
        console.log("Polling pending jobs...");
        await pollPendingJobs();
        console.log("Polling complete.");
        done();
    } catch (error) {
        console.error("Error in poll jobs:", error);
        done();
    }
});

// Function to start Agenda and schedule the polling job
export const startAgenda = async (): Promise<void> => {
    await mongoose.connection.asPromise(); // Ensure MongoDB is connected
    await agenda.start();
    await agenda.every("20 seconds", "poll jobs");
    console.log("🚀 Agenda scheduler started. Polling jobs every minute.");
};

// Graceful shutdown handling
process.on("SIGINT", async () => {
    console.log("🛑 Stopping Agenda...");
    await agenda.stop();
    console.log("✅ Agenda stopped.");
    process.exit(0);
});

export default agenda;
