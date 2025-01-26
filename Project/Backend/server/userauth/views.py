from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Note,CustomUser
from .serializers import NoteSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notes(request):                                         
    user1 = request.user
    notes = Note.objects.filter(owner=user1)
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)
