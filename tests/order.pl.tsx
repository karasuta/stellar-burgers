import { test, expect } from '@playwright/test';

test('создание заказа: успешный сценарий', async ({ page, context }) => {
  await test.step('Мокируем запрос ингредиентов через HAR-файл', async () => {
    await page.routeFromHAR('ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
  });

  await test.step('Мокируем запрос данных пользователя', async () => {
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@test.com', name: 'Тест' }
        })
      });
    });
  });

  await test.step('Мокируем создание заказа', async () => {
    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Краторный бургер',
          order: { number: 98765 }
        })
      });
    });
  });

  await test.step('Подставляем моковые токены авторизации', async () => {
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer fake-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);
  });

  await test.step('Открываем главную и ждём загрузки пользователя', async () => {
    const userResponse = page.waitForResponse((resp) =>
      resp.url().includes('/auth/user')
    );
    await page.goto('/');
    await userResponse;
  });

  await test.step('Собираем бургер: булка + начинка', async () => {
    const bunCard = page
      .getByTestId('ingredient')
      .filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const fillingCard = page
      .getByTestId('ingredient')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    await fillingCard.getByRole('button', { name: 'Добавить' }).click();
  });

  await test.step('Нажимаем «Оформить заказ» и ждём ответ API', async () => {
    const orderResponsePromise = page.waitForResponse((resp) =>
      resp.url().includes('/api/orders')
    );
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    const orderResponse = await orderResponsePromise;
    const orderBody = await orderResponse.json();
    const orderNumber = String(orderBody.order.number);

    const overlay = page.getByTestId('modal-overlay');
    await expect(overlay).toBeVisible();
    await expect(page.getByText(orderNumber)).toBeVisible();
  });

  await test.step('Проверяем, что конструктор сбросился', async () => {
    const constructor = page.getByTestId('burger-constructor');
    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();
  });

  await test.step('Закрываем модалку и проверяем закрытие', async () => {
    const overlay = page.getByTestId('modal-overlay');
    await page.getByTestId('modal-close-btn').click();
    await expect(overlay).toBeHidden();
  });
});
