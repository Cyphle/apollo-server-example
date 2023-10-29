import { RESTDataSource } from '@apollo/datasource-rest';
import { Movie } from './movie.types.js';

export class MoviesAPI extends RESTDataSource {
  override baseURL = 'https://movies-api.example.com/';

  async getMovie(id: string): Promise<Movie> {
    return this.get<Movie>(`movies/${encodeURIComponent(id)}`);
  }

  async getMostViewedMovies(limit = '10'): Promise<Movie[]> {
    const data = await this.get('movies', {
      params: {
        per_page: limit.toString(), // all params entries should be strings,
        order_by: 'most_viewed',
      },
    });
    return data.results;
  }
}