# Generated by Django 5.1.5 on 2025-01-31 00:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='products',
            name='salePers',
            field=models.IntegerField(default=0),
        ),
    ]
