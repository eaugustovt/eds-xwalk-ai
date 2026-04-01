import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const picture = block.querySelector('picture');
  const content = document.createElement('div');
  content.className = 'banner-content';

  // Collect non-picture rows in order: [title, description, cta]
  const textRows = [...block.querySelectorAll(':scope > div')].filter(
    (row) => !row.querySelector('picture'),
  );

  textRows.forEach((row, i) => {
    const cell = row.querySelector(':scope > div') || row;
    const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');

    if (i === 0) {
      // Title row: ensure it is an <h2>
      if (heading) {
        moveInstrumentation(cell, heading);
        content.append(heading);
      } else {
        const h2 = document.createElement('h2');
        moveInstrumentation(cell, h2);
        h2.innerHTML = cell.innerHTML;
        content.append(h2);
      }
    } else if (i === 1) {
      // Description row: ensure it is a <p>
      const p = cell.querySelector('p') || document.createElement('p');
      if (!p.parentElement) {
        moveInstrumentation(cell, p);
        p.innerHTML = cell.innerHTML;
      }
      content.append(p);
    } else {
      // CTA row: move link (decorated as button by aem.js)
      const link = cell.querySelector('a');
      if (link) {
        const p = document.createElement('p');
        p.append(link);
        content.append(p);
      }
    }
  });

  // Rebuild block: picture as background + content overlay
  block.innerHTML = '';
  if (picture) block.append(picture);
  block.append(content);
}
