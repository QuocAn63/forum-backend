import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { AuthUser } from '../auth/auth.guard';
import { Injectable } from '@nestjs/common';

export interface socketMetadata extends AuthUser {
  socketId: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements
    OnGatewayInit<Socket>,
    OnGatewayConnection<Socket>,
    OnGatewayDisconnect<Socket>
{
  @WebSocketServer()
  server: Server;
  socketClients = new Map<string, socketMetadata>();

  constructor(private jwtSerivce: JwtService) {}

  afterInit(
    server: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    console.log('Gateway intialized.');
  }

  async handleConnection(
    client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    ...args: any[]
  ) {
    const token = client.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log(`${client.id} don't have authorization token.`);
      client.disconnect(true);
      return;
    }

    try {
      console.log(`${client.id} connected.`);
      const payload = await this.jwtSerivce.verify(token);

      this.socketClients.set(payload.id, { socketId: client.id, ...payload });
    } catch (err) {
      console.log(err);
      client.disconnect(true);
      return;
    }
  }

  async handleDisconnect(
    client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    this.socketClients.delete(client.id);
  }

  async pushNotification(userId: string, data: any) {
    const clientSocket = this.socketClients.get(userId);

    if (clientSocket) {
      this.server.to(clientSocket.socketId).emit('NOTIFICATION_PUSH', data);
    } else {
      console.log('User is not online at the moment.');
    }
  }
}
