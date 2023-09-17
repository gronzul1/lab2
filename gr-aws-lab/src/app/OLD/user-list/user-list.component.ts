import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

  loading: boolean = true;
  users: any[] = [];
  constructor(private fxUser: UsersService,) {

  }

  getAllUsers() {
    this.fxUser.getAllUsers().subscribe({
      next: data => {
        // console.log(data);        
        this.users = JSON.parse(data.body).Items;
        this.loading = false;
      },
      error: err => {
        if (err instanceof HttpErrorResponse) {
          console.log(err);
        }
      }
    })
  }
}
