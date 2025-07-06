"""
WSGI config for gallimall_backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os
import warnings

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gallimall_backend.settings')

application = get_wsgi_application()

warnings.filterwarnings(
    "ignore", category=UserWarning, message="pkg_resources is deprecated as an API.*"
)
