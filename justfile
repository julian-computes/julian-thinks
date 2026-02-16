default:
  just --list

dev:
  npm run dev

preview:
  npm run build
  npm run preview

test:
  npm test

post slug:
  node scripts/new-post.js "{{slug}}"
