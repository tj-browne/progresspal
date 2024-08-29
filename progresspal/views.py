from django.http import HttpResponse
from django.conf import settings
from django.views.generic.base import TemplateView
import os


class FrontendAppView(TemplateView):
    def get(self, request, *args, **kwargs):
        try:
            with open(os.path.join(settings.BASE_DIR, 'frontend/build/index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse("React build not found", status=404)
