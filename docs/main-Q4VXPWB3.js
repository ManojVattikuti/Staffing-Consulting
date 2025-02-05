var YC = Object.defineProperty,
  JC = Object.defineProperties;
var XC = Object.getOwnPropertyDescriptors;
var Ea = Object.getOwnPropertySymbols;
var xg = Object.prototype.hasOwnProperty,
  Ng = Object.prototype.propertyIsEnumerable;
var Ig = (t, n, e) =>
    n in t ? YC(t, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (t[n] = e),
  E = (t, n) => {
    for (var e in (n ||= {})) xg.call(n, e) && Ig(t, e, n[e]);
    if (Ea) for (var e of Ea(n)) Ng.call(n, e) && Ig(t, e, n[e]);
    return t;
  },
  ee = (t, n) => JC(t, XC(n));
var ad = (t, n) => {
  var e = {};
  for (var i in t) xg.call(t, i) && n.indexOf(i) < 0 && (e[i] = t[i]);
  if (t != null && Ea) for (var i of Ea(t)) n.indexOf(i) < 0 && Ng.call(t, i) && (e[i] = t[i]);
  return e;
};
var Ta = (t, n, e) =>
  new Promise((i, r) => {
    var o = (l) => {
        try {
          a(e.next(l));
        } catch (c) {
          r(c);
        }
      },
      s = (l) => {
        try {
          a(e.throw(l));
        } catch (c) {
          r(c);
        }
      },
      a = (l) => (l.done ? i(l.value) : Promise.resolve(l.value).then(o, s));
    a((e = e.apply(t, n)).next());
  });
function Ag(t, n) {
  return Object.is(t, n);
}
var He = null,
  Ma = !1,
  Ia = 1,
  pi = Symbol('SIGNAL');
function ue(t) {
  let n = He;
  return (He = t), n;
}
function Og() {
  return He;
}
var es = {
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
function ud(t) {
  if (Ma) throw new Error('');
  if (He === null) return;
  He.consumerOnSignalRead(t);
  let n = He.nextProducerIndex++;
  if ((Oa(He), n < He.producerNode.length && He.producerNode[n] !== t && Xo(He))) {
    let e = He.producerNode[n];
    Aa(e, He.producerIndexOfThis[n]);
  }
  He.producerNode[n] !== t &&
    ((He.producerNode[n] = t), (He.producerIndexOfThis[n] = Xo(He) ? kg(t, He, n) : 0)),
    (He.producerLastReadVersion[n] = t.version);
}
function ew() {
  Ia++;
}
function Rg(t) {
  if (!(Xo(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === Ia)) {
    if (!t.producerMustRecompute(t) && !fd(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = Ia);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = Ia);
  }
}
function Pg(t) {
  if (t.liveConsumerNode === void 0) return;
  let n = Ma;
  Ma = !0;
  try {
    for (let e of t.liveConsumerNode) e.dirty || tw(e);
  } finally {
    Ma = n;
  }
}
function Fg() {
  return He?.consumerAllowSignalWrites !== !1;
}
function tw(t) {
  (t.dirty = !0), Pg(t), t.consumerMarkedDirty?.(t);
}
function Na(t) {
  return t && (t.nextProducerIndex = 0), ue(t);
}
function dd(t, n) {
  if (
    (ue(n),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (Xo(t))
      for (let e = t.nextProducerIndex; e < t.producerNode.length; e++)
        Aa(t.producerNode[e], t.producerIndexOfThis[e]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(), t.producerLastReadVersion.pop(), t.producerIndexOfThis.pop();
  }
}
function fd(t) {
  Oa(t);
  for (let n = 0; n < t.producerNode.length; n++) {
    let e = t.producerNode[n],
      i = t.producerLastReadVersion[n];
    if (i !== e.version || (Rg(e), i !== e.version)) return !0;
  }
  return !1;
}
function hd(t) {
  if ((Oa(t), Xo(t)))
    for (let n = 0; n < t.producerNode.length; n++) Aa(t.producerNode[n], t.producerIndexOfThis[n]);
  (t.producerNode.length = t.producerLastReadVersion.length = t.producerIndexOfThis.length = 0),
    t.liveConsumerNode && (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function kg(t, n, e) {
  if ((Lg(t), t.liveConsumerNode.length === 0 && Vg(t)))
    for (let i = 0; i < t.producerNode.length; i++)
      t.producerIndexOfThis[i] = kg(t.producerNode[i], t, i);
  return t.liveConsumerIndexOfThis.push(e), t.liveConsumerNode.push(n) - 1;
}
function Aa(t, n) {
  if ((Lg(t), t.liveConsumerNode.length === 1 && Vg(t)))
    for (let i = 0; i < t.producerNode.length; i++) Aa(t.producerNode[i], t.producerIndexOfThis[i]);
  let e = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[n] = t.liveConsumerNode[e]),
    (t.liveConsumerIndexOfThis[n] = t.liveConsumerIndexOfThis[e]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    n < t.liveConsumerNode.length)
  ) {
    let i = t.liveConsumerIndexOfThis[n],
      r = t.liveConsumerNode[n];
    Oa(r), (r.producerIndexOfThis[i] = n);
  }
}
function Xo(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function Oa(t) {
  (t.producerNode ??= []), (t.producerIndexOfThis ??= []), (t.producerLastReadVersion ??= []);
}
function Lg(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function Vg(t) {
  return t.producerNode !== void 0;
}
function jg(t) {
  let n = Object.create(nw);
  n.computation = t;
  let e = () => {
    if ((Rg(n), ud(n), n.value === xa)) throw n.error;
    return n.value;
  };
  return (e[pi] = n), e;
}
var ld = Symbol('UNSET'),
  cd = Symbol('COMPUTING'),
  xa = Symbol('ERRORED'),
  nw = ee(E({}, es), {
    value: ld,
    dirty: !0,
    error: null,
    equal: Ag,
    producerMustRecompute(t) {
      return t.value === ld || t.value === cd;
    },
    producerRecomputeValue(t) {
      if (t.value === cd) throw new Error('Detected cycle in computations.');
      let n = t.value;
      t.value = cd;
      let e = Na(t),
        i;
      try {
        i = t.computation();
      } catch (r) {
        (i = xa), (t.error = r);
      } finally {
        dd(t, e);
      }
      if (n !== ld && n !== xa && i !== xa && t.equal(n, i)) {
        t.value = n;
        return;
      }
      (t.value = i), t.version++;
    },
  });
function iw() {
  throw new Error();
}
var Bg = iw;
function Ug() {
  Bg();
}
function $g(t) {
  Bg = t;
}
var rw = null;
function Hg(t) {
  let n = Object.create(zg);
  n.value = t;
  let e = () => (ud(n), n.value);
  return (e[pi] = n), e;
}
function pd(t, n) {
  Fg() || Ug(), t.equal(t.value, n) || ((t.value = n), ow(t));
}
function Gg(t, n) {
  Fg() || Ug(), pd(t, n(t.value));
}
var zg = ee(E({}, es), { equal: Ag, value: void 0 });
function ow(t) {
  t.version++, ew(), Pg(t), rw?.();
}
function H(t) {
  return typeof t == 'function';
}
function Zr(t) {
  let e = t((i) => {
    Error.call(i), (i.stack = new Error().stack);
  });
  return (e.prototype = Object.create(Error.prototype)), (e.prototype.constructor = e), e;
}
var Ra = Zr(
  (t) =>
    function (e) {
      t(this),
        (this.message = e
          ? `${e.length} errors occurred during unsubscription:
${e.map((i, r) => `${r + 1}) ${i.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = e);
    },
);
function rr(t, n) {
  if (t) {
    let e = t.indexOf(n);
    0 <= e && t.splice(e, 1);
  }
}
var Ce = class t {
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
      let { _parentage: e } = this;
      if (e)
        if (((this._parentage = null), Array.isArray(e))) for (let o of e) o.remove(this);
        else e.remove(this);
      let { initialTeardown: i } = this;
      if (H(i))
        try {
          i();
        } catch (o) {
          n = o instanceof Ra ? o.errors : [o];
        }
      let { _finalizers: r } = this;
      if (r) {
        this._finalizers = null;
        for (let o of r)
          try {
            Wg(o);
          } catch (s) {
            (n = n ?? []), s instanceof Ra ? (n = [...n, ...s.errors]) : n.push(s);
          }
      }
      if (n) throw new Ra(n);
    }
  }
  add(n) {
    var e;
    if (n && n !== this)
      if (this.closed) Wg(n);
      else {
        if (n instanceof t) {
          if (n.closed || n._hasParent(this)) return;
          n._addParent(this);
        }
        (this._finalizers = (e = this._finalizers) !== null && e !== void 0 ? e : []).push(n);
      }
  }
  _hasParent(n) {
    let { _parentage: e } = this;
    return e === n || (Array.isArray(e) && e.includes(n));
  }
  _addParent(n) {
    let { _parentage: e } = this;
    this._parentage = Array.isArray(e) ? (e.push(n), e) : e ? [e, n] : n;
  }
  _removeParent(n) {
    let { _parentage: e } = this;
    e === n ? (this._parentage = null) : Array.isArray(e) && rr(e, n);
  }
  remove(n) {
    let { _finalizers: e } = this;
    e && rr(e, n), n instanceof t && n._removeParent(this);
  }
};
Ce.EMPTY = (() => {
  let t = new Ce();
  return (t.closed = !0), t;
})();
var md = Ce.EMPTY;
function Pa(t) {
  return t instanceof Ce || (t && 'closed' in t && H(t.remove) && H(t.add) && H(t.unsubscribe));
}
function Wg(t) {
  H(t) ? t() : t.unsubscribe();
}
var Yt = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Kr = {
  setTimeout(t, n, ...e) {
    let { delegate: i } = Kr;
    return i?.setTimeout ? i.setTimeout(t, n, ...e) : setTimeout(t, n, ...e);
  },
  clearTimeout(t) {
    let { delegate: n } = Kr;
    return (n?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function Fa(t) {
  Kr.setTimeout(() => {
    let { onUnhandledError: n } = Yt;
    if (n) n(t);
    else throw t;
  });
}
function Wn() {}
var qg = gd('C', void 0, void 0);
function Qg(t) {
  return gd('E', void 0, t);
}
function Zg(t) {
  return gd('N', t, void 0);
}
function gd(t, n, e) {
  return { kind: t, value: n, error: e };
}
var or = null;
function Yr(t) {
  if (Yt.useDeprecatedSynchronousErrorHandling) {
    let n = !or;
    if ((n && (or = { errorThrown: !1, error: null }), t(), n)) {
      let { errorThrown: e, error: i } = or;
      if (((or = null), e)) throw i;
    }
  } else t();
}
function Kg(t) {
  Yt.useDeprecatedSynchronousErrorHandling && or && ((or.errorThrown = !0), (or.error = t));
}
var sr = class extends Ce {
    constructor(n) {
      super(),
        (this.isStopped = !1),
        n ? ((this.destination = n), Pa(n) && n.add(this)) : (this.destination = lw);
    }
    static create(n, e, i) {
      return new qn(n, e, i);
    }
    next(n) {
      this.isStopped ? _d(Zg(n), this) : this._next(n);
    }
    error(n) {
      this.isStopped ? _d(Qg(n), this) : ((this.isStopped = !0), this._error(n));
    }
    complete() {
      this.isStopped ? _d(qg, this) : ((this.isStopped = !0), this._complete());
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
  sw = Function.prototype.bind;
function vd(t, n) {
  return sw.call(t, n);
}
var yd = class {
    constructor(n) {
      this.partialObserver = n;
    }
    next(n) {
      let { partialObserver: e } = this;
      if (e.next)
        try {
          e.next(n);
        } catch (i) {
          ka(i);
        }
    }
    error(n) {
      let { partialObserver: e } = this;
      if (e.error)
        try {
          e.error(n);
        } catch (i) {
          ka(i);
        }
      else ka(n);
    }
    complete() {
      let { partialObserver: n } = this;
      if (n.complete)
        try {
          n.complete();
        } catch (e) {
          ka(e);
        }
    }
  },
  qn = class extends sr {
    constructor(n, e, i) {
      super();
      let r;
      if (H(n) || !n) r = { next: n ?? void 0, error: e ?? void 0, complete: i ?? void 0 };
      else {
        let o;
        this && Yt.useDeprecatedNextContext
          ? ((o = Object.create(n)),
            (o.unsubscribe = () => this.unsubscribe()),
            (r = {
              next: n.next && vd(n.next, o),
              error: n.error && vd(n.error, o),
              complete: n.complete && vd(n.complete, o),
            }))
          : (r = n);
      }
      this.destination = new yd(r);
    }
  };
function ka(t) {
  Yt.useDeprecatedSynchronousErrorHandling ? Kg(t) : Fa(t);
}
function aw(t) {
  throw t;
}
function _d(t, n) {
  let { onStoppedNotification: e } = Yt;
  e && Kr.setTimeout(() => e(t, n));
}
var lw = { closed: !0, next: Wn, error: aw, complete: Wn };
var Jr = (typeof Symbol == 'function' && Symbol.observable) || '@@observable';
function pt(t) {
  return t;
}
function bd(...t) {
  return Cd(t);
}
function Cd(t) {
  return t.length === 0
    ? pt
    : t.length === 1
      ? t[0]
      : function (e) {
          return t.reduce((i, r) => r(i), e);
        };
}
var Q = (() => {
  class t {
    constructor(e) {
      e && (this._subscribe = e);
    }
    lift(e) {
      let i = new t();
      return (i.source = this), (i.operator = e), i;
    }
    subscribe(e, i, r) {
      let o = uw(e) ? e : new qn(e, i, r);
      return (
        Yr(() => {
          let { operator: s, source: a } = this;
          o.add(s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o));
        }),
        o
      );
    }
    _trySubscribe(e) {
      try {
        return this._subscribe(e);
      } catch (i) {
        e.error(i);
      }
    }
    forEach(e, i) {
      return (
        (i = Yg(i)),
        new i((r, o) => {
          let s = new qn({
            next: (a) => {
              try {
                e(a);
              } catch (l) {
                o(l), s.unsubscribe();
              }
            },
            error: o,
            complete: r,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(e) {
      var i;
      return (i = this.source) === null || i === void 0 ? void 0 : i.subscribe(e);
    }
    [Jr]() {
      return this;
    }
    pipe(...e) {
      return Cd(e)(this);
    }
    toPromise(e) {
      return (
        (e = Yg(e)),
        new e((i, r) => {
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
  return (t.create = (n) => new t(n)), t;
})();
function Yg(t) {
  var n;
  return (n = t ?? Yt.Promise) !== null && n !== void 0 ? n : Promise;
}
function cw(t) {
  return t && H(t.next) && H(t.error) && H(t.complete);
}
function uw(t) {
  return (t && t instanceof sr) || (cw(t) && Pa(t));
}
function wd(t) {
  return H(t?.lift);
}
function re(t) {
  return (n) => {
    if (wd(n))
      return n.lift(function (e) {
        try {
          return t(e, this);
        } catch (i) {
          this.error(i);
        }
      });
    throw new TypeError('Unable to lift unknown Observable type');
  };
}
function K(t, n, e, i, r) {
  return new Dd(t, n, e, i, r);
}
var Dd = class extends sr {
  constructor(n, e, i, r, o, s) {
    super(n),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = e
        ? function (a) {
            try {
              e(a);
            } catch (l) {
              n.error(l);
            }
          }
        : super._next),
      (this._error = r
        ? function (a) {
            try {
              r(a);
            } catch (l) {
              n.error(l);
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
      let { closed: e } = this;
      super.unsubscribe(), !e && ((n = this.onFinalize) === null || n === void 0 || n.call(this));
    }
  }
};
function Xr() {
  return re((t, n) => {
    let e = null;
    t._refCount++;
    let i = K(n, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        e = null;
        return;
      }
      let r = t._connection,
        o = e;
      (e = null), r && (!o || r === o) && r.unsubscribe(), n.unsubscribe();
    });
    t.subscribe(i), i.closed || (e = t.connect());
  });
}
var eo = class extends Q {
  constructor(n, e) {
    super(),
      (this.source = n),
      (this.subjectFactory = e),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      wd(n) && (this.lift = n.lift);
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
      n = this._connection = new Ce();
      let e = this.getSubject();
      n.add(
        this.source.subscribe(
          K(
            e,
            void 0,
            () => {
              this._teardown(), e.complete();
            },
            (i) => {
              this._teardown(), e.error(i);
            },
            () => this._teardown(),
          ),
        ),
      ),
        n.closed && ((this._connection = null), (n = Ce.EMPTY));
    }
    return n;
  }
  refCount() {
    return Xr()(this);
  }
};
var Jg = Zr(
  (t) =>
    function () {
      t(this), (this.name = 'ObjectUnsubscribedError'), (this.message = 'object unsubscribed');
    },
);
var de = (() => {
    class t extends Q {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(e) {
        let i = new La(this, this);
        return (i.operator = e), i;
      }
      _throwIfClosed() {
        if (this.closed) throw new Jg();
      }
      next(e) {
        Yr(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers || (this.currentObservers = Array.from(this.observers));
            for (let i of this.currentObservers) i.next(e);
          }
        });
      }
      error(e) {
        Yr(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = e);
            let { observers: i } = this;
            for (; i.length; ) i.shift().error(e);
          }
        });
      }
      complete() {
        Yr(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: e } = this;
            for (; e.length; ) e.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null);
      }
      get observed() {
        var e;
        return ((e = this.observers) === null || e === void 0 ? void 0 : e.length) > 0;
      }
      _trySubscribe(e) {
        return this._throwIfClosed(), super._trySubscribe(e);
      }
      _subscribe(e) {
        return this._throwIfClosed(), this._checkFinalizedStatuses(e), this._innerSubscribe(e);
      }
      _innerSubscribe(e) {
        let { hasError: i, isStopped: r, observers: o } = this;
        return i || r
          ? md
          : ((this.currentObservers = null),
            o.push(e),
            new Ce(() => {
              (this.currentObservers = null), rr(o, e);
            }));
      }
      _checkFinalizedStatuses(e) {
        let { hasError: i, thrownError: r, isStopped: o } = this;
        i ? e.error(r) : o && e.complete();
      }
      asObservable() {
        let e = new Q();
        return (e.source = this), e;
      }
    }
    return (t.create = (n, e) => new La(n, e)), t;
  })(),
  La = class extends de {
    constructor(n, e) {
      super(), (this.destination = n), (this.source = e);
    }
    next(n) {
      var e, i;
      (i = (e = this.destination) === null || e === void 0 ? void 0 : e.next) === null ||
        i === void 0 ||
        i.call(e, n);
    }
    error(n) {
      var e, i;
      (i = (e = this.destination) === null || e === void 0 ? void 0 : e.error) === null ||
        i === void 0 ||
        i.call(e, n);
    }
    complete() {
      var n, e;
      (e = (n = this.destination) === null || n === void 0 ? void 0 : n.complete) === null ||
        e === void 0 ||
        e.call(n);
    }
    _subscribe(n) {
      var e, i;
      return (i = (e = this.source) === null || e === void 0 ? void 0 : e.subscribe(n)) !== null &&
        i !== void 0
        ? i
        : md;
    }
  };
var Oe = class extends de {
  constructor(n) {
    super(), (this._value = n);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(n) {
    let e = super._subscribe(n);
    return !e.closed && n.next(this._value), e;
  }
  getValue() {
    let { hasError: n, thrownError: e, _value: i } = this;
    if (n) throw e;
    return this._throwIfClosed(), i;
  }
  next(n) {
    super.next((this._value = n));
  }
};
var ts = {
  now() {
    return (ts.delegate || Date).now();
  },
  delegate: void 0,
};
var ns = class extends de {
  constructor(n = 1 / 0, e = 1 / 0, i = ts) {
    super(),
      (this._bufferSize = n),
      (this._windowTime = e),
      (this._timestampProvider = i),
      (this._buffer = []),
      (this._infiniteTimeWindow = !0),
      (this._infiniteTimeWindow = e === 1 / 0),
      (this._bufferSize = Math.max(1, n)),
      (this._windowTime = Math.max(1, e));
  }
  next(n) {
    let {
      isStopped: e,
      _buffer: i,
      _infiniteTimeWindow: r,
      _timestampProvider: o,
      _windowTime: s,
    } = this;
    e || (i.push(n), !r && i.push(o.now() + s)), this._trimBuffer(), super.next(n);
  }
  _subscribe(n) {
    this._throwIfClosed(), this._trimBuffer();
    let e = this._innerSubscribe(n),
      { _infiniteTimeWindow: i, _buffer: r } = this,
      o = r.slice();
    for (let s = 0; s < o.length && !n.closed; s += i ? 1 : 2) n.next(o[s]);
    return this._checkFinalizedStatuses(n), e;
  }
  _trimBuffer() {
    let { _bufferSize: n, _timestampProvider: e, _buffer: i, _infiniteTimeWindow: r } = this,
      o = (r ? 1 : 2) * n;
    if ((n < 1 / 0 && o < i.length && i.splice(0, i.length - o), !r)) {
      let s = e.now(),
        a = 0;
      for (let l = 1; l < i.length && i[l] <= s; l += 2) a = l;
      a && i.splice(0, a + 1);
    }
  }
};
var Va = class extends Ce {
  constructor(n, e) {
    super();
  }
  schedule(n, e = 0) {
    return this;
  }
};
var is = {
  setInterval(t, n, ...e) {
    let { delegate: i } = is;
    return i?.setInterval ? i.setInterval(t, n, ...e) : setInterval(t, n, ...e);
  },
  clearInterval(t) {
    let { delegate: n } = is;
    return (n?.clearInterval || clearInterval)(t);
  },
  delegate: void 0,
};
var ja = class extends Va {
  constructor(n, e) {
    super(n, e), (this.scheduler = n), (this.work = e), (this.pending = !1);
  }
  schedule(n, e = 0) {
    var i;
    if (this.closed) return this;
    this.state = n;
    let r = this.id,
      o = this.scheduler;
    return (
      r != null && (this.id = this.recycleAsyncId(o, r, e)),
      (this.pending = !0),
      (this.delay = e),
      (this.id = (i = this.id) !== null && i !== void 0 ? i : this.requestAsyncId(o, this.id, e)),
      this
    );
  }
  requestAsyncId(n, e, i = 0) {
    return is.setInterval(n.flush.bind(n, this), i);
  }
  recycleAsyncId(n, e, i = 0) {
    if (i != null && this.delay === i && this.pending === !1) return e;
    e != null && is.clearInterval(e);
  }
  execute(n, e) {
    if (this.closed) return new Error('executing a cancelled action');
    this.pending = !1;
    let i = this._execute(n, e);
    if (i) return i;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(n, e) {
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
      let { id: n, scheduler: e } = this,
        { actions: i } = e;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        rr(i, this),
        n != null && (this.id = this.recycleAsyncId(e, n, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var to = class t {
  constructor(n, e = t.now) {
    (this.schedulerActionCtor = n), (this.now = e);
  }
  schedule(n, e = 0, i) {
    return new this.schedulerActionCtor(this, n).schedule(i, e);
  }
};
to.now = ts.now;
var Ba = class extends to {
  constructor(n, e = to.now) {
    super(n, e), (this.actions = []), (this._active = !1);
  }
  flush(n) {
    let { actions: e } = this;
    if (this._active) {
      e.push(n);
      return;
    }
    let i;
    this._active = !0;
    do if ((i = n.execute(n.state, n.delay))) break;
    while ((n = e.shift()));
    if (((this._active = !1), i)) {
      for (; (n = e.shift()); ) n.unsubscribe();
      throw i;
    }
  }
};
var Sd = new Ba(ja),
  Xg = Sd;
var mt = new Q((t) => t.complete());
function Ua(t) {
  return t && H(t.schedule);
}
function e0(t) {
  return t[t.length - 1];
}
function no(t) {
  return H(e0(t)) ? t.pop() : void 0;
}
function mi(t) {
  return Ua(e0(t)) ? t.pop() : void 0;
}
function n0(t, n, e, i) {
  function r(o) {
    return o instanceof e
      ? o
      : new e(function (s) {
          s(o);
        });
  }
  return new (e || (e = Promise))(function (o, s) {
    function a(f) {
      try {
        c(i.next(f));
      } catch (p) {
        s(p);
      }
    }
    function l(f) {
      try {
        c(i.throw(f));
      } catch (p) {
        s(p);
      }
    }
    function c(f) {
      f.done ? o(f.value) : r(f.value).then(a, l);
    }
    c((i = i.apply(t, n || [])).next());
  });
}
function t0(t) {
  var n = typeof Symbol == 'function' && Symbol.iterator,
    e = n && t[n],
    i = 0;
  if (e) return e.call(t);
  if (t && typeof t.length == 'number')
    return {
      next: function () {
        return t && i >= t.length && (t = void 0), { value: t && t[i++], done: !t };
      },
    };
  throw new TypeError(n ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
}
function ar(t) {
  return this instanceof ar ? ((this.v = t), this) : new ar(t);
}
function i0(t, n, e) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var i = e.apply(t, n || []),
    r,
    o = [];
  return (
    (r = {}),
    s('next'),
    s('throw'),
    s('return'),
    (r[Symbol.asyncIterator] = function () {
      return this;
    }),
    r
  );
  function s(g) {
    i[g] &&
      (r[g] = function (m) {
        return new Promise(function (v, _) {
          o.push([g, m, v, _]) > 1 || a(g, m);
        });
      });
  }
  function a(g, m) {
    try {
      l(i[g](m));
    } catch (v) {
      p(o[0][3], v);
    }
  }
  function l(g) {
    g.value instanceof ar ? Promise.resolve(g.value.v).then(c, f) : p(o[0][2], g);
  }
  function c(g) {
    a('next', g);
  }
  function f(g) {
    a('throw', g);
  }
  function p(g, m) {
    g(m), o.shift(), o.length && a(o[0][0], o[0][1]);
  }
}
function r0(t) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var n = t[Symbol.asyncIterator],
    e;
  return n
    ? n.call(t)
    : ((t = typeof t0 == 'function' ? t0(t) : t[Symbol.iterator]()),
      (e = {}),
      i('next'),
      i('throw'),
      i('return'),
      (e[Symbol.asyncIterator] = function () {
        return this;
      }),
      e);
  function i(o) {
    e[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, l) {
          (s = t[o](s)), r(a, l, s.done, s.value);
        });
      };
  }
  function r(o, s, a, l) {
    Promise.resolve(l).then(function (c) {
      o({ value: c, done: a });
    }, s);
  }
}
var io = (t) => t && typeof t.length == 'number' && typeof t != 'function';
function $a(t) {
  return H(t?.then);
}
function Ha(t) {
  return H(t[Jr]);
}
function Ga(t) {
  return Symbol.asyncIterator && H(t?.[Symbol.asyncIterator]);
}
function za(t) {
  return new TypeError(
    `You provided ${t !== null && typeof t == 'object' ? 'an invalid object' : `'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function dw() {
  return typeof Symbol != 'function' || !Symbol.iterator ? '@@iterator' : Symbol.iterator;
}
var Wa = dw();
function qa(t) {
  return H(t?.[Wa]);
}
function Qa(t) {
  return i0(this, arguments, function* () {
    let e = t.getReader();
    try {
      for (;;) {
        let { value: i, done: r } = yield ar(e.read());
        if (r) return yield ar(void 0);
        yield yield ar(i);
      }
    } finally {
      e.releaseLock();
    }
  });
}
function Za(t) {
  return H(t?.getReader);
}
function he(t) {
  if (t instanceof Q) return t;
  if (t != null) {
    if (Ha(t)) return fw(t);
    if (io(t)) return hw(t);
    if ($a(t)) return pw(t);
    if (Ga(t)) return o0(t);
    if (qa(t)) return mw(t);
    if (Za(t)) return gw(t);
  }
  throw za(t);
}
function fw(t) {
  return new Q((n) => {
    let e = t[Jr]();
    if (H(e.subscribe)) return e.subscribe(n);
    throw new TypeError('Provided object does not correctly implement Symbol.observable');
  });
}
function hw(t) {
  return new Q((n) => {
    for (let e = 0; e < t.length && !n.closed; e++) n.next(t[e]);
    n.complete();
  });
}
function pw(t) {
  return new Q((n) => {
    t.then(
      (e) => {
        n.closed || (n.next(e), n.complete());
      },
      (e) => n.error(e),
    ).then(null, Fa);
  });
}
function mw(t) {
  return new Q((n) => {
    for (let e of t) if ((n.next(e), n.closed)) return;
    n.complete();
  });
}
function o0(t) {
  return new Q((n) => {
    vw(t, n).catch((e) => n.error(e));
  });
}
function gw(t) {
  return o0(Qa(t));
}
function vw(t, n) {
  var e, i, r, o;
  return n0(this, void 0, void 0, function* () {
    try {
      for (e = r0(t); (i = yield e.next()), !i.done; ) {
        let s = i.value;
        if ((n.next(s), n.closed)) return;
      }
    } catch (s) {
      r = { error: s };
    } finally {
      try {
        i && !i.done && (o = e.return) && (yield o.call(e));
      } finally {
        if (r) throw r.error;
      }
    }
    n.complete();
  });
}
function wt(t, n, e, i = 0, r = !1) {
  let o = n.schedule(function () {
    e(), r ? t.add(this.schedule(null, i)) : this.unsubscribe();
  }, i);
  if ((t.add(o), !r)) return o;
}
function Ka(t, n = 0) {
  return re((e, i) => {
    e.subscribe(
      K(
        i,
        (r) => wt(i, t, () => i.next(r), n),
        () => wt(i, t, () => i.complete(), n),
        (r) => wt(i, t, () => i.error(r), n),
      ),
    );
  });
}
function Ya(t, n = 0) {
  return re((e, i) => {
    i.add(t.schedule(() => e.subscribe(i), n));
  });
}
function s0(t, n) {
  return he(t).pipe(Ya(n), Ka(n));
}
function a0(t, n) {
  return he(t).pipe(Ya(n), Ka(n));
}
function l0(t, n) {
  return new Q((e) => {
    let i = 0;
    return n.schedule(function () {
      i === t.length ? e.complete() : (e.next(t[i++]), e.closed || this.schedule());
    });
  });
}
function c0(t, n) {
  return new Q((e) => {
    let i;
    return (
      wt(e, n, () => {
        (i = t[Wa]()),
          wt(
            e,
            n,
            () => {
              let r, o;
              try {
                ({ value: r, done: o } = i.next());
              } catch (s) {
                e.error(s);
                return;
              }
              o ? e.complete() : e.next(r);
            },
            0,
            !0,
          );
      }),
      () => H(i?.return) && i.return()
    );
  });
}
function Ja(t, n) {
  if (!t) throw new Error('Iterable cannot be null');
  return new Q((e) => {
    wt(e, n, () => {
      let i = t[Symbol.asyncIterator]();
      wt(
        e,
        n,
        () => {
          i.next().then((r) => {
            r.done ? e.complete() : e.next(r.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function u0(t, n) {
  return Ja(Qa(t), n);
}
function d0(t, n) {
  if (t != null) {
    if (Ha(t)) return s0(t, n);
    if (io(t)) return l0(t, n);
    if ($a(t)) return a0(t, n);
    if (Ga(t)) return Ja(t, n);
    if (qa(t)) return c0(t, n);
    if (Za(t)) return u0(t, n);
  }
  throw za(t);
}
function Me(t, n) {
  return n ? d0(t, n) : he(t);
}
function L(...t) {
  let n = mi(t);
  return Me(t, n);
}
function ro(t, n) {
  let e = H(t) ? t : () => t,
    i = (r) => r.error(e());
  return new Q(n ? (r) => n.schedule(i, 0, r) : i);
}
function vn(t) {
  return !!t && (t instanceof Q || (H(t.lift) && H(t.subscribe)));
}
var Qn = Zr(
  (t) =>
    function () {
      t(this), (this.name = 'EmptyError'), (this.message = 'no elements in sequence');
    },
);
function f0(t) {
  return t instanceof Date && !isNaN(t);
}
function z(t, n) {
  return re((e, i) => {
    let r = 0;
    e.subscribe(
      K(i, (o) => {
        i.next(t.call(n, o, r++));
      }),
    );
  });
}
var { isArray: _w } = Array;
function yw(t, n) {
  return _w(n) ? t(...n) : t(n);
}
function oo(t) {
  return z((n) => yw(t, n));
}
var { isArray: bw } = Array,
  { getPrototypeOf: Cw, prototype: ww, keys: Dw } = Object;
function Xa(t) {
  if (t.length === 1) {
    let n = t[0];
    if (bw(n)) return { args: n, keys: null };
    if (Sw(n)) {
      let e = Dw(n);
      return { args: e.map((i) => n[i]), keys: e };
    }
  }
  return { args: t, keys: null };
}
function Sw(t) {
  return t && typeof t == 'object' && Cw(t) === ww;
}
function el(t, n) {
  return t.reduce((e, i, r) => ((e[i] = n[r]), e), {});
}
function rs(...t) {
  let n = mi(t),
    e = no(t),
    { args: i, keys: r } = Xa(t);
  if (i.length === 0) return Me([], n);
  let o = new Q(Ew(i, n, r ? (s) => el(r, s) : pt));
  return e ? o.pipe(oo(e)) : o;
}
function Ew(t, n, e = pt) {
  return (i) => {
    h0(
      n,
      () => {
        let { length: r } = t,
          o = new Array(r),
          s = r,
          a = r;
        for (let l = 0; l < r; l++)
          h0(
            n,
            () => {
              let c = Me(t[l], n),
                f = !1;
              c.subscribe(
                K(
                  i,
                  (p) => {
                    (o[l] = p), f || ((f = !0), a--), a || i.next(e(o.slice()));
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
function h0(t, n, e) {
  t ? wt(e, t, n) : n();
}
function p0(t, n, e, i, r, o, s, a) {
  let l = [],
    c = 0,
    f = 0,
    p = !1,
    g = () => {
      p && !l.length && !c && n.complete();
    },
    m = (_) => (c < i ? v(_) : l.push(_)),
    v = (_) => {
      o && n.next(_), c++;
      let C = !1;
      he(e(_, f++)).subscribe(
        K(
          n,
          (S) => {
            r?.(S), o ? m(S) : n.next(S);
          },
          () => {
            C = !0;
          },
          void 0,
          () => {
            if (C)
              try {
                for (c--; l.length && c < i; ) {
                  let S = l.shift();
                  s ? wt(n, s, () => v(S)) : v(S);
                }
                g();
              } catch (S) {
                n.error(S);
              }
          },
        ),
      );
    };
  return (
    t.subscribe(
      K(n, m, () => {
        (p = !0), g();
      }),
    ),
    () => {
      a?.();
    }
  );
}
function De(t, n, e = 1 / 0) {
  return H(n)
    ? De((i, r) => z((o, s) => n(i, o, r, s))(he(t(i, r))), e)
    : (typeof n == 'number' && (e = n), re((i, r) => p0(i, r, t, e)));
}
function Ed(t = 1 / 0) {
  return De(pt, t);
}
function m0() {
  return Ed(1);
}
function Mt(...t) {
  return m0()(Me(t, mi(t)));
}
function lr(t) {
  return new Q((n) => {
    he(t()).subscribe(n);
  });
}
function os(...t) {
  let n = no(t),
    { args: e, keys: i } = Xa(t),
    r = new Q((o) => {
      let { length: s } = e;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        l = s,
        c = s;
      for (let f = 0; f < s; f++) {
        let p = !1;
        he(e[f]).subscribe(
          K(
            o,
            (g) => {
              p || ((p = !0), c--), (a[f] = g);
            },
            () => l--,
            void 0,
            () => {
              (!l || !p) && (c || o.next(i ? el(i, a) : a), o.complete());
            },
          ),
        );
      }
    });
  return n ? r.pipe(oo(n)) : r;
}
var Tw = ['addListener', 'removeListener'],
  Mw = ['addEventListener', 'removeEventListener'],
  Iw = ['on', 'off'];
function _n(t, n, e, i) {
  if ((H(e) && ((i = e), (e = void 0)), i)) return _n(t, n, e).pipe(oo(i));
  let [r, o] = Aw(t)
    ? Mw.map((s) => (a) => t[s](n, a, e))
    : xw(t)
      ? Tw.map(g0(t, n))
      : Nw(t)
        ? Iw.map(g0(t, n))
        : [];
  if (!r && io(t)) return De((s) => _n(s, n, e))(he(t));
  if (!r) throw new TypeError('Invalid event target');
  return new Q((s) => {
    let a = (...l) => s.next(1 < l.length ? l : l[0]);
    return r(a), () => o(a);
  });
}
function g0(t, n) {
  return (e) => (i) => t[e](n, i);
}
function xw(t) {
  return H(t.addListener) && H(t.removeListener);
}
function Nw(t) {
  return H(t.on) && H(t.off);
}
function Aw(t) {
  return H(t.addEventListener) && H(t.removeEventListener);
}
function ss(t = 0, n, e = Xg) {
  let i = -1;
  return (
    n != null && (Ua(n) ? (e = n) : (i = n)),
    new Q((r) => {
      let o = f0(t) ? +t - e.now() : t;
      o < 0 && (o = 0);
      let s = 0;
      return e.schedule(function () {
        r.closed || (r.next(s++), 0 <= i ? this.schedule(void 0, i) : r.complete());
      }, o);
    })
  );
}
var { isArray: Ow } = Array;
function v0(t) {
  return t.length === 1 && Ow(t[0]) ? t[0] : t;
}
function tt(t, n) {
  return re((e, i) => {
    let r = 0;
    e.subscribe(K(i, (o) => t.call(n, o, r++) && i.next(o)));
  });
}
function tl(...t) {
  return (t = v0(t)), t.length === 1 ? he(t[0]) : new Q(Rw(t));
}
function Rw(t) {
  return (n) => {
    let e = [];
    for (let i = 0; e && !n.closed && i < t.length; i++)
      e.push(
        he(t[i]).subscribe(
          K(n, (r) => {
            if (e) {
              for (let o = 0; o < e.length; o++) o !== i && e[o].unsubscribe();
              e = null;
            }
            n.next(r);
          }),
        ),
      );
  };
}
function gi(t) {
  return re((n, e) => {
    let i = null,
      r = !1,
      o;
    (i = n.subscribe(
      K(e, void 0, void 0, (s) => {
        (o = he(t(s, gi(t)(n)))), i ? (i.unsubscribe(), (i = null), o.subscribe(e)) : (r = !0);
      }),
    )),
      r && (i.unsubscribe(), (i = null), o.subscribe(e));
  });
}
function _0(t, n, e, i, r) {
  return (o, s) => {
    let a = e,
      l = n,
      c = 0;
    o.subscribe(
      K(
        s,
        (f) => {
          let p = c++;
          (l = a ? t(l, f, p) : ((a = !0), f)), i && s.next(l);
        },
        r &&
          (() => {
            a && s.next(l), s.complete();
          }),
      ),
    );
  };
}
function yn(t, n) {
  return H(n) ? De(t, n, 1) : De(t, 1);
}
function vi(t) {
  return re((n, e) => {
    let i = !1;
    n.subscribe(
      K(
        e,
        (r) => {
          (i = !0), e.next(r);
        },
        () => {
          i || e.next(t), e.complete();
        },
      ),
    );
  });
}
function Re(t) {
  return t <= 0
    ? () => mt
    : re((n, e) => {
        let i = 0;
        n.subscribe(
          K(e, (r) => {
            ++i <= t && (e.next(r), t <= i && e.complete());
          }),
        );
      });
}
function y0() {
  return re((t, n) => {
    t.subscribe(K(n, Wn));
  });
}
function as(t) {
  return z(() => t);
}
function Td(t, n) {
  return n
    ? (e) => Mt(n.pipe(Re(1), y0()), e.pipe(Td(t)))
    : De((e, i) => he(t(e, i)).pipe(Re(1), as(e)));
}
function Md(t, n = Sd) {
  let e = ss(t, n);
  return Td(() => e);
}
function nl(t = Pw) {
  return re((n, e) => {
    let i = !1;
    n.subscribe(
      K(
        e,
        (r) => {
          (i = !0), e.next(r);
        },
        () => (i ? e.complete() : e.error(t())),
      ),
    );
  });
}
function Pw() {
  return new Qn();
}
function Id(...t) {
  return (n) => Mt(n, L(...t));
}
function _i(t) {
  return re((n, e) => {
    try {
      n.subscribe(e);
    } finally {
      e.add(t);
    }
  });
}
function bn(t, n) {
  let e = arguments.length >= 2;
  return (i) => i.pipe(t ? tt((r, o) => t(r, o, i)) : pt, Re(1), e ? vi(n) : nl(() => new Qn()));
}
function so(t) {
  return t <= 0
    ? () => mt
    : re((n, e) => {
        let i = [];
        n.subscribe(
          K(
            e,
            (r) => {
              i.push(r), t < i.length && i.shift();
            },
            () => {
              for (let r of i) e.next(r);
              e.complete();
            },
            void 0,
            () => {
              i = null;
            },
          ),
        );
      });
}
function xd(t, n) {
  let e = arguments.length >= 2;
  return (i) => i.pipe(t ? tt((r, o) => t(r, o, i)) : pt, so(1), e ? vi(n) : nl(() => new Qn()));
}
function Nd(t, n) {
  return re(_0(t, n, arguments.length >= 2, !0));
}
function b0(t = {}) {
  let {
    connector: n = () => new de(),
    resetOnError: e = !0,
    resetOnComplete: i = !0,
    resetOnRefCountZero: r = !0,
  } = t;
  return (o) => {
    let s,
      a,
      l,
      c = 0,
      f = !1,
      p = !1,
      g = () => {
        a?.unsubscribe(), (a = void 0);
      },
      m = () => {
        g(), (s = l = void 0), (f = p = !1);
      },
      v = () => {
        let _ = s;
        m(), _?.unsubscribe();
      };
    return re((_, C) => {
      c++, !p && !f && g();
      let S = (l = l ?? n());
      C.add(() => {
        c--, c === 0 && !p && !f && (a = Ad(v, r));
      }),
        S.subscribe(C),
        !s &&
          c > 0 &&
          ((s = new qn({
            next: (O) => S.next(O),
            error: (O) => {
              (p = !0), g(), (a = Ad(m, e, O)), S.error(O);
            },
            complete: () => {
              (f = !0), g(), (a = Ad(m, i)), S.complete();
            },
          })),
          he(_).subscribe(s));
    })(o);
  };
}
function Ad(t, n, ...e) {
  if (n === !0) {
    t();
    return;
  }
  if (n === !1) return;
  let i = new qn({
    next: () => {
      i.unsubscribe(), t();
    },
  });
  return he(n(...e)).subscribe(i);
}
function il(t, n, e) {
  let i,
    r = !1;
  return (
    t && typeof t == 'object'
      ? ({ bufferSize: i = 1 / 0, windowTime: n = 1 / 0, refCount: r = !1, scheduler: e } = t)
      : (i = t ?? 1 / 0),
    b0({
      connector: () => new ns(i, n, e),
      resetOnError: !0,
      resetOnComplete: !1,
      resetOnRefCountZero: r,
    })
  );
}
function rl(...t) {
  let n = mi(t);
  return re((e, i) => {
    (n ? Mt(t, e, n) : Mt(t, e)).subscribe(i);
  });
}
function nt(t, n) {
  return re((e, i) => {
    let r = null,
      o = 0,
      s = !1,
      a = () => s && !r && i.complete();
    e.subscribe(
      K(
        i,
        (l) => {
          r?.unsubscribe();
          let c = 0,
            f = o++;
          he(t(l, f)).subscribe(
            (r = K(
              i,
              (p) => i.next(n ? n(l, p, f, c++) : p),
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
function Vt(t) {
  return re((n, e) => {
    he(t).subscribe(K(e, () => e.complete(), Wn)), !e.closed && n.subscribe(e);
  });
}
function Pe(t, n, e) {
  let i = H(t) || n || e ? { next: t, error: n, complete: e } : t;
  return i
    ? re((r, o) => {
        var s;
        (s = i.subscribe) === null || s === void 0 || s.call(i);
        let a = !0;
        r.subscribe(
          K(
            o,
            (l) => {
              var c;
              (c = i.next) === null || c === void 0 || c.call(i, l), o.next(l);
            },
            () => {
              var l;
              (a = !1), (l = i.complete) === null || l === void 0 || l.call(i), o.complete();
            },
            (l) => {
              var c;
              (a = !1), (c = i.error) === null || c === void 0 || c.call(i, l), o.error(l);
            },
            () => {
              var l, c;
              a && ((l = i.unsubscribe) === null || l === void 0 || l.call(i)),
                (c = i.finalize) === null || c === void 0 || c.call(i);
            },
          ),
        );
      })
    : pt;
}
function Od(...t) {
  let n = no(t);
  return re((e, i) => {
    let r = t.length,
      o = new Array(r),
      s = t.map(() => !1),
      a = !1;
    for (let l = 0; l < r; l++)
      he(t[l]).subscribe(
        K(
          i,
          (c) => {
            (o[l] = c), !a && !s[l] && ((s[l] = !0), (a = s.every(pt)) && (s = null));
          },
          Wn,
        ),
      );
    e.subscribe(
      K(i, (l) => {
        if (a) {
          let c = [l, ...o];
          i.next(n ? n(...c) : c);
        }
      }),
    );
  });
}
var c1 = 'https://g.co/ng/security#xss',
  T = class extends Error {
    constructor(n, e) {
      super(Ul(n, e)), (this.code = n);
    }
  };
function Ul(t, n) {
  return `${`NG0${Math.abs(t)}`}${n ? ': ' + n : ''}`;
}
function ys(t) {
  return { toString: t }.toString();
}
var ol = '__parameters__';
function Fw(t) {
  return function (...e) {
    if (t) {
      let i = t(...e);
      for (let r in i) this[r] = i[r];
    }
  };
}
function u1(t, n, e) {
  return ys(() => {
    let i = Fw(n);
    function r(...o) {
      if (this instanceof r) return i.apply(this, o), this;
      let s = new r(...o);
      return (a.annotation = s), a;
      function a(l, c, f) {
        let p = l.hasOwnProperty(ol) ? l[ol] : Object.defineProperty(l, ol, { value: [] })[ol];
        for (; p.length <= f; ) p.push(null);
        return (p[f] = p[f] || []).push(s), l;
      }
    }
    return (
      e && (r.prototype = Object.create(e.prototype)),
      (r.prototype.ngMetadataName = t),
      (r.annotationCls = r),
      r
    );
  });
}
var us = globalThis;
function be(t) {
  for (let n in t) if (t[n] === be) return n;
  throw Error('Could not find renamed property on target object.');
}
function kw(t, n) {
  for (let e in n) n.hasOwnProperty(e) && !t.hasOwnProperty(e) && (t[e] = n[e]);
}
function gt(t) {
  if (typeof t == 'string') return t;
  if (Array.isArray(t)) return '[' + t.map(gt).join(', ') + ']';
  if (t == null) return '' + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let n = t.toString();
  if (n == null) return '' + n;
  let e = n.indexOf(`
`);
  return e === -1 ? n : n.substring(0, e);
}
function Wd(t, n) {
  return t == null || t === '' ? (n === null ? '' : n) : n == null || n === '' ? t : t + ' ' + n;
}
var Lw = be({ __forward_ref__: be });
function nn(t) {
  return (
    (t.__forward_ref__ = nn),
    (t.toString = function () {
      return gt(this());
    }),
    t
  );
}
function it(t) {
  return d1(t) ? t() : t;
}
function d1(t) {
  return typeof t == 'function' && t.hasOwnProperty(Lw) && t.__forward_ref__ === nn;
}
function M(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function dt(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function $l(t) {
  return C0(t, h1) || C0(t, p1);
}
function f1(t) {
  return $l(t) !== null;
}
function C0(t, n) {
  return t.hasOwnProperty(n) ? t[n] : null;
}
function Vw(t) {
  let n = t && (t[h1] || t[p1]);
  return n || null;
}
function w0(t) {
  return t && (t.hasOwnProperty(D0) || t.hasOwnProperty(jw)) ? t[D0] : null;
}
var h1 = be({ ɵprov: be }),
  D0 = be({ ɵinj: be }),
  p1 = be({ ngInjectableDef: be }),
  jw = be({ ngInjectorDef: be }),
  F = class {
    constructor(n, e) {
      (this._desc = n),
        (this.ngMetadataName = 'InjectionToken'),
        (this.ɵprov = void 0),
        typeof e == 'number'
          ? (this.__NG_ELEMENT_ID__ = e)
          : e !== void 0 &&
            (this.ɵprov = M({
              token: this,
              providedIn: e.providedIn || 'root',
              factory: e.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function m1(t) {
  return t && !!t.ɵproviders;
}
var Bw = be({ ɵcmp: be }),
  Uw = be({ ɵdir: be }),
  $w = be({ ɵpipe: be }),
  Hw = be({ ɵmod: be }),
  _l = be({ ɵfac: be }),
  cs = be({ __NG_ELEMENT_ID__: be }),
  S0 = be({ __NG_ENV_ID__: be });
function Hl(t) {
  return typeof t == 'string' ? t : t == null ? '' : String(t);
}
function Gw(t) {
  return typeof t == 'function'
    ? t.name || t.toString()
    : typeof t == 'object' && t != null && typeof t.type == 'function'
      ? t.type.name || t.type.toString()
      : Hl(t);
}
function zw(t, n) {
  let e = n ? `. Dependency path: ${n.join(' > ')} > ${t}` : '';
  throw new T(-200, t);
}
function Kf(t, n) {
  throw new T(-201, !1);
}
var ae = (function (t) {
    return (
      (t[(t.Default = 0)] = 'Default'),
      (t[(t.Host = 1)] = 'Host'),
      (t[(t.Self = 2)] = 'Self'),
      (t[(t.SkipSelf = 4)] = 'SkipSelf'),
      (t[(t.Optional = 8)] = 'Optional'),
      t
    );
  })(ae || {}),
  qd;
function g1() {
  return qd;
}
function jt(t) {
  let n = qd;
  return (qd = t), n;
}
function v1(t, n, e) {
  let i = $l(t);
  if (i && i.providedIn == 'root') return i.value === void 0 ? (i.value = i.factory()) : i.value;
  if (e & ae.Optional) return null;
  if (n !== void 0) return n;
  Kf(t, 'Injector');
}
var Ww = {},
  ds = Ww,
  Qd = '__NG_DI_FLAG__',
  yl = 'ngTempTokenPath',
  qw = 'ngTokenPath',
  Qw = /\n/gm,
  Zw = '\u0275',
  E0 = '__source',
  uo;
function Kw() {
  return uo;
}
function yi(t) {
  let n = uo;
  return (uo = t), n;
}
function Yw(t, n = ae.Default) {
  if (uo === void 0) throw new T(-203, !1);
  return uo === null ? v1(t, void 0, n) : uo.get(t, n & ae.Optional ? null : void 0, n);
}
function N(t, n = ae.Default) {
  return (g1() || Yw)(it(t), n);
}
function y(t, n = ae.Default) {
  return N(t, Gl(n));
}
function Gl(t) {
  return typeof t > 'u' || typeof t == 'number'
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function Zd(t) {
  let n = [];
  for (let e = 0; e < t.length; e++) {
    let i = it(t[e]);
    if (Array.isArray(i)) {
      if (i.length === 0) throw new T(900, !1);
      let r,
        o = ae.Default;
      for (let s = 0; s < i.length; s++) {
        let a = i[s],
          l = Jw(a);
        typeof l == 'number' ? (l === -1 ? (r = a.token) : (o |= l)) : (r = a);
      }
      n.push(N(r, o));
    } else n.push(N(i));
  }
  return n;
}
function _1(t, n) {
  return (t[Qd] = n), (t.prototype[Qd] = n), t;
}
function Jw(t) {
  return t[Qd];
}
function Xw(t, n, e, i) {
  let r = t[yl];
  throw (
    (n[E0] && r.unshift(n[E0]),
    (t.message = eD(
      `
` + t.message,
      r,
      e,
      i,
    )),
    (t[qw] = r),
    (t[yl] = null),
    t)
  );
}
function eD(t, n, e, i = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == Zw
      ? t.slice(2)
      : t;
  let r = gt(n);
  if (Array.isArray(n)) r = n.map(gt).join(' -> ');
  else if (typeof n == 'object') {
    let o = [];
    for (let s in n)
      if (n.hasOwnProperty(s)) {
        let a = n[s];
        o.push(s + ':' + (typeof a == 'string' ? JSON.stringify(a) : gt(a)));
      }
    r = `{${o.join(', ')}}`;
  }
  return `${e}${i ? '(' + i + ')' : ''}[${r}]: ${t.replace(
    Qw,
    `
  `,
  )}`;
}
var Yf = _1(u1('Optional'), 8);
var y1 = _1(u1('SkipSelf'), 4);
function ho(t, n) {
  let e = t.hasOwnProperty(_l);
  return e ? t[_l] : null;
}
function tD(t, n, e) {
  if (t.length !== n.length) return !1;
  for (let i = 0; i < t.length; i++) {
    let r = t[i],
      o = n[i];
    if ((e && ((r = e(r)), (o = e(o))), o !== r)) return !1;
  }
  return !0;
}
function nD(t) {
  return t.flat(Number.POSITIVE_INFINITY);
}
function Jf(t, n) {
  t.forEach((e) => (Array.isArray(e) ? Jf(e, n) : n(e)));
}
function b1(t, n, e) {
  n >= t.length ? t.push(e) : t.splice(n, 0, e);
}
function bl(t, n) {
  return n >= t.length - 1 ? t.pop() : t.splice(n, 1)[0];
}
function iD(t, n, e, i) {
  let r = t.length;
  if (r == n) t.push(e, i);
  else if (r === 1) t.push(i, t[0]), (t[0] = e);
  else {
    for (r--, t.push(t[r - 1], t[r]); r > n; ) {
      let o = r - 2;
      (t[r] = t[o]), r--;
    }
    (t[n] = e), (t[n + 1] = i);
  }
}
function Xf(t, n, e) {
  let i = bs(t, n);
  return i >= 0 ? (t[i | 1] = e) : ((i = ~i), iD(t, i, n, e)), i;
}
function Rd(t, n) {
  let e = bs(t, n);
  if (e >= 0) return t[e | 1];
}
function bs(t, n) {
  return rD(t, n, 1);
}
function rD(t, n, e) {
  let i = 0,
    r = t.length >> e;
  for (; r !== i; ) {
    let o = i + ((r - i) >> 1),
      s = t[o << e];
    if (n === s) return o << e;
    s > n ? (r = o) : (i = o + 1);
  }
  return ~(r << e);
}
var Zn = {},
  Dt = [],
  po = new F(''),
  C1 = new F('', -1),
  w1 = new F(''),
  Cl = class {
    get(n, e = ds) {
      if (e === ds) {
        let i = new Error(`NullInjectorError: No provider for ${gt(n)}!`);
        throw ((i.name = 'NullInjectorError'), i);
      }
      return e;
    }
  },
  D1 = (function (t) {
    return (t[(t.OnPush = 0)] = 'OnPush'), (t[(t.Default = 1)] = 'Default'), t;
  })(D1 || {}),
  Dn = (function (t) {
    return (
      (t[(t.Emulated = 0)] = 'Emulated'),
      (t[(t.None = 2)] = 'None'),
      (t[(t.ShadowDom = 3)] = 'ShadowDom'),
      t
    );
  })(Dn || {}),
  wi = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'),
      (t[(t.SignalBased = 1)] = 'SignalBased'),
      (t[(t.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
      t
    );
  })(wi || {});
function oD(t, n, e) {
  let i = t.length;
  for (;;) {
    let r = t.indexOf(n, e);
    if (r === -1) return r;
    if (r === 0 || t.charCodeAt(r - 1) <= 32) {
      let o = n.length;
      if (r + o === i || t.charCodeAt(r + o) <= 32) return r;
    }
    e = r + 1;
  }
}
function Kd(t, n, e) {
  let i = 0;
  for (; i < e.length; ) {
    let r = e[i];
    if (typeof r == 'number') {
      if (r !== 0) break;
      i++;
      let o = e[i++],
        s = e[i++],
        a = e[i++];
      t.setAttribute(n, s, a, o);
    } else {
      let o = r,
        s = e[++i];
      aD(o) ? t.setProperty(n, o, s) : t.setAttribute(n, o, s), i++;
    }
  }
  return i;
}
function sD(t) {
  return t === 3 || t === 4 || t === 6;
}
function aD(t) {
  return t.charCodeAt(0) === 64;
}
function fs(t, n) {
  if (!(n === null || n.length === 0))
    if (t === null || t.length === 0) t = n.slice();
    else {
      let e = -1;
      for (let i = 0; i < n.length; i++) {
        let r = n[i];
        typeof r == 'number'
          ? (e = r)
          : e === 0 || (e === -1 || e === 2 ? T0(t, e, r, null, n[++i]) : T0(t, e, r, null, null));
      }
    }
  return t;
}
function T0(t, n, e, i, r) {
  let o = 0,
    s = t.length;
  if (n === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
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
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == 'number') break;
    if (a === e) {
      if (i === null) {
        r !== null && (t[o + 1] = r);
        return;
      } else if (i === t[o + 1]) {
        t[o + 2] = r;
        return;
      }
    }
    o++, i !== null && o++, r !== null && o++;
  }
  s !== -1 && (t.splice(s, 0, n), (o = s + 1)),
    t.splice(o++, 0, e),
    i !== null && t.splice(o++, 0, i),
    r !== null && t.splice(o++, 0, r);
}
var S1 = 'ng-template';
function lD(t, n, e, i) {
  let r = 0;
  if (i) {
    for (; r < n.length && typeof n[r] == 'string'; r += 2)
      if (n[r] === 'class' && oD(n[r + 1].toLowerCase(), e, 0) !== -1) return !0;
  } else if (eh(t)) return !1;
  if (((r = n.indexOf(1, r)), r > -1)) {
    let o;
    for (; ++r < n.length && typeof (o = n[r]) == 'string'; ) if (o.toLowerCase() === e) return !0;
  }
  return !1;
}
function eh(t) {
  return t.type === 4 && t.value !== S1;
}
function cD(t, n, e) {
  let i = t.type === 4 && !e ? S1 : t.value;
  return n === i;
}
function uD(t, n, e) {
  let i = 4,
    r = t.attrs,
    o = r !== null ? hD(r) : 0,
    s = !1;
  for (let a = 0; a < n.length; a++) {
    let l = n[a];
    if (typeof l == 'number') {
      if (!s && !Jt(i) && !Jt(l)) return !1;
      if (s && Jt(l)) continue;
      (s = !1), (i = l | (i & 1));
      continue;
    }
    if (!s)
      if (i & 4) {
        if (((i = 2 | (i & 1)), (l !== '' && !cD(t, l, e)) || (l === '' && n.length === 1))) {
          if (Jt(i)) return !1;
          s = !0;
        }
      } else if (i & 8) {
        if (r === null || !lD(t, r, l, e)) {
          if (Jt(i)) return !1;
          s = !0;
        }
      } else {
        let c = n[++a],
          f = dD(l, r, eh(t), e);
        if (f === -1) {
          if (Jt(i)) return !1;
          s = !0;
          continue;
        }
        if (c !== '') {
          let p;
          if ((f > o ? (p = '') : (p = r[f + 1].toLowerCase()), i & 2 && c !== p)) {
            if (Jt(i)) return !1;
            s = !0;
          }
        }
      }
  }
  return Jt(i) || s;
}
function Jt(t) {
  return (t & 1) === 0;
}
function dD(t, n, e, i) {
  if (n === null) return -1;
  let r = 0;
  if (i || !e) {
    let o = !1;
    for (; r < n.length; ) {
      let s = n[r];
      if (s === t) return r;
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
  } else return pD(n, t);
}
function fD(t, n, e = !1) {
  for (let i = 0; i < n.length; i++) if (uD(t, n[i], e)) return !0;
  return !1;
}
function hD(t) {
  for (let n = 0; n < t.length; n++) {
    let e = t[n];
    if (sD(e)) return n;
  }
  return t.length;
}
function pD(t, n) {
  let e = t.indexOf(4);
  if (e > -1)
    for (e++; e < t.length; ) {
      let i = t[e];
      if (typeof i == 'number') return -1;
      if (i === n) return e;
      e++;
    }
  return -1;
}
function M0(t, n) {
  return t ? ':not(' + n.trim() + ')' : n;
}
function mD(t) {
  let n = t[0],
    e = 1,
    i = 2,
    r = '',
    o = !1;
  for (; e < t.length; ) {
    let s = t[e];
    if (typeof s == 'string')
      if (i & 2) {
        let a = t[++e];
        r += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']';
      } else i & 8 ? (r += '.' + s) : i & 4 && (r += ' ' + s);
    else r !== '' && !Jt(s) && ((n += M0(o, r)), (r = '')), (i = s), (o = o || !Jt(i));
    e++;
  }
  return r !== '' && (n += M0(o, r)), n;
}
function gD(t) {
  return t.map(mD).join(',');
}
function vD(t) {
  let n = [],
    e = [],
    i = 1,
    r = 2;
  for (; i < t.length; ) {
    let o = t[i];
    if (typeof o == 'string') r === 2 ? o !== '' && n.push(o, t[++i]) : r === 8 && e.push(o);
    else {
      if (!Jt(r)) break;
      r = o;
    }
    i++;
  }
  return { attrs: n, classes: e };
}
function V(t) {
  return ys(() => {
    let n = I1(t),
      e = ee(E({}, n), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === D1.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (n.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || Dn.Emulated,
        styles: t.styles || Dt,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: '',
      });
    x1(e);
    let i = t.dependencies;
    return (e.directiveDefs = x0(i, !1)), (e.pipeDefs = x0(i, !0)), (e.id = bD(e)), e;
  });
}
function _D(t) {
  return ur(t) || th(t);
}
function yD(t) {
  return t !== null;
}
function ft(t) {
  return ys(() => ({
    type: t.type,
    bootstrap: t.bootstrap || Dt,
    declarations: t.declarations || Dt,
    imports: t.imports || Dt,
    exports: t.exports || Dt,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function I0(t, n) {
  if (t == null) return Zn;
  let e = {};
  for (let i in t)
    if (t.hasOwnProperty(i)) {
      let r = t[i],
        o,
        s,
        a = wi.None;
      Array.isArray(r) ? ((a = r[0]), (o = r[1]), (s = r[2] ?? o)) : ((o = r), (s = r)),
        n ? ((e[o] = a !== wi.None ? [i, a] : i), (n[o] = s)) : (e[o] = i);
    }
  return e;
}
function le(t) {
  return ys(() => {
    let n = I1(t);
    return x1(n), n;
  });
}
function ur(t) {
  return t[Bw] || null;
}
function th(t) {
  return t[Uw] || null;
}
function E1(t) {
  return t[$w] || null;
}
function T1(t) {
  let n = ur(t) || th(t) || E1(t);
  return n !== null ? n.standalone : !1;
}
function M1(t, n) {
  let e = t[Hw] || null;
  if (!e && n === !0) throw new Error(`Type ${gt(t)} does not have '\u0275mod' property.`);
  return e;
}
function I1(t) {
  let n = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: n,
    inputTransforms: null,
    inputConfig: t.inputs || Zn,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || Dt,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: I0(t.inputs, n),
    outputs: I0(t.outputs),
    debugInfo: null,
  };
}
function x1(t) {
  t.features?.forEach((n) => n(t));
}
function x0(t, n) {
  if (!t) return null;
  let e = n ? E1 : _D;
  return () => (typeof t == 'function' ? t() : t).map((i) => e(i)).filter(yD);
}
function bD(t) {
  let n = 0,
    e = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join('|');
  for (let r of e) n = (Math.imul(31, n) + r.charCodeAt(0)) << 0;
  return (n += 2147483648), 'c' + n;
}
function Mi(t) {
  return { ɵproviders: t };
}
function nh(...t) {
  return { ɵproviders: N1(!0, t), ɵfromNgModule: !0 };
}
function N1(t, ...n) {
  let e = [],
    i = new Set(),
    r,
    o = (s) => {
      e.push(s);
    };
  return (
    Jf(n, (s) => {
      let a = s;
      Yd(a, o, [], i) && ((r ||= []), r.push(a));
    }),
    r !== void 0 && A1(r, o),
    e
  );
}
function A1(t, n) {
  for (let e = 0; e < t.length; e++) {
    let { ngModule: i, providers: r } = t[e];
    ih(r, (o) => {
      n(o, i);
    });
  }
}
function Yd(t, n, e, i) {
  if (((t = it(t)), !t)) return !1;
  let r = null,
    o = w0(t),
    s = !o && ur(t);
  if (!o && !s) {
    let l = t.ngModule;
    if (((o = w0(l)), o)) r = l;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    r = t;
  }
  let a = i.has(r);
  if (s) {
    if (a) return !1;
    if ((i.add(r), s.dependencies)) {
      let l = typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies;
      for (let c of l) Yd(c, n, e, i);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      i.add(r);
      let c;
      try {
        Jf(o.imports, (f) => {
          Yd(f, n, e, i) && ((c ||= []), c.push(f));
        });
      } finally {
      }
      c !== void 0 && A1(c, n);
    }
    if (!a) {
      let c = ho(r) || (() => new r());
      n({ provide: r, useFactory: c, deps: Dt }, r),
        n({ provide: w1, useValue: r, multi: !0 }, r),
        n({ provide: po, useValue: () => N(r), multi: !0 }, r);
    }
    let l = o.providers;
    if (l != null && !a) {
      let c = t;
      ih(l, (f) => {
        n(f, c);
      });
    }
  } else return !1;
  return r !== t && t.providers !== void 0;
}
function ih(t, n) {
  for (let e of t) m1(e) && (e = e.ɵproviders), Array.isArray(e) ? ih(e, n) : n(e);
}
var CD = be({ provide: String, useValue: be });
function O1(t) {
  return t !== null && typeof t == 'object' && CD in t;
}
function wD(t) {
  return !!(t && t.useExisting);
}
function DD(t) {
  return !!(t && t.useFactory);
}
function mo(t) {
  return typeof t == 'function';
}
function SD(t) {
  return !!t.useClass;
}
var zl = new F(''),
  fl = {},
  ED = {},
  Pd;
function rh() {
  return Pd === void 0 && (Pd = new Cl()), Pd;
}
var vt = class {},
  hs = class extends vt {
    get destroyed() {
      return this._destroyed;
    }
    constructor(n, e, i, r) {
      super(),
        (this.parent = e),
        (this.source = i),
        (this.scopes = r),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        Xd(n, (s) => this.processProvider(s)),
        this.records.set(C1, ao(void 0, this)),
        r.has('environment') && this.records.set(vt, ao(void 0, this));
      let o = this.records.get(zl);
      o != null && typeof o.value == 'string' && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(w1, Dt, ae.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let n = ue(null);
      try {
        for (let i of this._ngOnDestroyHooks) i.ngOnDestroy();
        let e = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let i of e) i();
      } finally {
        this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), ue(n);
      }
    }
    onDestroy(n) {
      return this.assertNotDestroyed(), this._onDestroyHooks.push(n), () => this.removeOnDestroy(n);
    }
    runInContext(n) {
      this.assertNotDestroyed();
      let e = yi(this),
        i = jt(void 0),
        r;
      try {
        return n();
      } finally {
        yi(e), jt(i);
      }
    }
    get(n, e = ds, i = ae.Default) {
      if ((this.assertNotDestroyed(), n.hasOwnProperty(S0))) return n[S0](this);
      i = Gl(i);
      let r,
        o = yi(this),
        s = jt(void 0);
      try {
        if (!(i & ae.SkipSelf)) {
          let l = this.records.get(n);
          if (l === void 0) {
            let c = ND(n) && $l(n);
            c && this.injectableDefInScope(c) ? (l = ao(Jd(n), fl)) : (l = null),
              this.records.set(n, l);
          }
          if (l != null) return this.hydrate(n, l);
        }
        let a = i & ae.Self ? rh() : this.parent;
        return (e = i & ae.Optional && e === ds ? null : e), a.get(n, e);
      } catch (a) {
        if (a.name === 'NullInjectorError') {
          if (((a[yl] = a[yl] || []).unshift(gt(n)), o)) throw a;
          return Xw(a, n, 'R3InjectorError', this.source);
        } else throw a;
      } finally {
        jt(s), yi(o);
      }
    }
    resolveInjectorInitializers() {
      let n = ue(null),
        e = yi(this),
        i = jt(void 0),
        r;
      try {
        let o = this.get(po, Dt, ae.Self);
        for (let s of o) s();
      } finally {
        yi(e), jt(i), ue(n);
      }
    }
    toString() {
      let n = [],
        e = this.records;
      for (let i of e.keys()) n.push(gt(i));
      return `R3Injector[${n.join(', ')}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new T(205, !1);
    }
    processProvider(n) {
      n = it(n);
      let e = mo(n) ? n : it(n && n.provide),
        i = MD(n);
      if (!mo(n) && n.multi === !0) {
        let r = this.records.get(e);
        r || ((r = ao(void 0, fl, !0)), (r.factory = () => Zd(r.multi)), this.records.set(e, r)),
          (e = n),
          r.multi.push(n);
      }
      this.records.set(e, i);
    }
    hydrate(n, e) {
      let i = ue(null);
      try {
        return (
          e.value === fl && ((e.value = ED), (e.value = e.factory())),
          typeof e.value == 'object' &&
            e.value &&
            xD(e.value) &&
            this._ngOnDestroyHooks.add(e.value),
          e.value
        );
      } finally {
        ue(i);
      }
    }
    injectableDefInScope(n) {
      if (!n.providedIn) return !1;
      let e = it(n.providedIn);
      return typeof e == 'string'
        ? e === 'any' || this.scopes.has(e)
        : this.injectorDefTypes.has(e);
    }
    removeOnDestroy(n) {
      let e = this._onDestroyHooks.indexOf(n);
      e !== -1 && this._onDestroyHooks.splice(e, 1);
    }
  };
function Jd(t) {
  let n = $l(t),
    e = n !== null ? n.factory : ho(t);
  if (e !== null) return e;
  if (t instanceof F) throw new T(204, !1);
  if (t instanceof Function) return TD(t);
  throw new T(204, !1);
}
function TD(t) {
  if (t.length > 0) throw new T(204, !1);
  let e = Vw(t);
  return e !== null ? () => e.factory(t) : () => new t();
}
function MD(t) {
  if (O1(t)) return ao(void 0, t.useValue);
  {
    let n = R1(t);
    return ao(n, fl);
  }
}
function R1(t, n, e) {
  let i;
  if (mo(t)) {
    let r = it(t);
    return ho(r) || Jd(r);
  } else if (O1(t)) i = () => it(t.useValue);
  else if (DD(t)) i = () => t.useFactory(...Zd(t.deps || []));
  else if (wD(t)) i = () => N(it(t.useExisting));
  else {
    let r = it(t && (t.useClass || t.provide));
    if (ID(t)) i = () => new r(...Zd(t.deps));
    else return ho(r) || Jd(r);
  }
  return i;
}
function ao(t, n, e = !1) {
  return { factory: t, value: n, multi: e ? [] : void 0 };
}
function ID(t) {
  return !!t.deps;
}
function xD(t) {
  return t !== null && typeof t == 'object' && typeof t.ngOnDestroy == 'function';
}
function ND(t) {
  return typeof t == 'function' || (typeof t == 'object' && t instanceof F);
}
function Xd(t, n) {
  for (let e of t) Array.isArray(e) ? Xd(e, n) : e && m1(e) ? Xd(e.ɵproviders, n) : n(e);
}
function Ut(t, n) {
  t instanceof hs && t.assertNotDestroyed();
  let e,
    i = yi(t),
    r = jt(void 0);
  try {
    return n();
  } finally {
    yi(i), jt(r);
  }
}
function P1() {
  return g1() !== void 0 || Kw() != null;
}
function Wl(t) {
  if (!P1()) throw new T(-203, !1);
}
function AD(t) {
  return typeof t == 'function';
}
var In = 0,
  oe = 1,
  q = 2,
  ut = 3,
  en = 4,
  rn = 5,
  wl = 6,
  Dl = 7,
  tn = 8,
  go = 9,
  Sn = 10,
  Ie = 11,
  ps = 12,
  N0 = 13,
  Co = 14,
  En = 15,
  dr = 16,
  lo = 17,
  Kn = 18,
  ql = 19,
  F1 = 20,
  bi = 21,
  Fd = 22,
  Bt = 23,
  Tn = 25,
  oh = 1;
var fr = 7,
  Sl = 8,
  vo = 9,
  It = 10,
  El = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'), (t[(t.HasTransplantedViews = 2)] = 'HasTransplantedViews'), t
    );
  })(El || {});
function Ci(t) {
  return Array.isArray(t) && typeof t[oh] == 'object';
}
function ni(t) {
  return Array.isArray(t) && t[oh] === !0;
}
function sh(t) {
  return (t.flags & 4) !== 0;
}
function Ql(t) {
  return t.componentOffset > -1;
}
function Zl(t) {
  return (t.flags & 1) === 1;
}
function Yn(t) {
  return !!t.template;
}
function ef(t) {
  return (t[q] & 512) !== 0;
}
var tf = class {
  constructor(n, e, i) {
    (this.previousValue = n), (this.currentValue = e), (this.firstChange = i);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function k1(t, n, e, i) {
  n !== null ? n.applyValueToInputSignal(n, i) : (t[e] = i);
}
function on() {
  return L1;
}
function L1(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = RD), OD;
}
on.ngInherit = !0;
function OD() {
  let t = j1(this),
    n = t?.current;
  if (n) {
    let e = t.previous;
    if (e === Zn) t.previous = n;
    else for (let i in n) e[i] = n[i];
    (t.current = null), this.ngOnChanges(n);
  }
}
function RD(t, n, e, i, r) {
  let o = this.declaredInputs[i],
    s = j1(t) || PD(t, { previous: Zn, current: null }),
    a = s.current || (s.current = {}),
    l = s.previous,
    c = l[o];
  (a[o] = new tf(c && c.currentValue, e, l === Zn)), k1(t, n, r, e);
}
var V1 = '__ngSimpleChanges__';
function j1(t) {
  return t[V1] || null;
}
function PD(t, n) {
  return (t[V1] = n);
}
var A0 = null;
var Cn = function (t, n, e) {
    A0?.(t, n, e);
  },
  B1 = 'svg',
  FD = 'math';
function Mn(t) {
  for (; Array.isArray(t); ) t = t[In];
  return t;
}
function kD(t) {
  for (; Array.isArray(t); ) {
    if (typeof t[oh] == 'object') return t;
    t = t[In];
  }
  return null;
}
function U1(t, n) {
  return Mn(n[t]);
}
function $t(t, n) {
  return Mn(n[t.index]);
}
function $1(t, n) {
  return t.data[n];
}
function LD(t, n) {
  return t[n];
}
function Ii(t, n) {
  let e = n[t];
  return Ci(e) ? e : e[In];
}
function VD(t) {
  return (t[q] & 4) === 4;
}
function ah(t) {
  return (t[q] & 128) === 128;
}
function jD(t) {
  return ni(t[ut]);
}
function _o(t, n) {
  return n == null ? null : t[n];
}
function H1(t) {
  t[lo] = 0;
}
function G1(t) {
  t[q] & 1024 || ((t[q] |= 1024), ah(t) && Kl(t));
}
function BD(t, n) {
  for (; t > 0; ) (n = n[Co]), t--;
  return n;
}
function ms(t) {
  return !!(t[q] & 9216 || t[Bt]?.dirty);
}
function nf(t) {
  t[Sn].changeDetectionScheduler?.notify(7), t[q] & 64 && (t[q] |= 1024), ms(t) && Kl(t);
}
function Kl(t) {
  t[Sn].changeDetectionScheduler?.notify(0);
  let n = hr(t);
  for (; n !== null && !(n[q] & 8192 || ((n[q] |= 8192), !ah(n))); ) n = hr(n);
}
function z1(t, n) {
  if ((t[q] & 256) === 256) throw new T(911, !1);
  t[bi] === null && (t[bi] = []), t[bi].push(n);
}
function UD(t, n) {
  if (t[bi] === null) return;
  let e = t[bi].indexOf(n);
  e !== -1 && t[bi].splice(e, 1);
}
function hr(t) {
  let n = t[ut];
  return ni(n) ? n[ut] : n;
}
var te = {
  lFrame: nv(null),
  bindingsEnabled: !0,
  skipHydrationRootTNode: null,
};
var W1 = !1;
function $D() {
  return te.lFrame.elementDepthCount;
}
function HD() {
  te.lFrame.elementDepthCount++;
}
function GD() {
  te.lFrame.elementDepthCount--;
}
function q1() {
  return te.bindingsEnabled;
}
function zD() {
  return te.skipHydrationRootTNode !== null;
}
function WD(t) {
  return te.skipHydrationRootTNode === t;
}
function qD() {
  te.skipHydrationRootTNode = null;
}
function fe() {
  return te.lFrame.lView;
}
function Fe() {
  return te.lFrame.tView;
}
function ke(t) {
  return (te.lFrame.contextLView = t), t[tn];
}
function Le(t) {
  return (te.lFrame.contextLView = null), t;
}
function _t() {
  let t = Q1();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function Q1() {
  return te.lFrame.currentTNode;
}
function QD() {
  let t = te.lFrame,
    n = t.currentTNode;
  return t.isParent ? n : n.parent;
}
function yr(t, n) {
  let e = te.lFrame;
  (e.currentTNode = t), (e.isParent = n);
}
function lh() {
  return te.lFrame.isParent;
}
function Z1() {
  te.lFrame.isParent = !1;
}
function ZD() {
  return te.lFrame.contextLView;
}
function K1() {
  return W1;
}
function O0(t) {
  W1 = t;
}
function KD() {
  let t = te.lFrame,
    n = t.bindingRootIndex;
  return n === -1 && (n = t.bindingRootIndex = t.tView.bindingStartIndex), n;
}
function YD(t) {
  return (te.lFrame.bindingIndex = t);
}
function Cs() {
  return te.lFrame.bindingIndex++;
}
function Y1(t) {
  let n = te.lFrame,
    e = n.bindingIndex;
  return (n.bindingIndex = n.bindingIndex + t), e;
}
function JD() {
  return te.lFrame.inI18n;
}
function XD(t, n) {
  let e = te.lFrame;
  (e.bindingIndex = e.bindingRootIndex = t), rf(n);
}
function eS() {
  return te.lFrame.currentDirectiveIndex;
}
function rf(t) {
  te.lFrame.currentDirectiveIndex = t;
}
function J1(t) {
  let n = te.lFrame.currentDirectiveIndex;
  return n === -1 ? null : t[n];
}
function X1() {
  return te.lFrame.currentQueryIndex;
}
function ch(t) {
  te.lFrame.currentQueryIndex = t;
}
function tS(t) {
  let n = t[oe];
  return n.type === 2 ? n.declTNode : n.type === 1 ? t[rn] : null;
}
function ev(t, n, e) {
  if (e & ae.SkipSelf) {
    let r = n,
      o = t;
    for (; (r = r.parent), r === null && !(e & ae.Host); )
      if (((r = tS(o)), r === null || ((o = o[Co]), r.type & 10))) break;
    if (r === null) return !1;
    (n = r), (t = o);
  }
  let i = (te.lFrame = tv());
  return (i.currentTNode = n), (i.lView = t), !0;
}
function uh(t) {
  let n = tv(),
    e = t[oe];
  (te.lFrame = n),
    (n.currentTNode = e.firstChild),
    (n.lView = t),
    (n.tView = e),
    (n.contextLView = t),
    (n.bindingIndex = e.bindingStartIndex),
    (n.inI18n = !1);
}
function tv() {
  let t = te.lFrame,
    n = t === null ? null : t.child;
  return n === null ? nv(t) : n;
}
function nv(t) {
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
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = n), n;
}
function iv() {
  let t = te.lFrame;
  return (te.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var rv = iv;
function dh() {
  let t = iv();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function nS(t) {
  return (te.lFrame.contextLView = BD(t, te.lFrame.contextLView))[tn];
}
function br() {
  return te.lFrame.selectedIndex;
}
function pr(t) {
  te.lFrame.selectedIndex = t;
}
function ws() {
  let t = te.lFrame;
  return $1(t.tView, t.selectedIndex);
}
function ze() {
  te.lFrame.currentNamespace = B1;
}
function Ye() {
  iS();
}
function iS() {
  te.lFrame.currentNamespace = null;
}
function rS() {
  return te.lFrame.currentNamespace;
}
var ov = !0;
function Yl() {
  return ov;
}
function Jl(t) {
  ov = t;
}
function oS(t, n, e) {
  let { ngOnChanges: i, ngOnInit: r, ngDoCheck: o } = n.type.prototype;
  if (i) {
    let s = L1(n);
    (e.preOrderHooks ??= []).push(t, s), (e.preOrderCheckHooks ??= []).push(t, s);
  }
  r && (e.preOrderHooks ??= []).push(0 - t, r),
    o && ((e.preOrderHooks ??= []).push(t, o), (e.preOrderCheckHooks ??= []).push(t, o));
}
function Xl(t, n) {
  for (let e = n.directiveStart, i = n.directiveEnd; e < i; e++) {
    let o = t.data[e].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: l,
        ngAfterViewChecked: c,
        ngOnDestroy: f,
      } = o;
    s && (t.contentHooks ??= []).push(-e, s),
      a && ((t.contentHooks ??= []).push(e, a), (t.contentCheckHooks ??= []).push(e, a)),
      l && (t.viewHooks ??= []).push(-e, l),
      c && ((t.viewHooks ??= []).push(e, c), (t.viewCheckHooks ??= []).push(e, c)),
      f != null && (t.destroyHooks ??= []).push(e, f);
  }
}
function hl(t, n, e) {
  sv(t, n, 3, e);
}
function pl(t, n, e, i) {
  (t[q] & 3) === e && sv(t, n, e, i);
}
function kd(t, n) {
  let e = t[q];
  (e & 3) === n && ((e &= 16383), (e += 1), (t[q] = e));
}
function sv(t, n, e, i) {
  let r = i !== void 0 ? t[lo] & 65535 : 0,
    o = i ?? -1,
    s = n.length - 1,
    a = 0;
  for (let l = r; l < s; l++)
    if (typeof n[l + 1] == 'number') {
      if (((a = n[l]), i != null && a >= i)) break;
    } else
      n[l] < 0 && (t[lo] += 65536),
        (a < o || o == -1) && (sS(t, e, n, l), (t[lo] = (t[lo] & 4294901760) + l + 2)),
        l++;
}
function R0(t, n) {
  Cn(4, t, n);
  let e = ue(null);
  try {
    n.call(t);
  } finally {
    ue(e), Cn(5, t, n);
  }
}
function sS(t, n, e, i) {
  let r = e[i] < 0,
    o = e[i + 1],
    s = r ? -e[i] : e[i],
    a = t[s];
  r ? t[q] >> 14 < t[lo] >> 16 && (t[q] & 3) === n && ((t[q] += 16384), R0(a, o)) : R0(a, o);
}
var fo = -1,
  mr = class {
    constructor(n, e, i) {
      (this.factory = n),
        (this.resolving = !1),
        (this.canSeeViewProviders = e),
        (this.injectImpl = i);
    }
  };
function aS(t) {
  return t instanceof mr;
}
function lS(t) {
  return (t.flags & 8) !== 0;
}
function cS(t) {
  return (t.flags & 16) !== 0;
}
var Ld = {},
  of = class {
    constructor(n, e) {
      (this.injector = n), (this.parentInjector = e);
    }
    get(n, e, i) {
      i = Gl(i);
      let r = this.injector.get(n, Ld, i);
      return r !== Ld || e === Ld ? r : this.parentInjector.get(n, e, i);
    }
  };
function av(t) {
  return t !== fo;
}
function Tl(t) {
  return t & 32767;
}
function uS(t) {
  return t >> 16;
}
function Ml(t, n) {
  let e = uS(t),
    i = n;
  for (; e > 0; ) (i = i[Co]), e--;
  return i;
}
var sf = !0;
function P0(t) {
  let n = sf;
  return (sf = t), n;
}
var dS = 256,
  lv = dS - 1,
  cv = 5,
  fS = 0,
  wn = {};
function hS(t, n, e) {
  let i;
  typeof e == 'string' ? (i = e.charCodeAt(0) || 0) : e.hasOwnProperty(cs) && (i = e[cs]),
    i == null && (i = e[cs] = fS++);
  let r = i & lv,
    o = 1 << r;
  n.data[t + (r >> cv)] |= o;
}
function Il(t, n) {
  let e = uv(t, n);
  if (e !== -1) return e;
  let i = n[oe];
  i.firstCreatePass &&
    ((t.injectorIndex = n.length), Vd(i.data, t), Vd(n, null), Vd(i.blueprint, null));
  let r = fh(t, n),
    o = t.injectorIndex;
  if (av(r)) {
    let s = Tl(r),
      a = Ml(r, n),
      l = a[oe].data;
    for (let c = 0; c < 8; c++) n[o + c] = a[s + c] | l[s + c];
  }
  return (n[o + 8] = r), o;
}
function Vd(t, n) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, n);
}
function uv(t, n) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    n[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function fh(t, n) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let e = 0,
    i = null,
    r = n;
  for (; r !== null; ) {
    if (((i = mv(r)), i === null)) return fo;
    if ((e++, (r = r[Co]), i.injectorIndex !== -1)) return i.injectorIndex | (e << 16);
  }
  return fo;
}
function af(t, n, e) {
  hS(t, n, e);
}
function dv(t, n, e) {
  if (e & ae.Optional || t !== void 0) return t;
  Kf(n, 'NodeInjector');
}
function fv(t, n, e, i) {
  if ((e & ae.Optional && i === void 0 && (i = null), !(e & (ae.Self | ae.Host)))) {
    let r = t[go],
      o = jt(void 0);
    try {
      return r ? r.get(n, i, e & ae.Optional) : v1(n, i, e & ae.Optional);
    } finally {
      jt(o);
    }
  }
  return dv(i, n, e);
}
function hv(t, n, e, i = ae.Default, r) {
  if (t !== null) {
    if (n[q] & 2048 && !(i & ae.Self)) {
      let s = vS(t, n, e, i, wn);
      if (s !== wn) return s;
    }
    let o = pv(t, n, e, i, wn);
    if (o !== wn) return o;
  }
  return fv(n, e, i, r);
}
function pv(t, n, e, i, r) {
  let o = mS(e);
  if (typeof o == 'function') {
    if (!ev(n, t, i)) return i & ae.Host ? dv(r, e, i) : fv(n, e, i, r);
    try {
      let s;
      if (((s = o(i)), s == null && !(i & ae.Optional))) Kf(e);
      else return s;
    } finally {
      rv();
    }
  } else if (typeof o == 'number') {
    let s = null,
      a = uv(t, n),
      l = fo,
      c = i & ae.Host ? n[En][rn] : null;
    for (
      (a === -1 || i & ae.SkipSelf) &&
      ((l = a === -1 ? fh(t, n) : n[a + 8]),
      l === fo || !k0(i, !1) ? (a = -1) : ((s = n[oe]), (a = Tl(l)), (n = Ml(l, n))));
      a !== -1;

    ) {
      let f = n[oe];
      if (F0(o, a, f.data)) {
        let p = pS(a, n, e, s, i, c);
        if (p !== wn) return p;
      }
      (l = n[a + 8]),
        l !== fo && k0(i, n[oe].data[a + 8] === c) && F0(o, a, n)
          ? ((s = f), (a = Tl(l)), (n = Ml(l, n)))
          : (a = -1);
    }
  }
  return r;
}
function pS(t, n, e, i, r, o) {
  let s = n[oe],
    a = s.data[t + 8],
    l = i == null ? Ql(a) && sf : i != s && (a.type & 3) !== 0,
    c = r & ae.Host && o === a,
    f = ml(a, s, e, l, c);
  return f !== null ? gr(n, s, f, a) : wn;
}
function ml(t, n, e, i, r) {
  let o = t.providerIndexes,
    s = n.data,
    a = o & 1048575,
    l = t.directiveStart,
    c = t.directiveEnd,
    f = o >> 20,
    p = i ? a : a + f,
    g = r ? a + f : c;
  for (let m = p; m < g; m++) {
    let v = s[m];
    if ((m < l && e === v) || (m >= l && v.type === e)) return m;
  }
  if (r) {
    let m = s[l];
    if (m && Yn(m) && m.type === e) return l;
  }
  return null;
}
function gr(t, n, e, i) {
  let r = t[e],
    o = n.data;
  if (aS(r)) {
    let s = r;
    s.resolving && zw(Gw(o[e]));
    let a = P0(s.canSeeViewProviders);
    s.resolving = !0;
    let l,
      c = s.injectImpl ? jt(s.injectImpl) : null,
      f = ev(t, i, ae.Default);
    try {
      (r = t[e] = s.factory(void 0, o, t, i)),
        n.firstCreatePass && e >= i.directiveStart && oS(e, o[e], n);
    } finally {
      c !== null && jt(c), P0(a), (s.resolving = !1), rv();
    }
  }
  return r;
}
function mS(t) {
  if (typeof t == 'string') return t.charCodeAt(0) || 0;
  let n = t.hasOwnProperty(cs) ? t[cs] : void 0;
  return typeof n == 'number' ? (n >= 0 ? n & lv : gS) : n;
}
function F0(t, n, e) {
  let i = 1 << t;
  return !!(e[n + (t >> cv)] & i);
}
function k0(t, n) {
  return !(t & ae.Self) && !(t & ae.Host && n);
}
var cr = class {
  constructor(n, e) {
    (this._tNode = n), (this._lView = e);
  }
  get(n, e, i) {
    return hv(this._tNode, this._lView, n, Gl(i), e);
  }
};
function gS() {
  return new cr(_t(), fe());
}
function Ht(t) {
  return ys(() => {
    let n = t.prototype.constructor,
      e = n[_l] || lf(n),
      i = Object.prototype,
      r = Object.getPrototypeOf(t.prototype).constructor;
    for (; r && r !== i; ) {
      let o = r[_l] || lf(r);
      if (o && o !== e) return o;
      r = Object.getPrototypeOf(r);
    }
    return (o) => new o();
  });
}
function lf(t) {
  return d1(t)
    ? () => {
        let n = lf(it(t));
        return n && n();
      }
    : ho(t);
}
function vS(t, n, e, i, r) {
  let o = t,
    s = n;
  for (; o !== null && s !== null && s[q] & 2048 && !(s[q] & 512); ) {
    let a = pv(o, s, e, i | ae.Self, wn);
    if (a !== wn) return a;
    let l = o.parent;
    if (!l) {
      let c = s[F1];
      if (c) {
        let f = c.get(e, wn, i);
        if (f !== wn) return f;
      }
      (l = mv(s)), (s = s[Co]);
    }
    o = l;
  }
  return r;
}
function mv(t) {
  let n = t[oe],
    e = n.type;
  return e === 2 ? n.declTNode : e === 1 ? t[rn] : null;
}
function L0(t, n = null, e = null, i) {
  let r = gv(t, n, e, i);
  return r.resolveInjectorInitializers(), r;
}
function gv(t, n = null, e = null, i, r = new Set()) {
  let o = [e || Dt, nh(t)];
  return (i = i || (typeof t == 'object' ? void 0 : gt(t))), new hs(o, n || rh(), i || null, r);
}
var Ge = class t {
  static {
    this.THROW_IF_NOT_FOUND = ds;
  }
  static {
    this.NULL = new Cl();
  }
  static create(n, e) {
    if (Array.isArray(n)) return L0({ name: '' }, e, n, '');
    {
      let i = n.name ?? '';
      return L0({ name: i }, n.parent, n.providers, i);
    }
  }
  static {
    this.ɵprov = M({ token: t, providedIn: 'any', factory: () => N(C1) });
  }
  static {
    this.__NG_ELEMENT_ID__ = -1;
  }
};
var _S = new F('');
_S.__NG_ELEMENT_ID__ = (t) => {
  let n = _t();
  if (n === null) throw new T(204, !1);
  if (n.type & 2) return n.value;
  if (t & ae.Optional) return null;
  throw new T(204, !1);
};
var yS = 'ngOriginalError';
function jd(t) {
  return t[yS];
}
var Cr = (() => {
    class t {
      static {
        this.__NG_ELEMENT_ID__ = bS;
      }
      static {
        this.__NG_ENV_ID__ = (e) => e;
      }
    }
    return t;
  })(),
  cf = class extends Cr {
    constructor(n) {
      super(), (this._lView = n);
    }
    onDestroy(n) {
      return z1(this._lView, n), () => UD(this._lView, n);
    }
  };
function bS() {
  return new cf(fe());
}
var xi = (() => {
  class t {
    constructor() {
      (this.taskId = 0), (this.pendingTasks = new Set()), (this.hasPendingTasks = new Oe(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let e = this.taskId++;
      return this.pendingTasks.add(e), e;
    }
    remove(e) {
      this.pendingTasks.delete(e),
        this.pendingTasks.size === 0 && this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(), this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
    static {
      this.ɵprov = M({ token: t, providedIn: 'root', factory: () => new t() });
    }
  }
  return t;
})();
var uf = class extends de {
    constructor(n = !1) {
      super(),
        (this.destroyRef = void 0),
        (this.pendingTasks = void 0),
        (this.__isAsync = n),
        P1() &&
          ((this.destroyRef = y(Cr, { optional: !0 }) ?? void 0),
          (this.pendingTasks = y(xi, { optional: !0 }) ?? void 0));
    }
    emit(n) {
      let e = ue(null);
      try {
        super.next(n);
      } finally {
        ue(e);
      }
    }
    subscribe(n, e, i) {
      let r = n,
        o = e || (() => null),
        s = i;
      if (n && typeof n == 'object') {
        let l = n;
        (r = l.next?.bind(l)), (o = l.error?.bind(l)), (s = l.complete?.bind(l));
      }
      this.__isAsync &&
        ((o = this.wrapInTimeout(o)),
        r && (r = this.wrapInTimeout(r)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: r, error: o, complete: s });
      return n instanceof Ce && n.add(a), a;
    }
    wrapInTimeout(n) {
      return (e) => {
        let i = this.pendingTasks?.add();
        setTimeout(() => {
          n(e), i !== void 0 && this.pendingTasks?.remove(i);
        });
      };
    }
  },
  Y = uf;
function xl(...t) {}
function vv(t) {
  let n, e;
  function i() {
    t = xl;
    try {
      e !== void 0 && typeof cancelAnimationFrame == 'function' && cancelAnimationFrame(e),
        n !== void 0 && clearTimeout(n);
    } catch {}
  }
  return (
    (n = setTimeout(() => {
      t(), i();
    })),
    typeof requestAnimationFrame == 'function' &&
      (e = requestAnimationFrame(() => {
        t(), i();
      })),
    () => i()
  );
}
function V0(t) {
  return (
    queueMicrotask(() => t()),
    () => {
      t = xl;
    }
  );
}
var hh = 'isAngularZone',
  Nl = hh + '_ID',
  CS = 0,
  me = class t {
    constructor({
      enableLongStackTrace: n = !1,
      shouldCoalesceEventChangeDetection: e = !1,
      shouldCoalesceRunChangeDetection: i = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new Y(!1)),
        (this.onMicrotaskEmpty = new Y(!1)),
        (this.onStable = new Y(!1)),
        (this.onError = new Y(!1)),
        typeof Zone > 'u')
      )
        throw new T(908, !1);
      Zone.assertZonePatched();
      let r = this;
      (r._nesting = 0),
        (r._outer = r._inner = Zone.current),
        Zone.TaskTrackingZoneSpec && (r._inner = r._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n && Zone.longStackTraceZoneSpec && (r._inner = r._inner.fork(Zone.longStackTraceZoneSpec)),
        (r.shouldCoalesceEventChangeDetection = !i && e),
        (r.shouldCoalesceRunChangeDetection = i),
        (r.callbackScheduled = !1),
        SS(r);
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get(hh) === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new T(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new T(909, !1);
    }
    run(n, e, i) {
      return this._inner.run(n, e, i);
    }
    runTask(n, e, i, r) {
      let o = this._inner,
        s = o.scheduleEventTask('NgZoneEvent: ' + r, n, wS, xl, xl);
      try {
        return o.runTask(s, e, i);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(n, e, i) {
      return this._inner.runGuarded(n, e, i);
    }
    runOutsideAngular(n) {
      return this._outer.run(n);
    }
  },
  wS = {};
function ph(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function DS(t) {
  t.isCheckStableRunning ||
    t.callbackScheduled ||
    ((t.callbackScheduled = !0),
    Zone.root.run(() => {
      vv(() => {
        (t.callbackScheduled = !1),
          df(t),
          (t.isCheckStableRunning = !0),
          ph(t),
          (t.isCheckStableRunning = !1);
      });
    }),
    df(t));
}
function SS(t) {
  let n = () => {
      DS(t);
    },
    e = CS++;
  t._inner = t._inner.fork({
    name: 'angular',
    properties: { [hh]: !0, [Nl]: e, [Nl + e]: !0 },
    onInvokeTask: (i, r, o, s, a, l) => {
      if (ES(l)) return i.invokeTask(o, s, a, l);
      try {
        return j0(t), i.invokeTask(o, s, a, l);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && s.type === 'eventTask') ||
          t.shouldCoalesceRunChangeDetection) &&
          n(),
          B0(t);
      }
    },
    onInvoke: (i, r, o, s, a, l, c) => {
      try {
        return j0(t), i.invoke(o, s, a, l, c);
      } finally {
        t.shouldCoalesceRunChangeDetection && !t.callbackScheduled && !TS(l) && n(), B0(t);
      }
    },
    onHasTask: (i, r, o, s) => {
      i.hasTask(o, s),
        r === o &&
          (s.change == 'microTask'
            ? ((t._hasPendingMicrotasks = s.microTask), df(t), ph(t))
            : s.change == 'macroTask' && (t.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (i, r, o, s) => (
      i.handleError(o, s), t.runOutsideAngular(() => t.onError.emit(s)), !1
    ),
  });
}
function df(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection || t.shouldCoalesceRunChangeDetection) &&
    t.callbackScheduled === !0)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function j0(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function B0(t) {
  t._nesting--, ph(t);
}
var ff = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new Y()),
      (this.onMicrotaskEmpty = new Y()),
      (this.onStable = new Y()),
      (this.onError = new Y());
  }
  run(n, e, i) {
    return n.apply(e, i);
  }
  runGuarded(n, e, i) {
    return n.apply(e, i);
  }
  runOutsideAngular(n) {
    return n();
  }
  runTask(n, e, i, r) {
    return n.apply(e, i);
  }
};
function ES(t) {
  return _v(t, '__ignore_ng_zone__');
}
function TS(t) {
  return _v(t, '__scheduler_tick__');
}
function _v(t, n) {
  return !Array.isArray(t) || t.length !== 1 ? !1 : t[0]?.data?.[n] === !0;
}
var Jn = class {
    constructor() {
      this._console = console;
    }
    handleError(n) {
      let e = this._findOriginalError(n);
      this._console.error('ERROR', n), e && this._console.error('ORIGINAL ERROR', e);
    }
    _findOriginalError(n) {
      let e = n && jd(n);
      for (; e && jd(e); ) e = jd(e);
      return e || null;
    }
  },
  MS = new F('', {
    providedIn: 'root',
    factory: () => {
      let t = y(me),
        n = y(Jn);
      return (e) => t.runOutsideAngular(() => n.handleError(e));
    },
  });
function IS() {
  return wo(_t(), fe());
}
function wo(t, n) {
  return new Ne($t(t, n));
}
var Ne = (() => {
  class t {
    constructor(e) {
      this.nativeElement = e;
    }
    static {
      this.__NG_ELEMENT_ID__ = IS;
    }
  }
  return t;
})();
function xS(t) {
  return t instanceof Ne ? t.nativeElement : t;
}
function NS() {
  return this._results[Symbol.iterator]();
}
var hf = class t {
  get changes() {
    return (this._changes ??= new Y());
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
    let e = t.prototype;
    e[Symbol.iterator] || (e[Symbol.iterator] = NS);
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
  reduce(n, e) {
    return this._results.reduce(n, e);
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
  reset(n, e) {
    this.dirty = !1;
    let i = nD(n);
    (this._changesDetected = !tD(this._results, i, e)) &&
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
function yv(t) {
  return (t.flags & 128) === 128;
}
var bv = new Map(),
  AS = 0;
function OS() {
  return AS++;
}
function RS(t) {
  bv.set(t[ql], t);
}
function PS(t) {
  bv.delete(t[ql]);
}
var U0 = '__ngContext__';
function Di(t, n) {
  Ci(n) ? ((t[U0] = n[ql]), RS(n)) : (t[U0] = n);
}
function Cv(t) {
  return Dv(t[ps]);
}
function wv(t) {
  return Dv(t[en]);
}
function Dv(t) {
  for (; t !== null && !ni(t); ) t = t[en];
  return t;
}
var pf;
function Sv(t) {
  pf = t;
}
function Ev() {
  if (pf !== void 0) return pf;
  if (typeof document < 'u') return document;
  throw new T(210, !1);
}
var mh = new F('', { providedIn: 'root', factory: () => FS }),
  FS = 'ng',
  gh = new F(''),
  xn = new F('', { providedIn: 'platform', factory: () => 'unknown' });
var vh = new F(''),
  _h = new F('', {
    providedIn: 'root',
    factory: () => Ev().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') || null,
  });
var kS = 'h',
  LS = 'b';
var VS = () => null;
function yh(t, n, e = !1) {
  return VS(t, n, e);
}
var Tv = !1,
  jS = new F('', { providedIn: 'root', factory: () => Tv });
var sl;
function BS() {
  if (sl === void 0 && ((sl = null), us.trustedTypes))
    try {
      sl = us.trustedTypes.createPolicy('angular', {
        createHTML: (t) => t,
        createScript: (t) => t,
        createScriptURL: (t) => t,
      });
    } catch {}
  return sl;
}
function ec(t) {
  return BS()?.createHTML(t) || t;
}
var al;
function US() {
  if (al === void 0 && ((al = null), us.trustedTypes))
    try {
      al = us.trustedTypes.createPolicy('angular#unsafe-bypass', {
        createHTML: (t) => t,
        createScript: (t) => t,
        createScriptURL: (t) => t,
      });
    } catch {}
  return al;
}
function $0(t) {
  return US()?.createHTML(t) || t;
}
var Xn = class {
    constructor(n) {
      this.changingThisBreaksApplicationSecurity = n;
    }
    toString() {
      return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${c1})`;
    }
  },
  mf = class extends Xn {
    getTypeName() {
      return 'HTML';
    }
  },
  gf = class extends Xn {
    getTypeName() {
      return 'Style';
    }
  },
  vf = class extends Xn {
    getTypeName() {
      return 'Script';
    }
  },
  _f = class extends Xn {
    getTypeName() {
      return 'URL';
    }
  },
  yf = class extends Xn {
    getTypeName() {
      return 'ResourceURL';
    }
  };
function Nn(t) {
  return t instanceof Xn ? t.changingThisBreaksApplicationSecurity : t;
}
function wr(t, n) {
  let e = $S(t);
  if (e != null && e !== n) {
    if (e === 'ResourceURL' && n === 'URL') return !0;
    throw new Error(`Required a safe ${n}, got a ${e} (see ${c1})`);
  }
  return e === n;
}
function $S(t) {
  return (t instanceof Xn && t.getTypeName()) || null;
}
function Mv(t) {
  return new mf(t);
}
function Iv(t) {
  return new gf(t);
}
function xv(t) {
  return new vf(t);
}
function Nv(t) {
  return new _f(t);
}
function Av(t) {
  return new yf(t);
}
function HS(t) {
  let n = new Cf(t);
  return GS() ? new bf(n) : n;
}
var bf = class {
    constructor(n) {
      this.inertDocumentHelper = n;
    }
    getInertBodyElement(n) {
      n = '<body><remove></remove>' + n;
      try {
        let e = new window.DOMParser().parseFromString(ec(n), 'text/html').body;
        return e === null
          ? this.inertDocumentHelper.getInertBodyElement(n)
          : (e.firstChild?.remove(), e);
      } catch {
        return null;
      }
    }
  },
  Cf = class {
    constructor(n) {
      (this.defaultDoc = n),
        (this.inertDocument =
          this.defaultDoc.implementation.createHTMLDocument('sanitization-inert'));
    }
    getInertBodyElement(n) {
      let e = this.inertDocument.createElement('template');
      return (e.innerHTML = ec(n)), e;
    }
  };
function GS() {
  try {
    return !!new window.DOMParser().parseFromString(ec(''), 'text/html');
  } catch {
    return !1;
  }
}
var zS = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function bh(t) {
  return (t = String(t)), t.match(zS) ? t : 'unsafe:' + t;
}
function ii(t) {
  let n = {};
  for (let e of t.split(',')) n[e] = !0;
  return n;
}
function Ds(...t) {
  let n = {};
  for (let e of t) for (let i in e) e.hasOwnProperty(i) && (n[i] = !0);
  return n;
}
var Ov = ii('area,br,col,hr,img,wbr'),
  Rv = ii('colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr'),
  Pv = ii('rp,rt'),
  WS = Ds(Pv, Rv),
  qS = Ds(
    Rv,
    ii(
      'address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul',
    ),
  ),
  QS = Ds(
    Pv,
    ii(
      'a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video',
    ),
  ),
  H0 = Ds(Ov, qS, QS, WS),
  Fv = ii('background,cite,href,itemtype,longdesc,poster,src,xlink:href'),
  ZS = ii(
    'abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width',
  ),
  KS = ii(
    'aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext',
  ),
  YS = Ds(Fv, ZS, KS),
  JS = ii('script,style,template'),
  wf = class {
    constructor() {
      (this.sanitizedSomething = !1), (this.buf = []);
    }
    sanitizeChildren(n) {
      let e = n.firstChild,
        i = !0,
        r = [];
      for (; e; ) {
        if (
          (e.nodeType === Node.ELEMENT_NODE
            ? (i = this.startElement(e))
            : e.nodeType === Node.TEXT_NODE
              ? this.chars(e.nodeValue)
              : (this.sanitizedSomething = !0),
          i && e.firstChild)
        ) {
          r.push(e), (e = tE(e));
          continue;
        }
        for (; e; ) {
          e.nodeType === Node.ELEMENT_NODE && this.endElement(e);
          let o = eE(e);
          if (o) {
            e = o;
            break;
          }
          e = r.pop();
        }
      }
      return this.buf.join('');
    }
    startElement(n) {
      let e = G0(n).toLowerCase();
      if (!H0.hasOwnProperty(e)) return (this.sanitizedSomething = !0), !JS.hasOwnProperty(e);
      this.buf.push('<'), this.buf.push(e);
      let i = n.attributes;
      for (let r = 0; r < i.length; r++) {
        let o = i.item(r),
          s = o.name,
          a = s.toLowerCase();
        if (!YS.hasOwnProperty(a)) {
          this.sanitizedSomething = !0;
          continue;
        }
        let l = o.value;
        Fv[a] && (l = bh(l)), this.buf.push(' ', s, '="', z0(l), '"');
      }
      return this.buf.push('>'), !0;
    }
    endElement(n) {
      let e = G0(n).toLowerCase();
      H0.hasOwnProperty(e) &&
        !Ov.hasOwnProperty(e) &&
        (this.buf.push('</'), this.buf.push(e), this.buf.push('>'));
    }
    chars(n) {
      this.buf.push(z0(n));
    }
  };
function XS(t, n) {
  return (
    (t.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_CONTAINED_BY) !==
    Node.DOCUMENT_POSITION_CONTAINED_BY
  );
}
function eE(t) {
  let n = t.nextSibling;
  if (n && t !== n.previousSibling) throw kv(n);
  return n;
}
function tE(t) {
  let n = t.firstChild;
  if (n && XS(t, n)) throw kv(n);
  return n;
}
function G0(t) {
  let n = t.nodeName;
  return typeof n == 'string' ? n : 'FORM';
}
function kv(t) {
  return new Error(`Failed to sanitize html because the element is clobbered: ${t.outerHTML}`);
}
var nE = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  iE = /([^\#-~ |!])/g;
function z0(t) {
  return t
    .replace(/&/g, '&amp;')
    .replace(nE, function (n) {
      let e = n.charCodeAt(0),
        i = n.charCodeAt(1);
      return '&#' + ((e - 55296) * 1024 + (i - 56320) + 65536) + ';';
    })
    .replace(iE, function (n) {
      return '&#' + n.charCodeAt(0) + ';';
    })
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
var ll;
function Ch(t, n) {
  let e = null;
  try {
    ll = ll || HS(t);
    let i = n ? String(n) : '';
    e = ll.getInertBodyElement(i);
    let r = 5,
      o = i;
    do {
      if (r === 0) throw new Error('Failed to sanitize html because the input is unstable');
      r--, (i = o), (o = e.innerHTML), (e = ll.getInertBodyElement(i));
    } while (i !== o);
    let a = new wf().sanitizeChildren(W0(e) || e);
    return ec(a);
  } finally {
    if (e) {
      let i = W0(e) || e;
      for (; i.firstChild; ) i.firstChild.remove();
    }
  }
}
function W0(t) {
  return 'content' in t && rE(t) ? t.content : null;
}
function rE(t) {
  return t.nodeType === Node.ELEMENT_NODE && t.nodeName === 'TEMPLATE';
}
var sn = (function (t) {
  return (
    (t[(t.NONE = 0)] = 'NONE'),
    (t[(t.HTML = 1)] = 'HTML'),
    (t[(t.STYLE = 2)] = 'STYLE'),
    (t[(t.SCRIPT = 3)] = 'SCRIPT'),
    (t[(t.URL = 4)] = 'URL'),
    (t[(t.RESOURCE_URL = 5)] = 'RESOURCE_URL'),
    t
  );
})(sn || {});
function wh(t) {
  let n = oE();
  return n ? $0(n.sanitize(sn.HTML, t) || '') : wr(t, 'HTML') ? $0(Nn(t)) : Ch(Ev(), Hl(t));
}
function oE() {
  let t = fe();
  return t && t[Sn].sanitizer;
}
var sE = /^>|^->|<!--|-->|--!>|<!-$/g,
  aE = /(<|>)/g,
  lE = '\u200B$1\u200B';
function cE(t) {
  return t.replace(sE, (n) => n.replace(aE, lE));
}
function Lv(t) {
  return t instanceof Function ? t() : t;
}
function Vv(t) {
  return (t ?? y(Ge)).get(xn) === 'browser';
}
var ei = (function (t) {
    return (t[(t.Important = 1)] = 'Important'), (t[(t.DashCase = 2)] = 'DashCase'), t;
  })(ei || {}),
  uE;
function Dh(t, n) {
  return uE(t, n);
}
function co(t, n, e, i, r) {
  if (i != null) {
    let o,
      s = !1;
    ni(i) ? (o = i) : Ci(i) && ((s = !0), (i = i[In]));
    let a = Mn(i);
    t === 0 && e !== null
      ? r == null
        ? Hv(n, e, a)
        : Al(n, e, a, r || null, !0)
      : t === 1 && e !== null
        ? Al(n, e, a, r || null, !0)
        : t === 2
          ? TE(n, a, s)
          : t === 3 && n.destroyNode(a),
      o != null && IE(n, t, o, e, r);
  }
}
function dE(t, n) {
  return t.createText(n);
}
function fE(t, n, e) {
  t.setValue(n, e);
}
function hE(t, n) {
  return t.createComment(cE(n));
}
function jv(t, n, e) {
  return t.createElement(n, e);
}
function pE(t, n) {
  Bv(t, n), (n[In] = null), (n[rn] = null);
}
function mE(t, n, e, i, r, o) {
  (i[In] = r), (i[rn] = n), nc(t, i, e, 1, r, o);
}
function Bv(t, n) {
  n[Sn].changeDetectionScheduler?.notify(8), nc(t, n, n[Ie], 2, null, null);
}
function gE(t) {
  let n = t[ps];
  if (!n) return Bd(t[oe], t);
  for (; n; ) {
    let e = null;
    if (Ci(n)) e = n[ps];
    else {
      let i = n[It];
      i && (e = i);
    }
    if (!e) {
      for (; n && !n[en] && n !== t; ) Ci(n) && Bd(n[oe], n), (n = n[ut]);
      n === null && (n = t), Ci(n) && Bd(n[oe], n), (e = n && n[en]);
    }
    n = e;
  }
}
function vE(t, n, e, i) {
  let r = It + i,
    o = e.length;
  i > 0 && (e[r - 1][en] = n),
    i < o - It ? ((n[en] = e[r]), b1(e, It + i, n)) : (e.push(n), (n[en] = null)),
    (n[ut] = e);
  let s = n[dr];
  s !== null && e !== s && Uv(s, n);
  let a = n[Kn];
  a !== null && a.insertView(t), nf(n), (n[q] |= 128);
}
function Uv(t, n) {
  let e = t[vo],
    i = n[ut];
  if (Ci(i)) t[q] |= El.HasTransplantedViews;
  else {
    let r = i[ut][En];
    n[En] !== r && (t[q] |= El.HasTransplantedViews);
  }
  e === null ? (t[vo] = [n]) : e.push(n);
}
function Sh(t, n) {
  let e = t[vo],
    i = e.indexOf(n);
  e.splice(i, 1);
}
function Df(t, n) {
  if (t.length <= It) return;
  let e = It + n,
    i = t[e];
  if (i) {
    let r = i[dr];
    r !== null && r !== t && Sh(r, i), n > 0 && (t[e - 1][en] = i[en]);
    let o = bl(t, It + n);
    pE(i[oe], i);
    let s = o[Kn];
    s !== null && s.detachView(o[oe]), (i[ut] = null), (i[en] = null), (i[q] &= -129);
  }
  return i;
}
function $v(t, n) {
  if (!(n[q] & 256)) {
    let e = n[Ie];
    e.destroyNode && nc(t, n, e, 3, null, null), gE(n);
  }
}
function Bd(t, n) {
  if (n[q] & 256) return;
  let e = ue(null);
  try {
    (n[q] &= -129),
      (n[q] |= 256),
      n[Bt] && hd(n[Bt]),
      yE(t, n),
      _E(t, n),
      n[oe].type === 1 && n[Ie].destroy();
    let i = n[dr];
    if (i !== null && ni(n[ut])) {
      i !== n[ut] && Sh(i, n);
      let r = n[Kn];
      r !== null && r.detachView(t);
    }
    PS(n);
  } finally {
    ue(e);
  }
}
function _E(t, n) {
  let e = t.cleanup,
    i = n[Dl];
  if (e !== null)
    for (let o = 0; o < e.length - 1; o += 2)
      if (typeof e[o] == 'string') {
        let s = e[o + 3];
        s >= 0 ? i[s]() : i[-s].unsubscribe(), (o += 2);
      } else {
        let s = i[e[o + 1]];
        e[o].call(s);
      }
  i !== null && (n[Dl] = null);
  let r = n[bi];
  if (r !== null) {
    n[bi] = null;
    for (let o = 0; o < r.length; o++) {
      let s = r[o];
      s();
    }
  }
}
function yE(t, n) {
  let e;
  if (t != null && (e = t.destroyHooks) != null)
    for (let i = 0; i < e.length; i += 2) {
      let r = n[e[i]];
      if (!(r instanceof mr)) {
        let o = e[i + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = r[o[s]],
              l = o[s + 1];
            Cn(4, a, l);
            try {
              l.call(a);
            } finally {
              Cn(5, a, l);
            }
          }
        else {
          Cn(4, r, o);
          try {
            o.call(r);
          } finally {
            Cn(5, r, o);
          }
        }
      }
    }
}
function bE(t, n, e) {
  return CE(t, n.parent, e);
}
function CE(t, n, e) {
  let i = n;
  for (; i !== null && i.type & 168; ) (n = i), (i = n.parent);
  if (i === null) return e[In];
  {
    let { componentOffset: r } = i;
    if (r > -1) {
      let { encapsulation: o } = t.data[i.directiveStart + r];
      if (o === Dn.None || o === Dn.Emulated) return null;
    }
    return $t(i, e);
  }
}
function Al(t, n, e, i, r) {
  t.insertBefore(n, e, i, r);
}
function Hv(t, n, e) {
  t.appendChild(n, e);
}
function q0(t, n, e, i, r) {
  i !== null ? Al(t, n, e, i, r) : Hv(t, n, e);
}
function Gv(t, n) {
  return t.parentNode(n);
}
function wE(t, n) {
  return t.nextSibling(n);
}
function DE(t, n, e) {
  return EE(t, n, e);
}
function SE(t, n, e) {
  return t.type & 40 ? $t(t, e) : null;
}
var EE = SE,
  Q0;
function tc(t, n, e, i) {
  let r = bE(t, i, n),
    o = n[Ie],
    s = i.parent || n[rn],
    a = DE(s, i, n);
  if (r != null)
    if (Array.isArray(e)) for (let l = 0; l < e.length; l++) q0(o, r, e[l], a, !1);
    else q0(o, r, e, a, !1);
  Q0 !== void 0 && Q0(o, i, n, e, r);
}
function ls(t, n) {
  if (n !== null) {
    let e = n.type;
    if (e & 3) return $t(n, t);
    if (e & 4) return Sf(-1, t[n.index]);
    if (e & 8) {
      let i = n.child;
      if (i !== null) return ls(t, i);
      {
        let r = t[n.index];
        return ni(r) ? Sf(-1, r) : Mn(r);
      }
    } else {
      if (e & 128) return ls(t, n.next);
      if (e & 32) return Dh(n, t)() || Mn(t[n.index]);
      {
        let i = zv(t, n);
        if (i !== null) {
          if (Array.isArray(i)) return i[0];
          let r = hr(t[En]);
          return ls(r, i);
        } else return ls(t, n.next);
      }
    }
  }
  return null;
}
function zv(t, n) {
  if (n !== null) {
    let i = t[En][rn],
      r = n.projection;
    return i.projection[r];
  }
  return null;
}
function Sf(t, n) {
  let e = It + t + 1;
  if (e < n.length) {
    let i = n[e],
      r = i[oe].firstChild;
    if (r !== null) return ls(i, r);
  }
  return n[fr];
}
function TE(t, n, e) {
  t.removeChild(null, n, e);
}
function Eh(t, n, e, i, r, o, s) {
  for (; e != null; ) {
    if (e.type === 128) {
      e = e.next;
      continue;
    }
    let a = i[e.index],
      l = e.type;
    if ((s && n === 0 && (a && Di(Mn(a), i), (e.flags |= 2)), (e.flags & 32) !== 32))
      if (l & 8) Eh(t, n, e.child, i, r, o, !1), co(n, t, r, a, o);
      else if (l & 32) {
        let c = Dh(e, i),
          f;
        for (; (f = c()); ) co(n, t, r, f, o);
        co(n, t, r, a, o);
      } else l & 16 ? ME(t, n, i, e, r, o) : co(n, t, r, a, o);
    e = s ? e.projectionNext : e.next;
  }
}
function nc(t, n, e, i, r, o) {
  Eh(e, i, t.firstChild, n, r, o, !1);
}
function ME(t, n, e, i, r, o) {
  let s = e[En],
    l = s[rn].projection[i.projection];
  if (Array.isArray(l))
    for (let c = 0; c < l.length; c++) {
      let f = l[c];
      co(n, t, r, f, o);
    }
  else {
    let c = l,
      f = s[ut];
    yv(i) && (c.flags |= 128), Eh(t, n, c, f, r, o, !0);
  }
}
function IE(t, n, e, i, r) {
  let o = e[fr],
    s = Mn(e);
  o !== s && co(n, t, i, o, r);
  for (let a = It; a < e.length; a++) {
    let l = e[a];
    nc(l[oe], l, t, n, i, o);
  }
}
function xE(t, n, e, i, r) {
  if (n) r ? t.addClass(e, i) : t.removeClass(e, i);
  else {
    let o = i.indexOf('-') === -1 ? void 0 : ei.DashCase;
    r == null
      ? t.removeStyle(e, i, o)
      : (typeof r == 'string' &&
          r.endsWith('!important') &&
          ((r = r.slice(0, -10)), (o |= ei.Important)),
        t.setStyle(e, i, r, o));
  }
}
function NE(t, n, e) {
  t.setAttribute(n, 'style', e);
}
function Wv(t, n, e) {
  e === '' ? t.removeAttribute(n, 'class') : t.setAttribute(n, 'class', e);
}
function qv(t, n, e) {
  let { mergedAttrs: i, classes: r, styles: o } = e;
  i !== null && Kd(t, n, i), r !== null && Wv(t, n, r), o !== null && NE(t, n, o);
}
var An = {};
function w(t = 1) {
  Qv(Fe(), fe(), br() + t, !1);
}
function Qv(t, n, e, i) {
  if (!i)
    if ((n[q] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && hl(n, o, e);
    } else {
      let o = t.preOrderHooks;
      o !== null && pl(n, o, 0, e);
    }
  pr(e);
}
function k(t, n = ae.Default) {
  let e = fe();
  if (e === null) return N(t, n);
  let i = _t();
  return hv(i, e, it(t), n);
}
function Zv(t, n, e, i, r, o) {
  let s = ue(null);
  try {
    let a = null;
    r & wi.SignalBased && (a = n[i][pi]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      r & wi.HasDecoratorInputTransform && (o = t.inputTransforms[i].call(n, o)),
      t.setInput !== null ? t.setInput(n, a, o, e, i) : k1(n, a, i, o);
  } finally {
    ue(s);
  }
}
function AE(t, n) {
  let e = t.hostBindingOpCodes;
  if (e !== null)
    try {
      for (let i = 0; i < e.length; i++) {
        let r = e[i];
        if (r < 0) pr(~r);
        else {
          let o = r,
            s = e[++i],
            a = e[++i];
          XD(s, o);
          let l = n[o];
          a(2, l);
        }
      }
    } finally {
      pr(-1);
    }
}
function ic(t, n, e, i, r, o, s, a, l, c, f) {
  let p = n.blueprint.slice();
  return (
    (p[In] = r),
    (p[q] = i | 4 | 128 | 8 | 64),
    (c !== null || (t && t[q] & 2048)) && (p[q] |= 2048),
    H1(p),
    (p[ut] = p[Co] = t),
    (p[tn] = e),
    (p[Sn] = s || (t && t[Sn])),
    (p[Ie] = a || (t && t[Ie])),
    (p[go] = l || (t && t[go]) || null),
    (p[rn] = o),
    (p[ql] = OS()),
    (p[wl] = f),
    (p[F1] = c),
    (p[En] = n.type == 2 ? t[En] : p),
    p
  );
}
function Ss(t, n, e, i, r) {
  let o = t.data[n];
  if (o === null) (o = OE(t, n, e, i, r)), JD() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = e), (o.value = i), (o.attrs = r);
    let s = QD();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return yr(o, !0), o;
}
function OE(t, n, e, i, r) {
  let o = Q1(),
    s = lh(),
    a = s ? o : o && o.parent,
    l = (t.data[n] = VE(t, a, e, n, i, r));
  return (
    t.firstChild === null && (t.firstChild = l),
    o !== null &&
      (s
        ? o.child == null && l.parent !== null && (o.child = l)
        : o.next === null && ((o.next = l), (l.prev = o))),
    l
  );
}
function Kv(t, n, e, i) {
  if (e === 0) return -1;
  let r = n.length;
  for (let o = 0; o < e; o++) n.push(i), t.blueprint.push(i), t.data.push(null);
  return r;
}
function Yv(t, n, e, i, r) {
  let o = br(),
    s = i & 2;
  try {
    pr(-1), s && n.length > Tn && Qv(t, n, Tn, !1), Cn(s ? 2 : 0, r), e(i, r);
  } finally {
    pr(o), Cn(s ? 3 : 1, r);
  }
}
function Th(t, n, e) {
  if (sh(n)) {
    let i = ue(null);
    try {
      let r = n.directiveStart,
        o = n.directiveEnd;
      for (let s = r; s < o; s++) {
        let a = t.data[s];
        if (a.contentQueries) {
          let l = e[s];
          a.contentQueries(1, l, s);
        }
      }
    } finally {
      ue(i);
    }
  }
}
function Mh(t, n, e) {
  q1() && (GE(t, n, e, $t(e, n)), (e.flags & 64) === 64 && e_(t, n, e));
}
function Ih(t, n, e = $t) {
  let i = n.localNames;
  if (i !== null) {
    let r = n.index + 1;
    for (let o = 0; o < i.length; o += 2) {
      let s = i[o + 1],
        a = s === -1 ? e(n, t) : t[s];
      t[r++] = a;
    }
  }
}
function Jv(t) {
  let n = t.tView;
  return n === null || n.incompleteFirstPass
    ? (t.tView = xh(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id,
      ))
    : n;
}
function xh(t, n, e, i, r, o, s, a, l, c, f) {
  let p = Tn + i,
    g = p + r,
    m = RE(p, g),
    v = typeof c == 'function' ? c() : c;
  return (m[oe] = {
    type: t,
    blueprint: m,
    template: e,
    queries: null,
    viewQuery: a,
    declTNode: n,
    data: m.slice().fill(null, p),
    bindingStartIndex: p,
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
    schemas: l,
    consts: v,
    incompleteFirstPass: !1,
    ssrId: f,
  });
}
function RE(t, n) {
  let e = [];
  for (let i = 0; i < n; i++) e.push(i < t ? null : An);
  return e;
}
function PE(t, n, e, i) {
  let o = i.get(jS, Tv) || e === Dn.ShadowDom,
    s = t.selectRootElement(n, o);
  return FE(s), s;
}
function FE(t) {
  kE(t);
}
var kE = () => null;
function LE(t, n, e, i) {
  let r = i_(n);
  r.push(e), t.firstCreatePass && r_(t).push(i, r.length - 1);
}
function VE(t, n, e, i, r, o) {
  let s = n ? n.injectorIndex : -1,
    a = 0;
  return (
    zD() && (a |= 128),
    {
      type: e,
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
function Z0(t, n, e, i, r) {
  for (let o in n) {
    if (!n.hasOwnProperty(o)) continue;
    let s = n[o];
    if (s === void 0) continue;
    i ??= {};
    let a,
      l = wi.None;
    Array.isArray(s) ? ((a = s[0]), (l = s[1])) : (a = s);
    let c = o;
    if (r !== null) {
      if (!r.hasOwnProperty(o)) continue;
      c = r[o];
    }
    t === 0 ? K0(i, e, c, a, l) : K0(i, e, c, a);
  }
  return i;
}
function K0(t, n, e, i, r) {
  let o;
  t.hasOwnProperty(e) ? (o = t[e]).push(n, i) : (o = t[e] = [n, i]), r !== void 0 && o.push(r);
}
function jE(t, n, e) {
  let i = n.directiveStart,
    r = n.directiveEnd,
    o = t.data,
    s = n.attrs,
    a = [],
    l = null,
    c = null;
  for (let f = i; f < r; f++) {
    let p = o[f],
      g = e ? e.get(p) : null,
      m = g ? g.inputs : null,
      v = g ? g.outputs : null;
    (l = Z0(0, p.inputs, f, l, m)), (c = Z0(1, p.outputs, f, c, v));
    let _ = l !== null && s !== null && !eh(n) ? tT(l, f, s) : null;
    a.push(_);
  }
  l !== null &&
    (l.hasOwnProperty('class') && (n.flags |= 8), l.hasOwnProperty('style') && (n.flags |= 16)),
    (n.initialInputs = a),
    (n.inputs = l),
    (n.outputs = c);
}
function BE(t) {
  return t === 'class'
    ? 'className'
    : t === 'for'
      ? 'htmlFor'
      : t === 'formaction'
        ? 'formAction'
        : t === 'innerHtml'
          ? 'innerHTML'
          : t === 'readonly'
            ? 'readOnly'
            : t === 'tabindex'
              ? 'tabIndex'
              : t;
}
function rc(t, n, e, i, r, o, s, a) {
  let l = $t(n, e),
    c = n.inputs,
    f;
  !a && c != null && (f = c[i])
    ? (Ah(t, e, f, i, r), Ql(n) && UE(e, n.index))
    : n.type & 3
      ? ((i = BE(i)), (r = s != null ? s(r, n.value || '', i) : r), o.setProperty(l, i, r))
      : n.type & 12;
}
function UE(t, n) {
  let e = Ii(n, t);
  e[q] & 16 || (e[q] |= 64);
}
function Nh(t, n, e, i) {
  if (q1()) {
    let r = i === null ? null : { '': -1 },
      o = WE(t, e),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && Xv(t, n, e, s, r, a),
      r && qE(e, i, r);
  }
  e.mergedAttrs = fs(e.mergedAttrs, e.attrs);
}
function Xv(t, n, e, i, r, o) {
  for (let c = 0; c < i.length; c++) af(Il(e, n), t, i[c].type);
  ZE(e, t.data.length, i.length);
  for (let c = 0; c < i.length; c++) {
    let f = i[c];
    f.providersResolver && f.providersResolver(f);
  }
  let s = !1,
    a = !1,
    l = Kv(t, n, i.length, null);
  for (let c = 0; c < i.length; c++) {
    let f = i[c];
    (e.mergedAttrs = fs(e.mergedAttrs, f.hostAttrs)),
      KE(t, e, n, l, f),
      QE(l, f, r),
      f.contentQueries !== null && (e.flags |= 4),
      (f.hostBindings !== null || f.hostAttrs !== null || f.hostVars !== 0) && (e.flags |= 64);
    let p = f.type.prototype;
    !s &&
      (p.ngOnChanges || p.ngOnInit || p.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(e.index), (s = !0)),
      !a &&
        (p.ngOnChanges || p.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(e.index), (a = !0)),
      l++;
  }
  jE(t, e, o);
}
function $E(t, n, e, i, r) {
  let o = r.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~n.index;
    HE(s) != a && s.push(a), s.push(e, i, o);
  }
}
function HE(t) {
  let n = t.length;
  for (; n > 0; ) {
    let e = t[--n];
    if (typeof e == 'number' && e < 0) return e;
  }
  return 0;
}
function GE(t, n, e, i) {
  let r = e.directiveStart,
    o = e.directiveEnd;
  Ql(e) && YE(n, e, t.data[r + e.componentOffset]), t.firstCreatePass || Il(e, n), Di(i, n);
  let s = e.initialInputs;
  for (let a = r; a < o; a++) {
    let l = t.data[a],
      c = gr(n, t, a, e);
    if ((Di(c, n), s !== null && eT(n, a - r, c, l, e, s), Yn(l))) {
      let f = Ii(e.index, n);
      f[tn] = gr(n, t, a, e);
    }
  }
}
function e_(t, n, e) {
  let i = e.directiveStart,
    r = e.directiveEnd,
    o = e.index,
    s = eS();
  try {
    pr(o);
    for (let a = i; a < r; a++) {
      let l = t.data[a],
        c = n[a];
      rf(a), (l.hostBindings !== null || l.hostVars !== 0 || l.hostAttrs !== null) && zE(l, c);
    }
  } finally {
    pr(-1), rf(s);
  }
}
function zE(t, n) {
  t.hostBindings !== null && t.hostBindings(1, n);
}
function WE(t, n) {
  let e = t.directiveRegistry,
    i = null,
    r = null;
  if (e)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      if (fD(n, s.selectors, !1))
        if ((i || (i = []), Yn(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (r = r || new Map()), s.findHostDirectiveDefs(s, a, r), i.unshift(...a, s);
            let l = a.length;
            Ef(t, n, l);
          } else i.unshift(s), Ef(t, n, 0);
        else (r = r || new Map()), s.findHostDirectiveDefs?.(s, i, r), i.push(s);
    }
  return i === null ? null : [i, r];
}
function Ef(t, n, e) {
  (n.componentOffset = e), (t.components ??= []).push(n.index);
}
function qE(t, n, e) {
  if (n) {
    let i = (t.localNames = []);
    for (let r = 0; r < n.length; r += 2) {
      let o = e[n[r + 1]];
      if (o == null) throw new T(-301, !1);
      i.push(n[r], o);
    }
  }
}
function QE(t, n, e) {
  if (e) {
    if (n.exportAs) for (let i = 0; i < n.exportAs.length; i++) e[n.exportAs[i]] = t;
    Yn(n) && (e[''] = t);
  }
}
function ZE(t, n, e) {
  (t.flags |= 1), (t.directiveStart = n), (t.directiveEnd = n + e), (t.providerIndexes = n);
}
function KE(t, n, e, i, r) {
  t.data[i] = r;
  let o = r.factory || (r.factory = ho(r.type, !0)),
    s = new mr(o, Yn(r), k);
  (t.blueprint[i] = s), (e[i] = s), $E(t, n, i, Kv(t, e, r.hostVars, An), r);
}
function YE(t, n, e) {
  let i = $t(n, t),
    r = Jv(e),
    o = t[Sn].rendererFactory,
    s = 16;
  e.signals ? (s = 4096) : e.onPush && (s = 64);
  let a = oc(t, ic(t, r, null, s, i, n, null, o.createRenderer(i, e), null, null, null));
  t[n.index] = a;
}
function JE(t, n, e, i, r, o) {
  let s = $t(t, n);
  XE(n[Ie], s, o, t.value, e, i, r);
}
function XE(t, n, e, i, r, o, s) {
  if (o == null) t.removeAttribute(n, r, e);
  else {
    let a = s == null ? Hl(o) : s(o, i || '', r);
    t.setAttribute(n, r, a, e);
  }
}
function eT(t, n, e, i, r, o) {
  let s = o[n];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let l = s[a++],
        c = s[a++],
        f = s[a++],
        p = s[a++];
      Zv(i, e, l, c, f, p);
    }
}
function tT(t, n, e) {
  let i = null,
    r = 0;
  for (; r < e.length; ) {
    let o = e[r];
    if (o === 0) {
      r += 4;
      continue;
    } else if (o === 5) {
      r += 2;
      continue;
    }
    if (typeof o == 'number') break;
    if (t.hasOwnProperty(o)) {
      i === null && (i = []);
      let s = t[o];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === n) {
          i.push(o, s[a + 1], s[a + 2], e[r + 1]);
          break;
        }
    }
    r += 2;
  }
  return i;
}
function t_(t, n, e, i) {
  return [t, !0, 0, n, null, i, null, e, null, null];
}
function n_(t, n) {
  let e = t.contentQueries;
  if (e !== null) {
    let i = ue(null);
    try {
      for (let r = 0; r < e.length; r += 2) {
        let o = e[r],
          s = e[r + 1];
        if (s !== -1) {
          let a = t.data[s];
          ch(o), a.contentQueries(2, n[s], s);
        }
      }
    } finally {
      ue(i);
    }
  }
}
function oc(t, n) {
  return t[ps] ? (t[N0][en] = n) : (t[ps] = n), (t[N0] = n), n;
}
function Tf(t, n, e) {
  ch(0);
  let i = ue(null);
  try {
    n(t, e);
  } finally {
    ue(i);
  }
}
function i_(t) {
  return (t[Dl] ??= []);
}
function r_(t) {
  return (t.cleanup ??= []);
}
function nT(t, n, e) {
  return (t === null || Yn(t)) && (e = kD(e[n.index])), e[Ie];
}
function o_(t, n) {
  let e = t[go],
    i = e ? e.get(Jn, null) : null;
  i && i.handleError(n);
}
function Ah(t, n, e, i, r) {
  for (let o = 0; o < e.length; ) {
    let s = e[o++],
      a = e[o++],
      l = e[o++],
      c = n[s],
      f = t.data[s];
    Zv(f, c, i, a, l, r);
  }
}
function iT(t, n, e) {
  let i = U1(n, t);
  fE(t[Ie], i, e);
}
function rT(t, n) {
  let e = Ii(n, t),
    i = e[oe];
  oT(i, e);
  let r = e[In];
  r !== null && e[wl] === null && (e[wl] = yh(r, e[go])), Oh(i, e, e[tn]);
}
function oT(t, n) {
  for (let e = n.length; e < t.blueprint.length; e++) n.push(t.blueprint[e]);
}
function Oh(t, n, e) {
  uh(n);
  try {
    let i = t.viewQuery;
    i !== null && Tf(1, i, e);
    let r = t.template;
    r !== null && Yv(t, n, r, 1, e),
      t.firstCreatePass && (t.firstCreatePass = !1),
      n[Kn]?.finishViewCreation(t),
      t.staticContentQueries && n_(t, n),
      t.staticViewQueries && Tf(2, t.viewQuery, e);
    let o = t.components;
    o !== null && sT(n, o);
  } catch (i) {
    throw (t.firstCreatePass && ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)), i);
  } finally {
    (n[q] &= -5), dh();
  }
}
function sT(t, n) {
  for (let e = 0; e < n.length; e++) rT(t, n[e]);
}
function aT(t, n, e, i) {
  let r = ue(null);
  try {
    let o = n.tView,
      a = t[q] & 4096 ? 4096 : 16,
      l = ic(
        t,
        o,
        e,
        a,
        null,
        n,
        null,
        null,
        i?.injector ?? null,
        i?.embeddedViewInjector ?? null,
        i?.dehydratedView ?? null,
      ),
      c = t[n.index];
    l[dr] = c;
    let f = t[Kn];
    return f !== null && (l[Kn] = f.createEmbeddedView(o)), Oh(o, l, e), l;
  } finally {
    ue(r);
  }
}
function Y0(t, n) {
  return !n || n.firstChild === null || yv(t);
}
function lT(t, n, e, i = !0) {
  let r = n[oe];
  if ((vE(r, n, t, e), i)) {
    let s = Sf(e, t),
      a = n[Ie],
      l = Gv(a, t[fr]);
    l !== null && mE(r, t[rn], a, n, l, s);
  }
  let o = n[wl];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function Ol(t, n, e, i, r = !1) {
  for (; e !== null; ) {
    if (e.type === 128) {
      e = r ? e.projectionNext : e.next;
      continue;
    }
    let o = n[e.index];
    o !== null && i.push(Mn(o)), ni(o) && cT(o, i);
    let s = e.type;
    if (s & 8) Ol(t, n, e.child, i);
    else if (s & 32) {
      let a = Dh(e, n),
        l;
      for (; (l = a()); ) i.push(l);
    } else if (s & 16) {
      let a = zv(n, e);
      if (Array.isArray(a)) i.push(...a);
      else {
        let l = hr(n[En]);
        Ol(l[oe], l, a, i, !0);
      }
    }
    e = r ? e.projectionNext : e.next;
  }
  return i;
}
function cT(t, n) {
  for (let e = It; e < t.length; e++) {
    let i = t[e],
      r = i[oe].firstChild;
    r !== null && Ol(i[oe], i, r, n);
  }
  t[fr] !== t[In] && n.push(t[fr]);
}
var s_ = [];
function uT(t) {
  return t[Bt] ?? dT(t);
}
function dT(t) {
  let n = s_.pop() ?? Object.create(hT);
  return (n.lView = t), n;
}
function fT(t) {
  t.lView[Bt] !== t && ((t.lView = null), s_.push(t));
}
var hT = ee(E({}, es), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    Kl(t.lView);
  },
  consumerOnSignalRead() {
    this.lView[Bt] = this;
  },
});
function pT(t) {
  let n = t[Bt] ?? Object.create(mT);
  return (n.lView = t), n;
}
var mT = ee(E({}, es), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    let n = hr(t.lView);
    for (; n && !a_(n[oe]); ) n = hr(n);
    n && G1(n);
  },
  consumerOnSignalRead() {
    this.lView[Bt] = this;
  },
});
function a_(t) {
  return t.type !== 2;
}
var gT = 100;
function l_(t, n = !0, e = 0) {
  let i = t[Sn],
    r = i.rendererFactory,
    o = !1;
  o || r.begin?.();
  try {
    vT(t, e);
  } catch (s) {
    throw (n && o_(t, s), s);
  } finally {
    o || (r.end?.(), i.inlineEffectRunner?.flush());
  }
}
function vT(t, n) {
  let e = K1();
  try {
    O0(!0), Mf(t, n);
    let i = 0;
    for (; ms(t); ) {
      if (i === gT) throw new T(103, !1);
      i++, Mf(t, 1);
    }
  } finally {
    O0(e);
  }
}
function _T(t, n, e, i) {
  let r = n[q];
  if ((r & 256) === 256) return;
  let o = !1,
    s = !1;
  !o && n[Sn].inlineEffectRunner?.flush(), uh(n);
  let a = !0,
    l = null,
    c = null;
  o ||
    (a_(t)
      ? ((c = uT(n)), (l = Na(c)))
      : Og() === null
        ? ((a = !1), (c = pT(n)), (l = Na(c)))
        : n[Bt] && (hd(n[Bt]), (n[Bt] = null)));
  try {
    H1(n), YD(t.bindingStartIndex), e !== null && Yv(t, n, e, 2, i);
    let f = (r & 3) === 3;
    if (!o)
      if (f) {
        let m = t.preOrderCheckHooks;
        m !== null && hl(n, m, null);
      } else {
        let m = t.preOrderHooks;
        m !== null && pl(n, m, 0, null), kd(n, 0);
      }
    if ((s || yT(n), c_(n, 0), t.contentQueries !== null && n_(t, n), !o))
      if (f) {
        let m = t.contentCheckHooks;
        m !== null && hl(n, m);
      } else {
        let m = t.contentHooks;
        m !== null && pl(n, m, 1), kd(n, 1);
      }
    AE(t, n);
    let p = t.components;
    p !== null && d_(n, p, 0);
    let g = t.viewQuery;
    if ((g !== null && Tf(2, g, i), !o))
      if (f) {
        let m = t.viewCheckHooks;
        m !== null && hl(n, m);
      } else {
        let m = t.viewHooks;
        m !== null && pl(n, m, 2), kd(n, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), n[Fd])) {
      for (let m of n[Fd]) m();
      n[Fd] = null;
    }
    o || (n[q] &= -73);
  } catch (f) {
    throw (o || Kl(n), f);
  } finally {
    c !== null && (dd(c, l), a && fT(c)), dh();
  }
}
function c_(t, n) {
  for (let e = Cv(t); e !== null; e = wv(e))
    for (let i = It; i < e.length; i++) {
      let r = e[i];
      u_(r, n);
    }
}
function yT(t) {
  for (let n = Cv(t); n !== null; n = wv(n)) {
    if (!(n[q] & El.HasTransplantedViews)) continue;
    let e = n[vo];
    for (let i = 0; i < e.length; i++) {
      let r = e[i];
      G1(r);
    }
  }
}
function bT(t, n, e) {
  let i = Ii(n, t);
  u_(i, e);
}
function u_(t, n) {
  ah(t) && Mf(t, n);
}
function Mf(t, n) {
  let i = t[oe],
    r = t[q],
    o = t[Bt],
    s = !!(n === 0 && r & 16);
  if (
    ((s ||= !!(r & 64 && n === 0)),
    (s ||= !!(r & 1024)),
    (s ||= !!(o?.dirty && fd(o))),
    (s ||= !1),
    o && (o.dirty = !1),
    (t[q] &= -9217),
    s)
  )
    _T(i, t, i.template, t[tn]);
  else if (r & 8192) {
    c_(t, 1);
    let a = i.components;
    a !== null && d_(t, a, 1);
  }
}
function d_(t, n, e) {
  for (let i = 0; i < n.length; i++) bT(t, n[i], e);
}
function Rh(t, n) {
  let e = K1() ? 64 : 1088;
  for (t[Sn].changeDetectionScheduler?.notify(n); t; ) {
    t[q] |= e;
    let i = hr(t);
    if (ef(t) && !i) return t;
    t = i;
  }
  return null;
}
var vr = class {
    get rootNodes() {
      let n = this._lView,
        e = n[oe];
      return Ol(e, n, e.firstChild, []);
    }
    constructor(n, e, i = !0) {
      (this._lView = n),
        (this._cdRefInjectingView = e),
        (this.notifyErrorHandler = i),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[tn];
    }
    set context(n) {
      this._lView[tn] = n;
    }
    get destroyed() {
      return (this._lView[q] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let n = this._lView[ut];
        if (ni(n)) {
          let e = n[Sl],
            i = e ? e.indexOf(this) : -1;
          i > -1 && (Df(n, i), bl(e, i));
        }
        this._attachedToViewContainer = !1;
      }
      $v(this._lView[oe], this._lView);
    }
    onDestroy(n) {
      z1(this._lView, n);
    }
    markForCheck() {
      Rh(this._cdRefInjectingView || this._lView, 4);
    }
    detach() {
      this._lView[q] &= -129;
    }
    reattach() {
      nf(this._lView), (this._lView[q] |= 128);
    }
    detectChanges() {
      (this._lView[q] |= 1024), l_(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new T(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      this._appRef = null;
      let n = ef(this._lView),
        e = this._lView[dr];
      e !== null && !n && Sh(e, this._lView), Bv(this._lView[oe], this._lView);
    }
    attachToAppRef(n) {
      if (this._attachedToViewContainer) throw new T(902, !1);
      this._appRef = n;
      let e = ef(this._lView),
        i = this._lView[dr];
      i !== null && !e && Uv(i, this._lView), nf(this._lView);
    }
  },
  ti = (() => {
    class t {
      static {
        this.__NG_ELEMENT_ID__ = DT;
      }
    }
    return t;
  })(),
  CT = ti,
  wT = class extends CT {
    constructor(n, e, i) {
      super(),
        (this._declarationLView = n),
        (this._declarationTContainer = e),
        (this.elementRef = i);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(n, e) {
      return this.createEmbeddedViewImpl(n, e);
    }
    createEmbeddedViewImpl(n, e, i) {
      let r = aT(this._declarationLView, this._declarationTContainer, n, {
        embeddedViewInjector: e,
        dehydratedView: i,
      });
      return new vr(r);
    }
  };
function DT() {
  return sc(_t(), fe());
}
function sc(t, n) {
  return t.type & 4 ? new wT(n, t, wo(t, n)) : null;
}
var M9 = new RegExp(`^(\\d+)*(${LS}|${kS})*(.*)`);
var ST = () => null;
function J0(t, n) {
  return ST(t, n);
}
var yo = class {},
  Ph = new F('', { providedIn: 'root', factory: () => !1 });
var f_ = new F(''),
  If = class {},
  Rl = class {};
function ET(t) {
  let n = Error(`No component factory found for ${gt(t)}.`);
  return (n[TT] = t), n;
}
var TT = 'ngComponent';
var xf = class {
    resolveComponentFactory(n) {
      throw ET(n);
    }
  },
  Si = class {
    static {
      this.NULL = new xf();
    }
  },
  Ei = class {},
  Ni = (() => {
    class t {
      constructor() {
        this.destroyNode = null;
      }
      static {
        this.__NG_ELEMENT_ID__ = () => MT();
      }
    }
    return t;
  })();
function MT() {
  let t = fe(),
    n = _t(),
    e = Ii(n.index, t);
  return (Ci(e) ? e : t)[Ie];
}
var IT = (() => {
  class t {
    static {
      this.ɵprov = M({ token: t, providedIn: 'root', factory: () => null });
    }
  }
  return t;
})();
var X0 = new Set();
function On(t) {
  X0.has(t) || (X0.add(t), performance?.mark?.('mark_feature_usage', { detail: { feature: t } }));
}
var Ke = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = 'EarlyRead'),
      (t[(t.Write = 1)] = 'Write'),
      (t[(t.MixedReadWrite = 2)] = 'MixedReadWrite'),
      (t[(t.Read = 3)] = 'Read'),
      t
    );
  })(Ke || {}),
  h_ = { destroy() {} };
function Fh(t, n) {
  !n && Wl(Fh);
  let e = n?.injector ?? y(Ge);
  return Vv(e) ? (On('NgAfterRender'), p_(t, e, !1, n?.phase ?? Ke.MixedReadWrite)) : h_;
}
function ac(t, n) {
  !n && Wl(ac);
  let e = n?.injector ?? y(Ge);
  return Vv(e) ? (On('NgAfterNextRender'), p_(t, e, !0, n?.phase ?? Ke.MixedReadWrite)) : h_;
}
function xT(t, n) {
  if (t instanceof Function)
    switch (n) {
      case Ke.EarlyRead:
        return { earlyRead: t };
      case Ke.Write:
        return { write: t };
      case Ke.MixedReadWrite:
        return { mixedReadWrite: t };
      case Ke.Read:
        return { read: t };
    }
  return t;
}
function p_(t, n, e, i) {
  let r = xT(t, i),
    o = n.get(kh),
    s = (o.handler ??= new Af()),
    a = [],
    l = [],
    c = () => {
      for (let m of l) s.unregister(m);
      f();
    },
    f = n.get(Cr).onDestroy(c),
    p = 0,
    g = (m, v) => {
      if (!v) return;
      let _ = e ? (...S) => (p--, p < 1 && c(), v(...S)) : v,
        C = Ut(n, () => new Nf(m, a, _));
      s.register(C), l.push(C), p++;
    };
  return (
    g(Ke.EarlyRead, r.earlyRead),
    g(Ke.Write, r.write),
    g(Ke.MixedReadWrite, r.mixedReadWrite),
    g(Ke.Read, r.read),
    { destroy: c }
  );
}
var Nf = class {
    constructor(n, e, i) {
      (this.phase = n),
        (this.pipelinedArgs = e),
        (this.callbackFn = i),
        (this.zone = y(me)),
        (this.errorHandler = y(Jn, { optional: !0 })),
        y(yo, { optional: !0 })?.notify(6);
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
  Af = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [Ke.EarlyRead]: new Set(),
          [Ke.Write]: new Set(),
          [Ke.MixedReadWrite]: new Set(),
          [Ke.Read]: new Set(),
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
      for (let n of Object.values(this.buckets)) for (let e of n) e.invoke();
      this.executingCallbacks = !1;
      for (let n of this.deferredCallbacks) this.buckets[n.phase].add(n);
      this.deferredCallbacks.clear();
    }
    destroy() {
      for (let n of Object.values(this.buckets)) n.clear();
      this.deferredCallbacks.clear();
    }
  },
  kh = (() => {
    class t {
      constructor() {
        (this.handler = null), (this.internalCallbacks = []);
      }
      execute() {
        this.executeInternalCallbacks(), this.handler?.execute();
      }
      executeInternalCallbacks() {
        let e = [...this.internalCallbacks];
        this.internalCallbacks.length = 0;
        for (let i of e) i();
      }
      ngOnDestroy() {
        this.handler?.destroy(), (this.handler = null), (this.internalCallbacks.length = 0);
      }
      static {
        this.ɵprov = M({
          token: t,
          providedIn: 'root',
          factory: () => new t(),
        });
      }
    }
    return t;
  })();
function Pl(t, n, e) {
  let i = e ? t.styles : null,
    r = e ? t.classes : null,
    o = 0;
  if (n !== null)
    for (let s = 0; s < n.length; s++) {
      let a = n[s];
      if (typeof a == 'number') o = a;
      else if (o == 1) r = Wd(r, a);
      else if (o == 2) {
        let l = a,
          c = n[++s];
        i = Wd(i, l + ': ' + c + ';');
      }
    }
  e ? (t.styles = i) : (t.stylesWithoutHost = i), e ? (t.classes = r) : (t.classesWithoutHost = r);
}
var Fl = class extends Si {
  constructor(n) {
    super(), (this.ngModule = n);
  }
  resolveComponentFactory(n) {
    let e = ur(n);
    return new gs(e, this.ngModule);
  }
};
function e1(t, n) {
  let e = [];
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue;
    let r = t[i];
    if (r === void 0) continue;
    let o = Array.isArray(r),
      s = o ? r[0] : r,
      a = o ? r[1] : wi.None;
    n
      ? e.push({
          propName: s,
          templateName: i,
          isSignal: (a & wi.SignalBased) !== 0,
        })
      : e.push({ propName: s, templateName: i });
  }
  return e;
}
function NT(t) {
  let n = t.toLowerCase();
  return n === 'svg' ? B1 : n === 'math' ? FD : null;
}
var gs = class extends Rl {
    get inputs() {
      let n = this.componentDef,
        e = n.inputTransforms,
        i = e1(n.inputs, !0);
      if (e !== null)
        for (let r of i) e.hasOwnProperty(r.propName) && (r.transform = e[r.propName]);
      return i;
    }
    get outputs() {
      return e1(this.componentDef.outputs, !1);
    }
    constructor(n, e) {
      super(),
        (this.componentDef = n),
        (this.ngModule = e),
        (this.componentType = n.type),
        (this.selector = gD(n.selectors)),
        (this.ngContentSelectors = n.ngContentSelectors ? n.ngContentSelectors : []),
        (this.isBoundToModule = !!e);
    }
    create(n, e, i, r) {
      let o = ue(null);
      try {
        r = r || this.ngModule;
        let s = r instanceof vt ? r : r?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new of(n, s) : n,
          l = a.get(Ei, null);
        if (l === null) throw new T(407, !1);
        let c = a.get(IT, null),
          f = a.get(kh, null),
          p = a.get(yo, null),
          g = {
            rendererFactory: l,
            sanitizer: c,
            inlineEffectRunner: null,
            afterRenderEventManager: f,
            changeDetectionScheduler: p,
          },
          m = l.createRenderer(null, this.componentDef),
          v = this.componentDef.selectors[0][0] || 'div',
          _ = i ? PE(m, i, this.componentDef.encapsulation, a) : jv(m, v, NT(v)),
          C = 512;
        this.componentDef.signals ? (C |= 4096) : this.componentDef.onPush || (C |= 16);
        let S = null;
        _ !== null && (S = yh(_, a, !0));
        let O = xh(0, null, null, 1, 0, null, null, null, null, null, null),
          I = ic(null, O, null, C, null, null, g, m, a, null, S);
        uh(I);
        let A, G;
        try {
          let B = this.componentDef,
            W,
            ce = null;
          B.findHostDirectiveDefs
            ? ((W = []), (ce = new Map()), B.findHostDirectiveDefs(B, W, ce), W.push(B))
            : (W = [B]);
          let _e = AT(I, _),
            ye = OT(_e, _, B, W, I, g, m);
          (G = $1(O, Tn)),
            _ && FT(m, B, _, i),
            e !== void 0 && kT(G, this.ngContentSelectors, e),
            (A = PT(ye, B, W, ce, I, [LT])),
            Oh(O, I, null);
        } finally {
          dh();
        }
        return new Of(this.componentType, A, wo(G, I), I, G);
      } finally {
        ue(o);
      }
    }
  },
  Of = class extends If {
    constructor(n, e, i, r, o) {
      super(),
        (this.location = i),
        (this._rootLView = r),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = e),
        (this.hostView = this.changeDetectorRef = new vr(r, void 0, !1)),
        (this.componentType = n);
    }
    setInput(n, e) {
      let i = this._tNode.inputs,
        r;
      if (i !== null && (r = i[n])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(n) && Object.is(this.previousInputValues.get(n), e))
        )
          return;
        let o = this._rootLView;
        Ah(o[oe], o, r, n, e), this.previousInputValues.set(n, e);
        let s = Ii(this._tNode.index, o);
        Rh(s, 1);
      }
    }
    get injector() {
      return new cr(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(n) {
      this.hostView.onDestroy(n);
    }
  };
function AT(t, n) {
  let e = t[oe],
    i = Tn;
  return (t[i] = n), Ss(e, i, 2, '#host', null);
}
function OT(t, n, e, i, r, o, s) {
  let a = r[oe];
  RT(i, t, n, s);
  let l = null;
  n !== null && (l = yh(n, r[go]));
  let c = o.rendererFactory.createRenderer(n, e),
    f = 16;
  e.signals ? (f = 4096) : e.onPush && (f = 64);
  let p = ic(r, Jv(e), null, f, r[t.index], t, o, c, null, null, l);
  return a.firstCreatePass && Ef(a, t, i.length - 1), oc(r, p), (r[t.index] = p);
}
function RT(t, n, e, i) {
  for (let r of t) n.mergedAttrs = fs(n.mergedAttrs, r.hostAttrs);
  n.mergedAttrs !== null && (Pl(n, n.mergedAttrs, !0), e !== null && qv(i, e, n));
}
function PT(t, n, e, i, r, o) {
  let s = _t(),
    a = r[oe],
    l = $t(s, r);
  Xv(a, r, s, e, null, i);
  for (let f = 0; f < e.length; f++) {
    let p = s.directiveStart + f,
      g = gr(r, a, p, s);
    Di(g, r);
  }
  e_(a, r, s), l && Di(l, r);
  let c = gr(r, a, s.directiveStart + s.componentOffset, s);
  if (((t[tn] = r[tn] = c), o !== null)) for (let f of o) f(c, n);
  return Th(a, s, r), c;
}
function FT(t, n, e, i) {
  if (i) Kd(t, e, ['ng-version', '18.2.0']);
  else {
    let { attrs: r, classes: o } = vD(n.selectors[0]);
    r && Kd(t, e, r), o && o.length > 0 && Wv(t, e, o.join(' '));
  }
}
function kT(t, n, e) {
  let i = (t.projection = []);
  for (let r = 0; r < n.length; r++) {
    let o = e[r];
    i.push(o != null ? Array.from(o) : null);
  }
}
function LT() {
  let t = _t();
  Xl(fe()[oe], t);
}
var an = (() => {
  class t {
    static {
      this.__NG_ELEMENT_ID__ = VT;
    }
  }
  return t;
})();
function VT() {
  let t = _t();
  return g_(t, fe());
}
var jT = an,
  m_ = class extends jT {
    constructor(n, e, i) {
      super(), (this._lContainer = n), (this._hostTNode = e), (this._hostLView = i);
    }
    get element() {
      return wo(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new cr(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let n = fh(this._hostTNode, this._hostLView);
      if (av(n)) {
        let e = Ml(n, this._hostLView),
          i = Tl(n),
          r = e[oe].data[i + 8];
        return new cr(r, e);
      } else return new cr(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(n) {
      let e = t1(this._lContainer);
      return (e !== null && e[n]) || null;
    }
    get length() {
      return this._lContainer.length - It;
    }
    createEmbeddedView(n, e, i) {
      let r, o;
      typeof i == 'number' ? (r = i) : i != null && ((r = i.index), (o = i.injector));
      let s = J0(this._lContainer, n.ssrId),
        a = n.createEmbeddedViewImpl(e || {}, o, s);
      return this.insertImpl(a, r, Y0(this._hostTNode, s)), a;
    }
    createComponent(n, e, i, r, o) {
      let s = n && !AD(n),
        a;
      if (s) a = e;
      else {
        let v = e || {};
        (a = v.index),
          (i = v.injector),
          (r = v.projectableNodes),
          (o = v.environmentInjector || v.ngModuleRef);
      }
      let l = s ? n : new gs(ur(n)),
        c = i || this.parentInjector;
      if (!o && l.ngModule == null) {
        let _ = (s ? c : this.parentInjector).get(vt, null);
        _ && (o = _);
      }
      let f = ur(l.componentType ?? {}),
        p = J0(this._lContainer, f?.id ?? null),
        g = p?.firstChild ?? null,
        m = l.create(c, r, g, o);
      return this.insertImpl(m.hostView, a, Y0(this._hostTNode, p)), m;
    }
    insert(n, e) {
      return this.insertImpl(n, e, !0);
    }
    insertImpl(n, e, i) {
      let r = n._lView;
      if (jD(r)) {
        let a = this.indexOf(n);
        if (a !== -1) this.detach(a);
        else {
          let l = r[ut],
            c = new m_(l, l[rn], l[ut]);
          c.detach(c.indexOf(n));
        }
      }
      let o = this._adjustIndex(e),
        s = this._lContainer;
      return lT(s, r, o, i), n.attachToViewContainerRef(), b1(Ud(s), o, n), n;
    }
    move(n, e) {
      return this.insert(n, e);
    }
    indexOf(n) {
      let e = t1(this._lContainer);
      return e !== null ? e.indexOf(n) : -1;
    }
    remove(n) {
      let e = this._adjustIndex(n, -1),
        i = Df(this._lContainer, e);
      i && (bl(Ud(this._lContainer), e), $v(i[oe], i));
    }
    detach(n) {
      let e = this._adjustIndex(n, -1),
        i = Df(this._lContainer, e);
      return i && bl(Ud(this._lContainer), e) != null ? new vr(i) : null;
    }
    _adjustIndex(n, e = 0) {
      return n ?? this.length + e;
    }
  };
function t1(t) {
  return t[Sl];
}
function Ud(t) {
  return t[Sl] || (t[Sl] = []);
}
function g_(t, n) {
  let e,
    i = n[t.index];
  return (
    ni(i) ? (e = i) : ((e = t_(i, n, null, t)), (n[t.index] = e), oc(n, e)),
    UT(e, n, t, i),
    new m_(e, t, n)
  );
}
function BT(t, n) {
  let e = t[Ie],
    i = e.createComment(''),
    r = $t(n, t),
    o = Gv(e, r);
  return Al(e, o, i, wE(e, r), !1), i;
}
var UT = GT,
  $T = () => !1;
function HT(t, n, e) {
  return $T(t, n, e);
}
function GT(t, n, e, i) {
  if (t[fr]) return;
  let r;
  e.type & 8 ? (r = Mn(i)) : (r = BT(n, e)), (t[fr] = r);
}
var Rf = class t {
    constructor(n) {
      (this.queryList = n), (this.matches = null);
    }
    clone() {
      return new t(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  Pf = class t {
    constructor(n = []) {
      this.queries = n;
    }
    createEmbeddedView(n) {
      let e = n.queries;
      if (e !== null) {
        let i = n.contentQueries !== null ? n.contentQueries[0] : e.length,
          r = [];
        for (let o = 0; o < i; o++) {
          let s = e.getByIndex(o),
            a = this.queries[s.indexInDeclarationView];
          r.push(a.clone());
        }
        return new t(r);
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
      for (let e = 0; e < this.queries.length; e++)
        Lh(n, e).matches !== null && this.queries[e].setDirty();
    }
  },
  kl = class {
    constructor(n, e, i = null) {
      (this.flags = e),
        (this.read = i),
        typeof n == 'string' ? (this.predicate = JT(n)) : (this.predicate = n);
    }
  },
  Ff = class t {
    constructor(n = []) {
      this.queries = n;
    }
    elementStart(n, e) {
      for (let i = 0; i < this.queries.length; i++) this.queries[i].elementStart(n, e);
    }
    elementEnd(n) {
      for (let e = 0; e < this.queries.length; e++) this.queries[e].elementEnd(n);
    }
    embeddedTView(n) {
      let e = null;
      for (let i = 0; i < this.length; i++) {
        let r = e !== null ? e.length : 0,
          o = this.getByIndex(i).embeddedTView(n, r);
        o && ((o.indexInDeclarationView = i), e !== null ? e.push(o) : (e = [o]));
      }
      return e !== null ? new t(e) : null;
    }
    template(n, e) {
      for (let i = 0; i < this.queries.length; i++) this.queries[i].template(n, e);
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
  kf = class t {
    constructor(n, e = -1) {
      (this.metadata = n),
        (this.matches = null),
        (this.indexInDeclarationView = -1),
        (this.crossesNgTemplate = !1),
        (this._appliesToNextNode = !0),
        (this._declarationNodeIndex = e);
    }
    elementStart(n, e) {
      this.isApplyingToNode(e) && this.matchTNode(n, e);
    }
    elementEnd(n) {
      this._declarationNodeIndex === n.index && (this._appliesToNextNode = !1);
    }
    template(n, e) {
      this.elementStart(n, e);
    }
    embeddedTView(n, e) {
      return this.isApplyingToNode(n)
        ? ((this.crossesNgTemplate = !0), this.addMatch(-n.index, e), new t(this.metadata))
        : null;
    }
    isApplyingToNode(n) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let e = this._declarationNodeIndex,
          i = n.parent;
        for (; i !== null && i.type & 8 && i.index !== e; ) i = i.parent;
        return e === (i !== null ? i.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(n, e) {
      let i = this.metadata.predicate;
      if (Array.isArray(i))
        for (let r = 0; r < i.length; r++) {
          let o = i[r];
          this.matchTNodeWithReadOption(n, e, zT(e, o)),
            this.matchTNodeWithReadOption(n, e, ml(e, n, o, !1, !1));
        }
      else
        i === ti
          ? e.type & 4 && this.matchTNodeWithReadOption(n, e, -1)
          : this.matchTNodeWithReadOption(n, e, ml(e, n, i, !1, !1));
    }
    matchTNodeWithReadOption(n, e, i) {
      if (i !== null) {
        let r = this.metadata.read;
        if (r !== null)
          if (r === Ne || r === an || (r === ti && e.type & 4)) this.addMatch(e.index, -2);
          else {
            let o = ml(e, n, r, !1, !1);
            o !== null && this.addMatch(e.index, o);
          }
        else this.addMatch(e.index, i);
      }
    }
    addMatch(n, e) {
      this.matches === null ? (this.matches = [n, e]) : this.matches.push(n, e);
    }
  };
function zT(t, n) {
  let e = t.localNames;
  if (e !== null) {
    for (let i = 0; i < e.length; i += 2) if (e[i] === n) return e[i + 1];
  }
  return null;
}
function WT(t, n) {
  return t.type & 11 ? wo(t, n) : t.type & 4 ? sc(t, n) : null;
}
function qT(t, n, e, i) {
  return e === -1 ? WT(n, t) : e === -2 ? QT(t, n, i) : gr(t, t[oe], e, n);
}
function QT(t, n, e) {
  if (e === Ne) return wo(n, t);
  if (e === ti) return sc(n, t);
  if (e === an) return g_(n, t);
}
function v_(t, n, e, i) {
  let r = n[Kn].queries[i];
  if (r.matches === null) {
    let o = t.data,
      s = e.matches,
      a = [];
    for (let l = 0; s !== null && l < s.length; l += 2) {
      let c = s[l];
      if (c < 0) a.push(null);
      else {
        let f = o[c];
        a.push(qT(n, f, s[l + 1], e.metadata.read));
      }
    }
    r.matches = a;
  }
  return r.matches;
}
function Lf(t, n, e, i) {
  let r = t.queries.getByIndex(e),
    o = r.matches;
  if (o !== null) {
    let s = v_(t, n, r, e);
    for (let a = 0; a < o.length; a += 2) {
      let l = o[a];
      if (l > 0) i.push(s[a / 2]);
      else {
        let c = o[a + 1],
          f = n[-l];
        for (let p = It; p < f.length; p++) {
          let g = f[p];
          g[dr] === g[ut] && Lf(g[oe], g, c, i);
        }
        if (f[vo] !== null) {
          let p = f[vo];
          for (let g = 0; g < p.length; g++) {
            let m = p[g];
            Lf(m[oe], m, c, i);
          }
        }
      }
    }
  }
  return i;
}
function ZT(t, n) {
  return t[Kn].queries[n].queryList;
}
function __(t, n, e) {
  let i = new hf((e & 4) === 4);
  return LE(t, n, i, i.destroy), (n[Kn] ??= new Pf()).queries.push(new Rf(i)) - 1;
}
function KT(t, n, e) {
  let i = Fe();
  return (
    i.firstCreatePass && (y_(i, new kl(t, n, e), -1), (n & 2) === 2 && (i.staticViewQueries = !0)),
    __(i, fe(), n)
  );
}
function YT(t, n, e, i) {
  let r = Fe();
  if (r.firstCreatePass) {
    let o = _t();
    y_(r, new kl(n, e, i), o.index), XT(r, t), (e & 2) === 2 && (r.staticContentQueries = !0);
  }
  return __(r, fe(), e);
}
function JT(t) {
  return t.split(',').map((n) => n.trim());
}
function y_(t, n, e) {
  t.queries === null && (t.queries = new Ff()), t.queries.track(new kf(n, e));
}
function XT(t, n) {
  let e = t.contentQueries || (t.contentQueries = []),
    i = e.length ? e[e.length - 1] : -1;
  n !== i && e.push(t.queries.length - 1, n);
}
function Lh(t, n) {
  return t.queries.getByIndex(n);
}
function eM(t, n) {
  let e = t[oe],
    i = Lh(e, n);
  return i.crossesNgTemplate ? Lf(e, t, n, []) : v_(e, t, i, n);
}
function Gt(t, n) {
  On('NgSignals');
  let e = Hg(t),
    i = e[pi];
  return (
    n?.equal && (i.equal = n.equal),
    (e.set = (r) => pd(i, r)),
    (e.update = (r) => Gg(i, r)),
    (e.asReadonly = tM.bind(e)),
    e
  );
}
function tM() {
  let t = this[pi];
  if (t.readonlyFn === void 0) {
    let n = () => this();
    (n[pi] = t), (t.readonlyFn = n);
  }
  return t.readonlyFn;
}
function nM(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function xt(t) {
  let n = nM(t.type),
    e = !0,
    i = [t];
  for (; n; ) {
    let r;
    if (Yn(t)) r = n.ɵcmp || n.ɵdir;
    else {
      if (n.ɵcmp) throw new T(903, !1);
      r = n.ɵdir;
    }
    if (r) {
      if (e) {
        i.push(r);
        let s = t;
        (s.inputs = cl(t.inputs)),
          (s.inputTransforms = cl(t.inputTransforms)),
          (s.declaredInputs = cl(t.declaredInputs)),
          (s.outputs = cl(t.outputs));
        let a = r.hostBindings;
        a && aM(t, a);
        let l = r.viewQuery,
          c = r.contentQueries;
        if (
          (l && oM(t, l),
          c && sM(t, c),
          iM(t, r),
          kw(t.outputs, r.outputs),
          Yn(r) && r.data.animation)
        ) {
          let f = t.data;
          f.animation = (f.animation || []).concat(r.data.animation);
        }
      }
      let o = r.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(t), a === xt && (e = !1);
        }
    }
    n = Object.getPrototypeOf(n);
  }
  rM(i);
}
function iM(t, n) {
  for (let e in n.inputs) {
    if (!n.inputs.hasOwnProperty(e) || t.inputs.hasOwnProperty(e)) continue;
    let i = n.inputs[e];
    if (
      i !== void 0 &&
      ((t.inputs[e] = i), (t.declaredInputs[e] = n.declaredInputs[e]), n.inputTransforms !== null)
    ) {
      let r = Array.isArray(i) ? i[0] : i;
      if (!n.inputTransforms.hasOwnProperty(r)) continue;
      (t.inputTransforms ??= {}), (t.inputTransforms[r] = n.inputTransforms[r]);
    }
  }
}
function rM(t) {
  let n = 0,
    e = null;
  for (let i = t.length - 1; i >= 0; i--) {
    let r = t[i];
    (r.hostVars = n += r.hostVars), (r.hostAttrs = fs(r.hostAttrs, (e = fs(e, r.hostAttrs))));
  }
}
function cl(t) {
  return t === Zn ? {} : t === Dt ? [] : t;
}
function oM(t, n) {
  let e = t.viewQuery;
  e
    ? (t.viewQuery = (i, r) => {
        n(i, r), e(i, r);
      })
    : (t.viewQuery = n);
}
function sM(t, n) {
  let e = t.contentQueries;
  e
    ? (t.contentQueries = (i, r, o) => {
        n(i, r, o), e(i, r, o);
      })
    : (t.contentQueries = n);
}
function aM(t, n) {
  let e = t.hostBindings;
  e
    ? (t.hostBindings = (i, r) => {
        n(i, r), e(i, r);
      })
    : (t.hostBindings = n);
}
function Vh(t) {
  let n = (e) => {
    let i = (Array.isArray(t) ? t : t()).map((r) =>
      typeof r == 'function'
        ? { directive: it(r), inputs: Zn, outputs: Zn }
        : {
            directive: it(r.directive),
            inputs: n1(r.inputs),
            outputs: n1(r.outputs),
          },
    );
    e.hostDirectives === null
      ? ((e.findHostDirectiveDefs = b_), (e.hostDirectives = i))
      : e.hostDirectives.unshift(...i);
  };
  return (n.ngInherit = !0), n;
}
function b_(t, n, e) {
  if (t.hostDirectives !== null)
    for (let i of t.hostDirectives) {
      let r = th(i.directive);
      lM(r.declaredInputs, i.inputs), b_(r, n, e), e.set(r, i), n.push(r);
    }
}
function n1(t) {
  if (t === void 0 || t.length === 0) return Zn;
  let n = {};
  for (let e = 0; e < t.length; e += 2) n[t[e]] = t[e + 1];
  return n;
}
function lM(t, n) {
  for (let e in n)
    if (n.hasOwnProperty(e)) {
      let i = n[e],
        r = t[e];
      t[i] = r;
    }
}
var Ti = class {},
  vs = class {};
var Vf = class extends Ti {
    constructor(n, e, i, r = !0) {
      super(),
        (this.ngModuleType = n),
        (this._parent = e),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new Fl(this));
      let o = M1(n);
      (this._bootstrapComponents = Lv(o.bootstrap)),
        (this._r3Injector = gv(
          n,
          e,
          [
            { provide: Ti, useValue: this },
            { provide: Si, useValue: this.componentFactoryResolver },
            ...i,
          ],
          gt(n),
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
      !n.destroyed && n.destroy(), this.destroyCbs.forEach((e) => e()), (this.destroyCbs = null);
    }
    onDestroy(n) {
      this.destroyCbs.push(n);
    }
  },
  jf = class extends vs {
    constructor(n) {
      super(), (this.moduleType = n);
    }
    create(n) {
      return new Vf(this.moduleType, n, []);
    }
  };
var Ll = class extends Ti {
  constructor(n) {
    super(), (this.componentFactoryResolver = new Fl(this)), (this.instance = null);
    let e = new hs(
      [
        ...n.providers,
        { provide: Ti, useValue: this },
        { provide: Si, useValue: this.componentFactoryResolver },
      ],
      n.parent || rh(),
      n.debugName,
      new Set(['environment']),
    );
    (this.injector = e), n.runEnvironmentInitializers && e.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(n) {
    this.injector.onDestroy(n);
  }
};
function jh(t, n, e = null) {
  return new Ll({
    providers: t,
    parent: n,
    debugName: e,
    runEnvironmentInitializers: !0,
  }).injector;
}
function C_(t) {
  return uM(t) ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t) : !1;
}
function cM(t, n) {
  if (Array.isArray(t)) for (let e = 0; e < t.length; e++) n(t[e]);
  else {
    let e = t[Symbol.iterator](),
      i;
    for (; !(i = e.next()).done; ) n(i.value);
  }
}
function uM(t) {
  return t !== null && (typeof t == 'function' || typeof t == 'object');
}
function dM(t, n, e) {
  return (t[n] = e);
}
function Ai(t, n, e) {
  let i = t[n];
  return Object.is(i, e) ? !1 : ((t[n] = e), !0);
}
function fM(t) {
  return (t.flags & 32) === 32;
}
function hM(t, n, e, i, r, o, s, a, l) {
  let c = n.consts,
    f = Ss(n, t, 4, s || null, a || null);
  Nh(n, e, f, _o(c, l)), Xl(n, f);
  let p = (f.tView = xh(
    2,
    f,
    i,
    r,
    o,
    n.directiveRegistry,
    n.pipeRegistry,
    null,
    n.schemas,
    c,
    null,
  ));
  return (
    n.queries !== null && (n.queries.template(n, f), (p.queries = n.queries.embeddedTView(f))), f
  );
}
function pM(t, n, e, i, r, o, s, a, l, c) {
  let f = e + Tn,
    p = n.firstCreatePass ? hM(f, n, t, i, r, o, s, a, l) : n.data[f];
  yr(p, !1);
  let g = mM(n, t, p, e);
  Yl() && tc(n, t, g, p), Di(g, t);
  let m = t_(g, t, g, p);
  return (t[f] = m), oc(t, m), HT(m, p, t), Zl(p) && Mh(n, t, p), l != null && Ih(t, p, c), p;
}
function R(t, n, e, i, r, o, s, a) {
  let l = fe(),
    c = Fe(),
    f = _o(c.consts, o);
  return pM(l, c, t, n, e, i, r, f, s, a), R;
}
var mM = gM;
function gM(t, n, e, i) {
  return Jl(!0), n[Ie].createComment('');
}
function St(t, n, e, i) {
  let r = fe(),
    o = Cs();
  if (Ai(r, o, n)) {
    let s = Fe(),
      a = ws();
    JE(a, r, t, n, e, i);
  }
  return St;
}
function w_(t, n, e, i) {
  return Ai(t, Cs(), e) ? n + Hl(e) + i : An;
}
function ul(t, n) {
  return (t << 17) | (n << 2);
}
function _r(t) {
  return (t >> 17) & 32767;
}
function vM(t) {
  return (t & 2) == 2;
}
function _M(t, n) {
  return (t & 131071) | (n << 17);
}
function Bf(t) {
  return t | 2;
}
function bo(t) {
  return (t & 131068) >> 2;
}
function $d(t, n) {
  return (t & -131069) | (n << 2);
}
function yM(t) {
  return (t & 1) === 1;
}
function Uf(t) {
  return t | 1;
}
function bM(t, n, e, i, r, o) {
  let s = o ? n.classBindings : n.styleBindings,
    a = _r(s),
    l = bo(s);
  t[i] = e;
  let c = !1,
    f;
  if (Array.isArray(e)) {
    let p = e;
    (f = p[1]), (f === null || bs(p, f) > 0) && (c = !0);
  } else f = e;
  if (r)
    if (l !== 0) {
      let g = _r(t[a + 1]);
      (t[i + 1] = ul(g, a)), g !== 0 && (t[g + 1] = $d(t[g + 1], i)), (t[a + 1] = _M(t[a + 1], i));
    } else (t[i + 1] = ul(a, 0)), a !== 0 && (t[a + 1] = $d(t[a + 1], i)), (a = i);
  else (t[i + 1] = ul(l, 0)), a === 0 ? (a = i) : (t[l + 1] = $d(t[l + 1], i)), (l = i);
  c && (t[i + 1] = Bf(t[i + 1])),
    i1(t, f, i, !0),
    i1(t, f, i, !1),
    CM(n, f, t, i, o),
    (s = ul(a, l)),
    o ? (n.classBindings = s) : (n.styleBindings = s);
}
function CM(t, n, e, i, r) {
  let o = r ? t.residualClasses : t.residualStyles;
  o != null && typeof n == 'string' && bs(o, n) >= 0 && (e[i + 1] = Uf(e[i + 1]));
}
function i1(t, n, e, i) {
  let r = t[e + 1],
    o = n === null,
    s = i ? _r(r) : bo(r),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let l = t[s],
      c = t[s + 1];
    wM(l, n) && ((a = !0), (t[s + 1] = i ? Uf(c) : Bf(c))), (s = i ? _r(c) : bo(c));
  }
  a && (t[e + 1] = i ? Bf(r) : Uf(r));
}
function wM(t, n) {
  return t === null || n == null || (Array.isArray(t) ? t[1] : t) === n
    ? !0
    : Array.isArray(t) && typeof n == 'string'
      ? bs(t, n) >= 0
      : !1;
}
var Xt = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function DM(t) {
  return t.substring(Xt.key, Xt.keyEnd);
}
function SM(t) {
  return EM(t), D_(t, S_(t, 0, Xt.textEnd));
}
function D_(t, n) {
  let e = Xt.textEnd;
  return e === n ? -1 : ((n = Xt.keyEnd = TM(t, (Xt.key = n), e)), S_(t, n, e));
}
function EM(t) {
  (Xt.key = 0), (Xt.keyEnd = 0), (Xt.value = 0), (Xt.valueEnd = 0), (Xt.textEnd = t.length);
}
function S_(t, n, e) {
  for (; n < e && t.charCodeAt(n) <= 32; ) n++;
  return n;
}
function TM(t, n, e) {
  for (; n < e && t.charCodeAt(n) > 32; ) n++;
  return n;
}
function D(t, n, e) {
  let i = fe(),
    r = Cs();
  if (Ai(i, r, n)) {
    let o = Fe(),
      s = ws();
    rc(o, s, i, t, n, i[Ie], e, !1);
  }
  return D;
}
function $f(t, n, e, i, r) {
  let o = n.inputs,
    s = r ? 'class' : 'style';
  Ah(t, e, o[s], s, i);
}
function Oi(t, n, e) {
  return E_(t, n, e, !1), Oi;
}
function Nt(t, n) {
  return E_(t, n, null, !0), Nt;
}
function Rn(t) {
  IM(PM, MM, t, !0);
}
function MM(t, n) {
  for (let e = SM(n); e >= 0; e = D_(n, e)) Xf(t, DM(n), !0);
}
function E_(t, n, e, i) {
  let r = fe(),
    o = Fe(),
    s = Y1(2);
  if ((o.firstUpdatePass && M_(o, t, s, i), n !== An && Ai(r, s, n))) {
    let a = o.data[br()];
    I_(o, a, r, r[Ie], t, (r[s + 1] = kM(n, e)), i, s);
  }
}
function IM(t, n, e, i) {
  let r = Fe(),
    o = Y1(2);
  r.firstUpdatePass && M_(r, null, o, i);
  let s = fe();
  if (e !== An && Ai(s, o, e)) {
    let a = r.data[br()];
    if (x_(a, i) && !T_(r, o)) {
      let l = i ? a.classesWithoutHost : a.stylesWithoutHost;
      l !== null && (e = Wd(l, e || '')), $f(r, a, s, e, i);
    } else FM(r, a, s, s[Ie], s[o + 1], (s[o + 1] = RM(t, n, e)), i, o);
  }
}
function T_(t, n) {
  return n >= t.expandoStartIndex;
}
function M_(t, n, e, i) {
  let r = t.data;
  if (r[e + 1] === null) {
    let o = r[br()],
      s = T_(t, e);
    x_(o, i) && n === null && !s && (n = !1), (n = xM(r, o, n, i)), bM(r, o, n, e, s, i);
  }
}
function xM(t, n, e, i) {
  let r = J1(t),
    o = i ? n.residualClasses : n.residualStyles;
  if (r === null)
    (i ? n.classBindings : n.styleBindings) === 0 &&
      ((e = Hd(null, t, n, e, i)), (e = _s(e, n.attrs, i)), (o = null));
  else {
    let s = n.directiveStylingLast;
    if (s === -1 || t[s] !== r)
      if (((e = Hd(r, t, n, e, i)), o === null)) {
        let l = NM(t, n, i);
        l !== void 0 &&
          Array.isArray(l) &&
          ((l = Hd(null, t, n, l[1], i)), (l = _s(l, n.attrs, i)), AM(t, n, i, l));
      } else o = OM(t, n, i);
  }
  return o !== void 0 && (i ? (n.residualClasses = o) : (n.residualStyles = o)), e;
}
function NM(t, n, e) {
  let i = e ? n.classBindings : n.styleBindings;
  if (bo(i) !== 0) return t[_r(i)];
}
function AM(t, n, e, i) {
  let r = e ? n.classBindings : n.styleBindings;
  t[_r(r)] = i;
}
function OM(t, n, e) {
  let i,
    r = n.directiveEnd;
  for (let o = 1 + n.directiveStylingLast; o < r; o++) {
    let s = t[o].hostAttrs;
    i = _s(i, s, e);
  }
  return _s(i, n.attrs, e);
}
function Hd(t, n, e, i, r) {
  let o = null,
    s = e.directiveEnd,
    a = e.directiveStylingLast;
  for (
    a === -1 ? (a = e.directiveStart) : a++;
    a < s && ((o = n[a]), (i = _s(i, o.hostAttrs, r)), o !== t);

  )
    a++;
  return t !== null && (e.directiveStylingLast = a), i;
}
function _s(t, n, e) {
  let i = e ? 1 : 2,
    r = -1;
  if (n !== null)
    for (let o = 0; o < n.length; o++) {
      let s = n[o];
      typeof s == 'number'
        ? (r = s)
        : r === i &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ['', t]), Xf(t, s, e ? !0 : n[++o]));
    }
  return t === void 0 ? null : t;
}
function RM(t, n, e) {
  if (e == null || e === '') return Dt;
  let i = [],
    r = Nn(e);
  if (Array.isArray(r)) for (let o = 0; o < r.length; o++) t(i, r[o], !0);
  else if (typeof r == 'object') for (let o in r) r.hasOwnProperty(o) && t(i, o, r[o]);
  else typeof r == 'string' && n(i, r);
  return i;
}
function PM(t, n, e) {
  let i = String(n);
  i !== '' && !i.includes(' ') && Xf(t, i, e);
}
function FM(t, n, e, i, r, o, s, a) {
  r === An && (r = Dt);
  let l = 0,
    c = 0,
    f = 0 < r.length ? r[0] : null,
    p = 0 < o.length ? o[0] : null;
  for (; f !== null || p !== null; ) {
    let g = l < r.length ? r[l + 1] : void 0,
      m = c < o.length ? o[c + 1] : void 0,
      v = null,
      _;
    f === p
      ? ((l += 2), (c += 2), g !== m && ((v = p), (_ = m)))
      : p === null || (f !== null && f < p)
        ? ((l += 2), (v = f))
        : ((c += 2), (v = p), (_ = m)),
      v !== null && I_(t, n, e, i, v, _, s, a),
      (f = l < r.length ? r[l] : null),
      (p = c < o.length ? o[c] : null);
  }
}
function I_(t, n, e, i, r, o, s, a) {
  if (!(n.type & 3)) return;
  let l = t.data,
    c = l[a + 1],
    f = yM(c) ? r1(l, n, e, r, bo(c), s) : void 0;
  if (!Vl(f)) {
    Vl(o) || (vM(c) && (o = r1(l, null, e, r, a, s)));
    let p = U1(br(), e);
    xE(i, s, p, r, o);
  }
}
function r1(t, n, e, i, r, o) {
  let s = n === null,
    a;
  for (; r > 0; ) {
    let l = t[r],
      c = Array.isArray(l),
      f = c ? l[1] : l,
      p = f === null,
      g = e[r + 1];
    g === An && (g = p ? Dt : void 0);
    let m = p ? Rd(g, i) : f === i ? g : void 0;
    if ((c && !Vl(m) && (m = Rd(l, i)), Vl(m) && ((a = m), s))) return a;
    let v = t[r + 1];
    r = s ? _r(v) : bo(v);
  }
  if (n !== null) {
    let l = o ? n.residualClasses : n.residualStyles;
    l != null && (a = Rd(l, i));
  }
  return a;
}
function Vl(t) {
  return t !== void 0;
}
function kM(t, n) {
  return (
    t == null ||
      t === '' ||
      (typeof n == 'string' ? (t = t + n) : typeof t == 'object' && (t = gt(Nn(t)))),
    t
  );
}
function x_(t, n) {
  return (t.flags & (n ? 8 : 16)) !== 0;
}
function LM(t, n, e, i, r, o) {
  let s = n.consts,
    a = _o(s, r),
    l = Ss(n, t, 2, i, a);
  return (
    Nh(n, e, l, _o(s, o)),
    l.attrs !== null && Pl(l, l.attrs, !1),
    l.mergedAttrs !== null && Pl(l, l.mergedAttrs, !0),
    n.queries !== null && n.queries.elementStart(n, l),
    l
  );
}
function u(t, n, e, i) {
  let r = fe(),
    o = Fe(),
    s = Tn + t,
    a = r[Ie],
    l = o.firstCreatePass ? LM(s, o, r, n, e, i) : o.data[s],
    c = VM(o, r, l, a, n, t);
  r[s] = c;
  let f = Zl(l);
  return (
    yr(l, !0),
    qv(a, c, l),
    !fM(l) && Yl() && tc(o, r, c, l),
    $D() === 0 && Di(c, r),
    HD(),
    f && (Mh(o, r, l), Th(o, l, r)),
    i !== null && Ih(r, l),
    u
  );
}
function d() {
  let t = _t();
  lh() ? Z1() : ((t = t.parent), yr(t, !1));
  let n = t;
  WD(n) && qD(), GD();
  let e = Fe();
  return (
    e.firstCreatePass && (Xl(e, t), sh(t) && e.queries.elementEnd(t)),
    n.classesWithoutHost != null && lS(n) && $f(e, n, fe(), n.classesWithoutHost, !0),
    n.stylesWithoutHost != null && cS(n) && $f(e, n, fe(), n.stylesWithoutHost, !1),
    d
  );
}
function b(t, n, e, i) {
  return u(t, n, e, i), d(), b;
}
var VM = (t, n, e, i, r, o) => (Jl(!0), jv(i, r, rS()));
function jM(t, n, e, i, r) {
  let o = n.consts,
    s = _o(o, i),
    a = Ss(n, t, 8, 'ng-container', s);
  s !== null && Pl(a, s, !0);
  let l = _o(o, r);
  return Nh(n, e, a, l), n.queries !== null && n.queries.elementStart(n, a), a;
}
function We(t, n, e) {
  let i = fe(),
    r = Fe(),
    o = t + Tn,
    s = r.firstCreatePass ? jM(o, r, i, n, e) : r.data[o];
  yr(s, !0);
  let a = BM(r, i, s, t);
  return (
    (i[o] = a),
    Yl() && tc(r, i, a, s),
    Di(a, i),
    Zl(s) && (Mh(r, i, s), Th(r, s, i)),
    e != null && Ih(i, s),
    We
  );
}
function qe() {
  let t = _t(),
    n = Fe();
  return (
    lh() ? Z1() : ((t = t.parent), yr(t, !1)),
    n.firstCreatePass && (Xl(n, t), sh(t) && n.queries.elementEnd(t)),
    qe
  );
}
var BM = (t, n, e, i) => (Jl(!0), hE(n[Ie], ''));
function rt() {
  return fe();
}
function Ri(t, n, e) {
  let i = fe(),
    r = Cs();
  if (Ai(i, r, n)) {
    let o = Fe(),
      s = ws();
    rc(o, s, i, t, n, i[Ie], e, !0);
  }
  return Ri;
}
function Bh(t, n, e) {
  let i = fe(),
    r = Cs();
  if (Ai(i, r, n)) {
    let o = Fe(),
      s = ws(),
      a = J1(o.data),
      l = nT(a, s, i);
    rc(o, s, i, t, n, l, e, !0);
  }
  return Bh;
}
var jl = 'en-US';
var UM = jl;
function $M(t) {
  typeof t == 'string' && (UM = t.toLowerCase().replace(/_/g, '-'));
}
var HM = (t, n, e) => {};
function Z(t, n, e, i) {
  let r = fe(),
    o = Fe(),
    s = _t();
  return zM(o, r, r[Ie], s, t, n, i), Z;
}
function GM(t, n, e, i) {
  let r = t.cleanup;
  if (r != null)
    for (let o = 0; o < r.length - 1; o += 2) {
      let s = r[o];
      if (s === e && r[o + 1] === i) {
        let a = n[Dl],
          l = r[o + 2];
        return a.length > l ? a[l] : null;
      }
      typeof s == 'string' && (o += 2);
    }
  return null;
}
function zM(t, n, e, i, r, o, s) {
  let a = Zl(i),
    c = t.firstCreatePass && r_(t),
    f = n[tn],
    p = i_(n),
    g = !0;
  if (i.type & 3 || s) {
    let _ = $t(i, n),
      C = s ? s(_) : _,
      S = p.length,
      O = s ? (A) => s(Mn(A[i.index])) : i.index,
      I = null;
    if ((!s && a && (I = GM(t, n, r, i.index)), I !== null)) {
      let A = I.__ngLastListenerFn__ || I;
      (A.__ngNextListenerFn__ = o), (I.__ngLastListenerFn__ = o), (g = !1);
    } else {
      (o = s1(i, n, f, o)), HM(_, r, o);
      let A = e.listen(C, r, o);
      p.push(o, A), c && c.push(r, O, S, S + 1);
    }
  } else o = s1(i, n, f, o);
  let m = i.outputs,
    v;
  if (g && m !== null && (v = m[r])) {
    let _ = v.length;
    if (_)
      for (let C = 0; C < _; C += 2) {
        let S = v[C],
          O = v[C + 1],
          G = n[S][O].subscribe(o),
          B = p.length;
        p.push(o, G), c && c.push(r, i.index, B, -(B + 1));
      }
  }
}
function o1(t, n, e, i) {
  let r = ue(null);
  try {
    return Cn(6, n, e), e(i) !== !1;
  } catch (o) {
    return o_(t, o), !1;
  } finally {
    Cn(7, n, e), ue(r);
  }
}
function s1(t, n, e, i) {
  return function r(o) {
    if (o === Function) return i;
    let s = t.componentOffset > -1 ? Ii(t.index, n) : n;
    Rh(s, 5);
    let a = o1(n, e, i, o),
      l = r.__ngNextListenerFn__;
    for (; l; ) (a = o1(n, e, l, o) && a), (l = l.__ngNextListenerFn__);
    return a;
  };
}
function U(t = 1) {
  return nS(t);
}
function Uh(t, n, e) {
  return N_(t, '', n, '', e), Uh;
}
function N_(t, n, e, i, r) {
  let o = fe(),
    s = w_(o, n, e, i);
  if (s !== An) {
    let a = Fe(),
      l = ws();
    rc(a, l, o, t, s, o[Ie], r, !1);
  }
  return N_;
}
function Pi(t, n, e, i) {
  YT(t, n, e, i);
}
function $h(t, n, e) {
  KT(t, n, e);
}
function Pn(t) {
  let n = fe(),
    e = Fe(),
    i = X1();
  ch(i + 1);
  let r = Lh(e, i);
  if (t.dirty && VD(n) === ((r.metadata.flags & 2) === 2)) {
    if (r.matches === null) t.reset([]);
    else {
      let o = eM(n, i);
      t.reset(o, xS), t.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function Fn() {
  return ZT(fe(), X1());
}
function Dr(t) {
  let n = ZD();
  return LD(n, Tn + t);
}
function h(t, n = '') {
  let e = fe(),
    i = Fe(),
    r = t + Tn,
    o = i.firstCreatePass ? Ss(i, r, 1, n, null) : i.data[r],
    s = WM(i, e, o, n, t);
  (e[r] = s), Yl() && tc(i, e, s, o), yr(o, !1);
}
var WM = (t, n, e, i, r) => (Jl(!0), dE(n[Ie], i));
function Ae(t) {
  return kn('', t, ''), Ae;
}
function kn(t, n, e) {
  let i = fe(),
    r = w_(i, t, n, e);
  return r !== An && iT(i, br(), r), kn;
}
function qM(t, n, e) {
  let i = Fe();
  if (i.firstCreatePass) {
    let r = Yn(t);
    Hf(e, i.data, i.blueprint, r, !0), Hf(n, i.data, i.blueprint, r, !1);
  }
}
function Hf(t, n, e, i, r) {
  if (((t = it(t)), Array.isArray(t))) for (let o = 0; o < t.length; o++) Hf(t[o], n, e, i, r);
  else {
    let o = Fe(),
      s = fe(),
      a = _t(),
      l = mo(t) ? t : it(t.provide),
      c = R1(t),
      f = a.providerIndexes & 1048575,
      p = a.directiveStart,
      g = a.providerIndexes >> 20;
    if (mo(t) || !t.multi) {
      let m = new mr(c, r, k),
        v = zd(l, n, r ? f : f + g, p);
      v === -1
        ? (af(Il(a, s), o, l),
          Gd(o, t, n.length),
          n.push(l),
          a.directiveStart++,
          a.directiveEnd++,
          r && (a.providerIndexes += 1048576),
          e.push(m),
          s.push(m))
        : ((e[v] = m), (s[v] = m));
    } else {
      let m = zd(l, n, f + g, p),
        v = zd(l, n, f, f + g),
        _ = m >= 0 && e[m],
        C = v >= 0 && e[v];
      if ((r && !C) || (!r && !_)) {
        af(Il(a, s), o, l);
        let S = KM(r ? ZM : QM, e.length, r, i, c);
        !r && C && (e[v].providerFactory = S),
          Gd(o, t, n.length, 0),
          n.push(l),
          a.directiveStart++,
          a.directiveEnd++,
          r && (a.providerIndexes += 1048576),
          e.push(S),
          s.push(S);
      } else {
        let S = A_(e[r ? v : m], c, !r && i);
        Gd(o, t, m > -1 ? m : v, S);
      }
      !r && i && C && e[v].componentProviders++;
    }
  }
}
function Gd(t, n, e, i) {
  let r = mo(n),
    o = SD(n);
  if (r || o) {
    let l = (o ? it(n.useClass) : n).prototype.ngOnDestroy;
    if (l) {
      let c = t.destroyHooks || (t.destroyHooks = []);
      if (!r && n.multi) {
        let f = c.indexOf(e);
        f === -1 ? c.push(e, [i, l]) : c[f + 1].push(i, l);
      } else c.push(e, l);
    }
  }
}
function A_(t, n, e) {
  return e && t.componentProviders++, t.multi.push(n) - 1;
}
function zd(t, n, e, i) {
  for (let r = e; r < i; r++) if (n[r] === t) return r;
  return -1;
}
function QM(t, n, e, i) {
  return Gf(this.multi, []);
}
function ZM(t, n, e, i) {
  let r = this.multi,
    o;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = gr(e, e[oe], this.providerFactory.index, i);
    (o = a.slice(0, s)), Gf(r, o);
    for (let l = s; l < a.length; l++) o.push(a[l]);
  } else (o = []), Gf(r, o);
  return o;
}
function Gf(t, n) {
  for (let e = 0; e < t.length; e++) {
    let i = t[e];
    n.push(i());
  }
  return n;
}
function KM(t, n, e, i, r) {
  let o = new mr(t, e, k);
  return (o.multi = []), (o.index = n), (o.componentProviders = 0), A_(o, r, i && !e), o;
}
function At(t, n = []) {
  return (e) => {
    e.providersResolver = (i, r) => qM(i, r ? r(t) : t, n);
  };
}
var YM = (() => {
  class t {
    constructor(e) {
      (this._injector = e), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(e) {
      if (!e.standalone) return null;
      if (!this.cachedInjectors.has(e)) {
        let i = N1(!1, e.type),
          r = i.length > 0 ? jh([i], this._injector, `Standalone[${e.type.name}]`) : null;
        this.cachedInjectors.set(e, r);
      }
      return this.cachedInjectors.get(e);
    }
    ngOnDestroy() {
      try {
        for (let e of this.cachedInjectors.values()) e !== null && e.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static {
      this.ɵprov = M({
        token: t,
        providedIn: 'environment',
        factory: () => new t(N(vt)),
      });
    }
  }
  return t;
})();
function j(t) {
  On('NgStandalone'), (t.getStandaloneInjector = (n) => n.get(YM).getOrCreateStandaloneInjector(t));
}
function ln(t, n, e, i) {
  return XM(fe(), KD(), t, n, e, i);
}
function JM(t, n) {
  let e = t[n];
  return e === An ? void 0 : e;
}
function XM(t, n, e, i, r, o) {
  let s = n + e;
  return Ai(t, s, r) ? dM(t, s + 1, o ? i.call(o, r) : i(r)) : JM(t, s + 1);
}
function Hh(t, n) {
  return sc(t, n);
}
var lc = (() => {
  class t {
    log(e) {
      console.log(e);
    }
    warn(e) {
      console.warn(e);
    }
    static {
      this.ɵfac = function (i) {
        return new (i || t)();
      };
    }
    static {
      this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'platform' });
    }
  }
  return t;
})();
var O_ = new F('');
function Sr(t) {
  return !!t && typeof t.then == 'function';
}
function R_(t) {
  return !!t && typeof t.subscribe == 'function';
}
var P_ = new F(''),
  F_ = (() => {
    class t {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((e, i) => {
            (this.resolve = e), (this.reject = i);
          })),
          (this.appInits = y(P_, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let e = [];
        for (let r of this.appInits) {
          let o = r();
          if (Sr(o)) e.push(o);
          else if (R_(o)) {
            let s = new Promise((a, l) => {
              o.subscribe({ complete: a, error: l });
            });
            e.push(s);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(e)
          .then(() => {
            i();
          })
          .catch((r) => {
            this.reject(r);
          }),
          e.length === 0 && i(),
          (this.initialized = !0);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })(),
  cc = new F('');
function eI() {
  $g(() => {
    throw new T(600, !1);
  });
}
function tI(t) {
  return t.isBoundToModule;
}
var nI = 10;
function iI(t, n, e) {
  try {
    let i = e();
    return Sr(i)
      ? i.catch((r) => {
          throw (n.runOutsideAngular(() => t.handleError(r)), r);
        })
      : i;
  } catch (i) {
    throw (n.runOutsideAngular(() => t.handleError(i)), i);
  }
}
var Ot = (() => {
  class t {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = y(MS)),
        (this.afterRenderEffectManager = y(kh)),
        (this.zonelessEnabled = y(Ph)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new de()),
        (this.afterTick = new de()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = y(xi).hasPendingTasks.pipe(z((e) => !e))),
        (this._injector = y(vt));
    }
    get allViews() {
      return [...this.externalTestViews.keys(), ...this._views];
    }
    get destroyed() {
      return this._destroyed;
    }
    whenStable() {
      let e;
      return new Promise((i) => {
        e = this.isStable.subscribe({
          next: (r) => {
            r && i();
          },
        });
      }).finally(() => {
        e.unsubscribe();
      });
    }
    get injector() {
      return this._injector;
    }
    bootstrap(e, i) {
      let r = e instanceof Rl;
      if (!this._injector.get(F_).done) {
        let g = !r && T1(e),
          m = !1;
        throw new T(405, m);
      }
      let s;
      r ? (s = e) : (s = this._injector.get(Si).resolveComponentFactory(e)),
        this.componentTypes.push(s.componentType);
      let a = tI(s) ? void 0 : this._injector.get(Ti),
        l = i || s.selector,
        c = s.create(Ge.NULL, [], l, a),
        f = c.location.nativeElement,
        p = c.injector.get(O_, null);
      return (
        p?.registerApplication(f),
        c.onDestroy(() => {
          this.detachView(c.hostView), gl(this.components, c), p?.unregisterApplication(f);
        }),
        this._loadComponent(c),
        c
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(e) {
      if (this._runningTick) throw new T(101, !1);
      let i = ue(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(e);
      } catch (r) {
        this.internalErrorHandler(r);
      } finally {
        (this._runningTick = !1), ue(i), this.afterTick.next();
      }
    }
    detectChangesInAttachedViews(e) {
      let i = null;
      this._injector.destroyed || (i = this._injector.get(Ei, null, { optional: !0 }));
      let r = 0,
        o = this.afterRenderEffectManager;
      for (; r < nI; ) {
        let s = r === 0;
        if (e || !s) {
          this.beforeRender.next(s);
          for (let { _lView: a, notifyErrorHandler: l } of this._views)
            rI(a, l, s, this.zonelessEnabled);
        } else i?.begin?.(), i?.end?.();
        if (
          (r++,
          o.executeInternalCallbacks(),
          !this.allViews.some(({ _lView: a }) => ms(a)) &&
            (o.execute(), !this.allViews.some(({ _lView: a }) => ms(a))))
        )
          break;
      }
    }
    attachView(e) {
      let i = e;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(e) {
      let i = e;
      gl(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(e) {
      this.attachView(e.hostView), this.tick(), this.components.push(e);
      let i = this._injector.get(cc, []);
      [...this._bootstrapListeners, ...i].forEach((r) => r(e));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((e) => e()),
            this._views.slice().forEach((e) => e.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(e) {
      return this._destroyListeners.push(e), () => gl(this._destroyListeners, e);
    }
    destroy() {
      if (this._destroyed) throw new T(406, !1);
      let e = this._injector;
      e.destroy && !e.destroyed && e.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
    static {
      this.ɵfac = function (i) {
        return new (i || t)();
      };
    }
    static {
      this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
  }
  return t;
})();
function gl(t, n) {
  let e = t.indexOf(n);
  e > -1 && t.splice(e, 1);
}
function rI(t, n, e, i) {
  if (!e && !ms(t)) return;
  l_(t, n, e && !i ? 0 : 1);
}
var zf = class {
    constructor(n, e) {
      (this.ngModuleFactory = n), (this.componentFactories = e);
    }
  },
  Gh = (() => {
    class t {
      compileModuleSync(e) {
        return new jf(e);
      }
      compileModuleAsync(e) {
        return Promise.resolve(this.compileModuleSync(e));
      }
      compileModuleAndAllComponentsSync(e) {
        let i = this.compileModuleSync(e),
          r = M1(e),
          o = Lv(r.declarations).reduce((s, a) => {
            let l = ur(a);
            return l && s.push(new gs(l)), s;
          }, []);
        return new zf(i, o);
      }
      compileModuleAndAllComponentsAsync(e) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(e));
      }
      clearCache() {}
      clearCacheFor(e) {}
      getModuleId(e) {}
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })();
var oI = (() => {
    class t {
      constructor() {
        (this.zone = y(me)), (this.changeDetectionScheduler = y(yo)), (this.applicationRef = y(Ot));
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
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })(),
  sI = new F('', { factory: () => !1 });
function k_({ ngZoneFactory: t, ignoreChangesOutsideZone: n }) {
  return (
    (t ??= () => new me(V_())),
    [
      { provide: me, useFactory: t },
      {
        provide: po,
        multi: !0,
        useFactory: () => {
          let e = y(oI, { optional: !0 });
          return () => e.initialize();
        },
      },
      {
        provide: po,
        multi: !0,
        useFactory: () => {
          let e = y(aI);
          return () => {
            e.initialize();
          };
        },
      },
      n === !0 ? { provide: f_, useValue: !0 } : [],
    ]
  );
}
function L_(t) {
  let n = t?.ignoreChangesOutsideZone,
    e = k_({
      ngZoneFactory: () => {
        let i = V_(t);
        return i.shouldCoalesceEventChangeDetection && On('NgZone_CoalesceEvent'), new me(i);
      },
      ignoreChangesOutsideZone: n,
    });
  return Mi([{ provide: sI, useValue: !0 }, { provide: Ph, useValue: !1 }, e]);
}
function V_(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var aI = (() => {
  class t {
    constructor() {
      (this.subscription = new Ce()),
        (this.initialized = !1),
        (this.zone = y(me)),
        (this.pendingTasks = y(xi));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let e = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (e = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              me.assertNotInAngularZone(),
                queueMicrotask(() => {
                  e !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(e), (e = null));
                });
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            me.assertInAngularZone(), (e ??= this.pendingTasks.add());
          }),
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static {
      this.ɵfac = function (i) {
        return new (i || t)();
      };
    }
    static {
      this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
  }
  return t;
})();
var lI = (() => {
  class t {
    constructor() {
      (this.appRef = y(Ot)),
        (this.taskService = y(xi)),
        (this.ngZone = y(me)),
        (this.zonelessEnabled = y(Ph)),
        (this.disableScheduling = y(f_, { optional: !0 }) ?? !1),
        (this.zoneIsDefined = typeof Zone < 'u' && !!Zone.root.run),
        (this.schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }]),
        (this.subscriptions = new Ce()),
        (this.angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(Nl) : null),
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
          !this.zonelessEnabled && (this.ngZone instanceof ff || !this.zoneIsDefined));
    }
    notify(e) {
      if (!this.zonelessEnabled && e === 5) return;
      switch (e) {
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
      let i = this.useMicrotaskScheduler ? V0 : vv;
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
        (!this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(Nl + this.angularZoneId))
      );
    }
    tick(e) {
      if (this.runningTick || this.appRef.destroyed) return;
      let i = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            (this.runningTick = !0), this.appRef._tick(e);
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
        V0(() => {
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
        let e = this.pendingRenderTaskId;
        (this.pendingRenderTaskId = null), this.taskService.remove(e);
      }
    }
    static {
      this.ɵfac = function (i) {
        return new (i || t)();
      };
    }
    static {
      this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
  }
  return t;
})();
function cI() {
  return (typeof $localize < 'u' && $localize.locale) || jl;
}
var uc = new F('', {
  providedIn: 'root',
  factory: () => y(uc, ae.Optional | ae.SkipSelf) || cI(),
});
var j_ = new F('');
function dl(t) {
  return !!t.platformInjector;
}
function uI(t) {
  let n = dl(t) ? t.r3Injector : t.moduleRef.injector,
    e = n.get(me);
  return e.run(() => {
    dl(t) ? t.r3Injector.resolveInjectorInitializers() : t.moduleRef.resolveInjectorInitializers();
    let i = n.get(Jn, null),
      r;
    if (
      (e.runOutsideAngular(() => {
        r = e.onError.subscribe({
          next: (o) => {
            i.handleError(o);
          },
        });
      }),
      dl(t))
    ) {
      let o = () => n.destroy(),
        s = t.platformInjector.get(j_);
      s.add(o),
        n.onDestroy(() => {
          r.unsubscribe(), s.delete(o);
        });
    } else
      t.moduleRef.onDestroy(() => {
        gl(t.allPlatformModules, t.moduleRef), r.unsubscribe();
      });
    return iI(i, e, () => {
      let o = n.get(F_);
      return (
        o.runInitializers(),
        o.donePromise.then(() => {
          let s = n.get(uc, jl);
          if (($M(s || jl), dl(t))) {
            let a = n.get(Ot);
            return t.rootComponent !== void 0 && a.bootstrap(t.rootComponent), a;
          } else return dI(t.moduleRef, t.allPlatformModules), t.moduleRef;
        })
      );
    });
  });
}
function dI(t, n) {
  let e = t.injector.get(Ot);
  if (t._bootstrapComponents.length > 0) t._bootstrapComponents.forEach((i) => e.bootstrap(i));
  else if (t.instance.ngDoBootstrap) t.instance.ngDoBootstrap(e);
  else throw new T(-403, !1);
  n.push(t);
}
var vl = null;
function fI(t = [], n) {
  return Ge.create({
    name: n,
    providers: [
      { provide: zl, useValue: 'platform' },
      { provide: j_, useValue: new Set([() => (vl = null)]) },
      ...t,
    ],
  });
}
function hI(t = []) {
  if (vl) return vl;
  let n = fI(t);
  return (vl = n), eI(), pI(n), n;
}
function pI(t) {
  t.get(gh, null)?.forEach((e) => e());
}
var cn = (() => {
  class t {
    static {
      this.__NG_ELEMENT_ID__ = mI;
    }
  }
  return t;
})();
function mI(t) {
  return gI(_t(), fe(), (t & 16) === 16);
}
function gI(t, n, e) {
  if (Ql(t) && !e) {
    let i = Ii(t.index, n);
    return new vr(i, i);
  } else if (t.type & 175) {
    let i = n[En];
    return new vr(i, n);
  }
  return null;
}
var Wf = class {
    constructor() {}
    supports(n) {
      return C_(n);
    }
    create(n) {
      return new qf(n);
    }
  },
  vI = (t, n) => n,
  qf = class {
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
        (this._trackByFn = n || vI);
    }
    forEachItem(n) {
      let e;
      for (e = this._itHead; e !== null; e = e._next) n(e);
    }
    forEachOperation(n) {
      let e = this._itHead,
        i = this._removalsHead,
        r = 0,
        o = null;
      for (; e || i; ) {
        let s = !i || (e && e.currentIndex < a1(i, r, o)) ? e : i,
          a = a1(s, r, o),
          l = s.currentIndex;
        if (s === i) r--, (i = i._nextRemoved);
        else if (((e = e._next), s.previousIndex == null)) r++;
        else {
          o || (o = []);
          let c = a - r,
            f = l - r;
          if (c != f) {
            for (let g = 0; g < c; g++) {
              let m = g < o.length ? o[g] : (o[g] = 0),
                v = m + g;
              f <= v && v < c && (o[g] = m + 1);
            }
            let p = s.previousIndex;
            o[p] = f - c;
          }
        }
        a !== l && n(s, a, l);
      }
    }
    forEachPreviousItem(n) {
      let e;
      for (e = this._previousItHead; e !== null; e = e._nextPrevious) n(e);
    }
    forEachAddedItem(n) {
      let e;
      for (e = this._additionsHead; e !== null; e = e._nextAdded) n(e);
    }
    forEachMovedItem(n) {
      let e;
      for (e = this._movesHead; e !== null; e = e._nextMoved) n(e);
    }
    forEachRemovedItem(n) {
      let e;
      for (e = this._removalsHead; e !== null; e = e._nextRemoved) n(e);
    }
    forEachIdentityChange(n) {
      let e;
      for (e = this._identityChangesHead; e !== null; e = e._nextIdentityChange) n(e);
    }
    diff(n) {
      if ((n == null && (n = []), !C_(n))) throw new T(900, !1);
      return this.check(n) ? this : null;
    }
    onDestroy() {}
    check(n) {
      this._reset();
      let e = this._itHead,
        i = !1,
        r,
        o,
        s;
      if (Array.isArray(n)) {
        this.length = n.length;
        for (let a = 0; a < this.length; a++)
          (o = n[a]),
            (s = this._trackByFn(a, o)),
            e === null || !Object.is(e.trackById, s)
              ? ((e = this._mismatch(e, o, s, a)), (i = !0))
              : (i && (e = this._verifyReinsertion(e, o, s, a)),
                Object.is(e.item, o) || this._addIdentityChange(e, o)),
            (e = e._next);
      } else
        (r = 0),
          cM(n, (a) => {
            (s = this._trackByFn(r, a)),
              e === null || !Object.is(e.trackById, s)
                ? ((e = this._mismatch(e, a, s, r)), (i = !0))
                : (i && (e = this._verifyReinsertion(e, a, s, r)),
                  Object.is(e.item, a) || this._addIdentityChange(e, a)),
              (e = e._next),
              r++;
          }),
          (this.length = r);
      return this._truncate(e), (this.collection = n), this.isDirty;
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
    _mismatch(n, e, i, r) {
      let o;
      return (
        n === null ? (o = this._itTail) : ((o = n._prev), this._remove(n)),
        (n = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(i, null)),
        n !== null
          ? (Object.is(n.item, e) || this._addIdentityChange(n, e), this._reinsertAfter(n, o, r))
          : ((n = this._linkedRecords === null ? null : this._linkedRecords.get(i, r)),
            n !== null
              ? (Object.is(n.item, e) || this._addIdentityChange(n, e), this._moveAfter(n, o, r))
              : (n = this._addAfter(new Qf(e, i), o, r))),
        n
      );
    }
    _verifyReinsertion(n, e, i, r) {
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
        let e = n._next;
        this._addToRemovals(this._unlink(n)), (n = e);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(n, e, i) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(n);
      let r = n._prevRemoved,
        o = n._nextRemoved;
      return (
        r === null ? (this._removalsHead = o) : (r._nextRemoved = o),
        o === null ? (this._removalsTail = r) : (o._prevRemoved = r),
        this._insertAfter(n, e, i),
        this._addToMoves(n, i),
        n
      );
    }
    _moveAfter(n, e, i) {
      return this._unlink(n), this._insertAfter(n, e, i), this._addToMoves(n, i), n;
    }
    _addAfter(n, e, i) {
      return (
        this._insertAfter(n, e, i),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = n)
          : (this._additionsTail = this._additionsTail._nextAdded = n),
        n
      );
    }
    _insertAfter(n, e, i) {
      let r = e === null ? this._itHead : e._next;
      return (
        (n._next = r),
        (n._prev = e),
        r === null ? (this._itTail = n) : (r._prev = n),
        e === null ? (this._itHead = n) : (e._next = n),
        this._linkedRecords === null && (this._linkedRecords = new Bl()),
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
      let e = n._prev,
        i = n._next;
      return (
        e === null ? (this._itHead = i) : (e._next = i),
        i === null ? (this._itTail = e) : (i._prev = e),
        n
      );
    }
    _addToMoves(n, e) {
      return (
        n.previousIndex === e ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = n)
            : (this._movesTail = this._movesTail._nextMoved = n)),
        n
      );
    }
    _addToRemovals(n) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new Bl()),
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
    _addIdentityChange(n, e) {
      return (
        (n.item = e),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = n)
          : (this._identityChangesTail = this._identityChangesTail._nextIdentityChange = n),
        n
      );
    }
  },
  Qf = class {
    constructor(n, e) {
      (this.item = n),
        (this.trackById = e),
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
  Zf = class {
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
    get(n, e) {
      let i;
      for (i = this._head; i !== null; i = i._nextDup)
        if ((e === null || e <= i.currentIndex) && Object.is(i.trackById, n)) return i;
      return null;
    }
    remove(n) {
      let e = n._prevDup,
        i = n._nextDup;
      return (
        e === null ? (this._head = i) : (e._nextDup = i),
        i === null ? (this._tail = e) : (i._prevDup = e),
        this._head === null
      );
    }
  },
  Bl = class {
    constructor() {
      this.map = new Map();
    }
    put(n) {
      let e = n.trackById,
        i = this.map.get(e);
      i || ((i = new Zf()), this.map.set(e, i)), i.add(n);
    }
    get(n, e) {
      let i = n,
        r = this.map.get(i);
      return r ? r.get(n, e) : null;
    }
    remove(n) {
      let e = n.trackById;
      return this.map.get(e).remove(n) && this.map.delete(e), n;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function a1(t, n, e) {
  let i = t.previousIndex;
  if (i === null) return i;
  let r = 0;
  return e && i < e.length && (r = e[i]), i + n + r;
}
function l1() {
  return new zh([new Wf()]);
}
var zh = (() => {
  class t {
    static {
      this.ɵprov = M({ token: t, providedIn: 'root', factory: l1 });
    }
    constructor(e) {
      this.factories = e;
    }
    static create(e, i) {
      if (i != null) {
        let r = i.factories.slice();
        e = e.concat(r);
      }
      return new t(e);
    }
    static extend(e) {
      return {
        provide: t,
        useFactory: (i) => t.create(e, i || l1()),
        deps: [[t, new y1(), new Yf()]],
      };
    }
    find(e) {
      let i = this.factories.find((r) => r.supports(e));
      if (i != null) return i;
      throw new T(901, !1);
    }
  }
  return t;
})();
function B_(t) {
  try {
    let { rootComponent: n, appProviders: e, platformProviders: i } = t,
      r = hI(i),
      o = [k_({}), { provide: yo, useExisting: lI }, ...(e || [])],
      s = new Ll({
        providers: o,
        parent: r,
        debugName: '',
        runEnvironmentInitializers: !1,
      });
    return uI({
      r3Injector: s.injector,
      platformInjector: r,
      rootComponent: n,
    });
  } catch (n) {
    return Promise.reject(n);
  }
}
var U_ = new F('');
function dc(t) {
  return typeof t == 'boolean' ? t : t != null && t !== 'false';
}
function Er(t, n) {
  On('NgSignals');
  let e = jg(t);
  return n?.equal && (e[pi].equal = n.equal), e;
}
function un(t) {
  let n = ue(null);
  try {
    return t();
  } finally {
    ue(n);
  }
}
var yt = {
  production: !0,
  API_SERVER_URL: 'https://api.example.com',
  ENABLE_SKIP_LOCATION: !0,
};
var Q_ = null;
function ri() {
  return Q_;
}
function Z_(t) {
  Q_ ??= t;
}
var fc = class {};
var Se = new F(''),
  K_ = (() => {
    class t {
      historyGo(e) {
        throw new Error('');
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({
          token: t,
          factory: () => y(CI),
          providedIn: 'platform',
        });
      }
    }
    return t;
  })();
var CI = (() => {
  class t extends K_ {
    constructor() {
      super(),
        (this._doc = y(Se)),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return ri().getBaseHref(this._doc);
    }
    onPopState(e) {
      let i = ri().getGlobalEventTarget(this._doc, 'window');
      return i.addEventListener('popstate', e, !1), () => i.removeEventListener('popstate', e);
    }
    onHashChange(e) {
      let i = ri().getGlobalEventTarget(this._doc, 'window');
      return i.addEventListener('hashchange', e, !1), () => i.removeEventListener('hashchange', e);
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
    set pathname(e) {
      this._location.pathname = e;
    }
    pushState(e, i, r) {
      this._history.pushState(e, i, r);
    }
    replaceState(e, i, r) {
      this._history.replaceState(e, i, r);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(e = 0) {
      this._history.go(e);
    }
    getState() {
      return this._history.state;
    }
    static {
      this.ɵfac = function (i) {
        return new (i || t)();
      };
    }
    static {
      this.ɵprov = M({
        token: t,
        factory: () => new t(),
        providedIn: 'platform',
      });
    }
  }
  return t;
})();
function Y_(t, n) {
  if (t.length == 0) return n;
  if (n.length == 0) return t;
  let e = 0;
  return (
    t.endsWith('/') && e++,
    n.startsWith('/') && e++,
    e == 2 ? t + n.substring(1) : e == 1 ? t + n : t + '/' + n
  );
}
function $_(t) {
  let n = t.match(/#|\?|$/),
    e = (n && n.index) || t.length,
    i = e - (t[e - 1] === '/' ? 1 : 0);
  return t.slice(0, i) + t.slice(e);
}
function Tr(t) {
  return t && t[0] !== '?' ? '?' + t : t;
}
var hc = (() => {
    class t {
      historyGo(e) {
        throw new Error('');
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: () => y(J_), providedIn: 'root' });
      }
    }
    return t;
  })(),
  wI = new F(''),
  J_ = (() => {
    class t extends hc {
      constructor(e, i) {
        super(),
          (this._platformLocation = e),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ?? this._platformLocation.getBaseHrefFromDOM() ?? y(Se).location?.origin ?? '');
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
      }
      onPopState(e) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(e),
          this._platformLocation.onHashChange(e),
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(e) {
        return Y_(this._baseHref, e);
      }
      path(e = !1) {
        let i = this._platformLocation.pathname + Tr(this._platformLocation.search),
          r = this._platformLocation.hash;
        return r && e ? `${i}${r}` : i;
      }
      pushState(e, i, r, o) {
        let s = this.prepareExternalUrl(r + Tr(o));
        this._platformLocation.pushState(e, i, s);
      }
      replaceState(e, i, r, o) {
        let s = this.prepareExternalUrl(r + Tr(o));
        this._platformLocation.replaceState(e, i, s);
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
      historyGo(e = 0) {
        this._platformLocation.historyGo?.(e);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(N(K_), N(wI, 8));
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })();
var Es = (() => {
  class t {
    constructor(e) {
      (this._subject = new Y()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = e);
      let i = this._locationStrategy.getBaseHref();
      (this._basePath = EI($_(H_(i)))),
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
    path(e = !1) {
      return this.normalize(this._locationStrategy.path(e));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(e, i = '') {
      return this.path() == this.normalize(e + Tr(i));
    }
    normalize(e) {
      return t.stripTrailingSlash(SI(this._basePath, H_(e)));
    }
    prepareExternalUrl(e) {
      return e && e[0] !== '/' && (e = '/' + e), this._locationStrategy.prepareExternalUrl(e);
    }
    go(e, i = '', r = null) {
      this._locationStrategy.pushState(r, '', e, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(e + Tr(i)), r);
    }
    replaceState(e, i = '', r = null) {
      this._locationStrategy.replaceState(r, '', e, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(e + Tr(i)), r);
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(e = 0) {
      this._locationStrategy.historyGo?.(e);
    }
    onUrlChange(e) {
      return (
        this._urlChangeListeners.push(e),
        (this._urlChangeSubscription ??= this.subscribe((i) => {
          this._notifyUrlChangeListeners(i.url, i.state);
        })),
        () => {
          let i = this._urlChangeListeners.indexOf(e);
          this._urlChangeListeners.splice(i, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeSubscription = null));
        }
      );
    }
    _notifyUrlChangeListeners(e = '', i) {
      this._urlChangeListeners.forEach((r) => r(e, i));
    }
    subscribe(e, i, r) {
      return this._subject.subscribe({ next: e, error: i, complete: r });
    }
    static {
      this.normalizeQueryParams = Tr;
    }
    static {
      this.joinWithSlash = Y_;
    }
    static {
      this.stripTrailingSlash = $_;
    }
    static {
      this.ɵfac = function (i) {
        return new (i || t)(N(hc));
      };
    }
    static {
      this.ɵprov = M({ token: t, factory: () => DI(), providedIn: 'root' });
    }
  }
  return t;
})();
function DI() {
  return new Es(N(hc));
}
function SI(t, n) {
  if (!t || !n.startsWith(t)) return n;
  let e = n.substring(t.length);
  return e === '' || ['/', ';', '?', '#'].includes(e[0]) ? e : n;
}
function H_(t) {
  return t.replace(/\/index.html$/, '');
}
function EI(t) {
  if (new RegExp('^(https?:)?//').test(t)) {
    let [, e] = t.split(/\/\/[^\/]+/);
    return e;
  }
  return t;
}
function pc(t, n) {
  n = encodeURIComponent(n);
  for (let e of t.split(';')) {
    let i = e.indexOf('='),
      [r, o] = i == -1 ? [e, ''] : [e.slice(0, i), e.slice(i + 1)];
    if (r.trim() === n) return decodeURIComponent(o);
  }
  return null;
}
var Wh = /\s+/,
  G_ = [],
  mc = (() => {
    class t {
      constructor(e, i) {
        (this._ngEl = e),
          (this._renderer = i),
          (this.initialClasses = G_),
          (this.stateMap = new Map());
      }
      set klass(e) {
        this.initialClasses = e != null ? e.trim().split(Wh) : G_;
      }
      set ngClass(e) {
        this.rawClass = typeof e == 'string' ? e.trim().split(Wh) : e;
      }
      ngDoCheck() {
        for (let i of this.initialClasses) this._updateState(i, !0);
        let e = this.rawClass;
        if (Array.isArray(e) || e instanceof Set) for (let i of e) this._updateState(i, !0);
        else if (e != null) for (let i of Object.keys(e)) this._updateState(i, !!e[i]);
        this._applyStateDiff();
      }
      _updateState(e, i) {
        let r = this.stateMap.get(e);
        r !== void 0
          ? (r.enabled !== i && ((r.changed = !0), (r.enabled = i)), (r.touched = !0))
          : this.stateMap.set(e, { enabled: i, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let e of this.stateMap) {
          let i = e[0],
            r = e[1];
          r.changed
            ? (this._toggleClass(i, r.enabled), (r.changed = !1))
            : r.touched || (r.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (r.touched = !1);
        }
      }
      _toggleClass(e, i) {
        (e = e.trim()),
          e.length > 0 &&
            e.split(Wh).forEach((r) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, r)
                : this._renderer.removeClass(this._ngEl.nativeElement, r);
            });
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(k(Ne), k(Ni));
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['', 'ngClass', '']],
          inputs: { klass: [0, 'class', 'klass'], ngClass: 'ngClass' },
          standalone: !0,
        });
      }
    }
    return t;
  })();
var qh = class {
    constructor(n, e, i, r) {
      (this.$implicit = n), (this.ngForOf = e), (this.index = i), (this.count = r);
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
  So = (() => {
    class t {
      set ngForOf(e) {
        (this._ngForOf = e), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(e) {
        this._trackByFn = e;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(e, i, r) {
        (this._viewContainer = e),
          (this._template = i),
          (this._differs = r),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(e) {
        e && (this._template = e);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let e = this._ngForOf;
          if (!this._differ && e)
            if (0)
              try {
              } catch {}
            else this._differ = this._differs.find(e).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let e = this._differ.diff(this._ngForOf);
          e && this._applyChanges(e);
        }
      }
      _applyChanges(e) {
        let i = this._viewContainer;
        e.forEachOperation((r, o, s) => {
          if (r.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new qh(r.item, this._ngForOf, -1, -1),
              s === null ? void 0 : s,
            );
          else if (s == null) i.remove(o === null ? void 0 : o);
          else if (o !== null) {
            let a = i.get(o);
            i.move(a, s), z_(a, r);
          }
        });
        for (let r = 0, o = i.length; r < o; r++) {
          let a = i.get(r).context;
          (a.index = r), (a.count = o), (a.ngForOf = this._ngForOf);
        }
        e.forEachIdentityChange((r) => {
          let o = i.get(r.currentIndex);
          z_(o, r);
        });
      }
      static ngTemplateContextGuard(e, i) {
        return !0;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(k(an), k(ti), k(zh));
        };
      }
      static {
        this.ɵdir = le({
          type: t,
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
    return t;
  })();
function z_(t, n) {
  t.context.$implicit = n.item;
}
var Rt = (() => {
    class t {
      constructor(e, i) {
        (this._viewContainer = e),
          (this._context = new Qh()),
          (this._thenTemplateRef = null),
          (this._elseTemplateRef = null),
          (this._thenViewRef = null),
          (this._elseViewRef = null),
          (this._thenTemplateRef = i);
      }
      set ngIf(e) {
        (this._context.$implicit = this._context.ngIf = e), this._updateView();
      }
      set ngIfThen(e) {
        W_('ngIfThen', e),
          (this._thenTemplateRef = e),
          (this._thenViewRef = null),
          this._updateView();
      }
      set ngIfElse(e) {
        W_('ngIfElse', e),
          (this._elseTemplateRef = e),
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
      static ngTemplateContextGuard(e, i) {
        return !0;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(k(an), k(ti));
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['', 'ngIf', '']],
          inputs: { ngIf: 'ngIf', ngIfThen: 'ngIfThen', ngIfElse: 'ngIfElse' },
          standalone: !0,
        });
      }
    }
    return t;
  })(),
  Qh = class {
    constructor() {
      (this.$implicit = null), (this.ngIf = null);
    }
  };
function W_(t, n) {
  if (!!!(!n || n.createEmbeddedView))
    throw new Error(`${t} must be a TemplateRef, but received '${gt(n)}'.`);
}
var Kh = (() => {
  class t {
    constructor(e) {
      (this._viewContainerRef = e),
        (this._viewRef = null),
        (this.ngTemplateOutletContext = null),
        (this.ngTemplateOutlet = null),
        (this.ngTemplateOutletInjector = null);
    }
    ngOnChanges(e) {
      if (this._shouldRecreateView(e)) {
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
    _shouldRecreateView(e) {
      return !!e.ngTemplateOutlet || !!e.ngTemplateOutletInjector;
    }
    _createContextForwardProxy() {
      return new Proxy(
        {},
        {
          set: (e, i, r) =>
            this.ngTemplateOutletContext ? Reflect.set(this.ngTemplateOutletContext, i, r) : !1,
          get: (e, i, r) => {
            if (this.ngTemplateOutletContext)
              return Reflect.get(this.ngTemplateOutletContext, i, r);
          },
        },
      );
    }
    static {
      this.ɵfac = function (i) {
        return new (i || t)(k(an));
      };
    }
    static {
      this.ɵdir = le({
        type: t,
        selectors: [['', 'ngTemplateOutlet', '']],
        inputs: {
          ngTemplateOutletContext: 'ngTemplateOutletContext',
          ngTemplateOutlet: 'ngTemplateOutlet',
          ngTemplateOutletInjector: 'ngTemplateOutletInjector',
        },
        standalone: !0,
        features: [on],
      });
    }
  }
  return t;
})();
var ot = (() => {
    class t {
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵmod = ft({ type: t });
      }
      static {
        this.ɵinj = dt({});
      }
    }
    return t;
  })(),
  X_ = 'browser',
  TI = 'server';
function gc(t) {
  return t === TI;
}
var Do = class {};
var Ms = class {},
  _c = class {},
  oi = class t {
    constructor(n) {
      (this.normalizedNames = new Map()),
        (this.lazyUpdate = null),
        n
          ? typeof n == 'string'
            ? (this.lazyInit = () => {
                (this.headers = new Map()),
                  n
                    .split(
                      `
`,
                    )
                    .forEach((e) => {
                      let i = e.indexOf(':');
                      if (i > 0) {
                        let r = e.slice(0, i),
                          o = r.toLowerCase(),
                          s = e.slice(i + 1).trim();
                        this.maybeSetNormalizedName(r, o),
                          this.headers.has(o)
                            ? this.headers.get(o).push(s)
                            : this.headers.set(o, [s]);
                      }
                    });
              })
            : typeof Headers < 'u' && n instanceof Headers
              ? ((this.headers = new Map()),
                n.forEach((e, i) => {
                  this.setHeaderEntries(i, e);
                }))
              : (this.lazyInit = () => {
                  (this.headers = new Map()),
                    Object.entries(n).forEach(([e, i]) => {
                      this.setHeaderEntries(e, i);
                    });
                })
          : (this.headers = new Map());
    }
    has(n) {
      return this.init(), this.headers.has(n.toLowerCase());
    }
    get(n) {
      this.init();
      let e = this.headers.get(n.toLowerCase());
      return e && e.length > 0 ? e[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(n) {
      return this.init(), this.headers.get(n.toLowerCase()) || null;
    }
    append(n, e) {
      return this.clone({ name: n, value: e, op: 'a' });
    }
    set(n, e) {
      return this.clone({ name: n, value: e, op: 's' });
    }
    delete(n, e) {
      return this.clone({ name: n, value: e, op: 'd' });
    }
    maybeSetNormalizedName(n, e) {
      this.normalizedNames.has(e) || this.normalizedNames.set(e, n);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof t ? this.copyFrom(this.lazyInit) : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((n) => this.applyUpdate(n)), (this.lazyUpdate = null)));
    }
    copyFrom(n) {
      n.init(),
        Array.from(n.headers.keys()).forEach((e) => {
          this.headers.set(e, n.headers.get(e)),
            this.normalizedNames.set(e, n.normalizedNames.get(e));
        });
    }
    clone(n) {
      let e = new t();
      return (
        (e.lazyInit = this.lazyInit && this.lazyInit instanceof t ? this.lazyInit : this),
        (e.lazyUpdate = (this.lazyUpdate || []).concat([n])),
        e
      );
    }
    applyUpdate(n) {
      let e = n.name.toLowerCase();
      switch (n.op) {
        case 'a':
        case 's':
          let i = n.value;
          if ((typeof i == 'string' && (i = [i]), i.length === 0)) return;
          this.maybeSetNormalizedName(n.name, e);
          let r = (n.op === 'a' ? this.headers.get(e) : void 0) || [];
          r.push(...i), this.headers.set(e, r);
          break;
        case 'd':
          let o = n.value;
          if (!o) this.headers.delete(e), this.normalizedNames.delete(e);
          else {
            let s = this.headers.get(e);
            if (!s) return;
            (s = s.filter((a) => o.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(e), this.normalizedNames.delete(e))
                : this.headers.set(e, s);
          }
          break;
      }
    }
    setHeaderEntries(n, e) {
      let i = (Array.isArray(e) ? e : [e]).map((o) => o.toString()),
        r = n.toLowerCase();
      this.headers.set(r, i), this.maybeSetNormalizedName(n, r);
    }
    forEach(n) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((e) =>
          n(this.normalizedNames.get(e), this.headers.get(e)),
        );
    }
  };
var Jh = class {
  encodeKey(n) {
    return ey(n);
  }
  encodeValue(n) {
    return ey(n);
  }
  decodeKey(n) {
    return decodeURIComponent(n);
  }
  decodeValue(n) {
    return decodeURIComponent(n);
  }
};
function MI(t, n) {
  let e = new Map();
  return (
    t.length > 0 &&
      t
        .replace(/^\?/, '')
        .split('&')
        .forEach((r) => {
          let o = r.indexOf('='),
            [s, a] =
              o == -1
                ? [n.decodeKey(r), '']
                : [n.decodeKey(r.slice(0, o)), n.decodeValue(r.slice(o + 1))],
            l = e.get(s) || [];
          l.push(a), e.set(s, l);
        }),
    e
  );
}
var II = /%(\d[a-f0-9])/gi,
  xI = {
    40: '@',
    '3A': ':',
    24: '$',
    '2C': ',',
    '3B': ';',
    '3D': '=',
    '3F': '?',
    '2F': '/',
  };
function ey(t) {
  return encodeURIComponent(t).replace(II, (n, e) => xI[e] ?? n);
}
function vc(t) {
  return `${t}`;
}
var ki = class t {
  constructor(n = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = n.encoder || new Jh()),
      n.fromString)
    ) {
      if (n.fromObject) throw new Error('Cannot specify both fromString and fromObject.');
      this.map = MI(n.fromString, this.encoder);
    } else
      n.fromObject
        ? ((this.map = new Map()),
          Object.keys(n.fromObject).forEach((e) => {
            let i = n.fromObject[e],
              r = Array.isArray(i) ? i.map(vc) : [vc(i)];
            this.map.set(e, r);
          }))
        : (this.map = null);
  }
  has(n) {
    return this.init(), this.map.has(n);
  }
  get(n) {
    this.init();
    let e = this.map.get(n);
    return e ? e[0] : null;
  }
  getAll(n) {
    return this.init(), this.map.get(n) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(n, e) {
    return this.clone({ param: n, value: e, op: 'a' });
  }
  appendAll(n) {
    let e = [];
    return (
      Object.keys(n).forEach((i) => {
        let r = n[i];
        Array.isArray(r)
          ? r.forEach((o) => {
              e.push({ param: i, value: o, op: 'a' });
            })
          : e.push({ param: i, value: r, op: 'a' });
      }),
      this.clone(e)
    );
  }
  set(n, e) {
    return this.clone({ param: n, value: e, op: 's' });
  }
  delete(n, e) {
    return this.clone({ param: n, value: e, op: 'd' });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((n) => {
          let e = this.encoder.encodeKey(n);
          return this.map
            .get(n)
            .map((i) => e + '=' + this.encoder.encodeValue(i))
            .join('&');
        })
        .filter((n) => n !== '')
        .join('&')
    );
  }
  clone(n) {
    let e = new t({ encoder: this.encoder });
    return (e.cloneFrom = this.cloneFrom || this), (e.updates = (this.updates || []).concat(n)), e;
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom.keys().forEach((n) => this.map.set(n, this.cloneFrom.map.get(n))),
        this.updates.forEach((n) => {
          switch (n.op) {
            case 'a':
            case 's':
              let e = (n.op === 'a' ? this.map.get(n.param) : void 0) || [];
              e.push(vc(n.value)), this.map.set(n.param, e);
              break;
            case 'd':
              if (n.value !== void 0) {
                let i = this.map.get(n.param) || [],
                  r = i.indexOf(vc(n.value));
                r !== -1 && i.splice(r, 1),
                  i.length > 0 ? this.map.set(n.param, i) : this.map.delete(n.param);
              } else {
                this.map.delete(n.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var Xh = class {
  constructor() {
    this.map = new Map();
  }
  set(n, e) {
    return this.map.set(n, e), this;
  }
  get(n) {
    return this.map.has(n) || this.map.set(n, n.defaultValue()), this.map.get(n);
  }
  delete(n) {
    return this.map.delete(n), this;
  }
  has(n) {
    return this.map.has(n);
  }
  keys() {
    return this.map.keys();
  }
};
function NI(t) {
  switch (t) {
    case 'DELETE':
    case 'GET':
    case 'HEAD':
    case 'OPTIONS':
    case 'JSONP':
      return !1;
    default:
      return !0;
  }
}
function ty(t) {
  return typeof ArrayBuffer < 'u' && t instanceof ArrayBuffer;
}
function ny(t) {
  return typeof Blob < 'u' && t instanceof Blob;
}
function iy(t) {
  return typeof FormData < 'u' && t instanceof FormData;
}
function AI(t) {
  return typeof URLSearchParams < 'u' && t instanceof URLSearchParams;
}
var Ts = class t {
    constructor(n, e, i, r) {
      (this.url = e),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = 'json'),
        (this.method = n.toUpperCase());
      let o;
      if (
        (NI(this.method) || r ? ((this.body = i !== void 0 ? i : null), (o = r)) : (o = i),
        o &&
          ((this.reportProgress = !!o.reportProgress),
          (this.withCredentials = !!o.withCredentials),
          o.responseType && (this.responseType = o.responseType),
          o.headers && (this.headers = o.headers),
          o.context && (this.context = o.context),
          o.params && (this.params = o.params),
          (this.transferCache = o.transferCache)),
        (this.headers ??= new oi()),
        (this.context ??= new Xh()),
        !this.params)
      )
        (this.params = new ki()), (this.urlWithParams = e);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = e;
        else {
          let a = e.indexOf('?'),
            l = a === -1 ? '?' : a < e.length - 1 ? '&' : '';
          this.urlWithParams = e + l + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == 'string' ||
            ty(this.body) ||
            ny(this.body) ||
            iy(this.body) ||
            AI(this.body)
          ? this.body
          : this.body instanceof ki
            ? this.body.toString()
            : typeof this.body == 'object' ||
                typeof this.body == 'boolean' ||
                Array.isArray(this.body)
              ? JSON.stringify(this.body)
              : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || iy(this.body)
        ? null
        : ny(this.body)
          ? this.body.type || null
          : ty(this.body)
            ? null
            : typeof this.body == 'string'
              ? 'text/plain'
              : this.body instanceof ki
                ? 'application/x-www-form-urlencoded;charset=UTF-8'
                : typeof this.body == 'object' ||
                    typeof this.body == 'number' ||
                    typeof this.body == 'boolean'
                  ? 'application/json'
                  : null;
    }
    clone(n = {}) {
      let e = n.method || this.method,
        i = n.url || this.url,
        r = n.responseType || this.responseType,
        o = n.transferCache ?? this.transferCache,
        s = n.body !== void 0 ? n.body : this.body,
        a = n.withCredentials ?? this.withCredentials,
        l = n.reportProgress ?? this.reportProgress,
        c = n.headers || this.headers,
        f = n.params || this.params,
        p = n.context ?? this.context;
      return (
        n.setHeaders !== void 0 &&
          (c = Object.keys(n.setHeaders).reduce((g, m) => g.set(m, n.setHeaders[m]), c)),
        n.setParams && (f = Object.keys(n.setParams).reduce((g, m) => g.set(m, n.setParams[m]), f)),
        new t(e, i, s, {
          params: f,
          headers: c,
          context: p,
          reportProgress: l,
          responseType: r,
          withCredentials: a,
          transferCache: o,
        })
      );
    }
  },
  Li = (function (t) {
    return (
      (t[(t.Sent = 0)] = 'Sent'),
      (t[(t.UploadProgress = 1)] = 'UploadProgress'),
      (t[(t.ResponseHeader = 2)] = 'ResponseHeader'),
      (t[(t.DownloadProgress = 3)] = 'DownloadProgress'),
      (t[(t.Response = 4)] = 'Response'),
      (t[(t.User = 5)] = 'User'),
      t
    );
  })(Li || {}),
  Is = class {
    constructor(n, e = 200, i = 'OK') {
      (this.headers = n.headers || new oi()),
        (this.status = n.status !== void 0 ? n.status : e),
        (this.statusText = n.statusText || i),
        (this.url = n.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  yc = class t extends Is {
    constructor(n = {}) {
      super(n), (this.type = Li.ResponseHeader);
    }
    clone(n = {}) {
      return new t({
        headers: n.headers || this.headers,
        status: n.status !== void 0 ? n.status : this.status,
        statusText: n.statusText || this.statusText,
        url: n.url || this.url || void 0,
      });
    }
  },
  xs = class t extends Is {
    constructor(n = {}) {
      super(n), (this.type = Li.Response), (this.body = n.body !== void 0 ? n.body : null);
    }
    clone(n = {}) {
      return new t({
        body: n.body !== void 0 ? n.body : this.body,
        headers: n.headers || this.headers,
        status: n.status !== void 0 ? n.status : this.status,
        statusText: n.statusText || this.statusText,
        url: n.url || this.url || void 0,
      });
    }
  },
  Fi = class extends Is {
    constructor(n) {
      super(n, 0, 'Unknown Error'),
        (this.name = 'HttpErrorResponse'),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${n.url || '(unknown url)'}`)
          : (this.message = `Http failure response for ${n.url || '(unknown url)'}: ${n.status} ${n.statusText}`),
        (this.error = n.error || null);
    }
  },
  ay = 200,
  OI = 204;
function Yh(t, n) {
  return {
    body: n,
    headers: t.headers,
    context: t.context,
    observe: t.observe,
    params: t.params,
    reportProgress: t.reportProgress,
    responseType: t.responseType,
    withCredentials: t.withCredentials,
    transferCache: t.transferCache,
  };
}
var Ns = (() => {
    class t {
      constructor(e) {
        this.handler = e;
      }
      request(e, i, r = {}) {
        let o;
        if (e instanceof Ts) o = e;
        else {
          let l;
          r.headers instanceof oi ? (l = r.headers) : (l = new oi(r.headers));
          let c;
          r.params &&
            (r.params instanceof ki ? (c = r.params) : (c = new ki({ fromObject: r.params }))),
            (o = new Ts(e, i, r.body !== void 0 ? r.body : null, {
              headers: l,
              context: r.context,
              params: c,
              reportProgress: r.reportProgress,
              responseType: r.responseType || 'json',
              withCredentials: r.withCredentials,
              transferCache: r.transferCache,
            }));
        }
        let s = L(o).pipe(yn((l) => this.handler.handle(l)));
        if (e instanceof Ts || r.observe === 'events') return s;
        let a = s.pipe(tt((l) => l instanceof xs));
        switch (r.observe || 'body') {
          case 'body':
            switch (o.responseType) {
              case 'arraybuffer':
                return a.pipe(
                  z((l) => {
                    if (l.body !== null && !(l.body instanceof ArrayBuffer))
                      throw new Error('Response is not an ArrayBuffer.');
                    return l.body;
                  }),
                );
              case 'blob':
                return a.pipe(
                  z((l) => {
                    if (l.body !== null && !(l.body instanceof Blob))
                      throw new Error('Response is not a Blob.');
                    return l.body;
                  }),
                );
              case 'text':
                return a.pipe(
                  z((l) => {
                    if (l.body !== null && typeof l.body != 'string')
                      throw new Error('Response is not a string.');
                    return l.body;
                  }),
                );
              case 'json':
              default:
                return a.pipe(z((l) => l.body));
            }
          case 'response':
            return a;
          default:
            throw new Error(`Unreachable: unhandled observe type ${r.observe}}`);
        }
      }
      delete(e, i = {}) {
        return this.request('DELETE', e, i);
      }
      get(e, i = {}) {
        return this.request('GET', e, i);
      }
      head(e, i = {}) {
        return this.request('HEAD', e, i);
      }
      jsonp(e, i) {
        return this.request('JSONP', e, {
          params: new ki().append(i, 'JSONP_CALLBACK'),
          observe: 'body',
          responseType: 'json',
        });
      }
      options(e, i = {}) {
        return this.request('OPTIONS', e, i);
      }
      patch(e, i, r = {}) {
        return this.request('PATCH', e, Yh(r, i));
      }
      post(e, i, r = {}) {
        return this.request('POST', e, Yh(r, i));
      }
      put(e, i, r = {}) {
        return this.request('PUT', e, Yh(r, i));
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(N(Ms));
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac });
      }
    }
    return t;
  })(),
  RI = /^\)\]\}',?\n/,
  PI = 'X-Request-URL';
function ry(t) {
  if (t.url) return t.url;
  let n = PI.toLocaleLowerCase();
  return t.headers.get(n);
}
var FI = (() => {
    class t {
      constructor() {
        (this.fetchImpl = y(ep, { optional: !0 })?.fetch ?? fetch.bind(globalThis)),
          (this.ngZone = y(me));
      }
      handle(e) {
        return new Q((i) => {
          let r = new AbortController();
          return (
            this.doRequest(e, r.signal, i).then(tp, (o) => i.error(new Fi({ error: o }))),
            () => r.abort()
          );
        });
      }
      doRequest(e, i, r) {
        return Ta(this, null, function* () {
          let o = this.createRequestInit(e),
            s;
          try {
            let m = this.ngZone.runOutsideAngular(() =>
              this.fetchImpl(e.urlWithParams, E({ signal: i }, o)),
            );
            kI(m), r.next({ type: Li.Sent }), (s = yield m);
          } catch (m) {
            r.error(
              new Fi({
                error: m,
                status: m.status ?? 0,
                statusText: m.statusText,
                url: e.urlWithParams,
                headers: m.headers,
              }),
            );
            return;
          }
          let a = new oi(s.headers),
            l = s.statusText,
            c = ry(s) ?? e.urlWithParams,
            f = s.status,
            p = null;
          if (
            (e.reportProgress && r.next(new yc({ headers: a, status: f, statusText: l, url: c })),
            s.body)
          ) {
            let m = s.headers.get('content-length'),
              v = [],
              _ = s.body.getReader(),
              C = 0,
              S,
              O,
              I = typeof Zone < 'u' && Zone.current;
            yield this.ngZone.runOutsideAngular(() =>
              Ta(this, null, function* () {
                for (;;) {
                  let { done: G, value: B } = yield _.read();
                  if (G) break;
                  if ((v.push(B), (C += B.length), e.reportProgress)) {
                    O =
                      e.responseType === 'text'
                        ? (O ?? '') + (S ??= new TextDecoder()).decode(B, { stream: !0 })
                        : void 0;
                    let W = () =>
                      r.next({
                        type: Li.DownloadProgress,
                        total: m ? +m : void 0,
                        loaded: C,
                        partialText: O,
                      });
                    I ? I.run(W) : W();
                  }
                }
              }),
            );
            let A = this.concatChunks(v, C);
            try {
              let G = s.headers.get('Content-Type') ?? '';
              p = this.parseBody(e, A, G);
            } catch (G) {
              r.error(
                new Fi({
                  error: G,
                  headers: new oi(s.headers),
                  status: s.status,
                  statusText: s.statusText,
                  url: ry(s) ?? e.urlWithParams,
                }),
              );
              return;
            }
          }
          f === 0 && (f = p ? ay : 0),
            f >= 200 && f < 300
              ? (r.next(
                  new xs({
                    body: p,
                    headers: a,
                    status: f,
                    statusText: l,
                    url: c,
                  }),
                ),
                r.complete())
              : r.error(
                  new Fi({
                    error: p,
                    headers: a,
                    status: f,
                    statusText: l,
                    url: c,
                  }),
                );
        });
      }
      parseBody(e, i, r) {
        switch (e.responseType) {
          case 'json':
            let o = new TextDecoder().decode(i).replace(RI, '');
            return o === '' ? null : JSON.parse(o);
          case 'text':
            return new TextDecoder().decode(i);
          case 'blob':
            return new Blob([i], { type: r });
          case 'arraybuffer':
            return i.buffer;
        }
      }
      createRequestInit(e) {
        let i = {},
          r = e.withCredentials ? 'include' : void 0;
        if (
          (e.headers.forEach((o, s) => (i[o] = s.join(','))),
          e.headers.has('Accept') || (i.Accept = 'application/json, text/plain, */*'),
          !e.headers.has('Content-Type'))
        ) {
          let o = e.detectContentTypeHeader();
          o !== null && (i['Content-Type'] = o);
        }
        return {
          body: e.serializeBody(),
          method: e.method,
          headers: i,
          credentials: r,
        };
      }
      concatChunks(e, i) {
        let r = new Uint8Array(i),
          o = 0;
        for (let s of e) r.set(s, o), (o += s.length);
        return r;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac });
      }
    }
    return t;
  })(),
  ep = class {};
function tp() {}
function kI(t) {
  t.then(tp, tp);
}
function LI(t, n) {
  return n(t);
}
function VI(t, n, e) {
  return (i, r) => Ut(e, () => n(i, (o) => t(o, r)));
}
var ly = new F(''),
  jI = new F(''),
  BI = new F('', { providedIn: 'root', factory: () => !0 });
var oy = (() => {
  class t extends Ms {
    constructor(e, i) {
      super(),
        (this.backend = e),
        (this.injector = i),
        (this.chain = null),
        (this.pendingTasks = y(xi)),
        (this.contributeToStability = y(BI));
    }
    handle(e) {
      if (this.chain === null) {
        let i = Array.from(new Set([...this.injector.get(ly), ...this.injector.get(jI, [])]));
        this.chain = i.reduceRight((r, o) => VI(r, o, this.injector), LI);
      }
      if (this.contributeToStability) {
        let i = this.pendingTasks.add();
        return this.chain(e, (r) => this.backend.handle(r)).pipe(
          _i(() => this.pendingTasks.remove(i)),
        );
      } else return this.chain(e, (i) => this.backend.handle(i));
    }
    static {
      this.ɵfac = function (i) {
        return new (i || t)(N(_c), N(vt));
      };
    }
    static {
      this.ɵprov = M({ token: t, factory: t.ɵfac });
    }
  }
  return t;
})();
var UI = /^\)\]\}',?\n/;
function $I(t) {
  return 'responseURL' in t && t.responseURL
    ? t.responseURL
    : /^X-Request-URL:/m.test(t.getAllResponseHeaders())
      ? t.getResponseHeader('X-Request-URL')
      : null;
}
var sy = (() => {
    class t {
      constructor(e) {
        this.xhrFactory = e;
      }
      handle(e) {
        if (e.method === 'JSONP') throw new T(-2800, !1);
        let i = this.xhrFactory;
        return (i.ɵloadImpl ? Me(i.ɵloadImpl()) : L(null)).pipe(
          nt(
            () =>
              new Q((o) => {
                let s = i.build();
                if (
                  (s.open(e.method, e.urlWithParams),
                  e.withCredentials && (s.withCredentials = !0),
                  e.headers.forEach((_, C) => s.setRequestHeader(_, C.join(','))),
                  e.headers.has('Accept') ||
                    s.setRequestHeader('Accept', 'application/json, text/plain, */*'),
                  !e.headers.has('Content-Type'))
                ) {
                  let _ = e.detectContentTypeHeader();
                  _ !== null && s.setRequestHeader('Content-Type', _);
                }
                if (e.responseType) {
                  let _ = e.responseType.toLowerCase();
                  s.responseType = _ !== 'json' ? _ : 'text';
                }
                let a = e.serializeBody(),
                  l = null,
                  c = () => {
                    if (l !== null) return l;
                    let _ = s.statusText || 'OK',
                      C = new oi(s.getAllResponseHeaders()),
                      S = $I(s) || e.url;
                    return (
                      (l = new yc({
                        headers: C,
                        status: s.status,
                        statusText: _,
                        url: S,
                      })),
                      l
                    );
                  },
                  f = () => {
                    let { headers: _, status: C, statusText: S, url: O } = c(),
                      I = null;
                    C !== OI && (I = typeof s.response > 'u' ? s.responseText : s.response),
                      C === 0 && (C = I ? ay : 0);
                    let A = C >= 200 && C < 300;
                    if (e.responseType === 'json' && typeof I == 'string') {
                      let G = I;
                      I = I.replace(UI, '');
                      try {
                        I = I !== '' ? JSON.parse(I) : null;
                      } catch (B) {
                        (I = G), A && ((A = !1), (I = { error: B, text: I }));
                      }
                    }
                    A
                      ? (o.next(
                          new xs({
                            body: I,
                            headers: _,
                            status: C,
                            statusText: S,
                            url: O || void 0,
                          }),
                        ),
                        o.complete())
                      : o.error(
                          new Fi({
                            error: I,
                            headers: _,
                            status: C,
                            statusText: S,
                            url: O || void 0,
                          }),
                        );
                  },
                  p = (_) => {
                    let { url: C } = c(),
                      S = new Fi({
                        error: _,
                        status: s.status || 0,
                        statusText: s.statusText || 'Unknown Error',
                        url: C || void 0,
                      });
                    o.error(S);
                  },
                  g = !1,
                  m = (_) => {
                    g || (o.next(c()), (g = !0));
                    let C = { type: Li.DownloadProgress, loaded: _.loaded };
                    _.lengthComputable && (C.total = _.total),
                      e.responseType === 'text' &&
                        s.responseText &&
                        (C.partialText = s.responseText),
                      o.next(C);
                  },
                  v = (_) => {
                    let C = { type: Li.UploadProgress, loaded: _.loaded };
                    _.lengthComputable && (C.total = _.total), o.next(C);
                  };
                return (
                  s.addEventListener('load', f),
                  s.addEventListener('error', p),
                  s.addEventListener('timeout', p),
                  s.addEventListener('abort', p),
                  e.reportProgress &&
                    (s.addEventListener('progress', m),
                    a !== null && s.upload && s.upload.addEventListener('progress', v)),
                  s.send(a),
                  o.next({ type: Li.Sent }),
                  () => {
                    s.removeEventListener('error', p),
                      s.removeEventListener('abort', p),
                      s.removeEventListener('load', f),
                      s.removeEventListener('timeout', p),
                      e.reportProgress &&
                        (s.removeEventListener('progress', m),
                        a !== null && s.upload && s.upload.removeEventListener('progress', v)),
                      s.readyState !== s.DONE && s.abort();
                  }
                );
              }),
          ),
        );
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(N(Do));
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac });
      }
    }
    return t;
  })(),
  cy = new F(''),
  HI = 'XSRF-TOKEN',
  GI = new F('', { providedIn: 'root', factory: () => HI }),
  zI = 'X-XSRF-TOKEN',
  WI = new F('', { providedIn: 'root', factory: () => zI }),
  bc = class {},
  qI = (() => {
    class t {
      constructor(e, i, r) {
        (this.doc = e),
          (this.platform = i),
          (this.cookieName = r),
          (this.lastCookieString = ''),
          (this.lastToken = null),
          (this.parseCount = 0);
      }
      getToken() {
        if (this.platform === 'server') return null;
        let e = this.doc.cookie || '';
        return (
          e !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = pc(e, this.cookieName)),
            (this.lastCookieString = e)),
          this.lastToken
        );
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(N(Se), N(xn), N(GI));
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac });
      }
    }
    return t;
  })();
function QI(t, n) {
  let e = t.url.toLowerCase();
  if (
    !y(cy) ||
    t.method === 'GET' ||
    t.method === 'HEAD' ||
    e.startsWith('http://') ||
    e.startsWith('https://')
  )
    return n(t);
  let i = y(bc).getToken(),
    r = y(WI);
  return i != null && !t.headers.has(r) && (t = t.clone({ headers: t.headers.set(r, i) })), n(t);
}
function uy(...t) {
  let n = [
    Ns,
    sy,
    oy,
    { provide: Ms, useExisting: oy },
    { provide: _c, useFactory: () => y(FI, { optional: !0 }) ?? y(sy) },
    { provide: ly, useValue: QI, multi: !0 },
    { provide: cy, useValue: !0 },
    { provide: bc, useClass: qI },
  ];
  for (let e of t) n.push(...e.ɵproviders);
  return Mi(n);
}
var rp = class extends fc {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  op = class t extends rp {
    static makeCurrent() {
      Z_(new t());
    }
    onAndCancel(n, e, i) {
      return (
        n.addEventListener(e, i),
        () => {
          n.removeEventListener(e, i);
        }
      );
    }
    dispatchEvent(n, e) {
      n.dispatchEvent(e);
    }
    remove(n) {
      n.remove();
    }
    createElement(n, e) {
      return (e = e || this.getDefaultDocument()), e.createElement(n);
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
    getGlobalEventTarget(n, e) {
      return e === 'window' ? window : e === 'document' ? n : e === 'body' ? n.body : null;
    }
    getBaseHref(n) {
      let e = KI();
      return e == null ? null : YI(e);
    }
    resetBaseElement() {
      As = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(n) {
      return pc(document.cookie, n);
    }
  },
  As = null;
function KI() {
  return (As = As || document.querySelector('base')), As ? As.getAttribute('href') : null;
}
function YI(t) {
  return new URL(t, document.baseURI).pathname;
}
var JI = (() => {
    class t {
      build() {
        return new XMLHttpRequest();
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac });
      }
    }
    return t;
  })(),
  Cc = new F(''),
  hy = (() => {
    class t {
      constructor(e, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          e.forEach((r) => {
            r.manager = this;
          }),
          (this._plugins = e.slice().reverse());
      }
      addEventListener(e, i, r) {
        return this._findPluginFor(i).addEventListener(e, i, r);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(e) {
        let i = this._eventNameToPlugin.get(e);
        if (i) return i;
        if (((i = this._plugins.find((o) => o.supports(e))), !i)) throw new T(5101, !1);
        return this._eventNameToPlugin.set(e, i), i;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(N(Cc), N(me));
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac });
      }
    }
    return t;
  })(),
  Os = class {
    constructor(n) {
      this._doc = n;
    }
  },
  np = 'ng-app-id',
  py = (() => {
    class t {
      constructor(e, i, r, o = {}) {
        (this.doc = e),
          (this.appId = i),
          (this.nonce = r),
          (this.platformId = o),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = gc(o)),
          this.resetHostNodes();
      }
      addStyles(e) {
        for (let i of e) this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(e) {
        for (let i of e) this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let e = this.styleNodesInDOM;
        e && (e.forEach((i) => i.remove()), e.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(e) {
        this.hostNodes.add(e);
        for (let i of this.getAllStyles()) this.addStyleToHost(e, i);
      }
      removeHost(e) {
        this.hostNodes.delete(e);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(e) {
        for (let i of this.hostNodes) this.addStyleToHost(i, e);
      }
      onStyleRemoved(e) {
        let i = this.styleRef;
        i.get(e)?.elements?.forEach((r) => r.remove()), i.delete(e);
      }
      collectServerRenderedStyles() {
        let e = this.doc.head?.querySelectorAll(`style[${np}="${this.appId}"]`);
        if (e?.length) {
          let i = new Map();
          return (
            e.forEach((r) => {
              r.textContent != null && i.set(r.textContent, r);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(e, i) {
        let r = this.styleRef;
        if (r.has(e)) {
          let o = r.get(e);
          return (o.usage += i), o.usage;
        }
        return r.set(e, { usage: i, elements: [] }), i;
      }
      getStyleElement(e, i) {
        let r = this.styleNodesInDOM,
          o = r?.get(i);
        if (o?.parentNode === e) return r.delete(i), o.removeAttribute(np), o;
        {
          let s = this.doc.createElement('style');
          return (
            this.nonce && s.setAttribute('nonce', this.nonce),
            (s.textContent = i),
            this.platformIsServer && s.setAttribute(np, this.appId),
            e.appendChild(s),
            s
          );
        }
      }
      addStyleToHost(e, i) {
        let r = this.getStyleElement(e, i),
          o = this.styleRef,
          s = o.get(i)?.elements;
        s ? s.push(r) : o.set(i, { elements: [r], usage: 1 });
      }
      resetHostNodes() {
        let e = this.hostNodes;
        e.clear(), e.add(this.doc.head);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(N(Se), N(mh), N(_h, 8), N(xn));
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac });
      }
    }
    return t;
  })(),
  ip = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/Math/MathML',
  },
  ap = /%COMP%/g,
  my = '%COMP%',
  XI = `_nghost-${my}`,
  e2 = `_ngcontent-${my}`,
  t2 = !0,
  n2 = new F('', { providedIn: 'root', factory: () => t2 });
function i2(t) {
  return e2.replace(ap, t);
}
function r2(t) {
  return XI.replace(ap, t);
}
function gy(t, n) {
  return n.map((e) => e.replace(ap, t));
}
var wc = (() => {
    class t {
      constructor(e, i, r, o, s, a, l, c = null) {
        (this.eventManager = e),
          (this.sharedStylesHost = i),
          (this.appId = r),
          (this.removeStylesOnCompDestroy = o),
          (this.doc = s),
          (this.platformId = a),
          (this.ngZone = l),
          (this.nonce = c),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = gc(a)),
          (this.defaultRenderer = new Rs(e, s, l, this.platformIsServer));
      }
      createRenderer(e, i) {
        if (!e || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === Dn.ShadowDom &&
          (i = ee(E({}, i), { encapsulation: Dn.Emulated }));
        let r = this.getOrCreateRenderer(e, i);
        return r instanceof Dc ? r.applyToHost(e) : r instanceof Ps && r.applyStyles(), r;
      }
      getOrCreateRenderer(e, i) {
        let r = this.rendererByCompId,
          o = r.get(i.id);
        if (!o) {
          let s = this.doc,
            a = this.ngZone,
            l = this.eventManager,
            c = this.sharedStylesHost,
            f = this.removeStylesOnCompDestroy,
            p = this.platformIsServer;
          switch (i.encapsulation) {
            case Dn.Emulated:
              o = new Dc(l, c, i, this.appId, f, s, a, p);
              break;
            case Dn.ShadowDom:
              return new sp(l, c, e, i, s, a, this.nonce, p);
            default:
              o = new Ps(l, c, i, f, s, a, p);
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
          return new (i || t)(N(hy), N(py), N(mh), N(n2), N(Se), N(xn), N(me), N(_h));
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac });
      }
    }
    return t;
  })(),
  Rs = class {
    constructor(n, e, i, r) {
      (this.eventManager = n),
        (this.doc = e),
        (this.ngZone = i),
        (this.platformIsServer = r),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(n, e) {
      return e ? this.doc.createElementNS(ip[e] || e, n) : this.doc.createElement(n);
    }
    createComment(n) {
      return this.doc.createComment(n);
    }
    createText(n) {
      return this.doc.createTextNode(n);
    }
    appendChild(n, e) {
      (dy(n) ? n.content : n).appendChild(e);
    }
    insertBefore(n, e, i) {
      n && (dy(n) ? n.content : n).insertBefore(e, i);
    }
    removeChild(n, e) {
      e.remove();
    }
    selectRootElement(n, e) {
      let i = typeof n == 'string' ? this.doc.querySelector(n) : n;
      if (!i) throw new T(-5104, !1);
      return e || (i.textContent = ''), i;
    }
    parentNode(n) {
      return n.parentNode;
    }
    nextSibling(n) {
      return n.nextSibling;
    }
    setAttribute(n, e, i, r) {
      if (r) {
        e = r + ':' + e;
        let o = ip[r];
        o ? n.setAttributeNS(o, e, i) : n.setAttribute(e, i);
      } else n.setAttribute(e, i);
    }
    removeAttribute(n, e, i) {
      if (i) {
        let r = ip[i];
        r ? n.removeAttributeNS(r, e) : n.removeAttribute(`${i}:${e}`);
      } else n.removeAttribute(e);
    }
    addClass(n, e) {
      n.classList.add(e);
    }
    removeClass(n, e) {
      n.classList.remove(e);
    }
    setStyle(n, e, i, r) {
      r & (ei.DashCase | ei.Important)
        ? n.style.setProperty(e, i, r & ei.Important ? 'important' : '')
        : (n.style[e] = i);
    }
    removeStyle(n, e, i) {
      i & ei.DashCase ? n.style.removeProperty(e) : (n.style[e] = '');
    }
    setProperty(n, e, i) {
      n != null && (n[e] = i);
    }
    setValue(n, e) {
      n.nodeValue = e;
    }
    listen(n, e, i) {
      if (typeof n == 'string' && ((n = ri().getGlobalEventTarget(this.doc, n)), !n))
        throw new Error(`Unsupported event target ${n} for event ${e}`);
      return this.eventManager.addEventListener(n, e, this.decoratePreventDefault(i));
    }
    decoratePreventDefault(n) {
      return (e) => {
        if (e === '__ngUnwrap__') return n;
        (this.platformIsServer ? this.ngZone.runGuarded(() => n(e)) : n(e)) === !1 &&
          e.preventDefault();
      };
    }
  };
function dy(t) {
  return t.tagName === 'TEMPLATE' && t.content !== void 0;
}
var sp = class extends Rs {
    constructor(n, e, i, r, o, s, a, l) {
      super(n, o, s, l),
        (this.sharedStylesHost = e),
        (this.hostEl = i),
        (this.shadowRoot = i.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let c = gy(r.id, r.styles);
      for (let f of c) {
        let p = document.createElement('style');
        a && p.setAttribute('nonce', a), (p.textContent = f), this.shadowRoot.appendChild(p);
      }
    }
    nodeOrShadowRoot(n) {
      return n === this.hostEl ? this.shadowRoot : n;
    }
    appendChild(n, e) {
      return super.appendChild(this.nodeOrShadowRoot(n), e);
    }
    insertBefore(n, e, i) {
      return super.insertBefore(this.nodeOrShadowRoot(n), e, i);
    }
    removeChild(n, e) {
      return super.removeChild(null, e);
    }
    parentNode(n) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Ps = class extends Rs {
    constructor(n, e, i, r, o, s, a, l) {
      super(n, o, s, a),
        (this.sharedStylesHost = e),
        (this.removeStylesOnCompDestroy = r),
        (this.styles = l ? gy(l, i.styles) : i.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy && this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Dc = class extends Ps {
    constructor(n, e, i, r, o, s, a, l) {
      let c = r + '-' + i.id;
      super(n, e, i, o, s, a, l, c), (this.contentAttr = i2(c)), (this.hostAttr = r2(c));
    }
    applyToHost(n) {
      this.applyStyles(), this.setAttribute(n, this.hostAttr, '');
    }
    createElement(n, e) {
      let i = super.createElement(n, e);
      return super.setAttribute(i, this.contentAttr, ''), i;
    }
  },
  o2 = (() => {
    class t extends Os {
      constructor(e) {
        super(e);
      }
      supports(e) {
        return !0;
      }
      addEventListener(e, i, r) {
        return e.addEventListener(i, r, !1), () => this.removeEventListener(e, i, r);
      }
      removeEventListener(e, i, r) {
        return e.removeEventListener(i, r);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(N(Se));
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac });
      }
    }
    return t;
  })(),
  s2 = (() => {
    class t extends Os {
      constructor(e) {
        super(e), (this.delegate = y(U_, { optional: !0 }));
      }
      supports(e) {
        return this.delegate ? this.delegate.supports(e) : !1;
      }
      addEventListener(e, i, r) {
        return this.delegate.addEventListener(e, i, r);
      }
      removeEventListener(e, i, r) {
        return this.delegate.removeEventListener(e, i, r);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(N(Se));
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac });
      }
    }
    return t;
  })(),
  fy = ['alt', 'control', 'meta', 'shift'],
  a2 = {
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
  l2 = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  c2 = (() => {
    class t extends Os {
      constructor(e) {
        super(e);
      }
      supports(e) {
        return t.parseEventName(e) != null;
      }
      addEventListener(e, i, r) {
        let o = t.parseEventName(i),
          s = t.eventCallback(o.fullKey, r, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => ri().onAndCancel(e, o.domEventName, s));
      }
      static parseEventName(e) {
        let i = e.toLowerCase().split('.'),
          r = i.shift();
        if (i.length === 0 || !(r === 'keydown' || r === 'keyup')) return null;
        let o = t._normalizeKey(i.pop()),
          s = '',
          a = i.indexOf('code');
        if (
          (a > -1 && (i.splice(a, 1), (s = 'code.')),
          fy.forEach((c) => {
            let f = i.indexOf(c);
            f > -1 && (i.splice(f, 1), (s += c + '.'));
          }),
          (s += o),
          i.length != 0 || o.length === 0)
        )
          return null;
        let l = {};
        return (l.domEventName = r), (l.fullKey = s), l;
      }
      static matchEventFullKeyCode(e, i) {
        let r = a2[e.key] || e.key,
          o = '';
        return (
          i.indexOf('code.') > -1 && ((r = e.code), (o = 'code.')),
          r == null || !r
            ? !1
            : ((r = r.toLowerCase()),
              r === ' ' ? (r = 'space') : r === '.' && (r = 'dot'),
              fy.forEach((s) => {
                if (s !== r) {
                  let a = l2[s];
                  a(e) && (o += s + '.');
                }
              }),
              (o += r),
              o === i)
        );
      }
      static eventCallback(e, i, r) {
        return (o) => {
          t.matchEventFullKeyCode(o, e) && r.runGuarded(() => i(o));
        };
      }
      static _normalizeKey(e) {
        return e === 'esc' ? 'escape' : e;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(N(Se));
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac });
      }
    }
    return t;
  })();
function vy(t, n) {
  return B_(E({ rootComponent: t }, u2(n)));
}
function u2(t) {
  return {
    appProviders: [...m2, ...(t?.providers ?? [])],
    platformProviders: p2,
  };
}
function d2() {
  op.makeCurrent();
}
function f2() {
  return new Jn();
}
function h2() {
  return Sv(document), document;
}
var p2 = [
  { provide: xn, useValue: X_ },
  { provide: gh, useValue: d2, multi: !0 },
  { provide: Se, useFactory: h2, deps: [] },
];
var m2 = [
  { provide: zl, useValue: 'root' },
  { provide: Jn, useFactory: f2, deps: [] },
  { provide: Cc, useClass: o2, multi: !0, deps: [Se, me, xn] },
  { provide: Cc, useClass: c2, multi: !0, deps: [Se] },
  { provide: Cc, useClass: s2, multi: !0 },
  wc,
  py,
  hy,
  { provide: Ei, useExisting: wc },
  { provide: Do, useClass: JI, deps: [] },
  [],
];
var _y = (() => {
  class t {
    constructor(e) {
      this._doc = e;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(e) {
      this._doc.title = e || '';
    }
    static {
      this.ɵfac = function (i) {
        return new (i || t)(N(Se));
      };
    }
    static {
      this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
  }
  return t;
})();
var lp = (() => {
    class t {
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({
          token: t,
          factory: function (i) {
            let r = null;
            return i ? (r = new (i || t)()) : (r = N(g2)), r;
          },
          providedIn: 'root',
        });
      }
    }
    return t;
  })(),
  g2 = (() => {
    class t extends lp {
      constructor(e) {
        super(), (this._doc = e);
      }
      sanitize(e, i) {
        if (i == null) return null;
        switch (e) {
          case sn.NONE:
            return i;
          case sn.HTML:
            return wr(i, 'HTML') ? Nn(i) : Ch(this._doc, String(i)).toString();
          case sn.STYLE:
            return wr(i, 'Style') ? Nn(i) : i;
          case sn.SCRIPT:
            if (wr(i, 'Script')) return Nn(i);
            throw new T(5200, !1);
          case sn.URL:
            return wr(i, 'URL') ? Nn(i) : bh(String(i));
          case sn.RESOURCE_URL:
            if (wr(i, 'ResourceURL')) return Nn(i);
            throw new T(5201, !1);
          default:
            throw new T(5202, !1);
        }
      }
      bypassSecurityTrustHtml(e) {
        return Mv(e);
      }
      bypassSecurityTrustStyle(e) {
        return Iv(e);
      }
      bypassSecurityTrustScript(e) {
        return xv(e);
      }
      bypassSecurityTrustUrl(e) {
        return Nv(e);
      }
      bypassSecurityTrustResourceUrl(e) {
        return Av(e);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(N(Se));
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })();
var ie = 'primary',
  Ys = Symbol('RouteTitle'),
  hp = class {
    constructor(n) {
      this.params = n || {};
    }
    has(n) {
      return Object.prototype.hasOwnProperty.call(this.params, n);
    }
    get(n) {
      if (this.has(n)) {
        let e = this.params[n];
        return Array.isArray(e) ? e[0] : e;
      }
      return null;
    }
    getAll(n) {
      if (this.has(n)) {
        let e = this.params[n];
        return Array.isArray(e) ? e : [e];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function No(t) {
  return new hp(t);
}
function v2(t, n, e) {
  let i = e.path.split('/');
  if (i.length > t.length || (e.pathMatch === 'full' && (n.hasChildren() || i.length < t.length)))
    return null;
  let r = {};
  for (let o = 0; o < i.length; o++) {
    let s = i[o],
      a = t[o];
    if (s[0] === ':') r[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: t.slice(0, i.length), posParams: r };
}
function _2(t, n) {
  if (t.length !== n.length) return !1;
  for (let e = 0; e < t.length; ++e) if (!Ln(t[e], n[e])) return !1;
  return !0;
}
function Ln(t, n) {
  let e = t ? pp(t) : void 0,
    i = n ? pp(n) : void 0;
  if (!e || !i || e.length != i.length) return !1;
  let r;
  for (let o = 0; o < e.length; o++) if (((r = e[o]), !My(t[r], n[r]))) return !1;
  return !0;
}
function pp(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function My(t, n) {
  if (Array.isArray(t) && Array.isArray(n)) {
    if (t.length !== n.length) return !1;
    let e = [...t].sort(),
      i = [...n].sort();
    return e.every((r, o) => i[o] === r);
  } else return t === n;
}
function Iy(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function Vi(t) {
  return vn(t) ? t : Sr(t) ? Me(Promise.resolve(t)) : L(t);
}
var y2 = { exact: Ny, subset: Ay },
  xy = { exact: b2, subset: C2, ignored: () => !0 };
function by(t, n, e) {
  return (
    y2[e.paths](t.root, n.root, e.matrixParams) &&
    xy[e.queryParams](t.queryParams, n.queryParams) &&
    !(e.fragment === 'exact' && t.fragment !== n.fragment)
  );
}
function b2(t, n) {
  return Ln(t, n);
}
function Ny(t, n, e) {
  if (
    !xr(t.segments, n.segments) ||
    !Tc(t.segments, n.segments, e) ||
    t.numberOfChildren !== n.numberOfChildren
  )
    return !1;
  for (let i in n.children) if (!t.children[i] || !Ny(t.children[i], n.children[i], e)) return !1;
  return !0;
}
function C2(t, n) {
  return (
    Object.keys(n).length <= Object.keys(t).length && Object.keys(n).every((e) => My(t[e], n[e]))
  );
}
function Ay(t, n, e) {
  return Oy(t, n, n.segments, e);
}
function Oy(t, n, e, i) {
  if (t.segments.length > e.length) {
    let r = t.segments.slice(0, e.length);
    return !(!xr(r, e) || n.hasChildren() || !Tc(r, e, i));
  } else if (t.segments.length === e.length) {
    if (!xr(t.segments, e) || !Tc(t.segments, e, i)) return !1;
    for (let r in n.children) if (!t.children[r] || !Ay(t.children[r], n.children[r], i)) return !1;
    return !0;
  } else {
    let r = e.slice(0, t.segments.length),
      o = e.slice(t.segments.length);
    return !xr(t.segments, r) || !Tc(t.segments, r, i) || !t.children[ie]
      ? !1
      : Oy(t.children[ie], n, o, i);
  }
}
function Tc(t, n, e) {
  return n.every((i, r) => xy[e](t[r].parameters, i.parameters));
}
var ai = class {
    constructor(n = new ge([], {}), e = {}, i = null) {
      (this.root = n), (this.queryParams = e), (this.fragment = i);
    }
    get queryParamMap() {
      return (this._queryParamMap ??= No(this.queryParams)), this._queryParamMap;
    }
    toString() {
      return S2.serialize(this);
    }
  },
  ge = class {
    constructor(n, e) {
      (this.segments = n),
        (this.children = e),
        (this.parent = null),
        Object.values(e).forEach((i) => (i.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Mc(this);
    }
  },
  Ir = class {
    constructor(n, e) {
      (this.path = n), (this.parameters = e);
    }
    get parameterMap() {
      return (this._parameterMap ??= No(this.parameters)), this._parameterMap;
    }
    toString() {
      return Py(this);
    }
  };
function w2(t, n) {
  return xr(t, n) && t.every((e, i) => Ln(e.parameters, n[i].parameters));
}
function xr(t, n) {
  return t.length !== n.length ? !1 : t.every((e, i) => e.path === n[i].path);
}
function D2(t, n) {
  let e = [];
  return (
    Object.entries(t.children).forEach(([i, r]) => {
      i === ie && (e = e.concat(n(r, i)));
    }),
    Object.entries(t.children).forEach(([i, r]) => {
      i !== ie && (e = e.concat(n(r, i)));
    }),
    e
  );
}
var Bp = (() => {
    class t {
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({
          token: t,
          factory: () => new Us(),
          providedIn: 'root',
        });
      }
    }
    return t;
  })(),
  Us = class {
    parse(n) {
      let e = new gp(n);
      return new ai(e.parseRootSegment(), e.parseQueryParams(), e.parseFragment());
    }
    serialize(n) {
      let e = `/${Fs(n.root, !0)}`,
        i = M2(n.queryParams),
        r = typeof n.fragment == 'string' ? `#${E2(n.fragment)}` : '';
      return `${e}${i}${r}`;
    }
  },
  S2 = new Us();
function Mc(t) {
  return t.segments.map((n) => Py(n)).join('/');
}
function Fs(t, n) {
  if (!t.hasChildren()) return Mc(t);
  if (n) {
    let e = t.children[ie] ? Fs(t.children[ie], !1) : '',
      i = [];
    return (
      Object.entries(t.children).forEach(([r, o]) => {
        r !== ie && i.push(`${r}:${Fs(o, !1)}`);
      }),
      i.length > 0 ? `${e}(${i.join('//')})` : e
    );
  } else {
    let e = D2(t, (i, r) => (r === ie ? [Fs(t.children[ie], !1)] : [`${r}:${Fs(i, !1)}`]));
    return Object.keys(t.children).length === 1 && t.children[ie] != null
      ? `${Mc(t)}/${e[0]}`
      : `${Mc(t)}/(${e.join('//')})`;
  }
}
function Ry(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',');
}
function Sc(t) {
  return Ry(t).replace(/%3B/gi, ';');
}
function E2(t) {
  return encodeURI(t);
}
function mp(t) {
  return Ry(t).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}
function Ic(t) {
  return decodeURIComponent(t);
}
function Cy(t) {
  return Ic(t.replace(/\+/g, '%20'));
}
function Py(t) {
  return `${mp(t.path)}${T2(t.parameters)}`;
}
function T2(t) {
  return Object.entries(t)
    .map(([n, e]) => `;${mp(n)}=${mp(e)}`)
    .join('');
}
function M2(t) {
  let n = Object.entries(t)
    .map(([e, i]) =>
      Array.isArray(i) ? i.map((r) => `${Sc(e)}=${Sc(r)}`).join('&') : `${Sc(e)}=${Sc(i)}`,
    )
    .filter((e) => e);
  return n.length ? `?${n.join('&')}` : '';
}
var I2 = /^[^\/()?;#]+/;
function cp(t) {
  let n = t.match(I2);
  return n ? n[0] : '';
}
var x2 = /^[^\/()?;=#]+/;
function N2(t) {
  let n = t.match(x2);
  return n ? n[0] : '';
}
var A2 = /^[^=?&#]+/;
function O2(t) {
  let n = t.match(A2);
  return n ? n[0] : '';
}
var R2 = /^[^&#]+/;
function P2(t) {
  let n = t.match(R2);
  return n ? n[0] : '';
}
var gp = class {
  constructor(n) {
    (this.url = n), (this.remaining = n);
  }
  parseRootSegment() {
    return (
      this.consumeOptional('/'),
      this.remaining === '' || this.peekStartsWith('?') || this.peekStartsWith('#')
        ? new ge([], {})
        : new ge([], this.parseChildren())
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
    let e = {};
    this.peekStartsWith('/(') && (this.capture('/'), (e = this.parseParens(!0)));
    let i = {};
    return (
      this.peekStartsWith('(') && (i = this.parseParens(!1)),
      (n.length > 0 || Object.keys(e).length > 0) && (i[ie] = new ge(n, e)),
      i
    );
  }
  parseSegment() {
    let n = cp(this.remaining);
    if (n === '' && this.peekStartsWith(';')) throw new T(4009, !1);
    return this.capture(n), new Ir(Ic(n), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let n = {};
    for (; this.consumeOptional(';'); ) this.parseParam(n);
    return n;
  }
  parseParam(n) {
    let e = N2(this.remaining);
    if (!e) return;
    this.capture(e);
    let i = '';
    if (this.consumeOptional('=')) {
      let r = cp(this.remaining);
      r && ((i = r), this.capture(i));
    }
    n[Ic(e)] = Ic(i);
  }
  parseQueryParam(n) {
    let e = O2(this.remaining);
    if (!e) return;
    this.capture(e);
    let i = '';
    if (this.consumeOptional('=')) {
      let s = P2(this.remaining);
      s && ((i = s), this.capture(i));
    }
    let r = Cy(e),
      o = Cy(i);
    if (n.hasOwnProperty(r)) {
      let s = n[r];
      Array.isArray(s) || ((s = [s]), (n[r] = s)), s.push(o);
    } else n[r] = o;
  }
  parseParens(n) {
    let e = {};
    for (this.capture('('); !this.consumeOptional(')') && this.remaining.length > 0; ) {
      let i = cp(this.remaining),
        r = this.remaining[i.length];
      if (r !== '/' && r !== ')' && r !== ';') throw new T(4010, !1);
      let o;
      i.indexOf(':') > -1
        ? ((o = i.slice(0, i.indexOf(':'))), this.capture(o), this.capture(':'))
        : n && (o = ie);
      let s = this.parseChildren();
      (e[o] = Object.keys(s).length === 1 ? s[ie] : new ge([], s)), this.consumeOptional('//');
    }
    return e;
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
    if (!this.consumeOptional(n)) throw new T(4011, !1);
  }
};
function Fy(t) {
  return t.segments.length > 0 ? new ge([], { [ie]: t }) : t;
}
function ky(t) {
  let n = {};
  for (let [i, r] of Object.entries(t.children)) {
    let o = ky(r);
    if (i === ie && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) n[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (n[i] = o);
  }
  let e = new ge(t.segments, n);
  return F2(e);
}
function F2(t) {
  if (t.numberOfChildren === 1 && t.children[ie]) {
    let n = t.children[ie];
    return new ge(t.segments.concat(n.segments), n.children);
  }
  return t;
}
function $s(t) {
  return t instanceof ai;
}
function k2(t, n, e = null, i = null) {
  let r = Ly(t);
  return Vy(r, n, e, i);
}
function Ly(t) {
  let n;
  function e(o) {
    let s = {};
    for (let l of o.children) {
      let c = e(l);
      s[l.outlet] = c;
    }
    let a = new ge(o.url, s);
    return o === t && (n = a), a;
  }
  let i = e(t.root),
    r = Fy(i);
  return n ?? r;
}
function Vy(t, n, e, i) {
  let r = t;
  for (; r.parent; ) r = r.parent;
  if (n.length === 0) return up(r, r, r, e, i);
  let o = L2(n);
  if (o.toRoot()) return up(r, r, new ge([], {}), e, i);
  let s = V2(o, r, t),
    a = s.processChildren
      ? Vs(s.segmentGroup, s.index, o.commands)
      : By(s.segmentGroup, s.index, o.commands);
  return up(r, s.segmentGroup, a, e, i);
}
function xc(t) {
  return typeof t == 'object' && t != null && !t.outlets && !t.segmentPath;
}
function Hs(t) {
  return typeof t == 'object' && t != null && t.outlets;
}
function up(t, n, e, i, r) {
  let o = {};
  i &&
    Object.entries(i).forEach(([l, c]) => {
      o[l] = Array.isArray(c) ? c.map((f) => `${f}`) : `${c}`;
    });
  let s;
  t === n ? (s = e) : (s = jy(t, n, e));
  let a = Fy(ky(s));
  return new ai(a, o, r);
}
function jy(t, n, e) {
  let i = {};
  return (
    Object.entries(t.children).forEach(([r, o]) => {
      o === n ? (i[r] = e) : (i[r] = jy(o, n, e));
    }),
    new ge(t.segments, i)
  );
}
var Nc = class {
  constructor(n, e, i) {
    if (
      ((this.isAbsolute = n),
      (this.numberOfDoubleDots = e),
      (this.commands = i),
      n && i.length > 0 && xc(i[0]))
    )
      throw new T(4003, !1);
    let r = i.find(Hs);
    if (r && r !== Iy(i)) throw new T(4004, !1);
  }
  toRoot() {
    return this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/';
  }
};
function L2(t) {
  if (typeof t[0] == 'string' && t.length === 1 && t[0] === '/') return new Nc(!0, 0, t);
  let n = 0,
    e = !1,
    i = t.reduce((r, o, s) => {
      if (typeof o == 'object' && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([l, c]) => {
              a[l] = typeof c == 'string' ? c.split('/') : c;
            }),
            [...r, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...r, o.segmentPath];
      }
      return typeof o != 'string'
        ? [...r, o]
        : s === 0
          ? (o.split('/').forEach((a, l) => {
              (l == 0 && a === '.') ||
                (l == 0 && a === '' ? (e = !0) : a === '..' ? n++ : a != '' && r.push(a));
            }),
            r)
          : [...r, o];
    }, []);
  return new Nc(e, n, i);
}
var Mo = class {
  constructor(n, e, i) {
    (this.segmentGroup = n), (this.processChildren = e), (this.index = i);
  }
};
function V2(t, n, e) {
  if (t.isAbsolute) return new Mo(n, !0, 0);
  if (!e) return new Mo(n, !1, NaN);
  if (e.parent === null) return new Mo(e, !0, 0);
  let i = xc(t.commands[0]) ? 0 : 1,
    r = e.segments.length - 1 + i;
  return j2(e, r, t.numberOfDoubleDots);
}
function j2(t, n, e) {
  let i = t,
    r = n,
    o = e;
  for (; o > r; ) {
    if (((o -= r), (i = i.parent), !i)) throw new T(4005, !1);
    r = i.segments.length;
  }
  return new Mo(i, !1, r - o);
}
function B2(t) {
  return Hs(t[0]) ? t[0].outlets : { [ie]: t };
}
function By(t, n, e) {
  if (((t ??= new ge([], {})), t.segments.length === 0 && t.hasChildren())) return Vs(t, n, e);
  let i = U2(t, n, e),
    r = e.slice(i.commandIndex);
  if (i.match && i.pathIndex < t.segments.length) {
    let o = new ge(t.segments.slice(0, i.pathIndex), {});
    return (o.children[ie] = new ge(t.segments.slice(i.pathIndex), t.children)), Vs(o, 0, r);
  } else
    return i.match && r.length === 0
      ? new ge(t.segments, {})
      : i.match && !t.hasChildren()
        ? vp(t, n, e)
        : i.match
          ? Vs(t, 0, r)
          : vp(t, n, e);
}
function Vs(t, n, e) {
  if (e.length === 0) return new ge(t.segments, {});
  {
    let i = B2(e),
      r = {};
    if (
      Object.keys(i).some((o) => o !== ie) &&
      t.children[ie] &&
      t.numberOfChildren === 1 &&
      t.children[ie].segments.length === 0
    ) {
      let o = Vs(t.children[ie], n, e);
      return new ge(t.segments, o.children);
    }
    return (
      Object.entries(i).forEach(([o, s]) => {
        typeof s == 'string' && (s = [s]), s !== null && (r[o] = By(t.children[o], n, s));
      }),
      Object.entries(t.children).forEach(([o, s]) => {
        i[o] === void 0 && (r[o] = s);
      }),
      new ge(t.segments, r)
    );
  }
}
function U2(t, n, e) {
  let i = 0,
    r = n,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; r < t.segments.length; ) {
    if (i >= e.length) return o;
    let s = t.segments[r],
      a = e[i];
    if (Hs(a)) break;
    let l = `${a}`,
      c = i < e.length - 1 ? e[i + 1] : null;
    if (r > 0 && l === void 0) break;
    if (l && c && typeof c == 'object' && c.outlets === void 0) {
      if (!Dy(l, c, s)) return o;
      i += 2;
    } else {
      if (!Dy(l, {}, s)) return o;
      i++;
    }
    r++;
  }
  return { match: !0, pathIndex: r, commandIndex: i };
}
function vp(t, n, e) {
  let i = t.segments.slice(0, n),
    r = 0;
  for (; r < e.length; ) {
    let o = e[r];
    if (Hs(o)) {
      let l = $2(o.outlets);
      return new ge(i, l);
    }
    if (r === 0 && xc(e[0])) {
      let l = t.segments[n];
      i.push(new Ir(l.path, wy(e[0]))), r++;
      continue;
    }
    let s = Hs(o) ? o.outlets[ie] : `${o}`,
      a = r < e.length - 1 ? e[r + 1] : null;
    s && a && xc(a) ? (i.push(new Ir(s, wy(a))), (r += 2)) : (i.push(new Ir(s, {})), r++);
  }
  return new ge(i, {});
}
function $2(t) {
  let n = {};
  return (
    Object.entries(t).forEach(([e, i]) => {
      typeof i == 'string' && (i = [i]), i !== null && (n[e] = vp(new ge([], {}), 0, i));
    }),
    n
  );
}
function wy(t) {
  let n = {};
  return Object.entries(t).forEach(([e, i]) => (n[e] = `${i}`)), n;
}
function Dy(t, n, e) {
  return t == e.path && Ln(n, e.parameters);
}
var js = 'imperative',
  st = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = 'NavigationStart'),
      (t[(t.NavigationEnd = 1)] = 'NavigationEnd'),
      (t[(t.NavigationCancel = 2)] = 'NavigationCancel'),
      (t[(t.NavigationError = 3)] = 'NavigationError'),
      (t[(t.RoutesRecognized = 4)] = 'RoutesRecognized'),
      (t[(t.ResolveStart = 5)] = 'ResolveStart'),
      (t[(t.ResolveEnd = 6)] = 'ResolveEnd'),
      (t[(t.GuardsCheckStart = 7)] = 'GuardsCheckStart'),
      (t[(t.GuardsCheckEnd = 8)] = 'GuardsCheckEnd'),
      (t[(t.RouteConfigLoadStart = 9)] = 'RouteConfigLoadStart'),
      (t[(t.RouteConfigLoadEnd = 10)] = 'RouteConfigLoadEnd'),
      (t[(t.ChildActivationStart = 11)] = 'ChildActivationStart'),
      (t[(t.ChildActivationEnd = 12)] = 'ChildActivationEnd'),
      (t[(t.ActivationStart = 13)] = 'ActivationStart'),
      (t[(t.ActivationEnd = 14)] = 'ActivationEnd'),
      (t[(t.Scroll = 15)] = 'Scroll'),
      (t[(t.NavigationSkipped = 16)] = 'NavigationSkipped'),
      t
    );
  })(st || {}),
  zt = class {
    constructor(n, e) {
      (this.id = n), (this.url = e);
    }
  },
  Gs = class extends zt {
    constructor(n, e, i = 'imperative', r = null) {
      super(n, e),
        (this.type = st.NavigationStart),
        (this.navigationTrigger = i),
        (this.restoredState = r);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Nr = class extends zt {
    constructor(n, e, i) {
      super(n, e), (this.urlAfterRedirects = i), (this.type = st.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Ft = (function (t) {
    return (
      (t[(t.Redirect = 0)] = 'Redirect'),
      (t[(t.SupersededByNewNavigation = 1)] = 'SupersededByNewNavigation'),
      (t[(t.NoDataFromResolver = 2)] = 'NoDataFromResolver'),
      (t[(t.GuardRejected = 3)] = 'GuardRejected'),
      t
    );
  })(Ft || {}),
  _p = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = 'IgnoredSameUrlNavigation'),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] = 'IgnoredByUrlHandlingStrategy'),
      t
    );
  })(_p || {}),
  si = class extends zt {
    constructor(n, e, i, r) {
      super(n, e), (this.reason = i), (this.code = r), (this.type = st.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Ar = class extends zt {
    constructor(n, e, i, r) {
      super(n, e), (this.reason = i), (this.code = r), (this.type = st.NavigationSkipped);
    }
  },
  zs = class extends zt {
    constructor(n, e, i, r) {
      super(n, e), (this.error = i), (this.target = r), (this.type = st.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Ac = class extends zt {
    constructor(n, e, i, r) {
      super(n, e),
        (this.urlAfterRedirects = i),
        (this.state = r),
        (this.type = st.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  yp = class extends zt {
    constructor(n, e, i, r) {
      super(n, e),
        (this.urlAfterRedirects = i),
        (this.state = r),
        (this.type = st.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  bp = class extends zt {
    constructor(n, e, i, r, o) {
      super(n, e),
        (this.urlAfterRedirects = i),
        (this.state = r),
        (this.shouldActivate = o),
        (this.type = st.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  Cp = class extends zt {
    constructor(n, e, i, r) {
      super(n, e), (this.urlAfterRedirects = i), (this.state = r), (this.type = st.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  wp = class extends zt {
    constructor(n, e, i, r) {
      super(n, e), (this.urlAfterRedirects = i), (this.state = r), (this.type = st.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Dp = class {
    constructor(n) {
      (this.route = n), (this.type = st.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Sp = class {
    constructor(n) {
      (this.route = n), (this.type = st.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Ep = class {
    constructor(n) {
      (this.snapshot = n), (this.type = st.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  Tp = class {
    constructor(n) {
      (this.snapshot = n), (this.type = st.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  Mp = class {
    constructor(n) {
      (this.snapshot = n), (this.type = st.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  Ip = class {
    constructor(n) {
      (this.snapshot = n), (this.type = st.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  };
var Ws = class {},
  Ao = class {
    constructor(n, e) {
      (this.url = n), (this.navigationBehaviorOptions = e);
    }
  };
function H2(t, n) {
  return (
    t.providers && !t._injector && (t._injector = jh(t.providers, n, `Route: ${t.path}`)),
    t._injector ?? n
  );
}
function dn(t) {
  return t.outlet || ie;
}
function G2(t, n) {
  let e = t.filter((i) => dn(i) === n);
  return e.push(...t.filter((i) => dn(i) !== n)), e;
}
function Js(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let n = t.parent; n; n = n.parent) {
    let e = n.routeConfig;
    if (e?._loadedInjector) return e._loadedInjector;
    if (e?._injector) return e._injector;
  }
  return null;
}
var xp = class {
    get injector() {
      return Js(this.route?.snapshot) ?? this.rootInjector;
    }
    set injector(n) {}
    constructor(n) {
      (this.rootInjector = n),
        (this.outlet = null),
        (this.route = null),
        (this.children = new Vc(this.rootInjector)),
        (this.attachRef = null);
    }
  },
  Vc = (() => {
    class t {
      constructor(e) {
        (this.rootInjector = e), (this.contexts = new Map());
      }
      onChildOutletCreated(e, i) {
        let r = this.getOrCreateContext(e);
        (r.outlet = i), this.contexts.set(e, r);
      }
      onChildOutletDestroyed(e) {
        let i = this.getContext(e);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let e = this.contexts;
        return (this.contexts = new Map()), e;
      }
      onOutletReAttached(e) {
        this.contexts = e;
      }
      getOrCreateContext(e) {
        let i = this.getContext(e);
        return i || ((i = new xp(this.rootInjector)), this.contexts.set(e, i)), i;
      }
      getContext(e) {
        return this.contexts.get(e) || null;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(N(vt));
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })(),
  Oc = class {
    constructor(n) {
      this._root = n;
    }
    get root() {
      return this._root.value;
    }
    parent(n) {
      let e = this.pathFromRoot(n);
      return e.length > 1 ? e[e.length - 2] : null;
    }
    children(n) {
      let e = Np(n, this._root);
      return e ? e.children.map((i) => i.value) : [];
    }
    firstChild(n) {
      let e = Np(n, this._root);
      return e && e.children.length > 0 ? e.children[0].value : null;
    }
    siblings(n) {
      let e = Ap(n, this._root);
      return e.length < 2
        ? []
        : e[e.length - 2].children.map((r) => r.value).filter((r) => r !== n);
    }
    pathFromRoot(n) {
      return Ap(n, this._root).map((e) => e.value);
    }
  };
function Np(t, n) {
  if (t === n.value) return n;
  for (let e of n.children) {
    let i = Np(t, e);
    if (i) return i;
  }
  return null;
}
function Ap(t, n) {
  if (t === n.value) return [n];
  for (let e of n.children) {
    let i = Ap(t, e);
    if (i.length) return i.unshift(n), i;
  }
  return [];
}
var Pt = class {
  constructor(n, e) {
    (this.value = n), (this.children = e);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function To(t) {
  let n = {};
  return t && t.children.forEach((e) => (n[e.value.outlet] = e)), n;
}
var Rc = class extends Oc {
  constructor(n, e) {
    super(n), (this.snapshot = e), Up(this, n);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Uy(t) {
  let n = z2(t),
    e = new Oe([new Ir('', {})]),
    i = new Oe({}),
    r = new Oe({}),
    o = new Oe({}),
    s = new Oe(''),
    a = new Oo(e, i, o, s, r, ie, t, n.root);
  return (a.snapshot = n.root), new Rc(new Pt(a, []), n);
}
function z2(t) {
  let n = {},
    e = {},
    i = {},
    r = '',
    o = new Io([], n, i, r, e, ie, t, null, {});
  return new Fc('', new Pt(o, []));
}
var Oo = class {
  constructor(n, e, i, r, o, s, a, l) {
    (this.urlSubject = n),
      (this.paramsSubject = e),
      (this.queryParamsSubject = i),
      (this.fragmentSubject = r),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = l),
      (this.title = this.dataSubject?.pipe(z((c) => c[Ys])) ?? L(void 0)),
      (this.url = n),
      (this.params = e),
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
    return (this._paramMap ??= this.params.pipe(z((n) => No(n)))), this._paramMap;
  }
  get queryParamMap() {
    return (this._queryParamMap ??= this.queryParams.pipe(z((n) => No(n)))), this._queryParamMap;
  }
  toString() {
    return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
  }
};
function Pc(t, n, e = 'emptyOnly') {
  let i,
    { routeConfig: r } = t;
  return (
    n !== null &&
    (e === 'always' || r?.path === '' || (!n.component && !n.routeConfig?.loadComponent))
      ? (i = {
          params: E(E({}, n.params), t.params),
          data: E(E({}, n.data), t.data),
          resolve: E(E(E(E({}, t.data), n.data), r?.data), t._resolvedData),
        })
      : (i = {
          params: E({}, t.params),
          data: E({}, t.data),
          resolve: E(E({}, t.data), t._resolvedData ?? {}),
        }),
    r && Hy(r) && (i.resolve[Ys] = r.title),
    i
  );
}
var Io = class {
    get title() {
      return this.data?.[Ys];
    }
    constructor(n, e, i, r, o, s, a, l, c) {
      (this.url = n),
        (this.params = e),
        (this.queryParams = i),
        (this.fragment = r),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = l),
        (this._resolve = c);
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
      return (this._paramMap ??= No(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (this._queryParamMap ??= No(this.queryParams)), this._queryParamMap;
    }
    toString() {
      let n = this.url.map((i) => i.toString()).join('/'),
        e = this.routeConfig ? this.routeConfig.path : '';
      return `Route(url:'${n}', path:'${e}')`;
    }
  },
  Fc = class extends Oc {
    constructor(n, e) {
      super(e), (this.url = n), Up(this, e);
    }
    toString() {
      return $y(this._root);
    }
  };
function Up(t, n) {
  (n.value._routerState = t), n.children.forEach((e) => Up(t, e));
}
function $y(t) {
  let n = t.children.length > 0 ? ` { ${t.children.map($y).join(', ')} } ` : '';
  return `${t.value}${n}`;
}
function dp(t) {
  if (t.snapshot) {
    let n = t.snapshot,
      e = t._futureSnapshot;
    (t.snapshot = e),
      Ln(n.queryParams, e.queryParams) || t.queryParamsSubject.next(e.queryParams),
      n.fragment !== e.fragment && t.fragmentSubject.next(e.fragment),
      Ln(n.params, e.params) || t.paramsSubject.next(e.params),
      _2(n.url, e.url) || t.urlSubject.next(e.url),
      Ln(n.data, e.data) || t.dataSubject.next(e.data);
  } else (t.snapshot = t._futureSnapshot), t.dataSubject.next(t._futureSnapshot.data);
}
function Op(t, n) {
  let e = Ln(t.params, n.params) && w2(t.url, n.url),
    i = !t.parent != !n.parent;
  return e && !i && (!t.parent || Op(t.parent, n.parent));
}
function Hy(t) {
  return typeof t.title == 'string' || t.title === null;
}
var $p = (() => {
    class t {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = ie),
          (this.activateEvents = new Y()),
          (this.deactivateEvents = new Y()),
          (this.attachEvents = new Y()),
          (this.detachEvents = new Y()),
          (this.parentContexts = y(Vc)),
          (this.location = y(an)),
          (this.changeDetector = y(cn)),
          (this.inputBinder = y(Hp, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(e) {
        if (e.name) {
          let { firstChange: i, previousValue: r } = e.name;
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
      isTrackedInParentContexts(e) {
        return this.parentContexts.getContext(e)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if ((this.parentContexts.onChildOutletCreated(this.name, this), this.activated)) return;
        let e = this.parentContexts.getContext(this.name);
        e?.route &&
          (e.attachRef
            ? this.attach(e.attachRef, e.route)
            : this.activateWith(e.route, e.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new T(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new T(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new T(4012, !1);
        this.location.detach();
        let e = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(e.instance),
          e
        );
      }
      attach(e, i) {
        (this.activated = e),
          (this._activatedRoute = i),
          this.location.insert(e.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(e.instance);
      }
      deactivate() {
        if (this.activated) {
          let e = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(e);
        }
      }
      activateWith(e, i) {
        if (this.isActivated) throw new T(4013, !1);
        this._activatedRoute = e;
        let r = this.location,
          s = e.snapshot.component,
          a = this.parentContexts.getOrCreateContext(this.name).children,
          l = new Rp(e, a, r.injector);
        (this.activated = r.createComponent(s, {
          index: r.length,
          injector: l,
          environmentInjector: i,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵdir = le({
          type: t,
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
          features: [on],
        });
      }
    }
    return t;
  })(),
  Rp = class t {
    __ngOutletInjector(n) {
      return new t(this.route, this.childContexts, n);
    }
    constructor(n, e, i) {
      (this.route = n), (this.childContexts = e), (this.parent = i);
    }
    get(n, e) {
      return n === Oo ? this.route : n === Vc ? this.childContexts : this.parent.get(n, e);
    }
  },
  Hp = new F('');
function W2(t, n, e) {
  let i = qs(t, n._root, e ? e._root : void 0);
  return new Rc(i, n);
}
function qs(t, n, e) {
  if (e && t.shouldReuseRoute(n.value, e.value.snapshot)) {
    let i = e.value;
    i._futureSnapshot = n.value;
    let r = q2(t, n, e);
    return new Pt(i, r);
  } else {
    if (t.shouldAttach(n.value)) {
      let o = t.retrieve(n.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = n.value), (s.children = n.children.map((a) => qs(t, a))), s
        );
      }
    }
    let i = Q2(n.value),
      r = n.children.map((o) => qs(t, o));
    return new Pt(i, r);
  }
}
function q2(t, n, e) {
  return n.children.map((i) => {
    for (let r of e.children) if (t.shouldReuseRoute(i.value, r.value.snapshot)) return qs(t, i, r);
    return qs(t, i);
  });
}
function Q2(t) {
  return new Oo(
    new Oe(t.url),
    new Oe(t.params),
    new Oe(t.queryParams),
    new Oe(t.fragment),
    new Oe(t.data),
    t.outlet,
    t.component,
    t,
  );
}
var Qs = class {
    constructor(n, e) {
      (this.redirectTo = n), (this.navigationBehaviorOptions = e);
    }
  },
  Gy = 'ngNavigationCancelingError';
function kc(t, n) {
  let { redirectTo: e, navigationBehaviorOptions: i } = $s(n)
      ? { redirectTo: n, navigationBehaviorOptions: void 0 }
      : n,
    r = zy(!1, Ft.Redirect);
  return (r.url = e), (r.navigationBehaviorOptions = i), r;
}
function zy(t, n) {
  let e = new Error(`NavigationCancelingError: ${t || ''}`);
  return (e[Gy] = !0), (e.cancellationCode = n), e;
}
function Z2(t) {
  return Wy(t) && $s(t.url);
}
function Wy(t) {
  return !!t && t[Gy];
}
var K2 = (t, n, e, i) =>
    z((r) => (new Pp(n, r.targetRouterState, r.currentRouterState, e, i).activate(t), r)),
  Pp = class {
    constructor(n, e, i, r, o) {
      (this.routeReuseStrategy = n),
        (this.futureState = e),
        (this.currState = i),
        (this.forwardEvent = r),
        (this.inputBindingEnabled = o);
    }
    activate(n) {
      let e = this.futureState._root,
        i = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(e, i, n),
        dp(this.futureState.root),
        this.activateChildRoutes(e, i, n);
    }
    deactivateChildRoutes(n, e, i) {
      let r = To(e);
      n.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, r[s], i), delete r[s];
      }),
        Object.values(r).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, i);
        });
    }
    deactivateRoutes(n, e, i) {
      let r = n.value,
        o = e ? e.value : null;
      if (r === o)
        if (r.component) {
          let s = i.getContext(r.outlet);
          s && this.deactivateChildRoutes(n, e, s.children);
        } else this.deactivateChildRoutes(n, e, i);
      else o && this.deactivateRouteAndItsChildren(e, i);
    }
    deactivateRouteAndItsChildren(n, e) {
      n.value.component && this.routeReuseStrategy.shouldDetach(n.value.snapshot)
        ? this.detachAndStoreRouteSubtree(n, e)
        : this.deactivateRouteAndOutlet(n, e);
    }
    detachAndStoreRouteSubtree(n, e) {
      let i = e.getContext(n.value.outlet),
        r = i && n.value.component ? i.children : e,
        o = To(n);
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
    deactivateRouteAndOutlet(n, e) {
      let i = e.getContext(n.value.outlet),
        r = i && n.value.component ? i.children : e,
        o = To(n);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, r);
      i &&
        (i.outlet && (i.outlet.deactivate(), i.children.onOutletDeactivated()),
        (i.attachRef = null),
        (i.route = null));
    }
    activateChildRoutes(n, e, i) {
      let r = To(e);
      n.children.forEach((o) => {
        this.activateRoutes(o, r[o.value.outlet], i), this.forwardEvent(new Ip(o.value.snapshot));
      }),
        n.children.length && this.forwardEvent(new Tp(n.value.snapshot));
    }
    activateRoutes(n, e, i) {
      let r = n.value,
        o = e ? e.value : null;
      if ((dp(r), r === o))
        if (r.component) {
          let s = i.getOrCreateContext(r.outlet);
          this.activateChildRoutes(n, e, s.children);
        } else this.activateChildRoutes(n, e, i);
      else if (r.component) {
        let s = i.getOrCreateContext(r.outlet);
        if (this.routeReuseStrategy.shouldAttach(r.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(r.snapshot);
          this.routeReuseStrategy.store(r.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            dp(a.route.value),
            this.activateChildRoutes(n, null, s.children);
        } else
          (s.attachRef = null),
            (s.route = r),
            s.outlet && s.outlet.activateWith(r, s.injector),
            this.activateChildRoutes(n, null, s.children);
      } else this.activateChildRoutes(n, null, i);
    }
  },
  Lc = class {
    constructor(n) {
      (this.path = n), (this.route = this.path[this.path.length - 1]);
    }
  },
  xo = class {
    constructor(n, e) {
      (this.component = n), (this.route = e);
    }
  };
function Y2(t, n, e) {
  let i = t._root,
    r = n ? n._root : null;
  return ks(i, r, e, [i.value]);
}
function J2(t) {
  let n = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !n || n.length === 0 ? null : { node: t, guards: n };
}
function Po(t, n) {
  let e = Symbol(),
    i = n.get(t, e);
  return i === e ? (typeof t == 'function' && !f1(t) ? t : n.get(t)) : i;
}
function ks(t, n, e, i, r = { canDeactivateChecks: [], canActivateChecks: [] }) {
  let o = To(n);
  return (
    t.children.forEach((s) => {
      X2(s, o[s.value.outlet], e, i.concat([s.value]), r), delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => Bs(a, e.getContext(s), r)),
    r
  );
}
function X2(t, n, e, i, r = { canDeactivateChecks: [], canActivateChecks: [] }) {
  let o = t.value,
    s = n ? n.value : null,
    a = e ? e.getContext(t.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let l = ex(s, o, o.routeConfig.runGuardsAndResolvers);
    l
      ? r.canActivateChecks.push(new Lc(i))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? ks(t, n, a ? a.children : null, i, r) : ks(t, n, e, i, r),
      l &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        r.canDeactivateChecks.push(new xo(a.outlet.component, s));
  } else
    s && Bs(n, a, r),
      r.canActivateChecks.push(new Lc(i)),
      o.component ? ks(t, null, a ? a.children : null, i, r) : ks(t, null, e, i, r);
  return r;
}
function ex(t, n, e) {
  if (typeof e == 'function') return e(t, n);
  switch (e) {
    case 'pathParamsChange':
      return !xr(t.url, n.url);
    case 'pathParamsOrQueryParamsChange':
      return !xr(t.url, n.url) || !Ln(t.queryParams, n.queryParams);
    case 'always':
      return !0;
    case 'paramsOrQueryParamsChange':
      return !Op(t, n) || !Ln(t.queryParams, n.queryParams);
    case 'paramsChange':
    default:
      return !Op(t, n);
  }
}
function Bs(t, n, e) {
  let i = To(t),
    r = t.value;
  Object.entries(i).forEach(([o, s]) => {
    r.component ? (n ? Bs(s, n.children.getContext(o), e) : Bs(s, null, e)) : Bs(s, n, e);
  }),
    r.component
      ? n && n.outlet && n.outlet.isActivated
        ? e.canDeactivateChecks.push(new xo(n.outlet.component, r))
        : e.canDeactivateChecks.push(new xo(null, r))
      : e.canDeactivateChecks.push(new xo(null, r));
}
function Xs(t) {
  return typeof t == 'function';
}
function tx(t) {
  return typeof t == 'boolean';
}
function nx(t) {
  return t && Xs(t.canLoad);
}
function ix(t) {
  return t && Xs(t.canActivate);
}
function rx(t) {
  return t && Xs(t.canActivateChild);
}
function ox(t) {
  return t && Xs(t.canDeactivate);
}
function sx(t) {
  return t && Xs(t.canMatch);
}
function qy(t) {
  return t instanceof Qn || t?.name === 'EmptyError';
}
var Ec = Symbol('INITIAL_VALUE');
function Ro() {
  return nt((t) =>
    rs(t.map((n) => n.pipe(Re(1), rl(Ec)))).pipe(
      z((n) => {
        for (let e of n)
          if (e !== !0) {
            if (e === Ec) return Ec;
            if (e === !1 || ax(e)) return e;
          }
        return !0;
      }),
      tt((n) => n !== Ec),
      Re(1),
    ),
  );
}
function ax(t) {
  return $s(t) || t instanceof Qs;
}
function lx(t, n) {
  return De((e) => {
    let {
      targetSnapshot: i,
      currentSnapshot: r,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = e;
    return s.length === 0 && o.length === 0
      ? L(ee(E({}, e), { guardsResult: !0 }))
      : cx(s, i, r, t).pipe(
          De((a) => (a && tx(a) ? ux(i, o, t, n) : L(a))),
          z((a) => ee(E({}, e), { guardsResult: a })),
        );
  });
}
function cx(t, n, e, i) {
  return Me(t).pipe(
    De((r) => mx(r.component, r.route, e, n, i)),
    bn((r) => r !== !0, !0),
  );
}
function ux(t, n, e, i) {
  return Me(n).pipe(
    yn((r) => Mt(fx(r.route.parent, i), dx(r.route, i), px(t, r.path, e), hx(t, r.route, e))),
    bn((r) => r !== !0, !0),
  );
}
function dx(t, n) {
  return t !== null && n && n(new Mp(t)), L(!0);
}
function fx(t, n) {
  return t !== null && n && n(new Ep(t)), L(!0);
}
function hx(t, n, e) {
  let i = n.routeConfig ? n.routeConfig.canActivate : null;
  if (!i || i.length === 0) return L(!0);
  let r = i.map((o) =>
    lr(() => {
      let s = Js(n) ?? e,
        a = Po(o, s),
        l = ix(a) ? a.canActivate(n, t) : Ut(s, () => a(n, t));
      return Vi(l).pipe(bn());
    }),
  );
  return L(r).pipe(Ro());
}
function px(t, n, e) {
  let i = n[n.length - 1],
    o = n
      .slice(0, n.length - 1)
      .reverse()
      .map((s) => J2(s))
      .filter((s) => s !== null)
      .map((s) =>
        lr(() => {
          let a = s.guards.map((l) => {
            let c = Js(s.node) ?? e,
              f = Po(l, c),
              p = rx(f) ? f.canActivateChild(i, t) : Ut(c, () => f(i, t));
            return Vi(p).pipe(bn());
          });
          return L(a).pipe(Ro());
        }),
      );
  return L(o).pipe(Ro());
}
function mx(t, n, e, i, r) {
  let o = n && n.routeConfig ? n.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return L(!0);
  let s = o.map((a) => {
    let l = Js(n) ?? r,
      c = Po(a, l),
      f = ox(c) ? c.canDeactivate(t, n, e, i) : Ut(l, () => c(t, n, e, i));
    return Vi(f).pipe(bn());
  });
  return L(s).pipe(Ro());
}
function gx(t, n, e, i) {
  let r = n.canLoad;
  if (r === void 0 || r.length === 0) return L(!0);
  let o = r.map((s) => {
    let a = Po(s, t),
      l = nx(a) ? a.canLoad(n, e) : Ut(t, () => a(n, e));
    return Vi(l);
  });
  return L(o).pipe(Ro(), Qy(i));
}
function Qy(t) {
  return bd(
    Pe((n) => {
      if (typeof n != 'boolean') throw kc(t, n);
    }),
    z((n) => n === !0),
  );
}
function vx(t, n, e, i) {
  let r = n.canMatch;
  if (!r || r.length === 0) return L(!0);
  let o = r.map((s) => {
    let a = Po(s, t),
      l = sx(a) ? a.canMatch(n, e) : Ut(t, () => a(n, e));
    return Vi(l);
  });
  return L(o).pipe(Ro(), Qy(i));
}
var Zs = class {
    constructor(n) {
      this.segmentGroup = n || null;
    }
  },
  Ks = class extends Error {
    constructor(n) {
      super(), (this.urlTree = n);
    }
  };
function Eo(t) {
  return ro(new Zs(t));
}
function _x(t) {
  return ro(new T(4e3, !1));
}
function yx(t) {
  return ro(zy(!1, Ft.GuardRejected));
}
var Fp = class {
    constructor(n, e) {
      (this.urlSerializer = n), (this.urlTree = e);
    }
    lineralizeSegments(n, e) {
      let i = [],
        r = e.root;
      for (;;) {
        if (((i = i.concat(r.segments)), r.numberOfChildren === 0)) return L(i);
        if (r.numberOfChildren > 1 || !r.children[ie]) return _x(`${n.redirectTo}`);
        r = r.children[ie];
      }
    }
    applyRedirectCommands(n, e, i, r, o) {
      if (typeof e != 'string') {
        let a = e,
          {
            queryParams: l,
            fragment: c,
            routeConfig: f,
            url: p,
            outlet: g,
            params: m,
            data: v,
            title: _,
          } = r,
          C = Ut(o, () =>
            a({
              params: m,
              data: v,
              queryParams: l,
              fragment: c,
              routeConfig: f,
              url: p,
              outlet: g,
              title: _,
            }),
          );
        if (C instanceof ai) throw new Ks(C);
        e = C;
      }
      let s = this.applyRedirectCreateUrlTree(e, this.urlSerializer.parse(e), n, i);
      if (e[0] === '/') throw new Ks(s);
      return s;
    }
    applyRedirectCreateUrlTree(n, e, i, r) {
      let o = this.createSegmentGroup(n, e.root, i, r);
      return new ai(o, this.createQueryParams(e.queryParams, this.urlTree.queryParams), e.fragment);
    }
    createQueryParams(n, e) {
      let i = {};
      return (
        Object.entries(n).forEach(([r, o]) => {
          if (typeof o == 'string' && o[0] === ':') {
            let a = o.substring(1);
            i[r] = e[a];
          } else i[r] = o;
        }),
        i
      );
    }
    createSegmentGroup(n, e, i, r) {
      let o = this.createSegments(n, e.segments, i, r),
        s = {};
      return (
        Object.entries(e.children).forEach(([a, l]) => {
          s[a] = this.createSegmentGroup(n, l, i, r);
        }),
        new ge(o, s)
      );
    }
    createSegments(n, e, i, r) {
      return e.map((o) =>
        o.path[0] === ':' ? this.findPosParam(n, o, r) : this.findOrReturn(o, i),
      );
    }
    findPosParam(n, e, i) {
      let r = i[e.path.substring(1)];
      if (!r) throw new T(4001, !1);
      return r;
    }
    findOrReturn(n, e) {
      let i = 0;
      for (let r of e) {
        if (r.path === n.path) return e.splice(i), r;
        i++;
      }
      return n;
    }
  },
  kp = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function bx(t, n, e, i, r) {
  let o = Gp(t, n, e);
  return o.matched
    ? ((i = H2(n, i)), vx(i, n, e, r).pipe(z((s) => (s === !0 ? o : E({}, kp)))))
    : L(o);
}
function Gp(t, n, e) {
  if (n.path === '**') return Cx(e);
  if (n.path === '')
    return n.pathMatch === 'full' && (t.hasChildren() || e.length > 0)
      ? E({}, kp)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: e,
          parameters: {},
          positionalParamSegments: {},
        };
  let r = (n.matcher || v2)(e, t, n);
  if (!r) return E({}, kp);
  let o = {};
  Object.entries(r.posParams ?? {}).forEach(([a, l]) => {
    o[a] = l.path;
  });
  let s = r.consumed.length > 0 ? E(E({}, o), r.consumed[r.consumed.length - 1].parameters) : o;
  return {
    matched: !0,
    consumedSegments: r.consumed,
    remainingSegments: e.slice(r.consumed.length),
    parameters: s,
    positionalParamSegments: r.posParams ?? {},
  };
}
function Cx(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? Iy(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function Sy(t, n, e, i) {
  return e.length > 0 && Sx(t, e, i)
    ? {
        segmentGroup: new ge(n, Dx(i, new ge(e, t.children))),
        slicedSegments: [],
      }
    : e.length === 0 && Ex(t, e, i)
      ? {
          segmentGroup: new ge(t.segments, wx(t, e, i, t.children)),
          slicedSegments: e,
        }
      : { segmentGroup: new ge(t.segments, t.children), slicedSegments: e };
}
function wx(t, n, e, i) {
  let r = {};
  for (let o of e)
    if (jc(t, n, o) && !i[dn(o)]) {
      let s = new ge([], {});
      r[dn(o)] = s;
    }
  return E(E({}, i), r);
}
function Dx(t, n) {
  let e = {};
  e[ie] = n;
  for (let i of t)
    if (i.path === '' && dn(i) !== ie) {
      let r = new ge([], {});
      e[dn(i)] = r;
    }
  return e;
}
function Sx(t, n, e) {
  return e.some((i) => jc(t, n, i) && dn(i) !== ie);
}
function Ex(t, n, e) {
  return e.some((i) => jc(t, n, i));
}
function jc(t, n, e) {
  return (t.hasChildren() || n.length > 0) && e.pathMatch === 'full' ? !1 : e.path === '';
}
function Tx(t, n, e, i) {
  return dn(t) !== i && (i === ie || !jc(n, e, t)) ? !1 : Gp(n, t, e).matched;
}
function Mx(t, n, e) {
  return n.length === 0 && !t.children[e];
}
var Lp = class {};
function Ix(t, n, e, i, r, o, s = 'emptyOnly') {
  return new Vp(t, n, e, i, r, s, o).recognize();
}
var xx = 31,
  Vp = class {
    constructor(n, e, i, r, o, s, a) {
      (this.injector = n),
        (this.configLoader = e),
        (this.rootComponentType = i),
        (this.config = r),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new Fp(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(n) {
      return new T(4002, `'${n.segmentGroup}'`);
    }
    recognize() {
      let n = Sy(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(n).pipe(
        z(({ children: e, rootSnapshot: i }) => {
          let r = new Pt(i, e),
            o = new Fc('', r),
            s = k2(i, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            { state: o, tree: s }
          );
        }),
      );
    }
    match(n) {
      let e = new Io(
        [],
        Object.freeze({}),
        Object.freeze(E({}, this.urlTree.queryParams)),
        this.urlTree.fragment,
        Object.freeze({}),
        ie,
        this.rootComponentType,
        null,
        {},
      );
      return this.processSegmentGroup(this.injector, this.config, n, ie, e).pipe(
        z((i) => ({ children: i, rootSnapshot: e })),
        gi((i) => {
          if (i instanceof Ks) return (this.urlTree = i.urlTree), this.match(i.urlTree.root);
          throw i instanceof Zs ? this.noMatchError(i) : i;
        }),
      );
    }
    processSegmentGroup(n, e, i, r, o) {
      return i.segments.length === 0 && i.hasChildren()
        ? this.processChildren(n, e, i, o)
        : this.processSegment(n, e, i, i.segments, r, !0, o).pipe(
            z((s) => (s instanceof Pt ? [s] : [])),
          );
    }
    processChildren(n, e, i, r) {
      let o = [];
      for (let s of Object.keys(i.children)) s === 'primary' ? o.unshift(s) : o.push(s);
      return Me(o).pipe(
        yn((s) => {
          let a = i.children[s],
            l = G2(e, s);
          return this.processSegmentGroup(n, l, a, s, r);
        }),
        Nd((s, a) => (s.push(...a), s)),
        vi(null),
        xd(),
        De((s) => {
          if (s === null) return Eo(i);
          let a = Zy(s);
          return Nx(a), L(a);
        }),
      );
    }
    processSegment(n, e, i, r, o, s, a) {
      return Me(e).pipe(
        yn((l) =>
          this.processSegmentAgainstRoute(l._injector ?? n, e, l, i, r, o, s, a).pipe(
            gi((c) => {
              if (c instanceof Zs) return L(null);
              throw c;
            }),
          ),
        ),
        bn((l) => !!l),
        gi((l) => {
          if (qy(l)) return Mx(i, r, o) ? L(new Lp()) : Eo(i);
          throw l;
        }),
      );
    }
    processSegmentAgainstRoute(n, e, i, r, o, s, a, l) {
      return Tx(i, r, o, s)
        ? i.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(n, r, i, o, s, l)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(n, r, e, i, o, s, l)
            : Eo(r)
        : Eo(r);
    }
    expandSegmentAgainstRouteUsingRedirect(n, e, i, r, o, s, a) {
      let {
        matched: l,
        parameters: c,
        consumedSegments: f,
        positionalParamSegments: p,
        remainingSegments: g,
      } = Gp(e, r, o);
      if (!l) return Eo(e);
      typeof r.redirectTo == 'string' &&
        r.redirectTo[0] === '/' &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > xx && (this.allowRedirects = !1));
      let m = new Io(
          o,
          c,
          Object.freeze(E({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          Ey(r),
          dn(r),
          r.component ?? r._loadedComponent ?? null,
          r,
          Ty(r),
        ),
        v = Pc(m, a, this.paramsInheritanceStrategy);
      (m.params = Object.freeze(v.params)), (m.data = Object.freeze(v.data));
      let _ = this.applyRedirects.applyRedirectCommands(f, r.redirectTo, p, m, n);
      return this.applyRedirects
        .lineralizeSegments(r, _)
        .pipe(De((C) => this.processSegment(n, i, e, C.concat(g), s, !1, a)));
    }
    matchSegmentAgainstRoute(n, e, i, r, o, s) {
      let a = bx(e, i, r, n, this.urlSerializer);
      return (
        i.path === '**' && (e.children = {}),
        a.pipe(
          nt((l) =>
            l.matched
              ? ((n = i._injector ?? n),
                this.getChildConfig(n, i, r).pipe(
                  nt(({ routes: c }) => {
                    let f = i._loadedInjector ?? n,
                      { parameters: p, consumedSegments: g, remainingSegments: m } = l,
                      v = new Io(
                        g,
                        p,
                        Object.freeze(E({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        Ey(i),
                        dn(i),
                        i.component ?? i._loadedComponent ?? null,
                        i,
                        Ty(i),
                      ),
                      _ = Pc(v, s, this.paramsInheritanceStrategy);
                    (v.params = Object.freeze(_.params)), (v.data = Object.freeze(_.data));
                    let { segmentGroup: C, slicedSegments: S } = Sy(e, g, m, c);
                    if (S.length === 0 && C.hasChildren())
                      return this.processChildren(f, c, C, v).pipe(z((I) => new Pt(v, I)));
                    if (c.length === 0 && S.length === 0) return L(new Pt(v, []));
                    let O = dn(i) === o;
                    return this.processSegment(f, c, C, S, O ? ie : o, !0, v).pipe(
                      z((I) => new Pt(v, I instanceof Pt ? [I] : [])),
                    );
                  }),
                ))
              : Eo(e),
          ),
        )
      );
    }
    getChildConfig(n, e, i) {
      return e.children
        ? L({ routes: e.children, injector: n })
        : e.loadChildren
          ? e._loadedRoutes !== void 0
            ? L({ routes: e._loadedRoutes, injector: e._loadedInjector })
            : gx(n, e, i, this.urlSerializer).pipe(
                De((r) =>
                  r
                    ? this.configLoader.loadChildren(n, e).pipe(
                        Pe((o) => {
                          (e._loadedRoutes = o.routes), (e._loadedInjector = o.injector);
                        }),
                      )
                    : yx(e),
                ),
              )
          : L({ routes: [], injector: n });
    }
  };
function Nx(t) {
  t.sort((n, e) =>
    n.value.outlet === ie
      ? -1
      : e.value.outlet === ie
        ? 1
        : n.value.outlet.localeCompare(e.value.outlet),
  );
}
function Ax(t) {
  let n = t.value.routeConfig;
  return n && n.path === '';
}
function Zy(t) {
  let n = [],
    e = new Set();
  for (let i of t) {
    if (!Ax(i)) {
      n.push(i);
      continue;
    }
    let r = n.find((o) => i.value.routeConfig === o.value.routeConfig);
    r !== void 0 ? (r.children.push(...i.children), e.add(r)) : n.push(i);
  }
  for (let i of e) {
    let r = Zy(i.children);
    n.push(new Pt(i.value, r));
  }
  return n.filter((i) => !e.has(i));
}
function Ey(t) {
  return t.data || {};
}
function Ty(t) {
  return t.resolve || {};
}
function Ox(t, n, e, i, r, o) {
  return De((s) =>
    Ix(t, n, e, i, s.extractedUrl, r, o).pipe(
      z(({ state: a, tree: l }) => ee(E({}, s), { targetSnapshot: a, urlAfterRedirects: l })),
    ),
  );
}
function Rx(t, n) {
  return De((e) => {
    let {
      targetSnapshot: i,
      guards: { canActivateChecks: r },
    } = e;
    if (!r.length) return L(e);
    let o = new Set(r.map((l) => l.route)),
      s = new Set();
    for (let l of o) if (!s.has(l)) for (let c of Ky(l)) s.add(c);
    let a = 0;
    return Me(s).pipe(
      yn((l) => (o.has(l) ? Px(l, i, t, n) : ((l.data = Pc(l, l.parent, t).resolve), L(void 0)))),
      Pe(() => a++),
      so(1),
      De((l) => (a === s.size ? L(e) : mt)),
    );
  });
}
function Ky(t) {
  let n = t.children.map((e) => Ky(e)).flat();
  return [t, ...n];
}
function Px(t, n, e, i) {
  let r = t.routeConfig,
    o = t._resolve;
  return (
    r?.title !== void 0 && !Hy(r) && (o[Ys] = r.title),
    Fx(o, t, n, i).pipe(
      z((s) => ((t._resolvedData = s), (t.data = Pc(t, t.parent, e).resolve), null)),
    )
  );
}
function Fx(t, n, e, i) {
  let r = pp(t);
  if (r.length === 0) return L({});
  let o = {};
  return Me(r).pipe(
    De((s) =>
      kx(t[s], n, e, i).pipe(
        bn(),
        Pe((a) => {
          if (a instanceof Qs) throw kc(new Us(), a);
          o[s] = a;
        }),
      ),
    ),
    so(1),
    as(o),
    gi((s) => (qy(s) ? mt : ro(s))),
  );
}
function kx(t, n, e, i) {
  let r = Js(n) ?? i,
    o = Po(t, r),
    s = o.resolve ? o.resolve(n, e) : Ut(r, () => o(n, e));
  return Vi(s);
}
function fp(t) {
  return nt((n) => {
    let e = t(n);
    return e ? Me(e).pipe(z(() => n)) : L(n);
  });
}
var Yy = (() => {
    class t {
      buildTitle(e) {
        let i,
          r = e.root;
        for (; r !== void 0; )
          (i = this.getResolvedTitleForRoute(r) ?? i),
            (r = r.children.find((o) => o.outlet === ie));
        return i;
      }
      getResolvedTitleForRoute(e) {
        return e.data[Ys];
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: () => y(Lx), providedIn: 'root' });
      }
    }
    return t;
  })(),
  Lx = (() => {
    class t extends Yy {
      constructor(e) {
        super(), (this.title = e);
      }
      updateTitle(e) {
        let i = this.buildTitle(e);
        i !== void 0 && this.title.setTitle(i);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(N(_y));
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })(),
  zp = new F('', { providedIn: 'root', factory: () => ({}) }),
  Vx = (() => {
    class t {
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵcmp = V({
          type: t,
          selectors: [['ng-component']],
          standalone: !0,
          features: [j],
          decls: 1,
          vars: 0,
          template: function (i, r) {
            i & 1 && b(0, 'router-outlet');
          },
          dependencies: [$p],
          encapsulation: 2,
        });
      }
    }
    return t;
  })();
function Wp(t) {
  let n = t.children && t.children.map(Wp),
    e = n ? ee(E({}, t), { children: n }) : E({}, t);
  return (
    !e.component &&
      !e.loadComponent &&
      (n || e.loadChildren) &&
      e.outlet &&
      e.outlet !== ie &&
      (e.component = Vx),
    e
  );
}
var qp = new F(''),
  jx = (() => {
    class t {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = y(Gh));
      }
      loadComponent(e) {
        if (this.componentLoaders.get(e)) return this.componentLoaders.get(e);
        if (e._loadedComponent) return L(e._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(e);
        let i = Vi(e.loadComponent()).pipe(
            z(Jy),
            Pe((o) => {
              this.onLoadEndListener && this.onLoadEndListener(e), (e._loadedComponent = o);
            }),
            _i(() => {
              this.componentLoaders.delete(e);
            }),
          ),
          r = new eo(i, () => new de()).pipe(Xr());
        return this.componentLoaders.set(e, r), r;
      }
      loadChildren(e, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes) return L({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let o = Bx(i, this.compiler, e, this.onLoadEndListener).pipe(
            _i(() => {
              this.childrenLoaders.delete(i);
            }),
          ),
          s = new eo(o, () => new de()).pipe(Xr());
        return this.childrenLoaders.set(i, s), s;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })();
function Bx(t, n, e, i) {
  return Vi(t.loadChildren()).pipe(
    z(Jy),
    De((r) => (r instanceof vs || Array.isArray(r) ? L(r) : Me(n.compileModuleAsync(r)))),
    z((r) => {
      i && i(t);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(r)
          ? ((s = r), (a = !0))
          : ((o = r.create(e).injector), (s = o.get(qp, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(Wp), injector: o }
      );
    }),
  );
}
function Ux(t) {
  return t && typeof t == 'object' && 'default' in t;
}
function Jy(t) {
  return Ux(t) ? t.default : t;
}
var Qp = (() => {
    class t {
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: () => y($x), providedIn: 'root' });
      }
    }
    return t;
  })(),
  $x = (() => {
    class t {
      shouldProcessUrl(e) {
        return !0;
      }
      extract(e) {
        return e;
      }
      merge(e, i) {
        return e;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })(),
  Hx = new F('');
var Gx = new F(''),
  zx = (() => {
    class t {
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      constructor() {
        (this.currentNavigation = null),
          (this.currentTransition = null),
          (this.lastSuccessfulNavigation = null),
          (this.events = new de()),
          (this.transitionAbortSubject = new de()),
          (this.configLoader = y(jx)),
          (this.environmentInjector = y(vt)),
          (this.urlSerializer = y(Bp)),
          (this.rootContexts = y(Vc)),
          (this.location = y(Es)),
          (this.inputBindingEnabled = y(Hp, { optional: !0 }) !== null),
          (this.titleStrategy = y(Yy)),
          (this.options = y(zp, { optional: !0 }) || {}),
          (this.paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || 'emptyOnly'),
          (this.urlHandlingStrategy = y(Qp)),
          (this.createViewTransition = y(Hx, { optional: !0 })),
          (this.navigationErrorHandler = y(Gx, { optional: !0 })),
          (this.navigationId = 0),
          (this.afterPreactivation = () => L(void 0)),
          (this.rootComponentType = null);
        let e = (r) => this.events.next(new Dp(r)),
          i = (r) => this.events.next(new Sp(r));
        (this.configLoader.onLoadEndListener = i), (this.configLoader.onLoadStartListener = e);
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(e) {
        let i = ++this.navigationId;
        this.transitions?.next(ee(E(E({}, this.transitions.value), e), { id: i }));
      }
      setupNavigations(e, i, r) {
        return (
          (this.transitions = new Oe({
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
            source: js,
            restoredState: null,
            currentSnapshot: r.snapshot,
            targetSnapshot: null,
            currentRouterState: r,
            targetRouterState: null,
            guards: { canActivateChecks: [], canDeactivateChecks: [] },
            guardsResult: null,
          })),
          this.transitions.pipe(
            tt((o) => o.id !== 0),
            z((o) =>
              ee(E({}, o), {
                extractedUrl: this.urlHandlingStrategy.extract(o.rawUrl),
              }),
            ),
            nt((o) => {
              let s = !1,
                a = !1;
              return L(o).pipe(
                nt((l) => {
                  if (this.navigationId > o.id)
                    return this.cancelNavigationTransition(o, '', Ft.SupersededByNewNavigation), mt;
                  (this.currentTransition = o),
                    (this.currentNavigation = {
                      id: l.id,
                      initialUrl: l.rawUrl,
                      extractedUrl: l.extractedUrl,
                      targetBrowserUrl:
                        typeof l.extras.browserUrl == 'string'
                          ? this.urlSerializer.parse(l.extras.browserUrl)
                          : l.extras.browserUrl,
                      trigger: l.source,
                      extras: l.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? ee(E({}, this.lastSuccessfulNavigation), {
                            previousNavigation: null,
                          })
                        : null,
                    });
                  let c =
                      !e.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl(),
                    f = l.extras.onSameUrlNavigation ?? e.onSameUrlNavigation;
                  if (!c && f !== 'reload') {
                    let p = '';
                    return (
                      this.events.next(
                        new Ar(
                          l.id,
                          this.urlSerializer.serialize(l.rawUrl),
                          p,
                          _p.IgnoredSameUrlNavigation,
                        ),
                      ),
                      l.resolve(!1),
                      mt
                    );
                  }
                  if (this.urlHandlingStrategy.shouldProcessUrl(l.rawUrl))
                    return L(l).pipe(
                      nt((p) => {
                        let g = this.transitions?.getValue();
                        return (
                          this.events.next(
                            new Gs(
                              p.id,
                              this.urlSerializer.serialize(p.extractedUrl),
                              p.source,
                              p.restoredState,
                            ),
                          ),
                          g !== this.transitions?.getValue() ? mt : Promise.resolve(p)
                        );
                      }),
                      Ox(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        e.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy,
                      ),
                      Pe((p) => {
                        (o.targetSnapshot = p.targetSnapshot),
                          (o.urlAfterRedirects = p.urlAfterRedirects),
                          (this.currentNavigation = ee(E({}, this.currentNavigation), {
                            finalUrl: p.urlAfterRedirects,
                          }));
                        let g = new Ac(
                          p.id,
                          this.urlSerializer.serialize(p.extractedUrl),
                          this.urlSerializer.serialize(p.urlAfterRedirects),
                          p.targetSnapshot,
                        );
                        this.events.next(g);
                      }),
                    );
                  if (c && this.urlHandlingStrategy.shouldProcessUrl(l.currentRawUrl)) {
                    let { id: p, extractedUrl: g, source: m, restoredState: v, extras: _ } = l,
                      C = new Gs(p, this.urlSerializer.serialize(g), m, v);
                    this.events.next(C);
                    let S = Uy(this.rootComponentType).snapshot;
                    return (
                      (this.currentTransition = o =
                        ee(E({}, l), {
                          targetSnapshot: S,
                          urlAfterRedirects: g,
                          extras: ee(E({}, _), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })),
                      (this.currentNavigation.finalUrl = g),
                      L(o)
                    );
                  } else {
                    let p = '';
                    return (
                      this.events.next(
                        new Ar(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          p,
                          _p.IgnoredByUrlHandlingStrategy,
                        ),
                      ),
                      l.resolve(!1),
                      mt
                    );
                  }
                }),
                Pe((l) => {
                  let c = new yp(
                    l.id,
                    this.urlSerializer.serialize(l.extractedUrl),
                    this.urlSerializer.serialize(l.urlAfterRedirects),
                    l.targetSnapshot,
                  );
                  this.events.next(c);
                }),
                z(
                  (l) => (
                    (this.currentTransition = o =
                      ee(E({}, l), {
                        guards: Y2(l.targetSnapshot, l.currentSnapshot, this.rootContexts),
                      })),
                    o
                  ),
                ),
                lx(this.environmentInjector, (l) => this.events.next(l)),
                Pe((l) => {
                  if (
                    ((o.guardsResult = l.guardsResult),
                    l.guardsResult && typeof l.guardsResult != 'boolean')
                  )
                    throw kc(this.urlSerializer, l.guardsResult);
                  let c = new bp(
                    l.id,
                    this.urlSerializer.serialize(l.extractedUrl),
                    this.urlSerializer.serialize(l.urlAfterRedirects),
                    l.targetSnapshot,
                    !!l.guardsResult,
                  );
                  this.events.next(c);
                }),
                tt((l) =>
                  l.guardsResult
                    ? !0
                    : (this.cancelNavigationTransition(l, '', Ft.GuardRejected), !1),
                ),
                fp((l) => {
                  if (l.guards.canActivateChecks.length)
                    return L(l).pipe(
                      Pe((c) => {
                        let f = new Cp(
                          c.id,
                          this.urlSerializer.serialize(c.extractedUrl),
                          this.urlSerializer.serialize(c.urlAfterRedirects),
                          c.targetSnapshot,
                        );
                        this.events.next(f);
                      }),
                      nt((c) => {
                        let f = !1;
                        return L(c).pipe(
                          Rx(this.paramsInheritanceStrategy, this.environmentInjector),
                          Pe({
                            next: () => (f = !0),
                            complete: () => {
                              f || this.cancelNavigationTransition(c, '', Ft.NoDataFromResolver);
                            },
                          }),
                        );
                      }),
                      Pe((c) => {
                        let f = new wp(
                          c.id,
                          this.urlSerializer.serialize(c.extractedUrl),
                          this.urlSerializer.serialize(c.urlAfterRedirects),
                          c.targetSnapshot,
                        );
                        this.events.next(f);
                      }),
                    );
                }),
                fp((l) => {
                  let c = (f) => {
                    let p = [];
                    f.routeConfig?.loadComponent &&
                      !f.routeConfig._loadedComponent &&
                      p.push(
                        this.configLoader.loadComponent(f.routeConfig).pipe(
                          Pe((g) => {
                            f.component = g;
                          }),
                          z(() => {}),
                        ),
                      );
                    for (let g of f.children) p.push(...c(g));
                    return p;
                  };
                  return rs(c(l.targetSnapshot.root)).pipe(vi(null), Re(1));
                }),
                fp(() => this.afterPreactivation()),
                nt(() => {
                  let { currentSnapshot: l, targetSnapshot: c } = o,
                    f = this.createViewTransition?.(this.environmentInjector, l.root, c.root);
                  return f ? Me(f).pipe(z(() => o)) : L(o);
                }),
                z((l) => {
                  let c = W2(e.routeReuseStrategy, l.targetSnapshot, l.currentRouterState);
                  return (
                    (this.currentTransition = o = ee(E({}, l), { targetRouterState: c })),
                    (this.currentNavigation.targetRouterState = c),
                    o
                  );
                }),
                Pe(() => {
                  this.events.next(new Ws());
                }),
                K2(
                  this.rootContexts,
                  e.routeReuseStrategy,
                  (l) => this.events.next(l),
                  this.inputBindingEnabled,
                ),
                Re(1),
                Pe({
                  next: (l) => {
                    (s = !0),
                      (this.lastSuccessfulNavigation = this.currentNavigation),
                      this.events.next(
                        new Nr(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          this.urlSerializer.serialize(l.urlAfterRedirects),
                        ),
                      ),
                      this.titleStrategy?.updateTitle(l.targetRouterState.snapshot),
                      l.resolve(!0);
                  },
                  complete: () => {
                    s = !0;
                  },
                }),
                Vt(
                  this.transitionAbortSubject.pipe(
                    Pe((l) => {
                      throw l;
                    }),
                  ),
                ),
                _i(() => {
                  !s && !a && this.cancelNavigationTransition(o, '', Ft.SupersededByNewNavigation),
                    this.currentTransition?.id === o.id &&
                      ((this.currentNavigation = null), (this.currentTransition = null));
                }),
                gi((l) => {
                  if (((a = !0), Wy(l)))
                    this.events.next(
                      new si(
                        o.id,
                        this.urlSerializer.serialize(o.extractedUrl),
                        l.message,
                        l.cancellationCode,
                      ),
                    ),
                      Z2(l)
                        ? this.events.next(new Ao(l.url, l.navigationBehaviorOptions))
                        : o.resolve(!1);
                  else {
                    let c = new zs(
                      o.id,
                      this.urlSerializer.serialize(o.extractedUrl),
                      l,
                      o.targetSnapshot ?? void 0,
                    );
                    try {
                      let f = Ut(this.environmentInjector, () => this.navigationErrorHandler?.(c));
                      if (f instanceof Qs) {
                        let { message: p, cancellationCode: g } = kc(this.urlSerializer, f);
                        this.events.next(
                          new si(o.id, this.urlSerializer.serialize(o.extractedUrl), p, g),
                        ),
                          this.events.next(new Ao(f.redirectTo, f.navigationBehaviorOptions));
                      } else {
                        this.events.next(c);
                        let p = e.errorHandler(l);
                        o.resolve(!!p);
                      }
                    } catch (f) {
                      this.options.resolveNavigationPromiseOnError ? o.resolve(!1) : o.reject(f);
                    }
                  }
                  return mt;
                }),
              );
            }),
          )
        );
      }
      cancelNavigationTransition(e, i, r) {
        let o = new si(e.id, this.urlSerializer.serialize(e.extractedUrl), i, r);
        this.events.next(o), e.resolve(!1);
      }
      isUpdatingInternalState() {
        return (
          this.currentTransition?.extractedUrl.toString() !==
          this.currentTransition?.currentUrlTree.toString()
        );
      }
      isUpdatedBrowserUrl() {
        let e = this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0))),
          i = this.currentNavigation?.targetBrowserUrl ?? this.currentNavigation?.extractedUrl;
        return e.toString() !== i?.toString() && !this.currentNavigation?.extras.skipLocationChange;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })();
function Wx(t) {
  return t !== js;
}
var qx = (() => {
    class t {
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: () => y(Qx), providedIn: 'root' });
      }
    }
    return t;
  })(),
  jp = class {
    shouldDetach(n) {
      return !1;
    }
    store(n, e) {}
    shouldAttach(n) {
      return !1;
    }
    retrieve(n) {
      return null;
    }
    shouldReuseRoute(n, e) {
      return n.routeConfig === e.routeConfig;
    }
  },
  Qx = (() => {
    class t extends jp {
      static {
        this.ɵfac = (() => {
          let e;
          return function (r) {
            return (e || (e = Ht(t)))(r || t);
          };
        })();
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })(),
  Xy = (() => {
    class t {
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: () => y(Zx), providedIn: 'root' });
      }
    }
    return t;
  })(),
  Zx = (() => {
    class t extends Xy {
      constructor() {
        super(...arguments),
          (this.location = y(Es)),
          (this.urlSerializer = y(Bp)),
          (this.options = y(zp, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || 'replace'),
          (this.urlHandlingStrategy = y(Qp)),
          (this.urlUpdateStrategy = this.options.urlUpdateStrategy || 'deferred'),
          (this.currentUrlTree = new ai()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Uy(null)),
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
      registerNonRouterCurrentEntryChangeListener(e) {
        return this.location.subscribe((i) => {
          i.type === 'popstate' && e(i.url, i.state);
        });
      }
      handleRouterEvent(e, i) {
        if (e instanceof Gs) this.stateMemento = this.createStateMemento();
        else if (e instanceof Ar) this.rawUrlTree = i.initialUrl;
        else if (e instanceof Ac) {
          if (this.urlUpdateStrategy === 'eager' && !i.extras.skipLocationChange) {
            let r = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(i.targetBrowserUrl ?? r, i);
          }
        } else
          e instanceof Ws
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl)),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === 'deferred' &&
                !i.extras.skipLocationChange &&
                this.setBrowserUrl(i.targetBrowserUrl ?? this.rawUrlTree, i))
            : e instanceof si && (e.code === Ft.GuardRejected || e.code === Ft.NoDataFromResolver)
              ? this.restoreHistory(i)
              : e instanceof zs
                ? this.restoreHistory(i, !0)
                : e instanceof Nr &&
                  ((this.lastSuccessfulId = e.id), (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(e, i) {
        let r = e instanceof ai ? this.urlSerializer.serialize(e) : e;
        if (this.location.isCurrentPathEqualTo(r) || i.extras.replaceUrl) {
          let o = this.browserPageId,
            s = E(E({}, i.extras.state), this.generateNgRouterState(i.id, o));
          this.location.replaceState(r, '', s);
        } else {
          let o = E(
            E({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1),
          );
          this.location.go(r, '', o);
        }
      }
      restoreHistory(e, i = !1) {
        if (this.canceledNavigationResolution === 'computed') {
          let r = this.browserPageId,
            o = this.currentPageId - r;
          o !== 0
            ? this.location.historyGo(o)
            : this.currentUrlTree === e.finalUrl &&
              o === 0 &&
              (this.resetState(e), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === 'replace' &&
            (i && this.resetState(e), this.resetUrlToCurrentUrlTree());
      }
      resetState(e) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            e.finalUrl ?? this.rawUrlTree,
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          '',
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        );
      }
      generateNgRouterState(e, i) {
        return this.canceledNavigationResolution === 'computed'
          ? { navigationId: e, ɵrouterPageId: i }
          : { navigationId: e };
      }
      static {
        this.ɵfac = (() => {
          let e;
          return function (r) {
            return (e || (e = Ht(t)))(r || t);
          };
        })();
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })(),
  Ls = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = 'COMPLETE'),
      (t[(t.FAILED = 1)] = 'FAILED'),
      (t[(t.REDIRECTING = 2)] = 'REDIRECTING'),
      t
    );
  })(Ls || {});
function Kx(t, n) {
  t.events
    .pipe(
      tt((e) => e instanceof Nr || e instanceof si || e instanceof zs || e instanceof Ar),
      z((e) =>
        e instanceof Nr || e instanceof Ar
          ? Ls.COMPLETE
          : (
                e instanceof si
                  ? e.code === Ft.Redirect || e.code === Ft.SupersededByNewNavigation
                  : !1
              )
            ? Ls.REDIRECTING
            : Ls.FAILED,
      ),
      tt((e) => e !== Ls.REDIRECTING),
      Re(1),
    )
    .subscribe(() => {
      n();
    });
}
function Yx(t) {
  throw t;
}
var Jx = {
    paths: 'exact',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'exact',
  },
  Xx = {
    paths: 'subset',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'subset',
  },
  Vn = (() => {
    class t {
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
          (this.console = y(lc)),
          (this.stateManager = y(Xy)),
          (this.options = y(zp, { optional: !0 }) || {}),
          (this.pendingTasks = y(xi)),
          (this.urlUpdateStrategy = this.options.urlUpdateStrategy || 'deferred'),
          (this.navigationTransitions = y(zx)),
          (this.urlSerializer = y(Bp)),
          (this.location = y(Es)),
          (this.urlHandlingStrategy = y(Qp)),
          (this._events = new de()),
          (this.errorHandler = this.options.errorHandler || Yx),
          (this.navigated = !1),
          (this.routeReuseStrategy = y(qx)),
          (this.onSameUrlNavigation = this.options.onSameUrlNavigation || 'ignore'),
          (this.config = y(qp, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!y(Hp, { optional: !0 })),
          (this.eventsSubscription = new Ce()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (e) => {
                this.console.warn(e);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let e = this.navigationTransitions.events.subscribe((i) => {
          try {
            let r = this.navigationTransitions.currentTransition,
              o = this.navigationTransitions.currentNavigation;
            if (r !== null && o !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, o),
                i instanceof si &&
                  i.code !== Ft.Redirect &&
                  i.code !== Ft.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof Nr) this.navigated = !0;
              else if (i instanceof Ao) {
                let s = i.navigationBehaviorOptions,
                  a = this.urlHandlingStrategy.merge(i.url, r.currentRawUrl),
                  l = E(
                    {
                      browserUrl: r.extras.browserUrl,
                      info: r.extras.info,
                      skipLocationChange: r.extras.skipLocationChange,
                      replaceUrl:
                        r.extras.replaceUrl || this.urlUpdateStrategy === 'eager' || Wx(r.source),
                    },
                    s,
                  );
                this.scheduleNavigation(a, js, null, l, {
                  resolve: r.resolve,
                  reject: r.reject,
                  promise: r.promise,
                });
              }
            }
            tN(i) && this._events.next(i);
          } catch (r) {
            this.navigationTransitions.transitionAbortSubject.next(r);
          }
        });
        this.eventsSubscription.add(e);
      }
      resetRootComponentType(e) {
        (this.routerState.root.component = e), (this.navigationTransitions.rootComponentType = e);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              js,
              this.stateManager.restoredState(),
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener((e, i) => {
            setTimeout(() => {
              this.navigateToSyncWithBrowser(e, 'popstate', i);
            }, 0);
          });
      }
      navigateToSyncWithBrowser(e, i, r) {
        let o = { replaceUrl: !0 },
          s = r?.navigationId ? r : null;
        if (r) {
          let l = E({}, r);
          delete l.navigationId,
            delete l.ɵrouterPageId,
            Object.keys(l).length !== 0 && (o.state = l);
        }
        let a = this.parseUrl(e);
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
      resetConfig(e) {
        (this.config = e.map(Wp)), (this.navigated = !1);
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
      createUrlTree(e, i = {}) {
        let {
            relativeTo: r,
            queryParams: o,
            fragment: s,
            queryParamsHandling: a,
            preserveFragment: l,
          } = i,
          c = l ? this.currentUrlTree.fragment : s,
          f = null;
        switch (a ?? this.options.defaultQueryParamsHandling) {
          case 'merge':
            f = E(E({}, this.currentUrlTree.queryParams), o);
            break;
          case 'preserve':
            f = this.currentUrlTree.queryParams;
            break;
          default:
            f = o || null;
        }
        f !== null && (f = this.removeEmptyProps(f));
        let p;
        try {
          let g = r ? r.snapshot : this.routerState.snapshot.root;
          p = Ly(g);
        } catch {
          (typeof e[0] != 'string' || e[0][0] !== '/') && (e = []), (p = this.currentUrlTree.root);
        }
        return Vy(p, e, f, c ?? null);
      }
      navigateByUrl(e, i = { skipLocationChange: !1 }) {
        let r = $s(e) ? e : this.parseUrl(e),
          o = this.urlHandlingStrategy.merge(r, this.rawUrlTree);
        return this.scheduleNavigation(o, js, null, i);
      }
      navigate(e, i = { skipLocationChange: !1 }) {
        return eN(e), this.navigateByUrl(this.createUrlTree(e, i), i);
      }
      serializeUrl(e) {
        return this.urlSerializer.serialize(e);
      }
      parseUrl(e) {
        try {
          return this.urlSerializer.parse(e);
        } catch {
          return this.urlSerializer.parse('/');
        }
      }
      isActive(e, i) {
        let r;
        if ((i === !0 ? (r = E({}, Jx)) : i === !1 ? (r = E({}, Xx)) : (r = i), $s(e)))
          return by(this.currentUrlTree, e, r);
        let o = this.parseUrl(e);
        return by(this.currentUrlTree, o, r);
      }
      removeEmptyProps(e) {
        return Object.entries(e).reduce((i, [r, o]) => (o != null && (i[r] = o), i), {});
      }
      scheduleNavigation(e, i, r, o, s) {
        if (this.disposed) return Promise.resolve(!1);
        let a, l, c;
        s
          ? ((a = s.resolve), (l = s.reject), (c = s.promise))
          : (c = new Promise((p, g) => {
              (a = p), (l = g);
            }));
        let f = this.pendingTasks.add();
        return (
          Kx(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(f));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: r,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: e,
            extras: o,
            resolve: a,
            reject: l,
            promise: c,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          c.catch((p) => Promise.reject(p))
        );
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })();
function eN(t) {
  for (let n = 0; n < t.length; n++) if (t[n] == null) throw new T(4008, !1);
}
function tN(t) {
  return !(t instanceof Ws) && !(t instanceof Ao);
}
var nN = new F('');
function eb(t, ...n) {
  return Mi([
    { provide: qp, multi: !0, useValue: t },
    [],
    { provide: Oo, useFactory: iN, deps: [Vn] },
    { provide: cc, multi: !0, useFactory: rN },
    n.map((e) => e.ɵproviders),
  ]);
}
function iN(t) {
  return t.routerState.root;
}
function rN() {
  let t = y(Ge);
  return (n) => {
    let e = t.get(Ot);
    if (n !== e.components[0]) return;
    let i = t.get(Vn),
      r = t.get(oN);
    t.get(sN) === 1 && i.initialNavigation(),
      t.get(aN, null, ae.Optional)?.setUpPreloading(),
      t.get(nN, null, ae.Optional)?.init(),
      i.resetRootComponentType(e.componentTypes[0]),
      r.closed || (r.next(), r.complete(), r.unsubscribe());
  };
}
var oN = new F('', { factory: () => new de() }),
  sN = new F('', { providedIn: 'root', factory: () => 1 });
var aN = new F('');
var ve = {
  HOME: 'home',
  ABOUT: 'about',
  FOR_BUSINESS: 'forbusiness',
  LOGIN: 'login',
  SIGN_UP: 'signup',
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
var Bc = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-banner']],
    standalone: !0,
    features: [j],
    decls: 10,
    vars: 0,
    consts: [
      [1, 'banner-wrapper'],
      [1, 'm-auto'],
      ['src', 'assets/bgbanner.svg', 1, 'm-auto'],
      [1, 'content-data-info'],
    ],
    template: function (e, i) {
      e & 1 &&
        (u(0, 'div', 0)(1, 'figure', 1),
        b(2, 'img', 2),
        d(),
        u(3, 'div', 3)(4, 'h1'),
        h(5, 'Together Anything Is Possible'),
        d(),
        u(6, 'p'),
        h(
          7,
          'We are a staffing company dedicated to empowering people. We relentlessly pursue opportunities for others because when we all work together, anything is possible.',
        ),
        d(),
        u(8, 'button'),
        h(9, 'Get Started'),
        d()()());
    },
    styles: [
      '.banner-wrapper[_ngcontent-%COMP%]{position:relative;background:#0069ff}.banner-wrapper[_ngcontent-%COMP%]   .content-data-info[_ngcontent-%COMP%]{position:absolute;left:0;right:0;top:0;width:800px;margin:0 auto;display:flex;align-items:center;justify-content:center;flex-direction:column;height:100%}.banner-wrapper[_ngcontent-%COMP%]   .content-data-info[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:#fff;font-family:Open Sans;font-size:50px;font-style:normal;font-weight:700;line-height:normal;letter-spacing:-.5px}.banner-wrapper[_ngcontent-%COMP%]   .content-data-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#fff;font-family:Open Sans;font-size:20px;font-style:normal;font-weight:500;line-height:29px;text-align:center}.banner-wrapper[_ngcontent-%COMP%]   .content-data-info[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;padding:15px 24px;justify-content:center;align-items:center;gap:10px;border-radius:60px;background:#fff;color:#2c2c2c;font-family:Open Sans;font-size:16px;font-style:normal;font-weight:700;line-height:normal;border:0}',
    ],
  });
};
function Uc(t) {
  t || (Wl(Uc), (t = y(Cr)));
  let n = new Q((e) => t.onDestroy(e.next.bind(e)));
  return (e) => e.pipe(Vt(n));
}
var lb = (() => {
    class t {
      constructor(e, i) {
        (this._renderer = e),
          (this._elementRef = i),
          (this.onChange = (r) => {}),
          (this.onTouched = () => {});
      }
      setProperty(e, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, e, i);
      }
      registerOnTouched(e) {
        this.onTouched = e;
      }
      registerOnChange(e) {
        this.onChange = e;
      }
      setDisabledState(e) {
        this.setProperty('disabled', e);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(k(Ni), k(Ne));
        };
      }
      static {
        this.ɵdir = le({ type: t });
      }
    }
    return t;
  })(),
  cb = (() => {
    class t extends lb {
      static {
        this.ɵfac = (() => {
          let e;
          return function (r) {
            return (e || (e = Ht(t)))(r || t);
          };
        })();
      }
      static {
        this.ɵdir = le({ type: t, features: [xt] });
      }
    }
    return t;
  })(),
  tm = new F('');
var lN = { provide: tm, useExisting: nn(() => jn), multi: !0 };
function cN() {
  let t = ri() ? ri().getUserAgent() : '';
  return /android (\d+)/.test(t.toLowerCase());
}
var uN = new F(''),
  jn = (() => {
    class t extends lb {
      constructor(e, i, r) {
        super(e, i),
          (this._compositionMode = r),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !cN());
      }
      writeValue(e) {
        let i = e ?? '';
        this.setProperty('value', i);
      }
      _handleInput(e) {
        (!this._compositionMode || (this._compositionMode && !this._composing)) && this.onChange(e);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(e) {
        (this._composing = !1), this._compositionMode && this.onChange(e);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(k(Ni), k(Ne), k(uN, 8));
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [
            ['input', 'formControlName', '', 3, 'type', 'checkbox'],
            ['textarea', 'formControlName', ''],
            ['input', 'formControl', '', 3, 'type', 'checkbox'],
            ['textarea', 'formControl', ''],
            ['input', 'ngModel', '', 3, 'type', 'checkbox'],
            ['textarea', 'ngModel', ''],
            ['', 'ngDefaultControl', ''],
          ],
          hostBindings: function (i, r) {
            i & 1 &&
              Z('input', function (s) {
                return r._handleInput(s.target.value);
              })('blur', function () {
                return r.onTouched();
              })('compositionstart', function () {
                return r._compositionStart();
              })('compositionend', function (s) {
                return r._compositionEnd(s.target.value);
              });
          },
          features: [At([lN]), xt],
        });
      }
    }
    return t;
  })();
function ji(t) {
  return t == null || ((typeof t == 'string' || Array.isArray(t)) && t.length === 0);
}
function ub(t) {
  return t != null && typeof t.length == 'number';
}
var Yc = new F(''),
  nm = new F(''),
  dN =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  se = class {
    static min(n) {
      return fN(n);
    }
    static max(n) {
      return hN(n);
    }
    static required(n) {
      return db(n);
    }
    static requiredTrue(n) {
      return pN(n);
    }
    static email(n) {
      return mN(n);
    }
    static minLength(n) {
      return gN(n);
    }
    static maxLength(n) {
      return vN(n);
    }
    static pattern(n) {
      return _N(n);
    }
    static nullValidator(n) {
      return Gc(n);
    }
    static compose(n) {
      return vb(n);
    }
    static composeAsync(n) {
      return _b(n);
    }
  };
function fN(t) {
  return (n) => {
    if (ji(n.value) || ji(t)) return null;
    let e = parseFloat(n.value);
    return !isNaN(e) && e < t ? { min: { min: t, actual: n.value } } : null;
  };
}
function hN(t) {
  return (n) => {
    if (ji(n.value) || ji(t)) return null;
    let e = parseFloat(n.value);
    return !isNaN(e) && e > t ? { max: { max: t, actual: n.value } } : null;
  };
}
function db(t) {
  return ji(t.value) ? { required: !0 } : null;
}
function pN(t) {
  return t.value === !0 ? null : { required: !0 };
}
function mN(t) {
  return ji(t.value) || dN.test(t.value) ? null : { email: !0 };
}
function gN(t) {
  return (n) =>
    ji(n.value) || !ub(n.value)
      ? null
      : n.value.length < t
        ? { minlength: { requiredLength: t, actualLength: n.value.length } }
        : null;
}
function vN(t) {
  return (n) =>
    ub(n.value) && n.value.length > t
      ? { maxlength: { requiredLength: t, actualLength: n.value.length } }
      : null;
}
function _N(t) {
  if (!t) return Gc;
  let n, e;
  return (
    typeof t == 'string'
      ? ((e = ''),
        t.charAt(0) !== '^' && (e += '^'),
        (e += t),
        t.charAt(t.length - 1) !== '$' && (e += '$'),
        (n = new RegExp(e)))
      : ((e = t.toString()), (n = t)),
    (i) => {
      if (ji(i.value)) return null;
      let r = i.value;
      return n.test(r) ? null : { pattern: { requiredPattern: e, actualValue: r } };
    }
  );
}
function Gc(t) {
  return null;
}
function fb(t) {
  return t != null;
}
function hb(t) {
  return Sr(t) ? Me(t) : t;
}
function pb(t) {
  let n = {};
  return (
    t.forEach((e) => {
      n = e != null ? E(E({}, n), e) : n;
    }),
    Object.keys(n).length === 0 ? null : n
  );
}
function mb(t, n) {
  return n.map((e) => e(t));
}
function yN(t) {
  return !t.validate;
}
function gb(t) {
  return t.map((n) => (yN(n) ? n : (e) => n.validate(e)));
}
function vb(t) {
  if (!t) return null;
  let n = t.filter(fb);
  return n.length == 0
    ? null
    : function (e) {
        return pb(mb(e, n));
      };
}
function im(t) {
  return t != null ? vb(gb(t)) : null;
}
function _b(t) {
  if (!t) return null;
  let n = t.filter(fb);
  return n.length == 0
    ? null
    : function (e) {
        let i = mb(e, n).map(hb);
        return os(i).pipe(z(pb));
      };
}
function rm(t) {
  return t != null ? _b(gb(t)) : null;
}
function tb(t, n) {
  return t === null ? [n] : Array.isArray(t) ? [...t, n] : [t, n];
}
function yb(t) {
  return t._rawValidators;
}
function bb(t) {
  return t._rawAsyncValidators;
}
function Zp(t) {
  return t ? (Array.isArray(t) ? t : [t]) : [];
}
function zc(t, n) {
  return Array.isArray(t) ? t.includes(n) : t === n;
}
function nb(t, n) {
  let e = Zp(n);
  return (
    Zp(t).forEach((r) => {
      zc(e, r) || e.push(r);
    }),
    e
  );
}
function ib(t, n) {
  return Zp(n).filter((e) => !zc(t, e));
}
var Wc = class {
    constructor() {
      (this._rawValidators = []), (this._rawAsyncValidators = []), (this._onDestroyCallbacks = []);
    }
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _setValidators(n) {
      (this._rawValidators = n || []), (this._composedValidatorFn = im(this._rawValidators));
    }
    _setAsyncValidators(n) {
      (this._rawAsyncValidators = n || []),
        (this._composedAsyncValidatorFn = rm(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _registerOnDestroy(n) {
      this._onDestroyCallbacks.push(n);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((n) => n()), (this._onDestroyCallbacks = []);
    }
    reset(n = void 0) {
      this.control && this.control.reset(n);
    }
    hasError(n, e) {
      return this.control ? this.control.hasError(n, e) : !1;
    }
    getError(n, e) {
      return this.control ? this.control.getError(n, e) : null;
    }
  },
  Bi = class extends Wc {
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  Lo = class extends Wc {
    constructor() {
      super(...arguments), (this._parent = null), (this.name = null), (this.valueAccessor = null);
    }
  },
  qc = class {
    constructor(n) {
      this._cd = n;
    }
    get isTouched() {
      return this._cd?.control?._touched?.(), !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return this._cd?.control?._pristine?.(), !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return this._cd?.control?._status?.(), !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return this._cd?._submitted?.(), !!this._cd?.submitted;
    }
  },
  bN = {
    '[class.ng-untouched]': 'isUntouched',
    '[class.ng-touched]': 'isTouched',
    '[class.ng-pristine]': 'isPristine',
    '[class.ng-dirty]': 'isDirty',
    '[class.ng-valid]': 'isValid',
    '[class.ng-invalid]': 'isInvalid',
    '[class.ng-pending]': 'isPending',
  },
  SL = ee(E({}, bN), { '[class.ng-submitted]': 'isSubmitted' }),
  $i = (() => {
    class t extends qc {
      constructor(e) {
        super(e);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(k(Lo, 2));
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [
            ['', 'formControlName', ''],
            ['', 'ngModel', ''],
            ['', 'formControl', ''],
          ],
          hostVars: 14,
          hostBindings: function (i, r) {
            i & 2 &&
              Nt('ng-untouched', r.isUntouched)('ng-touched', r.isTouched)(
                'ng-pristine',
                r.isPristine,
              )('ng-dirty', r.isDirty)('ng-valid', r.isValid)('ng-invalid', r.isInvalid)(
                'ng-pending',
                r.isPending,
              );
          },
          features: [xt],
        });
      }
    }
    return t;
  })(),
  Bn = (() => {
    class t extends qc {
      constructor(e) {
        super(e);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(k(Bi, 10));
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [
            ['', 'formGroupName', ''],
            ['', 'formArrayName', ''],
            ['', 'ngModelGroup', ''],
            ['', 'formGroup', ''],
            ['form', 3, 'ngNoForm', ''],
            ['', 'ngForm', ''],
          ],
          hostVars: 16,
          hostBindings: function (i, r) {
            i & 2 &&
              Nt('ng-untouched', r.isUntouched)('ng-touched', r.isTouched)(
                'ng-pristine',
                r.isPristine,
              )('ng-dirty', r.isDirty)('ng-valid', r.isValid)('ng-invalid', r.isInvalid)(
                'ng-pending',
                r.isPending,
              )('ng-submitted', r.isSubmitted);
          },
          features: [xt],
        });
      }
    }
    return t;
  })();
var ea = 'VALID',
  $c = 'INVALID',
  Fo = 'PENDING',
  ta = 'DISABLED',
  Ui = class {},
  Qc = class extends Ui {
    constructor(n, e) {
      super(), (this.value = n), (this.source = e);
    }
  },
  ia = class extends Ui {
    constructor(n, e) {
      super(), (this.pristine = n), (this.source = e);
    }
  },
  ra = class extends Ui {
    constructor(n, e) {
      super(), (this.touched = n), (this.source = e);
    }
  },
  ko = class extends Ui {
    constructor(n, e) {
      super(), (this.status = n), (this.source = e);
    }
  },
  Kp = class extends Ui {
    constructor(n) {
      super(), (this.source = n);
    }
  },
  Yp = class extends Ui {
    constructor(n) {
      super(), (this.source = n);
    }
  };
function om(t) {
  return (Jc(t) ? t.validators : t) || null;
}
function CN(t) {
  return Array.isArray(t) ? im(t) : t || null;
}
function sm(t, n) {
  return (Jc(n) ? n.asyncValidators : t) || null;
}
function wN(t) {
  return Array.isArray(t) ? rm(t) : t || null;
}
function Jc(t) {
  return t != null && !Array.isArray(t) && typeof t == 'object';
}
function Cb(t, n, e) {
  let i = t.controls;
  if (!(n ? Object.keys(i) : i).length) throw new T(1e3, '');
  if (!i[e]) throw new T(1001, '');
}
function wb(t, n, e) {
  t._forEachChild((i, r) => {
    if (e[r] === void 0) throw new T(1002, '');
  });
}
var Vo = class {
    constructor(n, e) {
      (this._pendingDirty = !1),
        (this._hasOwnPendingAsyncValidator = null),
        (this._pendingTouched = !1),
        (this._onCollectionChange = () => {}),
        (this._parent = null),
        (this._status = Er(() => this.statusReactive())),
        (this.statusReactive = Gt(void 0)),
        (this._pristine = Er(() => this.pristineReactive())),
        (this.pristineReactive = Gt(!0)),
        (this._touched = Er(() => this.touchedReactive())),
        (this.touchedReactive = Gt(!1)),
        (this._events = new de()),
        (this.events = this._events.asObservable()),
        (this._onDisabledChange = []),
        this._assignValidators(n),
        this._assignAsyncValidators(e);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(n) {
      this._rawValidators = this._composedValidatorFn = n;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(n) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = n;
    }
    get parent() {
      return this._parent;
    }
    get status() {
      return un(this.statusReactive);
    }
    set status(n) {
      un(() => this.statusReactive.set(n));
    }
    get valid() {
      return this.status === ea;
    }
    get invalid() {
      return this.status === $c;
    }
    get pending() {
      return this.status == Fo;
    }
    get disabled() {
      return this.status === ta;
    }
    get enabled() {
      return this.status !== ta;
    }
    get pristine() {
      return un(this.pristineReactive);
    }
    set pristine(n) {
      un(() => this.pristineReactive.set(n));
    }
    get dirty() {
      return !this.pristine;
    }
    get touched() {
      return un(this.touchedReactive);
    }
    set touched(n) {
      un(() => this.touchedReactive.set(n));
    }
    get untouched() {
      return !this.touched;
    }
    get updateOn() {
      return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : 'change';
    }
    setValidators(n) {
      this._assignValidators(n);
    }
    setAsyncValidators(n) {
      this._assignAsyncValidators(n);
    }
    addValidators(n) {
      this.setValidators(nb(n, this._rawValidators));
    }
    addAsyncValidators(n) {
      this.setAsyncValidators(nb(n, this._rawAsyncValidators));
    }
    removeValidators(n) {
      this.setValidators(ib(n, this._rawValidators));
    }
    removeAsyncValidators(n) {
      this.setAsyncValidators(ib(n, this._rawAsyncValidators));
    }
    hasValidator(n) {
      return zc(this._rawValidators, n);
    }
    hasAsyncValidator(n) {
      return zc(this._rawAsyncValidators, n);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(n = {}) {
      let e = this.touched === !1;
      this.touched = !0;
      let i = n.sourceControl ?? this;
      this._parent && !n.onlySelf && this._parent.markAsTouched(ee(E({}, n), { sourceControl: i })),
        e && n.emitEvent !== !1 && this._events.next(new ra(!0, i));
    }
    markAllAsTouched(n = {}) {
      this.markAsTouched({
        onlySelf: !0,
        emitEvent: n.emitEvent,
        sourceControl: this,
      }),
        this._forEachChild((e) => e.markAllAsTouched(n));
    }
    markAsUntouched(n = {}) {
      let e = this.touched === !0;
      (this.touched = !1), (this._pendingTouched = !1);
      let i = n.sourceControl ?? this;
      this._forEachChild((r) => {
        r.markAsUntouched({
          onlySelf: !0,
          emitEvent: n.emitEvent,
          sourceControl: i,
        });
      }),
        this._parent && !n.onlySelf && this._parent._updateTouched(n, i),
        e && n.emitEvent !== !1 && this._events.next(new ra(!1, i));
    }
    markAsDirty(n = {}) {
      let e = this.pristine === !0;
      this.pristine = !1;
      let i = n.sourceControl ?? this;
      this._parent && !n.onlySelf && this._parent.markAsDirty(ee(E({}, n), { sourceControl: i })),
        e && n.emitEvent !== !1 && this._events.next(new ia(!1, i));
    }
    markAsPristine(n = {}) {
      let e = this.pristine === !1;
      (this.pristine = !0), (this._pendingDirty = !1);
      let i = n.sourceControl ?? this;
      this._forEachChild((r) => {
        r.markAsPristine({ onlySelf: !0, emitEvent: n.emitEvent });
      }),
        this._parent && !n.onlySelf && this._parent._updatePristine(n, i),
        e && n.emitEvent !== !1 && this._events.next(new ia(!0, i));
    }
    markAsPending(n = {}) {
      this.status = Fo;
      let e = n.sourceControl ?? this;
      n.emitEvent !== !1 &&
        (this._events.next(new ko(this.status, e)), this.statusChanges.emit(this.status)),
        this._parent &&
          !n.onlySelf &&
          this._parent.markAsPending(ee(E({}, n), { sourceControl: e }));
    }
    disable(n = {}) {
      let e = this._parentMarkedDirty(n.onlySelf);
      (this.status = ta),
        (this.errors = null),
        this._forEachChild((r) => {
          r.disable(ee(E({}, n), { onlySelf: !0 }));
        }),
        this._updateValue();
      let i = n.sourceControl ?? this;
      n.emitEvent !== !1 &&
        (this._events.next(new Qc(this.value, i)),
        this._events.next(new ko(this.status, i)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._updateAncestors(ee(E({}, n), { skipPristineCheck: e }), this),
        this._onDisabledChange.forEach((r) => r(!0));
    }
    enable(n = {}) {
      let e = this._parentMarkedDirty(n.onlySelf);
      (this.status = ea),
        this._forEachChild((i) => {
          i.enable(ee(E({}, n), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: n.emitEvent }),
        this._updateAncestors(ee(E({}, n), { skipPristineCheck: e }), this),
        this._onDisabledChange.forEach((i) => i(!1));
    }
    _updateAncestors(n, e) {
      this._parent &&
        !n.onlySelf &&
        (this._parent.updateValueAndValidity(n),
        n.skipPristineCheck || this._parent._updatePristine({}, e),
        this._parent._updateTouched({}, e));
    }
    setParent(n) {
      this._parent = n;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(n = {}) {
      if ((this._setInitialStatus(), this._updateValue(), this.enabled)) {
        let i = this._cancelExistingSubscription();
        (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === ea || this.status === Fo) && this._runAsyncValidator(i, n.emitEvent);
      }
      let e = n.sourceControl ?? this;
      n.emitEvent !== !1 &&
        (this._events.next(new Qc(this.value, e)),
        this._events.next(new ko(this.status, e)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !n.onlySelf &&
          this._parent.updateValueAndValidity(ee(E({}, n), { sourceControl: e }));
    }
    _updateTreeValidity(n = { emitEvent: !0 }) {
      this._forEachChild((e) => e._updateTreeValidity(n)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: n.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? ta : ea;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(n, e) {
      if (this.asyncValidator) {
        (this.status = Fo), (this._hasOwnPendingAsyncValidator = { emitEvent: e !== !1 });
        let i = hb(this.asyncValidator(this));
        this._asyncValidationSubscription = i.subscribe((r) => {
          (this._hasOwnPendingAsyncValidator = null),
            this.setErrors(r, { emitEvent: e, shouldHaveEmitted: n });
        });
      }
    }
    _cancelExistingSubscription() {
      if (this._asyncValidationSubscription) {
        this._asyncValidationSubscription.unsubscribe();
        let n = this._hasOwnPendingAsyncValidator?.emitEvent ?? !1;
        return (this._hasOwnPendingAsyncValidator = null), n;
      }
      return !1;
    }
    setErrors(n, e = {}) {
      (this.errors = n), this._updateControlsErrors(e.emitEvent !== !1, this, e.shouldHaveEmitted);
    }
    get(n) {
      let e = n;
      return e == null || (Array.isArray(e) || (e = e.split('.')), e.length === 0)
        ? null
        : e.reduce((i, r) => i && i._find(r), this);
    }
    getError(n, e) {
      let i = e ? this.get(e) : this;
      return i && i.errors ? i.errors[n] : null;
    }
    hasError(n, e) {
      return !!this.getError(n, e);
    }
    get root() {
      let n = this;
      for (; n._parent; ) n = n._parent;
      return n;
    }
    _updateControlsErrors(n, e, i) {
      (this.status = this._calculateStatus()),
        n && this.statusChanges.emit(this.status),
        (n || i) && this._events.next(new ko(this.status, e)),
        this._parent && this._parent._updateControlsErrors(n, e, i);
    }
    _initObservables() {
      (this.valueChanges = new Y()), (this.statusChanges = new Y());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? ta
        : this.errors
          ? $c
          : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Fo)
            ? Fo
            : this._anyControlsHaveStatus($c)
              ? $c
              : ea;
    }
    _anyControlsHaveStatus(n) {
      return this._anyControls((e) => e.status === n);
    }
    _anyControlsDirty() {
      return this._anyControls((n) => n.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((n) => n.touched);
    }
    _updatePristine(n, e) {
      let i = !this._anyControlsDirty(),
        r = this.pristine !== i;
      (this.pristine = i),
        this._parent && !n.onlySelf && this._parent._updatePristine(n, e),
        r && this._events.next(new ia(this.pristine, e));
    }
    _updateTouched(n = {}, e) {
      (this.touched = this._anyControlsTouched()),
        this._events.next(new ra(this.touched, e)),
        this._parent && !n.onlySelf && this._parent._updateTouched(n, e);
    }
    _registerOnCollectionChange(n) {
      this._onCollectionChange = n;
    }
    _setUpdateStrategy(n) {
      Jc(n) && n.updateOn != null && (this._updateOn = n.updateOn);
    }
    _parentMarkedDirty(n) {
      let e = this._parent && this._parent.dirty;
      return !n && !!e && !this._parent._anyControlsDirty();
    }
    _find(n) {
      return null;
    }
    _assignValidators(n) {
      (this._rawValidators = Array.isArray(n) ? n.slice() : n),
        (this._composedValidatorFn = CN(this._rawValidators));
    }
    _assignAsyncValidators(n) {
      (this._rawAsyncValidators = Array.isArray(n) ? n.slice() : n),
        (this._composedAsyncValidatorFn = wN(this._rawAsyncValidators));
    }
  },
  jo = class extends Vo {
    constructor(n, e, i) {
      super(om(e), sm(i, e)),
        (this.controls = n),
        this._initObservables(),
        this._setUpdateStrategy(e),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    registerControl(n, e) {
      return this.controls[n]
        ? this.controls[n]
        : ((this.controls[n] = e),
          e.setParent(this),
          e._registerOnCollectionChange(this._onCollectionChange),
          e);
    }
    addControl(n, e, i = {}) {
      this.registerControl(n, e),
        this.updateValueAndValidity({ emitEvent: i.emitEvent }),
        this._onCollectionChange();
    }
    removeControl(n, e = {}) {
      this.controls[n] && this.controls[n]._registerOnCollectionChange(() => {}),
        delete this.controls[n],
        this.updateValueAndValidity({ emitEvent: e.emitEvent }),
        this._onCollectionChange();
    }
    setControl(n, e, i = {}) {
      this.controls[n] && this.controls[n]._registerOnCollectionChange(() => {}),
        delete this.controls[n],
        e && this.registerControl(n, e),
        this.updateValueAndValidity({ emitEvent: i.emitEvent }),
        this._onCollectionChange();
    }
    contains(n) {
      return this.controls.hasOwnProperty(n) && this.controls[n].enabled;
    }
    setValue(n, e = {}) {
      wb(this, !0, n),
        Object.keys(n).forEach((i) => {
          Cb(this, !0, i),
            this.controls[i].setValue(n[i], {
              onlySelf: !0,
              emitEvent: e.emitEvent,
            });
        }),
        this.updateValueAndValidity(e);
    }
    patchValue(n, e = {}) {
      n != null &&
        (Object.keys(n).forEach((i) => {
          let r = this.controls[i];
          r && r.patchValue(n[i], { onlySelf: !0, emitEvent: e.emitEvent });
        }),
        this.updateValueAndValidity(e));
    }
    reset(n = {}, e = {}) {
      this._forEachChild((i, r) => {
        i.reset(n ? n[r] : null, { onlySelf: !0, emitEvent: e.emitEvent });
      }),
        this._updatePristine(e, this),
        this._updateTouched(e, this),
        this.updateValueAndValidity(e);
    }
    getRawValue() {
      return this._reduceChildren({}, (n, e, i) => ((n[i] = e.getRawValue()), n));
    }
    _syncPendingControls() {
      let n = this._reduceChildren(!1, (e, i) => (i._syncPendingControls() ? !0 : e));
      return n && this.updateValueAndValidity({ onlySelf: !0 }), n;
    }
    _forEachChild(n) {
      Object.keys(this.controls).forEach((e) => {
        let i = this.controls[e];
        i && n(i, e);
      });
    }
    _setUpControls() {
      this._forEachChild((n) => {
        n.setParent(this), n._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(n) {
      for (let [e, i] of Object.entries(this.controls)) if (this.contains(e) && n(i)) return !0;
      return !1;
    }
    _reduceValue() {
      let n = {};
      return this._reduceChildren(
        n,
        (e, i, r) => ((i.enabled || this.disabled) && (e[r] = i.value), e),
      );
    }
    _reduceChildren(n, e) {
      let i = n;
      return (
        this._forEachChild((r, o) => {
          i = e(i, r, o);
        }),
        i
      );
    }
    _allControlsDisabled() {
      for (let n of Object.keys(this.controls)) if (this.controls[n].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(n) {
      return this.controls.hasOwnProperty(n) ? this.controls[n] : null;
    }
  };
var Jp = class extends jo {};
var oa = new F('CallSetDisabledState', {
    providedIn: 'root',
    factory: () => sa,
  }),
  sa = 'always';
function DN(t, n) {
  return [...n.path, t];
}
function Xp(t, n, e = sa) {
  am(t, n),
    n.valueAccessor.writeValue(t.value),
    (t.disabled || e === 'always') && n.valueAccessor.setDisabledState?.(t.disabled),
    EN(t, n),
    MN(t, n),
    TN(t, n),
    SN(t, n);
}
function rb(t, n, e = !0) {
  let i = () => {};
  n.valueAccessor && (n.valueAccessor.registerOnChange(i), n.valueAccessor.registerOnTouched(i)),
    Kc(t, n),
    t && (n._invokeOnDestroyCallbacks(), t._registerOnCollectionChange(() => {}));
}
function Zc(t, n) {
  t.forEach((e) => {
    e.registerOnValidatorChange && e.registerOnValidatorChange(n);
  });
}
function SN(t, n) {
  if (n.valueAccessor.setDisabledState) {
    let e = (i) => {
      n.valueAccessor.setDisabledState(i);
    };
    t.registerOnDisabledChange(e),
      n._registerOnDestroy(() => {
        t._unregisterOnDisabledChange(e);
      });
  }
}
function am(t, n) {
  let e = yb(t);
  n.validator !== null
    ? t.setValidators(tb(e, n.validator))
    : typeof e == 'function' && t.setValidators([e]);
  let i = bb(t);
  n.asyncValidator !== null
    ? t.setAsyncValidators(tb(i, n.asyncValidator))
    : typeof i == 'function' && t.setAsyncValidators([i]);
  let r = () => t.updateValueAndValidity();
  Zc(n._rawValidators, r), Zc(n._rawAsyncValidators, r);
}
function Kc(t, n) {
  let e = !1;
  if (t !== null) {
    if (n.validator !== null) {
      let r = yb(t);
      if (Array.isArray(r) && r.length > 0) {
        let o = r.filter((s) => s !== n.validator);
        o.length !== r.length && ((e = !0), t.setValidators(o));
      }
    }
    if (n.asyncValidator !== null) {
      let r = bb(t);
      if (Array.isArray(r) && r.length > 0) {
        let o = r.filter((s) => s !== n.asyncValidator);
        o.length !== r.length && ((e = !0), t.setAsyncValidators(o));
      }
    }
  }
  let i = () => {};
  return Zc(n._rawValidators, i), Zc(n._rawAsyncValidators, i), e;
}
function EN(t, n) {
  n.valueAccessor.registerOnChange((e) => {
    (t._pendingValue = e),
      (t._pendingChange = !0),
      (t._pendingDirty = !0),
      t.updateOn === 'change' && Db(t, n);
  });
}
function TN(t, n) {
  n.valueAccessor.registerOnTouched(() => {
    (t._pendingTouched = !0),
      t.updateOn === 'blur' && t._pendingChange && Db(t, n),
      t.updateOn !== 'submit' && t.markAsTouched();
  });
}
function Db(t, n) {
  t._pendingDirty && t.markAsDirty(),
    t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
    n.viewToModelUpdate(t._pendingValue),
    (t._pendingChange = !1);
}
function MN(t, n) {
  let e = (i, r) => {
    n.valueAccessor.writeValue(i), r && n.viewToModelUpdate(i);
  };
  t.registerOnChange(e),
    n._registerOnDestroy(() => {
      t._unregisterOnChange(e);
    });
}
function Sb(t, n) {
  t == null, am(t, n);
}
function IN(t, n) {
  return Kc(t, n);
}
function xN(t, n) {
  if (!t.hasOwnProperty('model')) return !1;
  let e = t.model;
  return e.isFirstChange() ? !0 : !Object.is(n, e.currentValue);
}
function NN(t) {
  return Object.getPrototypeOf(t.constructor) === cb;
}
function Eb(t, n) {
  t._syncPendingControls(),
    n.forEach((e) => {
      let i = e.control;
      i.updateOn === 'submit' &&
        i._pendingChange &&
        (e.viewToModelUpdate(i._pendingValue), (i._pendingChange = !1));
    });
}
function AN(t, n) {
  if (!n) return null;
  Array.isArray(n);
  let e, i, r;
  return (
    n.forEach((o) => {
      o.constructor === jn ? (e = o) : NN(o) ? (i = o) : (r = o);
    }),
    r || i || e || null
  );
}
function ON(t, n) {
  let e = t.indexOf(n);
  e > -1 && t.splice(e, 1);
}
var RN = { provide: Bi, useExisting: nn(() => lm) },
  na = Promise.resolve(),
  lm = (() => {
    class t extends Bi {
      get submitted() {
        return un(this.submittedReactive);
      }
      constructor(e, i, r) {
        super(),
          (this.callSetDisabledState = r),
          (this._submitted = Er(() => this.submittedReactive())),
          (this.submittedReactive = Gt(!1)),
          (this._directives = new Set()),
          (this.ngSubmit = new Y()),
          (this.form = new jo({}, im(e), rm(i)));
      }
      ngAfterViewInit() {
        this._setUpdateStrategy();
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      get controls() {
        return this.form.controls;
      }
      addControl(e) {
        na.then(() => {
          let i = this._findContainer(e.path);
          (e.control = i.registerControl(e.name, e.control)),
            Xp(e.control, e, this.callSetDisabledState),
            e.control.updateValueAndValidity({ emitEvent: !1 }),
            this._directives.add(e);
        });
      }
      getControl(e) {
        return this.form.get(e.path);
      }
      removeControl(e) {
        na.then(() => {
          let i = this._findContainer(e.path);
          i && i.removeControl(e.name), this._directives.delete(e);
        });
      }
      addFormGroup(e) {
        na.then(() => {
          let i = this._findContainer(e.path),
            r = new jo({});
          Sb(r, e), i.registerControl(e.name, r), r.updateValueAndValidity({ emitEvent: !1 });
        });
      }
      removeFormGroup(e) {
        na.then(() => {
          let i = this._findContainer(e.path);
          i && i.removeControl(e.name);
        });
      }
      getFormGroup(e) {
        return this.form.get(e.path);
      }
      updateModel(e, i) {
        na.then(() => {
          this.form.get(e.path).setValue(i);
        });
      }
      setValue(e) {
        this.control.setValue(e);
      }
      onSubmit(e) {
        return (
          this.submittedReactive.set(!0),
          Eb(this.form, this._directives),
          this.ngSubmit.emit(e),
          e?.target?.method === 'dialog'
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(e = void 0) {
        this.form.reset(e), this.submittedReactive.set(!1);
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.form._updateOn = this.options.updateOn);
      }
      _findContainer(e) {
        return e.pop(), e.length ? this.form.get(e) : this.form;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(k(Yc, 10), k(nm, 10), k(oa, 8));
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [
            ['form', 3, 'ngNoForm', '', 3, 'formGroup', ''],
            ['ng-form'],
            ['', 'ngForm', ''],
          ],
          hostBindings: function (i, r) {
            i & 1 &&
              Z('submit', function (s) {
                return r.onSubmit(s);
              })('reset', function () {
                return r.onReset();
              });
          },
          inputs: { options: [0, 'ngFormOptions', 'options'] },
          outputs: { ngSubmit: 'ngSubmit' },
          exportAs: ['ngForm'],
          features: [At([RN]), xt],
        });
      }
    }
    return t;
  })();
function ob(t, n) {
  let e = t.indexOf(n);
  e > -1 && t.splice(e, 1);
}
function sb(t) {
  return (
    typeof t == 'object' &&
    t !== null &&
    Object.keys(t).length === 2 &&
    'value' in t &&
    'disabled' in t
  );
}
var Hc = class extends Vo {
  constructor(n = null, e, i) {
    super(om(e), sm(i, e)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(n),
      this._setUpdateStrategy(e),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      Jc(e) &&
        (e.nonNullable || e.initialValueIsDefault) &&
        (sb(n) ? (this.defaultValue = n.value) : (this.defaultValue = n));
  }
  setValue(n, e = {}) {
    (this.value = this._pendingValue = n),
      this._onChange.length &&
        e.emitModelToViewChange !== !1 &&
        this._onChange.forEach((i) => i(this.value, e.emitViewToModelChange !== !1)),
      this.updateValueAndValidity(e);
  }
  patchValue(n, e = {}) {
    this.setValue(n, e);
  }
  reset(n = this.defaultValue, e = {}) {
    this._applyFormState(n),
      this.markAsPristine(e),
      this.markAsUntouched(e),
      this.setValue(this.value, e),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(n) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(n) {
    this._onChange.push(n);
  }
  _unregisterOnChange(n) {
    ob(this._onChange, n);
  }
  registerOnDisabledChange(n) {
    this._onDisabledChange.push(n);
  }
  _unregisterOnDisabledChange(n) {
    ob(this._onDisabledChange, n);
  }
  _forEachChild(n) {}
  _syncPendingControls() {
    return this.updateOn === 'submit' &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(n) {
    sb(n)
      ? ((this.value = this._pendingValue = n.value),
        n.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = n);
  }
};
var PN = (t) => t instanceof Hc;
var Un = (() => {
  class t {
    static {
      this.ɵfac = function (i) {
        return new (i || t)();
      };
    }
    static {
      this.ɵdir = le({
        type: t,
        selectors: [['form', 3, 'ngNoForm', '', 3, 'ngNativeValidate', '']],
        hostAttrs: ['novalidate', ''],
      });
    }
  }
  return t;
})();
var FN = { provide: tm, useExisting: nn(() => cm), multi: !0 };
var kN = (() => {
    class t {
      constructor() {
        this._accessors = [];
      }
      add(e, i) {
        this._accessors.push([e, i]);
      }
      remove(e) {
        for (let i = this._accessors.length - 1; i >= 0; --i)
          if (this._accessors[i][1] === e) {
            this._accessors.splice(i, 1);
            return;
          }
      }
      select(e) {
        this._accessors.forEach((i) => {
          this._isSameGroup(i, e) && i[1] !== e && i[1].fireUncheck(e.value);
        });
      }
      _isSameGroup(e, i) {
        return e[0].control ? e[0]._parent === i._control._parent && e[1].name === i.name : !1;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })(),
  cm = (() => {
    class t extends cb {
      constructor(e, i, r, o) {
        super(e, i),
          (this._registry = r),
          (this._injector = o),
          (this.setDisabledStateFired = !1),
          (this.onChange = () => {}),
          (this.callSetDisabledState = y(oa, { optional: !0 }) ?? sa);
      }
      ngOnInit() {
        (this._control = this._injector.get(Lo)),
          this._checkName(),
          this._registry.add(this._control, this);
      }
      ngOnDestroy() {
        this._registry.remove(this);
      }
      writeValue(e) {
        (this._state = e === this.value), this.setProperty('checked', this._state);
      }
      registerOnChange(e) {
        (this._fn = e),
          (this.onChange = () => {
            e(this.value), this._registry.select(this);
          });
      }
      setDisabledState(e) {
        (this.setDisabledStateFired ||
          e ||
          this.callSetDisabledState === 'whenDisabledForLegacyCode') &&
          this.setProperty('disabled', e),
          (this.setDisabledStateFired = !0);
      }
      fireUncheck(e) {
        this.writeValue(e);
      }
      _checkName() {
        this.name && this.formControlName && (this.name, this.formControlName),
          !this.name && this.formControlName && (this.name = this.formControlName);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(k(Ni), k(Ne), k(kN), k(Ge));
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [
            ['input', 'type', 'radio', 'formControlName', ''],
            ['input', 'type', 'radio', 'formControl', ''],
            ['input', 'type', 'radio', 'ngModel', ''],
          ],
          hostBindings: function (i, r) {
            i & 1 &&
              Z('change', function () {
                return r.onChange();
              })('blur', function () {
                return r.onTouched();
              });
          },
          inputs: {
            name: 'name',
            formControlName: 'formControlName',
            value: 'value',
          },
          features: [At([FN]), xt],
        });
      }
    }
    return t;
  })();
var Tb = new F('');
var LN = { provide: Bi, useExisting: nn(() => li) },
  li = (() => {
    class t extends Bi {
      get submitted() {
        return un(this._submittedReactive);
      }
      set submitted(e) {
        this._submittedReactive.set(e);
      }
      constructor(e, i, r) {
        super(),
          (this.callSetDisabledState = r),
          (this._submitted = Er(() => this._submittedReactive())),
          (this._submittedReactive = Gt(!1)),
          (this._onCollectionChange = () => this._updateDomValue()),
          (this.directives = []),
          (this.form = null),
          (this.ngSubmit = new Y()),
          this._setValidators(e),
          this._setAsyncValidators(i);
      }
      ngOnChanges(e) {
        this._checkFormPresent(),
          e.hasOwnProperty('form') &&
            (this._updateValidators(),
            this._updateDomValue(),
            this._updateRegistrations(),
            (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          (Kc(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(e) {
        let i = this.form.get(e.path);
        return (
          Xp(i, e, this.callSetDisabledState),
          i.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(e),
          i
        );
      }
      getControl(e) {
        return this.form.get(e.path);
      }
      removeControl(e) {
        rb(e.control || null, e, !1), ON(this.directives, e);
      }
      addFormGroup(e) {
        this._setUpFormContainer(e);
      }
      removeFormGroup(e) {
        this._cleanUpFormContainer(e);
      }
      getFormGroup(e) {
        return this.form.get(e.path);
      }
      addFormArray(e) {
        this._setUpFormContainer(e);
      }
      removeFormArray(e) {
        this._cleanUpFormContainer(e);
      }
      getFormArray(e) {
        return this.form.get(e.path);
      }
      updateModel(e, i) {
        this.form.get(e.path).setValue(i);
      }
      onSubmit(e) {
        return (
          this._submittedReactive.set(!0),
          Eb(this.form, this.directives),
          this.ngSubmit.emit(e),
          this.form._events.next(new Kp(this.control)),
          e?.target?.method === 'dialog'
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(e = void 0) {
        this.form.reset(e),
          this._submittedReactive.set(!1),
          this.form._events.next(new Yp(this.form));
      }
      _updateDomValue() {
        this.directives.forEach((e) => {
          let i = e.control,
            r = this.form.get(e.path);
          i !== r &&
            (rb(i || null, e), PN(r) && (Xp(r, e, this.callSetDisabledState), (e.control = r)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 });
      }
      _setUpFormContainer(e) {
        let i = this.form.get(e.path);
        Sb(i, e), i.updateValueAndValidity({ emitEvent: !1 });
      }
      _cleanUpFormContainer(e) {
        if (this.form) {
          let i = this.form.get(e.path);
          i && IN(i, e) && i.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
      }
      _updateValidators() {
        am(this.form, this), this._oldForm && Kc(this._oldForm, this);
      }
      _checkFormPresent() {
        this.form;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(k(Yc, 10), k(nm, 10), k(oa, 8));
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['', 'formGroup', '']],
          hostBindings: function (i, r) {
            i & 1 &&
              Z('submit', function (s) {
                return r.onSubmit(s);
              })('reset', function () {
                return r.onReset();
              });
          },
          inputs: { form: [0, 'formGroup', 'form'] },
          outputs: { ngSubmit: 'ngSubmit' },
          exportAs: ['ngForm'],
          features: [At([LN]), xt, on],
        });
      }
    }
    return t;
  })();
var VN = { provide: Lo, useExisting: nn(() => ci) },
  ci = (() => {
    class t extends Lo {
      set isDisabled(e) {}
      static {
        this._ngModelWarningSentOnce = !1;
      }
      constructor(e, i, r, o, s) {
        super(),
          (this._ngModelWarningConfig = s),
          (this._added = !1),
          (this.name = null),
          (this.update = new Y()),
          (this._ngModelWarningSent = !1),
          (this._parent = e),
          this._setValidators(i),
          this._setAsyncValidators(r),
          (this.valueAccessor = AN(this, o));
      }
      ngOnChanges(e) {
        this._added || this._setUpControl(),
          xN(e, this.viewModel) &&
            ((this.viewModel = this.model), this.formDirective.updateModel(this, this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      viewToModelUpdate(e) {
        (this.viewModel = e), this.update.emit(e);
      }
      get path() {
        return DN(this.name == null ? this.name : this.name.toString(), this._parent);
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _checkParentType() {}
      _setUpControl() {
        this._checkParentType(),
          (this.control = this.formDirective.addControl(this)),
          (this._added = !0);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)(k(Bi, 13), k(Yc, 10), k(nm, 10), k(tm, 10), k(Tb, 8));
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['', 'formControlName', '']],
          inputs: {
            name: [0, 'formControlName', 'name'],
            isDisabled: [0, 'disabled', 'isDisabled'],
            model: [0, 'ngModel', 'model'],
          },
          outputs: { update: 'ngModelChange' },
          features: [At([VN]), xt, on],
        });
      }
    }
    return t;
  })();
var jN = (() => {
  class t {
    constructor() {
      this._validator = Gc;
    }
    ngOnChanges(e) {
      if (this.inputName in e) {
        let i = this.normalizeInput(e[this.inputName].currentValue);
        (this._enabled = this.enabled(i)),
          (this._validator = this._enabled ? this.createValidator(i) : Gc),
          this._onChange && this._onChange();
      }
    }
    validate(e) {
      return this._validator(e);
    }
    registerOnValidatorChange(e) {
      this._onChange = e;
    }
    enabled(e) {
      return e != null;
    }
    static {
      this.ɵfac = function (i) {
        return new (i || t)();
      };
    }
    static {
      this.ɵdir = le({ type: t, features: [on] });
    }
  }
  return t;
})();
var BN = { provide: Yc, useExisting: nn(() => um), multi: !0 };
var um = (() => {
  class t extends jN {
    constructor() {
      super(...arguments),
        (this.inputName = 'required'),
        (this.normalizeInput = dc),
        (this.createValidator = (e) => db);
    }
    enabled(e) {
      return e;
    }
    static {
      this.ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Ht(t)))(r || t);
        };
      })();
    }
    static {
      this.ɵdir = le({
        type: t,
        selectors: [
          ['', 'required', '', 'formControlName', '', 3, 'type', 'checkbox'],
          ['', 'required', '', 'formControl', '', 3, 'type', 'checkbox'],
          ['', 'required', '', 'ngModel', '', 3, 'type', 'checkbox'],
        ],
        hostVars: 1,
        hostBindings: function (i, r) {
          i & 2 && St('required', r._enabled ? '' : null);
        },
        inputs: { required: 'required' },
        features: [At([BN]), xt],
      });
    }
  }
  return t;
})();
var Mb = (() => {
    class t {
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵmod = ft({ type: t });
      }
      static {
        this.ɵinj = dt({});
      }
    }
    return t;
  })(),
  em = class extends Vo {
    constructor(n, e, i) {
      super(om(e), sm(i, e)),
        (this.controls = n),
        this._initObservables(),
        this._setUpdateStrategy(e),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    at(n) {
      return this.controls[this._adjustIndex(n)];
    }
    push(n, e = {}) {
      this.controls.push(n),
        this._registerControl(n),
        this.updateValueAndValidity({ emitEvent: e.emitEvent }),
        this._onCollectionChange();
    }
    insert(n, e, i = {}) {
      this.controls.splice(n, 0, e),
        this._registerControl(e),
        this.updateValueAndValidity({ emitEvent: i.emitEvent });
    }
    removeAt(n, e = {}) {
      let i = this._adjustIndex(n);
      i < 0 && (i = 0),
        this.controls[i] && this.controls[i]._registerOnCollectionChange(() => {}),
        this.controls.splice(i, 1),
        this.updateValueAndValidity({ emitEvent: e.emitEvent });
    }
    setControl(n, e, i = {}) {
      let r = this._adjustIndex(n);
      r < 0 && (r = 0),
        this.controls[r] && this.controls[r]._registerOnCollectionChange(() => {}),
        this.controls.splice(r, 1),
        e && (this.controls.splice(r, 0, e), this._registerControl(e)),
        this.updateValueAndValidity({ emitEvent: i.emitEvent }),
        this._onCollectionChange();
    }
    get length() {
      return this.controls.length;
    }
    setValue(n, e = {}) {
      wb(this, !1, n),
        n.forEach((i, r) => {
          Cb(this, !1, r), this.at(r).setValue(i, { onlySelf: !0, emitEvent: e.emitEvent });
        }),
        this.updateValueAndValidity(e);
    }
    patchValue(n, e = {}) {
      n != null &&
        (n.forEach((i, r) => {
          this.at(r) && this.at(r).patchValue(i, { onlySelf: !0, emitEvent: e.emitEvent });
        }),
        this.updateValueAndValidity(e));
    }
    reset(n = [], e = {}) {
      this._forEachChild((i, r) => {
        i.reset(n[r], { onlySelf: !0, emitEvent: e.emitEvent });
      }),
        this._updatePristine(e, this),
        this._updateTouched(e, this),
        this.updateValueAndValidity(e);
    }
    getRawValue() {
      return this.controls.map((n) => n.getRawValue());
    }
    clear(n = {}) {
      this.controls.length < 1 ||
        (this._forEachChild((e) => e._registerOnCollectionChange(() => {})),
        this.controls.splice(0),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }));
    }
    _adjustIndex(n) {
      return n < 0 ? n + this.length : n;
    }
    _syncPendingControls() {
      let n = this.controls.reduce((e, i) => (i._syncPendingControls() ? !0 : e), !1);
      return n && this.updateValueAndValidity({ onlySelf: !0 }), n;
    }
    _forEachChild(n) {
      this.controls.forEach((e, i) => {
        n(e, i);
      });
    }
    _updateValue() {
      this.value = this.controls.filter((n) => n.enabled || this.disabled).map((n) => n.value);
    }
    _anyControls(n) {
      return this.controls.some((e) => e.enabled && n(e));
    }
    _setUpControls() {
      this._forEachChild((n) => this._registerControl(n));
    }
    _allControlsDisabled() {
      for (let n of this.controls) if (n.enabled) return !1;
      return this.controls.length > 0 || this.disabled;
    }
    _registerControl(n) {
      n.setParent(this), n._registerOnCollectionChange(this._onCollectionChange);
    }
    _find(n) {
      return this.at(n) ?? null;
    }
  };
function ab(t) {
  return !!t && (t.asyncValidators !== void 0 || t.validators !== void 0 || t.updateOn !== void 0);
}
var Hi = (() => {
  class t {
    constructor() {
      this.useNonNullable = !1;
    }
    get nonNullable() {
      let e = new t();
      return (e.useNonNullable = !0), e;
    }
    group(e, i = null) {
      let r = this._reduceControls(e),
        o = {};
      return (
        ab(i)
          ? (o = i)
          : i !== null && ((o.validators = i.validator), (o.asyncValidators = i.asyncValidator)),
        new jo(r, o)
      );
    }
    record(e, i = null) {
      let r = this._reduceControls(e);
      return new Jp(r, i);
    }
    control(e, i, r) {
      let o = {};
      return this.useNonNullable
        ? (ab(i) ? (o = i) : ((o.validators = i), (o.asyncValidators = r)),
          new Hc(e, ee(E({}, o), { nonNullable: !0 })))
        : new Hc(e, i, r);
    }
    array(e, i, r) {
      let o = e.map((s) => this._createControl(s));
      return new em(o, i, r);
    }
    _reduceControls(e) {
      let i = {};
      return (
        Object.keys(e).forEach((r) => {
          i[r] = this._createControl(e[r]);
        }),
        i
      );
    }
    _createControl(e) {
      if (e instanceof Hc) return e;
      if (e instanceof Vo) return e;
      if (Array.isArray(e)) {
        let i = e[0],
          r = e.length > 1 ? e[1] : null,
          o = e.length > 2 ? e[2] : null;
        return this.control(i, r, o);
      } else return this.control(e);
    }
    static {
      this.ɵfac = function (i) {
        return new (i || t)();
      };
    }
    static {
      this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
  }
  return t;
})();
var $n = (() => {
    class t {
      static withConfig(e) {
        return {
          ngModule: t,
          providers: [{ provide: oa, useValue: e.callSetDisabledState ?? sa }],
        };
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵmod = ft({ type: t });
      }
      static {
        this.ɵinj = dt({ imports: [Mb] });
      }
    }
    return t;
  })(),
  Gi = (() => {
    class t {
      static withConfig(e) {
        return {
          ngModule: t,
          providers: [
            {
              provide: Tb,
              useValue: e.warnOnNgModelWithFormControl ?? 'always',
            },
            { provide: oa, useValue: e.callSetDisabledState ?? sa },
          ],
        };
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵmod = ft({ type: t });
      }
      static {
        this.ɵinj = dt({ imports: [Mb] });
      }
    }
    return t;
  })();
var Ve = 'top',
  at = 'bottom',
  Je = 'right',
  Qe = 'left',
  Xc = 'auto',
  zi = [Ve, at, Je, Qe],
  ui = 'start',
  Or = 'end',
  Ib = 'clippingParents',
  eu = 'viewport',
  Bo = 'popper',
  xb = 'reference',
  dm = zi.reduce(function (t, n) {
    return t.concat([n + '-' + ui, n + '-' + Or]);
  }, []),
  tu = [].concat(zi, [Xc]).reduce(function (t, n) {
    return t.concat([n, n + '-' + ui, n + '-' + Or]);
  }, []),
  UN = 'beforeRead',
  $N = 'read',
  HN = 'afterRead',
  GN = 'beforeMain',
  zN = 'main',
  WN = 'afterMain',
  qN = 'beforeWrite',
  QN = 'write',
  ZN = 'afterWrite',
  Nb = [UN, $N, HN, GN, zN, WN, qN, QN, ZN];
function Xe(t) {
  return t ? (t.nodeName || '').toLowerCase() : null;
}
function Ee(t) {
  if (t == null) return window;
  if (t.toString() !== '[object Window]') {
    var n = t.ownerDocument;
    return (n && n.defaultView) || window;
  }
  return t;
}
function Wt(t) {
  var n = Ee(t).Element;
  return t instanceof n || t instanceof Element;
}
function Ze(t) {
  var n = Ee(t).HTMLElement;
  return t instanceof n || t instanceof HTMLElement;
}
function Uo(t) {
  if (typeof ShadowRoot > 'u') return !1;
  var n = Ee(t).ShadowRoot;
  return t instanceof n || t instanceof ShadowRoot;
}
function KN(t) {
  var n = t.state;
  Object.keys(n.elements).forEach(function (e) {
    var i = n.styles[e] || {},
      r = n.attributes[e] || {},
      o = n.elements[e];
    !Ze(o) ||
      !Xe(o) ||
      (Object.assign(o.style, i),
      Object.keys(r).forEach(function (s) {
        var a = r[s];
        a === !1 ? o.removeAttribute(s) : o.setAttribute(s, a === !0 ? '' : a);
      }));
  });
}
function YN(t) {
  var n = t.state,
    e = {
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
    Object.assign(n.elements.popper.style, e.popper),
    (n.styles = e),
    n.elements.arrow && Object.assign(n.elements.arrow.style, e.arrow),
    function () {
      Object.keys(n.elements).forEach(function (i) {
        var r = n.elements[i],
          o = n.attributes[i] || {},
          s = Object.keys(n.styles.hasOwnProperty(i) ? n.styles[i] : e[i]),
          a = s.reduce(function (l, c) {
            return (l[c] = ''), l;
          }, {});
        !Ze(r) ||
          !Xe(r) ||
          (Object.assign(r.style, a),
          Object.keys(o).forEach(function (l) {
            r.removeAttribute(l);
          }));
      });
    }
  );
}
var Ab = {
  name: 'applyStyles',
  enabled: !0,
  phase: 'write',
  fn: KN,
  effect: YN,
  requires: ['computeStyles'],
};
function et(t) {
  return t.split('-')[0];
}
var fn = Math.max,
  Rr = Math.min,
  di = Math.round;
function $o() {
  var t = navigator.userAgentData;
  return t != null && t.brands && Array.isArray(t.brands)
    ? t.brands
        .map(function (n) {
          return n.brand + '/' + n.version;
        })
        .join(' ')
    : navigator.userAgent;
}
function la() {
  return !/^((?!chrome|android).)*safari/i.test($o());
}
function qt(t, n, e) {
  n === void 0 && (n = !1), e === void 0 && (e = !1);
  var i = t.getBoundingClientRect(),
    r = 1,
    o = 1;
  n &&
    Ze(t) &&
    ((r = (t.offsetWidth > 0 && di(i.width) / t.offsetWidth) || 1),
    (o = (t.offsetHeight > 0 && di(i.height) / t.offsetHeight) || 1));
  var s = Wt(t) ? Ee(t) : window,
    a = s.visualViewport,
    l = !la() && e,
    c = (i.left + (l && a ? a.offsetLeft : 0)) / r,
    f = (i.top + (l && a ? a.offsetTop : 0)) / o,
    p = i.width / r,
    g = i.height / o;
  return {
    width: p,
    height: g,
    top: f,
    right: c + p,
    bottom: f + g,
    left: c,
    x: c,
    y: f,
  };
}
function Pr(t) {
  var n = qt(t),
    e = t.offsetWidth,
    i = t.offsetHeight;
  return (
    Math.abs(n.width - e) <= 1 && (e = n.width),
    Math.abs(n.height - i) <= 1 && (i = n.height),
    { x: t.offsetLeft, y: t.offsetTop, width: e, height: i }
  );
}
function ca(t, n) {
  var e = n.getRootNode && n.getRootNode();
  if (t.contains(n)) return !0;
  if (e && Uo(e)) {
    var i = n;
    do {
      if (i && t.isSameNode(i)) return !0;
      i = i.parentNode || i.host;
    } while (i);
  }
  return !1;
}
function bt(t) {
  return Ee(t).getComputedStyle(t);
}
function fm(t) {
  return ['table', 'td', 'th'].indexOf(Xe(t)) >= 0;
}
function lt(t) {
  return ((Wt(t) ? t.ownerDocument : t.document) || window.document).documentElement;
}
function fi(t) {
  return Xe(t) === 'html' ? t : t.assignedSlot || t.parentNode || (Uo(t) ? t.host : null) || lt(t);
}
function Ob(t) {
  return !Ze(t) || bt(t).position === 'fixed' ? null : t.offsetParent;
}
function JN(t) {
  var n = /firefox/i.test($o()),
    e = /Trident/i.test($o());
  if (e && Ze(t)) {
    var i = bt(t);
    if (i.position === 'fixed') return null;
  }
  var r = fi(t);
  for (Uo(r) && (r = r.host); Ze(r) && ['html', 'body'].indexOf(Xe(r)) < 0; ) {
    var o = bt(r);
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
function hn(t) {
  for (var n = Ee(t), e = Ob(t); e && fm(e) && bt(e).position === 'static'; ) e = Ob(e);
  return e && (Xe(e) === 'html' || (Xe(e) === 'body' && bt(e).position === 'static'))
    ? n
    : e || JN(t) || n;
}
function Fr(t) {
  return ['top', 'bottom'].indexOf(t) >= 0 ? 'x' : 'y';
}
function kr(t, n, e) {
  return fn(t, Rr(n, e));
}
function Rb(t, n, e) {
  var i = kr(t, n, e);
  return i > e ? e : i;
}
function ua() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
function da(t) {
  return Object.assign({}, ua(), t);
}
function fa(t, n) {
  return n.reduce(function (e, i) {
    return (e[i] = t), e;
  }, {});
}
var XN = function (n, e) {
  return (
    (n = typeof n == 'function' ? n(Object.assign({}, e.rects, { placement: e.placement })) : n),
    da(typeof n != 'number' ? n : fa(n, zi))
  );
};
function eA(t) {
  var n,
    e = t.state,
    i = t.name,
    r = t.options,
    o = e.elements.arrow,
    s = e.modifiersData.popperOffsets,
    a = et(e.placement),
    l = Fr(a),
    c = [Qe, Je].indexOf(a) >= 0,
    f = c ? 'height' : 'width';
  if (!(!o || !s)) {
    var p = XN(r.padding, e),
      g = Pr(o),
      m = l === 'y' ? Ve : Qe,
      v = l === 'y' ? at : Je,
      _ = e.rects.reference[f] + e.rects.reference[l] - s[l] - e.rects.popper[f],
      C = s[l] - e.rects.reference[l],
      S = hn(o),
      O = S ? (l === 'y' ? S.clientHeight || 0 : S.clientWidth || 0) : 0,
      I = _ / 2 - C / 2,
      A = p[m],
      G = O - g[f] - p[v],
      B = O / 2 - g[f] / 2 + I,
      W = kr(A, B, G),
      ce = l;
    e.modifiersData[i] = ((n = {}), (n[ce] = W), (n.centerOffset = W - B), n);
  }
}
function tA(t) {
  var n = t.state,
    e = t.options,
    i = e.element,
    r = i === void 0 ? '[data-popper-arrow]' : i;
  r != null &&
    ((typeof r == 'string' && ((r = n.elements.popper.querySelector(r)), !r)) ||
      (ca(n.elements.popper, r) && (n.elements.arrow = r)));
}
var hm = {
  name: 'arrow',
  enabled: !0,
  phase: 'main',
  fn: eA,
  effect: tA,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow'],
};
function Qt(t) {
  return t.split('-')[1];
}
var nA = { top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' };
function iA(t, n) {
  var e = t.x,
    i = t.y,
    r = n.devicePixelRatio || 1;
  return { x: di(e * r) / r || 0, y: di(i * r) / r || 0 };
}
function Pb(t) {
  var n,
    e = t.popper,
    i = t.popperRect,
    r = t.placement,
    o = t.variation,
    s = t.offsets,
    a = t.position,
    l = t.gpuAcceleration,
    c = t.adaptive,
    f = t.roundOffsets,
    p = t.isFixed,
    g = s.x,
    m = g === void 0 ? 0 : g,
    v = s.y,
    _ = v === void 0 ? 0 : v,
    C = typeof f == 'function' ? f({ x: m, y: _ }) : { x: m, y: _ };
  (m = C.x), (_ = C.y);
  var S = s.hasOwnProperty('x'),
    O = s.hasOwnProperty('y'),
    I = Qe,
    A = Ve,
    G = window;
  if (c) {
    var B = hn(e),
      W = 'clientHeight',
      ce = 'clientWidth';
    if (
      (B === Ee(e) &&
        ((B = lt(e)),
        bt(B).position !== 'static' &&
          a === 'absolute' &&
          ((W = 'scrollHeight'), (ce = 'scrollWidth'))),
      (B = B),
      r === Ve || ((r === Qe || r === Je) && o === Or))
    ) {
      A = at;
      var _e = p && B === G && G.visualViewport ? G.visualViewport.height : B[W];
      (_ -= _e - i.height), (_ *= l ? 1 : -1);
    }
    if (r === Qe || ((r === Ve || r === at) && o === Or)) {
      I = Je;
      var ye = p && B === G && G.visualViewport ? G.visualViewport.width : B[ce];
      (m -= ye - i.width), (m *= l ? 1 : -1);
    }
  }
  var je = Object.assign({ position: a }, c && nA),
    Be = f === !0 ? iA({ x: m, y: _ }, Ee(e)) : { x: m, y: _ };
  if (((m = Be.x), (_ = Be.y), l)) {
    var Ue;
    return Object.assign(
      {},
      je,
      ((Ue = {}),
      (Ue[A] = O ? '0' : ''),
      (Ue[I] = S ? '0' : ''),
      (Ue.transform =
        (G.devicePixelRatio || 1) <= 1
          ? 'translate(' + m + 'px, ' + _ + 'px)'
          : 'translate3d(' + m + 'px, ' + _ + 'px, 0)'),
      Ue),
    );
  }
  return Object.assign(
    {},
    je,
    ((n = {}), (n[A] = O ? _ + 'px' : ''), (n[I] = S ? m + 'px' : ''), (n.transform = ''), n),
  );
}
function rA(t) {
  var n = t.state,
    e = t.options,
    i = e.gpuAcceleration,
    r = i === void 0 ? !0 : i,
    o = e.adaptive,
    s = o === void 0 ? !0 : o,
    a = e.roundOffsets,
    l = a === void 0 ? !0 : a,
    c = {
      placement: et(n.placement),
      variation: Qt(n.placement),
      popper: n.elements.popper,
      popperRect: n.rects.popper,
      gpuAcceleration: r,
      isFixed: n.options.strategy === 'fixed',
    };
  n.modifiersData.popperOffsets != null &&
    (n.styles.popper = Object.assign(
      {},
      n.styles.popper,
      Pb(
        Object.assign({}, c, {
          offsets: n.modifiersData.popperOffsets,
          position: n.options.strategy,
          adaptive: s,
          roundOffsets: l,
        }),
      ),
    )),
    n.modifiersData.arrow != null &&
      (n.styles.arrow = Object.assign(
        {},
        n.styles.arrow,
        Pb(
          Object.assign({}, c, {
            offsets: n.modifiersData.arrow,
            position: 'absolute',
            adaptive: !1,
            roundOffsets: l,
          }),
        ),
      )),
    (n.attributes.popper = Object.assign({}, n.attributes.popper, {
      'data-popper-placement': n.placement,
    }));
}
var Fb = {
  name: 'computeStyles',
  enabled: !0,
  phase: 'beforeWrite',
  fn: rA,
  data: {},
};
var nu = { passive: !0 };
function oA(t) {
  var n = t.state,
    e = t.instance,
    i = t.options,
    r = i.scroll,
    o = r === void 0 ? !0 : r,
    s = i.resize,
    a = s === void 0 ? !0 : s,
    l = Ee(n.elements.popper),
    c = [].concat(n.scrollParents.reference, n.scrollParents.popper);
  return (
    o &&
      c.forEach(function (f) {
        f.addEventListener('scroll', e.update, nu);
      }),
    a && l.addEventListener('resize', e.update, nu),
    function () {
      o &&
        c.forEach(function (f) {
          f.removeEventListener('scroll', e.update, nu);
        }),
        a && l.removeEventListener('resize', e.update, nu);
    }
  );
}
var kb = {
  name: 'eventListeners',
  enabled: !0,
  phase: 'write',
  fn: function () {},
  effect: oA,
  data: {},
};
var sA = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
function Ho(t) {
  return t.replace(/left|right|bottom|top/g, function (n) {
    return sA[n];
  });
}
var aA = { start: 'end', end: 'start' };
function iu(t) {
  return t.replace(/start|end/g, function (n) {
    return aA[n];
  });
}
function Lr(t) {
  var n = Ee(t),
    e = n.pageXOffset,
    i = n.pageYOffset;
  return { scrollLeft: e, scrollTop: i };
}
function Vr(t) {
  return qt(lt(t)).left + Lr(t).scrollLeft;
}
function pm(t, n) {
  var e = Ee(t),
    i = lt(t),
    r = e.visualViewport,
    o = i.clientWidth,
    s = i.clientHeight,
    a = 0,
    l = 0;
  if (r) {
    (o = r.width), (s = r.height);
    var c = la();
    (c || (!c && n === 'fixed')) && ((a = r.offsetLeft), (l = r.offsetTop));
  }
  return { width: o, height: s, x: a + Vr(t), y: l };
}
function mm(t) {
  var n,
    e = lt(t),
    i = Lr(t),
    r = (n = t.ownerDocument) == null ? void 0 : n.body,
    o = fn(e.scrollWidth, e.clientWidth, r ? r.scrollWidth : 0, r ? r.clientWidth : 0),
    s = fn(e.scrollHeight, e.clientHeight, r ? r.scrollHeight : 0, r ? r.clientHeight : 0),
    a = -i.scrollLeft + Vr(t),
    l = -i.scrollTop;
  return (
    bt(r || e).direction === 'rtl' && (a += fn(e.clientWidth, r ? r.clientWidth : 0) - o),
    { width: o, height: s, x: a, y: l }
  );
}
function jr(t) {
  var n = bt(t),
    e = n.overflow,
    i = n.overflowX,
    r = n.overflowY;
  return /auto|scroll|overlay|hidden/.test(e + r + i);
}
function ru(t) {
  return ['html', 'body', '#document'].indexOf(Xe(t)) >= 0
    ? t.ownerDocument.body
    : Ze(t) && jr(t)
      ? t
      : ru(fi(t));
}
function Wi(t, n) {
  var e;
  n === void 0 && (n = []);
  var i = ru(t),
    r = i === ((e = t.ownerDocument) == null ? void 0 : e.body),
    o = Ee(i),
    s = r ? [o].concat(o.visualViewport || [], jr(i) ? i : []) : i,
    a = n.concat(s);
  return r ? a : a.concat(Wi(fi(s)));
}
function Go(t) {
  return Object.assign({}, t, {
    left: t.x,
    top: t.y,
    right: t.x + t.width,
    bottom: t.y + t.height,
  });
}
function lA(t, n) {
  var e = qt(t, !1, n === 'fixed');
  return (
    (e.top = e.top + t.clientTop),
    (e.left = e.left + t.clientLeft),
    (e.bottom = e.top + t.clientHeight),
    (e.right = e.left + t.clientWidth),
    (e.width = t.clientWidth),
    (e.height = t.clientHeight),
    (e.x = e.left),
    (e.y = e.top),
    e
  );
}
function Lb(t, n, e) {
  return n === eu ? Go(pm(t, e)) : Wt(n) ? lA(n, e) : Go(mm(lt(t)));
}
function cA(t) {
  var n = Wi(fi(t)),
    e = ['absolute', 'fixed'].indexOf(bt(t).position) >= 0,
    i = e && Ze(t) ? hn(t) : t;
  return Wt(i)
    ? n.filter(function (r) {
        return Wt(r) && ca(r, i) && Xe(r) !== 'body';
      })
    : [];
}
function gm(t, n, e, i) {
  var r = n === 'clippingParents' ? cA(t) : [].concat(n),
    o = [].concat(r, [e]),
    s = o[0],
    a = o.reduce(
      function (l, c) {
        var f = Lb(t, c, i);
        return (
          (l.top = fn(f.top, l.top)),
          (l.right = Rr(f.right, l.right)),
          (l.bottom = Rr(f.bottom, l.bottom)),
          (l.left = fn(f.left, l.left)),
          l
        );
      },
      Lb(t, s, i),
    );
  return (
    (a.width = a.right - a.left), (a.height = a.bottom - a.top), (a.x = a.left), (a.y = a.top), a
  );
}
function ha(t) {
  var n = t.reference,
    e = t.element,
    i = t.placement,
    r = i ? et(i) : null,
    o = i ? Qt(i) : null,
    s = n.x + n.width / 2 - e.width / 2,
    a = n.y + n.height / 2 - e.height / 2,
    l;
  switch (r) {
    case Ve:
      l = { x: s, y: n.y - e.height };
      break;
    case at:
      l = { x: s, y: n.y + n.height };
      break;
    case Je:
      l = { x: n.x + n.width, y: a };
      break;
    case Qe:
      l = { x: n.x - e.width, y: a };
      break;
    default:
      l = { x: n.x, y: n.y };
  }
  var c = r ? Fr(r) : null;
  if (c != null) {
    var f = c === 'y' ? 'height' : 'width';
    switch (o) {
      case ui:
        l[c] = l[c] - (n[f] / 2 - e[f] / 2);
        break;
      case Or:
        l[c] = l[c] + (n[f] / 2 - e[f] / 2);
        break;
      default:
    }
  }
  return l;
}
function qi(t, n) {
  n === void 0 && (n = {});
  var e = n,
    i = e.placement,
    r = i === void 0 ? t.placement : i,
    o = e.strategy,
    s = o === void 0 ? t.strategy : o,
    a = e.boundary,
    l = a === void 0 ? Ib : a,
    c = e.rootBoundary,
    f = c === void 0 ? eu : c,
    p = e.elementContext,
    g = p === void 0 ? Bo : p,
    m = e.altBoundary,
    v = m === void 0 ? !1 : m,
    _ = e.padding,
    C = _ === void 0 ? 0 : _,
    S = da(typeof C != 'number' ? C : fa(C, zi)),
    O = g === Bo ? xb : Bo,
    I = t.rects.popper,
    A = t.elements[v ? O : g],
    G = gm(Wt(A) ? A : A.contextElement || lt(t.elements.popper), l, f, s),
    B = qt(t.elements.reference),
    W = ha({ reference: B, element: I, strategy: 'absolute', placement: r }),
    ce = Go(Object.assign({}, I, W)),
    _e = g === Bo ? ce : B,
    ye = {
      top: G.top - _e.top + S.top,
      bottom: _e.bottom - G.bottom + S.bottom,
      left: G.left - _e.left + S.left,
      right: _e.right - G.right + S.right,
    },
    je = t.modifiersData.offset;
  if (g === Bo && je) {
    var Be = je[r];
    Object.keys(ye).forEach(function (Ue) {
      var mn = [Je, at].indexOf(Ue) >= 0 ? 1 : -1,
        gn = [Ve, at].indexOf(Ue) >= 0 ? 'y' : 'x';
      ye[Ue] += Be[gn] * mn;
    });
  }
  return ye;
}
function vm(t, n) {
  n === void 0 && (n = {});
  var e = n,
    i = e.placement,
    r = e.boundary,
    o = e.rootBoundary,
    s = e.padding,
    a = e.flipVariations,
    l = e.allowedAutoPlacements,
    c = l === void 0 ? tu : l,
    f = Qt(i),
    p = f
      ? a
        ? dm
        : dm.filter(function (v) {
            return Qt(v) === f;
          })
      : zi,
    g = p.filter(function (v) {
      return c.indexOf(v) >= 0;
    });
  g.length === 0 && (g = p);
  var m = g.reduce(function (v, _) {
    return (v[_] = qi(t, { placement: _, boundary: r, rootBoundary: o, padding: s })[et(_)]), v;
  }, {});
  return Object.keys(m).sort(function (v, _) {
    return m[v] - m[_];
  });
}
function uA(t) {
  if (et(t) === Xc) return [];
  var n = Ho(t);
  return [iu(t), n, iu(n)];
}
function dA(t) {
  var n = t.state,
    e = t.options,
    i = t.name;
  if (!n.modifiersData[i]._skip) {
    for (
      var r = e.mainAxis,
        o = r === void 0 ? !0 : r,
        s = e.altAxis,
        a = s === void 0 ? !0 : s,
        l = e.fallbackPlacements,
        c = e.padding,
        f = e.boundary,
        p = e.rootBoundary,
        g = e.altBoundary,
        m = e.flipVariations,
        v = m === void 0 ? !0 : m,
        _ = e.allowedAutoPlacements,
        C = n.options.placement,
        S = et(C),
        O = S === C,
        I = l || (O || !v ? [Ho(C)] : uA(C)),
        A = [C].concat(I).reduce(function (pe, Kt) {
          return pe.concat(
            et(Kt) === Xc
              ? vm(n, {
                  placement: Kt,
                  boundary: f,
                  rootBoundary: p,
                  padding: c,
                  flipVariations: v,
                  allowedAutoPlacements: _,
                })
              : Kt,
          );
        }, []),
        G = n.rects.reference,
        B = n.rects.popper,
        W = new Map(),
        ce = !0,
        _e = A[0],
        ye = 0;
      ye < A.length;
      ye++
    ) {
      var je = A[ye],
        Be = et(je),
        Ue = Qt(je) === ui,
        mn = [Ve, at].indexOf(Be) >= 0,
        gn = mn ? 'width' : 'height',
        x = qi(n, {
          placement: je,
          boundary: f,
          rootBoundary: p,
          altBoundary: g,
          padding: c,
        }),
        P = mn ? (Ue ? Je : Qe) : Ue ? at : Ve;
      G[gn] > B[gn] && (P = Ho(P));
      var $ = Ho(P),
        X = [];
      if (
        (o && X.push(x[Be] <= 0),
        a && X.push(x[P] <= 0, x[$] <= 0),
        X.every(function (pe) {
          return pe;
        }))
      ) {
        (_e = je), (ce = !1);
        break;
      }
      W.set(je, X);
    }
    if (ce)
      for (
        var Te = v ? 3 : 1,
          Ct = function (Kt) {
            var tr = A.find(function (xe) {
              var ht = W.get(xe);
              if (ht)
                return ht.slice(0, Kt).every(function (ct) {
                  return ct;
                });
            });
            if (tr) return (_e = tr), 'break';
          },
          $e = Te;
        $e > 0;
        $e--
      ) {
        var Tt = Ct($e);
        if (Tt === 'break') break;
      }
    n.placement !== _e && ((n.modifiersData[i]._skip = !0), (n.placement = _e), (n.reset = !0));
  }
}
var _m = {
  name: 'flip',
  enabled: !0,
  phase: 'main',
  fn: dA,
  requiresIfExists: ['offset'],
  data: { _skip: !1 },
};
function fA(t, n, e) {
  var i = et(t),
    r = [Qe, Ve].indexOf(i) >= 0 ? -1 : 1,
    o = typeof e == 'function' ? e(Object.assign({}, n, { placement: t })) : e,
    s = o[0],
    a = o[1];
  return (
    (s = s || 0), (a = (a || 0) * r), [Qe, Je].indexOf(i) >= 0 ? { x: a, y: s } : { x: s, y: a }
  );
}
function hA(t) {
  var n = t.state,
    e = t.options,
    i = t.name,
    r = e.offset,
    o = r === void 0 ? [0, 0] : r,
    s = tu.reduce(function (f, p) {
      return (f[p] = fA(p, n.rects, o)), f;
    }, {}),
    a = s[n.placement],
    l = a.x,
    c = a.y;
  n.modifiersData.popperOffsets != null &&
    ((n.modifiersData.popperOffsets.x += l), (n.modifiersData.popperOffsets.y += c)),
    (n.modifiersData[i] = s);
}
var ym = {
  name: 'offset',
  enabled: !0,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: hA,
};
function pA(t) {
  var n = t.state,
    e = t.name;
  n.modifiersData[e] = ha({
    reference: n.rects.reference,
    element: n.rects.popper,
    strategy: 'absolute',
    placement: n.placement,
  });
}
var Vb = {
  name: 'popperOffsets',
  enabled: !0,
  phase: 'read',
  fn: pA,
  data: {},
};
function bm(t) {
  return t === 'x' ? 'y' : 'x';
}
function mA(t) {
  var n = t.state,
    e = t.options,
    i = t.name,
    r = e.mainAxis,
    o = r === void 0 ? !0 : r,
    s = e.altAxis,
    a = s === void 0 ? !1 : s,
    l = e.boundary,
    c = e.rootBoundary,
    f = e.altBoundary,
    p = e.padding,
    g = e.tether,
    m = g === void 0 ? !0 : g,
    v = e.tetherOffset,
    _ = v === void 0 ? 0 : v,
    C = qi(n, { boundary: l, rootBoundary: c, padding: p, altBoundary: f }),
    S = et(n.placement),
    O = Qt(n.placement),
    I = !O,
    A = Fr(S),
    G = bm(A),
    B = n.modifiersData.popperOffsets,
    W = n.rects.reference,
    ce = n.rects.popper,
    _e = typeof _ == 'function' ? _(Object.assign({}, n.rects, { placement: n.placement })) : _,
    ye =
      typeof _e == 'number'
        ? { mainAxis: _e, altAxis: _e }
        : Object.assign({ mainAxis: 0, altAxis: 0 }, _e),
    je = n.modifiersData.offset ? n.modifiersData.offset[n.placement] : null,
    Be = { x: 0, y: 0 };
  if (B) {
    if (o) {
      var Ue,
        mn = A === 'y' ? Ve : Qe,
        gn = A === 'y' ? at : Je,
        x = A === 'y' ? 'height' : 'width',
        P = B[A],
        $ = P + C[mn],
        X = P - C[gn],
        Te = m ? -ce[x] / 2 : 0,
        Ct = O === ui ? W[x] : ce[x],
        $e = O === ui ? -ce[x] : -W[x],
        Tt = n.elements.arrow,
        pe = m && Tt ? Pr(Tt) : { width: 0, height: 0 },
        Kt = n.modifiersData['arrow#persistent']
          ? n.modifiersData['arrow#persistent'].padding
          : ua(),
        tr = Kt[mn],
        xe = Kt[gn],
        ht = kr(0, W[x], pe[x]),
        ct = I ? W[x] / 2 - Te - ht - tr - ye.mainAxis : Ct - ht - tr - ye.mainAxis,
        Qr = I ? -W[x] / 2 + Te + ht + xe + ye.mainAxis : $e + ht + xe + ye.mainAxis,
        nr = n.elements.arrow && hn(n.elements.arrow),
        WC = nr ? (A === 'y' ? nr.clientTop || 0 : nr.clientLeft || 0) : 0,
        yg = (Ue = je?.[A]) != null ? Ue : 0,
        qC = P + ct - yg - WC,
        QC = P + Qr - yg,
        bg = kr(m ? Rr($, qC) : $, P, m ? fn(X, QC) : X);
      (B[A] = bg), (Be[A] = bg - P);
    }
    if (a) {
      var Cg,
        ZC = A === 'x' ? Ve : Qe,
        KC = A === 'x' ? at : Je,
        ir = B[G],
        Sa = G === 'y' ? 'height' : 'width',
        wg = ir + C[ZC],
        Dg = ir - C[KC],
        sd = [Ve, Qe].indexOf(S) !== -1,
        Sg = (Cg = je?.[G]) != null ? Cg : 0,
        Eg = sd ? wg : ir - W[Sa] - ce[Sa] - Sg + ye.altAxis,
        Tg = sd ? ir + W[Sa] + ce[Sa] - Sg - ye.altAxis : Dg,
        Mg = m && sd ? Rb(Eg, ir, Tg) : kr(m ? Eg : wg, ir, m ? Tg : Dg);
      (B[G] = Mg), (Be[G] = Mg - ir);
    }
    n.modifiersData[i] = Be;
  }
}
var Cm = {
  name: 'preventOverflow',
  enabled: !0,
  phase: 'main',
  fn: mA,
  requiresIfExists: ['offset'],
};
function wm(t) {
  return { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop };
}
function Dm(t) {
  return t === Ee(t) || !Ze(t) ? Lr(t) : wm(t);
}
function gA(t) {
  var n = t.getBoundingClientRect(),
    e = di(n.width) / t.offsetWidth || 1,
    i = di(n.height) / t.offsetHeight || 1;
  return e !== 1 || i !== 1;
}
function Sm(t, n, e) {
  e === void 0 && (e = !1);
  var i = Ze(n),
    r = Ze(n) && gA(n),
    o = lt(n),
    s = qt(t, r, e),
    a = { scrollLeft: 0, scrollTop: 0 },
    l = { x: 0, y: 0 };
  return (
    (i || (!i && !e)) &&
      ((Xe(n) !== 'body' || jr(o)) && (a = Dm(n)),
      Ze(n) ? ((l = qt(n, !0)), (l.x += n.clientLeft), (l.y += n.clientTop)) : o && (l.x = Vr(o))),
    {
      x: s.left + a.scrollLeft - l.x,
      y: s.top + a.scrollTop - l.y,
      width: s.width,
      height: s.height,
    }
  );
}
function vA(t) {
  var n = new Map(),
    e = new Set(),
    i = [];
  t.forEach(function (o) {
    n.set(o.name, o);
  });
  function r(o) {
    e.add(o.name);
    var s = [].concat(o.requires || [], o.requiresIfExists || []);
    s.forEach(function (a) {
      if (!e.has(a)) {
        var l = n.get(a);
        l && r(l);
      }
    }),
      i.push(o);
  }
  return (
    t.forEach(function (o) {
      e.has(o.name) || r(o);
    }),
    i
  );
}
function Em(t) {
  var n = vA(t);
  return Nb.reduce(function (e, i) {
    return e.concat(
      n.filter(function (r) {
        return r.phase === i;
      }),
    );
  }, []);
}
function Tm(t) {
  var n;
  return function () {
    return (
      n ||
        (n = new Promise(function (e) {
          Promise.resolve().then(function () {
            (n = void 0), e(t());
          });
        })),
      n
    );
  };
}
function Mm(t) {
  var n = t.reduce(function (e, i) {
    var r = e[i.name];
    return (
      (e[i.name] = r
        ? Object.assign({}, r, i, {
            options: Object.assign({}, r.options, i.options),
            data: Object.assign({}, r.data, i.data),
          })
        : i),
      e
    );
  }, {});
  return Object.keys(n).map(function (e) {
    return n[e];
  });
}
var jb = { placement: 'bottom', modifiers: [], strategy: 'absolute' };
function Bb() {
  for (var t = arguments.length, n = new Array(t), e = 0; e < t; e++) n[e] = arguments[e];
  return !n.some(function (i) {
    return !(i && typeof i.getBoundingClientRect == 'function');
  });
}
function Ub(t) {
  t === void 0 && (t = {});
  var n = t,
    e = n.defaultModifiers,
    i = e === void 0 ? [] : e,
    r = n.defaultOptions,
    o = r === void 0 ? jb : r;
  return function (a, l, c) {
    c === void 0 && (c = o);
    var f = {
        placement: 'bottom',
        orderedModifiers: [],
        options: Object.assign({}, jb, o),
        modifiersData: {},
        elements: { reference: a, popper: l },
        attributes: {},
        styles: {},
      },
      p = [],
      g = !1,
      m = {
        state: f,
        setOptions: function (S) {
          var O = typeof S == 'function' ? S(f.options) : S;
          _(),
            (f.options = Object.assign({}, o, f.options, O)),
            (f.scrollParents = {
              reference: Wt(a) ? Wi(a) : a.contextElement ? Wi(a.contextElement) : [],
              popper: Wi(l),
            });
          var I = Em(Mm([].concat(i, f.options.modifiers)));
          return (
            (f.orderedModifiers = I.filter(function (A) {
              return A.enabled;
            })),
            v(),
            m.update()
          );
        },
        forceUpdate: function () {
          if (!g) {
            var S = f.elements,
              O = S.reference,
              I = S.popper;
            if (Bb(O, I)) {
              (f.rects = {
                reference: Sm(O, hn(I), f.options.strategy === 'fixed'),
                popper: Pr(I),
              }),
                (f.reset = !1),
                (f.placement = f.options.placement),
                f.orderedModifiers.forEach(function (ye) {
                  return (f.modifiersData[ye.name] = Object.assign({}, ye.data));
                });
              for (var A = 0; A < f.orderedModifiers.length; A++) {
                if (f.reset === !0) {
                  (f.reset = !1), (A = -1);
                  continue;
                }
                var G = f.orderedModifiers[A],
                  B = G.fn,
                  W = G.options,
                  ce = W === void 0 ? {} : W,
                  _e = G.name;
                typeof B == 'function' &&
                  (f = B({ state: f, options: ce, name: _e, instance: m }) || f);
              }
            }
          }
        },
        update: Tm(function () {
          return new Promise(function (C) {
            m.forceUpdate(), C(f);
          });
        }),
        destroy: function () {
          _(), (g = !0);
        },
      };
    if (!Bb(a, l)) return m;
    m.setOptions(c).then(function (C) {
      !g && c.onFirstUpdate && c.onFirstUpdate(C);
    });
    function v() {
      f.orderedModifiers.forEach(function (C) {
        var S = C.name,
          O = C.options,
          I = O === void 0 ? {} : O,
          A = C.effect;
        if (typeof A == 'function') {
          var G = A({ state: f, name: S, instance: m, options: I }),
            B = function () {};
          p.push(G || B);
        }
      });
    }
    function _() {
      p.forEach(function (C) {
        return C();
      }),
        (p = []);
    }
    return m;
  };
}
var _A = [kb, Vb, Fb, Ab],
  Im = Ub({ defaultModifiers: _A });
var Wb = { animation: !0, transitionTimerDelayMs: 5 },
  qb = (() => {
    class t {
      constructor() {
        this.animation = Wb.animation;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })(),
  yA = (() => {
    class t {
      constructor() {
        (this._ngbConfig = y(qb)), (this.closeOthers = !1), (this.destroyOnHide = !0);
      }
      get animation() {
        return this._animation ?? this._ngbConfig.animation;
      }
      set animation(e) {
        this._animation = e;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })();
function bA(t) {
  let { transitionDelay: n, transitionDuration: e } = window.getComputedStyle(t),
    i = parseFloat(n),
    r = parseFloat(e);
  return (i + r) * 1e3;
}
function CA(t) {
  return typeof t == 'string';
}
function wA(t, n) {
  return !n || typeof t.closest > 'u' ? null : t.closest(n);
}
function DA(t) {
  return (t || document.body).getBoundingClientRect();
}
function SA(t) {
  return (n) =>
    new Q((e) => {
      let i = (s) => t.run(() => e.next(s)),
        r = (s) => t.run(() => e.error(s)),
        o = () => t.run(() => e.complete());
      return n.subscribe({ next: i, error: r, complete: o });
    });
}
function Qb(t = document) {
  let n = t?.activeElement;
  return n ? (n.shadowRoot ? Qb(n.shadowRoot) : n) : null;
}
var EA = () => {},
  { transitionTimerDelayMs: TA } = Wb,
  ou = new Map(),
  MA = (t, n, e, i) => {
    let r = i.context || {},
      o = ou.get(n);
    if (o)
      switch (i.runningTransition) {
        case 'continue':
          return mt;
        case 'stop':
          t.run(() => o.transition$.complete()), (r = Object.assign(o.context, r)), ou.delete(n);
      }
    let s = e(n, i.animation, r) || EA;
    if (!i.animation || window.getComputedStyle(n).transitionProperty === 'none')
      return t.run(() => s()), L(void 0).pipe(SA(t));
    let a = new de(),
      l = new de(),
      c = a.pipe(Id(!0));
    ou.set(n, {
      transition$: a,
      complete: () => {
        l.next(), l.complete();
      },
      context: r,
    });
    let f = bA(n);
    return (
      t.runOutsideAngular(() => {
        let p = _n(n, 'transitionend').pipe(
            Vt(c),
            tt(({ target: m }) => m === n),
          ),
          g = ss(f + TA).pipe(Vt(c));
        tl(g, p, l)
          .pipe(Vt(c))
          .subscribe(() => {
            ou.delete(n),
              t.run(() => {
                s(), a.next(), a.complete();
              });
          });
      }),
      a.asObservable()
    );
  };
function IA(t, n) {
  if (typeof navigator > 'u') return '0px';
  let { classList: e } = t,
    i = e.contains('show');
  i || e.add('show'), (t.style[n] = '');
  let r = t.getBoundingClientRect()[n] + 'px';
  return i || e.remove('show'), r;
}
var xA = (t, n, e) => {
    let { direction: i, maxSize: r, dimension: o } = e,
      { classList: s } = t;
    function a() {
      s.add('collapse'), i === 'show' ? s.add('show') : s.remove('show');
    }
    if (!n) {
      a();
      return;
    }
    return (
      r ||
        ((r = IA(t, o)),
        (e.maxSize = r),
        (t.style[o] = i !== 'show' ? r : '0px'),
        s.remove('collapse', 'collapsing', 'show'),
        DA(t),
        s.add('collapsing')),
      (t.style[o] = i === 'show' ? r : '0px'),
      () => {
        a(), s.remove('collapsing'), (t.style[o] = '');
      }
    );
  },
  NA = (() => {
    class t {
      constructor() {
        (this._ngbConfig = y(qb)), (this.horizontal = !1);
      }
      get animation() {
        return this._animation ?? this._ngbConfig.animation;
      }
      set animation(e) {
        this._animation = e;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })(),
  $b = (() => {
    class t {
      constructor() {
        (this._config = y(NA)),
          (this._element = y(Ne)),
          (this._zone = y(me)),
          (this.animation = this._config.animation),
          (this._afterInit = !1),
          (this._isCollapsed = !1),
          (this.ngbCollapseChange = new Y()),
          (this.horizontal = this._config.horizontal),
          (this.shown = new Y()),
          (this.hidden = new Y());
      }
      set collapsed(e) {
        this._isCollapsed !== e &&
          ((this._isCollapsed = e),
          this._afterInit && this._runTransitionWithEvents(e, this.animation));
      }
      ngOnInit() {
        this._runTransition(this._isCollapsed, !1), (this._afterInit = !0);
      }
      toggle(e = this._isCollapsed) {
        (this.collapsed = !e), this.ngbCollapseChange.next(this._isCollapsed);
      }
      _runTransition(e, i) {
        return MA(this._zone, this._element.nativeElement, xA, {
          animation: i,
          runningTransition: 'stop',
          context: {
            direction: e ? 'hide' : 'show',
            dimension: this.horizontal ? 'width' : 'height',
          },
        });
      }
      _runTransitionWithEvents(e, i) {
        this._runTransition(e, i).subscribe(() => {
          e ? this.hidden.emit() : this.shown.emit();
        });
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵdir = le({
          type: t,
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
    return t;
  })(),
  AA = 0,
  Zb = (() => {
    class t {
      constructor() {
        (this._vcr = y(an)),
          (this._element = y(Ne).nativeElement),
          (this._item = y(Qi)),
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
          for (let e of this._viewRef.rootNodes) this._element.appendChild(e);
        }
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['', 'ngbAccordionBody', '']],
          contentQueries: function (i, r, o) {
            if ((i & 1 && Pi(o, ti, 7), i & 2)) {
              let s;
              Pn((s = Fn())) && (r._bodyTpl = s.first);
            }
          },
          hostAttrs: [1, 'accordion-body'],
          standalone: !0,
        });
      }
    }
    return t;
  })(),
  Nm = (() => {
    class t {
      constructor() {
        (this.item = y(Qi)), (this.ngbCollapse = y($b));
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['', 'ngbAccordionCollapse', '']],
          hostAttrs: ['role', 'region', 1, 'accordion-collapse'],
          hostVars: 2,
          hostBindings: function (i, r) {
            i & 2 && (Ri('id', r.item.collapseId), St('aria-labelledby', r.item.toggleId));
          },
          exportAs: ['ngbAccordionCollapse'],
          standalone: !0,
          features: [Vh([$b])],
        });
      }
    }
    return t;
  })(),
  OA = (() => {
    class t {
      constructor() {
        (this.item = y(Qi)), (this.accordion = y(au));
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['', 'ngbAccordionToggle', '']],
          hostVars: 5,
          hostBindings: function (i, r) {
            i & 1 &&
              Z('click', function () {
                return !r.item.disabled && r.accordion.toggle(r.item.id);
              }),
              i & 2 &&
                (Ri('id', r.item.toggleId),
                St('aria-controls', r.item.collapseId)('aria-expanded', !r.item.collapsed),
                Nt('collapsed', r.item.collapsed));
          },
          standalone: !0,
        });
      }
    }
    return t;
  })(),
  Kb = (() => {
    class t {
      constructor() {
        this.item = y(Qi);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['button', 'ngbAccordionButton', '']],
          hostAttrs: ['type', 'button', 1, 'accordion-button'],
          hostVars: 1,
          hostBindings: function (i, r) {
            i & 2 && Ri('disabled', r.item.disabled);
          },
          standalone: !0,
          features: [Vh([OA])],
        });
      }
    }
    return t;
  })(),
  Yb = (() => {
    class t {
      constructor() {
        this.item = y(Qi);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵdir = le({
          type: t,
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
    return t;
  })(),
  Qi = (() => {
    class t {
      constructor() {
        (this._accordion = y(au)),
          (this._cd = y(cn)),
          (this._destroyRef = y(Cr)),
          (this._collapsed = !0),
          (this._id = `ngb-accordion-item-${AA++}`),
          (this._collapseAnimationRunning = !1),
          (this.disabled = !1),
          (this.show = new Y()),
          (this.shown = new Y()),
          (this.hide = new Y()),
          (this.hidden = new Y());
      }
      set id(e) {
        CA(e) && e !== '' && (this._id = e);
      }
      set destroyOnHide(e) {
        this._destroyOnHide = e;
      }
      get destroyOnHide() {
        return this._destroyOnHide === void 0 ? this._accordion.destroyOnHide : this._destroyOnHide;
      }
      set collapsed(e) {
        e ? this.collapse() : this.expand();
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
        let { ngbCollapse: e } = this._collapse;
        (e.animation = !1),
          (e.collapsed = this.collapsed),
          (e.animation = this._accordion.animation),
          e.hidden.pipe(Uc(this._destroyRef)).subscribe(() => {
            (this._collapseAnimationRunning = !1),
              this.hidden.emit(),
              this._accordion.hidden.emit(this.id);
          }),
          e.shown.pipe(Uc(this._destroyRef)).subscribe(() => {
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
          return new (i || t)();
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['', 'ngbAccordionItem', '']],
          contentQueries: function (i, r, o) {
            if ((i & 1 && Pi(o, Nm, 7), i & 2)) {
              let s;
              Pn((s = Fn())) && (r._collapse = s.first);
            }
          },
          hostAttrs: [1, 'accordion-item'],
          hostVars: 1,
          hostBindings: function (i, r) {
            i & 2 && Ri('id', r.id);
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
    return t;
  })(),
  au = (() => {
    class t {
      constructor() {
        (this._config = y(yA)),
          (this._anItemWasAlreadyExpandedDuringInitialisation = !1),
          (this.animation = this._config.animation),
          (this.closeOthers = this._config.closeOthers),
          (this.destroyOnHide = this._config.destroyOnHide),
          (this.show = new Y()),
          (this.shown = new Y()),
          (this.hide = new Y()),
          (this.hidden = new Y());
      }
      toggle(e) {
        this._getItem(e)?.toggle();
      }
      expand(e) {
        this._getItem(e)?.expand();
      }
      expandAll() {
        this._items &&
          (this.closeOthers
            ? this._items.find((e) => !e.collapsed) || this._items.first.expand()
            : this._items.forEach((e) => e.expand()));
      }
      collapse(e) {
        this._getItem(e)?.collapse();
      }
      collapseAll() {
        this._items?.forEach((e) => e.collapse());
      }
      isExpanded(e) {
        let i = this._getItem(e);
        return i ? !i.collapsed : !1;
      }
      _ensureCanExpand(e) {
        return this.closeOthers
          ? this._items
            ? (this._items.find((i) => !i.collapsed && e !== i)?.collapse(), !0)
            : this._anItemWasAlreadyExpandedDuringInitialisation
              ? !1
              : ((this._anItemWasAlreadyExpandedDuringInitialisation = !0), !0)
          : !0;
      }
      _getItem(e) {
        return this._items?.find((i) => i.id === e);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['', 'ngbAccordion', '']],
          contentQueries: function (i, r, o) {
            if ((i & 1 && Pi(o, Qi, 4), i & 2)) {
              let s;
              Pn((s = Fn())) && (r._items = s);
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
    return t;
  })();
var Jb = (() => {
  class t {
    static {
      this.ɵfac = function (i) {
        return new (i || t)();
      };
    }
    static {
      this.ɵmod = ft({ type: t });
    }
    static {
      this.ɵinj = dt({});
    }
  }
  return t;
})();
var su = (t, n) => (n ? n.some((e) => e.contains(t)) : !1),
  Hb = (t, n) => !n || wA(t, n) != null,
  RA = (() => {
    let t = () =>
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (/Macintosh/.test(navigator.userAgent) &&
          navigator.maxTouchPoints &&
          navigator.maxTouchPoints > 2),
      n = () => /Android/.test(navigator.userAgent);
    return typeof navigator < 'u' ? !!navigator.userAgent && (t() || n()) : !1;
  })(),
  PA = (t) => (RA ? () => setTimeout(() => t(), 100) : t);
function FA(t, n, e, i, r, o, s, a) {
  e &&
    t.runOutsideAngular(
      PA(() => {
        let l = (g) => {
            let m = g.target;
            return g.button === 2 || su(m, s)
              ? !1
              : e === 'inside'
                ? su(m, o) && Hb(m, a)
                : e === 'outside'
                  ? !su(m, o)
                  : Hb(m, a) || !su(m, o);
          },
          c = _n(n, 'keydown').pipe(
            Vt(r),
            tt((g) => g.key === 'Escape'),
            Pe((g) => g.preventDefault()),
          ),
          f = _n(n, 'mousedown').pipe(z(l), Vt(r)),
          p = _n(n, 'mouseup').pipe(
            Od(f),
            tt(([g, m]) => m),
            Md(0),
            Vt(r),
          );
        tl([c.pipe(z((g) => 0)), p.pipe(z((g) => 1))]).subscribe((g) => t.run(() => i(g)));
      }),
    );
}
var kA = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');
var LA = (() => {
    class t {
      constructor() {
        this._element = y(Se).documentElement;
      }
      isRTL() {
        return (this._element.getAttribute('dir') || '').toLowerCase() === 'rtl';
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })(),
  VA = /\s+/,
  jA = /  +/gi,
  BA = {
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
function UA(t, n) {
  let [e, i] = BA[t];
  return (n && i) || e;
}
var $A = /^left/,
  HA = /^right/,
  GA = /^start/,
  zA = /^end/;
function WA(t, n) {
  let [e, i] = n.split('-'),
    r = e.replace($A, 'start').replace(HA, 'end'),
    o = [r];
  if (i) {
    let s = i;
    (e === 'left' || e === 'right') && (s = s.replace(GA, 'top').replace(zA, 'bottom')),
      o.push(`${r}-${s}`);
  }
  return t && (o = o.map((s) => `${t}-${s}`)), o.join(' ');
}
function Gb({ placement: t, baseClass: n }, e) {
  let i = Array.isArray(t) ? t : t.split(VA),
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
    o = i.findIndex((c) => c === 'auto');
  o >= 0 &&
    r.forEach(function (c) {
      i.find((f) => f.search('^' + c) !== -1) == null && i.splice(o++, 1, c);
    });
  let s = i.map((c) => UA(c, e.isRTL()));
  return {
    placement: s.shift(),
    modifiers: [
      {
        name: 'bootstrapClasses',
        enabled: !!n,
        phase: 'write',
        fn({ state: c }) {
          let f = new RegExp(n + '(-[a-z]+)*', 'gi'),
            p = c.elements.popper,
            g = c.placement,
            m = p.className;
          (m = m.replace(f, '')),
            (m += ` ${WA(n, g)}`),
            (m = m.trim().replace(jA, ' ')),
            (p.className = m);
        },
      },
      _m,
      Cm,
      hm,
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
function zb(t) {
  return t;
}
function qA() {
  let t = y(LA),
    n = null;
  return {
    createPopper(e) {
      if (!n) {
        let r = (e.updatePopperOptions || zb)(Gb(e, t));
        n = Im(e.hostElement, e.targetElement, r);
      }
    },
    update() {
      n && n.update();
    },
    setOptions(e) {
      if (n) {
        let r = (e.updatePopperOptions || zb)(Gb(e, t));
        n.setOptions(r);
      }
    },
    destroy() {
      n && (n.destroy(), (n = null));
    },
  };
}
function QA(t) {
  return (n) => (n.modifiers.push(ym, { name: 'offset', options: { offset: () => t } }), n);
}
var o$ = new Date(1882, 10, 12),
  s$ = new Date(2174, 10, 25);
var a$ = 1e3 * 60 * 60 * 24;
var Am = 1080,
  ZA = 24 * Am,
  KA = 12 * Am + 793,
  l$ = 29 * ZA + KA,
  c$ = 11 * Am + 204;
var YA = (() => {
    class t {
      constructor() {
        (this.autoClose = !0),
          (this.placement = ['bottom-start', 'bottom-end', 'top-start', 'top-end']),
          (this.popperOptions = (e) => e),
          (this.container = null);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
      }
    }
    return t;
  })(),
  lu = (() => {
    class t {
      constructor() {
        (this._disabled = !1), (this.nativeElement = y(Ne).nativeElement), (this.tabindex = 0);
      }
      set disabled(e) {
        this._disabled = e === '' || e === !0;
      }
      get disabled() {
        return this._disabled;
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['', 'ngbDropdownItem', '']],
          hostAttrs: [1, 'dropdown-item'],
          hostVars: 3,
          hostBindings: function (i, r) {
            i & 2 && (Ri('tabIndex', r.disabled ? -1 : r.tabindex), Nt('disabled', r.disabled));
          },
          inputs: { tabindex: 'tabindex', disabled: 'disabled' },
          standalone: !0,
        });
      }
    }
    return t;
  })(),
  Xb = (() => {
    class t {
      constructor() {
        this.item = y(lu);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['button', 'ngbDropdownItem', '']],
          hostVars: 1,
          hostBindings: function (i, r) {
            i & 2 && Ri('disabled', r.item.disabled);
          },
          standalone: !0,
        });
      }
    }
    return t;
  })(),
  Br = (() => {
    class t {
      constructor() {
        (this.dropdown = y(Zi)), (this.nativeElement = y(Ne).nativeElement);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['', 'ngbDropdownMenu', '']],
          contentQueries: function (i, r, o) {
            if ((i & 1 && Pi(o, lu, 4), i & 2)) {
              let s;
              Pn((s = Fn())) && (r.menuItems = s);
            }
          },
          hostAttrs: [1, 'dropdown-menu'],
          hostVars: 2,
          hostBindings: function (i, r) {
            i & 1 &&
              Z('keydown.ArrowUp', function (s) {
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
    return t;
  })(),
  xm = (() => {
    class t {
      constructor() {
        (this.dropdown = y(Zi)), (this.nativeElement = y(Ne).nativeElement);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['', 'ngbDropdownAnchor', '']],
          hostAttrs: [1, 'dropdown-toggle'],
          hostVars: 3,
          hostBindings: function (i, r) {
            i & 2 && (St('aria-expanded', r.dropdown.isOpen()), Nt('show', r.dropdown.isOpen()));
          },
          standalone: !0,
        });
      }
    }
    return t;
  })(),
  zo = (() => {
    class t extends xm {
      static {
        this.ɵfac = (() => {
          let e;
          return function (r) {
            return (e || (e = Ht(t)))(r || t);
          };
        })();
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['', 'ngbDropdownToggle', '']],
          hostAttrs: [1, 'dropdown-toggle'],
          hostVars: 3,
          hostBindings: function (i, r) {
            i & 1 &&
              Z('click', function () {
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
              i & 2 && (St('aria-expanded', r.dropdown.isOpen()), Nt('show', r.dropdown.isOpen()));
          },
          standalone: !0,
          features: [At([{ provide: xm, useExisting: nn(() => t) }]), xt],
        });
      }
    }
    return t;
  })(),
  Zi = (() => {
    class t {
      constructor() {
        (this._changeDetector = y(cn)),
          (this._config = y(YA)),
          (this._document = y(Se)),
          (this._injector = y(Ge)),
          (this._ngZone = y(me)),
          (this._nativeElement = y(Ne).nativeElement),
          (this._destroyCloseHandlers$ = new de()),
          (this._bodyContainer = null),
          (this._positioning = qA()),
          (this.autoClose = this._config.autoClose),
          (this._open = !1),
          (this.placement = this._config.placement),
          (this.popperOptions = this._config.popperOptions),
          (this.container = this._config.container),
          (this.openChange = new Y());
      }
      ngOnInit() {
        this.display ||
          (this.display = this._nativeElement.closest('.navbar') ? 'static' : 'dynamic');
      }
      ngAfterContentInit() {
        ac(
          () => {
            this._applyPlacementClasses(), this._open && this._setCloseHandlers();
          },
          { phase: Ke.Write, injector: this._injector },
        );
      }
      ngOnChanges(e) {
        if (
          (e.container && this._open && this._applyContainer(this.container),
          e.placement &&
            !e.placement.firstChange &&
            (this._positioning.setOptions({
              hostElement: this._anchor.nativeElement,
              targetElement: this._bodyContainer || this._menu.nativeElement,
              placement: this.placement,
            }),
            this._applyPlacementClasses()),
          e.dropdownClass)
        ) {
          let { currentValue: i, previousValue: r } = e.dropdownClass;
          this._applyCustomDropdownClass(i, r);
        }
        e.autoClose &&
          this._open &&
          ((this.autoClose = e.autoClose.currentValue), this._setCloseHandlers());
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
                  updatePopperOptions: (e) => this.popperOptions(QA([0, 2])(e)),
                }),
                  this._applyPlacementClasses(),
                  (this._afterRenderRef = Fh(
                    () => {
                      this._positionMenu();
                    },
                    { phase: Ke.Write, injector: this._injector },
                  ));
              })));
      }
      _setCloseHandlers() {
        this._destroyCloseHandlers$.next(),
          FA(
            this._ngZone,
            this._document,
            this.autoClose,
            (e) => {
              this.close(), e === 0 && this._anchor.nativeElement.focus();
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
      onKeyDown(e) {
        let { key: i } = e,
          r = this._getMenuElements(),
          o = -1,
          s = null,
          a = this._isEventFromToggle(e);
        if (
          (!a &&
            r.length &&
            r.forEach((l, c) => {
              l.contains(e.target) && (s = l), l === Qb(this._document) && (o = c);
            }),
          i === ' ' || i === 'Enter')
        ) {
          s &&
            (this.autoClose === !0 || this.autoClose === 'inside') &&
            _n(s, 'click')
              .pipe(Re(1))
              .subscribe(() => this.close());
          return;
        }
        if (i === 'Tab') {
          if (e.target && this.isOpen() && this.autoClose)
            if (this._anchor.nativeElement === e.target) {
              this.container === 'body' && !e.shiftKey
                ? (this._menu.nativeElement.setAttribute('tabindex', '0'),
                  this._menu.nativeElement.focus(),
                  this._menu.nativeElement.removeAttribute('tabindex'))
                : e.shiftKey && this.close();
              return;
            } else if (this.container === 'body') {
              let l = this._menu.nativeElement.querySelectorAll(kA);
              e.shiftKey && e.target === l[0]
                ? (this._anchor.nativeElement.focus(), e.preventDefault())
                : !e.shiftKey &&
                  e.target === l[l.length - 1] &&
                  (this._anchor.nativeElement.focus(), this.close());
            } else
              _n(e.target, 'focusout')
                .pipe(Re(1))
                .subscribe(({ relatedTarget: l }) => {
                  this._nativeElement.contains(l) || this.close();
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
          e.preventDefault();
        }
      }
      _isDropup() {
        return this._nativeElement.classList.contains('dropup');
      }
      _isEventFromToggle(e) {
        return this._anchor.nativeElement.contains(e.target);
      }
      _getMenuElements() {
        return this._menu
          ? this._menu.menuItems.filter(({ disabled: e }) => !e).map(({ nativeElement: e }) => e)
          : [];
      }
      _positionMenu() {
        let e = this._menu;
        this.isOpen() &&
          e &&
          (this.display === 'dynamic'
            ? (this._positioning.update(), this._applyPlacementClasses())
            : this._applyPlacementClasses(this._getFirstPlacement(this.placement)));
      }
      _getFirstPlacement(e) {
        return Array.isArray(e) ? e[0] : e.split(' ')[0];
      }
      _resetContainer() {
        this._menu && this._nativeElement.appendChild(this._menu.nativeElement),
          this._bodyContainer &&
            (this._document.body.removeChild(this._bodyContainer), (this._bodyContainer = null));
      }
      _applyContainer(e = null) {
        if ((this._resetContainer(), e === 'body')) {
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
      _applyCustomDropdownClass(e, i) {
        let r = this.container === 'body' ? this._bodyContainer : this._nativeElement;
        r && (i && r.classList.remove(i), e && r.classList.add(e));
      }
      _applyPlacementClasses(e) {
        if (this._menu) {
          e || (e = this._getFirstPlacement(this.placement)),
            this._nativeElement.classList.remove('dropup', 'dropdown'),
            this.display === 'static'
              ? this._menu.nativeElement.setAttribute('data-bs-popper', 'static')
              : this._menu.nativeElement.removeAttribute('data-bs-popper');
          let i = e.search('^top') !== -1 ? 'dropup' : 'dropdown';
          this._nativeElement.classList.add(i),
            this._bodyContainer &&
              (this._bodyContainer.classList.remove('dropup', 'dropdown'),
              this._bodyContainer.classList.add(i));
        }
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵdir = le({
          type: t,
          selectors: [['', 'ngbDropdown', '']],
          contentQueries: function (i, r, o) {
            if ((i & 1 && (Pi(o, Br, 5), Pi(o, xm, 5)), i & 2)) {
              let s;
              Pn((s = Fn())) && (r._menu = s.first), Pn((s = Fn())) && (r._anchor = s.first);
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
          features: [on],
        });
      }
    }
    return t;
  })();
var Wo = (() => {
  class t {
    static {
      this.ɵfac = function (i) {
        return new (i || t)();
      };
    }
    static {
      this.ɵmod = ft({ type: t });
    }
    static {
      this.ɵinj = dt({});
    }
  }
  return t;
})();
var u$ = new F('live announcer delay', {
  providedIn: 'root',
  factory: () => 100,
});
function JA(t, n) {
  if ((t & 1 && (u(0, 'p'), h(1), d()), t & 2)) {
    let e = U().$implicit;
    w(), Ae(e.answer);
  }
}
function XA(t, n) {
  if (
    (t & 1 &&
      (We(0),
      u(1, 'div', 7)(2, 'div', 8)(3, 'button', 9)(4, 'div', 10),
      h(5),
      d()()(),
      u(6, 'div', 11)(7, 'div', 12),
      R(8, JA, 2, 1, 'ng-template'),
      d()()(),
      qe()),
    t & 2)
  ) {
    let e = n.$implicit,
      i = n.index;
    w(), Uh('ngbAccordionItem', i), w(4), Ae(e.question);
  }
}
var uu = class t {
  frequentlyAskedQuestions = [
    {
      question: 'What is IT consulting?',
      answer:
        'IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation.',
    },
    {
      question: 'How can IT consulting benefit my business?',
      answer:
        'IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation.',
    },
    {
      question: 'How do I choose the right IT consulting firm?',
      answer:
        'IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation.',
    },
    {
      question: 'What skills are in demand in the IT industry?',
      answer:
        'IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation.',
    },
    {
      question: 'How important are certifications in the IT job market?',
      answer:
        'IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation.',
    },
  ];
  ngOnInit() {}
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-freq-asked-que']],
    standalone: !0,
    features: [j],
    decls: 9,
    vars: 2,
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
      ['ngbAccordion', '', 3, 'closeOthers'],
      [4, 'ngFor', 'ngForOf'],
      [3, 'ngbAccordionItem'],
      ['ngbAccordionHeader', ''],
      ['ngbAccordionButton', ''],
      [1, ''],
      ['ngbAccordionCollapse', ''],
      ['ngbAccordionBody', ''],
    ],
    template: function (e, i) {
      e & 1 &&
        (u(0, 'div', 1)(1, 'div', 2)(2, 'h1', 3),
        h(3, 'Frequently Asked Questions'),
        d(),
        u(4, 'p', 4),
        h(
          5,
          'Click the icon beside each question to see the answers to our most frequently asked questions.',
        ),
        d(),
        u(6, 'div', 5, 0),
        R(8, XA, 9, 2, 'ng-container', 6),
        d()()()),
        e & 2 && (w(6), D('closeOthers', !0), w(2), D('ngForOf', i.frequentlyAskedQuestions));
    },
    dependencies: [ot, So, Jb, Kb, au, Qi, Yb, Zb, Nm],
    styles: [
      '.frequently-asked-que[_ngcontent-%COMP%]{padding:100px}.accordion-item[_ngcontent-%COMP%]{border-radius:15px;background:#fff;box-shadow:4px 4px 15px #0000001a;border:0;margin-bottom:10px}.accordion-item[_ngcontent-%COMP%]   .accordion-button[_ngcontent-%COMP%]{border:0;display:flex;align-items:center;gap:10px;color:#333;font-size:16px;font-style:normal;font-weight:600;line-height:32px;background:transparent!important;box-shadow:none!important}.accordion-item[_ngcontent-%COMP%]   .accordion-body[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#2c2c2c;font-size:14px;font-style:normal;font-weight:400;line-height:20px}',
    ],
  });
};
var du = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-feedback']],
    standalone: !0,
    features: [j],
    decls: 86,
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
      [1, 'feedback-card-wrapper', 'd-flex', 'align-items-center', 'gap-3'],
      [1, 'feedback-card'],
      [1, 'feedback-card-header', 'd-flex', 'align-items-center', 'gap-3', 'justify-content-start'],
      ['src', 'assets/feedback/user.svg', 'alt', ''],
      [1, 'd-flex', 'flex-column'],
      [1, 'text-lg', 'semibold'],
      [1, 'desc-sm', 'medium'],
      [1, 'feedback-card-body', 'mt-4'],
      [1, 'text-sm'],
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
      ['width', '24', 'height', '24', 'viewBox', '0 0 24 24', 'fill', 'none'],
      [
        'd',
        'M0.939341 13.0607C0.353554 12.4749 0.353554 11.5251 0.93934 10.9393L10.4853 1.3934C11.0711 0.807613 12.0208 0.807613 12.6066 1.3934C13.1924 1.97919 13.1924 2.92893 12.6066 3.51472L4.12132 12L12.6066 20.4853C13.1924 21.0711 13.1924 22.0208 12.6066 22.6066C12.0208 23.1924 11.0711 23.1924 10.4853 22.6066L0.939341 13.0607ZM24 13.5L2 13.5L2 10.5L24 10.5L24 13.5Z',
        'fill',
        '#4C7DF4',
      ],
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
      [
        'd',
        'M23.0607 10.9393C23.6464 11.5251 23.6464 12.4749 23.0607 13.0607L13.5147 22.6066C12.9289 23.1924 11.9792 23.1924 11.3934 22.6066C10.8076 22.0208 10.8076 21.0711 11.3934 20.4853L19.8787 12L11.3934 3.51472C10.8076 2.92893 10.8076 1.97918 11.3934 1.3934C11.9792 0.80761 12.9289 0.80761 13.5147 1.3934L23.0607 10.9393ZM-1.31134e-07 10.5L22 10.5L22 13.5L1.31134e-07 13.5L-1.31134e-07 10.5Z',
        'fill',
        '#4C7DF4',
      ],
    ],
    template: function (e, i) {
      e & 1 &&
        (u(0, 'div', 0)(1, 'div', 1)(2, 'h1', 2),
        h(3, 'Our Client feedback'),
        d(),
        u(4, 'p', 3),
        h(5, 'Discover what our clients say about their experience with our services'),
        d(),
        u(6, 'div', 4)(7, 'div', 5)(8, 'div', 6)(9, 'div', 7)(10, 'div', 8)(11, 'div', 9),
        b(12, 'img', 10),
        u(13, 'div', 11)(14, 'h1', 12),
        h(15, 'William Johnson'),
        d(),
        u(16, 'p', 13),
        h(17, 'Sales Manager'),
        d()()(),
        u(18, 'div', 14)(19, 'p', 15),
        h(20, 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.'),
        d()()(),
        u(21, 'div', 8)(22, 'div', 9),
        b(23, 'img', 10),
        u(24, 'div', 11)(25, 'h1', 12),
        h(26, 'William Johnson'),
        d(),
        u(27, 'p', 13),
        h(28, 'Sales Manager'),
        d()()(),
        u(29, 'div', 14)(30, 'p', 15),
        h(31, 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.'),
        d()()()()(),
        u(32, 'div', 16)(33, 'div', 7)(34, 'div', 8)(35, 'div', 9),
        b(36, 'img', 10),
        u(37, 'div', 11)(38, 'h1', 12),
        h(39, 'William Johnson'),
        d(),
        u(40, 'p', 13),
        h(41, 'Sales Manager'),
        d()()(),
        u(42, 'div', 14)(43, 'p', 15),
        h(44, 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.'),
        d()()(),
        u(45, 'div', 8)(46, 'div', 9),
        b(47, 'img', 10),
        u(48, 'div', 11)(49, 'h1', 12),
        h(50, 'William Johnson'),
        d(),
        u(51, 'p', 13),
        h(52, 'Sales Manager'),
        d()()(),
        u(53, 'div', 14)(54, 'p', 15),
        h(55, 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.'),
        d()()()()(),
        u(56, 'div', 16)(57, 'div', 7)(58, 'div', 8)(59, 'div', 9),
        b(60, 'img', 10),
        u(61, 'div', 11)(62, 'h1', 12),
        h(63, 'William Johnson'),
        d(),
        u(64, 'p', 13),
        h(65, 'Sales Manager'),
        d()()(),
        u(66, 'div', 14)(67, 'p', 15),
        h(68, 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.'),
        d()()(),
        u(69, 'div', 8)(70, 'div', 9),
        b(71, 'img', 10),
        u(72, 'div', 11)(73, 'h1', 12),
        h(74, 'William Johnson'),
        d(),
        u(75, 'p', 13),
        h(76, 'Sales Manager'),
        d()()(),
        u(77, 'div', 14)(78, 'p', 15),
        h(79, 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.'),
        d()()()()()(),
        u(80, 'button', 17),
        ze(),
        u(81, 'svg', 18),
        b(82, 'path', 19),
        d()(),
        Ye(),
        u(83, 'button', 20),
        ze(),
        u(84, 'svg', 18),
        b(85, 'path', 21),
        d()()()()());
    },
    dependencies: [ot],
    styles: [
      '.feedback-wrapper[_ngcontent-%COMP%]{padding:100px 100px 40px}.carousel[_ngcontent-%COMP%]   .carousel-inner[_ngcontent-%COMP%]   .carousel-item[_ngcontent-%COMP%]   .feedback-card-wrapper[_ngcontent-%COMP%]{padding:60px}.carousel[_ngcontent-%COMP%]   .carousel-inner[_ngcontent-%COMP%]   .carousel-item[_ngcontent-%COMP%]   .feedback-card-wrapper[_ngcontent-%COMP%]   .feedback-card[_ngcontent-%COMP%]{border-radius:8px;background:#fff;box-shadow:0 24px 48px #00115614;display:flex;padding:35px 30px;flex-direction:column;align-items:flex-start;gap:24px;flex:1 0 0;position:relative}.carousel[_ngcontent-%COMP%]   .carousel-control-next[_ngcontent-%COMP%], .carousel[_ngcontent-%COMP%]   .carousel-control-prev[_ngcontent-%COMP%]{display:flex;width:50px;height:50px;flex-direction:column;justify-content:center;align-items:center;gap:10px;border-radius:60px;border:2px solid #4C7DF4;padding:0;top:125px;right:-40px;opacity:1;background:#fff}.carousel[_ngcontent-%COMP%]   .carousel-control-prev[_ngcontent-%COMP%]{left:-40px}',
    ],
  });
};
var fu = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-about-sec']],
    standalone: !0,
    features: [j],
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
    template: function (e, i) {
      e & 1 &&
        (u(0, 'div', 0)(1, 'div', 1)(2, 'h1', 2),
        h(3, 'Expert Staffing & IT Services'),
        d(),
        u(4, 'p', 3),
        h(
          5,
          'Welcome to ProMates Tech, your trusted partner for all your staffing and IT services need. We specialize in providing top-notch IT solution and staffing services tailored to meet your business requirements. With our experience, we ensure seamless integrations of technology into your business operations, maximising efficiency and productivity. Let\u2019s embark on a journey of innovation and growth together',
        ),
        d(),
        u(6, 'button', 4),
        h(7, 'Hire Talent'),
        d()(),
        u(8, 'div', 5),
        b(9, 'img', 6),
        d()());
    },
    styles: [
      '.about-us-sec[_ngcontent-%COMP%]{padding:100px 0}.about-us-sec[_ngcontent-%COMP%]   .content-block[_ngcontent-%COMP%], .about-us-sec[_ngcontent-%COMP%]   .img-banner[_ngcontent-%COMP%]{width:50%}',
    ],
  });
};
var hu = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-build-business-needs']],
    standalone: !0,
    features: [j],
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
    template: function (e, i) {
      e & 1 &&
        (u(0, 'div', 0)(1, 'div', 1)(2, 'h1', 2),
        h(3, 'Build exactly what your business needs'),
        d()(),
        u(4, 'p', 3),
        h(
          5,
          'Leverage tailored products that drive operational efficiency and customer satisfaction.',
        ),
        d(),
        u(6, 'div', 4)(7, 'div', 5),
        ze(),
        u(8, 'svg', 6),
        b(9, 'path', 7),
        u(10, 'defs')(11, 'linearGradient', 8),
        b(12, 'stop', 9)(13, 'stop', 10),
        d()()(),
        Ye(),
        u(14, 'h1', 11),
        h(15, 'Customer experience'),
        d(),
        u(16, 'p', 12),
        h(
          17,
          'Our IT consulting services are designed to provide strategic guidance and expert advice to help you leverage technology for achieving your business goals. We work closely with to develop a customised roadmap that aligns with your objective and accelerates your growth',
        ),
        d(),
        u(18, 'a', 13),
        h(19, 'Learn More'),
        d()(),
        u(20, 'div', 5),
        ze(),
        u(21, 'svg', 6),
        b(22, 'path', 7),
        u(23, 'defs')(24, 'linearGradient', 8),
        b(25, 'stop', 9)(26, 'stop', 10),
        d()()(),
        Ye(),
        u(27, 'h1', 11),
        h(28, 'Customer experience'),
        d(),
        u(29, 'p', 12),
        h(
          30,
          'Our IT consulting services are designed to provide strategic guidance and expert advice to help you leverage technology for achieving your business goals. We work closely with to develop a customised roadmap that aligns with your objective and accelerates your growth',
        ),
        d(),
        u(31, 'a', 13),
        h(32, 'Learn More'),
        d()(),
        u(33, 'div', 5),
        ze(),
        u(34, 'svg', 6),
        b(35, 'path', 7),
        u(36, 'defs')(37, 'linearGradient', 8),
        b(38, 'stop', 9)(39, 'stop', 10),
        d()()(),
        Ye(),
        u(40, 'h1', 11),
        h(41, 'Customer experience'),
        d(),
        u(42, 'p', 12),
        h(
          43,
          'Our IT consulting services are designed to provide strategic guidance and expert advice to help you leverage technology for achieving your business goals. We work closely with to develop a customised roadmap that aligns with your objective and accelerates your growth',
        ),
        d(),
        u(44, 'a', 13),
        h(45, 'Learn More'),
        d()()()());
    },
    styles: [
      '[_nghost-%COMP%]{display:block;width:100%;height:100%;background:#f9f9f9}.build-business[_ngcontent-%COMP%]{padding:100px 0}.card[_ngcontent-%COMP%]{display:flex;padding:24px;flex-direction:column;align-items:flex-start;gap:10px;flex:1 0 0;align-self:stretch;border-radius:0 30px;border:2px solid #4C7DF4;background:#fff;box-shadow:0 2.532px 60.764px #0000000f}.card[_ngcontent-%COMP%]   .desc-xs[_ngcontent-%COMP%]{flex:1 1 100%}.card[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#4c7df4;text-decoration:none;cursor:pointer}',
    ],
  });
};
var pu = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-transfrom-business']],
    standalone: !0,
    features: [j],
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
    template: function (e, i) {
      e & 1 &&
        (u(0, 'div', 0)(1, 'div', 1)(2, 'h1', 2),
        h(3, 'Ready to Transform your Business'),
        d(),
        u(4, 'p', 3),
        h(
          5,
          'Embark on a journey of innovation and growth with ProMates Tech. Whether you need cutting -edge IT Solutions ot top-notch staffing services, we are here to support your business every step of the wa. Get in touch with us today for free evaluation and take first step to unlock the business full potential',
        ),
        d(),
        u(6, 'button', 4),
        h(7, 'Hire Talent'),
        d()(),
        u(8, 'div', 5),
        b(9, 'img', 6),
        d()(),
        u(10, 'div', 0)(11, 'div', 5),
        b(12, 'img', 7),
        d(),
        u(13, 'div', 1)(14, 'h1', 2),
        h(15, 'Ready to Transform your Business'),
        d(),
        u(16, 'p', 3),
        h(
          17,
          'Embark on a journey of innovation and growth with ProMates Tech. Whether you need cutting -edge IT Solutions ot top-notch staffing services, we are here to support your business every step of the wa. Get in touch with us today for free evaluation and take first step to unlock the business full potential',
        ),
        d(),
        u(18, 'button', 4),
        h(19, 'Hire Talent'),
        d()()(),
        u(20, 'div', 8)(21, 'div', 9)(22, 'div', 1)(23, 'h1', 10),
        h(24, 'Ready to transform your business'),
        d(),
        u(25, 'p', 11),
        h(26, 'Embark on journey of innovation and growth with ProMates Tech.\xA0'),
        d()(),
        u(27, 'button', 12),
        h(28, 'Get Free Evaluation'),
        d()()());
    },
    styles: [
      '.about-us-sec[_ngcontent-%COMP%]{padding:100px 0}.about-us-sec[_ngcontent-%COMP%]   .content-block[_ngcontent-%COMP%], .about-us-sec[_ngcontent-%COMP%]   .img-banner[_ngcontent-%COMP%]{width:50%}.ready-transfer-banner[_ngcontent-%COMP%]{padding:0 100px}.ready-transfer-banner[_ngcontent-%COMP%]   .ready-banner[_ngcontent-%COMP%]{display:flex;padding:60px;align-items:center;gap:10px;border-radius:0 20px;opacity:.78;background:linear-gradient(127deg,#7e1dff 3.64%,#0085ff 79.56%)}.ready-transfer-banner[_ngcontent-%COMP%]   .ready-banner[_ngcontent-%COMP%]   .content-block[_ngcontent-%COMP%]{width:100%}.ready-transfer-banner[_ngcontent-%COMP%]   .ready-banner[_ngcontent-%COMP%]   .content-block[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:#fff;font-size:30px;font-weight:700;line-height:normal;letter-spacing:-.5px;margin-bottom:10px}.ready-transfer-banner[_ngcontent-%COMP%]   .ready-banner[_ngcontent-%COMP%]   .content-block[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#fff;font-size:20px;font-weight:400;line-height:180%}.ready-transfer-banner[_ngcontent-%COMP%]   .ready-banner[_ngcontent-%COMP%]   .btn-evalution[_ngcontent-%COMP%]{flex-shrink:0;display:flex;padding:15px 24px;justify-content:center;align-items:center;gap:10px;border-radius:60px;border:3px solid #FFF;background:transparent;color:#fff;font-size:20px;font-weight:700;line-height:normal;cursor:pointer}',
    ],
  });
};
var mu = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-body']],
    standalone: !0,
    features: [j],
    decls: 6,
    vars: 0,
    template: function (e, i) {
      e & 1 &&
        b(0, 'app-banner')(1, 'app-about-sec')(2, 'app-build-business-needs')(
          3,
          'app-transfrom-business',
        )(4, 'app-feedback')(5, 'app-freq-asked-que');
    },
    dependencies: [Bc, uu, du, fu, hu, pu],
  });
};
var gu = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-home']],
    standalone: !0,
    features: [j],
    decls: 1,
    vars: 0,
    template: function (e, i) {
      e & 1 && b(0, 'app-body');
    },
    dependencies: [mu],
  });
};
var vu = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-aboutus']],
    standalone: !0,
    features: [j],
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
    template: function (e, i) {
      e & 1 &&
        (u(0, 'div', 0)(1, 'div', 1),
        b(2, 'img', 2),
        u(3, 'h1', 3),
        h(4, 'About'),
        d()(),
        u(5, 'div', 4)(6, 'div', 5)(7, 'h1', 6),
        h(8, 'We are the company that offers the solution and talent'),
        d(),
        u(9, 'p', 7),
        h(
          10,
          "At ProMates Tech, we specialize in providing customized IT solutions tailored to your unique business needs. Our dedicated team is committed to understanding your requirements and delivering solutions that propel your business forward. Through our expert IT consulting services, we offer valuable insights and recommendations designed to optimize your IT infrastructure. We assist with everything from system integration to strategic planning, ensuring you make informed decisions for your IT environment. Our proactive support team is always on hand to resolve any issues promptly, minimizing downtime and maximizing productivity. By staying current with the latest technologies, we empower your business with innovative solutions that enhance efficiency and performance, helping you stay competitive in today's dynamic digital landscape. At ProMates Tech, client satisfaction is our top priority, and our client-centric approach ensures that we deliver exceptional service and build lasting partnerships with our clients.4o mini",
        ),
        d()()(),
        u(11, 'div', 8)(12, 'div', 9)(13, 'div', 10)(14, 'h1', 11),
        h(15, 'Who We Are?'),
        d(),
        u(16, 'p', 12),
        h(
          17,
          'Embark on a journey of innovation and growth with ProMates Tech. Whether you need cutting -edge IT Solutions ot top-notch staffing services, we are here to support your business every step of the wa. Get in touch with us today for free evaluation and take first step to unlock the business full potential',
        ),
        d(),
        u(18, 'button', 13),
        h(19, 'Hire Talent'),
        d()(),
        u(20, 'div', 14),
        b(21, 'img', 15),
        d()()(),
        u(22, 'div', 8)(23, 'div', 16)(24, 'div', 14),
        b(25, 'img', 17),
        d(),
        u(26, 'div', 18)(27, 'h1', 11),
        h(28, 'We Love What We Do. We Love Who We Serve.'),
        d(),
        u(29, 'p', 12),
        h(
          30,
          'We help companies achieve their vision through digital transformation our technical experts craft custom solutions for industry-leading companies together, we deliver great results through strategic partnership and knowledge sharing',
        ),
        d()()()()());
    },
    styles: [
      '.content-block-titles[_ngcontent-%COMP%]{padding:100px 0;background:#f9f9f9}.banner-about-us[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{position:absolute;top:auto;color:#fff;font-size:30px;font-weight:700;line-height:normal;letter-spacing:-.5px}.about-us-sec[_ngcontent-%COMP%]{padding:100px 0}.about-us-sec[_ngcontent-%COMP%]:nth-child(2n){background:#f9f9f9}.about-us-sec[_ngcontent-%COMP%]   .content-block[_ngcontent-%COMP%], .about-us-sec[_ngcontent-%COMP%]   .img-banner[_ngcontent-%COMP%]{width:50%}',
    ],
  });
};
var J = (function (t) {
    return (
      (t[(t.State = 0)] = 'State'),
      (t[(t.Transition = 1)] = 'Transition'),
      (t[(t.Sequence = 2)] = 'Sequence'),
      (t[(t.Group = 3)] = 'Group'),
      (t[(t.Animate = 4)] = 'Animate'),
      (t[(t.Keyframes = 5)] = 'Keyframes'),
      (t[(t.Style = 6)] = 'Style'),
      (t[(t.Trigger = 7)] = 'Trigger'),
      (t[(t.Reference = 8)] = 'Reference'),
      (t[(t.AnimateChild = 9)] = 'AnimateChild'),
      (t[(t.AnimateRef = 10)] = 'AnimateRef'),
      (t[(t.Query = 11)] = 'Query'),
      (t[(t.Stagger = 12)] = 'Stagger'),
      t
    );
  })(J || {}),
  Hn = '*';
function eC(t, n) {
  return { type: J.Trigger, name: t, definitions: n, options: {} };
}
function Om(t, n = null) {
  return { type: J.Animate, styles: n, timings: t };
}
function tC(t, n = null) {
  return { type: J.Sequence, steps: t, options: n };
}
function Ur(t) {
  return { type: J.Style, styles: t, offset: null };
}
function _u(t, n, e) {
  return { type: J.State, name: t, styles: n, options: e };
}
function Rm(t, n, e = null) {
  return { type: J.Transition, expr: t, animation: n, options: e };
}
var Ki = class {
    constructor(n = 0, e = 0) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this._started = !1),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._position = 0),
        (this.parentPlayer = null),
        (this.totalTime = n + e);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0), this._onDoneFns.forEach((n) => n()), (this._onDoneFns = []));
    }
    onStart(n) {
      this._originalOnStartFns.push(n), this._onStartFns.push(n);
    }
    onDone(n) {
      this._originalOnDoneFns.push(n), this._onDoneFns.push(n);
    }
    onDestroy(n) {
      this._onDestroyFns.push(n);
    }
    hasStarted() {
      return this._started;
    }
    init() {}
    play() {
      this.hasStarted() || (this._onStart(), this.triggerMicrotask()), (this._started = !0);
    }
    triggerMicrotask() {
      queueMicrotask(() => this._onFinish());
    }
    _onStart() {
      this._onStartFns.forEach((n) => n()), (this._onStartFns = []);
    }
    pause() {}
    restart() {}
    finish() {
      this._onFinish();
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this.hasStarted() || this._onStart(),
        this.finish(),
        this._onDestroyFns.forEach((n) => n()),
        (this._onDestroyFns = []));
    }
    reset() {
      (this._started = !1),
        (this._finished = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    setPosition(n) {
      this._position = this.totalTime ? n * this.totalTime : 1;
    }
    getPosition() {
      return this.totalTime ? this._position / this.totalTime : 1;
    }
    triggerCallback(n) {
      let e = n == 'start' ? this._onStartFns : this._onDoneFns;
      e.forEach((i) => i()), (e.length = 0);
    }
  },
  pa = class {
    constructor(n) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._onDestroyFns = []),
        (this.parentPlayer = null),
        (this.totalTime = 0),
        (this.players = n);
      let e = 0,
        i = 0,
        r = 0,
        o = this.players.length;
      o == 0
        ? queueMicrotask(() => this._onFinish())
        : this.players.forEach((s) => {
            s.onDone(() => {
              ++e == o && this._onFinish();
            }),
              s.onDestroy(() => {
                ++i == o && this._onDestroy();
              }),
              s.onStart(() => {
                ++r == o && this._onStart();
              });
          }),
        (this.totalTime = this.players.reduce((s, a) => Math.max(s, a.totalTime), 0));
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0), this._onDoneFns.forEach((n) => n()), (this._onDoneFns = []));
    }
    init() {
      this.players.forEach((n) => n.init());
    }
    onStart(n) {
      this._onStartFns.push(n);
    }
    _onStart() {
      this.hasStarted() ||
        ((this._started = !0), this._onStartFns.forEach((n) => n()), (this._onStartFns = []));
    }
    onDone(n) {
      this._onDoneFns.push(n);
    }
    onDestroy(n) {
      this._onDestroyFns.push(n);
    }
    hasStarted() {
      return this._started;
    }
    play() {
      this.parentPlayer || this.init(), this._onStart(), this.players.forEach((n) => n.play());
    }
    pause() {
      this.players.forEach((n) => n.pause());
    }
    restart() {
      this.players.forEach((n) => n.restart());
    }
    finish() {
      this._onFinish(), this.players.forEach((n) => n.finish());
    }
    destroy() {
      this._onDestroy();
    }
    _onDestroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._onFinish(),
        this.players.forEach((n) => n.destroy()),
        this._onDestroyFns.forEach((n) => n()),
        (this._onDestroyFns = []));
    }
    reset() {
      this.players.forEach((n) => n.reset()),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1);
    }
    setPosition(n) {
      let e = n * this.totalTime;
      this.players.forEach((i) => {
        let r = i.totalTime ? Math.min(1, e / i.totalTime) : 1;
        i.setPosition(r);
      });
    }
    getPosition() {
      let n = this.players.reduce(
        (e, i) => (e === null || i.totalTime > e.totalTime ? i : e),
        null,
      );
      return n != null ? n.getPosition() : 0;
    }
    beforeDestroy() {
      this.players.forEach((n) => {
        n.beforeDestroy && n.beforeDestroy();
      });
    }
    triggerCallback(n) {
      let e = n == 'start' ? this._onStartFns : this._onDoneFns;
      e.forEach((i) => i()), (e.length = 0);
    }
  },
  yu = '!';
var nC = ['toast-component', ''];
function eO(t, n) {
  if (t & 1) {
    let e = rt();
    u(0, 'button', 5),
      Z('click', function () {
        ke(e);
        let r = U();
        return Le(r.remove());
      }),
      u(1, 'span', 6),
      h(2, '\xD7'),
      d()();
  }
}
function tO(t, n) {
  if ((t & 1 && (We(0), h(1), qe()), t & 2)) {
    let e = U(2);
    w(), kn('[', e.duplicatesCount + 1, ']');
  }
}
function nO(t, n) {
  if ((t & 1 && (u(0, 'div'), h(1), R(2, tO, 2, 1, 'ng-container', 4), d()), t & 2)) {
    let e = U();
    Rn(e.options.titleClass),
      St('aria-label', e.title),
      w(),
      kn(' ', e.title, ' '),
      w(),
      D('ngIf', e.duplicatesCount);
  }
}
function iO(t, n) {
  if ((t & 1 && b(0, 'div', 7), t & 2)) {
    let e = U();
    Rn(e.options.messageClass), D('innerHTML', e.message, wh);
  }
}
function rO(t, n) {
  if ((t & 1 && (u(0, 'div', 8), h(1), d()), t & 2)) {
    let e = U();
    Rn(e.options.messageClass), St('aria-label', e.message), w(), kn(' ', e.message, ' ');
  }
}
function oO(t, n) {
  if ((t & 1 && (u(0, 'div'), b(1, 'div', 9), d()), t & 2)) {
    let e = U();
    w(), Oi('width', e.width() + '%');
  }
}
function sO(t, n) {
  if (t & 1) {
    let e = rt();
    u(0, 'button', 5),
      Z('click', function () {
        ke(e);
        let r = U();
        return Le(r.remove());
      }),
      u(1, 'span', 6),
      h(2, '\xD7'),
      d()();
  }
}
function aO(t, n) {
  if ((t & 1 && (We(0), h(1), qe()), t & 2)) {
    let e = U(2);
    w(), kn('[', e.duplicatesCount + 1, ']');
  }
}
function lO(t, n) {
  if ((t & 1 && (u(0, 'div'), h(1), R(2, aO, 2, 1, 'ng-container', 4), d()), t & 2)) {
    let e = U();
    Rn(e.options.titleClass),
      St('aria-label', e.title),
      w(),
      kn(' ', e.title, ' '),
      w(),
      D('ngIf', e.duplicatesCount);
  }
}
function cO(t, n) {
  if ((t & 1 && b(0, 'div', 7), t & 2)) {
    let e = U();
    Rn(e.options.messageClass), D('innerHTML', e.message, wh);
  }
}
function uO(t, n) {
  if ((t & 1 && (u(0, 'div', 8), h(1), d()), t & 2)) {
    let e = U();
    Rn(e.options.messageClass), St('aria-label', e.message), w(), kn(' ', e.message, ' ');
  }
}
function dO(t, n) {
  if ((t & 1 && (u(0, 'div'), b(1, 'div', 9), d()), t & 2)) {
    let e = U();
    w(), Oi('width', e.width() + '%');
  }
}
var Pm = class {
    _attachedHost;
    component;
    viewContainerRef;
    injector;
    constructor(n, e) {
      (this.component = n), (this.injector = e);
    }
    attach(n, e) {
      return (this._attachedHost = n), n.attach(this, e);
    }
    detach() {
      let n = this._attachedHost;
      if (n) return (this._attachedHost = void 0), n.detach();
    }
    get isAttached() {
      return this._attachedHost != null;
    }
    setAttachedHost(n) {
      this._attachedHost = n;
    }
  },
  Fm = class {
    _attachedPortal;
    _disposeFn;
    attach(n, e) {
      return (this._attachedPortal = n), this.attachComponentPortal(n, e);
    }
    detach() {
      this._attachedPortal && this._attachedPortal.setAttachedHost(),
        (this._attachedPortal = void 0),
        this._disposeFn && (this._disposeFn(), (this._disposeFn = void 0));
    }
    setDisposeFn(n) {
      this._disposeFn = n;
    }
  },
  km = class {
    _overlayRef;
    componentInstance;
    duplicatesCount = 0;
    _afterClosed = new de();
    _activate = new de();
    _manualClose = new de();
    _resetTimeout = new de();
    _countDuplicate = new de();
    constructor(n) {
      this._overlayRef = n;
    }
    manualClose() {
      this._manualClose.next(), this._manualClose.complete();
    }
    manualClosed() {
      return this._manualClose.asObservable();
    }
    timeoutReset() {
      return this._resetTimeout.asObservable();
    }
    countDuplicate() {
      return this._countDuplicate.asObservable();
    }
    close() {
      this._overlayRef.detach(),
        this._afterClosed.next(),
        this._manualClose.next(),
        this._afterClosed.complete(),
        this._manualClose.complete(),
        this._activate.complete(),
        this._resetTimeout.complete(),
        this._countDuplicate.complete();
    }
    afterClosed() {
      return this._afterClosed.asObservable();
    }
    isInactive() {
      return this._activate.isStopped;
    }
    activate() {
      this._activate.next(), this._activate.complete();
    }
    afterActivate() {
      return this._activate.asObservable();
    }
    onDuplicate(n, e) {
      n && this._resetTimeout.next(), e && this._countDuplicate.next(++this.duplicatesCount);
    }
  },
  qo = class {
    toastId;
    config;
    message;
    title;
    toastType;
    toastRef;
    _onTap = new de();
    _onAction = new de();
    constructor(n, e, i, r, o, s) {
      (this.toastId = n),
        (this.config = e),
        (this.message = i),
        (this.title = r),
        (this.toastType = o),
        (this.toastRef = s),
        this.toastRef.afterClosed().subscribe(() => {
          this._onAction.complete(), this._onTap.complete();
        });
    }
    triggerTap() {
      this._onTap.next(), this.config.tapToDismiss && this._onTap.complete();
    }
    onTap() {
      return this._onTap.asObservable();
    }
    triggerAction(n) {
      this._onAction.next(n);
    }
    onAction() {
      return this._onAction.asObservable();
    }
  },
  iC = {
    maxOpened: 0,
    autoDismiss: !1,
    newestOnTop: !0,
    preventDuplicates: !1,
    countDuplicates: !1,
    resetTimeoutOnDuplicate: !1,
    includeTitleDuplicates: !1,
    iconClasses: {
      error: 'toast-error',
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning',
    },
    closeButton: !1,
    disableTimeOut: !1,
    timeOut: 5e3,
    extendedTimeOut: 1e3,
    enableHtml: !1,
    progressBar: !1,
    toastClass: 'ngx-toastr',
    positionClass: 'toast-top-right',
    titleClass: 'toast-title',
    messageClass: 'toast-message',
    easing: 'ease-in',
    easeTime: 300,
    tapToDismiss: !0,
    onActivateTick: !1,
    progressAnimation: 'decreasing',
  },
  rC = new F('ToastConfig'),
  Lm = class extends Fm {
    _hostDomElement;
    _componentFactoryResolver;
    _appRef;
    constructor(n, e, i) {
      super(), (this._hostDomElement = n), (this._componentFactoryResolver = e), (this._appRef = i);
    }
    attachComponentPortal(n, e) {
      let i = this._componentFactoryResolver.resolveComponentFactory(n.component),
        r;
      return (
        (r = i.create(n.injector)),
        this._appRef.attachView(r.hostView),
        this.setDisposeFn(() => {
          this._appRef.detachView(r.hostView), r.destroy();
        }),
        e
          ? this._hostDomElement.insertBefore(
              this._getComponentRootNode(r),
              this._hostDomElement.firstChild,
            )
          : this._hostDomElement.appendChild(this._getComponentRootNode(r)),
        r
      );
    }
    _getComponentRootNode(n) {
      return n.hostView.rootNodes[0];
    }
  },
  fO = (() => {
    class t {
      _document = y(Se);
      _containerElement;
      ngOnDestroy() {
        this._containerElement &&
          this._containerElement.parentNode &&
          this._containerElement.parentNode.removeChild(this._containerElement);
      }
      getContainerElement() {
        return this._containerElement || this._createContainer(), this._containerElement;
      }
      _createContainer() {
        let e = this._document.createElement('div');
        e.classList.add('overlay-container'),
          e.setAttribute('aria-live', 'polite'),
          this._document.body.appendChild(e),
          (this._containerElement = e);
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })(),
  Vm = class {
    _portalHost;
    constructor(n) {
      this._portalHost = n;
    }
    attach(n, e = !0) {
      return this._portalHost.attach(n, e);
    }
    detach() {
      return this._portalHost.detach();
    }
  },
  hO = (() => {
    class t {
      _overlayContainer = y(fO);
      _componentFactoryResolver = y(Si);
      _appRef = y(Ot);
      _document = y(Se);
      _paneElements = new Map();
      create(e, i) {
        return this._createOverlayRef(this.getPaneElement(e, i));
      }
      getPaneElement(e = '', i) {
        return (
          this._paneElements.get(i) || this._paneElements.set(i, {}),
          this._paneElements.get(i)[e] ||
            (this._paneElements.get(i)[e] = this._createPaneElement(e, i)),
          this._paneElements.get(i)[e]
        );
      }
      _createPaneElement(e, i) {
        let r = this._document.createElement('div');
        return (
          (r.id = 'toast-container'),
          r.classList.add(e),
          r.classList.add('toast-container'),
          i
            ? i.getContainerElement().appendChild(r)
            : this._overlayContainer.getContainerElement().appendChild(r),
          r
        );
      }
      _createPortalHost(e) {
        return new Lm(e, this._componentFactoryResolver, this._appRef);
      }
      _createOverlayRef(e) {
        return new Vm(this._createPortalHost(e));
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })(),
  bu = (() => {
    class t {
      overlay;
      _injector;
      sanitizer;
      ngZone;
      toastrConfig;
      currentlyActive = 0;
      toasts = [];
      overlayContainer;
      previousToastMessage;
      index = 0;
      constructor(e, i, r, o, s) {
        (this.overlay = i),
          (this._injector = r),
          (this.sanitizer = o),
          (this.ngZone = s),
          (this.toastrConfig = E(E({}, e.default), e.config)),
          e.config.iconClasses &&
            (this.toastrConfig.iconClasses = E(E({}, e.default.iconClasses), e.config.iconClasses));
      }
      show(e, i, r = {}, o = '') {
        return this._preBuildNotification(o, e, i, this.applyConfig(r));
      }
      success(e, i, r = {}) {
        let o = this.toastrConfig.iconClasses.success || '';
        return this._preBuildNotification(o, e, i, this.applyConfig(r));
      }
      error(e, i, r = {}) {
        let o = this.toastrConfig.iconClasses.error || '';
        return this._preBuildNotification(o, e, i, this.applyConfig(r));
      }
      info(e, i, r = {}) {
        let o = this.toastrConfig.iconClasses.info || '';
        return this._preBuildNotification(o, e, i, this.applyConfig(r));
      }
      warning(e, i, r = {}) {
        let o = this.toastrConfig.iconClasses.warning || '';
        return this._preBuildNotification(o, e, i, this.applyConfig(r));
      }
      clear(e) {
        for (let i of this.toasts)
          if (e !== void 0) {
            if (i.toastId === e) {
              i.toastRef.manualClose();
              return;
            }
          } else i.toastRef.manualClose();
      }
      remove(e) {
        let i = this._findToast(e);
        if (
          !i ||
          (i.activeToast.toastRef.close(),
          this.toasts.splice(i.index, 1),
          (this.currentlyActive = this.currentlyActive - 1),
          !this.toastrConfig.maxOpened || !this.toasts.length)
        )
          return !1;
        if (
          this.currentlyActive < this.toastrConfig.maxOpened &&
          this.toasts[this.currentlyActive]
        ) {
          let r = this.toasts[this.currentlyActive].toastRef;
          r.isInactive() || ((this.currentlyActive = this.currentlyActive + 1), r.activate());
        }
        return !0;
      }
      findDuplicate(e = '', i = '', r, o) {
        let { includeTitleDuplicates: s } = this.toastrConfig;
        for (let a of this.toasts) {
          let l = s && a.title === e;
          if ((!s || l) && a.message === i) return a.toastRef.onDuplicate(r, o), a;
        }
        return null;
      }
      applyConfig(e = {}) {
        return E(E({}, this.toastrConfig), e);
      }
      _findToast(e) {
        for (let i = 0; i < this.toasts.length; i++)
          if (this.toasts[i].toastId === e) return { index: i, activeToast: this.toasts[i] };
        return null;
      }
      _preBuildNotification(e, i, r, o) {
        return o.onActivateTick
          ? this.ngZone.run(() => this._buildNotification(e, i, r, o))
          : this._buildNotification(e, i, r, o);
      }
      _buildNotification(e, i, r, o) {
        if (!o.toastComponent) throw new Error('toastComponent required');
        let s = this.findDuplicate(
          r,
          i,
          this.toastrConfig.resetTimeoutOnDuplicate && o.timeOut > 0,
          this.toastrConfig.countDuplicates,
        );
        if (
          ((this.toastrConfig.includeTitleDuplicates && r) || i) &&
          this.toastrConfig.preventDuplicates &&
          s !== null
        )
          return s;
        this.previousToastMessage = i;
        let a = !1;
        this.toastrConfig.maxOpened &&
          this.currentlyActive >= this.toastrConfig.maxOpened &&
          ((a = !0), this.toastrConfig.autoDismiss && this.clear(this.toasts[0].toastId));
        let l = this.overlay.create(o.positionClass, this.overlayContainer);
        this.index = this.index + 1;
        let c = i;
        i && o.enableHtml && (c = this.sanitizer.sanitize(sn.HTML, i));
        let f = new km(l),
          p = new qo(this.index, o, c, r, e, f),
          g = [{ provide: qo, useValue: p }],
          m = Ge.create({ providers: g, parent: this._injector }),
          v = new Pm(o.toastComponent, m),
          _ = l.attach(v, o.newestOnTop);
        f.componentInstance = _.instance;
        let C = {
          toastId: this.index,
          title: r || '',
          message: i || '',
          toastRef: f,
          onShown: f.afterActivate(),
          onHidden: f.afterClosed(),
          onTap: p.onTap(),
          onAction: p.onAction(),
          portal: _,
        };
        return (
          a ||
            ((this.currentlyActive = this.currentlyActive + 1),
            setTimeout(() => {
              C.toastRef.activate();
            })),
          this.toasts.push(C),
          C
        );
      }
      static ɵfac = function (i) {
        return new (i || t)(N(rC), N(hO), N(Ge), N(lp), N(me));
      };
      static ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })(),
  pO = (() => {
    class t {
      toastrService;
      toastPackage;
      ngZone;
      message;
      title;
      options;
      duplicatesCount;
      originalTimeout;
      width = Gt(-1);
      toastClasses = '';
      state;
      get _state() {
        return this.state();
      }
      get displayStyle() {
        if (this.state().value === 'inactive') return 'none';
      }
      timeout;
      intervalId;
      hideTime;
      sub;
      sub1;
      sub2;
      sub3;
      constructor(e, i, r) {
        (this.toastrService = e),
          (this.toastPackage = i),
          (this.ngZone = r),
          (this.message = i.message),
          (this.title = i.title),
          (this.options = i.config),
          (this.originalTimeout = i.config.timeOut),
          (this.toastClasses = `${i.toastType} ${i.config.toastClass}`),
          (this.sub = i.toastRef.afterActivate().subscribe(() => {
            this.activateToast();
          })),
          (this.sub1 = i.toastRef.manualClosed().subscribe(() => {
            this.remove();
          })),
          (this.sub2 = i.toastRef.timeoutReset().subscribe(() => {
            this.resetTimeout();
          })),
          (this.sub3 = i.toastRef.countDuplicate().subscribe((o) => {
            this.duplicatesCount = o;
          })),
          (this.state = Gt({
            value: 'inactive',
            params: {
              easeTime: this.toastPackage.config.easeTime,
              easing: 'ease-in',
            },
          }));
      }
      ngOnDestroy() {
        this.sub.unsubscribe(),
          this.sub1.unsubscribe(),
          this.sub2.unsubscribe(),
          this.sub3.unsubscribe(),
          clearInterval(this.intervalId),
          clearTimeout(this.timeout);
      }
      activateToast() {
        this.state.update((e) => ee(E({}, e), { value: 'active' })),
          !(this.options.disableTimeOut === !0 || this.options.disableTimeOut === 'timeOut') &&
            this.options.timeOut &&
            (this.outsideTimeout(() => this.remove(), this.options.timeOut),
            (this.hideTime = new Date().getTime() + this.options.timeOut),
            this.options.progressBar && this.outsideInterval(() => this.updateProgress(), 10));
      }
      updateProgress() {
        if (this.width() === 0 || this.width() === 100 || !this.options.timeOut) return;
        let e = new Date().getTime(),
          i = this.hideTime - e;
        this.width.set((i / this.options.timeOut) * 100),
          this.options.progressAnimation === 'increasing' && this.width.update((r) => 100 - r),
          this.width() <= 0 && this.width.set(0),
          this.width() >= 100 && this.width.set(100);
      }
      resetTimeout() {
        clearTimeout(this.timeout),
          clearInterval(this.intervalId),
          this.state.update((e) => ee(E({}, e), { value: 'active' })),
          this.outsideTimeout(() => this.remove(), this.originalTimeout),
          (this.options.timeOut = this.originalTimeout),
          (this.hideTime = new Date().getTime() + (this.options.timeOut || 0)),
          this.width.set(-1),
          this.options.progressBar && this.outsideInterval(() => this.updateProgress(), 10);
      }
      remove() {
        this.state().value !== 'removed' &&
          (clearTimeout(this.timeout),
          this.state.update((e) => ee(E({}, e), { value: 'removed' })),
          this.outsideTimeout(
            () => this.toastrService.remove(this.toastPackage.toastId),
            +this.toastPackage.config.easeTime,
          ));
      }
      tapToast() {
        this.state().value !== 'removed' &&
          (this.toastPackage.triggerTap(), this.options.tapToDismiss && this.remove());
      }
      stickAround() {
        this.state().value !== 'removed' &&
          this.options.disableTimeOut !== 'extendedTimeOut' &&
          (clearTimeout(this.timeout),
          (this.options.timeOut = 0),
          (this.hideTime = 0),
          clearInterval(this.intervalId),
          this.width.set(0));
      }
      delayedHideToast() {
        this.options.disableTimeOut === !0 ||
          this.options.disableTimeOut === 'extendedTimeOut' ||
          this.options.extendedTimeOut === 0 ||
          this.state().value === 'removed' ||
          (this.outsideTimeout(() => this.remove(), this.options.extendedTimeOut),
          (this.options.timeOut = this.options.extendedTimeOut),
          (this.hideTime = new Date().getTime() + (this.options.timeOut || 0)),
          this.width.set(-1),
          this.options.progressBar && this.outsideInterval(() => this.updateProgress(), 10));
      }
      outsideTimeout(e, i) {
        this.ngZone
          ? this.ngZone.runOutsideAngular(
              () => (this.timeout = setTimeout(() => this.runInsideAngular(e), i)),
            )
          : (this.timeout = setTimeout(() => e(), i));
      }
      outsideInterval(e, i) {
        this.ngZone
          ? this.ngZone.runOutsideAngular(
              () => (this.intervalId = setInterval(() => this.runInsideAngular(e), i)),
            )
          : (this.intervalId = setInterval(() => e(), i));
      }
      runInsideAngular(e) {
        this.ngZone ? this.ngZone.run(() => e()) : e();
      }
      static ɵfac = function (i) {
        return new (i || t)(k(bu), k(qo), k(me));
      };
      static ɵcmp = V({
        type: t,
        selectors: [['', 'toast-component', '']],
        hostVars: 5,
        hostBindings: function (i, r) {
          i & 1 &&
            Z('click', function () {
              return r.tapToast();
            })('mouseenter', function () {
              return r.stickAround();
            })('mouseleave', function () {
              return r.delayedHideToast();
            }),
            i & 2 && (Bh('@flyInOut', r._state), Rn(r.toastClasses), Oi('display', r.displayStyle));
        },
        standalone: !0,
        features: [j],
        attrs: nC,
        decls: 5,
        vars: 5,
        consts: [
          [
            'type',
            'button',
            'class',
            'toast-close-button',
            'aria-label',
            'Close',
            3,
            'click',
            4,
            'ngIf',
          ],
          [3, 'class', 4, 'ngIf'],
          ['role', 'alert', 3, 'class', 'innerHTML', 4, 'ngIf'],
          ['role', 'alert', 3, 'class', 4, 'ngIf'],
          [4, 'ngIf'],
          ['type', 'button', 'aria-label', 'Close', 1, 'toast-close-button', 3, 'click'],
          ['aria-hidden', 'true'],
          ['role', 'alert', 3, 'innerHTML'],
          ['role', 'alert'],
          [1, 'toast-progress'],
        ],
        template: function (i, r) {
          i & 1 &&
            R(0, eO, 3, 0, 'button', 0)(1, nO, 3, 5, 'div', 1)(2, iO, 1, 3, 'div', 2)(
              3,
              rO,
              2,
              4,
              'div',
              3,
            )(4, oO, 2, 2, 'div', 4),
            i & 2 &&
              (D('ngIf', r.options.closeButton),
              w(),
              D('ngIf', r.title),
              w(),
              D('ngIf', r.message && r.options.enableHtml),
              w(),
              D('ngIf', r.message && !r.options.enableHtml),
              w(),
              D('ngIf', r.options.progressBar));
        },
        dependencies: [Rt],
        encapsulation: 2,
        data: {
          animation: [
            eC('flyInOut', [
              _u('inactive', Ur({ opacity: 0 })),
              _u('active', Ur({ opacity: 1 })),
              _u('removed', Ur({ opacity: 0 })),
              Rm('inactive => active', Om('{{ easeTime }}ms {{ easing }}')),
              Rm('active => removed', Om('{{ easeTime }}ms {{ easing }}')),
            ]),
          ],
        },
        changeDetection: 0,
      });
    }
    return t;
  })(),
  mO = ee(E({}, iC), { toastComponent: pO }),
  oC = (t = {}) => Mi([{ provide: rC, useValue: { default: mO, config: t } }]);
var gO = (() => {
    class t {
      toastrService;
      toastPackage;
      appRef;
      message;
      title;
      options;
      duplicatesCount;
      originalTimeout;
      width = Gt(-1);
      toastClasses = '';
      get displayStyle() {
        return this.state() === 'inactive' ? 'none' : null;
      }
      state = Gt('inactive');
      timeout;
      intervalId;
      hideTime;
      sub;
      sub1;
      sub2;
      sub3;
      constructor(e, i, r) {
        (this.toastrService = e),
          (this.toastPackage = i),
          (this.appRef = r),
          (this.message = i.message),
          (this.title = i.title),
          (this.options = i.config),
          (this.originalTimeout = i.config.timeOut),
          (this.toastClasses = `${i.toastType} ${i.config.toastClass}`),
          (this.sub = i.toastRef.afterActivate().subscribe(() => {
            this.activateToast();
          })),
          (this.sub1 = i.toastRef.manualClosed().subscribe(() => {
            this.remove();
          })),
          (this.sub2 = i.toastRef.timeoutReset().subscribe(() => {
            this.resetTimeout();
          })),
          (this.sub3 = i.toastRef.countDuplicate().subscribe((o) => {
            this.duplicatesCount = o;
          }));
      }
      ngOnDestroy() {
        this.sub.unsubscribe(),
          this.sub1.unsubscribe(),
          this.sub2.unsubscribe(),
          this.sub3.unsubscribe(),
          clearInterval(this.intervalId),
          clearTimeout(this.timeout);
      }
      activateToast() {
        this.state.set('active'),
          !(this.options.disableTimeOut === !0 || this.options.disableTimeOut === 'timeOut') &&
            this.options.timeOut &&
            ((this.timeout = setTimeout(() => {
              this.remove();
            }, this.options.timeOut)),
            (this.hideTime = new Date().getTime() + this.options.timeOut),
            this.options.progressBar &&
              (this.intervalId = setInterval(() => this.updateProgress(), 10))),
          this.options.onActivateTick && this.appRef.tick();
      }
      updateProgress() {
        if (this.width() === 0 || this.width() === 100 || !this.options.timeOut) return;
        let e = new Date().getTime(),
          i = this.hideTime - e;
        this.width.set((i / this.options.timeOut) * 100),
          this.options.progressAnimation === 'increasing' && this.width.update((r) => 100 - r),
          this.width() <= 0 && this.width.set(0),
          this.width() >= 100 && this.width.set(100);
      }
      resetTimeout() {
        clearTimeout(this.timeout),
          clearInterval(this.intervalId),
          this.state.set('active'),
          (this.options.timeOut = this.originalTimeout),
          (this.timeout = setTimeout(() => this.remove(), this.originalTimeout)),
          (this.hideTime = new Date().getTime() + (this.originalTimeout || 0)),
          this.width.set(-1),
          this.options.progressBar &&
            (this.intervalId = setInterval(() => this.updateProgress(), 10));
      }
      remove() {
        this.state() !== 'removed' &&
          (clearTimeout(this.timeout),
          this.state.set('removed'),
          (this.timeout = setTimeout(() => this.toastrService.remove(this.toastPackage.toastId))));
      }
      tapToast() {
        this.state() !== 'removed' &&
          (this.toastPackage.triggerTap(), this.options.tapToDismiss && this.remove());
      }
      stickAround() {
        this.state() !== 'removed' &&
          (clearTimeout(this.timeout),
          (this.options.timeOut = 0),
          (this.hideTime = 0),
          clearInterval(this.intervalId),
          this.width.set(0));
      }
      delayedHideToast() {
        this.options.disableTimeOut === !0 ||
          this.options.disableTimeOut === 'extendedTimeOut' ||
          this.options.extendedTimeOut === 0 ||
          this.state() === 'removed' ||
          ((this.timeout = setTimeout(() => this.remove(), this.options.extendedTimeOut)),
          (this.options.timeOut = this.options.extendedTimeOut),
          (this.hideTime = new Date().getTime() + (this.options.timeOut || 0)),
          this.width.set(-1),
          this.options.progressBar &&
            (this.intervalId = setInterval(() => this.updateProgress(), 10)));
      }
      static ɵfac = function (i) {
        return new (i || t)(k(bu), k(qo), k(Ot));
      };
      static ɵcmp = V({
        type: t,
        selectors: [['', 'toast-component', '']],
        hostVars: 4,
        hostBindings: function (i, r) {
          i & 1 &&
            Z('click', function () {
              return r.tapToast();
            })('mouseenter', function () {
              return r.stickAround();
            })('mouseleave', function () {
              return r.delayedHideToast();
            }),
            i & 2 && (Rn(r.toastClasses), Oi('display', r.displayStyle));
        },
        standalone: !0,
        features: [j],
        attrs: nC,
        decls: 5,
        vars: 5,
        consts: [
          [
            'type',
            'button',
            'class',
            'toast-close-button',
            'aria-label',
            'Close',
            3,
            'click',
            4,
            'ngIf',
          ],
          [3, 'class', 4, 'ngIf'],
          ['role', 'alert', 3, 'class', 'innerHTML', 4, 'ngIf'],
          ['role', 'alert', 3, 'class', 4, 'ngIf'],
          [4, 'ngIf'],
          ['type', 'button', 'aria-label', 'Close', 1, 'toast-close-button', 3, 'click'],
          ['aria-hidden', 'true'],
          ['role', 'alert', 3, 'innerHTML'],
          ['role', 'alert'],
          [1, 'toast-progress'],
        ],
        template: function (i, r) {
          i & 1 &&
            R(0, sO, 3, 0, 'button', 0)(1, lO, 3, 5, 'div', 1)(2, cO, 1, 3, 'div', 2)(
              3,
              uO,
              2,
              4,
              'div',
              3,
            )(4, dO, 2, 2, 'div', 4),
            i & 2 &&
              (D('ngIf', r.options.closeButton),
              w(),
              D('ngIf', r.title),
              w(),
              D('ngIf', r.message && r.options.enableHtml),
              w(),
              D('ngIf', r.message && !r.options.enableHtml),
              w(),
              D('ngIf', r.options.progressBar));
        },
        dependencies: [Rt],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return t;
  })(),
  H$ = ee(E({}, iC), { toastComponent: gO });
var Yi = class {},
  sC = (() => {
    class t extends Yi {
      getTranslation(e) {
        return L({});
      }
    }
    return (
      (t.ɵfac = (() => {
        let n;
        return function (i) {
          return (n || (n = Ht(t)))(i || t);
        };
      })()),
      (t.ɵprov = M({ token: t, factory: t.ɵfac })),
      t
    );
  })(),
  ma = class {},
  aC = (() => {
    class t {
      handle(e) {
        return e.key;
      }
    }
    return (
      (t.ɵfac = function (e) {
        return new (e || t)();
      }),
      (t.ɵprov = M({ token: t, factory: t.ɵfac })),
      t
    );
  })();
function $r(t) {
  return typeof t < 'u' && t !== null;
}
function jm(t) {
  return t && typeof t == 'object' && !Array.isArray(t);
}
function uC(t, n) {
  let e = Object.assign({}, t);
  return (
    jm(t) &&
      jm(n) &&
      Object.keys(n).forEach((i) => {
        jm(n[i])
          ? i in t
            ? (e[i] = uC(t[i], n[i]))
            : Object.assign(e, { [i]: n[i] })
          : Object.assign(e, { [i]: n[i] });
      }),
    e
  );
}
var Qo = class {},
  lC = (() => {
    class t extends Qo {
      constructor() {
        super(...arguments), (this.templateMatcher = /{{\s?([^{}\s]*)\s?}}/g);
      }
      interpolate(e, i) {
        let r;
        return (
          typeof e == 'string'
            ? (r = this.interpolateString(e, i))
            : typeof e == 'function'
              ? (r = this.interpolateFunction(e, i))
              : (r = e),
          r
        );
      }
      getValue(e, i) {
        let r = typeof i == 'string' ? i.split('.') : [i];
        i = '';
        do
          (i += r.shift()),
            $r(e) && $r(e[i]) && (typeof e[i] == 'object' || !r.length)
              ? ((e = e[i]), (i = ''))
              : r.length
                ? (i += '.')
                : (e = void 0);
        while (r.length);
        return e;
      }
      interpolateFunction(e, i) {
        return e(i);
      }
      interpolateString(e, i) {
        return i
          ? e.replace(this.templateMatcher, (r, o) => {
              let s = this.getValue(i, o);
              return $r(s) ? s : r;
            })
          : e;
      }
    }
    return (
      (t.ɵfac = (() => {
        let n;
        return function (i) {
          return (n || (n = Ht(t)))(i || t);
        };
      })()),
      (t.ɵprov = M({ token: t, factory: t.ɵfac })),
      t
    );
  })(),
  Zo = class {},
  cC = (() => {
    class t extends Zo {
      compile(e, i) {
        return e;
      }
      compileTranslations(e, i) {
        return e;
      }
    }
    return (
      (t.ɵfac = (() => {
        let n;
        return function (i) {
          return (n || (n = Ht(t)))(i || t);
        };
      })()),
      (t.ɵprov = M({ token: t, factory: t.ɵfac })),
      t
    );
  })(),
  Cu = class {
    constructor() {
      (this.currentLang = this.defaultLang),
        (this.translations = {}),
        (this.langs = []),
        (this.onTranslationChange = new Y()),
        (this.onLangChange = new Y()),
        (this.onDefaultLangChange = new Y());
    }
  },
  Bm = new F('USE_STORE'),
  Um = new F('USE_DEFAULT_LANG'),
  $m = new F('DEFAULT_LANGUAGE'),
  Hm = new F('USE_EXTEND'),
  Ko = (() => {
    class t {
      constructor(e, i, r, o, s, a = !0, l = !1, c = !1, f) {
        (this.store = e),
          (this.currentLoader = i),
          (this.compiler = r),
          (this.parser = o),
          (this.missingTranslationHandler = s),
          (this.useDefaultLang = a),
          (this.isolate = l),
          (this.extend = c),
          (this.pending = !1),
          (this._onTranslationChange = new Y()),
          (this._onLangChange = new Y()),
          (this._onDefaultLangChange = new Y()),
          (this._langs = []),
          (this._translations = {}),
          (this._translationRequests = {}),
          f && this.setDefaultLang(f);
      }
      get onTranslationChange() {
        return this.isolate ? this._onTranslationChange : this.store.onTranslationChange;
      }
      get onLangChange() {
        return this.isolate ? this._onLangChange : this.store.onLangChange;
      }
      get onDefaultLangChange() {
        return this.isolate ? this._onDefaultLangChange : this.store.onDefaultLangChange;
      }
      get defaultLang() {
        return this.isolate ? this._defaultLang : this.store.defaultLang;
      }
      set defaultLang(e) {
        this.isolate ? (this._defaultLang = e) : (this.store.defaultLang = e);
      }
      get currentLang() {
        return this.isolate ? this._currentLang : this.store.currentLang;
      }
      set currentLang(e) {
        this.isolate ? (this._currentLang = e) : (this.store.currentLang = e);
      }
      get langs() {
        return this.isolate ? this._langs : this.store.langs;
      }
      set langs(e) {
        this.isolate ? (this._langs = e) : (this.store.langs = e);
      }
      get translations() {
        return this.isolate ? this._translations : this.store.translations;
      }
      set translations(e) {
        this.isolate ? (this._translations = e) : (this.store.translations = e);
      }
      setDefaultLang(e) {
        if (e === this.defaultLang) return;
        let i = this.retrieveTranslations(e);
        typeof i < 'u'
          ? (this.defaultLang == null && (this.defaultLang = e),
            i.pipe(Re(1)).subscribe((r) => {
              this.changeDefaultLang(e);
            }))
          : this.changeDefaultLang(e);
      }
      getDefaultLang() {
        return this.defaultLang;
      }
      use(e) {
        if (e === this.currentLang) return L(this.translations[e]);
        let i = this.retrieveTranslations(e);
        return typeof i < 'u'
          ? (this.currentLang || (this.currentLang = e),
            i.pipe(Re(1)).subscribe((r) => {
              this.changeLang(e);
            }),
            i)
          : (this.changeLang(e), L(this.translations[e]));
      }
      retrieveTranslations(e) {
        let i;
        return (
          (typeof this.translations[e] > 'u' || this.extend) &&
            ((this._translationRequests[e] =
              this._translationRequests[e] || this.getTranslation(e)),
            (i = this._translationRequests[e])),
          i
        );
      }
      getTranslation(e) {
        this.pending = !0;
        let i = this.currentLoader.getTranslation(e).pipe(il(1), Re(1));
        return (
          (this.loadingTranslations = i.pipe(
            z((r) => this.compiler.compileTranslations(r, e)),
            il(1),
            Re(1),
          )),
          this.loadingTranslations.subscribe({
            next: (r) => {
              (this.translations[e] =
                this.extend && this.translations[e] ? E(E({}, r), this.translations[e]) : r),
                this.updateLangs(),
                (this.pending = !1);
            },
            error: (r) => {
              this.pending = !1;
            },
          }),
          i
        );
      }
      setTranslation(e, i, r = !1) {
        (i = this.compiler.compileTranslations(i, e)),
          (r || this.extend) && this.translations[e]
            ? (this.translations[e] = uC(this.translations[e], i))
            : (this.translations[e] = i),
          this.updateLangs(),
          this.onTranslationChange.emit({
            lang: e,
            translations: this.translations[e],
          });
      }
      getLangs() {
        return this.langs;
      }
      addLangs(e) {
        e.forEach((i) => {
          this.langs.indexOf(i) === -1 && this.langs.push(i);
        });
      }
      updateLangs() {
        this.addLangs(Object.keys(this.translations));
      }
      getParsedResult(e, i, r) {
        let o;
        if (i instanceof Array) {
          let s = {},
            a = !1;
          for (let l of i) (s[l] = this.getParsedResult(e, l, r)), vn(s[l]) && (a = !0);
          if (a) {
            let l = i.map((c) => (vn(s[c]) ? s[c] : L(s[c])));
            return os(l).pipe(
              z((c) => {
                let f = {};
                return (
                  c.forEach((p, g) => {
                    f[i[g]] = p;
                  }),
                  f
                );
              }),
            );
          }
          return s;
        }
        if (
          (e && (o = this.parser.interpolate(this.parser.getValue(e, i), r)),
          typeof o > 'u' &&
            this.defaultLang != null &&
            this.defaultLang !== this.currentLang &&
            this.useDefaultLang &&
            (o = this.parser.interpolate(
              this.parser.getValue(this.translations[this.defaultLang], i),
              r,
            )),
          typeof o > 'u')
        ) {
          let s = { key: i, translateService: this };
          typeof r < 'u' && (s.interpolateParams = r),
            (o = this.missingTranslationHandler.handle(s));
        }
        return typeof o < 'u' ? o : i;
      }
      get(e, i) {
        if (!$r(e) || !e.length) throw new Error('Parameter "key" required');
        if (this.pending)
          return this.loadingTranslations.pipe(
            yn((r) => ((r = this.getParsedResult(r, e, i)), vn(r) ? r : L(r))),
          );
        {
          let r = this.getParsedResult(this.translations[this.currentLang], e, i);
          return vn(r) ? r : L(r);
        }
      }
      getStreamOnTranslationChange(e, i) {
        if (!$r(e) || !e.length) throw new Error('Parameter "key" required');
        return Mt(
          lr(() => this.get(e, i)),
          this.onTranslationChange.pipe(
            nt((r) => {
              let o = this.getParsedResult(r.translations, e, i);
              return typeof o.subscribe == 'function' ? o : L(o);
            }),
          ),
        );
      }
      stream(e, i) {
        if (!$r(e) || !e.length) throw new Error('Parameter "key" required');
        return Mt(
          lr(() => this.get(e, i)),
          this.onLangChange.pipe(
            nt((r) => {
              let o = this.getParsedResult(r.translations, e, i);
              return vn(o) ? o : L(o);
            }),
          ),
        );
      }
      instant(e, i) {
        if (!$r(e) || !e.length) throw new Error('Parameter "key" required');
        let r = this.getParsedResult(this.translations[this.currentLang], e, i);
        if (vn(r)) {
          if (e instanceof Array) {
            let o = {};
            return (
              e.forEach((s, a) => {
                o[e[a]] = e[a];
              }),
              o
            );
          }
          return e;
        } else return r;
      }
      set(e, i, r = this.currentLang) {
        (this.translations[r][e] = this.compiler.compile(i, r)),
          this.updateLangs(),
          this.onTranslationChange.emit({
            lang: r,
            translations: this.translations[r],
          });
      }
      changeLang(e) {
        (this.currentLang = e),
          this.onLangChange.emit({
            lang: e,
            translations: this.translations[e],
          }),
          this.defaultLang == null && this.changeDefaultLang(e);
      }
      changeDefaultLang(e) {
        (this.defaultLang = e),
          this.onDefaultLangChange.emit({
            lang: e,
            translations: this.translations[e],
          });
      }
      reloadLang(e) {
        return this.resetLang(e), this.getTranslation(e);
      }
      resetLang(e) {
        (this._translationRequests[e] = void 0), (this.translations[e] = void 0);
      }
      getBrowserLang() {
        if (typeof window > 'u' || typeof window.navigator > 'u') return;
        let e = window.navigator.languages ? window.navigator.languages[0] : null;
        if (
          ((e =
            e ||
            window.navigator.language ||
            window.navigator.browserLanguage ||
            window.navigator.userLanguage),
          !(typeof e > 'u'))
        )
          return (
            e.indexOf('-') !== -1 && (e = e.split('-')[0]),
            e.indexOf('_') !== -1 && (e = e.split('_')[0]),
            e
          );
      }
      getBrowserCultureLang() {
        if (typeof window > 'u' || typeof window.navigator > 'u') return;
        let e = window.navigator.languages ? window.navigator.languages[0] : null;
        return (
          (e =
            e ||
            window.navigator.language ||
            window.navigator.browserLanguage ||
            window.navigator.userLanguage),
          e
        );
      }
    }
    return (
      (t.ɵfac = function (e) {
        return new (e || t)(N(Cu), N(Yi), N(Zo), N(Qo), N(ma), N(Um), N(Bm), N(Hm), N($m));
      }),
      (t.ɵprov = M({ token: t, factory: t.ɵfac })),
      t
    );
  })();
var wu = (() => {
  class t {
    static forRoot(e = {}) {
      return {
        ngModule: t,
        providers: [
          e.loader || { provide: Yi, useClass: sC },
          e.compiler || { provide: Zo, useClass: cC },
          e.parser || { provide: Qo, useClass: lC },
          e.missingTranslationHandler || { provide: ma, useClass: aC },
          Cu,
          { provide: Bm, useValue: e.isolate },
          { provide: Um, useValue: e.useDefaultLang },
          { provide: Hm, useValue: e.extend },
          { provide: $m, useValue: e.defaultLanguage },
          Ko,
        ],
      };
    }
    static forChild(e = {}) {
      return {
        ngModule: t,
        providers: [
          e.loader || { provide: Yi, useClass: sC },
          e.compiler || { provide: Zo, useClass: cC },
          e.parser || { provide: Qo, useClass: lC },
          e.missingTranslationHandler || { provide: ma, useClass: aC },
          { provide: Bm, useValue: e.isolate },
          { provide: Um, useValue: e.useDefaultLang },
          { provide: Hm, useValue: e.extend },
          { provide: $m, useValue: e.defaultLanguage },
          Ko,
        ],
      };
    }
  }
  return (
    (t.ɵfac = function (e) {
      return new (e || t)();
    }),
    (t.ɵmod = ft({ type: t })),
    (t.ɵinj = dt({})),
    t
  );
})();
var Et = class t {
  constructor(n, e) {
    this.toastr = n;
    this.translate = e;
    this.init();
  }
  windowElement;
  showSuccess(n) {
    this.toastr.success(n);
  }
  notify(n, e) {
    e === 'info' && this.toastr.info(n),
      e === 'error' && this.toastr.error(n),
      e === 'success' && this.toastr.success(n),
      e === 'warning' && this.toastr.warning(n);
  }
  showError(n, e) {
    let i =
      (n?.error && n?.error?.message) ||
      (n?.error?.errors && n.error.errors[0] && n.error.errors[0].msg) ||
      (n?.error && n?.error?.err);
    this.notify(i || e || this.translate.instant('wb_somethingThingWrong'), 'error');
  }
  post(n) {
    try {
      let e = { action: 'NotificationService' };
      n && (e.payload = n), window.parent.postMessage(e, '*');
    } catch (e) {
      console.log(e);
    }
  }
  encodeMsg = (n) => ((n = n || ''), n.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
  init() {
    let n = { notify: this.notify, toastr: this.toastr };
    window.NotificationService = n;
  }
  static ɵfac = function (e) {
    return new (e || t)(N(bu), N(Ko));
  };
  static ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
};
var Du = class t {
  API_URL_PREFIX = '/workbench/api';
  API_VERSION_PREFIX = '/1.1';
  SERVER_URL = '';
  API_SERVER_URL;
  serviceList = {};
  workbenchValue = 'banking';
  constructor() {
    yt.production
      ? ((this.SERVER_URL = window.location.protocol + '//' + window.location.host),
        (this.API_SERVER_URL = this.SERVER_URL + this.API_URL_PREFIX))
      : (this.API_SERVER_URL = yt.API_SERVER_URL + this.API_URL_PREFIX),
      this.init();
  }
  getServiceInfo(n) {
    return this.serviceList[n];
  }
  init() {
    this.serviceList['app.test'] = {
      endpoint: this.API_SERVER_URL + '/test',
      method: 'post',
    };
  }
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
};
var Gn = class t {
  constructor(n, e, i, r) {
    this.endpoints = n;
    this.http = e;
    this.notify = i;
    this.translate = r;
  }
  DEFAULT_HEADERS = { 'Content-Type': 'application/json;charset=UTF-8' };
  UPLOAD_HEADERS = { 'Content-Type': void 0 };
  invoke(n, e, i, r) {
    let o = this,
      s = this.prepareHttpCall(n, e, i, r);
    var a = [s.url];
    return (
      s.method === 'get' || s.method === 'delete'
        ? a.push({ headers: s.headers, params: s.payload })
        : a.push(s.payload, { headers: s.headers }),
      o.http[s.method].apply(this.http, a)
    );
  }
  prepareHttpCall(n, e, i, r) {
    let o = 'get',
      s = 'post',
      a = 'put',
      l = 'delete',
      c = this.endpoints.getServiceInfo(n),
      f,
      p,
      g = JSON.parse(JSON.stringify(this.DEFAULT_HEADERS));
    (n === 'post.upload.file' || n === 'bt.post.uploadbotfuncfile') &&
      (g = JSON.parse(JSON.stringify(this.UPLOAD_HEADERS)));
    try {
      (p = c.method), (f = c.endpoint), (f = this.resolveUrl(f, e || {}, !1));
    } catch {
      throw new Error('Unable to find Endpoint or method');
    }
    return (
      (f += f.indexOf('?') > -1 ? '&' : '?'),
      (f += this.genRandQuery()),
      p === l && ((p = s), (g['X-HTTP-Method-Override'] = l)),
      p === a && ((p = s), (g['X-HTTP-Method-Override'] = a)),
      navigator.onLine || this.notify.notify(this.translate.instant('check_internet'), 'error'),
      {
        method: p,
        url: f,
        headers: Object.assign(r || {}, g),
        payload: i || {},
      }
    );
  }
  resolveUrl(n, e, i) {
    let r = /\:([a-zA-Z]+)/g;
    return n.replace(r, function (o, s) {
      var a = e[s];
      return typeof a < 'u' && typeof a !== null ? (i && delete e[s], a) : o;
    });
  }
  genRandQuery() {
    return 'rnd=' + Math.random().toString(36).substr(7);
  }
  getUrl(n) {
    return this.endpoints.getServiceInfo(n);
  }
  static ɵfac = function (e) {
    return new (e || t)(N(Du), N(Ns), N(Et), N(Ko));
  };
  static ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
};
function yO(t, n) {
  t & 1 && (u(0, 'div', 27), h(1, 'First Name is Required'), d());
}
function bO(t, n) {
  t & 1 && (u(0, 'div', 27), h(1, 'Last name is required'), d());
}
function CO(t, n) {
  t & 1 && (u(0, 'div', 27), h(1, ' Email is required '), d());
}
function wO(t, n) {
  t & 1 && (u(0, 'div', 27), h(1, ' Enter a valid email '), d());
}
function DO(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Phone number is required.'), d());
}
function SO(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Enter a valid 10-digit phone number.'), d());
}
function EO(t, n) {
  if ((t & 1 && (u(0, 'div', 28), R(1, DO, 2, 0, 'div', 29)(2, SO, 2, 0, 'div', 29), d()), t & 2)) {
    let e,
      i,
      r = U();
    w(),
      D(
        'ngIf',
        (e = r.contactForm.get('PhoneNumber')) == null || e.errors == null
          ? null
          : e.errors.required,
      ),
      w(),
      D(
        'ngIf',
        (i = r.contactForm.get('PhoneNumber')) == null || i.errors == null
          ? null
          : i.errors.pattern,
      );
  }
}
function TO(t, n) {
  t & 1 && (u(0, 'div', 27), h(1, ' Company Name is required '), d());
}
function MO(t, n) {
  t & 1 && (u(0, 'div', 27), h(1, 'Company Location is required'), d());
}
function IO(t, n) {
  t & 1 && (u(0, 'div', 27), h(1, 'Message is required'), d());
}
var Eu = class t {
  constructor(n, e, i) {
    this.fb = n;
    this.notificationService = e;
    this.serviceInvoker = i;
  }
  contactForm;
  ngOnInit() {
    this.contactForm = this.fb.group({
      firstName: ['', se.required],
      lastName: ['', se.required],
      email: ['', [se.required, se.email]],
      message: ['', se.required],
      companyName: ['', se.required],
      companyLocation: ['', se.required],
      PhoneNumber: ['', [se.required, se.pattern('[0-9]{10}')]],
    });
  }
  onSubmit() {
    this.contactForm.valid
      ? (console.log(this.contactForm.value),
        this.serviceInvoker.invoke('app.test', {}, this.contactForm.value, {}).subscribe(
          (n) => {
            this.notificationService.showSuccess('saved successfully'), this.contactForm.reset();
          },
          (n) => {
            this.notificationService.showSuccess('saved successfully');
          },
        ))
      : this.markAllFieldsAsTouched();
  }
  markAllFieldsAsTouched() {
    Object.keys(this.contactForm.controls).forEach((n) => {
      let e = this.contactForm.get(n);
      e && e.markAsTouched();
    });
  }
  static ɵfac = function (e) {
    return new (e || t)(k(Hi), k(Et), k(Gn));
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-contact-us']],
    standalone: !0,
    features: [At([]), j],
    decls: 70,
    vars: 9,
    consts: [
      [1, 'contact-us-wrapper'],
      [1, 'container'],
      [1, 'text-center', 'text-xl', 'semibold', 'mb-2'],
      [1, 'desc-sm', 'text-center', 'mb-3'],
      [3, 'ngSubmit', 'formGroup'],
      [1, 'd-flex', 'gap-3'],
      [1, 'mb-3', 'w-100'],
      ['for', 'firstName', 1, 'form-label', 'text-sm', 'medium'],
      [
        'type',
        'text',
        'id',
        'firstName',
        'name',
        'firstName',
        'formControlName',
        'firstName',
        'placeholder',
        'First name',
        'required',
        '',
        'autocomplete',
        'off',
        1,
        'form-control',
      ],
      ['class', 'error-msg', 4, 'ngIf'],
      [1, 'char-remaining'],
      ['for', 'lastName', 1, 'form-label', 'text-sm', 'medium'],
      [
        'type',
        'text',
        'id',
        'lastName',
        'name',
        'lastName',
        'formControlName',
        'lastName',
        'placeholder',
        'Last name',
        'required',
        '',
        'autocomplete',
        'off',
        1,
        'form-control',
      ],
      ['for', 'email', 1, 'form-label', 'text-sm', 'medium'],
      [
        'type',
        'email',
        'id',
        'email',
        'placeholder',
        'name@example.com',
        'name',
        'email',
        'formControlName',
        'email',
        'placeholder',
        'name@example.com',
        'required',
        '',
        'autocomplete',
        'off',
        1,
        'form-control',
      ],
      ['for', 'PhoneNumber', 1, 'form-label', 'text-sm', 'medium'],
      [
        'type',
        'text',
        'id',
        'PhoneNumber',
        'name',
        'PhoneNumber',
        'formControlName',
        'PhoneNumber',
        'placeholder',
        'Phone Number',
        'required',
        '',
        'autocomplete',
        'off',
        1,
        'form-control',
      ],
      ['class', 'text-danger', 4, 'ngIf'],
      ['for', 'companyName', 1, 'form-label', 'text-sm', 'medium'],
      [
        'type',
        'companyName',
        'id',
        'companyName',
        'placeholder',
        'Company Name',
        'name',
        'email',
        'formControlName',
        'companyName',
        'required',
        '',
        'autocomplete',
        'off',
        1,
        'form-control',
      ],
      ['for', 'companyLocation', 1, 'form-label', 'text-sm', 'medium'],
      [
        'type',
        'text',
        'id',
        'companyLocation',
        'name',
        'companyLocation',
        'formControlName',
        'companyLocation',
        'placeholder',
        'Company Location',
        'required',
        '',
        'autocomplete',
        'off',
        1,
        'form-control',
      ],
      [1, 'mb-3'],
      ['for', 'message', 1, 'form-label', 'text-sm', 'medium'],
      [
        'id',
        'message',
        'rows',
        '3',
        'name',
        'message',
        'formControlName',
        'message',
        'rows',
        '3',
        'required',
        '',
        'autocomplete',
        'off',
        1,
        'form-control',
      ],
      [1, 'd-flex', 'align-items-center', 'justify-content-end'],
      ['type', 'submit', 1, 'promates-btn', 'w-25', 'text-center', 'justify-content-center'],
      [1, 'error-msg'],
      [1, 'text-danger'],
      [4, 'ngIf'],
    ],
    template: function (e, i) {
      if (
        (e & 1 &&
          (u(0, 'div', 0)(1, 'div', 1)(2, 'h1', 2),
          h(3, 'Contact Us'),
          d(),
          u(4, 'p', 3),
          h(5, 'We\u2019re here for anything you need.Just drop us a quick message below. '),
          b(6, 'br'),
          h(7, 'We\u2019ll get back to you shortly'),
          d(),
          u(8, 'form', 4),
          Z('ngSubmit', function () {
            return i.onSubmit();
          }),
          u(9, 'div', 5)(10, 'div', 6)(11, 'label', 7),
          h(12, 'First name'),
          u(13, 'sup'),
          h(14, '*'),
          d()(),
          b(15, 'input', 8),
          R(16, yO, 2, 0, 'div', 9),
          b(17, 'div', 10),
          d(),
          u(18, 'div', 6)(19, 'label', 11),
          h(20, 'Last name'),
          u(21, 'sup'),
          h(22, '*'),
          d()(),
          b(23, 'input', 12),
          R(24, bO, 2, 0, 'div', 9),
          b(25, 'div', 10),
          d()(),
          u(26, 'div', 5)(27, 'div', 6)(28, 'label', 13),
          h(29, 'Email'),
          u(30, 'sup'),
          h(31, '*'),
          d()(),
          b(32, 'input', 14),
          R(33, CO, 2, 0, 'div', 9)(34, wO, 2, 0, 'div', 9),
          b(35, 'div', 10),
          d(),
          u(36, 'div', 6)(37, 'label', 15),
          h(38, 'Phone Number'),
          u(39, 'sup'),
          h(40, '*'),
          d()(),
          b(41, 'input', 16),
          R(42, EO, 3, 2, 'div', 17),
          d()(),
          u(43, 'div', 5)(44, 'div', 6)(45, 'label', 18),
          h(46, 'Company name'),
          u(47, 'sup'),
          h(48, '*'),
          d()(),
          b(49, 'input', 19),
          R(50, TO, 2, 0, 'div', 9),
          b(51, 'div', 10),
          d(),
          u(52, 'div', 6)(53, 'label', 20),
          h(54, 'Company Location'),
          u(55, 'sup'),
          h(56, '*'),
          d()(),
          b(57, 'input', 21),
          R(58, MO, 2, 0, 'div', 9),
          b(59, 'div', 10),
          d()(),
          u(60, 'div', 22)(61, 'label', 23),
          h(62, 'Message'),
          u(63, 'sup'),
          h(64, '*'),
          d()(),
          b(65, 'textarea', 24),
          R(66, IO, 2, 0, 'div', 9),
          d(),
          u(67, 'div', 25)(68, 'button', 26),
          h(69, 'Submit'),
          d()()()()()),
        e & 2)
      ) {
        let r, o, s, a, l, c, f, p;
        w(8),
          D('formGroup', i.contactForm),
          w(8),
          D(
            'ngIf',
            ((r = i.contactForm.get('firstName')) == null ? null : r.invalid) &&
              ((r = i.contactForm.get('firstName')) == null ? null : r.touched),
          ),
          w(8),
          D(
            'ngIf',
            ((o = i.contactForm.get('lastName')) == null ? null : o.invalid) &&
              ((o = i.contactForm.get('lastName')) == null ? null : o.touched),
          ),
          w(9),
          D(
            'ngIf',
            ((s = i.contactForm.get('email')) == null ? null : s.hasError('required')) &&
              ((s = i.contactForm.get('email')) == null ? null : s.touched),
          ),
          w(),
          D(
            'ngIf',
            ((a = i.contactForm.get('email')) == null ? null : a.hasError('email')) &&
              ((a = i.contactForm.get('email')) == null ? null : a.touched),
          ),
          w(8),
          D(
            'ngIf',
            ((l = i.contactForm.get('PhoneNumber')) == null ? null : l.invalid) &&
              (((l = i.contactForm.get('PhoneNumber')) == null ? null : l.touched) ||
                ((l = i.contactForm.get('PhoneNumber')) == null ? null : l.dirty)),
          ),
          w(8),
          D(
            'ngIf',
            ((c = i.contactForm.get('companyName')) == null ? null : c.hasError('required')) &&
              ((c = i.contactForm.get('companyName')) == null ? null : c.touched),
          ),
          w(8),
          D(
            'ngIf',
            ((f = i.contactForm.get('companyLocation')) == null ? null : f.invalid) &&
              ((f = i.contactForm.get('companyLocation')) == null ? null : f.touched),
          ),
          w(8),
          D(
            'ngIf',
            ((p = i.contactForm.get('message')) == null ? null : p.hasError('required')) &&
              ((p = i.contactForm.get('message')) == null ? null : p.touched),
          );
      }
    },
    dependencies: [Gi, Un, jn, $i, Bn, um, li, ci, ot, Rt, $n],
    styles: [
      '.contact-us-wrapper[_ngcontent-%COMP%]{padding:100px}.contact-us-wrapper[_ngcontent-%COMP%]   sup[_ngcontent-%COMP%]{color:#dc3545}.contact-us-wrapper[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]{min-height:200px}.contact-us-wrapper[_ngcontent-%COMP%]   .error-msg[_ngcontent-%COMP%]{font-size:12px;color:#dc3545}',
    ],
  });
};
var Tu = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-staffing']],
    standalone: !0,
    features: [j],
    decls: 141,
    vars: 0,
    consts: [
      [1, 'finance-compo-data'],
      [1, 'services-block'],
      [1, 'container', 'p-0'],
      [
        1,
        'heading-border',
        'position-relative',
        'heading-xs',
        'semibold',
        'mb-4',
        'center-border',
        'text-center',
      ],
      [1, 'desc-sm', 'm-0', 'text-center'],
      [1, 'recruting-needs'],
      [1, 'heading-xs', 'semibold', 'text-center'],
      [1, 'card-block-needs'],
      [1, 'card-content'],
      ['width', '174', 'height', '173', 'viewBox', '0 0 174 173', 'fill', 'none'],
      [
        'd',
        'M173.333 84C173.333 130.392 135.725 168 89.3333 168C42.9414 168 5.33334 130.392 5.33334 84C5.33334 37.6081 42.9414 0 89.3333 0C135.725 0 173.333 37.6081 173.333 84ZM27.094 84C27.094 118.374 54.9595 146.239 89.3333 146.239C123.707 146.239 151.573 118.374 151.573 84C151.573 49.6261 123.707 21.7606 89.3333 21.7606C54.9595 21.7606 27.094 49.6261 27.094 84Z',
        'fill',
        '#D9D9D9',
      ],
      [
        'id',
        'path-2-outside-1_97_756',
        'maskUnits',
        'userSpaceOnUse',
        'x',
        '0.333344',
        'y',
        '32',
        'width',
        '94',
        'height',
        '141',
        'fill',
        'black',
      ],
      ['fill', 'white', 'x', '0.333344', 'y', '32', 'width', '94', 'height', '141'],
      [
        'd',
        'M89.3333 157.12C89.3333 163.129 84.4419 168.073 78.4832 167.296C66.6233 165.751 55.1864 161.685 44.9604 155.324C31.6429 147.038 20.9112 135.19 13.9801 121.12C7.04914 107.05 4.19577 91.3208 5.74313 75.7129C6.93129 63.7282 10.6778 52.1826 16.6808 41.8382C19.6969 36.641 26.5975 35.7758 31.3617 39.438C36.1258 43.1001 36.9205 49.901 34.1428 55.2295C30.4862 62.244 28.1846 69.9218 27.3976 77.8597C26.2511 89.4243 28.3653 101.079 33.5008 111.504C38.6363 121.929 46.5879 130.708 56.4554 136.847C63.2285 141.061 70.7184 143.915 78.5082 145.291C84.4257 146.336 89.3333 151.111 89.3333 157.12Z',
      ],
      [
        'd',
        'M89.3333 157.12C89.3333 163.129 84.4419 168.073 78.4832 167.296C66.6233 165.751 55.1864 161.685 44.9604 155.324C31.6429 147.038 20.9112 135.19 13.9801 121.12C7.04914 107.05 4.19577 91.3208 5.74313 75.7129C6.93129 63.7282 10.6778 52.1826 16.6808 41.8382C19.6969 36.641 26.5975 35.7758 31.3617 39.438C36.1258 43.1001 36.9205 49.901 34.1428 55.2295C30.4862 62.244 28.1846 69.9218 27.3976 77.8597C26.2511 89.4243 28.3653 101.079 33.5008 111.504C38.6363 121.929 46.5879 130.708 56.4554 136.847C63.2285 141.061 70.7184 143.915 78.5082 145.291C84.4257 146.336 89.3333 151.111 89.3333 157.12Z',
        'fill',
        '#8F52F7',
      ],
      [
        'd',
        'M89.3333 157.12C89.3333 163.129 84.4419 168.073 78.4832 167.296C66.6233 165.751 55.1864 161.685 44.9604 155.324C31.6429 147.038 20.9112 135.19 13.9801 121.12C7.04914 107.05 4.19577 91.3208 5.74313 75.7129C6.93129 63.7282 10.6778 52.1826 16.6808 41.8382C19.6969 36.641 26.5975 35.7758 31.3617 39.438C36.1258 43.1001 36.9205 49.901 34.1428 55.2295C30.4862 62.244 28.1846 69.9218 27.3976 77.8597C26.2511 89.4243 28.3653 101.079 33.5008 111.504C38.6363 121.929 46.5879 130.708 56.4554 136.847C63.2285 141.061 70.7184 143.915 78.5082 145.291C84.4257 146.336 89.3333 151.111 89.3333 157.12Z',
        'stroke',
        'white',
        'stroke-width',
        '10',
        'mask',
        'url(#path-2-outside-1_97_756)',
      ],
      [1, 'text-lg', 'semibold', 'text-center'],
      [1, 'desc-lg', 'text-center'],
      ['width', '173', 'height', '178', 'viewBox', '0 0 173 178', 'fill', 'none'],
      [
        'd',
        'M173 89C173 135.392 135.392 173 89 173C42.6081 173 5 135.392 5 89C5 42.6081 42.6081 5 89 5C135.392 5 173 42.6081 173 89ZM26.7606 89C26.7606 123.374 54.6261 151.239 89 151.239C123.374 151.239 151.239 123.374 151.239 89C151.239 54.6261 123.374 26.7606 89 26.7606C54.6261 26.7606 26.7606 54.6261 26.7606 89Z',
        'fill',
        '#D9D9D9',
      ],
      [
        'id',
        'path-2-outside-1_97_766',
        'maskUnits',
        'userSpaceOnUse',
        'x',
        '0',
        'y',
        '37',
        'width',
        '94',
        'height',
        '141',
        'fill',
        'black',
      ],
      ['fill', 'white', 'y', '37', 'width', '94', 'height', '141'],
      [
        'd',
        'M89 162.12C89 168.129 84.1085 173.073 78.1498 172.296C66.29 170.751 54.8531 166.685 44.627 160.324C31.3096 152.038 20.5778 140.19 13.6468 126.12C6.71579 112.05 3.86243 96.3208 5.40978 80.7129C6.59794 68.7282 10.3444 57.1826 16.3474 46.8382C19.3635 41.641 26.2642 40.7758 31.0284 44.438C35.7925 48.1001 36.5871 54.901 33.8094 60.2295C30.1528 67.244 27.8512 74.9218 27.0643 82.8597C25.9178 94.4243 28.0319 106.079 33.1674 116.504C38.3029 126.929 46.2546 135.708 56.1221 141.847C62.8951 146.061 70.385 148.915 78.1749 150.291C84.0923 151.336 89 156.111 89 162.12Z',
      ],
      [
        'd',
        'M89 162.12C89 168.129 84.1085 173.073 78.1498 172.296C66.29 170.751 54.8531 166.685 44.627 160.324C31.3096 152.038 20.5778 140.19 13.6468 126.12C6.71579 112.05 3.86243 96.3208 5.40978 80.7129C6.59794 68.7282 10.3444 57.1826 16.3474 46.8382C19.3635 41.641 26.2642 40.7758 31.0284 44.438C35.7925 48.1001 36.5871 54.901 33.8094 60.2295C30.1528 67.244 27.8512 74.9218 27.0643 82.8597C25.9178 94.4243 28.0319 106.079 33.1674 116.504C38.3029 126.929 46.2546 135.708 56.1221 141.847C62.8951 146.061 70.385 148.915 78.1749 150.291C84.0923 151.336 89 156.111 89 162.12Z',
        'fill',
        '#8F52F7',
      ],
      [
        'd',
        'M89 162.12C89 168.129 84.1085 173.073 78.1498 172.296C66.29 170.751 54.8531 166.685 44.627 160.324C31.3096 152.038 20.5778 140.19 13.6468 126.12C6.71579 112.05 3.86243 96.3208 5.40978 80.7129C6.59794 68.7282 10.3444 57.1826 16.3474 46.8382C19.3635 41.641 26.2642 40.7758 31.0284 44.438C35.7925 48.1001 36.5871 54.901 33.8094 60.2295C30.1528 67.244 27.8512 74.9218 27.0643 82.8597C25.9178 94.4243 28.0319 106.079 33.1674 116.504C38.3029 126.929 46.2546 135.708 56.1221 141.847C62.8951 146.061 70.385 148.915 78.1749 150.291C84.0923 151.336 89 156.111 89 162.12Z',
        'stroke',
        'white',
        'stroke-width',
        '10',
        'mask',
        'url(#path-2-outside-1_97_766)',
      ],
      [
        'id',
        'path-3-outside-2_97_766',
        'maskUnits',
        'userSpaceOnUse',
        'x',
        '15',
        'y',
        '0',
        'width',
        '158',
        'height',
        '75',
        'fill',
        'black',
      ],
      ['fill', 'white', 'x', '15', 'width', '158', 'height', '75'],
      [
        'd',
        'M25.4267 52.8763C20.2022 49.9076 18.3203 43.2124 21.939 38.4151C29.6922 28.1365 39.7364 19.737 51.3308 13.9198C66.1802 6.46958 82.9055 3.58999 99.3915 5.64523C115.877 7.70047 131.384 14.5982 143.95 25.4662C153.761 33.9519 161.435 44.5604 166.428 56.4279C168.758 61.9668 165.29 67.9951 159.496 69.5902C153.703 71.1853 147.797 67.7211 145.218 62.2934C141.534 54.5383 136.268 47.5926 129.715 41.925C120.404 33.8724 108.915 28.7615 96.6995 27.2387C84.4843 25.7159 72.0918 27.8495 61.0892 33.3697C53.3452 37.255 46.5346 42.6951 41.0593 49.3083C37.2271 53.9368 30.6512 55.845 25.4267 52.8763Z',
      ],
      [
        'd',
        'M25.4267 52.8763C20.2022 49.9076 18.3203 43.2124 21.939 38.4151C29.6922 28.1365 39.7364 19.737 51.3308 13.9198C66.1802 6.46958 82.9055 3.58999 99.3915 5.64523C115.877 7.70047 131.384 14.5982 143.95 25.4662C153.761 33.9519 161.435 44.5604 166.428 56.4279C168.758 61.9668 165.29 67.9951 159.496 69.5902C153.703 71.1853 147.797 67.7211 145.218 62.2934C141.534 54.5383 136.268 47.5926 129.715 41.925C120.404 33.8724 108.915 28.7615 96.6995 27.2387C84.4843 25.7159 72.0918 27.8495 61.0892 33.3697C53.3452 37.255 46.5346 42.6951 41.0593 49.3083C37.2271 53.9368 30.6512 55.845 25.4267 52.8763Z',
        'fill',
        '#FF0074',
      ],
      [
        'd',
        'M25.4267 52.8763C20.2022 49.9076 18.3203 43.2124 21.939 38.4151C29.6922 28.1365 39.7364 19.737 51.3308 13.9198C66.1802 6.46958 82.9055 3.58999 99.3915 5.64523C115.877 7.70047 131.384 14.5982 143.95 25.4662C153.761 33.9519 161.435 44.5604 166.428 56.4279C168.758 61.9668 165.29 67.9951 159.496 69.5902C153.703 71.1853 147.797 67.7211 145.218 62.2934C141.534 54.5383 136.268 47.5926 129.715 41.925C120.404 33.8724 108.915 28.7615 96.6995 27.2387C84.4843 25.7159 72.0918 27.8495 61.0892 33.3697C53.3452 37.255 46.5346 42.6951 41.0593 49.3083C37.2271 53.9368 30.6512 55.845 25.4267 52.8763Z',
        'stroke',
        'white',
        'stroke-width',
        '10',
        'mask',
        'url(#path-3-outside-2_97_766)',
      ],
      ['width', '179', 'height', '178', 'viewBox', '0 0 179 178', 'fill', 'none'],
      [
        'd',
        'M173.667 89C173.667 135.392 136.058 173 89.6666 173C43.2746 173 5.66656 135.392 5.66656 89C5.66656 42.6081 43.2746 5 89.6666 5C136.058 5 173.667 42.6081 173.667 89ZM27.4272 89C27.4272 123.374 55.2927 151.239 89.6666 151.239C124.04 151.239 151.906 123.374 151.906 89C151.906 54.6261 124.04 26.7606 89.6666 26.7606C55.2927 26.7606 27.4272 54.6261 27.4272 89Z',
        'fill',
        '#D9D9D9',
      ],
      [
        'id',
        'path-2-outside-1_97_776',
        'maskUnits',
        'userSpaceOnUse',
        'x',
        '0.666565',
        'y',
        '37',
        'width',
        '94',
        'height',
        '141',
        'fill',
        'black',
      ],
      ['fill', 'white', 'x', '0.666565', 'y', '37', 'width', '94', 'height', '141'],
      [
        'd',
        'M89.6666 162.12C89.6666 168.129 84.7751 173.073 78.8164 172.296C66.9566 170.751 55.5196 166.685 45.2936 160.324C31.9762 152.038 21.2444 140.19 14.3134 126.12C7.38236 112.05 4.52899 96.3208 6.07635 80.7129C7.26451 68.7282 11.011 57.1826 17.014 46.8382C20.0301 41.641 26.9308 40.7758 31.6949 44.438C36.4591 48.1001 37.2537 54.901 34.476 60.2295C30.8194 67.244 28.5178 74.9218 27.7308 82.8597C26.5843 94.4243 28.6985 106.079 33.834 116.504C38.9695 126.929 46.9212 135.708 56.7887 141.847C63.5617 146.061 71.0516 148.915 78.8414 150.291C84.7589 151.336 89.6666 156.111 89.6666 162.12Z',
      ],
      [
        'd',
        'M89.6666 162.12C89.6666 168.129 84.7751 173.073 78.8164 172.296C66.9566 170.751 55.5196 166.685 45.2936 160.324C31.9762 152.038 21.2444 140.19 14.3134 126.12C7.38236 112.05 4.52899 96.3208 6.07635 80.7129C7.26451 68.7282 11.011 57.1826 17.014 46.8382C20.0301 41.641 26.9308 40.7758 31.6949 44.438C36.4591 48.1001 37.2537 54.901 34.476 60.2295C30.8194 67.244 28.5178 74.9218 27.7308 82.8597C26.5843 94.4243 28.6985 106.079 33.834 116.504C38.9695 126.929 46.9212 135.708 56.7887 141.847C63.5617 146.061 71.0516 148.915 78.8414 150.291C84.7589 151.336 89.6666 156.111 89.6666 162.12Z',
        'fill',
        '#8F52F7',
      ],
      [
        'd',
        'M89.6666 162.12C89.6666 168.129 84.7751 173.073 78.8164 172.296C66.9566 170.751 55.5196 166.685 45.2936 160.324C31.9762 152.038 21.2444 140.19 14.3134 126.12C7.38236 112.05 4.52899 96.3208 6.07635 80.7129C7.26451 68.7282 11.011 57.1826 17.014 46.8382C20.0301 41.641 26.9308 40.7758 31.6949 44.438C36.4591 48.1001 37.2537 54.901 34.476 60.2295C30.8194 67.244 28.5178 74.9218 27.7308 82.8597C26.5843 94.4243 28.6985 106.079 33.834 116.504C38.9695 126.929 46.9212 135.708 56.7887 141.847C63.5617 146.061 71.0516 148.915 78.8414 150.291C84.7589 151.336 89.6666 156.111 89.6666 162.12Z',
        'stroke',
        'white',
        'stroke-width',
        '10',
        'mask',
        'url(#path-2-outside-1_97_776)',
      ],
      [
        'id',
        'path-3-outside-2_97_776',
        'maskUnits',
        'userSpaceOnUse',
        'x',
        '15.6666',
        'y',
        '0',
        'width',
        '158',
        'height',
        '75',
        'fill',
        'black',
      ],
      ['fill', 'white', 'x', '15.6666', 'width', '158', 'height', '75'],
      [
        'd',
        'M26.0933 52.8763C20.8687 49.9076 18.9869 43.2124 22.6055 38.4151C30.3588 28.1365 40.403 19.737 51.9973 13.9198C66.8468 6.46958 83.572 3.58999 100.058 5.64523C116.544 7.70047 132.05 14.5982 144.616 25.4662C154.427 33.9519 162.102 44.5604 167.094 56.4279C169.424 61.9668 165.956 67.9951 160.163 69.5902C154.37 71.1853 148.463 67.7211 145.885 62.2934C142.201 54.5383 136.934 47.5926 130.381 41.925C121.071 33.8724 109.581 28.7615 97.3661 27.2387C85.1508 25.7159 72.7584 27.8495 61.7557 33.3697C54.0118 37.255 47.2012 42.6951 41.7258 49.3083C37.8937 53.9368 31.3178 55.845 26.0933 52.8763Z',
      ],
      [
        'd',
        'M26.0933 52.8763C20.8687 49.9076 18.9869 43.2124 22.6055 38.4151C30.3588 28.1365 40.403 19.737 51.9973 13.9198C66.8468 6.46958 83.572 3.58999 100.058 5.64523C116.544 7.70047 132.05 14.5982 144.616 25.4662C154.427 33.9519 162.102 44.5604 167.094 56.4279C169.424 61.9668 165.956 67.9951 160.163 69.5902C154.37 71.1853 148.463 67.7211 145.885 62.2934C142.201 54.5383 136.934 47.5926 130.381 41.925C121.071 33.8724 109.581 28.7615 97.3661 27.2387C85.1508 25.7159 72.7584 27.8495 61.7557 33.3697C54.0118 37.255 47.2012 42.6951 41.7258 49.3083C37.8937 53.9368 31.3178 55.845 26.0933 52.8763Z',
        'fill',
        '#FF0074',
      ],
      [
        'd',
        'M26.0933 52.8763C20.8687 49.9076 18.9869 43.2124 22.6055 38.4151C30.3588 28.1365 40.403 19.737 51.9973 13.9198C66.8468 6.46958 83.572 3.58999 100.058 5.64523C116.544 7.70047 132.05 14.5982 144.616 25.4662C154.427 33.9519 162.102 44.5604 167.094 56.4279C169.424 61.9668 165.956 67.9951 160.163 69.5902C154.37 71.1853 148.463 67.7211 145.885 62.2934C142.201 54.5383 136.934 47.5926 130.381 41.925C121.071 33.8724 109.581 28.7615 97.3661 27.2387C85.1508 25.7159 72.7584 27.8495 61.7557 33.3697C54.0118 37.255 47.2012 42.6951 41.7258 49.3083C37.8937 53.9368 31.3178 55.845 26.0933 52.8763Z',
        'stroke',
        'white',
        'stroke-width',
        '10',
        'mask',
        'url(#path-3-outside-2_97_776)',
      ],
      [
        'id',
        'path-4-outside-3_97_776',
        'maskUnits',
        'userSpaceOnUse',
        'x',
        '72.6666',
        'y',
        '48',
        'width',
        '106',
        'height',
        '130',
        'fill',
        'black',
      ],
      ['fill', 'white', 'x', '72.6666', 'y', '48', 'width', '106', 'height', '130'],
      [
        'd',
        'M154.045 54.3311C159.335 51.482 166.007 53.4446 168.149 59.059C172.412 70.2335 174.255 82.2309 173.502 94.2509C172.522 109.905 167.178 124.971 158.077 137.745C148.975 150.518 136.479 160.488 122.004 166.526C110.888 171.163 98.9466 173.338 86.9926 172.957C80.9866 172.766 76.953 167.101 77.9185 161.17C78.8839 155.239 84.495 151.315 90.5035 151.234C98.4132 151.127 106.264 149.513 113.626 146.443C124.352 141.969 133.611 134.582 140.355 125.117C147.099 115.653 151.058 104.489 151.784 92.8906C152.283 84.9294 151.245 76.9815 148.763 69.4706C146.877 63.7651 148.754 57.1802 154.045 54.3311Z',
      ],
      [
        'd',
        'M154.045 54.3311C159.335 51.482 166.007 53.4446 168.149 59.059C172.412 70.2335 174.255 82.2309 173.502 94.2509C172.522 109.905 167.178 124.971 158.077 137.745C148.975 150.518 136.479 160.488 122.004 166.526C110.888 171.163 98.9466 173.338 86.9926 172.957C80.9866 172.766 76.953 167.101 77.9185 161.17C78.8839 155.239 84.495 151.315 90.5035 151.234C98.4132 151.127 106.264 149.513 113.626 146.443C124.352 141.969 133.611 134.582 140.355 125.117C147.099 115.653 151.058 104.489 151.784 92.8906C152.283 84.9294 151.245 76.9815 148.763 69.4706C146.877 63.7651 148.754 57.1802 154.045 54.3311Z',
        'fill',
        '#01ADEF',
      ],
      [
        'd',
        'M154.045 54.3311C159.335 51.482 166.007 53.4446 168.149 59.059C172.412 70.2335 174.255 82.2309 173.502 94.2509C172.522 109.905 167.178 124.971 158.077 137.745C148.975 150.518 136.479 160.488 122.004 166.526C110.888 171.163 98.9466 173.338 86.9926 172.957C80.9866 172.766 76.953 167.101 77.9185 161.17C78.8839 155.239 84.495 151.315 90.5035 151.234C98.4132 151.127 106.264 149.513 113.626 146.443C124.352 141.969 133.611 134.582 140.355 125.117C147.099 115.653 151.058 104.489 151.784 92.8906C152.283 84.9294 151.245 76.9815 148.763 69.4706C146.877 63.7651 148.754 57.1802 154.045 54.3311Z',
        'stroke',
        'white',
        'stroke-width',
        '10',
        'mask',
        'url(#path-4-outside-3_97_776)',
      ],
      [
        'src',
        'assets/staffing/staffing-1.svg',
        'alt',
        'Short-Term Offshore Staffing',
        1,
        'img-fluid',
        'mb-3',
      ],
      [1, 'text-lg', 'semibold'],
      [1, 'desc-lg', 'text-left'],
      [
        'src',
        'assets/staffing/staffing-2.svg',
        'alt',
        'Contact-To-Permanent',
        1,
        'img-fluid',
        'mb-3',
      ],
      [
        'src',
        'assets/staffing/staffing-3.svg',
        'alt',
        'Permanent Offshore Staffing',
        1,
        'img-fluid',
        'mb-3',
      ],
      [1, 'services-block', 'pb-4'],
      [1, 'text-sm', 'mb-4'],
      [1, 'ps-3', 'm-0'],
      [1, 'mb-4'],
      [1, 'text-sm', 'semibold'],
      [1, 'desc-sm'],
    ],
    template: function (e, i) {
      e & 1 &&
        (u(0, 'div', 0)(1, 'div', 1)(2, 'div', 2)(3, 'h1', 3),
        h(4, 'We are IT Staffing Experts'),
        d(),
        u(5, 'p', 4),
        h(
          6,
          'We are a U.S.-based IT staffing company, specializing in filling IT roles since 2020. Our goal is to help hiring managers quickly and efficiently secure top IT talent, whether for contract or full-time positions. With a network of thousands of recruiters, we assist in crafting job descriptions, sourcing from a vast talent pool, and thoroughly vetting candidates\u2014only charging you once you make a hire.',
        ),
        d()()(),
        u(7, 'div', 5)(8, 'div', 2)(9, 'h1', 6),
        h(10, 'Whatever you financial services recruiting needs... We\u2019ve got you'),
        d(),
        u(11, 'div', 7)(12, 'div', 8),
        ze(),
        u(13, 'svg', 9),
        b(14, 'path', 10),
        u(15, 'mask', 11),
        b(16, 'rect', 12)(17, 'path', 13),
        d(),
        b(18, 'path', 14)(19, 'path', 15),
        d(),
        Ye(),
        u(20, 'h2', 16),
        h(21, 'Contact'),
        d(),
        u(22, 'p', 17),
        h(
          23,
          'Need a top tier financial services professionals on a short term contract? we\u2019ll help you find the perfect filt',
        ),
        d()(),
        u(24, 'div', 8),
        ze(),
        u(25, 'svg', 18),
        b(26, 'path', 19),
        u(27, 'mask', 20),
        b(28, 'rect', 21)(29, 'path', 22),
        d(),
        b(30, 'path', 23)(31, 'path', 24),
        u(32, 'mask', 25),
        b(33, 'rect', 26)(34, 'path', 27),
        d(),
        b(35, 'path', 28)(36, 'path', 29),
        d(),
        Ye(),
        u(37, 'h2', 16),
        h(38, 'Contact-To-Permanent'),
        d(),
        u(39, 'p', 17),
        h(
          40,
          'We help you secure a financial services professional who\u2019s got the work ethic & culture fit for a long term to permanent position',
        ),
        d()(),
        u(41, 'div', 8),
        ze(),
        u(42, 'svg', 30),
        b(43, 'path', 31),
        u(44, 'mask', 32),
        b(45, 'rect', 33)(46, 'path', 34),
        d(),
        b(47, 'path', 35)(48, 'path', 36),
        u(49, 'mask', 37),
        b(50, 'rect', 38)(51, 'path', 39),
        d(),
        b(52, 'path', 40)(53, 'path', 41),
        u(54, 'mask', 42),
        b(55, 'rect', 43)(56, 'path', 44),
        d(),
        b(57, 'path', 45)(58, 'path', 46),
        d(),
        Ye(),
        u(59, 'h2', 16),
        h(60, 'Permanent'),
        d(),
        u(61, 'p', 17),
        h(
          62,
          'From entry level to C-suite, our financial services recruiting team helps you find the skillset you\u2019re looking for that will become a difference maker for your team',
        ),
        d()()()()()(),
        u(63, 'div', 0)(64, 'div', 1)(65, 'div', 2)(66, 'h1', 3),
        h(67, 'Staffing - Offshore Resources'),
        d(),
        u(68, 'p', 4),
        h(
          69,
          "Offshore Resources Staffing offers businesses the flexibility to hire skilled professionals from other countries to meet various workforce needs. These resources can be engaged on a short-term, long-term, or permanent hire basis, depending on the organization's goals and project requirements:",
        ),
        d()()(),
        u(70, 'div', 5)(71, 'div', 2)(72, 'h1', 6),
        h(73, 'Whatever you needs... We\u2019ve got you'),
        d(),
        u(74, 'div', 7)(75, 'div', 8),
        b(76, 'img', 47),
        u(77, 'h2', 48),
        h(78, 'Short-Term Offshore Staffing'),
        d(),
        u(79, 'p', 49),
        h(
          80,
          'Typically used for project-based work or to address temporary gaps in skills or resources. This could include tasks such as software development for a specific project or seasonal support. Short-term hires allow businesses to quickly scale up their workforce without committing to long-term employment.',
        ),
        d()(),
        u(81, 'div', 8),
        b(82, 'img', 50),
        u(83, 'h2', 48),
        h(84, 'Long-Term Offshore Staffing'),
        d(),
        u(85, 'p', 49),
        h(
          86,
          'This involves hiring offshore resources for extended periods, such as for ongoing projects or to fill roles that require consistent support over time. It provides a stable resource without the long-term commitment of permanent hires, allowing businesses to manage resources flexibly as they evolve.',
        ),
        d()(),
        u(87, 'div', 8),
        b(88, 'img', 51),
        u(89, 'h2', 48),
        h(90, 'Permanent Offshore Hire'),
        d(),
        u(91, 'p', 49),
        h(
          92,
          'In this case, businesses hire offshore talent as full-time, long-term employees who integrate into the organization. Permanent hires are ideal for roles that require continuity, such as IT managers or business analysts, offering stability and a committed workforce.',
        ),
        d()()()()()(),
        u(93, 'div', 0)(94, 'div', 52)(95, 'div', 2)(96, 'h1', 3),
        h(97, 'Staffing - Contract to Hire'),
        d()()(),
        u(98, 'div', 2)(99, 'p', 53),
        h(
          100,
          "Contract staffing is an ideal solution for companies that need to quickly fill temporary or project-based roles without the long-term commitment of a full-time hire. This model is especially beneficial when you're facing specific short-term needs, such as: Contract Staffing: Our contract staffing solutions offer flexible options by sourcing IT professionals from a diverse range of channels, including staffing agencies, independent contractors, and freelance experts. Contract-to-Hire Staffing: Ideal for companies that need to meet immediate staffing requirements without committing to a permanent hire right away, our contract-to-hire services allow businesses to evaluate candidates before making a long-term decision. Direct Hire Staffing: Direct hire staffing is designed for companies seeking to fill specialized roles that require in-depth expertise, such as software development, network engineering, and database administration. We connect you with top talent for permanent, full-time positions. ",
        ),
        d(),
        u(101, 'ul', 54)(102, 'li', 55)(103, 'p', 56),
        h(104, 'Contract Staffing'),
        d(),
        u(105, 'div', 57),
        h(
          106,
          'Our contract staffing solutions offer flexible options by sourcing IT professionals from a diverse range of channels, including staffing agencies, independent contractors, and freelance experts.',
        ),
        d()(),
        u(107, 'li', 55)(108, 'p', 56),
        h(109, 'Contract-to-Hire Staffing'),
        d(),
        u(110, 'div', 57),
        h(
          111,
          'Ideal for companies that need to meet immediate staffing requirements without committing to a permanent hire right away, our contract-to-hire services allow businesses to evaluate candidates before making a long-term decision.',
        ),
        d()(),
        u(112, 'li', 55)(113, 'p', 56),
        h(114, 'Direct Hire Staffing'),
        d(),
        u(115, 'div', 57),
        h(
          116,
          'Direct hire staffing is designed for companies seeking to fill specialized roles that require in-depth expertise, such as software development, network engineering, and database administration. We connect you with top talent for permanent, full-time positions.',
        ),
        d()()()()(),
        u(117, 'div', 0)(118, 'div', 52)(119, 'div', 2)(120, 'h1', 3),
        h(121, 'Staffing - Contract'),
        d()()(),
        u(122, 'div', 2)(123, 'p', 53),
        h(
          124,
          'In today\u2019s fast-paced business environment, you need the flexibility to scale your workforce quickly. Our staffing solutions allow you to tap into a vast pool of skilled professionals, providing the talent you need, when and where you need it. Here\u2019s how we can help:',
        ),
        d(),
        u(125, 'ul', 54)(126, 'li', 55)(127, 'p', 56),
        h(128, 'Bring in Professionals with the Option to Convert Them to Permanent Hires'),
        d(),
        u(129, 'div', 57),
        h(
          130,
          'Our contract-to-hire and contract staffing solutions allow you to assess professionals on the job before deciding to make them permanent. This approach reduces hiring risks and ensures a better long-term fit for your business.',
        ),
        d()(),
        u(131, 'li', 55)(132, 'p', 56),
        h(133, 'Hire Candidates from All Experience Levels, Including Early-Career Talent'),
        d(),
        u(134, 'div', 57),
        h(
          135,
          'We offer a wide range of candidates, from seasoned professionals to early-career individuals. Hire fresh talent for innovation and growth, or bring in experienced experts to drive specialized projects and leadership.',
        ),
        d()(),
        u(136, 'li', 55)(137, 'p', 56),
        h(138, 'Access a Global Pool of Job Titles and Skills'),
        d(),
        u(139, 'div', 57),
        h(
          140,
          'Whether you need software developers, network engineers, or niche experts in emerging technologies, we connect you to talent across the globe, giving you access to a diverse range of job titles and specialized skills.',
        ),
        d()()()()());
    },
    styles: [
      '.services-block[_ngcontent-%COMP%]{padding:100px}.recruting-needs[_ngcontent-%COMP%]{padding:100px;background:#f9f9f9}.recruting-needs[_ngcontent-%COMP%]   .card-block-needs[_ngcontent-%COMP%]{display:flex;gap:40px;margin-top:60px;width:100%}.recruting-needs[_ngcontent-%COMP%]   .card-block-needs[_ngcontent-%COMP%]   .card-content[_ngcontent-%COMP%]{width:100%;text-align:center}.recruting-needs[_ngcontent-%COMP%]   .card-block-needs[_ngcontent-%COMP%]   .card-content[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{margin:0 auto 40px}.recruting-needs[_ngcontent-%COMP%]   .card-block-needs[_ngcontent-%COMP%]   .card-content[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin-bottom:8px}',
    ],
  });
};
var Mu = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-consulting']],
    standalone: !0,
    features: [j],
    decls: 96,
    vars: 0,
    consts: [
      [1, 'consulting-data'],
      [1, 'container', 'p-0'],
      [
        1,
        'heading-border',
        'position-relative',
        'heading-xs',
        'semibold',
        'mb-4',
        'center-border',
        'text-center',
      ],
      [1, 'desc-md', 'medium', 'mb-4', 'text-center'],
      [1, 'img-wrapper-data', 'd-flex', 'gap-4'],
      [1, 'card-data'],
      ['src', 'assets/consult/consult-1.png'],
      [1, 'text-md', 'semibold'],
      [1, 'text-sm'],
      ['src', 'assets/consult/consult-2.png'],
      ['src', 'assets/consult/consult-3.png'],
      [1, 'text-md', 'semibold', 'mb-2'],
      [
        1,
        'heading-border',
        'position-relative',
        'heading-xs',
        'semibold',
        'mb-5',
        'center-border',
        'text-center',
      ],
      [1, 'engineering-wrapper-data', 'd-flex', 'gap-5'],
      [1, 'card-data', 'w-100'],
      [1, 'cloud-wrapper-data', 'd-flex', 'gap-5'],
      ['src', 'assets/consult/clould.png'],
      [1, 'text-sm', 'mb-4'],
      ['src', 'assets/consult/hire-staffing.png'],
      [1, 'text-sm', 'mb-2'],
      [1, 'text-sm', 'mb-3'],
      ['src', 'assets/consult/staffing-direct.png'],
    ],
    template: function (e, i) {
      e & 1 &&
        (u(0, 'div', 0)(1, 'div', 1)(2, 'h1', 2),
        h(3, 'Consulting - Support Consulting'),
        d(),
        u(4, 'p', 3),
        h(5, 'Get future-ready with our consulting services'),
        d(),
        u(6, 'div', 4)(7, 'div', 5),
        b(8, 'img', 6),
        u(9, 'h1', 7),
        h(10, 'Future-Ready Business Strategy'),
        d(),
        u(11, 'p', 8),
        h(
          12,
          "Our consulting services equip your business with the tools and insights to prepare for tomorrow, ensuring you're ready to adapt to future challenges and opportunities.",
        ),
        d()(),
        u(13, 'div', 5),
        b(14, 'img', 9),
        u(15, 'h1', 7),
        h(16, 'Industry Expertise for Transformation'),
        d(),
        u(17, 'p', 8),
        h(
          18,
          'Leverage our deep knowledge in enterprise processes, technology, and transformation to reimagine your organization and take actionable steps towards achieving your vision.',
        ),
        d()(),
        u(19, 'div', 5),
        b(20, 'img', 10),
        u(21, 'h1', 11),
        h(22, 'Practical Solutions for Future Success'),
        d(),
        u(23, 'p', 8),
        h(
          24,
          'We\u2019ll guide you in asking the right questions to build a business that can meet the evolving needs of both your customers and employees, regardless of what the future brings.',
        ),
        d()()()()(),
        u(25, 'div', 0)(26, 'div', 1)(27, 'h1', 12),
        h(28, 'Consulting - Engineering'),
        d(),
        u(29, 'div', 13),
        b(30, 'img', 10),
        u(31, 'div', 14)(32, 'h1', 11),
        h(33, 'Practical Solutions for Future Success'),
        d(),
        u(34, 'p', 8),
        h(
          35,
          "We\u2019ll work closely with you to help identify and ask the right questions, enabling you to develop a business strategy that is agile and forward-thinking. Our goal is to ensure your organization is well-positioned to adapt to changing market conditions, technologies, and customer expectations. By focusing on both your customers' evolving needs and the demands of your employees, we\u2019ll help you create a resilient and sustainable business that thrives in any future landscape, no matter what challenges or opportunities lie ahead.",
        ),
        d()()()()(),
        u(36, 'div', 0)(37, 'div', 1)(38, 'h1', 12),
        h(39, 'Consulting - Cloud Services'),
        d(),
        u(40, 'div', 15),
        b(41, 'img', 16),
        u(42, 'div', 14)(43, 'h1', 11),
        h(44, 'Delivering business outcomes with cloud solutions'),
        d(),
        u(45, 'p', 17),
        h(
          46,
          'We provide cloud expertise, deep industry knowledge and partnerships to integrate, automate, manage and deliver the outcomes that fuel your innovation and',
        ),
        d(),
        u(47, 'ul')(48, 'li', 8),
        h(49, 'Cloud DevOps'),
        d(),
        u(50, 'li', 8),
        h(51, 'Cloud Management'),
        d(),
        u(52, 'li', 8),
        h(53, 'Cloud Migration'),
        d(),
        u(54, 'li', 8),
        h(55, 'Cloud Optimisation'),
        d(),
        u(56, 'li', 8),
        h(57, 'Cloud Security'),
        d()()()()()(),
        u(58, 'div', 0)(59, 'div', 1)(60, 'h1', 12),
        h(61, 'Contract to Hire Staffing'),
        d(),
        u(62, 'div', 15),
        b(63, 'img', 18),
        u(64, 'div', 14)(65, 'h1', 11),
        h(66, 'Flexible Solutions for Your Workforce Needs'),
        d(),
        u(67, 'p', 19),
        h(
          68,
          'In today\u2019s dynamic business landscape, finding the right talent is crucial, but so is ensuring that new hires are the perfect fit for your company\u2019s culture and long-term goals. Contract to Hire (C2H) staffing offers businesses a flexible and low-risk approach to hiring, allowing you to evaluate candidates on the job before committing to permanent employment. This model combines the best of both contract and direct hire options, providing businesses with the ability to quickly scale their workforce and make informed hiring decisions.',
        ),
        d(),
        u(69, 'p', 20),
        h(
          70,
          'Here\u2019s how Contract to Hire works, and how it benefits both employers and employees:',
        ),
        d(),
        u(71, 'ul')(72, 'li', 8),
        h(73, 'Contract Staffing'),
        d(),
        u(74, 'li', 8),
        h(75, 'Contract to Hire Staffing'),
        d(),
        u(76, 'li', 8),
        h(77, 'Direct Hire'),
        d()()()()()(),
        u(78, 'div', 0)(79, 'div', 1)(80, 'h1', 12),
        h(81, 'Staffing - Direct Placement'),
        d(),
        u(82, 'div', 15),
        b(83, 'img', 21),
        u(84, 'div', 14)(85, 'h1', 11),
        h(86, 'Full-time engagement professionals'),
        d(),
        u(87, 'p', 20),
        h(
          88,
          'As permanent employees, full-time engagement professionals have experience working with small and midsize businesses, Fortune 500 enterprises, and leading software and systems. They apply their knowledge and experience to produce results for you quickly. This solution allows you to:',
        ),
        d(),
        u(89, 'ul')(90, 'li', 8),
        h(91, "Access a pool of contract talent that's not available in the hiring market"),
        d(),
        u(92, 'li', 8),
        h(
          93,
          'Benefit from continuity of talent when staffing open roles and critical or recurring projects',
        ),
        d(),
        u(94, 'li', 8),
        h(95, 'Reduce the risk of costly disruptions or missteps caused by turnover'),
        d()()()()()());
    },
    styles: [
      '.consulting-data[_ngcontent-%COMP%]{padding:100px}.img-wrapper-data[_ngcontent-%COMP%]   .card-data[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:250px;width:100%;object-fit:fill;margin-bottom:15px}.engineering-wrapper-data[_ngcontent-%COMP%]   img[_ngcontent-%COMP%], .cloud-wrapper-data[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:35%;object-fit:fill}.cloud-wrapper-data[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{padding:0 0 0 16px}',
    ],
  });
};
var Iu = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-finance']],
    standalone: !0,
    features: [j],
    decls: 63,
    vars: 0,
    consts: [
      [1, 'finance-compo-data'],
      [1, 'services-block'],
      [1, 'container', 'p-0'],
      [
        1,
        'heading-border',
        'position-relative',
        'heading-xs',
        'semibold',
        'mb-4',
        'center-border',
        'text-center',
      ],
      [1, 'desc-sm', 'm-0', 'text-center'],
      [1, 'recruting-needs'],
      [1, 'heading-xs', 'semibold', 'text-center'],
      [1, 'card-block-needs'],
      [1, 'card-content'],
      ['width', '174', 'height', '173', 'viewBox', '0 0 174 173', 'fill', 'none'],
      [
        'd',
        'M173.333 84C173.333 130.392 135.725 168 89.3333 168C42.9414 168 5.33334 130.392 5.33334 84C5.33334 37.6081 42.9414 0 89.3333 0C135.725 0 173.333 37.6081 173.333 84ZM27.094 84C27.094 118.374 54.9595 146.239 89.3333 146.239C123.707 146.239 151.573 118.374 151.573 84C151.573 49.6261 123.707 21.7606 89.3333 21.7606C54.9595 21.7606 27.094 49.6261 27.094 84Z',
        'fill',
        '#D9D9D9',
      ],
      [
        'id',
        'path-2-outside-1_97_756',
        'maskUnits',
        'userSpaceOnUse',
        'x',
        '0.333344',
        'y',
        '32',
        'width',
        '94',
        'height',
        '141',
        'fill',
        'black',
      ],
      ['fill', 'white', 'x', '0.333344', 'y', '32', 'width', '94', 'height', '141'],
      [
        'd',
        'M89.3333 157.12C89.3333 163.129 84.4419 168.073 78.4832 167.296C66.6233 165.751 55.1864 161.685 44.9604 155.324C31.6429 147.038 20.9112 135.19 13.9801 121.12C7.04914 107.05 4.19577 91.3208 5.74313 75.7129C6.93129 63.7282 10.6778 52.1826 16.6808 41.8382C19.6969 36.641 26.5975 35.7758 31.3617 39.438C36.1258 43.1001 36.9205 49.901 34.1428 55.2295C30.4862 62.244 28.1846 69.9218 27.3976 77.8597C26.2511 89.4243 28.3653 101.079 33.5008 111.504C38.6363 121.929 46.5879 130.708 56.4554 136.847C63.2285 141.061 70.7184 143.915 78.5082 145.291C84.4257 146.336 89.3333 151.111 89.3333 157.12Z',
      ],
      [
        'd',
        'M89.3333 157.12C89.3333 163.129 84.4419 168.073 78.4832 167.296C66.6233 165.751 55.1864 161.685 44.9604 155.324C31.6429 147.038 20.9112 135.19 13.9801 121.12C7.04914 107.05 4.19577 91.3208 5.74313 75.7129C6.93129 63.7282 10.6778 52.1826 16.6808 41.8382C19.6969 36.641 26.5975 35.7758 31.3617 39.438C36.1258 43.1001 36.9205 49.901 34.1428 55.2295C30.4862 62.244 28.1846 69.9218 27.3976 77.8597C26.2511 89.4243 28.3653 101.079 33.5008 111.504C38.6363 121.929 46.5879 130.708 56.4554 136.847C63.2285 141.061 70.7184 143.915 78.5082 145.291C84.4257 146.336 89.3333 151.111 89.3333 157.12Z',
        'fill',
        '#8F52F7',
      ],
      [
        'd',
        'M89.3333 157.12C89.3333 163.129 84.4419 168.073 78.4832 167.296C66.6233 165.751 55.1864 161.685 44.9604 155.324C31.6429 147.038 20.9112 135.19 13.9801 121.12C7.04914 107.05 4.19577 91.3208 5.74313 75.7129C6.93129 63.7282 10.6778 52.1826 16.6808 41.8382C19.6969 36.641 26.5975 35.7758 31.3617 39.438C36.1258 43.1001 36.9205 49.901 34.1428 55.2295C30.4862 62.244 28.1846 69.9218 27.3976 77.8597C26.2511 89.4243 28.3653 101.079 33.5008 111.504C38.6363 121.929 46.5879 130.708 56.4554 136.847C63.2285 141.061 70.7184 143.915 78.5082 145.291C84.4257 146.336 89.3333 151.111 89.3333 157.12Z',
        'stroke',
        'white',
        'stroke-width',
        '10',
        'mask',
        'url(#path-2-outside-1_97_756)',
      ],
      [1, 'text-lg', 'semibold', 'text-center'],
      [1, 'desc-lg', 'text-center'],
      ['width', '173', 'height', '178', 'viewBox', '0 0 173 178', 'fill', 'none'],
      [
        'd',
        'M173 89C173 135.392 135.392 173 89 173C42.6081 173 5 135.392 5 89C5 42.6081 42.6081 5 89 5C135.392 5 173 42.6081 173 89ZM26.7606 89C26.7606 123.374 54.6261 151.239 89 151.239C123.374 151.239 151.239 123.374 151.239 89C151.239 54.6261 123.374 26.7606 89 26.7606C54.6261 26.7606 26.7606 54.6261 26.7606 89Z',
        'fill',
        '#D9D9D9',
      ],
      [
        'id',
        'path-2-outside-1_97_766',
        'maskUnits',
        'userSpaceOnUse',
        'x',
        '0',
        'y',
        '37',
        'width',
        '94',
        'height',
        '141',
        'fill',
        'black',
      ],
      ['fill', 'white', 'y', '37', 'width', '94', 'height', '141'],
      [
        'd',
        'M89 162.12C89 168.129 84.1085 173.073 78.1498 172.296C66.29 170.751 54.8531 166.685 44.627 160.324C31.3096 152.038 20.5778 140.19 13.6468 126.12C6.71579 112.05 3.86243 96.3208 5.40978 80.7129C6.59794 68.7282 10.3444 57.1826 16.3474 46.8382C19.3635 41.641 26.2642 40.7758 31.0284 44.438C35.7925 48.1001 36.5871 54.901 33.8094 60.2295C30.1528 67.244 27.8512 74.9218 27.0643 82.8597C25.9178 94.4243 28.0319 106.079 33.1674 116.504C38.3029 126.929 46.2546 135.708 56.1221 141.847C62.8951 146.061 70.385 148.915 78.1749 150.291C84.0923 151.336 89 156.111 89 162.12Z',
      ],
      [
        'd',
        'M89 162.12C89 168.129 84.1085 173.073 78.1498 172.296C66.29 170.751 54.8531 166.685 44.627 160.324C31.3096 152.038 20.5778 140.19 13.6468 126.12C6.71579 112.05 3.86243 96.3208 5.40978 80.7129C6.59794 68.7282 10.3444 57.1826 16.3474 46.8382C19.3635 41.641 26.2642 40.7758 31.0284 44.438C35.7925 48.1001 36.5871 54.901 33.8094 60.2295C30.1528 67.244 27.8512 74.9218 27.0643 82.8597C25.9178 94.4243 28.0319 106.079 33.1674 116.504C38.3029 126.929 46.2546 135.708 56.1221 141.847C62.8951 146.061 70.385 148.915 78.1749 150.291C84.0923 151.336 89 156.111 89 162.12Z',
        'fill',
        '#8F52F7',
      ],
      [
        'd',
        'M89 162.12C89 168.129 84.1085 173.073 78.1498 172.296C66.29 170.751 54.8531 166.685 44.627 160.324C31.3096 152.038 20.5778 140.19 13.6468 126.12C6.71579 112.05 3.86243 96.3208 5.40978 80.7129C6.59794 68.7282 10.3444 57.1826 16.3474 46.8382C19.3635 41.641 26.2642 40.7758 31.0284 44.438C35.7925 48.1001 36.5871 54.901 33.8094 60.2295C30.1528 67.244 27.8512 74.9218 27.0643 82.8597C25.9178 94.4243 28.0319 106.079 33.1674 116.504C38.3029 126.929 46.2546 135.708 56.1221 141.847C62.8951 146.061 70.385 148.915 78.1749 150.291C84.0923 151.336 89 156.111 89 162.12Z',
        'stroke',
        'white',
        'stroke-width',
        '10',
        'mask',
        'url(#path-2-outside-1_97_766)',
      ],
      [
        'id',
        'path-3-outside-2_97_766',
        'maskUnits',
        'userSpaceOnUse',
        'x',
        '15',
        'y',
        '0',
        'width',
        '158',
        'height',
        '75',
        'fill',
        'black',
      ],
      ['fill', 'white', 'x', '15', 'width', '158', 'height', '75'],
      [
        'd',
        'M25.4267 52.8763C20.2022 49.9076 18.3203 43.2124 21.939 38.4151C29.6922 28.1365 39.7364 19.737 51.3308 13.9198C66.1802 6.46958 82.9055 3.58999 99.3915 5.64523C115.877 7.70047 131.384 14.5982 143.95 25.4662C153.761 33.9519 161.435 44.5604 166.428 56.4279C168.758 61.9668 165.29 67.9951 159.496 69.5902C153.703 71.1853 147.797 67.7211 145.218 62.2934C141.534 54.5383 136.268 47.5926 129.715 41.925C120.404 33.8724 108.915 28.7615 96.6995 27.2387C84.4843 25.7159 72.0918 27.8495 61.0892 33.3697C53.3452 37.255 46.5346 42.6951 41.0593 49.3083C37.2271 53.9368 30.6512 55.845 25.4267 52.8763Z',
      ],
      [
        'd',
        'M25.4267 52.8763C20.2022 49.9076 18.3203 43.2124 21.939 38.4151C29.6922 28.1365 39.7364 19.737 51.3308 13.9198C66.1802 6.46958 82.9055 3.58999 99.3915 5.64523C115.877 7.70047 131.384 14.5982 143.95 25.4662C153.761 33.9519 161.435 44.5604 166.428 56.4279C168.758 61.9668 165.29 67.9951 159.496 69.5902C153.703 71.1853 147.797 67.7211 145.218 62.2934C141.534 54.5383 136.268 47.5926 129.715 41.925C120.404 33.8724 108.915 28.7615 96.6995 27.2387C84.4843 25.7159 72.0918 27.8495 61.0892 33.3697C53.3452 37.255 46.5346 42.6951 41.0593 49.3083C37.2271 53.9368 30.6512 55.845 25.4267 52.8763Z',
        'fill',
        '#FF0074',
      ],
      [
        'd',
        'M25.4267 52.8763C20.2022 49.9076 18.3203 43.2124 21.939 38.4151C29.6922 28.1365 39.7364 19.737 51.3308 13.9198C66.1802 6.46958 82.9055 3.58999 99.3915 5.64523C115.877 7.70047 131.384 14.5982 143.95 25.4662C153.761 33.9519 161.435 44.5604 166.428 56.4279C168.758 61.9668 165.29 67.9951 159.496 69.5902C153.703 71.1853 147.797 67.7211 145.218 62.2934C141.534 54.5383 136.268 47.5926 129.715 41.925C120.404 33.8724 108.915 28.7615 96.6995 27.2387C84.4843 25.7159 72.0918 27.8495 61.0892 33.3697C53.3452 37.255 46.5346 42.6951 41.0593 49.3083C37.2271 53.9368 30.6512 55.845 25.4267 52.8763Z',
        'stroke',
        'white',
        'stroke-width',
        '10',
        'mask',
        'url(#path-3-outside-2_97_766)',
      ],
      ['width', '179', 'height', '178', 'viewBox', '0 0 179 178', 'fill', 'none'],
      [
        'd',
        'M173.667 89C173.667 135.392 136.058 173 89.6666 173C43.2746 173 5.66656 135.392 5.66656 89C5.66656 42.6081 43.2746 5 89.6666 5C136.058 5 173.667 42.6081 173.667 89ZM27.4272 89C27.4272 123.374 55.2927 151.239 89.6666 151.239C124.04 151.239 151.906 123.374 151.906 89C151.906 54.6261 124.04 26.7606 89.6666 26.7606C55.2927 26.7606 27.4272 54.6261 27.4272 89Z',
        'fill',
        '#D9D9D9',
      ],
      [
        'id',
        'path-2-outside-1_97_776',
        'maskUnits',
        'userSpaceOnUse',
        'x',
        '0.666565',
        'y',
        '37',
        'width',
        '94',
        'height',
        '141',
        'fill',
        'black',
      ],
      ['fill', 'white', 'x', '0.666565', 'y', '37', 'width', '94', 'height', '141'],
      [
        'd',
        'M89.6666 162.12C89.6666 168.129 84.7751 173.073 78.8164 172.296C66.9566 170.751 55.5196 166.685 45.2936 160.324C31.9762 152.038 21.2444 140.19 14.3134 126.12C7.38236 112.05 4.52899 96.3208 6.07635 80.7129C7.26451 68.7282 11.011 57.1826 17.014 46.8382C20.0301 41.641 26.9308 40.7758 31.6949 44.438C36.4591 48.1001 37.2537 54.901 34.476 60.2295C30.8194 67.244 28.5178 74.9218 27.7308 82.8597C26.5843 94.4243 28.6985 106.079 33.834 116.504C38.9695 126.929 46.9212 135.708 56.7887 141.847C63.5617 146.061 71.0516 148.915 78.8414 150.291C84.7589 151.336 89.6666 156.111 89.6666 162.12Z',
      ],
      [
        'd',
        'M89.6666 162.12C89.6666 168.129 84.7751 173.073 78.8164 172.296C66.9566 170.751 55.5196 166.685 45.2936 160.324C31.9762 152.038 21.2444 140.19 14.3134 126.12C7.38236 112.05 4.52899 96.3208 6.07635 80.7129C7.26451 68.7282 11.011 57.1826 17.014 46.8382C20.0301 41.641 26.9308 40.7758 31.6949 44.438C36.4591 48.1001 37.2537 54.901 34.476 60.2295C30.8194 67.244 28.5178 74.9218 27.7308 82.8597C26.5843 94.4243 28.6985 106.079 33.834 116.504C38.9695 126.929 46.9212 135.708 56.7887 141.847C63.5617 146.061 71.0516 148.915 78.8414 150.291C84.7589 151.336 89.6666 156.111 89.6666 162.12Z',
        'fill',
        '#8F52F7',
      ],
      [
        'd',
        'M89.6666 162.12C89.6666 168.129 84.7751 173.073 78.8164 172.296C66.9566 170.751 55.5196 166.685 45.2936 160.324C31.9762 152.038 21.2444 140.19 14.3134 126.12C7.38236 112.05 4.52899 96.3208 6.07635 80.7129C7.26451 68.7282 11.011 57.1826 17.014 46.8382C20.0301 41.641 26.9308 40.7758 31.6949 44.438C36.4591 48.1001 37.2537 54.901 34.476 60.2295C30.8194 67.244 28.5178 74.9218 27.7308 82.8597C26.5843 94.4243 28.6985 106.079 33.834 116.504C38.9695 126.929 46.9212 135.708 56.7887 141.847C63.5617 146.061 71.0516 148.915 78.8414 150.291C84.7589 151.336 89.6666 156.111 89.6666 162.12Z',
        'stroke',
        'white',
        'stroke-width',
        '10',
        'mask',
        'url(#path-2-outside-1_97_776)',
      ],
      [
        'id',
        'path-3-outside-2_97_776',
        'maskUnits',
        'userSpaceOnUse',
        'x',
        '15.6666',
        'y',
        '0',
        'width',
        '158',
        'height',
        '75',
        'fill',
        'black',
      ],
      ['fill', 'white', 'x', '15.6666', 'width', '158', 'height', '75'],
      [
        'd',
        'M26.0933 52.8763C20.8687 49.9076 18.9869 43.2124 22.6055 38.4151C30.3588 28.1365 40.403 19.737 51.9973 13.9198C66.8468 6.46958 83.572 3.58999 100.058 5.64523C116.544 7.70047 132.05 14.5982 144.616 25.4662C154.427 33.9519 162.102 44.5604 167.094 56.4279C169.424 61.9668 165.956 67.9951 160.163 69.5902C154.37 71.1853 148.463 67.7211 145.885 62.2934C142.201 54.5383 136.934 47.5926 130.381 41.925C121.071 33.8724 109.581 28.7615 97.3661 27.2387C85.1508 25.7159 72.7584 27.8495 61.7557 33.3697C54.0118 37.255 47.2012 42.6951 41.7258 49.3083C37.8937 53.9368 31.3178 55.845 26.0933 52.8763Z',
      ],
      [
        'd',
        'M26.0933 52.8763C20.8687 49.9076 18.9869 43.2124 22.6055 38.4151C30.3588 28.1365 40.403 19.737 51.9973 13.9198C66.8468 6.46958 83.572 3.58999 100.058 5.64523C116.544 7.70047 132.05 14.5982 144.616 25.4662C154.427 33.9519 162.102 44.5604 167.094 56.4279C169.424 61.9668 165.956 67.9951 160.163 69.5902C154.37 71.1853 148.463 67.7211 145.885 62.2934C142.201 54.5383 136.934 47.5926 130.381 41.925C121.071 33.8724 109.581 28.7615 97.3661 27.2387C85.1508 25.7159 72.7584 27.8495 61.7557 33.3697C54.0118 37.255 47.2012 42.6951 41.7258 49.3083C37.8937 53.9368 31.3178 55.845 26.0933 52.8763Z',
        'fill',
        '#FF0074',
      ],
      [
        'd',
        'M26.0933 52.8763C20.8687 49.9076 18.9869 43.2124 22.6055 38.4151C30.3588 28.1365 40.403 19.737 51.9973 13.9198C66.8468 6.46958 83.572 3.58999 100.058 5.64523C116.544 7.70047 132.05 14.5982 144.616 25.4662C154.427 33.9519 162.102 44.5604 167.094 56.4279C169.424 61.9668 165.956 67.9951 160.163 69.5902C154.37 71.1853 148.463 67.7211 145.885 62.2934C142.201 54.5383 136.934 47.5926 130.381 41.925C121.071 33.8724 109.581 28.7615 97.3661 27.2387C85.1508 25.7159 72.7584 27.8495 61.7557 33.3697C54.0118 37.255 47.2012 42.6951 41.7258 49.3083C37.8937 53.9368 31.3178 55.845 26.0933 52.8763Z',
        'stroke',
        'white',
        'stroke-width',
        '10',
        'mask',
        'url(#path-3-outside-2_97_776)',
      ],
      [
        'id',
        'path-4-outside-3_97_776',
        'maskUnits',
        'userSpaceOnUse',
        'x',
        '72.6666',
        'y',
        '48',
        'width',
        '106',
        'height',
        '130',
        'fill',
        'black',
      ],
      ['fill', 'white', 'x', '72.6666', 'y', '48', 'width', '106', 'height', '130'],
      [
        'd',
        'M154.045 54.3311C159.335 51.482 166.007 53.4446 168.149 59.059C172.412 70.2335 174.255 82.2309 173.502 94.2509C172.522 109.905 167.178 124.971 158.077 137.745C148.975 150.518 136.479 160.488 122.004 166.526C110.888 171.163 98.9466 173.338 86.9926 172.957C80.9866 172.766 76.953 167.101 77.9185 161.17C78.8839 155.239 84.495 151.315 90.5035 151.234C98.4132 151.127 106.264 149.513 113.626 146.443C124.352 141.969 133.611 134.582 140.355 125.117C147.099 115.653 151.058 104.489 151.784 92.8906C152.283 84.9294 151.245 76.9815 148.763 69.4706C146.877 63.7651 148.754 57.1802 154.045 54.3311Z',
      ],
      [
        'd',
        'M154.045 54.3311C159.335 51.482 166.007 53.4446 168.149 59.059C172.412 70.2335 174.255 82.2309 173.502 94.2509C172.522 109.905 167.178 124.971 158.077 137.745C148.975 150.518 136.479 160.488 122.004 166.526C110.888 171.163 98.9466 173.338 86.9926 172.957C80.9866 172.766 76.953 167.101 77.9185 161.17C78.8839 155.239 84.495 151.315 90.5035 151.234C98.4132 151.127 106.264 149.513 113.626 146.443C124.352 141.969 133.611 134.582 140.355 125.117C147.099 115.653 151.058 104.489 151.784 92.8906C152.283 84.9294 151.245 76.9815 148.763 69.4706C146.877 63.7651 148.754 57.1802 154.045 54.3311Z',
        'fill',
        '#01ADEF',
      ],
      [
        'd',
        'M154.045 54.3311C159.335 51.482 166.007 53.4446 168.149 59.059C172.412 70.2335 174.255 82.2309 173.502 94.2509C172.522 109.905 167.178 124.971 158.077 137.745C148.975 150.518 136.479 160.488 122.004 166.526C110.888 171.163 98.9466 173.338 86.9926 172.957C80.9866 172.766 76.953 167.101 77.9185 161.17C78.8839 155.239 84.495 151.315 90.5035 151.234C98.4132 151.127 106.264 149.513 113.626 146.443C124.352 141.969 133.611 134.582 140.355 125.117C147.099 115.653 151.058 104.489 151.784 92.8906C152.283 84.9294 151.245 76.9815 148.763 69.4706C146.877 63.7651 148.754 57.1802 154.045 54.3311Z',
        'stroke',
        'white',
        'stroke-width',
        '10',
        'mask',
        'url(#path-4-outside-3_97_776)',
      ],
    ],
    template: function (e, i) {
      e & 1 &&
        (u(0, 'div', 0)(1, 'div', 1)(2, 'div', 2)(3, 'h1', 3),
        h(4, 'Financial Services'),
        d(),
        u(5, 'p', 4),
        h(
          6,
          "The goal of our financial services recruiting team is to help hiring managers like you save the time and effort it take to recruit top talent. We create the job description for you, tap our network of skilled talent, post the role on all the main job boards(including our own). and best of all, you don't pay for financial services staffing until you make a hire",
        ),
        d()()(),
        u(7, 'div', 5)(8, 'div', 2)(9, 'h1', 6),
        h(10, 'Whatever you financial services recruiting needs... We\u2019ve got you'),
        d(),
        u(11, 'div', 7)(12, 'div', 8),
        ze(),
        u(13, 'svg', 9),
        b(14, 'path', 10),
        u(15, 'mask', 11),
        b(16, 'rect', 12)(17, 'path', 13),
        d(),
        b(18, 'path', 14)(19, 'path', 15),
        d(),
        Ye(),
        u(20, 'h2', 16),
        h(21, 'Contact'),
        d(),
        u(22, 'p', 17),
        h(
          23,
          'Need a top tier financial services professionals on a short term contract? we\u2019ll help you find the perfect filt',
        ),
        d()(),
        u(24, 'div', 8),
        ze(),
        u(25, 'svg', 18),
        b(26, 'path', 19),
        u(27, 'mask', 20),
        b(28, 'rect', 21)(29, 'path', 22),
        d(),
        b(30, 'path', 23)(31, 'path', 24),
        u(32, 'mask', 25),
        b(33, 'rect', 26)(34, 'path', 27),
        d(),
        b(35, 'path', 28)(36, 'path', 29),
        d(),
        Ye(),
        u(37, 'h2', 16),
        h(38, 'Contact-To-Permanent'),
        d(),
        u(39, 'p', 17),
        h(
          40,
          'We help you secure a financial services professional who\u2019s got the work ethic & culture fit for a long term to permanent position',
        ),
        d()(),
        u(41, 'div', 8),
        ze(),
        u(42, 'svg', 30),
        b(43, 'path', 31),
        u(44, 'mask', 32),
        b(45, 'rect', 33)(46, 'path', 34),
        d(),
        b(47, 'path', 35)(48, 'path', 36),
        u(49, 'mask', 37),
        b(50, 'rect', 38)(51, 'path', 39),
        d(),
        b(52, 'path', 40)(53, 'path', 41),
        u(54, 'mask', 42),
        b(55, 'rect', 43)(56, 'path', 44),
        d(),
        b(57, 'path', 45)(58, 'path', 46),
        d(),
        Ye(),
        u(59, 'h2', 16),
        h(60, 'Permanent'),
        d(),
        u(61, 'p', 17),
        h(
          62,
          'From entry level to C-suite, our financial services recruiting team helps you find the skillset you\u2019re looking for that will become a difference maker for your team',
        ),
        d()()()()()());
    },
    styles: [
      '.services-block[_ngcontent-%COMP%]{padding:100px}.recruting-needs[_ngcontent-%COMP%]{padding:100px;background:#f9f9f9}.recruting-needs[_ngcontent-%COMP%]   .card-block-needs[_ngcontent-%COMP%]{display:flex;gap:40px;margin-top:60px;width:100%}.recruting-needs[_ngcontent-%COMP%]   .card-block-needs[_ngcontent-%COMP%]   .card-content[_ngcontent-%COMP%]{width:100%;text-align:center}.recruting-needs[_ngcontent-%COMP%]   .card-block-needs[_ngcontent-%COMP%]   .card-content[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{margin:0 auto 40px}.recruting-needs[_ngcontent-%COMP%]   .card-block-needs[_ngcontent-%COMP%]   .card-content[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin-bottom:8px}',
    ],
  });
};
var xu = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-health-care']],
    standalone: !0,
    features: [j],
    decls: 8,
    vars: 0,
    consts: [
      [1, 'services-block'],
      [1, 'container', 'p-0'],
      [
        1,
        'heading-border',
        'position-relative',
        'heading-xs',
        'semibold',
        'mb-4',
        'center-border',
        'text-center',
      ],
      [1, 'text-lg', 'semibold', 'mb-3', 'text-center'],
      [1, 'desc-sm', 'm-0', 'text-center'],
    ],
    template: function (e, i) {
      e & 1 &&
        (u(0, 'div', 0)(1, 'div', 1)(2, 'h1', 2),
        h(3, 'Healthcare Services'),
        d(),
        u(4, 'h2', 3),
        h(5, 'We can staff for different sectors of the the healthcare industry'),
        d(),
        u(6, 'p', 4),
        h(
          7,
          'We\u2019re your full services healthcare solution partner. Beyond healthcare staffing, we also provide proactive, sustainable solution looking at the whole organisation. Whether we\u2019re addressing talent and skills gap through international solutions and clinical upscaling, or transforming your facility\u2019s talent and tech operations, our solutions improve talent rendition, productivity, and engagement, all leading to better patient care.',
        ),
        d()()());
    },
    styles: ['.services-block[_ngcontent-%COMP%]{padding:100px}'],
  });
};
var Nu = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-information-technology']],
    standalone: !0,
    features: [j],
    decls: 2,
    vars: 0,
    template: function (e, i) {
      e & 1 && (u(0, 'p'), h(1, 'information-technology works!'), d());
    },
  });
};
var Au = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-retail']],
    standalone: !0,
    features: [j],
    decls: 2,
    vars: 0,
    template: function (e, i) {
      e & 1 && (u(0, 'p'), h(1, 'retail works!'), d());
    },
  });
};
var Ou = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-life-sciences']],
    standalone: !0,
    features: [j],
    decls: 2,
    vars: 0,
    template: function (e, i) {
      e & 1 && (u(0, 'p'), h(1, 'life-sciences works!'), d());
    },
  });
};
var Ru = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-logistics']],
    standalone: !0,
    features: [j],
    decls: 2,
    vars: 0,
    template: function (e, i) {
      e & 1 && (u(0, 'p'), h(1, 'logistics works!'), d());
    },
  });
};
var Pu = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-search-jobs']],
    standalone: !0,
    features: [j],
    decls: 146,
    vars: 0,
    consts: [
      [1, 'search-jobs'],
      [1, 'container', 'p-0'],
      [1, 'heading-border', 'position-relative', 'heading-xs', 'semibold', 'mb-4'],
      [1, 'form-block'],
      [1, 'd-flex', 'gap-4', 'align-items-end'],
      [1, 'form-group', 'w-100'],
      ['for', 'jobTitle', 1, 'mb-2', 'text-sm', 'medium', 'd-block'],
      ['type', 'text', 'id', 'jobTitle', 'placeholder', 'Job Title', 1, 'form-control'],
      ['for', 'location', 1, 'mb-2', 'text-sm', 'medium', 'd-block'],
      ['type', 'text', 'id', 'location', 'placeholder', 'Location', 1, 'form-control'],
      ['for', 'jobType', 1, 'mb-2', 'text-sm', 'medium', 'd-block'],
      ['ngbDropdown', '', 1, 'd-inline-block', 'w-100'],
      ['id', 'dropdownMenu1', 'ngbDropdownToggle', '', 1, 'form-select', 'text-start'],
      ['ngbDropdownMenu', '', 'aria-labelledby', 'dropdownMenu1'],
      [1, 'dropdown-item'],
      [1, 'promates-btn', 'flex-shrink-0'],
      [1, 'job-list', 'd-flex', 'flex-column', 'gap-3', 'mt-5'],
      [1, 'job-card'],
      [1, 'job-card-data', 'd-flex', 'gap-4', 'align-items-start'],
      [1, 'job-card-details', 'w-100'],
      [1, 'text-lg', 'semibold', 'mb-2'],
      [1, 'text-sm', 'medium'],
      [1, 'job-card-location', 'flex-shrink-0', 'd-flex', 'gap-2', 'flex-column'],
      [1, 'text-sm', 'medium', 'mb-1'],
      [1, 'view-job-btn', 'flex-shrink-0', 'text-sm', 'medium'],
      [1, 'view-job-btn', 'flex-shrink-0'],
    ],
    template: function (e, i) {
      e & 1 &&
        (u(0, 'div', 0)(1, 'div', 1)(2, 'h1', 2),
        h(3, 'Job Search'),
        d(),
        u(4, 'div', 3)(5, 'form')(6, 'div', 4)(7, 'div', 5)(8, 'label', 6),
        h(9, 'Job Title'),
        d(),
        b(10, 'input', 7),
        d(),
        u(11, 'div', 5)(12, 'label', 8),
        h(13, 'Location'),
        d(),
        b(14, 'input', 9),
        d(),
        u(15, 'div', 5)(16, 'label', 10),
        h(17, 'Job Type'),
        d(),
        u(18, 'div', 11)(19, 'button', 12),
        h(20, 'Workspace'),
        d(),
        u(21, 'div', 13)(22, 'button', 14),
        h(23, 'Action - 1'),
        d(),
        u(24, 'button', 14),
        h(25, 'Action - 2'),
        d()()()(),
        u(26, 'button', 15),
        h(27, 'Search'),
        d()()()(),
        u(28, 'div', 16)(29, 'div', 17)(30, 'div', 18)(31, 'div', 19)(32, 'h2', 20),
        h(33, 'Angular Java Spring boot SQL Developer '),
        d(),
        u(34, 'p', 21),
        h(
          35,
          'We are seeking a highly skilled Angular Java Spring Boot SQL Developer to join our dynamic development team. In this role, you will be responsible for developing robust, scalable, and efficient web applications and backend systems, primarily using Angular, Java Spring Boot, and SQL technologies. The ideal candidate will be comfortable working across the full stack, from front-end development to back-end integration and database management. As an Angular Java Spring Boot SQL Developer, you will collaborate with cross-functional teams, including front-end developers, back-end engineers, UX/UI designers, and product managers, to create high-quality software solutions that meet business needs.',
        ),
        d()(),
        u(36, 'div', 22)(37, 'p', 23),
        h(38, '9/27/2024'),
        d(),
        u(39, 'p', 23),
        h(40, 'Full Time'),
        d(),
        u(41, 'p', 23),
        h(42, 'Hyderabad'),
        d()()()(),
        u(43, 'div', 17)(44, 'div', 18)(45, 'div', 19)(46, 'h2', 20),
        h(47, 'Angular Java Spring boot SQL Developer '),
        d(),
        u(48, 'p', 21),
        h(
          49,
          'We are seeking a highly skilled Angular Java Spring Boot SQL Developer to join our dynamic development team. In this role, you will be responsible for developing robust, scalable, and efficient web applications and backend systems, primarily using Angular, Java Spring Boot, and SQL technologies. The ideal candidate will be comfortable working across the full stack, from front-end development to back-end integration and database management. As an Angular Java Spring Boot SQL Developer, you will collaborate with cross-functional teams, including front-end developers, back-end engineers, UX/UI designers, and product managers, to create high-quality software solutions that meet business needs.',
        ),
        d()(),
        u(50, 'div', 22)(51, 'p', 23),
        h(52, '9/27/2024'),
        d(),
        u(53, 'p', 23),
        h(54, 'Full Time'),
        d(),
        u(55, 'p', 23),
        h(56, 'Hyderabad'),
        d()()()(),
        u(57, 'div', 17)(58, 'div', 18)(59, 'div', 19)(60, 'h2', 20),
        h(61, 'Angular Java Spring boot SQL Developer '),
        d(),
        u(62, 'p', 21),
        h(
          63,
          'We are seeking a highly skilled Angular Java Spring Boot SQL Developer to join our dynamic development team. In this role, you will be responsible for developing robust, scalable, and efficient web applications and backend systems, primarily using Angular, Java Spring Boot, and SQL technologies. The ideal candidate will be comfortable working across the full stack, from front-end development to back-end integration and database management. As an Angular Java Spring Boot SQL Developer, you will collaborate with cross-functional teams, including front-end developers, back-end engineers, UX/UI designers, and product managers, to create high-quality software solutions that meet business needs.',
        ),
        d()(),
        u(64, 'div', 22)(65, 'p', 23),
        h(66, '9/27/2024'),
        d(),
        u(67, 'p', 23),
        h(68, 'Full Time'),
        d(),
        u(69, 'p', 23),
        h(70, 'Hyderabad'),
        d()()()(),
        u(71, 'div', 17)(72, 'div', 18)(73, 'div', 19)(74, 'h2', 20),
        h(75, 'Angular Java Spring boot SQL Developer '),
        d(),
        u(76, 'p', 21),
        h(
          77,
          'We are seeking a highly skilled Angular Java Spring Boot SQL Developer to join our dynamic development team. In this role, you will be responsible for developing robust, scalable, and efficient web applications and backend systems, primarily using Angular, Java Spring Boot, and SQL technologies. The ideal candidate will be comfortable working across the full stack, from front-end development to back-end integration and database management. As an Angular Java Spring Boot SQL Developer, you will collaborate with cross-functional teams, including front-end developers, back-end engineers, UX/UI designers, and product managers, to create high-quality software solutions that meet business needs.',
        ),
        d()(),
        u(78, 'div', 22)(79, 'p', 23),
        h(80, '9/27/2024'),
        d(),
        u(81, 'p', 23),
        h(82, 'Full Time'),
        d(),
        u(83, 'p', 23),
        h(84, 'Hyderabad'),
        d()()()()()()(),
        u(85, 'div', 0)(86, 'div', 1)(87, 'h1', 2),
        h(88, 'Job Listing'),
        d(),
        u(89, 'div', 3)(90, 'form')(91, 'div', 4)(92, 'div', 5)(93, 'label', 8),
        h(94, 'Location'),
        d(),
        b(95, 'input', 9),
        d(),
        u(96, 'div', 5)(97, 'label', 10),
        h(98, 'Job Type'),
        d(),
        u(99, 'div', 11)(100, 'button', 12),
        h(101, 'Workspace'),
        d(),
        u(102, 'div', 13)(103, 'button', 14),
        h(104, 'Action - 1'),
        d(),
        u(105, 'button', 14),
        h(106, 'Action - 2'),
        d()()()(),
        u(107, 'button', 15),
        h(108, 'Search Jobs'),
        d()()()(),
        u(109, 'div', 16)(110, 'div', 17)(111, 'div', 18)(112, 'div', 19)(113, 'h2', 20),
        h(114, 'Content Manager'),
        d(),
        u(115, 'p', 21),
        h(116, 'San Francisco, CA, USA'),
        d()(),
        u(117, 'button', 24),
        h(118, 'View Job'),
        d()()(),
        u(119, 'div', 17)(120, 'div', 18)(121, 'div', 19)(122, 'h2', 20),
        h(123, 'Content Manager'),
        d(),
        u(124, 'p', 21),
        h(125, 'San Francisco, CA, USA'),
        d()(),
        u(126, 'button', 24),
        h(127, 'View Job'),
        d()()(),
        u(128, 'div', 17)(129, 'div', 18)(130, 'div', 19)(131, 'h2', 20),
        h(132, 'Content Manager'),
        d(),
        u(133, 'p', 21),
        h(134, 'San Francisco, CA, USA'),
        d()(),
        u(135, 'button', 24),
        h(136, 'View Job'),
        d()()(),
        u(137, 'div', 17)(138, 'div', 18)(139, 'div', 19)(140, 'h2', 20),
        h(141, 'Content Manager'),
        d(),
        u(142, 'p', 21),
        h(143, 'San Francisco, CA, USA'),
        d()(),
        u(144, 'button', 25),
        h(145, 'View Job'),
        d()()()()()());
    },
    dependencies: [ot, $n, Un, Bn, lm, Wo, Zi, zo, Br],
    styles: [
      '.search-jobs[_ngcontent-%COMP%]{padding:100px}.form-block[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .form-block[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{height:40px}.job-card[_ngcontent-%COMP%]{background:#fff;box-shadow:0 24px 48px #00115614;border-radius:8px;padding:30px}.view-job-btn[_ngcontent-%COMP%]{border-radius:60px;border:2px solid #0054CC;background:#fff;color:#0054cc;padding:8px 16px}',
    ],
  });
};
var va = (t) => ({ 'd-none': t });
function xO(t, n) {
  t & 1 && (u(0, 'div', 66), h(1, ' First name is required. '), d());
}
function NO(t, n) {
  t & 1 && (u(0, 'div', 66), h(1, ' Last name is required. '), d());
}
function AO(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Phone number is required.'), d());
}
function OO(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Enter a valid 10-digit phone number.'), d());
}
function RO(t, n) {
  if ((t & 1 && (u(0, 'div', 66), R(1, AO, 2, 0, 'div', 30)(2, OO, 2, 0, 'div', 30), d()), t & 2)) {
    let e,
      i,
      r = U();
    w(),
      D(
        'ngIf',
        (e = r.resumeForm.get('phone')) == null || e.errors == null ? null : e.errors.required,
      ),
      w(),
      D(
        'ngIf',
        (i = r.resumeForm.get('phone')) == null || i.errors == null ? null : i.errors.pattern,
      );
  }
}
function PO(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Enter a valid 10-digit phone number.'), d());
}
function FO(t, n) {
  if ((t & 1 && (u(0, 'div', 66), R(1, PO, 2, 0, 'div', 30), d()), t & 2)) {
    let e,
      i = U();
    w(),
      D(
        'ngIf',
        (e = i.resumeForm.get('altPhone')) == null || e.errors == null ? null : e.errors.pattern,
      );
  }
}
function kO(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Primary email is required. '), d());
}
function LO(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Enter a valid email address. '), d());
}
function VO(t, n) {
  if ((t & 1 && (u(0, 'div', 66), R(1, kO, 2, 0, 'div', 30)(2, LO, 2, 0, 'div', 30), d()), t & 2)) {
    let e,
      i,
      r = U();
    w(),
      D(
        'ngIf',
        (e = r.resumeForm.get('primaryEmail')) == null || e.errors == null
          ? null
          : e.errors.required,
      ),
      w(),
      D(
        'ngIf',
        (i = r.resumeForm.get('primaryEmail')) == null || i.errors == null ? null : i.errors.email,
      );
  }
}
function jO(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Enter a valid email address. '), d());
}
function BO(t, n) {
  if ((t & 1 && (u(0, 'div', 66), R(1, jO, 2, 0, 'div', 30), d()), t & 2)) {
    let e,
      i = U();
    w(),
      D(
        'ngIf',
        (e = i.resumeForm.get('altEmail')) == null || e.errors == null ? null : e.errors.email,
      );
  }
}
function UO(t, n) {
  if (t & 1) {
    let e = rt();
    We(0),
      u(1, 'button', 57),
      Z('click', function () {
        let r = ke(e).$implicit,
          o = U();
        return (
          o.resumeForm.patchValue({ country: r.code }), Le(o.dropdownValueSelection('country', r))
        );
      }),
      h(2),
      d(),
      qe();
  }
  if (t & 2) {
    let e = n.$implicit;
    w(2), Ae(e.name);
  }
}
function $O(t, n) {
  t & 1 && (u(0, 'div', 66), h(1, ' Country is required. '), d());
}
function HO(t, n) {
  if (t & 1) {
    let e = rt();
    We(0),
      u(1, 'button', 57),
      Z('click', function () {
        let r = ke(e).$implicit,
          o = U(2);
        return o.resumeForm.patchValue({ state: r.code }), Le(o.dropdownValueSelection('state', r));
      }),
      h(2),
      d(),
      qe();
  }
  if (t & 2) {
    let e = n.$implicit;
    w(2), Ae(e.name);
  }
}
function GO(t, n) {
  if ((t & 1 && (We(0), R(1, HO, 3, 1, 'ng-container', 26), qe()), t & 2)) {
    let e = U();
    w(), D('ngForOf', e.dropdownValues.country.states);
  }
}
function zO(t, n) {
  t & 1 && (u(0, 'div', 66), h(1, ' State is required. '), d());
}
function WO(t, n) {
  if (t & 1) {
    let e = rt();
    We(0),
      u(1, 'button', 57),
      Z('click', function () {
        let r = ke(e).$implicit,
          o = U();
        return (
          o.resumeForm.patchValue({ gender: r.value }), Le(o.dropdownValueSelection('gender', r))
        );
      }),
      h(2),
      d(),
      qe();
  }
  if (t & 2) {
    let e = n.$implicit;
    w(2), Ae(e.title);
  }
}
function qO(t, n) {
  t & 1 && (u(0, 'div', 66), h(1, ' Gender is required. '), d());
}
function QO(t, n) {
  t & 1 && (u(0, 'div', 66), h(1, ' Zip code is required. '), d());
}
function ZO(t, n) {
  if (t & 1) {
    let e = rt();
    u(0, 'div', 67)(1, 'span'),
      h(2),
      d(),
      u(3, 'button', 68),
      Z('click', function (r) {
        ke(e);
        let o = U(),
          s = Dr(92);
        return o.clearFile(s), Le(r.stopPropagation());
      }),
      h(4, 'Remove'),
      d()();
  }
  if (t & 2) {
    let e = U();
    w(2), Ae(e.selectedFileName);
  }
}
function KO(t, n) {
  t & 1 &&
    (u(0, 'div', 66),
    h(1, ' Please upload a valid file. Only PDF and DOC/DOCX files are allowed. '),
    d());
}
function YO(t, n) {
  t & 1 && (u(0, 'div', 66), h(1, ' Please enter a valid URL. '), d());
}
function JO(t, n) {
  t & 1 && (u(0, 'div', 66), h(1, ' Please enter a valid URL. '), d());
}
function XO(t, n) {
  t & 1 && (u(0, 'div', 66), h(1, ' Please enter a experience. '), d());
}
function e3(t, n) {
  t & 1 && (u(0, 'div', 66), h(1, ' Specialty is required. '), d());
}
function t3(t, n) {
  t & 1 && (u(0, 'div', 66), h(1, ' Work authorization selection is required. '), d());
}
function n3(t, n) {
  if (t & 1) {
    let e = rt();
    u(0, 'div', 69)(1, 'h1', 70),
      h(2, 'Thanks for submitting your resume!'),
      d(),
      u(3, 'p', 71),
      h(4, 'We will get back to you soon.'),
      d(),
      b(5, 'img', 72),
      u(6, 'button', 73),
      Z('click', function () {
        ke(e);
        let r = U();
        return Le((r.formSubmitted = !r.formSubmitted));
      }),
      h(7, 'Submit New Resume'),
      d()();
  }
}
var Fu = class t {
  constructor(n, e, i) {
    this.fb = n;
    this.notificationService = e;
    this.serviceInvoker = i;
  }
  resumeForm;
  dropdownValues = {};
  gendersArray = [
    { value: 'male', title: 'Male' },
    { value: 'female', title: 'Female' },
  ];
  countries = [
    {
      name: 'United States',
      code: 'US',
      states: [
        { name: 'California', code: 'CA' },
        { name: 'Texas', code: 'TX' },
        { name: 'New York', code: 'NY' },
        { name: 'Florida', code: 'FL' },
        { name: 'Illinois', code: 'IL' },
        { name: 'Pennsylvania', code: 'PA' },
        { name: 'Ohio', code: 'OH' },
        { name: 'Georgia', code: 'GA' },
        { name: 'North Carolina', code: 'NC' },
        { name: 'Michigan', code: 'MI' },
        { name: 'New Jersey', code: 'NJ' },
        { name: 'Virginia', code: 'VA' },
        { name: 'Washington', code: 'WA' },
        { name: 'Arizona', code: 'AZ' },
        { name: 'Massachusetts', code: 'MA' },
      ],
    },
    {
      name: 'Canada',
      code: 'CA',
      states: [
        { name: 'Ontario', code: 'ON' },
        { name: 'Quebec', code: 'QC' },
        { name: 'British Columbia', code: 'BC' },
        { name: 'Alberta', code: 'AB' },
        { name: 'Nova Scotia', code: 'NS' },
        { name: 'New Brunswick', code: 'NB' },
        { name: 'Manitoba', code: 'MB' },
        { name: 'Saskatchewan', code: 'SK' },
        { name: 'Prince Edward Island', code: 'PE' },
        { name: 'Newfoundland and Labrador', code: 'NL' },
      ],
    },
    {
      name: 'United Kingdom',
      code: 'GB',
      states: [
        { name: 'England', code: 'ENG' },
        { name: 'Scotland', code: 'SCO' },
        { name: 'Wales', code: 'WAL' },
        { name: 'Northern Ireland', code: 'NIR' },
      ],
    },
    {
      name: 'Australia',
      code: 'AU',
      states: [
        { name: 'New South Wales', code: 'NSW' },
        { name: 'Victoria', code: 'VIC' },
        { name: 'Queensland', code: 'QLD' },
        { name: 'Western Australia', code: 'WA' },
        { name: 'South Australia', code: 'SA' },
        { name: 'Tasmania', code: 'TAS' },
        { name: 'Australian Capital Territory', code: 'ACT' },
        { name: 'Northern Territory', code: 'NT' },
      ],
    },
    {
      name: 'India',
      code: 'IN',
      states: [
        { name: 'Maharashtra', code: 'MH' },
        { name: 'Tamil Nadu', code: 'TN' },
        { name: 'Karnataka', code: 'KA' },
        { name: 'Uttar Pradesh', code: 'UP' },
        { name: 'West Bengal', code: 'WB' },
        { name: 'Andhra Pradesh', code: 'AP' },
        { name: 'Bihar', code: 'BR' },
        { name: 'Rajasthan', code: 'RJ' },
        { name: 'Gujarat', code: 'GJ' },
        { name: 'Punjab', code: 'PB' },
        { name: 'Haryana', code: 'HR' },
        { name: 'Kerala', code: 'KL' },
        { name: 'Odisha', code: 'OD' },
        { name: 'Madhya Pradesh', code: 'MP' },
        { name: 'Chhattisgarh', code: 'CG' },
      ],
    },
    {
      name: 'Germany',
      code: 'DE',
      states: [
        { name: 'Bavaria', code: 'BY' },
        { name: 'Berlin', code: 'BE' },
        { name: 'Hesse', code: 'HE' },
        { name: 'North Rhine-Westphalia', code: 'NW' },
        { name: 'Saxony', code: 'SN' },
        { name: 'Lower Saxony', code: 'NI' },
        { name: 'Baden-W\xFCrttemberg', code: 'BW' },
        { name: 'Rhineland-Palatinate', code: 'RP' },
        { name: 'Thuringia', code: 'TH' },
        { name: 'Saarland', code: 'SL' },
      ],
    },
    {
      name: 'France',
      code: 'FR',
      states: [
        { name: '\xCEle-de-France', code: 'IDF' },
        { name: "Provence-Alpes-C\xF4te d'Azur", code: 'PAC' },
        { name: 'Rh\xF4ne-Alpes', code: 'RA' },
        { name: 'Normandy', code: 'NOR' },
        { name: 'Brittany', code: 'BRE' },
        { name: 'Aquitaine', code: 'AQU' },
        { name: 'Loire', code: 'LOI' },
        { name: 'Alsace', code: 'ALS' },
        { name: 'Languedoc-Roussillon', code: 'LR' },
      ],
    },
    {
      name: 'Italy',
      code: 'IT',
      states: [
        { name: 'Lazio', code: 'LAZ' },
        { name: 'Lombardy', code: 'LOM' },
        { name: 'Sicily', code: 'SIC' },
        { name: 'Campania', code: 'CAM' },
        { name: 'Tuscany', code: 'TOS' },
        { name: 'Emilia-Romagna', code: 'EMR' },
        { name: 'Veneto', code: 'VEN' },
        { name: 'Apulia', code: 'PUG' },
        { name: 'Calabria', code: 'CAL' },
        { name: 'Piedmont', code: 'PIE' },
      ],
    },
    {
      name: 'Spain',
      code: 'ES',
      states: [
        { name: 'Catalonia', code: 'CT' },
        { name: 'Andalusia', code: 'AN' },
        { name: 'Madrid', code: 'MD' },
        { name: 'Valencia', code: 'VC' },
        { name: 'Galicia', code: 'GA' },
        { name: 'Castile and Le\xF3n', code: 'CL' },
        { name: 'Basque Country', code: 'PV' },
        { name: 'Castilla-La Mancha', code: 'CM' },
        { name: 'Murcia', code: 'MC' },
        { name: 'Aragon', code: 'AR' },
      ],
    },
    {
      name: 'Mexico',
      code: 'MX',
      states: [
        { name: 'Jalisco', code: 'JA' },
        { name: 'Nuevo Le\xF3n', code: 'NL' },
        { name: 'CDMX', code: 'CDMX' },
        { name: 'Chihuahua', code: 'CH' },
        { name: 'Yucatan', code: 'YU' },
        { name: 'Puebla', code: 'PUE' },
        { name: 'Guanajuato', code: 'GTO' },
        { name: 'Michoac\xE1n', code: 'MIC' },
        { name: 'Oaxaca', code: 'OAX' },
        { name: 'Sonora', code: 'SON' },
      ],
    },
    {
      name: 'Brazil',
      code: 'BR',
      states: [
        { name: 'S\xE3o Paulo', code: 'SP' },
        { name: 'Rio de Janeiro', code: 'RJ' },
        { name: 'Minas Gerais', code: 'MG' },
        { name: 'Bahia', code: 'BA' },
        { name: 'Paran\xE1', code: 'PR' },
        { name: 'Rio Grande do Sul', code: 'RS' },
        { name: 'Pernambuco', code: 'PE' },
        { name: 'Cear\xE1', code: 'CE' },
        { name: 'Par\xE1', code: 'PA' },
        { name: 'Santa Catarina', code: 'SC' },
      ],
    },
    {
      name: 'Japan',
      code: 'JP',
      states: [
        { name: 'Tokyo', code: '13' },
        { name: 'Osaka', code: '27' },
        { name: 'Hokkaido', code: '01' },
        { name: 'Aichi', code: '23' },
        { name: 'Kyoto', code: '26' },
        { name: 'Fukuoka', code: '40' },
        { name: 'Chiba', code: '12' },
        { name: 'Kanagawa', code: '14' },
        { name: 'Hyogo', code: '28' },
        { name: 'Saitama', code: '11' },
      ],
    },
    {
      name: 'China',
      code: 'CN',
      states: [
        { name: 'Beijing', code: 'BJ' },
        { name: 'Shanghai', code: 'SH' },
        { name: 'Guangdong', code: 'GD' },
        { name: 'Sichuan', code: 'SC' },
        { name: 'Zhejiang', code: 'ZJ' },
        { name: 'Jiangsu', code: 'JS' },
        { name: 'Shandong', code: 'SD' },
        { name: 'Henan', code: 'HA' },
        { name: 'Hunan', code: 'HN' },
        { name: 'Anhui', code: 'AH' },
      ],
    },
    {
      name: 'Russia',
      code: 'RU',
      states: [
        { name: 'Moscow', code: 'MOW' },
        { name: 'Saint Petersburg', code: 'SPE' },
        { name: 'Sverdlovsk', code: 'SVE' },
        { name: 'Krasnoyarsk', code: 'KYA' },
        { name: 'Tatarstan', code: 'TA' },
        { name: 'Republic of Bashkortostan', code: 'BA' },
        { name: 'Krasnodar', code: 'KDA' },
        { name: 'Vladimir', code: 'VLA' },
        { name: 'Saratov', code: 'SAR' },
        { name: 'Volgograd', code: 'VGG' },
      ],
    },
    {
      name: 'South Korea',
      code: 'KR',
      states: [
        { name: 'Seoul', code: '11' },
        { name: 'Gyeonggi', code: '41' },
        { name: 'Busan', code: '26' },
        { name: 'Incheon', code: '28' },
        { name: 'Jeju', code: '49' },
        { name: 'Daegu', code: '27' },
        { name: 'Daejeon', code: '30' },
        { name: 'Ulsan', code: '31' },
      ],
    },
    {
      name: 'South Africa',
      code: 'ZA',
      states: [
        { name: 'Gauteng', code: 'GT' },
        { name: 'Western Cape', code: 'WC' },
        { name: 'KwaZulu-Natal', code: 'KZN' },
        { name: 'Eastern Cape', code: 'EC' },
        { name: 'Free State', code: 'FS' },
        { name: 'Limpopo', code: 'LP' },
        { name: 'Mpumalanga', code: 'MP' },
        { name: 'Northern Cape', code: 'NC' },
        { name: 'North West', code: 'NW' },
      ],
    },
    {
      name: 'New Zealand',
      code: 'NZ',
      states: [
        { name: 'Auckland', code: 'AUK' },
        { name: 'Wellington', code: 'WGN' },
        { name: 'Canterbury', code: 'CAN' },
        { name: 'Otago', code: 'OTA' },
        { name: 'Waikato', code: 'WKO' },
        { name: 'Bay of Plenty', code: 'BOP' },
        { name: 'Taranaki', code: 'TAR' },
        { name: "Hawke's Bay", code: 'HKB' },
        { name: 'Manawatu-Wanganui', code: 'MW' },
      ],
    },
    {
      name: 'Argentina',
      code: 'AR',
      states: [
        { name: 'Buenos Aires', code: 'BA' },
        { name: 'Cordoba', code: 'C' },
        { name: 'Santa Fe', code: 'SF' },
        { name: 'Mendoza', code: 'M' },
        { name: 'Tucum\xE1n', code: 'TU' },
        { name: 'Entre R\xEDos', code: 'ER' },
        { name: 'Chaco', code: 'CHA' },
        { name: 'Misiones', code: 'M' },
        { name: 'Corrientes', code: 'COR' },
        { name: 'Salta', code: 'SA' },
      ],
    },
    {
      name: 'Colombia',
      code: 'CO',
      states: [
        { name: 'Antioquia', code: 'ANT' },
        { name: 'Cundinamarca', code: 'CUN' },
        { name: 'Valle del Cauca', code: 'VAC' },
        { name: 'Bogot\xE1', code: 'BOG' },
        { name: 'Atlantico', code: 'ATL' },
        { name: 'Santander', code: 'SAN' },
        { name: 'Bolivar', code: 'BOL' },
        { name: 'Nari\xF1o', code: 'NAR' },
        { name: 'Tolima', code: 'TOL' },
        { name: 'Cesar', code: 'CES' },
      ],
    },
    {
      name: 'Chile',
      code: 'CL',
      states: [
        { name: 'Santiago', code: 'RM' },
        { name: 'Valpara\xEDso', code: 'V' },
        { name: 'Antofagasta', code: 'AN' },
        { name: 'Maule', code: 'ML' },
        { name: 'Araucan\xEDa', code: 'AR' },
        { name: 'Los Lagos', code: 'LL' },
        { name: 'Coquimbo', code: 'CO' },
        { name: 'Los Rios', code: 'LR' },
        { name: 'O\u2019Higgins', code: 'OH' },
      ],
    },
  ];
  formSubmitted = !1;
  selectedFileName;
  ngOnInit() {
    this.resumeForm = this.fb.group({
      firstName: ['', se.required],
      lastName: ['', se.required],
      phone: ['', [se.required, se.pattern('[0-9]{10}')]],
      altPhone: ['', se.pattern('[0-9]{10}')],
      primaryEmail: ['', [se.required, se.email]],
      altEmail: ['', se.email],
      state: ['', se.required],
      gender: ['', se.required],
      zip: ['', se.required],
      country: ['', se.required],
      resume: ['', se.required],
      workAuth: ['authorized', se.required],
      githubURL: [
        '',
        se.pattern(
          '(https?://)?(www.)?([a-zA-Z0-9-]+\\.){1,}([a-zA-Z]{2,22})(/[a-zA-Z0-9-]+)*(/)?',
        ),
      ],
      linkedInURL: [
        '',
        se.pattern(
          '(https?://)?(www.)?([a-zA-Z0-9-]+\\.){1,}([a-zA-Z]{2,22})(/[a-zA-Z0-9-]+)*(/)?',
        ),
      ],
      experience: [''],
    });
  }
  onSubmit() {
    this.resumeForm.valid
      ? (console.log(this.resumeForm.value),
        this.resumeForm.reset({ workAuth: 'authorized' }),
        this.notificationService.notify('Submitted sucessfully', 'success'),
        (this.selectedFileName = null),
        (this.formSubmitted = !0))
      : (this.notificationService.notify('Mandatory fileds are missing', 'warning'),
        console.log('Form is invalid'));
  }
  onFileChange(n) {
    let e = n.target;
    if (e && e.files && e.files.length > 0) {
      let i = e.files[0];
      this.isValidFileType(i)
        ? ((this.selectedFileName = i.name),
          (this.dropdownValues = {}),
          this.resumeForm.patchValue({ resume: i }))
        : (this.notificationService.notify(
            'Invalid file type. Only PDF and DOC/DOCX files are allowed.',
            'warning',
          ),
          console.log('Invalid file type. Only PDF and DOC/DOCX files are allowed.'),
          (this.selectedFileName = null),
          this.resumeForm.patchValue({ resume: null }));
    }
  }
  isValidFileType(n) {
    return [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ].includes(n.type);
  }
  dropdownValueSelection(n, e) {
    this.dropdownValues[n] || (this.dropdownValues[n] = {}), (this.dropdownValues[n] = e);
  }
  clearFile(n) {
    (n.value = ''), (this.selectedFileName = null), this.resumeForm.patchValue({ resume: null });
  }
  static ɵfac = function (e) {
    return new (e || t)(k(Hi), k(Et), k(Gn));
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-submit-resume']],
    standalone: !0,
    features: [j],
    decls: 152,
    vars: 41,
    consts: [
      ['fileInput', ''],
      [1, 'submit-resume'],
      [1, 'container', 'p-0'],
      [1, 'heading-border', 'position-relative', 'heading-xs', 'semibold', 'mb-4'],
      [1, 'form-block'],
      [3, 'ngSubmit', 'formGroup', 'ngClass'],
      [1, 'd-flex', 'gap-4'],
      [1, 'form-group'],
      ['for', 'firstName'],
      [
        'type',
        'text',
        'id',
        'firstName',
        'formControlName',
        'firstName',
        'placeholder',
        'Name',
        1,
        'form-control',
      ],
      ['class', 'text-danger', 4, 'ngIf'],
      ['for', 'lastName'],
      [
        'type',
        'text',
        'id',
        'lastName',
        'formControlName',
        'lastName',
        'placeholder',
        'Name',
        1,
        'form-control',
      ],
      ['for', 'phone'],
      [
        'type',
        'tel',
        'id',
        'phone',
        'formControlName',
        'phone',
        'placeholder',
        'Phone',
        1,
        'form-control',
      ],
      ['for', 'altPhone'],
      [
        'type',
        'tel',
        'id',
        'altPhone',
        'formControlName',
        'altPhone',
        'placeholder',
        'Phone',
        1,
        'form-control',
      ],
      ['for', 'primaryEmail'],
      [
        'type',
        'email',
        'id',
        'primaryEmail',
        'formControlName',
        'primaryEmail',
        'placeholder',
        'Email',
        1,
        'form-control',
      ],
      ['for', 'altEmail'],
      [
        'type',
        'email',
        'id',
        'altEmail',
        'formControlName',
        'altEmail',
        'placeholder',
        'Email',
        1,
        'form-control',
      ],
      [1, 'd-flex', 'gap-4', 'mb-3'],
      ['ngbDropdown', '', 1, 'd-inline-block', 'w-100'],
      ['for', 'gender'],
      ['id', 'dropdownMenu3', 'ngbDropdownToggle', '', 'type', 'button', 1, 'form-select'],
      ['ngbDropdownMenu', '', 'aria-labelledby', 'dropdownMenu3', 1, 'w-100'],
      [4, 'ngFor', 'ngForOf'],
      ['for', 'state'],
      ['id', 'dropdownMenu1', 'ngbDropdownToggle', '', 'type', 'button', 1, 'form-select'],
      ['ngbDropdownMenu', '', 'aria-labelledby', 'dropdownMenu1', 1, 'w-100'],
      [4, 'ngIf'],
      ['id', 'dropdownMenu2', 'ngbDropdownToggle', '', 'type', 'button', 1, 'form-select'],
      ['ngbDropdownMenu', '', 'aria-labelledby', 'dropdownMenu2', 1, 'w-100'],
      ['for', 'zip'],
      [
        'type',
        'text',
        'id',
        'zip',
        'formControlName',
        'zip',
        'placeholder',
        'Zip',
        1,
        'form-control',
      ],
      [1, 'text-sm', 'medium'],
      [1, 'desc-xs', 'mb-2'],
      [1, 'media-upload', 'mb-3'],
      [
        'type',
        'file',
        'id',
        'resume',
        'placeholder',
        'Upload your resume',
        'accept',
        '.pdf,.doc,.docx',
        1,
        'form-control',
        3,
        'change',
        'ngClass',
      ],
      ['width', '36', 'height', '36', 'viewBox', '0 0 36 36', 'fill', 'none', 3, 'ngClass'],
      [
        'd',
        'M29.025 15.06C28.005 9.885 23.46 6 18 6C13.665 6 9.9 8.46 8.025 12.06C3.51 12.54 0 16.365 0 21C0 25.965 4.035 30 9 30H28.5C32.64 30 36 26.64 36 22.5C36 18.54 32.925 15.33 29.025 15.06ZM28.5 27H9C5.685 27 3 24.315 3 21C3 17.925 5.295 15.36 8.34 15.045L9.945 14.88L10.695 13.455C12.12 10.71 14.91 9 18 9C21.93 9 25.32 11.79 26.085 15.645L26.535 17.895L28.83 18.06C31.17 18.21 33 20.175 33 22.5C33 24.975 30.975 27 28.5 27ZM12 19.5H15.825V24H20.175V19.5H24L18 13.5L12 19.5Z',
        'fill',
        '#0054CC',
      ],
      [1, 'text-sm', 3, 'ngClass'],
      [1, 'text-xs', 3, 'ngClass'],
      ['class', 'selected-file', 4, 'ngIf'],
      [1, 'text-sm', 'd-none'],
      [1, 'dropdown-divider'],
      ['for', 'url', 1, 'mb-2'],
      [1, 'form-group', 'mb-3'],
      [
        'type',
        'text',
        'formControlName',
        'githubURL',
        'id',
        'githubURL',
        'name',
        'githubURL',
        'placeholder',
        'Enter URL',
        1,
        'form-control',
      ],
      ['type', 'button', 1, 'btn', 'btn-primary', 'd-none'],
      [
        'type',
        'text',
        'formControlName',
        'linkedInURL',
        'id',
        'linkedInURL',
        'name',
        'linkedInURL',
        'placeholder',
        'Enter linkedInURL',
        1,
        'form-control',
      ],
      ['for', 'experience', 1, 'mb-2'],
      [
        'type',
        'text',
        'formControlName',
        'experience',
        'id',
        'experience',
        'name',
        'experience',
        'placeholder',
        'Enter Experience',
        1,
        'form-control',
      ],
      ['ngbDropdown', '', 1, 'd-inline-block', 'mb-3', 'w-100', 'd-none'],
      ['for', 'specialty'],
      ['id', 'dropdownMenu4', 'ngbDropdownToggle', '', 'type', 'button', 1, 'form-select'],
      ['ngbDropdownMenu', '', 'aria-labelledby', 'dropdownMenu4', 1, 'w-100'],
      ['type', 'button', 1, 'dropdown-item', 3, 'click'],
      [1, 'text-sm', 'medium', 'mb-2'],
      [1, 'form-check'],
      [
        'type',
        'radio',
        'name',
        'workAuth',
        'id',
        'auth1',
        'value',
        'authorized',
        'formControlName',
        'workAuth',
        1,
        'form-check-input',
      ],
      ['for', 'auth1', 1, 'form-check-label'],
      [
        'type',
        'radio',
        'name',
        'workAuth',
        'id',
        'auth2',
        'value',
        'sponsorship',
        'formControlName',
        'workAuth',
        1,
        'form-check-input',
      ],
      ['for', 'auth2', 1, 'form-check-label'],
      ['type', 'submit', 1, 'promates-btn', 'mt-4', 3, 'disabled'],
      ['class', 'd-flex gap-2 flex-column align-items-center justify-content-center', 4, 'ngIf'],
      [1, 'text-danger'],
      [1, 'selected-file'],
      ['type', 'button', 1, 'btn', 'btn-danger', 'btn-sm', 3, 'click'],
      [1, 'd-flex', 'gap-2', 'flex-column', 'align-items-center', 'justify-content-center'],
      [1, 'text-ld', 'semibold'],
      [1, 'text-md'],
      ['src', 'assets/images/success-gif.gif', 'alt', 'check'],
      ['type', 'button', 1, 'new-job-btn', 'flex-shrink-0', 'text-sm', 'medium', 3, 'click'],
    ],
    template: function (e, i) {
      if (e & 1) {
        let r = rt();
        u(0, 'div', 1)(1, 'div', 2)(2, 'h1', 3),
          h(3, 'Submit Resume'),
          d(),
          u(4, 'div', 4)(5, 'form', 5),
          Z('ngSubmit', function () {
            return ke(r), Le(i.onSubmit());
          }),
          u(6, 'div', 6)(7, 'div', 7)(8, 'label', 8),
          h(9, 'First name'),
          u(10, 'sup'),
          h(11, '*'),
          d()(),
          b(12, 'input', 9),
          R(13, xO, 2, 0, 'div', 10),
          d(),
          u(14, 'div', 7)(15, 'label', 11),
          h(16, 'Last name'),
          u(17, 'sup'),
          h(18, '*'),
          d()(),
          b(19, 'input', 12),
          R(20, NO, 2, 0, 'div', 10),
          d()(),
          u(21, 'div', 6)(22, 'div', 7)(23, 'label', 13),
          h(24, 'Phone'),
          u(25, 'sup'),
          h(26, '*'),
          d()(),
          b(27, 'input', 14),
          R(28, RO, 3, 2, 'div', 10),
          d(),
          u(29, 'div', 7)(30, 'label', 15),
          h(31, 'Alternate Phone'),
          d(),
          b(32, 'input', 16),
          R(33, FO, 2, 1, 'div', 10),
          d()(),
          u(34, 'div', 6)(35, 'div', 7)(36, 'label', 17),
          h(37, 'Primary Email'),
          u(38, 'sup'),
          h(39, '*'),
          d()(),
          b(40, 'input', 18),
          R(41, VO, 3, 2, 'div', 10),
          d(),
          u(42, 'div', 7)(43, 'label', 19),
          h(44, 'Alternate Email'),
          d(),
          b(45, 'input', 20),
          R(46, BO, 2, 1, 'div', 10),
          d()(),
          u(47, 'div', 21)(48, 'div', 22)(49, 'label', 23),
          h(50, 'Country'),
          u(51, 'sup'),
          h(52, '*'),
          d()(),
          u(53, 'button', 24),
          h(54),
          d(),
          u(55, 'div', 25),
          R(56, UO, 3, 1, 'ng-container', 26),
          d(),
          R(57, $O, 2, 0, 'div', 10),
          d(),
          u(58, 'div', 22)(59, 'label', 27),
          h(60, 'State'),
          u(61, 'sup'),
          h(62, '*'),
          d()(),
          u(63, 'button', 28),
          h(64),
          d(),
          u(65, 'div', 29),
          R(66, GO, 2, 1, 'ng-container', 30),
          d(),
          R(67, zO, 2, 0, 'div', 10),
          d()(),
          u(68, 'div', 21)(69, 'div', 22)(70, 'label', 23),
          h(71, 'Gender'),
          u(72, 'sup'),
          h(73, '*'),
          d()(),
          u(74, 'button', 31),
          h(75),
          d(),
          u(76, 'div', 32),
          R(77, WO, 3, 1, 'ng-container', 26),
          d(),
          R(78, qO, 2, 0, 'div', 10),
          d(),
          u(79, 'div', 7)(80, 'label', 33),
          h(81, 'Zip'),
          u(82, 'sup'),
          h(83, '*'),
          d()(),
          b(84, 'input', 34),
          R(85, QO, 2, 0, 'div', 10),
          d()(),
          u(86, 'h1', 35),
          h(87, 'Media Upload'),
          d(),
          u(88, 'p', 36),
          h(89, 'Add your documents here, and you can upload up to 5 files max'),
          d(),
          u(90, 'div', 37)(91, 'input', 38, 0),
          Z('change', function (s) {
            return ke(r), Le(i.onFileChange(s));
          }),
          d(),
          ze(),
          u(93, 'svg', 39),
          b(94, 'path', 40),
          d(),
          Ye(),
          u(95, 'div', 41),
          h(96, 'Drag your file(s) or '),
          u(97, 'span'),
          h(98, 'browse'),
          d()(),
          u(99, 'p', 42),
          h(100, 'Max 10 MB files are allowed. Only support .pdf, .doc, and .docx files.'),
          d(),
          R(101, ZO, 5, 1, 'div', 43)(102, KO, 2, 0, 'div', 10),
          d(),
          u(103, 'p', 44),
          h(104, 'Only support .jpg, .png and .svg and zip files'),
          d(),
          b(105, 'div', 45),
          u(106, 'label', 46),
          h(107, 'GitHub URL'),
          d(),
          u(108, 'div', 47),
          b(109, 'input', 48),
          R(110, YO, 2, 0, 'div', 10),
          u(111, 'button', 49),
          h(112, 'Upload'),
          d()(),
          u(113, 'label', 46),
          h(114, 'LinkedIn URL'),
          d(),
          u(115, 'div', 47),
          b(116, 'input', 50),
          u(117, 'button', 49),
          h(118, 'Upload'),
          d(),
          R(119, JO, 2, 0, 'div', 10),
          d(),
          u(120, 'label', 51),
          h(121, 'Experience'),
          d(),
          u(122, 'div', 47),
          b(123, 'input', 52),
          R(124, XO, 2, 0, 'div', 10),
          d(),
          u(125, 'div', 53)(126, 'label', 54),
          h(127, 'Specialty'),
          u(128, 'sup'),
          h(129, '*'),
          d()(),
          u(130, 'button', 55),
          h(131, 'Specialty'),
          d(),
          u(132, 'div', 56)(133, 'button', 57),
          Z('click', function () {
            return ke(r), Le(i.resumeForm.patchValue({ specialty: 'Specialty - 1' }));
          }),
          h(134, 'Specialty - 1'),
          d(),
          u(135, 'button', 57),
          Z('click', function () {
            return ke(r), Le(i.resumeForm.patchValue({ specialty: 'Specialty - 2' }));
          }),
          h(136, 'Specialty - 2'),
          d()(),
          R(137, e3, 2, 0, 'div', 10),
          d(),
          u(138, 'h1', 58),
          h(139, 'Declaration'),
          d(),
          u(140, 'div', 59),
          b(141, 'input', 60),
          u(142, 'label', 61),
          h(143, ' I am authorized to work in the United States for any employer '),
          d()(),
          u(144, 'div', 59),
          b(145, 'input', 62),
          u(146, 'label', 63),
          h(147, ' I require sponsorship to work in the United States '),
          d(),
          R(148, t3, 2, 0, 'div', 10),
          d(),
          u(149, 'button', 64),
          h(150, 'Submit'),
          d()(),
          R(151, n3, 8, 0, 'div', 65),
          d()()();
      }
      if (e & 2) {
        let r, o, s, a, l, c, f, p, g, m, v, _, C, S, O, I;
        w(5),
          D('formGroup', i.resumeForm)('ngClass', ln(31, va, i.formSubmitted)),
          w(8),
          D(
            'ngIf',
            ((r = i.resumeForm.get('firstName')) == null ? null : r.invalid) &&
              (((r = i.resumeForm.get('firstName')) == null ? null : r.touched) ||
                ((r = i.resumeForm.get('firstName')) == null ? null : r.dirty)),
          ),
          w(7),
          D(
            'ngIf',
            ((o = i.resumeForm.get('lastName')) == null ? null : o.invalid) &&
              (((o = i.resumeForm.get('lastName')) == null ? null : o.touched) ||
                ((o = i.resumeForm.get('lastName')) == null ? null : o.dirty)),
          ),
          w(8),
          D(
            'ngIf',
            ((s = i.resumeForm.get('phone')) == null ? null : s.invalid) &&
              (((s = i.resumeForm.get('phone')) == null ? null : s.touched) ||
                ((s = i.resumeForm.get('phone')) == null ? null : s.dirty)),
          ),
          w(5),
          D(
            'ngIf',
            ((a = i.resumeForm.get('altPhone')) == null ? null : a.invalid) &&
              (((a = i.resumeForm.get('altPhone')) == null ? null : a.touched) ||
                ((a = i.resumeForm.get('altPhone')) == null ? null : a.dirty)),
          ),
          w(8),
          D(
            'ngIf',
            ((l = i.resumeForm.get('primaryEmail')) == null ? null : l.invalid) &&
              (((l = i.resumeForm.get('primaryEmail')) == null ? null : l.touched) ||
                ((l = i.resumeForm.get('primaryEmail')) == null ? null : l.dirty)),
          ),
          w(5),
          D(
            'ngIf',
            ((c = i.resumeForm.get('altEmail')) == null ? null : c.invalid) &&
              (((c = i.resumeForm.get('altEmail')) == null ? null : c.touched) ||
                ((c = i.resumeForm.get('altEmail')) == null ? null : c.dirty)),
          ),
          w(8),
          Ae(
            !(i.dropdownValues == null || i.dropdownValues.country == null) &&
              i.dropdownValues.country.name
              ? i.dropdownValues.country.name
              : 'Country',
          ),
          w(2),
          D('ngForOf', i.countries),
          w(),
          D(
            'ngIf',
            ((f = i.resumeForm.get('country')) == null ? null : f.invalid) &&
              (((f = i.resumeForm.get('country')) == null ? null : f.touched) ||
                ((f = i.resumeForm.get('country')) == null ? null : f.dirty)),
          ),
          w(7),
          Ae(
            !(i.dropdownValues == null || i.dropdownValues.state == null) &&
              i.dropdownValues.state.name
              ? i.dropdownValues.state.name
              : 'State',
          ),
          w(2),
          D(
            'ngIf',
            i.dropdownValues == null || i.dropdownValues.country == null
              ? null
              : i.dropdownValues.country.states,
          ),
          w(),
          D(
            'ngIf',
            ((p = i.resumeForm.get('state')) == null ? null : p.invalid) &&
              (((p = i.resumeForm.get('state')) == null ? null : p.touched) ||
                ((p = i.resumeForm.get('state')) == null ? null : p.dirty)),
          ),
          w(8),
          Ae(
            !(i.dropdownValues == null || i.dropdownValues.gender == null) &&
              i.dropdownValues.gender.title
              ? i.dropdownValues.gender.title
              : 'Gender',
          ),
          w(2),
          D('ngForOf', i.gendersArray),
          w(),
          D(
            'ngIf',
            ((g = i.resumeForm.get('gender')) == null ? null : g.invalid) &&
              (((g = i.resumeForm.get('gender')) == null ? null : g.touched) ||
                ((g = i.resumeForm.get('gender')) == null ? null : g.dirty)),
          ),
          w(7),
          D(
            'ngIf',
            ((m = i.resumeForm.get('zip')) == null ? null : m.invalid) &&
              (((m = i.resumeForm.get('zip')) == null ? null : m.touched) ||
                ((m = i.resumeForm.get('zip')) == null ? null : m.dirty)),
          ),
          w(6),
          D('ngClass', ln(33, va, i.selectedFileName)),
          w(2),
          D('ngClass', ln(35, va, i.selectedFileName)),
          w(2),
          D('ngClass', ln(37, va, i.selectedFileName)),
          w(4),
          D('ngClass', ln(39, va, i.selectedFileName)),
          w(2),
          D('ngIf', i.selectedFileName),
          w(),
          D(
            'ngIf',
            ((v = i.resumeForm.get('resume')) == null ? null : v.invalid) &&
              (((v = i.resumeForm.get('resume')) == null ? null : v.touched) ||
                ((v = i.resumeForm.get('resume')) == null ? null : v.dirty)),
          ),
          w(8),
          D(
            'ngIf',
            ((_ = i.resumeForm.get('githubURL')) == null ? null : _.invalid) &&
              (((_ = i.resumeForm.get('githubURL')) == null ? null : _.touched) ||
                ((_ = i.resumeForm.get('githubURL')) == null ? null : _.dirty)),
          ),
          w(9),
          D(
            'ngIf',
            ((C = i.resumeForm.get('linkedInURL')) == null ? null : C.invalid) &&
              (((C = i.resumeForm.get('linkedInURL')) == null ? null : C.touched) ||
                ((C = i.resumeForm.get('linkedInURL')) == null ? null : C.dirty)),
          ),
          w(5),
          D(
            'ngIf',
            ((S = i.resumeForm.get('experience')) == null ? null : S.invalid) &&
              (((S = i.resumeForm.get('experience')) == null ? null : S.touched) ||
                ((S = i.resumeForm.get('experience')) == null ? null : S.dirty)),
          ),
          w(13),
          D(
            'ngIf',
            ((O = i.resumeForm.get('specialty')) == null ? null : O.invalid) &&
              (((O = i.resumeForm.get('specialty')) == null ? null : O.touched) ||
                ((O = i.resumeForm.get('specialty')) == null ? null : O.dirty)),
          ),
          w(11),
          D(
            'ngIf',
            ((I = i.resumeForm.get('workAuth')) == null ? null : I.invalid) &&
              (((I = i.resumeForm.get('workAuth')) == null ? null : I.touched) ||
                ((I = i.resumeForm.get('workAuth')) == null ? null : I.dirty)),
          ),
          w(),
          D('disabled', i.resumeForm.invalid),
          w(2),
          D('ngIf', i.formSubmitted);
      }
    },
    dependencies: [ot, mc, So, Rt, Wo, Zi, zo, Br, $n, Un, jn, cm, $i, Bn, Gi, li, ci],
    styles: [
      '.submit-resume[_ngcontent-%COMP%]{padding:80px}.submit-resume[_ngcontent-%COMP%]   sup[_ngcontent-%COMP%]{color:#dc3545}.submit-resume[_ngcontent-%COMP%]   .form-check[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;margin-bottom:8px}.submit-resume[_ngcontent-%COMP%]   .form-check[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{margin-top:0}.submit-resume[_ngcontent-%COMP%]   .form-select[_ngcontent-%COMP%], .submit-resume[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]{height:44px}.submit-resume[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]{margin-bottom:16px;width:100%}.submit-resume[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{margin-bottom:4px;font-size:14px;font-weight:500;line-height:20px;display:block;color:var(--colors-text-text-secondary-700, #344054)}.submit-resume[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{text-align:left}.submit-resume[_ngcontent-%COMP%]   .media-upload[_ngcontent-%COMP%]{display:flex;padding:var(--spacing-lg, 24px);flex-direction:column;justify-content:center;align-items:center;gap:12px;align-self:stretch;border-radius:var(--radi-mlg, 8px);border:1px dashed #0054CC;background:#fff;position:relative}.submit-resume[_ngcontent-%COMP%]   .media-upload[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{display:block;position:absolute;width:100%;height:100%;left:0;padding:0;border:0;font-size:0;cursor:pointer;top:0;opacity:0}.submit-resume[_ngcontent-%COMP%]   .media-upload[_ngcontent-%COMP%]   .selected-file[_ngcontent-%COMP%]{display:flex;align-items:center;margin-top:10px}.submit-resume[_ngcontent-%COMP%]   .media-upload[_ngcontent-%COMP%]   .selected-file[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{margin-right:10px}.submit-resume[_ngcontent-%COMP%]   .media-upload[_ngcontent-%COMP%]   .selected-file[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{margin-left:10px}.submit-resume[_ngcontent-%COMP%]   .new-job-btn[_ngcontent-%COMP%]{border-radius:60px;border:2px solid #0054CC;background:#fff;color:#0054cc;padding:8px 16px}.submit-resume[_ngcontent-%COMP%]   .text-danger[_ngcontent-%COMP%]{font-size:12px}',
    ],
  });
};
var Ji = class t {
  authenticated = new Oe(!1);
  authenticated$ = this.authenticated.asObservable();
  login() {
    this.authenticated.next(!0);
  }
  logout() {
    this.authenticated.next(!1);
  }
  isAuthenticated() {
    return this.authenticated.getValue();
  }
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
};
function i3(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Email is required.'), d());
}
function r3(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Enter a valid email.'), d());
}
function o3(t, n) {
  if ((t & 1 && (u(0, 'div', 22), R(1, i3, 2, 0, 'div', 23)(2, r3, 2, 0, 'div', 23), d()), t & 2)) {
    let e,
      i,
      r = U();
    w(),
      D(
        'ngIf',
        (e = r.loginForm.get('email')) == null || e.errors == null ? null : e.errors.required,
      ),
      w(),
      D('ngIf', (i = r.loginForm.get('email')) == null || i.errors == null ? null : i.errors.email);
  }
}
function s3(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Password is required.'), d());
}
function a3(t, n) {
  t & 1 &&
    (u(0, 'div'),
    h(
      1,
      'Password must contain at least one uppercase letter, one number, and one special character.',
    ),
    d());
}
function l3(t, n) {
  if ((t & 1 && (u(0, 'div', 22), R(1, s3, 2, 0, 'div', 23)(2, a3, 2, 0, 'div', 23), d()), t & 2)) {
    let e,
      i,
      r = U();
    w(),
      D(
        'ngIf',
        (e = r.loginForm.get('password')) == null || e.errors == null ? null : e.errors.required,
      ),
      w(),
      D(
        'ngIf',
        (i = r.loginForm.get('password')) == null || i.errors == null ? null : i.errors.pattern,
      );
  }
}
var ku = class t {
  constructor(n, e, i, r) {
    this.fb = n;
    this.notificationService = e;
    this.serviceInvoker = i;
    this.authService = r;
  }
  loginForm;
  route = y(Vn);
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [se.required, se.email]],
      password: [
        '',
        [se.required, se.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$')],
      ],
    });
  }
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  onSubmit() {
    this.loginForm.valid
      ? (console.log('Login Successful!', this.loginForm.value),
        this.notificationService.showSuccess('Login Successful!'),
        this.loginForm.reset(),
        this.authService.login())
      : console.log('Form not valid');
  }
  navigateTo(n) {
    this.route.navigate([`${n}`], {
      skipLocationChange: yt.ENABLE_SKIP_LOCATION,
    });
  }
  static ɵfac = function (e) {
    return new (e || t)(k(Hi), k(Et), k(Gn), k(Ji));
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-login']],
    standalone: !0,
    features: [j],
    decls: 40,
    vars: 4,
    consts: [
      [1, 'login-container'],
      [1, 'back-btn'],
      [1, 'btn', 'btn-secondary', 3, 'click'],
      [1, 'login-form', 'w-100'],
      [1, 'login-form-data'],
      ['src', 'assets/login/logo-mark.svg', 'alt', 'Promates Logo'],
      [1, 'text-center'],
      [1, 'text-center', 'mb-4'],
      [1, 'w-100', 3, 'ngSubmit', 'formGroup'],
      [1, 'mb-3', 'w-100'],
      ['for', 'exampleFormControlInput1', 1, 'form-label', 'text-sm', 'medium'],
      [
        'type',
        'email',
        'id',
        'exampleFormControlInput1',
        'formControlName',
        'email',
        'placeholder',
        'Enter your email',
        1,
        'form-control',
      ],
      ['class', 'error-msg', 4, 'ngIf'],
      ['for', 'exampleFormControlInput2', 1, 'form-label', 'text-sm', 'medium'],
      [
        'type',
        'password',
        'id',
        'exampleFormControlInput2',
        'formControlName',
        'password',
        'placeholder',
        'Enter your password',
        1,
        'form-control',
      ],
      ['type', 'submit', 1, 'w-100', 'btn', 'btn-primary', 'btn-lg', 3, 'disabled'],
      [1, 'w-100', 'btn', 'btn-primary', 'btn-lg'],
      [1, 'text-center', 'desc-xs', 'medium'],
      [3, 'click'],
      ['href', '#'],
      [1, 'login-image', 'w-100'],
      ['src', 'assets/login/section.svg', 'alt', 'Promates Logo'],
      [1, 'error-msg'],
      [4, 'ngIf'],
    ],
    template: function (e, i) {
      if (
        (e & 1 &&
          (u(0, 'div', 0)(1, 'div', 1)(2, 'button', 2),
          Z('click', function () {
            return i.navigateTo('');
          }),
          h(3, '\u2190 Back to Home'),
          d()(),
          u(4, 'div', 3)(5, 'div', 4),
          b(6, 'img', 5),
          u(7, 'h1', 6),
          h(8, 'Welcome back'),
          d(),
          u(9, 'p', 7),
          h(10, 'Welcome back! Please enter your details.'),
          d(),
          u(11, 'form', 8),
          Z('ngSubmit', function () {
            return i.onSubmit();
          }),
          u(12, 'div', 9)(13, 'label', 10),
          h(14, 'Email'),
          u(15, 'sup'),
          h(16, '*'),
          d()(),
          b(17, 'input', 11),
          R(18, o3, 3, 2, 'div', 12),
          d(),
          u(19, 'div', 9)(20, 'label', 13),
          h(21, 'Password'),
          u(22, 'sup'),
          h(23, '*'),
          d()(),
          b(24, 'input', 14),
          R(25, l3, 3, 2, 'div', 12),
          d(),
          u(26, 'button', 15),
          h(27, 'Submit'),
          d()(),
          u(28, 'button', 16),
          h(29, 'Sign in'),
          d(),
          u(30, 'p', 17),
          h(31, "Don't have an account? "),
          u(32, 'a', 18),
          Z('click', function () {
            return i.navigateTo('signup');
          }),
          h(33, 'Sign up'),
          d()(),
          u(34, 'p', 17),
          h(35, 'Forgot your password? '),
          u(36, 'a', 19),
          h(37, 'Reset password'),
          d()()()(),
          u(38, 'div', 20),
          b(39, 'img', 21),
          d()()),
        e & 2)
      ) {
        let r, o;
        w(11),
          D('formGroup', i.loginForm),
          w(7),
          D(
            'ngIf',
            ((r = i.loginForm.get('email')) == null ? null : r.invalid) &&
              (((r = i.loginForm.get('email')) == null ? null : r.dirty) ||
                ((r = i.loginForm.get('email')) == null ? null : r.touched)),
          ),
          w(7),
          D(
            'ngIf',
            ((o = i.loginForm.get('password')) == null ? null : o.invalid) &&
              (((o = i.loginForm.get('password')) == null ? null : o.dirty) ||
                ((o = i.loginForm.get('password')) == null ? null : o.touched)),
          ),
          w(),
          D('disabled', i.loginForm.invalid);
      }
    },
    dependencies: [Gi, Un, jn, $i, Bn, li, ci, ot, Rt, $n],
    styles: [
      '.login-container[_ngcontent-%COMP%]{display:flex;width:100%;height:100%;position:fixed;inset:0;z-index:1000;overflow:hidden;background:#fff}.login-container[_ngcontent-%COMP%]   .back-btn[_ngcontent-%COMP%]{position:absolute;top:20px;left:20px}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]{background-image:url("./media/bg-pattern-CEJIJZHV.svg");background-repeat:no-repeat;display:flex;flex-direction:column;justify-content:center;align-items:center;align-self:stretch}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   sup[_ngcontent-%COMP%]{color:#dc3545}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .error-msg[_ngcontent-%COMP%]{font-size:12px;color:#dc3545}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]{height:46px}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .login-form-data[_ngcontent-%COMP%]{width:360px;display:flex;gap:8px;align-items:center;justify-content:center;flex-direction:column}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .login-form-data[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:var(--colors-text-text-primary-900, #101828);text-align:center;font-size:var(--font-size-display-sm, 30px);font-style:normal;font-weight:var(--font-weight-normal-Semibold, 600);line-height:var(--font-line-height-display-sm, 38px)}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .login-form-data[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--colors-text-text-tertiary-600, #475467);font-size:var(--font-size-text-md, 16px);font-style:normal;font-weight:var(--font-weight-normal-Regular, 400);line-height:var(--font-line-height-text-md, 24px);text-align:center}.login-container[_ngcontent-%COMP%]   .login-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;object-fit:cover}.d-none[_ngcontent-%COMP%]{display:none}',
    ],
  });
};
function c3(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Email is required.'), d());
}
function u3(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Enter a valid email.'), d());
}
function d3(t, n) {
  if ((t & 1 && (u(0, 'div', 18), R(1, c3, 2, 0, 'div', 19)(2, u3, 2, 0, 'div', 19), d()), t & 2)) {
    let e,
      i,
      r = U();
    w(),
      D(
        'ngIf',
        (e = r.signupForm.get('email')) == null || e.errors == null ? null : e.errors.required,
      ),
      w(),
      D(
        'ngIf',
        (i = r.signupForm.get('email')) == null || i.errors == null ? null : i.errors.email,
      );
  }
}
function f3(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Password is required.'), d());
}
function h3(t, n) {
  t & 1 &&
    (u(0, 'div'),
    h(
      1,
      'Password must contain at least one uppercase letter, one number, and one special character.',
    ),
    d());
}
function p3(t, n) {
  if ((t & 1 && (u(0, 'div', 18), R(1, f3, 2, 0, 'div', 19)(2, h3, 2, 0, 'div', 19), d()), t & 2)) {
    let e,
      i,
      r = U();
    w(),
      D(
        'ngIf',
        (e = r.signupForm.get('password')) == null || e.errors == null ? null : e.errors.required,
      ),
      w(),
      D(
        'ngIf',
        (i = r.signupForm.get('password')) == null || i.errors == null ? null : i.errors.pattern,
      );
  }
}
function m3(t, n) {
  t & 1 && (u(0, 'div', 18), h(1, ' Passwords do not match. '), d());
}
function g3(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Confirm Password is required.'), d());
}
function v3(t, n) {
  t & 1 && (u(0, 'div'), h(1, 'Passwords do not match.'), d());
}
function _3(t, n) {
  if ((t & 1 && (u(0, 'div', 18), R(1, g3, 2, 0, 'div', 19)(2, v3, 2, 0, 'div', 19), d()), t & 2)) {
    let e,
      i,
      r = U();
    w(),
      D(
        'ngIf',
        (e = r.signupForm.get('confirmPassword')) == null || e.errors == null
          ? null
          : e.errors.required,
      ),
      w(),
      D(
        'ngIf',
        (i = r.signupForm.get('confirmPassword')) == null || i.errors == null
          ? null
          : i.errors.notSame,
      );
  }
}
function y3(t, n) {
  t & 1 && (u(0, 'div', 18), h(1, ' Passwords do not match. '), d());
}
var Lu = class t {
  constructor(n, e, i) {
    this.fb = n;
    this.notificationService = e;
    this.serviceInvoker = i;
  }
  signupForm;
  route = y(Vn);
  ngOnInit() {
    this.signupForm = this.fb.group(
      {
        email: ['', [se.required, se.email]],
        password: [
          '',
          [
            se.required,
            se.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$'),
          ],
        ],
        confirmPassword: ['', [se.required]],
      },
      { validator: this.checkPasswords },
    );
  }
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }
  checkPasswords(n) {
    let e = n?.get('password')?.value,
      i = n?.get('confirmPassword')?.value;
    return e === i ? null : { notSame: !0 };
  }
  onSubmit() {
    this.signupForm.valid
      ? (console.log('Signup Successful!', this.signupForm.value), this.signupForm.reset())
      : console.log('Form not valid');
  }
  navigateToLogin() {
    this.route.navigate(['/login'], {
      skipLocationChange: yt.ENABLE_SKIP_LOCATION,
    });
  }
  static ɵfac = function (e) {
    return new (e || t)(k(Hi), k(Et), k(Gn));
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-sign-up']],
    standalone: !0,
    features: [j],
    decls: 38,
    vars: 7,
    consts: [
      [1, 'signup-container'],
      [1, 'signup-form', 'w-100'],
      [1, 'signup-form-data'],
      ['src', '', 'alt', 'Promates Logo'],
      [1, 'text-center'],
      [1, 'text-center', 'mb-4'],
      [1, 'w-100', 3, 'ngSubmit', 'formGroup'],
      [1, 'mb-3', 'w-100'],
      ['for', 'signupEmail', 1, 'form-label', 'text-sm', 'medium'],
      [
        'type',
        'email',
        'id',
        'signupEmail',
        'formControlName',
        'email',
        'placeholder',
        'Enter your email',
        1,
        'form-control',
      ],
      ['class', 'error-msg', 4, 'ngIf'],
      ['for', 'signupPassword', 1, 'form-label', 'text-sm', 'medium'],
      [
        'type',
        'password',
        'id',
        'signupPassword',
        'formControlName',
        'password',
        'placeholder',
        'Enter your password',
        1,
        'form-control',
      ],
      ['for', 'confirmPassword', 1, 'form-label', 'text-sm', 'medium'],
      [
        'type',
        'password',
        'id',
        'confirmPassword',
        'formControlName',
        'confirmPassword',
        'placeholder',
        'Confirm your password',
        1,
        'form-control',
      ],
      ['type', 'submit', 1, 'w-100', 'btn', 'btn-primary', 'btn-lg', 3, 'disabled'],
      [1, 'text-center', 'desc-xs', 'medium'],
      ['routerLinkActive', 'router-link-active', 3, 'click'],
      [1, 'error-msg'],
      [4, 'ngIf'],
    ],
    template: function (e, i) {
      if (
        (e & 1 &&
          (u(0, 'div', 0)(1, 'div', 1)(2, 'div', 2),
          b(3, 'img', 3),
          u(4, 'h1', 4),
          h(5, 'Create an account'),
          d(),
          u(6, 'p', 5),
          h(7, 'Sign up to get started!'),
          d(),
          u(8, 'form', 6),
          Z('ngSubmit', function () {
            return i.onSubmit();
          }),
          u(9, 'div', 7)(10, 'label', 8),
          h(11, 'Email'),
          u(12, 'sup'),
          h(13, '*'),
          d()(),
          b(14, 'input', 9),
          R(15, d3, 3, 2, 'div', 10),
          d(),
          u(16, 'div', 7)(17, 'label', 11),
          h(18, 'Password'),
          u(19, 'sup'),
          h(20, '*'),
          d()(),
          b(21, 'input', 12),
          R(22, p3, 3, 2, 'div', 10)(23, m3, 2, 0, 'div', 10),
          d(),
          u(24, 'div', 7)(25, 'label', 13),
          h(26, 'Confirm Password'),
          u(27, 'sup'),
          h(28, '*'),
          d()(),
          b(29, 'input', 14),
          R(30, _3, 3, 2, 'div', 10)(31, y3, 2, 0, 'div', 10),
          d(),
          u(32, 'button', 15),
          h(33, 'Sign Up'),
          d()(),
          u(34, 'p', 16),
          h(35, 'Already have an account? '),
          u(36, 'a', 17),
          Z('click', function () {
            return i.navigateToLogin();
          }),
          h(37, 'Login'),
          d()()()()()),
        e & 2)
      ) {
        let r, o, s, a, l;
        w(8),
          D('formGroup', i.signupForm),
          w(7),
          D(
            'ngIf',
            ((r = i.signupForm.get('email')) == null ? null : r.invalid) &&
              (((r = i.signupForm.get('email')) == null ? null : r.dirty) ||
                ((r = i.signupForm.get('email')) == null ? null : r.touched)),
          ),
          w(7),
          D(
            'ngIf',
            ((o = i.signupForm.get('password')) == null ? null : o.invalid) &&
              (((o = i.signupForm.get('password')) == null ? null : o.dirty) ||
                ((o = i.signupForm.get('password')) == null ? null : o.touched)),
          ),
          w(),
          D(
            'ngIf',
            (i.signupForm.errors == null ? null : i.signupForm.errors.notSame) &&
              (((s = i.signupForm.get('confirmPassword')) == null ? null : s.dirty) ||
                ((s = i.signupForm.get('confirmPassword')) == null ? null : s.touched)),
          ),
          w(7),
          D(
            'ngIf',
            ((a = i.signupForm.get('confirmPassword')) == null ? null : a.invalid) &&
              (((a = i.signupForm.get('confirmPassword')) == null ? null : a.dirty) ||
                ((a = i.signupForm.get('confirmPassword')) == null ? null : a.touched)),
          ),
          w(),
          D(
            'ngIf',
            (i.signupForm.errors == null ? null : i.signupForm.errors.notSame) &&
              (((l = i.signupForm.get('confirmPassword')) == null ? null : l.dirty) ||
                ((l = i.signupForm.get('confirmPassword')) == null ? null : l.touched)),
          ),
          w(),
          D('disabled', i.signupForm.invalid);
      }
    },
    dependencies: [Gi, Un, jn, $i, Bn, li, ci, ot, Rt, $n],
    styles: [
      '.signup-container[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;min-height:100vh;background-color:#f5f5f5}.signup-form[_ngcontent-%COMP%]{background-color:#fff;padding:30px;border-radius:8px;box-shadow:0 0 10px #0000001a;max-width:400px;width:100%}.signup-form[_ngcontent-%COMP%]   .signup-form-data[_ngcontent-%COMP%]{text-align:left}.signup-form[_ngcontent-%COMP%]   .signup-form-data[_ngcontent-%COMP%]   sup[_ngcontent-%COMP%]{color:#dc3545}.signup-form[_ngcontent-%COMP%]   .signup-form-data[_ngcontent-%COMP%]   .error-msg[_ngcontent-%COMP%]{font-size:12px;color:#dc3545}.signup-form[_ngcontent-%COMP%]   .signup-form-data[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-width:100px;margin-bottom:20px}.signup-form[_ngcontent-%COMP%]   .signup-form-data[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:24px;margin-bottom:10px}.signup-form[_ngcontent-%COMP%]   .signup-form-data[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#777;margin-bottom:20px}.signup-form[_ngcontent-%COMP%]   .form-label[_ngcontent-%COMP%]{font-weight:600}.signup-form[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]{border-radius:4px;padding:10px;border:1px solid #ccc}.signup-form[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]:focus{border-color:#007bff;box-shadow:0 0 5px #007bff40}.signup-form[_ngcontent-%COMP%]   .error-msg[_ngcontent-%COMP%]{color:red;font-size:12px;margin-top:5px}.signup-form[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]{padding:10px 20px;border-radius:4px;margin-top:20px}.signup-form[_ngcontent-%COMP%]   .desc-xs[_ngcontent-%COMP%]{font-size:14px;color:#777;margin-top:20px}.signup-form[_ngcontent-%COMP%]   .desc-xs[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#007bff;text-decoration:none}.signup-form[_ngcontent-%COMP%]   .desc-xs[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration:underline}',
    ],
  });
};
var hC = [
  { path: '', component: gu, canActivate: [] },
  { path: ve.LOGIN, component: ku },
  { path: ve.SIGN_UP, component: Lu },
  { path: ve.ABOUT, component: vu },
  { path: ve.CONTACT, component: Eu },
  { path: ve.SERVICES.STAFFING, component: Tu },
  { path: ve.SERVICES.CONSULTING, component: Mu },
  { path: ve.INDUSTRIES.FINANCE, component: Iu },
  { path: ve.INDUSTRIES.HEALTH_CARE, component: xu },
  { path: ve.INDUSTRIES.IT, component: Nu },
  { path: ve.INDUSTRIES.RETAIL, component: Au },
  { path: ve.INDUSTRIES.LIFE_SCIENCES, component: Ou },
  { path: ve.INDUSTRIES.LOGISTICS, component: Ru },
  { path: ve.JOB_SEEKER.SEARCH_JOBS, component: Pu },
  { path: ve.JOB_SEEKER.SUBMIT_RESUME, component: Fu },
];
var Vu = class {
  constructor(n, e = '/assets/i18n/', i = '.json') {
    (this.http = n), (this.prefix = e), (this.suffix = i);
  }
  getTranslation(n) {
    return this.http.get(`${this.prefix}${n}${this.suffix}`);
  }
};
function pC(t) {
  return new T(3e3, !1);
}
function b3() {
  return new T(3100, !1);
}
function C3() {
  return new T(3101, !1);
}
function w3(t) {
  return new T(3001, !1);
}
function D3(t) {
  return new T(3003, !1);
}
function S3(t) {
  return new T(3004, !1);
}
function E3(t, n) {
  return new T(3005, !1);
}
function T3() {
  return new T(3006, !1);
}
function M3() {
  return new T(3007, !1);
}
function I3(t, n) {
  return new T(3008, !1);
}
function x3(t) {
  return new T(3002, !1);
}
function N3(t, n, e, i, r) {
  return new T(3010, !1);
}
function A3() {
  return new T(3011, !1);
}
function O3() {
  return new T(3012, !1);
}
function R3() {
  return new T(3200, !1);
}
function P3() {
  return new T(3202, !1);
}
function F3() {
  return new T(3013, !1);
}
function k3(t) {
  return new T(3014, !1);
}
function L3(t) {
  return new T(3015, !1);
}
function V3(t) {
  return new T(3016, !1);
}
function j3(t, n) {
  return new T(3404, !1);
}
function B3(t) {
  return new T(3502, !1);
}
function U3(t) {
  return new T(3503, !1);
}
function $3() {
  return new T(3300, !1);
}
function H3(t) {
  return new T(3504, !1);
}
function G3(t) {
  return new T(3301, !1);
}
function z3(t, n) {
  return new T(3302, !1);
}
function W3(t) {
  return new T(3303, !1);
}
function q3(t, n) {
  return new T(3400, !1);
}
function Q3(t) {
  return new T(3401, !1);
}
function Z3(t) {
  return new T(3402, !1);
}
function K3(t, n) {
  return new T(3505, !1);
}
function Xi(t) {
  switch (t.length) {
    case 0:
      return new Ki();
    case 1:
      return t[0];
    default:
      return new pa(t);
  }
}
function IC(t, n, e = new Map(), i = new Map()) {
  let r = [],
    o = [],
    s = -1,
    a = null;
  if (
    (n.forEach((l) => {
      let c = l.get('offset'),
        f = c == s,
        p = (f && a) || new Map();
      l.forEach((g, m) => {
        let v = m,
          _ = g;
        if (m !== 'offset')
          switch (((v = t.normalizePropertyName(v, r)), _)) {
            case yu:
              _ = e.get(m);
              break;
            case Hn:
              _ = i.get(m);
              break;
            default:
              _ = t.normalizeStyleValue(m, v, _, r);
              break;
          }
        p.set(v, _);
      }),
        f || o.push(p),
        (a = p),
        (s = c);
    }),
    r.length)
  )
    throw B3(r);
  return o;
}
function fg(t, n, e, i) {
  switch (n) {
    case 'start':
      t.onStart(() => i(e && Gm(e, 'start', t)));
      break;
    case 'done':
      t.onDone(() => i(e && Gm(e, 'done', t)));
      break;
    case 'destroy':
      t.onDestroy(() => i(e && Gm(e, 'destroy', t)));
      break;
  }
}
function Gm(t, n, e) {
  let i = e.totalTime,
    r = !!e.disabled,
    o = hg(t.element, t.triggerName, t.fromState, t.toState, n || t.phaseName, i ?? t.totalTime, r),
    s = t._data;
  return s != null && (o._data = s), o;
}
function hg(t, n, e, i, r = '', o = 0, s) {
  return {
    element: t,
    triggerName: n,
    fromState: e,
    toState: i,
    phaseName: r,
    totalTime: o,
    disabled: !!s,
  };
}
function Lt(t, n, e) {
  let i = t.get(n);
  return i || t.set(n, (i = e)), i;
}
function mC(t) {
  let n = t.indexOf(':'),
    e = t.substring(1, n),
    i = t.slice(n + 1);
  return [e, i];
}
var Y3 = typeof document > 'u' ? null : document.documentElement;
function pg(t) {
  let n = t.parentNode || t.host || null;
  return n === Y3 ? null : n;
}
function J3(t) {
  return t.substring(1, 6) == 'ebkit';
}
var Hr = null,
  gC = !1;
function X3(t) {
  Hr || ((Hr = eR() || {}), (gC = Hr.style ? 'WebkitAppearance' in Hr.style : !1));
  let n = !0;
  return (
    Hr.style &&
      !J3(t) &&
      ((n = t in Hr.style),
      !n && gC && (n = 'Webkit' + t.charAt(0).toUpperCase() + t.slice(1) in Hr.style)),
    n
  );
}
function eR() {
  return typeof document < 'u' ? document.body : null;
}
function xC(t, n) {
  for (; n; ) {
    if (n === t) return !0;
    n = pg(n);
  }
  return !1;
}
function NC(t, n, e) {
  if (e) return Array.from(t.querySelectorAll(n));
  let i = t.querySelector(n);
  return i ? [i] : [];
}
var mg = (() => {
    class t {
      validateStyleProperty(e) {
        return X3(e);
      }
      containsElement(e, i) {
        return xC(e, i);
      }
      getParentElement(e) {
        return pg(e);
      }
      query(e, i, r) {
        return NC(e, i, r);
      }
      computeStyle(e, i, r) {
        return r || '';
      }
      animate(e, i, r, o, s, a = [], l) {
        return new Ki(r, o);
      }
      static {
        this.ɵfac = function (i) {
          return new (i || t)();
        };
      }
      static {
        this.ɵprov = M({ token: t, factory: t.ɵfac });
      }
    }
    return t;
  })(),
  Wr = class {
    static {
      this.NOOP = new mg();
    }
  },
  qr = class {};
var tR = 1e3,
  AC = '{{',
  nR = '}}',
  OC = 'ng-enter',
  Km = 'ng-leave',
  ju = 'ng-trigger',
  Gu = '.ng-trigger',
  vC = 'ng-animating',
  Ym = '.ng-animating';
function hi(t) {
  if (typeof t == 'number') return t;
  let n = t.match(/^(-?[\.\d]+)(m?s)/);
  return !n || n.length < 2 ? 0 : Jm(parseFloat(n[1]), n[2]);
}
function Jm(t, n) {
  switch (n) {
    case 's':
      return t * tR;
    default:
      return t;
  }
}
function zu(t, n, e) {
  return t.hasOwnProperty('duration') ? t : iR(t, n, e);
}
function iR(t, n, e) {
  let i = /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i,
    r,
    o = 0,
    s = '';
  if (typeof t == 'string') {
    let a = t.match(i);
    if (a === null) return n.push(pC(t)), { duration: 0, delay: 0, easing: '' };
    r = Jm(parseFloat(a[1]), a[2]);
    let l = a[3];
    l != null && (o = Jm(parseFloat(l), a[4]));
    let c = a[5];
    c && (s = c);
  } else r = t;
  if (!e) {
    let a = !1,
      l = n.length;
    r < 0 && (n.push(b3()), (a = !0)),
      o < 0 && (n.push(C3()), (a = !0)),
      a && n.splice(l, 0, pC(t));
  }
  return { duration: r, delay: o, easing: s };
}
function rR(t) {
  return t.length ? (t[0] instanceof Map ? t : t.map((n) => new Map(Object.entries(n)))) : [];
}
function zn(t, n, e) {
  n.forEach((i, r) => {
    let o = gg(r);
    e && !e.has(r) && e.set(r, t.style[o]), (t.style[o] = i);
  });
}
function zr(t, n) {
  n.forEach((e, i) => {
    let r = gg(i);
    t.style[r] = '';
  });
}
function _a(t) {
  return Array.isArray(t) ? (t.length == 1 ? t[0] : tC(t)) : t;
}
function oR(t, n, e) {
  let i = n.params || {},
    r = RC(t);
  r.length &&
    r.forEach((o) => {
      i.hasOwnProperty(o) || e.push(w3(o));
    });
}
var Xm = new RegExp(`${AC}\\s*(.+?)\\s*${nR}`, 'g');
function RC(t) {
  let n = [];
  if (typeof t == 'string') {
    let e;
    for (; (e = Xm.exec(t)); ) n.push(e[1]);
    Xm.lastIndex = 0;
  }
  return n;
}
function ba(t, n, e) {
  let i = `${t}`,
    r = i.replace(Xm, (o, s) => {
      let a = n[s];
      return a == null && (e.push(D3(s)), (a = '')), a.toString();
    });
  return r == i ? t : r;
}
var sR = /-+([a-z0-9])/g;
function gg(t) {
  return t.replace(sR, (...n) => n[1].toUpperCase());
}
function aR(t, n) {
  return t === 0 || n === 0;
}
function lR(t, n, e) {
  if (e.size && n.length) {
    let i = n[0],
      r = [];
    if (
      (e.forEach((o, s) => {
        i.has(s) || r.push(s), i.set(s, o);
      }),
      r.length)
    )
      for (let o = 1; o < n.length; o++) {
        let s = n[o];
        r.forEach((a) => s.set(a, vg(t, a)));
      }
  }
  return n;
}
function kt(t, n, e) {
  switch (n.type) {
    case J.Trigger:
      return t.visitTrigger(n, e);
    case J.State:
      return t.visitState(n, e);
    case J.Transition:
      return t.visitTransition(n, e);
    case J.Sequence:
      return t.visitSequence(n, e);
    case J.Group:
      return t.visitGroup(n, e);
    case J.Animate:
      return t.visitAnimate(n, e);
    case J.Keyframes:
      return t.visitKeyframes(n, e);
    case J.Style:
      return t.visitStyle(n, e);
    case J.Reference:
      return t.visitReference(n, e);
    case J.AnimateChild:
      return t.visitAnimateChild(n, e);
    case J.AnimateRef:
      return t.visitAnimateRef(n, e);
    case J.Query:
      return t.visitQuery(n, e);
    case J.Stagger:
      return t.visitStagger(n, e);
    default:
      throw S3(n.type);
  }
}
function vg(t, n) {
  return window.getComputedStyle(t)[n];
}
var cR = new Set([
    'width',
    'height',
    'minWidth',
    'minHeight',
    'maxWidth',
    'maxHeight',
    'left',
    'top',
    'bottom',
    'right',
    'fontSize',
    'outlineWidth',
    'outlineOffset',
    'paddingTop',
    'paddingLeft',
    'paddingBottom',
    'paddingRight',
    'marginTop',
    'marginLeft',
    'marginBottom',
    'marginRight',
    'borderRadius',
    'borderWidth',
    'borderTopWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'textIndent',
    'perspective',
  ]),
  Wu = class extends qr {
    normalizePropertyName(n, e) {
      return gg(n);
    }
    normalizeStyleValue(n, e, i, r) {
      let o = '',
        s = i.toString().trim();
      if (cR.has(e) && i !== 0 && i !== '0')
        if (typeof i == 'number') o = 'px';
        else {
          let a = i.match(/^[+-]?[\d\.]+([a-z]*)$/);
          a && a[1].length == 0 && r.push(E3(n, i));
        }
      return s + o;
    }
  };
var qu = '*';
function uR(t, n) {
  let e = [];
  return typeof t == 'string' ? t.split(/\s*,\s*/).forEach((i) => dR(i, e, n)) : e.push(t), e;
}
function dR(t, n, e) {
  if (t[0] == ':') {
    let l = fR(t, e);
    if (typeof l == 'function') {
      n.push(l);
      return;
    }
    t = l;
  }
  let i = t.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
  if (i == null || i.length < 4) return e.push(L3(t)), n;
  let r = i[1],
    o = i[2],
    s = i[3];
  n.push(_C(r, s));
  let a = r == qu && s == qu;
  o[0] == '<' && !a && n.push(_C(s, r));
}
function fR(t, n) {
  switch (t) {
    case ':enter':
      return 'void => *';
    case ':leave':
      return '* => void';
    case ':increment':
      return (e, i) => parseFloat(i) > parseFloat(e);
    case ':decrement':
      return (e, i) => parseFloat(i) < parseFloat(e);
    default:
      return n.push(V3(t)), '* => *';
  }
}
var Bu = new Set(['true', '1']),
  Uu = new Set(['false', '0']);
function _C(t, n) {
  let e = Bu.has(t) || Uu.has(t),
    i = Bu.has(n) || Uu.has(n);
  return (r, o) => {
    let s = t == qu || t == r,
      a = n == qu || n == o;
    return (
      !s && e && typeof r == 'boolean' && (s = r ? Bu.has(t) : Uu.has(t)),
      !a && i && typeof o == 'boolean' && (a = o ? Bu.has(n) : Uu.has(n)),
      s && a
    );
  };
}
var PC = ':self',
  hR = new RegExp(`s*${PC}s*,?`, 'g');
function FC(t, n, e, i) {
  return new eg(t).build(n, e, i);
}
var yC = '',
  eg = class {
    constructor(n) {
      this._driver = n;
    }
    build(n, e, i) {
      let r = new tg(e);
      return this._resetContextStyleTimingState(r), kt(this, _a(n), r);
    }
    _resetContextStyleTimingState(n) {
      (n.currentQuerySelector = yC),
        (n.collectedStyles = new Map()),
        n.collectedStyles.set(yC, new Map()),
        (n.currentTime = 0);
    }
    visitTrigger(n, e) {
      let i = (e.queryCount = 0),
        r = (e.depCount = 0),
        o = [],
        s = [];
      return (
        n.name.charAt(0) == '@' && e.errors.push(T3()),
        n.definitions.forEach((a) => {
          if ((this._resetContextStyleTimingState(e), a.type == J.State)) {
            let l = a,
              c = l.name;
            c
              .toString()
              .split(/\s*,\s*/)
              .forEach((f) => {
                (l.name = f), o.push(this.visitState(l, e));
              }),
              (l.name = c);
          } else if (a.type == J.Transition) {
            let l = this.visitTransition(a, e);
            (i += l.queryCount), (r += l.depCount), s.push(l);
          } else e.errors.push(M3());
        }),
        {
          type: J.Trigger,
          name: n.name,
          states: o,
          transitions: s,
          queryCount: i,
          depCount: r,
          options: null,
        }
      );
    }
    visitState(n, e) {
      let i = this.visitStyle(n.styles, e),
        r = (n.options && n.options.params) || null;
      if (i.containsDynamicStyles) {
        let o = new Set(),
          s = r || {};
        i.styles.forEach((a) => {
          a instanceof Map &&
            a.forEach((l) => {
              RC(l).forEach((c) => {
                s.hasOwnProperty(c) || o.add(c);
              });
            });
        }),
          o.size && e.errors.push(I3(n.name, [...o.values()]));
      }
      return {
        type: J.State,
        name: n.name,
        style: i,
        options: r ? { params: r } : null,
      };
    }
    visitTransition(n, e) {
      (e.queryCount = 0), (e.depCount = 0);
      let i = kt(this, _a(n.animation), e),
        r = uR(n.expr, e.errors);
      return {
        type: J.Transition,
        matchers: r,
        animation: i,
        queryCount: e.queryCount,
        depCount: e.depCount,
        options: Gr(n.options),
      };
    }
    visitSequence(n, e) {
      return {
        type: J.Sequence,
        steps: n.steps.map((i) => kt(this, i, e)),
        options: Gr(n.options),
      };
    }
    visitGroup(n, e) {
      let i = e.currentTime,
        r = 0,
        o = n.steps.map((s) => {
          e.currentTime = i;
          let a = kt(this, s, e);
          return (r = Math.max(r, e.currentTime)), a;
        });
      return (e.currentTime = r), { type: J.Group, steps: o, options: Gr(n.options) };
    }
    visitAnimate(n, e) {
      let i = vR(n.timings, e.errors);
      e.currentAnimateTimings = i;
      let r,
        o = n.styles ? n.styles : Ur({});
      if (o.type == J.Keyframes) r = this.visitKeyframes(o, e);
      else {
        let s = n.styles,
          a = !1;
        if (!s) {
          a = !0;
          let c = {};
          i.easing && (c.easing = i.easing), (s = Ur(c));
        }
        e.currentTime += i.duration + i.delay;
        let l = this.visitStyle(s, e);
        (l.isEmptyStep = a), (r = l);
      }
      return (
        (e.currentAnimateTimings = null), { type: J.Animate, timings: i, style: r, options: null }
      );
    }
    visitStyle(n, e) {
      let i = this._makeStyleAst(n, e);
      return this._validateStyleAst(i, e), i;
    }
    _makeStyleAst(n, e) {
      let i = [],
        r = Array.isArray(n.styles) ? n.styles : [n.styles];
      for (let a of r)
        typeof a == 'string'
          ? a === Hn
            ? i.push(a)
            : e.errors.push(x3(a))
          : i.push(new Map(Object.entries(a)));
      let o = !1,
        s = null;
      return (
        i.forEach((a) => {
          if (
            a instanceof Map &&
            (a.has('easing') && ((s = a.get('easing')), a.delete('easing')), !o)
          ) {
            for (let l of a.values())
              if (l.toString().indexOf(AC) >= 0) {
                o = !0;
                break;
              }
          }
        }),
        {
          type: J.Style,
          styles: i,
          easing: s,
          offset: n.offset,
          containsDynamicStyles: o,
          options: null,
        }
      );
    }
    _validateStyleAst(n, e) {
      let i = e.currentAnimateTimings,
        r = e.currentTime,
        o = e.currentTime;
      i && o > 0 && (o -= i.duration + i.delay),
        n.styles.forEach((s) => {
          typeof s != 'string' &&
            s.forEach((a, l) => {
              let c = e.collectedStyles.get(e.currentQuerySelector),
                f = c.get(l),
                p = !0;
              f &&
                (o != r &&
                  o >= f.startTime &&
                  r <= f.endTime &&
                  (e.errors.push(N3(l, f.startTime, f.endTime, o, r)), (p = !1)),
                (o = f.startTime)),
                p && c.set(l, { startTime: o, endTime: r }),
                e.options && oR(a, e.options, e.errors);
            });
        });
    }
    visitKeyframes(n, e) {
      let i = { type: J.Keyframes, styles: [], options: null };
      if (!e.currentAnimateTimings) return e.errors.push(A3()), i;
      let r = 1,
        o = 0,
        s = [],
        a = !1,
        l = !1,
        c = 0,
        f = n.steps.map((S) => {
          let O = this._makeStyleAst(S, e),
            I = O.offset != null ? O.offset : gR(O.styles),
            A = 0;
          return (
            I != null && (o++, (A = O.offset = I)),
            (l = l || A < 0 || A > 1),
            (a = a || A < c),
            (c = A),
            s.push(A),
            O
          );
        });
      l && e.errors.push(O3()), a && e.errors.push(R3());
      let p = n.steps.length,
        g = 0;
      o > 0 && o < p ? e.errors.push(P3()) : o == 0 && (g = r / (p - 1));
      let m = p - 1,
        v = e.currentTime,
        _ = e.currentAnimateTimings,
        C = _.duration;
      return (
        f.forEach((S, O) => {
          let I = g > 0 ? (O == m ? 1 : g * O) : s[O],
            A = I * C;
          (e.currentTime = v + _.delay + A),
            (_.duration = A),
            this._validateStyleAst(S, e),
            (S.offset = I),
            i.styles.push(S);
        }),
        i
      );
    }
    visitReference(n, e) {
      return {
        type: J.Reference,
        animation: kt(this, _a(n.animation), e),
        options: Gr(n.options),
      };
    }
    visitAnimateChild(n, e) {
      return e.depCount++, { type: J.AnimateChild, options: Gr(n.options) };
    }
    visitAnimateRef(n, e) {
      return {
        type: J.AnimateRef,
        animation: this.visitReference(n.animation, e),
        options: Gr(n.options),
      };
    }
    visitQuery(n, e) {
      let i = e.currentQuerySelector,
        r = n.options || {};
      e.queryCount++, (e.currentQuery = n);
      let [o, s] = pR(n.selector);
      (e.currentQuerySelector = i.length ? i + ' ' + o : o),
        Lt(e.collectedStyles, e.currentQuerySelector, new Map());
      let a = kt(this, _a(n.animation), e);
      return (
        (e.currentQuery = null),
        (e.currentQuerySelector = i),
        {
          type: J.Query,
          selector: o,
          limit: r.limit || 0,
          optional: !!r.optional,
          includeSelf: s,
          animation: a,
          originalSelector: n.selector,
          options: Gr(n.options),
        }
      );
    }
    visitStagger(n, e) {
      e.currentQuery || e.errors.push(F3());
      let i =
        n.timings === 'full'
          ? { duration: 0, delay: 0, easing: 'full' }
          : zu(n.timings, e.errors, !0);
      return {
        type: J.Stagger,
        animation: kt(this, _a(n.animation), e),
        timings: i,
        options: null,
      };
    }
  };
function pR(t) {
  let n = !!t.split(/\s*,\s*/).find((e) => e == PC);
  return (
    n && (t = t.replace(hR, '')),
    (t = t
      .replace(/@\*/g, Gu)
      .replace(/@\w+/g, (e) => Gu + '-' + e.slice(1))
      .replace(/:animating/g, Ym)),
    [t, n]
  );
}
function mR(t) {
  return t ? E({}, t) : null;
}
var tg = class {
  constructor(n) {
    (this.errors = n),
      (this.queryCount = 0),
      (this.depCount = 0),
      (this.currentTransition = null),
      (this.currentQuery = null),
      (this.currentQuerySelector = null),
      (this.currentAnimateTimings = null),
      (this.currentTime = 0),
      (this.collectedStyles = new Map()),
      (this.options = null),
      (this.unsupportedCSSPropertiesFound = new Set());
  }
};
function gR(t) {
  if (typeof t == 'string') return null;
  let n = null;
  if (Array.isArray(t))
    t.forEach((e) => {
      if (e instanceof Map && e.has('offset')) {
        let i = e;
        (n = parseFloat(i.get('offset'))), i.delete('offset');
      }
    });
  else if (t instanceof Map && t.has('offset')) {
    let e = t;
    (n = parseFloat(e.get('offset'))), e.delete('offset');
  }
  return n;
}
function vR(t, n) {
  if (t.hasOwnProperty('duration')) return t;
  if (typeof t == 'number') {
    let o = zu(t, n).duration;
    return zm(o, 0, '');
  }
  let e = t;
  if (e.split(/\s+/).some((o) => o.charAt(0) == '{' && o.charAt(1) == '{')) {
    let o = zm(0, 0, '');
    return (o.dynamic = !0), (o.strValue = e), o;
  }
  let r = zu(e, n);
  return zm(r.duration, r.delay, r.easing);
}
function Gr(t) {
  return t ? ((t = E({}, t)), t.params && (t.params = mR(t.params))) : (t = {}), t;
}
function zm(t, n, e) {
  return { duration: t, delay: n, easing: e };
}
function _g(t, n, e, i, r, o, s = null, a = !1) {
  return {
    type: 1,
    element: t,
    keyframes: n,
    preStyleProps: e,
    postStyleProps: i,
    duration: r,
    delay: o,
    totalTime: r + o,
    easing: s,
    subTimeline: a,
  };
}
var Ca = class {
    constructor() {
      this._map = new Map();
    }
    get(n) {
      return this._map.get(n) || [];
    }
    append(n, e) {
      let i = this._map.get(n);
      i || this._map.set(n, (i = [])), i.push(...e);
    }
    has(n) {
      return this._map.has(n);
    }
    clear() {
      this._map.clear();
    }
  },
  _R = 1,
  yR = ':enter',
  bR = new RegExp(yR, 'g'),
  CR = ':leave',
  wR = new RegExp(CR, 'g');
function kC(t, n, e, i, r, o = new Map(), s = new Map(), a, l, c = []) {
  return new ng().buildKeyframes(t, n, e, i, r, o, s, a, l, c);
}
var ng = class {
    buildKeyframes(n, e, i, r, o, s, a, l, c, f = []) {
      c = c || new Ca();
      let p = new ig(n, e, c, r, o, f, []);
      p.options = l;
      let g = l.delay ? hi(l.delay) : 0;
      p.currentTimeline.delayNextStep(g),
        p.currentTimeline.setStyles([s], null, p.errors, l),
        kt(this, i, p);
      let m = p.timelines.filter((v) => v.containsAnimation());
      if (m.length && a.size) {
        let v;
        for (let _ = m.length - 1; _ >= 0; _--) {
          let C = m[_];
          if (C.element === e) {
            v = C;
            break;
          }
        }
        v && !v.allowOnlyTimelineStyles() && v.setStyles([a], null, p.errors, l);
      }
      return m.length ? m.map((v) => v.buildKeyframes()) : [_g(e, [], [], [], 0, g, '', !1)];
    }
    visitTrigger(n, e) {}
    visitState(n, e) {}
    visitTransition(n, e) {}
    visitAnimateChild(n, e) {
      let i = e.subInstructions.get(e.element);
      if (i) {
        let r = e.createSubContext(n.options),
          o = e.currentTimeline.currentTime,
          s = this._visitSubInstructions(i, r, r.options);
        o != s && e.transformIntoNewTimeline(s);
      }
      e.previousNode = n;
    }
    visitAnimateRef(n, e) {
      let i = e.createSubContext(n.options);
      i.transformIntoNewTimeline(),
        this._applyAnimationRefDelays([n.options, n.animation.options], e, i),
        this.visitReference(n.animation, i),
        e.transformIntoNewTimeline(i.currentTimeline.currentTime),
        (e.previousNode = n);
    }
    _applyAnimationRefDelays(n, e, i) {
      for (let r of n) {
        let o = r?.delay;
        if (o) {
          let s = typeof o == 'number' ? o : hi(ba(o, r?.params ?? {}, e.errors));
          i.delayNextStep(s);
        }
      }
    }
    _visitSubInstructions(n, e, i) {
      let o = e.currentTimeline.currentTime,
        s = i.duration != null ? hi(i.duration) : null,
        a = i.delay != null ? hi(i.delay) : null;
      return (
        s !== 0 &&
          n.forEach((l) => {
            let c = e.appendInstructionToTimeline(l, s, a);
            o = Math.max(o, c.duration + c.delay);
          }),
        o
      );
    }
    visitReference(n, e) {
      e.updateOptions(n.options, !0), kt(this, n.animation, e), (e.previousNode = n);
    }
    visitSequence(n, e) {
      let i = e.subContextCount,
        r = e,
        o = n.options;
      if (
        o &&
        (o.params || o.delay) &&
        ((r = e.createSubContext(o)), r.transformIntoNewTimeline(), o.delay != null)
      ) {
        r.previousNode.type == J.Style &&
          (r.currentTimeline.snapshotCurrentStyles(), (r.previousNode = Qu));
        let s = hi(o.delay);
        r.delayNextStep(s);
      }
      n.steps.length &&
        (n.steps.forEach((s) => kt(this, s, r)),
        r.currentTimeline.applyStylesToKeyframe(),
        r.subContextCount > i && r.transformIntoNewTimeline()),
        (e.previousNode = n);
    }
    visitGroup(n, e) {
      let i = [],
        r = e.currentTimeline.currentTime,
        o = n.options && n.options.delay ? hi(n.options.delay) : 0;
      n.steps.forEach((s) => {
        let a = e.createSubContext(n.options);
        o && a.delayNextStep(o),
          kt(this, s, a),
          (r = Math.max(r, a.currentTimeline.currentTime)),
          i.push(a.currentTimeline);
      }),
        i.forEach((s) => e.currentTimeline.mergeTimelineCollectedStyles(s)),
        e.transformIntoNewTimeline(r),
        (e.previousNode = n);
    }
    _visitTiming(n, e) {
      if (n.dynamic) {
        let i = n.strValue,
          r = e.params ? ba(i, e.params, e.errors) : i;
        return zu(r, e.errors);
      } else return { duration: n.duration, delay: n.delay, easing: n.easing };
    }
    visitAnimate(n, e) {
      let i = (e.currentAnimateTimings = this._visitTiming(n.timings, e)),
        r = e.currentTimeline;
      i.delay && (e.incrementTime(i.delay), r.snapshotCurrentStyles());
      let o = n.style;
      o.type == J.Keyframes
        ? this.visitKeyframes(o, e)
        : (e.incrementTime(i.duration), this.visitStyle(o, e), r.applyStylesToKeyframe()),
        (e.currentAnimateTimings = null),
        (e.previousNode = n);
    }
    visitStyle(n, e) {
      let i = e.currentTimeline,
        r = e.currentAnimateTimings;
      !r && i.hasCurrentStyleProperties() && i.forwardFrame();
      let o = (r && r.easing) || n.easing;
      n.isEmptyStep ? i.applyEmptyStep(o) : i.setStyles(n.styles, o, e.errors, e.options),
        (e.previousNode = n);
    }
    visitKeyframes(n, e) {
      let i = e.currentAnimateTimings,
        r = e.currentTimeline.duration,
        o = i.duration,
        a = e.createSubContext().currentTimeline;
      (a.easing = i.easing),
        n.styles.forEach((l) => {
          let c = l.offset || 0;
          a.forwardTime(c * o),
            a.setStyles(l.styles, l.easing, e.errors, e.options),
            a.applyStylesToKeyframe();
        }),
        e.currentTimeline.mergeTimelineCollectedStyles(a),
        e.transformIntoNewTimeline(r + o),
        (e.previousNode = n);
    }
    visitQuery(n, e) {
      let i = e.currentTimeline.currentTime,
        r = n.options || {},
        o = r.delay ? hi(r.delay) : 0;
      o &&
        (e.previousNode.type === J.Style ||
          (i == 0 && e.currentTimeline.hasCurrentStyleProperties())) &&
        (e.currentTimeline.snapshotCurrentStyles(), (e.previousNode = Qu));
      let s = i,
        a = e.invokeQuery(
          n.selector,
          n.originalSelector,
          n.limit,
          n.includeSelf,
          !!r.optional,
          e.errors,
        );
      e.currentQueryTotal = a.length;
      let l = null;
      a.forEach((c, f) => {
        e.currentQueryIndex = f;
        let p = e.createSubContext(n.options, c);
        o && p.delayNextStep(o),
          c === e.element && (l = p.currentTimeline),
          kt(this, n.animation, p),
          p.currentTimeline.applyStylesToKeyframe();
        let g = p.currentTimeline.currentTime;
        s = Math.max(s, g);
      }),
        (e.currentQueryIndex = 0),
        (e.currentQueryTotal = 0),
        e.transformIntoNewTimeline(s),
        l &&
          (e.currentTimeline.mergeTimelineCollectedStyles(l),
          e.currentTimeline.snapshotCurrentStyles()),
        (e.previousNode = n);
    }
    visitStagger(n, e) {
      let i = e.parentContext,
        r = e.currentTimeline,
        o = n.timings,
        s = Math.abs(o.duration),
        a = s * (e.currentQueryTotal - 1),
        l = s * e.currentQueryIndex;
      switch (o.duration < 0 ? 'reverse' : o.easing) {
        case 'reverse':
          l = a - l;
          break;
        case 'full':
          l = i.currentStaggerTime;
          break;
      }
      let f = e.currentTimeline;
      l && f.delayNextStep(l);
      let p = f.currentTime;
      kt(this, n.animation, e),
        (e.previousNode = n),
        (i.currentStaggerTime = r.currentTime - p + (r.startTime - i.currentTimeline.startTime));
    }
  },
  Qu = {},
  ig = class t {
    constructor(n, e, i, r, o, s, a, l) {
      (this._driver = n),
        (this.element = e),
        (this.subInstructions = i),
        (this._enterClassName = r),
        (this._leaveClassName = o),
        (this.errors = s),
        (this.timelines = a),
        (this.parentContext = null),
        (this.currentAnimateTimings = null),
        (this.previousNode = Qu),
        (this.subContextCount = 0),
        (this.options = {}),
        (this.currentQueryIndex = 0),
        (this.currentQueryTotal = 0),
        (this.currentStaggerTime = 0),
        (this.currentTimeline = l || new Zu(this._driver, e, 0)),
        a.push(this.currentTimeline);
    }
    get params() {
      return this.options.params;
    }
    updateOptions(n, e) {
      if (!n) return;
      let i = n,
        r = this.options;
      i.duration != null && (r.duration = hi(i.duration)),
        i.delay != null && (r.delay = hi(i.delay));
      let o = i.params;
      if (o) {
        let s = r.params;
        s || (s = this.options.params = {}),
          Object.keys(o).forEach((a) => {
            (!e || !s.hasOwnProperty(a)) && (s[a] = ba(o[a], s, this.errors));
          });
      }
    }
    _copyOptions() {
      let n = {};
      if (this.options) {
        let e = this.options.params;
        if (e) {
          let i = (n.params = {});
          Object.keys(e).forEach((r) => {
            i[r] = e[r];
          });
        }
      }
      return n;
    }
    createSubContext(n = null, e, i) {
      let r = e || this.element,
        o = new t(
          this._driver,
          r,
          this.subInstructions,
          this._enterClassName,
          this._leaveClassName,
          this.errors,
          this.timelines,
          this.currentTimeline.fork(r, i || 0),
        );
      return (
        (o.previousNode = this.previousNode),
        (o.currentAnimateTimings = this.currentAnimateTimings),
        (o.options = this._copyOptions()),
        o.updateOptions(n),
        (o.currentQueryIndex = this.currentQueryIndex),
        (o.currentQueryTotal = this.currentQueryTotal),
        (o.parentContext = this),
        this.subContextCount++,
        o
      );
    }
    transformIntoNewTimeline(n) {
      return (
        (this.previousNode = Qu),
        (this.currentTimeline = this.currentTimeline.fork(this.element, n)),
        this.timelines.push(this.currentTimeline),
        this.currentTimeline
      );
    }
    appendInstructionToTimeline(n, e, i) {
      let r = {
          duration: e ?? n.duration,
          delay: this.currentTimeline.currentTime + (i ?? 0) + n.delay,
          easing: '',
        },
        o = new rg(
          this._driver,
          n.element,
          n.keyframes,
          n.preStyleProps,
          n.postStyleProps,
          r,
          n.stretchStartingKeyframe,
        );
      return this.timelines.push(o), r;
    }
    incrementTime(n) {
      this.currentTimeline.forwardTime(this.currentTimeline.duration + n);
    }
    delayNextStep(n) {
      n > 0 && this.currentTimeline.delayNextStep(n);
    }
    invokeQuery(n, e, i, r, o, s) {
      let a = [];
      if ((r && a.push(this.element), n.length > 0)) {
        (n = n.replace(bR, '.' + this._enterClassName)),
          (n = n.replace(wR, '.' + this._leaveClassName));
        let l = i != 1,
          c = this._driver.query(this.element, n, l);
        i !== 0 && (c = i < 0 ? c.slice(c.length + i, c.length) : c.slice(0, i)), a.push(...c);
      }
      return !o && a.length == 0 && s.push(k3(e)), a;
    }
  },
  Zu = class t {
    constructor(n, e, i, r) {
      (this._driver = n),
        (this.element = e),
        (this.startTime = i),
        (this._elementTimelineStylesLookup = r),
        (this.duration = 0),
        (this.easing = null),
        (this._previousKeyframe = new Map()),
        (this._currentKeyframe = new Map()),
        (this._keyframes = new Map()),
        (this._styleSummary = new Map()),
        (this._localTimelineStyles = new Map()),
        (this._pendingStyles = new Map()),
        (this._backFill = new Map()),
        (this._currentEmptyStepKeyframe = null),
        this._elementTimelineStylesLookup || (this._elementTimelineStylesLookup = new Map()),
        (this._globalTimelineStyles = this._elementTimelineStylesLookup.get(e)),
        this._globalTimelineStyles ||
          ((this._globalTimelineStyles = this._localTimelineStyles),
          this._elementTimelineStylesLookup.set(e, this._localTimelineStyles)),
        this._loadKeyframe();
    }
    containsAnimation() {
      switch (this._keyframes.size) {
        case 0:
          return !1;
        case 1:
          return this.hasCurrentStyleProperties();
        default:
          return !0;
      }
    }
    hasCurrentStyleProperties() {
      return this._currentKeyframe.size > 0;
    }
    get currentTime() {
      return this.startTime + this.duration;
    }
    delayNextStep(n) {
      let e = this._keyframes.size === 1 && this._pendingStyles.size;
      this.duration || e
        ? (this.forwardTime(this.currentTime + n), e && this.snapshotCurrentStyles())
        : (this.startTime += n);
    }
    fork(n, e) {
      return (
        this.applyStylesToKeyframe(),
        new t(this._driver, n, e || this.currentTime, this._elementTimelineStylesLookup)
      );
    }
    _loadKeyframe() {
      this._currentKeyframe && (this._previousKeyframe = this._currentKeyframe),
        (this._currentKeyframe = this._keyframes.get(this.duration)),
        this._currentKeyframe ||
          ((this._currentKeyframe = new Map()),
          this._keyframes.set(this.duration, this._currentKeyframe));
    }
    forwardFrame() {
      (this.duration += _R), this._loadKeyframe();
    }
    forwardTime(n) {
      this.applyStylesToKeyframe(), (this.duration = n), this._loadKeyframe();
    }
    _updateStyle(n, e) {
      this._localTimelineStyles.set(n, e),
        this._globalTimelineStyles.set(n, e),
        this._styleSummary.set(n, { time: this.currentTime, value: e });
    }
    allowOnlyTimelineStyles() {
      return this._currentEmptyStepKeyframe !== this._currentKeyframe;
    }
    applyEmptyStep(n) {
      n && this._previousKeyframe.set('easing', n);
      for (let [e, i] of this._globalTimelineStyles)
        this._backFill.set(e, i || Hn), this._currentKeyframe.set(e, Hn);
      this._currentEmptyStepKeyframe = this._currentKeyframe;
    }
    setStyles(n, e, i, r) {
      e && this._previousKeyframe.set('easing', e);
      let o = (r && r.params) || {},
        s = DR(n, this._globalTimelineStyles);
      for (let [a, l] of s) {
        let c = ba(l, o, i);
        this._pendingStyles.set(a, c),
          this._localTimelineStyles.has(a) ||
            this._backFill.set(a, this._globalTimelineStyles.get(a) ?? Hn),
          this._updateStyle(a, c);
      }
    }
    applyStylesToKeyframe() {
      this._pendingStyles.size != 0 &&
        (this._pendingStyles.forEach((n, e) => {
          this._currentKeyframe.set(e, n);
        }),
        this._pendingStyles.clear(),
        this._localTimelineStyles.forEach((n, e) => {
          this._currentKeyframe.has(e) || this._currentKeyframe.set(e, n);
        }));
    }
    snapshotCurrentStyles() {
      for (let [n, e] of this._localTimelineStyles)
        this._pendingStyles.set(n, e), this._updateStyle(n, e);
    }
    getFinalKeyframe() {
      return this._keyframes.get(this.duration);
    }
    get properties() {
      let n = [];
      for (let e in this._currentKeyframe) n.push(e);
      return n;
    }
    mergeTimelineCollectedStyles(n) {
      n._styleSummary.forEach((e, i) => {
        let r = this._styleSummary.get(i);
        (!r || e.time > r.time) && this._updateStyle(i, e.value);
      });
    }
    buildKeyframes() {
      this.applyStylesToKeyframe();
      let n = new Set(),
        e = new Set(),
        i = this._keyframes.size === 1 && this.duration === 0,
        r = [];
      this._keyframes.forEach((a, l) => {
        let c = new Map([...this._backFill, ...a]);
        c.forEach((f, p) => {
          f === yu ? n.add(p) : f === Hn && e.add(p);
        }),
          i || c.set('offset', l / this.duration),
          r.push(c);
      });
      let o = [...n.values()],
        s = [...e.values()];
      if (i) {
        let a = r[0],
          l = new Map(a);
        a.set('offset', 0), l.set('offset', 1), (r = [a, l]);
      }
      return _g(this.element, r, o, s, this.duration, this.startTime, this.easing, !1);
    }
  },
  rg = class extends Zu {
    constructor(n, e, i, r, o, s, a = !1) {
      super(n, e, s.delay),
        (this.keyframes = i),
        (this.preStyleProps = r),
        (this.postStyleProps = o),
        (this._stretchStartingKeyframe = a),
        (this.timings = {
          duration: s.duration,
          delay: s.delay,
          easing: s.easing,
        });
    }
    containsAnimation() {
      return this.keyframes.length > 1;
    }
    buildKeyframes() {
      let n = this.keyframes,
        { delay: e, duration: i, easing: r } = this.timings;
      if (this._stretchStartingKeyframe && e) {
        let o = [],
          s = i + e,
          a = e / s,
          l = new Map(n[0]);
        l.set('offset', 0), o.push(l);
        let c = new Map(n[0]);
        c.set('offset', bC(a)), o.push(c);
        let f = n.length - 1;
        for (let p = 1; p <= f; p++) {
          let g = new Map(n[p]),
            m = g.get('offset'),
            v = e + m * i;
          g.set('offset', bC(v / s)), o.push(g);
        }
        (i = s), (e = 0), (r = ''), (n = o);
      }
      return _g(this.element, n, this.preStyleProps, this.postStyleProps, i, e, r, !0);
    }
  };
function bC(t, n = 3) {
  let e = Math.pow(10, n - 1);
  return Math.round(t * e) / e;
}
function DR(t, n) {
  let e = new Map(),
    i;
  return (
    t.forEach((r) => {
      if (r === '*') {
        i ??= n.keys();
        for (let o of i) e.set(o, Hn);
      } else for (let [o, s] of r) e.set(o, s);
    }),
    e
  );
}
function CC(t, n, e, i, r, o, s, a, l, c, f, p, g) {
  return {
    type: 0,
    element: t,
    triggerName: n,
    isRemovalTransition: r,
    fromState: e,
    fromStyles: o,
    toState: i,
    toStyles: s,
    timelines: a,
    queriedElements: l,
    preStyleProps: c,
    postStyleProps: f,
    totalTime: p,
    errors: g,
  };
}
var Wm = {},
  Ku = class {
    constructor(n, e, i) {
      (this._triggerName = n), (this.ast = e), (this._stateStyles = i);
    }
    match(n, e, i, r) {
      return SR(this.ast.matchers, n, e, i, r);
    }
    buildStyles(n, e, i) {
      let r = this._stateStyles.get('*');
      return (
        n !== void 0 && (r = this._stateStyles.get(n?.toString()) || r),
        r ? r.buildStyles(e, i) : new Map()
      );
    }
    build(n, e, i, r, o, s, a, l, c, f) {
      let p = [],
        g = (this.ast.options && this.ast.options.params) || Wm,
        m = (a && a.params) || Wm,
        v = this.buildStyles(i, m, p),
        _ = (l && l.params) || Wm,
        C = this.buildStyles(r, _, p),
        S = new Set(),
        O = new Map(),
        I = new Map(),
        A = r === 'void',
        G = { params: LC(_, g), delay: this.ast.options?.delay },
        B = f ? [] : kC(n, e, this.ast.animation, o, s, v, C, G, c, p),
        W = 0;
      return (
        B.forEach((ce) => {
          W = Math.max(ce.duration + ce.delay, W);
        }),
        p.length
          ? CC(e, this._triggerName, i, r, A, v, C, [], [], O, I, W, p)
          : (B.forEach((ce) => {
              let _e = ce.element,
                ye = Lt(O, _e, new Set());
              ce.preStyleProps.forEach((Be) => ye.add(Be));
              let je = Lt(I, _e, new Set());
              ce.postStyleProps.forEach((Be) => je.add(Be)), _e !== e && S.add(_e);
            }),
            CC(e, this._triggerName, i, r, A, v, C, B, [...S.values()], O, I, W))
      );
    }
  };
function SR(t, n, e, i, r) {
  return t.some((o) => o(n, e, i, r));
}
function LC(t, n) {
  let e = E({}, n);
  return (
    Object.entries(t).forEach(([i, r]) => {
      r != null && (e[i] = r);
    }),
    e
  );
}
var og = class {
  constructor(n, e, i) {
    (this.styles = n), (this.defaultParams = e), (this.normalizer = i);
  }
  buildStyles(n, e) {
    let i = new Map(),
      r = LC(n, this.defaultParams);
    return (
      this.styles.styles.forEach((o) => {
        typeof o != 'string' &&
          o.forEach((s, a) => {
            s && (s = ba(s, r, e));
            let l = this.normalizer.normalizePropertyName(a, e);
            (s = this.normalizer.normalizeStyleValue(a, l, s, e)), i.set(a, s);
          });
      }),
      i
    );
  }
};
function ER(t, n, e) {
  return new sg(t, n, e);
}
var sg = class {
  constructor(n, e, i) {
    (this.name = n),
      (this.ast = e),
      (this._normalizer = i),
      (this.transitionFactories = []),
      (this.states = new Map()),
      e.states.forEach((r) => {
        let o = (r.options && r.options.params) || {};
        this.states.set(r.name, new og(r.style, o, i));
      }),
      wC(this.states, 'true', '1'),
      wC(this.states, 'false', '0'),
      e.transitions.forEach((r) => {
        this.transitionFactories.push(new Ku(n, r, this.states));
      }),
      (this.fallbackTransition = TR(n, this.states, this._normalizer));
  }
  get containsQueries() {
    return this.ast.queryCount > 0;
  }
  matchTransition(n, e, i, r) {
    return this.transitionFactories.find((s) => s.match(n, e, i, r)) || null;
  }
  matchStyles(n, e, i) {
    return this.fallbackTransition.buildStyles(n, e, i);
  }
};
function TR(t, n, e) {
  let i = [(s, a) => !0],
    r = { type: J.Sequence, steps: [], options: null },
    o = {
      type: J.Transition,
      animation: r,
      matchers: i,
      options: null,
      queryCount: 0,
      depCount: 0,
    };
  return new Ku(t, o, n);
}
function wC(t, n, e) {
  t.has(n) ? t.has(e) || t.set(e, t.get(n)) : t.has(e) && t.set(n, t.get(e));
}
var MR = new Ca(),
  ag = class {
    constructor(n, e, i) {
      (this.bodyNode = n),
        (this._driver = e),
        (this._normalizer = i),
        (this._animations = new Map()),
        (this._playersById = new Map()),
        (this.players = []);
    }
    register(n, e) {
      let i = [],
        r = [],
        o = FC(this._driver, e, i, r);
      if (i.length) throw U3(i);
      r.length && void 0, this._animations.set(n, o);
    }
    _buildPlayer(n, e, i) {
      let r = n.element,
        o = IC(this._normalizer, n.keyframes, e, i);
      return this._driver.animate(r, o, n.duration, n.delay, n.easing, [], !0);
    }
    create(n, e, i = {}) {
      let r = [],
        o = this._animations.get(n),
        s,
        a = new Map();
      if (
        (o
          ? ((s = kC(this._driver, e, o, OC, Km, new Map(), new Map(), i, MR, r)),
            s.forEach((f) => {
              let p = Lt(a, f.element, new Map());
              f.postStyleProps.forEach((g) => p.set(g, null));
            }))
          : (r.push($3()), (s = [])),
        r.length)
      )
        throw H3(r);
      a.forEach((f, p) => {
        f.forEach((g, m) => {
          f.set(m, this._driver.computeStyle(p, m, Hn));
        });
      });
      let l = s.map((f) => {
          let p = a.get(f.element);
          return this._buildPlayer(f, new Map(), p);
        }),
        c = Xi(l);
      return (
        this._playersById.set(n, c), c.onDestroy(() => this.destroy(n)), this.players.push(c), c
      );
    }
    destroy(n) {
      let e = this._getPlayer(n);
      e.destroy(), this._playersById.delete(n);
      let i = this.players.indexOf(e);
      i >= 0 && this.players.splice(i, 1);
    }
    _getPlayer(n) {
      let e = this._playersById.get(n);
      if (!e) throw G3(n);
      return e;
    }
    listen(n, e, i, r) {
      let o = hg(e, '', '', '');
      return fg(this._getPlayer(n), i, o, r), () => {};
    }
    command(n, e, i, r) {
      if (i == 'register') {
        this.register(n, r[0]);
        return;
      }
      if (i == 'create') {
        let s = r[0] || {};
        this.create(n, e, s);
        return;
      }
      let o = this._getPlayer(n);
      switch (i) {
        case 'play':
          o.play();
          break;
        case 'pause':
          o.pause();
          break;
        case 'reset':
          o.reset();
          break;
        case 'restart':
          o.restart();
          break;
        case 'finish':
          o.finish();
          break;
        case 'init':
          o.init();
          break;
        case 'setPosition':
          o.setPosition(parseFloat(r[0]));
          break;
        case 'destroy':
          this.destroy(n);
          break;
      }
    }
  },
  DC = 'ng-animate-queued',
  IR = '.ng-animate-queued',
  qm = 'ng-animate-disabled',
  xR = '.ng-animate-disabled',
  NR = 'ng-star-inserted',
  AR = '.ng-star-inserted',
  OR = [],
  VC = {
    namespaceId: '',
    setForRemoval: !1,
    setForMove: !1,
    hasAnimation: !1,
    removedBeforeQueried: !1,
  },
  RR = {
    namespaceId: '',
    setForMove: !1,
    setForRemoval: !1,
    hasAnimation: !1,
    removedBeforeQueried: !0,
  },
  pn = '__ng_removed',
  wa = class {
    get params() {
      return this.options.params;
    }
    constructor(n, e = '') {
      this.namespaceId = e;
      let i = n && n.hasOwnProperty('value'),
        r = i ? n.value : n;
      if (((this.value = FR(r)), i)) {
        let o = n,
          { value: s } = o,
          a = ad(o, ['value']);
        this.options = a;
      } else this.options = {};
      this.options.params || (this.options.params = {});
    }
    absorbOptions(n) {
      let e = n.params;
      if (e) {
        let i = this.options.params;
        Object.keys(e).forEach((r) => {
          i[r] == null && (i[r] = e[r]);
        });
      }
    }
  },
  ya = 'void',
  Qm = new wa(ya),
  lg = class {
    constructor(n, e, i) {
      (this.id = n),
        (this.hostElement = e),
        (this._engine = i),
        (this.players = []),
        (this._triggers = new Map()),
        (this._queue = []),
        (this._elementListeners = new Map()),
        (this._hostClassName = 'ng-tns-' + n),
        Zt(e, this._hostClassName);
    }
    listen(n, e, i, r) {
      if (!this._triggers.has(e)) throw z3(i, e);
      if (i == null || i.length == 0) throw W3(e);
      if (!kR(i)) throw q3(i, e);
      let o = Lt(this._elementListeners, n, []),
        s = { name: e, phase: i, callback: r };
      o.push(s);
      let a = Lt(this._engine.statesByElement, n, new Map());
      return (
        a.has(e) || (Zt(n, ju), Zt(n, ju + '-' + e), a.set(e, Qm)),
        () => {
          this._engine.afterFlush(() => {
            let l = o.indexOf(s);
            l >= 0 && o.splice(l, 1), this._triggers.has(e) || a.delete(e);
          });
        }
      );
    }
    register(n, e) {
      return this._triggers.has(n) ? !1 : (this._triggers.set(n, e), !0);
    }
    _getTrigger(n) {
      let e = this._triggers.get(n);
      if (!e) throw Q3(n);
      return e;
    }
    trigger(n, e, i, r = !0) {
      let o = this._getTrigger(e),
        s = new Da(this.id, e, n),
        a = this._engine.statesByElement.get(n);
      a || (Zt(n, ju), Zt(n, ju + '-' + e), this._engine.statesByElement.set(n, (a = new Map())));
      let l = a.get(e),
        c = new wa(i, this.id);
      if (
        (!(i && i.hasOwnProperty('value')) && l && c.absorbOptions(l.options),
        a.set(e, c),
        l || (l = Qm),
        !(c.value === ya) && l.value === c.value)
      ) {
        if (!jR(l.params, c.params)) {
          let _ = [],
            C = o.matchStyles(l.value, l.params, _),
            S = o.matchStyles(c.value, c.params, _);
          _.length
            ? this._engine.reportError(_)
            : this._engine.afterFlush(() => {
                zr(n, C), zn(n, S);
              });
        }
        return;
      }
      let g = Lt(this._engine.playersByElement, n, []);
      g.forEach((_) => {
        _.namespaceId == this.id && _.triggerName == e && _.queued && _.destroy();
      });
      let m = o.matchTransition(l.value, c.value, n, c.params),
        v = !1;
      if (!m) {
        if (!r) return;
        (m = o.fallbackTransition), (v = !0);
      }
      return (
        this._engine.totalQueuedPlayers++,
        this._queue.push({
          element: n,
          triggerName: e,
          transition: m,
          fromState: l,
          toState: c,
          player: s,
          isFallbackTransition: v,
        }),
        v ||
          (Zt(n, DC),
          s.onStart(() => {
            Yo(n, DC);
          })),
        s.onDone(() => {
          let _ = this.players.indexOf(s);
          _ >= 0 && this.players.splice(_, 1);
          let C = this._engine.playersByElement.get(n);
          if (C) {
            let S = C.indexOf(s);
            S >= 0 && C.splice(S, 1);
          }
        }),
        this.players.push(s),
        g.push(s),
        s
      );
    }
    deregister(n) {
      this._triggers.delete(n),
        this._engine.statesByElement.forEach((e) => e.delete(n)),
        this._elementListeners.forEach((e, i) => {
          this._elementListeners.set(
            i,
            e.filter((r) => r.name != n),
          );
        });
    }
    clearElementCache(n) {
      this._engine.statesByElement.delete(n), this._elementListeners.delete(n);
      let e = this._engine.playersByElement.get(n);
      e && (e.forEach((i) => i.destroy()), this._engine.playersByElement.delete(n));
    }
    _signalRemovalForInnerTriggers(n, e) {
      let i = this._engine.driver.query(n, Gu, !0);
      i.forEach((r) => {
        if (r[pn]) return;
        let o = this._engine.fetchNamespacesByElement(r);
        o.size
          ? o.forEach((s) => s.triggerLeaveAnimation(r, e, !1, !0))
          : this.clearElementCache(r);
      }),
        this._engine.afterFlushAnimationsDone(() => i.forEach((r) => this.clearElementCache(r)));
    }
    triggerLeaveAnimation(n, e, i, r) {
      let o = this._engine.statesByElement.get(n),
        s = new Map();
      if (o) {
        let a = [];
        if (
          (o.forEach((l, c) => {
            if ((s.set(c, l.value), this._triggers.has(c))) {
              let f = this.trigger(n, c, ya, r);
              f && a.push(f);
            }
          }),
          a.length)
        )
          return (
            this._engine.markElementAsRemoved(this.id, n, !0, e, s),
            i && Xi(a).onDone(() => this._engine.processLeaveNode(n)),
            !0
          );
      }
      return !1;
    }
    prepareLeaveAnimationListeners(n) {
      let e = this._elementListeners.get(n),
        i = this._engine.statesByElement.get(n);
      if (e && i) {
        let r = new Set();
        e.forEach((o) => {
          let s = o.name;
          if (r.has(s)) return;
          r.add(s);
          let l = this._triggers.get(s).fallbackTransition,
            c = i.get(s) || Qm,
            f = new wa(ya),
            p = new Da(this.id, s, n);
          this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: n,
              triggerName: s,
              transition: l,
              fromState: c,
              toState: f,
              player: p,
              isFallbackTransition: !0,
            });
        });
      }
    }
    removeNode(n, e) {
      let i = this._engine;
      if (
        (n.childElementCount && this._signalRemovalForInnerTriggers(n, e),
        this.triggerLeaveAnimation(n, e, !0))
      )
        return;
      let r = !1;
      if (i.totalAnimations) {
        let o = i.players.length ? i.playersByQueriedElement.get(n) : [];
        if (o && o.length) r = !0;
        else {
          let s = n;
          for (; (s = s.parentNode); )
            if (i.statesByElement.get(s)) {
              r = !0;
              break;
            }
        }
      }
      if ((this.prepareLeaveAnimationListeners(n), r)) i.markElementAsRemoved(this.id, n, !1, e);
      else {
        let o = n[pn];
        (!o || o === VC) &&
          (i.afterFlush(() => this.clearElementCache(n)),
          i.destroyInnerAnimations(n),
          i._onRemovalComplete(n, e));
      }
    }
    insertNode(n, e) {
      Zt(n, this._hostClassName);
    }
    drainQueuedTransitions(n) {
      let e = [];
      return (
        this._queue.forEach((i) => {
          let r = i.player;
          if (r.destroyed) return;
          let o = i.element,
            s = this._elementListeners.get(o);
          s &&
            s.forEach((a) => {
              if (a.name == i.triggerName) {
                let l = hg(o, i.triggerName, i.fromState.value, i.toState.value);
                (l._data = n), fg(i.player, a.phase, l, a.callback);
              }
            }),
            r.markedForDestroy
              ? this._engine.afterFlush(() => {
                  r.destroy();
                })
              : e.push(i);
        }),
        (this._queue = []),
        e.sort((i, r) => {
          let o = i.transition.ast.depCount,
            s = r.transition.ast.depCount;
          return o == 0 || s == 0
            ? o - s
            : this._engine.driver.containsElement(i.element, r.element)
              ? 1
              : -1;
        })
      );
    }
    destroy(n) {
      this.players.forEach((e) => e.destroy()),
        this._signalRemovalForInnerTriggers(this.hostElement, n);
    }
  },
  cg = class {
    _onRemovalComplete(n, e) {
      this.onRemovalComplete(n, e);
    }
    constructor(n, e, i) {
      (this.bodyNode = n),
        (this.driver = e),
        (this._normalizer = i),
        (this.players = []),
        (this.newHostElements = new Map()),
        (this.playersByElement = new Map()),
        (this.playersByQueriedElement = new Map()),
        (this.statesByElement = new Map()),
        (this.disabledNodes = new Set()),
        (this.totalAnimations = 0),
        (this.totalQueuedPlayers = 0),
        (this._namespaceLookup = {}),
        (this._namespaceList = []),
        (this._flushFns = []),
        (this._whenQuietFns = []),
        (this.namespacesByHostElement = new Map()),
        (this.collectedEnterElements = []),
        (this.collectedLeaveElements = []),
        (this.onRemovalComplete = (r, o) => {});
    }
    get queuedPlayers() {
      let n = [];
      return (
        this._namespaceList.forEach((e) => {
          e.players.forEach((i) => {
            i.queued && n.push(i);
          });
        }),
        n
      );
    }
    createNamespace(n, e) {
      let i = new lg(n, e, this);
      return (
        this.bodyNode && this.driver.containsElement(this.bodyNode, e)
          ? this._balanceNamespaceList(i, e)
          : (this.newHostElements.set(e, i), this.collectEnterElement(e)),
        (this._namespaceLookup[n] = i)
      );
    }
    _balanceNamespaceList(n, e) {
      let i = this._namespaceList,
        r = this.namespacesByHostElement;
      if (i.length - 1 >= 0) {
        let s = !1,
          a = this.driver.getParentElement(e);
        for (; a; ) {
          let l = r.get(a);
          if (l) {
            let c = i.indexOf(l);
            i.splice(c + 1, 0, n), (s = !0);
            break;
          }
          a = this.driver.getParentElement(a);
        }
        s || i.unshift(n);
      } else i.push(n);
      return r.set(e, n), n;
    }
    register(n, e) {
      let i = this._namespaceLookup[n];
      return i || (i = this.createNamespace(n, e)), i;
    }
    registerTrigger(n, e, i) {
      let r = this._namespaceLookup[n];
      r && r.register(e, i) && this.totalAnimations++;
    }
    destroy(n, e) {
      n &&
        (this.afterFlush(() => {}),
        this.afterFlushAnimationsDone(() => {
          let i = this._fetchNamespace(n);
          this.namespacesByHostElement.delete(i.hostElement);
          let r = this._namespaceList.indexOf(i);
          r >= 0 && this._namespaceList.splice(r, 1), i.destroy(e), delete this._namespaceLookup[n];
        }));
    }
    _fetchNamespace(n) {
      return this._namespaceLookup[n];
    }
    fetchNamespacesByElement(n) {
      let e = new Set(),
        i = this.statesByElement.get(n);
      if (i) {
        for (let r of i.values())
          if (r.namespaceId) {
            let o = this._fetchNamespace(r.namespaceId);
            o && e.add(o);
          }
      }
      return e;
    }
    trigger(n, e, i, r) {
      if ($u(e)) {
        let o = this._fetchNamespace(n);
        if (o) return o.trigger(e, i, r), !0;
      }
      return !1;
    }
    insertNode(n, e, i, r) {
      if (!$u(e)) return;
      let o = e[pn];
      if (o && o.setForRemoval) {
        (o.setForRemoval = !1), (o.setForMove = !0);
        let s = this.collectedLeaveElements.indexOf(e);
        s >= 0 && this.collectedLeaveElements.splice(s, 1);
      }
      if (n) {
        let s = this._fetchNamespace(n);
        s && s.insertNode(e, i);
      }
      r && this.collectEnterElement(e);
    }
    collectEnterElement(n) {
      this.collectedEnterElements.push(n);
    }
    markElementAsDisabled(n, e) {
      e
        ? this.disabledNodes.has(n) || (this.disabledNodes.add(n), Zt(n, qm))
        : this.disabledNodes.has(n) && (this.disabledNodes.delete(n), Yo(n, qm));
    }
    removeNode(n, e, i) {
      if ($u(e)) {
        let r = n ? this._fetchNamespace(n) : null;
        r ? r.removeNode(e, i) : this.markElementAsRemoved(n, e, !1, i);
        let o = this.namespacesByHostElement.get(e);
        o && o.id !== n && o.removeNode(e, i);
      } else this._onRemovalComplete(e, i);
    }
    markElementAsRemoved(n, e, i, r, o) {
      this.collectedLeaveElements.push(e),
        (e[pn] = {
          namespaceId: n,
          setForRemoval: r,
          hasAnimation: i,
          removedBeforeQueried: !1,
          previousTriggersValues: o,
        });
    }
    listen(n, e, i, r, o) {
      return $u(e) ? this._fetchNamespace(n).listen(e, i, r, o) : () => {};
    }
    _buildInstruction(n, e, i, r, o) {
      return n.transition.build(
        this.driver,
        n.element,
        n.fromState.value,
        n.toState.value,
        i,
        r,
        n.fromState.options,
        n.toState.options,
        e,
        o,
      );
    }
    destroyInnerAnimations(n) {
      let e = this.driver.query(n, Gu, !0);
      e.forEach((i) => this.destroyActiveAnimationsForElement(i)),
        this.playersByQueriedElement.size != 0 &&
          ((e = this.driver.query(n, Ym, !0)),
          e.forEach((i) => this.finishActiveQueriedAnimationOnElement(i)));
    }
    destroyActiveAnimationsForElement(n) {
      let e = this.playersByElement.get(n);
      e &&
        e.forEach((i) => {
          i.queued ? (i.markedForDestroy = !0) : i.destroy();
        });
    }
    finishActiveQueriedAnimationOnElement(n) {
      let e = this.playersByQueriedElement.get(n);
      e && e.forEach((i) => i.finish());
    }
    whenRenderingDone() {
      return new Promise((n) => {
        if (this.players.length) return Xi(this.players).onDone(() => n());
        n();
      });
    }
    processLeaveNode(n) {
      let e = n[pn];
      if (e && e.setForRemoval) {
        if (((n[pn] = VC), e.namespaceId)) {
          this.destroyInnerAnimations(n);
          let i = this._fetchNamespace(e.namespaceId);
          i && i.clearElementCache(n);
        }
        this._onRemovalComplete(n, e.setForRemoval);
      }
      n.classList?.contains(qm) && this.markElementAsDisabled(n, !1),
        this.driver.query(n, xR, !0).forEach((i) => {
          this.markElementAsDisabled(i, !1);
        });
    }
    flush(n = -1) {
      let e = [];
      if (
        (this.newHostElements.size &&
          (this.newHostElements.forEach((i, r) => this._balanceNamespaceList(i, r)),
          this.newHostElements.clear()),
        this.totalAnimations && this.collectedEnterElements.length)
      )
        for (let i = 0; i < this.collectedEnterElements.length; i++) {
          let r = this.collectedEnterElements[i];
          Zt(r, NR);
        }
      if (
        this._namespaceList.length &&
        (this.totalQueuedPlayers || this.collectedLeaveElements.length)
      ) {
        let i = [];
        try {
          e = this._flushAnimations(i, n);
        } finally {
          for (let r = 0; r < i.length; r++) i[r]();
        }
      } else
        for (let i = 0; i < this.collectedLeaveElements.length; i++) {
          let r = this.collectedLeaveElements[i];
          this.processLeaveNode(r);
        }
      if (
        ((this.totalQueuedPlayers = 0),
        (this.collectedEnterElements.length = 0),
        (this.collectedLeaveElements.length = 0),
        this._flushFns.forEach((i) => i()),
        (this._flushFns = []),
        this._whenQuietFns.length)
      ) {
        let i = this._whenQuietFns;
        (this._whenQuietFns = []),
          e.length
            ? Xi(e).onDone(() => {
                i.forEach((r) => r());
              })
            : i.forEach((r) => r());
      }
    }
    reportError(n) {
      throw Z3(n);
    }
    _flushAnimations(n, e) {
      let i = new Ca(),
        r = [],
        o = new Map(),
        s = [],
        a = new Map(),
        l = new Map(),
        c = new Map(),
        f = new Set();
      this.disabledNodes.forEach((x) => {
        f.add(x);
        let P = this.driver.query(x, IR, !0);
        for (let $ = 0; $ < P.length; $++) f.add(P[$]);
      });
      let p = this.bodyNode,
        g = Array.from(this.statesByElement.keys()),
        m = TC(g, this.collectedEnterElements),
        v = new Map(),
        _ = 0;
      m.forEach((x, P) => {
        let $ = OC + _++;
        v.set(P, $), x.forEach((X) => Zt(X, $));
      });
      let C = [],
        S = new Set(),
        O = new Set();
      for (let x = 0; x < this.collectedLeaveElements.length; x++) {
        let P = this.collectedLeaveElements[x],
          $ = P[pn];
        $ &&
          $.setForRemoval &&
          (C.push(P),
          S.add(P),
          $.hasAnimation ? this.driver.query(P, AR, !0).forEach((X) => S.add(X)) : O.add(P));
      }
      let I = new Map(),
        A = TC(g, Array.from(S));
      A.forEach((x, P) => {
        let $ = Km + _++;
        I.set(P, $), x.forEach((X) => Zt(X, $));
      }),
        n.push(() => {
          m.forEach((x, P) => {
            let $ = v.get(P);
            x.forEach((X) => Yo(X, $));
          }),
            A.forEach((x, P) => {
              let $ = I.get(P);
              x.forEach((X) => Yo(X, $));
            }),
            C.forEach((x) => {
              this.processLeaveNode(x);
            });
        });
      let G = [],
        B = [];
      for (let x = this._namespaceList.length - 1; x >= 0; x--)
        this._namespaceList[x].drainQueuedTransitions(e).forEach(($) => {
          let X = $.player,
            Te = $.element;
          if ((G.push(X), this.collectedEnterElements.length)) {
            let xe = Te[pn];
            if (xe && xe.setForMove) {
              if (xe.previousTriggersValues && xe.previousTriggersValues.has($.triggerName)) {
                let ht = xe.previousTriggersValues.get($.triggerName),
                  ct = this.statesByElement.get($.element);
                if (ct && ct.has($.triggerName)) {
                  let Qr = ct.get($.triggerName);
                  (Qr.value = ht), ct.set($.triggerName, Qr);
                }
              }
              X.destroy();
              return;
            }
          }
          let Ct = !p || !this.driver.containsElement(p, Te),
            $e = I.get(Te),
            Tt = v.get(Te),
            pe = this._buildInstruction($, i, Tt, $e, Ct);
          if (pe.errors && pe.errors.length) {
            B.push(pe);
            return;
          }
          if (Ct) {
            X.onStart(() => zr(Te, pe.fromStyles)),
              X.onDestroy(() => zn(Te, pe.toStyles)),
              r.push(X);
            return;
          }
          if ($.isFallbackTransition) {
            X.onStart(() => zr(Te, pe.fromStyles)),
              X.onDestroy(() => zn(Te, pe.toStyles)),
              r.push(X);
            return;
          }
          let Kt = [];
          pe.timelines.forEach((xe) => {
            (xe.stretchStartingKeyframe = !0), this.disabledNodes.has(xe.element) || Kt.push(xe);
          }),
            (pe.timelines = Kt),
            i.append(Te, pe.timelines);
          let tr = { instruction: pe, player: X, element: Te };
          s.push(tr),
            pe.queriedElements.forEach((xe) => Lt(a, xe, []).push(X)),
            pe.preStyleProps.forEach((xe, ht) => {
              if (xe.size) {
                let ct = l.get(ht);
                ct || l.set(ht, (ct = new Set())), xe.forEach((Qr, nr) => ct.add(nr));
              }
            }),
            pe.postStyleProps.forEach((xe, ht) => {
              let ct = c.get(ht);
              ct || c.set(ht, (ct = new Set())), xe.forEach((Qr, nr) => ct.add(nr));
            });
        });
      if (B.length) {
        let x = [];
        B.forEach((P) => {
          x.push(K3(P.triggerName, P.errors));
        }),
          G.forEach((P) => P.destroy()),
          this.reportError(x);
      }
      let W = new Map(),
        ce = new Map();
      s.forEach((x) => {
        let P = x.element;
        i.has(P) &&
          (ce.set(P, P), this._beforeAnimationBuild(x.player.namespaceId, x.instruction, W));
      }),
        r.forEach((x) => {
          let P = x.element;
          this._getPreviousPlayers(P, !1, x.namespaceId, x.triggerName, null).forEach((X) => {
            Lt(W, P, []).push(X), X.destroy();
          });
        });
      let _e = C.filter((x) => MC(x, l, c)),
        ye = new Map();
      EC(ye, this.driver, O, c, Hn).forEach((x) => {
        MC(x, l, c) && _e.push(x);
      });
      let Be = new Map();
      m.forEach((x, P) => {
        EC(Be, this.driver, new Set(x), l, yu);
      }),
        _e.forEach((x) => {
          let P = ye.get(x),
            $ = Be.get(x);
          ye.set(x, new Map([...(P?.entries() ?? []), ...($?.entries() ?? [])]));
        });
      let Ue = [],
        mn = [],
        gn = {};
      s.forEach((x) => {
        let { element: P, player: $, instruction: X } = x;
        if (i.has(P)) {
          if (f.has(P)) {
            $.onDestroy(() => zn(P, X.toStyles)),
              ($.disabled = !0),
              $.overrideTotalTime(X.totalTime),
              r.push($);
            return;
          }
          let Te = gn;
          if (ce.size > 1) {
            let $e = P,
              Tt = [];
            for (; ($e = $e.parentNode); ) {
              let pe = ce.get($e);
              if (pe) {
                Te = pe;
                break;
              }
              Tt.push($e);
            }
            Tt.forEach((pe) => ce.set(pe, Te));
          }
          let Ct = this._buildAnimation($.namespaceId, X, W, o, Be, ye);
          if (($.setRealPlayer(Ct), Te === gn)) Ue.push($);
          else {
            let $e = this.playersByElement.get(Te);
            $e && $e.length && ($.parentPlayer = Xi($e)), r.push($);
          }
        } else
          zr(P, X.fromStyles),
            $.onDestroy(() => zn(P, X.toStyles)),
            mn.push($),
            f.has(P) && r.push($);
      }),
        mn.forEach((x) => {
          let P = o.get(x.element);
          if (P && P.length) {
            let $ = Xi(P);
            x.setRealPlayer($);
          }
        }),
        r.forEach((x) => {
          x.parentPlayer ? x.syncPlayerEvents(x.parentPlayer) : x.destroy();
        });
      for (let x = 0; x < C.length; x++) {
        let P = C[x],
          $ = P[pn];
        if ((Yo(P, Km), $ && $.hasAnimation)) continue;
        let X = [];
        if (a.size) {
          let Ct = a.get(P);
          Ct && Ct.length && X.push(...Ct);
          let $e = this.driver.query(P, Ym, !0);
          for (let Tt = 0; Tt < $e.length; Tt++) {
            let pe = a.get($e[Tt]);
            pe && pe.length && X.push(...pe);
          }
        }
        let Te = X.filter((Ct) => !Ct.destroyed);
        Te.length ? LR(this, P, Te) : this.processLeaveNode(P);
      }
      return (
        (C.length = 0),
        Ue.forEach((x) => {
          this.players.push(x),
            x.onDone(() => {
              x.destroy();
              let P = this.players.indexOf(x);
              this.players.splice(P, 1);
            }),
            x.play();
        }),
        Ue
      );
    }
    afterFlush(n) {
      this._flushFns.push(n);
    }
    afterFlushAnimationsDone(n) {
      this._whenQuietFns.push(n);
    }
    _getPreviousPlayers(n, e, i, r, o) {
      let s = [];
      if (e) {
        let a = this.playersByQueriedElement.get(n);
        a && (s = a);
      } else {
        let a = this.playersByElement.get(n);
        if (a) {
          let l = !o || o == ya;
          a.forEach((c) => {
            c.queued || (!l && c.triggerName != r) || s.push(c);
          });
        }
      }
      return (
        (i || r) &&
          (s = s.filter((a) => !((i && i != a.namespaceId) || (r && r != a.triggerName)))),
        s
      );
    }
    _beforeAnimationBuild(n, e, i) {
      let r = e.triggerName,
        o = e.element,
        s = e.isRemovalTransition ? void 0 : n,
        a = e.isRemovalTransition ? void 0 : r;
      for (let l of e.timelines) {
        let c = l.element,
          f = c !== o,
          p = Lt(i, c, []);
        this._getPreviousPlayers(c, f, s, a, e.toState).forEach((m) => {
          let v = m.getRealPlayer();
          v.beforeDestroy && v.beforeDestroy(), m.destroy(), p.push(m);
        });
      }
      zr(o, e.fromStyles);
    }
    _buildAnimation(n, e, i, r, o, s) {
      let a = e.triggerName,
        l = e.element,
        c = [],
        f = new Set(),
        p = new Set(),
        g = e.timelines.map((v) => {
          let _ = v.element;
          f.add(_);
          let C = _[pn];
          if (C && C.removedBeforeQueried) return new Ki(v.duration, v.delay);
          let S = _ !== l,
            O = VR((i.get(_) || OR).map((W) => W.getRealPlayer())).filter((W) => {
              let ce = W;
              return ce.element ? ce.element === _ : !1;
            }),
            I = o.get(_),
            A = s.get(_),
            G = IC(this._normalizer, v.keyframes, I, A),
            B = this._buildPlayer(v, G, O);
          if ((v.subTimeline && r && p.add(_), S)) {
            let W = new Da(n, a, _);
            W.setRealPlayer(B), c.push(W);
          }
          return B;
        });
      c.forEach((v) => {
        Lt(this.playersByQueriedElement, v.element, []).push(v),
          v.onDone(() => PR(this.playersByQueriedElement, v.element, v));
      }),
        f.forEach((v) => Zt(v, vC));
      let m = Xi(g);
      return (
        m.onDestroy(() => {
          f.forEach((v) => Yo(v, vC)), zn(l, e.toStyles);
        }),
        p.forEach((v) => {
          Lt(r, v, []).push(m);
        }),
        m
      );
    }
    _buildPlayer(n, e, i) {
      return e.length > 0
        ? this.driver.animate(n.element, e, n.duration, n.delay, n.easing, i)
        : new Ki(n.duration, n.delay);
    }
  },
  Da = class {
    constructor(n, e, i) {
      (this.namespaceId = n),
        (this.triggerName = e),
        (this.element = i),
        (this._player = new Ki()),
        (this._containsRealPlayer = !1),
        (this._queuedCallbacks = new Map()),
        (this.destroyed = !1),
        (this.parentPlayer = null),
        (this.markedForDestroy = !1),
        (this.disabled = !1),
        (this.queued = !0),
        (this.totalTime = 0);
    }
    setRealPlayer(n) {
      this._containsRealPlayer ||
        ((this._player = n),
        this._queuedCallbacks.forEach((e, i) => {
          e.forEach((r) => fg(n, i, void 0, r));
        }),
        this._queuedCallbacks.clear(),
        (this._containsRealPlayer = !0),
        this.overrideTotalTime(n.totalTime),
        (this.queued = !1));
    }
    getRealPlayer() {
      return this._player;
    }
    overrideTotalTime(n) {
      this.totalTime = n;
    }
    syncPlayerEvents(n) {
      let e = this._player;
      e.triggerCallback && n.onStart(() => e.triggerCallback('start')),
        n.onDone(() => this.finish()),
        n.onDestroy(() => this.destroy());
    }
    _queueEvent(n, e) {
      Lt(this._queuedCallbacks, n, []).push(e);
    }
    onDone(n) {
      this.queued && this._queueEvent('done', n), this._player.onDone(n);
    }
    onStart(n) {
      this.queued && this._queueEvent('start', n), this._player.onStart(n);
    }
    onDestroy(n) {
      this.queued && this._queueEvent('destroy', n), this._player.onDestroy(n);
    }
    init() {
      this._player.init();
    }
    hasStarted() {
      return this.queued ? !1 : this._player.hasStarted();
    }
    play() {
      !this.queued && this._player.play();
    }
    pause() {
      !this.queued && this._player.pause();
    }
    restart() {
      !this.queued && this._player.restart();
    }
    finish() {
      this._player.finish();
    }
    destroy() {
      (this.destroyed = !0), this._player.destroy();
    }
    reset() {
      !this.queued && this._player.reset();
    }
    setPosition(n) {
      this.queued || this._player.setPosition(n);
    }
    getPosition() {
      return this.queued ? 0 : this._player.getPosition();
    }
    triggerCallback(n) {
      let e = this._player;
      e.triggerCallback && e.triggerCallback(n);
    }
  };
function PR(t, n, e) {
  let i = t.get(n);
  if (i) {
    if (i.length) {
      let r = i.indexOf(e);
      i.splice(r, 1);
    }
    i.length == 0 && t.delete(n);
  }
  return i;
}
function FR(t) {
  return t ?? null;
}
function $u(t) {
  return t && t.nodeType === 1;
}
function kR(t) {
  return t == 'start' || t == 'done';
}
function SC(t, n) {
  let e = t.style.display;
  return (t.style.display = n ?? 'none'), e;
}
function EC(t, n, e, i, r) {
  let o = [];
  e.forEach((l) => o.push(SC(l)));
  let s = [];
  i.forEach((l, c) => {
    let f = new Map();
    l.forEach((p) => {
      let g = n.computeStyle(c, p, r);
      f.set(p, g), (!g || g.length == 0) && ((c[pn] = RR), s.push(c));
    }),
      t.set(c, f);
  });
  let a = 0;
  return e.forEach((l) => SC(l, o[a++])), s;
}
function TC(t, n) {
  let e = new Map();
  if ((t.forEach((a) => e.set(a, [])), n.length == 0)) return e;
  let i = 1,
    r = new Set(n),
    o = new Map();
  function s(a) {
    if (!a) return i;
    let l = o.get(a);
    if (l) return l;
    let c = a.parentNode;
    return e.has(c) ? (l = c) : r.has(c) ? (l = i) : (l = s(c)), o.set(a, l), l;
  }
  return (
    n.forEach((a) => {
      let l = s(a);
      l !== i && e.get(l).push(a);
    }),
    e
  );
}
function Zt(t, n) {
  t.classList?.add(n);
}
function Yo(t, n) {
  t.classList?.remove(n);
}
function LR(t, n, e) {
  Xi(e).onDone(() => t.processLeaveNode(n));
}
function VR(t) {
  let n = [];
  return jC(t, n), n;
}
function jC(t, n) {
  for (let e = 0; e < t.length; e++) {
    let i = t[e];
    i instanceof pa ? jC(i.players, n) : n.push(i);
  }
}
function jR(t, n) {
  let e = Object.keys(t),
    i = Object.keys(n);
  if (e.length != i.length) return !1;
  for (let r = 0; r < e.length; r++) {
    let o = e[r];
    if (!n.hasOwnProperty(o) || t[o] !== n[o]) return !1;
  }
  return !0;
}
function MC(t, n, e) {
  let i = e.get(t);
  if (!i) return !1;
  let r = n.get(t);
  return r ? i.forEach((o) => r.add(o)) : n.set(t, i), e.delete(t), !0;
}
var Jo = class {
  constructor(n, e, i) {
    (this._driver = e),
      (this._normalizer = i),
      (this._triggerCache = {}),
      (this.onRemovalComplete = (r, o) => {}),
      (this._transitionEngine = new cg(n.body, e, i)),
      (this._timelineEngine = new ag(n.body, e, i)),
      (this._transitionEngine.onRemovalComplete = (r, o) => this.onRemovalComplete(r, o));
  }
  registerTrigger(n, e, i, r, o) {
    let s = n + '-' + r,
      a = this._triggerCache[s];
    if (!a) {
      let l = [],
        c = [],
        f = FC(this._driver, o, l, c);
      if (l.length) throw j3(r, l);
      c.length && void 0, (a = ER(r, f, this._normalizer)), (this._triggerCache[s] = a);
    }
    this._transitionEngine.registerTrigger(e, r, a);
  }
  register(n, e) {
    this._transitionEngine.register(n, e);
  }
  destroy(n, e) {
    this._transitionEngine.destroy(n, e);
  }
  onInsert(n, e, i, r) {
    this._transitionEngine.insertNode(n, e, i, r);
  }
  onRemove(n, e, i) {
    this._transitionEngine.removeNode(n, e, i);
  }
  disableAnimations(n, e) {
    this._transitionEngine.markElementAsDisabled(n, e);
  }
  process(n, e, i, r) {
    if (i.charAt(0) == '@') {
      let [o, s] = mC(i),
        a = r;
      this._timelineEngine.command(o, e, s, a);
    } else this._transitionEngine.trigger(n, e, i, r);
  }
  listen(n, e, i, r, o) {
    if (i.charAt(0) == '@') {
      let [s, a] = mC(i);
      return this._timelineEngine.listen(s, e, a, o);
    }
    return this._transitionEngine.listen(n, e, i, r, o);
  }
  flush(n = -1) {
    this._transitionEngine.flush(n);
  }
  get players() {
    return [...this._transitionEngine.players, ...this._timelineEngine.players];
  }
  whenRenderingDone() {
    return this._transitionEngine.whenRenderingDone();
  }
  afterFlushAnimationsDone(n) {
    this._transitionEngine.afterFlushAnimationsDone(n);
  }
};
function BR(t, n) {
  let e = null,
    i = null;
  return (
    Array.isArray(n) && n.length
      ? ((e = Zm(n[0])), n.length > 1 && (i = Zm(n[n.length - 1])))
      : n instanceof Map && (e = Zm(n)),
    e || i ? new ug(t, e, i) : null
  );
}
var ug = class t {
  static {
    this.initialStylesByElement = new WeakMap();
  }
  constructor(n, e, i) {
    (this._element = n), (this._startStyles = e), (this._endStyles = i), (this._state = 0);
    let r = t.initialStylesByElement.get(n);
    r || t.initialStylesByElement.set(n, (r = new Map())), (this._initialStyles = r);
  }
  start() {
    this._state < 1 &&
      (this._startStyles && zn(this._element, this._startStyles, this._initialStyles),
      (this._state = 1));
  }
  finish() {
    this.start(),
      this._state < 2 &&
        (zn(this._element, this._initialStyles),
        this._endStyles && (zn(this._element, this._endStyles), (this._endStyles = null)),
        (this._state = 1));
  }
  destroy() {
    this.finish(),
      this._state < 3 &&
        (t.initialStylesByElement.delete(this._element),
        this._startStyles && (zr(this._element, this._startStyles), (this._endStyles = null)),
        this._endStyles && (zr(this._element, this._endStyles), (this._endStyles = null)),
        zn(this._element, this._initialStyles),
        (this._state = 3));
  }
};
function Zm(t) {
  let n = null;
  return (
    t.forEach((e, i) => {
      UR(i) && ((n = n || new Map()), n.set(i, e));
    }),
    n
  );
}
function UR(t) {
  return t === 'display' || t === 'position';
}
var Yu = class {
    constructor(n, e, i, r) {
      (this.element = n),
        (this.keyframes = e),
        (this.options = i),
        (this._specialStyles = r),
        (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._initialized = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this.time = 0),
        (this.parentPlayer = null),
        (this.currentSnapshot = new Map()),
        (this._duration = i.duration),
        (this._delay = i.delay || 0),
        (this.time = this._duration + this._delay);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0), this._onDoneFns.forEach((n) => n()), (this._onDoneFns = []));
    }
    init() {
      this._buildPlayer(), this._preparePlayerBeforeStart();
    }
    _buildPlayer() {
      if (this._initialized) return;
      this._initialized = !0;
      let n = this.keyframes;
      (this.domPlayer = this._triggerWebAnimation(this.element, n, this.options)),
        (this._finalKeyframe = n.length ? n[n.length - 1] : new Map());
      let e = () => this._onFinish();
      this.domPlayer.addEventListener('finish', e),
        this.onDestroy(() => {
          this.domPlayer.removeEventListener('finish', e);
        });
    }
    _preparePlayerBeforeStart() {
      this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
    }
    _convertKeyframesToObject(n) {
      let e = [];
      return (
        n.forEach((i) => {
          e.push(Object.fromEntries(i));
        }),
        e
      );
    }
    _triggerWebAnimation(n, e, i) {
      return n.animate(this._convertKeyframesToObject(e), i);
    }
    onStart(n) {
      this._originalOnStartFns.push(n), this._onStartFns.push(n);
    }
    onDone(n) {
      this._originalOnDoneFns.push(n), this._onDoneFns.push(n);
    }
    onDestroy(n) {
      this._onDestroyFns.push(n);
    }
    play() {
      this._buildPlayer(),
        this.hasStarted() ||
          (this._onStartFns.forEach((n) => n()),
          (this._onStartFns = []),
          (this._started = !0),
          this._specialStyles && this._specialStyles.start()),
        this.domPlayer.play();
    }
    pause() {
      this.init(), this.domPlayer.pause();
    }
    finish() {
      this.init(),
        this._specialStyles && this._specialStyles.finish(),
        this._onFinish(),
        this.domPlayer.finish();
    }
    reset() {
      this._resetDomPlayerState(),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    _resetDomPlayerState() {
      this.domPlayer && this.domPlayer.cancel();
    }
    restart() {
      this.reset(), this.play();
    }
    hasStarted() {
      return this._started;
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._resetDomPlayerState(),
        this._onFinish(),
        this._specialStyles && this._specialStyles.destroy(),
        this._onDestroyFns.forEach((n) => n()),
        (this._onDestroyFns = []));
    }
    setPosition(n) {
      this.domPlayer === void 0 && this.init(), (this.domPlayer.currentTime = n * this.time);
    }
    getPosition() {
      return +(this.domPlayer.currentTime ?? 0) / this.time;
    }
    get totalTime() {
      return this._delay + this._duration;
    }
    beforeDestroy() {
      let n = new Map();
      this.hasStarted() &&
        this._finalKeyframe.forEach((i, r) => {
          r !== 'offset' && n.set(r, this._finished ? i : vg(this.element, r));
        }),
        (this.currentSnapshot = n);
    }
    triggerCallback(n) {
      let e = n === 'start' ? this._onStartFns : this._onDoneFns;
      e.forEach((i) => i()), (e.length = 0);
    }
  },
  Ju = class {
    validateStyleProperty(n) {
      return !0;
    }
    validateAnimatableStyleProperty(n) {
      return !0;
    }
    containsElement(n, e) {
      return xC(n, e);
    }
    getParentElement(n) {
      return pg(n);
    }
    query(n, e, i) {
      return NC(n, e, i);
    }
    computeStyle(n, e, i) {
      return vg(n, e);
    }
    animate(n, e, i, r, o, s = []) {
      let a = r == 0 ? 'both' : 'forwards',
        l = { duration: i, delay: r, fill: a };
      o && (l.easing = o);
      let c = new Map(),
        f = s.filter((m) => m instanceof Yu);
      aR(i, r) &&
        f.forEach((m) => {
          m.currentSnapshot.forEach((v, _) => c.set(_, v));
        });
      let p = rR(e).map((m) => new Map(m));
      p = lR(n, p, c);
      let g = BR(n, p);
      return new Yu(n, p, l, g);
    }
  };
var Hu = '@',
  BC = '@.disabled',
  Xu = class {
    constructor(n, e, i, r) {
      (this.namespaceId = n),
        (this.delegate = e),
        (this.engine = i),
        (this._onDestroy = r),
        (this.ɵtype = 0);
    }
    get data() {
      return this.delegate.data;
    }
    destroyNode(n) {
      this.delegate.destroyNode?.(n);
    }
    destroy() {
      this.engine.destroy(this.namespaceId, this.delegate),
        this.engine.afterFlushAnimationsDone(() => {
          queueMicrotask(() => {
            this.delegate.destroy();
          });
        }),
        this._onDestroy?.();
    }
    createElement(n, e) {
      return this.delegate.createElement(n, e);
    }
    createComment(n) {
      return this.delegate.createComment(n);
    }
    createText(n) {
      return this.delegate.createText(n);
    }
    appendChild(n, e) {
      this.delegate.appendChild(n, e), this.engine.onInsert(this.namespaceId, e, n, !1);
    }
    insertBefore(n, e, i, r = !0) {
      this.delegate.insertBefore(n, e, i), this.engine.onInsert(this.namespaceId, e, n, r);
    }
    removeChild(n, e, i) {
      this.parentNode(e) && this.engine.onRemove(this.namespaceId, e, this.delegate);
    }
    selectRootElement(n, e) {
      return this.delegate.selectRootElement(n, e);
    }
    parentNode(n) {
      return this.delegate.parentNode(n);
    }
    nextSibling(n) {
      return this.delegate.nextSibling(n);
    }
    setAttribute(n, e, i, r) {
      this.delegate.setAttribute(n, e, i, r);
    }
    removeAttribute(n, e, i) {
      this.delegate.removeAttribute(n, e, i);
    }
    addClass(n, e) {
      this.delegate.addClass(n, e);
    }
    removeClass(n, e) {
      this.delegate.removeClass(n, e);
    }
    setStyle(n, e, i, r) {
      this.delegate.setStyle(n, e, i, r);
    }
    removeStyle(n, e, i) {
      this.delegate.removeStyle(n, e, i);
    }
    setProperty(n, e, i) {
      e.charAt(0) == Hu && e == BC
        ? this.disableAnimations(n, !!i)
        : this.delegate.setProperty(n, e, i);
    }
    setValue(n, e) {
      this.delegate.setValue(n, e);
    }
    listen(n, e, i) {
      return this.delegate.listen(n, e, i);
    }
    disableAnimations(n, e) {
      this.engine.disableAnimations(n, e);
    }
  },
  dg = class extends Xu {
    constructor(n, e, i, r, o) {
      super(e, i, r, o), (this.factory = n), (this.namespaceId = e);
    }
    setProperty(n, e, i) {
      e.charAt(0) == Hu
        ? e.charAt(1) == '.' && e == BC
          ? ((i = i === void 0 ? !0 : !!i), this.disableAnimations(n, i))
          : this.engine.process(this.namespaceId, n, e.slice(1), i)
        : this.delegate.setProperty(n, e, i);
    }
    listen(n, e, i) {
      if (e.charAt(0) == Hu) {
        let r = $R(n),
          o = e.slice(1),
          s = '';
        return (
          o.charAt(0) != Hu && ([o, s] = HR(o)),
          this.engine.listen(this.namespaceId, r, o, s, (a) => {
            let l = a._data || -1;
            this.factory.scheduleListenerCallback(l, i, a);
          })
        );
      }
      return this.delegate.listen(n, e, i);
    }
  };
function $R(t) {
  switch (t) {
    case 'body':
      return document.body;
    case 'document':
      return document;
    case 'window':
      return window;
    default:
      return t;
  }
}
function HR(t) {
  let n = t.indexOf('.'),
    e = t.substring(0, n),
    i = t.slice(n + 1);
  return [e, i];
}
var ed = class {
  constructor(n, e, i) {
    (this.delegate = n),
      (this.engine = e),
      (this._zone = i),
      (this._currentId = 0),
      (this._microtaskId = 1),
      (this._animationCallbacksBuffer = []),
      (this._rendererCache = new Map()),
      (this._cdRecurDepth = 0),
      (e.onRemovalComplete = (r, o) => {
        o?.removeChild(null, r);
      });
  }
  createRenderer(n, e) {
    let i = '',
      r = this.delegate.createRenderer(n, e);
    if (!n || !e?.data?.animation) {
      let c = this._rendererCache,
        f = c.get(r);
      if (!f) {
        let p = () => c.delete(r);
        (f = new Xu(i, r, this.engine, p)), c.set(r, f);
      }
      return f;
    }
    let o = e.id,
      s = e.id + '-' + this._currentId;
    this._currentId++, this.engine.register(s, n);
    let a = (c) => {
      Array.isArray(c) ? c.forEach(a) : this.engine.registerTrigger(o, s, n, c.name, c);
    };
    return e.data.animation.forEach(a), new dg(this, s, r, this.engine);
  }
  begin() {
    this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
  }
  _scheduleCountTask() {
    queueMicrotask(() => {
      this._microtaskId++;
    });
  }
  scheduleListenerCallback(n, e, i) {
    if (n >= 0 && n < this._microtaskId) {
      this._zone.run(() => e(i));
      return;
    }
    let r = this._animationCallbacksBuffer;
    r.length == 0 &&
      queueMicrotask(() => {
        this._zone.run(() => {
          r.forEach((o) => {
            let [s, a] = o;
            s(a);
          }),
            (this._animationCallbacksBuffer = []);
        });
      }),
      r.push([e, i]);
  }
  end() {
    this._cdRecurDepth--,
      this._cdRecurDepth == 0 &&
        this._zone.runOutsideAngular(() => {
          this._scheduleCountTask(), this.engine.flush(this._microtaskId);
        }),
      this.delegate.end && this.delegate.end();
  }
  whenRenderingDone() {
    return this.engine.whenRenderingDone();
  }
};
var zR = (() => {
  class t extends Jo {
    constructor(e, i, r) {
      super(e, i, r);
    }
    ngOnDestroy() {
      this.flush();
    }
    static {
      this.ɵfac = function (i) {
        return new (i || t)(N(Se), N(Wr), N(qr));
      };
    }
    static {
      this.ɵprov = M({ token: t, factory: t.ɵfac });
    }
  }
  return t;
})();
function WR() {
  return new Wu();
}
function qR(t, n, e) {
  return new ed(t, n, e);
}
var UC = [
    { provide: qr, useFactory: WR },
    { provide: Jo, useClass: zR },
    { provide: Ei, useFactory: qR, deps: [wc, Jo, me] },
  ],
  QR = [
    { provide: Wr, useFactory: () => new Ju() },
    { provide: vh, useValue: 'BrowserAnimations' },
    ...UC,
  ],
  DG = [{ provide: Wr, useClass: mg }, { provide: vh, useValue: 'NoopAnimations' }, ...UC];
function $C() {
  return On('NgEagerAnimations'), [...QR];
}
var ZR = (t) => new Vu(t, './i18n/', '.json'),
  HC = {
    providers: [
      L_({ eventCoalescing: !0 }),
      eb(hC),
      $C(),
      oC({ timeOut: 5e3, autoDismiss: !1, closeButton: !0 }),
      uy(),
      nh([wu.forRoot({ loader: { provide: Yi, useFactory: ZR, deps: [Ns] } })]),
    ],
  };
var KR = ':';
function YR(t, n) {
  for (let e = 1, i = 1; e < t.length; e++, i++)
    if (n[i] === '\\') i++;
    else if (t[e] === KR) return e;
  throw new Error(`Unterminated $localize metadata block in "${n}".`);
}
var er = function (t, ...n) {
    if (er.translate) {
      let i = er.translate(t, n);
      (t = i[0]), (n = i[1]);
    }
    let e = GC(t[0], t.raw[0]);
    for (let i = 1; i < t.length; i++) e += n[i - 1] + GC(t[i], t.raw[i]);
    return e;
  },
  JR = ':';
function GC(t, n) {
  return n.charAt(0) === JR ? t.substring(YR(t, n) + 1) : t;
}
globalThis.$localize = er;
var zC = [
  { name: 'About Us', icon: '', id: 'about', subnav: [], path: ve.ABOUT },
  {
    name: 'For Business',
    icon: '',
    id: 'forbusiness',
    subchildrens: !0,
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
            path: ve.SERVICES.STAFFING,
          },
          {
            name: 'Consulting',
            id: 'consulting',
            icon: '',
            path: ve.SERVICES.CONSULTING,
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
            path: ve.INDUSTRIES.FINANCE,
          },
          {
            name: 'Health Care',
            icon: '',
            id: 'healthcare',
            path: ve.INDUSTRIES.HEALTH_CARE,
          },
          {
            name: 'Information Technology',
            icon: '',
            id: 'it',
            path: ve.INDUSTRIES.IT,
          },
          {
            name: 'Retail',
            icon: '',
            id: 'retail',
            path: ve.INDUSTRIES.RETAIL,
          },
          {
            name: 'Life Sciences',
            icon: '',
            id: 'lifesciences',
            path: ve.INDUSTRIES.LIFE_SCIENCES,
          },
          {
            name: 'Logistics',
            icon: '',
            id: 'logistics',
            path: ve.INDUSTRIES.LOGISTICS,
          },
        ],
      },
    ],
  },
  {
    name: 'For Job Seekers',
    icon: '',
    id: 'jobseeker',
    subchildrens: !1,
    subnav: [
      {
        name: 'Search Jobs',
        id: 'searchjobs',
        icon: '',
        path: ve.JOB_SEEKER.SEARCH_JOBS,
      },
      {
        name: 'Submit Resume',
        id: 'submitresume',
        icon: '',
        path: ve.JOB_SEEKER.SUBMIT_RESUME,
      },
    ],
  },
  { name: 'Contact Us', icon: '', id: 'contact', subnav: [], path: ve.CONTACT },
  {
    name: 'Post Jobs',
    icon: '',
    id: 'postjob',
    subnav: [],
    path: ve.CONTACT,
    visibleAfterLogin: !0,
  },
];
var td = class t {
  constructor() {}
  getMenuData() {
    return zC;
  }
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵprov = M({ token: t, factory: t.ɵfac, providedIn: 'root' });
};
var XR = ['headerDropdown'],
  eP = (t) => ({ item: t }),
  tP = (t) => ({ active: t }),
  nP = (t) => ({ selectedTab: t });
function iP(t, n) {}
function rP(t, n) {
  if ((t & 1 && (We(0), R(1, iP, 0, 0, 'ng-template', 4), qe()), t & 2)) {
    let e = n.$implicit;
    U();
    let i = Dr(3);
    w(), D('ngTemplateOutlet', i)('ngTemplateOutletContext', ln(2, eP, e));
  }
}
function oP(t, n) {
  if (t & 1) {
    let e = rt();
    We(0),
      u(1, 'div', 14)(2, 'h1', 15),
      Z('click', function () {
        let r = ke(e).$implicit;
        U(2);
        let o = Dr(1),
          s = U().item,
          a = U();
        return Le(r != null && r.path ? a.navigateToChild(r.path, o) : a.subItemSelection(s, r));
      }),
      h(3),
      d()(),
      qe();
  }
  if (t & 2) {
    let e = n.$implicit,
      i = U(3).item;
    w(2),
      D('ngClass', ln(2, tP, (i.selectedSubNav == null ? null : i.selectedSubNav.id) === e.id)),
      w(),
      Ae(e.name);
  }
}
function sP(t, n) {
  if (t & 1) {
    let e = rt();
    u(0, 'button', 19),
      Z('click', function () {
        let r = ke(e).$implicit,
          o = U(6);
        return Le(o.navigateToChild(r.path));
      }),
      ze(),
      u(1, 'svg', 20),
      b(2, 'path', 21),
      u(3, 'defs')(4, 'linearGradient', 22),
      b(5, 'stop', 23)(6, 'stop', 24),
      d()()(),
      Ye(),
      u(7, 'span'),
      h(8),
      d()();
  }
  if (t & 2) {
    let e = n.$implicit;
    w(8), Ae(e.name);
  }
}
function aP(t, n) {
  if ((t & 1 && (u(0, 'div', 17), R(1, sP, 9, 1, 'button', 18), d()), t & 2)) {
    let e = U().$implicit;
    w(), D('ngForOf', e.subchildren);
  }
}
function lP(t, n) {
  if ((t & 1 && (We(0), R(1, aP, 2, 1, 'div', 16), qe()), t & 2)) {
    let e = n.$implicit,
      i = U(3).item;
    w(), D('ngIf', (i.selectedSubNav == null ? null : i.selectedSubNav.id) === e.id);
  }
}
function cP(t, n) {
  if (
    (t & 1 &&
      (u(0, 'div', 12)(1, 'div', 13),
      R(2, oP, 4, 4, 'ng-container', 3),
      d(),
      R(3, lP, 2, 1, 'ng-container', 3),
      d()),
    t & 2)
  ) {
    let e = U(2).item;
    w(2), D('ngForOf', e.subnav), w(), D('ngForOf', e.subnav);
  }
}
function uP(t, n) {
  if (t & 1) {
    let e = rt();
    We(0),
      u(1, 'button', 19),
      Z('click', function () {
        let r = ke(e).$implicit;
        U(2);
        let o = Dr(1),
          s = U().item,
          a = U();
        return Le(r != null && r.path ? a.navigateToChild(r.path, o) : a.subItemSelection(s, r));
      }),
      h(2),
      d(),
      qe();
  }
  if (t & 2) {
    let e = n.$implicit;
    w(2), Ae(e.name);
  }
}
function dP(t, n) {
  if ((t & 1 && (We(0), R(1, uP, 3, 1, 'ng-container', 3), qe()), t & 2)) {
    let e = U(2).item;
    w(), D('ngForOf', e.subnav);
  }
}
function fP(t, n) {
  if (t & 1) {
    let e = rt();
    u(0, 'div', 7, 1)(2, 'button', 8),
      Z('click', function () {
        ke(e);
        let r = U().item,
          o = U();
        return Le(o.subItemSelection(r));
      }),
      h(3),
      d(),
      u(4, 'ul', 9),
      R(5, cP, 4, 2, 'div', 10)(6, dP, 2, 1, 'ng-container', 11),
      d()();
  }
  if (t & 2) {
    let e = U().item;
    D('dropdownClass', e != null && e.subchildrens ? 'nav-megamenu-list' : 'nav-dropdown-list'),
      w(3),
      Ae(e.name),
      w(2),
      D('ngIf', e == null ? null : e.subchildrens),
      w(),
      D('ngIf', !(e != null && e.subchildrens));
  }
}
function hP(t, n) {
  if (t & 1) {
    let e = rt();
    u(0, 'button', 25),
      Z('click', function () {
        ke(e);
        let r = U().item,
          o = U();
        return o.navigateToChild(r.path), Le(o.subItemSelection(r));
      }),
      h(1),
      d();
  }
  if (t & 2) {
    let e = U().item;
    D('ngClass', ln(2, nP, e.selected)), w(), Ae(e.name);
  }
}
function pP(t, n) {
  if ((t & 1 && (We(0), R(1, fP, 7, 4, 'div', 5), qe(), R(2, hP, 2, 4, 'button', 6)), t & 2)) {
    let e = n.item;
    w(),
      D(
        'ngIf',
        (e == null ? null : e.subnav) && (e == null ? null : e.subnav.length) > 0 && e.visible,
      ),
      w(),
      D('ngIf', !(e != null && e.subnav.length) && e.visible);
  }
}
var nd = class t {
  constructor(n) {
    this.authService = n;
  }
  menuItems = [];
  subscription = new Ce();
  route = y(Vn);
  menuService = y(td);
  headerDropdown;
  navigateToAbout() {
    this.route.navigate(['/about'], {
      skipLocationChange: yt.ENABLE_SKIP_LOCATION,
    });
  }
  navigateToChild(n, e) {
    this.headerDropdown?.isOpen() && this.headerDropdown.close(),
      e?.isOpen() && e.close(),
      this.route.navigate([n], { skipLocationChange: yt.ENABLE_SKIP_LOCATION });
  }
  isAuthenticated = !1;
  ngOnInit() {
    (this.menuItems = this.menuService.getMenuData()),
      this.subscription.add(
        this.authService.authenticated$.subscribe((n) => {
          (this.isAuthenticated = n), this.onUserLoggedIn(n);
        }),
      );
  }
  subItemSelection(n, e) {
    n &&
      n?.subnav?.length &&
      (n.selectedSubNav || (n.selectedSubNav = {}),
      (n.selectedSubNav = {}),
      !e && n.subnav[0]?.subchildren
        ? (n.selectedSubNav = n.subnav[0])
        : e && e?.subchildren && (n.selectedSubNav = e));
  }
  onUserLoggedIn(n) {
    this.menuItems?.length &&
      this.menuItems.forEach((e) => {
        this.setVisibility(e, n),
          e?.subnav?.length &&
            e.subnav.forEach((i) => {
              this.setVisibility(i, n),
                i?.subchildren?.length &&
                  i.subchildren.forEach((r) => {
                    this.setVisibility(r, n);
                  });
            });
      });
  }
  setVisibility(n, e) {
    n.hasOwnProperty('visibleAfterLogin')
      ? (n.visible = n.visibleAfterLogin === e)
      : (n.visible = !0);
  }
  ngOnDestry() {
    this.subscription.unsubscribe();
  }
  static ɵfac = function (e) {
    return new (e || t)(k(Ji));
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-navigation']],
    viewQuery: function (e, i) {
      if ((e & 1 && $h(XR, 5), e & 2)) {
        let r;
        Pn((r = Fn())) && (i.headerDropdown = r.first);
      }
    },
    standalone: !0,
    features: [j],
    decls: 4,
    vars: 1,
    consts: [
      ['dropdownTemplate', ''],
      ['headerDropdown', 'ngbDropdown'],
      [1, 'd-flex', 'align-items-center', 'justify-content-center', 'gap-4'],
      [4, 'ngFor', 'ngForOf'],
      [3, 'ngTemplateOutlet', 'ngTemplateOutletContext'],
      ['ngbDropdown', '', 'container', 'body', 3, 'dropdownClass', 4, 'ngIf'],
      ['class', 'nav-item-list', 3, 'ngClass', 'click', 4, 'ngIf'],
      ['ngbDropdown', '', 'container', 'body', 3, 'dropdownClass'],
      ['ngbDropdownToggle', '', 3, 'click'],
      ['ngbDropdownMenu', ''],
      ['class', 'd-flex align-items-start gap-3', 4, 'ngIf'],
      [4, 'ngIf'],
      [1, 'd-flex', 'align-items-start', 'gap-3'],
      [1, 'd-flex', 'flex-column'],
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
    template: function (e, i) {
      e & 1 &&
        (u(0, 'div', 2),
        R(1, rP, 2, 4, 'ng-container', 3),
        d(),
        R(2, pP, 3, 2, 'ng-template', null, 0, Hh)),
        e & 2 && (w(), D('ngForOf', i.menuItems));
    },
    dependencies: [ot, mc, So, Rt, Kh, Wo, Zi, zo, Br, lu, Xb],
    styles: [
      '[_nghost-%COMP%]{width:100%}.nav-item-list[_ngcontent-%COMP%], .dropdown[_ngcontent-%COMP%]   .dropdown-toggle[_ngcontent-%COMP%]{color:#fff;font-size:16px;font-style:normal;font-weight:600;line-height:normal;border:0;padding:0;background:transparent;text-align:center;cursor:pointer}.dropdown.show[_ngcontent-%COMP%]   .dropdown-toggle[_ngcontent-%COMP%]{color:#4c7df4}.dropdown[_ngcontent-%COMP%]   .dropdown-toggle[_ngcontent-%COMP%]:after{display:none}  .nav-megamenu-list{width:100%;left:0!important;transform:none!important;top:76px!important;background:#004dba;box-shadow:0 4px 4px #00000040;right:0!important;margin:0 auto!important}  .nav-megamenu-list .dropdown-menu{background:#004dba;border:0;padding:30px 60px;margin:0}  .nav-megamenu-list .dropdown-menu .submenu-list{display:flex;align-items:flex-start;gap:20px;margin-bottom:30px}  .nav-megamenu-list .dropdown-menu .submenu-list:last-child{margin:0}  .nav-megamenu-list .dropdown-menu .submenu-list h1{color:#fff;font-size:16px;font-weight:700;line-height:normal;display:flex;height:51px;padding:12px 36px;justify-content:center;align-items:center;gap:10px;align-self:stretch;border-radius:60px;background:transparent;flex-shrink:0;width:200px;cursor:pointer}  .nav-megamenu-list .dropdown-menu .submenu-list h1.active{color:#323232;background:#fff}  .nav-megamenu-list .dropdown-menu .childrens-list{width:100%;display:flex;flex-wrap:wrap;gap:18px}  .nav-megamenu-list .dropdown-menu .childrens-list .dropdown-item{flex:1 1 32%;border-radius:8px;background:#fff;display:flex;padding:15px 40px;align-items:center;gap:20px;align-self:stretch;color:#323232;font-family:Open Sans;font-size:14px;font-style:normal;font-weight:700;line-height:normal;cursor:pointer}  .nav-megamenu-list .dropdown-menu .inner-list-data .inner-list-btn{color:#fff;font-size:16px;font-style:normal;font-weight:600;line-height:normal;border:0;padding:0;background:transparent;text-align:center;cursor:pointer}',
    ],
  });
};
var id = class t {
  isLoginPage = !1;
  route = y(Vn);
  authService = y(Ji);
  notificationService = y(Et);
  subscription = new Ce();
  isAuthenticated;
  ngOnInit() {
    this.subscription.add(
      this.authService.authenticated$.subscribe((n) => {
        this.isAuthenticated = n;
      }),
    );
  }
  navigateToHome() {
    this.route.navigate(['home'], {
      skipLocationChange: yt.ENABLE_SKIP_LOCATION,
    });
  }
  navigateToLogin() {
    this.route.navigate(['login'], {
      skipLocationChange: yt.ENABLE_SKIP_LOCATION,
    });
  }
  logoutUser() {
    this.authService.logout(),
      this.notificationService.notify('Logged out successfully', 'success');
  }
  ngOnDestry() {
    this.subscription.unsubscribe();
  }
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-header']],
    inputs: { isLoginPage: 'isLoginPage' },
    standalone: !0,
    features: [j],
    decls: 8,
    vars: 1,
    consts: [
      [1, 'header-wrapper'],
      [1, 'logo', 3, 'click'],
      [1, 'promates-btn'],
      [1, 'promates-btn', 'ms-2', 3, 'click'],
    ],
    template: function (e, i) {
      e & 1 &&
        (u(0, 'div', 0)(1, 'div', 1),
        Z('click', function () {
          return i.navigateToHome();
        }),
        h(2, 'ProMates'),
        d(),
        b(3, 'app-navigation'),
        u(4, 'button', 2),
        h(5, 'Join the Platform'),
        d(),
        u(6, 'button', 3),
        Z('click', function () {
          return i.isAuthenticated ? i.logoutUser() : i.navigateToLogin();
        }),
        h(7),
        d()()),
        e & 2 && (w(7), Ae(i.isAuthenticated ? 'Logout' : 'Login'));
    },
    dependencies: [nd],
    styles: [
      '.header-wrapper[_ngcontent-%COMP%]{background:#0054cc;display:flex;height:80px;padding:0 90px;justify-content:space-between;align-items:center}.logo[_ngcontent-%COMP%]{display:flex;padding:8px 16px;align-items:center;gap:10px;color:#fff;font-size:24px;font-style:normal;font-weight:700;letter-spacing:.632px;border:2px solid #FFF}',
    ],
  });
};
var rd = class t {
  isLoginPage = !1;
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-footer']],
    inputs: { isLoginPage: 'isLoginPage' },
    standalone: !0,
    features: [j],
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
    template: function (e, i) {
      e & 1 &&
        (u(0, 'footer', 0)(1, 'div', 1)(2, 'div', 2)(3, 'h5'),
        h(4, 'Social Media'),
        d(),
        u(5, 'ul', 3)(6, 'li')(7, 'a', 4),
        h(8, 'Facebook'),
        d()(),
        u(9, 'li')(10, 'a', 4),
        h(11, 'Twitter'),
        d()(),
        u(12, 'li')(13, 'a', 4),
        h(14, 'Instagram'),
        d()(),
        u(15, 'li')(16, 'a', 4),
        h(17, 'LinkedIn'),
        d()()()(),
        u(18, 'div', 2)(19, 'h5'),
        h(20, 'Services'),
        d(),
        u(21, 'ul', 3)(22, 'li')(23, 'a', 4),
        h(24, 'Consulting'),
        d()(),
        u(25, 'li')(26, 'a', 4),
        h(27, 'Staffing'),
        d()(),
        u(28, 'li')(29, 'a', 4),
        h(30, 'Cloud Services'),
        d()(),
        u(31, 'li')(32, 'a', 4),
        h(33, 'Support'),
        d()()()(),
        u(34, 'div', 2)(35, 'h5'),
        h(36, 'About'),
        d(),
        u(37, 'ul', 3)(38, 'li')(39, 'a', 4),
        h(40, 'Our Story'),
        d()(),
        u(41, 'li')(42, 'a', 4),
        h(43, 'Careers'),
        d()(),
        u(44, 'li')(45, 'a', 4),
        h(46, 'Contact Us'),
        d()()()(),
        u(47, 'div', 2)(48, 'h5'),
        h(49, 'Resources'),
        d(),
        u(50, 'ul', 3)(51, 'li')(52, 'a', 4),
        h(53, 'Blog'),
        d()(),
        u(54, 'li')(55, 'a', 4),
        h(56, 'Case Studies'),
        d()(),
        u(57, 'li')(58, 'a', 4),
        h(59, 'Whitepapers'),
        d()()()(),
        u(60, 'div', 2)(61, 'h5'),
        h(62, 'Areas of Experience'),
        d(),
        u(63, 'ul', 3)(64, 'li')(65, 'a', 4),
        h(66, 'Finance'),
        d()(),
        u(67, 'li')(68, 'a', 4),
        h(69, 'Healthcare'),
        d()(),
        u(70, 'li')(71, 'a', 4),
        h(72, 'Information Technology'),
        d()(),
        u(73, 'li')(74, 'a', 4),
        h(75, 'Retail'),
        d()(),
        u(76, 'li')(77, 'a', 4),
        h(78, 'Logistics'),
        d()()()()(),
        u(79, 'div', 5)(80, 'p'),
        h(81, '\xA9 2023 Your Company Name. All rights reserved.'),
        d()()());
    },
    styles: [
      'footer[_ngcontent-%COMP%]{background:#070c2e!important}footer[_ngcontent-%COMP%]   .row-data-footer[_ngcontent-%COMP%]{padding:50px 100px}footer[_ngcontent-%COMP%]   .row-data-footer[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%]{color:#e9efff;font-size:16px;font-style:normal;font-weight:700;line-height:24px;text-transform:capitalize}footer[_ngcontent-%COMP%]   .row-data-footer[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{padding:0;margin:0}footer[_ngcontent-%COMP%]   .row-data-footer[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{list-style-type:none}footer[_ngcontent-%COMP%]   .row-data-footer[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#fff;font-size:14px;list-style-type:none;text-decoration:none;font-style:normal;font-weight:400;line-height:35px;text-transform:capitalize}footer[_ngcontent-%COMP%]   .bottom-data[_ngcontent-%COMP%]{background:#121a50;display:flex;padding:16px 100px;align-items:center;gap:27px;align-self:stretch}footer[_ngcontent-%COMP%]   .bottom-data[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#fff;font-size:14px;font-weight:400;line-height:24px;text-transform:capitalize}',
    ],
  });
};
var od = class t {
  title = er`:Title for the app:Welcome to our application!`;
  welcomeMessage = er`Welcome to our localized app!`;
  isLoginPage = !0;
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = V({
    type: t,
    selectors: [['app-root']],
    standalone: !0,
    features: [At([]), j],
    decls: 3,
    vars: 2,
    consts: [[3, 'isLoginPage']],
    template: function (e, i) {
      e & 1 && b(0, 'app-header', 0)(1, 'router-outlet')(2, 'app-footer', 0),
        e & 2 && (D('isLoginPage', i.isLoginPage), w(2), D('isLoginPage', i.isLoginPage));
    },
    dependencies: [$p, id, rd, wu],
  });
};
yt.production && void 0;
vy(od, HC).catch((t) => console.error(t));
