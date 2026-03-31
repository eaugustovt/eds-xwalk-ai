import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const picture = block.querySelector('picture');

  // Create content wrapper
  const content = document.createElement('div');
  content.className = 'banner-content';

  // Move text rows (title, description, CTA) into content wrapper
  rows.forEach((row) => {
    if (!row.querySelector('picture')) {
      moveInstrumentation(row, row);
      [...row.querySelectorAll(':scope > div > *')].forEach((child) => {
        content.append(child);
      });
    }
  });

  // Rebuild block: picture + content overlay
  block.textContent = '';
  if (picture) block.append(picture);
  block.append(content);
}
