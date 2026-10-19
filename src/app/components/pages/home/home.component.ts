import { Component, signal, Signal } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private authService: AuthService){}

  username = signal<string>('');

    ngOnInit(): void {
      this.authService.getUsername().subscribe({
      next: (response) => {
        this.username.set(response.username);
      },
      error: (error) => {
        console.error(error);
      },
    });
    }
}
