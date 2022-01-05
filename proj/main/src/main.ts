import MainApp from "./MainApp";
import { app } from "electron"
const mainApp = new MainApp();
mainApp.start(app);