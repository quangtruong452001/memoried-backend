import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Comment } from 'src/database/entities/comment.entity';

@WebSocketGateway()
export class CommentsGateway {
  @WebSocketServer()
  server: Server;

  handleNewComment(comment: Comment) {
    this.server.emit('newComment', comment);
  }
}
