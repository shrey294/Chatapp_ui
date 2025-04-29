import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent implements OnInit{
  joinroomform!:FormGroup;
  fb = inject(FormBuilder);
  router = inject(Router);
  chatService = inject(ChatService)

  ngOnInit(): void {
    this.joinroomform = this.fb.group({
      user:['',Validators.required],
      room:['',Validators.required]
    })
  }
  joinRoom(){
    const {user,room} = this.joinroomform.value;
    sessionStorage.setItem("user",user);
    sessionStorage.setItem("room",room);
    this.chatService.joinroom(user,room).then(()=>{
      this.router.navigate(['chat']);
    }).catch((err)=>{
      console.log(err);
      
    })
    
  }
}
