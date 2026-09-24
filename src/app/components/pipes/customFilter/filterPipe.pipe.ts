import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPipe',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return [];
    if (!args) return value;
    
    const data = [...value];
    return data.filter(args);
  }

}
