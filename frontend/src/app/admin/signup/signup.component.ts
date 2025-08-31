import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'] 
})
export class SignupComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(
    private service: AuthService,
    private fb: FormBuilder,
      private router: Router
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
register() {
  if (this.validateForm.invalid) return;

  const user = this.validateForm.value;

  this.service.signup(user).subscribe({
    next: (res) => {
      console.log('✅ Inscription réussie :', res);
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      this.router.navigate(['/admin/login']); // ✅ redirection
    },
    error: (err) => {
      console.error('❌ Erreur d\'inscription :', err);
      alert('Erreur lors de l\'inscription. Vérifiez vos informations.');
    }
  });
  
}
  goToLogin() {
    this.router.navigate(['/admin/login']);
  }
}
