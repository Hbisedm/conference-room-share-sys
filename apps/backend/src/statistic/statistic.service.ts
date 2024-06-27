import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class StatisticService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async userBookingCount(startTime: string, endTime: string) {
    const res = await this.entityManager
      .createQueryBuilder(Booking, 'b')
      .select('u.id', '用户ID')
      .addSelect('u.username', '用户名')
      .leftJoin(User, 'u', 'b.userId = u.id')
      .addSelect('count(1)', '预约次数')
      .where('b.startTime between :time1 and :time2', {
        time1: startTime,
        time2: endTime,
      })
      .addGroupBy('b.userId')
      .getRawMany();

    return res;
  }

  async meetingRoomUsedCount(startTime: string, endTime: string) {
    const res = await this.entityManager
      .createQueryBuilder(Booking, 'b')
      .select('m.id', '会议室ID')
      .addSelect('m.name', '会议室名称')
      .leftJoin(MeetingRoom, 'm', 'b.roomId = m.id')
      .addSelect('count(1)', '使用次数')
      .where('b.startTime between :time1 and :time2', {
        time1: startTime,
        time2: endTime,
      })
      .addGroupBy('m.id')
      .getRawMany();

    return res;
  }
}
