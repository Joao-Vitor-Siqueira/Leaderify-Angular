import { Component, signal } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { LoadingComponent } from '../../loading.component/loading.component';

@Component({
  selector: 'app-register',
  imports: [FormsModule, LoadingComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  username: string = '';

  errors = signal<string[]>([]);
  success = signal<boolean>(false);
  loading = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async onSubmit(): Promise<void> {
  const errors: string[] = [];

  if (this.password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  if (!this.hasSpecialCharacters(this.password)) {
    errors.push(
      'Password must include at least one special character (e.g., @, #, $, !).'
    );
  }

  if (this.password !== this.confirmPassword) {
    errors.push("Passwords don't match");
  }

  if (errors.length) {
    this.errors.set(errors);
    return;
  }

  try {
    const emailExists = await firstValueFrom(
      this.authService.emailExists(this.email)
    );

    if (emailExists) {
      this.errors.set(['An account with this email already exists.'])
      return;
    }

    const usernameExists = await firstValueFrom(
      this.authService.usernameExists(this.username)
    );

    if(usernameExists){
      this.errors.set(['An account with this username already exists.'])
      return;
    }
    this.errors.set([]);

    this.loading.set(true);

    this.authService.register(this.email,this.username,this.password).subscribe({
      next: () => {
        this.success.set(true);
        setTimeout(() => {this.router.navigate(['/login']);}, 1500);
      },
      error: () => {
        this.errors.set(['Unable to create the user. Please try again.']);
      },
    });

  } catch (error) {
    this.errors.set(['Unable to verify the email. Please try again.']);
  }
}

  hasSpecialCharacters(str: string): boolean {
    return /[^\p{L}\p{N}]/u.test(str);
  }
}
