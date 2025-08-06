import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { FormErrorLabelComponent } from "@dashboard/components/form-error-label/form-error-label.component";
import { ProductsService } from '@products/services/products.service';
import { Product } from '@products/interfaces/products.interface';
import { ImageCarouselComponent } from "@shared/components/image-carousel/image-carousel.component";
import { Category } from '@products/interfaces/categories.interface';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';
import { Type } from '@products/interfaces/types.interface';
import { Material } from '@products/interfaces/materials.interface';

@Component({
  selector: 'admin-product-details',
  imports: [ReactiveFormsModule, FormErrorLabelComponent, ImageCarouselComponent, pathImagePipe],
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {

  router = inject(Router);
  formUtils = FormUtils;
  product = input.required<Product>();
  categories: Category[] = [];
  relatedGroups: { key: string, image: string }[] = [];
  types: Type[] = [];
  materials: Material[] = [];

  fb = inject(FormBuilder);
  productService = inject(ProductsService);
  wasSaved = signal(false);
  successMessage = signal('');
  isLoading = signal(false);

  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);

  // imagesToCarousel = computed(() =>{
  //   const currentProductImages = [...this.product().images, ...this.tempImages()];
  //   return currentProductImages;
  // })

  productForm: FormGroup = this.fb.group({
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    cod: ['', Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
    images: [[]],
    categories: [[], [FormUtils.requiredCategory]],
    type: [null, Validators.required],
    material: [null, Validators.required],
    related: [''],
    novelty: [false],
  })


  ngOnInit(): void {
    this.loadCategories();
    this.loadRelatedGroups();
    this.loadTypes();
    this.loadMaterials();
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset();

    const selectedType = this.types.find(t => t.slug === formLike.type?.slug)?.id ?? null;
    const selectedMaterial = this.materials.find(m => m.slug === formLike.material?.slug)?.id ?? null;

    const normalizedImages = Array.isArray(formLike.images)
      ? formLike.images
      : formLike.images ? [formLike.images] : [];

    const matchedCategories = (formLike.categories ?? [])
    .map(prodCat => this.categories.find(cat => cat.slug === prodCat.slug))
    .filter((cat): cat is Category => !!cat);

    this.productForm.patchValue({
      slug: formLike.slug,
      cod: formLike.cod,
      title: formLike.title,
      description: formLike.description,
      images: normalizedImages,
      categories: matchedCategories,
      type: selectedType,
      material: selectedMaterial,
      related: formLike.related,
      novelty: !!formLike.novelty
    });
  }


  loadCategories() {
    this.productService.getCategories({ categoria: '' }).subscribe({
      next: (resp) => {
        this.categories = resp.categories;
        this.trySetForm();
      }
    });
  }

  selectCategory(cat: Category) {
    const current = this.productForm.get('categories')?.value as Category[];
    const exists = current.some(c => c.slug === cat.slug);

    const updated = exists
      ? current.filter(c => c.slug !== cat.slug)
      : [...current, cat];

    this.productForm.get('categories')?.setValue(updated);
    this.productForm.get('categories')?.markAsTouched();
  }

  isCategorySelected(slug: string): boolean {
    return (this.productForm.value.categories ?? []).some((c: Category) => c.slug === slug);
  }

  loadRelatedGroups() {
    this.productService.getAllRelatedGroups().subscribe({
      next: (data) => {
        this.relatedGroups = data;
      },
      error: () => {
        this.relatedGroups = [];
      }
    });
  }

  loadTypes() {
    this.productService.getTypes().subscribe({
      next: (resp) => {
        this.types = resp.types;
        this.trySetForm();
      }
    });
  }

  loadMaterials() {
    this.productService.getMaterials().subscribe({
      next: (resp) => {
        this.materials = resp.materials;
        this.trySetForm();
      }
    });
  }

  trySetForm() {
    if (this.categories.length && this.types.length && this.materials.length) {
      this.setFormValue(this.product());
    }
  }


  async onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.productForm.value;

    const cleanedImages: string[] = Array.from(
      new Set(
        (formValue.images ?? []).map((img: string) => img.split('/').pop() || '')
      )
    );

    const productLike = {
      slug: formValue.slug,
      codigo: formValue.cod,
      titulo: formValue.title,
      descripcion: formValue.description,
      categorias: formValue.categories.map((c: Category) => c.id),
      tipo: formValue.type,
      material: formValue.material,
      relacionados: formValue.related,
      novedad: formValue.novelty ? 1 : 0,
      images: cleanedImages
    };

    try {
      if (this.product().id === 0) { //nuevo producto
        const product = await firstValueFrom(
          this.productService.createProduct(productLike, this.imageFileList)
        )

        this.successMessage.set('Producto creado correctamente');
        this.wasSaved.set(true);

        setTimeout(() => {
          this.wasSaved.set(false);
          this.successMessage.set('');
          this.router.navigate(['/admin/product', product.id]);
        }, 1000);

      } else { //actualiza producto

        console.log(productLike);
        await firstValueFrom(
          this.productService.updateProduct(this.product().id ,productLike, this.imageFileList)
        )

        this.successMessage.set('Producto actualizado correctamente');
        this.wasSaved.set(true);

        setTimeout(() => {
          this.wasSaved.set(false);
          this.successMessage.set('');
        }, 3000);

      }
    } catch (err) {
      // podrías agregar manejo de errores aquí si querés mostrar feedback
    } finally {
      this.isLoading.set(false);
    }
  }

  //images
  onFilesChanged( event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined;

    const imageUrls = Array.from( fileList ?? []).map( file => URL.createObjectURL(file));

    this.tempImages.set(imageUrls)
  }

  removeExistingImage(imageUrl: string) {
    const currentImages = this.productForm.value.images as string[];

    const fileNameToRemove = imageUrl.split('/').pop();

    const updatedImages = currentImages.filter(img => {
      const imgName = img.split('/').pop();
      return imgName !== fileNameToRemove;
    });

    this.productForm.patchValue({ images: updatedImages });
  }

  removeTempImage(index: number) {
    const tempList = [...this.tempImages()];
    tempList.splice(index, 1);
    this.tempImages.set(tempList);

    // También quitamos del FileList
    const dt = new DataTransfer();
    Array.from(this.imageFileList ?? []).forEach((file, i) => {
      if (i !== index) dt.items.add(file);
    });
    this.imageFileList = dt.files;
  }

}
