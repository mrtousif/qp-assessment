import axios from 'axios';
interface User {
  id: string;
}
describe('Test products api', () => {
  let user: User;
  beforeAll(() => {
    user = globalThis.user;
  });

  describe('As a user', () => {
    it('Get available grocery items', async () => {
      const options = {
        method: 'GET',
        url: 'http://localhost:6000/api/products',
        headers: {
          Authorization: user.id,
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.request(options);
      expect(res.status).toBe(200);
      expect(res.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            stockQty: expect.any(Number),
            price: expect.any(Number),
          }),
        ])
      );

      for (const item of res.data) {
        expect(item.stockQty).toBeGreaterThanOrEqual(1);
      }
    });
  });
});
