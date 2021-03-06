'use strict'



const { Macroable } = require('macroable')
const { arrayfy } = require('./helpers')

const defaultArgs = {
  name: undefined,
  path: undefined,
  resolve: () => {},
  before: undefined,
  after: undefined,
  kind: undefined,
  type: undefined,
  beforeMiddlewares: [],
  afterMiddlewares: [],
  policies: [],
  methods: [],
}

class Resolver extends Macroable {
  constructor({
    name,
    path,
    resolve = () => {},
    before,
    after,
    kind,
    type,
    beforeMiddlewares = [],
    afterMiddlewares = [],
    policies = [],
    methods = [],
  } = {}) {
    super()

    this._name = name
    this._path = path
    this._resolve = resolve
    this._before = before
    this._after = after
    this._kind = kind
    this._type = type
    this._beforeMiddlewares = beforeMiddlewares
    this._afterMiddlewares = afterMiddlewares
    this._policies = policies
    this._methods = methods
    // if (config.get) {
    //   this._methods = ['get']
    //   this._path = config.get
    // }
    // if (config.post) {
    //   this._methods = ['post']
    //   this._path = config.post
    // }
  }

  kind(kind) {
    this._kind = kind
    return this
  }

  path(path) {
    this._path = path
    return this
  }

  resolve(resolver) {
    this._resolve = resolver
    return this
  }

  resolversPath(dir) {
    this._resolversPath = dir
    return this
  }

  name(name) {
    this._name = name
    return this
  }

  methods(methods) {
    this._methods = arrayfy(methods)
    return this
  }

  args(args) {
    this._args = args

    if (!this._path && typeof args === 'object') {
      let namedArgs = ''
      Object.keys(args).forEach(k => {
        if (!['filter', 'sort', 'limit', 'offset', 'record'].includes(args[k])) {
          namedArgs += `:${k}/`
        }
      })
      if (namedArgs.length() > 0 && namedArgs.charAt(namedArgs.length() - 1) === '/') {
        namedArgs = namedArgs.substring(0, namedArgs.length() - 1);
      }
      this.path(`${this._path}${namedArgs}`)
    }

    return this
  }

  type(typeName) {
    this._type = typeName
    return this
  }

  policy(funcs) {
    this._policies.push({
      exec: 'sync',
      actions: arrayfy(funcs),
      isPolicy: true
    })
    return this
  }

  get(path) {
    this._path = path
    this._methods = ['get']
    return this
  }

  post(path) {
    this._path = path
    this._methods = ['post']
    return this
  }

  applyMiddlewares(middlewares, when, exec) {
    this[`_${when}Middlewares`].push({
      exec,
      actions: arrayfy(middlewares)
    })
    return this
  }

  before(middlewares) {
    return this.applyMiddlewares(middlewares, 'before', 'sync')
  }

  after(middlewares) {
    return this.applyMiddlewares(middlewares, 'after', 'sync')
  }

  beforeAsync(middlewares) {
    return this.applyMiddlewares(middlewares, 'before', 'async')
  }

  afterAsync(middlewares) {
    return this.applyMiddlewares(middlewares, 'after', 'async')
  }

  toObject() {
    return {
      name: this._name,
      path: this._name,
      resolver: this._name,
      methods: this._methods
    }
  }
}

Resolver._macros = {}
Resolver._getters = {}

module.exports = Resolver
