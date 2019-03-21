from rest_framework.generics import ListAPIView

from .models import Quote
from .serializers import QuoteSerializer


class QuoteListView(ListAPIView):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
