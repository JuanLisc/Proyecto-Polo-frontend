import { BaseEntity } from '../../../app/core/models/base-entity.model';

interface IResponseData {
  result: BaseEntity
}

export interface IResponse {
  data: IResponseData;
  message: string | undefined;
  resultKeys: string[] | undefined;
}