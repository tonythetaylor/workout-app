"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Import the CORS middleware
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const metricsRoutes_1 = __importDefault(require("./routes/metricsRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const goalRoutes_1 = __importDefault(require("./routes/goalRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(errorMiddleware_1.errorHandler);
// Enable CORS
app.use((0, cors_1.default)());
// Body parser middleware
app.use(body_parser_1.default.json());
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/metrics', metricsRoutes_1.default);
app.use('/api/settings', settingsRoutes_1.default);
app.use('/api/goals', goalRoutes_1.default);
const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
