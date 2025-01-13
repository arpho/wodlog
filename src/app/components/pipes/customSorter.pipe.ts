import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'customSorter',
})
export class CustomSorterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const sorterFunction = args[0];
    const data = [...value];
    return sorterFunction ? data.sort(sorterFunction) : value;
  }
}
