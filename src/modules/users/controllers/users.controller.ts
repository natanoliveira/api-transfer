import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserListResponseDto } from '../dto/user-list-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { CreateUserUseCase } from '../services/create-user.usecase';
import { ListUsersUseCase } from '../services/list-users.usecase';
import { UserPresenter } from '../services/user-presenter';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Criar usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'Usuario criado com sucesso.', type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Dados invalidos ou documento/email ja cadastrados.' })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(dto);
    return UserPresenter.toResponse(user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuários' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOkResponse({ description: 'Usuários listados com sucesso.', type: UserListResponseDto })
  async list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<UserListResponseDto> {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    const { items, total, page: currentPage, limit: currentLimit } = await this.listUsersUseCase.execute(
      pageNumber,
      limitNumber,
    );

    return {
      items: items.map(UserPresenter.toResponse),
      total,
      page: currentPage,
      limit: currentLimit,
    };
  }
}
