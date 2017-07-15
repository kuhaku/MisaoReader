#!/bin/sh -eu
electron-packager . MisaoViewer --platform=darwin --arch=x64 --overwrite --electron-version=1.6.11
electron-packager . MisaoViewer --platform=win32 --arch=x64 --overwrite --electron-version=1.6.11
zip -r MisaoViewer-darwin-x64.zip MisaoViewer-darwin-x64
zip -r MisaoViewer-win32-x64.zip MisaoViewer-win32-x64
