# Generated by Django 5.1.5 on 2025-01-28 13:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userauth', '0010_note_email_note_owner'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='username',
        ),
    ]
