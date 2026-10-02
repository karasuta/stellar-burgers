import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await test.step('Мокируем все запросы через HAR-файлы', async () => {
      const hars = (name: string) => path.join(__dirname, 'hars', name);

      await page.routeFromHAR(hars('ingredients.har'), {
        url: '**/api/ingredients',
        update: false
      });

      await page.routeFromHAR(hars('auth-user.har'), {
        url: '**/api/auth/user',
        update: false
      });

      await page.routeFromHAR(hars('create-order.har'), {
        url: '**/api/orders',
        update: false
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
        resp.url().includes('/api/auth/user')
      );
      await page.goto('/');
      await userResponse;
    });
  });

  test('создание заказа: успешный сценарий', async ({ page }) => {
    const overlay = page.getByTestId('modal-overlay');
    const burgerConstructor = page.getByTestId('burger-constructor');

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

    await test.step('Проверяем, что булка и начинка появились в конструкторе', async () => {
      await expect(
        burgerConstructor.getByText('Краторная булка N-200i (верх)')
      ).toBeVisible();
      await expect(
        burgerConstructor.getByText('Краторная булка N-200i (низ)')
      ).toBeVisible();
      await expect(
        burgerConstructor.getByText('Биокотлета из марсианской Магнолии')
      ).toBeVisible();
    });

    await test.step('Проверяем, что модального окна заказа ещё нет', async () => {
      await expect(overlay).toBeHidden();
    });

    await test.step('Нажимаем «Оформить заказ» и ждём ответ API', async () => {
      const orderResponsePromise = page.waitForResponse((resp) =>
        resp.url().includes('/api/orders')
      );
      await page.getByRole('button', { name: 'Оформить заказ' }).click();
      const orderResponse = await orderResponsePromise;
      const orderBody = await orderResponse.json();
      const orderNumber = String(orderBody.order.number);
      const modal = page.getByTestId('modal');

      await expect(overlay).toBeVisible();
      await expect(modal.getByText(orderNumber)).toBeVisible();
    });

    await test.step('Проверяем, что конструктор сбросился', async () => {
      await expect(
        burgerConstructor.getByText('Выберите булки').first()
      ).toBeVisible();
      await expect(
        burgerConstructor.getByText('Выберите начинку')
      ).toBeVisible();
    });

    await test.step('Закрываем модалку и проверяем закрытие', async () => {
      await page.getByTestId('modal-close-btn').click();
      await expect(overlay).toBeHidden();
    });
  });
});
