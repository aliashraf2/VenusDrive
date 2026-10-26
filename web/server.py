from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
import json
import base64

def public_backend_config():
    key = os.environ.get('SUPABASE_PUBLISHABLE_KEY', os.environ.get('SUPABASE_ANON_KEY', ''))
    # Fail closed if a privileged key is accidentally assigned to a public variable.
    allowed = not key or key.startswith('sb_publishable_')
    if key.count('.') == 2:
        try:
            payload = key.split('.')[1]
            claims = json.loads(base64.urlsafe_b64decode(payload + '=' * (-len(payload) % 4)))
            allowed = claims.get('role') == 'anon'
        except (ValueError, TypeError):
            allowed = False
    if not allowed:
        return {'url': '', 'publishableKey': ''}
    return {'url': os.environ.get('SUPABASE_URL', ''), 'publishableKey': key}

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(Path(__file__).parent / 'public'), **kwargs)
    def do_GET(self):
        if self.path.split('?')[0] == '/runtime-config.js':
            values = public_backend_config()
            body = ('globalThis.VENUSDRIVE_BACKEND = '+json.dumps(values)+';').encode()
            self.send_response(200)
            self.send_header('Content-Type','application/javascript')
            self.send_header('Content-Length',str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()
    def end_headers(self):
        self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://*.supabase.co; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'")
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    def list_directory(self, path):
        self.send_error(403, 'Directory listing disabled')

if __name__ == '__main__':
    port = int(os.environ.get('VENUSDRIVE_PORT', '4173'))
    print(f'VenusDrive local preview: http://localhost:{port}', flush=True)
    ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
