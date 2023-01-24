# FridaFury


## Installation Steps
```
python3 -m pip3 install -r requirements.txt
python3 main.py -h
```

Usage:
```
usage: main.py [-h] --decompress_files {rtldecompress_attach.js,virtual_alloc.js} [{rtldecompress_attach.js,virtual_alloc.js} ...] [--magic_byte_scan {MZ,E9,GULP}] targets [targets ...]

Dump payload.

positional arguments:
  targets

optional arguments:
  -h, --help            show this help message and exit
  --decompress_files {rtldecompress_attach.js,virtual_alloc.js} [{rtldecompress_attach.js,virtual_alloc.js} ...], -d {rtldecompress_attach.js,virtual_alloc.js} [{rtldecompress_attach.js,virtual_alloc.js} ...]
  --magic_byte_scan {MZ,E9,GULP}, -m {MZ,E9,GULP}
```