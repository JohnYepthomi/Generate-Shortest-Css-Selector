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
