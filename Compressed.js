/* COMPRESSED VERSION */
var m;
function h(c, a, e) {
  function n(b, f) {
    if ("string" !== typeof b) return !1;
    try {
      return document.querySelector(b) === f ? !0 : !1;
    } catch (g) {
      return console.warn(g), !1;
    }
  }
  function p(b) {
    for (var f = 1, g = b.tagName; b.previousSibling; )
      (b = b.previousSibling),
        1 === b.nodeType && g.toLowerCase() == b.tagName.toLowerCase() && f++;
    return f;
  }
  if (c) {
    if ("body" === c.nodeName.toLowerCase()) return a ? "body" + a : "body";
    m = e ? e : c;
    e = c.nodeName.toLowerCase();
    var d = 1 != p(c) ? ":nth-of-type(" + p(c) + ")" : "";
    e += d;
    d = "";
    var r = (function (b, f, g) {
      var l = !1,
        k,
        q;
      null == (q = b.classList) ||
        q.forEach(function (t) {
          l || ((k = f + "." + t), n(k, m) && ((l = !0), g && (k += g)));
        });
      return l ? k : void 0;
    })(c, e, d, a);
    if (r) return r;
    a && (d = "" === d ? e + a : d + a);
    if ("" !== d) {
      if (n(d, m)) return d;
      a = " > " + d;
    } else a = " > " + e + (a ? a : "");
    return h(c.parentNode, a, m);
  }
}
