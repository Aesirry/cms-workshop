from django.db import models


class Quote(models.Model):
    quote = models.TextField(
        max_length=250,
        default=""
    )
    author = models.CharField(
        max_length=255,
        default=""
    )

    def __str__(self):
        return "{}...".format(self.quote[0:30])
