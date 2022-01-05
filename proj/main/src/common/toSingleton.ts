export default function toSingleton<T>() {
    class Singleton {
        private static instance?: any;

        public static get(): T {
            return this.instance ? this.instance : (this.instance = new this());
        }
    }

    return Singleton;
}