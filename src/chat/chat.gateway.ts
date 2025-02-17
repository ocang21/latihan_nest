import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server } from 'http';
import { Socket } from 'socket.io';

@WebSocketGateway(
  {
    cors: {
      origin: "*"
    },
    path: "/socket"
  }
)
export class ChatGateway {
  constructor(private readonly chatService: ChatService) { }

  @WebSocketServer()
  Server: Server

  async handleConnection(socket: Socket) {
    console.log("connected")
  }
  async handleDisconnect(socket: Socket) {
    console.log("disconnected")
  }

  @SubscribeMessage("chat-send")
  async sendMessage(socket: Socket, data: any) {
    const { message } = data
    this.Server.emit("chat-receive", message)
  }


  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
