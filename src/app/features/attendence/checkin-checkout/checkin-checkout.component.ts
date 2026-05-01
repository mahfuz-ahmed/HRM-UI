import { Component } from '@angular/core';
import { SharedPrimeNgModule } from '../../../shared/common/shared-prime-ng.module';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
    selector: 'app-checkin-checkout',
    imports: [SharedPrimeNgModule],
    templateUrl: './checkin-checkout.component.html',
    styleUrl: './checkin-checkout.component.scss'
})
export class CheckinCheckoutComponent {
    message = '';

    onCheckIn() {}

    onCheckOut() {}
}
