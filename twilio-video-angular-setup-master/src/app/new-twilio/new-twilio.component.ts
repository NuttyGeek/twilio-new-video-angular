import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { SecondService } from '../twilio/services/second.service';

@Component({
  selector: 'app-new-twilio',
  templateUrl: './new-twilio.component.html',
  styleUrls: ['./new-twilio.component.css']
})
export class NewTwilioComponent implements OnInit, AfterViewInit {

  message:string = '-----';
  usernamevalue: string;
  roomNameValue: string;
  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  constructor(private twilio: SecondService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.twilio.localVideo = this.localVideo;
    this.twilio.remoteVideo = this.remoteVideo;
    console.log(':: localVideo updated', this.twilio.localVideo);
    console.log(':: remoteVideo updated', this.twilio.remoteVideo);
  }

  /**
   * handle connect click
   */
  connect(){
    // calll twilio service
    this.twilio.getToken(this.usernamevalue, this.roomNameValue).subscribe((res)=>{
      const token = res['token'];
      const options = { name: this.roomNameValue, audio: true, video: { width: 240 }};
      // call connect fxn
      this.twilio.connectToRoom(token, options,
        // on Part Connected
      (participant)=>{
        console.log('Participant "%s" connected', participant.identity);
        // What happens when user is connected
        participant.on('trackSubscribed', (track)=>{
          console.log(':: remoteVideoElement',this.remoteVideo);
          this.remoteVideo.nativeElement.appendChild(track.attach());
        });
        // What happens when user is disconnected
        participant.on('trackUnsubscribed', (track)=>{
          track.detach().forEach(element => element.remove());
        });
        // check for already present participants
        console.log(':: checking already present participants', participant.tracks);
        participant.tracks.forEach(publication => {
          if (publication.isSubscribed) {
            this.remoteVideo.nativeElement.appendChild(publication.track.attach());
          }
        });
      },
      // on Part Disconnected
      (participant)=>{
        console.log('Participant "%s" disconnected', participant.identity);
        this.remoteVideo.nativeElement.remove();
      });
    }, err =>{
      console.error('error calling getToken endpoint', err);
    });

    // Start showing Local Video
    this.twilio.startLocalVideo();
  }

  /**
   * handle disconnect click
   */
  disconnect(){
    // Disconnect
    this.twilio.disconnectFromRoom();
  }

}
