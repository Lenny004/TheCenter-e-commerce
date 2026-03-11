import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { User } from '../../models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: User = {
    id: 1,
    name: 'Adrián',
    phone: '+503 7890-1234',
    email: 'adrian@example.com',
    rol: 'cliente'
  };
}
