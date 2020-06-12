# icont-cli
A tool which convert svg(s) to tff, and output `.dart` file for flutter project
And u can copy result(s) to dist dir.
## Install

```shell
npm install -g icont-cli
```

## Usage 

### convert svg(s) to ttf & dart file

```shell
Usage: icont [options] [command]

Convert SVG(s) to ttf file

Options:
  -v, --version           output the version number
  -i, --input <path|dir>  input svg dir or file path (default: "svg")
  -o, --output <dir>      output path (default: "output")
  -n, --fontname <name>   output font name (default: "iconfonts")
  -h, --help              display help for command

Commands:
  copy [options]          copy file to target dir.
```


### copy files

```shell
Usage: icont copy [options]

copy file to target dir.

Options:
  -d, --dist <dir>     dist dir
  -s, --src <dir>      copy form dir
  -e, --ext <extname>  file ext name
  -h, --help           display help for command
```

## Flutter Project Configuration Demo

- pubspec.yaml

```shell
fonts:
    - family: iconfonts
      fonts:
        - asset: iconfonts/iconfonts.ttf
```

- script sample

```shell
#!/usr/bin/env bash
if [ ! `command -v icont` ]; then
  npm install -g icont-cli
fi

temp_dir='.icont'
fonts_dir='fonts'
dart_path='lib'

# svg to ttf & dart
icont -i svg -o $temp_dir

# copy to target dir
icont copy -s $temp_dir -d $fonts_dir -e .ttf
icont copy -s $temp_dir -d $dart_path -e .dart

# delete temp dir
# rm -rf $temp_dir
```