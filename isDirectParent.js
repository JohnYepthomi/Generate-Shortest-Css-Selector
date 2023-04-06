function isDirectParent(selector, targetNode) {
  if (typeof selector !== "string") return false;

  try {
    if (
      document.querySelectorAll(selector).length === 1 &&
      Array.from(document.querySelector(selector).children).includes(targetNode)
    )
      return true;
    else return false;
  } catch (err) {
    console.warn(err);
    return false;
  }
}
