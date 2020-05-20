import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { TwilioService } from './services/twilio.service';
// import * as Video from 'twilio-video';;

@Component({
  selector: 'app-twilio',
  templateUrl: './twilio.component.html',
  styleUrls: ['./twilio.component.css']
})
export class TwilioComponent implements OnInit {

  message: string;
  accessToken: string;
  roomName: string;
  username: string;

  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  constructor(private twilioService: TwilioService) {
    this.twilioService.msgSubject.subscribe(r => {
      this.message = r;
    });
  }


  ngOnInit() {
    this.twilioService.localVideo = this.localVideo;
    this.twilioService.remoteVideo = this.remoteVideo;
  }

  log(message) {
    this.message = message;
  }

  disconnect() {
    if (this.twilioService.roomObj && this.twilioService.roomObj !== null) {
      this.twilioService.roomObj.disconnect();
      this.twilioService.roomObj = null;
    }
  }

  connect(): void {
    let storage = JSON.parse(sessionStorage.getItem('token') || '{}');
    let date = Date.now();
    if (!this.roomName || !this.username) { this.message = "enter username and room name."; return;}
    if (storage['token'] && storage['created_at'] + 3600000 > date) {
      this.accessToken = storage['token'];
      this.twilioService.connectToRoom(this.accessToken, { name: this.roomName, audio: true, video: { width: 240 } })
      return;
    }
    this.twilioService.getToken(this.username, this.roomName).subscribe(d => {
      this.accessToken = d['token'];
      sessionStorage.setItem('token', JSON.stringify({
        token: this.accessToken,
        created_at: date
      }));
      this.twilioService.connectToRoom(this.accessToken, { name: this.roomName, audio: true, video: { width: 240 } })
    },
      error => this.log(JSON.stringify(error)));
  }

}
