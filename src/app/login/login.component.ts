import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  ngOnInit(): void {
  }
  public email: string;
  public password: string;

  constructor(private router:Router){
    this.email="";
    this.password="";
  }

  public submit():void{
    this.router.navigate(['index']);
  }

}
