import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
class Element extends HTMLElement {
  constructor () {
    super()
    this._report = false
  }

  connectedCallback () {
    this.attachShadow({ mode: 'open' })
    this.render()
  }

  report (value) {
    this._report = value
    this.render()
  }

  render () {
    if (this.shadowRoot) {
      const props = {
        report: this._report
      }
      for (let i = 0; i < this.attributes.length; i++) {
        props[this.attributes[i].name] = this.attributes[i].value
      }
      ReactDOM.render(<App {...props} />, this.shadowRoot)
    }
  }

  disconnectedCallback () {
    ReactDOM.unmountComponentAtNode(this.shadowRoot)
  }
}

window.customElements.define('bisualfarma-layout', Element)
