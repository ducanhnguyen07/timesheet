import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/request/create-request.dto';
import { UpdateRequestDto } from './dto/request/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ResponseRequestDto } from './dto/response/response-request-dto';
import { Timesheet } from '../timesheet/entities/timesheet.entity';
import { plainToInstance } from 'class-transformer';
import { DeleteRequestDto } from './dto/response/delete-request.dto';

@Injectable()
export class RequestService {
  @InjectRepository(Request)
  private readonly requestRepository: Repository<Request>;

  async create(createRequestDto: CreateRequestDto): Promise<ResponseRequestDto | string> {
    try {
      const newRequest = await this.requestRepository.save({
        ...createRequestDto,
        timesheetId: createRequestDto.timesheetId as DeepPartial<Timesheet>,
      });

      const responseRequest = plainToInstance(ResponseRequestDto, newRequest, {
        excludeExtraneousValues: true
      });

      return responseRequest;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async findAll(): Promise<ResponseRequestDto[] | string> {
    try {
      const requestList = await this.requestRepository.find({});
      const responseRequestList = requestList.map(req => plainToInstance(ResponseRequestDto, req, {
        excludeExtraneousValues: true
      }));

      return responseRequestList;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async findOne(id: string) {
    try {
      const request = await this.requestRepository.findOne({
        where: { id: id }
      });
      const responseRequest = plainToInstance(ResponseRequestDto, request, {
        excludeExtraneousValues: true
      });

      return responseRequest;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async update(id: string, updateRequestDto: UpdateRequestDto): Promise<ResponseRequestDto | string> {
    try {
      const updateRequest = await this.requestRepository.findOne({
        where: { id: id }
      });

      Object.assign(updateRequest, updateRequestDto);
      const updatedRequest = await this.requestRepository.save(updateRequest);

      const responseRequest = plainToInstance(ResponseRequestDto, updatedRequest, {
        excludeExtraneousValues: true
      });
      return responseRequest;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async remove(id: string): Promise<DeleteRequestDto | string> {
    try {
      const deleteRequest = await this.requestRepository.findOne({
        where: { id: id }
      });

      deleteRequest.isDeleted = true;
      deleteRequest.deletedAt = new Date();

      const deletedRequest = await this.requestRepository.save(deleteRequest);

      const responseRequest = plainToInstance(DeleteRequestDto, deletedRequest, {
        excludeExtraneousValues: true
      });
      return responseRequest;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }
}
