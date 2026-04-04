// compareService.js — Compare list state management via localStorage

const COMPARE_KEY = 'nexcart_compareList';

function getMaxItems() {
  return window.innerWidth <= 768 ? 2 : 4;
}

function getCompareList() {
  return JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
}

function getCompareCount() {
  return getCompareList().length;
}

function isInCompareList(productId) {
  return getCompareList().includes(productId);
}

/**
 * @returns {{ success: boolean, message: string }}
 */
function addToCompare(productId) {
  const list = getCompareList();
  
  if (list.includes(productId)) {
    return { success: false, message: 'Already in compare list' };
  }
  
  const max = getMaxItems();
  if (list.length >= max) {
    return { success: false, message: `You can only compare up to ${max} products at a time.` };
  }
  
  list.push(productId);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('compareListChanged', { detail: { list } }));
  return { success: true, message: 'Added to compare' };
}

function removeFromCompare(productId) {
  let list = getCompareList();
  list = list.filter(id => id !== productId);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('compareListChanged', { detail: { list } }));
  return { success: true, message: 'Removed from compare' };
}

function clearCompareList() {
  localStorage.setItem(COMPARE_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent('compareListChanged', { detail: { list: [] } }));
}

// Remove IDs that no longer exist (called after API response)
function pruneStaleIds(validIds) {
  const list = getCompareList();
  const pruned = list.filter(id => validIds.includes(id));
  if (pruned.length !== list.length) {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(pruned));
    window.dispatchEvent(new CustomEvent('compareListChanged', { detail: { list: pruned } }));
  }
}
