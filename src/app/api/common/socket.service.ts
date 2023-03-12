import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticateService } from './authenticate.service';
import { IToken } from '../../common/api/token';
import { BASE_PATH } from '../../common/define/host-domain.define';

declare const io: any;
@Injectable()
export class SocketService {
  private isConnecting: boolean;

  private url: string;
  private socket: any;
  private userInfo: IToken;
  private subjectSocket: Subject<any> = new Subject();


  constructor(
    private authService: AuthenticateService
  ) {
    this.url = BASE_PATH();
  }

  private handShake(staffId: string, merchantId: string) {
    this.socket.emit('hand_shake', {
      staff_id: staffId,
      merchant_id: merchantId
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.emit('disconnect_request');
    }
    this.isConnecting = false;
  }

  getNotify() {
    if (this.isConnecting) {
      return this.subjectSocket;
    }
    if (!this.userInfo) {
      this.userInfo = this.authService.jwtDecode();
    }
    this.socket = io(this.url, {
      transports: ['websocket']
    });
    this.isConnecting = true;

    this.socket.on('connect', () => {
      this.handShake(this.userInfo.id, this.userInfo.merchantID);
      this.socket.on('disconnecting', (reason: any) => {
        console.log(reason);
      });
    });
    this.socket.on('mobio_response', (data: any) => {
      this.subjectSocket.next(data);
    });

    this.socket.on('my_ping', () => {
      if (this.socket) {
        this.socket.emit('my_pong');
      }
    });

    return this.subjectSocket;
  }

  get IsConnecting() {
    return this.isConnecting;
  }
}
