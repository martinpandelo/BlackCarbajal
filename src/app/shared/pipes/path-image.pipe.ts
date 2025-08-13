import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.productsApiUrl;

@Pipe({
  name: 'pathImage'
})
export class pathImagePipe implements PipeTransform {

  transform(value: string | string[], tipo: 'productos' | 'eventos' | 'catalogos' | 'relacion' | 'slides' | 'categorias' = 'productos'): string {

    const image = Array.isArray(value) ? value?.[0] : value;

    if (!image || image === 'no-image.jpg') {
      return '/assets/images/no-image.jpg';
    }

    if (image.startsWith('http') || image.startsWith('blob:')) {
      return image;
    }

    return `${baseUrl}/files/${tipo}/${image}`;
  }


}
