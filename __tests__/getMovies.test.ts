// __tests__/api/movie.test.ts
import { testApiHandler } from 'next-test-api-route-handler';


describe('/api/movie', () => {
  it('returns a list of movies', async () => {
    await testApiHandler({
      handler: async (req, res) => {
        const nextResponse = await GET(req);
        res.status(nextResponse.status).json(nextResponse.json());
      },
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'GET',
        });
        const movies = await response.json();
        expect(response.status).toBe(200);
        expect(movies).toBeInstanceOf(Array);
        // Add more assertions based on your expected movie data structure
      },
    });
  });

  // Add more tests for different scenarios, such as filtering by query parameters
});
