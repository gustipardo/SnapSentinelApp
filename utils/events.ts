type Listener = () => void;

class SimpleEventEmitter {
    private listeners: { [key: string]: Listener[] } = {};

    on(event: string, listener: Listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }

    off(event: string, listener: Listener) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    }

    emit(event: string) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(l => l());
    }
}

const eventEmitter = new SimpleEventEmitter();

export const EVENTS = {
    REFRESH_ALERTS: 'REFRESH_ALERTS',
};

export default eventEmitter;
