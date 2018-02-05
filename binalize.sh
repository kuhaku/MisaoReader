#!/bin/sh -eu

rm -rf MisaoReader-*

electron-packager . MisaoReader --platform=darwin --arch=x64 --overwrite --electron-version=1.7.12 --icon icons/misao.icns
electron-packager . MisaoReader --platform=win32 --arch=x64 --overwrite --electron-version=1.7.12  --icon icons/misao.ico

zip -r MisaoReader-darwin-x64.zip MisaoReader-darwin-x64
zip -r MisaoReader-win32-x64.zip MisaoReader-win32-x64
