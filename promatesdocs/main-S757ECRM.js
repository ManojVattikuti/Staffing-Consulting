var T0 = Object.defineProperty,
  x0 = Object.defineProperties;
var N0 = Object.getOwnPropertyDescriptors;
var tf = Object.getOwnPropertySymbols;
var O0 = Object.prototype.hasOwnProperty,
  A0 = Object.prototype.propertyIsEnumerable;
var nf = (e, n, t) =>
    n in e ? T0(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : (e[n] = t),
  w = (e, n) => {
    for (var t in (n ||= {})) O0.call(n, t) && nf(e, t, n[t]);
    if (tf) for (var t of tf(n)) A0.call(n, t) && nf(e, t, n[t]);
    return e;
  },
  oe = (e, n) => x0(e, N0(n));
var Xa = null;
var Ka = 1,
  rf = Symbol('SIGNAL');
function W(e) {
  let n = Xa;
  return (Xa = e), n;
}
function of() {
  return Xa;
}
var ec = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function R0(e) {
  if (!(oc(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Ka)) {
    if (!e.producerMustRecompute(e) && !nc(e)) {
      (e.dirty = !1), (e.lastCleanEpoch = Ka);
      return;
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = Ka);
  }
}
function tc(e) {
  return e && (e.nextProducerIndex = 0), W(e);
}
function sf(e, n) {
  if (
    (W(n),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (oc(e))
      for (let t = e.nextProducerIndex; t < e.producerNode.length; t++)
        rc(e.producerNode[t], e.producerIndexOfThis[t]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(), e.producerLastReadVersion.pop(), e.producerIndexOfThis.pop();
  }
}
function nc(e) {
  sc(e);
  for (let n = 0; n < e.producerNode.length; n++) {
    let t = e.producerNode[n],
      i = e.producerLastReadVersion[n];
    if (i !== t.version || (R0(t), i !== t.version)) return !0;
  }
  return !1;
}
function ic(e) {
  if ((sc(e), oc(e)))
    for (let n = 0; n < e.producerNode.length; n++) rc(e.producerNode[n], e.producerIndexOfThis[n]);
  (e.producerNode.length = e.producerLastReadVersion.length = e.producerIndexOfThis.length = 0),
    e.liveConsumerNode && (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function rc(e, n) {
  if ((P0(e), e.liveConsumerNode.length === 1 && k0(e)))
    for (let i = 0; i < e.producerNode.length; i++) rc(e.producerNode[i], e.producerIndexOfThis[i]);
  let t = e.liveConsumerNode.length - 1;
  if (
    ((e.liveConsumerNode[n] = e.liveConsumerNode[t]),
    (e.liveConsumerIndexOfThis[n] = e.liveConsumerIndexOfThis[t]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    n < e.liveConsumerNode.length)
  ) {
    let i = e.liveConsumerIndexOfThis[n],
      r = e.liveConsumerNode[n];
    sc(r), (r.producerIndexOfThis[i] = n);
  }
}
function oc(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function sc(e) {
  (e.producerNode ??= []), (e.producerIndexOfThis ??= []), (e.producerLastReadVersion ??= []);
}
function P0(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function k0(e) {
  return e.producerNode !== void 0;
}
function F0() {
  throw new Error();
}
var L0 = F0;
function af(e) {
  L0 = e;
}
function S(e) {
  return typeof e == 'function';
}
function si(e) {
  let t = e((i) => {
    Error.call(i), (i.stack = new Error().stack);
  });
  return (t.prototype = Object.create(Error.prototype)), (t.prototype.constructor = t), t;
}
var go = si(
  (e) =>
    function (t) {
      e(this),
        (this.message = t
          ? `${t.length} errors occurred during unsubscription:
${t.map((i, r) => `${r + 1}) ${i.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = t);
    },
);
function Sn(e, n) {
  if (e) {
    let t = e.indexOf(n);
    0 <= t && e.splice(t, 1);
  }
}
var se = class e {
  constructor(n) {
    (this.initialTeardown = n),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let n;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: t } = this;
      if (t)
        if (((this._parentage = null), Array.isArray(t))) for (let o of t) o.remove(this);
        else t.remove(this);
      let { initialTeardown: i } = this;
      if (S(i))
        try {
          i();
        } catch (o) {
          n = o instanceof go ? o.errors : [o];
        }
      let { _finalizers: r } = this;
      if (r) {
        this._finalizers = null;
        for (let o of r)
          try {
            cf(o);
          } catch (s) {
            (n = n ?? []), s instanceof go ? (n = [...n, ...s.errors]) : n.push(s);
          }
      }
      if (n) throw new go(n);
    }
  }
  add(n) {
    var t;
    if (n && n !== this)
      if (this.closed) cf(n);
      else {
        if (n instanceof e) {
          if (n.closed || n._hasParent(this)) return;
          n._addParent(this);
        }
        (this._finalizers = (t = this._finalizers) !== null && t !== void 0 ? t : []).push(n);
      }
  }
  _hasParent(n) {
    let { _parentage: t } = this;
    return t === n || (Array.isArray(t) && t.includes(n));
  }
  _addParent(n) {
    let { _parentage: t } = this;
    this._parentage = Array.isArray(t) ? (t.push(n), t) : t ? [t, n] : n;
  }
  _removeParent(n) {
    let { _parentage: t } = this;
    t === n ? (this._parentage = null) : Array.isArray(t) && Sn(t, n);
  }
  remove(n) {
    let { _finalizers: t } = this;
    t && Sn(t, n), n instanceof e && n._removeParent(this);
  }
};
se.EMPTY = (() => {
  let e = new se();
  return (e.closed = !0), e;
})();
var ac = se.EMPTY;
function mo(e) {
  return e instanceof se || (e && 'closed' in e && S(e.remove) && S(e.add) && S(e.unsubscribe));
}
function cf(e) {
  S(e) ? e() : e.unsubscribe();
}
var dt = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var ai = {
  setTimeout(e, n, ...t) {
    let { delegate: i } = ai;
    return i?.setTimeout ? i.setTimeout(e, n, ...t) : setTimeout(e, n, ...t);
  },
  clearTimeout(e) {
    let { delegate: n } = ai;
    return (n?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function vo(e) {
  ai.setTimeout(() => {
    let { onUnhandledError: n } = dt;
    if (n) n(e);
    else throw e;
  });
}
function Pt() {}
var lf = cc('C', void 0, void 0);
function uf(e) {
  return cc('E', void 0, e);
}
function df(e) {
  return cc('N', e, void 0);
}
function cc(e, n, t) {
  return { kind: e, value: n, error: t };
}
var En = null;
function ci(e) {
  if (dt.useDeprecatedSynchronousErrorHandling) {
    let n = !En;
    if ((n && (En = { errorThrown: !1, error: null }), e(), n)) {
      let { errorThrown: t, error: i } = En;
      if (((En = null), t)) throw i;
    }
  } else e();
}
function ff(e) {
  dt.useDeprecatedSynchronousErrorHandling && En && ((En.errorThrown = !0), (En.error = e));
}
var In = class extends se {
    constructor(n) {
      super(),
        (this.isStopped = !1),
        n ? ((this.destination = n), mo(n) && n.add(this)) : (this.destination = V0);
    }
    static create(n, t, i) {
      return new li(n, t, i);
    }
    next(n) {
      this.isStopped ? uc(df(n), this) : this._next(n);
    }
    error(n) {
      this.isStopped ? uc(uf(n), this) : ((this.isStopped = !0), this._error(n));
    }
    complete() {
      this.isStopped ? uc(lf, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed || ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(n) {
      this.destination.next(n);
    }
    _error(n) {
      try {
        this.destination.error(n);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  j0 = Function.prototype.bind;
function lc(e, n) {
  return j0.call(e, n);
}
var dc = class {
    constructor(n) {
      this.partialObserver = n;
    }
    next(n) {
      let { partialObserver: t } = this;
      if (t.next)
        try {
          t.next(n);
        } catch (i) {
          _o(i);
        }
    }
    error(n) {
      let { partialObserver: t } = this;
      if (t.error)
        try {
          t.error(n);
        } catch (i) {
          _o(i);
        }
      else _o(n);
    }
    complete() {
      let { partialObserver: n } = this;
      if (n.complete)
        try {
          n.complete();
        } catch (t) {
          _o(t);
        }
    }
  },
  li = class extends In {
    constructor(n, t, i) {
      super();
      let r;
      if (S(n) || !n) r = { next: n ?? void 0, error: t ?? void 0, complete: i ?? void 0 };
      else {
        let o;
        this && dt.useDeprecatedNextContext
          ? ((o = Object.create(n)),
            (o.unsubscribe = () => this.unsubscribe()),
            (r = {
              next: n.next && lc(n.next, o),
              error: n.error && lc(n.error, o),
              complete: n.complete && lc(n.complete, o),
            }))
          : (r = n);
      }
      this.destination = new dc(r);
    }
  };
function _o(e) {
  dt.useDeprecatedSynchronousErrorHandling ? ff(e) : vo(e);
}
function B0(e) {
  throw e;
}
function uc(e, n) {
  let { onStoppedNotification: t } = dt;
  t && ai.setTimeout(() => t(e, n));
}
var V0 = { closed: !0, next: Pt, error: B0, complete: Pt };
var ui = (typeof Symbol == 'function' && Symbol.observable) || '@@observable';
function Re(e) {
  return e;
}
function fc(...e) {
  return pc(e);
}
function pc(e) {
  return e.length === 0
    ? Re
    : e.length === 1
      ? e[0]
      : function (t) {
          return e.reduce((i, r) => r(i), t);
        };
}
var B = (() => {
  class e {
    constructor(t) {
      t && (this._subscribe = t);
    }
    lift(t) {
      let i = new e();
      return (i.source = this), (i.operator = t), i;
    }
    subscribe(t, i, r) {
      let o = H0(t) ? t : new li(t, i, r);
      return (
        ci(() => {
          let { operator: s, source: a } = this;
          o.add(s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o));
        }),
        o
      );
    }
    _trySubscribe(t) {
      try {
        return this._subscribe(t);
      } catch (i) {
        t.error(i);
      }
    }
    forEach(t, i) {
      return (
        (i = pf(i)),
        new i((r, o) => {
          let s = new li({
            next: (a) => {
              try {
                t(a);
              } catch (c) {
                o(c), s.unsubscribe();
              }
            },
            error: o,
            complete: r,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(t) {
      var i;
      return (i = this.source) === null || i === void 0 ? void 0 : i.subscribe(t);
    }
    [ui]() {
      return this;
    }
    pipe(...t) {
      return pc(t)(this);
    }
    toPromise(t) {
      return (
        (t = pf(t)),
        new t((i, r) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => r(s),
            () => i(o),
          );
        })
      );
    }
  }
  return (e.create = (n) => new e(n)), e;
})();
function pf(e) {
  var n;
  return (n = e ?? dt.Promise) !== null && n !== void 0 ? n : Promise;
}
function $0(e) {
  return e && S(e.next) && S(e.error) && S(e.complete);
}
function H0(e) {
  return (e && e instanceof In) || ($0(e) && mo(e));
}
function hc(e) {
  return S(e?.lift);
}
function H(e) {
  return (n) => {
    if (hc(n))
      return n.lift(function (t) {
        try {
          return e(t, this);
        } catch (i) {
          this.error(i);
        }
      });
    throw new TypeError('Unable to lift unknown Observable type');
  };
}
function P(e, n, t, i, r) {
  return new gc(e, n, t, i, r);
}
var gc = class extends In {
  constructor(n, t, i, r, o, s) {
    super(n),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = t
        ? function (a) {
            try {
              t(a);
            } catch (c) {
              n.error(c);
            }
          }
        : super._next),
      (this._error = r
        ? function (a) {
            try {
              r(a);
            } catch (c) {
              n.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = i
        ? function () {
            try {
              i();
            } catch (a) {
              n.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var n;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: t } = this;
      super.unsubscribe(), !t && ((n = this.onFinalize) === null || n === void 0 || n.call(this));
    }
  }
};
function di() {
  return H((e, n) => {
    let t = null;
    e._refCount++;
    let i = P(n, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        t = null;
        return;
      }
      let r = e._connection,
        o = t;
      (t = null), r && (!o || r === o) && r.unsubscribe(), n.unsubscribe();
    });
    e.subscribe(i), i.closed || (t = e.connect());
  });
}
var fi = class extends B {
  constructor(n, t) {
    super(),
      (this.source = n),
      (this.subjectFactory = t),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      hc(n) && (this.lift = n.lift);
  }
  _subscribe(n) {
    return this.getSubject().subscribe(n);
  }
  getSubject() {
    let n = this._subject;
    return (!n || n.isStopped) && (this._subject = this.subjectFactory()), this._subject;
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: n } = this;
    (this._subject = this._connection = null), n?.unsubscribe();
  }
  connect() {
    let n = this._connection;
    if (!n) {
      n = this._connection = new se();
      let t = this.getSubject();
      n.add(
        this.source.subscribe(
          P(
            t,
            void 0,
            () => {
              this._teardown(), t.complete();
            },
            (i) => {
              this._teardown(), t.error(i);
            },
            () => this._teardown(),
          ),
        ),
      ),
        n.closed && ((this._connection = null), (n = se.EMPTY));
    }
    return n;
  }
  refCount() {
    return di()(this);
  }
};
var hf = si(
  (e) =>
    function () {
      e(this), (this.name = 'ObjectUnsubscribedError'), (this.message = 'object unsubscribed');
    },
);
var fe = (() => {
    class e extends B {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(t) {
        let i = new yo(this, this);
        return (i.operator = t), i;
      }
      _throwIfClosed() {
        if (this.closed) throw new hf();
      }
      next(t) {
        ci(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers || (this.currentObservers = Array.from(this.observers));
            for (let i of this.currentObservers) i.next(t);
          }
        });
      }
      error(t) {
        ci(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = t);
            let { observers: i } = this;
            for (; i.length; ) i.shift().error(t);
          }
        });
      }
      complete() {
        ci(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: t } = this;
            for (; t.length; ) t.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null);
      }
      get observed() {
        var t;
        return ((t = this.observers) === null || t === void 0 ? void 0 : t.length) > 0;
      }
      _trySubscribe(t) {
        return this._throwIfClosed(), super._trySubscribe(t);
      }
      _subscribe(t) {
        return this._throwIfClosed(), this._checkFinalizedStatuses(t), this._innerSubscribe(t);
      }
      _innerSubscribe(t) {
        let { hasError: i, isStopped: r, observers: o } = this;
        return i || r
          ? ac
          : ((this.currentObservers = null),
            o.push(t),
            new se(() => {
              (this.currentObservers = null), Sn(o, t);
            }));
      }
      _checkFinalizedStatuses(t) {
        let { hasError: i, thrownError: r, isStopped: o } = this;
        i ? t.error(r) : o && t.complete();
      }
      asObservable() {
        let t = new B();
        return (t.source = this), t;
      }
    }
    return (e.create = (n, t) => new yo(n, t)), e;
  })(),
  yo = class extends fe {
    constructor(n, t) {
      super(), (this.destination = n), (this.source = t);
    }
    next(n) {
      var t, i;
      (i = (t = this.destination) === null || t === void 0 ? void 0 : t.next) === null ||
        i === void 0 ||
        i.call(t, n);
    }
    error(n) {
      var t, i;
      (i = (t = this.destination) === null || t === void 0 ? void 0 : t.error) === null ||
        i === void 0 ||
        i.call(t, n);
    }
    complete() {
      var n, t;
      (t = (n = this.destination) === null || n === void 0 ? void 0 : n.complete) === null ||
        t === void 0 ||
        t.call(n);
    }
    _subscribe(n) {
      var t, i;
      return (i = (t = this.source) === null || t === void 0 ? void 0 : t.subscribe(n)) !== null &&
        i !== void 0
        ? i
        : ac;
    }
  };
var _e = class extends fe {
  constructor(n) {
    super(), (this._value = n);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(n) {
    let t = super._subscribe(n);
    return !t.closed && n.next(this._value), t;
  }
  getValue() {
    let { hasError: n, thrownError: t, _value: i } = this;
    if (n) throw t;
    return this._throwIfClosed(), i;
  }
  next(n) {
    super.next((this._value = n));
  }
};
var mc = {
  now() {
    return (mc.delegate || Date).now();
  },
  delegate: void 0,
};
var bo = class extends se {
  constructor(n, t) {
    super();
  }
  schedule(n, t = 0) {
    return this;
  }
};
var lr = {
  setInterval(e, n, ...t) {
    let { delegate: i } = lr;
    return i?.setInterval ? i.setInterval(e, n, ...t) : setInterval(e, n, ...t);
  },
  clearInterval(e) {
    let { delegate: n } = lr;
    return (n?.clearInterval || clearInterval)(e);
  },
  delegate: void 0,
};
var Do = class extends bo {
  constructor(n, t) {
    super(n, t), (this.scheduler = n), (this.work = t), (this.pending = !1);
  }
  schedule(n, t = 0) {
    var i;
    if (this.closed) return this;
    this.state = n;
    let r = this.id,
      o = this.scheduler;
    return (
      r != null && (this.id = this.recycleAsyncId(o, r, t)),
      (this.pending = !0),
      (this.delay = t),
      (this.id = (i = this.id) !== null && i !== void 0 ? i : this.requestAsyncId(o, this.id, t)),
      this
    );
  }
  requestAsyncId(n, t, i = 0) {
    return lr.setInterval(n.flush.bind(n, this), i);
  }
  recycleAsyncId(n, t, i = 0) {
    if (i != null && this.delay === i && this.pending === !1) return t;
    t != null && lr.clearInterval(t);
  }
  execute(n, t) {
    if (this.closed) return new Error('executing a cancelled action');
    this.pending = !1;
    let i = this._execute(n, t);
    if (i) return i;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(n, t) {
    let i = !1,
      r;
    try {
      this.work(n);
    } catch (o) {
      (i = !0), (r = o || new Error('Scheduled action threw falsy error'));
    }
    if (i) return this.unsubscribe(), r;
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: n, scheduler: t } = this,
        { actions: i } = t;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        Sn(i, this),
        n != null && (this.id = this.recycleAsyncId(t, n, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var pi = class e {
  constructor(n, t = e.now) {
    (this.schedulerActionCtor = n), (this.now = t);
  }
  schedule(n, t = 0, i) {
    return new this.schedulerActionCtor(this, n).schedule(i, t);
  }
};
pi.now = mc.now;
var wo = class extends pi {
  constructor(n, t = pi.now) {
    super(n, t), (this.actions = []), (this._active = !1);
  }
  flush(n) {
    let { actions: t } = this;
    if (this._active) {
      t.push(n);
      return;
    }
    let i;
    this._active = !0;
    do if ((i = n.execute(n.state, n.delay))) break;
    while ((n = t.shift()));
    if (((this._active = !1), i)) {
      for (; (n = t.shift()); ) n.unsubscribe();
      throw i;
    }
  }
};
var vc = new wo(Do),
  gf = vc;
var Pe = new B((e) => e.complete());
function Co(e) {
  return e && S(e.schedule);
}
function mf(e) {
  return e[e.length - 1];
}
function So(e) {
  return S(mf(e)) ? e.pop() : void 0;
}
function Jt(e) {
  return Co(mf(e)) ? e.pop() : void 0;
}
function _f(e, n, t, i) {
  function r(o) {
    return o instanceof t
      ? o
      : new t(function (s) {
          s(o);
        });
  }
  return new (t || (t = Promise))(function (o, s) {
    function a(u) {
      try {
        l(i.next(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      try {
        l(i.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      u.done ? o(u.value) : r(u.value).then(a, c);
    }
    l((i = i.apply(e, n || [])).next());
  });
}
function vf(e) {
  var n = typeof Symbol == 'function' && Symbol.iterator,
    t = n && e[n],
    i = 0;
  if (t) return t.call(e);
  if (e && typeof e.length == 'number')
    return {
      next: function () {
        return e && i >= e.length && (e = void 0), { value: e && e[i++], done: !e };
      },
    };
  throw new TypeError(n ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
}
function Mn(e) {
  return this instanceof Mn ? ((this.v = e), this) : new Mn(e);
}
function yf(e, n, t) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var i = t.apply(e, n || []),
    r,
    o = [];
  return (
    (r = Object.create((typeof AsyncIterator == 'function' ? AsyncIterator : Object).prototype)),
    a('next'),
    a('throw'),
    a('return', s),
    (r[Symbol.asyncIterator] = function () {
      return this;
    }),
    r
  );
  function s(f) {
    return function (_) {
      return Promise.resolve(_).then(f, d);
    };
  }
  function a(f, _) {
    i[f] &&
      ((r[f] = function (y) {
        return new Promise(function (b, D) {
          o.push([f, y, b, D]) > 1 || c(f, y);
        });
      }),
      _ && (r[f] = _(r[f])));
  }
  function c(f, _) {
    try {
      l(i[f](_));
    } catch (y) {
      g(o[0][3], y);
    }
  }
  function l(f) {
    f.value instanceof Mn ? Promise.resolve(f.value.v).then(u, d) : g(o[0][2], f);
  }
  function u(f) {
    c('next', f);
  }
  function d(f) {
    c('throw', f);
  }
  function g(f, _) {
    f(_), o.shift(), o.length && c(o[0][0], o[0][1]);
  }
}
function bf(e) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var n = e[Symbol.asyncIterator],
    t;
  return n
    ? n.call(e)
    : ((e = typeof vf == 'function' ? vf(e) : e[Symbol.iterator]()),
      (t = {}),
      i('next'),
      i('throw'),
      i('return'),
      (t[Symbol.asyncIterator] = function () {
        return this;
      }),
      t);
  function i(o) {
    t[o] =
      e[o] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = e[o](s)), r(a, c, s.done, s.value);
        });
      };
  }
  function r(o, s, a, c) {
    Promise.resolve(c).then(function (l) {
      o({ value: l, done: a });
    }, s);
  }
}
var hi = (e) => e && typeof e.length == 'number' && typeof e != 'function';
function Eo(e) {
  return S(e?.then);
}
function Io(e) {
  return S(e[ui]);
}
function Mo(e) {
  return Symbol.asyncIterator && S(e?.[Symbol.asyncIterator]);
}
function To(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == 'object' ? 'an invalid object' : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function U0() {
  return typeof Symbol != 'function' || !Symbol.iterator ? '@@iterator' : Symbol.iterator;
}
var xo = U0();
function No(e) {
  return S(e?.[xo]);
}
function Oo(e) {
  return yf(this, arguments, function* () {
    let t = e.getReader();
    try {
      for (;;) {
        let { value: i, done: r } = yield Mn(t.read());
        if (r) return yield Mn(void 0);
        yield yield Mn(i);
      }
    } finally {
      t.releaseLock();
    }
  });
}
function Ao(e) {
  return S(e?.getReader);
}
function K(e) {
  if (e instanceof B) return e;
  if (e != null) {
    if (Io(e)) return G0(e);
    if (hi(e)) return z0(e);
    if (Eo(e)) return W0(e);
    if (Mo(e)) return Df(e);
    if (No(e)) return q0(e);
    if (Ao(e)) return Q0(e);
  }
  throw To(e);
}
function G0(e) {
  return new B((n) => {
    let t = e[ui]();
    if (S(t.subscribe)) return t.subscribe(n);
    throw new TypeError('Provided object does not correctly implement Symbol.observable');
  });
}
function z0(e) {
  return new B((n) => {
    for (let t = 0; t < e.length && !n.closed; t++) n.next(e[t]);
    n.complete();
  });
}
function W0(e) {
  return new B((n) => {
    e.then(
      (t) => {
        n.closed || (n.next(t), n.complete());
      },
      (t) => n.error(t),
    ).then(null, vo);
  });
}
function q0(e) {
  return new B((n) => {
    for (let t of e) if ((n.next(t), n.closed)) return;
    n.complete();
  });
}
function Df(e) {
  return new B((n) => {
    Z0(e, n).catch((t) => n.error(t));
  });
}
function Q0(e) {
  return Df(Oo(e));
}
function Z0(e, n) {
  var t, i, r, o;
  return _f(this, void 0, void 0, function* () {
    try {
      for (t = bf(e); (i = yield t.next()), !i.done; ) {
        let s = i.value;
        if ((n.next(s), n.closed)) return;
      }
    } catch (s) {
      r = { error: s };
    } finally {
      try {
        i && !i.done && (o = t.return) && (yield o.call(t));
      } finally {
        if (r) throw r.error;
      }
    }
    n.complete();
  });
}
function He(e, n, t, i = 0, r = !1) {
  let o = n.schedule(function () {
    t(), r ? e.add(this.schedule(null, i)) : this.unsubscribe();
  }, i);
  if ((e.add(o), !r)) return o;
}
function Ro(e, n = 0) {
  return H((t, i) => {
    t.subscribe(
      P(
        i,
        (r) => He(i, e, () => i.next(r), n),
        () => He(i, e, () => i.complete(), n),
        (r) => He(i, e, () => i.error(r), n),
      ),
    );
  });
}
function Po(e, n = 0) {
  return H((t, i) => {
    i.add(e.schedule(() => t.subscribe(i), n));
  });
}
function wf(e, n) {
  return K(e).pipe(Po(n), Ro(n));
}
function Cf(e, n) {
  return K(e).pipe(Po(n), Ro(n));
}
function Sf(e, n) {
  return new B((t) => {
    let i = 0;
    return n.schedule(function () {
      i === e.length ? t.complete() : (t.next(e[i++]), t.closed || this.schedule());
    });
  });
}
function Ef(e, n) {
  return new B((t) => {
    let i;
    return (
      He(t, n, () => {
        (i = e[xo]()),
          He(
            t,
            n,
            () => {
              let r, o;
              try {
                ({ value: r, done: o } = i.next());
              } catch (s) {
                t.error(s);
                return;
              }
              o ? t.complete() : t.next(r);
            },
            0,
            !0,
          );
      }),
      () => S(i?.return) && i.return()
    );
  });
}
function ko(e, n) {
  if (!e) throw new Error('Iterable cannot be null');
  return new B((t) => {
    He(t, n, () => {
      let i = e[Symbol.asyncIterator]();
      He(
        t,
        n,
        () => {
          i.next().then((r) => {
            r.done ? t.complete() : t.next(r.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function If(e, n) {
  return ko(Oo(e), n);
}
function Mf(e, n) {
  if (e != null) {
    if (Io(e)) return wf(e, n);
    if (hi(e)) return Sf(e, n);
    if (Eo(e)) return Cf(e, n);
    if (Mo(e)) return ko(e, n);
    if (No(e)) return Ef(e, n);
    if (Ao(e)) return If(e, n);
  }
  throw To(e);
}
function pe(e, n) {
  return n ? Mf(e, n) : K(e);
}
function x(...e) {
  let n = Jt(e);
  return pe(e, n);
}
function gi(e, n) {
  let t = S(e) ? e : () => e,
    i = (r) => r.error(t());
  return new B(n ? (r) => n.schedule(i, 0, r) : i);
}
function _c(e) {
  return !!e && (e instanceof B || (S(e.lift) && S(e.subscribe)));
}
var kt = si(
  (e) =>
    function () {
      e(this), (this.name = 'EmptyError'), (this.message = 'no elements in sequence');
    },
);
function Tf(e) {
  return e instanceof Date && !isNaN(e);
}
function V(e, n) {
  return H((t, i) => {
    let r = 0;
    t.subscribe(
      P(i, (o) => {
        i.next(e.call(n, o, r++));
      }),
    );
  });
}
var { isArray: Y0 } = Array;
function J0(e, n) {
  return Y0(n) ? e(...n) : e(n);
}
function Fo(e) {
  return V((n) => J0(e, n));
}
var { isArray: K0 } = Array,
  { getPrototypeOf: X0, prototype: ev, keys: tv } = Object;
function xf(e) {
  if (e.length === 1) {
    let n = e[0];
    if (K0(n)) return { args: n, keys: null };
    if (nv(n)) {
      let t = tv(n);
      return { args: t.map((i) => n[i]), keys: t };
    }
  }
  return { args: e, keys: null };
}
function nv(e) {
  return e && typeof e == 'object' && X0(e) === ev;
}
function Nf(e, n) {
  return e.reduce((t, i, r) => ((t[i] = n[r]), t), {});
}
function ur(...e) {
  let n = Jt(e),
    t = So(e),
    { args: i, keys: r } = xf(e);
  if (i.length === 0) return pe([], n);
  let o = new B(iv(i, n, r ? (s) => Nf(r, s) : Re));
  return t ? o.pipe(Fo(t)) : o;
}
function iv(e, n, t = Re) {
  return (i) => {
    Of(
      n,
      () => {
        let { length: r } = e,
          o = new Array(r),
          s = r,
          a = r;
        for (let c = 0; c < r; c++)
          Of(
            n,
            () => {
              let l = pe(e[c], n),
                u = !1;
              l.subscribe(
                P(
                  i,
                  (d) => {
                    (o[c] = d), u || ((u = !0), a--), a || i.next(t(o.slice()));
                  },
                  () => {
                    --s || i.complete();
                  },
                ),
              );
            },
            i,
          );
      },
      i,
    );
  };
}
function Of(e, n, t) {
  e ? He(t, e, n) : n();
}
function Af(e, n, t, i, r, o, s, a) {
  let c = [],
    l = 0,
    u = 0,
    d = !1,
    g = () => {
      d && !c.length && !l && n.complete();
    },
    f = (y) => (l < i ? _(y) : c.push(y)),
    _ = (y) => {
      o && n.next(y), l++;
      let b = !1;
      K(t(y, u++)).subscribe(
        P(
          n,
          (D) => {
            r?.(D), o ? f(D) : n.next(D);
          },
          () => {
            b = !0;
          },
          void 0,
          () => {
            if (b)
              try {
                for (l--; c.length && l < i; ) {
                  let D = c.shift();
                  s ? He(n, s, () => _(D)) : _(D);
                }
                g();
              } catch (D) {
                n.error(D);
              }
          },
        ),
      );
    };
  return (
    e.subscribe(
      P(n, f, () => {
        (d = !0), g();
      }),
    ),
    () => {
      a?.();
    }
  );
}
function te(e, n, t = 1 / 0) {
  return S(n)
    ? te((i, r) => V((o, s) => n(i, o, r, s))(K(e(i, r))), t)
    : (typeof n == 'number' && (t = n), H((i, r) => Af(i, r, e, t)));
}
function yc(e = 1 / 0) {
  return te(Re, e);
}
function Rf() {
  return yc(1);
}
function bt(...e) {
  return Rf()(pe(e, Jt(e)));
}
function Lo(e) {
  return new B((n) => {
    K(e()).subscribe(n);
  });
}
var rv = ['addListener', 'removeListener'],
  ov = ['addEventListener', 'removeEventListener'],
  sv = ['on', 'off'];
function Dt(e, n, t, i) {
  if ((S(t) && ((i = t), (t = void 0)), i)) return Dt(e, n, t).pipe(Fo(i));
  let [r, o] = lv(e)
    ? ov.map((s) => (a) => e[s](n, a, t))
    : av(e)
      ? rv.map(Pf(e, n))
      : cv(e)
        ? sv.map(Pf(e, n))
        : [];
  if (!r && hi(e)) return te((s) => Dt(s, n, t))(K(e));
  if (!r) throw new TypeError('Invalid event target');
  return new B((s) => {
    let a = (...c) => s.next(1 < c.length ? c : c[0]);
    return r(a), () => o(a);
  });
}
function Pf(e, n) {
  return (t) => (i) => e[t](n, i);
}
function av(e) {
  return S(e.addListener) && S(e.removeListener);
}
function cv(e) {
  return S(e.on) && S(e.off);
}
function lv(e) {
  return S(e.addEventListener) && S(e.removeEventListener);
}
function dr(e = 0, n, t = gf) {
  let i = -1;
  return (
    n != null && (Co(n) ? (t = n) : (i = n)),
    new B((r) => {
      let o = Tf(e) ? +e - t.now() : e;
      o < 0 && (o = 0);
      let s = 0;
      return t.schedule(function () {
        r.closed || (r.next(s++), 0 <= i ? this.schedule(void 0, i) : r.complete());
      }, o);
    })
  );
}
var { isArray: uv } = Array;
function kf(e) {
  return e.length === 1 && uv(e[0]) ? e[0] : e;
}
function ke(e, n) {
  return H((t, i) => {
    let r = 0;
    t.subscribe(P(i, (o) => e.call(n, o, r++) && i.next(o)));
  });
}
function jo(...e) {
  return (e = kf(e)), e.length === 1 ? K(e[0]) : new B(dv(e));
}
function dv(e) {
  return (n) => {
    let t = [];
    for (let i = 0; t && !n.closed && i < e.length; i++)
      t.push(
        K(e[i]).subscribe(
          P(n, (r) => {
            if (t) {
              for (let o = 0; o < t.length; o++) o !== i && t[o].unsubscribe();
              t = null;
            }
            n.next(r);
          }),
        ),
      );
  };
}
function Kt(e) {
  return H((n, t) => {
    let i = null,
      r = !1,
      o;
    (i = n.subscribe(
      P(t, void 0, void 0, (s) => {
        (o = K(e(s, Kt(e)(n)))), i ? (i.unsubscribe(), (i = null), o.subscribe(t)) : (r = !0);
      }),
    )),
      r && (i.unsubscribe(), (i = null), o.subscribe(t));
  });
}
function Ff(e, n, t, i, r) {
  return (o, s) => {
    let a = t,
      c = n,
      l = 0;
    o.subscribe(
      P(
        s,
        (u) => {
          let d = l++;
          (c = a ? e(c, u, d) : ((a = !0), u)), i && s.next(c);
        },
        r &&
          (() => {
            a && s.next(c), s.complete();
          }),
      ),
    );
  };
}
function mi(e, n) {
  return S(n) ? te(e, n, 1) : te(e, 1);
}
function Xt(e) {
  return H((n, t) => {
    let i = !1;
    n.subscribe(
      P(
        t,
        (r) => {
          (i = !0), t.next(r);
        },
        () => {
          i || t.next(e), t.complete();
        },
      ),
    );
  });
}
function Fe(e) {
  return e <= 0
    ? () => Pe
    : H((n, t) => {
        let i = 0;
        n.subscribe(
          P(t, (r) => {
            ++i <= e && (t.next(r), e <= i && t.complete());
          }),
        );
      });
}
function Lf() {
  return H((e, n) => {
    e.subscribe(P(n, Pt));
  });
}
function fr(e) {
  return V(() => e);
}
function bc(e, n) {
  return n
    ? (t) => bt(n.pipe(Fe(1), Lf()), t.pipe(bc(e)))
    : te((t, i) => K(e(t, i)).pipe(Fe(1), fr(t)));
}
function Dc(e, n = vc) {
  let t = dr(e, n);
  return bc(() => t);
}
function Bo(e = fv) {
  return H((n, t) => {
    let i = !1;
    n.subscribe(
      P(
        t,
        (r) => {
          (i = !0), t.next(r);
        },
        () => (i ? t.complete() : t.error(e())),
      ),
    );
  });
}
function fv() {
  return new kt();
}
function wc(...e) {
  return (n) => bt(n, x(...e));
}
function vi(e) {
  return H((n, t) => {
    try {
      n.subscribe(t);
    } finally {
      t.add(e);
    }
  });
}
function wt(e, n) {
  let t = arguments.length >= 2;
  return (i) => i.pipe(e ? ke((r, o) => e(r, o, i)) : Re, Fe(1), t ? Xt(n) : Bo(() => new kt()));
}
function _i(e) {
  return e <= 0
    ? () => Pe
    : H((n, t) => {
        let i = [];
        n.subscribe(
          P(
            t,
            (r) => {
              i.push(r), e < i.length && i.shift();
            },
            () => {
              for (let r of i) t.next(r);
              t.complete();
            },
            void 0,
            () => {
              i = null;
            },
          ),
        );
      });
}
function Cc(e, n) {
  let t = arguments.length >= 2;
  return (i) => i.pipe(e ? ke((r, o) => e(r, o, i)) : Re, _i(1), t ? Xt(n) : Bo(() => new kt()));
}
function Sc(e, n) {
  return H(Ff(e, n, arguments.length >= 2, !0));
}
function Vo(...e) {
  let n = Jt(e);
  return H((t, i) => {
    (n ? bt(e, t, n) : bt(e, t)).subscribe(i);
  });
}
function Ke(e, n) {
  return H((t, i) => {
    let r = null,
      o = 0,
      s = !1,
      a = () => s && !r && i.complete();
    t.subscribe(
      P(
        i,
        (c) => {
          r?.unsubscribe();
          let l = 0,
            u = o++;
          K(e(c, u)).subscribe(
            (r = P(
              i,
              (d) => i.next(n ? n(c, d, u, l++) : d),
              () => {
                (r = null), a();
              },
            )),
          );
        },
        () => {
          (s = !0), a();
        },
      ),
    );
  });
}
function Xe(e) {
  return H((n, t) => {
    K(e).subscribe(P(t, () => t.complete(), Pt)), !t.closed && n.subscribe(t);
  });
}
function he(e, n, t) {
  let i = S(e) || n || t ? { next: e, error: n, complete: t } : e;
  return i
    ? H((r, o) => {
        var s;
        (s = i.subscribe) === null || s === void 0 || s.call(i);
        let a = !0;
        r.subscribe(
          P(
            o,
            (c) => {
              var l;
              (l = i.next) === null || l === void 0 || l.call(i, c), o.next(c);
            },
            () => {
              var c;
              (a = !1), (c = i.complete) === null || c === void 0 || c.call(i), o.complete();
            },
            (c) => {
              var l;
              (a = !1), (l = i.error) === null || l === void 0 || l.call(i, c), o.error(c);
            },
            () => {
              var c, l;
              a && ((c = i.unsubscribe) === null || c === void 0 || c.call(i)),
                (l = i.finalize) === null || l === void 0 || l.call(i);
            },
          ),
        );
      })
    : Re;
}
function Ec(...e) {
  let n = So(e);
  return H((t, i) => {
    let r = e.length,
      o = new Array(r),
      s = e.map(() => !1),
      a = !1;
    for (let c = 0; c < r; c++)
      K(e[c]).subscribe(
        P(
          i,
          (l) => {
            (o[c] = l), !a && !s[c] && ((s[c] = !0), (a = s.every(Re)) && (s = null));
          },
          Pt,
        ),
      );
    t.subscribe(
      P(i, (c) => {
        if (a) {
          let l = [c, ...o];
          i.next(n ? n(...l) : l);
        }
      }),
    );
  });
}
var pv = 'https://g.co/ng/security#xss',
  E = class extends Error {
    constructor(n, t) {
      super(Rl(n, t)), (this.code = n);
    }
  };
function Rl(e, n) {
  return `${`NG0${Math.abs(e)}`}${n ? ': ' + n : ''}`;
}
function Cr(e) {
  return { toString: e }.toString();
}
var $o = '__parameters__';
function hv(e) {
  return function (...t) {
    if (e) {
      let i = e(...t);
      for (let r in i) this[r] = i[r];
    }
  };
}
function Cp(e, n, t) {
  return Cr(() => {
    let i = hv(n);
    function r(...o) {
      if (this instanceof r) return i.apply(this, o), this;
      let s = new r(...o);
      return (a.annotation = s), a;
      function a(c, l, u) {
        let d = c.hasOwnProperty($o) ? c[$o] : Object.defineProperty(c, $o, { value: [] })[$o];
        for (; d.length <= u; ) d.push(null);
        return (d[u] = d[u] || []).push(s), c;
      }
    }
    return (
      t && (r.prototype = Object.create(t.prototype)),
      (r.prototype.ngMetadataName = e),
      (r.annotationCls = r),
      r
    );
  });
}
function X(e) {
  for (let n in e) if (e[n] === X) return n;
  throw Error('Could not find renamed property on target object.');
}
function gv(e, n) {
  for (let t in n) n.hasOwnProperty(t) && !e.hasOwnProperty(t) && (e[t] = n[t]);
}
function Le(e) {
  if (typeof e == 'string') return e;
  if (Array.isArray(e)) return '[' + e.map(Le).join(', ') + ']';
  if (e == null) return '' + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let n = e.toString();
  if (n == null) return '' + n;
  let t = n.indexOf(`
`);
  return t === -1 ? n : n.substring(0, t);
}
function jf(e, n) {
  return e == null || e === '' ? (n === null ? '' : n) : n == null || n === '' ? e : e + ' ' + n;
}
var mv = X({ __forward_ref__: X });
function bs(e) {
  return (
    (e.__forward_ref__ = bs),
    (e.toString = function () {
      return Le(this());
    }),
    e
  );
}
function Ce(e) {
  return Sp(e) ? e() : e;
}
function Sp(e) {
  return typeof e == 'function' && e.hasOwnProperty(mv) && e.__forward_ref__ === bs;
}
function C(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function jn(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function Ds(e) {
  return Bf(e, Ip) || Bf(e, Mp);
}
function Ep(e) {
  return Ds(e) !== null;
}
function Bf(e, n) {
  return e.hasOwnProperty(n) ? e[n] : null;
}
function vv(e) {
  let n = e && (e[Ip] || e[Mp]);
  return n || null;
}
function Vf(e) {
  return e && (e.hasOwnProperty($f) || e.hasOwnProperty(_v)) ? e[$f] : null;
}
var Ip = X({ ɵprov: X }),
  $f = X({ ɵinj: X }),
  Mp = X({ ngInjectableDef: X }),
  _v = X({ ngInjectorDef: X }),
  A = class {
    constructor(n, t) {
      (this._desc = n),
        (this.ngMetadataName = 'InjectionToken'),
        (this.ɵprov = void 0),
        typeof t == 'number'
          ? (this.__NG_ELEMENT_ID__ = t)
          : t !== void 0 &&
            (this.ɵprov = C({
              token: this,
              providedIn: t.providedIn || 'root',
              factory: t.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function Tp(e) {
  return e && !!e.ɵproviders;
}
var yv = X({ ɵcmp: X }),
  bv = X({ ɵdir: X }),
  Dv = X({ ɵpipe: X }),
  wv = X({ ɵmod: X }),
  Jo = X({ ɵfac: X }),
  hr = X({ __NG_ELEMENT_ID__: X }),
  Hf = X({ __NG_ENV_ID__: X });
function Pl(e) {
  return typeof e == 'string' ? e : e == null ? '' : String(e);
}
function Cv(e) {
  return typeof e == 'function'
    ? e.name || e.toString()
    : typeof e == 'object' && e != null && typeof e.type == 'function'
      ? e.type.name || e.type.toString()
      : Pl(e);
}
function Sv(e, n) {
  let t = n ? `. Dependency path: ${n.join(' > ')} > ${e}` : '';
  throw new E(-200, e);
}
function kl(e, n) {
  throw new E(-201, !1);
}
var $ = (function (e) {
    return (
      (e[(e.Default = 0)] = 'Default'),
      (e[(e.Host = 1)] = 'Host'),
      (e[(e.Self = 2)] = 'Self'),
      (e[(e.SkipSelf = 4)] = 'SkipSelf'),
      (e[(e.Optional = 8)] = 'Optional'),
      e
    );
  })($ || {}),
  Bc;
function xp() {
  return Bc;
}
function et(e) {
  let n = Bc;
  return (Bc = e), n;
}
function Np(e, n, t) {
  let i = Ds(e);
  if (i && i.providedIn == 'root') return i.value === void 0 ? (i.value = i.factory()) : i.value;
  if (t & $.Optional) return null;
  if (n !== void 0) return n;
  kl(e, 'Injector');
}
var Ev = {},
  gr = Ev,
  Vc = '__NG_DI_FLAG__',
  Ko = 'ngTempTokenPath',
  Iv = 'ngTokenPath',
  Mv = /\n/gm,
  Tv = '\u0275',
  Uf = '__source',
  wi;
function xv() {
  return wi;
}
function en(e) {
  let n = wi;
  return (wi = e), n;
}
function Nv(e, n = $.Default) {
  if (wi === void 0) throw new E(-203, !1);
  return wi === null ? Np(e, void 0, n) : wi.get(e, n & $.Optional ? null : void 0, n);
}
function U(e, n = $.Default) {
  return (xp() || Nv)(Ce(e), n);
}
function v(e, n = $.Default) {
  return U(e, ws(n));
}
function ws(e) {
  return typeof e > 'u' || typeof e == 'number'
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function $c(e) {
  let n = [];
  for (let t = 0; t < e.length; t++) {
    let i = Ce(e[t]);
    if (Array.isArray(i)) {
      if (i.length === 0) throw new E(900, !1);
      let r,
        o = $.Default;
      for (let s = 0; s < i.length; s++) {
        let a = i[s],
          c = Ov(a);
        typeof c == 'number' ? (c === -1 ? (r = a.token) : (o |= c)) : (r = a);
      }
      n.push(U(r, o));
    } else n.push(U(i));
  }
  return n;
}
function Op(e, n) {
  return (e[Vc] = n), (e.prototype[Vc] = n), e;
}
function Ov(e) {
  return e[Vc];
}
function Av(e, n, t, i) {
  let r = e[Ko];
  throw (
    (n[Uf] && r.unshift(n[Uf]),
    (e.message = Rv(
      `
` + e.message,
      r,
      t,
      i,
    )),
    (e[Iv] = r),
    (e[Ko] = null),
    e)
  );
}
function Rv(e, n, t, i = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == Tv
      ? e.slice(2)
      : e;
  let r = Le(n);
  if (Array.isArray(n)) r = n.map(Le).join(' -> ');
  else if (typeof n == 'object') {
    let o = [];
    for (let s in n)
      if (n.hasOwnProperty(s)) {
        let a = n[s];
        o.push(s + ':' + (typeof a == 'string' ? JSON.stringify(a) : Le(a)));
      }
    r = `{${o.join(', ')}}`;
  }
  return `${t}${i ? '(' + i + ')' : ''}[${r}]: ${e.replace(
    Mv,
    `
  `,
  )}`;
}
var Fl = Op(Cp('Optional'), 8);
var Ap = Op(Cp('SkipSelf'), 4);
function Si(e, n) {
  let t = e.hasOwnProperty(Jo);
  return t ? e[Jo] : null;
}
function Pv(e, n, t) {
  if (e.length !== n.length) return !1;
  for (let i = 0; i < e.length; i++) {
    let r = e[i],
      o = n[i];
    if ((t && ((r = t(r)), (o = t(o))), o !== r)) return !1;
  }
  return !0;
}
function kv(e) {
  return e.flat(Number.POSITIVE_INFINITY);
}
function Ll(e, n) {
  e.forEach((t) => (Array.isArray(t) ? Ll(t, n) : n(t)));
}
function Rp(e, n, t) {
  n >= e.length ? e.push(t) : e.splice(n, 0, t);
}
function Xo(e, n) {
  return n >= e.length - 1 ? e.pop() : e.splice(n, 1)[0];
}
function Fv(e, n, t, i) {
  let r = e.length;
  if (r == n) e.push(t, i);
  else if (r === 1) e.push(i, e[0]), (e[0] = t);
  else {
    for (r--, e.push(e[r - 1], e[r]); r > n; ) {
      let o = r - 2;
      (e[r] = e[o]), r--;
    }
    (e[n] = t), (e[n + 1] = i);
  }
}
function Lv(e, n, t) {
  let i = Sr(e, n);
  return i >= 0 ? (e[i | 1] = t) : ((i = ~i), Fv(e, i, n, t)), i;
}
function Ic(e, n) {
  let t = Sr(e, n);
  if (t >= 0) return e[t | 1];
}
function Sr(e, n) {
  return jv(e, n, 1);
}
function jv(e, n, t) {
  let i = 0,
    r = e.length >> t;
  for (; r !== i; ) {
    let o = i + ((r - i) >> 1),
      s = e[o << t];
    if (n === s) return o << t;
    s > n ? (r = o) : (i = o + 1);
  }
  return ~(r << t);
}
var Ft = {},
  tt = [],
  Ei = new A(''),
  Pp = new A('', -1),
  kp = new A(''),
  es = class {
    get(n, t = gr) {
      if (t === gr) {
        let i = new Error(`NullInjectorError: No provider for ${Le(n)}!`);
        throw ((i.name = 'NullInjectorError'), i);
      }
      return t;
    }
  },
  Fp = (function (e) {
    return (e[(e.OnPush = 0)] = 'OnPush'), (e[(e.Default = 1)] = 'Default'), e;
  })(Fp || {}),
  Et = (function (e) {
    return (
      (e[(e.Emulated = 0)] = 'Emulated'),
      (e[(e.None = 2)] = 'None'),
      (e[(e.ShadowDom = 3)] = 'ShadowDom'),
      e
    );
  })(Et || {}),
  rn = (function (e) {
    return (
      (e[(e.None = 0)] = 'None'),
      (e[(e.SignalBased = 1)] = 'SignalBased'),
      (e[(e.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
      e
    );
  })(rn || {});
function Bv(e, n, t) {
  let i = e.length;
  for (;;) {
    let r = e.indexOf(n, t);
    if (r === -1) return r;
    if (r === 0 || e.charCodeAt(r - 1) <= 32) {
      let o = n.length;
      if (r + o === i || e.charCodeAt(r + o) <= 32) return r;
    }
    t = r + 1;
  }
}
function Hc(e, n, t) {
  let i = 0;
  for (; i < t.length; ) {
    let r = t[i];
    if (typeof r == 'number') {
      if (r !== 0) break;
      i++;
      let o = t[i++],
        s = t[i++],
        a = t[i++];
      e.setAttribute(n, s, a, o);
    } else {
      let o = r,
        s = t[++i];
      $v(o) ? e.setProperty(n, o, s) : e.setAttribute(n, o, s), i++;
    }
  }
  return i;
}
function Vv(e) {
  return e === 3 || e === 4 || e === 6;
}
function $v(e) {
  return e.charCodeAt(0) === 64;
}
function mr(e, n) {
  if (!(n === null || n.length === 0))
    if (e === null || e.length === 0) e = n.slice();
    else {
      let t = -1;
      for (let i = 0; i < n.length; i++) {
        let r = n[i];
        typeof r == 'number'
          ? (t = r)
          : t === 0 || (t === -1 || t === 2 ? Gf(e, t, r, null, n[++i]) : Gf(e, t, r, null, null));
      }
    }
  return e;
}
function Gf(e, n, t, i, r) {
  let o = 0,
    s = e.length;
  if (n === -1) s = -1;
  else
    for (; o < e.length; ) {
      let a = e[o++];
      if (typeof a == 'number') {
        if (a === n) {
          s = -1;
          break;
        } else if (a > n) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < e.length; ) {
    let a = e[o];
    if (typeof a == 'number') break;
    if (a === t) {
      if (i === null) {
        r !== null && (e[o + 1] = r);
        return;
      } else if (i === e[o + 1]) {
        e[o + 2] = r;
        return;
      }
    }
    o++, i !== null && o++, r !== null && o++;
  }
  s !== -1 && (e.splice(s, 0, n), (o = s + 1)),
    e.splice(o++, 0, t),
    i !== null && e.splice(o++, 0, i),
    r !== null && e.splice(o++, 0, r);
}
var Lp = 'ng-template';
function Hv(e, n, t, i) {
  let r = 0;
  if (i) {
    for (; r < n.length && typeof n[r] == 'string'; r += 2)
      if (n[r] === 'class' && Bv(n[r + 1].toLowerCase(), t, 0) !== -1) return !0;
  } else if (jl(e)) return !1;
  if (((r = n.indexOf(1, r)), r > -1)) {
    let o;
    for (; ++r < n.length && typeof (o = n[r]) == 'string'; ) if (o.toLowerCase() === t) return !0;
  }
  return !1;
}
function jl(e) {
  return e.type === 4 && e.value !== Lp;
}
function Uv(e, n, t) {
  let i = e.type === 4 && !t ? Lp : e.value;
  return n === i;
}
function Gv(e, n, t) {
  let i = 4,
    r = e.attrs,
    o = r !== null ? qv(r) : 0,
    s = !1;
  for (let a = 0; a < n.length; a++) {
    let c = n[a];
    if (typeof c == 'number') {
      if (!s && !ft(i) && !ft(c)) return !1;
      if (s && ft(c)) continue;
      (s = !1), (i = c | (i & 1));
      continue;
    }
    if (!s)
      if (i & 4) {
        if (((i = 2 | (i & 1)), (c !== '' && !Uv(e, c, t)) || (c === '' && n.length === 1))) {
          if (ft(i)) return !1;
          s = !0;
        }
      } else if (i & 8) {
        if (r === null || !Hv(e, r, c, t)) {
          if (ft(i)) return !1;
          s = !0;
        }
      } else {
        let l = n[++a],
          u = zv(c, r, jl(e), t);
        if (u === -1) {
          if (ft(i)) return !1;
          s = !0;
          continue;
        }
        if (l !== '') {
          let d;
          if ((u > o ? (d = '') : (d = r[u + 1].toLowerCase()), i & 2 && l !== d)) {
            if (ft(i)) return !1;
            s = !0;
          }
        }
      }
  }
  return ft(i) || s;
}
function ft(e) {
  return (e & 1) === 0;
}
function zv(e, n, t, i) {
  if (n === null) return -1;
  let r = 0;
  if (i || !t) {
    let o = !1;
    for (; r < n.length; ) {
      let s = n[r];
      if (s === e) return r;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = n[++r];
        for (; typeof a == 'string'; ) a = n[++r];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          r += 4;
          continue;
        }
      }
      r += o ? 1 : 2;
    }
    return -1;
  } else return Qv(n, e);
}
function Wv(e, n, t = !1) {
  for (let i = 0; i < n.length; i++) if (Gv(e, n[i], t)) return !0;
  return !1;
}
function qv(e) {
  for (let n = 0; n < e.length; n++) {
    let t = e[n];
    if (Vv(t)) return n;
  }
  return e.length;
}
function Qv(e, n) {
  let t = e.indexOf(4);
  if (t > -1)
    for (t++; t < e.length; ) {
      let i = e[t];
      if (typeof i == 'number') return -1;
      if (i === n) return t;
      t++;
    }
  return -1;
}
function zf(e, n) {
  return e ? ':not(' + n.trim() + ')' : n;
}
function Zv(e) {
  let n = e[0],
    t = 1,
    i = 2,
    r = '',
    o = !1;
  for (; t < e.length; ) {
    let s = e[t];
    if (typeof s == 'string')
      if (i & 2) {
        let a = e[++t];
        r += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']';
      } else i & 8 ? (r += '.' + s) : i & 4 && (r += ' ' + s);
    else r !== '' && !ft(s) && ((n += zf(o, r)), (r = '')), (i = s), (o = o || !ft(i));
    t++;
  }
  return r !== '' && (n += zf(o, r)), n;
}
function Yv(e) {
  return e.map(Zv).join(',');
}
function Jv(e) {
  let n = [],
    t = [],
    i = 1,
    r = 2;
  for (; i < e.length; ) {
    let o = e[i];
    if (typeof o == 'string') r === 2 ? o !== '' && n.push(o, e[++i]) : r === 8 && t.push(o);
    else {
      if (!ft(r)) break;
      r = o;
    }
    i++;
  }
  return { attrs: n, classes: t };
}
function I(e) {
  return Cr(() => {
    let n = $p(e),
      t = oe(w({}, n), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Fp.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (n.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || Et.Emulated,
        styles: e.styles || tt,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: '',
      });
    Hp(t);
    let i = e.dependencies;
    return (t.directiveDefs = qf(i, !1)), (t.pipeDefs = qf(i, !0)), (t.id = e_(t)), t;
  });
}
function Kv(e) {
  return xn(e) || Bl(e);
}
function Xv(e) {
  return e !== null;
}
function Bn(e) {
  return Cr(() => ({
    type: e.type,
    bootstrap: e.bootstrap || tt,
    declarations: e.declarations || tt,
    imports: e.imports || tt,
    exports: e.exports || tt,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function Wf(e, n) {
  if (e == null) return Ft;
  let t = {};
  for (let i in e)
    if (e.hasOwnProperty(i)) {
      let r = e[i],
        o,
        s,
        a = rn.None;
      Array.isArray(r) ? ((a = r[0]), (o = r[1]), (s = r[2] ?? o)) : ((o = r), (s = r)),
        n ? ((t[o] = a !== rn.None ? [i, a] : i), (n[o] = s)) : (t[o] = i);
    }
  return t;
}
function ae(e) {
  return Cr(() => {
    let n = $p(e);
    return Hp(n), n;
  });
}
function xn(e) {
  return e[yv] || null;
}
function Bl(e) {
  return e[bv] || null;
}
function jp(e) {
  return e[Dv] || null;
}
function Bp(e) {
  let n = xn(e) || Bl(e) || jp(e);
  return n !== null ? n.standalone : !1;
}
function Vp(e, n) {
  let t = e[wv] || null;
  if (!t && n === !0) throw new Error(`Type ${Le(e)} does not have '\u0275mod' property.`);
  return t;
}
function $p(e) {
  let n = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: n,
    inputTransforms: null,
    inputConfig: e.inputs || Ft,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || tt,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Wf(e.inputs, n),
    outputs: Wf(e.outputs),
    debugInfo: null,
  };
}
function Hp(e) {
  e.features?.forEach((n) => n(e));
}
function qf(e, n) {
  if (!e) return null;
  let t = n ? jp : Kv;
  return () => (typeof e == 'function' ? e() : e).map((i) => t(i)).filter(Xv);
}
function e_(e) {
  let n = 0,
    t = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      e.consts,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ].join('|');
  for (let r of t) n = (Math.imul(31, n) + r.charCodeAt(0)) << 0;
  return (n += 2147483648), 'c' + n;
}
function Cs(e) {
  return { ɵproviders: e };
}
function t_(...e) {
  return { ɵproviders: Up(!0, e), ɵfromNgModule: !0 };
}
function Up(e, ...n) {
  let t = [],
    i = new Set(),
    r,
    o = (s) => {
      t.push(s);
    };
  return (
    Ll(n, (s) => {
      let a = s;
      Uc(a, o, [], i) && ((r ||= []), r.push(a));
    }),
    r !== void 0 && Gp(r, o),
    t
  );
}
function Gp(e, n) {
  for (let t = 0; t < e.length; t++) {
    let { ngModule: i, providers: r } = e[t];
    Vl(r, (o) => {
      n(o, i);
    });
  }
}
function Uc(e, n, t, i) {
  if (((e = Ce(e)), !e)) return !1;
  let r = null,
    o = Vf(e),
    s = !o && xn(e);
  if (!o && !s) {
    let c = e.ngModule;
    if (((o = Vf(c)), o)) r = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    r = e;
  }
  let a = i.has(r);
  if (s) {
    if (a) return !1;
    if ((i.add(r), s.dependencies)) {
      let c = typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies;
      for (let l of c) Uc(l, n, t, i);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      i.add(r);
      let l;
      try {
        Ll(o.imports, (u) => {
          Uc(u, n, t, i) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && Gp(l, n);
    }
    if (!a) {
      let l = Si(r) || (() => new r());
      n({ provide: r, useFactory: l, deps: tt }, r),
        n({ provide: kp, useValue: r, multi: !0 }, r),
        n({ provide: Ei, useValue: () => U(r), multi: !0 }, r);
    }
    let c = o.providers;
    if (c != null && !a) {
      let l = e;
      Vl(c, (u) => {
        n(u, l);
      });
    }
  } else return !1;
  return r !== e && e.providers !== void 0;
}
function Vl(e, n) {
  for (let t of e) Tp(t) && (t = t.ɵproviders), Array.isArray(t) ? Vl(t, n) : n(t);
}
var n_ = X({ provide: String, useValue: X });
function zp(e) {
  return e !== null && typeof e == 'object' && n_ in e;
}
function i_(e) {
  return !!(e && e.useExisting);
}
function r_(e) {
  return !!(e && e.useFactory);
}
function Ii(e) {
  return typeof e == 'function';
}
function o_(e) {
  return !!e.useClass;
}
var Ss = new A(''),
  zo = {},
  s_ = {},
  Mc;
function $l() {
  return Mc === void 0 && (Mc = new es()), Mc;
}
var We = class {},
  vr = class extends We {
    get destroyed() {
      return this._destroyed;
    }
    constructor(n, t, i, r) {
      super(),
        (this.parent = t),
        (this.source = i),
        (this.scopes = r),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        zc(n, (s) => this.processProvider(s)),
        this.records.set(Pp, yi(void 0, this)),
        r.has('environment') && this.records.set(We, yi(void 0, this));
      let o = this.records.get(Ss);
      o != null && typeof o.value == 'string' && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(kp, tt, $.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let n = W(null);
      try {
        for (let i of this._ngOnDestroyHooks) i.ngOnDestroy();
        let t = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let i of t) i();
      } finally {
        this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), W(n);
      }
    }
    onDestroy(n) {
      return this.assertNotDestroyed(), this._onDestroyHooks.push(n), () => this.removeOnDestroy(n);
    }
    runInContext(n) {
      this.assertNotDestroyed();
      let t = en(this),
        i = et(void 0),
        r;
      try {
        return n();
      } finally {
        en(t), et(i);
      }
    }
    get(n, t = gr, i = $.Default) {
      if ((this.assertNotDestroyed(), n.hasOwnProperty(Hf))) return n[Hf](this);
      i = ws(i);
      let r,
        o = en(this),
        s = et(void 0);
      try {
        if (!(i & $.SkipSelf)) {
          let c = this.records.get(n);
          if (c === void 0) {
            let l = d_(n) && Ds(n);
            l && this.injectableDefInScope(l) ? (c = yi(Gc(n), zo)) : (c = null),
              this.records.set(n, c);
          }
          if (c != null) return this.hydrate(n, c);
        }
        let a = i & $.Self ? $l() : this.parent;
        return (t = i & $.Optional && t === gr ? null : t), a.get(n, t);
      } catch (a) {
        if (a.name === 'NullInjectorError') {
          if (((a[Ko] = a[Ko] || []).unshift(Le(n)), o)) throw a;
          return Av(a, n, 'R3InjectorError', this.source);
        } else throw a;
      } finally {
        et(s), en(o);
      }
    }
    resolveInjectorInitializers() {
      let n = W(null),
        t = en(this),
        i = et(void 0),
        r;
      try {
        let o = this.get(Ei, tt, $.Self);
        for (let s of o) s();
      } finally {
        en(t), et(i), W(n);
      }
    }
    toString() {
      let n = [],
        t = this.records;
      for (let i of t.keys()) n.push(Le(i));
      return `R3Injector[${n.join(', ')}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new E(205, !1);
    }
    processProvider(n) {
      n = Ce(n);
      let t = Ii(n) ? n : Ce(n && n.provide),
        i = c_(n);
      if (!Ii(n) && n.multi === !0) {
        let r = this.records.get(t);
        r || ((r = yi(void 0, zo, !0)), (r.factory = () => $c(r.multi)), this.records.set(t, r)),
          (t = n),
          r.multi.push(n);
      }
      this.records.set(t, i);
    }
    hydrate(n, t) {
      let i = W(null);
      try {
        return (
          t.value === zo && ((t.value = s_), (t.value = t.factory())),
          typeof t.value == 'object' &&
            t.value &&
            u_(t.value) &&
            this._ngOnDestroyHooks.add(t.value),
          t.value
        );
      } finally {
        W(i);
      }
    }
    injectableDefInScope(n) {
      if (!n.providedIn) return !1;
      let t = Ce(n.providedIn);
      return typeof t == 'string'
        ? t === 'any' || this.scopes.has(t)
        : this.injectorDefTypes.has(t);
    }
    removeOnDestroy(n) {
      let t = this._onDestroyHooks.indexOf(n);
      t !== -1 && this._onDestroyHooks.splice(t, 1);
    }
  };
function Gc(e) {
  let n = Ds(e),
    t = n !== null ? n.factory : Si(e);
  if (t !== null) return t;
  if (e instanceof A) throw new E(204, !1);
  if (e instanceof Function) return a_(e);
  throw new E(204, !1);
}
function a_(e) {
  if (e.length > 0) throw new E(204, !1);
  let t = vv(e);
  return t !== null ? () => t.factory(e) : () => new e();
}
function c_(e) {
  if (zp(e)) return yi(void 0, e.useValue);
  {
    let n = Wp(e);
    return yi(n, zo);
  }
}
function Wp(e, n, t) {
  let i;
  if (Ii(e)) {
    let r = Ce(e);
    return Si(r) || Gc(r);
  } else if (zp(e)) i = () => Ce(e.useValue);
  else if (r_(e)) i = () => e.useFactory(...$c(e.deps || []));
  else if (i_(e)) i = () => U(Ce(e.useExisting));
  else {
    let r = Ce(e && (e.useClass || e.provide));
    if (l_(e)) i = () => new r(...$c(e.deps));
    else return Si(r) || Gc(r);
  }
  return i;
}
function yi(e, n, t = !1) {
  return { factory: e, value: n, multi: t ? [] : void 0 };
}
function l_(e) {
  return !!e.deps;
}
function u_(e) {
  return e !== null && typeof e == 'object' && typeof e.ngOnDestroy == 'function';
}
function d_(e) {
  return typeof e == 'function' || (typeof e == 'object' && e instanceof A);
}
function zc(e, n) {
  for (let t of e) Array.isArray(t) ? zc(t, n) : t && Tp(t) ? zc(t.ɵproviders, n) : n(t);
}
function xt(e, n) {
  e instanceof vr && e.assertNotDestroyed();
  let t,
    i = en(e),
    r = et(void 0);
  try {
    return n();
  } finally {
    en(i), et(r);
  }
}
function qp() {
  return xp() !== void 0 || xv() != null;
}
function Es(e) {
  if (!qp()) throw new E(-203, !1);
}
function f_(e) {
  return typeof e == 'function';
}
var Ht = 0,
  j = 1,
  N = 2,
  xe = 3,
  pt = 4,
  gt = 5,
  ts = 6,
  ns = 7,
  ht = 8,
  Mi = 9,
  Lt = 10,
  ge = 11,
  _r = 12,
  Qf = 13,
  Pi = 14,
  It = 15,
  Nn = 16,
  bi = 17,
  jt = 18,
  Is = 19,
  Qp = 20,
  tn = 21,
  Tc = 22,
  nt = 23,
  Mt = 25,
  Zp = 1;
var On = 7,
  is = 8,
  Ti = 9,
  ze = 10,
  rs = (function (e) {
    return (
      (e[(e.None = 0)] = 'None'), (e[(e.HasTransplantedViews = 2)] = 'HasTransplantedViews'), e
    );
  })(rs || {});
function nn(e) {
  return Array.isArray(e) && typeof e[Zp] == 'object';
}
function Ut(e) {
  return Array.isArray(e) && e[Zp] === !0;
}
function Hl(e) {
  return (e.flags & 4) !== 0;
}
function Ms(e) {
  return e.componentOffset > -1;
}
function Ts(e) {
  return (e.flags & 1) === 1;
}
function on(e) {
  return !!e.template;
}
function Wc(e) {
  return (e[N] & 512) !== 0;
}
var qc = class {
  constructor(n, t, i) {
    (this.previousValue = n), (this.currentValue = t), (this.firstChange = i);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Yp(e, n, t, i) {
  n !== null ? n.applyValueToInputSignal(n, i) : (e[t] = i);
}
function Vn() {
  return Jp;
}
function Jp(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = h_), p_;
}
Vn.ngInherit = !0;
function p_() {
  let e = Xp(this),
    n = e?.current;
  if (n) {
    let t = e.previous;
    if (t === Ft) e.previous = n;
    else for (let i in n) t[i] = n[i];
    (e.current = null), this.ngOnChanges(n);
  }
}
function h_(e, n, t, i, r) {
  let o = this.declaredInputs[i],
    s = Xp(e) || g_(e, { previous: Ft, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    l = c[o];
  (a[o] = new qc(l && l.currentValue, t, c === Ft)), Yp(e, n, r, t);
}
var Kp = '__ngSimpleChanges__';
function Xp(e) {
  return e[Kp] || null;
}
function g_(e, n) {
  return (e[Kp] = n);
}
var Zf = null;
var Ct = function (e, n, t) {
    Zf?.(e, n, t);
  },
  eh = 'svg',
  m_ = 'math';
function Tt(e) {
  for (; Array.isArray(e); ) e = e[Ht];
  return e;
}
function th(e, n) {
  return Tt(n[e]);
}
function it(e, n) {
  return Tt(n[e.index]);
}
function nh(e, n) {
  return e.data[n];
}
function v_(e, n) {
  return e[n];
}
function cn(e, n) {
  let t = n[e];
  return nn(t) ? t : t[Ht];
}
function __(e) {
  return (e[N] & 4) === 4;
}
function Ul(e) {
  return (e[N] & 128) === 128;
}
function y_(e) {
  return Ut(e[xe]);
}
function xi(e, n) {
  return n == null ? null : e[n];
}
function ih(e) {
  e[bi] = 0;
}
function rh(e) {
  e[N] & 1024 || ((e[N] |= 1024), Ul(e) && xs(e));
}
function b_(e, n) {
  for (; e > 0; ) (n = n[Pi]), e--;
  return n;
}
function yr(e) {
  return !!(e[N] & 9216 || e[nt]?.dirty);
}
function Qc(e) {
  e[Lt].changeDetectionScheduler?.notify(7), e[N] & 64 && (e[N] |= 1024), yr(e) && xs(e);
}
function xs(e) {
  e[Lt].changeDetectionScheduler?.notify(0);
  let n = An(e);
  for (; n !== null && !(n[N] & 8192 || ((n[N] |= 8192), !Ul(n))); ) n = An(n);
}
function oh(e, n) {
  if ((e[N] & 256) === 256) throw new E(911, !1);
  e[tn] === null && (e[tn] = []), e[tn].push(n);
}
function D_(e, n) {
  if (e[tn] === null) return;
  let t = e[tn].indexOf(n);
  t !== -1 && e[tn].splice(t, 1);
}
function An(e) {
  let n = e[xe];
  return Ut(n) ? n[xe] : n;
}
var k = { lFrame: hh(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var sh = !1;
function w_() {
  return k.lFrame.elementDepthCount;
}
function C_() {
  k.lFrame.elementDepthCount++;
}
function S_() {
  k.lFrame.elementDepthCount--;
}
function ah() {
  return k.bindingsEnabled;
}
function E_() {
  return k.skipHydrationRootTNode !== null;
}
function I_(e) {
  return k.skipHydrationRootTNode === e;
}
function M_() {
  k.skipHydrationRootTNode = null;
}
function Y() {
  return k.lFrame.lView;
}
function Se() {
  return k.lFrame.tView;
}
function ki(e) {
  return (k.lFrame.contextLView = e), e[ht];
}
function Fi(e) {
  return (k.lFrame.contextLView = null), e;
}
function je() {
  let e = ch();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function ch() {
  return k.lFrame.currentTNode;
}
function T_() {
  let e = k.lFrame,
    n = e.currentTNode;
  return e.isParent ? n : n.parent;
}
function $n(e, n) {
  let t = k.lFrame;
  (t.currentTNode = e), (t.isParent = n);
}
function Gl() {
  return k.lFrame.isParent;
}
function lh() {
  k.lFrame.isParent = !1;
}
function x_() {
  return k.lFrame.contextLView;
}
function uh() {
  return sh;
}
function Yf(e) {
  sh = e;
}
function N_() {
  let e = k.lFrame,
    n = e.bindingRootIndex;
  return n === -1 && (n = e.bindingRootIndex = e.tView.bindingStartIndex), n;
}
function O_(e) {
  return (k.lFrame.bindingIndex = e);
}
function Ns() {
  return k.lFrame.bindingIndex++;
}
function A_(e) {
  let n = k.lFrame,
    t = n.bindingIndex;
  return (n.bindingIndex = n.bindingIndex + e), t;
}
function R_() {
  return k.lFrame.inI18n;
}
function P_(e, n) {
  let t = k.lFrame;
  (t.bindingIndex = t.bindingRootIndex = e), Zc(n);
}
function k_() {
  return k.lFrame.currentDirectiveIndex;
}
function Zc(e) {
  k.lFrame.currentDirectiveIndex = e;
}
function F_(e) {
  let n = k.lFrame.currentDirectiveIndex;
  return n === -1 ? null : e[n];
}
function dh() {
  return k.lFrame.currentQueryIndex;
}
function zl(e) {
  k.lFrame.currentQueryIndex = e;
}
function L_(e) {
  let n = e[j];
  return n.type === 2 ? n.declTNode : n.type === 1 ? e[gt] : null;
}
function fh(e, n, t) {
  if (t & $.SkipSelf) {
    let r = n,
      o = e;
    for (; (r = r.parent), r === null && !(t & $.Host); )
      if (((r = L_(o)), r === null || ((o = o[Pi]), r.type & 10))) break;
    if (r === null) return !1;
    (n = r), (e = o);
  }
  let i = (k.lFrame = ph());
  return (i.currentTNode = n), (i.lView = e), !0;
}
function Wl(e) {
  let n = ph(),
    t = e[j];
  (k.lFrame = n),
    (n.currentTNode = t.firstChild),
    (n.lView = e),
    (n.tView = t),
    (n.contextLView = e),
    (n.bindingIndex = t.bindingStartIndex),
    (n.inI18n = !1);
}
function ph() {
  let e = k.lFrame,
    n = e === null ? null : e.child;
  return n === null ? hh(e) : n;
}
function hh(e) {
  let n = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = n), n;
}
function gh() {
  let e = k.lFrame;
  return (k.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var mh = gh;
function ql() {
  let e = gh();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function j_(e) {
  return (k.lFrame.contextLView = b_(e, k.lFrame.contextLView))[ht];
}
function Li() {
  return k.lFrame.selectedIndex;
}
function Rn(e) {
  k.lFrame.selectedIndex = e;
}
function Ql() {
  let e = k.lFrame;
  return nh(e.tView, e.selectedIndex);
}
function ji() {
  k.lFrame.currentNamespace = eh;
}
function Bi() {
  B_();
}
function B_() {
  k.lFrame.currentNamespace = null;
}
function V_() {
  return k.lFrame.currentNamespace;
}
var vh = !0;
function Os() {
  return vh;
}
function As(e) {
  vh = e;
}
function $_(e, n, t) {
  let { ngOnChanges: i, ngOnInit: r, ngDoCheck: o } = n.type.prototype;
  if (i) {
    let s = Jp(n);
    (t.preOrderHooks ??= []).push(e, s), (t.preOrderCheckHooks ??= []).push(e, s);
  }
  r && (t.preOrderHooks ??= []).push(0 - e, r),
    o && ((t.preOrderHooks ??= []).push(e, o), (t.preOrderCheckHooks ??= []).push(e, o));
}
function Rs(e, n) {
  for (let t = n.directiveStart, i = n.directiveEnd; t < i; t++) {
    let o = e.data[t].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = o;
    s && (e.contentHooks ??= []).push(-t, s),
      a && ((e.contentHooks ??= []).push(t, a), (e.contentCheckHooks ??= []).push(t, a)),
      c && (e.viewHooks ??= []).push(-t, c),
      l && ((e.viewHooks ??= []).push(t, l), (e.viewCheckHooks ??= []).push(t, l)),
      u != null && (e.destroyHooks ??= []).push(t, u);
  }
}
function Wo(e, n, t) {
  _h(e, n, 3, t);
}
function qo(e, n, t, i) {
  (e[N] & 3) === t && _h(e, n, t, i);
}
function xc(e, n) {
  let t = e[N];
  (t & 3) === n && ((t &= 16383), (t += 1), (e[N] = t));
}
function _h(e, n, t, i) {
  let r = i !== void 0 ? e[bi] & 65535 : 0,
    o = i ?? -1,
    s = n.length - 1,
    a = 0;
  for (let c = r; c < s; c++)
    if (typeof n[c + 1] == 'number') {
      if (((a = n[c]), i != null && a >= i)) break;
    } else
      n[c] < 0 && (e[bi] += 65536),
        (a < o || o == -1) && (H_(e, t, n, c), (e[bi] = (e[bi] & 4294901760) + c + 2)),
        c++;
}
function Jf(e, n) {
  Ct(4, e, n);
  let t = W(null);
  try {
    n.call(e);
  } finally {
    W(t), Ct(5, e, n);
  }
}
function H_(e, n, t, i) {
  let r = t[i] < 0,
    o = t[i + 1],
    s = r ? -t[i] : t[i],
    a = e[s];
  r ? e[N] >> 14 < e[bi] >> 16 && (e[N] & 3) === n && ((e[N] += 16384), Jf(a, o)) : Jf(a, o);
}
var Ci = -1,
  Pn = class {
    constructor(n, t, i) {
      (this.factory = n),
        (this.resolving = !1),
        (this.canSeeViewProviders = t),
        (this.injectImpl = i);
    }
  };
function U_(e) {
  return e instanceof Pn;
}
function G_(e) {
  return (e.flags & 8) !== 0;
}
function z_(e) {
  return (e.flags & 16) !== 0;
}
var Nc = {},
  Yc = class {
    constructor(n, t) {
      (this.injector = n), (this.parentInjector = t);
    }
    get(n, t, i) {
      i = ws(i);
      let r = this.injector.get(n, Nc, i);
      return r !== Nc || t === Nc ? r : this.parentInjector.get(n, t, i);
    }
  };
function yh(e) {
  return e !== Ci;
}
function os(e) {
  return e & 32767;
}
function W_(e) {
  return e >> 16;
}
function ss(e, n) {
  let t = W_(e),
    i = n;
  for (; t > 0; ) (i = i[Pi]), t--;
  return i;
}
var Jc = !0;
function Kf(e) {
  let n = Jc;
  return (Jc = e), n;
}
var q_ = 256,
  bh = q_ - 1,
  Dh = 5,
  Q_ = 0,
  St = {};
function Z_(e, n, t) {
  let i;
  typeof t == 'string' ? (i = t.charCodeAt(0) || 0) : t.hasOwnProperty(hr) && (i = t[hr]),
    i == null && (i = t[hr] = Q_++);
  let r = i & bh,
    o = 1 << r;
  n.data[e + (r >> Dh)] |= o;
}
function as(e, n) {
  let t = wh(e, n);
  if (t !== -1) return t;
  let i = n[j];
  i.firstCreatePass &&
    ((e.injectorIndex = n.length), Oc(i.data, e), Oc(n, null), Oc(i.blueprint, null));
  let r = Zl(e, n),
    o = e.injectorIndex;
  if (yh(r)) {
    let s = os(r),
      a = ss(r, n),
      c = a[j].data;
    for (let l = 0; l < 8; l++) n[o + l] = a[s + l] | c[s + l];
  }
  return (n[o + 8] = r), o;
}
function Oc(e, n) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, n);
}
function wh(e, n) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    n[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Zl(e, n) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let t = 0,
    i = null,
    r = n;
  for (; r !== null; ) {
    if (((i = Mh(r)), i === null)) return Ci;
    if ((t++, (r = r[Pi]), i.injectorIndex !== -1)) return i.injectorIndex | (t << 16);
  }
  return Ci;
}
function Kc(e, n, t) {
  Z_(e, n, t);
}
function Ch(e, n, t) {
  if (t & $.Optional || e !== void 0) return e;
  kl(n, 'NodeInjector');
}
function Sh(e, n, t, i) {
  if ((t & $.Optional && i === void 0 && (i = null), !(t & ($.Self | $.Host)))) {
    let r = e[Mi],
      o = et(void 0);
    try {
      return r ? r.get(n, i, t & $.Optional) : Np(n, i, t & $.Optional);
    } finally {
      et(o);
    }
  }
  return Ch(i, n, t);
}
function Eh(e, n, t, i = $.Default, r) {
  if (e !== null) {
    if (n[N] & 2048 && !(i & $.Self)) {
      let s = X_(e, n, t, i, St);
      if (s !== St) return s;
    }
    let o = Ih(e, n, t, i, St);
    if (o !== St) return o;
  }
  return Sh(n, t, i, r);
}
function Ih(e, n, t, i, r) {
  let o = J_(t);
  if (typeof o == 'function') {
    if (!fh(n, e, i)) return i & $.Host ? Ch(r, t, i) : Sh(n, t, i, r);
    try {
      let s;
      if (((s = o(i)), s == null && !(i & $.Optional))) kl(t);
      else return s;
    } finally {
      mh();
    }
  } else if (typeof o == 'number') {
    let s = null,
      a = wh(e, n),
      c = Ci,
      l = i & $.Host ? n[It][gt] : null;
    for (
      (a === -1 || i & $.SkipSelf) &&
      ((c = a === -1 ? Zl(e, n) : n[a + 8]),
      c === Ci || !ep(i, !1) ? (a = -1) : ((s = n[j]), (a = os(c)), (n = ss(c, n))));
      a !== -1;

    ) {
      let u = n[j];
      if (Xf(o, a, u.data)) {
        let d = Y_(a, n, t, s, i, l);
        if (d !== St) return d;
      }
      (c = n[a + 8]),
        c !== Ci && ep(i, n[j].data[a + 8] === l) && Xf(o, a, n)
          ? ((s = u), (a = os(c)), (n = ss(c, n)))
          : (a = -1);
    }
  }
  return r;
}
function Y_(e, n, t, i, r, o) {
  let s = n[j],
    a = s.data[e + 8],
    c = i == null ? Ms(a) && Jc : i != s && (a.type & 3) !== 0,
    l = r & $.Host && o === a,
    u = Qo(a, s, t, c, l);
  return u !== null ? kn(n, s, u, a) : St;
}
function Qo(e, n, t, i, r) {
  let o = e.providerIndexes,
    s = n.data,
    a = o & 1048575,
    c = e.directiveStart,
    l = e.directiveEnd,
    u = o >> 20,
    d = i ? a : a + u,
    g = r ? a + u : l;
  for (let f = d; f < g; f++) {
    let _ = s[f];
    if ((f < c && t === _) || (f >= c && _.type === t)) return f;
  }
  if (r) {
    let f = s[c];
    if (f && on(f) && f.type === t) return c;
  }
  return null;
}
function kn(e, n, t, i) {
  let r = e[t],
    o = n.data;
  if (U_(r)) {
    let s = r;
    s.resolving && Sv(Cv(o[t]));
    let a = Kf(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      l = s.injectImpl ? et(s.injectImpl) : null,
      u = fh(e, i, $.Default);
    try {
      (r = e[t] = s.factory(void 0, o, e, i)),
        n.firstCreatePass && t >= i.directiveStart && $_(t, o[t], n);
    } finally {
      l !== null && et(l), Kf(a), (s.resolving = !1), mh();
    }
  }
  return r;
}
function J_(e) {
  if (typeof e == 'string') return e.charCodeAt(0) || 0;
  let n = e.hasOwnProperty(hr) ? e[hr] : void 0;
  return typeof n == 'number' ? (n >= 0 ? n & bh : K_) : n;
}
function Xf(e, n, t) {
  let i = 1 << e;
  return !!(t[n + (e >> Dh)] & i);
}
function ep(e, n) {
  return !(e & $.Self) && !(e & $.Host && n);
}
var Tn = class {
  constructor(n, t) {
    (this._tNode = n), (this._lView = t);
  }
  get(n, t, i) {
    return Eh(this._tNode, this._lView, n, ws(i), t);
  }
};
function K_() {
  return new Tn(je(), Y());
}
function Er(e) {
  return Cr(() => {
    let n = e.prototype.constructor,
      t = n[Jo] || Xc(n),
      i = Object.prototype,
      r = Object.getPrototypeOf(e.prototype).constructor;
    for (; r && r !== i; ) {
      let o = r[Jo] || Xc(r);
      if (o && o !== t) return o;
      r = Object.getPrototypeOf(r);
    }
    return (o) => new o();
  });
}
function Xc(e) {
  return Sp(e)
    ? () => {
        let n = Xc(Ce(e));
        return n && n();
      }
    : Si(e);
}
function X_(e, n, t, i, r) {
  let o = e,
    s = n;
  for (; o !== null && s !== null && s[N] & 2048 && !(s[N] & 512); ) {
    let a = Ih(o, s, t, i | $.Self, St);
    if (a !== St) return a;
    let c = o.parent;
    if (!c) {
      let l = s[Qp];
      if (l) {
        let u = l.get(t, St, i);
        if (u !== St) return u;
      }
      (c = Mh(s)), (s = s[Pi]);
    }
    o = c;
  }
  return r;
}
function Mh(e) {
  let n = e[j],
    t = n.type;
  return t === 2 ? n.declTNode : t === 1 ? e[gt] : null;
}
function tp(e, n = null, t = null, i) {
  let r = Th(e, n, t, i);
  return r.resolveInjectorInitializers(), r;
}
function Th(e, n = null, t = null, i, r = new Set()) {
  let o = [t || tt, t_(e)];
  return (i = i || (typeof e == 'object' ? void 0 : Le(e))), new vr(o, n || $l(), i || null, r);
}
var qe = class e {
  static {
    this.THROW_IF_NOT_FOUND = gr;
  }
  static {
    this.NULL = new es();
  }
  static create(n, t) {
    if (Array.isArray(n)) return tp({ name: '' }, t, n, '');
    {
      let i = n.name ?? '';
      return tp({ name: i }, n.parent, n.providers, i);
    }
  }
  static {
    this.ɵprov = C({ token: e, providedIn: 'any', factory: () => U(Pp) });
  }
  static {
    this.__NG_ELEMENT_ID__ = -1;
  }
};
var ey = new A('');
ey.__NG_ELEMENT_ID__ = (e) => {
  let n = je();
  if (n === null) throw new E(204, !1);
  if (n.type & 2) return n.value;
  if (e & $.Optional) return null;
  throw new E(204, !1);
};
var ty = 'ngOriginalError';
function Ac(e) {
  return e[ty];
}
var Hn = (() => {
    class e {
      static {
        this.__NG_ELEMENT_ID__ = ny;
      }
      static {
        this.__NG_ENV_ID__ = (t) => t;
      }
    }
    return e;
  })(),
  el = class extends Hn {
    constructor(n) {
      super(), (this._lView = n);
    }
    onDestroy(n) {
      return oh(this._lView, n), () => D_(this._lView, n);
    }
  };
function ny() {
  return new el(Y());
}
var Vi = (() => {
  class e {
    constructor() {
      (this.taskId = 0), (this.pendingTasks = new Set()), (this.hasPendingTasks = new _e(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let t = this.taskId++;
      return this.pendingTasks.add(t), t;
    }
    remove(t) {
      this.pendingTasks.delete(t),
        this.pendingTasks.size === 0 && this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(), this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
    static {
      this.ɵprov = C({ token: e, providedIn: 'root', factory: () => new e() });
    }
  }
  return e;
})();
var tl = class extends fe {
    constructor(n = !1) {
      super(),
        (this.destroyRef = void 0),
        (this.pendingTasks = void 0),
        (this.__isAsync = n),
        qp() &&
          ((this.destroyRef = v(Hn, { optional: !0 }) ?? void 0),
          (this.pendingTasks = v(Vi, { optional: !0 }) ?? void 0));
    }
    emit(n) {
      let t = W(null);
      try {
        super.next(n);
      } finally {
        W(t);
      }
    }
    subscribe(n, t, i) {
      let r = n,
        o = t || (() => null),
        s = i;
      if (n && typeof n == 'object') {
        let c = n;
        (r = c.next?.bind(c)), (o = c.error?.bind(c)), (s = c.complete?.bind(c));
      }
      this.__isAsync &&
        ((o = this.wrapInTimeout(o)),
        r && (r = this.wrapInTimeout(r)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: r, error: o, complete: s });
      return n instanceof se && n.add(a), a;
    }
    wrapInTimeout(n) {
      return (t) => {
        let i = this.pendingTasks?.add();
        setTimeout(() => {
          n(t), i !== void 0 && this.pendingTasks?.remove(i);
        });
      };
    }
  },
  Z = tl;
function cs(...e) {}
function xh(e) {
  let n, t;
  function i() {
    e = cs;
    try {
      t !== void 0 && typeof cancelAnimationFrame == 'function' && cancelAnimationFrame(t),
        n !== void 0 && clearTimeout(n);
    } catch {}
  }
  return (
    (n = setTimeout(() => {
      e(), i();
    })),
    typeof requestAnimationFrame == 'function' &&
      (t = requestAnimationFrame(() => {
        e(), i();
      })),
    () => i()
  );
}
function np(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = cs;
    }
  );
}
var Yl = 'isAngularZone',
  ls = Yl + '_ID',
  iy = 0,
  ie = class e {
    constructor({
      enableLongStackTrace: n = !1,
      shouldCoalesceEventChangeDetection: t = !1,
      shouldCoalesceRunChangeDetection: i = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new Z(!1)),
        (this.onMicrotaskEmpty = new Z(!1)),
        (this.onStable = new Z(!1)),
        (this.onError = new Z(!1)),
        typeof Zone > 'u')
      )
        throw new E(908, !1);
      Zone.assertZonePatched();
      let r = this;
      (r._nesting = 0),
        (r._outer = r._inner = Zone.current),
        Zone.TaskTrackingZoneSpec && (r._inner = r._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n && Zone.longStackTraceZoneSpec && (r._inner = r._inner.fork(Zone.longStackTraceZoneSpec)),
        (r.shouldCoalesceEventChangeDetection = !i && t),
        (r.shouldCoalesceRunChangeDetection = i),
        (r.callbackScheduled = !1),
        sy(r);
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get(Yl) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new E(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new E(909, !1);
    }
    run(n, t, i) {
      return this._inner.run(n, t, i);
    }
    runTask(n, t, i, r) {
      let o = this._inner,
        s = o.scheduleEventTask('NgZoneEvent: ' + r, n, ry, cs, cs);
      try {
        return o.runTask(s, t, i);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(n, t, i) {
      return this._inner.runGuarded(n, t, i);
    }
    runOutsideAngular(n) {
      return this._outer.run(n);
    }
  },
  ry = {};
function Jl(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function oy(e) {
  e.isCheckStableRunning ||
    e.callbackScheduled ||
    ((e.callbackScheduled = !0),
    Zone.root.run(() => {
      xh(() => {
        (e.callbackScheduled = !1),
          nl(e),
          (e.isCheckStableRunning = !0),
          Jl(e),
          (e.isCheckStableRunning = !1);
      });
    }),
    nl(e));
}
function sy(e) {
  let n = () => {
      oy(e);
    },
    t = iy++;
  e._inner = e._inner.fork({
    name: 'angular',
    properties: { [Yl]: !0, [ls]: t, [ls + t]: !0 },
    onInvokeTask: (i, r, o, s, a, c) => {
      if (ay(c)) return i.invokeTask(o, s, a, c);
      try {
        return ip(e), i.invokeTask(o, s, a, c);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === 'eventTask') ||
          e.shouldCoalesceRunChangeDetection) &&
          n(),
          rp(e);
      }
    },
    onInvoke: (i, r, o, s, a, c, l) => {
      try {
        return ip(e), i.invoke(o, s, a, c, l);
      } finally {
        e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !cy(c) && n(), rp(e);
      }
    },
    onHasTask: (i, r, o, s) => {
      i.hasTask(o, s),
        r === o &&
          (s.change == 'microTask'
            ? ((e._hasPendingMicrotasks = s.microTask), nl(e), Jl(e))
            : s.change == 'macroTask' && (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (i, r, o, s) => (
      i.handleError(o, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function nl(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function ip(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function rp(e) {
  e._nesting--, Jl(e);
}
var il = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new Z()),
      (this.onMicrotaskEmpty = new Z()),
      (this.onStable = new Z()),
      (this.onError = new Z());
  }
  run(n, t, i) {
    return n.apply(t, i);
  }
  runGuarded(n, t, i) {
    return n.apply(t, i);
  }
  runOutsideAngular(n) {
    return n();
  }
  runTask(n, t, i, r) {
    return n.apply(t, i);
  }
};
function ay(e) {
  return Nh(e, '__ignore_ng_zone__');
}
function cy(e) {
  return Nh(e, '__scheduler_tick__');
}
function Nh(e, n) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[n] === !0;
}
var Bt = class {
    constructor() {
      this._console = console;
    }
    handleError(n) {
      let t = this._findOriginalError(n);
      this._console.error('ERROR', n), t && this._console.error('ORIGINAL ERROR', t);
    }
    _findOriginalError(n) {
      let t = n && Ac(n);
      for (; t && Ac(t); ) t = Ac(t);
      return t || null;
    }
  },
  ly = new A('', {
    providedIn: 'root',
    factory: () => {
      let e = v(ie),
        n = v(Bt);
      return (t) => e.runOutsideAngular(() => n.handleError(t));
    },
  });
function uy() {
  return $i(je(), Y());
}
function $i(e, n) {
  return new Be(it(e, n));
}
var Be = (() => {
  class e {
    constructor(t) {
      this.nativeElement = t;
    }
    static {
      this.__NG_ELEMENT_ID__ = uy;
    }
  }
  return e;
})();
function dy(e) {
  return e instanceof Be ? e.nativeElement : e;
}
function fy() {
  return this._results[Symbol.iterator]();
}
var rl = class e {
  get changes() {
    return (this._changes ??= new Z());
  }
  constructor(n = !1) {
    (this._emitDistinctChangesOnly = n),
      (this.dirty = !0),
      (this._onDirty = void 0),
      (this._results = []),
      (this._changesDetected = !1),
      (this._changes = void 0),
      (this.length = 0),
      (this.first = void 0),
      (this.last = void 0);
    let t = e.prototype;
    t[Symbol.iterator] || (t[Symbol.iterator] = fy);
  }
  get(n) {
    return this._results[n];
  }
  map(n) {
    return this._results.map(n);
  }
  filter(n) {
    return this._results.filter(n);
  }
  find(n) {
    return this._results.find(n);
  }
  reduce(n, t) {
    return this._results.reduce(n, t);
  }
  forEach(n) {
    this._results.forEach(n);
  }
  some(n) {
    return this._results.some(n);
  }
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  reset(n, t) {
    this.dirty = !1;
    let i = kv(n);
    (this._changesDetected = !Pv(this._results, i, t)) &&
      ((this._results = i),
      (this.length = i.length),
      (this.last = i[this.length - 1]),
      (this.first = i[0]));
  }
  notifyOnChanges() {
    this._changes !== void 0 &&
      (this._changesDetected || !this._emitDistinctChangesOnly) &&
      this._changes.emit(this);
  }
  onDirty(n) {
    this._onDirty = n;
  }
  setDirty() {
    (this.dirty = !0), this._onDirty?.();
  }
  destroy() {
    this._changes !== void 0 && (this._changes.complete(), this._changes.unsubscribe());
  }
};
function Oh(e) {
  return (e.flags & 128) === 128;
}
var Ah = new Map(),
  py = 0;
function hy() {
  return py++;
}
function gy(e) {
  Ah.set(e[Is], e);
}
function my(e) {
  Ah.delete(e[Is]);
}
var op = '__ngContext__';
function sn(e, n) {
  nn(n) ? ((e[op] = n[Is]), gy(n)) : (e[op] = n);
}
function Rh(e) {
  return kh(e[_r]);
}
function Ph(e) {
  return kh(e[pt]);
}
function kh(e) {
  for (; e !== null && !Ut(e); ) e = e[pt];
  return e;
}
var ol;
function Fh(e) {
  ol = e;
}
function vy() {
  if (ol !== void 0) return ol;
  if (typeof document < 'u') return document;
  throw new E(210, !1);
}
var Kl = new A('', { providedIn: 'root', factory: () => _y }),
  _y = 'ng',
  Xl = new A(''),
  ln = new A('', { providedIn: 'platform', factory: () => 'unknown' });
var eu = new A('', {
  providedIn: 'root',
  factory: () => vy().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') || null,
});
var yy = 'h',
  by = 'b';
var Dy = () => null;
function tu(e, n, t = !1) {
  return Dy(e, n, t);
}
var Lh = !1,
  wy = new A('', { providedIn: 'root', factory: () => Lh });
var sl = class {
  constructor(n) {
    this.changingThisBreaksApplicationSecurity = n;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${pv})`;
  }
};
function nu(e) {
  return e instanceof sl ? e.changingThisBreaksApplicationSecurity : e;
}
var Cy = /^>|^->|<!--|-->|--!>|<!-$/g,
  Sy = /(<|>)/g,
  Ey = '\u200B$1\u200B';
function Iy(e) {
  return e.replace(Cy, (n) => n.replace(Sy, Ey));
}
function jh(e) {
  return e instanceof Function ? e() : e;
}
function Bh(e) {
  return (e ?? v(qe)).get(ln) === 'browser';
}
var Vt = (function (e) {
    return (e[(e.Important = 1)] = 'Important'), (e[(e.DashCase = 2)] = 'DashCase'), e;
  })(Vt || {}),
  My;
function iu(e, n) {
  return My(e, n);
}
function Di(e, n, t, i, r) {
  if (i != null) {
    let o,
      s = !1;
    Ut(i) ? (o = i) : nn(i) && ((s = !0), (i = i[Ht]));
    let a = Tt(i);
    e === 0 && t !== null
      ? r == null
        ? Gh(n, t, a)
        : us(n, t, a, r || null, !0)
      : e === 1 && t !== null
        ? us(n, t, a, r || null, !0)
        : e === 2
          ? Uy(n, a, s)
          : e === 3 && n.destroyNode(a),
      o != null && zy(n, e, o, t, r);
  }
}
function Ty(e, n) {
  return e.createText(n);
}
function xy(e, n, t) {
  e.setValue(n, t);
}
function Ny(e, n) {
  return e.createComment(Iy(n));
}
function Vh(e, n, t) {
  return e.createElement(n, t);
}
function Oy(e, n) {
  $h(e, n), (n[Ht] = null), (n[gt] = null);
}
function Ay(e, n, t, i, r, o) {
  (i[Ht] = r), (i[gt] = n), ks(e, i, t, 1, r, o);
}
function $h(e, n) {
  n[Lt].changeDetectionScheduler?.notify(8), ks(e, n, n[ge], 2, null, null);
}
function Ry(e) {
  let n = e[_r];
  if (!n) return Rc(e[j], e);
  for (; n; ) {
    let t = null;
    if (nn(n)) t = n[_r];
    else {
      let i = n[ze];
      i && (t = i);
    }
    if (!t) {
      for (; n && !n[pt] && n !== e; ) nn(n) && Rc(n[j], n), (n = n[xe]);
      n === null && (n = e), nn(n) && Rc(n[j], n), (t = n && n[pt]);
    }
    n = t;
  }
}
function Py(e, n, t, i) {
  let r = ze + i,
    o = t.length;
  i > 0 && (t[r - 1][pt] = n),
    i < o - ze ? ((n[pt] = t[r]), Rp(t, ze + i, n)) : (t.push(n), (n[pt] = null)),
    (n[xe] = t);
  let s = n[Nn];
  s !== null && t !== s && Hh(s, n);
  let a = n[jt];
  a !== null && a.insertView(e), Qc(n), (n[N] |= 128);
}
function Hh(e, n) {
  let t = e[Ti],
    i = n[xe];
  if (nn(i)) e[N] |= rs.HasTransplantedViews;
  else {
    let r = i[xe][It];
    n[It] !== r && (e[N] |= rs.HasTransplantedViews);
  }
  t === null ? (e[Ti] = [n]) : t.push(n);
}
function ru(e, n) {
  let t = e[Ti],
    i = t.indexOf(n);
  t.splice(i, 1);
}
function al(e, n) {
  if (e.length <= ze) return;
  let t = ze + n,
    i = e[t];
  if (i) {
    let r = i[Nn];
    r !== null && r !== e && ru(r, i), n > 0 && (e[t - 1][pt] = i[pt]);
    let o = Xo(e, ze + n);
    Oy(i[j], i);
    let s = o[jt];
    s !== null && s.detachView(o[j]), (i[xe] = null), (i[pt] = null), (i[N] &= -129);
  }
  return i;
}
function Uh(e, n) {
  if (!(n[N] & 256)) {
    let t = n[ge];
    t.destroyNode && ks(e, n, t, 3, null, null), Ry(n);
  }
}
function Rc(e, n) {
  if (n[N] & 256) return;
  let t = W(null);
  try {
    (n[N] &= -129),
      (n[N] |= 256),
      n[nt] && ic(n[nt]),
      Fy(e, n),
      ky(e, n),
      n[j].type === 1 && n[ge].destroy();
    let i = n[Nn];
    if (i !== null && Ut(n[xe])) {
      i !== n[xe] && ru(i, n);
      let r = n[jt];
      r !== null && r.detachView(e);
    }
    my(n);
  } finally {
    W(t);
  }
}
function ky(e, n) {
  let t = e.cleanup,
    i = n[ns];
  if (t !== null)
    for (let o = 0; o < t.length - 1; o += 2)
      if (typeof t[o] == 'string') {
        let s = t[o + 3];
        s >= 0 ? i[s]() : i[-s].unsubscribe(), (o += 2);
      } else {
        let s = i[t[o + 1]];
        t[o].call(s);
      }
  i !== null && (n[ns] = null);
  let r = n[tn];
  if (r !== null) {
    n[tn] = null;
    for (let o = 0; o < r.length; o++) {
      let s = r[o];
      s();
    }
  }
}
function Fy(e, n) {
  let t;
  if (e != null && (t = e.destroyHooks) != null)
    for (let i = 0; i < t.length; i += 2) {
      let r = n[t[i]];
      if (!(r instanceof Pn)) {
        let o = t[i + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = r[o[s]],
              c = o[s + 1];
            Ct(4, a, c);
            try {
              c.call(a);
            } finally {
              Ct(5, a, c);
            }
          }
        else {
          Ct(4, r, o);
          try {
            o.call(r);
          } finally {
            Ct(5, r, o);
          }
        }
      }
    }
}
function Ly(e, n, t) {
  return jy(e, n.parent, t);
}
function jy(e, n, t) {
  let i = n;
  for (; i !== null && i.type & 168; ) (n = i), (i = n.parent);
  if (i === null) return t[Ht];
  {
    let { componentOffset: r } = i;
    if (r > -1) {
      let { encapsulation: o } = e.data[i.directiveStart + r];
      if (o === Et.None || o === Et.Emulated) return null;
    }
    return it(i, t);
  }
}
function us(e, n, t, i, r) {
  e.insertBefore(n, t, i, r);
}
function Gh(e, n, t) {
  e.appendChild(n, t);
}
function sp(e, n, t, i, r) {
  i !== null ? us(e, n, t, i, r) : Gh(e, n, t);
}
function zh(e, n) {
  return e.parentNode(n);
}
function By(e, n) {
  return e.nextSibling(n);
}
function Vy(e, n, t) {
  return Hy(e, n, t);
}
function $y(e, n, t) {
  return e.type & 40 ? it(e, t) : null;
}
var Hy = $y,
  ap;
function Ps(e, n, t, i) {
  let r = Ly(e, i, n),
    o = n[ge],
    s = i.parent || n[gt],
    a = Vy(s, i, n);
  if (r != null)
    if (Array.isArray(t)) for (let c = 0; c < t.length; c++) sp(o, r, t[c], a, !1);
    else sp(o, r, t, a, !1);
  ap !== void 0 && ap(o, i, n, t, r);
}
function pr(e, n) {
  if (n !== null) {
    let t = n.type;
    if (t & 3) return it(n, e);
    if (t & 4) return cl(-1, e[n.index]);
    if (t & 8) {
      let i = n.child;
      if (i !== null) return pr(e, i);
      {
        let r = e[n.index];
        return Ut(r) ? cl(-1, r) : Tt(r);
      }
    } else {
      if (t & 128) return pr(e, n.next);
      if (t & 32) return iu(n, e)() || Tt(e[n.index]);
      {
        let i = Wh(e, n);
        if (i !== null) {
          if (Array.isArray(i)) return i[0];
          let r = An(e[It]);
          return pr(r, i);
        } else return pr(e, n.next);
      }
    }
  }
  return null;
}
function Wh(e, n) {
  if (n !== null) {
    let i = e[It][gt],
      r = n.projection;
    return i.projection[r];
  }
  return null;
}
function cl(e, n) {
  let t = ze + e + 1;
  if (t < n.length) {
    let i = n[t],
      r = i[j].firstChild;
    if (r !== null) return pr(i, r);
  }
  return n[On];
}
function Uy(e, n, t) {
  e.removeChild(null, n, t);
}
function ou(e, n, t, i, r, o, s) {
  for (; t != null; ) {
    if (t.type === 128) {
      t = t.next;
      continue;
    }
    let a = i[t.index],
      c = t.type;
    if ((s && n === 0 && (a && sn(Tt(a), i), (t.flags |= 2)), (t.flags & 32) !== 32))
      if (c & 8) ou(e, n, t.child, i, r, o, !1), Di(n, e, r, a, o);
      else if (c & 32) {
        let l = iu(t, i),
          u;
        for (; (u = l()); ) Di(n, e, r, u, o);
        Di(n, e, r, a, o);
      } else c & 16 ? Gy(e, n, i, t, r, o) : Di(n, e, r, a, o);
    t = s ? t.projectionNext : t.next;
  }
}
function ks(e, n, t, i, r, o) {
  ou(t, i, e.firstChild, n, r, o, !1);
}
function Gy(e, n, t, i, r, o) {
  let s = t[It],
    c = s[gt].projection[i.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      Di(n, e, r, u, o);
    }
  else {
    let l = c,
      u = s[xe];
    Oh(i) && (l.flags |= 128), ou(e, n, l, u, r, o, !0);
  }
}
function zy(e, n, t, i, r) {
  let o = t[On],
    s = Tt(t);
  o !== s && Di(n, e, i, o, r);
  for (let a = ze; a < t.length; a++) {
    let c = t[a];
    ks(c[j], c, e, n, i, o);
  }
}
function Wy(e, n, t, i, r) {
  if (n) r ? e.addClass(t, i) : e.removeClass(t, i);
  else {
    let o = i.indexOf('-') === -1 ? void 0 : Vt.DashCase;
    r == null
      ? e.removeStyle(t, i, o)
      : (typeof r == 'string' &&
          r.endsWith('!important') &&
          ((r = r.slice(0, -10)), (o |= Vt.Important)),
        e.setStyle(t, i, r, o));
  }
}
function qy(e, n, t) {
  e.setAttribute(n, 'style', t);
}
function qh(e, n, t) {
  t === '' ? e.removeAttribute(n, 'class') : e.setAttribute(n, 'class', t);
}
function Qh(e, n, t) {
  let { mergedAttrs: i, classes: r, styles: o } = t;
  i !== null && Hc(e, n, i), r !== null && qh(e, n, r), o !== null && qy(e, n, o);
}
var Un = {};
function Qe(e = 1) {
  Zh(Se(), Y(), Li() + e, !1);
}
function Zh(e, n, t, i) {
  if (!i)
    if ((n[N] & 3) === 3) {
      let o = e.preOrderCheckHooks;
      o !== null && Wo(n, o, t);
    } else {
      let o = e.preOrderHooks;
      o !== null && qo(n, o, 0, t);
    }
  Rn(t);
}
function Ue(e, n = $.Default) {
  let t = Y();
  if (t === null) return U(e, n);
  let i = je();
  return Eh(i, t, Ce(e), n);
}
function Yh(e, n, t, i, r, o) {
  let s = W(null);
  try {
    let a = null;
    r & rn.SignalBased && (a = n[i][rf]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      r & rn.HasDecoratorInputTransform && (o = e.inputTransforms[i].call(n, o)),
      e.setInput !== null ? e.setInput(n, a, o, t, i) : Yp(n, a, i, o);
  } finally {
    W(s);
  }
}
function Qy(e, n) {
  let t = e.hostBindingOpCodes;
  if (t !== null)
    try {
      for (let i = 0; i < t.length; i++) {
        let r = t[i];
        if (r < 0) Rn(~r);
        else {
          let o = r,
            s = t[++i],
            a = t[++i];
          P_(s, o);
          let c = n[o];
          a(2, c);
        }
      }
    } finally {
      Rn(-1);
    }
}
function Fs(e, n, t, i, r, o, s, a, c, l, u) {
  let d = n.blueprint.slice();
  return (
    (d[Ht] = r),
    (d[N] = i | 4 | 128 | 8 | 64),
    (l !== null || (e && e[N] & 2048)) && (d[N] |= 2048),
    ih(d),
    (d[xe] = d[Pi] = e),
    (d[ht] = t),
    (d[Lt] = s || (e && e[Lt])),
    (d[ge] = a || (e && e[ge])),
    (d[Mi] = c || (e && e[Mi]) || null),
    (d[gt] = o),
    (d[Is] = hy()),
    (d[ts] = u),
    (d[Qp] = l),
    (d[It] = n.type == 2 ? e[It] : d),
    d
  );
}
function Ir(e, n, t, i, r) {
  let o = e.data[n];
  if (o === null) (o = Zy(e, n, t, i, r)), R_() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = t), (o.value = i), (o.attrs = r);
    let s = T_();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return $n(o, !0), o;
}
function Zy(e, n, t, i, r) {
  let o = ch(),
    s = Gl(),
    a = s ? o : o && o.parent,
    c = (e.data[n] = t1(e, a, t, n, i, r));
  return (
    e.firstChild === null && (e.firstChild = c),
    o !== null &&
      (s
        ? o.child == null && c.parent !== null && (o.child = c)
        : o.next === null && ((o.next = c), (c.prev = o))),
    c
  );
}
function Jh(e, n, t, i) {
  if (t === 0) return -1;
  let r = n.length;
  for (let o = 0; o < t; o++) n.push(i), e.blueprint.push(i), e.data.push(null);
  return r;
}
function Kh(e, n, t, i, r) {
  let o = Li(),
    s = i & 2;
  try {
    Rn(-1), s && n.length > Mt && Zh(e, n, Mt, !1), Ct(s ? 2 : 0, r), t(i, r);
  } finally {
    Rn(o), Ct(s ? 3 : 1, r);
  }
}
function su(e, n, t) {
  if (Hl(n)) {
    let i = W(null);
    try {
      let r = n.directiveStart,
        o = n.directiveEnd;
      for (let s = r; s < o; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let c = t[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      W(i);
    }
  }
}
function au(e, n, t) {
  ah() && (a1(e, n, t, it(t, n)), (t.flags & 64) === 64 && ng(e, n, t));
}
function cu(e, n, t = it) {
  let i = n.localNames;
  if (i !== null) {
    let r = n.index + 1;
    for (let o = 0; o < i.length; o += 2) {
      let s = i[o + 1],
        a = s === -1 ? t(n, e) : e[s];
      e[r++] = a;
    }
  }
}
function Xh(e) {
  let n = e.tView;
  return n === null || n.incompleteFirstPass
    ? (e.tView = lu(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id,
      ))
    : n;
}
function lu(e, n, t, i, r, o, s, a, c, l, u) {
  let d = Mt + i,
    g = d + r,
    f = Yy(d, g),
    _ = typeof l == 'function' ? l() : l;
  return (f[j] = {
    type: e,
    blueprint: f,
    template: t,
    queries: null,
    viewQuery: a,
    declTNode: n,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: g,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == 'function' ? o() : o,
    pipeRegistry: typeof s == 'function' ? s() : s,
    firstChild: null,
    schemas: c,
    consts: _,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function Yy(e, n) {
  let t = [];
  for (let i = 0; i < n; i++) t.push(i < e ? null : Un);
  return t;
}
function Jy(e, n, t, i) {
  let o = i.get(wy, Lh) || t === Et.ShadowDom,
    s = e.selectRootElement(n, o);
  return Ky(s), s;
}
function Ky(e) {
  Xy(e);
}
var Xy = () => null;
function e1(e, n, t, i) {
  let r = og(n);
  r.push(t), e.firstCreatePass && sg(e).push(i, r.length - 1);
}
function t1(e, n, t, i, r, o) {
  let s = n ? n.injectorIndex : -1,
    a = 0;
  return (
    E_() && (a |= 128),
    {
      type: t,
      index: i,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: r,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: n,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function cp(e, n, t, i, r) {
  for (let o in n) {
    if (!n.hasOwnProperty(o)) continue;
    let s = n[o];
    if (s === void 0) continue;
    i ??= {};
    let a,
      c = rn.None;
    Array.isArray(s) ? ((a = s[0]), (c = s[1])) : (a = s);
    let l = o;
    if (r !== null) {
      if (!r.hasOwnProperty(o)) continue;
      l = r[o];
    }
    e === 0 ? lp(i, t, l, a, c) : lp(i, t, l, a);
  }
  return i;
}
function lp(e, n, t, i, r) {
  let o;
  e.hasOwnProperty(t) ? (o = e[t]).push(n, i) : (o = e[t] = [n, i]), r !== void 0 && o.push(r);
}
function n1(e, n, t) {
  let i = n.directiveStart,
    r = n.directiveEnd,
    o = e.data,
    s = n.attrs,
    a = [],
    c = null,
    l = null;
  for (let u = i; u < r; u++) {
    let d = o[u],
      g = t ? t.get(d) : null,
      f = g ? g.inputs : null,
      _ = g ? g.outputs : null;
    (c = cp(0, d.inputs, u, c, f)), (l = cp(1, d.outputs, u, l, _));
    let y = c !== null && s !== null && !jl(n) ? _1(c, u, s) : null;
    a.push(y);
  }
  c !== null &&
    (c.hasOwnProperty('class') && (n.flags |= 8), c.hasOwnProperty('style') && (n.flags |= 16)),
    (n.initialInputs = a),
    (n.inputs = c),
    (n.outputs = l);
}
function i1(e) {
  return e === 'class'
    ? 'className'
    : e === 'for'
      ? 'htmlFor'
      : e === 'formaction'
        ? 'formAction'
        : e === 'innerHtml'
          ? 'innerHTML'
          : e === 'readonly'
            ? 'readOnly'
            : e === 'tabindex'
              ? 'tabIndex'
              : e;
}
function eg(e, n, t, i, r, o, s, a) {
  let c = it(n, t),
    l = n.inputs,
    u;
  !a && l != null && (u = l[i])
    ? (du(e, t, u, i, r), Ms(n) && r1(t, n.index))
    : n.type & 3
      ? ((i = i1(i)), (r = s != null ? s(r, n.value || '', i) : r), o.setProperty(c, i, r))
      : n.type & 12;
}
function r1(e, n) {
  let t = cn(n, e);
  t[N] & 16 || (t[N] |= 64);
}
function uu(e, n, t, i) {
  if (ah()) {
    let r = i === null ? null : { '': -1 },
      o = l1(e, t),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && tg(e, n, t, s, r, a),
      r && u1(t, i, r);
  }
  t.mergedAttrs = mr(t.mergedAttrs, t.attrs);
}
function tg(e, n, t, i, r, o) {
  for (let l = 0; l < i.length; l++) Kc(as(t, n), e, i[l].type);
  f1(t, e.data.length, i.length);
  for (let l = 0; l < i.length; l++) {
    let u = i[l];
    u.providersResolver && u.providersResolver(u);
  }
  let s = !1,
    a = !1,
    c = Jh(e, n, i.length, null);
  for (let l = 0; l < i.length; l++) {
    let u = i[l];
    (t.mergedAttrs = mr(t.mergedAttrs, u.hostAttrs)),
      p1(e, t, n, c, u),
      d1(c, u, r),
      u.contentQueries !== null && (t.flags |= 4),
      (u.hostBindings !== null || u.hostAttrs !== null || u.hostVars !== 0) && (t.flags |= 64);
    let d = u.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(t.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(t.index), (a = !0)),
      c++;
  }
  n1(e, t, o);
}
function o1(e, n, t, i, r) {
  let o = r.hostBindings;
  if (o) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~n.index;
    s1(s) != a && s.push(a), s.push(t, i, o);
  }
}
function s1(e) {
  let n = e.length;
  for (; n > 0; ) {
    let t = e[--n];
    if (typeof t == 'number' && t < 0) return t;
  }
  return 0;
}
function a1(e, n, t, i) {
  let r = t.directiveStart,
    o = t.directiveEnd;
  Ms(t) && h1(n, t, e.data[r + t.componentOffset]), e.firstCreatePass || as(t, n), sn(i, n);
  let s = t.initialInputs;
  for (let a = r; a < o; a++) {
    let c = e.data[a],
      l = kn(n, e, a, t);
    if ((sn(l, n), s !== null && v1(n, a - r, l, c, t, s), on(c))) {
      let u = cn(t.index, n);
      u[ht] = kn(n, e, a, t);
    }
  }
}
function ng(e, n, t) {
  let i = t.directiveStart,
    r = t.directiveEnd,
    o = t.index,
    s = k_();
  try {
    Rn(o);
    for (let a = i; a < r; a++) {
      let c = e.data[a],
        l = n[a];
      Zc(a), (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) && c1(c, l);
    }
  } finally {
    Rn(-1), Zc(s);
  }
}
function c1(e, n) {
  e.hostBindings !== null && e.hostBindings(1, n);
}
function l1(e, n) {
  let t = e.directiveRegistry,
    i = null,
    r = null;
  if (t)
    for (let o = 0; o < t.length; o++) {
      let s = t[o];
      if (Wv(n, s.selectors, !1))
        if ((i || (i = []), on(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (r = r || new Map()), s.findHostDirectiveDefs(s, a, r), i.unshift(...a, s);
            let c = a.length;
            ll(e, n, c);
          } else i.unshift(s), ll(e, n, 0);
        else (r = r || new Map()), s.findHostDirectiveDefs?.(s, i, r), i.push(s);
    }
  return i === null ? null : [i, r];
}
function ll(e, n, t) {
  (n.componentOffset = t), (e.components ??= []).push(n.index);
}
function u1(e, n, t) {
  if (n) {
    let i = (e.localNames = []);
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r + 1]];
      if (o == null) throw new E(-301, !1);
      i.push(n[r], o);
    }
  }
}
function d1(e, n, t) {
  if (t) {
    if (n.exportAs) for (let i = 0; i < n.exportAs.length; i++) t[n.exportAs[i]] = e;
    on(n) && (t[''] = e);
  }
}
function f1(e, n, t) {
  (e.flags |= 1), (e.directiveStart = n), (e.directiveEnd = n + t), (e.providerIndexes = n);
}
function p1(e, n, t, i, r) {
  e.data[i] = r;
  let o = r.factory || (r.factory = Si(r.type, !0)),
    s = new Pn(o, on(r), Ue);
  (e.blueprint[i] = s), (t[i] = s), o1(e, n, i, Jh(e, t, r.hostVars, Un), r);
}
function h1(e, n, t) {
  let i = it(n, e),
    r = Xh(t),
    o = e[Lt].rendererFactory,
    s = 16;
  t.signals ? (s = 4096) : t.onPush && (s = 64);
  let a = Ls(e, Fs(e, r, null, s, i, n, null, o.createRenderer(i, t), null, null, null));
  e[n.index] = a;
}
function g1(e, n, t, i, r, o) {
  let s = it(e, n);
  m1(n[ge], s, o, e.value, t, i, r);
}
function m1(e, n, t, i, r, o, s) {
  if (o == null) e.removeAttribute(n, r, t);
  else {
    let a = s == null ? Pl(o) : s(o, i || '', r);
    e.setAttribute(n, r, a, t);
  }
}
function v1(e, n, t, i, r, o) {
  let s = o[n];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        l = s[a++],
        u = s[a++],
        d = s[a++];
      Yh(i, t, c, l, u, d);
    }
}
function _1(e, n, t) {
  let i = null,
    r = 0;
  for (; r < t.length; ) {
    let o = t[r];
    if (o === 0) {
      r += 4;
      continue;
    } else if (o === 5) {
      r += 2;
      continue;
    }
    if (typeof o == 'number') break;
    if (e.hasOwnProperty(o)) {
      i === null && (i = []);
      let s = e[o];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === n) {
          i.push(o, s[a + 1], s[a + 2], t[r + 1]);
          break;
        }
    }
    r += 2;
  }
  return i;
}
function ig(e, n, t, i) {
  return [e, !0, 0, n, null, i, null, t, null, null];
}
function rg(e, n) {
  let t = e.contentQueries;
  if (t !== null) {
    let i = W(null);
    try {
      for (let r = 0; r < t.length; r += 2) {
        let o = t[r],
          s = t[r + 1];
        if (s !== -1) {
          let a = e.data[s];
          zl(o), a.contentQueries(2, n[s], s);
        }
      }
    } finally {
      W(i);
    }
  }
}
function Ls(e, n) {
  return e[_r] ? (e[Qf][pt] = n) : (e[_r] = n), (e[Qf] = n), n;
}
function ul(e, n, t) {
  zl(0);
  let i = W(null);
  try {
    n(e, t);
  } finally {
    W(i);
  }
}
function og(e) {
  return (e[ns] ??= []);
}
function sg(e) {
  return (e.cleanup ??= []);
}
function ag(e, n) {
  let t = e[Mi],
    i = t ? t.get(Bt, null) : null;
  i && i.handleError(n);
}
function du(e, n, t, i, r) {
  for (let o = 0; o < t.length; ) {
    let s = t[o++],
      a = t[o++],
      c = t[o++],
      l = n[s],
      u = e.data[s];
    Yh(u, l, i, a, c, r);
  }
}
function y1(e, n, t) {
  let i = th(n, e);
  xy(e[ge], i, t);
}
function b1(e, n) {
  let t = cn(n, e),
    i = t[j];
  D1(i, t);
  let r = t[Ht];
  r !== null && t[ts] === null && (t[ts] = tu(r, t[Mi])), fu(i, t, t[ht]);
}
function D1(e, n) {
  for (let t = n.length; t < e.blueprint.length; t++) n.push(e.blueprint[t]);
}
function fu(e, n, t) {
  Wl(n);
  try {
    let i = e.viewQuery;
    i !== null && ul(1, i, t);
    let r = e.template;
    r !== null && Kh(e, n, r, 1, t),
      e.firstCreatePass && (e.firstCreatePass = !1),
      n[jt]?.finishViewCreation(e),
      e.staticContentQueries && rg(e, n),
      e.staticViewQueries && ul(2, e.viewQuery, t);
    let o = e.components;
    o !== null && w1(n, o);
  } catch (i) {
    throw (e.firstCreatePass && ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)), i);
  } finally {
    (n[N] &= -5), ql();
  }
}
function w1(e, n) {
  for (let t = 0; t < n.length; t++) b1(e, n[t]);
}
function C1(e, n, t, i) {
  let r = W(null);
  try {
    let o = n.tView,
      a = e[N] & 4096 ? 4096 : 16,
      c = Fs(
        e,
        o,
        t,
        a,
        null,
        n,
        null,
        null,
        i?.injector ?? null,
        i?.embeddedViewInjector ?? null,
        i?.dehydratedView ?? null,
      ),
      l = e[n.index];
    c[Nn] = l;
    let u = e[jt];
    return u !== null && (c[jt] = u.createEmbeddedView(o)), fu(o, c, t), c;
  } finally {
    W(r);
  }
}
function up(e, n) {
  return !n || n.firstChild === null || Oh(e);
}
function S1(e, n, t, i = !0) {
  let r = n[j];
  if ((Py(r, n, e, t), i)) {
    let s = cl(t, e),
      a = n[ge],
      c = zh(a, e[On]);
    c !== null && Ay(r, e[gt], a, n, c, s);
  }
  let o = n[ts];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function ds(e, n, t, i, r = !1) {
  for (; t !== null; ) {
    if (t.type === 128) {
      t = r ? t.projectionNext : t.next;
      continue;
    }
    let o = n[t.index];
    o !== null && i.push(Tt(o)), Ut(o) && E1(o, i);
    let s = t.type;
    if (s & 8) ds(e, n, t.child, i);
    else if (s & 32) {
      let a = iu(t, n),
        c;
      for (; (c = a()); ) i.push(c);
    } else if (s & 16) {
      let a = Wh(n, t);
      if (Array.isArray(a)) i.push(...a);
      else {
        let c = An(n[It]);
        ds(c[j], c, a, i, !0);
      }
    }
    t = r ? t.projectionNext : t.next;
  }
  return i;
}
function E1(e, n) {
  for (let t = ze; t < e.length; t++) {
    let i = e[t],
      r = i[j].firstChild;
    r !== null && ds(i[j], i, r, n);
  }
  e[On] !== e[Ht] && n.push(e[On]);
}
var cg = [];
function I1(e) {
  return e[nt] ?? M1(e);
}
function M1(e) {
  let n = cg.pop() ?? Object.create(x1);
  return (n.lView = e), n;
}
function T1(e) {
  e.lView[nt] !== e && ((e.lView = null), cg.push(e));
}
var x1 = oe(w({}, ec), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    xs(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[nt] = this;
  },
});
function N1(e) {
  let n = e[nt] ?? Object.create(O1);
  return (n.lView = e), n;
}
var O1 = oe(w({}, ec), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    let n = An(e.lView);
    for (; n && !lg(n[j]); ) n = An(n);
    n && rh(n);
  },
  consumerOnSignalRead() {
    this.lView[nt] = this;
  },
});
function lg(e) {
  return e.type !== 2;
}
var A1 = 100;
function ug(e, n = !0, t = 0) {
  let i = e[Lt],
    r = i.rendererFactory,
    o = !1;
  o || r.begin?.();
  try {
    R1(e, t);
  } catch (s) {
    throw (n && ag(e, s), s);
  } finally {
    o || (r.end?.(), i.inlineEffectRunner?.flush());
  }
}
function R1(e, n) {
  let t = uh();
  try {
    Yf(!0), dl(e, n);
    let i = 0;
    for (; yr(e); ) {
      if (i === A1) throw new E(103, !1);
      i++, dl(e, 1);
    }
  } finally {
    Yf(t);
  }
}
function P1(e, n, t, i) {
  let r = n[N];
  if ((r & 256) === 256) return;
  let o = !1,
    s = !1;
  !o && n[Lt].inlineEffectRunner?.flush(), Wl(n);
  let a = !0,
    c = null,
    l = null;
  o ||
    (lg(e)
      ? ((l = I1(n)), (c = tc(l)))
      : of() === null
        ? ((a = !1), (l = N1(n)), (c = tc(l)))
        : n[nt] && (ic(n[nt]), (n[nt] = null)));
  try {
    ih(n), O_(e.bindingStartIndex), t !== null && Kh(e, n, t, 2, i);
    let u = (r & 3) === 3;
    if (!o)
      if (u) {
        let f = e.preOrderCheckHooks;
        f !== null && Wo(n, f, null);
      } else {
        let f = e.preOrderHooks;
        f !== null && qo(n, f, 0, null), xc(n, 0);
      }
    if ((s || k1(n), dg(n, 0), e.contentQueries !== null && rg(e, n), !o))
      if (u) {
        let f = e.contentCheckHooks;
        f !== null && Wo(n, f);
      } else {
        let f = e.contentHooks;
        f !== null && qo(n, f, 1), xc(n, 1);
      }
    Qy(e, n);
    let d = e.components;
    d !== null && pg(n, d, 0);
    let g = e.viewQuery;
    if ((g !== null && ul(2, g, i), !o))
      if (u) {
        let f = e.viewCheckHooks;
        f !== null && Wo(n, f);
      } else {
        let f = e.viewHooks;
        f !== null && qo(n, f, 2), xc(n, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), n[Tc])) {
      for (let f of n[Tc]) f();
      n[Tc] = null;
    }
    o || (n[N] &= -73);
  } catch (u) {
    throw (o || xs(n), u);
  } finally {
    l !== null && (sf(l, c), a && T1(l)), ql();
  }
}
function dg(e, n) {
  for (let t = Rh(e); t !== null; t = Ph(t))
    for (let i = ze; i < t.length; i++) {
      let r = t[i];
      fg(r, n);
    }
}
function k1(e) {
  for (let n = Rh(e); n !== null; n = Ph(n)) {
    if (!(n[N] & rs.HasTransplantedViews)) continue;
    let t = n[Ti];
    for (let i = 0; i < t.length; i++) {
      let r = t[i];
      rh(r);
    }
  }
}
function F1(e, n, t) {
  let i = cn(n, e);
  fg(i, t);
}
function fg(e, n) {
  Ul(e) && dl(e, n);
}
function dl(e, n) {
  let i = e[j],
    r = e[N],
    o = e[nt],
    s = !!(n === 0 && r & 16);
  if (
    ((s ||= !!(r & 64 && n === 0)),
    (s ||= !!(r & 1024)),
    (s ||= !!(o?.dirty && nc(o))),
    (s ||= !1),
    o && (o.dirty = !1),
    (e[N] &= -9217),
    s)
  )
    P1(i, e, i.template, e[ht]);
  else if (r & 8192) {
    dg(e, 1);
    let a = i.components;
    a !== null && pg(e, a, 1);
  }
}
function pg(e, n, t) {
  for (let i = 0; i < n.length; i++) F1(e, n[i], t);
}
function pu(e, n) {
  let t = uh() ? 64 : 1088;
  for (e[Lt].changeDetectionScheduler?.notify(n); e; ) {
    e[N] |= t;
    let i = An(e);
    if (Wc(e) && !i) return e;
    e = i;
  }
  return null;
}
var Fn = class {
    get rootNodes() {
      let n = this._lView,
        t = n[j];
      return ds(t, n, t.firstChild, []);
    }
    constructor(n, t, i = !0) {
      (this._lView = n),
        (this._cdRefInjectingView = t),
        (this.notifyErrorHandler = i),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[ht];
    }
    set context(n) {
      this._lView[ht] = n;
    }
    get destroyed() {
      return (this._lView[N] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let n = this._lView[xe];
        if (Ut(n)) {
          let t = n[is],
            i = t ? t.indexOf(this) : -1;
          i > -1 && (al(n, i), Xo(t, i));
        }
        this._attachedToViewContainer = !1;
      }
      Uh(this._lView[j], this._lView);
    }
    onDestroy(n) {
      oh(this._lView, n);
    }
    markForCheck() {
      pu(this._cdRefInjectingView || this._lView, 4);
    }
    detach() {
      this._lView[N] &= -129;
    }
    reattach() {
      Qc(this._lView), (this._lView[N] |= 128);
    }
    detectChanges() {
      (this._lView[N] |= 1024), ug(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new E(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      this._appRef = null;
      let n = Wc(this._lView),
        t = this._lView[Nn];
      t !== null && !n && ru(t, this._lView), $h(this._lView[j], this._lView);
    }
    attachToAppRef(n) {
      if (this._attachedToViewContainer) throw new E(902, !1);
      this._appRef = n;
      let t = Wc(this._lView),
        i = this._lView[Nn];
      i !== null && !t && Hh(i, this._lView), Qc(this._lView);
    }
  },
  $t = (() => {
    class e {
      static {
        this.__NG_ELEMENT_ID__ = B1;
      }
    }
    return e;
  })(),
  L1 = $t,
  j1 = class extends L1 {
    constructor(n, t, i) {
      super(),
        (this._declarationLView = n),
        (this._declarationTContainer = t),
        (this.elementRef = i);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(n, t) {
      return this.createEmbeddedViewImpl(n, t);
    }
    createEmbeddedViewImpl(n, t, i) {
      let r = C1(this._declarationLView, this._declarationTContainer, n, {
        embeddedViewInjector: t,
        dehydratedView: i,
      });
      return new Fn(r);
    }
  };
function B1() {
  return js(je(), Y());
}
function js(e, n) {
  return e.type & 4 ? new j1(n, e, $i(e, n)) : null;
}
var MA = new RegExp(`^(\\d+)*(${by}|${yy})*(.*)`);
var V1 = () => null;
function dp(e, n) {
  return V1(e, n);
}
var Ni = class {},
  hu = new A('', { providedIn: 'root', factory: () => !1 });
var hg = new A(''),
  fl = class {},
  fs = class {};
function $1(e) {
  let n = Error(`No component factory found for ${Le(e)}.`);
  return (n[H1] = e), n;
}
var H1 = 'ngComponent';
var pl = class {
    resolveComponentFactory(n) {
      throw $1(n);
    }
  },
  Oi = class {
    static {
      this.NULL = new pl();
    }
  },
  Ai = class {},
  Bs = (() => {
    class e {
      constructor() {
        this.destroyNode = null;
      }
      static {
        this.__NG_ELEMENT_ID__ = () => U1();
      }
    }
    return e;
  })();
function U1() {
  let e = Y(),
    n = je(),
    t = cn(n.index, e);
  return (nn(t) ? t : e)[ge];
}
var G1 = (() => {
  class e {
    static {
      this.ɵprov = C({ token: e, providedIn: 'root', factory: () => null });
    }
  }
  return e;
})();
var fp = new Set();
function Mr(e) {
  fp.has(e) || (fp.add(e), performance?.mark?.('mark_feature_usage', { detail: { feature: e } }));
}
var ye = (function (e) {
    return (
      (e[(e.EarlyRead = 0)] = 'EarlyRead'),
      (e[(e.Write = 1)] = 'Write'),
      (e[(e.MixedReadWrite = 2)] = 'MixedReadWrite'),
      (e[(e.Read = 3)] = 'Read'),
      e
    );
  })(ye || {}),
  gg = { destroy() {} };
function gu(e, n) {
  !n && Es(gu);
  let t = n?.injector ?? v(qe);
  return Bh(t) ? (Mr('NgAfterRender'), mg(e, t, !1, n?.phase ?? ye.MixedReadWrite)) : gg;
}
function Vs(e, n) {
  !n && Es(Vs);
  let t = n?.injector ?? v(qe);
  return Bh(t) ? (Mr('NgAfterNextRender'), mg(e, t, !0, n?.phase ?? ye.MixedReadWrite)) : gg;
}
function z1(e, n) {
  if (e instanceof Function)
    switch (n) {
      case ye.EarlyRead:
        return { earlyRead: e };
      case ye.Write:
        return { write: e };
      case ye.MixedReadWrite:
        return { mixedReadWrite: e };
      case ye.Read:
        return { read: e };
    }
  return e;
}
function mg(e, n, t, i) {
  let r = z1(e, i),
    o = n.get(mu),
    s = (o.handler ??= new gl()),
    a = [],
    c = [],
    l = () => {
      for (let f of c) s.unregister(f);
      u();
    },
    u = n.get(Hn).onDestroy(l),
    d = 0,
    g = (f, _) => {
      if (!_) return;
      let y = t ? (...D) => (d--, d < 1 && l(), _(...D)) : _,
        b = xt(n, () => new hl(f, a, y));
      s.register(b), c.push(b), d++;
    };
  return (
    g(ye.EarlyRead, r.earlyRead),
    g(ye.Write, r.write),
    g(ye.MixedReadWrite, r.mixedReadWrite),
    g(ye.Read, r.read),
    { destroy: l }
  );
}
var hl = class {
    constructor(n, t, i) {
      (this.phase = n),
        (this.pipelinedArgs = t),
        (this.callbackFn = i),
        (this.zone = v(ie)),
        (this.errorHandler = v(Bt, { optional: !0 })),
        v(Ni, { optional: !0 })?.notify(6);
    }
    invoke() {
      try {
        let n = this.zone.runOutsideAngular(() => this.callbackFn.apply(null, this.pipelinedArgs));
        this.pipelinedArgs.splice(0, this.pipelinedArgs.length, n);
      } catch (n) {
        this.errorHandler?.handleError(n);
      }
    }
  },
  gl = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [ye.EarlyRead]: new Set(),
          [ye.Write]: new Set(),
          [ye.MixedReadWrite]: new Set(),
          [ye.Read]: new Set(),
        }),
        (this.deferredCallbacks = new Set());
    }
    register(n) {
      (this.executingCallbacks ? this.deferredCallbacks : this.buckets[n.phase]).add(n);
    }
    unregister(n) {
      this.buckets[n.phase].delete(n), this.deferredCallbacks.delete(n);
    }
    execute() {
      this.executingCallbacks = !0;
      for (let n of Object.values(this.buckets)) for (let t of n) t.invoke();
      this.executingCallbacks = !1;
      for (let n of this.deferredCallbacks) this.buckets[n.phase].add(n);
      this.deferredCallbacks.clear();
    }
    destroy() {
      for (let n of Object.values(this.buckets)) n.clear();
      this.deferredCallbacks.clear();
    }
  },
  mu = (() => {
    class e {
      constructor() {
        (this.handler = null), (this.internalCallbacks = []);
      }
      execute() {
        this.executeInternalCallbacks(), this.handler?.execute();
      }
      executeInternalCallbacks() {
        let t = [...this.internalCallbacks];
        this.internalCallbacks.length = 0;
        for (let i of t) i();
      }
      ngOnDestroy() {
        this.handler?.destroy(), (this.handler = null), (this.internalCallbacks.length = 0);
      }
      static {
        this.ɵprov = C({
          token: e,
          providedIn: 'root',
          factory: () => new e(),
        });
      }
    }
    return e;
  })();
function ps(e, n, t) {
  let i = t ? e.styles : null,
    r = t ? e.classes : null,
    o = 0;
  if (n !== null)
    for (let s = 0; s < n.length; s++) {
      let a = n[s];
      if (typeof a == 'number') o = a;
      else if (o == 1) r = jf(r, a);
      else if (o == 2) {
        let c = a,
          l = n[++s];
        i = jf(i, c + ': ' + l + ';');
      }
    }
  t ? (e.styles = i) : (e.stylesWithoutHost = i), t ? (e.classes = r) : (e.classesWithoutHost = r);
}
var hs = class extends Oi {
  constructor(n) {
    super(), (this.ngModule = n);
  }
  resolveComponentFactory(n) {
    let t = xn(n);
    return new br(t, this.ngModule);
  }
};
function pp(e, n) {
  let t = [];
  for (let i in e) {
    if (!e.hasOwnProperty(i)) continue;
    let r = e[i];
    if (r === void 0) continue;
    let o = Array.isArray(r),
      s = o ? r[0] : r,
      a = o ? r[1] : rn.None;
    n
      ? t.push({
          propName: s,
          templateName: i,
          isSignal: (a & rn.SignalBased) !== 0,
        })
      : t.push({ propName: s, templateName: i });
  }
  return t;
}
function W1(e) {
  let n = e.toLowerCase();
  return n === 'svg' ? eh : n === 'math' ? m_ : null;
}
var br = class extends fs {
    get inputs() {
      let n = this.componentDef,
        t = n.inputTransforms,
        i = pp(n.inputs, !0);
      if (t !== null)
        for (let r of i) t.hasOwnProperty(r.propName) && (r.transform = t[r.propName]);
      return i;
    }
    get outputs() {
      return pp(this.componentDef.outputs, !1);
    }
    constructor(n, t) {
      super(),
        (this.componentDef = n),
        (this.ngModule = t),
        (this.componentType = n.type),
        (this.selector = Yv(n.selectors)),
        (this.ngContentSelectors = n.ngContentSelectors ? n.ngContentSelectors : []),
        (this.isBoundToModule = !!t);
    }
    create(n, t, i, r) {
      let o = W(null);
      try {
        r = r || this.ngModule;
        let s = r instanceof We ? r : r?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new Yc(n, s) : n,
          c = a.get(Ai, null);
        if (c === null) throw new E(407, !1);
        let l = a.get(G1, null),
          u = a.get(mu, null),
          d = a.get(Ni, null),
          g = {
            rendererFactory: c,
            sanitizer: l,
            inlineEffectRunner: null,
            afterRenderEventManager: u,
            changeDetectionScheduler: d,
          },
          f = c.createRenderer(null, this.componentDef),
          _ = this.componentDef.selectors[0][0] || 'div',
          y = i ? Jy(f, i, this.componentDef.encapsulation, a) : Vh(f, _, W1(_)),
          b = 512;
        this.componentDef.signals ? (b |= 4096) : this.componentDef.onPush || (b |= 16);
        let D = null;
        y !== null && (D = tu(y, a, !0));
        let z = lu(0, null, null, 1, 0, null, null, null, null, null, null),
          R = Fs(null, z, null, b, null, null, g, f, a, null, D);
        Wl(R);
        let T, G;
        try {
          let L = this.componentDef,
            Q,
            ce = null;
          L.findHostDirectiveDefs
            ? ((Q = []), (ce = new Map()), L.findHostDirectiveDefs(L, Q, ce), Q.push(L))
            : (Q = [L]);
          let ue = q1(R, y),
            le = Q1(ue, y, L, Q, R, g, f);
          (G = nh(z, Mt)),
            y && J1(f, L, y, i),
            t !== void 0 && K1(G, this.ngContentSelectors, t),
            (T = Y1(le, L, Q, ce, R, [X1])),
            fu(z, R, null);
        } finally {
          ql();
        }
        return new ml(this.componentType, T, $i(G, R), R, G);
      } finally {
        W(o);
      }
    }
  },
  ml = class extends fl {
    constructor(n, t, i, r, o) {
      super(),
        (this.location = i),
        (this._rootLView = r),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = t),
        (this.hostView = this.changeDetectorRef = new Fn(r, void 0, !1)),
        (this.componentType = n);
    }
    setInput(n, t) {
      let i = this._tNode.inputs,
        r;
      if (i !== null && (r = i[n])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(n) && Object.is(this.previousInputValues.get(n), t))
        )
          return;
        let o = this._rootLView;
        du(o[j], o, r, n, t), this.previousInputValues.set(n, t);
        let s = cn(this._tNode.index, o);
        pu(s, 1);
      }
    }
    get injector() {
      return new Tn(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(n) {
      this.hostView.onDestroy(n);
    }
  };
function q1(e, n) {
  let t = e[j],
    i = Mt;
  return (e[i] = n), Ir(t, i, 2, '#host', null);
}
function Q1(e, n, t, i, r, o, s) {
  let a = r[j];
  Z1(i, e, n, s);
  let c = null;
  n !== null && (c = tu(n, r[Mi]));
  let l = o.rendererFactory.createRenderer(n, t),
    u = 16;
  t.signals ? (u = 4096) : t.onPush && (u = 64);
  let d = Fs(r, Xh(t), null, u, r[e.index], e, o, l, null, null, c);
  return a.firstCreatePass && ll(a, e, i.length - 1), Ls(r, d), (r[e.index] = d);
}
function Z1(e, n, t, i) {
  for (let r of e) n.mergedAttrs = mr(n.mergedAttrs, r.hostAttrs);
  n.mergedAttrs !== null && (ps(n, n.mergedAttrs, !0), t !== null && Qh(i, t, n));
}
function Y1(e, n, t, i, r, o) {
  let s = je(),
    a = r[j],
    c = it(s, r);
  tg(a, r, s, t, null, i);
  for (let u = 0; u < t.length; u++) {
    let d = s.directiveStart + u,
      g = kn(r, a, d, s);
    sn(g, r);
  }
  ng(a, r, s), c && sn(c, r);
  let l = kn(r, a, s.directiveStart + s.componentOffset, s);
  if (((e[ht] = r[ht] = l), o !== null)) for (let u of o) u(l, n);
  return su(a, s, r), l;
}
function J1(e, n, t, i) {
  if (i) Hc(e, t, ['ng-version', '18.2.0']);
  else {
    let { attrs: r, classes: o } = Jv(n.selectors[0]);
    r && Hc(e, t, r), o && o.length > 0 && qh(e, t, o.join(' '));
  }
}
function K1(e, n, t) {
  let i = (e.projection = []);
  for (let r = 0; r < n.length; r++) {
    let o = t[r];
    i.push(o != null ? Array.from(o) : null);
  }
}
function X1() {
  let e = je();
  Rs(Y()[j], e);
}
var mt = (() => {
  class e {
    static {
      this.__NG_ELEMENT_ID__ = eb;
    }
  }
  return e;
})();
function eb() {
  let e = je();
  return _g(e, Y());
}
var tb = mt,
  vg = class extends tb {
    constructor(n, t, i) {
      super(), (this._lContainer = n), (this._hostTNode = t), (this._hostLView = i);
    }
    get element() {
      return $i(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Tn(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let n = Zl(this._hostTNode, this._hostLView);
      if (yh(n)) {
        let t = ss(n, this._hostLView),
          i = os(n),
          r = t[j].data[i + 8];
        return new Tn(r, t);
      } else return new Tn(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(n) {
      let t = hp(this._lContainer);
      return (t !== null && t[n]) || null;
    }
    get length() {
      return this._lContainer.length - ze;
    }
    createEmbeddedView(n, t, i) {
      let r, o;
      typeof i == 'number' ? (r = i) : i != null && ((r = i.index), (o = i.injector));
      let s = dp(this._lContainer, n.ssrId),
        a = n.createEmbeddedViewImpl(t || {}, o, s);
      return this.insertImpl(a, r, up(this._hostTNode, s)), a;
    }
    createComponent(n, t, i, r, o) {
      let s = n && !f_(n),
        a;
      if (s) a = t;
      else {
        let _ = t || {};
        (a = _.index),
          (i = _.injector),
          (r = _.projectableNodes),
          (o = _.environmentInjector || _.ngModuleRef);
      }
      let c = s ? n : new br(xn(n)),
        l = i || this.parentInjector;
      if (!o && c.ngModule == null) {
        let y = (s ? l : this.parentInjector).get(We, null);
        y && (o = y);
      }
      let u = xn(c.componentType ?? {}),
        d = dp(this._lContainer, u?.id ?? null),
        g = d?.firstChild ?? null,
        f = c.create(l, r, g, o);
      return this.insertImpl(f.hostView, a, up(this._hostTNode, d)), f;
    }
    insert(n, t) {
      return this.insertImpl(n, t, !0);
    }
    insertImpl(n, t, i) {
      let r = n._lView;
      if (y_(r)) {
        let a = this.indexOf(n);
        if (a !== -1) this.detach(a);
        else {
          let c = r[xe],
            l = new vg(c, c[gt], c[xe]);
          l.detach(l.indexOf(n));
        }
      }
      let o = this._adjustIndex(t),
        s = this._lContainer;
      return S1(s, r, o, i), n.attachToViewContainerRef(), Rp(Pc(s), o, n), n;
    }
    move(n, t) {
      return this.insert(n, t);
    }
    indexOf(n) {
      let t = hp(this._lContainer);
      return t !== null ? t.indexOf(n) : -1;
    }
    remove(n) {
      let t = this._adjustIndex(n, -1),
        i = al(this._lContainer, t);
      i && (Xo(Pc(this._lContainer), t), Uh(i[j], i));
    }
    detach(n) {
      let t = this._adjustIndex(n, -1),
        i = al(this._lContainer, t);
      return i && Xo(Pc(this._lContainer), t) != null ? new Fn(i) : null;
    }
    _adjustIndex(n, t = 0) {
      return n ?? this.length + t;
    }
  };
function hp(e) {
  return e[is];
}
function Pc(e) {
  return e[is] || (e[is] = []);
}
function _g(e, n) {
  let t,
    i = n[e.index];
  return (
    Ut(i) ? (t = i) : ((t = ig(i, n, null, e)), (n[e.index] = t), Ls(n, t)),
    ib(t, n, e, i),
    new vg(t, e, n)
  );
}
function nb(e, n) {
  let t = e[ge],
    i = t.createComment(''),
    r = it(n, e),
    o = zh(t, r);
  return us(t, o, i, By(t, r), !1), i;
}
var ib = sb,
  rb = () => !1;
function ob(e, n, t) {
  return rb(e, n, t);
}
function sb(e, n, t, i) {
  if (e[On]) return;
  let r;
  t.type & 8 ? (r = Tt(i)) : (r = nb(n, t)), (e[On] = r);
}
var vl = class e {
    constructor(n) {
      (this.queryList = n), (this.matches = null);
    }
    clone() {
      return new e(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  _l = class e {
    constructor(n = []) {
      this.queries = n;
    }
    createEmbeddedView(n) {
      let t = n.queries;
      if (t !== null) {
        let i = n.contentQueries !== null ? n.contentQueries[0] : t.length,
          r = [];
        for (let o = 0; o < i; o++) {
          let s = t.getByIndex(o),
            a = this.queries[s.indexInDeclarationView];
          r.push(a.clone());
        }
        return new e(r);
      }
      return null;
    }
    insertView(n) {
      this.dirtyQueriesWithMatches(n);
    }
    detachView(n) {
      this.dirtyQueriesWithMatches(n);
    }
    finishViewCreation(n) {
      this.dirtyQueriesWithMatches(n);
    }
    dirtyQueriesWithMatches(n) {
      for (let t = 0; t < this.queries.length; t++)
        vu(n, t).matches !== null && this.queries[t].setDirty();
    }
  },
  gs = class {
    constructor(n, t, i = null) {
      (this.flags = t),
        (this.read = i),
        typeof n == 'string' ? (this.predicate = hb(n)) : (this.predicate = n);
    }
  },
  yl = class e {
    constructor(n = []) {
      this.queries = n;
    }
    elementStart(n, t) {
      for (let i = 0; i < this.queries.length; i++) this.queries[i].elementStart(n, t);
    }
    elementEnd(n) {
      for (let t = 0; t < this.queries.length; t++) this.queries[t].elementEnd(n);
    }
    embeddedTView(n) {
      let t = null;
      for (let i = 0; i < this.length; i++) {
        let r = t !== null ? t.length : 0,
          o = this.getByIndex(i).embeddedTView(n, r);
        o && ((o.indexInDeclarationView = i), t !== null ? t.push(o) : (t = [o]));
      }
      return t !== null ? new e(t) : null;
    }
    template(n, t) {
      for (let i = 0; i < this.queries.length; i++) this.queries[i].template(n, t);
    }
    getByIndex(n) {
      return this.queries[n];
    }
    get length() {
      return this.queries.length;
    }
    track(n) {
      this.queries.push(n);
    }
  },
  bl = class e {
    constructor(n, t = -1) {
      (this.metadata = n),
        (this.matches = null),
        (this.indexInDeclarationView = -1),
        (this.crossesNgTemplate = !1),
        (this._appliesToNextNode = !0),
        (this._declarationNodeIndex = t);
    }
    elementStart(n, t) {
      this.isApplyingToNode(t) && this.matchTNode(n, t);
    }
    elementEnd(n) {
      this._declarationNodeIndex === n.index && (this._appliesToNextNode = !1);
    }
    template(n, t) {
      this.elementStart(n, t);
    }
    embeddedTView(n, t) {
      return this.isApplyingToNode(n)
        ? ((this.crossesNgTemplate = !0), this.addMatch(-n.index, t), new e(this.metadata))
        : null;
    }
    isApplyingToNode(n) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let t = this._declarationNodeIndex,
          i = n.parent;
        for (; i !== null && i.type & 8 && i.index !== t; ) i = i.parent;
        return t === (i !== null ? i.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(n, t) {
      let i = this.metadata.predicate;
      if (Array.isArray(i))
        for (let r = 0; r < i.length; r++) {
          let o = i[r];
          this.matchTNodeWithReadOption(n, t, ab(t, o)),
            this.matchTNodeWithReadOption(n, t, Qo(t, n, o, !1, !1));
        }
      else
        i === $t
          ? t.type & 4 && this.matchTNodeWithReadOption(n, t, -1)
          : this.matchTNodeWithReadOption(n, t, Qo(t, n, i, !1, !1));
    }
    matchTNodeWithReadOption(n, t, i) {
      if (i !== null) {
        let r = this.metadata.read;
        if (r !== null)
          if (r === Be || r === mt || (r === $t && t.type & 4)) this.addMatch(t.index, -2);
          else {
            let o = Qo(t, n, r, !1, !1);
            o !== null && this.addMatch(t.index, o);
          }
        else this.addMatch(t.index, i);
      }
    }
    addMatch(n, t) {
      this.matches === null ? (this.matches = [n, t]) : this.matches.push(n, t);
    }
  };
function ab(e, n) {
  let t = e.localNames;
  if (t !== null) {
    for (let i = 0; i < t.length; i += 2) if (t[i] === n) return t[i + 1];
  }
  return null;
}
function cb(e, n) {
  return e.type & 11 ? $i(e, n) : e.type & 4 ? js(e, n) : null;
}
function lb(e, n, t, i) {
  return t === -1 ? cb(n, e) : t === -2 ? ub(e, n, i) : kn(e, e[j], t, n);
}
function ub(e, n, t) {
  if (t === Be) return $i(n, e);
  if (t === $t) return js(n, e);
  if (t === mt) return _g(n, e);
}
function yg(e, n, t, i) {
  let r = n[jt].queries[i];
  if (r.matches === null) {
    let o = e.data,
      s = t.matches,
      a = [];
    for (let c = 0; s !== null && c < s.length; c += 2) {
      let l = s[c];
      if (l < 0) a.push(null);
      else {
        let u = o[l];
        a.push(lb(n, u, s[c + 1], t.metadata.read));
      }
    }
    r.matches = a;
  }
  return r.matches;
}
function Dl(e, n, t, i) {
  let r = e.queries.getByIndex(t),
    o = r.matches;
  if (o !== null) {
    let s = yg(e, n, r, t);
    for (let a = 0; a < o.length; a += 2) {
      let c = o[a];
      if (c > 0) i.push(s[a / 2]);
      else {
        let l = o[a + 1],
          u = n[-c];
        for (let d = ze; d < u.length; d++) {
          let g = u[d];
          g[Nn] === g[xe] && Dl(g[j], g, l, i);
        }
        if (u[Ti] !== null) {
          let d = u[Ti];
          for (let g = 0; g < d.length; g++) {
            let f = d[g];
            Dl(f[j], f, l, i);
          }
        }
      }
    }
  }
  return i;
}
function db(e, n) {
  return e[jt].queries[n].queryList;
}
function bg(e, n, t) {
  let i = new rl((t & 4) === 4);
  return e1(e, n, i, i.destroy), (n[jt] ??= new _l()).queries.push(new vl(i)) - 1;
}
function fb(e, n, t) {
  let i = Se();
  return (
    i.firstCreatePass && (Dg(i, new gs(e, n, t), -1), (n & 2) === 2 && (i.staticViewQueries = !0)),
    bg(i, Y(), n)
  );
}
function pb(e, n, t, i) {
  let r = Se();
  if (r.firstCreatePass) {
    let o = je();
    Dg(r, new gs(n, t, i), o.index), gb(r, e), (t & 2) === 2 && (r.staticContentQueries = !0);
  }
  return bg(r, Y(), t);
}
function hb(e) {
  return e.split(',').map((n) => n.trim());
}
function Dg(e, n, t) {
  e.queries === null && (e.queries = new yl()), e.queries.track(new bl(n, t));
}
function gb(e, n) {
  let t = e.contentQueries || (e.contentQueries = []),
    i = t.length ? t[t.length - 1] : -1;
  n !== i && t.push(e.queries.length - 1, n);
}
function vu(e, n) {
  return e.queries.getByIndex(n);
}
function mb(e, n) {
  let t = e[j],
    i = vu(t, n);
  return i.crossesNgTemplate ? Dl(t, e, n, []) : yg(t, e, i, n);
}
function vb(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function _u(e) {
  let n = vb(e.type),
    t = !0,
    i = [e];
  for (; n; ) {
    let r;
    if (on(e)) r = n.ɵcmp || n.ɵdir;
    else {
      if (n.ɵcmp) throw new E(903, !1);
      r = n.ɵdir;
    }
    if (r) {
      if (t) {
        i.push(r);
        let s = e;
        (s.inputs = Ho(e.inputs)),
          (s.inputTransforms = Ho(e.inputTransforms)),
          (s.declaredInputs = Ho(e.declaredInputs)),
          (s.outputs = Ho(e.outputs));
        let a = r.hostBindings;
        a && wb(e, a);
        let c = r.viewQuery,
          l = r.contentQueries;
        if (
          (c && bb(e, c),
          l && Db(e, l),
          _b(e, r),
          gv(e.outputs, r.outputs),
          on(r) && r.data.animation)
        ) {
          let u = e.data;
          u.animation = (u.animation || []).concat(r.data.animation);
        }
      }
      let o = r.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(e), a === _u && (t = !1);
        }
    }
    n = Object.getPrototypeOf(n);
  }
  yb(i);
}
function _b(e, n) {
  for (let t in n.inputs) {
    if (!n.inputs.hasOwnProperty(t) || e.inputs.hasOwnProperty(t)) continue;
    let i = n.inputs[t];
    if (
      i !== void 0 &&
      ((e.inputs[t] = i), (e.declaredInputs[t] = n.declaredInputs[t]), n.inputTransforms !== null)
    ) {
      let r = Array.isArray(i) ? i[0] : i;
      if (!n.inputTransforms.hasOwnProperty(r)) continue;
      (e.inputTransforms ??= {}), (e.inputTransforms[r] = n.inputTransforms[r]);
    }
  }
}
function yb(e) {
  let n = 0,
    t = null;
  for (let i = e.length - 1; i >= 0; i--) {
    let r = e[i];
    (r.hostVars = n += r.hostVars), (r.hostAttrs = mr(r.hostAttrs, (t = mr(t, r.hostAttrs))));
  }
}
function Ho(e) {
  return e === Ft ? {} : e === tt ? [] : e;
}
function bb(e, n) {
  let t = e.viewQuery;
  t
    ? (e.viewQuery = (i, r) => {
        n(i, r), t(i, r);
      })
    : (e.viewQuery = n);
}
function Db(e, n) {
  let t = e.contentQueries;
  t
    ? (e.contentQueries = (i, r, o) => {
        n(i, r, o), t(i, r, o);
      })
    : (e.contentQueries = n);
}
function wb(e, n) {
  let t = e.hostBindings;
  t
    ? (e.hostBindings = (i, r) => {
        n(i, r), t(i, r);
      })
    : (e.hostBindings = n);
}
function yu(e) {
  let n = (t) => {
    let i = (Array.isArray(e) ? e : e()).map((r) =>
      typeof r == 'function'
        ? { directive: Ce(r), inputs: Ft, outputs: Ft }
        : {
            directive: Ce(r.directive),
            inputs: gp(r.inputs),
            outputs: gp(r.outputs),
          },
    );
    t.hostDirectives === null
      ? ((t.findHostDirectiveDefs = wg), (t.hostDirectives = i))
      : t.hostDirectives.unshift(...i);
  };
  return (n.ngInherit = !0), n;
}
function wg(e, n, t) {
  if (e.hostDirectives !== null)
    for (let i of e.hostDirectives) {
      let r = Bl(i.directive);
      Cb(r.declaredInputs, i.inputs), wg(r, n, t), t.set(r, i), n.push(r);
    }
}
function gp(e) {
  if (e === void 0 || e.length === 0) return Ft;
  let n = {};
  for (let t = 0; t < e.length; t += 2) n[e[t]] = e[t + 1];
  return n;
}
function Cb(e, n) {
  for (let t in n)
    if (n.hasOwnProperty(t)) {
      let i = n[t],
        r = e[t];
      e[i] = r;
    }
}
var an = class {},
  Dr = class {};
var wl = class extends an {
    constructor(n, t, i, r = !0) {
      super(),
        (this.ngModuleType = n),
        (this._parent = t),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new hs(this));
      let o = Vp(n);
      (this._bootstrapComponents = jh(o.bootstrap)),
        (this._r3Injector = Th(
          n,
          t,
          [
            { provide: an, useValue: this },
            { provide: Oi, useValue: this.componentFactoryResolver },
            ...i,
          ],
          Le(n),
          new Set(['environment']),
        )),
        r && this.resolveInjectorInitializers();
    }
    resolveInjectorInitializers() {
      this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(this.ngModuleType));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let n = this._r3Injector;
      !n.destroyed && n.destroy(), this.destroyCbs.forEach((t) => t()), (this.destroyCbs = null);
    }
    onDestroy(n) {
      this.destroyCbs.push(n);
    }
  },
  Cl = class extends Dr {
    constructor(n) {
      super(), (this.moduleType = n);
    }
    create(n) {
      return new wl(this.moduleType, n, []);
    }
  };
var ms = class extends an {
  constructor(n) {
    super(), (this.componentFactoryResolver = new hs(this)), (this.instance = null);
    let t = new vr(
      [
        ...n.providers,
        { provide: an, useValue: this },
        { provide: Oi, useValue: this.componentFactoryResolver },
      ],
      n.parent || $l(),
      n.debugName,
      new Set(['environment']),
    );
    (this.injector = t), n.runEnvironmentInitializers && t.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(n) {
    this.injector.onDestroy(n);
  }
};
function bu(e, n, t = null) {
  return new ms({
    providers: e,
    parent: n,
    debugName: t,
    runEnvironmentInitializers: !0,
  }).injector;
}
function Cg(e) {
  return Eb(e) ? Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e) : !1;
}
function Sb(e, n) {
  if (Array.isArray(e)) for (let t = 0; t < e.length; t++) n(e[t]);
  else {
    let t = e[Symbol.iterator](),
      i;
    for (; !(i = t.next()).done; ) n(i.value);
  }
}
function Eb(e) {
  return e !== null && (typeof e == 'function' || typeof e == 'object');
}
function Ib(e, n, t) {
  return (e[n] = t);
}
function Hi(e, n, t) {
  let i = e[n];
  return Object.is(i, t) ? !1 : ((e[n] = t), !0);
}
function Mb(e) {
  return (e.flags & 32) === 32;
}
function Tb(e, n, t, i, r, o, s, a, c) {
  let l = n.consts,
    u = Ir(n, e, 4, s || null, a || null);
  uu(n, t, u, xi(l, c)), Rs(n, u);
  let d = (u.tView = lu(
    2,
    u,
    i,
    r,
    o,
    n.directiveRegistry,
    n.pipeRegistry,
    null,
    n.schemas,
    l,
    null,
  ));
  return (
    n.queries !== null && (n.queries.template(n, u), (d.queries = n.queries.embeddedTView(u))), u
  );
}
function xb(e, n, t, i, r, o, s, a, c, l) {
  let u = t + Mt,
    d = n.firstCreatePass ? Tb(u, n, e, i, r, o, s, a, c) : n.data[u];
  $n(d, !1);
  let g = Nb(n, e, d, t);
  Os() && Ps(n, e, g, d), sn(g, e);
  let f = ig(g, e, g, d);
  return (e[u] = f), Ls(e, f), ob(f, d, e), Ts(d) && au(n, e, d), c != null && cu(e, d, l), d;
}
function Ne(e, n, t, i, r, o, s, a) {
  let c = Y(),
    l = Se(),
    u = xi(l.consts, o);
  return xb(c, l, e, n, t, i, r, u, s, a), Ne;
}
var Nb = Ob;
function Ob(e, n, t, i) {
  return As(!0), n[ge].createComment('');
}
function Gn(e, n, t, i) {
  let r = Y(),
    o = Ns();
  if (Hi(r, o, n)) {
    let s = Se(),
      a = Ql();
    g1(a, r, e, n, t, i);
  }
  return Gn;
}
function Ab(e, n, t, i) {
  return Hi(e, Ns(), t) ? n + Pl(t) + i : Un;
}
function Uo(e, n) {
  return (e << 17) | (n << 2);
}
function Ln(e) {
  return (e >> 17) & 32767;
}
function Rb(e) {
  return (e & 2) == 2;
}
function Pb(e, n) {
  return (e & 131071) | (n << 17);
}
function Sl(e) {
  return e | 2;
}
function Ri(e) {
  return (e & 131068) >> 2;
}
function kc(e, n) {
  return (e & -131069) | (n << 2);
}
function kb(e) {
  return (e & 1) === 1;
}
function El(e) {
  return e | 1;
}
function Fb(e, n, t, i, r, o) {
  let s = o ? n.classBindings : n.styleBindings,
    a = Ln(s),
    c = Ri(s);
  e[i] = t;
  let l = !1,
    u;
  if (Array.isArray(t)) {
    let d = t;
    (u = d[1]), (u === null || Sr(d, u) > 0) && (l = !0);
  } else u = t;
  if (r)
    if (c !== 0) {
      let g = Ln(e[a + 1]);
      (e[i + 1] = Uo(g, a)), g !== 0 && (e[g + 1] = kc(e[g + 1], i)), (e[a + 1] = Pb(e[a + 1], i));
    } else (e[i + 1] = Uo(a, 0)), a !== 0 && (e[a + 1] = kc(e[a + 1], i)), (a = i);
  else (e[i + 1] = Uo(c, 0)), a === 0 ? (a = i) : (e[c + 1] = kc(e[c + 1], i)), (c = i);
  l && (e[i + 1] = Sl(e[i + 1])),
    mp(e, u, i, !0),
    mp(e, u, i, !1),
    Lb(n, u, e, i, o),
    (s = Uo(a, c)),
    o ? (n.classBindings = s) : (n.styleBindings = s);
}
function Lb(e, n, t, i, r) {
  let o = r ? e.residualClasses : e.residualStyles;
  o != null && typeof n == 'string' && Sr(o, n) >= 0 && (t[i + 1] = El(t[i + 1]));
}
function mp(e, n, t, i) {
  let r = e[t + 1],
    o = n === null,
    s = i ? Ln(r) : Ri(r),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let c = e[s],
      l = e[s + 1];
    jb(c, n) && ((a = !0), (e[s + 1] = i ? El(l) : Sl(l))), (s = i ? Ln(l) : Ri(l));
  }
  a && (e[t + 1] = i ? Sl(r) : El(r));
}
function jb(e, n) {
  return e === null || n == null || (Array.isArray(e) ? e[1] : e) === n
    ? !0
    : Array.isArray(e) && typeof n == 'string'
      ? Sr(e, n) >= 0
      : !1;
}
function rt(e, n, t) {
  let i = Y(),
    r = Ns();
  if (Hi(i, r, n)) {
    let o = Se(),
      s = Ql();
    eg(o, s, i, e, n, i[ge], t, !1);
  }
  return rt;
}
function vp(e, n, t, i, r) {
  let o = n.inputs,
    s = r ? 'class' : 'style';
  du(e, t, o[s], s, i);
}
function Nt(e, n) {
  return Bb(e, n, null, !0), Nt;
}
function Bb(e, n, t, i) {
  let r = Y(),
    o = Se(),
    s = A_(2);
  if ((o.firstUpdatePass && $b(o, e, s, i), n !== Un && Hi(r, s, n))) {
    let a = o.data[Li()];
    Wb(o, a, r, r[ge], e, (r[s + 1] = qb(n, t)), i, s);
  }
}
function Vb(e, n) {
  return n >= e.expandoStartIndex;
}
function $b(e, n, t, i) {
  let r = e.data;
  if (r[t + 1] === null) {
    let o = r[Li()],
      s = Vb(e, t);
    Qb(o, i) && n === null && !s && (n = !1), (n = Hb(r, o, n, i)), Fb(r, o, n, t, s, i);
  }
}
function Hb(e, n, t, i) {
  let r = F_(e),
    o = i ? n.residualClasses : n.residualStyles;
  if (r === null)
    (i ? n.classBindings : n.styleBindings) === 0 &&
      ((t = Fc(null, e, n, t, i)), (t = wr(t, n.attrs, i)), (o = null));
  else {
    let s = n.directiveStylingLast;
    if (s === -1 || e[s] !== r)
      if (((t = Fc(r, e, n, t, i)), o === null)) {
        let c = Ub(e, n, i);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Fc(null, e, n, c[1], i)), (c = wr(c, n.attrs, i)), Gb(e, n, i, c));
      } else o = zb(e, n, i);
  }
  return o !== void 0 && (i ? (n.residualClasses = o) : (n.residualStyles = o)), t;
}
function Ub(e, n, t) {
  let i = t ? n.classBindings : n.styleBindings;
  if (Ri(i) !== 0) return e[Ln(i)];
}
function Gb(e, n, t, i) {
  let r = t ? n.classBindings : n.styleBindings;
  e[Ln(r)] = i;
}
function zb(e, n, t) {
  let i,
    r = n.directiveEnd;
  for (let o = 1 + n.directiveStylingLast; o < r; o++) {
    let s = e[o].hostAttrs;
    i = wr(i, s, t);
  }
  return wr(i, n.attrs, t);
}
function Fc(e, n, t, i, r) {
  let o = null,
    s = t.directiveEnd,
    a = t.directiveStylingLast;
  for (
    a === -1 ? (a = t.directiveStart) : a++;
    a < s && ((o = n[a]), (i = wr(i, o.hostAttrs, r)), o !== e);

  )
    a++;
  return e !== null && (t.directiveStylingLast = a), i;
}
function wr(e, n, t) {
  let i = t ? 1 : 2,
    r = -1;
  if (n !== null)
    for (let o = 0; o < n.length; o++) {
      let s = n[o];
      typeof s == 'number'
        ? (r = s)
        : r === i &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ['', e]), Lv(e, s, t ? !0 : n[++o]));
    }
  return e === void 0 ? null : e;
}
function Wb(e, n, t, i, r, o, s, a) {
  if (!(n.type & 3)) return;
  let c = e.data,
    l = c[a + 1],
    u = kb(l) ? _p(c, n, t, r, Ri(l), s) : void 0;
  if (!vs(u)) {
    vs(o) || (Rb(l) && (o = _p(c, null, t, r, a, s)));
    let d = th(Li(), t);
    Wy(i, s, d, r, o);
  }
}
function _p(e, n, t, i, r, o) {
  let s = n === null,
    a;
  for (; r > 0; ) {
    let c = e[r],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      g = t[r + 1];
    g === Un && (g = d ? tt : void 0);
    let f = d ? Ic(g, i) : u === i ? g : void 0;
    if ((l && !vs(f) && (f = Ic(c, i)), vs(f) && ((a = f), s))) return a;
    let _ = e[r + 1];
    r = s ? Ln(_) : Ri(_);
  }
  if (n !== null) {
    let c = o ? n.residualClasses : n.residualStyles;
    c != null && (a = Ic(c, i));
  }
  return a;
}
function vs(e) {
  return e !== void 0;
}
function qb(e, n) {
  return (
    e == null ||
      e === '' ||
      (typeof n == 'string' ? (e = e + n) : typeof e == 'object' && (e = Le(nu(e)))),
    e
  );
}
function Qb(e, n) {
  return (e.flags & (n ? 8 : 16)) !== 0;
}
function Zb(e, n, t, i, r, o) {
  let s = n.consts,
    a = xi(s, r),
    c = Ir(n, e, 2, i, a);
  return (
    uu(n, t, c, xi(s, o)),
    c.attrs !== null && ps(c, c.attrs, !1),
    c.mergedAttrs !== null && ps(c, c.mergedAttrs, !0),
    n.queries !== null && n.queries.elementStart(n, c),
    c
  );
}
function p(e, n, t, i) {
  let r = Y(),
    o = Se(),
    s = Mt + e,
    a = r[ge],
    c = o.firstCreatePass ? Zb(s, o, r, n, t, i) : o.data[s],
    l = Yb(o, r, c, a, n, e);
  r[s] = l;
  let u = Ts(c);
  return (
    $n(c, !0),
    Qh(a, l, c),
    !Mb(c) && Os() && Ps(o, r, l, c),
    w_() === 0 && sn(l, r),
    C_(),
    u && (au(o, r, c), su(o, c, r)),
    i !== null && cu(r, c),
    p
  );
}
function h() {
  let e = je();
  Gl() ? lh() : ((e = e.parent), $n(e, !1));
  let n = e;
  I_(n) && M_(), S_();
  let t = Se();
  return (
    t.firstCreatePass && (Rs(t, e), Hl(e) && t.queries.elementEnd(e)),
    n.classesWithoutHost != null && G_(n) && vp(t, n, Y(), n.classesWithoutHost, !0),
    n.stylesWithoutHost != null && z_(n) && vp(t, n, Y(), n.stylesWithoutHost, !1),
    h
  );
}
function O(e, n, t, i) {
  return p(e, n, t, i), h(), O;
}
var Yb = (e, n, t, i, r, o) => (As(!0), Vh(i, r, V_()));
function Jb(e, n, t, i, r) {
  let o = n.consts,
    s = xi(o, i),
    a = Ir(n, e, 8, 'ng-container', s);
  s !== null && ps(a, s, !0);
  let c = xi(o, r);
  return uu(n, t, a, c), n.queries !== null && n.queries.elementStart(n, a), a;
}
function Tr(e, n, t) {
  let i = Y(),
    r = Se(),
    o = e + Mt,
    s = r.firstCreatePass ? Jb(o, r, i, n, t) : r.data[o];
  $n(s, !0);
  let a = Kb(r, i, s, e);
  return (
    (i[o] = a),
    Os() && Ps(r, i, a, s),
    sn(a, i),
    Ts(s) && (au(r, i, s), su(r, s, i)),
    t != null && cu(i, s),
    Tr
  );
}
function xr() {
  let e = je(),
    n = Se();
  return (
    Gl() ? lh() : ((e = e.parent), $n(e, !1)),
    n.firstCreatePass && (Rs(n, e), Hl(e) && n.queries.elementEnd(e)),
    xr
  );
}
var Kb = (e, n, t, i) => (As(!0), Ny(n[ge], ''));
function Ui() {
  return Y();
}
function un(e, n, t) {
  let i = Y(),
    r = Ns();
  if (Hi(i, r, n)) {
    let o = Se(),
      s = Ql();
    eg(o, s, i, e, n, i[ge], t, !0);
  }
  return un;
}
var _s = 'en-US';
var Xb = _s;
function eD(e) {
  typeof e == 'string' && (Xb = e.toLowerCase().replace(/_/g, '-'));
}
var tD = (e, n, t) => {};
function Ze(e, n, t, i) {
  let r = Y(),
    o = Se(),
    s = je();
  return iD(o, r, r[ge], s, e, n, i), Ze;
}
function nD(e, n, t, i) {
  let r = e.cleanup;
  if (r != null)
    for (let o = 0; o < r.length - 1; o += 2) {
      let s = r[o];
      if (s === t && r[o + 1] === i) {
        let a = n[ns],
          c = r[o + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == 'string' && (o += 2);
    }
  return null;
}
function iD(e, n, t, i, r, o, s) {
  let a = Ts(i),
    l = e.firstCreatePass && sg(e),
    u = n[ht],
    d = og(n),
    g = !0;
  if (i.type & 3 || s) {
    let y = it(i, n),
      b = s ? s(y) : y,
      D = d.length,
      z = s ? (T) => s(Tt(T[i.index])) : i.index,
      R = null;
    if ((!s && a && (R = nD(e, n, r, i.index)), R !== null)) {
      let T = R.__ngLastListenerFn__ || R;
      (T.__ngNextListenerFn__ = o), (R.__ngLastListenerFn__ = o), (g = !1);
    } else {
      (o = bp(i, n, u, o)), tD(y, r, o);
      let T = t.listen(b, r, o);
      d.push(o, T), l && l.push(r, z, D, D + 1);
    }
  } else o = bp(i, n, u, o);
  let f = i.outputs,
    _;
  if (g && f !== null && (_ = f[r])) {
    let y = _.length;
    if (y)
      for (let b = 0; b < y; b += 2) {
        let D = _[b],
          z = _[b + 1],
          G = n[D][z].subscribe(o),
          L = d.length;
        d.push(o, G), l && l.push(r, i.index, L, -(L + 1));
      }
  }
}
function yp(e, n, t, i) {
  let r = W(null);
  try {
    return Ct(6, n, t), t(i) !== !1;
  } catch (o) {
    return ag(e, o), !1;
  } finally {
    Ct(7, n, t), W(r);
  }
}
function bp(e, n, t, i) {
  return function r(o) {
    if (o === Function) return i;
    let s = e.componentOffset > -1 ? cn(e.index, n) : n;
    pu(s, 5);
    let a = yp(n, t, i, o),
      c = r.__ngNextListenerFn__;
    for (; c; ) (a = yp(n, t, c, o) && a), (c = c.__ngNextListenerFn__);
    return a;
  };
}
function Ve(e = 1) {
  return j_(e);
}
function dn(e, n, t, i) {
  pb(e, n, t, i);
}
function Du(e, n, t) {
  fb(e, n, t);
}
function Ot(e) {
  let n = Y(),
    t = Se(),
    i = dh();
  zl(i + 1);
  let r = vu(t, i);
  if (e.dirty && __(n) === ((r.metadata.flags & 2) === 2)) {
    if (r.matches === null) e.reset([]);
    else {
      let o = mb(n, i);
      e.reset(o, dy), e.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function At() {
  return db(Y(), dh());
}
function $s(e) {
  let n = x_();
  return v_(n, Mt + e);
}
function m(e, n = '') {
  let t = Y(),
    i = Se(),
    r = e + Mt,
    o = i.firstCreatePass ? Ir(i, r, 1, n, null) : i.data[r],
    s = rD(i, t, o, n, e);
  (t[r] = s), Os() && Ps(i, t, s, o), $n(o, !1);
}
var rD = (e, n, t, i, r) => (As(!0), Ty(n[ge], i));
function zn(e) {
  return wu('', e, ''), zn;
}
function wu(e, n, t) {
  let i = Y(),
    r = Ab(i, e, n, t);
  return r !== Un && y1(i, Li(), r), wu;
}
function oD(e, n, t) {
  let i = Se();
  if (i.firstCreatePass) {
    let r = on(e);
    Il(t, i.data, i.blueprint, r, !0), Il(n, i.data, i.blueprint, r, !1);
  }
}
function Il(e, n, t, i, r) {
  if (((e = Ce(e)), Array.isArray(e))) for (let o = 0; o < e.length; o++) Il(e[o], n, t, i, r);
  else {
    let o = Se(),
      s = Y(),
      a = je(),
      c = Ii(e) ? e : Ce(e.provide),
      l = Wp(e),
      u = a.providerIndexes & 1048575,
      d = a.directiveStart,
      g = a.providerIndexes >> 20;
    if (Ii(e) || !e.multi) {
      let f = new Pn(l, r, Ue),
        _ = jc(c, n, r ? u : u + g, d);
      _ === -1
        ? (Kc(as(a, s), o, c),
          Lc(o, e, n.length),
          n.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          r && (a.providerIndexes += 1048576),
          t.push(f),
          s.push(f))
        : ((t[_] = f), (s[_] = f));
    } else {
      let f = jc(c, n, u + g, d),
        _ = jc(c, n, u, u + g),
        y = f >= 0 && t[f],
        b = _ >= 0 && t[_];
      if ((r && !b) || (!r && !y)) {
        Kc(as(a, s), o, c);
        let D = cD(r ? aD : sD, t.length, r, i, l);
        !r && b && (t[_].providerFactory = D),
          Lc(o, e, n.length, 0),
          n.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          r && (a.providerIndexes += 1048576),
          t.push(D),
          s.push(D);
      } else {
        let D = Sg(t[r ? _ : f], l, !r && i);
        Lc(o, e, f > -1 ? f : _, D);
      }
      !r && i && b && t[_].componentProviders++;
    }
  }
}
function Lc(e, n, t, i) {
  let r = Ii(n),
    o = o_(n);
  if (r || o) {
    let c = (o ? Ce(n.useClass) : n).prototype.ngOnDestroy;
    if (c) {
      let l = e.destroyHooks || (e.destroyHooks = []);
      if (!r && n.multi) {
        let u = l.indexOf(t);
        u === -1 ? l.push(t, [i, c]) : l[u + 1].push(i, c);
      } else l.push(t, c);
    }
  }
}
function Sg(e, n, t) {
  return t && e.componentProviders++, e.multi.push(n) - 1;
}
function jc(e, n, t, i) {
  for (let r = t; r < i; r++) if (n[r] === e) return r;
  return -1;
}
function sD(e, n, t, i) {
  return Ml(this.multi, []);
}
function aD(e, n, t, i) {
  let r = this.multi,
    o;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = kn(t, t[j], this.providerFactory.index, i);
    (o = a.slice(0, s)), Ml(r, o);
    for (let c = s; c < a.length; c++) o.push(a[c]);
  } else (o = []), Ml(r, o);
  return o;
}
function Ml(e, n) {
  for (let t = 0; t < e.length; t++) {
    let i = e[t];
    n.push(i());
  }
  return n;
}
function cD(e, n, t, i, r) {
  let o = new Pn(e, t, Ue);
  return (o.multi = []), (o.index = n), (o.componentProviders = 0), Sg(o, r, i && !t), o;
}
function Eg(e, n = []) {
  return (t) => {
    t.providersResolver = (i, r) => oD(i, r ? r(e) : e, n);
  };
}
var lD = (() => {
  class e {
    constructor(t) {
      (this._injector = t), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(t) {
      if (!t.standalone) return null;
      if (!this.cachedInjectors.has(t)) {
        let i = Up(!1, t.type),
          r = i.length > 0 ? bu([i], this._injector, `Standalone[${t.type.name}]`) : null;
        this.cachedInjectors.set(t, r);
      }
      return this.cachedInjectors.get(t);
    }
    ngOnDestroy() {
      try {
        for (let t of this.cachedInjectors.values()) t !== null && t.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static {
      this.ɵprov = C({
        token: e,
        providedIn: 'environment',
        factory: () => new e(U(We)),
      });
    }
  }
  return e;
})();
function M(e) {
  Mr('NgStandalone'), (e.getStandaloneInjector = (n) => n.get(lD).getOrCreateStandaloneInjector(e));
}
function Nr(e, n, t, i) {
  return dD(Y(), N_(), e, n, t, i);
}
function uD(e, n) {
  let t = e[n];
  return t === Un ? void 0 : t;
}
function dD(e, n, t, i, r, o) {
  let s = n + t;
  return Hi(e, s, r) ? Ib(e, s + 1, o ? i.call(o, r) : i(r)) : uD(e, s + 1);
}
function Cu(e, n) {
  return js(e, n);
}
var Hs = (() => {
  class e {
    log(t) {
      console.log(t);
    }
    warn(t) {
      console.warn(t);
    }
    static {
      this.ɵfac = function (i) {
        return new (i || e)();
      };
    }
    static {
      this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'platform' });
    }
  }
  return e;
})();
var Ig = new A('');
function Or(e) {
  return !!e && typeof e.then == 'function';
}
function Mg(e) {
  return !!e && typeof e.subscribe == 'function';
}
var Tg = new A(''),
  xg = (() => {
    class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((t, i) => {
            (this.resolve = t), (this.reject = i);
          })),
          (this.appInits = v(Tg, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let t = [];
        for (let r of this.appInits) {
          let o = r();
          if (Or(o)) t.push(o);
          else if (Mg(o)) {
            let s = new Promise((a, c) => {
              o.subscribe({ complete: a, error: c });
            });
            t.push(s);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(t)
          .then(() => {
            i();
          })
          .catch((r) => {
            this.reject(r);
          }),
          t.length === 0 && i(),
          (this.initialized = !0);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })(),
  Su = new A('');
function fD() {
  af(() => {
    throw new E(600, !1);
  });
}
function pD(e) {
  return e.isBoundToModule;
}
var hD = 10;
function gD(e, n, t) {
  try {
    let i = t();
    return Or(i)
      ? i.catch((r) => {
          throw (n.runOutsideAngular(() => e.handleError(r)), r);
        })
      : i;
  } catch (i) {
    throw (n.runOutsideAngular(() => e.handleError(i)), i);
  }
}
var fn = (() => {
  class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = v(ly)),
        (this.afterRenderEffectManager = v(mu)),
        (this.zonelessEnabled = v(hu)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new fe()),
        (this.afterTick = new fe()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = v(Vi).hasPendingTasks.pipe(V((t) => !t))),
        (this._injector = v(We));
    }
    get allViews() {
      return [...this.externalTestViews.keys(), ...this._views];
    }
    get destroyed() {
      return this._destroyed;
    }
    whenStable() {
      let t;
      return new Promise((i) => {
        t = this.isStable.subscribe({
          next: (r) => {
            r && i();
          },
        });
      }).finally(() => {
        t.unsubscribe();
      });
    }
    get injector() {
      return this._injector;
    }
    bootstrap(t, i) {
      let r = t instanceof fs;
      if (!this._injector.get(xg).done) {
        let g = !r && Bp(t),
          f = !1;
        throw new E(405, f);
      }
      let s;
      r ? (s = t) : (s = this._injector.get(Oi).resolveComponentFactory(t)),
        this.componentTypes.push(s.componentType);
      let a = pD(s) ? void 0 : this._injector.get(an),
        c = i || s.selector,
        l = s.create(qe.NULL, [], c, a),
        u = l.location.nativeElement,
        d = l.injector.get(Ig, null);
      return (
        d?.registerApplication(u),
        l.onDestroy(() => {
          this.detachView(l.hostView), Zo(this.components, l), d?.unregisterApplication(u);
        }),
        this._loadComponent(l),
        l
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(t) {
      if (this._runningTick) throw new E(101, !1);
      let i = W(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(t);
      } catch (r) {
        this.internalErrorHandler(r);
      } finally {
        (this._runningTick = !1), W(i), this.afterTick.next();
      }
    }
    detectChangesInAttachedViews(t) {
      let i = null;
      this._injector.destroyed || (i = this._injector.get(Ai, null, { optional: !0 }));
      let r = 0,
        o = this.afterRenderEffectManager;
      for (; r < hD; ) {
        let s = r === 0;
        if (t || !s) {
          this.beforeRender.next(s);
          for (let { _lView: a, notifyErrorHandler: c } of this._views)
            mD(a, c, s, this.zonelessEnabled);
        } else i?.begin?.(), i?.end?.();
        if (
          (r++,
          o.executeInternalCallbacks(),
          !this.allViews.some(({ _lView: a }) => yr(a)) &&
            (o.execute(), !this.allViews.some(({ _lView: a }) => yr(a))))
        )
          break;
      }
    }
    attachView(t) {
      let i = t;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(t) {
      let i = t;
      Zo(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(t) {
      this.attachView(t.hostView), this.tick(), this.components.push(t);
      let i = this._injector.get(Su, []);
      [...this._bootstrapListeners, ...i].forEach((r) => r(t));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((t) => t()),
            this._views.slice().forEach((t) => t.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(t) {
      return this._destroyListeners.push(t), () => Zo(this._destroyListeners, t);
    }
    destroy() {
      if (this._destroyed) throw new E(406, !1);
      let t = this._injector;
      t.destroy && !t.destroyed && t.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
    static {
      this.ɵfac = function (i) {
        return new (i || e)();
      };
    }
    static {
      this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
  }
  return e;
})();
function Zo(e, n) {
  let t = e.indexOf(n);
  t > -1 && e.splice(t, 1);
}
function mD(e, n, t, i) {
  if (!t && !yr(e)) return;
  ug(e, n, t && !i ? 0 : 1);
}
var Tl = class {
    constructor(n, t) {
      (this.ngModuleFactory = n), (this.componentFactories = t);
    }
  },
  Eu = (() => {
    class e {
      compileModuleSync(t) {
        return new Cl(t);
      }
      compileModuleAsync(t) {
        return Promise.resolve(this.compileModuleSync(t));
      }
      compileModuleAndAllComponentsSync(t) {
        let i = this.compileModuleSync(t),
          r = Vp(t),
          o = jh(r.declarations).reduce((s, a) => {
            let c = xn(a);
            return c && s.push(new br(c)), s;
          }, []);
        return new Tl(i, o);
      }
      compileModuleAndAllComponentsAsync(t) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(t));
      }
      clearCache() {}
      clearCacheFor(t) {}
      getModuleId(t) {}
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })();
var vD = (() => {
    class e {
      constructor() {
        (this.zone = v(ie)), (this.changeDetectionScheduler = v(Ni)), (this.applicationRef = v(fn));
      }
      initialize() {
        this._onMicrotaskEmptySubscription ||
          (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.changeDetectionScheduler.runningTick ||
                this.zone.run(() => {
                  this.applicationRef.tick();
                });
            },
          }));
      }
      ngOnDestroy() {
        this._onMicrotaskEmptySubscription?.unsubscribe();
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })(),
  _D = new A('', { factory: () => !1 });
function Ng({ ngZoneFactory: e, ignoreChangesOutsideZone: n }) {
  return (
    (e ??= () => new ie(Ag())),
    [
      { provide: ie, useFactory: e },
      {
        provide: Ei,
        multi: !0,
        useFactory: () => {
          let t = v(vD, { optional: !0 });
          return () => t.initialize();
        },
      },
      {
        provide: Ei,
        multi: !0,
        useFactory: () => {
          let t = v(yD);
          return () => {
            t.initialize();
          };
        },
      },
      n === !0 ? { provide: hg, useValue: !0 } : [],
    ]
  );
}
function Og(e) {
  let n = e?.ignoreChangesOutsideZone,
    t = Ng({
      ngZoneFactory: () => {
        let i = Ag(e);
        return i.shouldCoalesceEventChangeDetection && Mr('NgZone_CoalesceEvent'), new ie(i);
      },
      ignoreChangesOutsideZone: n,
    });
  return Cs([{ provide: _D, useValue: !0 }, { provide: hu, useValue: !1 }, t]);
}
function Ag(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var yD = (() => {
  class e {
    constructor() {
      (this.subscription = new se()),
        (this.initialized = !1),
        (this.zone = v(ie)),
        (this.pendingTasks = v(Vi));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let t = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (t = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              ie.assertNotInAngularZone(),
                queueMicrotask(() => {
                  t !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(t), (t = null));
                });
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            ie.assertInAngularZone(), (t ??= this.pendingTasks.add());
          }),
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static {
      this.ɵfac = function (i) {
        return new (i || e)();
      };
    }
    static {
      this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
  }
  return e;
})();
var bD = (() => {
  class e {
    constructor() {
      (this.appRef = v(fn)),
        (this.taskService = v(Vi)),
        (this.ngZone = v(ie)),
        (this.zonelessEnabled = v(hu)),
        (this.disableScheduling = v(hg, { optional: !0 }) ?? !1),
        (this.zoneIsDefined = typeof Zone < 'u' && !!Zone.root.run),
        (this.schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }]),
        (this.subscriptions = new se()),
        (this.angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(ls) : null),
        (this.cancelScheduledCallback = null),
        (this.shouldRefreshViews = !1),
        (this.useMicrotaskScheduler = !1),
        (this.runningTick = !1),
        (this.pendingRenderTaskId = null),
        this.subscriptions.add(
          this.appRef.afterTick.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled && (this.ngZone instanceof il || !this.zoneIsDefined));
    }
    notify(t) {
      if (!this.zonelessEnabled && t === 5) return;
      switch (t) {
        case 3:
        case 2:
        case 0:
        case 4:
        case 5:
        case 1: {
          this.shouldRefreshViews = !0;
          break;
        }
        case 8:
        case 7:
        case 6:
        case 9:
        default:
      }
      if (!this.shouldScheduleTick()) return;
      let i = this.useMicrotaskScheduler ? np : xh;
      (this.pendingRenderTaskId = this.taskService.add()),
        this.zoneIsDefined
          ? Zone.root.run(() => {
              this.cancelScheduledCallback = i(() => {
                this.tick(this.shouldRefreshViews);
              });
            })
          : (this.cancelScheduledCallback = i(() => {
              this.tick(this.shouldRefreshViews);
            }));
    }
    shouldScheduleTick() {
      return !(
        this.disableScheduling ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(ls + this.angularZoneId))
      );
    }
    tick(t) {
      if (this.runningTick || this.appRef.destroyed) return;
      let i = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            (this.runningTick = !0), this.appRef._tick(t);
          },
          void 0,
          this.schedulerTickApplyArgs,
        );
      } catch (r) {
        throw (this.taskService.remove(i), r);
      } finally {
        this.cleanup();
      }
      (this.useMicrotaskScheduler = !0),
        np(() => {
          (this.useMicrotaskScheduler = !1), this.taskService.remove(i);
        });
    }
    ngOnDestroy() {
      this.subscriptions.unsubscribe(), this.cleanup();
    }
    cleanup() {
      if (
        ((this.shouldRefreshViews = !1),
        (this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let t = this.pendingRenderTaskId;
        (this.pendingRenderTaskId = null), this.taskService.remove(t);
      }
    }
    static {
      this.ɵfac = function (i) {
        return new (i || e)();
      };
    }
    static {
      this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
  }
  return e;
})();
function DD() {
  return (typeof $localize < 'u' && $localize.locale) || _s;
}
var Us = new A('', {
  providedIn: 'root',
  factory: () => v(Us, $.Optional | $.SkipSelf) || DD(),
});
var Rg = new A('');
function Go(e) {
  return !!e.platformInjector;
}
function wD(e) {
  let n = Go(e) ? e.r3Injector : e.moduleRef.injector,
    t = n.get(ie);
  return t.run(() => {
    Go(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers();
    let i = n.get(Bt, null),
      r;
    if (
      (t.runOutsideAngular(() => {
        r = t.onError.subscribe({
          next: (o) => {
            i.handleError(o);
          },
        });
      }),
      Go(e))
    ) {
      let o = () => n.destroy(),
        s = e.platformInjector.get(Rg);
      s.add(o),
        n.onDestroy(() => {
          r.unsubscribe(), s.delete(o);
        });
    } else
      e.moduleRef.onDestroy(() => {
        Zo(e.allPlatformModules, e.moduleRef), r.unsubscribe();
      });
    return gD(i, t, () => {
      let o = n.get(xg);
      return (
        o.runInitializers(),
        o.donePromise.then(() => {
          let s = n.get(Us, _s);
          if ((eD(s || _s), Go(e))) {
            let a = n.get(fn);
            return e.rootComponent !== void 0 && a.bootstrap(e.rootComponent), a;
          } else return CD(e.moduleRef, e.allPlatformModules), e.moduleRef;
        })
      );
    });
  });
}
function CD(e, n) {
  let t = e.injector.get(fn);
  if (e._bootstrapComponents.length > 0) e._bootstrapComponents.forEach((i) => t.bootstrap(i));
  else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(t);
  else throw new E(-403, !1);
  n.push(e);
}
var Yo = null;
function SD(e = [], n) {
  return qe.create({
    name: n,
    providers: [
      { provide: Ss, useValue: 'platform' },
      { provide: Rg, useValue: new Set([() => (Yo = null)]) },
      ...e,
    ],
  });
}
function ED(e = []) {
  if (Yo) return Yo;
  let n = SD(e);
  return (Yo = n), fD(), ID(n), n;
}
function ID(e) {
  e.get(Xl, null)?.forEach((t) => t());
}
var Gt = (() => {
  class e {
    static {
      this.__NG_ELEMENT_ID__ = MD;
    }
  }
  return e;
})();
function MD(e) {
  return TD(je(), Y(), (e & 16) === 16);
}
function TD(e, n, t) {
  if (Ms(e) && !t) {
    let i = cn(e.index, n);
    return new Fn(i, i);
  } else if (e.type & 175) {
    let i = n[It];
    return new Fn(i, n);
  }
  return null;
}
var xl = class {
    constructor() {}
    supports(n) {
      return Cg(n);
    }
    create(n) {
      return new Nl(n);
    }
  },
  xD = (e, n) => n,
  Nl = class {
    constructor(n) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = n || xD);
    }
    forEachItem(n) {
      let t;
      for (t = this._itHead; t !== null; t = t._next) n(t);
    }
    forEachOperation(n) {
      let t = this._itHead,
        i = this._removalsHead,
        r = 0,
        o = null;
      for (; t || i; ) {
        let s = !i || (t && t.currentIndex < Dp(i, r, o)) ? t : i,
          a = Dp(s, r, o),
          c = s.currentIndex;
        if (s === i) r--, (i = i._nextRemoved);
        else if (((t = t._next), s.previousIndex == null)) r++;
        else {
          o || (o = []);
          let l = a - r,
            u = c - r;
          if (l != u) {
            for (let g = 0; g < l; g++) {
              let f = g < o.length ? o[g] : (o[g] = 0),
                _ = f + g;
              u <= _ && _ < l && (o[g] = f + 1);
            }
            let d = s.previousIndex;
            o[d] = u - l;
          }
        }
        a !== c && n(s, a, c);
      }
    }
    forEachPreviousItem(n) {
      let t;
      for (t = this._previousItHead; t !== null; t = t._nextPrevious) n(t);
    }
    forEachAddedItem(n) {
      let t;
      for (t = this._additionsHead; t !== null; t = t._nextAdded) n(t);
    }
    forEachMovedItem(n) {
      let t;
      for (t = this._movesHead; t !== null; t = t._nextMoved) n(t);
    }
    forEachRemovedItem(n) {
      let t;
      for (t = this._removalsHead; t !== null; t = t._nextRemoved) n(t);
    }
    forEachIdentityChange(n) {
      let t;
      for (t = this._identityChangesHead; t !== null; t = t._nextIdentityChange) n(t);
    }
    diff(n) {
      if ((n == null && (n = []), !Cg(n))) throw new E(900, !1);
      return this.check(n) ? this : null;
    }
    onDestroy() {}
    check(n) {
      this._reset();
      let t = this._itHead,
        i = !1,
        r,
        o,
        s;
      if (Array.isArray(n)) {
        this.length = n.length;
        for (let a = 0; a < this.length; a++)
          (o = n[a]),
            (s = this._trackByFn(a, o)),
            t === null || !Object.is(t.trackById, s)
              ? ((t = this._mismatch(t, o, s, a)), (i = !0))
              : (i && (t = this._verifyReinsertion(t, o, s, a)),
                Object.is(t.item, o) || this._addIdentityChange(t, o)),
            (t = t._next);
      } else
        (r = 0),
          Sb(n, (a) => {
            (s = this._trackByFn(r, a)),
              t === null || !Object.is(t.trackById, s)
                ? ((t = this._mismatch(t, a, s, r)), (i = !0))
                : (i && (t = this._verifyReinsertion(t, a, s, r)),
                  Object.is(t.item, a) || this._addIdentityChange(t, a)),
              (t = t._next),
              r++;
          }),
          (this.length = r);
      return this._truncate(t), (this.collection = n), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let n;
        for (n = this._previousItHead = this._itHead; n !== null; n = n._next)
          n._nextPrevious = n._next;
        for (n = this._additionsHead; n !== null; n = n._nextAdded)
          n.previousIndex = n.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, n = this._movesHead;
          n !== null;
          n = n._nextMoved
        )
          n.previousIndex = n.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(n, t, i, r) {
      let o;
      return (
        n === null ? (o = this._itTail) : ((o = n._prev), this._remove(n)),
        (n = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(i, null)),
        n !== null
          ? (Object.is(n.item, t) || this._addIdentityChange(n, t), this._reinsertAfter(n, o, r))
          : ((n = this._linkedRecords === null ? null : this._linkedRecords.get(i, r)),
            n !== null
              ? (Object.is(n.item, t) || this._addIdentityChange(n, t), this._moveAfter(n, o, r))
              : (n = this._addAfter(new Ol(t, i), o, r))),
        n
      );
    }
    _verifyReinsertion(n, t, i, r) {
      let o = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(i, null);
      return (
        o !== null
          ? (n = this._reinsertAfter(o, n._prev, r))
          : n.currentIndex != r && ((n.currentIndex = r), this._addToMoves(n, r)),
        n
      );
    }
    _truncate(n) {
      for (; n !== null; ) {
        let t = n._next;
        this._addToRemovals(this._unlink(n)), (n = t);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(n, t, i) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(n);
      let r = n._prevRemoved,
        o = n._nextRemoved;
      return (
        r === null ? (this._removalsHead = o) : (r._nextRemoved = o),
        o === null ? (this._removalsTail = r) : (o._prevRemoved = r),
        this._insertAfter(n, t, i),
        this._addToMoves(n, i),
        n
      );
    }
    _moveAfter(n, t, i) {
      return this._unlink(n), this._insertAfter(n, t, i), this._addToMoves(n, i), n;
    }
    _addAfter(n, t, i) {
      return (
        this._insertAfter(n, t, i),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = n)
          : (this._additionsTail = this._additionsTail._nextAdded = n),
        n
      );
    }
    _insertAfter(n, t, i) {
      let r = t === null ? this._itHead : t._next;
      return (
        (n._next = r),
        (n._prev = t),
        r === null ? (this._itTail = n) : (r._prev = n),
        t === null ? (this._itHead = n) : (t._next = n),
        this._linkedRecords === null && (this._linkedRecords = new ys()),
        this._linkedRecords.put(n),
        (n.currentIndex = i),
        n
      );
    }
    _remove(n) {
      return this._addToRemovals(this._unlink(n));
    }
    _unlink(n) {
      this._linkedRecords !== null && this._linkedRecords.remove(n);
      let t = n._prev,
        i = n._next;
      return (
        t === null ? (this._itHead = i) : (t._next = i),
        i === null ? (this._itTail = t) : (i._prev = t),
        n
      );
    }
    _addToMoves(n, t) {
      return (
        n.previousIndex === t ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = n)
            : (this._movesTail = this._movesTail._nextMoved = n)),
        n
      );
    }
    _addToRemovals(n) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new ys()),
        this._unlinkedRecords.put(n),
        (n.currentIndex = null),
        (n._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = n), (n._prevRemoved = null))
          : ((n._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = n)),
        n
      );
    }
    _addIdentityChange(n, t) {
      return (
        (n.item = t),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = n)
          : (this._identityChangesTail = this._identityChangesTail._nextIdentityChange = n),
        n
      );
    }
  },
  Ol = class {
    constructor(n, t) {
      (this.item = n),
        (this.trackById = t),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  Al = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(n) {
      this._head === null
        ? ((this._head = this._tail = n), (n._nextDup = null), (n._prevDup = null))
        : ((this._tail._nextDup = n),
          (n._prevDup = this._tail),
          (n._nextDup = null),
          (this._tail = n));
    }
    get(n, t) {
      let i;
      for (i = this._head; i !== null; i = i._nextDup)
        if ((t === null || t <= i.currentIndex) && Object.is(i.trackById, n)) return i;
      return null;
    }
    remove(n) {
      let t = n._prevDup,
        i = n._nextDup;
      return (
        t === null ? (this._head = i) : (t._nextDup = i),
        i === null ? (this._tail = t) : (i._prevDup = t),
        this._head === null
      );
    }
  },
  ys = class {
    constructor() {
      this.map = new Map();
    }
    put(n) {
      let t = n.trackById,
        i = this.map.get(t);
      i || ((i = new Al()), this.map.set(t, i)), i.add(n);
    }
    get(n, t) {
      let i = n,
        r = this.map.get(i);
      return r ? r.get(n, t) : null;
    }
    remove(n) {
      let t = n.trackById;
      return this.map.get(t).remove(n) && this.map.delete(t), n;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function Dp(e, n, t) {
  let i = e.previousIndex;
  if (i === null) return i;
  let r = 0;
  return t && i < t.length && (r = t[i]), i + n + r;
}
function wp() {
  return new Iu([new xl()]);
}
var Iu = (() => {
  class e {
    static {
      this.ɵprov = C({ token: e, providedIn: 'root', factory: wp });
    }
    constructor(t) {
      this.factories = t;
    }
    static create(t, i) {
      if (i != null) {
        let r = i.factories.slice();
        t = t.concat(r);
      }
      return new e(t);
    }
    static extend(t) {
      return {
        provide: e,
        useFactory: (i) => e.create(t, i || wp()),
        deps: [[e, new Ap(), new Fl()]],
      };
    }
    find(t) {
      let i = this.factories.find((r) => r.supports(t));
      if (i != null) return i;
      throw new E(901, !1);
    }
  }
  return e;
})();
function Pg(e) {
  try {
    let { rootComponent: n, appProviders: t, platformProviders: i } = e,
      r = ED(i),
      o = [Ng({}), { provide: Ni, useExisting: bD }, ...(t || [])],
      s = new ms({
        providers: o,
        parent: r,
        debugName: '',
        runEnvironmentInitializers: !1,
      });
    return wD({
      r3Injector: s.injector,
      platformInjector: r,
      rootComponent: n,
    });
  } catch (n) {
    return Promise.reject(n);
  }
}
var kg = new A('');
var Ug = null;
function Gi() {
  return Ug;
}
function Gg(e) {
  Ug ??= e;
}
var Gs = class {};
var Oe = new A(''),
  zg = (() => {
    class e {
      historyGo(t) {
        throw new Error('');
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({
          token: e,
          factory: () => v(PD),
          providedIn: 'platform',
        });
      }
    }
    return e;
  })();
var PD = (() => {
  class e extends zg {
    constructor() {
      super(),
        (this._doc = v(Oe)),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return Gi().getBaseHref(this._doc);
    }
    onPopState(t) {
      let i = Gi().getGlobalEventTarget(this._doc, 'window');
      return i.addEventListener('popstate', t, !1), () => i.removeEventListener('popstate', t);
    }
    onHashChange(t) {
      let i = Gi().getGlobalEventTarget(this._doc, 'window');
      return i.addEventListener('hashchange', t, !1), () => i.removeEventListener('hashchange', t);
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(t) {
      this._location.pathname = t;
    }
    pushState(t, i, r) {
      this._history.pushState(t, i, r);
    }
    replaceState(t, i, r) {
      this._history.replaceState(t, i, r);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(t = 0) {
      this._history.go(t);
    }
    getState() {
      return this._history.state;
    }
    static {
      this.ɵfac = function (i) {
        return new (i || e)();
      };
    }
    static {
      this.ɵprov = C({
        token: e,
        factory: () => new e(),
        providedIn: 'platform',
      });
    }
  }
  return e;
})();
function Wg(e, n) {
  if (e.length == 0) return n;
  if (n.length == 0) return e;
  let t = 0;
  return (
    e.endsWith('/') && t++,
    n.startsWith('/') && t++,
    t == 2 ? e + n.substring(1) : t == 1 ? e + n : e + '/' + n
  );
}
function Fg(e) {
  let n = e.match(/#|\?|$/),
    t = (n && n.index) || e.length,
    i = t - (e[t - 1] === '/' ? 1 : 0);
  return e.slice(0, i) + e.slice(t);
}
function Wn(e) {
  return e && e[0] !== '?' ? '?' + e : e;
}
var Ws = (() => {
    class e {
      historyGo(t) {
        throw new Error('');
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: () => v(qg), providedIn: 'root' });
      }
    }
    return e;
  })(),
  kD = new A(''),
  qg = (() => {
    class e extends Ws {
      constructor(t, i) {
        super(),
          (this._platformLocation = t),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ?? this._platformLocation.getBaseHrefFromDOM() ?? v(Oe).location?.origin ?? '');
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
      }
      onPopState(t) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(t),
          this._platformLocation.onHashChange(t),
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(t) {
        return Wg(this._baseHref, t);
      }
      path(t = !1) {
        let i = this._platformLocation.pathname + Wn(this._platformLocation.search),
          r = this._platformLocation.hash;
        return r && t ? `${i}${r}` : i;
      }
      pushState(t, i, r, o) {
        let s = this.prepareExternalUrl(r + Wn(o));
        this._platformLocation.pushState(t, i, s);
      }
      replaceState(t, i, r, o) {
        let s = this.prepareExternalUrl(r + Wn(o));
        this._platformLocation.replaceState(t, i, s);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(t = 0) {
        this._platformLocation.historyGo?.(t);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)(U(zg), U(kD, 8));
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })();
var Ar = (() => {
  class e {
    constructor(t) {
      (this._subject = new Z()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = t);
      let i = this._locationStrategy.getBaseHref();
      (this._basePath = jD(Fg(Lg(i)))),
        this._locationStrategy.onPopState((r) => {
          this._subject.emit({
            url: this.path(!0),
            pop: !0,
            state: r.state,
            type: r.type,
          });
        });
    }
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe(), (this._urlChangeListeners = []);
    }
    path(t = !1) {
      return this.normalize(this._locationStrategy.path(t));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(t, i = '') {
      return this.path() == this.normalize(t + Wn(i));
    }
    normalize(t) {
      return e.stripTrailingSlash(LD(this._basePath, Lg(t)));
    }
    prepareExternalUrl(t) {
      return t && t[0] !== '/' && (t = '/' + t), this._locationStrategy.prepareExternalUrl(t);
    }
    go(t, i = '', r = null) {
      this._locationStrategy.pushState(r, '', t, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(t + Wn(i)), r);
    }
    replaceState(t, i = '', r = null) {
      this._locationStrategy.replaceState(r, '', t, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(t + Wn(i)), r);
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(t = 0) {
      this._locationStrategy.historyGo?.(t);
    }
    onUrlChange(t) {
      return (
        this._urlChangeListeners.push(t),
        (this._urlChangeSubscription ??= this.subscribe((i) => {
          this._notifyUrlChangeListeners(i.url, i.state);
        })),
        () => {
          let i = this._urlChangeListeners.indexOf(t);
          this._urlChangeListeners.splice(i, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeSubscription = null));
        }
      );
    }
    _notifyUrlChangeListeners(t = '', i) {
      this._urlChangeListeners.forEach((r) => r(t, i));
    }
    subscribe(t, i, r) {
      return this._subject.subscribe({ next: t, error: i, complete: r });
    }
    static {
      this.normalizeQueryParams = Wn;
    }
    static {
      this.joinWithSlash = Wg;
    }
    static {
      this.stripTrailingSlash = Fg;
    }
    static {
      this.ɵfac = function (i) {
        return new (i || e)(U(Ws));
      };
    }
    static {
      this.ɵprov = C({ token: e, factory: () => FD(), providedIn: 'root' });
    }
  }
  return e;
})();
function FD() {
  return new Ar(U(Ws));
}
function LD(e, n) {
  if (!e || !n.startsWith(e)) return n;
  let t = n.substring(e.length);
  return t === '' || ['/', ';', '?', '#'].includes(t[0]) ? t : n;
}
function Lg(e) {
  return e.replace(/\/index.html$/, '');
}
function jD(e) {
  if (new RegExp('^(https?:)?//').test(e)) {
    let [, t] = e.split(/\/\/[^\/]+/);
    return t;
  }
  return e;
}
function Qg(e, n) {
  n = encodeURIComponent(n);
  for (let t of e.split(';')) {
    let i = t.indexOf('='),
      [r, o] = i == -1 ? [t, ''] : [t.slice(0, i), t.slice(i + 1)];
    if (r.trim() === n) return decodeURIComponent(o);
  }
  return null;
}
var Mu = /\s+/,
  jg = [],
  Zg = (() => {
    class e {
      constructor(t, i) {
        (this._ngEl = t),
          (this._renderer = i),
          (this.initialClasses = jg),
          (this.stateMap = new Map());
      }
      set klass(t) {
        this.initialClasses = t != null ? t.trim().split(Mu) : jg;
      }
      set ngClass(t) {
        this.rawClass = typeof t == 'string' ? t.trim().split(Mu) : t;
      }
      ngDoCheck() {
        for (let i of this.initialClasses) this._updateState(i, !0);
        let t = this.rawClass;
        if (Array.isArray(t) || t instanceof Set) for (let i of t) this._updateState(i, !0);
        else if (t != null) for (let i of Object.keys(t)) this._updateState(i, !!t[i]);
        this._applyStateDiff();
      }
      _updateState(t, i) {
        let r = this.stateMap.get(t);
        r !== void 0
          ? (r.enabled !== i && ((r.changed = !0), (r.enabled = i)), (r.touched = !0))
          : this.stateMap.set(t, { enabled: i, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let t of this.stateMap) {
          let i = t[0],
            r = t[1];
          r.changed
            ? (this._toggleClass(i, r.enabled), (r.changed = !1))
            : r.touched || (r.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (r.touched = !1);
        }
      }
      _toggleClass(t, i) {
        (t = t.trim()),
          t.length > 0 &&
            t.split(Mu).forEach((r) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, r)
                : this._renderer.removeClass(this._ngEl.nativeElement, r);
            });
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)(Ue(Be), Ue(Bs));
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngClass', '']],
          inputs: { klass: [0, 'class', 'klass'], ngClass: 'ngClass' },
          standalone: !0,
        });
      }
    }
    return e;
  })();
var Tu = class {
    constructor(n, t, i, r) {
      (this.$implicit = n), (this.ngForOf = t), (this.index = i), (this.count = r);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  Yg = (() => {
    class e {
      set ngForOf(t) {
        (this._ngForOf = t), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(t) {
        this._trackByFn = t;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(t, i, r) {
        (this._viewContainer = t),
          (this._template = i),
          (this._differs = r),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(t) {
        t && (this._template = t);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let t = this._ngForOf;
          if (!this._differ && t)
            if (0)
              try {
              } catch {}
            else this._differ = this._differs.find(t).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let t = this._differ.diff(this._ngForOf);
          t && this._applyChanges(t);
        }
      }
      _applyChanges(t) {
        let i = this._viewContainer;
        t.forEachOperation((r, o, s) => {
          if (r.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new Tu(r.item, this._ngForOf, -1, -1),
              s === null ? void 0 : s,
            );
          else if (s == null) i.remove(o === null ? void 0 : o);
          else if (o !== null) {
            let a = i.get(o);
            i.move(a, s), Bg(a, r);
          }
        });
        for (let r = 0, o = i.length; r < o; r++) {
          let a = i.get(r).context;
          (a.index = r), (a.count = o), (a.ngForOf = this._ngForOf);
        }
        t.forEachIdentityChange((r) => {
          let o = i.get(r.currentIndex);
          Bg(o, r);
        });
      }
      static ngTemplateContextGuard(t, i) {
        return !0;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)(Ue(mt), Ue($t), Ue(Iu));
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngFor', '', 'ngForOf', '']],
          inputs: {
            ngForOf: 'ngForOf',
            ngForTrackBy: 'ngForTrackBy',
            ngForTemplate: 'ngForTemplate',
          },
          standalone: !0,
        });
      }
    }
    return e;
  })();
function Bg(e, n) {
  e.context.$implicit = n.item;
}
var Jg = (() => {
    class e {
      constructor(t, i) {
        (this._viewContainer = t),
          (this._context = new xu()),
          (this._thenTemplateRef = null),
          (this._elseTemplateRef = null),
          (this._thenViewRef = null),
          (this._elseViewRef = null),
          (this._thenTemplateRef = i);
      }
      set ngIf(t) {
        (this._context.$implicit = this._context.ngIf = t), this._updateView();
      }
      set ngIfThen(t) {
        Vg('ngIfThen', t),
          (this._thenTemplateRef = t),
          (this._thenViewRef = null),
          this._updateView();
      }
      set ngIfElse(t) {
        Vg('ngIfElse', t),
          (this._elseTemplateRef = t),
          (this._elseViewRef = null),
          this._updateView();
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context,
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context,
              )));
      }
      static ngTemplateContextGuard(t, i) {
        return !0;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)(Ue(mt), Ue($t));
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngIf', '']],
          inputs: { ngIf: 'ngIf', ngIfThen: 'ngIfThen', ngIfElse: 'ngIfElse' },
          standalone: !0,
        });
      }
    }
    return e;
  })(),
  xu = class {
    constructor() {
      (this.$implicit = null), (this.ngIf = null);
    }
  };
function Vg(e, n) {
  if (!!!(!n || n.createEmbeddedView))
    throw new Error(`${e} must be a TemplateRef, but received '${Le(n)}'.`);
}
var Nu = (() => {
  class e {
    constructor(t) {
      (this._viewContainerRef = t),
        (this._viewRef = null),
        (this.ngTemplateOutletContext = null),
        (this.ngTemplateOutlet = null),
        (this.ngTemplateOutletInjector = null);
    }
    ngOnChanges(t) {
      if (this._shouldRecreateView(t)) {
        let i = this._viewContainerRef;
        if ((this._viewRef && i.remove(i.indexOf(this._viewRef)), !this.ngTemplateOutlet)) {
          this._viewRef = null;
          return;
        }
        let r = this._createContextForwardProxy();
        this._viewRef = i.createEmbeddedView(this.ngTemplateOutlet, r, {
          injector: this.ngTemplateOutletInjector ?? void 0,
        });
      }
    }
    _shouldRecreateView(t) {
      return !!t.ngTemplateOutlet || !!t.ngTemplateOutletInjector;
    }
    _createContextForwardProxy() {
      return new Proxy(
        {},
        {
          set: (t, i, r) =>
            this.ngTemplateOutletContext ? Reflect.set(this.ngTemplateOutletContext, i, r) : !1,
          get: (t, i, r) => {
            if (this.ngTemplateOutletContext)
              return Reflect.get(this.ngTemplateOutletContext, i, r);
          },
        },
      );
    }
    static {
      this.ɵfac = function (i) {
        return new (i || e)(Ue(mt));
      };
    }
    static {
      this.ɵdir = ae({
        type: e,
        selectors: [['', 'ngTemplateOutlet', '']],
        inputs: {
          ngTemplateOutletContext: 'ngTemplateOutletContext',
          ngTemplateOutlet: 'ngTemplateOutlet',
          ngTemplateOutletInjector: 'ngTemplateOutletInjector',
        },
        standalone: !0,
        features: [Vn],
      });
    }
  }
  return e;
})();
var Rr = (() => {
    class e {
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵmod = Bn({ type: e });
      }
      static {
        this.ɵinj = jn({});
      }
    }
    return e;
  })(),
  Kg = 'browser',
  BD = 'server';
function Ou(e) {
  return e === BD;
}
var zs = class {};
var Pu = class extends Gs {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  ku = class e extends Pu {
    static makeCurrent() {
      Gg(new e());
    }
    onAndCancel(n, t, i) {
      return (
        n.addEventListener(t, i),
        () => {
          n.removeEventListener(t, i);
        }
      );
    }
    dispatchEvent(n, t) {
      n.dispatchEvent(t);
    }
    remove(n) {
      n.remove();
    }
    createElement(n, t) {
      return (t = t || this.getDefaultDocument()), t.createElement(n);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument('fakeTitle');
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(n) {
      return n.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(n) {
      return n instanceof DocumentFragment;
    }
    getGlobalEventTarget(n, t) {
      return t === 'window' ? window : t === 'document' ? n : t === 'body' ? n.body : null;
    }
    getBaseHref(n) {
      let t = $D();
      return t == null ? null : HD(t);
    }
    resetBaseElement() {
      Pr = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(n) {
      return Qg(document.cookie, n);
    }
  },
  Pr = null;
function $D() {
  return (Pr = Pr || document.querySelector('base')), Pr ? Pr.getAttribute('href') : null;
}
function HD(e) {
  return new URL(e, document.baseURI).pathname;
}
var UD = (() => {
    class e {
      build() {
        return new XMLHttpRequest();
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  qs = new A(''),
  nm = (() => {
    class e {
      constructor(t, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          t.forEach((r) => {
            r.manager = this;
          }),
          (this._plugins = t.slice().reverse());
      }
      addEventListener(t, i, r) {
        return this._findPluginFor(i).addEventListener(t, i, r);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(t) {
        let i = this._eventNameToPlugin.get(t);
        if (i) return i;
        if (((i = this._plugins.find((o) => o.supports(t))), !i)) throw new E(5101, !1);
        return this._eventNameToPlugin.set(t, i), i;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)(U(qs), U(ie));
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  kr = class {
    constructor(n) {
      this._doc = n;
    }
  },
  Au = 'ng-app-id',
  im = (() => {
    class e {
      constructor(t, i, r, o = {}) {
        (this.doc = t),
          (this.appId = i),
          (this.nonce = r),
          (this.platformId = o),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Ou(o)),
          this.resetHostNodes();
      }
      addStyles(t) {
        for (let i of t) this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(t) {
        for (let i of t) this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let t = this.styleNodesInDOM;
        t && (t.forEach((i) => i.remove()), t.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(t) {
        this.hostNodes.add(t);
        for (let i of this.getAllStyles()) this.addStyleToHost(t, i);
      }
      removeHost(t) {
        this.hostNodes.delete(t);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(t) {
        for (let i of this.hostNodes) this.addStyleToHost(i, t);
      }
      onStyleRemoved(t) {
        let i = this.styleRef;
        i.get(t)?.elements?.forEach((r) => r.remove()), i.delete(t);
      }
      collectServerRenderedStyles() {
        let t = this.doc.head?.querySelectorAll(`style[${Au}="${this.appId}"]`);
        if (t?.length) {
          let i = new Map();
          return (
            t.forEach((r) => {
              r.textContent != null && i.set(r.textContent, r);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(t, i) {
        let r = this.styleRef;
        if (r.has(t)) {
          let o = r.get(t);
          return (o.usage += i), o.usage;
        }
        return r.set(t, { usage: i, elements: [] }), i;
      }
      getStyleElement(t, i) {
        let r = this.styleNodesInDOM,
          o = r?.get(i);
        if (o?.parentNode === t) return r.delete(i), o.removeAttribute(Au), o;
        {
          let s = this.doc.createElement('style');
          return (
            this.nonce && s.setAttribute('nonce', this.nonce),
            (s.textContent = i),
            this.platformIsServer && s.setAttribute(Au, this.appId),
            t.appendChild(s),
            s
          );
        }
      }
      addStyleToHost(t, i) {
        let r = this.getStyleElement(t, i),
          o = this.styleRef,
          s = o.get(i)?.elements;
        s ? s.push(r) : o.set(i, { elements: [r], usage: 1 });
      }
      resetHostNodes() {
        let t = this.hostNodes;
        t.clear(), t.add(this.doc.head);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)(U(Oe), U(Kl), U(eu, 8), U(ln));
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Ru = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/Math/MathML',
  },
  Lu = /%COMP%/g,
  rm = '%COMP%',
  GD = `_nghost-${rm}`,
  zD = `_ngcontent-${rm}`,
  WD = !0,
  qD = new A('', { providedIn: 'root', factory: () => WD });
function QD(e) {
  return zD.replace(Lu, e);
}
function ZD(e) {
  return GD.replace(Lu, e);
}
function om(e, n) {
  return n.map((t) => t.replace(Lu, e));
}
var Xg = (() => {
    class e {
      constructor(t, i, r, o, s, a, c, l = null) {
        (this.eventManager = t),
          (this.sharedStylesHost = i),
          (this.appId = r),
          (this.removeStylesOnCompDestroy = o),
          (this.doc = s),
          (this.platformId = a),
          (this.ngZone = c),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Ou(a)),
          (this.defaultRenderer = new Fr(t, s, c, this.platformIsServer));
      }
      createRenderer(t, i) {
        if (!t || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === Et.ShadowDom &&
          (i = oe(w({}, i), { encapsulation: Et.Emulated }));
        let r = this.getOrCreateRenderer(t, i);
        return r instanceof Qs ? r.applyToHost(t) : r instanceof Lr && r.applyStyles(), r;
      }
      getOrCreateRenderer(t, i) {
        let r = this.rendererByCompId,
          o = r.get(i.id);
        if (!o) {
          let s = this.doc,
            a = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            u = this.removeStylesOnCompDestroy,
            d = this.platformIsServer;
          switch (i.encapsulation) {
            case Et.Emulated:
              o = new Qs(c, l, i, this.appId, u, s, a, d);
              break;
            case Et.ShadowDom:
              return new Fu(c, l, t, i, s, a, this.nonce, d);
            default:
              o = new Lr(c, l, i, u, s, a, d);
              break;
          }
          r.set(i.id, o);
        }
        return o;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)(U(nm), U(im), U(Kl), U(qD), U(Oe), U(ln), U(ie), U(eu));
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Fr = class {
    constructor(n, t, i, r) {
      (this.eventManager = n),
        (this.doc = t),
        (this.ngZone = i),
        (this.platformIsServer = r),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(n, t) {
      return t ? this.doc.createElementNS(Ru[t] || t, n) : this.doc.createElement(n);
    }
    createComment(n) {
      return this.doc.createComment(n);
    }
    createText(n) {
      return this.doc.createTextNode(n);
    }
    appendChild(n, t) {
      (em(n) ? n.content : n).appendChild(t);
    }
    insertBefore(n, t, i) {
      n && (em(n) ? n.content : n).insertBefore(t, i);
    }
    removeChild(n, t) {
      t.remove();
    }
    selectRootElement(n, t) {
      let i = typeof n == 'string' ? this.doc.querySelector(n) : n;
      if (!i) throw new E(-5104, !1);
      return t || (i.textContent = ''), i;
    }
    parentNode(n) {
      return n.parentNode;
    }
    nextSibling(n) {
      return n.nextSibling;
    }
    setAttribute(n, t, i, r) {
      if (r) {
        t = r + ':' + t;
        let o = Ru[r];
        o ? n.setAttributeNS(o, t, i) : n.setAttribute(t, i);
      } else n.setAttribute(t, i);
    }
    removeAttribute(n, t, i) {
      if (i) {
        let r = Ru[i];
        r ? n.removeAttributeNS(r, t) : n.removeAttribute(`${i}:${t}`);
      } else n.removeAttribute(t);
    }
    addClass(n, t) {
      n.classList.add(t);
    }
    removeClass(n, t) {
      n.classList.remove(t);
    }
    setStyle(n, t, i, r) {
      r & (Vt.DashCase | Vt.Important)
        ? n.style.setProperty(t, i, r & Vt.Important ? 'important' : '')
        : (n.style[t] = i);
    }
    removeStyle(n, t, i) {
      i & Vt.DashCase ? n.style.removeProperty(t) : (n.style[t] = '');
    }
    setProperty(n, t, i) {
      n != null && (n[t] = i);
    }
    setValue(n, t) {
      n.nodeValue = t;
    }
    listen(n, t, i) {
      if (typeof n == 'string' && ((n = Gi().getGlobalEventTarget(this.doc, n)), !n))
        throw new Error(`Unsupported event target ${n} for event ${t}`);
      return this.eventManager.addEventListener(n, t, this.decoratePreventDefault(i));
    }
    decoratePreventDefault(n) {
      return (t) => {
        if (t === '__ngUnwrap__') return n;
        (this.platformIsServer ? this.ngZone.runGuarded(() => n(t)) : n(t)) === !1 &&
          t.preventDefault();
      };
    }
  };
function em(e) {
  return e.tagName === 'TEMPLATE' && e.content !== void 0;
}
var Fu = class extends Fr {
    constructor(n, t, i, r, o, s, a, c) {
      super(n, o, s, c),
        (this.sharedStylesHost = t),
        (this.hostEl = i),
        (this.shadowRoot = i.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let l = om(r.id, r.styles);
      for (let u of l) {
        let d = document.createElement('style');
        a && d.setAttribute('nonce', a), (d.textContent = u), this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(n) {
      return n === this.hostEl ? this.shadowRoot : n;
    }
    appendChild(n, t) {
      return super.appendChild(this.nodeOrShadowRoot(n), t);
    }
    insertBefore(n, t, i) {
      return super.insertBefore(this.nodeOrShadowRoot(n), t, i);
    }
    removeChild(n, t) {
      return super.removeChild(null, t);
    }
    parentNode(n) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Lr = class extends Fr {
    constructor(n, t, i, r, o, s, a, c) {
      super(n, o, s, a),
        (this.sharedStylesHost = t),
        (this.removeStylesOnCompDestroy = r),
        (this.styles = c ? om(c, i.styles) : i.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy && this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Qs = class extends Lr {
    constructor(n, t, i, r, o, s, a, c) {
      let l = r + '-' + i.id;
      super(n, t, i, o, s, a, c, l), (this.contentAttr = QD(l)), (this.hostAttr = ZD(l));
    }
    applyToHost(n) {
      this.applyStyles(), this.setAttribute(n, this.hostAttr, '');
    }
    createElement(n, t) {
      let i = super.createElement(n, t);
      return super.setAttribute(i, this.contentAttr, ''), i;
    }
  },
  YD = (() => {
    class e extends kr {
      constructor(t) {
        super(t);
      }
      supports(t) {
        return !0;
      }
      addEventListener(t, i, r) {
        return t.addEventListener(i, r, !1), () => this.removeEventListener(t, i, r);
      }
      removeEventListener(t, i, r) {
        return t.removeEventListener(i, r);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)(U(Oe));
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  JD = (() => {
    class e extends kr {
      constructor(t) {
        super(t), (this.delegate = v(kg, { optional: !0 }));
      }
      supports(t) {
        return this.delegate ? this.delegate.supports(t) : !1;
      }
      addEventListener(t, i, r) {
        return this.delegate.addEventListener(t, i, r);
      }
      removeEventListener(t, i, r) {
        return this.delegate.removeEventListener(t, i, r);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)(U(Oe));
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  tm = ['alt', 'control', 'meta', 'shift'],
  KD = {
    '\b': 'Backspace',
    '	': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    Del: 'Delete',
    Esc: 'Escape',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Menu: 'ContextMenu',
    Scroll: 'ScrollLock',
    Win: 'OS',
  },
  XD = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  ew = (() => {
    class e extends kr {
      constructor(t) {
        super(t);
      }
      supports(t) {
        return e.parseEventName(t) != null;
      }
      addEventListener(t, i, r) {
        let o = e.parseEventName(i),
          s = e.eventCallback(o.fullKey, r, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => Gi().onAndCancel(t, o.domEventName, s));
      }
      static parseEventName(t) {
        let i = t.toLowerCase().split('.'),
          r = i.shift();
        if (i.length === 0 || !(r === 'keydown' || r === 'keyup')) return null;
        let o = e._normalizeKey(i.pop()),
          s = '',
          a = i.indexOf('code');
        if (
          (a > -1 && (i.splice(a, 1), (s = 'code.')),
          tm.forEach((l) => {
            let u = i.indexOf(l);
            u > -1 && (i.splice(u, 1), (s += l + '.'));
          }),
          (s += o),
          i.length != 0 || o.length === 0)
        )
          return null;
        let c = {};
        return (c.domEventName = r), (c.fullKey = s), c;
      }
      static matchEventFullKeyCode(t, i) {
        let r = KD[t.key] || t.key,
          o = '';
        return (
          i.indexOf('code.') > -1 && ((r = t.code), (o = 'code.')),
          r == null || !r
            ? !1
            : ((r = r.toLowerCase()),
              r === ' ' ? (r = 'space') : r === '.' && (r = 'dot'),
              tm.forEach((s) => {
                if (s !== r) {
                  let a = XD[s];
                  a(t) && (o += s + '.');
                }
              }),
              (o += r),
              o === i)
        );
      }
      static eventCallback(t, i, r) {
        return (o) => {
          e.matchEventFullKeyCode(o, t) && r.runGuarded(() => i(o));
        };
      }
      static _normalizeKey(t) {
        return t === 'esc' ? 'escape' : t;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)(U(Oe));
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })();
function sm(e, n) {
  return Pg(w({ rootComponent: e }, tw(n)));
}
function tw(e) {
  return {
    appProviders: [...sw, ...(e?.providers ?? [])],
    platformProviders: ow,
  };
}
function nw() {
  ku.makeCurrent();
}
function iw() {
  return new Bt();
}
function rw() {
  return Fh(document), document;
}
var ow = [
  { provide: ln, useValue: Kg },
  { provide: Xl, useValue: nw, multi: !0 },
  { provide: Oe, useFactory: rw, deps: [] },
];
var sw = [
  { provide: Ss, useValue: 'root' },
  { provide: Bt, useFactory: iw, deps: [] },
  { provide: qs, useClass: YD, multi: !0, deps: [Oe, ie, ln] },
  { provide: qs, useClass: ew, multi: !0, deps: [Oe] },
  { provide: qs, useClass: JD, multi: !0 },
  Xg,
  im,
  nm,
  { provide: Ai, useExisting: Xg },
  { provide: zs, useClass: UD, deps: [] },
  [],
];
var am = (() => {
  class e {
    constructor(t) {
      this._doc = t;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(t) {
      this._doc.title = t || '';
    }
    static {
      this.ɵfac = function (i) {
        return new (i || e)(U(Oe));
      };
    }
    static {
      this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
  }
  return e;
})();
var F = 'primary',
  eo = Symbol('RouteTitle'),
  Hu = class {
    constructor(n) {
      this.params = n || {};
    }
    has(n) {
      return Object.prototype.hasOwnProperty.call(this.params, n);
    }
    get(n) {
      if (this.has(n)) {
        let t = this.params[n];
        return Array.isArray(t) ? t[0] : t;
      }
      return null;
    }
    getAll(n) {
      if (this.has(n)) {
        let t = this.params[n];
        return Array.isArray(t) ? t : [t];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function Yi(e) {
  return new Hu(e);
}
function cw(e, n, t) {
  let i = t.path.split('/');
  if (i.length > e.length || (t.pathMatch === 'full' && (n.hasChildren() || i.length < e.length)))
    return null;
  let r = {};
  for (let o = 0; o < i.length; o++) {
    let s = i[o],
      a = e[o];
    if (s[0] === ':') r[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: e.slice(0, i.length), posParams: r };
}
function lw(e, n) {
  if (e.length !== n.length) return !1;
  for (let t = 0; t < e.length; ++t) if (!Rt(e[t], n[t])) return !1;
  return !0;
}
function Rt(e, n) {
  let t = e ? Uu(e) : void 0,
    i = n ? Uu(n) : void 0;
  if (!t || !i || t.length != i.length) return !1;
  let r;
  for (let o = 0; o < t.length; o++) if (((r = t[o]), !gm(e[r], n[r]))) return !1;
  return !0;
}
function Uu(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function gm(e, n) {
  if (Array.isArray(e) && Array.isArray(n)) {
    if (e.length !== n.length) return !1;
    let t = [...e].sort(),
      i = [...n].sort();
    return t.every((r, o) => i[o] === r);
  } else return e === n;
}
function mm(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function pn(e) {
  return _c(e) ? e : Or(e) ? pe(Promise.resolve(e)) : x(e);
}
var uw = { exact: _m, subset: ym },
  vm = { exact: dw, subset: fw, ignored: () => !0 };
function cm(e, n, t) {
  return (
    uw[t.paths](e.root, n.root, t.matrixParams) &&
    vm[t.queryParams](e.queryParams, n.queryParams) &&
    !(t.fragment === 'exact' && e.fragment !== n.fragment)
  );
}
function dw(e, n) {
  return Rt(e, n);
}
function _m(e, n, t) {
  if (
    !Qn(e.segments, n.segments) ||
    !Js(e.segments, n.segments, t) ||
    e.numberOfChildren !== n.numberOfChildren
  )
    return !1;
  for (let i in n.children) if (!e.children[i] || !_m(e.children[i], n.children[i], t)) return !1;
  return !0;
}
function fw(e, n) {
  return (
    Object.keys(n).length <= Object.keys(e).length && Object.keys(n).every((t) => gm(e[t], n[t]))
  );
}
function ym(e, n, t) {
  return bm(e, n, n.segments, t);
}
function bm(e, n, t, i) {
  if (e.segments.length > t.length) {
    let r = e.segments.slice(0, t.length);
    return !(!Qn(r, t) || n.hasChildren() || !Js(r, t, i));
  } else if (e.segments.length === t.length) {
    if (!Qn(e.segments, t) || !Js(e.segments, t, i)) return !1;
    for (let r in n.children) if (!e.children[r] || !ym(e.children[r], n.children[r], i)) return !1;
    return !0;
  } else {
    let r = t.slice(0, e.segments.length),
      o = t.slice(e.segments.length);
    return !Qn(e.segments, r) || !Js(e.segments, r, i) || !e.children[F]
      ? !1
      : bm(e.children[F], n, o, i);
  }
}
function Js(e, n, t) {
  return n.every((i, r) => vm[t](e[r].parameters, i.parameters));
}
var Wt = class {
    constructor(n = new q([], {}), t = {}, i = null) {
      (this.root = n), (this.queryParams = t), (this.fragment = i);
    }
    get queryParamMap() {
      return (this._queryParamMap ??= Yi(this.queryParams)), this._queryParamMap;
    }
    toString() {
      return gw.serialize(this);
    }
  },
  q = class {
    constructor(n, t) {
      (this.segments = n),
        (this.children = t),
        (this.parent = null),
        Object.values(t).forEach((i) => (i.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Ks(this);
    }
  },
  qn = class {
    constructor(n, t) {
      (this.path = n), (this.parameters = t);
    }
    get parameterMap() {
      return (this._parameterMap ??= Yi(this.parameters)), this._parameterMap;
    }
    toString() {
      return wm(this);
    }
  };
function pw(e, n) {
  return Qn(e, n) && e.every((t, i) => Rt(t.parameters, n[i].parameters));
}
function Qn(e, n) {
  return e.length !== n.length ? !1 : e.every((t, i) => t.path === n[i].path);
}
function hw(e, n) {
  let t = [];
  return (
    Object.entries(e.children).forEach(([i, r]) => {
      i === F && (t = t.concat(n(r, i)));
    }),
    Object.entries(e.children).forEach(([i, r]) => {
      i !== F && (t = t.concat(n(r, i)));
    }),
    t
  );
}
var gd = (() => {
    class e {
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({
          token: e,
          factory: () => new Gr(),
          providedIn: 'root',
        });
      }
    }
    return e;
  })(),
  Gr = class {
    parse(n) {
      let t = new zu(n);
      return new Wt(t.parseRootSegment(), t.parseQueryParams(), t.parseFragment());
    }
    serialize(n) {
      let t = `/${jr(n.root, !0)}`,
        i = _w(n.queryParams),
        r = typeof n.fragment == 'string' ? `#${mw(n.fragment)}` : '';
      return `${t}${i}${r}`;
    }
  },
  gw = new Gr();
function Ks(e) {
  return e.segments.map((n) => wm(n)).join('/');
}
function jr(e, n) {
  if (!e.hasChildren()) return Ks(e);
  if (n) {
    let t = e.children[F] ? jr(e.children[F], !1) : '',
      i = [];
    return (
      Object.entries(e.children).forEach(([r, o]) => {
        r !== F && i.push(`${r}:${jr(o, !1)}`);
      }),
      i.length > 0 ? `${t}(${i.join('//')})` : t
    );
  } else {
    let t = hw(e, (i, r) => (r === F ? [jr(e.children[F], !1)] : [`${r}:${jr(i, !1)}`]));
    return Object.keys(e.children).length === 1 && e.children[F] != null
      ? `${Ks(e)}/${t[0]}`
      : `${Ks(e)}/(${t.join('//')})`;
  }
}
function Dm(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',');
}
function Zs(e) {
  return Dm(e).replace(/%3B/gi, ';');
}
function mw(e) {
  return encodeURI(e);
}
function Gu(e) {
  return Dm(e).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}
function Xs(e) {
  return decodeURIComponent(e);
}
function lm(e) {
  return Xs(e.replace(/\+/g, '%20'));
}
function wm(e) {
  return `${Gu(e.path)}${vw(e.parameters)}`;
}
function vw(e) {
  return Object.entries(e)
    .map(([n, t]) => `;${Gu(n)}=${Gu(t)}`)
    .join('');
}
function _w(e) {
  let n = Object.entries(e)
    .map(([t, i]) =>
      Array.isArray(i) ? i.map((r) => `${Zs(t)}=${Zs(r)}`).join('&') : `${Zs(t)}=${Zs(i)}`,
    )
    .filter((t) => t);
  return n.length ? `?${n.join('&')}` : '';
}
var yw = /^[^\/()?;#]+/;
function ju(e) {
  let n = e.match(yw);
  return n ? n[0] : '';
}
var bw = /^[^\/()?;=#]+/;
function Dw(e) {
  let n = e.match(bw);
  return n ? n[0] : '';
}
var ww = /^[^=?&#]+/;
function Cw(e) {
  let n = e.match(ww);
  return n ? n[0] : '';
}
var Sw = /^[^&#]+/;
function Ew(e) {
  let n = e.match(Sw);
  return n ? n[0] : '';
}
var zu = class {
  constructor(n) {
    (this.url = n), (this.remaining = n);
  }
  parseRootSegment() {
    return (
      this.consumeOptional('/'),
      this.remaining === '' || this.peekStartsWith('?') || this.peekStartsWith('#')
        ? new q([], {})
        : new q([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let n = {};
    if (this.consumeOptional('?'))
      do this.parseQueryParam(n);
      while (this.consumeOptional('&'));
    return n;
  }
  parseFragment() {
    return this.consumeOptional('#') ? decodeURIComponent(this.remaining) : null;
  }
  parseChildren() {
    if (this.remaining === '') return {};
    this.consumeOptional('/');
    let n = [];
    for (
      this.peekStartsWith('(') || n.push(this.parseSegment());
      this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(');

    )
      this.capture('/'), n.push(this.parseSegment());
    let t = {};
    this.peekStartsWith('/(') && (this.capture('/'), (t = this.parseParens(!0)));
    let i = {};
    return (
      this.peekStartsWith('(') && (i = this.parseParens(!1)),
      (n.length > 0 || Object.keys(t).length > 0) && (i[F] = new q(n, t)),
      i
    );
  }
  parseSegment() {
    let n = ju(this.remaining);
    if (n === '' && this.peekStartsWith(';')) throw new E(4009, !1);
    return this.capture(n), new qn(Xs(n), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let n = {};
    for (; this.consumeOptional(';'); ) this.parseParam(n);
    return n;
  }
  parseParam(n) {
    let t = Dw(this.remaining);
    if (!t) return;
    this.capture(t);
    let i = '';
    if (this.consumeOptional('=')) {
      let r = ju(this.remaining);
      r && ((i = r), this.capture(i));
    }
    n[Xs(t)] = Xs(i);
  }
  parseQueryParam(n) {
    let t = Cw(this.remaining);
    if (!t) return;
    this.capture(t);
    let i = '';
    if (this.consumeOptional('=')) {
      let s = Ew(this.remaining);
      s && ((i = s), this.capture(i));
    }
    let r = lm(t),
      o = lm(i);
    if (n.hasOwnProperty(r)) {
      let s = n[r];
      Array.isArray(s) || ((s = [s]), (n[r] = s)), s.push(o);
    } else n[r] = o;
  }
  parseParens(n) {
    let t = {};
    for (this.capture('('); !this.consumeOptional(')') && this.remaining.length > 0; ) {
      let i = ju(this.remaining),
        r = this.remaining[i.length];
      if (r !== '/' && r !== ')' && r !== ';') throw new E(4010, !1);
      let o;
      i.indexOf(':') > -1
        ? ((o = i.slice(0, i.indexOf(':'))), this.capture(o), this.capture(':'))
        : n && (o = F);
      let s = this.parseChildren();
      (t[o] = Object.keys(s).length === 1 ? s[F] : new q([], s)), this.consumeOptional('//');
    }
    return t;
  }
  peekStartsWith(n) {
    return this.remaining.startsWith(n);
  }
  consumeOptional(n) {
    return this.peekStartsWith(n)
      ? ((this.remaining = this.remaining.substring(n.length)), !0)
      : !1;
  }
  capture(n) {
    if (!this.consumeOptional(n)) throw new E(4011, !1);
  }
};
function Cm(e) {
  return e.segments.length > 0 ? new q([], { [F]: e }) : e;
}
function Sm(e) {
  let n = {};
  for (let [i, r] of Object.entries(e.children)) {
    let o = Sm(r);
    if (i === F && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) n[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (n[i] = o);
  }
  let t = new q(e.segments, n);
  return Iw(t);
}
function Iw(e) {
  if (e.numberOfChildren === 1 && e.children[F]) {
    let n = e.children[F];
    return new q(e.segments.concat(n.segments), n.children);
  }
  return e;
}
function zr(e) {
  return e instanceof Wt;
}
function Mw(e, n, t = null, i = null) {
  let r = Em(e);
  return Im(r, n, t, i);
}
function Em(e) {
  let n;
  function t(o) {
    let s = {};
    for (let c of o.children) {
      let l = t(c);
      s[c.outlet] = l;
    }
    let a = new q(o.url, s);
    return o === e && (n = a), a;
  }
  let i = t(e.root),
    r = Cm(i);
  return n ?? r;
}
function Im(e, n, t, i) {
  let r = e;
  for (; r.parent; ) r = r.parent;
  if (n.length === 0) return Bu(r, r, r, t, i);
  let o = Tw(n);
  if (o.toRoot()) return Bu(r, r, new q([], {}), t, i);
  let s = xw(o, r, e),
    a = s.processChildren
      ? $r(s.segmentGroup, s.index, o.commands)
      : Tm(s.segmentGroup, s.index, o.commands);
  return Bu(r, s.segmentGroup, a, t, i);
}
function ea(e) {
  return typeof e == 'object' && e != null && !e.outlets && !e.segmentPath;
}
function Wr(e) {
  return typeof e == 'object' && e != null && e.outlets;
}
function Bu(e, n, t, i, r) {
  let o = {};
  i &&
    Object.entries(i).forEach(([c, l]) => {
      o[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
    });
  let s;
  e === n ? (s = t) : (s = Mm(e, n, t));
  let a = Cm(Sm(s));
  return new Wt(a, o, r);
}
function Mm(e, n, t) {
  let i = {};
  return (
    Object.entries(e.children).forEach(([r, o]) => {
      o === n ? (i[r] = t) : (i[r] = Mm(o, n, t));
    }),
    new q(e.segments, i)
  );
}
var ta = class {
  constructor(n, t, i) {
    if (
      ((this.isAbsolute = n),
      (this.numberOfDoubleDots = t),
      (this.commands = i),
      n && i.length > 0 && ea(i[0]))
    )
      throw new E(4003, !1);
    let r = i.find(Wr);
    if (r && r !== mm(i)) throw new E(4004, !1);
  }
  toRoot() {
    return this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/';
  }
};
function Tw(e) {
  if (typeof e[0] == 'string' && e.length === 1 && e[0] === '/') return new ta(!0, 0, e);
  let n = 0,
    t = !1,
    i = e.reduce((r, o, s) => {
      if (typeof o == 'object' && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([c, l]) => {
              a[c] = typeof l == 'string' ? l.split('/') : l;
            }),
            [...r, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...r, o.segmentPath];
      }
      return typeof o != 'string'
        ? [...r, o]
        : s === 0
          ? (o.split('/').forEach((a, c) => {
              (c == 0 && a === '.') ||
                (c == 0 && a === '' ? (t = !0) : a === '..' ? n++ : a != '' && r.push(a));
            }),
            r)
          : [...r, o];
    }, []);
  return new ta(t, n, i);
}
var qi = class {
  constructor(n, t, i) {
    (this.segmentGroup = n), (this.processChildren = t), (this.index = i);
  }
};
function xw(e, n, t) {
  if (e.isAbsolute) return new qi(n, !0, 0);
  if (!t) return new qi(n, !1, NaN);
  if (t.parent === null) return new qi(t, !0, 0);
  let i = ea(e.commands[0]) ? 0 : 1,
    r = t.segments.length - 1 + i;
  return Nw(t, r, e.numberOfDoubleDots);
}
function Nw(e, n, t) {
  let i = e,
    r = n,
    o = t;
  for (; o > r; ) {
    if (((o -= r), (i = i.parent), !i)) throw new E(4005, !1);
    r = i.segments.length;
  }
  return new qi(i, !1, r - o);
}
function Ow(e) {
  return Wr(e[0]) ? e[0].outlets : { [F]: e };
}
function Tm(e, n, t) {
  if (((e ??= new q([], {})), e.segments.length === 0 && e.hasChildren())) return $r(e, n, t);
  let i = Aw(e, n, t),
    r = t.slice(i.commandIndex);
  if (i.match && i.pathIndex < e.segments.length) {
    let o = new q(e.segments.slice(0, i.pathIndex), {});
    return (o.children[F] = new q(e.segments.slice(i.pathIndex), e.children)), $r(o, 0, r);
  } else
    return i.match && r.length === 0
      ? new q(e.segments, {})
      : i.match && !e.hasChildren()
        ? Wu(e, n, t)
        : i.match
          ? $r(e, 0, r)
          : Wu(e, n, t);
}
function $r(e, n, t) {
  if (t.length === 0) return new q(e.segments, {});
  {
    let i = Ow(t),
      r = {};
    if (
      Object.keys(i).some((o) => o !== F) &&
      e.children[F] &&
      e.numberOfChildren === 1 &&
      e.children[F].segments.length === 0
    ) {
      let o = $r(e.children[F], n, t);
      return new q(e.segments, o.children);
    }
    return (
      Object.entries(i).forEach(([o, s]) => {
        typeof s == 'string' && (s = [s]), s !== null && (r[o] = Tm(e.children[o], n, s));
      }),
      Object.entries(e.children).forEach(([o, s]) => {
        i[o] === void 0 && (r[o] = s);
      }),
      new q(e.segments, r)
    );
  }
}
function Aw(e, n, t) {
  let i = 0,
    r = n,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; r < e.segments.length; ) {
    if (i >= t.length) return o;
    let s = e.segments[r],
      a = t[i];
    if (Wr(a)) break;
    let c = `${a}`,
      l = i < t.length - 1 ? t[i + 1] : null;
    if (r > 0 && c === void 0) break;
    if (c && l && typeof l == 'object' && l.outlets === void 0) {
      if (!dm(c, l, s)) return o;
      i += 2;
    } else {
      if (!dm(c, {}, s)) return o;
      i++;
    }
    r++;
  }
  return { match: !0, pathIndex: r, commandIndex: i };
}
function Wu(e, n, t) {
  let i = e.segments.slice(0, n),
    r = 0;
  for (; r < t.length; ) {
    let o = t[r];
    if (Wr(o)) {
      let c = Rw(o.outlets);
      return new q(i, c);
    }
    if (r === 0 && ea(t[0])) {
      let c = e.segments[n];
      i.push(new qn(c.path, um(t[0]))), r++;
      continue;
    }
    let s = Wr(o) ? o.outlets[F] : `${o}`,
      a = r < t.length - 1 ? t[r + 1] : null;
    s && a && ea(a) ? (i.push(new qn(s, um(a))), (r += 2)) : (i.push(new qn(s, {})), r++);
  }
  return new q(i, {});
}
function Rw(e) {
  let n = {};
  return (
    Object.entries(e).forEach(([t, i]) => {
      typeof i == 'string' && (i = [i]), i !== null && (n[t] = Wu(new q([], {}), 0, i));
    }),
    n
  );
}
function um(e) {
  let n = {};
  return Object.entries(e).forEach(([t, i]) => (n[t] = `${i}`)), n;
}
function dm(e, n, t) {
  return e == t.path && Rt(n, t.parameters);
}
var Hr = 'imperative',
  Ee = (function (e) {
    return (
      (e[(e.NavigationStart = 0)] = 'NavigationStart'),
      (e[(e.NavigationEnd = 1)] = 'NavigationEnd'),
      (e[(e.NavigationCancel = 2)] = 'NavigationCancel'),
      (e[(e.NavigationError = 3)] = 'NavigationError'),
      (e[(e.RoutesRecognized = 4)] = 'RoutesRecognized'),
      (e[(e.ResolveStart = 5)] = 'ResolveStart'),
      (e[(e.ResolveEnd = 6)] = 'ResolveEnd'),
      (e[(e.GuardsCheckStart = 7)] = 'GuardsCheckStart'),
      (e[(e.GuardsCheckEnd = 8)] = 'GuardsCheckEnd'),
      (e[(e.RouteConfigLoadStart = 9)] = 'RouteConfigLoadStart'),
      (e[(e.RouteConfigLoadEnd = 10)] = 'RouteConfigLoadEnd'),
      (e[(e.ChildActivationStart = 11)] = 'ChildActivationStart'),
      (e[(e.ChildActivationEnd = 12)] = 'ChildActivationEnd'),
      (e[(e.ActivationStart = 13)] = 'ActivationStart'),
      (e[(e.ActivationEnd = 14)] = 'ActivationEnd'),
      (e[(e.Scroll = 15)] = 'Scroll'),
      (e[(e.NavigationSkipped = 16)] = 'NavigationSkipped'),
      e
    );
  })(Ee || {}),
  ot = class {
    constructor(n, t) {
      (this.id = n), (this.url = t);
    }
  },
  qr = class extends ot {
    constructor(n, t, i = 'imperative', r = null) {
      super(n, t),
        (this.type = Ee.NavigationStart),
        (this.navigationTrigger = i),
        (this.restoredState = r);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Zn = class extends ot {
    constructor(n, t, i) {
      super(n, t), (this.urlAfterRedirects = i), (this.type = Ee.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Je = (function (e) {
    return (
      (e[(e.Redirect = 0)] = 'Redirect'),
      (e[(e.SupersededByNewNavigation = 1)] = 'SupersededByNewNavigation'),
      (e[(e.NoDataFromResolver = 2)] = 'NoDataFromResolver'),
      (e[(e.GuardRejected = 3)] = 'GuardRejected'),
      e
    );
  })(Je || {}),
  qu = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = 'IgnoredSameUrlNavigation'),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] = 'IgnoredByUrlHandlingStrategy'),
      e
    );
  })(qu || {}),
  zt = class extends ot {
    constructor(n, t, i, r) {
      super(n, t), (this.reason = i), (this.code = r), (this.type = Ee.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Yn = class extends ot {
    constructor(n, t, i, r) {
      super(n, t), (this.reason = i), (this.code = r), (this.type = Ee.NavigationSkipped);
    }
  },
  Qr = class extends ot {
    constructor(n, t, i, r) {
      super(n, t), (this.error = i), (this.target = r), (this.type = Ee.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  na = class extends ot {
    constructor(n, t, i, r) {
      super(n, t),
        (this.urlAfterRedirects = i),
        (this.state = r),
        (this.type = Ee.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Qu = class extends ot {
    constructor(n, t, i, r) {
      super(n, t),
        (this.urlAfterRedirects = i),
        (this.state = r),
        (this.type = Ee.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Zu = class extends ot {
    constructor(n, t, i, r, o) {
      super(n, t),
        (this.urlAfterRedirects = i),
        (this.state = r),
        (this.shouldActivate = o),
        (this.type = Ee.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  Yu = class extends ot {
    constructor(n, t, i, r) {
      super(n, t), (this.urlAfterRedirects = i), (this.state = r), (this.type = Ee.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Ju = class extends ot {
    constructor(n, t, i, r) {
      super(n, t), (this.urlAfterRedirects = i), (this.state = r), (this.type = Ee.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Ku = class {
    constructor(n) {
      (this.route = n), (this.type = Ee.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Xu = class {
    constructor(n) {
      (this.route = n), (this.type = Ee.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  ed = class {
    constructor(n) {
      (this.snapshot = n), (this.type = Ee.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  td = class {
    constructor(n) {
      (this.snapshot = n), (this.type = Ee.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  nd = class {
    constructor(n) {
      (this.snapshot = n), (this.type = Ee.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  id = class {
    constructor(n) {
      (this.snapshot = n), (this.type = Ee.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  };
var Zr = class {},
  Ji = class {
    constructor(n, t) {
      (this.url = n), (this.navigationBehaviorOptions = t);
    }
  };
function Pw(e, n) {
  return (
    e.providers && !e._injector && (e._injector = bu(e.providers, n, `Route: ${e.path}`)),
    e._injector ?? n
  );
}
function vt(e) {
  return e.outlet || F;
}
function kw(e, n) {
  let t = e.filter((i) => vt(i) === n);
  return t.push(...e.filter((i) => vt(i) !== n)), t;
}
function to(e) {
  if (!e) return null;
  if (e.routeConfig?._injector) return e.routeConfig._injector;
  for (let n = e.parent; n; n = n.parent) {
    let t = n.routeConfig;
    if (t?._loadedInjector) return t._loadedInjector;
    if (t?._injector) return t._injector;
  }
  return null;
}
var rd = class {
    get injector() {
      return to(this.route?.snapshot) ?? this.rootInjector;
    }
    set injector(n) {}
    constructor(n) {
      (this.rootInjector = n),
        (this.outlet = null),
        (this.route = null),
        (this.children = new la(this.rootInjector)),
        (this.attachRef = null);
    }
  },
  la = (() => {
    class e {
      constructor(t) {
        (this.rootInjector = t), (this.contexts = new Map());
      }
      onChildOutletCreated(t, i) {
        let r = this.getOrCreateContext(t);
        (r.outlet = i), this.contexts.set(t, r);
      }
      onChildOutletDestroyed(t) {
        let i = this.getContext(t);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let t = this.contexts;
        return (this.contexts = new Map()), t;
      }
      onOutletReAttached(t) {
        this.contexts = t;
      }
      getOrCreateContext(t) {
        let i = this.getContext(t);
        return i || ((i = new rd(this.rootInjector)), this.contexts.set(t, i)), i;
      }
      getContext(t) {
        return this.contexts.get(t) || null;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)(U(We));
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })(),
  ia = class {
    constructor(n) {
      this._root = n;
    }
    get root() {
      return this._root.value;
    }
    parent(n) {
      let t = this.pathFromRoot(n);
      return t.length > 1 ? t[t.length - 2] : null;
    }
    children(n) {
      let t = od(n, this._root);
      return t ? t.children.map((i) => i.value) : [];
    }
    firstChild(n) {
      let t = od(n, this._root);
      return t && t.children.length > 0 ? t.children[0].value : null;
    }
    siblings(n) {
      let t = sd(n, this._root);
      return t.length < 2
        ? []
        : t[t.length - 2].children.map((r) => r.value).filter((r) => r !== n);
    }
    pathFromRoot(n) {
      return sd(n, this._root).map((t) => t.value);
    }
  };
function od(e, n) {
  if (e === n.value) return n;
  for (let t of n.children) {
    let i = od(e, t);
    if (i) return i;
  }
  return null;
}
function sd(e, n) {
  if (e === n.value) return [n];
  for (let t of n.children) {
    let i = sd(e, t);
    if (i.length) return i.unshift(n), i;
  }
  return [];
}
var Ye = class {
  constructor(n, t) {
    (this.value = n), (this.children = t);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Wi(e) {
  let n = {};
  return e && e.children.forEach((t) => (n[t.value.outlet] = t)), n;
}
var ra = class extends ia {
  constructor(n, t) {
    super(n), (this.snapshot = t), md(this, n);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function xm(e) {
  let n = Fw(e),
    t = new _e([new qn('', {})]),
    i = new _e({}),
    r = new _e({}),
    o = new _e({}),
    s = new _e(''),
    a = new Ki(t, i, o, s, r, F, e, n.root);
  return (a.snapshot = n.root), new ra(new Ye(a, []), n);
}
function Fw(e) {
  let n = {},
    t = {},
    i = {},
    r = '',
    o = new Qi([], n, i, r, t, F, e, null, {});
  return new sa('', new Ye(o, []));
}
var Ki = class {
  constructor(n, t, i, r, o, s, a, c) {
    (this.urlSubject = n),
      (this.paramsSubject = t),
      (this.queryParamsSubject = i),
      (this.fragmentSubject = r),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(V((l) => l[eo])) ?? x(void 0)),
      (this.url = n),
      (this.params = t),
      (this.queryParams = i),
      (this.fragment = r),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (this._paramMap ??= this.params.pipe(V((n) => Yi(n)))), this._paramMap;
  }
  get queryParamMap() {
    return (this._queryParamMap ??= this.queryParams.pipe(V((n) => Yi(n)))), this._queryParamMap;
  }
  toString() {
    return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
  }
};
function oa(e, n, t = 'emptyOnly') {
  let i,
    { routeConfig: r } = e;
  return (
    n !== null &&
    (t === 'always' || r?.path === '' || (!n.component && !n.routeConfig?.loadComponent))
      ? (i = {
          params: w(w({}, n.params), e.params),
          data: w(w({}, n.data), e.data),
          resolve: w(w(w(w({}, e.data), n.data), r?.data), e._resolvedData),
        })
      : (i = {
          params: w({}, e.params),
          data: w({}, e.data),
          resolve: w(w({}, e.data), e._resolvedData ?? {}),
        }),
    r && Om(r) && (i.resolve[eo] = r.title),
    i
  );
}
var Qi = class {
    get title() {
      return this.data?.[eo];
    }
    constructor(n, t, i, r, o, s, a, c, l) {
      (this.url = n),
        (this.params = t),
        (this.queryParams = i),
        (this.fragment = r),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = l);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= Yi(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (this._queryParamMap ??= Yi(this.queryParams)), this._queryParamMap;
    }
    toString() {
      let n = this.url.map((i) => i.toString()).join('/'),
        t = this.routeConfig ? this.routeConfig.path : '';
      return `Route(url:'${n}', path:'${t}')`;
    }
  },
  sa = class extends ia {
    constructor(n, t) {
      super(t), (this.url = n), md(this, t);
    }
    toString() {
      return Nm(this._root);
    }
  };
function md(e, n) {
  (n.value._routerState = e), n.children.forEach((t) => md(e, t));
}
function Nm(e) {
  let n = e.children.length > 0 ? ` { ${e.children.map(Nm).join(', ')} } ` : '';
  return `${e.value}${n}`;
}
function Vu(e) {
  if (e.snapshot) {
    let n = e.snapshot,
      t = e._futureSnapshot;
    (e.snapshot = t),
      Rt(n.queryParams, t.queryParams) || e.queryParamsSubject.next(t.queryParams),
      n.fragment !== t.fragment && e.fragmentSubject.next(t.fragment),
      Rt(n.params, t.params) || e.paramsSubject.next(t.params),
      lw(n.url, t.url) || e.urlSubject.next(t.url),
      Rt(n.data, t.data) || e.dataSubject.next(t.data);
  } else (e.snapshot = e._futureSnapshot), e.dataSubject.next(e._futureSnapshot.data);
}
function ad(e, n) {
  let t = Rt(e.params, n.params) && pw(e.url, n.url),
    i = !e.parent != !n.parent;
  return t && !i && (!e.parent || ad(e.parent, n.parent));
}
function Om(e) {
  return typeof e.title == 'string' || e.title === null;
}
var vd = (() => {
    class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = F),
          (this.activateEvents = new Z()),
          (this.deactivateEvents = new Z()),
          (this.attachEvents = new Z()),
          (this.detachEvents = new Z()),
          (this.parentContexts = v(la)),
          (this.location = v(mt)),
          (this.changeDetector = v(Gt)),
          (this.inputBinder = v(_d, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(t) {
        if (t.name) {
          let { firstChange: i, previousValue: r } = t.name;
          if (i) return;
          this.isTrackedInParentContexts(r) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(r)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(t) {
        return this.parentContexts.getContext(t)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if ((this.parentContexts.onChildOutletCreated(this.name, this), this.activated)) return;
        let t = this.parentContexts.getContext(this.name);
        t?.route &&
          (t.attachRef
            ? this.attach(t.attachRef, t.route)
            : this.activateWith(t.route, t.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new E(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new E(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new E(4012, !1);
        this.location.detach();
        let t = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(t.instance),
          t
        );
      }
      attach(t, i) {
        (this.activated = t),
          (this._activatedRoute = i),
          this.location.insert(t.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(t.instance);
      }
      deactivate() {
        if (this.activated) {
          let t = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(t);
        }
      }
      activateWith(t, i) {
        if (this.isActivated) throw new E(4013, !1);
        this._activatedRoute = t;
        let r = this.location,
          s = t.snapshot.component,
          a = this.parentContexts.getOrCreateContext(this.name).children,
          c = new cd(t, a, r.injector);
        (this.activated = r.createComponent(s, {
          index: r.length,
          injector: c,
          environmentInjector: i,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['router-outlet']],
          inputs: { name: 'name' },
          outputs: {
            activateEvents: 'activate',
            deactivateEvents: 'deactivate',
            attachEvents: 'attach',
            detachEvents: 'detach',
          },
          exportAs: ['outlet'],
          standalone: !0,
          features: [Vn],
        });
      }
    }
    return e;
  })(),
  cd = class e {
    __ngOutletInjector(n) {
      return new e(this.route, this.childContexts, n);
    }
    constructor(n, t, i) {
      (this.route = n), (this.childContexts = t), (this.parent = i);
    }
    get(n, t) {
      return n === Ki ? this.route : n === la ? this.childContexts : this.parent.get(n, t);
    }
  },
  _d = new A('');
function Lw(e, n, t) {
  let i = Yr(e, n._root, t ? t._root : void 0);
  return new ra(i, n);
}
function Yr(e, n, t) {
  if (t && e.shouldReuseRoute(n.value, t.value.snapshot)) {
    let i = t.value;
    i._futureSnapshot = n.value;
    let r = jw(e, n, t);
    return new Ye(i, r);
  } else {
    if (e.shouldAttach(n.value)) {
      let o = e.retrieve(n.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = n.value), (s.children = n.children.map((a) => Yr(e, a))), s
        );
      }
    }
    let i = Bw(n.value),
      r = n.children.map((o) => Yr(e, o));
    return new Ye(i, r);
  }
}
function jw(e, n, t) {
  return n.children.map((i) => {
    for (let r of t.children) if (e.shouldReuseRoute(i.value, r.value.snapshot)) return Yr(e, i, r);
    return Yr(e, i);
  });
}
function Bw(e) {
  return new Ki(
    new _e(e.url),
    new _e(e.params),
    new _e(e.queryParams),
    new _e(e.fragment),
    new _e(e.data),
    e.outlet,
    e.component,
    e,
  );
}
var Jr = class {
    constructor(n, t) {
      (this.redirectTo = n), (this.navigationBehaviorOptions = t);
    }
  },
  Am = 'ngNavigationCancelingError';
function aa(e, n) {
  let { redirectTo: t, navigationBehaviorOptions: i } = zr(n)
      ? { redirectTo: n, navigationBehaviorOptions: void 0 }
      : n,
    r = Rm(!1, Je.Redirect);
  return (r.url = t), (r.navigationBehaviorOptions = i), r;
}
function Rm(e, n) {
  let t = new Error(`NavigationCancelingError: ${e || ''}`);
  return (t[Am] = !0), (t.cancellationCode = n), t;
}
function Vw(e) {
  return Pm(e) && zr(e.url);
}
function Pm(e) {
  return !!e && e[Am];
}
var $w = (e, n, t, i) =>
    V((r) => (new ld(n, r.targetRouterState, r.currentRouterState, t, i).activate(e), r)),
  ld = class {
    constructor(n, t, i, r, o) {
      (this.routeReuseStrategy = n),
        (this.futureState = t),
        (this.currState = i),
        (this.forwardEvent = r),
        (this.inputBindingEnabled = o);
    }
    activate(n) {
      let t = this.futureState._root,
        i = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(t, i, n),
        Vu(this.futureState.root),
        this.activateChildRoutes(t, i, n);
    }
    deactivateChildRoutes(n, t, i) {
      let r = Wi(t);
      n.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, r[s], i), delete r[s];
      }),
        Object.values(r).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, i);
        });
    }
    deactivateRoutes(n, t, i) {
      let r = n.value,
        o = t ? t.value : null;
      if (r === o)
        if (r.component) {
          let s = i.getContext(r.outlet);
          s && this.deactivateChildRoutes(n, t, s.children);
        } else this.deactivateChildRoutes(n, t, i);
      else o && this.deactivateRouteAndItsChildren(t, i);
    }
    deactivateRouteAndItsChildren(n, t) {
      n.value.component && this.routeReuseStrategy.shouldDetach(n.value.snapshot)
        ? this.detachAndStoreRouteSubtree(n, t)
        : this.deactivateRouteAndOutlet(n, t);
    }
    detachAndStoreRouteSubtree(n, t) {
      let i = t.getContext(n.value.outlet),
        r = i && n.value.component ? i.children : t,
        o = Wi(n);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, r);
      if (i && i.outlet) {
        let s = i.outlet.detach(),
          a = i.children.onOutletDeactivated();
        this.routeReuseStrategy.store(n.value.snapshot, {
          componentRef: s,
          route: n,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(n, t) {
      let i = t.getContext(n.value.outlet),
        r = i && n.value.component ? i.children : t,
        o = Wi(n);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, r);
      i &&
        (i.outlet && (i.outlet.deactivate(), i.children.onOutletDeactivated()),
        (i.attachRef = null),
        (i.route = null));
    }
    activateChildRoutes(n, t, i) {
      let r = Wi(t);
      n.children.forEach((o) => {
        this.activateRoutes(o, r[o.value.outlet], i), this.forwardEvent(new id(o.value.snapshot));
      }),
        n.children.length && this.forwardEvent(new td(n.value.snapshot));
    }
    activateRoutes(n, t, i) {
      let r = n.value,
        o = t ? t.value : null;
      if ((Vu(r), r === o))
        if (r.component) {
          let s = i.getOrCreateContext(r.outlet);
          this.activateChildRoutes(n, t, s.children);
        } else this.activateChildRoutes(n, t, i);
      else if (r.component) {
        let s = i.getOrCreateContext(r.outlet);
        if (this.routeReuseStrategy.shouldAttach(r.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(r.snapshot);
          this.routeReuseStrategy.store(r.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Vu(a.route.value),
            this.activateChildRoutes(n, null, s.children);
        } else
          (s.attachRef = null),
            (s.route = r),
            s.outlet && s.outlet.activateWith(r, s.injector),
            this.activateChildRoutes(n, null, s.children);
      } else this.activateChildRoutes(n, null, i);
    }
  },
  ca = class {
    constructor(n) {
      (this.path = n), (this.route = this.path[this.path.length - 1]);
    }
  },
  Zi = class {
    constructor(n, t) {
      (this.component = n), (this.route = t);
    }
  };
function Hw(e, n, t) {
  let i = e._root,
    r = n ? n._root : null;
  return Br(i, r, t, [i.value]);
}
function Uw(e) {
  let n = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !n || n.length === 0 ? null : { node: e, guards: n };
}
function er(e, n) {
  let t = Symbol(),
    i = n.get(e, t);
  return i === t ? (typeof e == 'function' && !Ep(e) ? e : n.get(e)) : i;
}
function Br(e, n, t, i, r = { canDeactivateChecks: [], canActivateChecks: [] }) {
  let o = Wi(n);
  return (
    e.children.forEach((s) => {
      Gw(s, o[s.value.outlet], t, i.concat([s.value]), r), delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => Ur(a, t.getContext(s), r)),
    r
  );
}
function Gw(e, n, t, i, r = { canDeactivateChecks: [], canActivateChecks: [] }) {
  let o = e.value,
    s = n ? n.value : null,
    a = t ? t.getContext(e.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let c = zw(s, o, o.routeConfig.runGuardsAndResolvers);
    c
      ? r.canActivateChecks.push(new ca(i))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? Br(e, n, a ? a.children : null, i, r) : Br(e, n, t, i, r),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        r.canDeactivateChecks.push(new Zi(a.outlet.component, s));
  } else
    s && Ur(n, a, r),
      r.canActivateChecks.push(new ca(i)),
      o.component ? Br(e, null, a ? a.children : null, i, r) : Br(e, null, t, i, r);
  return r;
}
function zw(e, n, t) {
  if (typeof t == 'function') return t(e, n);
  switch (t) {
    case 'pathParamsChange':
      return !Qn(e.url, n.url);
    case 'pathParamsOrQueryParamsChange':
      return !Qn(e.url, n.url) || !Rt(e.queryParams, n.queryParams);
    case 'always':
      return !0;
    case 'paramsOrQueryParamsChange':
      return !ad(e, n) || !Rt(e.queryParams, n.queryParams);
    case 'paramsChange':
    default:
      return !ad(e, n);
  }
}
function Ur(e, n, t) {
  let i = Wi(e),
    r = e.value;
  Object.entries(i).forEach(([o, s]) => {
    r.component ? (n ? Ur(s, n.children.getContext(o), t) : Ur(s, null, t)) : Ur(s, n, t);
  }),
    r.component
      ? n && n.outlet && n.outlet.isActivated
        ? t.canDeactivateChecks.push(new Zi(n.outlet.component, r))
        : t.canDeactivateChecks.push(new Zi(null, r))
      : t.canDeactivateChecks.push(new Zi(null, r));
}
function no(e) {
  return typeof e == 'function';
}
function Ww(e) {
  return typeof e == 'boolean';
}
function qw(e) {
  return e && no(e.canLoad);
}
function Qw(e) {
  return e && no(e.canActivate);
}
function Zw(e) {
  return e && no(e.canActivateChild);
}
function Yw(e) {
  return e && no(e.canDeactivate);
}
function Jw(e) {
  return e && no(e.canMatch);
}
function km(e) {
  return e instanceof kt || e?.name === 'EmptyError';
}
var Ys = Symbol('INITIAL_VALUE');
function Xi() {
  return Ke((e) =>
    ur(e.map((n) => n.pipe(Fe(1), Vo(Ys)))).pipe(
      V((n) => {
        for (let t of n)
          if (t !== !0) {
            if (t === Ys) return Ys;
            if (t === !1 || Kw(t)) return t;
          }
        return !0;
      }),
      ke((n) => n !== Ys),
      Fe(1),
    ),
  );
}
function Kw(e) {
  return zr(e) || e instanceof Jr;
}
function Xw(e, n) {
  return te((t) => {
    let {
      targetSnapshot: i,
      currentSnapshot: r,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = t;
    return s.length === 0 && o.length === 0
      ? x(oe(w({}, t), { guardsResult: !0 }))
      : eC(s, i, r, e).pipe(
          te((a) => (a && Ww(a) ? tC(i, o, e, n) : x(a))),
          V((a) => oe(w({}, t), { guardsResult: a })),
        );
  });
}
function eC(e, n, t, i) {
  return pe(e).pipe(
    te((r) => sC(r.component, r.route, t, n, i)),
    wt((r) => r !== !0, !0),
  );
}
function tC(e, n, t, i) {
  return pe(n).pipe(
    mi((r) => bt(iC(r.route.parent, i), nC(r.route, i), oC(e, r.path, t), rC(e, r.route, t))),
    wt((r) => r !== !0, !0),
  );
}
function nC(e, n) {
  return e !== null && n && n(new nd(e)), x(!0);
}
function iC(e, n) {
  return e !== null && n && n(new ed(e)), x(!0);
}
function rC(e, n, t) {
  let i = n.routeConfig ? n.routeConfig.canActivate : null;
  if (!i || i.length === 0) return x(!0);
  let r = i.map((o) =>
    Lo(() => {
      let s = to(n) ?? t,
        a = er(o, s),
        c = Qw(a) ? a.canActivate(n, e) : xt(s, () => a(n, e));
      return pn(c).pipe(wt());
    }),
  );
  return x(r).pipe(Xi());
}
function oC(e, n, t) {
  let i = n[n.length - 1],
    o = n
      .slice(0, n.length - 1)
      .reverse()
      .map((s) => Uw(s))
      .filter((s) => s !== null)
      .map((s) =>
        Lo(() => {
          let a = s.guards.map((c) => {
            let l = to(s.node) ?? t,
              u = er(c, l),
              d = Zw(u) ? u.canActivateChild(i, e) : xt(l, () => u(i, e));
            return pn(d).pipe(wt());
          });
          return x(a).pipe(Xi());
        }),
      );
  return x(o).pipe(Xi());
}
function sC(e, n, t, i, r) {
  let o = n && n.routeConfig ? n.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return x(!0);
  let s = o.map((a) => {
    let c = to(n) ?? r,
      l = er(a, c),
      u = Yw(l) ? l.canDeactivate(e, n, t, i) : xt(c, () => l(e, n, t, i));
    return pn(u).pipe(wt());
  });
  return x(s).pipe(Xi());
}
function aC(e, n, t, i) {
  let r = n.canLoad;
  if (r === void 0 || r.length === 0) return x(!0);
  let o = r.map((s) => {
    let a = er(s, e),
      c = qw(a) ? a.canLoad(n, t) : xt(e, () => a(n, t));
    return pn(c);
  });
  return x(o).pipe(Xi(), Fm(i));
}
function Fm(e) {
  return fc(
    he((n) => {
      if (typeof n != 'boolean') throw aa(e, n);
    }),
    V((n) => n === !0),
  );
}
function cC(e, n, t, i) {
  let r = n.canMatch;
  if (!r || r.length === 0) return x(!0);
  let o = r.map((s) => {
    let a = er(s, e),
      c = Jw(a) ? a.canMatch(n, t) : xt(e, () => a(n, t));
    return pn(c);
  });
  return x(o).pipe(Xi(), Fm(i));
}
var Kr = class {
    constructor(n) {
      this.segmentGroup = n || null;
    }
  },
  Xr = class extends Error {
    constructor(n) {
      super(), (this.urlTree = n);
    }
  };
function zi(e) {
  return gi(new Kr(e));
}
function lC(e) {
  return gi(new E(4e3, !1));
}
function uC(e) {
  return gi(Rm(!1, Je.GuardRejected));
}
var ud = class {
    constructor(n, t) {
      (this.urlSerializer = n), (this.urlTree = t);
    }
    lineralizeSegments(n, t) {
      let i = [],
        r = t.root;
      for (;;) {
        if (((i = i.concat(r.segments)), r.numberOfChildren === 0)) return x(i);
        if (r.numberOfChildren > 1 || !r.children[F]) return lC(`${n.redirectTo}`);
        r = r.children[F];
      }
    }
    applyRedirectCommands(n, t, i, r, o) {
      if (typeof t != 'string') {
        let a = t,
          {
            queryParams: c,
            fragment: l,
            routeConfig: u,
            url: d,
            outlet: g,
            params: f,
            data: _,
            title: y,
          } = r,
          b = xt(o, () =>
            a({
              params: f,
              data: _,
              queryParams: c,
              fragment: l,
              routeConfig: u,
              url: d,
              outlet: g,
              title: y,
            }),
          );
        if (b instanceof Wt) throw new Xr(b);
        t = b;
      }
      let s = this.applyRedirectCreateUrlTree(t, this.urlSerializer.parse(t), n, i);
      if (t[0] === '/') throw new Xr(s);
      return s;
    }
    applyRedirectCreateUrlTree(n, t, i, r) {
      let o = this.createSegmentGroup(n, t.root, i, r);
      return new Wt(o, this.createQueryParams(t.queryParams, this.urlTree.queryParams), t.fragment);
    }
    createQueryParams(n, t) {
      let i = {};
      return (
        Object.entries(n).forEach(([r, o]) => {
          if (typeof o == 'string' && o[0] === ':') {
            let a = o.substring(1);
            i[r] = t[a];
          } else i[r] = o;
        }),
        i
      );
    }
    createSegmentGroup(n, t, i, r) {
      let o = this.createSegments(n, t.segments, i, r),
        s = {};
      return (
        Object.entries(t.children).forEach(([a, c]) => {
          s[a] = this.createSegmentGroup(n, c, i, r);
        }),
        new q(o, s)
      );
    }
    createSegments(n, t, i, r) {
      return t.map((o) =>
        o.path[0] === ':' ? this.findPosParam(n, o, r) : this.findOrReturn(o, i),
      );
    }
    findPosParam(n, t, i) {
      let r = i[t.path.substring(1)];
      if (!r) throw new E(4001, !1);
      return r;
    }
    findOrReturn(n, t) {
      let i = 0;
      for (let r of t) {
        if (r.path === n.path) return t.splice(i), r;
        i++;
      }
      return n;
    }
  },
  dd = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function dC(e, n, t, i, r) {
  let o = yd(e, n, t);
  return o.matched
    ? ((i = Pw(n, i)), cC(i, n, t, r).pipe(V((s) => (s === !0 ? o : w({}, dd)))))
    : x(o);
}
function yd(e, n, t) {
  if (n.path === '**') return fC(t);
  if (n.path === '')
    return n.pathMatch === 'full' && (e.hasChildren() || t.length > 0)
      ? w({}, dd)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: t,
          parameters: {},
          positionalParamSegments: {},
        };
  let r = (n.matcher || cw)(t, e, n);
  if (!r) return w({}, dd);
  let o = {};
  Object.entries(r.posParams ?? {}).forEach(([a, c]) => {
    o[a] = c.path;
  });
  let s = r.consumed.length > 0 ? w(w({}, o), r.consumed[r.consumed.length - 1].parameters) : o;
  return {
    matched: !0,
    consumedSegments: r.consumed,
    remainingSegments: t.slice(r.consumed.length),
    parameters: s,
    positionalParamSegments: r.posParams ?? {},
  };
}
function fC(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? mm(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function fm(e, n, t, i) {
  return t.length > 0 && gC(e, t, i)
    ? {
        segmentGroup: new q(n, hC(i, new q(t, e.children))),
        slicedSegments: [],
      }
    : t.length === 0 && mC(e, t, i)
      ? {
          segmentGroup: new q(e.segments, pC(e, t, i, e.children)),
          slicedSegments: t,
        }
      : { segmentGroup: new q(e.segments, e.children), slicedSegments: t };
}
function pC(e, n, t, i) {
  let r = {};
  for (let o of t)
    if (ua(e, n, o) && !i[vt(o)]) {
      let s = new q([], {});
      r[vt(o)] = s;
    }
  return w(w({}, i), r);
}
function hC(e, n) {
  let t = {};
  t[F] = n;
  for (let i of e)
    if (i.path === '' && vt(i) !== F) {
      let r = new q([], {});
      t[vt(i)] = r;
    }
  return t;
}
function gC(e, n, t) {
  return t.some((i) => ua(e, n, i) && vt(i) !== F);
}
function mC(e, n, t) {
  return t.some((i) => ua(e, n, i));
}
function ua(e, n, t) {
  return (e.hasChildren() || n.length > 0) && t.pathMatch === 'full' ? !1 : t.path === '';
}
function vC(e, n, t, i) {
  return vt(e) !== i && (i === F || !ua(n, t, e)) ? !1 : yd(n, e, t).matched;
}
function _C(e, n, t) {
  return n.length === 0 && !e.children[t];
}
var fd = class {};
function yC(e, n, t, i, r, o, s = 'emptyOnly') {
  return new pd(e, n, t, i, r, s, o).recognize();
}
var bC = 31,
  pd = class {
    constructor(n, t, i, r, o, s, a) {
      (this.injector = n),
        (this.configLoader = t),
        (this.rootComponentType = i),
        (this.config = r),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new ud(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(n) {
      return new E(4002, `'${n.segmentGroup}'`);
    }
    recognize() {
      let n = fm(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(n).pipe(
        V(({ children: t, rootSnapshot: i }) => {
          let r = new Ye(i, t),
            o = new sa('', r),
            s = Mw(i, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            { state: o, tree: s }
          );
        }),
      );
    }
    match(n) {
      let t = new Qi(
        [],
        Object.freeze({}),
        Object.freeze(w({}, this.urlTree.queryParams)),
        this.urlTree.fragment,
        Object.freeze({}),
        F,
        this.rootComponentType,
        null,
        {},
      );
      return this.processSegmentGroup(this.injector, this.config, n, F, t).pipe(
        V((i) => ({ children: i, rootSnapshot: t })),
        Kt((i) => {
          if (i instanceof Xr) return (this.urlTree = i.urlTree), this.match(i.urlTree.root);
          throw i instanceof Kr ? this.noMatchError(i) : i;
        }),
      );
    }
    processSegmentGroup(n, t, i, r, o) {
      return i.segments.length === 0 && i.hasChildren()
        ? this.processChildren(n, t, i, o)
        : this.processSegment(n, t, i, i.segments, r, !0, o).pipe(
            V((s) => (s instanceof Ye ? [s] : [])),
          );
    }
    processChildren(n, t, i, r) {
      let o = [];
      for (let s of Object.keys(i.children)) s === 'primary' ? o.unshift(s) : o.push(s);
      return pe(o).pipe(
        mi((s) => {
          let a = i.children[s],
            c = kw(t, s);
          return this.processSegmentGroup(n, c, a, s, r);
        }),
        Sc((s, a) => (s.push(...a), s)),
        Xt(null),
        Cc(),
        te((s) => {
          if (s === null) return zi(i);
          let a = Lm(s);
          return DC(a), x(a);
        }),
      );
    }
    processSegment(n, t, i, r, o, s, a) {
      return pe(t).pipe(
        mi((c) =>
          this.processSegmentAgainstRoute(c._injector ?? n, t, c, i, r, o, s, a).pipe(
            Kt((l) => {
              if (l instanceof Kr) return x(null);
              throw l;
            }),
          ),
        ),
        wt((c) => !!c),
        Kt((c) => {
          if (km(c)) return _C(i, r, o) ? x(new fd()) : zi(i);
          throw c;
        }),
      );
    }
    processSegmentAgainstRoute(n, t, i, r, o, s, a, c) {
      return vC(i, r, o, s)
        ? i.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(n, r, i, o, s, c)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(n, r, t, i, o, s, c)
            : zi(r)
        : zi(r);
    }
    expandSegmentAgainstRouteUsingRedirect(n, t, i, r, o, s, a) {
      let {
        matched: c,
        parameters: l,
        consumedSegments: u,
        positionalParamSegments: d,
        remainingSegments: g,
      } = yd(t, r, o);
      if (!c) return zi(t);
      typeof r.redirectTo == 'string' &&
        r.redirectTo[0] === '/' &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > bC && (this.allowRedirects = !1));
      let f = new Qi(
          o,
          l,
          Object.freeze(w({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          pm(r),
          vt(r),
          r.component ?? r._loadedComponent ?? null,
          r,
          hm(r),
        ),
        _ = oa(f, a, this.paramsInheritanceStrategy);
      (f.params = Object.freeze(_.params)), (f.data = Object.freeze(_.data));
      let y = this.applyRedirects.applyRedirectCommands(u, r.redirectTo, d, f, n);
      return this.applyRedirects
        .lineralizeSegments(r, y)
        .pipe(te((b) => this.processSegment(n, i, t, b.concat(g), s, !1, a)));
    }
    matchSegmentAgainstRoute(n, t, i, r, o, s) {
      let a = dC(t, i, r, n, this.urlSerializer);
      return (
        i.path === '**' && (t.children = {}),
        a.pipe(
          Ke((c) =>
            c.matched
              ? ((n = i._injector ?? n),
                this.getChildConfig(n, i, r).pipe(
                  Ke(({ routes: l }) => {
                    let u = i._loadedInjector ?? n,
                      { parameters: d, consumedSegments: g, remainingSegments: f } = c,
                      _ = new Qi(
                        g,
                        d,
                        Object.freeze(w({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        pm(i),
                        vt(i),
                        i.component ?? i._loadedComponent ?? null,
                        i,
                        hm(i),
                      ),
                      y = oa(_, s, this.paramsInheritanceStrategy);
                    (_.params = Object.freeze(y.params)), (_.data = Object.freeze(y.data));
                    let { segmentGroup: b, slicedSegments: D } = fm(t, g, f, l);
                    if (D.length === 0 && b.hasChildren())
                      return this.processChildren(u, l, b, _).pipe(V((R) => new Ye(_, R)));
                    if (l.length === 0 && D.length === 0) return x(new Ye(_, []));
                    let z = vt(i) === o;
                    return this.processSegment(u, l, b, D, z ? F : o, !0, _).pipe(
                      V((R) => new Ye(_, R instanceof Ye ? [R] : [])),
                    );
                  }),
                ))
              : zi(t),
          ),
        )
      );
    }
    getChildConfig(n, t, i) {
      return t.children
        ? x({ routes: t.children, injector: n })
        : t.loadChildren
          ? t._loadedRoutes !== void 0
            ? x({ routes: t._loadedRoutes, injector: t._loadedInjector })
            : aC(n, t, i, this.urlSerializer).pipe(
                te((r) =>
                  r
                    ? this.configLoader.loadChildren(n, t).pipe(
                        he((o) => {
                          (t._loadedRoutes = o.routes), (t._loadedInjector = o.injector);
                        }),
                      )
                    : uC(t),
                ),
              )
          : x({ routes: [], injector: n });
    }
  };
function DC(e) {
  e.sort((n, t) =>
    n.value.outlet === F
      ? -1
      : t.value.outlet === F
        ? 1
        : n.value.outlet.localeCompare(t.value.outlet),
  );
}
function wC(e) {
  let n = e.value.routeConfig;
  return n && n.path === '';
}
function Lm(e) {
  let n = [],
    t = new Set();
  for (let i of e) {
    if (!wC(i)) {
      n.push(i);
      continue;
    }
    let r = n.find((o) => i.value.routeConfig === o.value.routeConfig);
    r !== void 0 ? (r.children.push(...i.children), t.add(r)) : n.push(i);
  }
  for (let i of t) {
    let r = Lm(i.children);
    n.push(new Ye(i.value, r));
  }
  return n.filter((i) => !t.has(i));
}
function pm(e) {
  return e.data || {};
}
function hm(e) {
  return e.resolve || {};
}
function CC(e, n, t, i, r, o) {
  return te((s) =>
    yC(e, n, t, i, s.extractedUrl, r, o).pipe(
      V(({ state: a, tree: c }) => oe(w({}, s), { targetSnapshot: a, urlAfterRedirects: c })),
    ),
  );
}
function SC(e, n) {
  return te((t) => {
    let {
      targetSnapshot: i,
      guards: { canActivateChecks: r },
    } = t;
    if (!r.length) return x(t);
    let o = new Set(r.map((c) => c.route)),
      s = new Set();
    for (let c of o) if (!s.has(c)) for (let l of jm(c)) s.add(l);
    let a = 0;
    return pe(s).pipe(
      mi((c) => (o.has(c) ? EC(c, i, e, n) : ((c.data = oa(c, c.parent, e).resolve), x(void 0)))),
      he(() => a++),
      _i(1),
      te((c) => (a === s.size ? x(t) : Pe)),
    );
  });
}
function jm(e) {
  let n = e.children.map((t) => jm(t)).flat();
  return [e, ...n];
}
function EC(e, n, t, i) {
  let r = e.routeConfig,
    o = e._resolve;
  return (
    r?.title !== void 0 && !Om(r) && (o[eo] = r.title),
    IC(o, e, n, i).pipe(
      V((s) => ((e._resolvedData = s), (e.data = oa(e, e.parent, t).resolve), null)),
    )
  );
}
function IC(e, n, t, i) {
  let r = Uu(e);
  if (r.length === 0) return x({});
  let o = {};
  return pe(r).pipe(
    te((s) =>
      MC(e[s], n, t, i).pipe(
        wt(),
        he((a) => {
          if (a instanceof Jr) throw aa(new Gr(), a);
          o[s] = a;
        }),
      ),
    ),
    _i(1),
    fr(o),
    Kt((s) => (km(s) ? Pe : gi(s))),
  );
}
function MC(e, n, t, i) {
  let r = to(n) ?? i,
    o = er(e, r),
    s = o.resolve ? o.resolve(n, t) : xt(r, () => o(n, t));
  return pn(s);
}
function $u(e) {
  return Ke((n) => {
    let t = e(n);
    return t ? pe(t).pipe(V(() => n)) : x(n);
  });
}
var Bm = (() => {
    class e {
      buildTitle(t) {
        let i,
          r = t.root;
        for (; r !== void 0; )
          (i = this.getResolvedTitleForRoute(r) ?? i), (r = r.children.find((o) => o.outlet === F));
        return i;
      }
      getResolvedTitleForRoute(t) {
        return t.data[eo];
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: () => v(TC), providedIn: 'root' });
      }
    }
    return e;
  })(),
  TC = (() => {
    class e extends Bm {
      constructor(t) {
        super(), (this.title = t);
      }
      updateTitle(t) {
        let i = this.buildTitle(t);
        i !== void 0 && this.title.setTitle(i);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)(U(am));
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })(),
  bd = new A('', { providedIn: 'root', factory: () => ({}) }),
  xC = (() => {
    class e {
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵcmp = I({
          type: e,
          selectors: [['ng-component']],
          standalone: !0,
          features: [M],
          decls: 1,
          vars: 0,
          template: function (i, r) {
            i & 1 && O(0, 'router-outlet');
          },
          dependencies: [vd],
          encapsulation: 2,
        });
      }
    }
    return e;
  })();
function Dd(e) {
  let n = e.children && e.children.map(Dd),
    t = n ? oe(w({}, e), { children: n }) : w({}, e);
  return (
    !t.component &&
      !t.loadComponent &&
      (n || t.loadChildren) &&
      t.outlet &&
      t.outlet !== F &&
      (t.component = xC),
    t
  );
}
var wd = new A(''),
  NC = (() => {
    class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = v(Eu));
      }
      loadComponent(t) {
        if (this.componentLoaders.get(t)) return this.componentLoaders.get(t);
        if (t._loadedComponent) return x(t._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(t);
        let i = pn(t.loadComponent()).pipe(
            V(Vm),
            he((o) => {
              this.onLoadEndListener && this.onLoadEndListener(t), (t._loadedComponent = o);
            }),
            vi(() => {
              this.componentLoaders.delete(t);
            }),
          ),
          r = new fi(i, () => new fe()).pipe(di());
        return this.componentLoaders.set(t, r), r;
      }
      loadChildren(t, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes) return x({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let o = OC(i, this.compiler, t, this.onLoadEndListener).pipe(
            vi(() => {
              this.childrenLoaders.delete(i);
            }),
          ),
          s = new fi(o, () => new fe()).pipe(di());
        return this.childrenLoaders.set(i, s), s;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })();
function OC(e, n, t, i) {
  return pn(e.loadChildren()).pipe(
    V(Vm),
    te((r) => (r instanceof Dr || Array.isArray(r) ? x(r) : pe(n.compileModuleAsync(r)))),
    V((r) => {
      i && i(e);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(r)
          ? ((s = r), (a = !0))
          : ((o = r.create(t).injector), (s = o.get(wd, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(Dd), injector: o }
      );
    }),
  );
}
function AC(e) {
  return e && typeof e == 'object' && 'default' in e;
}
function Vm(e) {
  return AC(e) ? e.default : e;
}
var Cd = (() => {
    class e {
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: () => v(RC), providedIn: 'root' });
      }
    }
    return e;
  })(),
  RC = (() => {
    class e {
      shouldProcessUrl(t) {
        return !0;
      }
      extract(t) {
        return t;
      }
      merge(t, i) {
        return t;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })(),
  PC = new A('');
var kC = new A(''),
  FC = (() => {
    class e {
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      constructor() {
        (this.currentNavigation = null),
          (this.currentTransition = null),
          (this.lastSuccessfulNavigation = null),
          (this.events = new fe()),
          (this.transitionAbortSubject = new fe()),
          (this.configLoader = v(NC)),
          (this.environmentInjector = v(We)),
          (this.urlSerializer = v(gd)),
          (this.rootContexts = v(la)),
          (this.location = v(Ar)),
          (this.inputBindingEnabled = v(_d, { optional: !0 }) !== null),
          (this.titleStrategy = v(Bm)),
          (this.options = v(bd, { optional: !0 }) || {}),
          (this.paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || 'emptyOnly'),
          (this.urlHandlingStrategy = v(Cd)),
          (this.createViewTransition = v(PC, { optional: !0 })),
          (this.navigationErrorHandler = v(kC, { optional: !0 })),
          (this.navigationId = 0),
          (this.afterPreactivation = () => x(void 0)),
          (this.rootComponentType = null);
        let t = (r) => this.events.next(new Ku(r)),
          i = (r) => this.events.next(new Xu(r));
        (this.configLoader.onLoadEndListener = i), (this.configLoader.onLoadStartListener = t);
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(t) {
        let i = ++this.navigationId;
        this.transitions?.next(oe(w(w({}, this.transitions.value), t), { id: i }));
      }
      setupNavigations(t, i, r) {
        return (
          (this.transitions = new _e({
            id: 0,
            currentUrlTree: i,
            currentRawUrl: i,
            extractedUrl: this.urlHandlingStrategy.extract(i),
            urlAfterRedirects: this.urlHandlingStrategy.extract(i),
            rawUrl: i,
            extras: {},
            resolve: () => {},
            reject: () => {},
            promise: Promise.resolve(!0),
            source: Hr,
            restoredState: null,
            currentSnapshot: r.snapshot,
            targetSnapshot: null,
            currentRouterState: r,
            targetRouterState: null,
            guards: { canActivateChecks: [], canDeactivateChecks: [] },
            guardsResult: null,
          })),
          this.transitions.pipe(
            ke((o) => o.id !== 0),
            V((o) =>
              oe(w({}, o), {
                extractedUrl: this.urlHandlingStrategy.extract(o.rawUrl),
              }),
            ),
            Ke((o) => {
              let s = !1,
                a = !1;
              return x(o).pipe(
                Ke((c) => {
                  if (this.navigationId > o.id)
                    return this.cancelNavigationTransition(o, '', Je.SupersededByNewNavigation), Pe;
                  (this.currentTransition = o),
                    (this.currentNavigation = {
                      id: c.id,
                      initialUrl: c.rawUrl,
                      extractedUrl: c.extractedUrl,
                      targetBrowserUrl:
                        typeof c.extras.browserUrl == 'string'
                          ? this.urlSerializer.parse(c.extras.browserUrl)
                          : c.extras.browserUrl,
                      trigger: c.source,
                      extras: c.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? oe(w({}, this.lastSuccessfulNavigation), {
                            previousNavigation: null,
                          })
                        : null,
                    });
                  let l =
                      !t.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl(),
                    u = c.extras.onSameUrlNavigation ?? t.onSameUrlNavigation;
                  if (!l && u !== 'reload') {
                    let d = '';
                    return (
                      this.events.next(
                        new Yn(
                          c.id,
                          this.urlSerializer.serialize(c.rawUrl),
                          d,
                          qu.IgnoredSameUrlNavigation,
                        ),
                      ),
                      c.resolve(!1),
                      Pe
                    );
                  }
                  if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                    return x(c).pipe(
                      Ke((d) => {
                        let g = this.transitions?.getValue();
                        return (
                          this.events.next(
                            new qr(
                              d.id,
                              this.urlSerializer.serialize(d.extractedUrl),
                              d.source,
                              d.restoredState,
                            ),
                          ),
                          g !== this.transitions?.getValue() ? Pe : Promise.resolve(d)
                        );
                      }),
                      CC(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        t.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy,
                      ),
                      he((d) => {
                        (o.targetSnapshot = d.targetSnapshot),
                          (o.urlAfterRedirects = d.urlAfterRedirects),
                          (this.currentNavigation = oe(w({}, this.currentNavigation), {
                            finalUrl: d.urlAfterRedirects,
                          }));
                        let g = new na(
                          d.id,
                          this.urlSerializer.serialize(d.extractedUrl),
                          this.urlSerializer.serialize(d.urlAfterRedirects),
                          d.targetSnapshot,
                        );
                        this.events.next(g);
                      }),
                    );
                  if (l && this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)) {
                    let { id: d, extractedUrl: g, source: f, restoredState: _, extras: y } = c,
                      b = new qr(d, this.urlSerializer.serialize(g), f, _);
                    this.events.next(b);
                    let D = xm(this.rootComponentType).snapshot;
                    return (
                      (this.currentTransition = o =
                        oe(w({}, c), {
                          targetSnapshot: D,
                          urlAfterRedirects: g,
                          extras: oe(w({}, y), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })),
                      (this.currentNavigation.finalUrl = g),
                      x(o)
                    );
                  } else {
                    let d = '';
                    return (
                      this.events.next(
                        new Yn(
                          c.id,
                          this.urlSerializer.serialize(c.extractedUrl),
                          d,
                          qu.IgnoredByUrlHandlingStrategy,
                        ),
                      ),
                      c.resolve(!1),
                      Pe
                    );
                  }
                }),
                he((c) => {
                  let l = new Qu(
                    c.id,
                    this.urlSerializer.serialize(c.extractedUrl),
                    this.urlSerializer.serialize(c.urlAfterRedirects),
                    c.targetSnapshot,
                  );
                  this.events.next(l);
                }),
                V(
                  (c) => (
                    (this.currentTransition = o =
                      oe(w({}, c), {
                        guards: Hw(c.targetSnapshot, c.currentSnapshot, this.rootContexts),
                      })),
                    o
                  ),
                ),
                Xw(this.environmentInjector, (c) => this.events.next(c)),
                he((c) => {
                  if (
                    ((o.guardsResult = c.guardsResult),
                    c.guardsResult && typeof c.guardsResult != 'boolean')
                  )
                    throw aa(this.urlSerializer, c.guardsResult);
                  let l = new Zu(
                    c.id,
                    this.urlSerializer.serialize(c.extractedUrl),
                    this.urlSerializer.serialize(c.urlAfterRedirects),
                    c.targetSnapshot,
                    !!c.guardsResult,
                  );
                  this.events.next(l);
                }),
                ke((c) =>
                  c.guardsResult
                    ? !0
                    : (this.cancelNavigationTransition(c, '', Je.GuardRejected), !1),
                ),
                $u((c) => {
                  if (c.guards.canActivateChecks.length)
                    return x(c).pipe(
                      he((l) => {
                        let u = new Yu(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          this.urlSerializer.serialize(l.urlAfterRedirects),
                          l.targetSnapshot,
                        );
                        this.events.next(u);
                      }),
                      Ke((l) => {
                        let u = !1;
                        return x(l).pipe(
                          SC(this.paramsInheritanceStrategy, this.environmentInjector),
                          he({
                            next: () => (u = !0),
                            complete: () => {
                              u || this.cancelNavigationTransition(l, '', Je.NoDataFromResolver);
                            },
                          }),
                        );
                      }),
                      he((l) => {
                        let u = new Ju(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          this.urlSerializer.serialize(l.urlAfterRedirects),
                          l.targetSnapshot,
                        );
                        this.events.next(u);
                      }),
                    );
                }),
                $u((c) => {
                  let l = (u) => {
                    let d = [];
                    u.routeConfig?.loadComponent &&
                      !u.routeConfig._loadedComponent &&
                      d.push(
                        this.configLoader.loadComponent(u.routeConfig).pipe(
                          he((g) => {
                            u.component = g;
                          }),
                          V(() => {}),
                        ),
                      );
                    for (let g of u.children) d.push(...l(g));
                    return d;
                  };
                  return ur(l(c.targetSnapshot.root)).pipe(Xt(null), Fe(1));
                }),
                $u(() => this.afterPreactivation()),
                Ke(() => {
                  let { currentSnapshot: c, targetSnapshot: l } = o,
                    u = this.createViewTransition?.(this.environmentInjector, c.root, l.root);
                  return u ? pe(u).pipe(V(() => o)) : x(o);
                }),
                V((c) => {
                  let l = Lw(t.routeReuseStrategy, c.targetSnapshot, c.currentRouterState);
                  return (
                    (this.currentTransition = o = oe(w({}, c), { targetRouterState: l })),
                    (this.currentNavigation.targetRouterState = l),
                    o
                  );
                }),
                he(() => {
                  this.events.next(new Zr());
                }),
                $w(
                  this.rootContexts,
                  t.routeReuseStrategy,
                  (c) => this.events.next(c),
                  this.inputBindingEnabled,
                ),
                Fe(1),
                he({
                  next: (c) => {
                    (s = !0),
                      (this.lastSuccessfulNavigation = this.currentNavigation),
                      this.events.next(
                        new Zn(
                          c.id,
                          this.urlSerializer.serialize(c.extractedUrl),
                          this.urlSerializer.serialize(c.urlAfterRedirects),
                        ),
                      ),
                      this.titleStrategy?.updateTitle(c.targetRouterState.snapshot),
                      c.resolve(!0);
                  },
                  complete: () => {
                    s = !0;
                  },
                }),
                Xe(
                  this.transitionAbortSubject.pipe(
                    he((c) => {
                      throw c;
                    }),
                  ),
                ),
                vi(() => {
                  !s && !a && this.cancelNavigationTransition(o, '', Je.SupersededByNewNavigation),
                    this.currentTransition?.id === o.id &&
                      ((this.currentNavigation = null), (this.currentTransition = null));
                }),
                Kt((c) => {
                  if (((a = !0), Pm(c)))
                    this.events.next(
                      new zt(
                        o.id,
                        this.urlSerializer.serialize(o.extractedUrl),
                        c.message,
                        c.cancellationCode,
                      ),
                    ),
                      Vw(c)
                        ? this.events.next(new Ji(c.url, c.navigationBehaviorOptions))
                        : o.resolve(!1);
                  else {
                    let l = new Qr(
                      o.id,
                      this.urlSerializer.serialize(o.extractedUrl),
                      c,
                      o.targetSnapshot ?? void 0,
                    );
                    try {
                      let u = xt(this.environmentInjector, () => this.navigationErrorHandler?.(l));
                      if (u instanceof Jr) {
                        let { message: d, cancellationCode: g } = aa(this.urlSerializer, u);
                        this.events.next(
                          new zt(o.id, this.urlSerializer.serialize(o.extractedUrl), d, g),
                        ),
                          this.events.next(new Ji(u.redirectTo, u.navigationBehaviorOptions));
                      } else {
                        this.events.next(l);
                        let d = t.errorHandler(c);
                        o.resolve(!!d);
                      }
                    } catch (u) {
                      this.options.resolveNavigationPromiseOnError ? o.resolve(!1) : o.reject(u);
                    }
                  }
                  return Pe;
                }),
              );
            }),
          )
        );
      }
      cancelNavigationTransition(t, i, r) {
        let o = new zt(t.id, this.urlSerializer.serialize(t.extractedUrl), i, r);
        this.events.next(o), t.resolve(!1);
      }
      isUpdatingInternalState() {
        return (
          this.currentTransition?.extractedUrl.toString() !==
          this.currentTransition?.currentUrlTree.toString()
        );
      }
      isUpdatedBrowserUrl() {
        let t = this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0))),
          i = this.currentNavigation?.targetBrowserUrl ?? this.currentNavigation?.extractedUrl;
        return t.toString() !== i?.toString() && !this.currentNavigation?.extras.skipLocationChange;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })();
function LC(e) {
  return e !== Hr;
}
var jC = (() => {
    class e {
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: () => v(BC), providedIn: 'root' });
      }
    }
    return e;
  })(),
  hd = class {
    shouldDetach(n) {
      return !1;
    }
    store(n, t) {}
    shouldAttach(n) {
      return !1;
    }
    retrieve(n) {
      return null;
    }
    shouldReuseRoute(n, t) {
      return n.routeConfig === t.routeConfig;
    }
  },
  BC = (() => {
    class e extends hd {
      static {
        this.ɵfac = (() => {
          let t;
          return function (r) {
            return (t || (t = Er(e)))(r || e);
          };
        })();
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })(),
  $m = (() => {
    class e {
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: () => v(VC), providedIn: 'root' });
      }
    }
    return e;
  })(),
  VC = (() => {
    class e extends $m {
      constructor() {
        super(...arguments),
          (this.location = v(Ar)),
          (this.urlSerializer = v(gd)),
          (this.options = v(bd, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || 'replace'),
          (this.urlHandlingStrategy = v(Cd)),
          (this.urlUpdateStrategy = this.options.urlUpdateStrategy || 'deferred'),
          (this.currentUrlTree = new Wt()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = xm(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== 'computed'
          ? this.currentPageId
          : (this.restoredState()?.ɵrouterPageId ?? this.currentPageId);
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(t) {
        return this.location.subscribe((i) => {
          i.type === 'popstate' && t(i.url, i.state);
        });
      }
      handleRouterEvent(t, i) {
        if (t instanceof qr) this.stateMemento = this.createStateMemento();
        else if (t instanceof Yn) this.rawUrlTree = i.initialUrl;
        else if (t instanceof na) {
          if (this.urlUpdateStrategy === 'eager' && !i.extras.skipLocationChange) {
            let r = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(i.targetBrowserUrl ?? r, i);
          }
        } else
          t instanceof Zr
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl)),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === 'deferred' &&
                !i.extras.skipLocationChange &&
                this.setBrowserUrl(i.targetBrowserUrl ?? this.rawUrlTree, i))
            : t instanceof zt && (t.code === Je.GuardRejected || t.code === Je.NoDataFromResolver)
              ? this.restoreHistory(i)
              : t instanceof Qr
                ? this.restoreHistory(i, !0)
                : t instanceof Zn &&
                  ((this.lastSuccessfulId = t.id), (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(t, i) {
        let r = t instanceof Wt ? this.urlSerializer.serialize(t) : t;
        if (this.location.isCurrentPathEqualTo(r) || i.extras.replaceUrl) {
          let o = this.browserPageId,
            s = w(w({}, i.extras.state), this.generateNgRouterState(i.id, o));
          this.location.replaceState(r, '', s);
        } else {
          let o = w(
            w({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1),
          );
          this.location.go(r, '', o);
        }
      }
      restoreHistory(t, i = !1) {
        if (this.canceledNavigationResolution === 'computed') {
          let r = this.browserPageId,
            o = this.currentPageId - r;
          o !== 0
            ? this.location.historyGo(o)
            : this.currentUrlTree === t.finalUrl &&
              o === 0 &&
              (this.resetState(t), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === 'replace' &&
            (i && this.resetState(t), this.resetUrlToCurrentUrlTree());
      }
      resetState(t) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            t.finalUrl ?? this.rawUrlTree,
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          '',
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        );
      }
      generateNgRouterState(t, i) {
        return this.canceledNavigationResolution === 'computed'
          ? { navigationId: t, ɵrouterPageId: i }
          : { navigationId: t };
      }
      static {
        this.ɵfac = (() => {
          let t;
          return function (r) {
            return (t || (t = Er(e)))(r || e);
          };
        })();
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })(),
  Vr = (function (e) {
    return (
      (e[(e.COMPLETE = 0)] = 'COMPLETE'),
      (e[(e.FAILED = 1)] = 'FAILED'),
      (e[(e.REDIRECTING = 2)] = 'REDIRECTING'),
      e
    );
  })(Vr || {});
function $C(e, n) {
  e.events
    .pipe(
      ke((t) => t instanceof Zn || t instanceof zt || t instanceof Qr || t instanceof Yn),
      V((t) =>
        t instanceof Zn || t instanceof Yn
          ? Vr.COMPLETE
          : (
                t instanceof zt
                  ? t.code === Je.Redirect || t.code === Je.SupersededByNewNavigation
                  : !1
              )
            ? Vr.REDIRECTING
            : Vr.FAILED,
      ),
      ke((t) => t !== Vr.REDIRECTING),
      Fe(1),
    )
    .subscribe(() => {
      n();
    });
}
function HC(e) {
  throw e;
}
var UC = {
    paths: 'exact',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'exact',
  },
  GC = {
    paths: 'subset',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'subset',
  },
  tr = (() => {
    class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.console = v(Hs)),
          (this.stateManager = v($m)),
          (this.options = v(bd, { optional: !0 }) || {}),
          (this.pendingTasks = v(Vi)),
          (this.urlUpdateStrategy = this.options.urlUpdateStrategy || 'deferred'),
          (this.navigationTransitions = v(FC)),
          (this.urlSerializer = v(gd)),
          (this.location = v(Ar)),
          (this.urlHandlingStrategy = v(Cd)),
          (this._events = new fe()),
          (this.errorHandler = this.options.errorHandler || HC),
          (this.navigated = !1),
          (this.routeReuseStrategy = v(jC)),
          (this.onSameUrlNavigation = this.options.onSameUrlNavigation || 'ignore'),
          (this.config = v(wd, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!v(_d, { optional: !0 })),
          (this.eventsSubscription = new se()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (t) => {
                this.console.warn(t);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let t = this.navigationTransitions.events.subscribe((i) => {
          try {
            let r = this.navigationTransitions.currentTransition,
              o = this.navigationTransitions.currentNavigation;
            if (r !== null && o !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, o),
                i instanceof zt &&
                  i.code !== Je.Redirect &&
                  i.code !== Je.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof Zn) this.navigated = !0;
              else if (i instanceof Ji) {
                let s = i.navigationBehaviorOptions,
                  a = this.urlHandlingStrategy.merge(i.url, r.currentRawUrl),
                  c = w(
                    {
                      browserUrl: r.extras.browserUrl,
                      info: r.extras.info,
                      skipLocationChange: r.extras.skipLocationChange,
                      replaceUrl:
                        r.extras.replaceUrl || this.urlUpdateStrategy === 'eager' || LC(r.source),
                    },
                    s,
                  );
                this.scheduleNavigation(a, Hr, null, c, {
                  resolve: r.resolve,
                  reject: r.reject,
                  promise: r.promise,
                });
              }
            }
            WC(i) && this._events.next(i);
          } catch (r) {
            this.navigationTransitions.transitionAbortSubject.next(r);
          }
        });
        this.eventsSubscription.add(t);
      }
      resetRootComponentType(t) {
        (this.routerState.root.component = t), (this.navigationTransitions.rootComponentType = t);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              Hr,
              this.stateManager.restoredState(),
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener((t, i) => {
            setTimeout(() => {
              this.navigateToSyncWithBrowser(t, 'popstate', i);
            }, 0);
          });
      }
      navigateToSyncWithBrowser(t, i, r) {
        let o = { replaceUrl: !0 },
          s = r?.navigationId ? r : null;
        if (r) {
          let c = w({}, r);
          delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (o.state = c);
        }
        let a = this.parseUrl(t);
        this.scheduleNavigation(a, i, s, o);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(t) {
        (this.config = t.map(Dd)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(t, i = {}) {
        let {
            relativeTo: r,
            queryParams: o,
            fragment: s,
            queryParamsHandling: a,
            preserveFragment: c,
          } = i,
          l = c ? this.currentUrlTree.fragment : s,
          u = null;
        switch (a ?? this.options.defaultQueryParamsHandling) {
          case 'merge':
            u = w(w({}, this.currentUrlTree.queryParams), o);
            break;
          case 'preserve':
            u = this.currentUrlTree.queryParams;
            break;
          default:
            u = o || null;
        }
        u !== null && (u = this.removeEmptyProps(u));
        let d;
        try {
          let g = r ? r.snapshot : this.routerState.snapshot.root;
          d = Em(g);
        } catch {
          (typeof t[0] != 'string' || t[0][0] !== '/') && (t = []), (d = this.currentUrlTree.root);
        }
        return Im(d, t, u, l ?? null);
      }
      navigateByUrl(t, i = { skipLocationChange: !1 }) {
        let r = zr(t) ? t : this.parseUrl(t),
          o = this.urlHandlingStrategy.merge(r, this.rawUrlTree);
        return this.scheduleNavigation(o, Hr, null, i);
      }
      navigate(t, i = { skipLocationChange: !1 }) {
        return zC(t), this.navigateByUrl(this.createUrlTree(t, i), i);
      }
      serializeUrl(t) {
        return this.urlSerializer.serialize(t);
      }
      parseUrl(t) {
        try {
          return this.urlSerializer.parse(t);
        } catch {
          return this.urlSerializer.parse('/');
        }
      }
      isActive(t, i) {
        let r;
        if ((i === !0 ? (r = w({}, UC)) : i === !1 ? (r = w({}, GC)) : (r = i), zr(t)))
          return cm(this.currentUrlTree, t, r);
        let o = this.parseUrl(t);
        return cm(this.currentUrlTree, o, r);
      }
      removeEmptyProps(t) {
        return Object.entries(t).reduce((i, [r, o]) => (o != null && (i[r] = o), i), {});
      }
      scheduleNavigation(t, i, r, o, s) {
        if (this.disposed) return Promise.resolve(!1);
        let a, c, l;
        s
          ? ((a = s.resolve), (c = s.reject), (l = s.promise))
          : (l = new Promise((d, g) => {
              (a = d), (c = g);
            }));
        let u = this.pendingTasks.add();
        return (
          $C(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(u));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: r,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: t,
            extras: o,
            resolve: a,
            reject: c,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch((d) => Promise.reject(d))
        );
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })();
function zC(e) {
  for (let n = 0; n < e.length; n++) if (e[n] == null) throw new E(4008, !1);
}
function WC(e) {
  return !(e instanceof Zr) && !(e instanceof Ji);
}
var qC = new A('');
function Hm(e, ...n) {
  return Cs([
    { provide: wd, multi: !0, useValue: e },
    [],
    { provide: Ki, useFactory: QC, deps: [tr] },
    { provide: Su, multi: !0, useFactory: ZC },
    n.map((t) => t.ɵproviders),
  ]);
}
function QC(e) {
  return e.routerState.root;
}
function ZC() {
  let e = v(qe);
  return (n) => {
    let t = e.get(fn);
    if (n !== t.components[0]) return;
    let i = e.get(tr),
      r = e.get(YC);
    e.get(JC) === 1 && i.initialNavigation(),
      e.get(KC, null, $.Optional)?.setUpPreloading(),
      e.get(qC, null, $.Optional)?.init(),
      i.resetRootComponentType(t.componentTypes[0]),
      r.closed || (r.next(), r.complete(), r.unsubscribe());
  };
}
var YC = new A('', { factory: () => new fe() }),
  JC = new A('', { providedIn: 'root', factory: () => 1 });
var KC = new A('');
var ee = {
  HOME: 'home',
  ABOUT: 'about',
  FOR_BUSINESS: 'forbusiness',
  SERVICES: { STAFFING: 'staffing', CONSULTING: 'consulting' },
  INDUSTRIES: {
    FINANCE: 'finance',
    HEALTH_CARE: 'healthcare',
    IT: 'it',
    RETAIL: 'retail',
    LIFE_SCIENCES: 'lifesciences',
    LOGISTICS: 'logistics',
  },
  STAFFING: {
    CONTRACT: 'forbusiness/staffing/contract',
    CONTRACT_TO_HIRE: 'forbusiness/staffing/contract-to-hire',
    DIRECT_PLACEMENT: 'forbusiness/staffing/direct-placement',
    OFFSHORE_RESOURCES: 'forbusiness/staffing/offshore-resources',
  },
  CONSULTING: {
    CLOUD_SERVICES: 'forbusiness/consulting/cloud-services',
    ENGINEERING: 'forbusiness/consulting/engineering',
    SUPPORT: 'forbusiness/consulting/support',
  },
  INSIGHTS: 'insights',
  JOB_SEEKER: { SEARCH_JOBS: 'searchjobs', SUBMIT_RESUME: 'submitresume' },
  CONTACT: 'contact',
};
var da = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-banner']],
    standalone: !0,
    features: [M],
    decls: 10,
    vars: 0,
    consts: [
      [1, 'banner-wrapper'],
      [1, 'm-auto'],
      ['src', 'assets/bgbanner.svg', 1, 'm-auto'],
      [1, 'content-data-info'],
    ],
    template: function (t, i) {
      t & 1 &&
        (p(0, 'div', 0)(1, 'figure', 1),
        O(2, 'img', 2),
        h(),
        p(3, 'div', 3)(4, 'h1'),
        m(5, 'Together Anything Is Possible'),
        h(),
        p(6, 'p'),
        m(
          7,
          'We are a staffing company dedicated to empowering people. We relentlessly pursue opportunities for others because when we all work together, anything is possible.',
        ),
        h(),
        p(8, 'button'),
        m(9, 'Get Started'),
        h()()());
    },
    styles: [
      '.banner-wrapper[_ngcontent-%COMP%]{position:relative;background:#0069ff}.banner-wrapper[_ngcontent-%COMP%]   .content-data-info[_ngcontent-%COMP%]{position:absolute;left:0;right:0;top:0;width:800px;margin:0 auto;display:flex;align-items:center;justify-content:center;flex-direction:column;height:100%}.banner-wrapper[_ngcontent-%COMP%]   .content-data-info[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:#fff;font-family:Open Sans;font-size:50px;font-style:normal;font-weight:700;line-height:normal;letter-spacing:-.5px}.banner-wrapper[_ngcontent-%COMP%]   .content-data-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#fff;font-family:Open Sans;font-size:20px;font-style:normal;font-weight:500;line-height:29px;text-align:center}.banner-wrapper[_ngcontent-%COMP%]   .content-data-info[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;padding:15px 24px;justify-content:center;align-items:center;gap:10px;border-radius:60px;background:#fff;color:#2c2c2c;font-family:Open Sans;font-size:16px;font-style:normal;font-weight:700;line-height:normal;border:0}',
    ],
  });
};
function fa(e) {
  e || (Es(fa), (e = v(Hn)));
  let n = new B((t) => e.onDestroy(t.next.bind(t)));
  return (t) => t.pipe(Xe(n));
}
var de = 'top',
  Ie = 'bottom',
  be = 'right',
  me = 'left',
  pa = 'auto',
  hn = [de, Ie, be, me],
  qt = 'start',
  Jn = 'end',
  Um = 'clippingParents',
  ha = 'viewport',
  nr = 'popper',
  Gm = 'reference',
  Sd = hn.reduce(function (e, n) {
    return e.concat([n + '-' + qt, n + '-' + Jn]);
  }, []),
  ga = [].concat(hn, [pa]).reduce(function (e, n) {
    return e.concat([n, n + '-' + qt, n + '-' + Jn]);
  }, []),
  XC = 'beforeRead',
  eS = 'read',
  tS = 'afterRead',
  nS = 'beforeMain',
  iS = 'main',
  rS = 'afterMain',
  oS = 'beforeWrite',
  sS = 'write',
  aS = 'afterWrite',
  zm = [XC, eS, tS, nS, iS, rS, oS, sS, aS];
function De(e) {
  return e ? (e.nodeName || '').toLowerCase() : null;
}
function ne(e) {
  if (e == null) return window;
  if (e.toString() !== '[object Window]') {
    var n = e.ownerDocument;
    return (n && n.defaultView) || window;
  }
  return e;
}
function st(e) {
  var n = ne(e).Element;
  return e instanceof n || e instanceof Element;
}
function ve(e) {
  var n = ne(e).HTMLElement;
  return e instanceof n || e instanceof HTMLElement;
}
function ir(e) {
  if (typeof ShadowRoot > 'u') return !1;
  var n = ne(e).ShadowRoot;
  return e instanceof n || e instanceof ShadowRoot;
}
function cS(e) {
  var n = e.state;
  Object.keys(n.elements).forEach(function (t) {
    var i = n.styles[t] || {},
      r = n.attributes[t] || {},
      o = n.elements[t];
    !ve(o) ||
      !De(o) ||
      (Object.assign(o.style, i),
      Object.keys(r).forEach(function (s) {
        var a = r[s];
        a === !1 ? o.removeAttribute(s) : o.setAttribute(s, a === !0 ? '' : a);
      }));
  });
}
function lS(e) {
  var n = e.state,
    t = {
      popper: {
        position: n.options.strategy,
        left: '0',
        top: '0',
        margin: '0',
      },
      arrow: { position: 'absolute' },
      reference: {},
    };
  return (
    Object.assign(n.elements.popper.style, t.popper),
    (n.styles = t),
    n.elements.arrow && Object.assign(n.elements.arrow.style, t.arrow),
    function () {
      Object.keys(n.elements).forEach(function (i) {
        var r = n.elements[i],
          o = n.attributes[i] || {},
          s = Object.keys(n.styles.hasOwnProperty(i) ? n.styles[i] : t[i]),
          a = s.reduce(function (c, l) {
            return (c[l] = ''), c;
          }, {});
        !ve(r) ||
          !De(r) ||
          (Object.assign(r.style, a),
          Object.keys(o).forEach(function (c) {
            r.removeAttribute(c);
          }));
      });
    }
  );
}
var Wm = {
  name: 'applyStyles',
  enabled: !0,
  phase: 'write',
  fn: cS,
  effect: lS,
  requires: ['computeStyles'],
};
function we(e) {
  return e.split('-')[0];
}
var _t = Math.max,
  Kn = Math.min,
  Qt = Math.round;
function rr() {
  var e = navigator.userAgentData;
  return e != null && e.brands && Array.isArray(e.brands)
    ? e.brands
        .map(function (n) {
          return n.brand + '/' + n.version;
        })
        .join(' ')
    : navigator.userAgent;
}
function io() {
  return !/^((?!chrome|android).)*safari/i.test(rr());
}
function at(e, n, t) {
  n === void 0 && (n = !1), t === void 0 && (t = !1);
  var i = e.getBoundingClientRect(),
    r = 1,
    o = 1;
  n &&
    ve(e) &&
    ((r = (e.offsetWidth > 0 && Qt(i.width) / e.offsetWidth) || 1),
    (o = (e.offsetHeight > 0 && Qt(i.height) / e.offsetHeight) || 1));
  var s = st(e) ? ne(e) : window,
    a = s.visualViewport,
    c = !io() && t,
    l = (i.left + (c && a ? a.offsetLeft : 0)) / r,
    u = (i.top + (c && a ? a.offsetTop : 0)) / o,
    d = i.width / r,
    g = i.height / o;
  return {
    width: d,
    height: g,
    top: u,
    right: l + d,
    bottom: u + g,
    left: l,
    x: l,
    y: u,
  };
}
function Xn(e) {
  var n = at(e),
    t = e.offsetWidth,
    i = e.offsetHeight;
  return (
    Math.abs(n.width - t) <= 1 && (t = n.width),
    Math.abs(n.height - i) <= 1 && (i = n.height),
    { x: e.offsetLeft, y: e.offsetTop, width: t, height: i }
  );
}
function ro(e, n) {
  var t = n.getRootNode && n.getRootNode();
  if (e.contains(n)) return !0;
  if (t && ir(t)) {
    var i = n;
    do {
      if (i && e.isSameNode(i)) return !0;
      i = i.parentNode || i.host;
    } while (i);
  }
  return !1;
}
function $e(e) {
  return ne(e).getComputedStyle(e);
}
function Ed(e) {
  return ['table', 'td', 'th'].indexOf(De(e)) >= 0;
}
function Me(e) {
  return ((st(e) ? e.ownerDocument : e.document) || window.document).documentElement;
}
function Zt(e) {
  return De(e) === 'html' ? e : e.assignedSlot || e.parentNode || (ir(e) ? e.host : null) || Me(e);
}
function qm(e) {
  return !ve(e) || $e(e).position === 'fixed' ? null : e.offsetParent;
}
function uS(e) {
  var n = /firefox/i.test(rr()),
    t = /Trident/i.test(rr());
  if (t && ve(e)) {
    var i = $e(e);
    if (i.position === 'fixed') return null;
  }
  var r = Zt(e);
  for (ir(r) && (r = r.host); ve(r) && ['html', 'body'].indexOf(De(r)) < 0; ) {
    var o = $e(r);
    if (
      o.transform !== 'none' ||
      o.perspective !== 'none' ||
      o.contain === 'paint' ||
      ['transform', 'perspective'].indexOf(o.willChange) !== -1 ||
      (n && o.willChange === 'filter') ||
      (n && o.filter && o.filter !== 'none')
    )
      return r;
    r = r.parentNode;
  }
  return null;
}
function yt(e) {
  for (var n = ne(e), t = qm(e); t && Ed(t) && $e(t).position === 'static'; ) t = qm(t);
  return t && (De(t) === 'html' || (De(t) === 'body' && $e(t).position === 'static'))
    ? n
    : t || uS(e) || n;
}
function ei(e) {
  return ['top', 'bottom'].indexOf(e) >= 0 ? 'x' : 'y';
}
function ti(e, n, t) {
  return _t(e, Kn(n, t));
}
function Qm(e, n, t) {
  var i = ti(e, n, t);
  return i > t ? t : i;
}
function oo() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
function so(e) {
  return Object.assign({}, oo(), e);
}
function ao(e, n) {
  return n.reduce(function (t, i) {
    return (t[i] = e), t;
  }, {});
}
var dS = function (n, t) {
  return (
    (n = typeof n == 'function' ? n(Object.assign({}, t.rects, { placement: t.placement })) : n),
    so(typeof n != 'number' ? n : ao(n, hn))
  );
};
function fS(e) {
  var n,
    t = e.state,
    i = e.name,
    r = e.options,
    o = t.elements.arrow,
    s = t.modifiersData.popperOffsets,
    a = we(t.placement),
    c = ei(a),
    l = [me, be].indexOf(a) >= 0,
    u = l ? 'height' : 'width';
  if (!(!o || !s)) {
    var d = dS(r.padding, t),
      g = Xn(o),
      f = c === 'y' ? de : me,
      _ = c === 'y' ? Ie : be,
      y = t.rects.reference[u] + t.rects.reference[c] - s[c] - t.rects.popper[u],
      b = s[c] - t.rects.reference[c],
      D = yt(o),
      z = D ? (c === 'y' ? D.clientHeight || 0 : D.clientWidth || 0) : 0,
      R = y / 2 - b / 2,
      T = d[f],
      G = z - g[u] - d[_],
      L = z / 2 - g[u] / 2 + R,
      Q = ti(T, L, G),
      ce = c;
    t.modifiersData[i] = ((n = {}), (n[ce] = Q), (n.centerOffset = Q - L), n);
  }
}
function pS(e) {
  var n = e.state,
    t = e.options,
    i = t.element,
    r = i === void 0 ? '[data-popper-arrow]' : i;
  r != null &&
    ((typeof r == 'string' && ((r = n.elements.popper.querySelector(r)), !r)) ||
      (ro(n.elements.popper, r) && (n.elements.arrow = r)));
}
var Id = {
  name: 'arrow',
  enabled: !0,
  phase: 'main',
  fn: fS,
  effect: pS,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow'],
};
function ct(e) {
  return e.split('-')[1];
}
var hS = { top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' };
function gS(e, n) {
  var t = e.x,
    i = e.y,
    r = n.devicePixelRatio || 1;
  return { x: Qt(t * r) / r || 0, y: Qt(i * r) / r || 0 };
}
function Zm(e) {
  var n,
    t = e.popper,
    i = e.popperRect,
    r = e.placement,
    o = e.variation,
    s = e.offsets,
    a = e.position,
    c = e.gpuAcceleration,
    l = e.adaptive,
    u = e.roundOffsets,
    d = e.isFixed,
    g = s.x,
    f = g === void 0 ? 0 : g,
    _ = s.y,
    y = _ === void 0 ? 0 : _,
    b = typeof u == 'function' ? u({ x: f, y }) : { x: f, y };
  (f = b.x), (y = b.y);
  var D = s.hasOwnProperty('x'),
    z = s.hasOwnProperty('y'),
    R = me,
    T = de,
    G = window;
  if (l) {
    var L = yt(t),
      Q = 'clientHeight',
      ce = 'clientWidth';
    if (
      (L === ne(t) &&
        ((L = Me(t)),
        $e(L).position !== 'static' &&
          a === 'absolute' &&
          ((Q = 'scrollHeight'), (ce = 'scrollWidth'))),
      (L = L),
      r === de || ((r === me || r === be) && o === Jn))
    ) {
      T = Ie;
      var ue = d && L === G && G.visualViewport ? G.visualViewport.height : L[Q];
      (y -= ue - i.height), (y *= c ? 1 : -1);
    }
    if (r === me || ((r === de || r === Ie) && o === Jn)) {
      R = be;
      var le = d && L === G && G.visualViewport ? G.visualViewport.width : L[ce];
      (f -= le - i.width), (f *= c ? 1 : -1);
    }
  }
  var Te = Object.assign({ position: a }, l && hS),
    lt = u === !0 ? gS({ x: f, y }, ne(t)) : { x: f, y };
  if (((f = lt.x), (y = lt.y), c)) {
    var Ae;
    return Object.assign(
      {},
      Te,
      ((Ae = {}),
      (Ae[T] = z ? '0' : ''),
      (Ae[R] = D ? '0' : ''),
      (Ae.transform =
        (G.devicePixelRatio || 1) <= 1
          ? 'translate(' + f + 'px, ' + y + 'px)'
          : 'translate3d(' + f + 'px, ' + y + 'px, 0)'),
      Ae),
    );
  }
  return Object.assign(
    {},
    Te,
    ((n = {}), (n[T] = z ? y + 'px' : ''), (n[R] = D ? f + 'px' : ''), (n.transform = ''), n),
  );
}
function mS(e) {
  var n = e.state,
    t = e.options,
    i = t.gpuAcceleration,
    r = i === void 0 ? !0 : i,
    o = t.adaptive,
    s = o === void 0 ? !0 : o,
    a = t.roundOffsets,
    c = a === void 0 ? !0 : a,
    l = {
      placement: we(n.placement),
      variation: ct(n.placement),
      popper: n.elements.popper,
      popperRect: n.rects.popper,
      gpuAcceleration: r,
      isFixed: n.options.strategy === 'fixed',
    };
  n.modifiersData.popperOffsets != null &&
    (n.styles.popper = Object.assign(
      {},
      n.styles.popper,
      Zm(
        Object.assign({}, l, {
          offsets: n.modifiersData.popperOffsets,
          position: n.options.strategy,
          adaptive: s,
          roundOffsets: c,
        }),
      ),
    )),
    n.modifiersData.arrow != null &&
      (n.styles.arrow = Object.assign(
        {},
        n.styles.arrow,
        Zm(
          Object.assign({}, l, {
            offsets: n.modifiersData.arrow,
            position: 'absolute',
            adaptive: !1,
            roundOffsets: c,
          }),
        ),
      )),
    (n.attributes.popper = Object.assign({}, n.attributes.popper, {
      'data-popper-placement': n.placement,
    }));
}
var Ym = {
  name: 'computeStyles',
  enabled: !0,
  phase: 'beforeWrite',
  fn: mS,
  data: {},
};
var ma = { passive: !0 };
function vS(e) {
  var n = e.state,
    t = e.instance,
    i = e.options,
    r = i.scroll,
    o = r === void 0 ? !0 : r,
    s = i.resize,
    a = s === void 0 ? !0 : s,
    c = ne(n.elements.popper),
    l = [].concat(n.scrollParents.reference, n.scrollParents.popper);
  return (
    o &&
      l.forEach(function (u) {
        u.addEventListener('scroll', t.update, ma);
      }),
    a && c.addEventListener('resize', t.update, ma),
    function () {
      o &&
        l.forEach(function (u) {
          u.removeEventListener('scroll', t.update, ma);
        }),
        a && c.removeEventListener('resize', t.update, ma);
    }
  );
}
var Jm = {
  name: 'eventListeners',
  enabled: !0,
  phase: 'write',
  fn: function () {},
  effect: vS,
  data: {},
};
var _S = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
function or(e) {
  return e.replace(/left|right|bottom|top/g, function (n) {
    return _S[n];
  });
}
var yS = { start: 'end', end: 'start' };
function va(e) {
  return e.replace(/start|end/g, function (n) {
    return yS[n];
  });
}
function ni(e) {
  var n = ne(e),
    t = n.pageXOffset,
    i = n.pageYOffset;
  return { scrollLeft: t, scrollTop: i };
}
function ii(e) {
  return at(Me(e)).left + ni(e).scrollLeft;
}
function Md(e, n) {
  var t = ne(e),
    i = Me(e),
    r = t.visualViewport,
    o = i.clientWidth,
    s = i.clientHeight,
    a = 0,
    c = 0;
  if (r) {
    (o = r.width), (s = r.height);
    var l = io();
    (l || (!l && n === 'fixed')) && ((a = r.offsetLeft), (c = r.offsetTop));
  }
  return { width: o, height: s, x: a + ii(e), y: c };
}
function Td(e) {
  var n,
    t = Me(e),
    i = ni(e),
    r = (n = e.ownerDocument) == null ? void 0 : n.body,
    o = _t(t.scrollWidth, t.clientWidth, r ? r.scrollWidth : 0, r ? r.clientWidth : 0),
    s = _t(t.scrollHeight, t.clientHeight, r ? r.scrollHeight : 0, r ? r.clientHeight : 0),
    a = -i.scrollLeft + ii(e),
    c = -i.scrollTop;
  return (
    $e(r || t).direction === 'rtl' && (a += _t(t.clientWidth, r ? r.clientWidth : 0) - o),
    { width: o, height: s, x: a, y: c }
  );
}
function ri(e) {
  var n = $e(e),
    t = n.overflow,
    i = n.overflowX,
    r = n.overflowY;
  return /auto|scroll|overlay|hidden/.test(t + r + i);
}
function _a(e) {
  return ['html', 'body', '#document'].indexOf(De(e)) >= 0
    ? e.ownerDocument.body
    : ve(e) && ri(e)
      ? e
      : _a(Zt(e));
}
function gn(e, n) {
  var t;
  n === void 0 && (n = []);
  var i = _a(e),
    r = i === ((t = e.ownerDocument) == null ? void 0 : t.body),
    o = ne(i),
    s = r ? [o].concat(o.visualViewport || [], ri(i) ? i : []) : i,
    a = n.concat(s);
  return r ? a : a.concat(gn(Zt(s)));
}
function sr(e) {
  return Object.assign({}, e, {
    left: e.x,
    top: e.y,
    right: e.x + e.width,
    bottom: e.y + e.height,
  });
}
function bS(e, n) {
  var t = at(e, !1, n === 'fixed');
  return (
    (t.top = t.top + e.clientTop),
    (t.left = t.left + e.clientLeft),
    (t.bottom = t.top + e.clientHeight),
    (t.right = t.left + e.clientWidth),
    (t.width = e.clientWidth),
    (t.height = e.clientHeight),
    (t.x = t.left),
    (t.y = t.top),
    t
  );
}
function Km(e, n, t) {
  return n === ha ? sr(Md(e, t)) : st(n) ? bS(n, t) : sr(Td(Me(e)));
}
function DS(e) {
  var n = gn(Zt(e)),
    t = ['absolute', 'fixed'].indexOf($e(e).position) >= 0,
    i = t && ve(e) ? yt(e) : e;
  return st(i)
    ? n.filter(function (r) {
        return st(r) && ro(r, i) && De(r) !== 'body';
      })
    : [];
}
function xd(e, n, t, i) {
  var r = n === 'clippingParents' ? DS(e) : [].concat(n),
    o = [].concat(r, [t]),
    s = o[0],
    a = o.reduce(
      function (c, l) {
        var u = Km(e, l, i);
        return (
          (c.top = _t(u.top, c.top)),
          (c.right = Kn(u.right, c.right)),
          (c.bottom = Kn(u.bottom, c.bottom)),
          (c.left = _t(u.left, c.left)),
          c
        );
      },
      Km(e, s, i),
    );
  return (
    (a.width = a.right - a.left), (a.height = a.bottom - a.top), (a.x = a.left), (a.y = a.top), a
  );
}
function co(e) {
  var n = e.reference,
    t = e.element,
    i = e.placement,
    r = i ? we(i) : null,
    o = i ? ct(i) : null,
    s = n.x + n.width / 2 - t.width / 2,
    a = n.y + n.height / 2 - t.height / 2,
    c;
  switch (r) {
    case de:
      c = { x: s, y: n.y - t.height };
      break;
    case Ie:
      c = { x: s, y: n.y + n.height };
      break;
    case be:
      c = { x: n.x + n.width, y: a };
      break;
    case me:
      c = { x: n.x - t.width, y: a };
      break;
    default:
      c = { x: n.x, y: n.y };
  }
  var l = r ? ei(r) : null;
  if (l != null) {
    var u = l === 'y' ? 'height' : 'width';
    switch (o) {
      case qt:
        c[l] = c[l] - (n[u] / 2 - t[u] / 2);
        break;
      case Jn:
        c[l] = c[l] + (n[u] / 2 - t[u] / 2);
        break;
      default:
    }
  }
  return c;
}
function mn(e, n) {
  n === void 0 && (n = {});
  var t = n,
    i = t.placement,
    r = i === void 0 ? e.placement : i,
    o = t.strategy,
    s = o === void 0 ? e.strategy : o,
    a = t.boundary,
    c = a === void 0 ? Um : a,
    l = t.rootBoundary,
    u = l === void 0 ? ha : l,
    d = t.elementContext,
    g = d === void 0 ? nr : d,
    f = t.altBoundary,
    _ = f === void 0 ? !1 : f,
    y = t.padding,
    b = y === void 0 ? 0 : y,
    D = so(typeof b != 'number' ? b : ao(b, hn)),
    z = g === nr ? Gm : nr,
    R = e.rects.popper,
    T = e.elements[_ ? z : g],
    G = xd(st(T) ? T : T.contextElement || Me(e.elements.popper), c, u, s),
    L = at(e.elements.reference),
    Q = co({ reference: L, element: R, strategy: 'absolute', placement: r }),
    ce = sr(Object.assign({}, R, Q)),
    ue = g === nr ? ce : L,
    le = {
      top: G.top - ue.top + D.top,
      bottom: ue.bottom - G.bottom + D.bottom,
      left: G.left - ue.left + D.left,
      right: ue.right - G.right + D.right,
    },
    Te = e.modifiersData.offset;
  if (g === nr && Te) {
    var lt = Te[r];
    Object.keys(le).forEach(function (Ae) {
      var yn = [be, Ie].indexOf(Ae) >= 0 ? 1 : -1,
        bn = [de, Ie].indexOf(Ae) >= 0 ? 'y' : 'x';
      le[Ae] += lt[bn] * yn;
    });
  }
  return le;
}
function Nd(e, n) {
  n === void 0 && (n = {});
  var t = n,
    i = t.placement,
    r = t.boundary,
    o = t.rootBoundary,
    s = t.padding,
    a = t.flipVariations,
    c = t.allowedAutoPlacements,
    l = c === void 0 ? ga : c,
    u = ct(i),
    d = u
      ? a
        ? Sd
        : Sd.filter(function (_) {
            return ct(_) === u;
          })
      : hn,
    g = d.filter(function (_) {
      return l.indexOf(_) >= 0;
    });
  g.length === 0 && (g = d);
  var f = g.reduce(function (_, y) {
    return (_[y] = mn(e, { placement: y, boundary: r, rootBoundary: o, padding: s })[we(y)]), _;
  }, {});
  return Object.keys(f).sort(function (_, y) {
    return f[_] - f[y];
  });
}
function wS(e) {
  if (we(e) === pa) return [];
  var n = or(e);
  return [va(e), n, va(n)];
}
function CS(e) {
  var n = e.state,
    t = e.options,
    i = e.name;
  if (!n.modifiersData[i]._skip) {
    for (
      var r = t.mainAxis,
        o = r === void 0 ? !0 : r,
        s = t.altAxis,
        a = s === void 0 ? !0 : s,
        c = t.fallbackPlacements,
        l = t.padding,
        u = t.boundary,
        d = t.rootBoundary,
        g = t.altBoundary,
        f = t.flipVariations,
        _ = f === void 0 ? !0 : f,
        y = t.allowedAutoPlacements,
        b = n.options.placement,
        D = we(b),
        z = D === b,
        R = c || (z || !_ ? [or(b)] : wS(b)),
        T = [b].concat(R).reduce(function (oi, Yt) {
          return oi.concat(
            we(Yt) === pa
              ? Nd(n, {
                  placement: Yt,
                  boundary: u,
                  rootBoundary: d,
                  padding: l,
                  flipVariations: _,
                  allowedAutoPlacements: y,
                })
              : Yt,
          );
        }, []),
        G = n.rects.reference,
        L = n.rects.popper,
        Q = new Map(),
        ce = !0,
        ue = T[0],
        le = 0;
      le < T.length;
      le++
    ) {
      var Te = T[le],
        lt = we(Te),
        Ae = ct(Te) === qt,
        yn = [de, Ie].indexOf(lt) >= 0,
        bn = yn ? 'width' : 'height',
        Ge = mn(n, {
          placement: Te,
          boundary: u,
          rootBoundary: d,
          altBoundary: g,
          padding: l,
        }),
        ut = yn ? (Ae ? be : me) : Ae ? Ie : de;
      G[bn] > L[bn] && (ut = or(ut));
      var lo = or(ut),
        Dn = [];
      if (
        (o && Dn.push(Ge[lt] <= 0),
        a && Dn.push(Ge[ut] <= 0, Ge[lo] <= 0),
        Dn.every(function (oi) {
          return oi;
        }))
      ) {
        (ue = Te), (ce = !1);
        break;
      }
      Q.set(Te, Dn);
    }
    if (ce)
      for (
        var uo = _ ? 3 : 1,
          Qa = function (Yt) {
            var cr = T.find(function (po) {
              var wn = Q.get(po);
              if (wn)
                return wn.slice(0, Yt).every(function (Za) {
                  return Za;
                });
            });
            if (cr) return (ue = cr), 'break';
          },
          ar = uo;
        ar > 0;
        ar--
      ) {
        var fo = Qa(ar);
        if (fo === 'break') break;
      }
    n.placement !== ue && ((n.modifiersData[i]._skip = !0), (n.placement = ue), (n.reset = !0));
  }
}
var Od = {
  name: 'flip',
  enabled: !0,
  phase: 'main',
  fn: CS,
  requiresIfExists: ['offset'],
  data: { _skip: !1 },
};
function SS(e, n, t) {
  var i = we(e),
    r = [me, de].indexOf(i) >= 0 ? -1 : 1,
    o = typeof t == 'function' ? t(Object.assign({}, n, { placement: e })) : t,
    s = o[0],
    a = o[1];
  return (
    (s = s || 0), (a = (a || 0) * r), [me, be].indexOf(i) >= 0 ? { x: a, y: s } : { x: s, y: a }
  );
}
function ES(e) {
  var n = e.state,
    t = e.options,
    i = e.name,
    r = t.offset,
    o = r === void 0 ? [0, 0] : r,
    s = ga.reduce(function (u, d) {
      return (u[d] = SS(d, n.rects, o)), u;
    }, {}),
    a = s[n.placement],
    c = a.x,
    l = a.y;
  n.modifiersData.popperOffsets != null &&
    ((n.modifiersData.popperOffsets.x += c), (n.modifiersData.popperOffsets.y += l)),
    (n.modifiersData[i] = s);
}
var Ad = {
  name: 'offset',
  enabled: !0,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: ES,
};
function IS(e) {
  var n = e.state,
    t = e.name;
  n.modifiersData[t] = co({
    reference: n.rects.reference,
    element: n.rects.popper,
    strategy: 'absolute',
    placement: n.placement,
  });
}
var Xm = {
  name: 'popperOffsets',
  enabled: !0,
  phase: 'read',
  fn: IS,
  data: {},
};
function Rd(e) {
  return e === 'x' ? 'y' : 'x';
}
function MS(e) {
  var n = e.state,
    t = e.options,
    i = e.name,
    r = t.mainAxis,
    o = r === void 0 ? !0 : r,
    s = t.altAxis,
    a = s === void 0 ? !1 : s,
    c = t.boundary,
    l = t.rootBoundary,
    u = t.altBoundary,
    d = t.padding,
    g = t.tether,
    f = g === void 0 ? !0 : g,
    _ = t.tetherOffset,
    y = _ === void 0 ? 0 : _,
    b = mn(n, { boundary: c, rootBoundary: l, padding: d, altBoundary: u }),
    D = we(n.placement),
    z = ct(n.placement),
    R = !z,
    T = ei(D),
    G = Rd(T),
    L = n.modifiersData.popperOffsets,
    Q = n.rects.reference,
    ce = n.rects.popper,
    ue = typeof y == 'function' ? y(Object.assign({}, n.rects, { placement: n.placement })) : y,
    le =
      typeof ue == 'number'
        ? { mainAxis: ue, altAxis: ue }
        : Object.assign({ mainAxis: 0, altAxis: 0 }, ue),
    Te = n.modifiersData.offset ? n.modifiersData.offset[n.placement] : null,
    lt = { x: 0, y: 0 };
  if (L) {
    if (o) {
      var Ae,
        yn = T === 'y' ? de : me,
        bn = T === 'y' ? Ie : be,
        Ge = T === 'y' ? 'height' : 'width',
        ut = L[T],
        lo = ut + b[yn],
        Dn = ut - b[bn],
        uo = f ? -ce[Ge] / 2 : 0,
        Qa = z === qt ? Q[Ge] : ce[Ge],
        ar = z === qt ? -ce[Ge] : -Q[Ge],
        fo = n.elements.arrow,
        oi = f && fo ? Xn(fo) : { width: 0, height: 0 },
        Yt = n.modifiersData['arrow#persistent']
          ? n.modifiersData['arrow#persistent'].padding
          : oo(),
        cr = Yt[yn],
        po = Yt[bn],
        wn = ti(0, Q[Ge], oi[Ge]),
        Za = R ? Q[Ge] / 2 - uo - wn - cr - le.mainAxis : Qa - wn - cr - le.mainAxis,
        w0 = R ? -Q[Ge] / 2 + uo + wn + po + le.mainAxis : ar + wn + po + le.mainAxis,
        Ya = n.elements.arrow && yt(n.elements.arrow),
        C0 = Ya ? (T === 'y' ? Ya.clientTop || 0 : Ya.clientLeft || 0) : 0,
        Wd = (Ae = Te?.[T]) != null ? Ae : 0,
        S0 = ut + Za - Wd - C0,
        E0 = ut + w0 - Wd,
        qd = ti(f ? Kn(lo, S0) : lo, ut, f ? _t(Dn, E0) : Dn);
      (L[T] = qd), (lt[T] = qd - ut);
    }
    if (a) {
      var Qd,
        I0 = T === 'x' ? de : me,
        M0 = T === 'x' ? Ie : be,
        Cn = L[G],
        ho = G === 'y' ? 'height' : 'width',
        Zd = Cn + b[I0],
        Yd = Cn - b[M0],
        Ja = [de, me].indexOf(D) !== -1,
        Jd = (Qd = Te?.[G]) != null ? Qd : 0,
        Kd = Ja ? Zd : Cn - Q[ho] - ce[ho] - Jd + le.altAxis,
        Xd = Ja ? Cn + Q[ho] + ce[ho] - Jd - le.altAxis : Yd,
        ef = f && Ja ? Qm(Kd, Cn, Xd) : ti(f ? Kd : Zd, Cn, f ? Xd : Yd);
      (L[G] = ef), (lt[G] = ef - Cn);
    }
    n.modifiersData[i] = lt;
  }
}
var Pd = {
  name: 'preventOverflow',
  enabled: !0,
  phase: 'main',
  fn: MS,
  requiresIfExists: ['offset'],
};
function kd(e) {
  return { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop };
}
function Fd(e) {
  return e === ne(e) || !ve(e) ? ni(e) : kd(e);
}
function TS(e) {
  var n = e.getBoundingClientRect(),
    t = Qt(n.width) / e.offsetWidth || 1,
    i = Qt(n.height) / e.offsetHeight || 1;
  return t !== 1 || i !== 1;
}
function Ld(e, n, t) {
  t === void 0 && (t = !1);
  var i = ve(n),
    r = ve(n) && TS(n),
    o = Me(n),
    s = at(e, r, t),
    a = { scrollLeft: 0, scrollTop: 0 },
    c = { x: 0, y: 0 };
  return (
    (i || (!i && !t)) &&
      ((De(n) !== 'body' || ri(o)) && (a = Fd(n)),
      ve(n) ? ((c = at(n, !0)), (c.x += n.clientLeft), (c.y += n.clientTop)) : o && (c.x = ii(o))),
    {
      x: s.left + a.scrollLeft - c.x,
      y: s.top + a.scrollTop - c.y,
      width: s.width,
      height: s.height,
    }
  );
}
function xS(e) {
  var n = new Map(),
    t = new Set(),
    i = [];
  e.forEach(function (o) {
    n.set(o.name, o);
  });
  function r(o) {
    t.add(o.name);
    var s = [].concat(o.requires || [], o.requiresIfExists || []);
    s.forEach(function (a) {
      if (!t.has(a)) {
        var c = n.get(a);
        c && r(c);
      }
    }),
      i.push(o);
  }
  return (
    e.forEach(function (o) {
      t.has(o.name) || r(o);
    }),
    i
  );
}
function jd(e) {
  var n = xS(e);
  return zm.reduce(function (t, i) {
    return t.concat(
      n.filter(function (r) {
        return r.phase === i;
      }),
    );
  }, []);
}
function Bd(e) {
  var n;
  return function () {
    return (
      n ||
        (n = new Promise(function (t) {
          Promise.resolve().then(function () {
            (n = void 0), t(e());
          });
        })),
      n
    );
  };
}
function Vd(e) {
  var n = e.reduce(function (t, i) {
    var r = t[i.name];
    return (
      (t[i.name] = r
        ? Object.assign({}, r, i, {
            options: Object.assign({}, r.options, i.options),
            data: Object.assign({}, r.data, i.data),
          })
        : i),
      t
    );
  }, {});
  return Object.keys(n).map(function (t) {
    return n[t];
  });
}
var e0 = { placement: 'bottom', modifiers: [], strategy: 'absolute' };
function t0() {
  for (var e = arguments.length, n = new Array(e), t = 0; t < e; t++) n[t] = arguments[t];
  return !n.some(function (i) {
    return !(i && typeof i.getBoundingClientRect == 'function');
  });
}
function n0(e) {
  e === void 0 && (e = {});
  var n = e,
    t = n.defaultModifiers,
    i = t === void 0 ? [] : t,
    r = n.defaultOptions,
    o = r === void 0 ? e0 : r;
  return function (a, c, l) {
    l === void 0 && (l = o);
    var u = {
        placement: 'bottom',
        orderedModifiers: [],
        options: Object.assign({}, e0, o),
        modifiersData: {},
        elements: { reference: a, popper: c },
        attributes: {},
        styles: {},
      },
      d = [],
      g = !1,
      f = {
        state: u,
        setOptions: function (D) {
          var z = typeof D == 'function' ? D(u.options) : D;
          y(),
            (u.options = Object.assign({}, o, u.options, z)),
            (u.scrollParents = {
              reference: st(a) ? gn(a) : a.contextElement ? gn(a.contextElement) : [],
              popper: gn(c),
            });
          var R = jd(Vd([].concat(i, u.options.modifiers)));
          return (
            (u.orderedModifiers = R.filter(function (T) {
              return T.enabled;
            })),
            _(),
            f.update()
          );
        },
        forceUpdate: function () {
          if (!g) {
            var D = u.elements,
              z = D.reference,
              R = D.popper;
            if (t0(z, R)) {
              (u.rects = {
                reference: Ld(z, yt(R), u.options.strategy === 'fixed'),
                popper: Xn(R),
              }),
                (u.reset = !1),
                (u.placement = u.options.placement),
                u.orderedModifiers.forEach(function (le) {
                  return (u.modifiersData[le.name] = Object.assign({}, le.data));
                });
              for (var T = 0; T < u.orderedModifiers.length; T++) {
                if (u.reset === !0) {
                  (u.reset = !1), (T = -1);
                  continue;
                }
                var G = u.orderedModifiers[T],
                  L = G.fn,
                  Q = G.options,
                  ce = Q === void 0 ? {} : Q,
                  ue = G.name;
                typeof L == 'function' &&
                  (u = L({ state: u, options: ce, name: ue, instance: f }) || u);
              }
            }
          }
        },
        update: Bd(function () {
          return new Promise(function (b) {
            f.forceUpdate(), b(u);
          });
        }),
        destroy: function () {
          y(), (g = !0);
        },
      };
    if (!t0(a, c)) return f;
    f.setOptions(l).then(function (b) {
      !g && l.onFirstUpdate && l.onFirstUpdate(b);
    });
    function _() {
      u.orderedModifiers.forEach(function (b) {
        var D = b.name,
          z = b.options,
          R = z === void 0 ? {} : z,
          T = b.effect;
        if (typeof T == 'function') {
          var G = T({ state: u, name: D, instance: f, options: R }),
            L = function () {};
          d.push(G || L);
        }
      });
    }
    function y() {
      d.forEach(function (b) {
        return b();
      }),
        (d = []);
    }
    return f;
  };
}
var NS = [Jm, Xm, Ym, Wm],
  $d = n0({ defaultModifiers: NS });
var a0 = { animation: !0, transitionTimerDelayMs: 5 },
  c0 = (() => {
    class e {
      constructor() {
        this.animation = a0.animation;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })(),
  OS = (() => {
    class e {
      constructor() {
        (this._ngbConfig = v(c0)), (this.closeOthers = !1), (this.destroyOnHide = !0);
      }
      get animation() {
        return this._animation ?? this._ngbConfig.animation;
      }
      set animation(t) {
        this._animation = t;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })();
function AS(e) {
  let { transitionDelay: n, transitionDuration: t } = window.getComputedStyle(e),
    i = parseFloat(n),
    r = parseFloat(t);
  return (i + r) * 1e3;
}
function RS(e) {
  return typeof e == 'string';
}
function PS(e, n) {
  return !n || typeof e.closest > 'u' ? null : e.closest(n);
}
function kS(e) {
  return (e || document.body).getBoundingClientRect();
}
function FS(e) {
  return (n) =>
    new B((t) => {
      let i = (s) => e.run(() => t.next(s)),
        r = (s) => e.run(() => t.error(s)),
        o = () => e.run(() => t.complete());
      return n.subscribe({ next: i, error: r, complete: o });
    });
}
function l0(e = document) {
  let n = e?.activeElement;
  return n ? (n.shadowRoot ? l0(n.shadowRoot) : n) : null;
}
var LS = () => {},
  { transitionTimerDelayMs: jS } = a0,
  ya = new Map(),
  BS = (e, n, t, i) => {
    let r = i.context || {},
      o = ya.get(n);
    if (o)
      switch (i.runningTransition) {
        case 'continue':
          return Pe;
        case 'stop':
          e.run(() => o.transition$.complete()), (r = Object.assign(o.context, r)), ya.delete(n);
      }
    let s = t(n, i.animation, r) || LS;
    if (!i.animation || window.getComputedStyle(n).transitionProperty === 'none')
      return e.run(() => s()), x(void 0).pipe(FS(e));
    let a = new fe(),
      c = new fe(),
      l = a.pipe(wc(!0));
    ya.set(n, {
      transition$: a,
      complete: () => {
        c.next(), c.complete();
      },
      context: r,
    });
    let u = AS(n);
    return (
      e.runOutsideAngular(() => {
        let d = Dt(n, 'transitionend').pipe(
            Xe(l),
            ke(({ target: f }) => f === n),
          ),
          g = dr(u + jS).pipe(Xe(l));
        jo(g, d, c)
          .pipe(Xe(l))
          .subscribe(() => {
            ya.delete(n),
              e.run(() => {
                s(), a.next(), a.complete();
              });
          });
      }),
      a.asObservable()
    );
  };
function VS(e, n) {
  if (typeof navigator > 'u') return '0px';
  let { classList: t } = e,
    i = t.contains('show');
  i || t.add('show'), (e.style[n] = '');
  let r = e.getBoundingClientRect()[n] + 'px';
  return i || t.remove('show'), r;
}
var $S = (e, n, t) => {
    let { direction: i, maxSize: r, dimension: o } = t,
      { classList: s } = e;
    function a() {
      s.add('collapse'), i === 'show' ? s.add('show') : s.remove('show');
    }
    if (!n) {
      a();
      return;
    }
    return (
      r ||
        ((r = VS(e, o)),
        (t.maxSize = r),
        (e.style[o] = i !== 'show' ? r : '0px'),
        s.remove('collapse', 'collapsing', 'show'),
        kS(e),
        s.add('collapsing')),
      (e.style[o] = i === 'show' ? r : '0px'),
      () => {
        a(), s.remove('collapsing'), (e.style[o] = '');
      }
    );
  },
  HS = (() => {
    class e {
      constructor() {
        (this._ngbConfig = v(c0)), (this.horizontal = !1);
      }
      get animation() {
        return this._animation ?? this._ngbConfig.animation;
      }
      set animation(t) {
        this._animation = t;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })(),
  i0 = (() => {
    class e {
      constructor() {
        (this._config = v(HS)),
          (this._element = v(Be)),
          (this._zone = v(ie)),
          (this.animation = this._config.animation),
          (this._afterInit = !1),
          (this._isCollapsed = !1),
          (this.ngbCollapseChange = new Z()),
          (this.horizontal = this._config.horizontal),
          (this.shown = new Z()),
          (this.hidden = new Z());
      }
      set collapsed(t) {
        this._isCollapsed !== t &&
          ((this._isCollapsed = t),
          this._afterInit && this._runTransitionWithEvents(t, this.animation));
      }
      ngOnInit() {
        this._runTransition(this._isCollapsed, !1), (this._afterInit = !0);
      }
      toggle(t = this._isCollapsed) {
        (this.collapsed = !t), this.ngbCollapseChange.next(this._isCollapsed);
      }
      _runTransition(t, i) {
        return BS(this._zone, this._element.nativeElement, $S, {
          animation: i,
          runningTransition: 'stop',
          context: {
            direction: t ? 'hide' : 'show',
            dimension: this.horizontal ? 'width' : 'height',
          },
        });
      }
      _runTransitionWithEvents(t, i) {
        this._runTransition(t, i).subscribe(() => {
          t ? this.hidden.emit() : this.shown.emit();
        });
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngbCollapse', '']],
          hostVars: 2,
          hostBindings: function (i, r) {
            i & 2 && Nt('collapse-horizontal', r.horizontal);
          },
          inputs: {
            animation: 'animation',
            collapsed: [0, 'ngbCollapse', 'collapsed'],
            horizontal: 'horizontal',
          },
          outputs: {
            ngbCollapseChange: 'ngbCollapseChange',
            shown: 'shown',
            hidden: 'hidden',
          },
          exportAs: ['ngbCollapse'],
          standalone: !0,
        });
      }
    }
    return e;
  })(),
  US = 0,
  u0 = (() => {
    class e {
      constructor() {
        (this._vcr = v(mt)),
          (this._element = v(Be).nativeElement),
          (this._item = v(vn)),
          (this._viewRef = null);
      }
      ngAfterContentChecked() {
        this._bodyTpl &&
          (this._item._shouldBeInDOM ? this._createViewIfNotExists() : this._destroyViewIfExists());
      }
      ngOnDestroy() {
        this._destroyViewIfExists();
      }
      _destroyViewIfExists() {
        this._viewRef?.destroy(), (this._viewRef = null);
      }
      _createViewIfNotExists() {
        if (!this._viewRef) {
          (this._viewRef = this._vcr.createEmbeddedView(this._bodyTpl)),
            this._viewRef.detectChanges();
          for (let t of this._viewRef.rootNodes) this._element.appendChild(t);
        }
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngbAccordionBody', '']],
          contentQueries: function (i, r, o) {
            if ((i & 1 && dn(o, $t, 7), i & 2)) {
              let s;
              Ot((s = At())) && (r._bodyTpl = s.first);
            }
          },
          hostAttrs: [1, 'accordion-body'],
          standalone: !0,
        });
      }
    }
    return e;
  })(),
  Ud = (() => {
    class e {
      constructor() {
        (this.item = v(vn)), (this.ngbCollapse = v(i0));
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngbAccordionCollapse', '']],
          hostAttrs: ['role', 'region', 1, 'accordion-collapse'],
          hostVars: 2,
          hostBindings: function (i, r) {
            i & 2 && (un('id', r.item.collapseId), Gn('aria-labelledby', r.item.toggleId));
          },
          exportAs: ['ngbAccordionCollapse'],
          standalone: !0,
          features: [yu([i0])],
        });
      }
    }
    return e;
  })(),
  GS = (() => {
    class e {
      constructor() {
        (this.item = v(vn)), (this.accordion = v(Da));
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngbAccordionToggle', '']],
          hostVars: 5,
          hostBindings: function (i, r) {
            i & 1 &&
              Ze('click', function () {
                return !r.item.disabled && r.accordion.toggle(r.item.id);
              }),
              i & 2 &&
                (un('id', r.item.toggleId),
                Gn('aria-controls', r.item.collapseId)('aria-expanded', !r.item.collapsed),
                Nt('collapsed', r.item.collapsed));
          },
          standalone: !0,
        });
      }
    }
    return e;
  })(),
  d0 = (() => {
    class e {
      constructor() {
        this.item = v(vn);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['button', 'ngbAccordionButton', '']],
          hostAttrs: ['type', 'button', 1, 'accordion-button'],
          hostVars: 1,
          hostBindings: function (i, r) {
            i & 2 && un('disabled', r.item.disabled);
          },
          standalone: !0,
          features: [yu([GS])],
        });
      }
    }
    return e;
  })(),
  f0 = (() => {
    class e {
      constructor() {
        this.item = v(vn);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngbAccordionHeader', '']],
          hostAttrs: ['role', 'heading', 1, 'accordion-header'],
          hostVars: 2,
          hostBindings: function (i, r) {
            i & 2 && Nt('collapsed', r.item.collapsed);
          },
          standalone: !0,
        });
      }
    }
    return e;
  })(),
  vn = (() => {
    class e {
      constructor() {
        (this._accordion = v(Da)),
          (this._cd = v(Gt)),
          (this._destroyRef = v(Hn)),
          (this._collapsed = !0),
          (this._id = `ngb-accordion-item-${US++}`),
          (this._collapseAnimationRunning = !1),
          (this.disabled = !1),
          (this.show = new Z()),
          (this.shown = new Z()),
          (this.hide = new Z()),
          (this.hidden = new Z());
      }
      set id(t) {
        RS(t) && t !== '' && (this._id = t);
      }
      set destroyOnHide(t) {
        this._destroyOnHide = t;
      }
      get destroyOnHide() {
        return this._destroyOnHide === void 0 ? this._accordion.destroyOnHide : this._destroyOnHide;
      }
      set collapsed(t) {
        t ? this.collapse() : this.expand();
      }
      get collapsed() {
        return this._collapsed;
      }
      get id() {
        return `${this._id}`;
      }
      get toggleId() {
        return `${this.id}-toggle`;
      }
      get collapseId() {
        return `${this.id}-collapse`;
      }
      get _shouldBeInDOM() {
        return !this.collapsed || this._collapseAnimationRunning || !this.destroyOnHide;
      }
      ngAfterContentInit() {
        let { ngbCollapse: t } = this._collapse;
        (t.animation = !1),
          (t.collapsed = this.collapsed),
          (t.animation = this._accordion.animation),
          t.hidden.pipe(fa(this._destroyRef)).subscribe(() => {
            (this._collapseAnimationRunning = !1),
              this.hidden.emit(),
              this._accordion.hidden.emit(this.id);
          }),
          t.shown.pipe(fa(this._destroyRef)).subscribe(() => {
            this.shown.emit(), this._accordion.shown.emit(this.id);
          });
      }
      toggle() {
        this.collapsed = !this.collapsed;
      }
      expand() {
        if (this.collapsed) {
          if (!this._accordion._ensureCanExpand(this)) return;
          (this._collapsed = !1),
            this._cd.markForCheck(),
            this._cd.detectChanges(),
            this.show.emit(),
            this._accordion.show.emit(this.id),
            (this._collapse.ngbCollapse.animation = this._accordion.animation),
            (this._collapse.ngbCollapse.collapsed = !1);
        }
      }
      collapse() {
        this.collapsed ||
          ((this._collapsed = !0),
          (this._collapseAnimationRunning = !0),
          this._cd.markForCheck(),
          this.hide.emit(),
          this._accordion.hide.emit(this.id),
          (this._collapse.ngbCollapse.animation = this._accordion.animation),
          (this._collapse.ngbCollapse.collapsed = !0));
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngbAccordionItem', '']],
          contentQueries: function (i, r, o) {
            if ((i & 1 && dn(o, Ud, 7), i & 2)) {
              let s;
              Ot((s = At())) && (r._collapse = s.first);
            }
          },
          hostAttrs: [1, 'accordion-item'],
          hostVars: 1,
          hostBindings: function (i, r) {
            i & 2 && un('id', r.id);
          },
          inputs: {
            id: [0, 'ngbAccordionItem', 'id'],
            destroyOnHide: 'destroyOnHide',
            disabled: 'disabled',
            collapsed: 'collapsed',
          },
          outputs: {
            show: 'show',
            shown: 'shown',
            hide: 'hide',
            hidden: 'hidden',
          },
          exportAs: ['ngbAccordionItem'],
          standalone: !0,
        });
      }
    }
    return e;
  })(),
  Da = (() => {
    class e {
      constructor() {
        (this._config = v(OS)),
          (this._anItemWasAlreadyExpandedDuringInitialisation = !1),
          (this.animation = this._config.animation),
          (this.closeOthers = this._config.closeOthers),
          (this.destroyOnHide = this._config.destroyOnHide),
          (this.show = new Z()),
          (this.shown = new Z()),
          (this.hide = new Z()),
          (this.hidden = new Z());
      }
      toggle(t) {
        this._getItem(t)?.toggle();
      }
      expand(t) {
        this._getItem(t)?.expand();
      }
      expandAll() {
        this._items &&
          (this.closeOthers
            ? this._items.find((t) => !t.collapsed) || this._items.first.expand()
            : this._items.forEach((t) => t.expand()));
      }
      collapse(t) {
        this._getItem(t)?.collapse();
      }
      collapseAll() {
        this._items?.forEach((t) => t.collapse());
      }
      isExpanded(t) {
        let i = this._getItem(t);
        return i ? !i.collapsed : !1;
      }
      _ensureCanExpand(t) {
        return this.closeOthers
          ? this._items
            ? (this._items.find((i) => !i.collapsed && t !== i)?.collapse(), !0)
            : this._anItemWasAlreadyExpandedDuringInitialisation
              ? !1
              : ((this._anItemWasAlreadyExpandedDuringInitialisation = !0), !0)
          : !0;
      }
      _getItem(t) {
        return this._items?.find((i) => i.id === t);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngbAccordion', '']],
          contentQueries: function (i, r, o) {
            if ((i & 1 && dn(o, vn, 4), i & 2)) {
              let s;
              Ot((s = At())) && (r._items = s);
            }
          },
          hostAttrs: [1, 'accordion'],
          inputs: {
            animation: 'animation',
            closeOthers: 'closeOthers',
            destroyOnHide: 'destroyOnHide',
          },
          outputs: {
            show: 'show',
            shown: 'shown',
            hide: 'hide',
            hidden: 'hidden',
          },
          exportAs: ['ngbAccordion'],
          standalone: !0,
        });
      }
    }
    return e;
  })();
var p0 = (() => {
  class e {
    static {
      this.ɵfac = function (i) {
        return new (i || e)();
      };
    }
    static {
      this.ɵmod = Bn({ type: e });
    }
    static {
      this.ɵinj = jn({});
    }
  }
  return e;
})();
var ba = (e, n) => (n ? n.some((t) => t.contains(e)) : !1),
  r0 = (e, n) => !n || PS(e, n) != null,
  zS = (() => {
    let e = () =>
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (/Macintosh/.test(navigator.userAgent) &&
          navigator.maxTouchPoints &&
          navigator.maxTouchPoints > 2),
      n = () => /Android/.test(navigator.userAgent);
    return typeof navigator < 'u' ? !!navigator.userAgent && (e() || n()) : !1;
  })(),
  WS = (e) => (zS ? () => setTimeout(() => e(), 100) : e);
function qS(e, n, t, i, r, o, s, a) {
  t &&
    e.runOutsideAngular(
      WS(() => {
        let c = (g) => {
            let f = g.target;
            return g.button === 2 || ba(f, s)
              ? !1
              : t === 'inside'
                ? ba(f, o) && r0(f, a)
                : t === 'outside'
                  ? !ba(f, o)
                  : r0(f, a) || !ba(f, o);
          },
          l = Dt(n, 'keydown').pipe(
            Xe(r),
            ke((g) => g.key === 'Escape'),
            he((g) => g.preventDefault()),
          ),
          u = Dt(n, 'mousedown').pipe(V(c), Xe(r)),
          d = Dt(n, 'mouseup').pipe(
            Ec(u),
            ke(([g, f]) => f),
            Dc(0),
            Xe(r),
          );
        jo([l.pipe(V((g) => 0)), d.pipe(V((g) => 1))]).subscribe((g) => e.run(() => i(g)));
      }),
    );
}
var QS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');
var ZS = (() => {
    class e {
      constructor() {
        this._element = v(Oe).documentElement;
      }
      isRTL() {
        return (this._element.getAttribute('dir') || '').toLowerCase() === 'rtl';
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })(),
  YS = /\s+/,
  JS = /  +/gi,
  KS = {
    top: ['top'],
    bottom: ['bottom'],
    start: ['left', 'right'],
    left: ['left'],
    end: ['right', 'left'],
    right: ['right'],
    'top-start': ['top-start', 'top-end'],
    'top-left': ['top-start'],
    'top-end': ['top-end', 'top-start'],
    'top-right': ['top-end'],
    'bottom-start': ['bottom-start', 'bottom-end'],
    'bottom-left': ['bottom-start'],
    'bottom-end': ['bottom-end', 'bottom-start'],
    'bottom-right': ['bottom-end'],
    'start-top': ['left-start', 'right-start'],
    'left-top': ['left-start'],
    'start-bottom': ['left-end', 'right-end'],
    'left-bottom': ['left-end'],
    'end-top': ['right-start', 'left-start'],
    'right-top': ['right-start'],
    'end-bottom': ['right-end', 'left-end'],
    'right-bottom': ['right-end'],
  };
function XS(e, n) {
  let [t, i] = KS[e];
  return (n && i) || t;
}
var eE = /^left/,
  tE = /^right/,
  nE = /^start/,
  iE = /^end/;
function rE(e, n) {
  let [t, i] = n.split('-'),
    r = t.replace(eE, 'start').replace(tE, 'end'),
    o = [r];
  if (i) {
    let s = i;
    (t === 'left' || t === 'right') && (s = s.replace(nE, 'top').replace(iE, 'bottom')),
      o.push(`${r}-${s}`);
  }
  return e && (o = o.map((s) => `${e}-${s}`)), o.join(' ');
}
function o0({ placement: e, baseClass: n }, t) {
  let i = Array.isArray(e) ? e : e.split(YS),
    r = [
      'top',
      'bottom',
      'start',
      'end',
      'top-start',
      'top-end',
      'bottom-start',
      'bottom-end',
      'start-top',
      'start-bottom',
      'end-top',
      'end-bottom',
    ],
    o = i.findIndex((l) => l === 'auto');
  o >= 0 &&
    r.forEach(function (l) {
      i.find((u) => u.search('^' + l) !== -1) == null && i.splice(o++, 1, l);
    });
  let s = i.map((l) => XS(l, t.isRTL()));
  return {
    placement: s.shift(),
    modifiers: [
      {
        name: 'bootstrapClasses',
        enabled: !!n,
        phase: 'write',
        fn({ state: l }) {
          let u = new RegExp(n + '(-[a-z]+)*', 'gi'),
            d = l.elements.popper,
            g = l.placement,
            f = d.className;
          (f = f.replace(u, '')),
            (f += ` ${rE(n, g)}`),
            (f = f.trim().replace(JS, ' ')),
            (d.className = f);
        },
      },
      Od,
      Pd,
      Id,
      { enabled: !0, name: 'flip', options: { fallbackPlacements: s } },
      {
        enabled: !0,
        name: 'preventOverflow',
        phase: 'main',
        fn: function () {},
      },
    ],
  };
}
function s0(e) {
  return e;
}
function oE() {
  let e = v(ZS),
    n = null;
  return {
    createPopper(t) {
      if (!n) {
        let r = (t.updatePopperOptions || s0)(o0(t, e));
        n = $d(t.hostElement, t.targetElement, r);
      }
    },
    update() {
      n && n.update();
    },
    setOptions(t) {
      if (n) {
        let r = (t.updatePopperOptions || s0)(o0(t, e));
        n.setOptions(r);
      }
    },
    destroy() {
      n && (n.destroy(), (n = null));
    },
  };
}
function sE(e) {
  return (n) => (n.modifiers.push(Ad, { name: 'offset', options: { offset: () => e } }), n);
}
var zL = new Date(1882, 10, 12),
  WL = new Date(2174, 10, 25);
var qL = 1e3 * 60 * 60 * 24;
var Gd = 1080,
  aE = 24 * Gd,
  cE = 12 * Gd + 793,
  QL = 29 * aE + cE,
  ZL = 11 * Gd + 204;
var lE = (() => {
    class e {
      constructor() {
        (this.autoClose = !0),
          (this.placement = ['bottom-start', 'bottom-end', 'top-start', 'top-end']),
          (this.popperOptions = (t) => t),
          (this.container = null);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
      }
    }
    return e;
  })(),
  wa = (() => {
    class e {
      constructor() {
        (this._disabled = !1), (this.nativeElement = v(Be).nativeElement), (this.tabindex = 0);
      }
      set disabled(t) {
        this._disabled = t === '' || t === !0;
      }
      get disabled() {
        return this._disabled;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngbDropdownItem', '']],
          hostAttrs: [1, 'dropdown-item'],
          hostVars: 3,
          hostBindings: function (i, r) {
            i & 2 && (un('tabIndex', r.disabled ? -1 : r.tabindex), Nt('disabled', r.disabled));
          },
          inputs: { tabindex: 'tabindex', disabled: 'disabled' },
          standalone: !0,
        });
      }
    }
    return e;
  })(),
  h0 = (() => {
    class e {
      constructor() {
        this.item = v(wa);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['button', 'ngbDropdownItem', '']],
          hostVars: 1,
          hostBindings: function (i, r) {
            i & 2 && un('disabled', r.item.disabled);
          },
          standalone: !0,
        });
      }
    }
    return e;
  })(),
  zd = (() => {
    class e {
      constructor() {
        (this.dropdown = v(Ca)), (this.nativeElement = v(Be).nativeElement);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngbDropdownMenu', '']],
          contentQueries: function (i, r, o) {
            if ((i & 1 && dn(o, wa, 4), i & 2)) {
              let s;
              Ot((s = At())) && (r.menuItems = s);
            }
          },
          hostAttrs: [1, 'dropdown-menu'],
          hostVars: 2,
          hostBindings: function (i, r) {
            i & 1 &&
              Ze('keydown.ArrowUp', function (s) {
                return r.dropdown.onKeyDown(s);
              })('keydown.ArrowDown', function (s) {
                return r.dropdown.onKeyDown(s);
              })('keydown.Home', function (s) {
                return r.dropdown.onKeyDown(s);
              })('keydown.End', function (s) {
                return r.dropdown.onKeyDown(s);
              })('keydown.Enter', function (s) {
                return r.dropdown.onKeyDown(s);
              })('keydown.Space', function (s) {
                return r.dropdown.onKeyDown(s);
              })('keydown.Tab', function (s) {
                return r.dropdown.onKeyDown(s);
              })('keydown.Shift.Tab', function (s) {
                return r.dropdown.onKeyDown(s);
              }),
              i & 2 && Nt('show', r.dropdown.isOpen());
          },
          standalone: !0,
        });
      }
    }
    return e;
  })(),
  Hd = (() => {
    class e {
      constructor() {
        (this.dropdown = v(Ca)), (this.nativeElement = v(Be).nativeElement);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngbDropdownAnchor', '']],
          hostAttrs: [1, 'dropdown-toggle'],
          hostVars: 3,
          hostBindings: function (i, r) {
            i & 2 && (Gn('aria-expanded', r.dropdown.isOpen()), Nt('show', r.dropdown.isOpen()));
          },
          standalone: !0,
        });
      }
    }
    return e;
  })(),
  g0 = (() => {
    class e extends Hd {
      static {
        this.ɵfac = (() => {
          let t;
          return function (r) {
            return (t || (t = Er(e)))(r || e);
          };
        })();
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngbDropdownToggle', '']],
          hostAttrs: [1, 'dropdown-toggle'],
          hostVars: 3,
          hostBindings: function (i, r) {
            i & 1 &&
              Ze('click', function () {
                return r.dropdown.toggle();
              })('keydown.ArrowUp', function (s) {
                return r.dropdown.onKeyDown(s);
              })('keydown.ArrowDown', function (s) {
                return r.dropdown.onKeyDown(s);
              })('keydown.Home', function (s) {
                return r.dropdown.onKeyDown(s);
              })('keydown.End', function (s) {
                return r.dropdown.onKeyDown(s);
              })('keydown.Tab', function (s) {
                return r.dropdown.onKeyDown(s);
              })('keydown.Shift.Tab', function (s) {
                return r.dropdown.onKeyDown(s);
              }),
              i & 2 && (Gn('aria-expanded', r.dropdown.isOpen()), Nt('show', r.dropdown.isOpen()));
          },
          standalone: !0,
          features: [Eg([{ provide: Hd, useExisting: bs(() => e) }]), _u],
        });
      }
    }
    return e;
  })(),
  Ca = (() => {
    class e {
      constructor() {
        (this._changeDetector = v(Gt)),
          (this._config = v(lE)),
          (this._document = v(Oe)),
          (this._injector = v(qe)),
          (this._ngZone = v(ie)),
          (this._nativeElement = v(Be).nativeElement),
          (this._destroyCloseHandlers$ = new fe()),
          (this._bodyContainer = null),
          (this._positioning = oE()),
          (this.autoClose = this._config.autoClose),
          (this._open = !1),
          (this.placement = this._config.placement),
          (this.popperOptions = this._config.popperOptions),
          (this.container = this._config.container),
          (this.openChange = new Z());
      }
      ngOnInit() {
        this.display ||
          (this.display = this._nativeElement.closest('.navbar') ? 'static' : 'dynamic');
      }
      ngAfterContentInit() {
        Vs(
          () => {
            this._applyPlacementClasses(), this._open && this._setCloseHandlers();
          },
          { phase: ye.Write, injector: this._injector },
        );
      }
      ngOnChanges(t) {
        if (
          (t.container && this._open && this._applyContainer(this.container),
          t.placement &&
            !t.placement.firstChange &&
            (this._positioning.setOptions({
              hostElement: this._anchor.nativeElement,
              targetElement: this._bodyContainer || this._menu.nativeElement,
              placement: this.placement,
            }),
            this._applyPlacementClasses()),
          t.dropdownClass)
        ) {
          let { currentValue: i, previousValue: r } = t.dropdownClass;
          this._applyCustomDropdownClass(i, r);
        }
        t.autoClose &&
          this._open &&
          ((this.autoClose = t.autoClose.currentValue), this._setCloseHandlers());
      }
      isOpen() {
        return this._open;
      }
      open() {
        this._open ||
          ((this._open = !0),
          this._applyContainer(this.container),
          this.openChange.emit(!0),
          this._setCloseHandlers(),
          this._anchor &&
            (this._anchor.nativeElement.focus(),
            this.display === 'dynamic' &&
              this._ngZone.runOutsideAngular(() => {
                this._positioning.createPopper({
                  hostElement: this._anchor.nativeElement,
                  targetElement: this._bodyContainer || this._menu.nativeElement,
                  placement: this.placement,
                  updatePopperOptions: (t) => this.popperOptions(sE([0, 2])(t)),
                }),
                  this._applyPlacementClasses(),
                  (this._afterRenderRef = gu(
                    () => {
                      this._positionMenu();
                    },
                    { phase: ye.Write, injector: this._injector },
                  ));
              })));
      }
      _setCloseHandlers() {
        this._destroyCloseHandlers$.next(),
          qS(
            this._ngZone,
            this._document,
            this.autoClose,
            (t) => {
              this.close(), t === 0 && this._anchor.nativeElement.focus();
            },
            this._destroyCloseHandlers$,
            this._menu ? [this._menu.nativeElement] : [],
            this._anchor ? [this._anchor.nativeElement] : [],
            '.dropdown-item,.dropdown-divider',
          );
      }
      close() {
        this._open &&
          ((this._open = !1),
          this._resetContainer(),
          this._positioning.destroy(),
          this._afterRenderRef?.destroy(),
          this._destroyCloseHandlers$.next(),
          this.openChange.emit(!1),
          this._changeDetector.markForCheck());
      }
      toggle() {
        this.isOpen() ? this.close() : this.open();
      }
      ngOnDestroy() {
        this.close();
      }
      onKeyDown(t) {
        let { key: i } = t,
          r = this._getMenuElements(),
          o = -1,
          s = null,
          a = this._isEventFromToggle(t);
        if (
          (!a &&
            r.length &&
            r.forEach((c, l) => {
              c.contains(t.target) && (s = c), c === l0(this._document) && (o = l);
            }),
          i === ' ' || i === 'Enter')
        ) {
          s &&
            (this.autoClose === !0 || this.autoClose === 'inside') &&
            Dt(s, 'click')
              .pipe(Fe(1))
              .subscribe(() => this.close());
          return;
        }
        if (i === 'Tab') {
          if (t.target && this.isOpen() && this.autoClose)
            if (this._anchor.nativeElement === t.target) {
              this.container === 'body' && !t.shiftKey
                ? (this._menu.nativeElement.setAttribute('tabindex', '0'),
                  this._menu.nativeElement.focus(),
                  this._menu.nativeElement.removeAttribute('tabindex'))
                : t.shiftKey && this.close();
              return;
            } else if (this.container === 'body') {
              let c = this._menu.nativeElement.querySelectorAll(QS);
              t.shiftKey && t.target === c[0]
                ? (this._anchor.nativeElement.focus(), t.preventDefault())
                : !t.shiftKey &&
                  t.target === c[c.length - 1] &&
                  (this._anchor.nativeElement.focus(), this.close());
            } else
              Dt(t.target, 'focusout')
                .pipe(Fe(1))
                .subscribe(({ relatedTarget: c }) => {
                  this._nativeElement.contains(c) || this.close();
                });
          return;
        }
        if (a || s) {
          if ((this.open(), r.length)) {
            switch (i) {
              case 'ArrowDown':
                o = Math.min(o + 1, r.length - 1);
                break;
              case 'ArrowUp':
                if (this._isDropup() && o === -1) {
                  o = r.length - 1;
                  break;
                }
                o = Math.max(o - 1, 0);
                break;
              case 'Home':
                o = 0;
                break;
              case 'End':
                o = r.length - 1;
                break;
            }
            r[o].focus();
          }
          t.preventDefault();
        }
      }
      _isDropup() {
        return this._nativeElement.classList.contains('dropup');
      }
      _isEventFromToggle(t) {
        return this._anchor.nativeElement.contains(t.target);
      }
      _getMenuElements() {
        return this._menu
          ? this._menu.menuItems.filter(({ disabled: t }) => !t).map(({ nativeElement: t }) => t)
          : [];
      }
      _positionMenu() {
        let t = this._menu;
        this.isOpen() &&
          t &&
          (this.display === 'dynamic'
            ? (this._positioning.update(), this._applyPlacementClasses())
            : this._applyPlacementClasses(this._getFirstPlacement(this.placement)));
      }
      _getFirstPlacement(t) {
        return Array.isArray(t) ? t[0] : t.split(' ')[0];
      }
      _resetContainer() {
        this._menu && this._nativeElement.appendChild(this._menu.nativeElement),
          this._bodyContainer &&
            (this._document.body.removeChild(this._bodyContainer), (this._bodyContainer = null));
      }
      _applyContainer(t = null) {
        if ((this._resetContainer(), t === 'body')) {
          let i = this._menu.nativeElement,
            r = (this._bodyContainer = this._bodyContainer || this._document.createElement('div'));
          (r.style.position = 'absolute'),
            (i.style.position = 'static'),
            (r.style.zIndex = '1055'),
            r.appendChild(i),
            this._document.body.appendChild(r);
        }
        this._applyCustomDropdownClass(this.dropdownClass);
      }
      _applyCustomDropdownClass(t, i) {
        let r = this.container === 'body' ? this._bodyContainer : this._nativeElement;
        r && (i && r.classList.remove(i), t && r.classList.add(t));
      }
      _applyPlacementClasses(t) {
        if (this._menu) {
          t || (t = this._getFirstPlacement(this.placement)),
            this._nativeElement.classList.remove('dropup', 'dropdown'),
            this.display === 'static'
              ? this._menu.nativeElement.setAttribute('data-bs-popper', 'static')
              : this._menu.nativeElement.removeAttribute('data-bs-popper');
          let i = t.search('^top') !== -1 ? 'dropup' : 'dropdown';
          this._nativeElement.classList.add(i),
            this._bodyContainer &&
              (this._bodyContainer.classList.remove('dropup', 'dropdown'),
              this._bodyContainer.classList.add(i));
        }
      }
      static {
        this.ɵfac = function (i) {
          return new (i || e)();
        };
      }
      static {
        this.ɵdir = ae({
          type: e,
          selectors: [['', 'ngbDropdown', '']],
          contentQueries: function (i, r, o) {
            if ((i & 1 && (dn(o, zd, 5), dn(o, Hd, 5)), i & 2)) {
              let s;
              Ot((s = At())) && (r._menu = s.first), Ot((s = At())) && (r._anchor = s.first);
            }
          },
          hostVars: 2,
          hostBindings: function (i, r) {
            i & 2 && Nt('show', r.isOpen());
          },
          inputs: {
            autoClose: 'autoClose',
            dropdownClass: 'dropdownClass',
            _open: [0, 'open', '_open'],
            placement: 'placement',
            popperOptions: 'popperOptions',
            container: 'container',
            display: 'display',
          },
          outputs: { openChange: 'openChange' },
          exportAs: ['ngbDropdown'],
          standalone: !0,
          features: [Vn],
        });
      }
    }
    return e;
  })();
var m0 = (() => {
  class e {
    static {
      this.ɵfac = function (i) {
        return new (i || e)();
      };
    }
    static {
      this.ɵmod = Bn({ type: e });
    }
    static {
      this.ɵinj = jn({});
    }
  }
  return e;
})();
var YL = new A('live announcer delay', {
  providedIn: 'root',
  factory: () => 100,
});
function uE(e, n) {
  e & 1 &&
    (p(0, 'p'),
    m(
      1,
      'IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation.',
    ),
    h());
}
function dE(e, n) {
  e & 1 &&
    (p(0, 'p'),
    m(
      1,
      'IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation.',
    ),
    h());
}
function fE(e, n) {
  e & 1 &&
    (p(0, 'p'),
    m(
      1,
      'IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation.',
    ),
    h());
}
function pE(e, n) {
  e & 1 &&
    (p(0, 'p'),
    m(
      1,
      'IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation.',
    ),
    h());
}
function hE(e, n) {
  e & 1 &&
    (p(0, 'p'),
    m(
      1,
      'IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation.',
    ),
    h());
}
var Sa = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-freq-asked-que']],
    standalone: !0,
    features: [M],
    decls: 48,
    vars: 0,
    consts: [
      ['accordion', 'ngbAccordion'],
      [1, 'frequently-asked-que'],
      [1, 'container'],
      [
        1,
        'heading-border',
        'position-relative',
        'heading-xs',
        'semibold',
        'center-border',
        'text-center',
        'mb-4',
      ],
      [1, 'desc-sm', 'mb-4', 'text-center'],
      ['ngbAccordion', ''],
      ['ngbAccordionItem', 'first'],
      ['ngbAccordionHeader', ''],
      ['ngbAccordionButton', ''],
      [1, ''],
      ['ngbAccordionCollapse', ''],
      ['ngbAccordionBody', ''],
      ['ngbAccordionItem', 'second'],
      ['ngbAccordionItem', 'third'],
      ['ngbAccordionItem', 'fourth'],
      ['ngbAccordionItem', 'five'],
    ],
    template: function (t, i) {
      t & 1 &&
        (p(0, 'div', 1)(1, 'div', 2)(2, 'h1', 3),
        m(3, 'Frequently Asked Questions'),
        h(),
        p(4, 'p', 4),
        m(
          5,
          'Click the icon beside each question to see the answers to our most frequently asked questions.',
        ),
        h(),
        p(6, 'div', 5, 0)(8, 'div', 6)(9, 'div', 7)(10, 'button', 8)(11, 'div', 9),
        m(12, 'What is IT consulting?'),
        h()()(),
        p(13, 'div', 10)(14, 'div', 11),
        Ne(15, uE, 2, 0, 'ng-template'),
        h()()(),
        p(16, 'div', 12)(17, 'div', 7)(18, 'button', 8)(19, 'div', 9),
        m(20, 'How can IT consulting benefit my business?'),
        h()()(),
        p(21, 'div', 10)(22, 'div', 11),
        Ne(23, dE, 2, 0, 'ng-template'),
        h()()(),
        p(24, 'div', 13)(25, 'div', 7)(26, 'button', 8)(27, 'div', 9),
        m(28, 'How do I choose the right IT consulting firm?'),
        h()()(),
        p(29, 'div', 10)(30, 'div', 11),
        Ne(31, fE, 2, 0, 'ng-template'),
        h()()(),
        p(32, 'div', 14)(33, 'div', 7)(34, 'button', 8)(35, 'div', 9),
        m(36, 'What skills are in demand in the IT industry?'),
        h()()(),
        p(37, 'div', 10)(38, 'div', 11),
        Ne(39, pE, 2, 0, 'ng-template'),
        h()()(),
        p(40, 'div', 15)(41, 'div', 7)(42, 'button', 8)(43, 'div', 9),
        m(44, 'How important are certifications in the IT job market?'),
        h()()(),
        p(45, 'div', 10)(46, 'div', 11),
        Ne(47, hE, 2, 0, 'ng-template'),
        h()()()()()());
    },
    dependencies: [Rr, p0, d0, Da, vn, f0, u0, Ud],
    styles: [
      '.frequently-asked-que[_ngcontent-%COMP%]{padding:100px}.accordion-item[_ngcontent-%COMP%]{border-radius:15px;background:#fff;box-shadow:4px 4px 15px #0000001a;border:0;margin-bottom:10px}.accordion-item[_ngcontent-%COMP%]   .accordion-button[_ngcontent-%COMP%]{border:0;display:flex;align-items:center;gap:10px;color:#333;font-size:16px;font-style:normal;font-weight:600;line-height:32px;background:transparent!important;box-shadow:none!important}.accordion-item[_ngcontent-%COMP%]   .accordion-body[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#2c2c2c;font-size:14px;font-style:normal;font-weight:400;line-height:20px}',
    ],
  });
};
var Ea = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-feedback']],
    standalone: !0,
    features: [M],
    decls: 22,
    vars: 0,
    consts: [
      [1, 'feedback-wrapper'],
      [1, 'container'],
      [
        1,
        'heading-border',
        'position-relative',
        'heading-xs',
        'semibold',
        'center-border',
        'text-center',
        'mb-4',
      ],
      [1, 'desc-sm', 'mb-4', 'text-center'],
      ['id', 'carouselExampleControls', 'data-bs-ride', 'carousel', 1, 'carousel', 'slide'],
      [1, 'carousel-inner'],
      [1, 'carousel-item', 'active'],
      ['src', '...', 'alt', '...', 1, 'd-block', 'w-100'],
      [1, 'carousel-item'],
      [
        'type',
        'button',
        'data-bs-target',
        '#carouselExampleControls',
        'data-bs-slide',
        'prev',
        1,
        'carousel-control-prev',
      ],
      ['aria-hidden', 'true', 1, 'carousel-control-prev-icon'],
      [1, 'visually-hidden'],
      [
        'type',
        'button',
        'data-bs-target',
        '#carouselExampleControls',
        'data-bs-slide',
        'next',
        1,
        'carousel-control-next',
      ],
      ['aria-hidden', 'true', 1, 'carousel-control-next-icon'],
    ],
    template: function (t, i) {
      t & 1 &&
        (p(0, 'div', 0)(1, 'div', 1)(2, 'h1', 2),
        m(3, 'Our Client feedback'),
        h(),
        p(4, 'p', 3),
        m(5, 'Discover what our clients say about their experience with our services'),
        h(),
        p(6, 'div', 4)(7, 'div', 5)(8, 'div', 6),
        O(9, 'img', 7),
        h(),
        p(10, 'div', 8),
        O(11, 'img', 7),
        h(),
        p(12, 'div', 8),
        O(13, 'img', 7),
        h()(),
        p(14, 'button', 9),
        O(15, 'span', 10),
        p(16, 'span', 11),
        m(17, 'Previous'),
        h()(),
        p(18, 'button', 12),
        O(19, 'span', 13),
        p(20, 'span', 11),
        m(21, 'Next'),
        h()()()()());
    },
    styles: ['.feedback-wrapper[_ngcontent-%COMP%]{padding:100px}'],
  });
};
var Ia = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-about-sec']],
    standalone: !0,
    features: [M],
    decls: 10,
    vars: 0,
    consts: [
      [1, 'd-flex', 'align-items-start', 'gap-5', 'about-us-sec', 'container'],
      [1, 'content-block'],
      [1, 'heading-border', 'position-relative', 'heading-xs', 'semibold', 'mb-4'],
      [1, 'desc-sm', 'mb-4'],
      [1, 'promates-btn'],
      [1, 'img-banner'],
      ['src', 'assets/aboutus.png'],
    ],
    template: function (t, i) {
      t & 1 &&
        (p(0, 'div', 0)(1, 'div', 1)(2, 'h1', 2),
        m(3, 'Expert Staffing & IT Services'),
        h(),
        p(4, 'p', 3),
        m(
          5,
          'Welcome to ProMates Tech, your trusted partner for all your staffing and IT services need. We specialize in providing top-notch IT solution and staffing services tailored to meet your business requirements. With our experience, we ensure seamless integrations of technology into your business operations, maximising efficiency and productivity. Let\u2019s embark on a journey of innovation and growth together',
        ),
        h(),
        p(6, 'button', 4),
        m(7, 'Hire Talent'),
        h()(),
        p(8, 'div', 5),
        O(9, 'img', 6),
        h()());
    },
    styles: [
      '.about-us-sec[_ngcontent-%COMP%]{padding:100px 0}.about-us-sec[_ngcontent-%COMP%]   .content-block[_ngcontent-%COMP%], .about-us-sec[_ngcontent-%COMP%]   .img-banner[_ngcontent-%COMP%]{width:50%}',
    ],
  });
};
var Ma = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-build-business-needs']],
    standalone: !0,
    features: [M],
    decls: 46,
    vars: 0,
    consts: [
      [1, 'd-flex', 'flex-column', 'build-business', 'container'],
      [1, 'mb-2', 'text-center', 'd-flex', 'align-items-center', 'justify-content-center'],
      [1, 'heading-border', 'position-relative', 'heading-xs', 'semibold', 'center-border'],
      [1, 'desc-sm', 'text-center'],
      [1, 'card-block', 'd-flex', 'gap-3', 'mt-5'],
      [1, 'card'],
      ['width', '50', 'height', '51', 'viewBox', '0 0 50 51', 'fill', 'none'],
      [
        'd',
        'M12.6252 5.50402L9.92346 8.27321L10.563 12.1906C10.599 12.4104 10.5054 12.6313 10.324 12.7598C10.2235 12.8296 10.106 12.8657 9.98858 12.8657C9.89207 12.8657 9.79497 12.8418 9.70777 12.793L6.39497 10.9627L3.08276 12.793C2.88916 12.9017 2.64904 12.8872 2.46648 12.7593C2.28451 12.6308 2.19148 12.4098 2.22753 12.1901L2.86707 8.27263L0.16532 5.50344C0.0129948 5.34704 -0.0393307 5.11972 0.0304367 4.91274C0.100204 4.70577 0.278693 4.55577 0.493809 4.52263L4.20486 3.95518L5.86939 0.408091C5.96474 0.205765 6.16939 0.0749512 6.39497 0.0749512C6.62055 0.0749512 6.82521 0.205765 6.92114 0.409253L8.58567 3.95635L12.2967 4.52379C12.5118 4.55693 12.6909 4.70693 12.7601 4.91391C12.8293 5.12088 12.7775 5.34763 12.6252 5.50402ZM31.3647 4.91332C31.2956 4.70693 31.1165 4.55635 30.9014 4.52321L27.1903 3.95577L25.5258 0.408672C25.4299 0.205765 25.2252 0.0749512 24.9996 0.0749512C24.774 0.0749512 24.5694 0.205765 24.4735 0.409253L22.8089 3.95635L19.0979 4.52379C18.8828 4.55693 18.7037 4.70693 18.6345 4.91391C18.5653 5.12088 18.6177 5.34821 18.7694 5.5046L21.4711 8.27379L20.8316 12.1912C20.7956 12.411 20.8892 12.6319 21.0706 12.7604C21.2525 12.8883 21.4927 12.9023 21.6868 12.7941L24.9996 10.9627L28.3118 12.793C28.3996 12.8418 28.4967 12.8657 28.5932 12.8657C28.7107 12.8657 28.8281 12.8296 28.9281 12.7593C29.1101 12.6308 29.2031 12.4098 29.1671 12.1901L28.5275 8.27263L31.2293 5.50344C31.3822 5.34763 31.4339 5.1203 31.3647 4.91332ZM49.9694 4.91332C49.9002 4.70693 49.7211 4.55635 49.506 4.52321L45.795 3.95577L44.1304 0.408672C44.0345 0.205765 43.8299 0.0749512 43.6043 0.0749512C43.3787 0.0749512 43.1741 0.205765 43.0781 0.409253L41.4136 3.95635L37.7025 4.52379C37.4874 4.55693 37.3084 4.70693 37.2392 4.91391C37.17 5.12088 37.2223 5.34821 37.3741 5.5046L40.0758 8.27379L39.4363 12.1912C39.4002 12.411 39.4938 12.6319 39.6752 12.7604C39.8572 12.8883 40.0973 12.9023 40.2915 12.7941L43.6043 10.9627L46.9165 12.793C47.0043 12.8418 47.1014 12.8657 47.1979 12.8657C47.3153 12.8657 47.4328 12.8296 47.5328 12.7593C47.7148 12.6308 47.8078 12.4098 47.7717 12.1901L47.1322 8.27263L49.8339 5.50344C49.9868 5.34763 50.0386 5.1203 49.9694 4.91332ZM39.3543 27.4284C38.5409 27.3151 37.7938 27.554 37.2089 27.9965V27.9819C37.2089 26.8267 36.5415 25.7441 35.4706 25.3104C34.2764 24.8273 33.1456 25.1313 32.3711 25.825C31.963 24.7127 30.9031 23.9122 29.6508 23.9122C28.9938 23.9122 28.3938 24.1395 27.9066 24.5087V19.3906C27.9066 17.8732 26.8002 16.5156 25.2903 16.368C23.5578 16.1988 22.0927 17.5622 22.0927 19.261V34.0505C22.0927 35.1017 20.8083 35.6133 20.0857 34.85L16.5903 31.1587C15.4549 30.0232 13.6147 30.0232 12.4793 31.1587C11.3438 32.2941 11.3438 34.1343 12.4793 35.2697L18.9171 43.6796L18.9177 43.679C21.0235 47.5511 25.1618 50.1639 29.8909 50.0726C36.5892 49.943 41.8601 44.2674 41.8601 37.568V30.4447C41.8601 28.9674 40.8177 27.6325 39.3543 27.4284Z',
        'fill',
        'url(#paint0_linear_35_123)',
      ],
      [
        'id',
        'paint0_linear_35_123',
        'x1',
        '-14.7632',
        'y1',
        '23.592',
        'x2',
        '27.5076',
        'y2',
        '55.9041',
        'gradientUnits',
        'userSpaceOnUse',
      ],
      ['stop-color', '#954CF6'],
      ['offset', '1', 'stop-color', '#2A99FF'],
      [1, 'text-md'],
      [1, 'desc-sm'],
      ['href', '#', 1, 'text-sm'],
    ],
    template: function (t, i) {
      t & 1 &&
        (p(0, 'div', 0)(1, 'div', 1)(2, 'h1', 2),
        m(3, 'Build exactly what your business needs'),
        h()(),
        p(4, 'p', 3),
        m(
          5,
          'Leverage tailored products that drive operational efficiency and customer satisfaction.',
        ),
        h(),
        p(6, 'div', 4)(7, 'div', 5),
        ji(),
        p(8, 'svg', 6),
        O(9, 'path', 7),
        p(10, 'defs')(11, 'linearGradient', 8),
        O(12, 'stop', 9)(13, 'stop', 10),
        h()()(),
        Bi(),
        p(14, 'h1', 11),
        m(15, 'Customer experience'),
        h(),
        p(16, 'p', 12),
        m(
          17,
          'Our IT consulting services are designed to provide strategic guidance and expert advice to help you leverage technology for achieving your business goals. We work closely with to develop a customised roadmap that aligns with your objective and accelerates your growth',
        ),
        h(),
        p(18, 'a', 13),
        m(19, 'Learn More'),
        h()(),
        p(20, 'div', 5),
        ji(),
        p(21, 'svg', 6),
        O(22, 'path', 7),
        p(23, 'defs')(24, 'linearGradient', 8),
        O(25, 'stop', 9)(26, 'stop', 10),
        h()()(),
        Bi(),
        p(27, 'h1', 11),
        m(28, 'Customer experience'),
        h(),
        p(29, 'p', 12),
        m(
          30,
          'Our IT consulting services are designed to provide strategic guidance and expert advice to help you leverage technology for achieving your business goals. We work closely with to develop a customised roadmap that aligns with your objective and accelerates your growth',
        ),
        h(),
        p(31, 'a', 13),
        m(32, 'Learn More'),
        h()(),
        p(33, 'div', 5),
        ji(),
        p(34, 'svg', 6),
        O(35, 'path', 7),
        p(36, 'defs')(37, 'linearGradient', 8),
        O(38, 'stop', 9)(39, 'stop', 10),
        h()()(),
        Bi(),
        p(40, 'h1', 11),
        m(41, 'Customer experience'),
        h(),
        p(42, 'p', 12),
        m(
          43,
          'Our IT consulting services are designed to provide strategic guidance and expert advice to help you leverage technology for achieving your business goals. We work closely with to develop a customised roadmap that aligns with your objective and accelerates your growth',
        ),
        h(),
        p(44, 'a', 13),
        m(45, 'Learn More'),
        h()()()());
    },
    styles: [
      '[_nghost-%COMP%]{display:block;width:100%;height:100%;background:#f9f9f9}.build-business[_ngcontent-%COMP%]{padding:100px 0}.card[_ngcontent-%COMP%]{display:flex;padding:24px;flex-direction:column;align-items:flex-start;gap:10px;flex:1 0 0;align-self:stretch;border-radius:0 30px;border:2px solid #4C7DF4;background:#fff;box-shadow:0 2.532px 60.764px #0000000f}.card[_ngcontent-%COMP%]   .desc-xs[_ngcontent-%COMP%]{flex:1 1 100%}.card[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#4c7df4;text-decoration:none;cursor:pointer}',
    ],
  });
};
var Ta = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-transfrom-business']],
    standalone: !0,
    features: [M],
    decls: 29,
    vars: 0,
    consts: [
      [1, 'd-flex', 'align-items-center', 'gap-5', 'about-us-sec', 'container'],
      [1, 'content-block'],
      [1, 'heading-border', 'position-relative', 'heading-xs', 'semibold', 'mb-4'],
      [1, 'desc-sm', 'mb-4'],
      [1, 'promates-btn'],
      [1, 'img-banner'],
      ['src', 'assets/transfrom-business.png'],
      ['src', 'assets/ready-to-take-business.png'],
      [1, 'ready-transfer-banner'],
      [1, 'ready-banner'],
      [1, 'text-md'],
      [1, 'desc-sm'],
      [1, 'btn-evalution'],
    ],
    template: function (t, i) {
      t & 1 &&
        (p(0, 'div', 0)(1, 'div', 1)(2, 'h1', 2),
        m(3, 'Ready to Transform your Business'),
        h(),
        p(4, 'p', 3),
        m(
          5,
          'Embark on a journey of innovation and growth with ProMates Tech. Whether you need cutting -edge IT Solutions ot top-notch staffing services, we are here to support your business every step of the wa. Get in touch with us today for free evaluation and take first step to unlock the business full potential',
        ),
        h(),
        p(6, 'button', 4),
        m(7, 'Hire Talent'),
        h()(),
        p(8, 'div', 5),
        O(9, 'img', 6),
        h()(),
        p(10, 'div', 0)(11, 'div', 5),
        O(12, 'img', 7),
        h(),
        p(13, 'div', 1)(14, 'h1', 2),
        m(15, 'Ready to Transform your Business'),
        h(),
        p(16, 'p', 3),
        m(
          17,
          'Embark on a journey of innovation and growth with ProMates Tech. Whether you need cutting -edge IT Solutions ot top-notch staffing services, we are here to support your business every step of the wa. Get in touch with us today for free evaluation and take first step to unlock the business full potential',
        ),
        h(),
        p(18, 'button', 4),
        m(19, 'Hire Talent'),
        h()()(),
        p(20, 'div', 8)(21, 'div', 9)(22, 'div', 1)(23, 'h1', 10),
        m(24, 'Ready to transform your business'),
        h(),
        p(25, 'p', 11),
        m(26, 'Embark on journey of innovation and growth with ProMates Tech.\xA0'),
        h()(),
        p(27, 'button', 12),
        m(28, 'Get Free Evaluation'),
        h()()());
    },
    styles: [
      '.about-us-sec[_ngcontent-%COMP%]{padding:100px 0}.about-us-sec[_ngcontent-%COMP%]   .content-block[_ngcontent-%COMP%], .about-us-sec[_ngcontent-%COMP%]   .img-banner[_ngcontent-%COMP%]{width:50%}.ready-transfer-banner[_ngcontent-%COMP%]{padding:0 100px}.ready-transfer-banner[_ngcontent-%COMP%]   .ready-banner[_ngcontent-%COMP%]{display:flex;padding:60px;align-items:center;gap:10px;border-radius:0 20px;opacity:.78;background:linear-gradient(127deg,#7e1dff 3.64%,#0085ff 79.56%)}.ready-transfer-banner[_ngcontent-%COMP%]   .ready-banner[_ngcontent-%COMP%]   .content-block[_ngcontent-%COMP%]{width:100%}.ready-transfer-banner[_ngcontent-%COMP%]   .ready-banner[_ngcontent-%COMP%]   .content-block[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:#fff;font-size:30px;font-weight:700;line-height:normal;letter-spacing:-.5px;margin-bottom:10px}.ready-transfer-banner[_ngcontent-%COMP%]   .ready-banner[_ngcontent-%COMP%]   .content-block[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#fff;font-size:20px;font-weight:400;line-height:180%}.ready-transfer-banner[_ngcontent-%COMP%]   .ready-banner[_ngcontent-%COMP%]   .btn-evalution[_ngcontent-%COMP%]{flex-shrink:0;display:flex;padding:15px 24px;justify-content:center;align-items:center;gap:10px;border-radius:60px;border:3px solid #FFF;background:transparent;color:#fff;font-size:20px;font-weight:700;line-height:normal;cursor:pointer}',
    ],
  });
};
var xa = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-body']],
    standalone: !0,
    features: [M],
    decls: 6,
    vars: 0,
    template: function (t, i) {
      t & 1 &&
        O(0, 'app-banner')(1, 'app-about-sec')(2, 'app-build-business-needs')(
          3,
          'app-transfrom-business',
        )(4, 'app-feedback')(5, 'app-freq-asked-que');
    },
    dependencies: [da, Sa, Ea, Ia, Ma, Ta],
  });
};
var Na = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-home']],
    standalone: !0,
    features: [M],
    decls: 1,
    vars: 0,
    template: function (t, i) {
      t & 1 && O(0, 'app-body');
    },
    dependencies: [xa],
  });
};
var Oa = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-aboutus']],
    standalone: !0,
    features: [M],
    decls: 31,
    vars: 0,
    consts: [
      [1, 'about-us-sec-wrapper'],
      [
        1,
        'banner-about-us',
        'position-relative',
        'd-flex',
        'align-items-center',
        'justify-content-center',
      ],
      ['src', 'assets/about.png', 1, 'w-100'],
      [1, 'position-absolute'],
      [1, 'content-block-titles'],
      [1, 'container'],
      [
        1,
        'heading-border',
        'position-relative',
        'heading-xs',
        'center-border',
        'semibold',
        'mb-5',
        'text-center',
      ],
      [1, 'desc-md'],
      [1, 'about-us-sec'],
      [1, 'container', 'd-flex', 'align-items-center', 'gap-5'],
      [1, 'content-block'],
      [1, 'heading-border', 'position-relative', 'heading-xs', 'semibold', 'mb-4'],
      [1, 'desc-sm', 'mb-4'],
      [1, 'promates-btn'],
      [1, 'img-banner'],
      ['src', 'assets/whoweare.png'],
      [1, 'container', 'd-flex', 'align-items-center', 'gap-2'],
      ['src', 'assets/consult.png'],
      [1, 'content-block', 'w-100'],
    ],
    template: function (t, i) {
      t & 1 &&
        (p(0, 'div', 0)(1, 'div', 1),
        O(2, 'img', 2),
        p(3, 'h1', 3),
        m(4, 'About'),
        h()(),
        p(5, 'div', 4)(6, 'div', 5)(7, 'h1', 6),
        m(8, 'We are the company that offers the solution and talent'),
        h(),
        p(9, 'p', 7),
        m(
          10,
          "At ProMates Tech, we specialize in providing customized IT solutions tailored to your unique business needs. Our dedicated team is committed to understanding your requirements and delivering solutions that propel your business forward. Through our expert IT consulting services, we offer valuable insights and recommendations designed to optimize your IT infrastructure. We assist with everything from system integration to strategic planning, ensuring you make informed decisions for your IT environment. Our proactive support team is always on hand to resolve any issues promptly, minimizing downtime and maximizing productivity. By staying current with the latest technologies, we empower your business with innovative solutions that enhance efficiency and performance, helping you stay competitive in today's dynamic digital landscape. At ProMates Tech, client satisfaction is our top priority, and our client-centric approach ensures that we deliver exceptional service and build lasting partnerships with our clients.4o mini",
        ),
        h()()(),
        p(11, 'div', 8)(12, 'div', 9)(13, 'div', 10)(14, 'h1', 11),
        m(15, 'Who We Are?'),
        h(),
        p(16, 'p', 12),
        m(
          17,
          'Embark on a journey of innovation and growth with ProMates Tech. Whether you need cutting -edge IT Solutions ot top-notch staffing services, we are here to support your business every step of the wa. Get in touch with us today for free evaluation and take first step to unlock the business full potential',
        ),
        h(),
        p(18, 'button', 13),
        m(19, 'Hire Talent'),
        h()(),
        p(20, 'div', 14),
        O(21, 'img', 15),
        h()()(),
        p(22, 'div', 8)(23, 'div', 16)(24, 'div', 14),
        O(25, 'img', 17),
        h(),
        p(26, 'div', 18)(27, 'h1', 11),
        m(28, 'We Love What We Do. We Love Who We Serve.'),
        h(),
        p(29, 'p', 12),
        m(
          30,
          'We help companies achieve their vision through digital transformation our technical experts craft custom solutions for industry-leading companies together, we deliver great results through strategic partnership and knowledge sharing',
        ),
        h()()()()());
    },
    styles: [
      '.content-block-titles[_ngcontent-%COMP%]{padding:100px 0;background:#f9f9f9}.banner-about-us[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{position:absolute;top:auto;color:#fff;font-size:30px;font-weight:700;line-height:normal;letter-spacing:-.5px}.about-us-sec[_ngcontent-%COMP%]{padding:100px 0}.about-us-sec[_ngcontent-%COMP%]:nth-child(2n){background:#f9f9f9}.about-us-sec[_ngcontent-%COMP%]   .content-block[_ngcontent-%COMP%], .about-us-sec[_ngcontent-%COMP%]   .img-banner[_ngcontent-%COMP%]{width:50%}',
    ],
  });
};
var Aa = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-contact-us']],
    standalone: !0,
    features: [M],
    decls: 28,
    vars: 0,
    consts: [
      [1, 'contact-us-wrapper'],
      [1, 'container'],
      [1, 'text-center', 'text-xl', 'semibold', 'mb-2'],
      [1, 'desc-sm', 'text-center', 'mb-3'],
      [1, 'd-flex', 'gap-3'],
      [1, 'mb-3', 'w-100'],
      ['for', 'exampleFormControlInput1', 1, 'form-label', 'text-sm', 'medium'],
      [
        'type',
        'text',
        'id',
        'exampleFormControlInput1',
        'placeholder',
        'name@example.com',
        1,
        'form-control',
      ],
      [1, 'mb-3'],
      [
        'type',
        'email',
        'id',
        'exampleFormControlInput1',
        'placeholder',
        'name@example.com',
        1,
        'form-control',
      ],
      ['for', 'exampleFormControlTextarea1', 1, 'form-label', 'text-sm', 'medium'],
      ['id', 'exampleFormControlTextarea1', 'rows', '3', 1, 'form-control'],
      [1, 'd-flex', 'align-items-center', 'justify-content-end'],
      [1, 'promates-btn', 'w-25', 'text-center', 'justify-content-center'],
    ],
    template: function (t, i) {
      t & 1 &&
        (p(0, 'div', 0)(1, 'div', 1)(2, 'h1', 2),
        m(3, 'Contact Us'),
        h(),
        p(4, 'p', 3),
        m(5, 'We\u2019re here for anything you need.Just drop us a quick message below. '),
        O(6, 'br'),
        m(7, 'We\u2019ll get back to you shortly'),
        h(),
        p(8, 'div', 4)(9, 'div', 5)(10, 'label', 6),
        m(11, 'First name'),
        h(),
        O(12, 'input', 7),
        h(),
        p(13, 'div', 5)(14, 'label', 6),
        m(15, 'Last name'),
        h(),
        O(16, 'input', 7),
        h()(),
        p(17, 'div', 8)(18, 'label', 6),
        m(19, 'Email'),
        h(),
        O(20, 'input', 9),
        h(),
        p(21, 'div', 8)(22, 'label', 10),
        m(23, 'Message'),
        h(),
        O(24, 'textarea', 11),
        h(),
        p(25, 'div', 12)(26, 'button', 13),
        m(27, 'Submit'),
        h()()()());
    },
    styles: [
      '.contact-us-wrapper[_ngcontent-%COMP%]{padding:100px}.contact-us-wrapper[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]{min-height:200px}',
    ],
  });
};
var Ra = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-staffing']],
    standalone: !0,
    features: [M],
    decls: 2,
    vars: 0,
    template: function (t, i) {
      t & 1 && (p(0, 'p'), m(1, 'staffing works!'), h());
    },
  });
};
var Pa = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-consulting']],
    standalone: !0,
    features: [M],
    decls: 2,
    vars: 0,
    template: function (t, i) {
      t & 1 && (p(0, 'p'), m(1, 'consulting works!'), h());
    },
  });
};
var ka = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-finance']],
    standalone: !0,
    features: [M],
    decls: 2,
    vars: 0,
    template: function (t, i) {
      t & 1 && (p(0, 'p'), m(1, 'finance works!'), h());
    },
  });
};
var Fa = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-health-care']],
    standalone: !0,
    features: [M],
    decls: 2,
    vars: 0,
    template: function (t, i) {
      t & 1 && (p(0, 'p'), m(1, 'health-care works!'), h());
    },
  });
};
var La = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-information-technology']],
    standalone: !0,
    features: [M],
    decls: 2,
    vars: 0,
    template: function (t, i) {
      t & 1 && (p(0, 'p'), m(1, 'information-technology works!'), h());
    },
  });
};
var ja = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-retail']],
    standalone: !0,
    features: [M],
    decls: 2,
    vars: 0,
    template: function (t, i) {
      t & 1 && (p(0, 'p'), m(1, 'retail works!'), h());
    },
  });
};
var Ba = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-life-sciences']],
    standalone: !0,
    features: [M],
    decls: 2,
    vars: 0,
    template: function (t, i) {
      t & 1 && (p(0, 'p'), m(1, 'life-sciences works!'), h());
    },
  });
};
var Va = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-logistics']],
    standalone: !0,
    features: [M],
    decls: 2,
    vars: 0,
    template: function (t, i) {
      t & 1 && (p(0, 'p'), m(1, 'logistics works!'), h());
    },
  });
};
var $a = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-search-jobs']],
    standalone: !0,
    features: [M],
    decls: 2,
    vars: 0,
    template: function (t, i) {
      t & 1 && (p(0, 'p'), m(1, 'search-jobs works!'), h());
    },
  });
};
var Ha = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-submit-resume']],
    standalone: !0,
    features: [M],
    decls: 2,
    vars: 0,
    template: function (t, i) {
      t & 1 && (p(0, 'p'), m(1, 'submit-resume works!'), h());
    },
  });
};
var _0 = [
  { path: '', component: Na, canActivate: [] },
  { path: ee.ABOUT, component: Oa },
  { path: ee.CONTACT, component: Aa },
  { path: ee.SERVICES.STAFFING, component: Ra },
  { path: ee.SERVICES.CONSULTING, component: Pa },
  { path: ee.INDUSTRIES.FINANCE, component: ka },
  { path: ee.INDUSTRIES.HEALTH_CARE, component: Fa },
  { path: ee.INDUSTRIES.IT, component: La },
  { path: ee.INDUSTRIES.RETAIL, component: ja },
  { path: ee.INDUSTRIES.LIFE_SCIENCES, component: Ba },
  { path: ee.INDUSTRIES.LOGISTICS, component: Va },
  { path: ee.JOB_SEEKER.SEARCH_JOBS, component: $a },
  { path: ee.JOB_SEEKER.SUBMIT_RESUME, component: Ha },
];
var y0 = { providers: [Og({ eventCoalescing: !0 }), Hm(_0)] };
var gE = ':';
function mE(e, n) {
  for (let t = 1, i = 1; t < e.length; t++, i++)
    if (n[i] === '\\') i++;
    else if (e[t] === gE) return t;
  throw new Error(`Unterminated $localize metadata block in "${n}".`);
}
var _n = function (e, ...n) {
    if (_n.translate) {
      let i = _n.translate(e, n);
      (e = i[0]), (n = i[1]);
    }
    let t = b0(e[0], e.raw[0]);
    for (let i = 1; i < e.length; i++) t += n[i - 1] + b0(e[i], e.raw[i]);
    return t;
  },
  vE = ':';
function b0(e, n) {
  return n.charAt(0) === vE ? e.substring(mE(e, n) + 1) : e;
}
globalThis.$localize = _n;
var D0 = [
  { name: 'About Us', icon: '', id: 'about', subnav: [], path: ee.ABOUT },
  {
    name: 'For Business',
    icon: '',
    id: 'forbusiness',
    subnav: [
      {
        name: 'Services',
        id: 'services',
        icon: '',
        subchildren: [
          {
            name: 'Staffing',
            id: 'staffing',
            icon: '',
            path: ee.SERVICES.STAFFING,
          },
          {
            name: 'Consulting',
            id: 'consulting',
            icon: '',
            path: ee.SERVICES.CONSULTING,
          },
        ],
      },
      {
        name: 'Industries',
        id: 'industries',
        icon: '',
        subchildren: [
          {
            name: 'Finance',
            icon: '',
            id: 'finance',
            path: ee.INDUSTRIES.FINANCE,
          },
          {
            name: 'Health Care',
            icon: '',
            id: 'healthcare',
            path: ee.INDUSTRIES.HEALTH_CARE,
          },
          {
            name: 'Information Technology',
            icon: '',
            id: 'it',
            path: ee.INDUSTRIES.IT,
          },
          {
            name: 'Retail',
            icon: '',
            id: 'retail',
            path: ee.INDUSTRIES.RETAIL,
          },
          {
            name: 'Life Sciences',
            icon: '',
            id: 'lifesciences',
            path: ee.INDUSTRIES.LIFE_SCIENCES,
          },
          {
            name: 'Logistics',
            icon: '',
            id: 'logistics',
            path: ee.INDUSTRIES.LOGISTICS,
          },
        ],
      },
    ],
  },
  {
    name: 'For Job Seekers',
    icon: '',
    id: 'jobseeker',
    subnav: [
      {
        name: 'Search Jobs',
        id: 'searchjobs',
        icon: '',
        path: ee.JOB_SEEKER.SEARCH_JOBS,
      },
      {
        name: 'Submit Resume',
        id: 'submitresume',
        icon: '',
        path: ee.JOB_SEEKER.SUBMIT_RESUME,
      },
    ],
  },
  { name: 'Contact', icon: '', id: 'contact', subnav: [], path: ee.CONTACT },
];
var Ua = class e {
  constructor() {}
  getMenuData() {
    return D0;
  }
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: 'root' });
};
var _E = ['headerDropdown'],
  yE = (e) => ({ item: e }),
  bE = (e) => ({ active: e }),
  DE = (e) => ({ selectedTab: e });
function wE(e, n) {}
function CE(e, n) {
  if ((e & 1 && (Tr(0), Ne(1, wE, 0, 0, 'ng-template', 4), xr()), e & 2)) {
    let t = n.$implicit;
    Ve();
    let i = $s(3);
    Qe(), rt('ngTemplateOutlet', i)('ngTemplateOutletContext', Nr(2, yE, t));
  }
}
function SE(e, n) {
  if (e & 1) {
    let t = Ui();
    p(0, 'button', 15),
      Ze('click', function () {
        let r = ki(t).$implicit,
          o = Ve(5);
        return Fi(o.navigateToChild(r.path));
      }),
      ji(),
      p(1, 'svg', 16),
      O(2, 'path', 17),
      p(3, 'defs')(4, 'linearGradient', 18),
      O(5, 'stop', 19)(6, 'stop', 20),
      h()()(),
      Bi(),
      p(7, 'span'),
      m(8),
      h()();
  }
  if (e & 2) {
    let t = n.$implicit;
    Qe(8), zn(t.name);
  }
}
function EE(e, n) {
  if ((e & 1 && (p(0, 'div', 13), Ne(1, SE, 9, 1, 'button', 14), h()), e & 2)) {
    let t = Ve().$implicit;
    Qe(), rt('ngForOf', t.subchildren);
  }
}
function IE(e, n) {
  if (e & 1) {
    let t = Ui();
    Tr(0),
      p(1, 'div', 10)(2, 'h1', 11),
      Ze('click', function () {
        let r = ki(t).$implicit;
        Ve();
        let o = $s(1),
          s = Ve().item,
          a = Ve();
        return Fi(r != null && r.path ? a.navigateToChild(r.path, o) : a.subItemSelection(s, r));
      }),
      m(3),
      h(),
      Ne(4, EE, 2, 1, 'div', 12),
      h(),
      xr();
  }
  if (e & 2) {
    let t = n.$implicit,
      i = Ve(2).item;
    Qe(2),
      rt('ngClass', Nr(3, bE, (i.selectedSubNav == null ? null : i.selectedSubNav.id) === t.id)),
      Qe(),
      zn(t.name),
      Qe(),
      rt('ngIf', (i.selectedSubNav == null ? null : i.selectedSubNav.id) === t.id);
  }
}
function ME(e, n) {
  if (e & 1) {
    let t = Ui();
    p(0, 'div', 7, 1)(2, 'button', 8),
      Ze('click', function () {
        ki(t);
        let r = Ve().item,
          o = Ve();
        return Fi(o.subItemSelection(r));
      }),
      m(3),
      h(),
      p(4, 'ul', 9),
      Ne(5, IE, 5, 5, 'ng-container', 3),
      h()();
  }
  if (e & 2) {
    let t = Ve().item;
    Qe(3), zn(t.name), Qe(2), rt('ngForOf', t.subnav);
  }
}
function TE(e, n) {
  if (e & 1) {
    let t = Ui();
    p(0, 'button', 21),
      Ze('click', function () {
        ki(t);
        let r = Ve().item,
          o = Ve();
        return o.navigateToChild(r.path), Fi(o.subItemSelection(r));
      }),
      m(1),
      h();
  }
  if (e & 2) {
    let t = Ve().item;
    rt('ngClass', Nr(2, DE, t.selected)), Qe(), zn(t.name);
  }
}
function xE(e, n) {
  if ((e & 1 && Ne(0, ME, 6, 2, 'div', 5)(1, TE, 2, 4, 'button', 6), e & 2)) {
    let t = n.item;
    rt('ngIf', (t == null ? null : t.subnav) && (t == null ? null : t.subnav.length) > 0),
      Qe(),
      rt('ngIf', !(t != null && t.subnav.length));
  }
}
var Ga = class e {
  menuItems = [];
  route = v(tr);
  menuService = v(Ua);
  headerDropdown;
  navigateToAbout() {
    this.route.navigate(['/about']);
  }
  navigateToChild(n, t) {
    this.headerDropdown?.isOpen() && this.headerDropdown.close(),
      t?.isOpen() && t.close(),
      this.route.navigate([n]);
  }
  constructor() {}
  ngOnInit() {
    this.menuItems = this.menuService.getMenuData();
  }
  subItemSelection(n, t) {
    n &&
      n?.subnav?.length &&
      (n.selectedSubNav || (n.selectedSubNav = {}),
      (n.selectedSubNav = {}),
      !t && n.subnav[0]?.subchildren
        ? (n.selectedSubNav = n.subnav[0])
        : t && t?.subchildren && (n.selectedSubNav = t));
  }
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-navigation']],
    viewQuery: function (t, i) {
      if ((t & 1 && Du(_E, 5), t & 2)) {
        let r;
        Ot((r = At())) && (i.headerDropdown = r.first);
      }
    },
    standalone: !0,
    features: [M],
    decls: 4,
    vars: 1,
    consts: [
      ['dropdownTemplate', ''],
      ['headerDropdown', 'ngbDropdown'],
      [1, 'd-flex', 'align-items-center', 'justify-content-center', 'gap-4'],
      [4, 'ngFor', 'ngForOf'],
      [3, 'ngTemplateOutlet', 'ngTemplateOutletContext'],
      ['ngbDropdown', '', 'container', 'body', 'dropdownClass', 'nav-megamenu-list', 4, 'ngIf'],
      ['class', 'nav-item-list', 3, 'ngClass', 'click', 4, 'ngIf'],
      ['ngbDropdown', '', 'container', 'body', 'dropdownClass', 'nav-megamenu-list'],
      ['ngbDropdownToggle', '', 3, 'click'],
      ['ngbDropdownMenu', ''],
      [1, 'submenu-list'],
      [3, 'click', 'ngClass'],
      ['class', 'childrens-list', 4, 'ngIf'],
      [1, 'childrens-list'],
      ['ngbDropdownItem', '', 3, 'click', 4, 'ngFor', 'ngForOf'],
      ['ngbDropdownItem', '', 3, 'click'],
      ['width', '33', 'height', '40', 'viewBox', '0 0 33 40', 'fill', 'none'],
      [
        'd',
        'M29.9556 1.40952H14.3689L14.3229 1.28929C14.0236 0.512902 13.2766 0 12.444 0H3.21811C1.46964 0 0 1.38778 0 3.13625V36.8625C0 38.6084 1.46836 40 3.21811 40H27.2145C27.5919 40 27.9436 39.8133 28.1559 39.505C28.3682 39.1955 28.4156 38.8002 28.2838 38.4511H29.9568C31.5748 38.4511 32.8168 37.1451 32.8168 35.5284V4.3424C32.8155 2.72567 31.5723 1.40952 29.9556 1.40952ZM29.5782 35.0718H27.0329L25.6068 31.3024C26.3857 31.1604 26.9728 30.4979 26.9728 29.678C26.9728 28.7532 26.2258 28.0293 25.2985 28.0293H24.3661L23.1996 24.9314H25.5825C26.5072 24.9314 27.2542 24.164 27.2542 23.2405C27.2542 22.317 26.5072 21.5521 25.5825 21.5521H21.9499L20.7834 18.453H25.5825C26.5072 18.453 27.2542 17.7559 27.2542 16.8337C27.2542 15.9089 26.5072 15.2118 25.5825 15.2118H19.5338L18.3673 12.1152H25.5825C26.5072 12.1152 27.2542 11.3478 27.2542 10.4243C27.2542 9.50213 26.5072 8.73597 25.5825 8.73597H17.1189L15.6173 4.79135H29.577V35.0718H29.5782Z',
        'fill',
        'url(#paint0_linear_70_34)',
      ],
      [
        'id',
        'paint0_linear_70_34',
        'x1',
        '-9.68974',
        'y1',
        '18.8136',
        'x2',
        '21.8579',
        'y2',
        '38.5984',
        'gradientUnits',
        'userSpaceOnUse',
      ],
      ['stop-color', '#954CF6'],
      ['offset', '1', 'stop-color', '#2A99FF'],
      [1, 'nav-item-list', 3, 'click', 'ngClass'],
    ],
    template: function (t, i) {
      t & 1 &&
        (p(0, 'div', 2),
        Ne(1, CE, 2, 4, 'ng-container', 3),
        h(),
        Ne(2, xE, 2, 2, 'ng-template', null, 0, Cu)),
        t & 2 && (Qe(), rt('ngForOf', i.menuItems));
    },
    dependencies: [Rr, Zg, Yg, Jg, Nu, m0, Ca, g0, zd, wa, h0],
    styles: [
      '[_nghost-%COMP%]{width:100%}.nav-item-list[_ngcontent-%COMP%], .dropdown[_ngcontent-%COMP%]   .dropdown-toggle[_ngcontent-%COMP%]{color:#fff;font-size:16px;font-style:normal;font-weight:600;line-height:normal;border:0;padding:0;background:transparent;text-align:center;cursor:pointer}.dropdown.show[_ngcontent-%COMP%]   .dropdown-toggle[_ngcontent-%COMP%]{color:#4c7df4}.dropdown[_ngcontent-%COMP%]   .dropdown-toggle[_ngcontent-%COMP%]:after{display:none}  .nav-megamenu-list{width:100%;left:0!important;transform:none!important;top:76px!important;background:#004dba;box-shadow:0 4px 4px #00000040;right:0!important;margin:0 auto!important}  .nav-megamenu-list .dropdown-menu{background:#004dba;border:0;padding:30px 60px;margin:0}  .nav-megamenu-list .dropdown-menu .submenu-list{display:flex;align-items:flex-start;gap:20px;margin-bottom:30px}  .nav-megamenu-list .dropdown-menu .submenu-list:last-child{margin:0}  .nav-megamenu-list .dropdown-menu .submenu-list h1{color:#fff;font-size:16px;font-weight:700;line-height:normal;display:flex;height:51px;padding:12px 36px;justify-content:center;align-items:center;gap:10px;align-self:stretch;border-radius:60px;background:transparent;flex-shrink:0;width:200px;cursor:pointer}  .nav-megamenu-list .dropdown-menu .submenu-list h1.active{color:#323232;background:#fff}  .nav-megamenu-list .dropdown-menu .submenu-list .childrens-list{width:100%;display:flex;flex-wrap:wrap;gap:18px}  .nav-megamenu-list .dropdown-menu .submenu-list .childrens-list .dropdown-item{flex:1 1 32%;border-radius:8px;background:#fff;display:flex;padding:15px 40px;align-items:center;gap:20px;align-self:stretch;color:#323232;font-family:Open Sans;font-size:14px;font-style:normal;font-weight:700;line-height:normal;cursor:pointer}  .nav-megamenu-list .dropdown-menu .inner-list-data .inner-list-btn{color:#fff;font-size:16px;font-style:normal;font-weight:600;line-height:normal;border:0;padding:0;background:transparent;text-align:center;cursor:pointer}',
    ],
  });
};
var za = class e {
  route = v(tr);
  navigateToHome() {
    this.route.navigate(['home']);
  }
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-header']],
    standalone: !0,
    features: [M],
    decls: 6,
    vars: 0,
    consts: [
      [1, 'header-wrapper'],
      [1, 'logo', 3, 'click'],
      [1, 'promates-btn'],
    ],
    template: function (t, i) {
      t & 1 &&
        (p(0, 'div', 0)(1, 'div', 1),
        Ze('click', function () {
          return i.navigateToHome();
        }),
        m(2, 'ProMates'),
        h(),
        O(3, 'app-navigation'),
        p(4, 'button', 2),
        m(5, 'Join the Platform'),
        h()());
    },
    dependencies: [Ga],
    styles: [
      '.header-wrapper[_ngcontent-%COMP%]{background:#0054cc;display:flex;height:80px;padding:0 90px;justify-content:space-between;align-items:center}.logo[_ngcontent-%COMP%]{display:flex;padding:8px 16px;align-items:center;gap:10px;color:#fff;font-size:24px;font-style:normal;font-weight:700;letter-spacing:.632px;border:2px solid #FFF}',
    ],
  });
};
var Wa = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-footer']],
    standalone: !0,
    features: [M],
    decls: 82,
    vars: 0,
    consts: [
      [1, 'bg-dark', 'text-white', 'p-0'],
      [1, 'row', 'row-data-footer', 'mb-4'],
      [1, 'col-md-2'],
      [1, 'list-unstyled'],
      ['href', '#', 1, 'text-white'],
      [1, 'text-center', 'bottom-data', 'justify-content-center'],
    ],
    template: function (t, i) {
      t & 1 &&
        (p(0, 'footer', 0)(1, 'div', 1)(2, 'div', 2)(3, 'h5'),
        m(4, 'Social Media'),
        h(),
        p(5, 'ul', 3)(6, 'li')(7, 'a', 4),
        m(8, 'Facebook'),
        h()(),
        p(9, 'li')(10, 'a', 4),
        m(11, 'Twitter'),
        h()(),
        p(12, 'li')(13, 'a', 4),
        m(14, 'Instagram'),
        h()(),
        p(15, 'li')(16, 'a', 4),
        m(17, 'LinkedIn'),
        h()()()(),
        p(18, 'div', 2)(19, 'h5'),
        m(20, 'Services'),
        h(),
        p(21, 'ul', 3)(22, 'li')(23, 'a', 4),
        m(24, 'Consulting'),
        h()(),
        p(25, 'li')(26, 'a', 4),
        m(27, 'Staffing'),
        h()(),
        p(28, 'li')(29, 'a', 4),
        m(30, 'Cloud Services'),
        h()(),
        p(31, 'li')(32, 'a', 4),
        m(33, 'Support'),
        h()()()(),
        p(34, 'div', 2)(35, 'h5'),
        m(36, 'About'),
        h(),
        p(37, 'ul', 3)(38, 'li')(39, 'a', 4),
        m(40, 'Our Story'),
        h()(),
        p(41, 'li')(42, 'a', 4),
        m(43, 'Careers'),
        h()(),
        p(44, 'li')(45, 'a', 4),
        m(46, 'Contact Us'),
        h()()()(),
        p(47, 'div', 2)(48, 'h5'),
        m(49, 'Resources'),
        h(),
        p(50, 'ul', 3)(51, 'li')(52, 'a', 4),
        m(53, 'Blog'),
        h()(),
        p(54, 'li')(55, 'a', 4),
        m(56, 'Case Studies'),
        h()(),
        p(57, 'li')(58, 'a', 4),
        m(59, 'Whitepapers'),
        h()()()(),
        p(60, 'div', 2)(61, 'h5'),
        m(62, 'Areas of Experience'),
        h(),
        p(63, 'ul', 3)(64, 'li')(65, 'a', 4),
        m(66, 'Finance'),
        h()(),
        p(67, 'li')(68, 'a', 4),
        m(69, 'Healthcare'),
        h()(),
        p(70, 'li')(71, 'a', 4),
        m(72, 'Information Technology'),
        h()(),
        p(73, 'li')(74, 'a', 4),
        m(75, 'Retail'),
        h()(),
        p(76, 'li')(77, 'a', 4),
        m(78, 'Logistics'),
        h()()()()(),
        p(79, 'div', 5)(80, 'p'),
        m(81, '\xA9 2023 Your Company Name. All rights reserved.'),
        h()()());
    },
    styles: [
      'footer[_ngcontent-%COMP%]{background:#070c2e!important}footer[_ngcontent-%COMP%]   .row-data-footer[_ngcontent-%COMP%]{padding:50px 100px}footer[_ngcontent-%COMP%]   .row-data-footer[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%]{color:#e9efff;font-size:16px;font-style:normal;font-weight:700;line-height:24px;text-transform:capitalize}footer[_ngcontent-%COMP%]   .row-data-footer[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{padding:0;margin:0}footer[_ngcontent-%COMP%]   .row-data-footer[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{list-style-type:none}footer[_ngcontent-%COMP%]   .row-data-footer[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#fff;font-size:14px;list-style-type:none;text-decoration:none;font-style:normal;font-weight:400;line-height:35px;text-transform:capitalize}footer[_ngcontent-%COMP%]   .bottom-data[_ngcontent-%COMP%]{background:#121a50;display:flex;padding:16px 100px;align-items:center;gap:27px;align-self:stretch}footer[_ngcontent-%COMP%]   .bottom-data[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#fff;font-size:14px;font-weight:400;line-height:24px;text-transform:capitalize}',
    ],
  });
};
var qa = class e {
  title = _n`:Title for the app:Welcome to our application!`;
  welcomeMessage = _n`Welcome to our localized app!`;
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = I({
    type: e,
    selectors: [['app-root']],
    standalone: !0,
    features: [M],
    decls: 3,
    vars: 0,
    template: function (t, i) {
      t & 1 && O(0, 'app-header')(1, 'router-outlet')(2, 'app-footer');
    },
    dependencies: [vd, za, Wa],
  });
};
sm(qa, y0).catch((e) => console.error(e));
