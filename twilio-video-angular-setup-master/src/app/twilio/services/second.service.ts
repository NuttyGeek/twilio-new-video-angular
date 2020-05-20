import { Injectable , ElementRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { connect, createLocalTracks, createLocalVideoTrack } from 'twilio-video';

@Injectable()
export class SecondService {

  previewing: boolean;
  localVideo: ElementRef;
  remoteVideo: ElementRef;
  room: any;

  constructor(private http: HttpClient){
  }

  /**
   * returns the token from server
   * @param username username whi wants to connect
   * @param roomName room to connect to
   */
  getToken(username:string, roomName:string): Observable<any> {
    const url = 'http://localhost:8081/token?identity='+username+'&roomName='+roomName;
    return this.http.get(url);
  }

  /**
   *
   * @param accessToken accessToken got from server
   * @param options options provided by component
   */
  connectToRoom(accessToken: string, options: any, onPartConnected, onPartDisconnected){
    console.log(':: accessToken', accessToken);
    console.log(':: options', options);
    // connecting to Room with given options
    connect(accessToken, options).then(room => {
      this.room = room;
      console.log(':: room', room);
      // get participants video & audio who are already connected
      room.participants.forEach((participant)=>{
        onPartConnected(participant);
      });
      room.on('participantConnected', onPartConnected);
      room.on('participantDisconnected', onPartDisconnected);
      room.once('disconnected', error => room.participants.forEach(onPartDisconnected));
    });
  }

  /**
   * this disconnect user from room
   */
  disconnectFromRoom(){
    this.room.disconnect();
  }

  /**
   * Start Local Video
   */
  startLocalVideo(): void {
    createLocalVideoTrack().then(track => {
      console.log(':: local Track', track);
      if(this.localVideo){
        this.localVideo.nativeElement.appendChild(track.attach());
      } else{
        console.error('locaVideo is null');
      }
    });
  }

  localPreview(): void {
    createLocalVideoTrack().then(track => {
      this.localVideo.nativeElement.appendChild(track.attach());
    });
  }


  // *********** Handling events on Room **************

  /**
   * handle what to do when part. is connected
   */
  participantConnected(participant){
    console.log('Participant "%s" connected', participant.identity);
    // create a div with part id
    const div = this.remoteVideo;
    // not required in out case
    // const div = this.remoteVideo;
    participant.on('trackSubscribed', (track)=>{
      // attach tracks to remote Div
      console.log(':: remoteVideoElement',this.remoteVideo);
      div.nativeElement.appendChild(track.attach());
    });

    participant.on('trackUnsubscribed', (track)=>{
      track.detach().forEach(element => element.remove());
    });
    // handling publications
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        this.trackSubscribed(div, publication.track);
      }
    });
    // add div to body
    // not required in our case
  }

  /**
   * Handle what to do when part. is disconnected
   */
  participantDisconnected(participant){
    console.log('Participant "%s" disconnected', participant.identity);
    this.remoteVideo.nativeElement.remove();
    // remove element from document
  }

  /**
   * Handle what to do when track is subscribed
   */
  trackSubscribed(div, track){
    console.log(':: track Subscribed');
    div.appendChild(track.attach());
  }

  /**
   * Handle what to do track is unsunscribed
   */
  trackUnsubscribed(track){
    console.log(':: track Unsubscribed');
    track.detach().forEach(element => element.remove());
  }


}
