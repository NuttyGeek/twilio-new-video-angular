import { Injectable, EventEmitter, ElementRef } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { connect, createLocalTracks, createLocalVideoTrack } from 'twilio-video';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class TwilioService {

  remoteVideo: ElementRef;
  localVideo: ElementRef;
  previewing: boolean;
  msgSubject = new BehaviorSubject("");
  roomObj: any;

  constructor(private http: HttpClient) {
  }

  getToken(username:string, roomName:string): Observable<any> {
    const url = 'http://localhost:8081/token?identity='+username+'&roomName='+roomName;
    return this.http.get(url);
  }

  connectToRoom(accessToken: string, options): void {
    console.log(':: accessToken', accessToken);
    console.log(':: options', options);
    connect(accessToken, options).then(room => {
      console.log(':: room', room);
      this.roomObj = room;
      if (!this.previewing && options['video']) {
        this.startLocalVideo();
        this.previewing = true;
      }
      room.participants.forEach(participant => {
        this.msgSubject.next("Already in Room: '" + participant.identity + "'");
        console.log("Already in Room: '" + participant.identity + "'");
        this.attachParticipantTracks(participant);
      });

      room.on('participantDisconnected', (participant) => {
        this.msgSubject.next("Participant '" + participant.identity + "' left the room");
        console.log("Participant '" + participant.identity + "' left the room");
        this.detachParticipantTracks(participant);
      });

      room.on('participantConnected',  (participant) => {
        console.log(':: added ', participant);
        participant.on('trackSubscribed', track => this.trackSubscribed(track));
        participant.on('trackUnsubscribed', this.trackUnsubscribed);
        participant.tracks.forEach(publication => {
          if (publication.isSubscribed) {
            this.trackSubscribed(publication.track);
          }
        });
      });



      // When a Participant adds a Track, attach it to the DOM.
      room.on('trackAdded', (track, participant) => {
        console.log(participant.identity + " added track: " + track.kind);
        this.attachTracks(track);
      });

      // When a Participant removes a Track, detach it from the DOM.
      room.on('trackRemoved', (track, participant) => {
        console.log(participant.identity + " removed track: " + track.kind);
        this.detachTracks([track]);
      });

      room.once('disconnected',  (room) => {
        this.msgSubject.next('You left the Room:' + room.name);
        this.remoteVideo.nativeElement.style.display = 'none';
        console.log(':: localPartipant ', room.localParticipant);
        room.participants.forEach((participant) => {
          console.log(':: disconnected - participant', participant);
          participant.tracks.forEach((track)=>{
            console.log(':: disconnected - track', track);
          })
        });

        /**
         *
         * participant.forEach(function (publication) {
        console.log("::inside the fe"+publication.track)
          if (publication.isSubscribed) {
              const track = publication.track;
              console.log("::inside the video"+track)
              this.remoteVideo.nativeElement.appendChild(track.attach());
          }
      });
         */

        // room.localParticipant.tracks.forEach(track => {
        //   var attachedElements = track.detach();
        //   attachedElements.forEach(element => element.remove());
        // });
      });
    });
  }

  trackSubscribed(track){
    console.log(':: track subscribed', track);
    this.remoteVideo.nativeElement.appendChild(track.attach());
  }

  trackUnsubscribed(){
    console.log(':: track unsubscribed');
    this.remoteVideo.nativeElement.remove();
  }

  attachParticipantTracks(participant): void {
   // var tracks = Array.from(participant.tracks.values());
   participant.on('trackSubscribed', track => this.trackSubscribed(track));
    this.attachTracks(Array.from(participant.tracks));
  }

  //:: WORKING
  attachTracks(tracks: any) {
    console.log(':: remote tracks', tracks);
    tracks.forEach((participant) => {
      console.log('Remote Participant connected: ', participant);
      participant.forEach(function (publication) {
        console.log("::inside the fe"+publication.track)
          if (publication.isSubscribed) {
              const track = publication.track;
              console.log("::inside the video"+track)
              this.remoteVideo.nativeElement.appendChild(track.attach());
          }
      });
    });

  }

  startLocalVideo(): void {
    createLocalVideoTrack().then(track => {
      console.log(':: local Track', track);
      this.localVideo.nativeElement.appendChild(track.attach());
    });
  }

  localPreview(): void {
    createLocalVideoTrack().then(track => {
      this.localVideo.nativeElement.appendChild(track.attach());
    });
  }

  detachParticipantTracks(participant) {
    var tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  }

  detachTracks(tracks): void {
    /* tracks.forEach(function (track) {
      track.detach().forEach(function (detachedElement) {
        detachedElement.remove();
      });
    });
    */
    tracks.forEach((participant) => {
      console.log('Remote Participant connected: ', participant);
    });
  }

}
