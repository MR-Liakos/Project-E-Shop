# Generated by Django 5.1.5 on 2025-02-14 21:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userauth', '0004_remove_orders_product_orders_product'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='orders',
            options={'ordering': ['-created_at'], 'verbose_name': 'Order', 'verbose_name_plural': 'Orders'},
        ),
        migrations.AddField(
            model_name='orders',
            name='address',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='orders',
            name='price',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=100, verbose_name='Total Price'),
        ),
    ]
