import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  UseGuards,
  Delete,
  Req,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';
import { MovieService } from './movie.service';
import { MovieResponseDto } from './dtos/movie-response.dto';
import { MovieDetailDto } from './dtos/movie-detail.dto';
import { AuthGuard } from '@nestjs/passport';
import { MovieWatchDto } from './dtos/movie-watch.dto';
import { MyListDto } from '../my-list/dtos/my-list.dto';
import { SuspendedGuard } from '../auth/guards/suspended.guard';

@ApiTags('The movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly _movieService: MovieService) {}
  @Get()
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'genre', required: false })
  @ApiQuery({ name: 'language', required: false })
  @ApiOkResponse({ type: MovieResponseDto })
  @ApiOperation({ summary: 'Retrieves the movies' })
  getAll(
    @Query('query') query?: string,
    @Query('genre') genre?: number,
    @Query('language') language?: string,
    @Query('page') page?: number,
  ): Promise<MovieResponseDto> {
    console.log('Lo que recibo es => ', {
      query,
      genres: genre ? [parseInt(genre.toString())] : [],
      language,
      page,
    });
    return this._movieService.findAll({
      query,
      genres: genre ? [parseInt(genre.toString())] : [],
      language,
      page,
    });
  }

  @Get(':id/detail')
  @ApiOperation({ summary: 'Retrieves the movie detail' })
  @ApiQuery({ name: 'language', required: false })
  @ApiOkResponse({ type: MovieDetailDto })
  getById(@Param('id') id: number, @Query('language') language?: string) {
    return this._movieService.findById({ id, language });
  }

  @Get(':id/recommendations')
  @ApiQuery({ name: 'language', required: false })
  @ApiOkResponse({ type: MovieResponseDto })
  getRecommendations(
    @Param('id') id: number,
    @Query('language') language?: string,
  ) {
    console.log('Buscar una pelicula', id);
    return this._movieService.findRecommendations({ id, language });
  }

  @Get('popular')
  @ApiOperation({ summary: 'Retrieves the popular movies' })
  @ApiQuery({ name: 'language', required: false })
  @ApiOkResponse({ type: MovieResponseDto })
  getPopular(@Query('language') language?: string): Promise<MovieResponseDto> {
    return this._movieService.findPopular({ language });
  }

  @Get('top-rated')
  @ApiOperation({ summary: 'Retrieves the top rated movies' })
  @ApiQuery({ name: 'language', required: false })
  @ApiOkResponse({ type: MovieResponseDto })
  getTopRated(@Query('language') language?: string): Promise<MovieResponseDto> {
    return this._movieService.findTopRated({ language });
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Retrieves the upcoming movies' })
  @ApiQuery({ name: 'language', required: false })
  @ApiOkResponse({ type: MovieResponseDto })
  getUpcoming(@Query('language') language?: string): Promise<MovieResponseDto> {
    return this._movieService.findUpcoming({ language });
  }

  @Post(':movieId')
  @ApiOperation({ summary: 'Add the movie to my list' })
  @ApiOkResponse({ type: MyListDto })
  @UseGuards(AuthGuard('jwt'), SuspendedGuard)
  addMovie(@Param('movieId') movieId: number, @Req() req): Promise<MyListDto> {
    return this._movieService.add(movieId, req.user.email);
  }

  @Delete(':movieId')
  @ApiOperation({ summary: 'Removes the movie from my list' })
  @ApiOkResponse({ type: MyListDto })
  @UseGuards(AuthGuard('jwt'), SuspendedGuard)
  removeMovie(
    @Param('movieId') movieId: number,
    @Req() req,
  ): Promise<MyListDto> {
    return this._movieService.remove(movieId, req.user.email);
  }

  @Get(':movieId/watch')
  @ApiOkResponse({ type: MovieWatchDto })
  @UseGuards(AuthGuard('jwt'))
  watch(@Param('movieId') movieId: number): Promise<MovieWatchDto> {
    return this._movieService.watch(movieId);
  }
}
