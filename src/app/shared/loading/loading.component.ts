import { Component, Input } from '@angular/core';
import { SharedPrimeNgModule } from '../common/shared-prime-ng.module';

@Component({
  selector: 'app-loading',
  imports: [SharedPrimeNgModule],
  standalone: true,
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {

  @Input() isLoading: boolean = false;
  @Input() message: string = '';

  ngOnChanges(changes: any): void {
    if (changes['message']) {
      const updatedMessage = changes['message'].currentValue;
      this.message = updatedMessage;
      console.log('Updated message:', this.message);
    }
  }
}
