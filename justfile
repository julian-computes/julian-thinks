default:
  just --list

dev:
  npm run dev

preview:
  npm run build
  npm run preview

test:
  npm test

lint:
  npx eslint .

format:
  npx prettier --write .

check:
  npx eslint . && npx prettier --check .

post slug:
  node scripts/new-post.js "{{slug}}"
