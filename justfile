default:
  just --list

dev:
  npm run dev

preview:
  npm run build
  npm run preview

post slug:
  #!/usr/bin/env bash
  set -euo pipefail

  date_prefix="$(date +%y-%m-%d)"
  pub_date="$(date +%b\ %d\ %Y)"
  slug="{{slug}}"

  mkdir -p src/content/blog

  max_index=-1
  for path in src/content/blog/"${date_prefix}"-*.md src/content/blog/"${date_prefix}"-*.mdx; do
    [ -e "$path" ] || continue
    name="$(basename "$path")"
    rest="${name#${date_prefix}-}"
    idx="${rest%%-*}"
    case "$idx" in
      ""|*[!0-9]*) continue ;;
    esac
    if [ "$idx" -gt "$max_index" ]; then
      max_index="$idx"
    fi
  done

  next_index=$((max_index + 1))
  filename="src/content/blog/${date_prefix}-${next_index}-${slug}.md"
  display_title="${slug//-/ }"

  if [ -e "$filename" ]; then
    echo "Post already exists: $filename" >&2
    exit 1
  fi

  {
    printf "%s\n" "---"
    printf "title: '\''%s'\''\n" "$display_title"
    printf "%s\n" "description: '\''Lorem ipsum dolor sit amet'\''"
    printf "pubDate: '\''%s'\''\n" "$pub_date"
    printf "%s\n\n" "---"
  } > "$filename"

  echo "Created $filename"