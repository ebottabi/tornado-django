from django.http import HttpResponse
def hello(request):
  return HttpResponse("Hello from django inside cliq app")
