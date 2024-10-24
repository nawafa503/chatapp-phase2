import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Peer } from 'peerjs';

const peer = new Peer({
  host: 'localhost', // Your server's hostname or IP address
  port: 3000, // The port your server is running on
  path: '/peerjs/video', // The path for PeerJS requests
});


@Component({
  selector: 'app-video-chat-room',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './video-chat-room.component.html',
  styleUrl: './video-chat-room.component.css'
})
export class VideoChatRoomComponent implements OnInit, OnDestroy {
  peerId = '';
  anotherPeerId = '';
  isConnected = false;
  isCalling = false;
  isShowCall = false;
  isShowCancel = false;
  @ViewChild('localVideo', { static: true })
  localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo', { static: true })
  remoteVideo!: ElementRef<HTMLVideoElement>;
  
  private localStream?: MediaStream;
  private remoteStream!: MediaStream;
  private call: any; // To store the active call
  
  constructor(private cd: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.onHangUp();
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop(); // Stop each media track
      });
      this.localStream = undefined; // Reset the local stream
    }
    if (peer) {
      peer.disconnect();
      peer.destroy();
      console.log('peer disconnected');
      
    }
  }
  
  ngOnInit() {
    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      this.peerId = id;
      this.cd.detectChanges();
    });

    peer.connect('localhost:3000');

    peer.on('connection', (conn) => {
      this.isConnected = true;
      this.anotherPeerId = conn.peer;
      this.cd.detectChanges();
      conn.on('data', (data) => {
        if (data === 'incomingCall') {
          this.isCalling = true;
          this.cd.detectChanges();
        }

        if (data === 'cancelCall') {
          this.isCalling = false;
          this.isShowCall = true;
          this.isShowCancel = true;
          this.remoteVideo.nativeElement.srcObject = null;

          this.cd.detectChanges();
        }

        if (data === 'connected') {
          this.isShowCall = true;
          this.cd.detectChanges();
        }

        if (data === 'acceptedCall') {
          this.isCalling = false;
          this.isShowCall = false;
          this.isShowCancel = true;
          this.cd.detectChanges();
        }
      });
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.localStream = stream;
        this.localVideo.nativeElement.srcObject = stream;

        // Listen for incoming calls
        peer.on('call', (call) => {
          this.cd.detectChanges();

          // Answer the call
          call.answer(this.localStream);

          // // Handle the remote stream when the call is answered
          call.on('stream', (steam) => {
            this.remoteVideo.nativeElement.srcObject = steam;
            this.remoteStream = steam;
          });

          // // Store the call for hangup or other actions
          this.call = call;
        });
      })
      .catch((error) => {
        console.error('Error accessing the camera:', error);
      });
  }

  onCreateServer() {
    const conn = peer.connect(this.anotherPeerId);
    conn.on('open', () => {
      conn.send('connected');
      this.isConnected = true;
      this.isShowCall = true;
      this.cd.detectChanges();
    });
  }

  onCall() {
    // Initiate a call to the remote peer

    const conn = peer.connect(this.anotherPeerId);
    conn.on('open', () => {
      conn.send('incomingCall');
    });
  }

  onHangUp() {
    this.isCalling = false;
    this.isShowCall = true;
    this.cd.detectChanges();

    const conn = peer.connect(this.anotherPeerId);
    conn.on('open', () => {
      conn.send('cancelCall');
    });

    if (this.call) {
      this.call.on('close', () => {
        this.call = null; // Reset the call object
      });

      this.call.close();

      this.remoteVideo.nativeElement.srcObject = null;
    }
  }

  onAcceptCall() {
    const call = peer.call(this.anotherPeerId, this.localStream as MediaStream);
    // Handle the remote stream when the call is answered
    call.on('stream', (steam) => {
      this.remoteVideo.nativeElement.srcObject = steam;
      this.remoteStream = steam;
    });

    const conn = peer.connect(this.anotherPeerId);
    conn.on('open', () => {
      conn.send('acceptedCall');
    });

    // Store the call for hangup or other actions
    this.call = call;
    this.isCalling = false;
    this.isShowCancel = true;
    this.isShowCall = false;
    this.cd.detectChanges();
  }
}
