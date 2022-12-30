import fetch from 'node-fetch';
import env from 'dotenv';
import { queue } from '../store/index.js';

env.config();

export async function check(request, response) {
  const { inn, phone } = request.body;

  requests.push(async () => {
    const result = await fetch(
      'https://partner.alfabank.ru/public-api/v2/checks',
      {
        method: 'POST',

        headers: {
          'api-key': process.env.API_KEY,
        },

        body: JSON.stringify({
          contactInfo: [
            {
              phoneNumber: `${phone}`,
            },
          ],
          organizationInfo: {
            inn: `${inn}`,
          },
          productInfo: [
            {
              productCode: 'LP_RKO',
            },
          ],
        }),
      },
    );

    const finaly =
      result.status === 200 ? 'Да' : result.status === 403 ? 'Нет' : 'Хз';

    response.status(200).send({
      payload: {
        inn: inn,
        phone: phone,
      },

      result: finaly,
    });
  });
}
