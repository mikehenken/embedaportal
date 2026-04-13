import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class PortalWidget extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('div')
    mountPoint.style.width = '100%'
    mountPoint.style.height = '100%'
    this.appendChild(mountPoint)

    let resorts = undefined
    try {
      const resortsAttr = this.getAttribute('resorts')
      if (resortsAttr) {
        resorts = JSON.parse(resortsAttr)
      }
    } catch (e) {
      console.error('PortalWidget: Failed to parse resorts attribute. Must be valid JSON.', e)
    }

    const bgColor = this.getAttribute('bg-color') || 'transparent'
    const fontColor = this.getAttribute('font-color') || '#1a1a1a'

    const root = createRoot(mountPoint)
    root.render(
      <StrictMode>
        <App resorts={resorts} bgColor={bgColor} fontColor={fontColor} />
      </StrictMode>
    )
  }
}

customElements.define('portal-widget', PortalWidget)
