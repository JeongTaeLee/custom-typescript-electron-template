export default abstract class BaseSetting {
    public abstract toJsonObject(): { [key: string]: any };
    public abstract loadFromJson(jsonObject: any): void;
    public reset(): void { }
}