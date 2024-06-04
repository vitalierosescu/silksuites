(() => {
  function M() {
    return (
      (M = Object.assign
        ? Object.assign.bind()
        : function (o) {
            for (var t = 1; t < arguments.length; t++) {
              var e = arguments[t];
              for (var i in e)
                Object.prototype.hasOwnProperty.call(e, i) && (o[i] = e[i]);
            }
            return o;
          }),
      M.apply(this, arguments)
    );
  }
  function E(o, t, e) {
    return Math.max(o, Math.min(t, e));
  }
  var b = class {
    advance(t) {
      var e;
      if (!this.isRunning) return;
      let i = !1;
      if (this.lerp)
        (this.value = (1 - (n = this.lerp)) * this.value + n * this.to),
          Math.round(this.value) === this.to &&
            ((this.value = this.to), (i = !0));
      else {
        this.currentTime += t;
        let s = E(0, this.currentTime / this.duration, 1);
        i = s >= 1;
        let r = i ? 1 : this.easing(s);
        this.value = this.from + (this.to - this.from) * r;
      }
      var n;
      (e = this.onUpdate) == null || e.call(this, this.value, { completed: i }),
        i && this.stop();
    }
    stop() {
      this.isRunning = !1;
    }
    fromTo(
      t,
      e,
      { lerp: i = 0.1, duration: n = 1, easing: s = (l) => l, onUpdate: r }
    ) {
      (this.from = this.value = t),
        (this.to = e),
        (this.lerp = i),
        (this.duration = n),
        (this.easing = s),
        (this.currentTime = 0),
        (this.isRunning = !0),
        (this.onUpdate = r);
    }
  };
  function H(o, t) {
    let e;
    return function () {
      let i = arguments,
        n = this;
      clearTimeout(e),
        (e = setTimeout(function () {
          o.apply(n, i);
        }, t));
    };
  }
  var L = class {
      constructor(t, e) {
        (this.onWindowResize = () => {
          (this.width = window.innerWidth), (this.height = window.innerHeight);
        }),
          (this.onWrapperResize = () => {
            (this.width = this.wrapper.clientWidth),
              (this.height = this.wrapper.clientHeight);
          }),
          (this.onContentResize = () => {
            let i =
              this.wrapper === window ? document.documentElement : this.wrapper;
            (this.scrollHeight = i.scrollHeight),
              (this.scrollWidth = i.scrollWidth);
          }),
          (this.wrapper = t),
          (this.content = e),
          this.wrapper === window
            ? (window.addEventListener('resize', this.onWindowResize, !1),
              this.onWindowResize())
            : ((this.wrapperResizeObserver = new ResizeObserver(
                H(this.onWrapperResize, 100)
              )),
              this.wrapperResizeObserver.observe(this.wrapper),
              this.onWrapperResize()),
          (this.contentResizeObserver = new ResizeObserver(
            H(this.onContentResize, 100)
          )),
          this.contentResizeObserver.observe(this.content),
          this.onContentResize();
      }
      destroy() {
        var t, e;
        window.removeEventListener('resize', this.onWindowResize, !1),
          (t = this.wrapperResizeObserver) == null || t.disconnect(),
          (e = this.contentResizeObserver) == null || e.disconnect();
      }
      get limit() {
        return {
          x: this.scrollWidth - this.width,
          y: this.scrollHeight - this.height,
        };
      }
    },
    C = () => ({
      events: {},
      emit(o, ...t) {
        let e = this.events[o] || [];
        for (let i = 0, n = e.length; i < n; i++) e[i](...t);
      },
      on(o, t) {
        var e;
        return (
          ((e = this.events[o]) != null && e.push(t)) || (this.events[o] = [t]),
          () => {
            var i;
            this.events[o] =
              (i = this.events[o]) == null ? void 0 : i.filter((n) => t !== n);
          }
        );
      },
    }),
    W = class {
      constructor(
        t,
        {
          wheelMultiplier: e = 1,
          touchMultiplier: i = 2,
          normalizeWheel: n = !1,
        }
      ) {
        (this.onTouchStart = (s) => {
          let { clientX: r, clientY: l } = s.targetTouches
            ? s.targetTouches[0]
            : s;
          (this.touchStart.x = r),
            (this.touchStart.y = l),
            (this.lastDelta = { x: 0, y: 0 });
        }),
          (this.onTouchMove = (s) => {
            let { clientX: r, clientY: l } = s.targetTouches
                ? s.targetTouches[0]
                : s,
              h = -(r - this.touchStart.x) * this.touchMultiplier,
              c = -(l - this.touchStart.y) * this.touchMultiplier;
            (this.touchStart.x = r),
              (this.touchStart.y = l),
              (this.lastDelta = { x: h, y: c }),
              this.emitter.emit('scroll', {
                type: 'touch',
                deltaX: h,
                deltaY: c,
                event: s,
              });
          }),
          (this.onTouchEnd = (s) => {
            this.emitter.emit('scroll', {
              type: 'touch',
              inertia: !0,
              deltaX: this.lastDelta.x,
              deltaY: this.lastDelta.y,
              event: s,
            });
          }),
          (this.onWheel = (s) => {
            let { deltaX: r, deltaY: l } = s;
            this.normalizeWheel &&
              ((r = E(-100, r, 100)), (l = E(-100, l, 100))),
              (r *= this.wheelMultiplier),
              (l *= this.wheelMultiplier),
              this.emitter.emit('scroll', {
                type: 'wheel',
                deltaX: r,
                deltaY: l,
                event: s,
              });
          }),
          (this.element = t),
          (this.wheelMultiplier = e),
          (this.touchMultiplier = i),
          (this.normalizeWheel = n),
          (this.touchStart = { x: null, y: null }),
          (this.emitter = C()),
          this.element.addEventListener('wheel', this.onWheel, { passive: !1 }),
          this.element.addEventListener('touchstart', this.onTouchStart, {
            passive: !1,
          }),
          this.element.addEventListener('touchmove', this.onTouchMove, {
            passive: !1,
          }),
          this.element.addEventListener('touchend', this.onTouchEnd, {
            passive: !1,
          });
      }
      on(t, e) {
        return this.emitter.on(t, e);
      }
      destroy() {
        (this.emitter.events = {}),
          this.element.removeEventListener('wheel', this.onWheel, {
            passive: !1,
          }),
          this.element.removeEventListener('touchstart', this.onTouchStart, {
            passive: !1,
          }),
          this.element.removeEventListener('touchmove', this.onTouchMove, {
            passive: !1,
          }),
          this.element.removeEventListener('touchend', this.onTouchEnd, {
            passive: !1,
          });
      }
    },
    T = class {
      constructor({
        direction: t,
        gestureDirection: e,
        mouseMultiplier: i,
        smooth: n,
        wrapper: s = window,
        content: r = document.documentElement,
        wheelEventsTarget: l = s,
        smoothWheel: h = n == null || n,
        smoothTouch: c = !1,
        syncTouch: d = !1,
        syncTouchLerp: f = 0.1,
        touchInertiaMultiplier: a = 35,
        duration: u,
        easing: g = (p) => Math.min(1, 1.001 - Math.pow(2, -10 * p)),
        lerp: Y = u ? null : 0.1,
        infinite: X = !1,
        orientation: F = t != null ? t : 'vertical',
        gestureOrientation: j = e != null ? e : 'vertical',
        touchMultiplier: x = 1,
        wheelMultiplier: O = i != null ? i : 1,
        normalizeWheel: A = !1,
      } = {}) {
        (this.onVirtualScroll = ({
          type: p,
          inertia: I,
          deltaX: w,
          deltaY: m,
          event: S,
        }) => {
          if (S.ctrlKey) return;
          let y = p === 'touch',
            U = p === 'wheel';
          if (
            (this.options.gestureOrientation === 'vertical' && m === 0) ||
            (this.options.gestureOrientation === 'horizontal' && w === 0) ||
            (y &&
              this.options.gestureOrientation === 'vertical' &&
              this.scroll === 0 &&
              !this.options.infinite &&
              m <= 0) ||
            S.composedPath().find((z) =>
              z == null || z.hasAttribute == null
                ? void 0
                : z.hasAttribute('data-lenis-prevent')
            )
          )
            return;
          if (this.isStopped || this.isLocked) return void S.preventDefault();
          if (
            ((this.isSmooth =
              ((this.options.smoothTouch || this.options.syncTouch) && y) ||
              (this.options.smoothWheel && U)),
            !this.isSmooth)
          )
            return (this.isScrolling = !1), void this.animate.stop();
          S.preventDefault();
          let v = m;
          this.options.gestureOrientation === 'both'
            ? (v = Math.abs(m) > Math.abs(w) ? m : w)
            : this.options.gestureOrientation === 'horizontal' && (v = w);
          let P = y && this.options.syncTouch,
            _ = y && I && Math.abs(v) > 1;
          _ && (v = this.velocity * this.options.touchInertiaMultiplier),
            this.scrollTo(
              this.targetScroll + v,
              M(
                { programmatic: !1 },
                P && { lerp: _ ? this.syncTouchLerp : 0.4 }
              )
            );
        }),
          (this.onScroll = () => {
            if (!this.isScrolling) {
              let p = this.animatedScroll;
              (this.animatedScroll = this.targetScroll = this.actualScroll),
                (this.velocity = 0),
                (this.direction = Math.sign(this.animatedScroll - p)),
                this.emit();
            }
          }),
          t &&
            console.warn(
              'Lenis: `direction` option is deprecated, use `orientation` instead'
            ),
          e &&
            console.warn(
              'Lenis: `gestureDirection` option is deprecated, use `gestureOrientation` instead'
            ),
          i &&
            console.warn(
              'Lenis: `mouseMultiplier` option is deprecated, use `wheelMultiplier` instead'
            ),
          n &&
            console.warn(
              'Lenis: `smooth` option is deprecated, use `smoothWheel` instead'
            ),
          (window.lenisVersion = '1.0.11'),
          (s !== document.documentElement && s !== document.body) ||
            (s = window),
          (this.options = {
            wrapper: s,
            content: r,
            wheelEventsTarget: l,
            smoothWheel: h,
            smoothTouch: c,
            syncTouch: d,
            syncTouchLerp: f,
            touchInertiaMultiplier: a,
            duration: u,
            easing: g,
            lerp: Y,
            infinite: X,
            gestureOrientation: j,
            orientation: F,
            touchMultiplier: x,
            wheelMultiplier: O,
            normalizeWheel: A,
          }),
          (this.dimensions = new L(s, r)),
          this.rootElement.classList.add('lenis'),
          (this.velocity = 0),
          (this.isStopped = !1),
          (this.isSmooth = h || c),
          (this.isScrolling = !1),
          (this.targetScroll = this.animatedScroll = this.actualScroll),
          (this.animate = new b()),
          (this.emitter = C()),
          this.options.wrapper.addEventListener('scroll', this.onScroll, {
            passive: !1,
          }),
          (this.virtualScroll = new W(l, {
            touchMultiplier: x,
            wheelMultiplier: O,
            normalizeWheel: A,
          })),
          this.virtualScroll.on('scroll', this.onVirtualScroll);
      }
      destroy() {
        (this.emitter.events = {}),
          this.options.wrapper.removeEventListener('scroll', this.onScroll, {
            passive: !1,
          }),
          this.virtualScroll.destroy();
      }
      on(t, e) {
        return this.emitter.on(t, e);
      }
      off(t, e) {
        var i;
        this.emitter.events[t] =
          (i = this.emitter.events[t]) == null
            ? void 0
            : i.filter((n) => e !== n);
      }
      setScroll(t) {
        this.isHorizontal
          ? (this.rootElement.scrollLeft = t)
          : (this.rootElement.scrollTop = t);
      }
      emit() {
        this.emitter.emit('scroll', this);
      }
      reset() {
        (this.isLocked = !1),
          (this.isScrolling = !1),
          (this.velocity = 0),
          this.animate.stop();
      }
      start() {
        (this.isStopped = !1), this.reset();
      }
      stop() {
        (this.isStopped = !0), this.animate.stop(), this.reset();
      }
      raf(t) {
        let e = t - (this.time || t);
        (this.time = t), this.animate.advance(0.001 * e);
      }
      scrollTo(
        t,
        {
          offset: e = 0,
          immediate: i = !1,
          lock: n = !1,
          duration: s = this.options.duration,
          easing: r = this.options.easing,
          lerp: l = !s && this.options.lerp,
          onComplete: h = null,
          force: c = !1,
          programmatic: d = !0,
        } = {}
      ) {
        if (!this.isStopped || c) {
          if (['top', 'left', 'start'].includes(t)) t = 0;
          else if (['bottom', 'right', 'end'].includes(t)) t = this.limit;
          else {
            var f;
            let a;
            if (
              (typeof t == 'string'
                ? (a = document.querySelector(t))
                : (f = t) != null && f.nodeType && (a = t),
              a)
            ) {
              if (this.options.wrapper !== window) {
                let g = this.options.wrapper.getBoundingClientRect();
                e -= this.isHorizontal ? g.left : g.top;
              }
              let u = a.getBoundingClientRect();
              t = (this.isHorizontal ? u.left : u.top) + this.animatedScroll;
            }
          }
          if (typeof t == 'number') {
            if (
              ((t += e),
              (t = Math.round(t)),
              this.options.infinite
                ? d && (this.targetScroll = this.animatedScroll = this.scroll)
                : (t = E(0, t, this.limit)),
              i)
            )
              return (
                (this.animatedScroll = this.targetScroll = t),
                this.setScroll(this.scroll),
                this.reset(),
                this.emit(),
                void (h == null || h())
              );
            if (!d) {
              if (t === this.targetScroll) return;
              this.targetScroll = t;
            }
            this.animate.fromTo(this.animatedScroll, t, {
              duration: s,
              easing: r,
              lerp: l,
              onUpdate: (a, { completed: u }) => {
                n && (this.isLocked = !0),
                  (this.isScrolling = !0),
                  (this.velocity = a - this.animatedScroll),
                  (this.direction = Math.sign(this.velocity)),
                  (this.animatedScroll = a),
                  this.setScroll(this.scroll),
                  d && (this.targetScroll = a),
                  u &&
                    (n && (this.isLocked = !1),
                    requestAnimationFrame(() => {
                      this.isScrolling = !1;
                    }),
                    (this.velocity = 0),
                    h == null || h()),
                  this.emit();
              },
            });
          }
        }
      }
      get rootElement() {
        return this.options.wrapper === window
          ? this.options.content
          : this.options.wrapper;
      }
      get limit() {
        return this.isHorizontal
          ? this.dimensions.limit.x
          : this.dimensions.limit.y;
      }
      get isHorizontal() {
        return this.options.orientation === 'horizontal';
      }
      get actualScroll() {
        return this.isHorizontal
          ? this.rootElement.scrollLeft
          : this.rootElement.scrollTop;
      }
      get scroll() {
        return this.options.infinite
          ? (function (t, e) {
              let i = t % e;
              return ((e > 0 && i < 0) || (e < 0 && i > 0)) && (i += e), i;
            })(this.animatedScroll, this.limit)
          : this.animatedScroll;
      }
      get progress() {
        return this.limit === 0 ? 1 : this.scroll / this.limit;
      }
      get isSmooth() {
        return this.__isSmooth;
      }
      set isSmooth(t) {
        this.__isSmooth !== t &&
          (this.rootElement.classList.toggle('lenis-smooth', t),
          (this.__isSmooth = t));
      }
      get isScrolling() {
        return this.__isScrolling;
      }
      set isScrolling(t) {
        this.__isScrolling !== t &&
          (this.rootElement.classList.toggle('lenis-scrolling', t),
          (this.__isScrolling = t));
      }
      get isStopped() {
        return this.__isStopped;
      }
      set isStopped(t) {
        this.__isStopped !== t &&
          (this.rootElement.classList.toggle('lenis-stopped', t),
          (this.__isStopped = t));
      }
    };
  function k(o) {
    let t = document.createElement('style');
    (t.textContent = o), document.head.append(t);
  }
  function q(o = null) {
    return Webflow.env('editor') !== void 0
      ? (o !== null && o(), console.log('Webflow Editor View'), !0)
      : !1;
  }
  function V(o) {
    return /^(\s*[(]?[a-zA-Z0-9\s,]*[)]?\s*=>\s*{?\s*[\s\S]*}?)/.test(o);
  }
  function D(o, t = {}) {
    let e = document.querySelector(o);
    if (!e) return { ...t };
    let i = { ...e.dataset };
    for (let n in i) {
      let s = i[n];
      s === '' ||
        s === ' ' ||
        (isNaN(s)
          ? s === 'true' || s === 'false'
            ? s === 'true'
              ? (i[n] = !0)
              : (i[n] = !1)
            : V(s)
            ? (i[n] = new Function(`return ${s};`)())
            : (i[n] = s)
          : (i[n] = +s));
    }
    return { ...t, ...i };
  }
  var et = k(`
    .lenis.lenis-smooth {
      scroll-behavior: auto;  
    }
    html.lenis {
      height: auto;
    }
`),
    R = class extends T {
      constructor(t) {
        t.selector &&
          ((t.wrapper = document.querySelector(t.selector)),
          t.wrapper && (t.content = t.wrapper.children[0])),
          console.log(t),
          super(t),
          (this.params = t),
          (this.isActive = !0),
          this.init(),
          (this.call = { stop: () => this.stop(), start: () => this.start() });
      }
      init() {
        this.config(),
          this.render(),
          this.params.useRaf &&
            ((this.y = window.scrollY),
            (this.max = window.innerHeight),
            (this.speed = 0),
            (this.percent =
              this.y / (document.body.scrollHeight - window.innerHeight)),
            (this.direction = 0),
            this.on('scroll', (t) => this.outScroll(t))),
          q(this.destroy);
      }
      config() {
        this.params.useAnchor &&
          [...document.querySelectorAll('[data-scrolllink]')].forEach((t) => {
            if (t.dataset.scrolllink.trim() !== '') {
              // Check if the value is not empty
              let e = document.querySelector(t.dataset.scrolllink);
              e &&
                t.addEventListener(
                  'click',
                  (i) => {
                    i.preventDefault();
                    this.scrollTo(e);
                  },
                  { passive: !1 }
                );
            }
          }),
          this.params.useOverscroll &&
            [
              ...document.querySelectorAll('[data-scroll="overscroll"]'),
            ].forEach((t) =>
              t.setAttribute('onwheel', 'event.stopPropagation()')
            ),
          this.params.useControls &&
            ([...document.querySelectorAll('[data-scroll="stop"]')].forEach(
              (t) => {
                t.onclick = () => {
                  this.stop(), (this.isActive = !1);
                };
              }
            ),
            [...document.querySelectorAll('[data-scroll="start"]')].forEach(
              (t) => {
                t.onclick = () => {
                  this.start(), (this.isActive = !0);
                };
              }
            ),
            [...document.querySelectorAll('[data-scroll="toggle"]')].forEach(
              (t) => {
                t.onclick = () => {
                  this.isActive
                    ? (this.stop(), (this.isActive = !1))
                    : (this.start(), (this.isActive = !0));
                };
              }
            ));
      }
      render(t) {
        this.raf(t), window.requestAnimationFrame(this.render.bind(this));
      }
      outScroll({
        scroll: t,
        limit: e,
        velocity: i,
        progress: n,
        direction: s,
      }) {
        (this.y = t || 0),
          (this.max = e || window.innerHeight),
          (this.speed = i || 0),
          (this.percent = n || 0),
          (this.direction = 0),
          this.params.useRaf &&
            window.dispatchEvent(
              new CustomEvent('sscroll', {
                detail: {
                  y: this.y,
                  max: this.max,
                  speed: this.speed,
                  percent: this.percent,
                  direction: this.direction,
                },
              })
            );
      }
      renderWebflow(t) {}
    },
    B = D('[data-id-scroll]', {
      wrapper: window,
      duration: 1.5,
      easing: (o) => (o === 1 ? 1 : 1 - Math.pow(2, -10 * o)),
      orientation: 'vertical',
      smoothWheel: !0,
      smoothTouch: !1,
      touchMultiplier: 1.5,
      infinite: !1,
      useOverscroll: !0,
      useControls: !0,
      useAnchor: !0,
      useRaf: !0,
    });
  window.SScroll = new R(B);
})();
