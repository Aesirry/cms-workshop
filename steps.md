# Headless Django Workshop

## Requirements

* Python 3
* Docker
* VirtualEnv Wrapper

## Steps

### Running the front-end

1. create a directory in your project folder.

2. download the __Quotes Frontend__ repo from [Here](www.github.com)

3. run `docker-compose up -d --build`

4. go to [localhost:3000], you should see the quotes app running. It doesn't have any quotes to show :(

### Making the "back-end" with Django

1. create a new vitual environment for django.
    `mkvirtualenv quotes`

2. In your activated virtual environment install __Django__ and __Django REST Framework__
    `pip install Django djangorestframework`

3. Start the django project `django-admin startproject quotes_cms`

4. Run migrations `./manage.py migrate`

5. Create a django app called "quotes" `./manage.py startapp quotes`

6. Create a model for the quotes.

```python
from django.db import models


class Quote(models.Model):
    quote = models.TextField(
        max_length=150,
        default=""
    )
    author = models.CharField(
        max_length=255,
        default=""
    )

    def __str__(self):
        return "{}...".format(self.quote[0:30])
```

7. Include `quotes` to the `INSTALLED_APPS` in the `settings.py` file.

8. Make Migrations `./manage.py makemigrations`, migrate `./manage.py migrate`.

9. create a superuser with `./manage.py create superuser`

10. Register the Quotes app in the djagno admin. Make the quote author visible.

```python
from django.contrib import admin

from .models import Quote

admin.site.register(Quote)
```

11. Start adding quotes.

### Create an API with Django Rest Framework (DRF)

1. Add `rest_framework` to the `INSTALLED_APPS` in the `settings.py` file.

2. Create a serializer for the quote.

```python
from rest_framework import serializers

from .models import Quote


class QuoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Quote
        fields = '__all__'
```

3. Create a View to serve the quote Json
```python
from rest_framework.generics import ListAPIView

from .models import Quote
from .serializers import QuoteSerializer


class QuoteListView(ListAPIView):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
```

4. Create the url endpoints.

```python
# quotes_cms/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('quotes.urls'))
]

# quotes/urls.py
from django.urls import path

from .views import QuoteListView

urlpatterns = [
    path('quotes/', QuoteListView.as_view())
]
```

5. Install and set up django-cors-headers
```python
# settings.py
# add 'corsheaders', to INSTALLED_APPS

## add the middleware above CommonMiddleware
# 'corsheaders.middleware.CorsMiddleware',
# 'django.middleware.common.CommonMiddleware',

CORS_ORIGIN_ALLOW_ALL = True
```

6. Reload the React app to see your quotes.
