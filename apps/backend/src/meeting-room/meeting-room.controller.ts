import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { generateParseIntPipe } from 'src/utils';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('会议室管理模块')
@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(1),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('name') name: string,
    @Query('capacity') capacity: number,
    @Query('equipment') equipment: string,
  ) {
    return await this.meetingRoomService.find(
      pageNo,
      pageSize,
      name,
      capacity,
      equipment,
    );
  }

  @Post('create')
  async createMeetingRoom(@Body() meetingRoomDto: CreateMeetingRoomDto) {
    return await this.meetingRoomService.create(meetingRoomDto);
  }

  @ApiTags('更新会议室信息')
  @Post('update')
  async updateMeetingRoom(@Body() meetingRoomDto: UpdateMeetingRoomDto) {
    console.log('meetingRoomDto::', meetingRoomDto);
    return await this.meetingRoomService.update(meetingRoomDto);
  }

  @Post()
  create(@Body() createMeetingRoomDto: CreateMeetingRoomDto) {
    return this.meetingRoomService.create(createMeetingRoomDto);
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.meetingRoomService.findById(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingRoomService.delete(+id);
  }
}
