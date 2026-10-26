import base64
import json
import os
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from server import public_backend_config

class PublicConfiguration(unittest.TestCase):
    def config(self, key):
        with patch.dict(os.environ, {'SUPABASE_URL': 'https://example.supabase.co',
                                    'SUPABASE_PUBLISHABLE_KEY': key}, clear=True):
            return public_backend_config()

    def test_publishable_key_is_available(self):
        self.assertEqual(self.config('sb_publishable_public')['publishableKey'], 'sb_publishable_public')

    def test_privileged_and_malformed_keys_are_not_emitted(self):
        for key in ('sb_secret_private', 'unrecognized', 'a.b.c'):
            self.assertEqual(self.config(key), {'url': '', 'publishableKey': ''})
        for role in ('anon', 'service_role'):
            payload = base64.urlsafe_b64encode(json.dumps({'role': role}).encode()).decode().rstrip('=')
            key = 'header.' + payload + '.signature'
            self.assertEqual(bool(self.config(key)['publishableKey']), role == 'anon')

if __name__ == '__main__':
    unittest.main()
