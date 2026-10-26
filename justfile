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
