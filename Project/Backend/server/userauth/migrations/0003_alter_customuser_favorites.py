# Generated by Django 5.1.5 on 2025-02-09 20:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
        ('userauth', '0002_customuser_favorites'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='favorites',
            field=models.ManyToManyField(blank=True, related_name='user_favorites', to='api.products'),
        ),
    ]
