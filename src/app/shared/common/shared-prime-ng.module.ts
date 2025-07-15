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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

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
    ConfirmDialogModule,
    ReactiveFormsModule,
    PasswordModule,
    RouterModule,
    DialogModule,
    FormsModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class SharedPrimeNgModule {}
