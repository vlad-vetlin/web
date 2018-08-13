(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.bodymovin = factory();
    }
}(window, function () {
    function roundValues(t) {
        bm_rnd = t ? Math.round : function (t) {
            return t
        }
    }

    function roundTo2Decimals(t) {
        return Math.round(1e4 * t) / 1e4
    }

    function roundTo3Decimals(t) {
        return Math.round(100 * t) / 100
    }

    function styleDiv(t) {
        t.style.position = "absolute", t.style.top = 0, t.style.left = 0, t.style.display = "block", t.style.transformOrigin = t.style.webkitTransformOrigin = "0 0", t.style.backfaceVisibility = t.style.webkitBackfaceVisibility = "visible", t.style.transformStyle = t.style.webkitTransformStyle = t.style.mozTransformStyle = "preserve-3d"
    }

    function styleUnselectableDiv(t) {
        t.style.userSelect = "none", t.style.MozUserSelect = "none", t.style.webkitUserSelect = "none", t.style.oUserSelect = "none"
    }

    function BMEnterFrameEvent(t, e, s, r) {
        this.type = t, this.currentTime = e, this.totalTime = s, this.direction = 0 > r ? -1 : 1
    }

    function BMCompleteEvent(t, e) {
        this.type = t, this.direction = 0 > e ? -1 : 1
    }

    function BMCompleteLoopEvent(t, e, s, r) {
        this.type = t, this.currentLoop = e, this.totalLoops = s, this.direction = 0 > r ? -1 : 1
    }

    function BMSegmentStartEvent(t, e, s) {
        this.type = t, this.firstFrame = e, this.totalFrames = s
    }

    function BMDestroyEvent(t, e) {
        this.type = t, this.target = e
    }

    function _addEventListener(t, e) {
        this._cbs[t] || (this._cbs[t] = []), this._cbs[t].push(e)
    }

    function _removeEventListener(t, e) {
        if (e) {
            if (this._cbs[t]) {
                for (var s = 0, r = this._cbs[t].length; r > s;) this._cbs[t][s] === e && (this._cbs[t].splice(s, 1), s -= 1, r -= 1), s += 1;
                this._cbs[t].length || (this._cbs[t] = null)
            }
        } else this._cbs[t] = null
    }

    function _triggerEvent(t, e) {
        if (this._cbs[t]) for (var s = this._cbs[t].length, r = 0; s > r; r++) this._cbs[t][r](e)
    }

    function randomString(t, e) {
        void 0 === e && (e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
        var s, r = "";
        for (s = t; s > 0; --s) r += e[Math.round(Math.random() * (e.length - 1))];
        return r
    }

    function HSVtoRGB(t, e, s) {
        var r, i, a, n, o, h, l, p;
        switch (1 === arguments.length && (e = t.s, s = t.v, t = t.h), n = Math.floor(6 * t), o = 6 * t - n, h = s * (1 - e), l = s * (1 - o * e), p = s * (1 - (1 - o) * e), n % 6) {
            case 0:
                r = s, i = p, a = h;
                break;
            case 1:
                r = l, i = s, a = h;
                break;
            case 2:
                r = h, i = s, a = p;
                break;
            case 3:
                r = h, i = l, a = s;
                break;
            case 4:
                r = p, i = h, a = s;
                break;
            case 5:
                r = s, i = h, a = l
        }
        return [r, i, a]
    }

    function RGBtoHSV(t, e, s) {
        1 === arguments.length && (e = t.g, s = t.b, t = t.r);
        var r, i = Math.max(t, e, s), a = Math.min(t, e, s), n = i - a, o = 0 === i ? 0 : n / i, h = i / 255;
        switch (i) {
            case a:
                r = 0;
                break;
            case t:
                r = e - s + n * (s > e ? 6 : 0), r /= 6 * n;
                break;
            case e:
                r = s - t + 2 * n, r /= 6 * n;
                break;
            case s:
                r = t - e + 4 * n, r /= 6 * n
        }
        return [r, o, h]
    }

    function addSaturationToRGB(t, e) {
        var s = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
        return s[1] += e, s[1] > 1 ? s[1] = 1 : s[1] <= 0 && (s[1] = 0), HSVtoRGB(s[0], s[1], s[2])
    }

    function addBrightnessToRGB(t, e) {
        var s = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
        return s[2] += e, s[2] > 1 ? s[2] = 1 : s[2] < 0 && (s[2] = 0), HSVtoRGB(s[0], s[1], s[2])
    }

    function addHueToRGB(t, e) {
        var s = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
        return s[0] += e / 360, s[0] > 1 ? s[0] -= 1 : s[0] < 0 && (s[0] += 1), HSVtoRGB(s[0], s[1], s[2])
    }

    function componentToHex(t) {
        var e = t.toString(16);
        return 1 == e.length ? "0" + e : e
    }

    function fillToRgba(t, e) {
        if (!cachedColors[t]) {
            var s = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
            cachedColors[t] = parseInt(s[1], 16) + "," + parseInt(s[2], 16) + "," + parseInt(s[3], 16)
        }
        return "rgba(" + cachedColors[t] + "," + e + ")"
    }

    function RenderedFrame(t, e) {
        this.tr = t, this.o = e
    }

    function LetterProps(t, e, s, r, i, a) {
        this.o = t, this.sw = e, this.sc = s, this.fc = r, this.m = i, this.props = a
    }

    function iterateDynamicProperties(t) {
        var e, s = this.dynamicProperties;
        for (e = 0; s > e; e += 1) this.dynamicProperties[e].getValue(t)
    }

    function reversePath(t, e) {
        var s, r, i = [], a = [], n = [], o = {}, h = 0;
        e && (i[0] = t.o[0], a[0] = t.i[0], n[0] = t.v[0], h = 1), r = t.i.length;
        var l = r - 1;
        for (s = h; r > s; s += 1) i.push(t.o[l]), a.push(t.i[l]), n.push(t.v[l]), l -= 1;
        return o.i = i, o.o = a, o.v = n, o
    }

    function Matrix() {
    }

    function matrixManagerFunction() {
        var t = new Matrix, e = function (e, s, r, i, a) {
            return t.reset().translate(i, a).rotate(e).scale(s, r).toCSS()
        }, s = function (t) {
            return e(t.tr.r[2], t.tr.s[0], t.tr.s[1], t.tr.p[0], t.tr.p[1])
        };
        return {getMatrix: s}
    }

    function createElement(t, e, s) {
        if (!e) {
            var r = Object.create(t.prototype, s), i = {};
            return r && "[object Function]" === i.toString.call(r.init) && r.init(), r
        }
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.prototype._parent = t.prototype
    }

    function extendPrototype(t, e) {
        for (var s in t.prototype) t.prototype.hasOwnProperty(s) && (e.prototype[s] = t.prototype[s])
    }

    function bezFunction() {
        function t(t, e, s, r, i, a) {
            var n = t * r + e * i + s * a - i * r - a * t - s * e;
            return n > -1e-4 && 1e-4 > n
        }

        function e(e, s, r, i, a, n, o, h, l) {
            return t(e, s, i, a, o, h) && t(e, r, i, n, o, l)
        }

        function s(t) {
            this.segmentLength = 0, this.points = new Array(t)
        }

        function r(t, e) {
            this.partialLength = t, this.point = e
        }

        function i(t, e) {
            var s = e.segments, r = s.length, i = bm_floor((r - 1) * t), a = t * e.addedLength, n = 0;
            if (a == s[i].l) return s[i].p;
            for (var o = s[i].l > a ? -1 : 1, h = !0; h;) s[i].l <= a && s[i + 1].l > a ? (n = (a - s[i].l) / (s[i + 1].l - s[i].l), h = !1) : i += o, (0 > i || i >= r - 1) && (h = !1);
            return s[i].p + (s[i + 1].p - s[i].p) * n
        }

        function a() {
            this.pt1 = new Array(2), this.pt2 = new Array(2), this.pt3 = new Array(2), this.pt4 = new Array(2)
        }

        function n(t, e, s, r, n, o, h) {
            var l = new a;
            n = 0 > n ? 0 : n > 1 ? 1 : n;
            var p = i(n, h);
            o = o > 1 ? 1 : o;
            var m, f = i(o, h), d = t.length, c = 1 - p, u = 1 - f;
            for (m = 0; d > m; m += 1) l.pt1[m] = Math.round(1e3 * (c * c * c * t[m] + (p * c * c + c * p * c + c * c * p) * s[m] + (p * p * c + c * p * p + p * c * p) * r[m] + p * p * p * e[m])) / 1e3, l.pt3[m] = Math.round(1e3 * (c * c * u * t[m] + (p * c * u + c * p * u + c * c * f) * s[m] + (p * p * u + c * p * f + p * c * f) * r[m] + p * p * f * e[m])) / 1e3, l.pt4[m] = Math.round(1e3 * (c * u * u * t[m] + (p * u * u + c * f * u + c * u * f) * s[m] + (p * f * u + c * f * f + p * u * f) * r[m] + p * f * f * e[m])) / 1e3, l.pt2[m] = Math.round(1e3 * (u * u * u * t[m] + (f * u * u + u * f * u + u * u * f) * s[m] + (f * f * u + u * f * f + f * u * f) * r[m] + f * f * f * e[m])) / 1e3;
            return l
        }

        var o = (Math, function () {
            function t(t, e) {
                this.l = t, this.p = e
            }

            var e = {};
            return function (s, r, i, a) {
                var n = (s.join("_") + "_" + r.join("_") + "_" + i.join("_") + "_" + a.join("_")).replace(/\./g, "p");
                if (e[n]) return e[n];
                var o, h, l, p, m, f, d = defaultCurveSegments, c = 0, u = [], y = [],
                    g = {addedLength: 0, segments: []};
                for (l = i.length, o = 0; d > o; o += 1) {
                    for (m = o / (d - 1), f = 0, h = 0; l > h; h += 1) p = bm_pow(1 - m, 3) * s[h] + 3 * bm_pow(1 - m, 2) * m * i[h] + 3 * (1 - m) * bm_pow(m, 2) * a[h] + bm_pow(m, 3) * r[h], u[h] = p, null !== y[h] && (f += bm_pow(u[h] - y[h], 2)), y[h] = u[h];
                    f && (f = bm_sqrt(f), c += f), g.segments.push(new t(c, m))
                }
                return g.addedLength = c, e[n] = g, g
            }
        }()), h = function () {
            var e = {};
            return function (i) {
                var a = i.s, n = i.e, o = i.to, h = i.ti,
                    l = (a.join("_") + "_" + n.join("_") + "_" + o.join("_") + "_" + h.join("_")).replace(/\./g, "p");
                if (e[l]) return void(i.bezierData = e[l]);
                var p, m, f, d, c, u, y, g = defaultCurveSegments, v = 0, b = null;
                2 === a.length && (a[0] != n[0] || a[1] != n[1]) && t(a[0], a[1], n[0], n[1], a[0] + o[0], a[1] + o[1]) && t(a[0], a[1], n[0], n[1], n[0] + h[0], n[1] + h[1]) && (g = 2);
                var P = new s(g);
                for (f = o.length, p = 0; g > p; p += 1) {
                    for (y = new Array(f), c = p / (g - 1), u = 0, m = 0; f > m; m += 1) d = bm_pow(1 - c, 3) * a[m] + 3 * bm_pow(1 - c, 2) * c * (a[m] + o[m]) + 3 * (1 - c) * bm_pow(c, 2) * (n[m] + h[m]) + bm_pow(c, 3) * n[m], y[m] = d, null !== b && (u += bm_pow(y[m] - b[m], 2));
                    u = bm_sqrt(u), v += u, P.points[p] = new r(u, y), b = y
                }
                P.segmentLength = v, i.bezierData = P, e[l] = P
            }
        }();
        return {getBezierLength: o, getNewSegment: n, buildBezierData: h, pointOnLine2D: t, pointOnLine3D: e}
    }

    function dataFunctionManager() {
        function t(i, a, o) {
            var h, l, p, m, f, d, c, u, y = i.length;
            for (m = 0; y > m; m += 1) if (h = i[m], "ks" in h && !h.completed) {
                if (h.completed = !0, h.tt && (i[m - 1].td = h.tt), l = [], p = -1, h.hasMask) {
                    var g = h.masksProperties;
                    for (d = g.length, f = 0; d > f; f += 1) if (g[f].pt.k.i) r(g[f].pt.k); else for (u = g[f].pt.k.length, c = 0; u > c; c += 1) g[f].pt.k[c].s && r(g[f].pt.k[c].s[0]), g[f].pt.k[c].e && r(g[f].pt.k[c].e[0])
                }
                0 === h.ty ? (h.layers = e(h.refId, a), t(h.layers, a, o)) : 4 === h.ty ? s(h.shapes) : 5 == h.ty && n(h, o)
            }
        }

        function e(t, e) {
            for (var s = 0, r = e.length; r > s;) {
                if (e[s].id === t) return JSON.parse(JSON.stringify(e[s].layers));
                s += 1
            }
        }

        function s(t) {
            var e, i, a, n = t.length;
            for (e = n - 1; e >= 0; e -= 1) if ("sh" == t[e].ty) if (t[e].ks.k.i) r(t[e].ks.k); else for (a = t[e].ks.k.length, i = 0; a > i; i += 1) t[e].ks.k[i].s && r(t[e].ks.k[i].s[0]), t[e].ks.k[i].e && r(t[e].ks.k[i].e[0]); else "gr" == t[e].ty && s(t[e].it)
        }

        function r(t) {
            var e, s = t.i.length;
            for (e = 0; s > e; e += 1) t.i[e][0] += t.v[e][0], t.i[e][1] += t.v[e][1], t.o[e][0] += t.v[e][0], t.o[e][1] += t.v[e][1]
        }

        function i(t, e) {
            var s = e ? e.split(".") : [100, 100, 100];
            return t[0] > s[0] ? !0 : s[0] > t[0] ? !1 : t[1] > s[1] ? !0 : s[1] > t[1] ? !1 : t[2] > s[2] ? !0 : s[2] > t[2] ? !1 : void 0
        }

        function a(e, s) {
            o(e), t(e.layers, e.assets, s)
        }

        function n(t, e) {
            var s, r, i, a, n, o, h, l = [], p = t.t.d, m = 0, f = t.t.m.g, d = 0, c = 0, u = 0, y = [], g = 0, v = 0,
                b = e.getFontByName(p.f), P = 0, E = b.fStyle.split(" "), k = "normal", S = "normal";
            for (r = E.length, s = 0; r > s; s += 1) "italic" === E[s].toLowerCase() ? S = "italic" : "bold" === E[s].toLowerCase() ? k = "700" : "black" === E[s].toLowerCase() ? k = "900" : "medium" === E[s].toLowerCase() ? k = "500" : "regular" === E[s].toLowerCase() || "normal" === E[s].toLowerCase() ? k = "400" : ("light" === E[s].toLowerCase() || "thin" === E[s].toLowerCase()) && (k = "200");
            if (p.fWeight = k, p.fStyle = S, r = p.t.length, p.sz) {
                var x = p.sz[0], C = -1;
                for (s = 0; r > s; s += 1) i = !1, " " === p.t.charAt(s) ? C = s : 13 === p.t.charCodeAt(s) && (g = 0, i = !0), e.chars ? (h = e.getCharData(p.t.charAt(s), b.fStyle, b.fFamily), P = i ? 0 : h.w * p.s / 100) : P = e.measureText(p.t.charAt(s), p.f, p.s), g + P > x ? (-1 === C ? (p.t = p.t.substr(0, s) + "\r" + p.t.substr(s), r += 1) : (s = C, p.t = p.t.substr(0, s) + "\r" + p.t.substr(s + 1)), C = -1, g = 0) : g += P;
                r = p.t.length
            }
            for (g = 0, P = 0, s = 0; r > s; s += 1) if (i = !1, " " === p.t.charAt(s) ? a = " " : 13 === p.t.charCodeAt(s) ? (y.push(g), v = g > v ? g : v, g = 0, a = "", i = !0, u += 1) : a = p.t.charAt(s), e.chars ? (h = e.getCharData(p.t.charAt(s), b.fStyle, e.getFontByName(p.f).fFamily), P = i ? 0 : h.w * p.s / 100) : P = e.measureText(a, p.f, p.s), g += P, l.push({
                l: P,
                an: P,
                add: d,
                n: i,
                anIndexes: [],
                val: a,
                line: u
            }), 2 == f) {
                if (d += P, "" == a || " " == a || s == r - 1) {
                    for (("" == a || " " == a) && (d -= P); s >= c;) l[c].an = d, l[c].ind = m, l[c].extra = P, c += 1;
                    m += 1, d = 0
                }
            } else if (3 == f) {
                if (d += P, "" == a || s == r - 1) {
                    for ("" == a && (d -= P); s >= c;) l[c].an = d, l[c].ind = m, l[c].extra = P, c += 1;
                    d = 0, m += 1
                }
            } else l[m].ind = m, l[m].extra = 0, m += 1;
            if (p.l = l, v = g > v ? g : v, y.push(g), p.sz) p.boxWidth = p.sz[0], t.t.d.justifyOffset = 0; else switch (p.boxWidth = v, p.j) {
                case 1:
                    t.t.d.justifyOffset = -p.boxWidth;
                    break;
                case 2:
                    t.t.d.justifyOffset = -p.boxWidth / 2;
                    break;
                default:
                    t.t.d.justifyOffset = 0
            }
            p.lineWidths = y;
            var M = t.t.a;
            o = M.length;
            var D, w, T = [];
            for (n = 0; o > n; n += 1) {
                for (M[n].a.sc && (p.strokeColorAnim = !0), M[n].a.sw && (p.strokeWidthAnim = !0), (M[n].a.fc || M[n].a.fh || M[n].a.fs || M[n].a.fb) && (p.fillColorAnim = !0), w = 0, D = M[n].s.b, s = 0; r > s; s += 1) l[s].anIndexes[n] = w, (1 == D && "" != l[s].val || 2 == D && "" != l[s].val && " " != l[s].val || 3 == D && (l[s].n || " " == l[s].val || s == r - 1) || 4 == D && (l[s].n || s == r - 1)) && (1 === M[n].s.rn && T.push(w), w += 1);
                t.t.a[n].s.totalChars = w;
                var F, I = -1;
                if (1 === M[n].s.rn) for (s = 0; r > s; s += 1) I != l[s].anIndexes[n] && (I = l[s].anIndexes[n], F = T.splice(Math.floor(Math.random() * T.length), 1)[0]), l[s].anIndexes[n] = F
            }
            0 !== o || "m" in t.t.p || (t.singleShape = !0), p.yOffset = 1.2 * p.s, p.ascent = b.ascent * p.s / 100
        }

        var o = function () {
            function t(e) {
                var s, r, i, a = e.length;
                for (s = 0; a > s; s += 1) if ("gr" === e[s].ty) t(e[s].it); else if ("fl" === e[s].ty || "st" === e[s].ty) if (e[s].c.k && e[s].c.k[0].i) for (i = e[s].c.k.length, r = 0; i > r; r += 1) e[s].c.k[r].s && (e[s].c.k[r].s[0] /= 255, e[s].c.k[r].s[1] /= 255, e[s].c.k[r].s[2] /= 255, e[s].c.k[r].s[3] /= 255), e[s].c.k[r].e && (e[s].c.k[r].e[0] /= 255, e[s].c.k[r].e[1] /= 255, e[s].c.k[r].e[2] /= 255, e[s].c.k[r].e[3] /= 255); else e[s].c.k[0] /= 255, e[s].c.k[1] /= 255, e[s].c.k[2] /= 255, e[s].c.k[3] /= 255
            }

            function e(e) {
                var s, r = e.length;
                for (s = 0; r > s; s += 1) 4 === e[s].ty && t(e[s].shapes)
            }

            var s = [4, 1, 9];
            return function (t) {
                if (i(s, t.v) && (e(t.layers), t.assets)) {
                    var r, a = t.assets.length;
                    for (r = 0; a > r; r += 1) t.assets[r].layers && e(t.assets[r].layers)
                }
            }
        }(), h = {};
        return h.completeData = a, h
    }

    function ShapeModifier() {
    }

    function TrimModifier() {
    }

    function RoundCornersModifier() {
    }

    function SVGRenderer(t, e) {
        this.animationItem = t, this.layers = null, this.renderedFrame = -1, this.globalData = {frameNum: -1}, this.renderConfig = {preserveAspectRatio: e && e.preserveAspectRatio || "xMidYMid meet"}, this.elements = [], this.destroyed = !1
    }

    function CanvasRenderer(t, e) {
        this.animationItem = t, this.renderConfig = {
            clearCanvas: e && e.clearCanvas || !0,
            context: e && e.context || null,
            scaleMode: e && e.scaleMode || "fit"
        }, this.renderConfig.dpr = e && e.dpr || 1, this.animationItem.wrapper && (this.renderConfig.dpr = e && e.dpr || window.devicePixelRatio || 1), this.renderedFrame = -1, this.globalData = {frameNum: -1}, this.contextData = {
            saved: Array.apply(null, {length: 15}),
            savedOp: Array.apply(null, {length: 15}),
            cArrPos: 0,
            cTr: new Matrix,
            cO: 1
        };
        var s, r = 15;
        for (s = 0; r > s; s += 1) this.contextData.saved[s] = Array.apply(null, {length: 16});
        this.elements = [], this.transformMat = new Matrix
    }

    function HybridRenderer(t) {
        this.animationItem = t, this.layers = null, this.renderedFrame = -1, this.globalData = {frameNum: -1}, this.elements = [], this.threeDElements = [], this.destroyed = !1, this.camera = null
    }

    function MaskElement(t, e, s) {
        this.dynamicProperties = [], this.data = t, this.element = e, this.globalData = s, this.paths = [], this.storedData = [], this.masksProperties = this.data.masksProperties, this.viewData = new Array(this.masksProperties.length), this.maskElement = null, this.firstFrame = !0;
        var r, i, a, n, o, h, l, p, m = (this.element.maskedElement, this.globalData.defs),
            f = this.masksProperties.length, d = this.masksProperties, c = 0, u = [], y = randomString(10),
            g = "clipPath", v = "clip-path";
        for (r = 0; f > r; r++) if (("a" !== d[r].mode && "n" !== d[r].mode || d[r].inv) && (g = "mask", v = "mask"), "s" != d[r].mode && "i" != d[r].mode || 0 != c || (o = document.createElementNS(svgNS, "rect"), o.setAttribute("fill", "#ffffff"), o.setAttribute("x", "0"), o.setAttribute("y", "0"), o.setAttribute("width", "100%"), o.setAttribute("height", "100%"), u.push(o)), "n" != d[r].mode && d[r].cl !== !1) {
            if (c += 1, i = document.createElementNS(svgNS, "path"), d[r].cl ? "s" == d[r].mode ? i.setAttribute("fill", "#2D1E44") : i.setAttribute("fill", "#2D1E44") : (i.setAttribute("fill", "none"), "s" == d[r].mode ? i.setAttribute("fill", "#000000") : i.setAttribute("fill", "#2D1E44"), i.setAttribute("stroke-width", "1"), i.setAttribute("stroke-miterlimit", "10")), i.setAttribute("clip-rule", "nonzero"), 0 !== d[r].x.k) {
                g = "mask", v = "mask", p = PropertyFactory.getProp(this.element, d[r].x, 0, null, this.dynamicProperties);
                var b = "fi_" + randomString(10);
                h = document.createElementNS(svgNS, "filter"), h.setAttribute("id", b), l = document.createElementNS(svgNS, "feMorphology"), l.setAttribute("operator", "dilate"), l.setAttribute("in", "SourceGraphic"), l.setAttribute("radius", "0"), h.appendChild(l), m.appendChild(h), "s" == d[r].mode ? i.setAttribute("stroke", "#000000") : i.setAttribute("stroke", "#ffffff")
            } else l = null, p = null;
            if (this.storedData[r] = {
                elem: i,
                x: p,
                expan: l,
                lastPath: "",
                lastOperator: "",
                filterId: b,
                lastRadius: 0
            }, "i" == d[r].mode) {
                n = u.length;
                var P = document.createElementNS(svgNS, "g");
                for (a = 0; n > a; a += 1) P.appendChild(u[a]);
                var E = document.createElementNS(svgNS, "mask");
                E.setAttribute("mask-type", "alpha"), E.setAttribute("id", y + "_" + c), E.appendChild(i), m.appendChild(E), P.setAttribute("mask", "url(#" + y + "_" + c + ")"), u.length = 0, u.push(P)
            } else u.push(i);
            d[r].inv && !this.solidPath && (this.solidPath = this.createLayerSolidPath()), this.viewData[r] = {
                elem: i,
                lastPath: "",
                prop: ShapePropertyFactory.getShapeProp(this.element, d[r], 3, this.dynamicProperties, null)
            }, this.viewData[r].prop.k || this.drawPath(d[r], this.viewData[r].prop.v, this.viewData[r])
        } else this.viewData[r] = {prop: ShapePropertyFactory.getShapeProp(this.element, d[r], 3, this.dynamicProperties, null)};
        for (this.maskElement = document.createElementNS(svgNS, g), f = u.length, r = 0; f > r; r += 1) this.maskElement.appendChild(u[r]);
        this.maskElement.setAttribute("id", y), c > 0 && this.element.maskedElement.setAttribute(v, "url(#" + y + ")"), m.appendChild(this.maskElement)
    }

    function BaseElement() {
    }

    function SVGBaseElement(t, e, s, r, i) {
        this.globalData = s, this.comp = r, this.data = t, this.matteElement = null, this.parentContainer = e, this.layerId = i ? i.layerId : "ly_" + randomString(10), this.placeholder = i, this.init()
    }

    function ITextElement(t, e, s, r) {
    }

    function SVGTextElement(t, e, s, r, i) {
        this.textSpans = [], this.renderType = "svg", this._parent.constructor.call(this, t, e, s, r, i)
    }

    function ICompElement(t, e, s, r, i) {
        this._parent.constructor.call(this, t, e, s, r, i), this.layers = t.layers, this.isSvg = !0, this.data.tm && (this.tm = PropertyFactory.getProp(this, this.data.tm, 0, s.frameRate, this.dynamicProperties))
    }

    function IImageElement(t, e, s, r, i) {
        this.assetData = s.getAssetData(t.refId), this.path = s.getPath(), this._parent.constructor.call(this, t, e, s, r, i)
    }

    function IShapeElement(t, e, s, r, i) {
        this.shapes = [], this.shapesData = t.shapes, this.stylesList = [], this.viewData = [], this.shapeModifiers = [], this.shapesContainer = document.createElementNS(svgNS, "g"), this._parent.constructor.call(this, t, e, s, r, i)
    }

    function ISolidElement(t, e, s, r, i) {
        this._parent.constructor.call(this, t, e, s, r, i)
    }

    function CVBaseElement(t, e, s) {
        this.globalData = s, this.data = t, this.comp = e, this.canvasContext = s.canvasContext, this.init()
    }

    function CVCompElement(t, e, s) {
        this._parent.constructor.call(this, t, e, s);
        var r = {};
        for (var i in s) s.hasOwnProperty(i) && (r[i] = s[i]);
        r.renderer = this, r.compHeight = this.data.h, r.compWidth = this.data.w, this.renderConfig = {clearCanvas: !0}, this.contextData = {
            saved: Array.apply(null, {length: 15}),
            savedOp: Array.apply(null, {length: 15}),
            cArrPos: 0,
            cTr: new Matrix,
            cO: 1
        };
        var a, n = 15;
        for (a = 0; n > a; a += 1) this.contextData.saved[a] = Array.apply(null, {length: 16});
        this.transformMat = new Matrix, this.parentGlobalData = this.globalData;
        var o = document.createElement("canvas");
        r.canvasContext = o.getContext("2d"), this.canvasContext = r.canvasContext, o.width = this.data.w, o.height = this.data.h, this.canvas = o, this.globalData = r, this.layers = t.layers, this.data.tm && (this.tm = PropertyFactory.getProp(this, this.data.tm, 0, s.frameRate, this.dynamicProperties))
    }

    function CVImageElement(t, e, s) {
        this.animationItem = s.renderer.animationItem, this.assetData = this.animationItem.getAssetData(t.refId), this.path = this.animationItem.getPath(), this._parent.constructor.call(this, t, e, s), this.animationItem.pendingElements += 1
    }

    function CVMaskElement(t, e) {
        this.data = t, this.element = e, this.dynamicProperties = [], this.masksProperties = this.data.masksProperties, this.viewData = new Array(this.masksProperties.length);
        var s, r = this.masksProperties.length;
        for (s = 0; r > s; s++) this.viewData[s] = ShapePropertyFactory.getShapeProp(this.element, this.masksProperties[s], 3, this.dynamicProperties, null)
    }

    function CVShapeElement(t, e, s) {
        this.shapes = [], this.stylesList = [], this.viewData = [], this.shapeModifiers = [], this.shapesData = t.shapes, this.firstFrame = !0, this._parent.constructor.call(this, t, e, s)
    }

    function CVSolidElement(t, e, s) {
        this._parent.constructor.call(this, t, e, s)
    }

    function CVTextElement(t, e, s) {
        this.textSpans = [], this.yOffset = 0, this.fillColorAnim = !1, this.strokeColorAnim = !1, this.strokeWidthAnim = !1, this.stroke = !1, this.fill = !1, this.justifyOffset = 0, this.currentRender = null, this.renderType = "canvas", this.values = {
            fill: "rgba(0,0,0,0)",
            stroke: "rgba(0,0,0,0)",
            sWidth: 0,
            fValue: ""
        }, this._parent.constructor.call(this, t, e, s)
    }

    function HBaseElement(t, e, s, r, i) {
        this.globalData = s, this.comp = r, this.data = t, this.matteElement = null, this.parentContainer = e, this.layerId = i ? i.layerId : "ly_" + randomString(10), this.placeholder = i, this.init()
    }

    function HSolidElement(t, e, s, r, i) {
        this._parent.constructor.call(this, t, e, s, r, i)
    }

    function HCompElement(t, e, s, r, i) {
        this._parent.constructor.call(this, t, e, s, r, i), this.layers = t.layers, this.isSvg = !1, this.data.tm && (this.tm = PropertyFactory.getProp(this, this.data.tm, 0, s.frameRate, this.dynamicProperties)), this.data.hasMask && (this.isSvg = !0)
    }

    function HShapeElement(t, e, s, r, i) {
        this.shapes = [], this.shapeModifiers = [], this.shapesData = t.shapes, this.stylesList = [], this.viewData = [], this._parent.constructor.call(this, t, e, s, r, i)
    }

    function HTextElement(t, e, s, r, i) {
        this.textSpans = [], this.textPaths = [], this.currentBBox = {
            x: 999999,
            y: -999999,
            h: 0,
            w: 0
        }, this.renderType = "svg", this.isMasked = !1, this._parent.constructor.call(this, t, e, s, r, i)
    }

    function HImageElement(t, e, s, r, i) {
        this.assetData = s.getAssetData(t.refId), this.path = s.getPath(), this._parent.constructor.call(this, t, e, s, r, i)
    }

    function HCameraElement(t, e, s, r, i) {
        if (this._parent.constructor.call(this, t, e, s, r, i), this.pe = PropertyFactory.getProp(this, t.pe, 0, 0, this.dynamicProperties), t.ks.p.s ? (this.px = PropertyFactory.getProp(this, t.ks.p.x, 1, 0, this.dynamicProperties), this.py = PropertyFactory.getProp(this, t.ks.p.y, 1, 0, this.dynamicProperties), this.pz = PropertyFactory.getProp(this, t.ks.p.z, 1, 0, this.dynamicProperties)) : this.p = PropertyFactory.getProp(this, t.ks.p, 1, 0, this.dynamicProperties), t.ks.a && (this.a = PropertyFactory.getProp(this, t.ks.a, 1, 0, this.dynamicProperties)), t.ks.or.k.length) {
            var a, n = t.ks.or.k.length;
            for (a = 0; n > a; a += 1) t.ks.or.k[a].to = null, t.ks.or.k[a].ti = null
        }
        this.or = PropertyFactory.getProp(this, t.ks.or, 1, degToRads, this.dynamicProperties), this.or.sh = !0, this.rx = PropertyFactory.getProp(this, t.ks.rx, 0, degToRads, this.dynamicProperties), this.ry = PropertyFactory.getProp(this, t.ks.ry, 0, degToRads, this.dynamicProperties), this.rz = PropertyFactory.getProp(this, t.ks.rz, 0, degToRads, this.dynamicProperties), this.mat = new Matrix
    }

    function SliderEffect(t, e, s) {
        this.p = PropertyFactory.getProp(e, t.v, 0, 0, s)
    }

    function AngleEffect(t, e, s) {
        this.p = PropertyFactory.getProp(e, t.v, 0, 0, s)
    }

    function ColorEffect(t, e, s) {
        this.p = PropertyFactory.getProp(e, t.v, 1, 0, s)
    }

    function PointEffect(t, e, s) {
        this.p = PropertyFactory.getProp(e, t.v, 1, 0, s)
    }

    function CheckboxEffect(t, e, s) {
        this.p = PropertyFactory.getProp(e, t.v, 1, 0, s)
    }

    function NoValueEffect(t, e, s) {
        this.p = {}
    }

    function groupEffectFunction(t) {
    }

    function GroupEffect() {
        var t = groupEffectFunction;
        return t
    }

    function EffectsManager(t, e, s) {
        var r, i, a = t.ef, n = [], o = a.length;
        for (r = 0; o > r; r++) switch (a[r].ty) {
            case 0:
                i = new SliderEffect(a[r], e, s), n.push(i.proxyFunction.bind(i));
                break;
            case 1:
                i = new AngleEffect(a[r], e, s), n.push(i.proxyFunction.bind(i));
                break;
            case 2:
                i = new ColorEffect(a[r], e, s), n.push(i.proxyFunction.bind(i));
                break;
            case 3:
                i = new PointEffect(a[r], e, s), n.push(i.proxyFunction.bind(i));
                break;
            case 4:
            case 7:
                i = new CheckboxEffect(a[r], e, s), n.push(i.proxyFunction.bind(i));
                break;
            case 5:
                i = new EffectsManager(a[r], e, s), n.push(i);
                break;
            case 6:
                i = new NoValueEffect(a[r], e, s), n.push(i)
        }
        var h = function (e) {
            for (var s = t.ef, r = 0, i = s.length; i > r;) {
                if (e === s[r].nm || e === s[r].ix) return 5 === s[r].ty ? n[r] : n[r]();
                r += 1
            }
        };
        return h
    }

    var svgNS = "http://www.w3.org/2000/svg", subframeEnabled = !0, expressionsPlugin,
        isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent), cachedColors = {},
        bm_rounder = Math.round, bm_rnd, bm_pow = Math.pow, bm_sqrt = Math.sqrt, bm_abs = Math.abs,
        bm_floor = Math.floor, bm_max = Math.max, bm_min = Math.min, BMMath = {pow: bm_pow, random: Math.random},
        defaultCurveSegments = 75, degToRads = Math.PI / 180, roundCorner = .5519;
    roundValues(!1);
    var rgbToHex = function () {
        var t, e, s = [];
        for (t = 0; 256 > t; t += 1) e = t.toString(16), s[t] = 1 == e.length ? "0" + e : e;
        return function (t, e, r) {
            return 0 > t && (t = 0), 0 > e && (e = 0), 0 > r && (r = 0), "#" + s[t] + s[e] + s[r]
        }
    }(), fillColorToString = function () {
        var t = [];
        return function (e, s) {
            return void 0 !== s && (e[3] = s), t[e[0]] || (t[e[0]] = {}), t[e[0]][e[1]] || (t[e[0]][e[1]] = {}), t[e[0]][e[1]][e[2]] || (t[e[0]][e[1]][e[2]] = {}), t[e[0]][e[1]][e[2]][e[3]] || (t[e[0]][e[1]][e[2]][e[3]] = "rgba(" + e.join(",") + ")"), t[e[0]][e[1]][e[2]][e[3]]
        }
    }(), Matrix = function () {
        function t() {
            return this.props[0] = 1, this.props[1] = 0, this.props[2] = 0, this.props[3] = 0, this.props[4] = 0, this.props[5] = 1, this.props[6] = 0, this.props[7] = 0, this.props[8] = 0, this.props[9] = 0, this.props[10] = 1, this.props[11] = 0, this.props[12] = 0, this.props[13] = 0, this.props[14] = 0, this.props[15] = 1, this
        }

        function e(t) {
            if (0 === t) return this;
            var e = Math.cos(t), s = Math.sin(t);
            return this._t(e, -s, 0, 0, s, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
        }

        function s(t) {
            if (0 === t) return this;
            var e = Math.cos(t), s = Math.sin(t);
            return this._t(1, 0, 0, 0, 0, e, -s, 0, 0, s, e, 0, 0, 0, 0, 1)
        }

        function r(t) {
            if (0 === t) return this;
            var e = Math.cos(t), s = Math.sin(t);
            return this._t(e, 0, s, 0, 0, 1, 0, 0, -s, 0, e, 0, 0, 0, 0, 1)
        }

        function i(t) {
            if (0 === t) return this;
            var e = Math.cos(t), s = Math.sin(t);
            return this._t(e, -s, 0, 0, s, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
        }

        function a(t, e) {
            return this._t(1, e, t, 1, 0, 0)
        }

        function n(t, e) {
            return this.shear(Math.tan(t), Math.tan(e))
        }

        function o(t, e) {
            var s = Math.cos(e), r = Math.sin(e);
            return this._t(s, r, 0, 0, -r, s, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, Math.tan(t), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(s, -r, 0, 0, r, s, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
        }

        function h(t, e, s) {
            return s = isNaN(s) ? 1 : s, 1 == t && 1 == e && 1 == s ? this : this._t(t, 0, 0, 0, 0, e, 0, 0, 0, 0, s, 0, 0, 0, 0, 1)
        }

        function l(t, e, s, r, i, a, n, o, h, l, p, m, f, d, c, u) {
            return this.props[0] = t, this.props[1] = e, this.props[2] = s, this.props[3] = r, this.props[4] = i, this.props[5] = a, this.props[6] = n, this.props[7] = o, this.props[8] = h, this.props[9] = l, this.props[10] = p, this.props[11] = m, this.props[12] = f, this.props[13] = d, this.props[14] = c, this.props[15] = u, this
        }

        function p(t, e, s) {
            return s = isNaN(s) ? 0 : s, 0 !== t || 0 !== e || 0 !== s ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, s, 1) : this
        }

        function m(t, e, s, r, i, a, n, o, h, l, p, m, f, d, c, u) {
            if (1 === t && 0 === e && 0 === s && 0 === r && 0 === i && 1 === a && 0 === n && 0 === o && 0 === h && 0 === l && 1 === p && 0 === m) return (0 !== f || 0 !== d || 0 !== c) && (this.props[12] = this.props[12] * t + this.props[13] * i + this.props[14] * h + this.props[15] * f, this.props[13] = this.props[12] * e + this.props[13] * a + this.props[14] * l + this.props[15] * d, this.props[14] = this.props[12] * s + this.props[13] * n + this.props[14] * p + this.props[15] * c, this.props[15] = this.props[12] * r + this.props[13] * o + this.props[14] * m + this.props[15] * u), this;
            var y = this.props[0], g = this.props[1], v = this.props[2], b = this.props[3], P = this.props[4],
                E = this.props[5], k = this.props[6], S = this.props[7], x = this.props[8], C = this.props[9],
                M = this.props[10], D = this.props[11], w = this.props[12], T = this.props[13], F = this.props[14],
                I = this.props[15];
            return this.props[0] = y * t + g * i + v * h + b * f, this.props[1] = y * e + g * a + v * l + b * d, this.props[2] = y * s + g * n + v * p + b * c, this.props[3] = y * r + g * o + v * m + b * u, this.props[4] = P * t + E * i + k * h + S * f, this.props[5] = P * e + E * a + k * l + S * d, this.props[6] = P * s + E * n + k * p + S * c, this.props[7] = P * r + E * o + k * m + S * u, this.props[8] = x * t + C * i + M * h + D * f, this.props[9] = x * e + C * a + M * l + D * d, this.props[10] = x * s + C * n + M * p + D * c, this.props[11] = x * r + C * o + M * m + D * u, this.props[12] = w * t + T * i + F * h + I * f, this.props[13] = w * e + T * a + F * l + I * d, this.props[14] = w * s + T * n + F * p + I * c, this.props[15] = w * r + T * o + F * m + I * u, this
        }

        function f(t) {
            var e;
            for (e = 0; 16 > e; e += 1) t.props[e] = this.props[e]
        }

        function d(t) {
            var e;
            for (e = 0; 16 > e; e += 1) this.props[e] = t[e]
        }

        function c(t, e, s) {
            return {
                x: t * this.props[0] + e * this.props[4] + s * this.props[8] + this.props[12],
                y: t * this.props[1] + e * this.props[5] + s * this.props[9] + this.props[13],
                z: t * this.props[2] + e * this.props[6] + s * this.props[10] + this.props[14]
            }
        }

        function u(t, e, s) {
            return t * this.props[0] + e * this.props[4] + s * this.props[8] + this.props[12]
        }

        function y(t, e, s) {
            return t * this.props[1] + e * this.props[5] + s * this.props[9] + this.props[13]
        }

        function g(t, e, s) {
            return t * this.props[2] + e * this.props[6] + s * this.props[10] + this.props[14]
        }

        function v(t, e, s) {
            return [t * this.props[0] + e * this.props[4] + s * this.props[8] + this.props[12], t * this.props[1] + e * this.props[5] + s * this.props[9] + this.props[13], t * this.props[2] + e * this.props[6] + s * this.props[10] + this.props[14]]
        }

        function b(t, e) {
            return bm_rnd(t * this.props[0] + e * this.props[4] + this.props[12]) + "," + bm_rnd(t * this.props[1] + e * this.props[5] + this.props[13])
        }

        function P() {
            return [this.props[0], this.props[1], this.props[2], this.props[3], this.props[4], this.props[5], this.props[6], this.props[7], this.props[8], this.props[9], this.props[10], this.props[11], this.props[12], this.props[13], this.props[14], this.props[15]]
        }

        function E() {
            return isSafari ? "matrix3d(" + roundTo2Decimals(this.props[0]) + "," + roundTo2Decimals(this.props[1]) + "," + roundTo2Decimals(this.props[2]) + "," + roundTo2Decimals(this.props[3]) + "," + roundTo2Decimals(this.props[4]) + "," + roundTo2Decimals(this.props[5]) + "," + roundTo2Decimals(this.props[6]) + "," + roundTo2Decimals(this.props[7]) + "," + roundTo2Decimals(this.props[8]) + "," + roundTo2Decimals(this.props[9]) + "," + roundTo2Decimals(this.props[10]) + "," + roundTo2Decimals(this.props[11]) + "," + roundTo2Decimals(this.props[12]) + "," + roundTo2Decimals(this.props[13]) + "," + roundTo2Decimals(this.props[14]) + "," + roundTo2Decimals(this.props[15]) + ")" : (this.cssParts[1] = this.props.join(","), this.cssParts.join(""))
        }

        function k() {
            return "matrix(" + this.props[0] + "," + this.props[1] + "," + this.props[4] + "," + this.props[5] + "," + this.props[12] + "," + this.props[13] + ")"
        }

        function S() {
            return "" + this.toArray()
        }

        return function () {
            this.reset = t, this.rotate = e, this.rotateX = s, this.rotateY = r, this.rotateZ = i, this.skew = n, this.skewFromAxis = o, this.shear = a, this.scale = h, this.setTransform = l, this.translate = p, this.transform = m, this.applyToPoint = c, this.applyToX = u, this.applyToY = y, this.applyToZ = g, this.applyToPointArray = v, this.applyToPointStringified = b, this.toArray = P, this.toCSS = E, this.to2dCSS = k, this.toString = S, this.clone = f, this.cloneFromProps = d, this._t = this.transform, this.props = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], this.cssParts = ["matrix3d(", "", ")"]
        }
    }();
    !function (t, e) {
        function s(s, l, p) {
            var d = [];
            l = 1 == l ? {entropy: !0} : l || {};
            var v = n(a(l.entropy ? [s, h(t)] : null == s ? o() : s, 3), d), b = new r(d), P = function () {
                for (var t = b.g(f), e = u, s = 0; y > t;) t = (t + s) * m, e *= m, s = b.g(1);
                for (; t >= g;) t /= 2, e /= 2, s >>>= 1;
                return (t + s) / e
            };
            return P.int32 = function () {
                return 0 | b.g(4)
            }, P.quick = function () {
                return b.g(4) / 4294967296
            }, P["double"] = P, n(h(b.S), t), (l.pass || p || function (t, s, r, a) {
                return a && (a.S && i(a, b), t.state = function () {
                    return i(b, {})
                }), r ? (e[c] = t, s) : t
            })(P, v, "global" in l ? l.global : this == e, l.state)
        }

        function r(t) {
            var e, s = t.length, r = this, i = 0, a = r.i = r.j = 0, n = r.S = [];
            for (s || (t = [s++]); m > i;) n[i] = i++;
            for (i = 0; m > i; i++) n[i] = n[a = v & a + t[i % s] + (e = n[i])], n[a] = e;
            (r.g = function (t) {
                for (var e, s = 0, i = r.i, a = r.j, n = r.S; t--;) e = n[i = v & i + 1], s = s * m + n[v & (n[i] = n[a = v & a + e]) + (n[a] = e)];
                return r.i = i, r.j = a, s
            })(m)
        }

        function i(t, e) {
            return e.i = t.i, e.j = t.j, e.S = t.S.slice(), e
        }

        function a(t, e) {
            var s, r = [], i = typeof t;
            if (e && "object" == i) for (s in t) try {
                r.push(a(t[s], e - 1))
            } catch (n) {
            }
            return r.length ? r : "string" == i ? t : t + "\x00"
        }

        function n(t, e) {
            for (var s, r = t + "", i = 0; i < r.length;) e[v & i] = v & (s ^= 19 * e[v & i]) + r.charCodeAt(i++);
            return h(e)
        }

        function o() {
            try {
                if (l) return h(l.randomBytes(m));
                var e = new Uint8Array(m);
                return (p.crypto || p.msCrypto).getRandomValues(e), h(e)
            } catch (s) {
                var r = p.navigator, i = r && r.plugins;
                return [+new Date, p, i, p.screen, h(t)]
            }
        }

        function h(t) {
            return String.fromCharCode.apply(0, t)
        }

        var l, p = this, m = 256, f = 6, d = 52, c = "random", u = e.pow(m, f), y = e.pow(2, d), g = 2 * y, v = m - 1;
        e["seed" + c] = s, n(e.random(), t)
    }([], BMMath);
    var BezierFactory = function () {
        function t(t, e, s, r, i) {
            var a = i || ("bez_" + t + "_" + e + "_" + s + "_" + r).replace(/\./g, "p");
            if (p[a]) return p[a];
            var n = new h([t, e, s, r]);
            return p[a] = n, n
        }

        function e(t, e) {
            return 1 - 3 * e + 3 * t
        }

        function s(t, e) {
            return 3 * e - 6 * t
        }

        function r(t) {
            return 3 * t
        }

        function i(t, i, a) {
            return ((e(i, a) * t + s(i, a)) * t + r(i)) * t
        }

        function a(t, i, a) {
            return 3 * e(i, a) * t * t + 2 * s(i, a) * t + r(i)
        }

        function n(t, e, s, r, a) {
            var n, o, h = 0;
            do o = e + (s - e) / 2, n = i(o, r, a) - t, n > 0 ? s = o : e = o; while (Math.abs(n) > d && ++h < c);
            return o
        }

        function o(t, e, s, r) {
            for (var n = 0; m > n; ++n) {
                var o = a(e, s, r);
                if (0 === o) return e;
                var h = i(e, s, r) - t;
                e -= h / o
            }
            return e
        }

        function h(t) {
            this._p = t, this._mSampleValues = g ? new Float32Array(u) : new Array(u), this._precomputed = !1, this.get = this.get.bind(this)
        }

        var l = {};
        l.getBezierEasing = t;
        var p = {}, m = 4, f = .001, d = 1e-7, c = 10, u = 11, y = 1 / (u - 1), g = "function" == typeof Float32Array;
        return h.prototype = {
            get: function (t) {
                var e = this._p[0], s = this._p[1], r = this._p[2], a = this._p[3];
                return this._precomputed || this._precompute(), e === s && r === a ? t : 0 === t ? 0 : 1 === t ? 1 : i(this._getTForX(t), s, a)
            }, _precompute: function () {
                var t = this._p[0], e = this._p[1], s = this._p[2], r = this._p[3];
                this._precomputed = !0, (t !== e || s !== r) && this._calcSampleValues()
            }, _calcSampleValues: function () {
                for (var t = this._p[0], e = this._p[2], s = 0; u > s; ++s) this._mSampleValues[s] = i(s * y, t, e)
            }, _getTForX: function (t) {
                for (var e = this._p[0], s = this._p[2], r = this._mSampleValues, i = 0, h = 1, l = u - 1; h !== l && r[h] <= t; ++h) i += y;
                --h;
                var p = (t - r[h]) / (r[h + 1] - r[h]), m = i + p * y, d = a(m, e, s);
                return d >= f ? o(t, m, e, s) : 0 === d ? m : n(t, i, i + y, e, s)
            }
        }, l
    }(), MatrixManager = matrixManagerFunction;
    !function () {
        for (var t = 0, e = ["ms", "moz", "webkit", "o"], s = 0; s < e.length && !window.requestAnimationFrame; ++s) window.requestAnimationFrame = window[e[s] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[e[s] + "CancelAnimationFrame"] || window[e[s] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function (e, s) {
            var r = (new Date).getTime(), i = Math.max(0, 16 - (r - t)), a = window.setTimeout(function () {
                e(r + i)
            }, i);
            return t = r + i, a
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function (t) {
            clearTimeout(t)
        })
    }();
    var bez = bezFunction(), dataManager = dataFunctionManager(), FontManager = function () {
        function t(t, e) {
            var s = document.createElement("span");
            s.style.fontFamily = e;
            var r = document.createElement("span");
            r.innerHTML = "giItT1WQy@!-/#", s.style.position = "absolute", s.style.left = "-10000px", s.style.top = "-10000px", s.style.fontSize = "300px", s.style.fontVariant = "normal", s.style.fontStyle = "normal", s.style.fontWeight = "normal", s.style.letterSpacing = "0", s.appendChild(r), document.body.appendChild(s);
            var i = r.offsetWidth;
            return r.style.fontFamily = t + ", " + e, {node: r, w: i, parent: s}
        }

        function e() {
            var t, s, r, i = this.fonts.length, a = i;
            for (t = 0; i > t; t += 1) if (this.fonts[t].loaded) a -= 1; else if ("t" === this.fonts[t].fOrigin) {
                if (window.Typekit && window.Typekit.load && 0 === this.typekitLoaded) {
                    this.typekitLoaded = 1;
                    try {
                        Typekit.load({
                            async: !0, active: function () {
                                this.typekitLoaded = 2
                            }.bind(this)
                        })
                    } catch (n) {
                    }
                }
                2 === this.typekitLoaded && (this.fonts[t].loaded = !0)
            } else "n" === this.fonts[t].fOrigin ? this.fonts[t].loaded = !0 : (s = this.fonts[t].monoCase.node,
                r = this.fonts[t].monoCase.w, s.offsetWidth !== r ? (a -= 1, this.fonts[t].loaded = !0) : (s = this.fonts[t].sansCase.node, r = this.fonts[t].sansCase.w, s.offsetWidth !== r && (a -= 1, this.fonts[t].loaded = !0)), this.fonts[t].loaded && (this.fonts[t].sansCase.parent.parentNode.removeChild(this.fonts[t].sansCase.parent), this.fonts[t].monoCase.parent.parentNode.removeChild(this.fonts[t].monoCase.parent)));
            0 !== a && Date.now() - this.initTime < h ? setTimeout(e.bind(this), 20) : setTimeout(function () {
                this.loaded = !0
            }.bind(this), 0)
        }

        function s(t, e) {
            var s = document.createElementNS(svgNS, "text");
            s.style.fontSize = "100px", s.style.fontFamily = e.fFamily, s.textContent = "1", e.fClass ? (s.style.fontFamily = "inherit", s.className = e.fClass) : s.style.fontFamily = e.fFamily, t.appendChild(s);
            var r = document.createElement("canvas").getContext("2d");
            return r.font = "100px " + e.fFamily, r
        }

        function r(r, i) {
            if (!r) return void(this.loaded = !0);
            if (this.chars) return this.loaded = !0, void(this.fonts = r.list);
            var a, n = r.list, o = n.length;
            for (a = 0; o > a; a += 1) {
                if (n[a].loaded = !1, n[a].monoCase = t(n[a].fFamily, "monospace"), n[a].sansCase = t(n[a].fFamily, "sans-serif"), n[a].fPath) {
                    if ("p" === n[a].fOrigin) {
                        var h = document.createElement("style");
                        h.type = "text/css", h.innerHTML = "@font-face {font-family: " + n[a].fFamily + "; font-style: normal; src: url('" + n[a].fPath + "');}", i.appendChild(h)
                    } else if ("g" === n[a].fOrigin) {
                        var l = document.createElement("link");
                        l.type = "text/css", l.rel = "stylesheet", l.href = n[a].fPath, i.appendChild(l)
                    } else if ("t" === n[a].fOrigin) {
                        var p = document.createElement("script");
                        p.setAttribute("src", n[a].fPath), i.appendChild(p)
                    }
                } else n[a].loaded = !0;
                n[a].helper = s(i, n[a]), this.fonts.push(n[a])
            }
            e.bind(this)()
        }

        function i(t) {
            if (t) {
                this.chars || (this.chars = []);
                var e, s, r, i = t.length, a = this.chars.length;
                for (e = 0; i > e; e += 1) {
                    for (s = 0, r = !1; a > s;) this.chars[s].style === t[e].style && this.chars[s].fFamily === t[e].fFamily && this.chars[s].ch === t[e].ch && (r = !0), s += 1;
                    r || (this.chars.push(t[e]), a += 1)
                }
            }
        }

        function a(t, e, s) {
            for (var r = 0, i = this.chars.length; i > r;) {
                if (this.chars[r].ch === t && this.chars[r].style === e && this.chars[r].fFamily === s) return this.chars[r];
                r += 1
            }
        }

        function n(t, e, s) {
            var r = this.getFontByName(e), i = r.helper;
            return i.measureText(t).width * s / 100
        }

        function o(t) {
            for (var e = 0, s = this.fonts.length; s > e;) {
                if (this.fonts[e].fName === t) return this.fonts[e];
                e += 1
            }
            return "sans-serif"
        }

        var h = 5e3, l = function () {
            this.fonts = [], this.chars = null, this.typekitLoaded = 0, this.loaded = !1, this.initTime = Date.now()
        };
        return l.prototype.addChars = i, l.prototype.addFonts = r, l.prototype.getCharData = a, l.prototype.getFontByName = o, l.prototype.measureText = n, l
    }(), PropertyFactory = function () {
        function t() {
            if (this.elem.globalData.frameId !== this.frameId) {
                this.mdf = !1;
                var t = this.comp.renderedFrame - this.offsetTime;
                if (t === this.lastFrame || this.lastFrame !== h && (this.lastFrame >= this.keyframes[this.keyframes.length - 1].t - this.offsetTime && t >= this.keyframes[this.keyframes.length - 1].t - this.offsetTime || this.lastFrame < this.keyframes[0].t - this.offsetTime && t < this.keyframes[0].t - this.offsetTime)) ; else {
                    for (var e, s, r = 0, i = this.keyframes.length - 1, a = 1, n = !0; n;) {
                        if (e = this.keyframes[r], s = this.keyframes[r + 1], r == i - 1 && t >= s.t - this.offsetTime) {
                            e.h && (e = s);
                            break
                        }
                        if (s.t - this.offsetTime > t) break;
                        i - 1 > r ? r += a : n = !1
                    }
                    var o, l, p, m, f, d = 0;
                    if (e.to) {
                        e.bezierData || bez.buildBezierData(e);
                        var c = e.bezierData;
                        if (t >= s.t - this.offsetTime || t < e.t - this.offsetTime) {
                            var u = t >= s.t - this.offsetTime ? c.points.length - 1 : 0;
                            for (l = c.points[u].point.length, o = 0; l > o; o += 1) this.v[o] = this.mult ? c.points[u].point[o] * this.mult : c.points[u].point[o], this.pv[o] = c.points[u].point[o], this.lastPValue[o] !== this.pv[o] && (this.mdf = !0, this.lastPValue[o] = this.pv[o])
                        } else {
                            e.__fnct ? f = e.__fnct : (f = BezierFactory.getBezierEasing(e.o.x, e.o.y, e.i.x, e.i.y, e.n).get, e.__fnct = f), p = f((t - (e.t - this.offsetTime)) / (s.t - this.offsetTime - (e.t - this.offsetTime)));
                            var y, g = c.segmentLength * p, v = 0;
                            for (a = 1, n = !0, m = c.points.length; n;) {
                                if (v += c.points[d].partialLength * a, 0 === g || 0 === p || d == c.points.length - 1) {
                                    for (l = c.points[d].point.length, o = 0; l > o; o += 1) this.v[o] = this.mult ? c.points[d].point[o] * this.mult : c.points[d].point[o], this.pv[o] = c.points[d].point[o], this.lastPValue[o] !== this.pv[o] && (this.mdf = !0, this.lastPValue[o] = this.pv[o]);
                                    break
                                }
                                if (g >= v && g < v + c.points[d + 1].partialLength) {
                                    for (y = (g - v) / c.points[d + 1].partialLength, l = c.points[d].point.length, o = 0; l > o; o += 1) this.v[o] = this.mult ? (c.points[d].point[o] + (c.points[d + 1].point[o] - c.points[d].point[o]) * y) * this.mult : c.points[d].point[o] + (c.points[d + 1].point[o] - c.points[d].point[o]) * y, this.pv[o] = c.points[d].point[o] + (c.points[d + 1].point[o] - c.points[d].point[o]) * y, this.lastPValue[o] !== this.pv[o] && (this.mdf = !0, this.lastPValue[o] = this.pv[o]);
                                    break
                                }
                                m - 1 > d && 1 == a || d > 0 && -1 == a ? d += a : n = !1
                            }
                        }
                    } else {
                        var b, P, E, k, S, x = !1;
                        for (i = e.s.length, r = 0; i > r; r += 1) {
                            if (1 !== e.h && (e.o.x instanceof Array ? (x = !0, e.__fnct || (e.__fnct = []), e.__fnct[r] || (b = e.o.x[r] || e.o.x[0], P = e.o.y[r] || e.o.y[0], E = e.i.x[r] || e.i.x[0], k = e.i.y[r] || e.i.y[0])) : (x = !1, e.__fnct || (b = e.o.x, P = e.o.y, E = e.i.x, k = e.i.y)), x ? e.__fnct[r] ? f = e.__fnct[r] : (f = BezierFactory.getBezierEasing(b, P, E, k).get, e.__fnct[r] = f) : e.__fnct ? f = e.__fnct : (f = BezierFactory.getBezierEasing(b, P, E, k).get, e.__fnct = f), p = t >= s.t - this.offsetTime ? 1 : t < e.t - this.offsetTime ? 0 : f((t - (e.t - this.offsetTime)) / (s.t - this.offsetTime - (e.t - this.offsetTime)))), this.sh && 1 !== e.h) {
                                var C = e.s[r], M = e.e[r];
                                -180 > C - M ? C += 360 : C - M > 180 && (C -= 360), S = C + (M - C) * p
                            } else S = 1 === e.h ? e.s[r] : e.s[r] + (e.e[r] - e.s[r]) * p;
                            1 === i ? (this.v = this.mult ? S * this.mult : S, this.pv = S, this.lastPValue != this.pv && (this.mdf = !0, this.lastPValue = this.pv)) : (this.v[r] = this.mult ? S * this.mult : S, this.pv[r] = S, this.lastPValue[r] !== this.pv[r] && (this.mdf = !0, this.lastPValue[r] = this.pv[r]))
                        }
                    }
                }
                this.lastFrame = t, this.frameId = this.elem.globalData.frameId
            }
        }

        function e(t, e, s) {
            this.mult = s, this.v = s ? e.k * s : e.k, this.pv = e.k, this.mdf = !1, this.comp = t.comp, this.k = !1
        }

        function s(t, e, s) {
            this.mult = s, this.data = e, this.mdf = !1, this.comp = t.comp, this.k = !1, this.frameId = -1, this.v = new Array(e.k.length), this.pv = new Array(e.k.length), this.lastValue = new Array(e.k.length);
            var r, i = e.k.length;
            for (r = 0; i > r; r += 1) this.v[r] = s ? e.k[r] * s : e.k[r], this.pv[r] = e.k[r]
        }

        function r(e, s, r) {
            this.keyframes = s.k, this.offsetTime = e.data.st, this.lastValue = -99999, this.lastPValue = -99999, this.frameId = -1, this.k = !0, this.data = s, this.mult = r, this.elem = e, this.comp = e.comp, this.lastFrame = h, this.v = r ? s.k[0].s[0] * r : s.k[0].s[0], this.pv = s.k[0].s[0], this.getValue = t
        }

        function i(e, s, r) {
            var i, a, n, o, l, p = s.k.length;
            for (i = 0; p - 1 > i; i += 1) s.k[i].to && s.k[i].s && s.k[i].e && (a = s.k[i].s, n = s.k[i].e, o = s.k[i].to, l = s.k[i].ti, (2 == a.length && bez.pointOnLine2D(a[0], a[1], n[0], n[1], a[0] + o[0], a[1] + o[1]) && bez.pointOnLine2D(a[0], a[1], n[0], n[1], n[0] + l[0], n[1] + l[1]) || bez.pointOnLine3D(a[0], a[1], a[2], n[0], n[1], n[2], a[0] + o[0], a[1] + o[1], a[2] + o[2]) && bez.pointOnLine3D(a[0], a[1], a[2], n[0], n[1], n[2], n[0] + l[0], n[1] + l[1], n[2] + l[2])) && (s.k[i].to = null, s.k[i].ti = null));
            this.keyframes = s.k, this.offsetTime = e.data.st, this.k = !0, this.mult = r, this.elem = e, this.comp = e.comp, this.getValue = t, this.frameId = -1, this.v = new Array(s.k[0].s.length), this.pv = new Array(s.k[0].s.length), this.lastValue = new Array(s.k[0].s.length), this.lastPValue = new Array(s.k[0].s.length), this.lastFrame = h
        }

        function a(t, a, n, o, h) {
            var p;
            if (2 === n) p = new l(t, a, h); else if (7 === n) p = new TrimProperty(t, a, h); else if (a.k.length) if ("number" == typeof a.k[0]) p = new s(t, a, o); else switch (n) {
                case 0:
                    p = new r(t, a, o);
                    break;
                case 1:
                    p = new i(t, a, o)
            } else p = new e(t, a, o);
            return p.k && h.push(p), p
        }

        function n(t, e, s, r) {
            return new p(t, e, s, r)
        }

        function o(t, e, s) {
            return new m(t, e, s)
        }

        var h = -999999, l = function () {
            function t() {
                return this.p.k && this.p.getValue(), this.p.v
            }

            function e() {
                return this.px.k && this.px.getValue(), this.px.v
            }

            function s() {
                return this.py.k && this.py.getValue(), this.py.v
            }

            function r() {
                return this.a.k && this.a.getValue(), this.a.v
            }

            function i() {
                return this.or.k && this.or.getValue(), this.or.v
            }

            function a() {
                return this.r.k && this.r.getValue(), this.r.v / degToRads
            }

            function n() {
                return this.s.k && this.s.getValue(), this.s.v
            }

            function o() {
                return this.o.k && this.o.getValue(), this.o.v
            }

            function h() {
                return this.sk.k && this.sk.getValue(), this.sk.v
            }

            function l() {
                return this.sa.k && this.sa.getValue(), this.sa.v
            }

            function p(t) {
                var e, s = this.dynamicProperties.length;
                for (e = 0; s > e; e += 1) this.dynamicProperties[e].getValue(), this.dynamicProperties[e].mdf && (this.mdf = !0);
                this.a && t.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.s && t.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.r ? t.rotate(-this.r.v) : t.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.data.p.s ? this.data.p.z ? t.translate(this.px.v, this.py.v, -this.pz.v) : t.translate(this.px.v, this.py.v, 0) : t.translate(this.p.v[0], this.p.v[1], -this.p.v[2])
            }

            function m() {
                if (this.elem.globalData.frameId !== this.frameId) {
                    this.mdf = !1;
                    var t, e = this.dynamicProperties.length;
                    for (t = 0; e > t; t += 1) this.dynamicProperties[t].getValue(), this.dynamicProperties[t].mdf && (this.mdf = !0);
                    this.mdf && (this.v.reset(), this.a && this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.s && this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && this.v.skewFromAxis(-this.sk.v, this.sa.v), this.r ? this.v.rotate(-this.r.v) : this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.data.p.s ? this.data.p.z ? this.v.translate(this.px.v, this.py.v, -this.pz.v) : this.v.translate(this.px.v, this.py.v, 0) : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2])), this.frameId = this.elem.globalData.frameId
                }
            }

            function f() {
                this.inverted = !0, this.iv = new Matrix, this.k || (this.data.p.s ? this.iv.translate(this.px.v, this.py.v, -this.pz.v) : this.iv.translate(this.p.v[0], this.p.v[1], -this.p.v[2]), this.r ? this.iv.rotate(-this.r.v) : this.iv.rotateX(-this.rx.v).rotateY(-this.ry.v).rotateZ(this.rz.v), this.s && this.iv.scale(this.s.v[0], this.s.v[1], 1), this.a && this.iv.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]))
            }

            return function (d, c, u) {
                this.elem = d, this.frameId = -1, this.dynamicProperties = [], this.mdf = !1, this.data = c, this.getValue = m, this.applyToMatrix = p, this.setInverted = f, this.v = new Matrix, c.p.s ? (this.px = PropertyFactory.getProp(d, c.p.x, 0, 0, this.dynamicProperties), this.py = PropertyFactory.getProp(d, c.p.y, 0, 0, this.dynamicProperties), c.p.z && (this.pz = PropertyFactory.getProp(d, c.p.z, 0, 0, this.dynamicProperties))) : this.p = PropertyFactory.getProp(d, c.p, 1, 0, this.dynamicProperties), c.r ? this.r = PropertyFactory.getProp(d, c.r, 0, degToRads, this.dynamicProperties) : c.rx && (this.rx = PropertyFactory.getProp(d, c.rx, 0, degToRads, this.dynamicProperties), this.ry = PropertyFactory.getProp(d, c.ry, 0, degToRads, this.dynamicProperties), this.rz = PropertyFactory.getProp(d, c.rz, 0, degToRads, this.dynamicProperties), this.or = PropertyFactory.getProp(d, c.or, 0, degToRads, this.dynamicProperties)), c.sk && (this.sk = PropertyFactory.getProp(d, c.sk, 0, degToRads, this.dynamicProperties), this.sa = PropertyFactory.getProp(d, c.sa, 0, degToRads, this.dynamicProperties)), c.a && (this.a = PropertyFactory.getProp(d, c.a, 1, 0, this.dynamicProperties)), c.s && (this.s = PropertyFactory.getProp(d, c.s, 1, .01, this.dynamicProperties)), this.o = c.o ? PropertyFactory.getProp(d, c.o, 0, .01, u) : {
                    mdf: !1,
                    v: 1
                }, this.dynamicProperties.length ? u.push(this) : (this.a && this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.s && this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && this.v.skewFromAxis(-this.sk.v, this.sa.v), this.r ? this.v.rotate(-this.r.v) : this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.data.p.s ? c.p.z ? this.v.translate(this.px.v, this.py.v, -this.pz.v) : this.v.translate(this.px.v, this.py.v, 0) : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2])), Object.defineProperty(this, "position", {get: t}), Object.defineProperty(this, "xPosition", {get: e}), Object.defineProperty(this, "yPosition", {get: s}), Object.defineProperty(this, "orientation", {get: i}), Object.defineProperty(this, "anchorPoint", {get: r}), Object.defineProperty(this, "rotation", {get: a}), Object.defineProperty(this, "scale", {get: n}), Object.defineProperty(this, "opacity", {get: o}), Object.defineProperty(this, "skew", {get: h}), Object.defineProperty(this, "skewAxis", {get: l})
            }
        }(), p = function () {
            function t(t) {
                var e = 0, s = this.dataProps.length;
                if (this.elem.globalData.frameId !== this.frameId || t) {
                    for (this.mdf = !1, this.frameId = this.elem.globalData.frameId; s > e;) {
                        if (this.dataProps[e].p.mdf) {
                            this.mdf = !0;
                            break
                        }
                        e += 1
                    }
                    if (this.mdf || t) for ("svg" === this.renderer && (this.dasharray = ""), e = 0; s > e; e += 1) "o" != this.dataProps[e].n ? "svg" === this.renderer ? this.dasharray += " " + this.dataProps[e].p.v : this.dasharray[e] = this.dataProps[e].p.v : this.dashoffset = this.dataProps[e].p.v
                }
            }

            return function (e, s, r, i) {
                this.elem = e, this.frameId = -1, this.dataProps = new Array(s.length), this.renderer = r, this.mdf = !1, this.k = !1, this.dasharray = "svg" === this.renderer ? "" : new Array(s.length - 1), this.dashoffset = 0;
                var a, n, o = s.length;
                for (a = 0; o > a; a += 1) n = PropertyFactory.getProp(e, s[a].v, 0, 0, i), this.k = n.k ? !0 : this.k, this.dataProps[a] = {
                    n: s[a].n,
                    p: n
                };
                this.getValue = t, this.k ? i.push(this) : this.getValue(!0)
            }
        }(), m = function () {
            function t() {
                if (this.dynamicProperties.length) {
                    var t, e = this.dynamicProperties.length;
                    for (t = 0; e > t; t += 1) this.dynamicProperties[t].getValue()
                }
                var s = this.data.totalChars, r = 2 === this.data.r ? 1 : 100 / s, i = this.o.v / r,
                    a = this.s.v / r + i, n = this.e.v / r + i;
                if (a > n) {
                    var o = a;
                    a = n, n = o
                }
                this.finalS = a, this.finalE = n
            }

            function e(t) {
                var e = BezierFactory.getBezierEasing(this.ne.v / 100, 0, 1 - this.xe.v / 100, 1).get, a = 0,
                    n = this.finalS, o = this.finalE, h = this.data.sh;
                if (2 == h) a = o === n ? t >= o ? 1 : 0 : s(0, r(.5 / (o - n) + (t - n) / (o - n), 1)), a = e(a); else if (3 == h) a = o === n ? t >= o ? 0 : 1 : 1 - s(0, r(.5 / (o - n) + (t - n) / (o - n), 1)), a = e(a); else if (4 == h) o === n ? a = t >= o ? 0 : 1 : (a = s(0, r(.5 / (o - n) + (t - n) / (o - n), 1)), .5 > a ? a *= 2 : a = 1 - a); else if (5 == h) if (o === n) a = t >= o ? 0 : 1; else {
                    var l = o - n;
                    a = -4 / (l * l) * t * t + 4 / l * t
                } else 6 == h ? a = o === n ? t >= o ? 0 : 1 : (1 + (Math.cos(Math.PI + 2 * Math.PI * (t - n) / (o - n)) + 0)) / 2 : t >= i(n) && (a = 0 > t - n ? 1 - (n - t) : s(0, r(o - t, 1)));
                return a * this.a.v
            }

            var s = Math.max, r = Math.min, i = Math.floor;
            return function (s, r, i) {
                this.mdf = !1, this.k = !1, this.data = r, this.dynamicProperties = [], this.getValue = t, this.getMult = e, this.comp = s.comp, this.finalS = 0, this.finalE = 0, this.s = PropertyFactory.getProp(s, r.s || {k: 0}, 0, 0, this.dynamicProperties), this.e = "e" in r ? PropertyFactory.getProp(s, r.e, 0, 0, this.dynamicProperties) : {v: 2 === r.r ? r.totalChars : 100}, this.o = PropertyFactory.getProp(s, r.o || {k: 0}, 0, 0, this.dynamicProperties), this.xe = PropertyFactory.getProp(s, r.xe || {k: 0}, 0, 0, this.dynamicProperties), this.ne = PropertyFactory.getProp(s, r.ne || {k: 0}, 0, 0, this.dynamicProperties), this.a = PropertyFactory.getProp(s, r.a, 0, .01, this.dynamicProperties), this.dynamicProperties.length ? i.push(this) : this.getValue()
            }
        }(), f = {};
        return f.getProp = a, f.getDashProp = n, f.getTextSelectorProp = o, f
    }(), ShapePropertyFactory = function () {
        function t() {
            this.mdf = !1;
            var t = this.comp.renderedFrame - this.offsetTime;
            if (this.lastFrame !== n && (this.lastFrame < this.keyframes[0].t - this.offsetTime && t < this.keyframes[0].t - this.offsetTime || this.lastFrame > this.keyframes[this.keyframes.length - 1].t - this.offsetTime && t > this.keyframes[this.keyframes.length - 1].t - this.offsetTime)) ; else {
                var e, s, r;
                if (t < this.keyframes[0].t - this.offsetTime) e = this.keyframes[0].s[0], r = !0; else if (t > this.keyframes[this.keyframes.length - 1].t - this.offsetTime) e = 1 === this.keyframes[this.keyframes.length - 2].h ? this.keyframes[this.keyframes.length - 2].s[0] : this.keyframes[this.keyframes.length - 2].e[0], r = !0; else {
                    for (var i, a, o, h, l, p, m = 0, f = this.keyframes.length - 1, d = 1, c = !0; c && (i = this.keyframes[m], a = this.keyframes[m + 1], !(a.t - this.offsetTime > t && 1 == d));) f - 1 > m && 1 == d || m > 0 && -1 == d ? m += d : c = !1;
                    r = 1 === i.h, r && m === f - 1 && (i = a);
                    var u;
                    if (!r) {
                        var y;
                        i.__fnct ? y = i.__fnct : (y = BezierFactory.getBezierEasing(i.o.x, i.o.y, i.i.x, i.i.y).get, i.__fnct = y), u = t >= a.t - this.offsetTime ? 1 : t < i.t - this.offsetTime ? 0 : y((t - (i.t - this.offsetTime)) / (a.t - this.offsetTime - (i.t - this.offsetTime))), s = i.e[0]
                    }
                    e = i.s[0]
                }
                h = this.v.i.length, p = e.i[0].length;
                var g, v = !1;
                for (o = 0; h > o; o += 1) for (l = 0; p > l; l += 1) r ? (g = e.i[o][l], this.v.i[o][l] !== g && (this.v.i[o][l] = g, this.pv.i[o][l] = g, v = !0), g = e.o[o][l], this.v.o[o][l] !== g && (this.v.o[o][l] = g, this.pv.o[o][l] = g, v = !0), g = e.v[o][l], this.v.v[o][l] !== g && (this.v.v[o][l] = g, this.pv.v[o][l] = g, v = !0)) : (g = e.i[o][l] + (s.i[o][l] - e.i[o][l]) * u, this.v.i[o][l] !== g && (this.v.i[o][l] = g, this.pv.i[o][l] = g, v = !0), g = e.o[o][l] + (s.o[o][l] - e.o[o][l]) * u, this.v.o[o][l] !== g && (this.v.o[o][l] = g, this.pv.o[o][l] = g, v = !0), g = e.v[o][l] + (s.v[o][l] - e.v[o][l]) * u, this.v.v[o][l] !== g && (this.v.v[o][l] = g, this.pv.v[o][l] = g, v = !0));
                this.mdf = v, this.paths.length = 0, this.paths[0] = this.v
            }
            this.lastFrame = t
        }

        function e() {
            return this.v
        }

        function s() {
            this.paths.length ? (this.paths.length = 1, this.paths[0] = this.v) : this.paths = [this.v]
        }

        function r(t, r, i) {
            this.comp = t.comp, this.k = !1, this.mdf = !1, this.closed = 3 === i ? r.cl : r.closed, this.numNodes = 3 === i ? r.pt.k.v.length : r.ks.k.v.length, this.v = 3 === i ? r.pt.k : r.ks.k, this.getValue = e, this.pv = this.v, this.v.c = this.closed, this.paths = [this.v], this.reset = s
        }

        function i(e, r, i) {
            this.comp = e.comp, this.offsetTime = e.data.st, this.getValue = t, this.keyframes = 3 === i ? r.pt.k : r.ks.k, this.k = !0, this.closed = 3 === i ? r.cl : r.closed;
            var a, o = this.keyframes[0].s[0].i.length, h = this.keyframes[0].s[0].i[0].length;
            for (this.numNodes = o, this.v = {
                i: Array.apply(null, {length: o}),
                o: Array.apply(null, {length: o}),
                v: Array.apply(null, {length: o}),
                c: this.closed
            }, this.pv = {
                i: Array.apply(null, {length: o}),
                o: Array.apply(null, {length: o}),
                v: Array.apply(null, {length: o})
            }, a = 0; o > a; a += 1) this.v.i[a] = Array.apply(null, {length: h}), this.v.o[a] = Array.apply(null, {length: h}), this.v.v[a] = Array.apply(null, {length: h}), this.pv.i[a] = Array.apply(null, {length: h}), this.pv.o[a] = Array.apply(null, {length: h}), this.pv.v[a] = Array.apply(null, {length: h});
            this.paths = [], this.lastFrame = n, this.reset = s
        }

        function a(t, e, s, a) {
            var n;
            if (3 === s || 4 === s) {
                var p = 3 === s ? e.pt.k : e.ks.k;
                n = p.length ? new i(t, e, s) : new r(t, e, s)
            } else 5 === s ? n = new l(t, e) : 6 === s ? n = new o(t, e) : 7 === s && (n = new h(t, e));
            return n.k && a.push(n), n
        }

        var n = -999999, o = function () {
            function t() {
                var t = this.p.v[0], e = this.p.v[1], s = this.s.v[0] / 2, i = this.s.v[1] / 2;
                2 !== this.d && 3 !== this.d ? (this.v.v[0] = [t, e - i], this.v.i[0] = [t - s * r, e - i], this.v.o[0] = [t + s * r, e - i], this.v.v[1] = [t + s, e], this.v.i[1] = [t + s, e - i * r], this.v.o[1] = [t + s, e + i * r], this.v.v[2] = [t, e + i], this.v.i[2] = [t + s * r, e + i], this.v.o[2] = [t - s * r, e + i], this.v.v[3] = [t - s, e], this.v.i[3] = [t - s, e + i * r], this.v.o[3] = [t - s, e - i * r]) : (this.v.v[0] = [t, e - i], this.v.o[0] = [t - s * r, e - i], this.v.i[0] = [t + s * r, e - i], this.v.v[1] = [t - s, e], this.v.o[1] = [t - s, e + i * r], this.v.i[1] = [t - s, e - i * r], this.v.v[2] = [t, e + i], this.v.o[2] = [t + s * r, e + i], this.v.i[2] = [t - s * r, e + i], this.v.v[3] = [t + s, e], this.v.o[3] = [t + s, e - i * r], this.v.i[3] = [t + s, e + i * r]), this.paths.length = 0, this.paths[0] = this.v
            }

            function e(t) {
                var e, s = this.dynamicProperties.length;
                if (this.elem.globalData.frameId !== this.frameId) {
                    for (this.mdf = !1, this.frameId = this.elem.globalData.frameId, e = 0; s > e; e += 1) this.dynamicProperties[e].getValue(t), this.dynamicProperties[e].mdf && (this.mdf = !0);
                    this.mdf && (this.convertEllToPath(), this.paths.length = 0, this.paths[0] = this.v)
                }
            }

            var r = roundCorner;
            return function (r, i) {
                this.v = {
                    v: Array.apply(null, {length: 4}),
                    i: Array.apply(null, {length: 4}),
                    o: Array.apply(null, {length: 4}),
                    c: !0
                }, this.numNodes = 4, this.d = i.d, this.dynamicProperties = [], this.paths = [], i.closed = !0, this.closed = !0, this.elem = r, this.comp = r.comp, this.frameId = -1, this.mdf = !1, this.getValue = e, this.convertEllToPath = t, this.reset = s, this.p = PropertyFactory.getProp(r, i.p, 1, 0, this.dynamicProperties), this.s = PropertyFactory.getProp(r, i.s, 1, 0, this.dynamicProperties), this.dynamicProperties.length ? this.k = !0 : this.convertEllToPath()
            }
        }(), h = function () {
            function t() {
                var t = Math.floor(this.pt.v), e = 2 * Math.PI / t;
                this.v.v.length = t, this.v.i.length = t, this.v.o.length = t;
                var s, r = this.or.v, i = this.os.v, a = 2 * Math.PI * r / (4 * t), n = -Math.PI / 2,
                    o = 3 === this.data.d ? -1 : 1;
                for (n += this.r.v, s = 0; t > s; s += 1) {
                    var h = r * Math.cos(n), l = r * Math.sin(n),
                        p = 0 === h && 0 === l ? 0 : l / Math.sqrt(h * h + l * l),
                        m = 0 === h && 0 === l ? 0 : -h / Math.sqrt(h * h + l * l);
                    h += +this.p.v[0], l += +this.p.v[1], this.v.v[s] = [h, l], this.v.i[s] = [h + p * a * i * o, l + m * a * i * o], this.v.o[s] = [h - p * a * i * o, l - m * a * i * o], n += e * o
                }
                this.numNodes = t, this.paths.length = 0, this.paths[0] = this.v
            }

            function e() {
                var t = 2 * Math.floor(this.pt.v), e = 2 * Math.PI / t;
                this.v.v.length = t, this.v.i.length = t, this.v.o.length = t;
                var s, r, i, a, n = !0, o = this.or.v, h = this.ir.v, l = this.os.v, p = this.is.v,
                    m = 2 * Math.PI * o / (2 * t), f = 2 * Math.PI * h / (2 * t), d = -Math.PI / 2;
                d += this.r.v;
                var c = 3 === this.data.d ? -1 : 1;
                for (s = 0; t > s; s += 1) {
                    r = n ? o : h, i = n ? l : p, a = n ? m : f;
                    var u = r * Math.cos(d), y = r * Math.sin(d),
                        g = 0 === u && 0 === y ? 0 : y / Math.sqrt(u * u + y * y),
                        v = 0 === u && 0 === y ? 0 : -u / Math.sqrt(u * u + y * y);
                    u += +this.p.v[0], y += +this.p.v[1], this.v.v[s] = [u, y], this.v.i[s] = [u + g * a * i * c, y + v * a * i * c], this.v.o[s] = [u - g * a * i * c, y - v * a * i * c], n = !n, d += e * c
                }
                this.numNodes = t, this.paths.length = 0, this.paths[0] = this.v
            }

            function r() {
                if (this.elem.globalData.frameId !== this.frameId) {
                    this.mdf = !1, this.frameId = this.elem.globalData.frameId;
                    var t, e = this.dynamicProperties.length;
                    for (t = 0; e > t; t += 1) this.dynamicProperties[t].getValue(), this.dynamicProperties[t].mdf && (this.mdf = !0);
                    this.mdf && this.convertToPath()
                }
            }

            return function (i, a) {
                this.v = {
                    v: [],
                    i: [],
                    o: [],
                    c: !0
                }, this.elem = i, this.comp = i.comp, this.data = a, this.frameId = -1, this.d = a.d, this.dynamicProperties = [], this.mdf = !1, a.closed = !0, this.closed = !0, this.getValue = r, this.reset = s, 1 === a.sy ? (this.ir = PropertyFactory.getProp(i, a.ir, 0, 0, this.dynamicProperties), this.is = PropertyFactory.getProp(i, a.is, 0, .01, this.dynamicProperties), this.convertToPath = e) : this.convertToPath = t, this.pt = PropertyFactory.getProp(i, a.pt, 0, 0, this.dynamicProperties), this.p = PropertyFactory.getProp(i, a.p, 1, 0, this.dynamicProperties), this.r = PropertyFactory.getProp(i, a.r, 0, degToRads, this.dynamicProperties), this.or = PropertyFactory.getProp(i, a.or, 0, 0, this.dynamicProperties), this.os = PropertyFactory.getProp(i, a.os, 0, .01, this.dynamicProperties), this.paths = [], this.dynamicProperties.length ? this.k = !0 : this.convertToPath()
            }
        }(), l = function () {
            function t(t) {
                if (this.elem.globalData.frameId !== this.frameId) {
                    this.mdf = !1, this.frameId = this.elem.globalData.frameId;
                    var e, s = this.dynamicProperties.length;
                    for (e = 0; s > e; e += 1) this.dynamicProperties[e].getValue(t), this.dynamicProperties[e].mdf && (this.mdf = !0);
                    this.mdf && this.convertRectToPath()
                }
            }

            function e() {
                var t = this.p.v[0], e = this.p.v[1], s = this.s.v[0] / 2, r = this.s.v[1] / 2,
                    i = bm_min(s, r, this.r.v), a = i * (1 - roundCorner);
                2 === this.d || 1 === this.d ? (this.v.v[0] = [t + s, e - r + i], this.v.o[0] = this.v.v[0], this.v.i[0] = [t + s, e - r + a], this.v.v[1] = [t + s, e + r - i], this.v.o[1] = [t + s, e + r - a], this.v.i[1] = this.v.v[1], this.v.v[2] = [t + s - i, e + r], this.v.o[2] = this.v.v[2], this.v.i[2] = [t + s - a, e + r], this.v.v[3] = [t - s + i, e + r], this.v.o[3] = [t - s + a, e + r], this.v.i[3] = this.v.v[3], this.v.v[4] = [t - s, e + r - i], this.v.o[4] = this.v.v[4], this.v.i[4] = [t - s, e + r - a], this.v.v[5] = [t - s, e - r + i], this.v.o[5] = [t - s, e - r + a], this.v.i[5] = this.v.v[5], this.v.v[6] = [t - s + i, e - r], this.v.o[6] = this.v.v[6], this.v.i[6] = [t - s + a, e - r], this.v.v[7] = [t + s - i, e - r], this.v.o[7] = [t + s - a, e - r], this.v.i[7] = this.v.v[7]) : (this.v.v[0] = [t + s, e - r + i], this.v.o[0] = [t + s, e - r + a], this.v.i[0] = this.v.v[0], this.v.v[1] = [t + s - i, e - r], this.v.o[1] = this.v.v[1], this.v.i[1] = [t + s - a, e - r], this.v.v[2] = [t - s + i, e - r], this.v.o[2] = [t - s + a, e - r], this.v.i[2] = this.v.v[2], this.v.v[3] = [t - s, e - r + i], this.v.o[3] = this.v.v[3], this.v.i[3] = [t - s, e - r + a], this.v.v[4] = [t - s, e + r - i], this.v.o[4] = [t - s, e + r - a], this.v.i[4] = this.v.v[4], this.v.v[5] = [t - s + i, e + r], this.v.o[5] = this.v.v[5], this.v.i[5] = [t - s + a, e + r], this.v.v[6] = [t + s - i, e + r], this.v.o[6] = [t + s - a, e + r], this.v.i[6] = this.v.v[6], this.v.v[7] = [t + s, e + r - i], this.v.o[7] = this.v.v[7], this.v.i[7] = [t + s, e + r - a]), this.paths.length = 0, this.paths[0] = this.v
            }

            return function (r, i) {
                this.v = {
                    v: Array.apply(null, {length: 8}),
                    i: Array.apply(null, {length: 8}),
                    o: Array.apply(null, {length: 8}),
                    c: !0
                }, this.paths = [], this.numNodes = 8, this.elem = r, this.comp = r.comp, this.frameId = -1, this.d = i.d, this.dynamicProperties = [], this.mdf = !1, i.closed = !0, this.closed = !0, this.getValue = t, this.convertRectToPath = e, this.reset = s, this.p = PropertyFactory.getProp(r, i.p, 1, 0, this.dynamicProperties), this.s = PropertyFactory.getProp(r, i.s, 1, 0, this.dynamicProperties), this.r = PropertyFactory.getProp(r, i.r, 0, 0, this.dynamicProperties), this.dynamicProperties.length ? this.k = !0 : this.convertRectToPath()
            }
        }(), p = {};
        return p.getShapeProp = a, p
    }(), ShapeModifiers = function () {
        function t(t, e) {
            r[t] || (r[t] = e)
        }

        function e(t, e, s, i) {
            return new r[t](e, s, i)
        }

        var s = {}, r = {};
        return s.registerModifier = t, s.getModifier = e, s
    }();
    ShapeModifier.prototype.initModifierProperties = function () {
    }, ShapeModifier.prototype.addShape = function (t) {
        this.closed || this.shapes.push({shape: t, last: []})
    }, ShapeModifier.prototype.init = function (t, e, s) {
        this.elem = t, this.frameId = -1, this.shapes = [], this.dynamicProperties = [], this.mdf = !1, this.closed = !1, this.k = !1, this.isTrimming = !1, this.comp = t.comp, this.initModifierProperties(t, e), this.dynamicProperties.length ? (this.k = !0, s.push(this)) : this.getValue(!0)
    }, extendPrototype(ShapeModifier, TrimModifier), TrimModifier.prototype.processKeys = function (t) {
        if (this.elem.globalData.frameId !== this.frameId || t) {
            this.mdf = t ? !0 : !1, this.frameId = this.elem.globalData.frameId;
            var e, s = this.dynamicProperties.length;
            for (e = 0; s > e; e += 1) this.dynamicProperties[e].getValue(), this.dynamicProperties[e].mdf && (this.mdf = !0);
            if (this.mdf || t) {
                var r = this.o.v % 360 / 360;
                0 > r && (r += 1);
                var i = this.s.v + r, a = this.e.v + r;
                if (i > a) {
                    var n = i;
                    i = a, a = n
                }
                this.sValue = i, this.eValue = a, this.oValue = r
            }
        }
    }, TrimModifier.prototype.initModifierProperties = function (t, e) {
        this.sValue = 0, this.eValue = 0, this.oValue = 0, this.getValue = this.processKeys, this.s = PropertyFactory.getProp(t, e.s, 0, .01, this.dynamicProperties), this.e = PropertyFactory.getProp(t, e.e, 0, .01, this.dynamicProperties), this.o = PropertyFactory.getProp(t, e.o, 0, 0, this.dynamicProperties), this.dynamicProperties.length || this.getValue(!0)
    }, TrimModifier.prototype.getSegmentsLength = function (t) {
        var e, s = t.c, r = t.v, i = t.o, a = t.i, n = r.length, o = [], h = 0;
        for (e = 0; n - 1 > e; e += 1) o[e] = bez.getBezierLength(r[e], r[e + 1], i[e], a[e + 1]), h += o[e].addedLength;
        return s && (o[e] = bez.getBezierLength(r[e], r[0], i[e], a[0]), h += o[e].addedLength), {
            lengths: o,
            totalLength: h
        }
    }, TrimModifier.prototype.processShapes = function () {
        var t, e, s, r, i, a, n, o = this.shapes.length, h = this.sValue, l = this.eValue, p = 0;
        if (l === h) for (e = 0; o > e; e += 1) this.shapes[e].shape.paths = [], this.shapes[e].shape.mdf = !0; else {
            var m, f = [], d = [];
            for (e = 0; o > e; e += 1) if (m = this.shapes[e], m.shape.mdf || this.mdf) {
                for (t = m.shape.paths, m.shape.mdf = !0, r = t.length, i = [], n = 0, s = 0; r > s; s += 1) a = this.getSegmentsLength(t[s]), i.push(a), n += a.totalLength;
                m.totalShapeLength = n, m.pathsData = i, p += n
            } else m.shape.paths = m.last;
            for (e = 0; o > e; e += 1) if (m = this.shapes[e], m.shape.mdf) {
                f.length = 0, 1 >= l ? f.push({
                    s: m.totalShapeLength * h,
                    e: m.totalShapeLength * l
                }) : h >= 1 ? f.push({
                    s: m.totalShapeLength * (h - 1),
                    e: m.totalShapeLength * (l - 1)
                }) : (f.push({s: m.totalShapeLength * h, e: m.totalShapeLength}), f.push({
                    s: 0,
                    e: m.totalShapeLength * (l - 1)
                }));
                var c, u = this.addShapes(m, f[0]);
                d.push(u), f.length > 1 && (m.shape.closed ? this.addShapes(m, f[1], u) : (u.i[0] = [u.v[0][0], u.v[0][1]], c = u.v.length - 1, u.o[c] = [u.v[c][0], u.v[c][1]], u = this.addShapes(m, f[1]), d.push(u))), u.i[0] = [u.v[0][0], u.v[0][1]], c = u.v.length - 1, u.o[c] = [u.v[c][0], u.v[c][1]], m.last = d, m.shape.paths = d
            }
        }
        this.dynamicProperties.length || (this.mdf = !1)
    }, TrimModifier.prototype.addSegment = function (t, e, s, r, i, a) {
        i.o[a] = e, i.i[a + 1] = s, i.v[a + 1] = r, i.v[a] = t
    }, TrimModifier.prototype.addShapes = function (t, e, s) {
        var r, i, a, n, o, h, l, p = t.pathsData, m = t.shape.paths, f = m.length, d = 0;
        for (s ? o = s.v.length - 1 : (s = {c: !1, v: [], i: [], o: []}, o = 0), r = 0; f > r; r += 1) {
            for (h = p[r].lengths, a = m[r].c ? h.length : h.length + 1, i = 1; a > i; i += 1) if (n = h[i - 1], d + n.addedLength < e.s) d += n.addedLength; else {
                if (d > e.e) break;
                e.s <= d && e.e >= d + n.addedLength ? this.addSegment(m[r].v[i - 1], m[r].o[i - 1], m[r].i[i], m[r].v[i], s, o) : (l = bez.getNewSegment(m[r].v[i - 1], m[r].v[i], m[r].o[i - 1], m[r].i[i], (e.s - d) / n.addedLength, (e.e - d) / n.addedLength, h[i - 1]), this.addSegment(l.pt1, l.pt3, l.pt4, l.pt2, s, o)), d += n.addedLength, o += 1
            }
            if (m[r].c && d <= e.e) {
                var c = h[i - 1].addedLength;
                e.s <= d && e.e >= d + c ? this.addSegment(m[r].v[i - 1], m[r].o[i - 1], m[r].i[0], m[r].v[0], s, o) : (l = bez.getNewSegment(m[r].v[i - 1], m[r].v[0], m[r].o[i - 1], m[r].i[0], (e.s - d) / c, (e.e - d) / c, h[i - 1]), this.addSegment(l.pt1, l.pt3, l.pt4, l.pt2, s, o))
            }
        }
        return s
    }, ShapeModifiers.registerModifier("tm", TrimModifier), extendPrototype(ShapeModifier, RoundCornersModifier), RoundCornersModifier.prototype.processKeys = function (t) {
        if (this.elem.globalData.frameId !== this.frameId || t) {
            this.mdf = t ? !0 : !1, this.frameId = this.elem.globalData.frameId;
            var e, s = this.dynamicProperties.length;
            for (e = 0; s > e; e += 1) this.dynamicProperties[e].getValue(), this.dynamicProperties[e].mdf && (this.mdf = !0)
        }
    }, RoundCornersModifier.prototype.initModifierProperties = function (t, e) {
        this.getValue = this.processKeys, this.rd = PropertyFactory.getProp(t, e.r, 0, null, this.dynamicProperties), this.dynamicProperties.length || this.getValue(!0)
    }, RoundCornersModifier.prototype.processPath = function (t, e) {
        var s, r, i, a, n, o, h, l, p, m, f = t.v.length, d = [], c = [], u = [];
        for (s = 0; f > s; s += 1) r = t.v[s], a = t.o[s], i = t.i[s], r[0] === a[0] && r[1] === a[1] && r[0] === i[0] && r[1] === i[1] ? 0 !== s && s !== f - 1 || t.c ? (n = 0 === s ? t.v[f - 1] : t.v[s - 1], p = Math.sqrt(Math.pow(r[0] - n[0], 2) + Math.pow(r[1] - n[1], 2)), m = Math.min(p / 2, e) / p, o = [r[0] + (n[0] - r[0]) * m, r[1] - (r[1] - n[1]) * m], l = o, h = [o[0] - (o[0] - r[0]) * roundCorner, o[1] - (o[1] - r[1]) * roundCorner], d.push(o), c.push(h), u.push(l), n = s === f - 1 ? t.v[0] : t.v[s + 1], p = Math.sqrt(Math.pow(r[0] - n[0], 2) + Math.pow(r[1] - n[1], 2)), m = Math.min(p / 2, e) / p, o = [r[0] + (n[0] - r[0]) * m, r[1] + (n[1] - r[1]) * m], l = [o[0] - (o[0] - r[0]) * roundCorner, o[1] - (o[1] - r[1]) * roundCorner], h = o, d.push(o), c.push(h), u.push(l)) : (d.push(r), c.push(a), u.push(i)) : (d.push(t.v[s]), c.push(t.o[s]), u.push(t.i[s]));
        return {v: d, o: c, i: u, c: t.c}
    }, RoundCornersModifier.prototype.processShapes = function () {
        var t, e, s, r, i = this.shapes.length, a = this.rd.v;
        if (0 !== a) {
            var n, o = [];
            for (e = 0; i > e; e += 1) if (n = this.shapes[e], n.shape.mdf || this.mdf) {
                for (n.shape.mdf = !0, t = n.shape.paths, r = t.length, s = 0; r > s; s += 1) o.push(this.processPath(t[s], a));
                n.shape.paths = o, n.last = o
            } else n.shape.paths = n.last
        }
        this.dynamicProperties.length || (this.mdf = !1)
    }, ShapeModifiers.registerModifier("rd", RoundCornersModifier), SVGRenderer.prototype.createItem = function (t, e, s, r) {
        switch (t.ty) {
            case 2:
                return this.createImage(t, e, s, r);
            case 0:
                return this.createComp(t, e, s, r);
            case 1:
                return this.createSolid(t, e, s, r);
            case 4:
                return this.createShape(t, e, s, r);
            case 5:
                return this.createText(t, e, s, r);
            case 99:
                return this.createPlaceHolder(t, e)
        }
        return this.createBase(t, e, s)
    }, SVGRenderer.prototype.buildItems = function (t, e, s, r, i) {
        var a, n = t.length;
        s || (s = this.elements), e || (e = this.animationItem.container), r || (r = this);
        var o;
        for (a = n - 1; a >= 0; a--) s[a] = this.createItem(t[a], e, r, i), 0 === t[a].ty && (o = [], this.buildItems(t[a].layers, s[a].getDomElement(), o, s[a], s[a].placeholder), s[a].setElements(o)), t[a].td && s[a + 1].setMatte(s[a].layerId)
    }, SVGRenderer.prototype.includeLayers = function (t, e, s) {
        var r, i = t.length;
        s || (s = this.elements), e || (e = this.animationItem.container);
        var a, n, o, h = s.length;
        for (r = 0; i > r; r += 1) for (a = 0; h > a;) {
            if (s[a].data.id == t[r].id) {
                o = s[a], s[a] = this.createItem(t[r], e, this, o), 0 === t[r].ty && (n = [], this.buildItems(t[r].layers, s[a].getDomElement(), n, s[a], s[r].placeholder), s[a].setElements(n));
                break
            }
            a += 1
        }
        for (r = 0; i > r; r += 1) t[r].td && s[r + 1].setMatte(s[r].layerId)
    }, SVGRenderer.prototype.createBase = function (t, e, s, r) {
        return new SVGBaseElement(t, e, this.globalData, s, r)
    }, SVGRenderer.prototype.createPlaceHolder = function (t, e) {
        return new PlaceHolderElement(t, e, this.globalData)
    }, SVGRenderer.prototype.createShape = function (t, e, s, r) {
        return new IShapeElement(t, e, this.globalData, s, r)
    }, SVGRenderer.prototype.createText = function (t, e, s, r) {
        return new SVGTextElement(t, e, this.globalData, s, r)
    }, SVGRenderer.prototype.createImage = function (t, e, s, r) {
        return new IImageElement(t, e, this.globalData, s, r)
    }, SVGRenderer.prototype.createComp = function (t, e, s, r) {
        return new ICompElement(t, e, this.globalData, s, r)
    }, SVGRenderer.prototype.createSolid = function (t, e, s, r) {
        return new ISolidElement(t, e, this.globalData, s, r)
    }, SVGRenderer.prototype.configAnimation = function (t) {
        this.animationItem.container = document.createElementNS(svgNS, "svg"), this.animationItem.container.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.animationItem.container.setAttribute("width", t.w), this.animationItem.container.setAttribute("height", t.h), this.animationItem.container.setAttribute("viewBox", "0 0 " + t.w + " " + t.h), this.animationItem.container.setAttribute("preserveAspectRatio", this.renderConfig.preserveAspectRatio), this.animationItem.container.style.width = "100%", this.animationItem.container.style.height = "100%", this.animationItem.container.style.transform = "translate3d(0,0,0)", this.animationItem.container.style.transformOrigin = this.animationItem.container.style.mozTransformOrigin = this.animationItem.container.style.webkitTransformOrigin = this.animationItem.container.style["-webkit-transform"] = "0px 0px 0px",
            this.animationItem.wrapper.appendChild(this.animationItem.container);
        var e = document.createElementNS(svgNS, "defs");
        this.globalData.defs = e, this.animationItem.container.appendChild(e), this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem), this.globalData.getPath = this.animationItem.getPath.bind(this.animationItem), this.globalData.elementLoaded = this.animationItem.elementLoaded.bind(this.animationItem), this.globalData.frameId = 0, this.globalData.compSize = {
            w: t.w,
            h: t.h
        }, this.globalData.frameRate = t.fr;
        var s = document.createElementNS(svgNS, "clipPath"), r = document.createElementNS(svgNS, "rect");
        r.setAttribute("width", t.w), r.setAttribute("height", t.h), r.setAttribute("x", 0), r.setAttribute("y", 0);
        var i = "animationMask_" + randomString(10);
        s.setAttribute("id", i), s.appendChild(r);
        var a = document.createElementNS(svgNS, "g");
        a.setAttribute("clip-path", "url(#" + i + ")"), this.animationItem.container.appendChild(a), e.appendChild(s), this.animationItem.container = a, this.layers = t.layers, this.globalData.fontManager = new FontManager, this.globalData.fontManager.addChars(t.chars), this.globalData.fontManager.addFonts(t.fonts, e)
    }, SVGRenderer.prototype.buildStage = function (t, e, s) {
        var r, i, a = e.length;
        for (s || (s = this.elements), r = a - 1; r >= 0; r--) i = e[r], void 0 !== i.parent && this.buildItemParenting(i, s[r], e, i.parent, s, !0), 0 === i.ty && this.buildStage(s[r].getComposingElement(), i.layers, s[r].getElements())
    }, SVGRenderer.prototype.buildItemParenting = function (t, e, s, r, i, a) {
        t.parents || (t.parents = []), a && e.resetHierarchy();
        for (var n = 0, o = s.length; o > n;) s[n].ind == r && (e.getHierarchy().push(i[n]), void 0 !== s[n].parent && this.buildItemParenting(t, e, s, s[n].parent, i, !1)), n += 1
    }, SVGRenderer.prototype.destroy = function () {
        this.animationItem.wrapper.innerHTML = "", this.animationItem.container = null, this.globalData.defs = null;
        var t, e = this.layers.length;
        for (t = 0; e > t; t++) this.elements[t].destroy();
        this.elements.length = 0, this.destroyed = !0
    }, SVGRenderer.prototype.updateContainerSize = function () {
    }, SVGRenderer.prototype.renderFrame = function (t) {
        if (this.renderedFrame != t && !this.destroyed) {
            null === t ? t = this.renderedFrame : this.renderedFrame = t, this.globalData.frameNum = t, this.globalData.frameId += 1;
            var e, s = this.layers.length;
            for (e = s - 1; e >= 0; e--) this.elements[e].prepareFrame(t - this.layers[e].st);
            for (e = s - 1; e >= 0; e--) this.elements[e].renderFrame()
        }
    }, SVGRenderer.prototype.hide = function () {
        this.animationItem.container.style.display = "none"
    }, SVGRenderer.prototype.show = function () {
        this.animationItem.container.style.display = "block"
    }, CanvasRenderer.prototype.createItem = function (t, e, s) {
        switch (t.ty) {
            case 0:
                return this.createComp(t, e, s);
            case 1:
                return this.createSolid(t, e, s);
            case 2:
                return this.createImage(t, e, s);
            case 4:
                return this.createShape(t, e, s);
            case 5:
                return this.createText(t, e, s);
            case 99:
                return this.createPlaceHolder(t, e, s);
            default:
                return this.createBase(t, e, s)
        }
        return this.createBase(t, e, s)
    }, CanvasRenderer.prototype.buildItems = function (t, e, s) {
        e || (e = this.elements), s || (s = this);
        var r, i = t.length;
        for (r = 0; i > r; r++) if (e[r] = this.createItem(t[r], s, s.globalData), 0 === t[r].ty) {
            var a = [];
            this.buildItems(t[r].layers, a, e[r], s.globalData), e[e.length - 1].setElements(a)
        }
    }, CanvasRenderer.prototype.includeLayers = function (t, e, s) {
        var r, i = t.length;
        s || (s = this.elements);
        var a, n, o = s.length;
        for (r = 0; i > r; r += 1) for (a = 0; o > a;) {
            if (s[a].data.id == t[r].id) {
                s[a] = this.createItem(t[r], this), 0 === t[r].ty && (n = [], this.buildItems(t[r].layers, n, s[a]), s[a].setElements(n));
                break
            }
            a += 1
        }
    }, CanvasRenderer.prototype.createBase = function (t, e, s) {
        return new CVBaseElement(t, e, s)
    }, CanvasRenderer.prototype.createShape = function (t, e, s) {
        return new CVShapeElement(t, e, s)
    }, CanvasRenderer.prototype.createText = function (t, e, s) {
        return new CVTextElement(t, e, s)
    }, CanvasRenderer.prototype.createPlaceHolder = function (t, e) {
        return new PlaceHolderElement(t, null, e)
    }, CanvasRenderer.prototype.createImage = function (t, e, s) {
        return new CVImageElement(t, e, s)
    }, CanvasRenderer.prototype.createComp = function (t, e, s) {
        return new CVCompElement(t, e, s)
    }, CanvasRenderer.prototype.createSolid = function (t, e, s) {
        return new CVSolidElement(t, e, s)
    }, CanvasRenderer.prototype.ctxTransform = function (t) {
        if (1 !== t[0] || 0 !== t[1] || 0 !== t[4] || 1 !== t[5] || 0 !== t[12] || 0 !== t[13]) {
            if (!this.renderConfig.clearCanvas) return void this.canvasContext.transform(t[0], t[1], t[4], t[5], t[12], t[13]);
            this.transformMat.cloneFromProps(t), this.transformMat.transform(this.contextData.cTr.props[0], this.contextData.cTr.props[1], this.contextData.cTr.props[2], this.contextData.cTr.props[3], this.contextData.cTr.props[4], this.contextData.cTr.props[5], this.contextData.cTr.props[6], this.contextData.cTr.props[7], this.contextData.cTr.props[8], this.contextData.cTr.props[9], this.contextData.cTr.props[10], this.contextData.cTr.props[11], this.contextData.cTr.props[12], this.contextData.cTr.props[13], this.contextData.cTr.props[14], this.contextData.cTr.props[15]), this.contextData.cTr.cloneFromProps(this.transformMat.props);
            var e = this.contextData.cTr.props;
            this.canvasContext.setTransform(e[0], e[1], e[4], e[5], e[12], e[13])
        }
    }, CanvasRenderer.prototype.ctxOpacity = function (t) {
        if (1 !== t) {
            if (!this.renderConfig.clearCanvas) return void(this.canvasContext.globalAlpha *= 0 > t ? 0 : t);
            this.contextData.cO *= 0 > t ? 0 : t, this.canvasContext.globalAlpha = this.contextData.cO
        }
    }, CanvasRenderer.prototype.reset = function () {
        return this.renderConfig.clearCanvas ? (this.contextData.cArrPos = 0, this.contextData.cTr.reset(), void(this.contextData.cO = 1)) : void this.canvasContext.restore()
    }, CanvasRenderer.prototype.save = function (t) {
        if (!this.renderConfig.clearCanvas) return void this.canvasContext.save();
        t && this.canvasContext.save();
        var e = this.contextData.cTr.props;
        (null === this.contextData.saved[this.contextData.cArrPos] || void 0 === this.contextData.saved[this.contextData.cArrPos]) && (this.contextData.saved[this.contextData.cArrPos] = new Array(16));
        var s, r = this.contextData.saved[this.contextData.cArrPos];
        for (s = 0; 16 > s; s += 1) r[s] = e[s];
        this.contextData.savedOp[this.contextData.cArrPos] = this.contextData.cO, this.contextData.cArrPos += 1
    }, CanvasRenderer.prototype.restore = function (t) {
        if (!this.renderConfig.clearCanvas) return void this.canvasContext.restore();
        t && this.canvasContext.restore(), this.contextData.cArrPos -= 1;
        var e, s = this.contextData.saved[this.contextData.cArrPos], r = this.contextData.cTr.props;
        for (e = 0; 16 > e; e += 1) r[e] = s[e];
        this.canvasContext.setTransform(s[0], s[1], s[4], s[5], s[12], s[13]), s = this.contextData.savedOp[this.contextData.cArrPos], this.contextData.cO = s, this.canvasContext.globalAlpha = s
    }, CanvasRenderer.prototype.configAnimation = function (t) {
        this.animationItem.wrapper ? (this.animationItem.container = document.createElement("canvas"), this.animationItem.container.style.width = "100%", this.animationItem.container.style.height = "100%", this.animationItem.container.style.transformOrigin = this.animationItem.container.style.mozTransformOrigin = this.animationItem.container.style.webkitTransformOrigin = this.animationItem.container.style["-webkit-transform"] = "0px 0px 0px", this.animationItem.wrapper.appendChild(this.animationItem.container), this.canvasContext = this.animationItem.container.getContext("2d")) : this.canvasContext = this.renderConfig.context, this.globalData.canvasContext = this.canvasContext, this.globalData.renderer = this, this.globalData.isDashed = !1, this.globalData.totalFrames = Math.floor(t.tf), this.globalData.compWidth = t.w, this.globalData.compHeight = t.h, this.globalData.frameRate = t.fr, this.globalData.frameId = 0, this.globalData.compSize = {
            w: t.w,
            h: t.h
        }, this.layers = t.layers, this.transformCanvas = {}, this.transformCanvas.w = t.w, this.transformCanvas.h = t.h, this.globalData.fontManager = new FontManager, this.globalData.fontManager.addChars(t.chars), this.globalData.fontManager.addFonts(t.fonts, document)
    }, CanvasRenderer.prototype.updateContainerSize = function () {
        var t, e;
        if (this.animationItem.wrapper && this.animationItem.container ? (t = this.animationItem.wrapper.offsetWidth, e = this.animationItem.wrapper.offsetHeight, this.animationItem.container.setAttribute("width", t * this.renderConfig.dpr), this.animationItem.container.setAttribute("height", e * this.renderConfig.dpr)) : (t = this.canvasContext.canvas.width * this.renderConfig.dpr, e = this.canvasContext.canvas.height * this.renderConfig.dpr), "fit" == this.renderConfig.scaleMode) {
            var s = t / e, r = this.transformCanvas.w / this.transformCanvas.h;
            r > s ? (this.transformCanvas.sx = t / (this.transformCanvas.w / this.renderConfig.dpr), this.transformCanvas.sy = t / (this.transformCanvas.w / this.renderConfig.dpr), this.transformCanvas.tx = 0, this.transformCanvas.ty = (e - this.transformCanvas.h * (t / this.transformCanvas.w)) / 2 * this.renderConfig.dpr) : (this.transformCanvas.sx = e / (this.transformCanvas.h / this.renderConfig.dpr), this.transformCanvas.sy = e / (this.transformCanvas.h / this.renderConfig.dpr), this.transformCanvas.tx = (t - this.transformCanvas.w * (e / this.transformCanvas.h)) / 2 * this.renderConfig.dpr, this.transformCanvas.ty = 0)
        } else this.transformCanvas.sx = this.renderConfig.dpr, this.transformCanvas.sy = this.renderConfig.dpr, this.transformCanvas.tx = 0, this.transformCanvas.ty = 0;
        this.transformCanvas.props = [this.transformCanvas.sx, 0, 0, 0, 0, this.transformCanvas.sy, 0, 0, 0, 0, 1, 0, this.transformCanvas.tx, this.transformCanvas.ty, 0, 1];
        var i, a = this.elements.length;
        for (i = 0; a > i; i += 1) 0 === this.elements[i].data.ty && this.elements[i].resize(this.transformCanvas)
    }, CanvasRenderer.prototype.buildStage = function (t, e, s) {
        s || (s = this.elements);
        var r, i, a = e.length;
        for (r = a - 1; r >= 0; r--) i = e[r], void 0 !== i.parent && this.buildItemHierarchy(i, s[r], e, i.parent, s, !0), 0 == i.ty && this.buildStage(null, i.layers, s[r].getElements());
        this.updateContainerSize()
    }, CanvasRenderer.prototype.buildItemHierarchy = function (t, e, s, r, i, a) {
        var n = 0, o = s.length;
        for (a && e.resetHierarchy(); o > n;) s[n].ind === r && (e.getHierarchy().push(i[n]), void 0 !== s[n].parent && this.buildItemHierarchy(t, e, s, s[n].parent, i, !1)), n += 1
    }, CanvasRenderer.prototype.destroy = function () {
        this.renderConfig.clearCanvas && (this.animationItem.wrapper.innerHTML = "");
        var t, e = this.layers.length;
        for (t = e - 1; t >= 0; t -= 1) this.elements[t].destroy();
        this.elements.length = 0, this.globalData.canvasContext = null, this.animationItem.container = null, this.destroyed = !0
    }, CanvasRenderer.prototype.renderFrame = function (t) {
        if (!(this.renderedFrame == t && this.renderConfig.clearCanvas === !0 || this.destroyed || null === t)) {
            this.renderedFrame = t, this.globalData.frameNum = t - this.animationItem.firstFrame, this.globalData.frameId += 1, this.renderConfig.clearCanvas === !0 ? (this.reset(), this.canvasContext.save(), this.canvasContext.clearRect(this.transformCanvas.tx, this.transformCanvas.ty, this.transformCanvas.w * this.transformCanvas.sx, this.transformCanvas.h * this.transformCanvas.sy)) : this.save(), this.ctxTransform(this.transformCanvas.props), this.canvasContext.beginPath(), this.canvasContext.rect(0, 0, this.transformCanvas.w, this.transformCanvas.h), this.canvasContext.closePath(), this.canvasContext.clip();
            var e, s = this.layers.length;
            for (e = 0; s > e; e++) this.elements[e].prepareFrame(t - this.layers[e].st);
            for (e = s - 1; e >= 0; e -= 1) this.elements[e].renderFrame();
            this.renderConfig.clearCanvas !== !0 ? this.restore() : this.canvasContext.restore()
        }
    }, CanvasRenderer.prototype.hide = function () {
        this.animationItem.container.style.display = "none"
    }, CanvasRenderer.prototype.show = function () {
        this.animationItem.container.style.display = "block"
    }, HybridRenderer.prototype.createItem = function (t, e, s, r) {
        switch (t.ty) {
            case 2:
                return this.createImage(t, e, s, r);
            case 0:
                return this.createComp(t, e, s, r);
            case 1:
                return this.createSolid(t, e, s, r);
            case 4:
                return this.createShape(t, e, s, r);
            case 5:
                return this.createText(t, e, s, r);
            case 13:
                return this.createCamera(t, e, s, r);
            case 99:
                return this.createPlaceHolder(t, e)
        }
        return this.createBase(t, e, s)
    }, HybridRenderer.prototype.buildItems = function (t, e, s, r, i) {
        var a, n = t.length;
        s || (s = this.elements), r || (r = this);
        var o, h, l = !1;
        for (a = n - 1; a >= 0; a--) e ? s[a] = this.createItem(t[a], e, r, i) : t[a].ddd ? (l || (l = !0, o = this.getThreeDContainer()), s[a] = this.createItem(t[a], o, r, i)) : (l = !1, s[a] = this.createItem(t[a], this.animationItem.resizerElem, r, i)), 0 === t[a].ty && (h = [], this.buildItems(t[a].layers, s[a].getDomElement(), h, s[a], s[a].placeholder), s[a].setElements(h)), t[a].td && s[a + 1].setMatte(s[a].layerId);
        if (this.currentContainer = this.animationItem.resizerElem, !e && this.threeDElements.length) if (this.camera) this.camera.setup(); else {
            var p = this.globalData.compSize.w, m = this.globalData.compSize.h;
            for (n = this.threeDElements.length, a = 0; n > a; a += 1) this.threeDElements[0][a].style.perspective = this.threeDElements[0][a].style.webkitPerspective = Math.sqrt(Math.pow(p, 2) + Math.pow(m, 2)) + "px"
        }
    }, HybridRenderer.prototype.includeLayers = function (t, e, s) {
        var r, i = t.length;
        s || (s = this.elements), e || (e = this.currentContainer);
        var a, n, o, h = s.length;
        for (r = 0; i > r; r += 1) if (t[r].id) for (a = 0; h > a;) s[a].data.id == t[r].id && (o = s[a], s[a] = this.createItem(t[r], e, this, o), 0 === t[r].ty && (n = [], this.buildItems(t[r].layers, s[a].getDomElement(), n, s[a], s[r].placeholder), s[a].setElements(n))), a += 1; else {
            var l = this.createItem(t[r], e, this);
            s.push(l), 0 === t[r].ty && (n = [], this.buildItems(t[r].layers, l.getDomElement(), n, l), l.setElements(n))
        }
        for (r = 0; i > r; r += 1) t[r].td && s[r + 1].setMatte(s[r].layerId)
    }, HybridRenderer.prototype.createBase = function (t, e, s, r) {
        return new SVGBaseElement(t, e, this.globalData, s, r)
    }, HybridRenderer.prototype.createPlaceHolder = function (t, e) {
        return new PlaceHolderElement(t, e, this.globalData)
    }, HybridRenderer.prototype.createShape = function (t, e, s, r) {
        return s.isSvg ? new IShapeElement(t, e, this.globalData, s, r) : new HShapeElement(t, e, this.globalData, s, r)
    }, HybridRenderer.prototype.createText = function (t, e, s, r) {
        return s.isSvg ? new SVGTextElement(t, e, this.globalData, s, r) : new HTextElement(t, e, this.globalData, s, r)
    }, HybridRenderer.prototype.createCamera = function (t, e, s, r) {
        return this.camera = new HCameraElement(t, e, this.globalData, s, r), this.camera
    }, HybridRenderer.prototype.createImage = function (t, e, s, r) {
        return s.isSvg ? new IImageElement(t, e, this.globalData, s, r) : new HImageElement(t, e, this.globalData, s, r)
    }, HybridRenderer.prototype.createComp = function (t, e, s, r) {
        return s.isSvg ? new ICompElement(t, e, this.globalData, s, r) : new HCompElement(t, e, this.globalData, s, r)
    }, HybridRenderer.prototype.createSolid = function (t, e, s, r) {
        return s.isSvg ? new ISolidElement(t, e, this.globalData, s, r) : new HSolidElement(t, e, this.globalData, s, r)
    }, HybridRenderer.prototype.getThreeDContainer = function () {
        var t = document.createElement("div");
        styleDiv(t), t.style.width = this.globalData.compSize.w + "px", t.style.height = this.globalData.compSize.h + "px", t.style.transformOrigin = t.style.mozTransformOrigin = t.style.webkitTransformOrigin = "50% 50%";
        var e = document.createElement("div");
        return styleDiv(e), e.style.transform = e.style.webkitTransform = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)", t.appendChild(e), this.animationItem.resizerElem.appendChild(t), this.threeDElements.push([t, e]), e
    }, HybridRenderer.prototype.configAnimation = function (t) {
        var e = document.createElement("div"), s = this.animationItem.wrapper;
        e.style.width = t.w + "px", e.style.height = t.h + "px", this.animationItem.resizerElem = e, styleDiv(e), e.style.transformStyle = e.style.webkitTransformStyle = e.style.mozTransformStyle = "flat", s.appendChild(e), e.style.overflow = "hidden";
        var r = document.createElementNS(svgNS, "svg");
        r.setAttribute("width", "1"), r.setAttribute("height", "1"), styleDiv(r), this.animationItem.resizerElem.appendChild(r);
        var i = document.createElementNS(svgNS, "defs");
        r.appendChild(i), this.globalData.defs = i, this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem), this.globalData.getPath = this.animationItem.getPath.bind(this.animationItem), this.globalData.elementLoaded = this.animationItem.elementLoaded.bind(this.animationItem), this.globalData.frameId = 0, this.globalData.compSize = {
            w: t.w,
            h: t.h
        }, this.globalData.frameRate = t.fr, this.layers = t.layers, this.globalData.fontManager = new FontManager, this.globalData.fontManager.addChars(t.chars), this.globalData.fontManager.addFonts(t.fonts, r), this.updateContainerSize()
    }, HybridRenderer.prototype.buildStage = function (t, e, s) {
        var r, i, a = e.length;
        for (s || (s = this.elements), r = a - 1; r >= 0; r--) i = e[r], void 0 !== i.parent && this.buildItemParenting(i, s[r], e, i.parent, s, !0), 0 === i.ty && this.buildStage(s[r].getComposingElement(), i.layers, s[r].getElements())
    }, HybridRenderer.prototype.buildItemParenting = function (t, e, s, r, i, a) {
        t.parents || (t.parents = []), a && e.resetHierarchy();
        for (var n = 0, o = s.length; o > n;) s[n].ind == r && (e.getHierarchy().push(i[n]), 13 === e.data.ty && i[n].finalTransform.mProp.setInverted(), void 0 !== s[n].parent && this.buildItemParenting(t, e, s, s[n].parent, i, !1)), n += 1
    }, HybridRenderer.prototype.destroy = function () {
        this.animationItem.wrapper.innerHTML = "", this.animationItem.container = null, this.globalData.defs = null;
        var t, e = this.layers.length;
        for (t = 0; e > t; t++) this.elements[t].destroy();
        this.elements.length = 0, this.destroyed = !0
    }, HybridRenderer.prototype.updateContainerSize = function () {
        var t, e, s, r, i = this.animationItem.wrapper.offsetWidth, a = this.animationItem.wrapper.offsetHeight,
            n = i / a, o = this.globalData.compSize.w / this.globalData.compSize.h;
        o > n ? (t = i / this.globalData.compSize.w, e = i / this.globalData.compSize.w, s = 0, r = (a - this.globalData.compSize.h * (i / this.globalData.compSize.w)) / 2) : (t = a / this.globalData.compSize.h, e = a / this.globalData.compSize.h, s = (i - this.globalData.compSize.w * (a / this.globalData.compSize.h)) / 2, r = 0), this.animationItem.resizerElem.style.transform = this.animationItem.resizerElem.style.webkitTransform = "matrix3d(" + t + ",0,0,0,0," + e + ",0,0,0,0,1,0," + s + "," + r + ",0,1)"
    }, HybridRenderer.prototype.renderFrame = function (t) {
        if (this.renderedFrame != t && !this.destroyed) {
            null === t ? t = this.renderedFrame : this.renderedFrame = t, this.globalData.frameNum = t, this.globalData.frameId += 1;
            var e, s = this.layers.length;
            for (e = 0; s > e; e++) this.elements[e].prepareFrame(t - this.layers[e].st);
            for (e = 0; s > e; e++) this.elements[e].renderFrame()
        }
    }, HybridRenderer.prototype.hide = function () {
        this.animationItem.resizerElem.style.display = "none"
    }, HybridRenderer.prototype.show = function () {
        this.animationItem.resizerElem.style.display = "block"
    }, MaskElement.prototype.getMaskProperty = function (t) {
        return this.viewData[t].prop
    }, MaskElement.prototype.prepareFrame = function () {
        var t, e = this.dynamicProperties.length;
        for (t = 0; e > t; t += 1) this.dynamicProperties[t].getValue()
    }, MaskElement.prototype.renderFrame = function () {
        var t, e = this.masksProperties.length;
        for (t = 0; e > t; t++) if ("n" !== this.masksProperties[t].mode && this.masksProperties[t].cl !== !1 && ((this.viewData[t].prop.mdf || this.firstFrame) && this.drawPath(this.masksProperties[t], this.viewData[t].prop.v, this.viewData[t]), this.storedData[t].x && (this.storedData[t].x.mdf || this.firstFrame))) {
            var s = this.storedData[t].expan;
            this.storedData[t].x.v < 0 ? ("erode" !== this.storedData[t].lastOperator && (this.storedData[t].lastOperator = "erode", this.storedData[t].elem.setAttribute("filter", "url(#" + this.storedData[t].filterId + ")")), s.setAttribute("radius", -this.storedData[t].x.v)) : ("dilate" !== this.storedData[t].lastOperator && (this.storedData[t].lastOperator = "dilate", this.storedData[t].elem.setAttribute("filter", null)), this.storedData[t].elem.setAttribute("stroke-width", 2 * this.storedData[t].x.v))
        }
        this.firstFrame = !1
    }, MaskElement.prototype.getMaskelement = function () {
        return this.maskElement
    }, MaskElement.prototype.createLayerSolidPath = function () {
        var t = "M0,0 ";
        return t += " h" + this.globalData.compSize.w, t += " v" + this.globalData.compSize.h, t += " h-" + this.globalData.compSize.w, t += " v-" + this.globalData.compSize.h + " "
    }, MaskElement.prototype.drawPath = function (t, e, s) {
        var r, i, a = "";
        for (i = e.v.length, r = 1; i > r; r += 1) 1 == r && (a += " M" + bm_rnd(e.v[0][0]) + "," + bm_rnd(e.v[0][1])), a += " C" + bm_rnd(e.o[r - 1][0]) + "," + bm_rnd(e.o[r - 1][1]) + " " + bm_rnd(e.i[r][0]) + "," + bm_rnd(e.i[r][1]) + " " + bm_rnd(e.v[r][0]) + "," + bm_rnd(e.v[r][1]);
        t.cl && (a += " C" + bm_rnd(e.o[r - 1][0]) + "," + bm_rnd(e.o[r - 1][1]) + " " + bm_rnd(e.i[0][0]) + "," + bm_rnd(e.i[0][1]) + " " + bm_rnd(e.v[0][0]) + "," + bm_rnd(e.v[0][1])), s.lastPath !== a && (t.inv ? s.elem.setAttribute("d", this.solidPath + a) : s.elem.setAttribute("d", a), s.lastPath = a)
    }, MaskElement.prototype.getMask = function (t) {
        for (var e = 0, s = this.masksProperties.length; s > e;) {
            if (this.masksProperties[e].nm === t) return {maskPath: this.viewData[e].prop.pv};
            e += 1
        }
    }, MaskElement.prototype.destroy = function () {
        this.element = null, this.globalData = null, this.maskElement = null, this.data = null, this.paths = null, this.masksProperties = null
    }, BaseElement.prototype.checkMasks = function () {
        if (!this.data.hasMask) return !1;
        for (var t = 0, e = this.data.masksProperties.length; e > t;) {
            if ("n" !== this.data.masksProperties[t].mode && this.data.masksProperties[t].cl !== !1) return !0;
            t += 1
        }
        return !1
    }, BaseElement.prototype.prepareFrame = function (t) {
        this.data.ip - this.data.st <= t && this.data.op - this.data.st > t ? this.isVisible !== !0 && (this.globalData.mdf = !0, this.isVisible = !0, this.firstFrame = !0, this.data.hasMask && (this.maskManager.firstFrame = !0)) : this.isVisible !== !1 && (this.globalData.mdf = !0, this.isVisible = !1);
        var e, s = this.dynamicProperties.length;
        for (e = 0; s > e; e += 1) this.dynamicProperties[e].getValue(), this.dynamicProperties[e].mdf && (this.globalData.mdf = !0);
        return this.data.hasMask && this.maskManager.prepareFrame(t * this.data.sr), this.currentFrameNum = t * this.data.sr, this.isVisible
    }, BaseElement.prototype.setBlendMode = function () {
        var t = "";
        switch (this.data.bm) {
            case 1:
                t = "multiply";
                break;
            case 2:
                t = "screen";
                break;
            case 3:
                t = "overlay";
                break;
            case 4:
                t = "darken";
                break;
            case 5:
                t = "lighten";
                break;
            case 6:
                t = "color-dodge";
                break;
            case 7:
                t = "color-burn";
                break;
            case 8:
                t = "hard-light";
                break;
            case 9:
                t = "soft-light";
                break;
            case 10:
                t = "difference";
                break;
            case 11:
                t = "exclusion";
                break;
            case 12:
                t = "hue";
                break;
            case 13:
                t = "saturation";
                break;
            case 14:
                t = "color";
                break;
            case 15:
                t = "luminosity"
        }
        this.layerElement.style["mix-blend-mode"] = t
    }, BaseElement.prototype.init = function () {
        this.data.sr || (this.data.sr = 1), this.dynamicProperties = [], this.data.ef && expressionsPlugin && (this.effectsManager = expressionsPlugin.getEffectsManager(this.data, this, this.dynamicProperties), this.effect = this.effectsManager.bind(this.effectsManager)), this.hidden = !1, this.firstFrame = !0, this.isVisible = !1, this.currentFrameNum = -99999, this.lastNum = -99999, 11 === this.data.ty || (this.finalTransform = {
            mProp: PropertyFactory.getProp(this, this.data.ks, 2, null, this.dynamicProperties),
            matMdf: !1,
            opMdf: !1,
            mat: new Matrix,
            opacity: 1
        }, this.finalTransform.op = this.finalTransform.mProp.o, this.transform = this.finalTransform.mProp, this.createElements(), this.data.hasMask && this.addMasks(this.data))
    }, BaseElement.prototype.getType = function () {
        return this.type
    }, BaseElement.prototype.resetHierarchy = function () {
        this.hierarchy ? this.hierarchy.length = 0 : this.hierarchy = []
    }, BaseElement.prototype.getHierarchy = function () {
        return this.hierarchy || (this.hierarchy = []), this.hierarchy
    }, BaseElement.prototype.getLayerSize = function () {
        return 5 === this.data.ty ? {w: this.data.textData.width, h: this.data.textData.height} : {
            w: this.data.width,
            h: this.data.height
        }
    }, BaseElement.prototype.hide = function () {
    }, BaseElement.prototype.mHelper = new Matrix, createElement(BaseElement, SVGBaseElement), SVGBaseElement.prototype.appendNodeToParent = function (t) {
        if (this.placeholder) {
            var e = this.placeholder.phElement;
            e.parentNode.insertBefore(t, e)
        } else this.parentContainer.appendChild(t)
    }, SVGBaseElement.prototype.createElements = function () {
        if (this.data.td) {
            if (3 == this.data.td) this.layerElement = document.createElementNS(svgNS, "mask"), this.layerElement.setAttribute("id", this.layerId), this.layerElement.setAttribute("mask-type", "luminance"), this.globalData.defs.appendChild(this.layerElement); else if (2 == this.data.td) {
                var t = document.createElementNS(svgNS, "mask");
                t.setAttribute("id", this.layerId), t.setAttribute("mask-type", "alpha");
                var e = document.createElementNS(svgNS, "g");
                t.appendChild(e), this.layerElement = document.createElementNS(svgNS, "g");
                var s = document.createElementNS(svgNS, "filter"), r = randomString(10);
                s.setAttribute("id", r), s.setAttribute("filterUnits", "objectBoundingBox"), s.setAttribute("x", "0%"), s.setAttribute("y", "0%"), s.setAttribute("width", "100%"), s.setAttribute("height", "100%");
                var i = document.createElementNS(svgNS, "feComponentTransfer");
                i.setAttribute("in", "SourceGraphic"), s.appendChild(i);
                var a = document.createElementNS(svgNS, "feFuncA");
                a.setAttribute("type", "table"), a.setAttribute("tableValues", "1.0 0.0"), i.appendChild(a), this.globalData.defs.appendChild(s);
                var n = document.createElementNS(svgNS, "rect");
                n.setAttribute("width", "100%"), n.setAttribute("height", "100%"), n.setAttribute("x", "0"), n.setAttribute("y", "0"), n.setAttribute("fill", "#ffffff"), n.setAttribute("opacity", "0"), e.setAttribute("filter", "url(#" + r + ")"), e.appendChild(n), e.appendChild(this.layerElement), this.globalData.defs.appendChild(t)
            } else {
                this.layerElement = document.createElementNS(svgNS, "g");
                var o = document.createElementNS(svgNS, "mask");
                o.setAttribute("id", this.layerId), o.setAttribute("mask-type", "alpha"), o.appendChild(this.layerElement), this.globalData.defs.appendChild(o)
            }
            this.data.hasMask && (this.maskedElement = this.layerElement)
        } else this.data.hasMask ? (this.layerElement = document.createElementNS(svgNS, "g"), this.data.tt ? (this.matteElement = document.createElementNS(svgNS, "g"), this.matteElement.appendChild(this.layerElement), this.appendNodeToParent(this.matteElement)) : this.appendNodeToParent(this.layerElement), this.maskedElement = this.layerElement) : this.data.tt ? (this.matteElement = document.createElementNS(svgNS, "g"), this.matteElement.setAttribute("id", this.layerId), this.appendNodeToParent(this.matteElement), this.layerElement = this.matteElement) : this.layerElement = this.parentContainer;
        !this.data.ln && !this.data.cl || 4 !== this.data.ty && 0 !== this.data.ty || (this.layerElement === this.parentContainer && (this.layerElement = document.createElementNS(svgNS, "g"), this.appendNodeToParent(this.layerElement)), this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.data.cl && this.layerElement.setAttribute("class", this.data.cl)), 0 !== this.data.ty || !this.finalTransform.op.k && 1 === this.finalTransform.op.p || this.layerElement !== this.parentContainer || (this.layerElement = document.createElementNS(svgNS, "g"), this.appendNodeToParent(this.layerElement)), 0 !== this.data.bm && (this.layerElement === this.parentContainer && (this.layerElement = document.createElementNS(svgNS, "g"), this.appendNodeToParent(this.layerElement)), this.setBlendMode()), this.layerElement !== this.parentContainer && (this.placeholder = null)
    }, SVGBaseElement.prototype.setBlendMode = BaseElement.prototype.setBlendMode, SVGBaseElement.prototype.renderFrame = function (t) {
        if (3 === this.data.ty) return !1;
        if (!this.isVisible) return this.isVisible;
        this.lastNum = this.currentFrameNum, this.data.hasMask && this.maskManager.renderFrame(), this.finalTransform.opMdf = this.finalTransform.op.mdf, this.finalTransform.matMdf = this.finalTransform.mProp.mdf, this.finalTransform.opacity = this.finalTransform.op.v, this.firstFrame && (this.finalTransform.opMdf = !0, this.finalTransform.matMdf = !0);
        var e, s = this.finalTransform.mat;
        if (this.hierarchy) {
            var r, i = this.hierarchy.length;
            for (e = this.finalTransform.mProp.v.props, s.cloneFromProps(e), r = 0; i > r; r += 1) this.finalTransform.matMdf = this.hierarchy[r].finalTransform.mProp.mdf ? !0 : this.finalTransform.matMdf, e = this.hierarchy[r].finalTransform.mProp.v.props, s.transform(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15])
        } else this.isVisible && (t ? (e = this.finalTransform.mProp.v.props, s.cloneFromProps(e)) : s.cloneFromProps(this.finalTransform.mProp.v.props));
        return t && (e = t.mat.props, s.transform(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]), this.finalTransform.opacity *= t.opacity, this.finalTransform.opMdf = t.opMdf ? !0 : this.finalTransform.opMdf, this.finalTransform.matMdf = t.matMdf ? !0 : this.finalTransform.matMdf), this.data.hasMask ? (this.finalTransform.matMdf && this.layerElement.setAttribute("transform", s.to2dCSS()), this.finalTransform.opMdf && this.layerElement.setAttribute("opacity", this.finalTransform.opacity)) : 0 === this.data.ty && this.finalTransform.opMdf && (this.finalTransform.op.k || 1 !== this.finalTransform.op.p) && (this.layerElement.setAttribute("opacity", this.finalTransform.opacity), this.finalTransform.opacity = 1), this.isVisible
    },SVGBaseElement.prototype.destroy = function () {
        this.layerElement = null, this.parentContainer = null, this.matteElement && (this.matteElement = null), this.maskManager && this.maskManager.destroy()
    },SVGBaseElement.prototype.getDomElement = function () {
        return this.layerElement
    },SVGBaseElement.prototype.addMasks = function (t) {
        this.maskManager = new MaskElement(t, this, this.globalData)
    },SVGBaseElement.prototype.setMatte = function (t) {
        this.matteElement && this.matteElement.setAttribute("mask", "url(#" + t + ")")
    },SVGBaseElement.prototype.hide = function () {
    },ITextElement.prototype.init = function () {
        this._parent.init.call(this), this.lettersChangedFlag = !1;
        var t = this.data;
        this.renderedLetters = Array.apply(null, {length: t.t.d.l.length}), this.viewData = {m: {a: PropertyFactory.getProp(this, t.t.m.a, 1, 0, this.dynamicProperties)}};
        var e = this.data.t;
        if (e.a.length) {
            this.viewData.a = Array.apply(null, {length: e.a.length});
            var s, r, i, a = e.a.length;
            for (s = 0; a > s; s += 1) i = e.a[s], r = {
                a: {},
                s: {}
            }, "r" in i.a && (r.a.r = PropertyFactory.getProp(this, i.a.r, 0, degToRads, this.dynamicProperties)), "rx" in i.a && (r.a.rx = PropertyFactory.getProp(this, i.a.rx, 0, degToRads, this.dynamicProperties)), "ry" in i.a && (r.a.ry = PropertyFactory.getProp(this, i.a.ry, 0, degToRads, this.dynamicProperties)), "sk" in i.a && (r.a.sk = PropertyFactory.getProp(this, i.a.sk, 0, degToRads, this.dynamicProperties)), "sa" in i.a && (r.a.sa = PropertyFactory.getProp(this, i.a.sa, 0, degToRads, this.dynamicProperties)), "s" in i.a && (r.a.s = PropertyFactory.getProp(this, i.a.s, 1, .01, this.dynamicProperties)), "a" in i.a && (r.a.a = PropertyFactory.getProp(this, i.a.a, 1, 0, this.dynamicProperties)), "o" in i.a && (r.a.o = PropertyFactory.getProp(this, i.a.o, 0, .01, this.dynamicProperties)), "p" in i.a && (r.a.p = PropertyFactory.getProp(this, i.a.p, 1, 0, this.dynamicProperties)), "sw" in i.a && (r.a.sw = PropertyFactory.getProp(this, i.a.sw, 0, 0, this.dynamicProperties)), "sc" in i.a && (r.a.sc = PropertyFactory.getProp(this, i.a.sc, 1, 0, this.dynamicProperties)), "fc" in i.a && (r.a.fc = PropertyFactory.getProp(this, i.a.fc, 1, 0, this.dynamicProperties)), "fh" in i.a && (r.a.fh = PropertyFactory.getProp(this, i.a.fh, 0, 0, this.dynamicProperties)), "fs" in i.a && (r.a.fs = PropertyFactory.getProp(this, i.a.fs, 0, .01, this.dynamicProperties)), "fb" in i.a && (r.a.fb = PropertyFactory.getProp(this, i.a.fb, 0, .01, this.dynamicProperties)), "t" in i.a && (r.a.t = PropertyFactory.getProp(this, i.a.t, 0, 0, this.dynamicProperties)), r.s = PropertyFactory.getTextSelectorProp(this, i.s, this.dynamicProperties), r.s.t = i.s.t, this.viewData.a[s] = r
        } else this.viewData.a = [];
        e.p && "m" in e.p ? (this.viewData.p = {
            f: PropertyFactory.getProp(this, e.p.f, 0, 0, this.dynamicProperties),
            l: PropertyFactory.getProp(this, e.p.l, 0, 0, this.dynamicProperties),
            r: e.p.r,
            m: this.maskManager.getMaskProperty(e.p.m)
        }, this.maskPath = !0) : this.maskPath = !1
    },ITextElement.prototype.createPathShape = function (t, e) {
        var s, r, i, a, n = e.length, o = "";
        for (s = 0; n > s; s += 1) {
            for (i = e[s].ks.k.i.length, a = e[s].ks.k, r = 1; i > r; r += 1) 1 == r && (o += " M" + t.applyToPointStringified(a.v[0][0], a.v[0][1])), o += " C" + t.applyToPointStringified(a.o[r - 1][0], a.o[r - 1][1]) + " " + t.applyToPointStringified(a.i[r][0], a.i[r][1]) + " " + t.applyToPointStringified(a.v[r][0], a.v[r][1]);
            o += " C" + t.applyToPointStringified(a.o[r - 1][0], a.o[r - 1][1]) + " " + t.applyToPointStringified(a.i[0][0], a.i[0][1]) + " " + t.applyToPointStringified(a.v[0][0], a.v[0][1]), o += "z"
        }
        return o
    },ITextElement.prototype.getMeasures = function () {
        var t, e, s, r, i = this.mHelper, a = this.renderType, n = this.data, o = n.t.d, h = o.l;
        if (this.maskPath) {
            var l = this.viewData.p.m;
            if (!this.viewData.p.n || this.viewData.p.mdf) {
                var p = l.v;
                this.viewData.p.r && (p = reversePath(p, l.closed));
                var m = {tLength: 0, segments: []};
                r = p.v.length - 1;
                var f, d = 0;
                for (s = 0; r > s; s += 1) f = {
                    s: p.v[s],
                    e: p.v[s + 1],
                    to: [p.o[s][0] - p.v[s][0], p.o[s][1] - p.v[s][1]],
                    ti: [p.i[s + 1][0] - p.v[s + 1][0], p.i[s + 1][1] - p.v[s + 1][1]]
                }, bez.buildBezierData(f), m.tLength += f.bezierData.segmentLength, m.segments.push(f), d += f.bezierData.segmentLength;
                s = r, l.closed && (f = {
                    s: p.v[s],
                    e: p.v[0],
                    to: [p.o[s][0] - p.v[s][0], p.o[s][1] - p.v[s][1]],
                    ti: [p.i[0][0] - p.v[0][0], p.i[0][1] - p.v[0][1]]
                }, bez.buildBezierData(f), m.tLength += f.bezierData.segmentLength, m.segments.push(f), d += f.bezierData.segmentLength), this.viewData.p.pi = m
            }
            var c, u, y, m = this.viewData.p.pi, g = this.viewData.p.f.v, v = 0, b = 1, P = 0, E = !0, k = m.segments;
            if (0 > g && l.closed) for (m.tLength < Math.abs(g) && (g = -Math.abs(g) % m.tLength), v = k.length - 1, y = k[v].bezierData.points, b = y.length - 1; 0 > g;) g += y[b].partialLength, b -= 1, 0 > b && (v -= 1, y = k[v].bezierData.points, b = y.length - 1);
            y = k[v].bezierData.points, u = y[b - 1], c = y[b];
            var S, x, C = c.partialLength;

        }
        r = h.length, t = 0, e = 0;
        var M, D, w, T, F, I = 1.2 * n.t.d.s * .714, A = !0, V = this.viewData, _ = Array.apply(null, {length: r});
        this.lettersChangedFlag = !1, T = V.a.length;
        var N, B, L, R, H, z, O, j, G, W, q, X, Y, Z, J, U, K = -1, Q = g, $ = v, tt = b, et = -1, st = 0;
        for (s = 0; r > s; s += 1) if (i.reset(), z = 1, h[s].n) t = 0, e += o.yOffset, e += A ? 1 : 0, g = Q, A = !1, st = 0, this.maskPath && (v = $, b = tt, y = k[v].bezierData.points, u = y[b - 1], c = y[b], C = c.partialLength, P = 0), _[s] = this.emptyProp; else {
            if (this.maskPath) {
                if (et !== h[s].line) {
                    switch (o.j) {
                        case 1:
                            g += d - o.lineWidths[h[s].line];
                            break;
                        case 2:
                            g += (d - o.lineWidths[h[s].line]) / 2
                    }
                    et = h[s].line
                }
                K !== h[s].ind && (h[K] && (g += h[K].extra), g += h[s].an / 2, K = h[s].ind), g += V.m.a.v[0] * h[s].an / 200;
                var rt = 0;
                for (w = 0; T > w; w += 1) M = V.a[w].a, "p" in M && (D = V.a[w].s, B = D.getMult(h[s].anIndexes[w], n.t.a[w].s.totalChars), rt += B.length ? M.p.v[0] * B[0] : M.p.v[0] * B);
                for (E = !0; E;) P + C >= g + rt || !y ? (S = (g + rt - P) / c.partialLength, R = u.point[0] + (c.point[0] - u.point[0]) * S, H = u.point[1] + (c.point[1] - u.point[1]) * S, i.translate(0, -(V.m.a.v[1] * I / 100) + e), E = !1) : y && (P += c.partialLength, b += 1, b >= y.length && (b = 0, v += 1, k[v] ? y = k[v].bezierData.points : l.closed ? (b = 0, v = 0, y = k[v].bezierData.points) : (P -= c.partialLength, y = null)), y && (u = c, c = y[b], C = c.partialLength));
                L = h[s].an / 2 - h[s].add, i.translate(-L, 0, 0)
            } else L = h[s].an / 2 - h[s].add, i.translate(-L, 0, 0), i.translate(-V.m.a.v[0] * h[s].an / 200, -V.m.a.v[1] * I / 100, 0);
            for (st += h[s].l / 2, w = 0; T > w; w += 1) M = V.a[w].a, "t" in M && (D = V.a[w].s, B = D.getMult(h[s].anIndexes[w], n.t.a[w].s.totalChars), this.maskPath ? g += B.length ? M.t * B[0] : M.t * B : t += B.length ? M.t.v * B[0] : M.t.v * B);
            for (st += h[s].l / 2, o.strokeWidthAnim && (j = n.t.d.sw || 0), o.strokeColorAnim && (O = n.t.d.sc ? [n.t.d.sc[0], n.t.d.sc[1], n.t.d.sc[2]] : [0, 0, 0]), o.fillColorAnim && (G = [n.t.d.fc[0], n.t.d.fc[1], n.t.d.fc[2]]), w = 0; T > w; w += 1) M = V.a[w].a, "a" in M && (D = V.a[w].s, B = D.getMult(h[s].anIndexes[w], n.t.a[w].s.totalChars), B.length ? i.translate(-M.a.v[0] * B[0], -M.a.v[1] * B[1], M.a.v[2] * B[2]) : i.translate(-M.a.v[0] * B, -M.a.v[1] * B, M.a.v[2] * B));
            for (w = 0; T > w; w += 1) M = V.a[w].a, "s" in M && (D = V.a[w].s, B = D.getMult(h[s].anIndexes[w], n.t.a[w].s.totalChars), B.length ? i.scale(1 + (M.s.v[0] - 1) * B[0], 1 + (M.s.v[1] - 1) * B[1], 1) : i.scale(1 + (M.s.v[0] - 1) * B, 1 + (M.s.v[1] - 1) * B, 1));
            for (w = 0; T > w; w += 1) {
                if (M = V.a[w].a, D = V.a[w].s, B = D.getMult(h[s].anIndexes[w], n.t.a[w].s.totalChars), "sk" in M && (B.length ? i.skewFromAxis(-M.sk.v * B[0], M.sa.v * B[1]) : i.skewFromAxis(-M.sk.v * B, M.sa.v * B)), "r" in M && i.rotateZ(B.length ? -M.r.v * B[2] : -M.r.v * B), "ry" in M && i.rotateY(B.length ? M.ry.v * B[1] : M.ry.v * B), "rx" in M && i.rotateX(B.length ? M.rx.v * B[0] : M.rx.v * B), "o" in M && (z += B.length ? (M.o.v * B[0] - z) * B[0] : (M.o.v * B - z) * B), o.strokeWidthAnim && "sw" in M && (j += B.length ? M.sw.v * B[0] : M.sw.v * B), o.strokeColorAnim && "sc" in M) for (W = 0; 3 > W; W += 1) O[W] = Math.round(B.length ? 255 * (O[W] + (M.sc.v[W] - O[W]) * B[0]) : 255 * (O[W] + (M.sc.v[W] - O[W]) * B));
                if (o.fillColorAnim) {
                    if ("fc" in M) for (W = 0; 3 > W; W += 1) G[W] = B.length ? G[W] + (M.fc.v[W] - G[W]) * B[0] : G[W] + (M.fc.v[W] - G[W]) * B;
                    "fh" in M && (G = B.length ? addHueToRGB(G, M.fh.v * B[0]) : addHueToRGB(G, M.fh.v * B)), "fs" in M && (G = B.length ? addSaturationToRGB(G, M.fs.v * B[0]) : addSaturationToRGB(G, M.fs.v * B)), "fb" in M && (G = B.length ? addBrightnessToRGB(G, M.fb.v * B[0]) : addBrightnessToRGB(G, M.fb.v * B))
                }
            }
            for (w = 0; T > w; w += 1) M = V.a[w].a, "p" in M && (D = V.a[w].s, B = D.getMult(h[s].anIndexes[w], n.t.a[w].s.totalChars), this.maskPath ? B.length ? i.translate(0, M.p.v[1] * B[0], -M.p.v[2] * B[1]) : i.translate(0, M.p.v[1] * B, -M.p.v[2] * B) : B.length ? i.translate(M.p.v[0] * B[0], M.p.v[1] * B[1], -M.p.v[2] * B[2]) : i.translate(M.p.v[0] * B, M.p.v[1] * B, -M.p.v[2] * B));
            if (o.strokeWidthAnim && (q = 0 > j ? 0 : j), o.strokeColorAnim && (X = "rgb(" + Math.round(255 * O[0]) + "," + Math.round(255 * O[1]) + "," + Math.round(255 * O[2]) + ")"), o.fillColorAnim && (Y = "rgb(" + Math.round(255 * G[0]) + "," + Math.round(255 * G[1]) + "," + Math.round(255 * G[2]) + ")"), this.maskPath) {
                if (n.t.p.p) {
                    x = (c.point[1] - u.point[1]) / (c.point[0] - u.point[0]);
                    var it = 180 * Math.atan(x) / Math.PI;
                    c.point[0] < u.point[0] && (it += 180), i.rotate(-it * Math.PI / 180)
                }
                i.translate(R, H, 0), i.translate(V.m.a.v[0] * h[s].an / 200, V.m.a.v[1] * I / 100, 0), g -= V.m.a.v[0] * h[s].an / 200, h[s + 1] && K !== h[s + 1].ind && (g += h[s].an / 2, g += o.tr / 1e3 * n.t.d.s)
            } else {
                switch (i.translate(t, e, 0), o.ps && i.translate(o.ps[0], o.ps[1] + o.ascent, 0), o.j) {
                    case 1:
                        i.translate(o.justifyOffset + (o.boxWidth - o.lineWidths[h[s].line]), 0, 0);
                        break;
                    case 2:
                        i.translate(o.justifyOffset + (o.boxWidth - o.lineWidths[h[s].line]) / 2, 0, 0)
                }
                i.translate(L, 0, 0), i.translate(V.m.a.v[0] * h[s].an / 200, V.m.a.v[1] * I / 100, 0), t += h[s].l + o.tr / 1e3 * n.t.d.s
            }
            "html" === a ? Z = i.toCSS() : "svg" === a ? Z = i.to2dCSS() : J = [i.props[0], i.props[1], i.props[2], i.props[3], i.props[4], i.props[5], i.props[6], i.props[7], i.props[8], i.props[9], i.props[10], i.props[11], i.props[12], i.props[13], i.props[14], i.props[15]], U = z, N = this.renderedLetters[s], !N || N.o === U && N.sw === q && N.sc === X && N.fc === Y ? "svg" !== a && "html" !== a || N && N.m === Z ? "canvas" !== a || N && N.props[0] === J[0] && N.props[1] === J[1] && N.props[4] === J[4] && N.props[5] === J[5] && N.props[12] === J[12] && N.props[13] === J[13] ? F = N : (this.lettersChangedFlag = !0, F = new LetterProps(U, q, X, Y, null, J)) : (this.lettersChangedFlag = !0, F = new LetterProps(U, q, X, Y, Z)) : (this.lettersChangedFlag = !0, F = new LetterProps(U, q, X, Y, Z, J)), this.renderedLetters[s] = F
        }
    },ITextElement.prototype.emptyProp = new LetterProps,createElement(SVGBaseElement, SVGTextElement),SVGTextElement.prototype.init = ITextElement.prototype.init,SVGTextElement.prototype.createPathShape = ITextElement.prototype.createPathShape,SVGTextElement.prototype.getMeasures = ITextElement.prototype.getMeasures,SVGTextElement.prototype.createElements = function () {
        this._parent.createElements.call(this);
        var t = this.data.t.d;
        this.innerElem = document.createElementNS(svgNS, "g"), t.fc ? this.innerElem.setAttribute("fill", "rgb(" + Math.round(255 * t.fc[0]) + "," + Math.round(255 * t.fc[1]) + "," + Math.round(255 * t.fc[2]) + ")") : this.innerElem.setAttribute("fill", "rgba(0,0,0,0)"), t.sc && (this.innerElem.setAttribute("stroke", "rgb(" + Math.round(255 * t.sc[0]) + "," + Math.round(255 * t.sc[1]) + "," + Math.round(255 * t.sc[2]) + ")"), this.innerElem.setAttribute("stroke-width", t.sw)), this.innerElem.setAttribute("font-size", t.s);
        var e = this.globalData.fontManager.getFontByName(t.f);
        if (e.fClass) this.innerElem.setAttribute("class", e.fClass); else {
            this.innerElem.setAttribute("font-family", e.fFamily);
            var s = t.fWeight, r = t.fStyle;
            this.innerElem.setAttribute("font-style", r), this.innerElem.setAttribute("font-weight", s)
        }
        var i, a;
        this.layerElement === this.parentContainer ? this.appendNodeToParent(this.innerElem) : this.layerElement.appendChild(this.innerElem);
        var n = t.l;
        if (a = n.length) {
            var o, h, l = this.mHelper, p = "", m = this.data.singleShape;
            if (m) var f = 0, d = 0, c = t.lineWidths, u = t.boxWidth, y = !0;
            for (i = 0; a > i; i += 1) {
                if (this.globalData.fontManager.chars ? m && 0 !== i || (o = document.createElementNS(svgNS, "path")) : o = document.createElementNS(svgNS, "text"), o.setAttribute("stroke-linecap", "butt"), o.setAttribute("stroke-linejoin", "round"), o.setAttribute("stroke-miterlimit", "4"), m && n[i].n && (f = 0, d += t.yOffset, d += y ? 1 : 0, y = !1), l.reset(), this.globalData.fontManager.chars && l.scale(t.s / 100, t.s / 100), m) {
                    switch (t.ps && l.translate(t.ps[0], t.ps[1] + t.ascent, 0), t.j) {
                        case 1:
                            l.translate(t.justifyOffset + (u - c[n[i].line]), 0, 0);
                            break;
                        case 2:
                            l.translate(t.justifyOffset + (u - c[n[i].line]) / 2, 0, 0)
                    }
                    l.translate(f, d, 0)
                }
                if (this.globalData.fontManager.chars) {
                    var g,
                        v = this.globalData.fontManager.getCharData(t.t.charAt(i), e.fStyle, this.globalData.fontManager.getFontByName(t.f).fFamily);
                    g = v ? v.data : null, g && g.shapes && (h = g.shapes[0].it, m || (p = ""), p += this.createPathShape(l, h), m || o.setAttribute("d", p)), m || this.innerElem.appendChild(o)
                } else o.textContent = n[i].val, o.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve"), this.innerElem.appendChild(o), m && o.setAttribute("transform", l.to2dCSS());
                m && (f += n[i].l), this.textSpans.push(o)
            }
            this.data.ln && this.innerElem.setAttribute("id", this.data.ln), this.data.cl && this.innerElem.setAttribute("class", this.data.cl), m && this.globalData.fontManager.chars && (o.setAttribute("d", p), this.innerElem.appendChild(o))
        }
    },SVGTextElement.prototype.hide = function () {
        this.hidden || (this.innerElem.style.display = "none", this.hidden = !0)
    },SVGTextElement.prototype.renderFrame = function (t) {
        var e = this._parent.renderFrame.call(this, t);
        if (e === !1) return void this.hide();
        if (this.hidden && (this.hidden = !1, this.innerElem.style.display = "block"), this.data.hasMask || (this.finalTransform.matMdf && this.innerElem.setAttribute("transform", this.finalTransform.mat.to2dCSS()), this.finalTransform.opMdf && this.innerElem.setAttribute("opacity", this.finalTransform.opacity)), !this.data.singleShape && (this.getMeasures(), this.lettersChangedFlag)) {
            var s, r, i = this.renderedLetters, a = this.data.t.d.l;
            r = a.length;
            var n;
            for (s = 0; r > s; s += 1) a[s].n || (n = i[s], this.textSpans[s].setAttribute("transform", n.m), this.textSpans[s].setAttribute("opacity", n.o), n.sw && this.textSpans[s].setAttribute("stroke-width", n.sw), n.sc && this.textSpans[s].setAttribute("stroke", n.sc), n.fc && this.textSpans[s].setAttribute("fill", n.fc));
            this.firstFrame && (this.firstFrame = !1)
        }
    },SVGTextElement.prototype.destroy = function () {
        this._parent.destroy.call(), this.innerElem = null
    };
    var PlaceHolderElement = function (t, e, s) {
        if (this.data = t, this.globalData = s, e) {
            this.parentContainer = e;
            var r = document.createElementNS(svgNS, "g");
            r.setAttribute("id", this.data.id), e.appendChild(r), this.phElement = r
        }
        this.layerId = "ly_" + randomString(10)
    };
    PlaceHolderElement.prototype.prepareFrame = function () {
    }, PlaceHolderElement.prototype.renderFrame = function () {
    }, PlaceHolderElement.prototype.draw = function () {
    }, createElement(SVGBaseElement, ICompElement), ICompElement.prototype.getComposingElement = function () {
        return this.layerElement
    }, ICompElement.prototype.hide = function () {
        if (!this.hidden) {
            var t, e = this.elements.length;
            for (t = 0; e > t; t += 1) this.elements[t].hide();
            this.hidden = !0
        }
    }, ICompElement.prototype.prepareFrame = function (t) {
        if (this._parent.prepareFrame.call(this, t), this.isVisible !== !1) {
            var e = t;
            this.tm && (e = this.tm.v, e === this.data.op && (e = this.data.op - 1)), this.renderedFrame = e / this.data.sr;
            var s, r = this.elements.length;
            for (s = 0; r > s; s += 1) this.elements[s].prepareFrame(e / this.data.sr - this.layers[s].st)
        }
    }, ICompElement.prototype.renderFrame = function (t) {
        var e, s = this._parent.renderFrame.call(this, t), r = this.layers.length;
        if (s === !1) return void this.hide();
        for (this.hidden = !1, e = 0; r > e; e += 1) this.data.hasMask ? this.elements[e].renderFrame() : this.elements[e].renderFrame(this.finalTransform);
        this.firstFrame && (this.firstFrame = !1)
    }, ICompElement.prototype.setElements = function (t) {
        this.elements = t
    }, ICompElement.prototype.getElements = function () {
        return this.elements
    }, ICompElement.prototype.destroy = function () {
        this._parent.destroy.call();
        var t, e = this.layers.length;
        for (t = 0; e > t; t += 1) this.elements[t].destroy()
    }, createElement(SVGBaseElement, IImageElement), IImageElement.prototype.createElements = function () {
        var t = this, e = function () {
            t.innerElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", t.path + t.assetData.p), t.maskedElement = t.innerElem
        }, s = new Image;
        s.addEventListener("load", e, !1), s.addEventListener("error", e, !1), s.src = this.path + this.assetData.p, this._parent.createElements.call(this), this.innerElem = document.createElementNS(svgNS, "image"), this.innerElem.setAttribute("width", this.assetData.w + "px"), this.innerElem.setAttribute("height", this.assetData.h + "px"), this.layerElement === this.parentContainer ? this.appendNodeToParent(this.innerElem) : this.layerElement.appendChild(this.innerElem), this.data.ln && this.innerElem.setAttribute("id", this.data.ln), this.data.cl && this.innerElem.setAttribute("class", this.data.cl)
    }, IImageElement.prototype.hide = function () {
        this.hidden || (this.innerElem.setAttribute("visibility", "hidden"), this.hidden = !0)
    }, IImageElement.prototype.renderFrame = function (t) {
        var e = this._parent.renderFrame.call(this, t);
        return e === !1 ? void this.hide() : (this.hidden && (this.hidden = !1, this.innerElem.setAttribute("visibility", "visible")), this.data.hasMask || ((this.finalTransform.matMdf || this.firstFrame) && this.innerElem.setAttribute("transform", this.finalTransform.mat.to2dCSS()), (this.finalTransform.opMdf || this.firstFrame) && this.innerElem.setAttribute("opacity", this.finalTransform.opacity)), void(this.firstFrame && (this.firstFrame = !1)))
    }, IImageElement.prototype.destroy = function () {
        this._parent.destroy.call(), this.innerElem = null
    }, createElement(SVGBaseElement, IShapeElement), IShapeElement.prototype.lcEnum = {
        1: "butt",
        2: "round",
        3: "butt"
    }, IShapeElement.prototype.ljEnum = {
        1: "miter",
        2: "round",
        3: "butt"
    }, IShapeElement.prototype.buildExpressionInterface = function () {
    }, IShapeElement.prototype.transformHelper = {
        opacity: 1,
        mat: new Matrix,
        matMdf: !1,
        opMdf: !1
    }, IShapeElement.prototype.createElements = function () {
        this._parent.createElements.call(this), this.searchShapes(this.shapesData, this.viewData, this.dynamicProperties), this.layerElement.appendChild(this.shapesContainer), styleUnselectableDiv(this.layerElement), styleUnselectableDiv(this.shapesContainer)
    }, IShapeElement.prototype.searchShapes = function (t, e, s) {
        var r, i, a, n = t.length - 1, o = [], h = [];
        for (r = n; r >= 0; r -= 1) if ("fl" == t[r].ty || "st" == t[r].ty) {
            e[r] = {};
            var l;
            if (e[r].c = PropertyFactory.getProp(this, t[r].c, 1, 255, s), e[r].o = PropertyFactory.getProp(this, t[r].o, 0, .01, s), "st" == t[r].ty) {
                if (l = document.createElementNS(svgNS, "g"), l.setAttribute("stroke-linecap", this.lcEnum[t[r].lc] || "round"), l.setAttribute("stroke-linejoin", this.ljEnum[t[r].lj] || "round"), l.setAttribute("fill-opacity", "0"), 1 == t[r].lj && l.setAttribute("stroke-miterlimit", t[r].ml), e[r].c.k || l.setAttribute("stroke", "rgb(" + e[r].c.v[0] + "," + e[r].c.v[1] + "," + e[r].c.v[2] + ")"), e[r].o.k || l.setAttribute("stroke-opacity", e[r].o.v), e[r].w = PropertyFactory.getProp(this, t[r].w, 0, null, s), e[r].w.k || l.setAttribute("stroke-width", e[r].w.v), t[r].d) {
                    var p = PropertyFactory.getDashProp(this, t[r].d, "svg", s);
                    p.k || (l.setAttribute("stroke-dasharray", p.dasharray), l.setAttribute("stroke-dashoffset", p.dashoffset)), e[r].d = p
                }
            } else l = document.createElementNS(svgNS, "path"), e[r].c.k || l.setAttribute("fill", "rgb(" + e[r].c.v[0] + "," + e[r].c.v[1] + "," + e[r].c.v[2] + ")"), e[r].o.k || l.setAttribute("fill-opacity", e[r].o.v);
            t[r].ln && l.setAttribute("id", t[r].ln), t[r].cl && l.setAttribute("class", t[r].cl), this.shapesContainer.appendChild(l), this.stylesList.push({
                pathElement: l,
                type: t[r].ty,
                d: "",
                ld: "",
                mdf: !1
            }), e[r].style = this.stylesList[this.stylesList.length - 1], o.push(e[r].style)
        } else if ("gr" == t[r].ty) e[r] = {it: []}, this.searchShapes(t[r].it, e[r].it, s); else if ("tr" == t[r].ty) e[r] = {
            transform: {
                mat: new Matrix,
                opacity: 1,
                matMdf: !1,
                opMdf: !1,
                op: PropertyFactory.getProp(this, t[r].o, 0, .01, s),
                mProps: PropertyFactory.getProp(this, t[r], 2, null, s)
            }, elements: []
        }; else if ("sh" == t[r].ty || "rc" == t[r].ty || "el" == t[r].ty || "sr" == t[r].ty) {
            e[r] = {elements: [], styles: [], lStr: ""};
            var m = 4;
            "rc" == t[r].ty ? m = 5 : "el" == t[r].ty ? m = 6 : "sr" == t[r].ty && (m = 7), e[r].sh = ShapePropertyFactory.getShapeProp(this, t[r], m, s), this.shapes.push(e[r].sh), this.addShapeToModifiers(e[r].sh), a = this.stylesList.length;
            var f, d = !1, c = !1;
            for (i = 0; a > i; i += 1) this.stylesList[i].closed || ("st" === this.stylesList[i].type ? (d = !0, f = document.createElementNS(svgNS, "path"), this.stylesList[i].pathElement.appendChild(f), e[r].elements.push({
                ty: this.stylesList[i].type,
                el: f
            })) : (c = !0, e[r].elements.push({ty: this.stylesList[i].type, st: this.stylesList[i]})));
            e[r].st = d, e[r].fl = c
        } else if ("tm" == t[r].ty || "rd" == t[r].ty) {
            var u = ShapeModifiers.getModifier(t[r].ty);
            u.init(this, t[r], s), this.shapeModifiers.push(u), h.push(u), e[r] = u
        }
        for (n = o.length, r = 0; n > r; r += 1) o[r].closed = !0;
        for (n = h.length, r = 0; n > r; r += 1) h[r].closed = !0
    }, IShapeElement.prototype.addShapeToModifiers = function (t) {
        var e, s = this.shapeModifiers.length;
        for (e = 0; s > e; e += 1) this.shapeModifiers[e].addShape(t)
    }, IShapeElement.prototype.renderModifiers = function () {
        if (this.shapeModifiers.length) {
            var t, e = this.shapes.length;
            for (t = 0; e > t; t += 1) this.shapes[t].reset();
            for (e = this.shapeModifiers.length, t = e - 1; t >= 0; t -= 1) this.shapeModifiers[t].processShapes()
        }
    }, IShapeElement.prototype.renderFrame = function (t) {
        var e = this._parent.renderFrame.call(this, t);
        return e === !1 ? void this.hide() : (this.hidden = !1, this.finalTransform.matMdf && !this.data.hasMask && this.shapesContainer.setAttribute("transform", this.finalTransform.mat.to2dCSS()), this.transformHelper.opacity = this.finalTransform.opacity, this.transformHelper.matMdf = !1, this.transformHelper.opMdf = this.finalTransform.opMdf, this.renderModifiers(), void this.renderShape(this.transformHelper, null, null, !0))
    }, IShapeElement.prototype.hide = function () {
        if (!this.hidden) {
            var t, e = this.stylesList.length;
            for (t = e - 1; t >= 0; t -= 1) "0" !== this.stylesList[t].ld && (this.stylesList[t].ld = "0", this.stylesList[t].pathElement.style.display = "none", this.stylesList[t].pathElement.parentNode && (this.stylesList[t].parent = this.stylesList[t].pathElement.parentNode));
            this.hidden = !0
        }
    }, IShapeElement.prototype.renderShape = function (t, e, s, r) {
        var i, a;
        if (!e) for (e = this.shapesData, a = this.stylesList.length, i = 0; a > i; i += 1) this.stylesList[i].d = "", this.stylesList[i].mdf = !1;
        s || (s = this.viewData), a = e.length - 1;
        var n, o;
        for (n = t, i = a; i >= 0; i -= 1) if ("tr" == e[i].ty) {
            n = s[i].transform;
            var h = s[i].transform.mProps.v.props;
            if (n.matMdf = n.mProps.mdf, n.opMdf = n.op.mdf, o = n.mat, o.cloneFromProps(h), t) {
                var l = t.mat.props;
                n.opacity = t.opacity, n.opacity *= s[i].transform.op.v, n.matMdf = t.matMdf ? !0 : n.matMdf, n.opMdf = t.opMdf ? !0 : n.opMdf, o.transform(l[0], l[1], l[2], l[3], l[4], l[5], l[6], l[7], l[8], l[9], l[10], l[11], l[12], l[13], l[14], l[15])
            } else n.opacity = n.op.o
        } else "sh" == e[i].ty || "el" == e[i].ty || "rc" == e[i].ty || "sr" == e[i].ty ? this.renderPath(e[i], s[i], n) : "fl" == e[i].ty ? this.renderFill(e[i], s[i], n) : "st" == e[i].ty ? this.renderStroke(e[i], s[i], n) : "gr" == e[i].ty ? this.renderShape(n, e[i].it, s[i].it) : "tm" == e[i].ty;
        if (r) {
            for (a = this.stylesList.length, i = 0; a > i; i += 1) "0" === this.stylesList[i].ld && (this.stylesList[i].ld = "1", this.stylesList[i].pathElement.style.display = "block"), "fl" === this.stylesList[i].type && (this.stylesList[i].mdf || this.firstFrame) && this.stylesList[i].pathElement.setAttribute("d", this.stylesList[i].d);
            this.firstFrame && (this.firstFrame = !1)
        }
    }, IShapeElement.prototype.renderPath = function (t, e, s) {
        var r, i, a, n, o = "", h = s.matMdf || e.sh.mdf || this.firstFrame;
        if (h) {
            var l = e.sh.paths;
            for (n = l.length, a = 0; n > a; a += 1) {
                var p = l[a];
                if (p && p.v) {
                    for (r = p.v.length, i = 1; r > i; i += 1) 1 == i && (o += " M" + s.mat.applyToPointStringified(p.v[0][0], p.v[0][1])), o += " C" + s.mat.applyToPointStringified(p.o[i - 1][0], p.o[i - 1][1]) + " " + s.mat.applyToPointStringified(p.i[i][0], p.i[i][1]) + " " + s.mat.applyToPointStringified(p.v[i][0], p.v[i][1]);
                    1 == r && (o += " M" + s.mat.applyToPointStringified(p.v[0][0], p.v[0][1])), p.c && (o += " C" + s.mat.applyToPointStringified(p.o[i - 1][0], p.o[i - 1][1]) + " " + s.mat.applyToPointStringified(p.i[0][0], p.i[0][1]) + " " + s.mat.applyToPointStringified(p.v[0][0], p.v[0][1]), o += "z"), e.lStr = o
                }
            }
        } else o = e.lStr;
        for (r = e.elements.length, i = 0; r > i; i += 1) "st" === e.elements[i].ty ? (s.matMdf || e.sh.mdf || this.firstFrame) && e.elements[i].el.setAttribute("d", o) : (e.elements[i].st.mdf = h ? !0 : e.elements[i].st.mdf, e.elements[i].st.d += o)
    }, IShapeElement.prototype.renderFill = function (t, e, s) {
        var r = e.style;
        (e.c.mdf || this.firstFrame) && r.pathElement.setAttribute("fill", "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o.mdf || s.opMdf || this.firstFrame) && r.pathElement.setAttribute("fill-opacity", e.o.v * s.opacity)
    }, IShapeElement.prototype.renderStroke = function (t, e, s) {
        var r = e.style, i = e.d;
        i && i.k && (i.mdf || this.firstFrame) && (r.pathElement.setAttribute("stroke-dasharray", i.dasharray), r.pathElement.setAttribute("stroke-dashoffset", i.dashoffset)), (e.c.mdf || this.firstFrame) && r.pathElement.setAttribute("stroke", "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o.mdf || s.opMdf || this.firstFrame) && r.pathElement.setAttribute("stroke-opacity", e.o.v * s.opacity), (e.w.mdf || this.firstFrame) && r.pathElement.setAttribute("stroke-width", e.w.v)
    }, IShapeElement.prototype.destroy = function () {
        this._parent.destroy.call(), this.shapeData = null, this.viewData = null, this.parentContainer = null, this.placeholder = null
    }, createElement(SVGBaseElement, ISolidElement), ISolidElement.prototype.createElements = function () {
        this._parent.createElements.call(this);
        var t = document.createElementNS(svgNS, "rect");
        t.setAttribute("width", this.data.sw), t.setAttribute("height", this.data.sh), t.setAttribute("fill", this.data.sc), this.layerElement === this.parentContainer ? this.appendNodeToParent(t) : this.layerElement.appendChild(t), this.innerElem = t, this.data.ln && this.innerElem.setAttribute("id", this.data.ln), this.data.cl && this.innerElem.setAttribute("class", this.data.cl)
    }, ISolidElement.prototype.hide = IImageElement.prototype.hide, ISolidElement.prototype.renderFrame = IImageElement.prototype.renderFrame, ISolidElement.prototype.destroy = IImageElement.prototype.destroy, createElement(BaseElement, CVBaseElement), CVBaseElement.prototype.createElements = function () {
    }, CVBaseElement.prototype.checkBlendMode = function (t) {
        if (t.blendMode !== this.data.bm) {
            t.blendMode = this.data.bm;
            var e = "";
            switch (this.data.bm) {
                case 0:
                    e = "normal";
                    break;
                case 1:
                    e = "multiply";
                    break;
                case 2:
                    e = "screen";
                    break;
                case 3:
                    e = "overlay";
                    break;
                case 4:
                    e = "darken";
                    break;
                case 5:
                    e = "lighten";
                    break;
                case 6:
                    e = "color-dodge";
                    break;
                case 7:
                    e = "color-burn";
                    break;
                case 8:
                    e = "hard-light";
                    break;
                case 9:
                    e = "soft-light";
                    break;
                case 10:
                    e = "difference";
                    break;
                case 11:
                    e = "exclusion";
                    break;
                case 12:
                    e = "hue";
                    break;
                case 13:
                    e = "saturation";
                    break;
                case 14:
                    e = "color";
                    break;
                case 15:
                    e = "luminosity"
            }
            t.canvasContext.globalCompositeOperation = e
        }
    }, CVBaseElement.prototype.renderFrame = function (t) {
        if (3 === this.data.ty) return !1;
        if (this.checkBlendMode(0 === this.data.ty ? this.parentGlobalData : this.globalData), !this.isVisible) return this.isVisible;
        this.finalTransform.opMdf = this.finalTransform.op.mdf, this.finalTransform.matMdf = this.finalTransform.mProp.mdf, this.finalTransform.opacity = this.finalTransform.op.v;
        var e, s = this.finalTransform.mat;
        if (this.hierarchy) {
            var r, i = this.hierarchy.length;
            for (e = this.finalTransform.mProp.v.props, s.cloneFromProps(e), r = 0; i > r; r += 1) this.finalTransform.matMdf = this.hierarchy[r].finalTransform.mProp.mdf ? !0 : this.finalTransform.matMdf, e = this.hierarchy[r].finalTransform.mProp.v.props, s.transform(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15])
        } else t ? (e = this.finalTransform.mProp.v.props, s.cloneFromProps(e)) : s.cloneFromProps(this.finalTransform.mProp.v.props);
        return t && (e = t.mat.props, s.transform(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]), this.finalTransform.opacity *= t.opacity, this.finalTransform.opMdf = t.opMdf ? !0 : this.finalTransform.opMdf, this.finalTransform.matMdf = t.matMdf ? !0 : this.finalTransform.matMdf), this.data.hasMask && (this.globalData.renderer.save(!0), this.maskManager.renderFrame(0 === this.data.ty ? null : s)), this.isVisible
    }, CVBaseElement.prototype.addMasks = function (t) {
        this.maskManager = new CVMaskElement(t, this, this.globalData)
    }, CVBaseElement.prototype.destroy = function () {
        this.canvasContext = null, this.data = null, this.globalData = null, this.maskManager && this.maskManager.destroy()
    }, CVBaseElement.prototype.mHelper = new Matrix, createElement(CVBaseElement, CVCompElement), CVCompElement.prototype.ctxTransform = CanvasRenderer.prototype.ctxTransform, CVCompElement.prototype.ctxOpacity = CanvasRenderer.prototype.ctxOpacity, CVCompElement.prototype.save = CanvasRenderer.prototype.save, CVCompElement.prototype.restore = CanvasRenderer.prototype.restore, CVCompElement.prototype.reset = function () {
        this.contextData.cArrPos = 0, this.contextData.cTr.reset(), this.contextData.cO = 1
    }, CVCompElement.prototype.resize = function (t) {
        var e = Math.max(t.sx, t.sy);
        this.canvas.width = this.data.w * e, this.canvas.height = this.data.h * e, this.transformCanvas = {
            sc: e,
            w: this.data.w * e,
            h: this.data.h * e,
            props: [e, 0, 0, 0, 0, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
        };
        var s, r = this.elements.length;
        for (s = 0; r > s; s += 1) 0 === this.elements[s].data.ty && this.elements[s].resize(t)
    }, CVCompElement.prototype.prepareFrame = function (t) {
        if (this.globalData.frameId = this.parentGlobalData.frameId, this.globalData.mdf = !1, this._parent.prepareFrame.call(this, t), this.isVisible !== !1) {
            var e = t;
            this.tm && (e = this.tm.v, e === this.data.op && (e = this.data.op - 1)), this.renderedFrame = e / this.data.sr;
            var s, r = this.elements.length;
            for (s = 0; r > s; s += 1) this.elements[s].prepareFrame(e / this.data.sr - this.layers[s].st), 0 === this.elements[s].data.ty && this.elements[s].globalData.mdf && (this.globalData.mdf = !0);
            this.globalData.mdf && (this.canvasContext.clearRect(0, 0, this.data.w, this.data.h), this.ctxTransform(this.transformCanvas.props))
        }
    }, CVCompElement.prototype.renderFrame = function (t) {
        if (this._parent.renderFrame.call(this, t) !== !1) {
            if (this.globalData.mdf) {
                var e, s = this.layers.length;
                for (e = s - 1; e >= 0; e -= 1) this.elements[e].renderFrame()
            }
            this.data.hasMask && this.globalData.renderer.restore(!0), this.firstFrame && (this.firstFrame = !1), this.parentGlobalData.renderer.save(), this.parentGlobalData.renderer.ctxTransform(this.finalTransform.mat.props), this.parentGlobalData.renderer.ctxOpacity(this.finalTransform.opacity), this.parentGlobalData.renderer.canvasContext.drawImage(this.canvas, 0, 0, this.data.w, this.data.h), this.parentGlobalData.renderer.restore(), this.globalData.mdf && this.reset()
        }
    }, CVCompElement.prototype.setElements = function (t) {
        this.elements = t
    }, CVCompElement.prototype.getElements = function () {
        return this.elements
    }, CVCompElement.prototype.destroy = function () {
        var t, e = this.layers.length;
        for (t = e - 1; t >= 0; t -= 1) this.elements[t].destroy();
        this.layers = null, this.elements = null, this._parent.destroy.call()
    }, createElement(CVBaseElement, CVImageElement), CVImageElement.prototype.createElements = function () {
        var t = this, e = function () {
            t.animationItem.elementLoaded()
        }, s = function () {
            t.failed = !0, t.animationItem.elementLoaded()
        };
        this.img = new Image, this.img.addEventListener("load", e, !1), this.img.addEventListener("error", s, !1), this.img.src = this.path + this.assetData.p, this._parent.createElements.call(this)
    }, CVImageElement.prototype.renderFrame = function (t) {
        if (!this.failed && this._parent.renderFrame.call(this, t) !== !1) {
            var e = this.canvasContext;
            this.globalData.renderer.save();
            var s = this.finalTransform.mat.props;
            this.globalData.renderer.ctxTransform(s), this.globalData.renderer.ctxOpacity(this.finalTransform.opacity), e.drawImage(this.img, 0, 0), this.globalData.renderer.restore(this.data.hasMask), this.firstFrame && (this.firstFrame = !1)
        }
    }, CVImageElement.prototype.destroy = function () {
        this.img = null, this.animationItem = null, this._parent.destroy.call()
    }, CVMaskElement.prototype.getMaskProperty = function (t) {
        return this.viewData[t]
    }, CVMaskElement.prototype.prepareFrame = function (t) {
        var e, s = this.dynamicProperties.length;
        for (e = 0; s > e; e += 1) this.dynamicProperties[e].getValue(t)
    }, CVMaskElement.prototype.renderFrame = function (t) {
        var e, s, r, i, a, n = this.element.canvasContext, o = this.data.masksProperties.length, h = !1;
        for (e = 0; o > e; e++) if ("n" !== this.masksProperties[e].mode) {
            h === !1 && (n.beginPath(), h = !0), this.masksProperties[e].inv && (n.moveTo(0, 0), n.lineTo(this.element.globalData.compWidth, 0), n.lineTo(this.element.globalData.compWidth, this.element.globalData.compHeight), n.lineTo(0, this.element.globalData.compHeight), n.lineTo(0, 0)), a = this.viewData[e].v, s = t ? t.applyToPointArray(a.v[0][0], a.v[0][1], 0) : a.v[0], n.moveTo(s[0], s[1]);
            var l, p = a.v.length;
            for (l = 1; p > l; l++) s = t ? t.applyToPointArray(a.o[l - 1][0], a.o[l - 1][1], 0) : a.o[l - 1], r = t ? t.applyToPointArray(a.i[l][0], a.i[l][1], 0) : a.i[l], i = t ? t.applyToPointArray(a.v[l][0], a.v[l][1], 0) : a.v[l], n.bezierCurveTo(s[0], s[1], r[0], r[1], i[0], i[1]);
            s = t ? t.applyToPointArray(a.o[l - 1][0], a.o[l - 1][1], 0) : a.o[l - 1], r = t ? t.applyToPointArray(a.i[0][0], a.i[0][1], 0) : a.i[0], i = t ? t.applyToPointArray(a.v[0][0], a.v[0][1], 0) : a.v[0], n.bezierCurveTo(s[0], s[1], r[0], r[1], i[0], i[1])
        }
        h && n.clip()
    }, CVMaskElement.prototype.getMask = function (t) {
        for (var e = 0, s = this.masksProperties.length; s > e;) {
            if (this.masksProperties[e].nm === t) return {maskPath: this.viewData[e].pv};
            e += 1
        }
    }, CVMaskElement.prototype.destroy = function () {
        this.element = null
    }, createElement(CVBaseElement, CVShapeElement), CVShapeElement.prototype.lcEnum = {
        1: "butt",
        2: "round",
        3: "butt"
    }, CVShapeElement.prototype.ljEnum = {
        1: "miter",
        2: "round",
        3: "butt"
    }, CVShapeElement.prototype.transformHelper = {
        opacity: 1,
        mat: new Matrix,
        matMdf: !1,
        opMdf: !1
    }, CVShapeElement.prototype.dashResetter = [], CVShapeElement.prototype.createElements = function () {
        this._parent.createElements.call(this), this.searchShapes(this.shapesData, this.viewData, this.dynamicProperties)
    }, CVShapeElement.prototype.searchShapes = function (t, e, s) {
        var r, i, a, n, o = t.length - 1, h = [], l = [];
        for (r = o; r >= 0; r -= 1) if ("fl" == t[r].ty || "st" == t[r].ty) {
            if (n = {
                type: t[r].ty,
                elements: []
            }, e[r] = {}, e[r].c = PropertyFactory.getProp(this, t[r].c, 1, 255, s), e[r].c.k || (n.co = "rgb(" + bm_floor(e[r].c.v[0]) + "," + bm_floor(e[r].c.v[1]) + "," + bm_floor(e[r].c.v[2]) + ")"), e[r].o = PropertyFactory.getProp(this, t[r].o, 0, .01, s), "st" == t[r].ty && (n.lc = this.lcEnum[t[r].lc] || "round", n.lj = this.ljEnum[t[r].lj] || "round", 1 == t[r].lj && (n.ml = t[r].ml), e[r].w = PropertyFactory.getProp(this, t[r].w, 0, null, s), e[r].w.k || (n.wi = e[r].w.v), t[r].d)) {
                var p = PropertyFactory.getDashProp(this, t[r].d, "canvas", s);
                e[r].d = p, e[r].d.k || (n.da = e[r].d.dasharray, n["do"] = e[r].d.dashoffset)
            }
            this.stylesList.push(n), e[r].style = n, h.push(e[r].style)
        } else if ("gr" == t[r].ty) e[r] = {it: []}, this.searchShapes(t[r].it, e[r].it, s); else if ("tr" == t[r].ty) e[r] = {
            transform: {
                mat: new Matrix,
                opacity: 1,
                matMdf: !1,
                opMdf: !1,
                op: PropertyFactory.getProp(this, t[r].o, 0, .01, s),
                mProps: PropertyFactory.getProp(this, t[r], 2, null, s)
            }, elements: []
        }; else if ("sh" == t[r].ty || "rc" == t[r].ty || "el" == t[r].ty || "sr" == t[r].ty) {
            e[r] = {nodes: [], trNodes: [], tr: [0, 0, 0, 0, 0, 0]};
            var m = 4;
            "rc" == t[r].ty ? m = 5 : "el" == t[r].ty ? m = 6 : "sr" == t[r].ty && (m = 7), e[r].sh = ShapePropertyFactory.getShapeProp(this, t[r], m, s), this.shapes.push(e[r].sh), this.addShapeToModifiers(e[r].sh), a = this.stylesList.length;
            var f = !1, d = !1;
            for (i = 0; a > i; i += 1) this.stylesList[i].closed || (this.stylesList[i].elements.push(e[r]), "st" === this.stylesList[i].type ? f = !0 : d = !0);
            e[r].st = f, e[r].fl = d
        } else if ("tm" == t[r].ty || "rd" == t[r].ty) {
            var c = ShapeModifiers.getModifier(t[r].ty);
            c.init(this, t[r], s), this.shapeModifiers.push(c), l.push(c), e[r] = c
        }
        for (o = h.length, r = 0; o > r; r += 1) h[r].closed = !0;
        for (o = l.length, r = 0; o > r; r += 1) l[r].closed = !0
    }, CVShapeElement.prototype.addShapeToModifiers = function (t) {
        var e, s = this.shapeModifiers.length;
        for (e = 0; s > e; e += 1) this.shapeModifiers[e].addShape(t)
    }, CVShapeElement.prototype.renderModifiers = function () {
        if (this.shapeModifiers.length) {
            var t, e = this.shapes.length;
            for (t = 0; e > t; t += 1) this.shapes[t].reset();
            for (e = this.shapeModifiers.length, t = e - 1; t >= 0; t -= 1) this.shapeModifiers[t].processShapes()
        }
    }, CVShapeElement.prototype.renderFrame = function (t) {
        this._parent.renderFrame.call(this, t) !== !1 && (this.transformHelper.mat.reset(), this.transformHelper.opacity = this.finalTransform.opacity, this.transformHelper.matMdf = !1, this.transformHelper.opMdf = this.finalTransform.opMdf, this.renderModifiers(), this.renderShape(this.transformHelper, null, null, !0), this.data.hasMask && this.globalData.renderer.restore(!0))
    }, CVShapeElement.prototype.renderShape = function (t, e, s, r) {
        var i, a;
        if (!e) for (e = this.shapesData, a = this.stylesList.length, i = 0; a > i; i += 1) this.stylesList[i].d = "", this.stylesList[i].mdf = !1;
        s || (s = this.viewData), a = e.length - 1;
        var n, o;
        for (n = t, i = a; i >= 0; i -= 1) if ("tr" == e[i].ty) {
            n = s[i].transform;
            var h = s[i].transform.mProps.v.props;
            if (n.matMdf = n.mProps.mdf, n.opMdf = n.op.mdf, o = n.mat, o.cloneFromProps(h), t) {
                var l = t.mat.props;
                n.opacity = t.opacity, n.opacity *= s[i].transform.op.v, n.matMdf = t.matMdf ? !0 : n.matMdf, n.opMdf = t.opMdf ? !0 : n.opMdf, o.transform(l[0], l[1], l[2], l[3], l[4], l[5], l[6], l[7], l[8], l[9], l[10], l[11], l[12], l[13], l[14], l[15])
            } else n.opacity = n.op.o
        } else "sh" == e[i].ty || "el" == e[i].ty || "rc" == e[i].ty || "sr" == e[i].ty ? this.renderPath(e[i], s[i], n) : "fl" == e[i].ty ? this.renderFill(e[i], s[i], n) : "st" == e[i].ty ? this.renderStroke(e[i], s[i], n) : "gr" == e[i].ty ? this.renderShape(n, e[i].it, s[i].it) : "tm" == e[i].ty;
        if (r) {
            a = this.stylesList.length;
            var p, m, f, d, c, u, y, g = this.globalData.renderer, v = this.globalData.canvasContext;
            for (g.save(), g.ctxTransform(this.finalTransform.mat.props), i = 0; a > i; i += 1) if (y = this.stylesList[i].type, "st" !== y || 0 !== this.stylesList[i].wi) {
                for (g.save(), c = this.stylesList[i].elements, m = c.length, "st" === y ? (v.strokeStyle = this.stylesList[i].co, v.lineWidth = this.stylesList[i].wi, v.lineCap = this.stylesList[i].lc, v.lineJoin = this.stylesList[i].lj, v.miterLimit = this.stylesList[i].ml || 0) : v.fillStyle = this.stylesList[i].co, g.ctxOpacity(this.stylesList[i].coOp), "st" !== y && v.beginPath(), p = 0; m > p; p += 1) {
                    for ("st" === y && (v.beginPath(), this.stylesList[i].da ? (v.setLineDash(this.stylesList[i].da), v.lineDashOffset = this.stylesList[i]["do"], this.globalData.isDashed = !0) : this.globalData.isDashed && (v.setLineDash(this.dashResetter), this.globalData.isDashed = !1)), u = c[p].trNodes, d = u.length, f = 0; d > f; f += 1) "m" == u[f].t ? v.moveTo(u[f].p[0], u[f].p[1]) : "c" == u[f].t ? v.bezierCurveTo(u[f].p1[0], u[f].p1[1], u[f].p2[0], u[f].p2[1], u[f].p3[0], u[f].p3[1]) : v.closePath();

                    "st" === y && v.stroke()
                }
                "st" !== y && v.fill(), g.restore()
            }
            g.restore(), this.firstFrame && (this.firstFrame = !1)
        }
    }, CVShapeElement.prototype.renderPath = function (t, e, s) {
        var r, i, a, n, o = s.matMdf || e.sh.mdf || this.firstFrame;
        if (o) {
            var h = e.sh.paths;
            n = h.length;
            var l = e.trNodes;
            for (l.length = 0, a = 0; n > a; a += 1) {
                var p = h[a];
                if (p && p.v) {
                    for (r = p.v.length, i = 1; r > i; i += 1) 1 == i && l.push({
                        t: "m",
                        p: s.mat.applyToPointArray(p.v[0][0], p.v[0][1], 0)
                    }), l.push({
                        t: "c",
                        p1: s.mat.applyToPointArray(p.o[i - 1][0], p.o[i - 1][1], 0),
                        p2: s.mat.applyToPointArray(p.i[i][0], p.i[i][1], 0),
                        p3: s.mat.applyToPointArray(p.v[i][0], p.v[i][1], 0)
                    });
                    1 == r && l.push({
                        t: "m",
                        p: s.mat.applyToPointArray(p.v[0][0], p.v[0][1], 0)
                    }), p.c && (l.push({
                        t: "c",
                        p1: s.mat.applyToPointArray(p.o[i - 1][0], p.o[i - 1][1], 0),
                        p2: s.mat.applyToPointArray(p.i[0][0], p.i[0][1], 0),
                        p3: s.mat.applyToPointArray(p.v[0][0], p.v[0][1], 0)
                    }), l.push({t: "z"})), e.lStr = l
                }
            }
            if (e.st) for (i = 0; 16 > i; i += 1) e.tr[i] = s.mat.props[i];
            e.trNodes = l
        }
    }, CVShapeElement.prototype.renderFill = function (t, e, s) {
        var r = e.style;
        (e.c.mdf || this.firstFrame) && (r.co = "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o.mdf || s.opMdf || this.firstFrame) && (r.coOp = e.o.v * s.opacity)
    }, CVShapeElement.prototype.renderStroke = function (t, e, s) {
        var r = e.style, i = e.d;
        i && (i.mdf || this.firstFrame) && (r.da = i.dasharray, r["do"] = i.dashoffset), (e.c.mdf || this.firstFrame) && (r.co = "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o.mdf || s.opMdf || this.firstFrame) && (r.coOp = e.o.v * s.opacity), (e.w.mdf || this.firstFrame) && (r.wi = e.w.v)
    }, CVShapeElement.prototype.destroy = function () {
        this.shapesData = null, this.globalData = null, this.canvasContext = null, this.stylesList.length = 0, this.viewData.length = 0, this._parent.destroy.call()
    }, createElement(CVBaseElement, CVSolidElement), CVSolidElement.prototype.renderFrame = function (t) {
        if (this._parent.renderFrame.call(this, t) !== !1) {
            var e = this.canvasContext;
            this.globalData.renderer.save(), this.globalData.renderer.ctxTransform(this.finalTransform.mat.props), this.globalData.renderer.ctxOpacity(this.finalTransform.opacity), e.fillStyle = this.data.sc, e.fillRect(0, 0, this.data.sw, this.data.sh), this.globalData.renderer.restore(this.data.hasMask), this.firstFrame && (this.firstFrame = !1)
        }
    }, createElement(CVBaseElement, CVTextElement), CVTextElement.prototype.init = ITextElement.prototype.init, CVTextElement.prototype.getMeasures = ITextElement.prototype.getMeasures, CVTextElement.prototype.getMult = ITextElement.prototype.getMult, CVTextElement.prototype.tHelper = document.createElement("canvas").getContext("2d"), CVTextElement.prototype.createElements = function () {
        this._parent.createElements.call(this);
        var t = this.data.t.d, e = !1;
        t.fc ? (e = !0, this.values.fill = "rgb(" + Math.round(255 * t.fc[0]) + "," + Math.round(255 * t.fc[1]) + "," + Math.round(255 * t.fc[2]) + ")") : this.values.fill = "rgba(0,0,0,0)", this.fill = e;
        var s = !1;
        t.sc && (s = !0, this.values.stroke = "rgb(" + Math.round(255 * t.sc[0]) + "," + Math.round(255 * t.sc[1]) + "," + Math.round(255 * t.sc[2]) + ")", this.values.sWidth = t.sw);
        var r, i, a = this.globalData.fontManager.getFontByName(t.f), n = t.l, o = this.mHelper;
        this.stroke = s, this.values.fValue = t.s + "px " + this.globalData.fontManager.getFontByName(t.f).fFamily, i = t.t.length, this.tHelper.font = this.values.fValue;
        var h, l, p, m, f, d, c, u, y, g, v = this.data.singleShape;
        if (v) var b = 0, P = 0, E = t.lineWidths, k = t.boxWidth, S = !0;
        for (r = 0; i > r; r += 1) {
            h = this.globalData.fontManager.getCharData(t.t.charAt(r), a.fStyle, this.globalData.fontManager.getFontByName(t.f).fFamily);
            var l;
            if (l = h ? h.data : null, o.reset(), v && n[r].n && (b = 0, P += t.yOffset, P += S ? 1 : 0, S = !1), l && l.shapes) {
                if (f = l.shapes[0].it, c = f.length, o.scale(t.s / 100, t.s / 100), v) {
                    switch (t.ps && o.translate(t.ps[0], t.ps[1] + t.ascent, 0), t.j) {
                        case 1:
                            o.translate(t.justifyOffset + (k - E[n[r].line]), 0, 0);
                            break;
                        case 2:
                            o.translate(t.justifyOffset + (k - E[n[r].line]) / 2, 0, 0)
                    }
                    o.translate(b, P, 0)
                }
                for (y = new Array(c), d = 0; c > d; d += 1) {
                    for (m = f[d].ks.k.i.length, u = f[d].ks.k, g = [], p = 1; m > p; p += 1) 1 == p && g.push(o.applyToX(u.v[0][0], u.v[0][1], 0), o.applyToY(u.v[0][0], u.v[0][1], 0)), g.push(o.applyToX(u.o[p - 1][0], u.o[p - 1][1], 0), o.applyToY(u.o[p - 1][0], u.o[p - 1][1], 0), o.applyToX(u.i[p][0], u.i[p][1], 0), o.applyToY(u.i[p][0], u.i[p][1], 0), o.applyToX(u.v[p][0], u.v[p][1], 0), o.applyToY(u.v[p][0], u.v[p][1], 0));
                    g.push(o.applyToX(u.o[p - 1][0], u.o[p - 1][1], 0), o.applyToY(u.o[p - 1][0], u.o[p - 1][1], 0), o.applyToX(u.i[0][0], u.i[0][1], 0), o.applyToY(u.i[0][0], u.i[0][1], 0), o.applyToX(u.v[0][0], u.v[0][1], 0), o.applyToY(u.v[0][0], u.v[0][1], 0)), y[d] = g
                }
            } else y = [];
            v && (b += n[r].l), this.textSpans.push({elem: y})
        }
    }, CVTextElement.prototype.renderFrame = function (t) {
        if (this._parent.renderFrame.call(this, t) !== !1) {
            var e = this.canvasContext, s = this.finalTransform.mat.props;
            this.globalData.renderer.save(), this.globalData.renderer.ctxTransform(s), this.globalData.renderer.ctxOpacity(this.finalTransform.opacity), e.font = this.values.fValue, e.lineCap = "butt", e.lineJoin = "miter", e.miterLimit = 4, this.data.singleShape || this.getMeasures();
            var r, i, a, n, o, h, l = this.renderedLetters, p = this.data.t.d.l;
            i = p.length;
            var m, f, d, c = null, u = null, y = null;
            for (r = 0; i > r; r += 1) if (!p[r].n) {
                if (m = l[r], m && (this.globalData.renderer.save(), this.globalData.renderer.ctxTransform(m.props), this.globalData.renderer.ctxOpacity(m.o)), this.fill) {
                    for (m && m.fc ? c !== m.fc && (c = m.fc, e.fillStyle = m.fc) : c !== this.values.fill && (c = this.values.fill, e.fillStyle = this.values.fill), f = this.textSpans[r].elem, n = f.length, this.globalData.canvasContext.beginPath(), a = 0; n > a; a += 1) for (d = f[a], h = d.length, this.globalData.canvasContext.moveTo(d[0], d[1]), o = 2; h > o; o += 6) this.globalData.canvasContext.bezierCurveTo(d[o], d[o + 1], d[o + 2], d[o + 3], d[o + 4], d[o + 5]);
                    this.globalData.canvasContext.closePath(), this.globalData.canvasContext.fill()
                }
                if (this.stroke) {
                    for (m && m.sw ? y !== m.sw && (y = m.sw, e.lineWidth = m.sw) : y !== this.values.sWidth && (y = this.values.sWidth, e.lineWidth = this.values.sWidth), m && m.sc ? u !== m.sc && (u = m.sc, e.strokeStyle = m.sc) : u !== this.values.stroke && (u = this.values.stroke, e.strokeStyle = this.values.stroke), f = this.textSpans[r].elem, n = f.length, this.globalData.canvasContext.beginPath(), a = 0; n > a; a += 1) for (d = f[a], h = d.length, this.globalData.canvasContext.moveTo(d[0], d[1]), o = 2; h > o; o += 6) this.globalData.canvasContext.bezierCurveTo(d[o], d[o + 1], d[o + 2], d[o + 3], d[o + 4], d[o + 5]);
                    this.globalData.canvasContext.closePath(), this.globalData.canvasContext.stroke()
                }
                m && this.globalData.renderer.restore()
            }
            this.globalData.renderer.restore(this.data.hasMask), this.firstFrame && (this.firstFrame = !1)
        }
    }, createElement(BaseElement, HBaseElement), HBaseElement.prototype.checkBlendMode = function () {
    }, HBaseElement.prototype.setBlendMode = BaseElement.prototype.setBlendMode, HBaseElement.prototype.appendNodeToParent = function (t) {
        if (this.placeholder) {
            var e = this.placeholder.phElement;
            e.parentNode.insertBefore(t, e)
        } else this.parentContainer.appendChild(t)
    }, HBaseElement.prototype.createElements = function () {
        this.data.hasMask ? (this.layerElement = document.createElementNS(svgNS, "svg"), this.appendNodeToParent(this.layerElement), this.maskedElement = this.layerElement) : this.layerElement = this.parentContainer, !this.data.ln || 4 !== this.data.ty && 0 !== this.data.ty || (this.layerElement === this.parentContainer && (this.layerElement = document.createElementNS(svgNS, "g"), this.appendNodeToParent(this.layerElement)), this.layerElement.setAttribute("id", this.data.ln)), this.setBlendMode(), this.layerElement !== this.parentContainer && (this.placeholder = null)
    }, HBaseElement.prototype.renderFrame = function (t) {
        if (3 === this.data.ty) return !1;
        if (this.currentFrameNum === this.lastNum || !this.isVisible) return this.isVisible;
        this.lastNum = this.currentFrameNum, this.data.hasMask && this.maskManager.renderFrame(), this.finalTransform.opMdf = this.finalTransform.op.mdf, this.finalTransform.matMdf = this.finalTransform.mProp.mdf, this.finalTransform.opacity = this.finalTransform.op.v, this.firstFrame && (this.finalTransform.opMdf = !0, this.finalTransform.matMdf = !0);
        var e, s = this.finalTransform.mat;
        if (this.hierarchy) {
            var r, i = this.hierarchy.length;
            for (e = this.finalTransform.mProp.v.props, s.cloneFromProps(e), r = 0; i > r; r += 1) this.finalTransform.matMdf = this.hierarchy[r].finalTransform.mProp.mdf ? !0 : this.finalTransform.matMdf, e = this.hierarchy[r].finalTransform.mProp.v.props, s.transform(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15])
        } else this.isVisible && this.finalTransform.matMdf && (t ? (e = this.finalTransform.mProp.v.props, s.cloneFromProps(e)) : s.cloneFromProps(this.finalTransform.mProp.v.props));
        return t && (e = t.mat.props, s.cloneFromProps(e), this.finalTransform.opacity *= t.opacity, this.finalTransform.opMdf = t.opMdf ? !0 : this.finalTransform.opMdf, this.finalTransform.matMdf = t.matMdf ? !0 : this.finalTransform.matMdf), this.finalTransform.matMdf && (this.layerElement.style.transform = this.layerElement.style.webkitTransform = s.toCSS()), this.finalTransform.opMdf && (this.layerElement.style.opacity = this.finalTransform.opacity), this.isVisible
    }, HBaseElement.prototype.destroy = function () {
        this.layerElement = null, this.parentContainer = null, this.matteElement && (this.matteElement = null), this.maskManager && (this.maskManager.destroy(), this.maskManager = null)
    }, HBaseElement.prototype.getDomElement = function () {
        return this.layerElement
    }, HBaseElement.prototype.addMasks = function (t) {
        this.maskManager = new MaskElement(t, this, this.globalData)
    }, HBaseElement.prototype.hide = function () {
    }, HBaseElement.prototype.setMatte = function () {
    }, createElement(HBaseElement, HSolidElement),HSolidElement.prototype.createElements = function () {
        var t = document.createElement("div");
        styleDiv(t);
        var e = document.createElementNS(svgNS, "svg");
        e.setAttribute("width", this.data.sw), e.setAttribute("height", this.data.sh), t.appendChild(e), this.layerElement = t, this.parentContainer.appendChild(t), this.innerElem = t, this.data.ln && this.innerElem.setAttribute("id", this.data.ln), 0 !== this.data.bm && this.setBlendMode();
        var s = document.createElementNS(svgNS, "rect");
        s.setAttribute("width", this.data.sw), s.setAttribute("height", this.data.sh), s.setAttribute("fill", this.data.sc), e.appendChild(s), this.data.hasMask && (this.maskedElement = s)
    },HSolidElement.prototype.hide = function () {
        this.hidden || (this.innerElem.style.display = "none", this.hidden = !0)
    },HSolidElement.prototype.renderFrame = function (t) {
        var e = this._parent.renderFrame.call(this, t);
        return e === !1 ? void this.hide() : (this.hidden && (this.hidden = !1, this.innerElem.style.display = "block"), void(this.firstFrame && (this.firstFrame = !1)))
    },HSolidElement.prototype.destroy = function () {
        this._parent.destroy.call(), this.innerElem = null
    },createElement(HBaseElement, HCompElement),HCompElement.prototype.getDomElement = function () {
        return this.composingElement
    },HCompElement.prototype.getComposingElement = function () {
        return this.layerElement
    },HCompElement.prototype.createElements = function () {
        if (this.layerElement = document.createElement("div"), styleDiv(this.layerElement), this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.layerElement.style.clip = "rect(0px, " + this.data.w + "px, " + this.data.h + "px, 0px)", this.layerElement !== this.parentContainer && (this.placeholder = null), this.data.hasMask) {
            var t = document.createElementNS(svgNS, "svg");
            t.setAttribute("width", this.data.w), t.setAttribute("height", this.data.h);
            var e = document.createElementNS(svgNS, "g");
            t.appendChild(e), this.layerElement.appendChild(t), this.maskedElement = e, this.composingElement = e
        } else this.composingElement = this.layerElement;
        this.appendNodeToParent(this.layerElement)
    },HCompElement.prototype.hide = ICompElement.prototype.hide,HCompElement.prototype.prepareFrame = ICompElement.prototype.prepareFrame,HCompElement.prototype.setElements = ICompElement.prototype.setElements,HCompElement.prototype.getElements = ICompElement.prototype.getElements,HCompElement.prototype.destroy = ICompElement.prototype.destroy,HCompElement.prototype.renderFrame = function (t) {
        var e, s = this._parent.renderFrame.call(this, t), r = this.layers.length;
        if (s === !1) return void this.hide();
        for (this.hidden = !1, e = 0; r > e; e += 1) this.elements[e].renderFrame();
        this.firstFrame && (this.firstFrame = !1)
    },createElement(HBaseElement, HShapeElement);
    var parent = HShapeElement.prototype._parent;
    extendPrototype(IShapeElement, HShapeElement), HShapeElement.prototype._parent = parent, HShapeElement.prototype.createElements = function () {
        var t = document.createElement("div");
        styleDiv(t);
        var e = document.createElementNS(svgNS, "svg");
        if (999999 === this.data.bounds.l, e.setAttribute("width", this.data.bounds.r - this.data.bounds.l), e.setAttribute("height", this.data.bounds.b - this.data.bounds.t), e.setAttribute("viewBox", this.data.bounds.l + " " + this.data.bounds.t + " " + (this.data.bounds.r - this.data.bounds.l) + " " + (this.data.bounds.b - this.data.bounds.t)), e.style.transform = e.style.webkitTransform = "translate(" + this.data.bounds.l + "px," + this.data.bounds.t + "px)", this.data.hasMask) {
            var s = document.createElementNS(svgNS, "g");
            t.appendChild(e), e.appendChild(s), this.maskedElement = s, this.layerElement = s, this.shapesContainer = s
        } else t.appendChild(e), this.layerElement = e, this.shapesContainer = document.createElementNS(svgNS, "g"), this.layerElement.appendChild(this.shapesContainer);
        this.parentContainer.appendChild(t), this.innerElem = t, this.data.ln && this.innerElem.setAttribute("id", this.data.ln), this.searchShapes(this.shapesData, this.viewData, this.dynamicProperties, []), this.buildExpressionInterface(), this.layerElement = t, 0 !== this.data.bm && this.setBlendMode()
    }, HShapeElement.prototype.renderFrame = function (t) {
        var e = this._parent.renderFrame.call(this, t);
        return e === !1 ? void this.hide() : (this.hidden = !1, this.transformHelper.opacity = this.finalTransform.opacity, this.transformHelper.matMdf = !1, this.transformHelper.opMdf = this.finalTransform.opMdf, this.renderModifiers(), void this.renderShape(this.transformHelper, null, null, !0))
    }, createElement(HBaseElement, HTextElement), HTextElement.prototype.init = ITextElement.prototype.init, HTextElement.prototype.getMeasures = ITextElement.prototype.getMeasures, HTextElement.prototype.createPathShape = ITextElement.prototype.createPathShape, HTextElement.prototype.createElements = function () {
        this.isMasked = this.checkMasks();
        var t = this.data.t.d, e = document.createElement("div");
        if (styleDiv(e), this.layerElement = e, this.isMasked) {
            this.renderType = "svg";
            var s = document.createElementNS(svgNS, "svg");
            this.cont = s, this.compW = this.comp.data ? this.comp.data.w : this.globalData.compSize.w, this.compH = this.comp.data ? this.comp.data.h : this.globalData.compSize.h, s.setAttribute("width", this.compW), s.setAttribute("height", this.compH);
            var r = document.createElementNS(svgNS, "g");
            s.appendChild(r), e.appendChild(s), this.maskedElement = r, this.innerElem = r
        } else this.renderType = "html", this.innerElem = e;
        this.parentContainer.appendChild(e), this.innerElem.style.color = this.innerElem.style.fill = t.fc ? "rgb(" + Math.round(45) + "," + Math.round(30) + "," + Math.round(68) + ")" : "rgba(0,0,0,0)", t.sc && (this.innerElem.style.stroke = "rgb(" + Math.round(45) + "," + Math.round(30) + "," + Math.round(68) + ")", this.innerElem.style.strokeWidth = t.sw + "px");
        var i = this.globalData.fontManager.getFontByName(t.f);
        if (!this.globalData.fontManager.chars) if (this.innerElem.style.fontSize = t.s + "px", this.innerElem.style.lineHeight = t.s + "px", i.fClass) this.innerElem.className = i.fClass; else {
            this.innerElem.style.fontFamily = i.fFamily;
            var a = t.fWeight, n = t.fStyle;
            this.innerElem.style.fontStyle = n, this.innerElem.style.fontWeight = a
        }
        var o, h, l = t.l;
        h = l.length;
        var p, m, f, d, c = this.mHelper, u = "";
        for (o = 0; h > o; o += 1) {
            if (this.globalData.fontManager.chars ? (p = document.createElementNS(svgNS, "path"), this.isMasked || (m = document.createElement("div"), f = document.createElementNS(svgNS, "svg"), m.appendChild(f), f.appendChild(p), styleDiv(m)), p.setAttribute("stroke-linecap", "butt"), p.setAttribute("stroke-linejoin", "round"), p.setAttribute("stroke-miterlimit", "4")) : this.isMasked ? p = document.createElementNS(svgNS, "text") : (m = document.createElement("span"), styleDiv(m), p = document.createElement("span"), styleDiv(p), m.appendChild(p)), this.globalData.fontManager.chars) {
                var y,
                    g = this.globalData.fontManager.getCharData(t.t.charAt(o), i.fStyle, this.globalData.fontManager.getFontByName(t.f).fFamily);
                if (y = g ? g.data : null, c.reset(), y && y.shapes && (d = y.shapes[0].it, c.scale(t.s / 100, t.s / 100), u = this.createPathShape(c, d), p.setAttribute("d", u)), this.isMasked) this.innerElem.appendChild(p); else {
                    this.innerElem.appendChild(m);
                    var v = t.s / 100;
                    if (y && y.shapes) {
                        var b = Math.ceil(y.bounds.r * v), P = Math.floor(y.bounds.t * v),
                            E = Math.floor(y.bounds.l * v), k = Math.ceil(y.bounds.b * v);
                        f.setAttribute("width", b - E), f.setAttribute("height", k - P), f.setAttribute("viewBox", E + " " + P + " " + (b - E) + " " + (k - P)), f.style.transform = f.style.webkitTransform = "translate(" + E + "px," + P + "px)", l[o].yOffset = P
                    } else f.setAttribute("width", 1), f.setAttribute("height", 1)
                }
            } else p.textContent = l[o].val, p.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve"), this.isMasked ? this.innerElem.appendChild(p) : (this.innerElem.appendChild(m), p.style.transform = p.style.webkitTransform = "translate3d(0," + -t.s / 1.2 + "px,0)");
            this.textSpans.push(this.isMasked ? p : m), this.textPaths.push(p)
        }
    }, HTextElement.prototype.hide = SVGTextElement.prototype.hide, HTextElement.prototype.renderFrame = function (t) {
        var e = this._parent.renderFrame.call(this, t);
        if (e === !1) return void this.hide();
        if (this.hidden && (this.hidden = !1, this.innerElem.style.display = "block"), this.data.singleShape) {
            if (!this.firstFrame) return;
            this.isMasked && this.finalTransform.matMdf && (this.cont.setAttribute("viewBox", -this.finalTransform.mProp.p.v[0] + " " + -this.finalTransform.mProp.p.v[1] + " " + this.compW + " " + this.compH), this.cont.style.transform = this.cont.style.webkitTransform = "translate(" + -this.finalTransform.mProp.p.v[0] + "px," + -this.finalTransform.mProp.p.v[1] + "px)")
        }
        if (this.getMeasures(), this.lettersChangedFlag) {
            var s, r, i = this.renderedLetters, a = this.data.t.d.l;
            r = a.length;
            var n;
            for (s = 0; r > s; s += 1) a[s].n || (n = i[s], this.isMasked ? this.textSpans[s].setAttribute("transform", n.m) : this.textSpans[s].style.transform = this.textSpans[s].style.webkitTransform = n.m, this.textSpans[s].style.opacity = n.o, n.sw && this.textPaths[s].setAttribute("stroke-width", n.sw), n.sc && this.textPaths[s].setAttribute("stroke", n.sc), n.fc && (this.textPaths[s].setAttribute("fill", n.fc), this.textPaths[s].style.color = n.fc));
            if (this.isMasked) {
                var o = this.innerElem.getBBox();
                this.currentBBox.w !== o.width && (this.currentBBox.w = o.width, this.cont.setAttribute("width", o.width)), this.currentBBox.h !== o.height && (this.currentBBox.h = o.height, this.cont.setAttribute("height", o.height)), (this.currentBBox.w !== o.width || this.currentBBox.h !== o.height || this.currentBBox.x !== o.x || this.currentBBox.y !== o.y) && (this.currentBBox.w = o.width, this.currentBBox.h = o.height, this.currentBBox.x = o.x, this.currentBBox.y = o.y, this.cont.setAttribute("viewBox", this.currentBBox.x + " " + this.currentBBox.y + " " + this.currentBBox.w + " " + this.currentBBox.h), this.cont.style.transform = this.cont.style.webkitTransform = "translate(" + this.currentBBox.x + "px," + this.currentBBox.y + "px)")
            }
            this.firstFrame && (this.firstFrame = !1)
        }
    }, HTextElement.prototype.destroy = SVGTextElement.prototype.destroy, createElement(HBaseElement, HImageElement), HImageElement.prototype.createElements = function () {
        var t, e = function () {
            this.imageElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.path + this.assetData.p)
        }, s = new Image;
        if (this.data.hasMask) {
            var t = document.createElement("div");
            styleDiv(t);
            var r = document.createElementNS(svgNS, "svg");
            r.setAttribute("width", this.assetData.w), r.setAttribute("height", this.assetData.h), t.appendChild(r), this.imageElem = document.createElementNS(svgNS, "image"), this.imageElem.setAttribute("width", this.assetData.w + "px"), this.imageElem.setAttribute("height", this.assetData.h + "px"), r.appendChild(this.imageElem), this.layerElement = t, this.parentContainer.appendChild(t), this.innerElem = t, this.maskedElement = this.imageElem, s.addEventListener("load", e.bind(this), !1), s.addEventListener("error", e.bind(this), !1)
        } else styleDiv(s), this.layerElement = s, this.parentContainer.appendChild(s), this.innerElem = s;
        s.src = this.path + this.assetData.p, this.data.ln && this.innerElem.setAttribute("id", this.data.ln)
    }, HImageElement.prototype.hide = HSolidElement.prototype.hide, HImageElement.prototype.renderFrame = HSolidElement.prototype.renderFrame, HImageElement.prototype.destroy = HSolidElement.prototype.destroy, createElement(HBaseElement, HCameraElement), HCameraElement.prototype.setup = function () {
        var t, e, s = this.comp.threeDElements.length;
        for (t = 0; s > t; t += 1) e = this.comp.threeDElements[t], e[0].style.perspective = e[0].style.webkitPerspective = this.pe.v + "px", e[1].style.transformOrigin = e[1].style.mozTransformOrigin = e[1].style.webkitTransformOrigin = "0px 0px 0px", e[0].style.transform = e[0].style.webkitTransform = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)"
    }, HCameraElement.prototype.createElements = function () {
    }, HCameraElement.prototype.hide = function () {
    }, HCameraElement.prototype.renderFrame = function () {
        var t, e, s = this.firstFrame;
        if (this.hierarchy) for (e = this.hierarchy.length, t = 0; e > t; t += 1) s = this.hierarchy[t].finalTransform.mProp.mdf ? !0 : s;
        if (s || this.p && this.p.mdf || this.px && (this.px.mdf || this.py.mdf || this.pz.mdf) || this.rx.mdf || this.ry.mdf || this.rz.mdf || this.or.mdf || this.a && this.a.mdf) {
            if (this.mat.reset(), this.p ? this.mat.translate(-this.p.v[0], -this.p.v[1], this.p.v[2]) : this.mat.translate(-this.px.v, -this.py.v, this.pz.v), this.a) {
                var r = [this.p.v[0] - this.a.v[0], this.p.v[1] - this.a.v[1], this.p.v[2] - this.a.v[2]],
                    i = Math.sqrt(Math.pow(r[0], 2) + Math.pow(r[1], 2) + Math.pow(r[2], 2)),
                    a = [r[0] / i, r[1] / i, r[2] / i], n = Math.sqrt(a[2] * a[2] + a[0] * a[0]),
                    o = Math.atan2(a[1], n), h = Math.atan2(a[0], -a[2]);
                this.mat.rotateY(h).rotateX(-o)
            }
            if (this.mat.rotateX(-this.rx.v).rotateY(-this.ry.v).rotateZ(this.rz.v), this.mat.rotateX(-this.or.v[0]).rotateY(-this.or.v[1]).rotateZ(this.or.v[2]), this.mat.translate(this.globalData.compSize.w / 2, this.globalData.compSize.h / 2, 0), this.mat.translate(0, 0, this.pe.v), this.hierarchy) {
                var l;
                for (e = this.hierarchy.length, t = 0; e > t; t += 1) l = this.hierarchy[t].finalTransform.mProp.iv.props, this.mat.transform(l[0], l[1], l[2], l[3], l[4], l[5], l[6], l[7], l[8], l[9], l[10], l[11], -l[12], -l[13], l[14], l[15])
            }
            e = this.comp.threeDElements.length;
            var p;
            for (t = 0; e > t; t += 1) p = this.comp.threeDElements[t], p[1].style.transform = p[1].style.webkitTransform = this.mat.toCSS()
        }
        this.firstFrame = !1
    }, HCameraElement.prototype.destroy = function () {
    };
    var animationManager = function () {
        function t(e) {
            var s = 0, r = e.target;
            for (r.removeEventListener("destroy", t); E > s;) v[s].animation === r && (v.splice(s, 1), s -= 1, E -= 1), s += 1
        }

        function e(e, s) {
            if (!e) return null;
            for (var r = 0; E > r;) {
                if (v[r].elem == e && null !== v[r].elem) return v[r].animation;
                r += 1
            }
            var i = new AnimationItem;
            return i.setData(e, s), i.addEventListener("destroy", t), v.push({elem: e, animation: i}), E += 1, i
        }

        function s(e) {
            var s = new AnimationItem;
            return s.setParams(e), s.addEventListener("destroy", t), v.push({elem: null, animation: s}), E += 1, s
        }

        function r(t, e) {
            var s;
            for (s = 0; E > s; s += 1) v[s].animation.setSpeed(t, e)
        }

        function i(t, e) {
            var s;
            for (s = 0; E > s; s += 1) v[s].animation.setDirection(t, e)
        }

        function a(t) {
            var e;
            for (e = 0; E > e; e += 1) v[e].animation.play(t)
        }

        function n(t, e) {
            P = !1, b = Date.now();
            var s;
            for (s = 0; E > s; s += 1) v[s].animation.moveFrame(t, e)
        }

        function o(t) {
            var e, s = t - b;
            for (e = 0; E > e; e += 1) v[e].animation.advanceTime(s);
            b = t, requestAnimationFrame(o)
        }

        function h(t) {
            b = t, requestAnimationFrame(o)
        }

        function l(t) {
            var e;
            for (e = 0; E > e; e += 1) v[e].animation.pause(t)
        }

        function p(t, e, s) {
            var r;
            for (r = 0; E > r; r += 1) v[r].animation.goToAndStop(t, e, s)
        }

        function m(t) {
            var e;
            for (e = 0; E > e; e += 1) v[e].animation.stop(t)
        }

        function f(t) {
            var e;
            for (e = 0; E > e; e += 1) v[e].animation.togglePause(t)
        }

        function d(t) {
            var e;
            for (e = 0; E > e; e += 1) v[e].animation.destroy(t)
        }

        function c(t, s, r) {
            var i, a = document.getElementsByClassName("bodymovin"), n = a.length;
            for (i = 0; n > i; i += 1) r && a[i].setAttribute("data-bm-type", r), e(a[i], t);
            if (s && 0 === n) {
                r || (r = "svg");
                var o = document.getElementsByTagName("body")[0];
                o.innerHTML = "";
                var h = document.createElement("div");
                h.style.width = "100%", h.style.height = "100%", h.setAttribute("data-bm-type", r), o.appendChild(h), e(h, t)
            }
        }

        function u() {
            var t;
            for (t = 0; E > t; t += 1) v[t].animation.resize()
        }

        function y() {
            requestAnimationFrame(h)
        }

        var g = {}, v = [], b = 0, P = !0, E = 0;
        return setTimeout(y, 0), g.registerAnimation = e, g.loadAnimation = s, g.setSpeed = r, g.setDirection = i, g.play = a, g.moveFrame = n, g.pause = l, g.stop = m, g.togglePause = f, g.searchAnimations = c, g.resize = u, g.start = y, g.goToAndStop = p, g.destroy = d, g
    }(), AnimationItem = function () {
        this._cbs = [], this.name = "", this.path = "", this.isLoaded = !1, this.currentFrame = 0, this.currentRawFrame = 0, this.totalFrames = 0, this.frameRate = 0, this.frameMult = 0, this.playSpeed = 1, this.playDirection = 1, this.pendingElements = 0, this.playCount = 0, this.prerenderFramesFlag = !0, this.animationData = {}, this.layers = [], this.assets = [], this.isPaused = !0, this.autoplay = !1, this.loop = !0, this.renderer = null, this.animationID = randomString(10), this.scaleMode = "fit", this.timeCompleted = 0, this.segmentPos = 0, this.segments = [], this.pendingSegment = !1
    };
    AnimationItem.prototype.setParams = function (t) {
        var e = this;
        t.context && (this.context = t.context), (t.wrapper || t.container) && (this.wrapper = t.wrapper || t.container);
        var s = t.animType ? t.animType : t.renderer ? t.renderer : "canvas";
        switch (s) {
            case"canvas":
                this.renderer = new CanvasRenderer(this, t.rendererSettings);
                break;
            case"svg":
                this.renderer = new SVGRenderer(this, t.rendererSettings);
                break;
            case"hybrid":
            case"html":
            default:
                this.renderer = new HybridRenderer(this, t.rendererSettings)
        }
        if (this.animType = s, "" === t.loop || null === t.loop || (this.loop = t.loop === !1 ? !1 : t.loop === !0 ? !0 : parseInt(t.loop)), this.autoplay = "autoplay" in t ? t.autoplay : !0, this.name = t.name ? t.name : "", this.prerenderFramesFlag = "prerender" in t ? t.prerender : !0, this.autoloadSegments = t.hasOwnProperty("autoloadSegments") ? t.autoloadSegments : !0, t.animationData) e.configAnimation(t.animationData); else if (t.path) {
            "json" != t.path.substr(-4) && ("/" != t.path.substr(-1, 1) && (t.path += "/"), t.path += "data.json");
            var r = new XMLHttpRequest;
            this.path = -1 != t.path.lastIndexOf("\\") ? t.path.substr(0, t.path.lastIndexOf("\\") + 1) : t.path.substr(0, t.path.lastIndexOf("/") + 1), this.fileName = t.path.substr(t.path.lastIndexOf("/") + 1), this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf(".json")), r.open("GET", t.path, !0), r.send(), r.onreadystatechange = function () {
                if (4 == r.readyState) if (200 == r.status) e.configAnimation(JSON.parse(r.responseText)); else try {
                    var t = JSON.parse(r.responseText);
                    e.configAnimation(t)
                } catch (s) {
                }
            }
        }
    }, AnimationItem.prototype.setData = function (t, e) {
        var s = {wrapper: t, animationData: e ? "object" == typeof e ? e : JSON.parse(e) : null}, r = t.attributes;
        s.path = r.getNamedItem("data-animation-path") ? r.getNamedItem("data-animation-path").value : r.getNamedItem("data-bm-path") ? r.getNamedItem("data-bm-path").value : r.getNamedItem("bm-path") ? r.getNamedItem("bm-path").value : "", s.animType = r.getNamedItem("data-anim-type") ? r.getNamedItem("data-anim-type").value : r.getNamedItem("data-bm-type") ? r.getNamedItem("data-bm-type").value : r.getNamedItem("bm-type") ? r.getNamedItem("bm-type").value : r.getNamedItem("data-bm-renderer") ? r.getNamedItem("data-bm-renderer").value : r.getNamedItem("bm-renderer") ? r.getNamedItem("bm-renderer").value : "canvas";
        var i = r.getNamedItem("data-anim-loop") ? r.getNamedItem("data-anim-loop").value : r.getNamedItem("data-bm-loop") ? r.getNamedItem("data-bm-loop").value : r.getNamedItem("bm-loop") ? r.getNamedItem("bm-loop").value : "";
        "" === i || (s.loop = "false" === i ? !1 : "true" === i ? !0 : parseInt(i));
        var a = r.getNamedItem("data-anim-autoplay") ? r.getNamedItem("data-anim-autoplay").value : r.getNamedItem("data-bm-autoplay") ? r.getNamedItem("data-bm-autoplay").value : r.getNamedItem("bm-autoplay") ? r.getNamedItem("bm-autoplay").value : !0;
        s.autoplay = "false" !== a, s.name = r.getNamedItem("data-name") ? r.getNamedItem("data-name").value : r.getNamedItem("data-bm-name") ? r.getNamedItem("data-bm-name").value : r.getNamedItem("bm-name") ? r.getNamedItem("bm-name").value : "";
        var n = r.getNamedItem("data-anim-prerender") ? r.getNamedItem("data-anim-prerender").value : r.getNamedItem("data-bm-prerender") ? r.getNamedItem("data-bm-prerender").value : r.getNamedItem("bm-prerender") ? r.getNamedItem("bm-prerender").value : "";
        "false" === n && (s.prerender = !1), this.setParams(s)
    }, AnimationItem.prototype.includeLayers = function (t) {
        t.op > this.animationData.op && (this.animationData.op = t.op, this.totalFrames = Math.floor(t.op - this.animationData.ip), this.animationData.tf = this.totalFrames);
        var e, s, r = this.animationData.layers, i = r.length, a = t.layers, n = a.length;
        for (s = 0; n > s; s += 1) for (e = 0; i > e;) {
            if (r[e].id == a[s].id) {
                r[e] = a[s];
                break
            }
            e += 1
        }
        if ((t.chars || t.fonts) && (this.renderer.globalData.fontManager.addChars(t.chars), this.renderer.globalData.fontManager.addFonts(t.fonts, this.renderer.globalData.defs)), t.assets) for (i = t.assets.length, e = 0; i > e; e += 1) this.animationData.assets.push(t.assets[e]);
        dataManager.completeData(this.animationData, this.renderer.globalData.fontManager), this.renderer.includeLayers(t.layers), this.renderer.buildStage(this.container, this.layers), expressionsPlugin && expressionsPlugin.initExpressions(this), this.renderer.renderFrame(null), this.loadNextSegment()
    }, AnimationItem.prototype.loadNextSegment = function () {
        var t = this.animationData.segments;
        if (!t || 0 === t.length || !this.autoloadSegments) return this.trigger("data_ready"), void(this.timeCompleted = this.animationData.tf);
        var e = t.shift();
        this.timeCompleted = e.time * this.frameRate;
        var s = new XMLHttpRequest, r = this, i = this.path + this.fileName + "_" + this.segmentPos + ".json";
        this.segmentPos += 1, s.open("GET", i, !0), s.send(), s.onreadystatechange = function () {
            if (4 == s.readyState) if (200 == s.status) r.includeLayers(JSON.parse(s.responseText)); else try {
                var t = JSON.parse(s.responseText);
                r.includeLayers(t)
            } catch (e) {
            }
        }
    }, AnimationItem.prototype.loadSegments = function () {
        var t = this.animationData.segments;
        t || (this.timeCompleted = this.animationData.tf), this.loadNextSegment()
    }, AnimationItem.prototype.configAnimation = function (t) {
        this.animationData = t, this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip), this.animationData.tf = this.totalFrames, this.renderer.configAnimation(t), t.assets || (t.assets = []), t.comps && (t.assets = t.assets.concat(t.comps), t.comps = null), this.layers = this.animationData.layers, this.assets = this.animationData.assets, this.frameRate = this.animationData.fr, this.firstFrame = Math.round(this.animationData.ip), this.frameMult = this.animationData.fr / 1e3, this.trigger("config_ready"), this.loadSegments(), this.updaFrameModifier(), this.renderer.globalData.fontManager ? this.waitForFontsLoaded() : (dataManager.completeData(this.animationData, this.renderer.globalData.fontManager), this.checkLoaded())
    }, AnimationItem.prototype.waitForFontsLoaded = function () {
        function t() {
            this.renderer.globalData.fontManager.loaded ? (dataManager.completeData(this.animationData, this.renderer.globalData.fontManager), this.renderer.buildItems(this.animationData.layers), this.checkLoaded()) : setTimeout(t.bind(this), 20)
        }

        return function () {
            t.bind(this)()
        }
    }(), AnimationItem.prototype.elementLoaded = function () {
        this.pendingElements--, this.checkLoaded()
    }, AnimationItem.prototype.checkLoaded = function () {
        0 === this.pendingElements && (this.renderer.buildStage(this.container, this.layers), expressionsPlugin && expressionsPlugin.initExpressions(this), this.trigger("DOMLoaded"), this.isLoaded = !0, this.gotoFrame(), this.autoplay && this.play())
    }, AnimationItem.prototype.resize = function () {
        this.renderer.updateContainerSize()
    }, AnimationItem.prototype.gotoFrame = function () {
        this.currentFrame = subframeEnabled ? this.currentRawFrame : Math.floor(this.currentRawFrame), this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted && (this.currentFrame = this.timeCompleted), this.trigger("enterFrame"), this.renderFrame()
    }, AnimationItem.prototype.renderFrame = function () {
        this.isLoaded !== !1 && this.renderer.renderFrame(this.currentFrame + this.firstFrame)
    }, AnimationItem.prototype.play = function (t) {
        t && this.name != t || this.isPaused === !0 && (this.isPaused = !1)
    }, AnimationItem.prototype.pause = function (t) {
        t && this.name != t || this.isPaused === !1 && (this.isPaused = !0)
    }, AnimationItem.prototype.togglePause = function (t) {
        t && this.name != t || (this.isPaused === !0 ? (this.isPaused = !1, this.play()) : (this.isPaused = !0, this.pause()))
    }, AnimationItem.prototype.stop = function (t) {
        t && this.name != t || (this.isPaused = !0, this.currentFrame = this.currentRawFrame = 0, this.playCount = 0, this.gotoFrame())
    }, AnimationItem.prototype.goToAndStop = function (t, e, s) {
        s && this.name != s || (this.setCurrentRawFrameValue(e ? t : t * this.frameModifier), this.isPaused = !0)
    }, AnimationItem.prototype.goToAndPlay = function (t, e, s) {
        this.goToAndStop(t, e, s), this.play()
    }, AnimationItem.prototype.advanceTime = function (t) {
        return this.pendingSegment ? (this.pendingSegment = !1, this.adjustSegment(this.segments.shift()),
            void(this.isPaused && this.play())) : void(this.isPaused !== !0 && this.isLoaded !== !1 && this.setCurrentRawFrameValue(this.currentRawFrame + t * this.frameModifier))
    }, AnimationItem.prototype.updateAnimation = function (t) {
        this.setCurrentRawFrameValue(this.totalFrames * t)
    }, AnimationItem.prototype.moveFrame = function (t, e) {
        e && this.name != e || this.setCurrentRawFrameValue(this.currentRawFrame + t)
    }, AnimationItem.prototype.adjustSegment = function (t) {
        this.playCount = 0, t[1] < t[0] ? (this.frameModifier > 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(-1)), this.totalFrames = t[0] - t[1], this.firstFrame = t[1], this.setCurrentRawFrameValue(this.totalFrames - .01)) : t[1] > t[0] && (this.frameModifier < 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(1)), this.totalFrames = t[1] - t[0], this.firstFrame = t[0], this.setCurrentRawFrameValue(0)), this.trigger("segmentStart")
    }, AnimationItem.prototype.playSegments = function (t, e) {
        if ("object" == typeof t[0]) {
            var s, r = t.length;
            for (s = 0; r > s; s += 1) this.segments.push(t[s])
        } else this.segments.push(t);
        e && this.adjustSegment(this.segments.shift()), this.isPaused && this.play()
    }, AnimationItem.prototype.resetSegments = function (t) {
        this.segments.length = 0, this.segments.push([this.animationData.ip * this.frameRate, Math.floor(this.animationData.op - this.animationData.ip + this.animationData.ip * this.frameRate)]), t && this.adjustSegment(this.segments.shift())
    }, AnimationItem.prototype.checkSegments = function () {
        this.segments.length && (this.pendingSegment = !0)
    }, AnimationItem.prototype.remove = function (t) {
        t && this.name != t || this.renderer.destroy()
    }, AnimationItem.prototype.destroy = function (t) {
        t && this.name != t || this.renderer && this.renderer.destroyed || (this.renderer.destroy(), this.trigger("destroy"), this._cbs = null)
    }, AnimationItem.prototype.setCurrentRawFrameValue = function (t) {
        if (this.currentRawFrame = t, this.currentRawFrame >= this.totalFrames) {
            if (this.checkSegments(), this.loop === !1) return this.currentRawFrame = this.totalFrames - .01, this.gotoFrame(), this.pause(), void this.trigger("complete");
            if (this.trigger("loopComplete"), this.playCount += 1, this.loop !== !0 && this.playCount == this.loop || this.pendingSegment) return this.currentRawFrame = this.totalFrames - .01, this.gotoFrame(), this.pause(), void this.trigger("complete");
            this.currentRawFrame = this.currentRawFrame % this.totalFrames
        } else if (this.currentRawFrame < 0) return this.checkSegments(), this.playCount -= 1, this.playCount < 0 && (this.playCount = 0), this.loop === !1 || this.pendingSegment ? (this.currentRawFrame = 0, this.gotoFrame(), this.pause(), void this.trigger("complete")) : (this.trigger("loopComplete"), this.currentRawFrame = (this.totalFrames + this.currentRawFrame) % this.totalFrames, void this.gotoFrame());
        this.gotoFrame()
    }, AnimationItem.prototype.setSpeed = function (t) {
        this.playSpeed = t, this.updaFrameModifier()
    }, AnimationItem.prototype.setDirection = function (t) {
        this.playDirection = 0 > t ? -1 : 1, this.updaFrameModifier()
    }, AnimationItem.prototype.updaFrameModifier = function () {
        this.frameModifier = this.frameMult * this.playSpeed * this.playDirection
    }, AnimationItem.prototype.getPath = function () {
        return this.path
    }, AnimationItem.prototype.getAssetData = function (t) {
        for (var e = 0, s = this.assets.length; s > e;) {
            if (t == this.assets[e].id) return this.assets[e];
            e += 1
        }
    }, AnimationItem.prototype.hide = function () {
        this.renderer.hide()
    }, AnimationItem.prototype.show = function () {
        this.renderer.show()
    }, AnimationItem.prototype.getAssets = function () {
        return this.assets
    }, AnimationItem.prototype.trigger = function (t) {
        if (this._cbs[t]) switch (t) {
            case"enterFrame":
                this.triggerEvent(t, new BMEnterFrameEvent(t, this.currentFrame, this.totalFrames, this.frameMult));
                break;
            case"loopComplete":
                this.triggerEvent(t, new BMCompleteLoopEvent(t, this.loop, this.playCount, this.frameMult));
                break;
            case"complete":
                this.triggerEvent(t, new BMCompleteEvent(t, this.frameMult));
                break;
            case"segmentStart":
                this.triggerEvent(t, new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames));
                break;
            case"destroy":
                this.triggerEvent(t, new BMDestroyEvent(t, this));
                break;
            default:
                this.triggerEvent(t)
        }
        "enterFrame" === t && this.onEnterFrame && this.onEnterFrame.call(this, new BMEnterFrameEvent(t, this.currentFrame, this.totalFrames, this.frameMult)), "loopComplete" === t && this.onLoopComplete && this.onLoopComplete.call(this, new BMCompleteLoopEvent(t, this.loop, this.playCount, this.frameMult)), "complete" === t && this.onComplete && this.onComplete.call(this, new BMCompleteEvent(t, this.frameMult)), "segmentStart" === t && this.onSegmentStart && this.onSegmentStart.call(this, new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames)), "destroy" === t && this.onDestroy && this.onDestroy.call(this, new BMDestroyEvent(t, this))
    }, AnimationItem.prototype.addEventListener = _addEventListener, AnimationItem.prototype.removeEventListener = _removeEventListener, AnimationItem.prototype.triggerEvent = _triggerEvent;
    var Expressions = function () {
        function t(e) {
            var s, r = e.length;
            for (s = 0; r > s; s += 1) e[s].layerInterface || (e[s].layerInterface = LayerExpressionInterface(e[s]), e[s].data.hasMask && e[s].layerInterface.registerMaskInterface(e[s].maskManager), 0 === e[s].data.ty ? e[s].compInterface = CompExpressionInterface(e[s]) : 4 === e[s].data.ty && (e[s].layerInterface.shapeInterface = ShapeExpressionInterface.createShapeInterface(e[s].shapesData, e[s].viewData, e[s].layerInterface))), 0 === e[s].data.ty && t(e[s].elements)
        }

        function e(e) {
            e.renderer.compInterface = CompExpressionInterface(e.renderer), t(e.renderer.elements)
        }

        function s(t, e, s) {
            return new EffectsManager(t, e, s)
        }

        var r = {};
        return r.initExpressions = e, r.getEffectsManager = s, r
    }();
    expressionsPlugin = Expressions, function () {
        function t(t) {
            for (var e, s, r = 0, i = this.keyframes.length - 1, a = 1, n = !0, o = 0, h = "object" == typeof this.pv ? [this.pv.length] : 0; n;) {
                if (e = this.keyframes[r], s = this.keyframes[r + 1], r == i - 1 && t >= s.t - o) {
                    e.h && (e = s);
                    break
                }
                if (s.t - o > t) break;
                i - 1 > r ? r += a : n = !1
            }
            var l, p, m, f, d, c = 0;
            if (e.to) {
                e.bezierData || bez.buildBezierData(e);
                var u = e.bezierData;
                if (t >= s.t - o || t < e.t - o) {
                    var y = t >= s.t - o ? u.points.length - 1 : 0;
                    for (p = u.points[y].point.length, l = 0; p > l; l += 1) h[l] = u.points[y].point[l]
                } else {
                    e.__fnct ? d = e.__fnct : (d = BezierFactory.getBezierEasing(e.o.x, e.o.y, e.i.x, e.i.y, e.n).get, e.__fnct = d), m = d((t - (e.t - o)) / (s.t - o - (e.t - o)));
                    var g, v = u.segmentLength * m, b = 0;
                    for (a = 1, n = !0, f = u.points.length; n;) {
                        if (b += u.points[c].partialLength * a, 0 === v || 0 === m || c == u.points.length - 1) {
                            for (p = u.points[c].point.length, l = 0; p > l; l += 1) h[l] = u.points[c].point[l];
                            break
                        }
                        if (v >= b && v < b + u.points[c + 1].partialLength) {
                            for (g = (v - b) / u.points[c + 1].partialLength, p = u.points[c].point.length, l = 0; p > l; l += 1) h[l] = u.points[c].point[l] + (u.points[c + 1].point[l] - u.points[c].point[l]) * g;
                            break
                        }
                        f - 1 > c && 1 == a || c > 0 && -1 == a ? c += a : n = !1
                    }
                }
            } else {
                var P, E, k, S, x, C = !1;
                for (i = e.s.length, r = 0; i > r; r += 1) {
                    if (1 !== e.h && (e.o.x instanceof Array ? (C = !0, e.__fnct || (e.__fnct = []), e.__fnct[r] || (P = e.o.x[r] || e.o.x[0], E = e.o.y[r] || e.o.y[0], k = e.i.x[r] || e.i.x[0], S = e.i.y[r] || e.i.y[0])) : (C = !1, e.__fnct || (P = e.o.x, E = e.o.y, k = e.i.x, S = e.i.y)), C ? e.__fnct[r] ? d = e.__fnct[r] : (d = BezierFactory.getBezierEasing(P, E, k, S).get, e.__fnct[r] = d) : e.__fnct ? d = e.__fnct : (d = BezierFactory.getBezierEasing(P, E, k, S).get, e.__fnct = d), m = t >= s.t - o ? 1 : t < e.t - o ? 0 : d((t - (e.t - o)) / (s.t - o - (e.t - o)))), this.sh && 1 !== e.h) {
                        var M = e.s[r], D = e.e[r];
                        -180 > M - D ? M += 360 : M - D > 180 && (M -= 360), x = M + (D - M) * m
                    } else x = 1 === e.h ? e.s[r] : e.s[r] + (e.e[r] - e.s[r]) * m;
                    1 === i ? h = x : h[r] = x
                }
            }
            return h
        }

        function e(t) {
            var e, s = .01, r = this.getValueAtTime(t), i = this.getValueAtTime(t + s);
            if (r.length) {
                e = Array.apply(null, {length: r.length});
                var a;
                for (a = 0; a < r.length; a += 1) e[a] = this.elem.globalData.frameRate * ((i[a] - r[a]) / s)
            } else e = (i - r) / s;
            return e
        }

        function s(t) {
            this.propertyGroup = t
        }

        function r(t, e, s) {
            e.x && (s.k = !0, s.x = !0, s.getValue && (s.getPreValue = s.getValue), s.getValue = ExpressionManager.initiateExpression.bind(s)(t, e, s))
        }

        var i = function () {
            function t(t, e) {
                return this.textIndex = t + 1, this.textTotal = e, this.getValue(), this.v
            }

            return function (e, s) {
                this.pv = 1, this.comp = e.comp, this.mult = .01, this.type = "textSelector", this.textTotal = s.totalChars, this.selectorValue = 100, this.lastValue = [1, 1, 1], r.bind(this)(e, s, this), this.getMult = t
            }
        }(), a = PropertyFactory.getProp;
        PropertyFactory.getProp = function (i, n, o, h, l) {
            var p = a(i, n, o, h, l);
            p.getVelocityAtTime = e, p.getValueAtTime = t, p.setGroupProperty = s;
            var m = p.k;
            return void 0 !== n.ix && Object.defineProperty(p, "propertyIndex", {
                get: function () {
                    return n.ix
                }
            }), r(i, n, p), !m && p.x && l.push(p), p
        };
        var n = ShapePropertyFactory.getShapeProp;
        ShapePropertyFactory.getShapeProp = function (t, e, r, i, a) {
            var o = n(t, e, r, i, a), h = "tm" === o.ty ? o.prop : o;
            return h.setGroupProperty = s, void 0 !== e.ix && Object.defineProperty(h, "propertyIndex", {
                get: function () {
                    return e.ix
                }
            }), o
        };
        var o = PropertyFactory.getTextSelectorProp;
        PropertyFactory.getTextSelectorProp = function (t, e, s) {
            return 1 === e.t ? new i(t, e, s) : o(t, e, s)
        }
    }();
    var ExpressionManager = function () {
        function duplicatePropertyValue(t) {
            if ("number" == typeof t) return t;
            if (t.i) return JSON.parse(JSON.stringify(t));
            var e, s = Array.apply(null, {length: t.length}), r = t.length;
            for (e = 0; r > e; e += 1) s[e] = t[e];
            return s
        }

        function sum(t, e) {
            var s = typeof t, r = typeof e;
            if ("string" === s || "string" === r) return t + e;
            if (!("number" !== s && "boolean" !== s || "number" !== r && "boolean" !== r)) return t + e;
            if ("object" === s && ("number" === r || "boolean" === r)) return t[0] = t[0] + e, t;
            if (("number" === s || "boolean" === s) && "object" === r) return e[0] = t + e[0], e;
            if ("object" === s && "object" === r) {
                for (var i = 0, a = t.length, n = e.length, o = []; a > i || n > i;) o[i] = "number" == typeof t[i] && "number" == typeof e[i] ? t[i] + e[i] : t[i] || e[i], i += 1;
                return o
            }
            return 0
        }

        function sub(t, e) {
            var s = typeof t, r = typeof e;
            if (!("number" !== s && "boolean" !== s || "number" !== r && "boolean" !== r)) return t - e;
            if ("object" === s && ("number" === r || "boolean" === r)) return t[0] = t[0] - e, t;
            if (("number" === s || "boolean" === s) && "object" === r) return e[0] = t - e[0], e;
            if ("object" === s && "object" === r) {
                for (var i = 0, a = t.length, n = e.length, o = []; a > i || n > i;) o[i] = "number" == typeof t[i] && "number" == typeof e[i] ? t[i] - e[i] : t[i] || e[i], i += 1;
                return o
            }
            return 0
        }

        function mul(t, e) {
            var s = typeof t, r = typeof e;
            if (!("number" !== s && "boolean" !== s || "number" !== r && "boolean" !== r)) return t * e;
            var i, a;
            if ("object" === s && ("number" === r || "boolean" === r)) {
                for (a = t.length, arr = Array.apply(null, {length: a}), i = 0; a > i; i += 1) arr[i] = t[i] * e;
                return arr
            }
            if (("number" === s || "boolean" === s) && "object" === r) {
                for (a = e.length, arr = Array.apply(null, {length: a}), i = 0; a > i; i += 1) arr[i] = t * e[i];
                return arr
            }
            return 0
        }

        function div(t, e) {
            var s = typeof t, r = typeof e;
            if (!("number" !== s && "boolean" !== s || "number" !== r && "boolean" !== r)) return t / e;
            var i, a;
            if ("object" === s && ("number" === r || "boolean" === r)) {
                for (a = t.length, arr = Array.apply(null, {length: a}), i = 0; a > i; i += 1) arr[i] = t[i] / e;
                return arr
            }
            if (("number" === s || "boolean" === s) && "object" === r) {
                for (a = e.length, arr = Array.apply(null, {length: a}), i = 0; a > i; i += 1) arr[i] = t / e[i];
                return arr
            }
            return 0
        }

        function clamp(t, e, s) {
            if (e > s) {
                var r = s;
                s = e, e = r
            }
            return Math.min(Math.max(t, e), s)
        }

        function radiansToDegrees(t) {
            return t / degToRads
        }

        function length(t, e) {
            var s, r = Math.min(t.length, e.length), i = 0;
            for (s = 0; r > s; s += 1) i += Math.pow(e[s] - t[s], 2);
            return Math.sqrt(i)
        }

        function rgbToHsl(t) {
            var e, s, r = t[0], i = t[1], a = t[2], n = Math.max(r, i, a), o = Math.min(r, i, a), h = (n + o) / 2;
            if (n == o) e = s = 0; else {
                var l = n - o;
                switch (s = h > .5 ? l / (2 - n - o) : l / (n + o), n) {
                    case r:
                        e = (i - a) / l + (a > i ? 6 : 0);
                        break;
                    case i:
                        e = (a - r) / l + 2;
                        break;
                    case a:
                        e = (r - i) / l + 4
                }
                e /= 6
            }
            return [e, s, h, t[3]]
        }

        function hslToRgb(t) {
            function e(t, e, s) {
                return 0 > s && (s += 1), s > 1 && (s -= 1), 1 / 6 > s ? t + 6 * (e - t) * s : .5 > s ? e : 2 / 3 > s ? t + (e - t) * (2 / 3 - s) * 6 : t
            }

            var s, r, i, a = t[0], n = t[1], o = t[2];
            if (0 == n) s = r = i = o; else {
                var h = .5 > o ? o * (1 + n) : o + n - o * n, l = 2 * o - h;
                s = e(l, h, a + 1 / 3), r = e(l, h, a), i = e(l, h, a - 1 / 3)
            }
            return [s, r, i, t[3]]
        }

        function linear(t, e, s, r, i) {
            if (void 0 === r || void 0 === i) return linear(t, 0, 1, e, s);
            if (e >= t) return r;
            if (t >= s) return i;
            var a = t / (s - e);
            if (!r.length) return r + (i - r) * a;
            var n, o = r.length, h = Array.apply(null, {length: o});
            for (n = 0; o > n; n += 1) h[n] = r[n] + (i[n] - r[n]) * a;
            return h
        }

        function seedRandom(t) {
            BMMath.seedrandom(t)
        }

        function random(t, e) {
            if (void 0 === e && (void 0 === t ? (t = 0, e = 1) : (e = t, t = void 0)), e.length) {
                var s, r = e.length;
                t || (t = Array.apply(null, {length: r}));
                var i = Array.apply(null, {length: r}), a = BMMath.random();
                for (s = 0; r > s; s += 1) i[s] = t[s] + a * (e[s] - t[s]);
                return i
            }
            void 0 === t && (t = 0);
            var n = BMMath.random();
            return t + n * (e - t)
        }

        function initiateExpression(elem, data, property) {
            function effect(t) {
                return elem.effectsManager(t)
            }

            function lookAt(t, e) {
                var s = [e[0] - t[0], e[1] - t[1], e[2] - t[2]],
                    r = Math.atan2(s[0], Math.sqrt(s[1] * s[1] + s[2] * s[2])) / degToRads,
                    i = -Math.atan2(s[1], s[2]) / degToRads;
                return [i, r, 0]
            }

            function easeOut(t, e, s) {
                return -(s - e) * t * (t - 2) + e
            }

            function nearestKey(t) {
                var e, s, r = data.k.length;
                if (data.k.length && "number" != typeof data.k[0]) for (e = 0; r > e; e += 1) {
                    if (t === data.k[e].t) {
                        s = e + 1;
                        break
                    }
                    if (t < data.k[e].t) {
                        s = e + 1;
                        break
                    }
                    if (t > data.k[e].t && e === r - 1) {
                        s = r;
                        break
                    }
                } else s = 0;
                var i = {};
                return i.index = s, i
            }

            function key(t) {
                if (!data.k.length || "number" == typeof data.k[0]) return {time: 0};
                t -= 1;
                var e, s = {time: data.k[t].t / elem.comp.globalData.frameRate};
                e = t === data.k.length - 1 ? data.k[t - 1].e : data.k[t].s;
                var r, i = e.length;
                for (r = 0; i > r; r += 1) s[r] = e[r];
                return s
            }

            function framesToTime(t, e) {
                return e || (e = elem.comp.globalData.frameRate), t / e
            }

            function timeToFrames(t, e) {
                return t || (t = time), e || (e = elem.comp.globalData.frameRate), t * e
            }

            function execute() {
                if (this.frameExpressionId !== elem.globalData.frameId || "textSelector" === this.type) {
                    if (this.lock) return this.v = duplicatePropertyValue(this.pv), !0;
                    "textSelector" === this.type && (textIndex = this.textIndex, textTotal = this.textTotal, selectorValue = this.selectorValue), transform || (transform = elem.transform), thisLayer || (thisLayer = elem.layerInterface, thisComp = elem.comp.compInterface), 4 !== elemType || content || (content = thisLayer("ADBE Root Vectors Group")), this.lock = !0, this.getPreValue && this.getPreValue(), value = this.pv, time = this.comp.renderedFrame / this.comp.globalData.frameRate, bindedFn(), "object" == typeof this.v && isNaN(this.v[0]), this.frameExpressionId = elem.globalData.frameId;
                    var t, e;
                    if (this.mult) if ("number" == typeof this.v) this.v *= this.mult; else for (e = this.v.length, value === this.v && (this.v = 2 === e ? [value[0], value[1]] : [value[0], value[1], value[2]]), t = 0; e > t; t += 1) this.v[t] *= this.mult;
                    if ("number" == typeof this.v) this.lastValue !== this.v && (this.lastValue = this.v, this.mdf = !0); else if (this.v.i) this.mdf = !0; else for (e = this.v.length, t = 0; e > t; t += 1) this.v[t] !== this.lastValue[t] && (this.lastValue[t] = this.v[t], this.mdf = !0);
                    this.lock = !1
                }
            }

            var val = data.x, elemType = elem.data.ty, transform, content, effect, thisComp = elem.comp,
                thisProperty = property;
            elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate;
            var inPoint = elem.data.ip / elem.comp.globalData.frameRate,
                outPoint = elem.data.op / elem.comp.globalData.frameRate, thisLayer, thisComp,
                fnStr = "var fn = function(){" + val + ";this.v = $bm_rt;}";
            eval(fnStr);
            var bindedFn = fn.bind(this), numKeys = data.k ? data.k.length : 0, wiggle = function (t, e) {
                    var s, r, i = this.pv.length ? this.pv.length : 1, a = Array.apply(null, {len: i});
                    for (r = 0; i > r; r += 1) a[r] = 0;
                    t = 5;
                    var n = Math.floor(time * t);
                    for (s = 0, r = 0; n > s;) {
                        for (r = 0; i > r; r += 1) a[r] += -e + 2 * e * BMMath.random();
                        s += 1
                    }
                    var o = time * t, h = o - Math.floor(o), l = Array.apply({length: i});
                    for (r = 0; i > r; r += 1) l[r] = this.pv[r] + a[r] + (-e + 2 * e * BMMath.random()) * h;
                    return l
                }.bind(this), loopIn = function (t, e, s) {
                    if (!this.k) return this.pv;
                    var r = time * elem.comp.globalData.frameRate, i = this.keyframes, a = i[0].t;
                    if (r >= a) return this.pv;
                    var n, o;
                    s ? (n = e ? Math.abs(elem.comp.globalData.frameRate * e) : Math.max(0, this.elem.data.op - a), o = a + n) : ((!e || e > i.length - 1) && (e = i.length - 1), o = i[e].t, n = o - a);
                    var h, l, p;
                    if ("pingpong" === t) {
                        var m = Math.floor((a - r) / n);
                        if (m % 2 === 0) return this.getValueAtTime((a - r) % n + a)
                    } else {
                        if ("offset" === t) {
                            var f = this.getValueAtTime(a), d = this.getValueAtTime(o),
                                c = this.getValueAtTime(n - (a - r) % n + a), u = Math.floor((a - r) / n) + 1;
                            if (this.pv.length) {
                                for (p = new Array(f.length), l = p.length, h = 0; l > h; h += 1) p[h] = c[h] - (d[h] - f[h]) * u;
                                return p
                            }
                            return c - (d - f) * u
                        }
                        if ("continue" === t) {
                            var y = this.getValueAtTime(a), g = this.getValueAtTime(a + .001);
                            if (this.pv.length) {
                                for (p = new Array(y.length), l = p.length, h = 0; l > h; h += 1) p[h] = y[h] + (y[h] - g[h]) * (a - r) / 5e-4;
                                return p
                            }
                            return y + (y - g) * (a - r) / 5e-4
                        }
                    }
                    return this.getValueAtTime(n - (a - r) % n + a)
                }.bind(this), loopInDuration = function (t, e) {
                    return loopIn(t, e, !0)
                }.bind(this), loopOut = function (t, e, s) {
                    if (!this.k) return this.pv;
                    var r = time * elem.comp.globalData.frameRate, i = this.keyframes, a = i[i.length - 1].t;
                    if (a >= r) return this.pv;
                    var n, o;
                    s ? (n = e ? Math.abs(a - elem.comp.globalData.frameRate * e) : Math.max(0, a - this.elem.data.ip), o = a - n) : ((!e || e > i.length - 1) && (e = i.length - 1), o = i[i.length - 1 - e].t, n = a - o);
                    var h, l, p;
                    if ("pingpong" === t) {
                        var m = Math.floor((r - o) / n);
                        if (m % 2 !== 0) return this.getValueAtTime(n - (r - o) % n + o)
                    } else {
                        if ("offset" === t) {
                            var f = this.getValueAtTime(o), d = this.getValueAtTime(a),
                                c = this.getValueAtTime((r - o) % n + o), u = Math.floor((r - o) / n);
                            if (this.pv.length) {
                                for (p = new Array(f.length), l = p.length, h = 0; l > h; h += 1) p[h] = (d[h] - f[h]) * u + c[h];
                                return p
                            }
                            return (d - f) * u + c
                        }
                        if ("continue" === t) {
                            var y = this.getValueAtTime(a), g = this.getValueAtTime(a - .001);
                            if (this.pv.length) {
                                for (p = new Array(y.length), l = p.length, h = 0; l > h; h += 1) p[h] = y[h] + (y[h] - g[h]) * (r - a) / 5e-4;
                                return p
                            }
                            return y + (y - g) * (r - a) / 5e-4
                        }
                    }
                    return this.getValueAtTime((r - o) % n + o)
                }.bind(this), loop_out = loopOut, loopOutDuration = function (t, e) {
                    return loopOut(t, e, !0)
                }.bind(this), valueAtTime = function (t) {
                    return this.getValueAtTime(t * elem.comp.globalData.frameRate)
                }.bind(this), velocityAtTime = function (t) {
                    return this.getVelocityAtTime(t * elem.comp.globalData.frameRate)
                }.bind(this), time, value, textIndex, textTotal, selectorValue, index = elem.data.ind + 1,
                hasParent = !(!elem.hierarchy || !elem.hierarchy.length);
            return execute
        }

        var ob = {};
        return ob.initiateExpression = initiateExpression, ob
    }(), ShapeExpressionInterface = function () {
        function t(t, e, s) {
            return m(t, e, s)
        }

        function e(t, e, s) {
            return f(t, e, s)
        }

        function s(t, e, s) {
            return d(t, e, s)
        }

        function r(t, e, s) {
            return c(t, e, s)
        }

        function i(t, e, s) {
            return u(t, e, s)
        }

        function a(t, e, s) {
            return y(t, e, s)
        }

        function n(t, e, s) {
            return g(t, e, s)
        }

        function o(t, e, s) {
            return v(t, e, s)
        }

        function h(t, e, s) {
            return b(t, e, s)
        }

        function l(t, e, s) {
            var r, i = [], a = t.length;
            for (r = 0; a > r; r += 1) "gr" == t[r].ty ? i.push(ShapeExpressionInterface.createGroupInterface(t[r], e[r], s)) : "fl" == t[r].ty ? i.push(ShapeExpressionInterface.createFillInterface(t[r], e[r], s)) : "st" == t[r].ty ? i.push(ShapeExpressionInterface.createStrokeInterface(t[r], e[r], s)) : "tm" == t[r].ty ? i.push(ShapeExpressionInterface.createTrimInterface(t[r], e[r], s)) : "tr" == t[r].ty ? i.push(ShapeExpressionInterface.createTransformInterface(t[r], e[r], s)) : "el" == t[r].ty ? i.push(ShapeExpressionInterface.createEllipseInterface(t[r], e[r], s)) : "sr" == t[r].ty ? i.push(ShapeExpressionInterface.createStarInterface(t[r], e[r], s)) : "sh" == t[r].ty && i.push(ShapeExpressionInterface.createPathInterface(t[r], e[r], s));
            return i
        }

        var p = {
            createShapeInterface: t,
            createGroupInterface: e,
            createTrimInterface: i,
            createStrokeInterface: r,
            createTransformInterface: a,
            createEllipseInterface: n,
            createStarInterface: o,
            createPathInterface: h,
            createFillInterface: s
        }, m = function () {
            return function (t, e, s) {
                function r(t) {
                    if ("number" == typeof t) return i[t - 1];
                    for (var e = 0, s = i.length; s > e;) {
                        if (i[e]._name === t) return i[e];
                        e += 1
                    }
                }

                var i;
                return r.propertyGroup = s, i = l(t, e, r), r
            }
        }(), f = function () {
            return function (t, e, s) {
                var r, i = function (t) {
                    if ("ADBE Vectors Group" === t) return i;
                    if ("ADBE Vector Transform Group" === t) {
                        for (var e = 0, s = r.length; s > e;) {
                            if ("tr" === r[e].ty) return r[e];
                            e += 1
                        }
                        return null
                    }
                    if ("number" == typeof t) return r[t - 1];
                    for (var e = 0, s = r.length; s > e;) {
                        if (r[e]._name === t) return r[e];
                        e += 1
                    }
                };
                return i.propertyGroup = function (t) {
                    return 1 === t ? i : s(t - 1)
                }, r = l(t.it, e.it, i.propertyGroup), Object.defineProperty(i, "_name", {
                    get: function () {
                        return t.nm
                    }
                }), i.content = i, i.nm = t.nm, i
            }
        }(), d = function () {
            return function (t, e, s) {
                e.c.setGroupProperty(s), e.o.setGroupProperty(s);
                var r = {
                    get color() {
                        return e.c.k && e.c.getValue(), [45, 30, 68]
                    }, get opacity() {
                        return e.o.k && e.o.getValue(), e.o.v
                    }, _name: t.nm
                };
                return r
            }
        }(), c = function () {
            return function (t, e, s) {
                e.c.setGroupProperty(s), e.o.setGroupProperty(s), e.w.setGroupProperty(s);
                var r = {
                    get color() {
                        return e.c.k && e.c.getValue(), [e.c.v[0] / e.c.mult, e.c.v[1] / e.c.mult, e.c.v[2] / e.c.mult, 1]
                    }, get opacity() {
                        return e.o.k && e.o.getValue(), e.o.v
                    }, get strokeWidth() {
                        return e.w.k && e.w.getValue(), e.w.v
                    }, dashOb: {}, get dash() {
                        var r, i = e.d, a = t.d, n = a.length;
                        for (r = 0; n > r; r += 1) i.dataProps[r].p.k && i.dataProps[r].p.getValue(), i.dataProps[r].p.setGroupProperty(s), this.dashOb[a[r].nm] = i.dataProps[r].p.v;
                        return this.dashOb
                    }, _name: t.nm
                };
                return r
            }
        }(), u = function () {
            return function (t, e, s) {
                function r(t) {
                    return 1 == t ? r : s(--t)
                }

                function i(e) {
                    return e === t.e.ix ? i.end : e === t.s.ix ? i.start : e === t.o.ix ? i.offset : void 0
                }

                return r.propertyIndex = t.ix, e.s.setGroupProperty(r), e.e.setGroupProperty(r), e.o.setGroupProperty(r), Object.defineProperty(i, "start", {
                    get: function () {
                        return e.s.k && e.s.getValue(), e.s.v / e.s.mult
                    }
                }), Object.defineProperty(i, "end", {
                    get: function () {
                        return e.e.k && e.e.getValue(), e.e.v / e.e.mult
                    }
                }), Object.defineProperty(i, "offset", {
                    get: function () {
                        return e.o.k && e.o.getValue(), e.o.v
                    }
                }), Object.defineProperty(i, "_name", {
                    get: function () {
                        return t.nm
                    }
                }), i
            }
        }(), y = function () {
            return function (t, e, s) {
                function r(t) {
                    return 1 == t ? r : s(--t)
                }

                function i(e) {
                    return t.a.ix === e ? i.anchorPoint : t.o.ix === e ? i.opacity : t.p.ix === e ? i.position : t.r.ix === e ? i.rotation : t.s.ix === e ? i.scale : t.sk && t.sk.ix === e ? i.skew : t.sa && t.sa.ix === e ? i.skewAxis : void 0
                }

                e.transform.mProps.o.setGroupProperty(r), e.transform.mProps.p.setGroupProperty(r), e.transform.mProps.a.setGroupProperty(r), e.transform.mProps.s.setGroupProperty(r), e.transform.mProps.r.setGroupProperty(r), e.transform.mProps.sk && (e.transform.mProps.sk.setGroupProperty(r), e.transform.mProps.sa.setGroupProperty(r)), e.transform.op.setGroupProperty(r), Object.defineProperty(i, "opacity", {
                    get: function () {
                        return e.transform.mProps.o.k && e.transform.mProps.o.getValue(), e.transform.mProps.o.v
                    }
                }), Object.defineProperty(i, "position", {
                    get: function () {
                        return e.transform.mProps.p.k && e.transform.mProps.p.getValue(), [e.transform.mProps.p.v[0], e.transform.mProps.p.v[1]]
                    }
                }), Object.defineProperty(i, "anchorPoint", {
                    get: function () {
                        return e.transform.mProps.a.k && e.transform.mProps.a.getValue(), [e.transform.mProps.a.v[0], e.transform.mProps.a.v[1]]
                    }
                });
                var a = [];
                return Object.defineProperty(i, "scale", {
                    get: function () {
                        return e.transform.mProps.s.k && e.transform.mProps.s.getValue(), a[0] = e.transform.mProps.s.v[0] / e.transform.mProps.s.mult, a[1] = e.transform.mProps.s.v[1] / e.transform.mProps.s.mult, a
                    }
                }), Object.defineProperty(i, "rotation", {
                    get: function () {
                        return e.transform.mProps.r.k && e.transform.mProps.r.getValue(), e.transform.mProps.r.v / e.transform.mProps.r.mult
                    }
                }), Object.defineProperty(i, "skew", {
                    get: function () {
                        return e.transform.mProps.sk.k && e.transform.mProps.sk.getValue(), e.transform.mProps.sk.v
                    }
                }), Object.defineProperty(i, "skewAxis", {
                    get: function () {
                        return e.transform.mProps.sa.k && e.transform.mProps.sa.getValue(), e.transform.mProps.sa.v
                    }
                }), Object.defineProperty(i, "_name", {
                    get: function () {
                        return t.nm
                    }
                }), i.ty = "tr", i
            }
        }(), g = function () {
            return function (t, e, s) {
                function r(t) {
                    return 1 == t ? r : s(--t)
                }

                function i(e) {
                    return t.p.ix === e ? i.position : t.s.ix === e ? i.size : void 0
                }

                r.propertyIndex = t.ix;
                var a = "tm" === e.sh.ty ? e.sh.prop : e.sh;
                return a.s.setGroupProperty(r), a.p.setGroupProperty(r), Object.defineProperty(i, "size", {
                    get: function () {
                        return a.s.k && a.s.getValue(), [a.s.v[0], a.s.v[1]]
                    }
                }), Object.defineProperty(i, "position", {
                    get: function () {
                        return a.p.k && a.p.getValue(), [a.p.v[0], a.p.v[1]]
                    }
                }), Object.defineProperty(i, "_name", {
                    get: function () {
                        return t.nm
                    }
                }), i
            }
        }(), v = function () {
            return function (t, e, s) {
                function r(t) {
                    return 1 == t ? r : s(--t)
                }

                function i(e) {
                    return t.p.ix === e ? i.position : t.r.ix === e ? i.rotation : t.pt.ix === e ? i.points : t.or.ix === e || "ADBE Vector Star Outer Radius" === e ? i.outerRadius : t.os.ix === e ? i.outerRoundness : !t.ir || t.ir.ix !== e && "ADBE Vector Star Inner Radius" !== e ? t.is && t.is.ix === e ? i.innerRoundness : void 0 : i.innerRadius
                }

                var a = "tm" === e.sh.ty ? e.sh.prop : e.sh;
                return r.propertyIndex = t.ix, a.or.setGroupProperty(r), a.os.setGroupProperty(r), a.pt.setGroupProperty(r), a.p.setGroupProperty(r), a.r.setGroupProperty(r), t.ir && (a.ir.setGroupProperty(r), a.is.setGroupProperty(r)), Object.defineProperty(i, "position", {
                    get: function () {
                        return a.p.k && a.p.getValue(), a.p.v
                    }
                }), Object.defineProperty(i, "rotation", {
                    get: function () {
                        return a.r.k && a.r.getValue(), a.r.v / a.r.mult
                    }
                }), Object.defineProperty(i, "points", {
                    get: function () {
                        return a.pt.k && a.pt.getValue(), a.pt.v
                    }
                }), Object.defineProperty(i, "outerRadius", {
                    get: function () {
                        return a.or.k && a.or.getValue(), a.or.v
                    }
                }), Object.defineProperty(i, "outerRoundness", {
                    get: function () {
                        return a.os.k && a.os.getValue(), a.os.v / a.os.mult
                    }
                }), Object.defineProperty(i, "innerRadius", {
                    get: function () {
                        return a.ir ? (a.ir.k && a.ir.getValue(), a.ir.v) : 0
                    }
                }), Object.defineProperty(i, "innerRoundness", {
                    get: function () {
                        return a.is ? (a.is.k && a.is.getValue(), a.is.v / a.is.mult) : 0
                    }
                }), Object.defineProperty(i, "_name", {
                    get: function () {
                        return t.nm
                    }
                }), i
            }
        }(), b = function () {
            return function (t, e, s) {
                var r = "tm" === e.sh.ty ? e.sh.prop : e.sh;
                r.setGroupProperty(s);
                var i = {
                    get shape() {
                        return r.k && r.getValue(), r.v
                    }, get path() {
                        return r.k && r.getValue(), r.v
                    }, _name: t.nm
                };
                return i
            }
        }();
        return p
    }(), LayerExpressionInterface = function () {
        function t(t) {
            var e = new Matrix;
            if (e.reset(), this._elem.finalTransform.mProp.applyToMatrix(e), this._elem.hierarchy && this._elem.hierarchy.length) {
                var s, r = this._elem.hierarchy.length;
                for (s = 0; r > s; s += 1) this._elem.hierarchy[s].finalTransform.mProp.applyToMatrix(e);
                return e.applyToPointArray(t[0], t[1], t[2] || 0)
            }
            return e.applyToPointArray(t[0], t[1], t[2] || 0)
        }

        return function (e) {
            function s(t) {
                r.mask = t.getMask.bind(t)
            }

            function r(t) {
                switch (t) {
                    case"ADBE Root Vectors Group":
                        return r.shapeInterface;
                    case 4:
                        return e.effectsManager
                }
            }

            return r.toWorld = t, r.toComp = t, r._elem = e, Object.defineProperty(r, "hasParent", {
                get: function () {
                    return !!e.hierarchy
                }
            }), Object.defineProperty(r, "parent", {
                get: function () {
                    return e.hierarchy[0].layerInterface
                }
            }), Object.defineProperty(r, "rotation", {
                get: function () {
                    return e.transform.rotation
                }
            }), Object.defineProperty(r, "scale", {
                get: function () {
                    return e.transform.scale
                }
            }), Object.defineProperty(r, "position", {
                get: function () {
                    return e.transform.position
                }
            }), Object.defineProperty(r, "anchorPoint", {
                get: function () {
                    return e.transform.anchorPoint
                }
            }), Object.defineProperty(r, "transform", {
                get: function () {
                    return e.transform
                }
            }), Object.defineProperty(r, "_name", {value: e.data.nm}), Object.defineProperty(r, "content", {
                get: function () {
                    return r.shapeInterface
                }
            }), r.effect = e.effectsManager, r.active = !0, r.registerMaskInterface = s, r
        }
    }(), CompExpressionInterface = function () {
        return function (t) {
            function e(e) {
                for (var s = 0, r = t.layers.length; r > s;) {
                    if (t.layers[s].nm === e) return t.elements[s].layerInterface;
                    s += 1
                }
            }

            return e.layer = e, e.pixelAspect = 1, e.height = t.globalData.compSize.h, e.width = t.globalData.compSize.w, e.pixelAspect = 1, e.frameDuration = 1 / t.globalData.frameRate, e
        }
    }();
    SliderEffect.prototype.proxyFunction = function () {
        if (this.p.k && this.p.getValue(), "number" == typeof this.p.v) return this.p.v;
        var t, e = this.p.v.length, s = Array.apply(null, {length: e});
        for (t = 0; e > t; t += 1) s[t] = this.p.v[t];
        return s
    }, AngleEffect.prototype.proxyFunction = SliderEffect.prototype.proxyFunction, ColorEffect.prototype.proxyFunction = SliderEffect.prototype.proxyFunction, PointEffect.prototype.proxyFunction = SliderEffect.prototype.proxyFunction, CheckboxEffect.prototype.proxyFunction = SliderEffect.prototype.proxyFunction;
    var bodymovinjs = {};

    function play(animation) {
        animationManager.play(animation);
    }

    function pause(animation) {
        animationManager.pause(animation);
    }

    function togglePause(animation) {
        animationManager.togglePause(animation);
    }

    function setSpeed(value, animation) {
        animationManager.setSpeed(value, animation);
    }

    function setDirection(value, animation) {
        animationManager.setDirection(value, animation);
    }

    function stop(animation) {
        animationManager.stop(animation);
    }

    function moveFrame(value) {
        animationManager.moveFrame(value);
    }

    function searchAnimations() {
        if (standalone === true) {
            animationManager.searchAnimations(animationData, standalone, renderer);
        } else {
            animationManager.searchAnimations();
        }
    }

    function registerAnimation(elem) {
        return animationManager.registerAnimation(elem);
    }

    function resize() {
        animationManager.resize();
    }

    function start() {
        animationManager.start();
    }

    function goToAndStop(val, isFrame, animation) {
        animationManager.goToAndStop(val, isFrame, animation);
    }

    function setSubframeRendering(flag) {
        subframeEnabled = flag;
    }

    function loadAnimation(params) {
        if (standalone === true) {
            params.animationData = JSON.parse(animationData);
        }
        return animationManager.loadAnimation(params);
    }

    function destroy(animation) {
        return animationManager.destroy(animation);
    }

    function setQuality(value) {
        if (typeof value === 'string') {
            switch (value) {
                case 'high':
                    defaultCurveSegments = 200;
                    break;
                case 'medium':
                    defaultCurveSegments = 50;
                    break;
                case 'low':
                    defaultCurveSegments = 10;
                    break;
            }
        } else if (!isNaN(value) && value > 1) {
            defaultCurveSegments = value;
        }
        if (defaultCurveSegments >= 50) {
            roundValues(false);
        } else {
            roundValues(true);
        }
    }

    function installPlugin(type, plugin) {
        if (type === 'expressions') {
            expressionsPlugin = plugin;
        }
    }

    function getFactory(name) {
        switch (name) {
            case "propertyFactory":
                return PropertyFactory;
            case "shapePropertyFactory":
                return ShapePropertyFactory;
            case "matrix":
                return Matrix;
        }
    }

    bodymovinjs.play = play;
    bodymovinjs.pause = pause;
    bodymovinjs.togglePause = togglePause;
    bodymovinjs.setSpeed = setSpeed;
    bodymovinjs.setDirection = setDirection;
    bodymovinjs.stop = stop;
    bodymovinjs.moveFrame = moveFrame;
    bodymovinjs.searchAnimations = searchAnimations;
    bodymovinjs.registerAnimation = registerAnimation;
    bodymovinjs.loadAnimation = loadAnimation;
    bodymovinjs.setSubframeRendering = setSubframeRendering;
    bodymovinjs.resize = resize;
    bodymovinjs.start = start;
    bodymovinjs.goToAndStop = goToAndStop;
    bodymovinjs.destroy = destroy;
    bodymovinjs.setQuality = setQuality;
    bodymovinjs.installPlugin = installPlugin;
    bodymovinjs.__getFactory = getFactory;
    bodymovinjs.version = '4.3.2';

    function checkReady() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            searchAnimations();
        }
    }

    function getQueryVariable(variable) {
        var vars = queryString.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    }

    var standalone = '__[STANDALONE]__';
    var animationData = '__[ANIMATIONDATA]__';
    var renderer = '';
    if (standalone) {
        var scripts = document.getElementsByTagName('script');
        var index = scripts.length - 1;
        var myScript = scripts[index];
        var queryString = myScript.src.replace(/^[^\?]+\??/, '');
        renderer = getQueryVariable('renderer');
    }
    var readyStateCheckInterval = setInterval(checkReady, 100);
    return bodymovinjs;
}));