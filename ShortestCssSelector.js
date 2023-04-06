/**
 * @NOTE : Some sites have Randomized ID and/or CLASS generation on every pageload.
 *       Disable them and rely on full path if thats the case.
 *
 * @Selector_Precedence : [ Unique Attributes (aria-label, title, type) > ID's > Class > FullPath]
 * @Element_Description : TextContent > aria-label > Placeholder
 */

/* CLASS VERSION  */
class ShortestCssSelector {
  #DISABLE_CLASS_SEL = false;
  #DISABLE_ID_SEL = true;
  #DISABLE_ATTR_SEL = true;
  #TARGET_NODE;

  getSelector(element, carriedSelector, targetNode) {
    if (!element) return;

    if (element.nodeName.toLowerCase() === "body") {
      this.clearTargetNode();
      if (carriedSelector) return "body" + carriedSelector;
      return "body";
    }

    this.#TARGET_NODE = !this.#TARGET_NODE ? element : this.#TARGET_NODE;
    let currentTAG = element.nodeName.toLowerCase();
    const nthTypePos =
      this.getIndex(element) != 1
        ? `:nth-of-type(${this.getIndex(element)})`
        : "";
    // include position of current element to TAG
    currentTAG = currentTAG + nthTypePos;

    let candidate = "";

    // Try ID
    const id_selector = this.id(element, carriedSelector);
    if (id_selector) return id_selector;

    // Try ATTRIBUTE
    const attr_selector = this.attribute(element, carriedSelector);
    if (attr_selector) return attr_selector;

    // Try CLASS
    const class_selector = this.class(
      element,
      currentTAG,
      candidate,
      carriedSelector
    );
    if (class_selector) return class_selector;

    // Update candidate if necessary
    if (carriedSelector) {
      if (candidate === "") candidate = currentTAG + carriedSelector;
      else candidate = candidate + carriedSelector;
    }

    // Prepare carrySelector for next iteration
    let carrySelector;
    if (candidate !== "") {
      // Check if candidate is eligible
      if (isUniqForTarget(candidate, this.#TARGET_NODE)) {
        this.clearTargetNode();
        return candidate;
      }
      carrySelector = " > " + candidate;
    } else
      carrySelector =
        ` > ${currentTAG}` + (carriedSelector ? carriedSelector : "");

    return this.getSelector(
      element.parentNode,
      carrySelector,
      this.#TARGET_NODE
    );
  }

  id(currrElement, carriedSelector) {
    if (this.#DISABLE_ID_SEL) return;

    const HAS_ID = currrElement.id !== "" && currrElement.id !== undefined;
    if (HAS_ID) {
      let idLeadSelector = "#" + currrElement.id;

      if (carriedSelector) idLeadSelector = idLeadSelector + carriedSelector;

      this.clearTargetNode();
      return idLeadSelector;
    }
  }

  attribute(currrElement, carriedSelector) {
    if (this.#DISABLE_ATTR_SEL) return;

    for (const attr of ["aria-label", "title"]) {
      if (currrElement.getAttribtue(attr)) {
        let attrLeadSelector = `${currrElement.nodeName.toLowerCase()}[${attr}="${currrElement.getAttribtue(
          attr
        )}"]`;

        if (carriedSelector)
          attrLeadSelector = attrLeadSelector + carriedSelector;

        this.clearTargetNode();
        return attrLeadSelector;
      }
    }
  }

  class(currrElement, currentTAG, carriedSelector) {
    if (this.#DISABLE_CLASS_SEL) return;

    let foundUniqClass = false;
    let classSelector;
    currrElement.classList?.forEach((c) => {
      if (!foundUniqClass) {
        classSelector = currentTAG + "." + c;
        const isTargetSelector = isUniqForTarget(
          classSelector,
          this.#TARGET_NODE
        );

        if (isTargetSelector) {
          foundUniqClass = true;
          if (carriedSelector) classSelector = classSelector + carriedSelector;
          this.clearTargetNode();
        }
      }
    });

    return foundUniqClass ? classSelector : undefined;
  }

  clearTargetNode() {
    this.#TARGET_NODE = undefined;
  }

  getIndex(node) {
    let i = 1;
    let tagName = node.tagName;

    while (node.previousSibling) {
      node = node.previousSibling;
      if (
        node.nodeType === 1 &&
        tagName.toLowerCase() == node.tagName.toLowerCase()
      ) {
        i++;
      }
    }
    return i;
  }
}

/* FUNCTION VERSION  */
const DISABLE_CLASS_SEL = false;
const DISABLE_ID_SEL = true;
const DISABLE_ATTR_SEL = true;
let TARGET_NODE;

function getSelector(element, carriedSelector, targetNode) {
  if (!element) return;

  if (element.nodeName.toLowerCase() === "body") {
    this.clearTargetNode();
    if (carriedSelector) return "body" + carriedSelector;
    return "body";
  }

  TARGET_NODE = !targetNode ? element : targetNode;
  let currentTAG = element.nodeName.toLowerCase();
  const nthTypePos =
    getIndex(element) != 1 ? `:nth-of-type(${getIndex(element)})` : "";
  // include position of current element to TAG
  currentTAG = currentTAG + nthTypePos;

  let candidate = "";

  // Try ID
  const id_selector = getIdSelector(element, carriedSelector);
  if (id_selector) return id_selector;

  // Try ATTRIBUTE
  const attr_selector = getAttributeSelector(element, carriedSelector);
  if (attr_selector) return attr_selector;

  // Try CLASS
  const class_selector = getClassSelector(
    element,
    currentTAG,
    candidate,
    carriedSelector
  );
  if (class_selector) return class_selector;

  // Update candidate if necessary
  if (carriedSelector) {
    if (candidate === "") candidate = currentTAG + carriedSelector;
    else candidate = candidate + carriedSelector;
  }

  // Prepare carrySelector for next iteration
  let carrySelector;
  if (candidate !== "") {
    // Check if candidate is eligible
    if (isUniqForTarget(candidate, TARGET_NODE)) {
      return candidate;
    }
    carrySelector = " > " + candidate;
  } else
    carrySelector =
      ` > ${currentTAG}` + (carriedSelector ? carriedSelector : "");

  return this.getSelector(element.parentNode, carrySelector, TARGET_NODE);
}

function getIdSelector(currrElement, carriedSelector) {
  if (DISABLE_ID_SEL) return;

  const HAS_ID = currrElement.id !== "" && currrElement.id !== undefined;
  if (HAS_ID) {
    let idLeadSelector = "#" + currrElement.id;

    if (carriedSelector) idLeadSelector = idLeadSelector + carriedSelector;

    return idLeadSelector;
  }
}

function getAttributeSelector(currrElement, carriedSelector) {
  if (DISABLE_ATTR_SEL) return;

  for (const attr of ["aria-label", "title"]) {
    if (currrElement.getAttribtue(attr)) {
      let attrLeadSelector = `${currrElement.nodeName.toLowerCase()}[${attr}="${currrElement.getAttribtue(
        attr
      )}"]`;

      if (carriedSelector)
        attrLeadSelector = attrLeadSelector + carriedSelector;

      return attrLeadSelector;
    }
  }
}

function getClassSelector(currrElement, currentTAG, carriedSelector) {
  if (DISABLE_CLASS_SEL) return;

  let foundUniqClass = false;
  let classSelector;
  currrElement.classList?.forEach((c) => {
    if (!foundUniqClass) {
      classSelector = currentTAG + "." + c;
      const isTargetSelector = isUniqForTarget(classSelector, TARGET_NODE);

      if (isTargetSelector) {
        foundUniqClass = true;
        if (carriedSelector) classSelector = classSelector + carriedSelector;
      }
    }
  });

  return foundUniqClass ? classSelector : undefined;
}

function isUniqForTarget(selector, targetNode) {
  if (typeof selector !== "string") return false;

  try {
    if (document.querySelector(selector) === targetNode) return true;
    else return false;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

function getIndex(node) {
  let i = 1;
  let tagName = node.tagName;

  while (node.previousSibling) {
    node = node.previousSibling;
    if (
      node.nodeType === 1 &&
      tagName.toLowerCase() == node.tagName.toLowerCase()
    ) {
      i++;
    }
  }
  return i;
}

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
