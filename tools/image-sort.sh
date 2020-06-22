#!/bin/bash

Usage() {
cat <<EOF
Usage:
    sh image-sort.sh <dir>
    \$1 dir to sort

EOF
    exit 1
}

dir=$1

[ "$1" == "" ] && dir='images'
[ "$dir" == "" ] && Usage

sort() {
  scale=$1
  for f in `ls $dir | grep "@${scale}x."`
  do
    echo  "$dir/$f => $dir/${scale}.0x/${f/@${scale}x./.}"
    mv "$dir/$f"  "$dir/${scale}.0x/${f/@${scale}x./.}"
  done
}

echo "===== sort start ========"
sort 2
sort 3
echo "=====  sort end  ========"
