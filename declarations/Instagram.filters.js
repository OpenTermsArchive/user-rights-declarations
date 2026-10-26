export function removeChangeLogLabel(document) {
  document.querySelectorAll('span').forEach(span => {
    if (span.textContent.trim().toLowerCase() === 'change log') {
      span.remove();
    }
  });
}

export function addTrailingSlashToInternalLinks(document, { fetch: location }) {
  const { hostname } = new URL(location);

  document.querySelectorAll('a[href]:not([href^="#"]):not([href=""])').forEach(link => {
    try {
      const url = new URL(link.getAttribute('href'), location);
      const lastSegment = url.pathname.split('/').pop();

      if (url.hostname == hostname && lastSegment && !lastSegment.includes('.')) { // skip file names such as `.pdf`
        url.pathname += '/';
        link.setAttribute('href', url.href);
      }
    } catch {
      // Leave invalid URLs as they are
    }
  });
}
