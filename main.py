import frida
import sys
import os
import argparse
from threading import Thread

ROOT_PATH = os.path.dirname(__file__)
decompress_js_files = [ i for i in os.listdir(os.path.join(ROOT_PATH, 'src')) if i.endswith('.js') ]


def main(decompress_file: str, magic_bytes: str, targets: str):
    print(f"[+] Setting Bytes to scan for to {magic_bytes}") 

    pid = frida.spawn(targets)
    session = frida.attach(pid)
    js_attach_file = ''

    abs_path_decompress_file = os.path.join(ROOT_PATH, decompress_file)
    with open(abs_path_decompress_file, 'r') as f:
        if magic_bytes is None:
            magic_bytes = ''
        js_attach_file = f.read().replace('{BYTES_TO_SCAN_FOR}', magic_bytes[:2])
    script = session.create_script(js_attach_file)
    script.load()
    frida.resume(pid)
    sys.stdin.read()
    session.detach()
    frida.kill(pid)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Dump payload.')
    parser.add_argument('--decompress_files', '-d', required=True, choices=decompress_js_files, nargs='+')
    parser.add_argument('--magic_byte_scan', '-m', required=False, choices=['MZ', 'E9', 'GULP'])
    parser.add_argument('targets', nargs='+', type=lambda f: f if os.path.exists(f) else '')
    args = parser.parse_args()

    if not isinstance(args.decompress_files, list):
        args.decompress_files = [args.decompress_files]

    if isinstance(args.magic_byte_scan, list):
        args.magic_byte_scan = args.magic_byte_scan[0]
    
    main_threads = []
    for thread_num in range(1, len(args.decompress_files)+1):
        main_threads.append(main)
    
    print(f"[+] Selected decompression files: {(','.join(args.decompress_files)).upper()}")
            
    for j, func in enumerate(main_threads):
        x = Thread(target=func, args=[args.decompress_files[j], args.magic_byte_scan, args.targets])
        print(f"[+] Starting thread for decompression file: {args.decompress_files[j].upper()}")
        x.start()
        #x.join()
