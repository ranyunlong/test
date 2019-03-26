class Modal {
    constructor(options) {
        options = options || {
            title: 'title',
            body: 'body-test',
            cancelText: '取消',
            okText: '确定'
        }
        this._state = true;
        this._showEventLoop = [];
        this._closeEventLoop = [];
        this._okEventLoop = [];
        this._cancelEventLoop = [];
        // 创建元素实例
        const elemet = this.element = document.createElement('div');
        elemet.style.width = '298px';
        elemet.style.boxShadow = '0 0 10px 1px rgba(0, 0, 0, 0.5)';
        // 创建header
        const header = document.createElement('header');
        header.style.background = '#f7f7f7';
        header.style.height = '44px';
        header.style.lineHeight = '44px';
        header.innerText = options.title;

        // 创建body
        const body = document.createElement('div');
        body.style.height = '125px';
        body.style.paddingTop ='10px';
        body.style.position = 'relative';

        // 创建content
        const content = document.createElement('content')
        content.style.margin = '30px auto';
        content.style.width = '230px';
        content.style.height = '32px';
        content.style.lineHeight = '32px';

        

        // 创建按钮组
        const btnGroup = document.createElement('div');
        btnGroup.style.position ='absolute';
        btnGroup.style.right = '30px';
        btnGroup.style.bottom = '30px';
        
        // 创建按钮ok
        const btnOk = this.btnOk = document.createElement('button');
        btnOk.style.padding = '0 20px';
        btnOk.style.height = '31px';
        btnOk.style.lineHeight = '31px';
        btnOk.style.backgroundColor ='#087875';
        btnOk.style.color = '#fff';
        btnOk.innerText = options.okText;

         // 创建按钮ok
         const btnCancel = this.btnCancel = document.createElement('button');
         btnCancel.style.padding = '0 20px';
         btnCancel.style.height = '31px';
         btnCancel.style.lineHeight = '31px';
         btnCancel.style.backgroundColor ='#ddd';
         btnCancel.style.marginLeft = '10px';
         btnCancel.innerText = options.cancelText;
        
         btnOk.addEventListener('click', () => {
            this.close();
            this._okEventLoop.map((callback) => {
                callback({type: 'ok'})
            })
         })

         btnCancel.addEventListener('click', () => {
            this.close();
            this._cancelEventLoop.map((callback) => {
                callback({type: 'cancel'})
            })
         })

        btnGroup.append(btnOk, btnCancel);
        body.append(content, btnGroup);
        this.element.append(header, body);
        document.body.appendChild(this.element);
    }

    /**
     * 添加事件监听
     * @param { String } type 
     * @param { Function } callback 
     */
    on(type, callback) {
        if (typeof callback !== 'function') return;
        switch(type) {
            case 'show':
            this._showEventLoop.push(callback);
            break;
            case 'close':
            this._closeEventLoop.push(callback);
            break;
            case 'ok':
            this._okEventLoop.push(callback);
            break;
            case 'cancel':
            this._cancelEventLoop.push(callback);
        }
    }

    /**
     * 移除事件监听
     * @param { String } type 
     * @param { Function } callback 
     */
    off(type, callback) {
        if (typeof callback !== 'function') return;
        switch(type) {
            case 'show':
            if (this._showEventLoop.length === 0) return;
            this._showEventLoop = this._showEventLoop.filter((cb) => cb !== callback);
            break;
            case 'close':
            if (this._closeEventLoop.length === 0) return;
            this._closeEventLoop = this._closeEventLoop.filter((cb) => cb !== callback);
            break;
            case 'ok':
            if (this._okEventLoop.length === 0) return;
            this._okEventLoop = this._okEventLoop.filter((cb) => cb !== callback);
            case 'cancel':
            if (this._cancelEventLoop.length === 0) return;
            this._cancelEventLoop = this._cancelEventLoop.filter((cb) => cb !== callback);
        }
    }

    /**
     * 显示实例
     */
    show() {
        if (this._state) return;
        this._state = true;
        document.body.append(this.element);
        this._showEventLoop.forEach((callback) => {
            callback({type: 'show'});
        })
    }

    /**
     * 删除实例
     */
    close() {
        if (!this._state) return;
        this._state = false;
        this.element.remove();
        this._closeEventLoop.forEach((callback) => {
            callback({type: 'close'});
        })
    }
}