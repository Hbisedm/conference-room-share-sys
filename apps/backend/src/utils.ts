import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ParseIntPipe } from '@nestjs/common/pipes';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Shanghai');

export function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

export function generateParseIntPipe(name) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(`${name} 应该传数字`);
    },
  });
}

/** 一个时区的项目可以用这种 去做日期格式化 */
export const dateTransformer = {
  from: (value: Date) => {
    return dayjs.tz(value).format('YYYY-MM-DD HH:mm:ss');
  },
  to: (value: Date) => {
    return dayjs.tz(value).format('YYYY-MM-DD HH:mm:ss');
  },
};
