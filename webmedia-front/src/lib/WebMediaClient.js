// src/lib/WebMediaClient.js

const TransactionTimeout = 30 * 1000;
const DefaultMessageCallback = (container) => {

}

export class WebMediaClient {
    constructor(messageCallback = DefaultMessageCallback) {
        this._nextMessageId = 0;
        this._transactionMap = {};

        this._messageCallback = messageCallback;

        this.roomId = null;
        this.connected = false;
        this.client = null;
    }

    connect = (websocketUrl, roomId) => {
        return new Promise((resolve, reject) => {
            this._addTransaction('connect', resolve, reject);
            
            this.roomId = roomId;
            this.client = new WebSocket(websocketUrl);
            this.client.onopen = this._onOpen;
            this.client.onclose = this._onClose;
            this.client.onerror = this._onError;
            this.client.onmessage = this._onMessage;

        })

        
    }

    sendMessage = (message, type, isTransaction) => {
        return new Promise((resolve, reject) => {
            if(this.connected){
                const messageId = String(this._nextMessageId++);
                const request = {
                    roomId: this.roomId,
                    from: 'client',
                    to: 'webmedia-ws',
                    type: type,
                    messageId: messageId,
                    message: message,
                };
                
                if(isTransaction) {
                    this._addTransaction(messageId, resolve, reject);
                }
                this.client.send(JSON.stringify(request));
                if(!isTransaction){
                    resolve();
                }
            } else {
                reject(new Error("접속 중이 아닙니다"));
            }
        });
    }

    close = () => {
        this.connected = false;
        if(this.client){
            this.client.close();
            this.client = null;
        }
    }

    // resolve를 할 수 있는 영역
    _onOpen = (event) => {
        const transaction = this._getTransaction('connect');
        if(transaction) {
            this.connected = true;
            transaction.resolve();
        }
    }

    _onClose = (event) => {
        console.log("WebSocket onClose", event);
    }

    _onError = (event) => {
        console.log("WebSocket onError", event);
    }

    _onMessage = (event) => {
        if(event.data) {
            const container = JSON.parse(event.data);
            const transaction = this._getTransaction(container.messageId);
            if(transaction) {
                transaction.resolve(container);
            } else {
                this._messageCallback(container);
            }
        }
    }

    _addTransaction = (key, resolve, reject) => {
        this._transactionMap[key] = {resolve, reject};

        setTimeout(() => {
            const transaction = this._transactionMap[key];
            if(transaction) {
                delete this._transactionMap[key];

                transaction.reject(new Error("Transaction 시간 초과"));
            }
        }, TransactionTimeout);
    }

    _getTransaction = (key) => {
        const transaction = this._transactionMap[key];

        if(transaction) {
            delete this._transactionMap[key];
        }

        return transaction;
    }
}