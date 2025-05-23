# Generated by Django 5.1.5 on 2025-03-17 13:42

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Products',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('slug', models.SlugField(blank=True, null=True)),
                ('image', models.ImageField(upload_to='img')),
                ('description', models.TextField(blank=True, null=True)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('stock', models.IntegerField(default=0)),
                ('category', models.CharField(blank=True, choices=[('Shampoo', 'SHAMPOO'), ('Shower Gel', 'SHOWER GEL'), ('Liquid Soap', 'LIQUID SOAP'), ('Room Sprey', 'ROOM SPREY'), ('Body Lotion', 'BODY LOTION')], max_length=15, null=True)),
                ('code', models.CharField(max_length=50, unique=True)),
                ('isActive', models.BooleanField(default=True)),
                ('salePers', models.IntegerField(default=0)),
                ('brand', models.CharField(blank=True, choices=[('Amouage', 'Amouage'), ('Balmain', 'Balmain'), ('Lalique', 'Lalique'), ('None', 'None'), ('Chopard', 'Chopard')], max_length=15, null=True)),
            ],
        ),
    ]
