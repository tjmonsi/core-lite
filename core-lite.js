import '../location-lite/location-lite.js';
import '../query-lite/query-lite.js';
import '../router-lite/router-lite.js';
import '../router-lite/router-data-lite.js';
import '../template-loader-lite/template-loader-lite.js';
import '../template-viewer-lite/template-viewer-lite.js';
import '../template-viewer-lite/template-container-lite.js';

/**
 * # core-lite
 *
 * `<core-lite>`: Core element helper
 *
 * @extends {HTMLElement}
 * @customElement
*/

class CoreLite extends window.HTMLElement {
  static get is () {
    return 'core-lite';
  }
  
  constructor () {
    super();
    this.__initialized = false;
    this._location = document.createElement('location-lite');
    this._query = document.createElement('query-lite');
    this._viewer = document.createElement('template-viewer-lite');
    this._router = null;
    this._loader = null;
    this._boundPathChanged = this._pathChanged.bind(this);
    this._boundQueryChanged = this._queryChanged.bind(this);
    this._boundHashChanged = this._hashChanged.bind(this);
    this._boundQueryObjectChanged = this._queryObjectChanged.bind(this);
    this._boundRouterParamObjectChanged = this._routerParamObjectChanged.bind(this);
    this._boundCurrentRouteChanged = this._currentRouteChanged.bind(this);
    this._boundTemplateChanged = this._templateChanged.bind(this);
    this.attachShadow({mode: 'open'});
  }
  
  connectedCallback () {
    if (!this.__initialized) {
      this._router = this.querySelector('router-lite');
      this._loader = this.querySelector('template-loader-lite');
      
      if (this._location) {
        this._location.addEventListener('path-change', this._boundPathChanged);
        this._location.addEventListener('query-change', this._boundQueryChanged);
        this._location.addEventListener('hash-change', this._boundHashChanged);  
        this.shadowRoot.appendChild(this._location);
      }
      
      if (this._query) {
        this._query.addEventListener('query-change', this._boundQueryChanged);
        this._query.addEventListener('query-object-change', this._boundQueryObjectChanged);  
        this.shadowRoot.appendChild(this._query);
      }
      
      if (this._router) {
        this._router.addEventListener('router-param-object-change', this._boundRouterParamObjectChanged);
        this._router.addEventListener('current-route-change', this._boundCurrentRouteChanged);  
      }
      
      if (this._loader) {
        this._loader.addEventListener('template-change', this._boundTemplateChanged);  
      }
      
      if (this._viewer) {
        this.shadowRoot.appendChild(this._viewer);  
      }
      
      this.shadowRoot.appendChild(document.createElement('slot'));
    }
    this.__initialized = this._location && this._query && this._router && this._loader && this._viewer && true;
  }
  
  disconnectedCallback () {
    if (this._location) {
      this._location.removeEventListener('path-change', this._boundPathChanged);
      this._location.removeEventListener('query-change', this._boundQueryChanged);
      this._location.removeEventListener('hash-change', this._boundHashChanged);
    }
    if (this._query) {
      this._query.removeEventListener('query-change', this._boundQueryChanged);
      this._query.removeEventListener('query-object-change', this._boundQueryObjectChanged);  
    }
    if (this._router) {
      this._router.removeEventListener('router-param-object-change', this._boundRouterParamObjectChanged);
      this._router.removeEventListener('current-route-change', this._boundCurrentRouteChanged);  
    }
    if (this._loader) {
      this._loader.removeEventListener('template-change', this._boundTemplateChanged);  
    }
  }
  
  _pathChanged (event) {
    if (this.__initialized) {
      const { detail: path } = event;
      this._router.path = path;
      event.preventDefault();
      event.stopPropagation();
      this.path = path;
      this._dispatchEvent('path', this.path);  
    } else {
      console.warn('core-lite is not initialized');
    }
  }
  
  _queryChanged (event) {
    if (this.__initialized) {
      const { detail: query } = event;
      if (this._query.query !== query) this._query.query = query;
      if (this._location.query !== query) this._location.query = query;
      event.preventDefault();
      event.stopPropagation();
      this.query = query;
      this._dispatchEvent('query', this.query);  
    } else {
      console.warn('core-lite is not initialized');
    }
  }
  
  _hashChanged (event) {
    if (this.__initialized) {
      const { detail: hash } = event;
      event.preventDefault();
      event.stopPropagation();
      this.hash = hash;
      this._dispatchEvent('hash', this.hash);
    } else {
      console.warn('core-lite is not initialized');
    }
  }
  
  _queryObjectChanged (event) {
    if (this.__initialized) {
      const { detail: queryObject } = event;
      event.preventDefault();
      event.stopPropagation();
      this.queryObject = queryObject;
      this._dispatchEvent('query-object', this.queryObject);
    } else {
      console.warn('core-lite is not initialized');
    }
  }
  
  _routerParamObjectChanged (event) {
    if (this.__initialized) {
      const { detail: routerParamObject } = event;
      event.preventDefault();
      event.stopPropagation();
      this.routerParamObject = routerParamObject;
      this._dispatchEvent('router-param-object', this.routerParamObject);
    } else {
      console.warn('core-lite is not initialized');
    }
  }
  
  _currentRouteChanged (event) {
    if (this.__initialized) {
      const { detail: currentRoute } = event;
      this._loader.pattern = currentRoute;
      event.preventDefault();
      event.stopPropagation();
      this.currentRoute = currentRoute;
      this._dispatchEvent('current-route', this.currentRoute);
    } else {
      console.warn('core-lite is not initialized'); 
    }
  }
  
  _templateChanged (event) {
    if (this.__initialized) {
      const { detail: template } = event;
      this._viewer.template = template;
      event.preventDefault();
      event.stopPropagation();
      this.template = template;
      this._dispatchEvent('template', this.template);
    } else {
      console.warn('core-lite is not initialized');  
    }
  }
  
  _dispatchEvent (name, detail) {
    this.dispatchEvent(new window.CustomEvent(`${name}-change`, { detail }));
  }
}

if (!window.customElements.get(CoreLite.is)) {
  window.customElements.define(CoreLite.is, CoreLite);
} else {
  console.warn(`${CoreLite.is} is already defined somewhere. Please check your code.`);
}