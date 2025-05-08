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
 searchText:string='';

 ngOnInit(): void {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  this.chatService.messages$.subscribe(res=>{
    this.messages = res;
    this.handleIncomingMessage(res[res.length - 1]);
    
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
get filteredUsers(){
  const users = this.chatService.ConnectedUsers$.value;
  if(!this.searchText) return users;
  return users.filter(user=>user.toLowerCase().includes(this.searchText.toLowerCase()));
}
isTabInactive(): boolean {
  return document.hidden;
}
handleIncomingMessage(message: any) {
  if (message.user !== this.loggedInUserName && this.isTabInactive()) {
    this.showNotification(`New message from ${message.user}`, message.message);
  }
}
showNotification(title: string, body: string) {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, { body });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}
}
