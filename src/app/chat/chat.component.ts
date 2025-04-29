import { AfterViewChecked, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  
 chatService = inject(ChatService);
 inputmessage="";
 messages:any[] = [];
 loggedInUserName=sessionStorage.getItem("user");
 @ViewChild('scrollMe') private ScrollContainer!: ElementRef
 Router = inject(Router)
 roomname = sessionStorage.getItem("room");

 ngOnInit(): void {
  this.chatService.messages$.subscribe(res=>{
    this.messages = res;
    console.log(this.messages);
    
  });
}
ngAfterViewChecked(): void {
  this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight;
}
sendmessage(){
  this.chatService.sendmessage(this.inputmessage).then(()=>{
    this.inputmessage='';
  }).catch((err)=>{
    console.log(err);
    
  })
}
leavechat(){
  this.chatService.leavechat().then(()=>{
    this.Router.navigate(['welcome']);
    setTimeout(()=>{
      location.reload();
    },0);
  }).catch((err)=>{
    console.log(err);
  })
}
}
