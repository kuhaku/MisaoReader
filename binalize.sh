#!/bin/sh -eu

rm -rf MisaoReader-*

electron-packager . MisaoReader --platform=darwin --arch=x64 --overwrite --electron-version=2.0.8 --icon icons/misao.icns
electron-packager . MisaoReader --platform=win32 --arch=x64 --overwrite --electron-version=2.0.8 --icon icons/misao.ico

ln -s /Applications MisaoReader-darwin-x64/
hdiutil create MisaoReader-darwin-x64.dmg -volname "MisaoReader" -srcfolder "MisaoReader-darwin-x64"
zip -r MisaoReader-win32-x64.zip MisaoReader-win32-x64
