import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/request/create-project.dto';
import { UpdateProjectDto } from './dto/request/update-project.dto';
import { ResponseProjectDto } from './dto/response/response-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProjectService {
  @InjectRepository(Project)
  private readonly projectRepository: Repository<Project>;  

  async create(createProjectDto: CreateProjectDto): Promise<ResponseProjectDto | string> {
    try {
      const newProject = await this.projectRepository.save(createProjectDto);
      
      const responseProject = plainToInstance(ResponseProjectDto, newProject, {
        excludeExtraneousValues: true
      });
      return responseProject;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async findAll() {
    try {
      const listProject = await this.projectRepository.find({});

      const responseListProject = listProject.map(project => plainToInstance(ResponseProjectDto, project, {
        excludeExtraneousValues: true
      }));
      return responseListProject;
    } catch (error) {
      console.log(error);
      return "Failed";
    }
  }

  async findOne(id: string): Promise<ResponseProjectDto | string> {
    try {
      const resProject = await this.projectRepository.findOne({
        where: {
          id: id
        }
      });
      const responseProject = plainToInstance(ResponseProjectDto, resProject, {
        excludeExtraneousValues: true
      });

      return responseProject;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<ResponseProjectDto | string> {
    try {
      const updateProject = await this.projectRepository.findOne({
        where: {
          id: id
        }
      });

      Object.assign(updateProject, updateProjectDto);
      const updatedProject = await this.projectRepository.save(updateProject);

      const responseProject = plainToInstance(ResponseProjectDto, updatedProject, {
        excludeExtraneousValues: true
      });
      return responseProject;
    } catch (error) {
      console.log(error);
      return 'Failed';
    }
  }

  async remove(id: string): Promise<ResponseProjectDto | string> {
    try {
      const delProject = await this.projectRepository.findOne({
        where: {
          id: id
        }
      });
      
      delProject.isDeleted = true;
      delProject.deletedAt = new Date();

      this.projectRepository.save(delProject);
      const responseProject = plainToInstance(ResponseProjectDto, delProject, {
        excludeExtraneousValues: true
      });

      // where: {
      //   deletedAt: Not(IsNull()),
      // },
      // withDeleted: true,
      return responseProject;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }
}
