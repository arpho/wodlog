import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prestazione',
  standalone: true
})
export class PrestazionePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {

    return (args[0]as string).includes("Kg")?`${value} Kg`:`${Math.floor(Number(value)/60)} min ${Number(value)%60} sec`;
  }

}
