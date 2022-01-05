import path from "path";
import fs from "fs"
import toSingleton from "../common/toSingleton";
import WindowSetting from "./data/WindowSetting";

export default class SettingManager extends toSingleton<SettingManager>() {
    public readonly FILE_EXTENSIONS = "json";
    public readonly FILE_ENCODING = "utf-8";

    public readonly JSON_WINDOW_KEY = "window";

    private _savePath?: string;

    private _window : WindowSetting = new WindowSetting();
    public get window() : WindowSetting {
        return this._window;
    }

    constructor(){
        super()
    }

    private loadFromJson(path: string) : void {
        var jsonText = fs.readFileSync(path, { 
            encoding: this.FILE_ENCODING
        });

        if (!jsonText) {
            return;
        }

        const root = JSON.parse(jsonText);

        const windowSetting = root[this.JSON_WINDOW_KEY];
        if (windowSetting) {
            this._window.loadFromJson(windowSetting);
        }
    }

    private toJsonString(): string {
        const root: { [key: string]: any } = {}
        root[this.JSON_WINDOW_KEY] = this.window.toJsonObject();

        return JSON.stringify(root);
    }

    public initialize(dirPath: string, fileName: string) {
        this._savePath = path.join(dirPath, `${fileName}.${this.FILE_EXTENSIONS}`);
        if (fs.existsSync(this._savePath)) {
            this.loadFromJson(this._savePath);
        }
    }

    public save() {
        if (!this._savePath) {
            throw Error("Invalid savePath!");
        }

        fs.writeFileSync(this._savePath, this.toJsonString());
    }
}