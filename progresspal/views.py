from django.views.generic import View
from django.http import HttpResponse
import os


class FrontendAppView(View):
    """
    Serves the compiled React app from the 'build' directory.
    """

    def get(self, request, *args, **kwargs):
        try:
            with open(os.path.join(os.path.dirname(__file__), 'frontend', 'build', 'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse(
                "The frontend build files are not found. Please make sure you have built the React app.",
                status=501,
            )
