class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  off(eventName, listener) {
    const listeners = this.events[eventName];
    if (listeners) {
      this.events[eventName] = listeners.filter((l) => l !== listener);
    }
  }

  emit(eventName, data) {
    const listeners = this.events[eventName];
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }
}

const eventEmitter = new EventEmitter();
export default eventEmitter;
