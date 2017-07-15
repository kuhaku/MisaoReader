#!/bin/sh -eu
electron-packager . MisaoReader --platform=darwin --arch=x64 --overwrite --electron-version=1.6.11
electron-packager . MisaoReader --platform=win32 --arch=x64 --overwrite --electron-version=1.6.11
zip -r MisaoReader-darwin-x64.zip MisaoViewer-darwin-x64
zip -r MisaoReader-win32-x64.zip MisaoViewer-win32-x64
