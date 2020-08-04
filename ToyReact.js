class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }

    setAttribute(name, value) {
        if(name.match(/^on([\s\S]+)$/)) {
            let eventName = RegExp.$1.replace(/^[\s\S]/, (s) => s.toLowerCase())
            this.root.addEventListener(eventName, value)
            // console.log(RegExp.$1)
        }
        if(name === "className") {
            this.root.setAttribute('class', value)
        }
        this.root.setAttribute(name, value)
    }

    appendChild(vchild) {
        let range = document.createRange()
        if(this.root.children.length) {
            range.setStartAfter(this.root.lastChild)
            range.setEndAfter(this.root.lastChild)
        } else {
            range.setStart(this.root, 0)
            range.setEnd(this.root, 0)
        }
        vchild.mountTo(range)
    }

    mountTo(range) {
        range.deleteContents()
        range.insertNode(this.root)
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }

    mountTo(range) {
        range.deleteContents()
        range.insertNode(this.root)
        // parent.appendChild(this.root)
    }
}

export class Component {
    constructor() {
        this.children = []
        this.props = Object.create(null)
        this.lifeCycle = void 0
    }
    setAttribute(name, value) {
        this.props[name] = value
        this[name] = value
    }
    mountTo(range) {
        if(this.componentWillMount && this.lifeCycle === void 0) {
            this.componentWillMount()
            this.lifeCycle = "componentWillMount"
        }
        this.range = range
        this.update()
        if(this.componentDidMount && this.lifeCycle === "componentWillMount") {
            this.componentDidMount()
            this.lifeCycle = "componentDidMount"
        }
    }
    update() {
        let placeholder = document.createElement('placeholder')
        let range = document.createRange()
        range.setStart(this.range.endContainer, this.range.endOffset)
        range.setEnd(this.range.endContainer, this.range.endOffset)
        range.insertNode(placeholder)
        if(this.componentWillUnmount && (this.lifeCycle === "componentDidMount" || this.lifeCycle === "componentDidUpdate")) {
            this.componentWillUnmount()
            this.lifeCycle = 'componentWillUnmount'
        }
        this.range.deleteContents()
        let vdom = this.render()
        vdom.mountTo(this.range)

        // placeholder.parentNode.removeChild(placeholder)
    }
    appendChild(vchild) {
        this.children.push(vchild)
    }
    setState(state) {
        let merge = (oldState, newState) => {
            for(let p in newState) {
                if(typeof newState[p] === "object") {
                    if(typeof oldState[p] !== "object") {
                        oldState[p] = {}
                    }
                    merge(oldState[p], newState[p])
                } else {
                    oldState[p] = newState[p]
                }
            }
        }
        if(!this.state && state) {
            this.state = {}
        }
        merge(this.state, state)
        if(this.componentWillUpdate && (this.lifeCycle === "componentDidMount" || this.lifeCycle === "componentDidUpdate")) {
            this.componentWillUpdate()
            this.lifeCycle = "componentWillUpdate"
        }
        this.update()
        if(this.componentDidUpdate && this.lifeCycle === "componentWillUpdate") {
            this.componentDidUpdate()
            this.lifeCycle = "componentDidUpdate"
        }
        // console.log(this.state)
    }
}

export let ToyReact = {
    createElement(type, attributes, ...children) {
        let element
        if(typeof type === "string") {
            element = new ElementWrapper(type)
        } else {
            element = new type
        }
        // let element = document.createElement(type)
        for(let name in attributes) {
            element.setAttribute(name, attributes[name])
        }

        let insertChildren = (children) => {
            for(let child of children) {
                if(Array.isArray(child)) {
                    insertChildren(child)
                } else {
                    if(!(child instanceof Component) &&
                    !(child instanceof ElementWrapper) &&
                    !(child instanceof TextWrapper)) {
                        child = String(child)
                    }
                    if(typeof child === "string"){
                        child = new TextWrapper(child)
                    }
                    element.appendChild(child)
                }
            }
        }
        insertChildren(children)
        return element
    },
    render(vdom, element) {
        let range = document.createRange()
        if(element.children.length) {
            range.setStartAfter(element.lastChild)
            range.setEndAfter(element.lastChild)
        } else {
            range.setStart(element, 0)
            range.setEnd(element, 0)
        }
        
        vdom.mountTo(range)
    }
}