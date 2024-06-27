import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  Between,
  EntityManager,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { Booking } from './entities/booking.entity';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class BookingService {
  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  @InjectEntityManager()
  private entityManager: EntityManager;

  async initData() {
    const user1 = await this.entityManager.findOneBy(User, {
      id: 1,
    });
    const user2 = await this.entityManager.findOneBy(User, {
      id: 3,
    });

    const room1 = await this.entityManager.findOneBy(MeetingRoom, {
      id: 5,
    });
    const room2 = await await this.entityManager.findOneBy(MeetingRoom, {
      id: 6,
    });

    const booking1 = new Booking();
    booking1.room = room1;
    booking1.user = user1;
    booking1.startTime = new Date();
    booking1.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking1);

    const booking2 = new Booking();
    booking2.room = room2;
    booking2.user = user2;
    booking2.startTime = new Date();
    booking2.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking2);

    const booking3 = new Booking();
    booking3.room = room1;
    booking3.user = user2;
    booking3.startTime = new Date();
    booking3.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking3);

    const booking4 = new Booking();
    booking4.room = room2;
    booking4.user = user1;
    booking4.startTime = new Date();
    booking4.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking4);
  }

  async find(
    pageNo: number,
    pageSize: number,
    username: string,
    meetingRoomName: string,
    meetingRoomPosition: string,
    bookingTimeRangeStart: number,
    bookingTimeRangeEnd: number,
  ) {
    const skipCount = (pageNo - 1) * pageSize;

    const condition: Record<string, any> = {};

    if (username) {
      condition.user = {
        username: Like(`%${username}%`),
      };
    }

    if (meetingRoomName) {
      condition.room = {
        name: Like(`%${meetingRoomName}%`),
      };
    }

    if (meetingRoomPosition) {
      condition.room = {
        location: Like(`%${meetingRoomPosition}%`),
      };
    }

    if (bookingTimeRangeStart) {
      // if no end time, set end time to start time + 1 hour
      if (!bookingTimeRangeEnd) {
        bookingTimeRangeEnd = bookingTimeRangeStart + 60 * 60 * 1000;
      }
      condition.startTime = Between(
        new Date(Number(bookingTimeRangeStart)),
        new Date(Number(bookingTimeRangeEnd)),
      );
    }

    const [bookings, totalCount] = await this.entityManager.findAndCount(
      Booking,
      {
        // select: {
        //   id: true,
        //   startTime: true,
        //   user: {
        //     id: true,
        //     nickName: true,
        //   },
        //   room: {},
        // },
        where: condition,
        relations: {
          user: true,
          room: true,
        },
        skip: skipCount,
        take: pageSize,
      },
    );

    bookings.forEach((booking) => {
      delete booking.user.password;
      return booking;
    });

    return {
      bookings,
      totalCount,
    };
  }

  async add(bookingDto: CreateBookingDto, userId: number) {
    const meetingRoom = await this.entityManager.findOneBy(MeetingRoom, {
      id: bookingDto.meetingRoomId,
    });

    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }

    const user = await this.entityManager.findOneBy(User, {
      id: userId,
    });

    const booking = new Booking();
    booking.room = meetingRoom;
    booking.user = user;
    booking.startTime = new Date(bookingDto.startTime);
    booking.endTime = new Date(bookingDto.endTime);
    booking.note = bookingDto.note;

    /**
     * 这里的booking.startTime和booking.endTime的时间是0时区
     */

    const res = await this.entityManager.findOneBy(Booking, {
      room: {
        id: meetingRoom.id,
      },
      startTime: LessThanOrEqual(booking.startTime),
      endTime: MoreThanOrEqual(booking.endTime),
      // status: Not(In(['审批通过', '申请中'])),
    });

    /**
     * 
     * 这里的res.startTime和res.endTime的时间是+8时区
     *
     * 时间戳一样， 但是时区不同
     * 
     * src\booking\entities\booking.entity.ts
     * 
     *   @Column({
            comment: '会议开始时间',
     ++     transformer: dateTransformer,
          })
          startTime: Date;

          @Column({
            comment: '会议结束时间',
     ++    transformer: dateTransformer,
          })
          endTime: Date;
     *
     */

    if (res) {
      throw new BadRequestException('会议室已被占用');
    }

    await this.entityManager.save(Booking, booking);
  }

  async apply(id: number) {
    // const booking = await this.entityManager.findOneBy(Booking, {
    //   id,
    // });

    // if (!booking) {
    //   throw new BadRequestException('会议不存在');
    // }

    await this.entityManager.update(Booking, { id }, { status: '审批通过' });

    return 'success';
  }
  async reject(id: number) {
    await this.entityManager.update(Booking, { id }, { status: '审批驳回' });

    return 'success';
  }

  async unbind(id: number) {
    await this.entityManager.update(Booking, { id }, { status: '已解除' });

    return 'success';
  }

  async urge(id: number) {
    const flag = await this.redisService.get('urge_' + id);
    if (flag) {
      return '半小时内只能催办一次，请耐心等候。';
    }
    let email = await this.redisService.get('admin_email');
    console.log('admin:email:', email);
    if (!email) {
      const admin = await this.entityManager.findOne(User, {
        select: {
          email: true,
        },
        where: {
          isAdmin: true,
        },
      });
      email = admin.email;
      console.log('admin:', admin);
      this.redisService.set('admin_email', email);
    }

    this.emailService.sendMail({
      to: email,
      subject: '预定申请催办提醒',
      html: `id 为 ${id} 的预定申请正在等待审批`,
    });

    this.redisService.set('urge_' + id, 1, 30 * 60);
  }

  create(createBookingDto: CreateBookingDto) {
    return 'This action adds a new booking';
  }

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
