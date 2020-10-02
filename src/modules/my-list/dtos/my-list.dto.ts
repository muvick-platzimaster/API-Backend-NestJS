import { MovieDetailDto } from 'src/modules/movie/dtos/movie-detail.dto';
import { SerieDetailDto } from 'src/modules/serie/dtos/serie-detail.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MyListDto {
  @ApiProperty()
  email: string;
  @ApiProperty({ type: MovieDetailDto, isArray: true })
  movies: MovieDetailDto[];
  @ApiProperty({ type: SerieDetailDto, isArray: true })
  series: SerieDetailDto[];
}
