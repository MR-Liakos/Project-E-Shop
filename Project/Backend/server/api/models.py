from django.db import models
from django.utils.text import slugify

# TO MODEL GIA TA PRODUCTS
class Products(models.Model):
    CATEGORY = (("Shampoo", "SHAMPOO"),
                ("Body Lotion", "BODYLOTION"),
    )
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(blank=True, null=True)  #typically used to store a URL-friendly representation of a name or title
    image = models.ImageField(upload_to="img")
    description = models.TextField(blank=True , null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    category = models.CharField(max_length=15, choices=CATEGORY, blank=True, null=True)
    code =  models.CharField(max_length=50, unique=True)
    isActive = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
    #EINAI METHOD OPOU EJASFALIZEI NA EXOUME MONO ENA SLUG (GIA NA MHN EXOUME DUO URLS)
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            unique_slug = self.slug
            counter = 1
            while Products.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{self.slug}-{counter}"
                counter += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)