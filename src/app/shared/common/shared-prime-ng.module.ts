import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG modules
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
  exports: [
    CommonModule,
    TableModule,
    ToolbarModule,
    InputTextModule,
    ToastModule,
    ButtonModule,
    CheckboxModule,
    TooltipModule,
    RippleModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class SharedPrimeNgModule {}
