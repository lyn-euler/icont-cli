#!/usr/bin/env bash

# svg 转 ttf 并生成 dart 文件
svg2ttf() {
  if [ ! `command -v icont` ]; then
    npm install -g icont-cli
  fi

  temp_dir='.icont'
  fonts_dir='fonts'
  dart_path='lib/resource'

  # svg to ttf & dart
  icont -i $1 -o $temp_dir -n icontfonts

  # copy to target dir
  icont copy -s $temp_dir -d $fonts_dir -e .ttf
  icont copy -s $temp_dir -d $dart_path -e .dart

  # delete temp dir
  # rm -rf $temp_dir
}

svg2ttf svg