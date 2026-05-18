export function removeChangeLogLabel(document) {
  document.querySelectorAll('span').forEach(span => {
    if (span.textContent.trim().toLowerCase() === 'change log') {
      span.remove();
    }
  });
}
