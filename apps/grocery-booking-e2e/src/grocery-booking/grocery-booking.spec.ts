import axios from 'axios';
interface User {
  id: string;
}
describe('Test products api', () => {
  let admin: User, user: User;
  beforeAll(() => {
    admin = globalThis.admin;
    user = globalThis.user;
    console.log(admin, user);
  });

  describe('As a admin', () => {
    let groceryItems = [];
    beforeAll(async () => {
      const options = {
        method: 'GET',
        url: 'http://localhost:6000/api/products',
      };

      const res = await axios.request(options);
      groceryItems = res.data;
      console.log(groceryItems);
    });

    it('Add new grocery item', async () => {
      const options = {
        method: 'POST',
        url: 'http://localhost:6000/api/products',
        headers: {
          Authorization: admin.id,
          'Content-Type': 'application/json',
        },
        data: { name: 'Cabbage', stockQty: 10, price: 10 },
      };

      const res = await axios.request(options);
      expect(res.status).toBe(201);
      expect(res.data).toEqual(
        expect.objectContaining({ name: 'Cabbage', stockQty: 10, price: 10 })
      );
      expect(res.data).toHaveProperty('id');
      expect(res.data).toHaveProperty('createdAt');
    });

    it('View existing grocery items', async () => {
      const options = {
        method: 'GET',
        url: 'http://localhost:6000/api/products',
        headers: {
          Authorization: admin.id,
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
    });

    it('Remove a grocery item', async () => {
      const itemId = groceryItems[1].id;
      const options = {
        method: 'DELETE',
        url: `http://localhost:6000/api/products/${itemId}`,
        headers: {
          Authorization: admin.id,
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.request(options);
      expect(res.status).toBe(200);
    });

    it('Update name, price of a existing grocery item', async () => {
      const itemId = groceryItems[0].id;
      const options = {
        method: 'PATCH',
        url: `http://localhost:6000/api/products/${itemId}`,
        headers: {
          Authorization: admin.id,
          'Content-Type': 'application/json',
        },
        data: { name: 'Cabbage2', price: 12 },
      };

      const res = await axios.request(options);
      expect(res.status).toBe(200);
    });

    it('Update stock quantity of a grocery item', async () => {
      const itemId = groceryItems[2].id;
      const options = {
        method: 'PATCH',
        url: `http://localhost:6000/api/products/${itemId}`,
        headers: {
          Authorization: admin.id,
          'Content-Type': 'application/json',
        },
        data: { stockQty: 6 },
      };

      const res = await axios.request(options);
      expect(res.status).toBe(200);
    });
  });
});
