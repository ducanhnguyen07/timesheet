import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/request/create-request.dto';
import { UpdateRequestDto } from './dto/request/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { Repository } from 'typeorm';
import { ResponseRequestDto } from './dto/response/response-request-dto';
import { plainToInstance } from 'class-transformer';
import { DeleteRequestDto } from './dto/response/delete-request.dto';
import { ResponseUserDto } from '../../src/user/dto/response/response-user-dto';
import { User } from '../../src/user/entities/user.entity';

@Injectable()
export class RequestService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @InjectRepository(Request)
  private readonly requestRepository: Repository<Request>;

  async create(
    user: any,
    createRequestDto: CreateRequestDto,
  ): Promise<ResponseRequestDto> {
    try {
      const data = {};
      data['note'] = createRequestDto.note;
      data['type'] = createRequestDto.type;
      data['time'] = createRequestDto.time;
      data['requestDay'] = createRequestDto.requestDay;
      data['userId'] = user.id;

      const newRequest = await this.requestRepository.save(data);

      const responseRequest = plainToInstance(ResponseRequestDto, newRequest, {
        excludeExtraneousValues: true,
      });

      return responseRequest;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    try {
      const requestList = await this.requestRepository.find({
        relations: ['userId'],
      });
      const responseRequestList = requestList.map((request) => {
        const objRequest = {};
        objRequest['id'] = request.id;
        objRequest['note'] = request.note;
        objRequest['type'] = request.type;
        objRequest['time'] = request.time;
        objRequest['requestDay'] = request.requestDay;
        objRequest['status'] = request.status;
        objRequest['user'] = plainToInstance(ResponseUserDto, request.userId, {
          excludeExtraneousValues: true,
        });

        return objRequest;
      });

      return responseRequestList;
    } catch (error) {
      console.log(error);
    }
  }

  async getOwnRequest(user: any) {
    try {
      const userId: string = user.id;

      const requestList = await this.requestRepository
        .createQueryBuilder('request')
        .where(`request.userId = :userId`, { userId })
        .getMany();

      const userDto = await this.userRepository.findOne({
        where: { id: userId },
      });

      const responseUser = plainToInstance(ResponseUserDto, userDto, {
        excludeExtraneousValues: true,
      });

      const responseRequestList = [];

      for (const request of requestList) {
        const objReq = plainToInstance(ResponseRequestDto, request, {
          excludeExtraneousValues: true,
        });
        responseRequestList.push(objReq);
      }

      return {
        responseRequestList,
        responseUser,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    try {
      const request = await this.requestRepository.findOne({
        where: { id: id },
      });
      const responseRequest = plainToInstance(ResponseRequestDto, request, {
        excludeExtraneousValues: true,
      });

      return responseRequest;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async update(
    id: string,
    updateRequestDto: UpdateRequestDto,
  ): Promise<ResponseRequestDto> {
    try {
      const updateRequest = await this.requestRepository.findOne({
        where: { id: id },
      });

      Object.assign(updateRequest, updateRequestDto);
      const updatedRequest = await this.requestRepository.save(updateRequest);

      const responseRequest = plainToInstance(
        ResponseRequestDto,
        updatedRequest,
        {
          excludeExtraneousValues: true,
        },
      );
      return responseRequest;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string): Promise<DeleteRequestDto | string> {
    try {
      const deleteRequest = await this.requestRepository.findOne({
        where: { id: id },
      });

      deleteRequest.isDeleted = true;
      deleteRequest.deletedAt = new Date();

      const deletedRequest = await this.requestRepository.save(deleteRequest);

      const responseRequest = plainToInstance(
        DeleteRequestDto,
        deletedRequest,
        {
          excludeExtraneousValues: true,
        },
      );
      return responseRequest;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }
}
