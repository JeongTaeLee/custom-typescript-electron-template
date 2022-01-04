import { BrowserWindow, dialog } from "electron"
import SettingManager from "./setting/SettingManager";

export default class MainApp {
    private readonly width: number = 800;
    private readonly height: number = 600;

    private _mainWindow?: BrowserWindow;
    private _app?: Electron.App;

    public start(app: Electron.App) {
        this._app = app;

        // 일렉트론을 초기화하고 창을 만들 준비가 되면 호출된다.
        this._app.on("ready", this.createWindow.bind(this));

        this._app.on("activate", this.activate.bind(this));

        // 모든 창이 닫히면 호출된다(mac os 제외) Cmd + Q
        // 일반적으로 mac os는 창을 닫아도 프로그램이 종료되지 않는다 
        this._app.on("window-all-closed", this.close.bind(this));
    }

    private createWindow(this: MainApp): void {
        if (!this._app) {
            dialog.showErrorBox("앱을 시작 할 수 없음", `잘못된 앱 입니다.\n`);
            return;
        }

        try {
            SettingManager.get().initialize(this._app.getPath("userData"), "settings");
            SettingManager.get().save();
        }
        catch (error) {
            dialog.showErrorBox("앱을 시작 할 수 없음"
                , `설정 파일을 불러올 수 없습니다.\n${error}`);

            this._app.quit();
            return;
        }

        // set window size
        const windowSetting = SettingManager.get().window;
        this._mainWindow = new BrowserWindow({
            width: windowSetting.width,
            height: windowSetting.height,

            webPreferences: {
                nodeIntegration: true, // 노드 통합?
            },
        });

        // set window position
        this._mainWindow.setPosition(windowSetting.posX, windowSetting.posY, false);

        // set window event handler
        this._mainWindow.on("resized", this.resizeMainWindow.bind(this));
        this._mainWindow.on("moved", this.movedMainWindow.bind(this));

        this._mainWindow.webContents.openDevTools();
        this._mainWindow.loadFile("./electron-renderer/dist/src/index.html");
    }

    private activate(this: MainApp): void {
        if (BrowserWindow.getAllWindows().length == 0) {
            // mac os는 창을 닫아도 프로그램이 종료되지 않는다.
            // Dock에서 앱 아이콘 클릭 시 창이 없으면 창을 새로 만들어준다.
            this.createWindow();
        }
    }

    private close(this: MainApp): void {
        if (!this._app) {
            dialog.showErrorBox("앱을 시작 할 수 없음", `잘못된 앱 입니다.\n`);
            return;
        }

        // mac os는 창을 닫아도 앱이 종료되지 않는다.
        // 그러므로 창을 닫았을 때 앱이 종료되면 안된다.
        if (process.platform !== "darwin") {
            this._app.quit();
        }
    }

    // TODO : MainWindow 클래스로 빼기.
    private resizeMainWindow(this: MainApp): void {
        try {
            if (this._mainWindow) {
                const windowSize = this._mainWindow.getSize();
                const windowPos = this._mainWindow.getPosition();

                SettingManager.get().window.setSize(windowSize[0], windowSize[1]);
                SettingManager.get().window.setPos(windowPos[0], windowPos[1]);
                SettingManager.get().save();
            }
        }
        catch (error) {
            dialog.showErrorBox("오류", `설정 파일을 저장할 수 없습니다.\n${error}`);
        }
    }

    private movedMainWindow(this: MainApp): void {
        // TODO : 창 나갔을 경우 예외 처리.
        try {
            if (this._mainWindow) {
                const windowPos = this._mainWindow.getPosition();

                SettingManager.get().window.setPos(windowPos[0], windowPos[1]);
                SettingManager.get().save();
            }
        }
        catch (error) {
            dialog.showErrorBox("오류", `설정 파일을 저장할 수 없습니다.\n${error}`);
        }
    }

}