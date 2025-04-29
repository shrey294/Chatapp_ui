import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public Connection : signalR.HubConnection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7286/chat").configureLogging(signalR.LogLevel.Information).build();
  public messages$ = new BehaviorSubject<any>([]);
  public ConnectedUsers$ = new BehaviorSubject<string[]>([]);
  public messages:any[]=[];
  public users:any[]=[];

  constructor() {
    this.start();
    this.Connection.on("ReceiveMessage",(user: string, message:string, messagetime:string)=>{
      this.messages = [...this.messages,{user,message,messagetime}];
      this.messages$.next(this.messages);
    });

    this.Connection.on("ConnectedUser",(users:any)=>{
      this.ConnectedUsers$.next(users);
      
    })
   }


  // start connection
  public async start(){
    try {
      await this.Connection.start();
    } catch (error) {
      console.log(error);
      
    }
  }

  // join room 
 public async joinroom(user: string, room:string){
  return this.Connection.invoke("JoinRoom",{user,room})
 }

  // send messages

public async sendmessage(message:string){
  return this.Connection.invoke("SendMessage",message)
}

  // leave chat.
  public async leavechat(){
    return this.Connection.stop();
  }
}
