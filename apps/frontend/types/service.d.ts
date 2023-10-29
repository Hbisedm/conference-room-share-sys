/** 请求的相关类型 */
declare namespace Service {

  /** 请求结果 */
  interface Result<T = any> {
    /** 状态码 */
    code: string | number;
    /** 接口数据 */
    data: T;
    /** 接口消息 */
    message: string;
  }

  /** 列表请求基本参数 */
  interface ListPageParams {
    current?: number
    size?: number
  }

  /** 列表响应模型 */
  interface ListModel<T> {
    records: T[]
    current: string
    pages: string
    size: string
    total: string
    [key: string]: unknown
  }

  /** 列表响应结果 */
  type ListResult<T> = Result<ListModel<T>>
}
