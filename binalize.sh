#!/bin/sh -eu
electron-packager . MisaoViewer --platform=darwin --arch=x64 --overwrite --electron-version=1.6.11
electron-packager . MisaoViewer --platform=win32 --arch=x64 --overwrite --electron-version=1.6.11
