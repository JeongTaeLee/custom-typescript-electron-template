import BaseSetting from "./BaseSetting";

export default class WindowSetting extends BaseSetting {
    public readonly DEFAULT_WIDTH = 800;
    public readonly DEFAULT_HEIGHT = 600;

    // TODO : 기본 창 위치 설정 고민.
    public readonly DEFAULT_POS_X = 100;
    public readonly DEFAULT_POS_Y = 100;

    public readonly JSON_WIDTH_KEY = "width";
    public readonly JSON_HEIGHT_KEY = "height";

    public readonly JSON_POS_X_KEY = "posX";
    public readonly JSON_POS_Y_KEY = "posY";

    private _width: number = this.DEFAULT_WIDTH;
    public get width(): number {
        return this._width;
    }

    private _height: number = this.DEFAULT_HEIGHT;
    public get height(): number {
        return this._height;
    }

    private _posX: number = this.DEFAULT_POS_X;
    public get posX(): number {
        return this._posX;
    }

    private _posY: number = this.DEFAULT_POS_Y;
    public get posY(): number {
        return this._posY;
    }
    
    public setSize(w: number, h: number): void {
        if (0 >= w) {
            throw new Error(`Invalid width - (${w})`);
        }

        if (0 >= h) {
            throw new Error(`Invalid width - (${h})`);
        }

        this._width = w;
        this._height = h;
    }

    public setPos(x: number, y: number): void {
        this._posX = x;
        this._posY = y;
    }

    public toJsonObject(): any {
        const jsonObject: { [key: string]: any } = {}
        jsonObject[this.JSON_WIDTH_KEY] = this._width;
        jsonObject[this.JSON_HEIGHT_KEY] = this._height;
        jsonObject[this.JSON_POS_X_KEY] = this._posX;
        jsonObject[this.JSON_POS_Y_KEY] = this._posY;
        
        return jsonObject;
    }

    public loadFromJson(jsonObject: any): void {
        // NOTE : 사이즈가 없거나 잘못된 값이면 기본 사이즈
        // (0 < width)
        const parsedWidth = Number.parseInt(jsonObject[this.JSON_WIDTH_KEY]);
        this._width = parsedWidth ? parsedWidth : this.DEFAULT_WIDTH;
        
        const parsedHeight = Number.parseInt(jsonObject[this.JSON_HEIGHT_KEY]);
        this._height = parsedHeight ? parsedHeight : this.DEFAULT_HEIGHT;
    
        // TODO : 창 위치는 모든 값 허용 추후 제한 고민.
        const parsedPosX = Number.parseInt(jsonObject[this.JSON_POS_X_KEY]);
        this._posX = parsedPosX ? parsedPosX : this.DEFAULT_POS_X;

        const parsedPosY = Number.parseInt(jsonObject[this.JSON_POS_Y_KEY]);
        this._posY = parsedPosY ? parsedPosY : this.DEFAULT_POS_Y;
    }
}