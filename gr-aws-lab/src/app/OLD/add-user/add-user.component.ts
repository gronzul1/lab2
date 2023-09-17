import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';




// interface User {
//   userId: number;
//   department: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   location: string;
//   personalid: string;
// }

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  user: any = {};
  departments: any[] = [];
  locations: any[] = [];
  selectedDep: any | undefined;
  selectedLoc: any | undefined;

  constructor(private fxUsers: UsersService) {

  }

  ngOnInit(): void {
    this.departments = [
      { name: 'Finance' },
      { name: 'Management' },
      { name: 'Research and Development' },
      { name: 'Sales' },
      { name: 'Accounting' },
      { name: 'Human Resources' },
      { name: 'IT' },
      { name: 'Operations' },
      { name: 'Purchasing' },
      { name: 'Marketing' }
    ]

    this.locations = [
      { name: 'Italy' },
      { name: 'Guinea' },
      { name: 'Chad' },
      { name: 'Mozambique' },
      { name: 'Uzbekistan' },
      { name: 'Yemen' },
      { name: 'Qatar' },
      { name: 'Libya' },
      { name: 'Kuwait' },
      { name: 'Somalia' },
      { name: 'Serbia' },
      { name: 'Armenia' },
      { name: 'Ecuador' },
      { name: 'Nauru' },
      { name: 'Solomon Islands' },
      { name: 'Belarus' },
      { name: 'Turkmenistan' },
      { name: 'Vatican City' },
      { name: 'Afghanistan' },
      { name: 'Morocco' },
      { name: 'Sao Tome and Principe' },
      { name: 'Maldives' },
      { name: 'United Kingdom' },
      { name: 'Kosovo' },
      { name: 'Hungary' },
      { name: 'Nigeria' },
      { name: 'Czech Republic' },
      { name: 'Mexico' },
      { name: 'Suriname' },
      { name: 'Micronesia' },
      { name: 'Tunisia' },
      { name: 'Thailand' },
      { name: 'Haiti' },
      { name: 'Tuvalu' },
      { name: 'New Zealand' },
      { name: 'Malta' },
      { name: 'Uganda' },
      { name: 'India' },
      { name: 'Congo' },
      { name: 'Saint Lucia' },
      { name: 'Ghana' },
      { name: 'Saint Vincent and the Grenadines' },
      { name: 'Honduras' },
      { name: 'Liechtenstein' },
      { name: 'China' },
      { name: 'Zambia' },
      { name: 'Madagascar' },
      { name: 'Indonesia' },
      { name: 'Lesotho' },
      { name: 'Sudan, South' },
      { name: 'Palau' },
      { name: 'Iran' },
      { name: 'Algeria' },
      { name: 'Mongolia' },
      { name: 'Bhutan' },
      { name: 'Comoros' },
      { name: 'Philippines' },
      { name: 'Trinidad and Tobago' },
      { name: 'Azerbaijan' },
      { name: 'Uruguay' },
      { name: 'Cambodia' },
      { name: 'Kenya' },
      { name: 'Angola' },
      { name: 'Sweden' },
      { name: 'Chile' },
      { name: 'El Salvador' },
      { name: 'Oman' },
      { name: 'Liberia' },
      { name: 'Spain' },
      { name: 'Myanmar' },
      { name: 'Sri Lanka' },
      { name: 'Cyprus' },
      { name: 'Mali' },
      { name: 'Kiribati' },
      { name: 'CÃ´te dâ€™Ivoire' },
      { name: 'Venezuela' },
      { name: 'Central African Republic' },
      { name: 'The Gambia' },
      { name: 'Austria' },
      { name: 'Kyrgyzstan' },
      { name: 'Ireland' },
      { name: 'Croatia' },
      { name: 'Samoa' },

    ]
  }

  saveuser() {
    let payload = {
      userId: parseInt(this.user.userId),
      department: this.user.department.name,
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      location: this.user.location.name,
      personalid: this.user.personalid
    }
    this.fxUsers.saveUser(payload).subscribe({
      next: data => {
        if (data.body =="Successfully created item!")
        {
            
        }
      },
      error: err => {
        console.log(err);
      }
    }
    );

  }

}
