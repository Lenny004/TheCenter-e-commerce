import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMsg = '';

    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor completa todos los campos.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.authService.saveSession(res.token, res.user);
        this.router.navigate(['/']);
      },
      error: () => this.errorMsg = 'Credenciales incorrectas. Intenta de nuevo.'
    });
  }
}
