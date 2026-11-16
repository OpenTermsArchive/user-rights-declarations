const BOLD_ELEMENTS = [ 'STRONG', 'B' ];

export function moveBoldOutsideLinks(document) {
  document.querySelectorAll('a').forEach(link => {
    const meaningfulChildren = Array.from(link.childNodes).filter(node => node.nodeType !== node.TEXT_NODE || node.textContent.trim());

    if (meaningfulChildren.length !== 1 || !BOLD_ELEMENTS.includes(meaningfulChildren[0].nodeName)) {
      return;
    }

    const [bold] = meaningfulChildren;

    bold.replaceWith(...bold.childNodes);

    if (BOLD_ELEMENTS.includes(link.parentElement?.nodeName)) {
      return;
    }

    const wrapper = document.createElement(bold.nodeName.toLowerCase());

    link.replaceWith(wrapper);
    wrapper.appendChild(link);
  });
}
