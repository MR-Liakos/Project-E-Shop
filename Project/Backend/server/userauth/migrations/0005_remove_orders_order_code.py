# Generated by Django 5.1.5 on 2025-02-22 13:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userauth', '0004_alter_orderitem_product'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='orders',
            name='order_code',
        ),
    ]
