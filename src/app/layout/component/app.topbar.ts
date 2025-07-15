import { Component} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { OverlayPanelModule  } from 'primeng/overlaypanel';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator,OverlayPanelModule,LoadingComponent ],
    templateUrl:'./app.topbar.html' 
})
export class AppTopbar {
    showProfileMenu = false;
    showCloseIcon = false;
    dismissable = false;
    loading = false;

    constructor(public layoutService: LayoutService, private router: Router) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    logout(){
        this.loading = true
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        this.router.navigate(['/auth/login']);
        this.loading = false;
    }
}
