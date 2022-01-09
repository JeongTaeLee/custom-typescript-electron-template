import path from "path";
import { BrowserWindow, dialog, Menu, MenuItem, Tray } from "electron"
import SettingManager from "./setting/SettingManager";

export default class MainApp {
    private _mainWindow?: BrowserWindow;
    private _app?: Electron.App;
    private _tray?: Tray;


    public start(app: Electron.App) {
        this._app = app;

        // 일렉트론을 초기화하고 창을 만들 준비가 되면 호출된다.
        this._app.on("ready", this.ready.bind(this));

        this._app.on("activate", this.activate.bind(this));

        // 모든 창이 닫히면 호출된다(mac os 제외) Cmd + Q
        // 일반적으로 mac os는 창을 닫아도 프로그램이 종료되지 않는다 
        this._app.on("window-all-closed", this.close.bind(this));
    }

    private ready(this: MainApp): void {
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

        try {
            if (!this._tray) {
                this._tray = this.createContextMenu();
            }

            this._mainWindow = new BrowserWindow({
                webPreferences: {
                    nodeIntegration: true, // 노드 통합?
                },
            });

            this.setWindowBySetting(this._mainWindow);

            // set window event handler
            this._mainWindow.on("resized", this.resizeMainWindow.bind(this));
            this._mainWindow.on("moved", this.movedMainWindow.bind(this));

            this._mainWindow.webContents.openDevTools();
            this._mainWindow.loadFile(path.join(__dirname, "../../renderer/src/index.html"));

        } catch (error) {
            dialog.showErrorBox("앱을 시작 할 수 없음"
                , `구성 중 문제가 발생했습니다.\n${error}`);

            this._app.quit();
        }
    }

    private activate(this: MainApp): void {
        if (BrowserWindow.getAllWindows().length == 0) {
            // mac os는 창을 닫아도 프로그램이 종료되지 않는다.
            // Dock에서 앱 아이콘 클릭 시 창이 없으면 창을 새로 만들어준다.
            this.ready();
        }
    }

    private close(this: MainApp): void {
        if (!this._app) {
            dialog.showErrorBox("앱을 시작 할 수 없음", `잘못된 앱 입니다.\n`);
            return;
        }

        // mac os는 창을 닫아도 앱이 종료되지 않는다.
        // 그러므로 창을 닫았을 때 앱이 종료되면 안된다.
        // 트레이 처리 때문에 주석처리
        // if (process.platform !== "darwin") {
        //     this._app.quit();
        // }

        this._app.quit();

    }

    private resizeMainWindow(this: MainApp): void {
        if (!this._mainWindow) {
            return;
        }

        const windowSize = this._mainWindow.getSize();
        const windowPos = this._mainWindow.getPosition();

        SettingManager.get().window.setSize(windowSize[0], windowSize[1]);
        SettingManager.get().window.setPos(windowPos[0], windowPos[1]);

        this.saveSettingWithErrorBox();

    }

    private movedMainWindow(this: MainApp): void {
        if (!this._mainWindow) {
            return;
        }

        const windowPos = this._mainWindow.getPosition();

        SettingManager.get().window.setPos(windowPos[0], windowPos[1]);

        this.saveSettingWithErrorBox();
    }

    private saveSettingWithErrorBox(): void {
        try {
            SettingManager.get().save();
        } catch (error) {
            dialog.showErrorBox("오류", `설정 파일을 저장할 수 없습니다.\n${error}`);
        }
    }

    private setWindowBySetting(this: MainApp, targetWindow: BrowserWindow): void {
        const windowSetting = SettingManager.get().window;

        targetWindow.setSize(windowSetting.width, windowSetting.height);
        targetWindow.setPosition(windowSetting.posX, windowSetting.posY);
    }

    private resetWindowSettingAndSave(this: MainApp): void {
        if (!this._mainWindow) {
            dialog.showErrorBox("오류", `열린 창을 찾을 수 없습니다.`);
            return;
        }

        SettingManager.get().window.reset();

        this.setWindowBySetting(this._mainWindow);

        this.saveSettingWithErrorBox();
    }

    private createContextMenu(this: MainApp): Tray {
        const resetWindow = new MenuItem({
            label: "Reset window size & position",
            type: "normal",
            click: () => {
                this.resetWindowSettingAndSave();
            }
        });

        const tray = new Tray(path.join(__dirname, "../../assets/icon-tray16x16.png"));
        tray.setContextMenu(Menu.buildFromTemplate([
            resetWindow,
        ]));

        return tray;
    }
}