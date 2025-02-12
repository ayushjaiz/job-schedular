import express from "express";
import authRoutes from "./routes/auth.route"
import usersRoutes from "./routes/users.routes"
import adminRoutes from "./routes/admin.routes"
import cookieParser from 'cookie-parser'

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_, res) => {
    res.send('Health Check')
})

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);

export default app;