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
      this.roomObj = room;
      if (!this.previewing && options['video']) {
        this.startLocalVideo();
        this.previewing = true;
      }
      room.participants.forEach(participant => {
        this.msgSubject.next("Already in Room: '" + participant.identity + "'");
        // console.log("Already in Room: '" + participant.identity + "'");
        // this.attachParticipantTracks(participant);
      });

      room.on('participantDisconnected', (participant) => {
        this.msgSubject.next("Participant '" + participant.identity + "' left the room");
        // console.log("Participant '" + participant.identity + "' left the room");

        this.detachParticipantTracks(participant);
      });

      room.on('participantConnected',  (participant) => {
        participant.tracks.forEach(track => {
          this.remoteVideo.nativeElement.appendChild(track.attach());
        });

        // participant.on('trackAdded', track => {
        //   console.log('track added')
        //   this.remoteVideo.nativeElement.appendChild(track.attach());
        //   document.getElementById('remote-media-div').appendChild(track.attach());
        // });
      });

      // When a Participant adds a Track, attach it to the DOM.
      room.on('trackAdded', (track, participant) => {
        console.log(participant.identity + " added track: " + track.kind);
        this.attachTracks([track]);
      });

      // When a Participant removes a Track, detach it from the DOM.
      room.on('trackRemoved', (track, participant) => {
        console.log(participant.identity + " removed track: " + track.kind);
        this.detachTracks([track]);
      });

      room.once('disconnected',  room => {
        this.msgSubject.next('You left the Room:' + room.name);
        room.localParticipant.tracks.forEach(track => {
          var attachedElements = track.detach();
          attachedElements.forEach(element => element.remove());
        });
      });
    });
  }

  attachParticipantTracks(participant): void {
    var tracks = Array.from(participant.tracks.values());
    this.attachTracks([tracks]);
  }

  attachTracks(tracks) {
    tracks.forEach(track => {
      this.remoteVideo.nativeElement.appendChild(track.attach());
    });
  }

  startLocalVideo(): void {
    createLocalVideoTrack().then(track => {
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
    tracks.forEach(function (track) {
      track.detach().forEach(function (detachedElement) {
        detachedElement.remove();
      });
    });
  }

}
