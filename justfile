# duolist_web — marketing site, privacy page, account deletion, admin console.
# Recipes run with cwd = web/ (just sets it to this file's dir).

default:
    @just --list

install:
    yarn install

dev:
    yarn dev

build:
    yarn build

start:
    yarn start

lint:
    yarn lint

# --- assets --------------------------------------------------------------

# Generate the favicon set from public/logo.svg
favicons:
    #!/usr/bin/env bash
    set -eu
    src=public/logo.svg
    [ -f "$src" ] || { echo "missing $src"; exit 1; }
    conv() {
      if command -v rsvg-convert >/dev/null 2>&1; then
        rsvg-convert -w "$1" -h "$1" "$src" -o "$2"
      elif command -v magick >/dev/null 2>&1; then
        magick -density 384 "$src" -resize "${1}x${1}" -background none -flatten "$2"
      else
        echo "need rsvg-convert or ImageMagick"; exit 1
      fi
    }
    conv 16  public/favicon-16x16.png
    conv 32  public/favicon-32x32.png
    conv 48  public/favicon-48x48.png
    conv 180 public/apple-touch-icon.png
    conv 192 public/android-chrome-192x192.png
    conv 512 public/android-chrome-512x512.png
    echo "favicons written to public/"
