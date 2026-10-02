import { test, expect } from '@playwright/test';
import path from 'path';

const hars = (name: string) => path.join(__dirname, 'hars', name);

test.describe('Загрузка ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Подключаем HAR-файл для мока запроса ингредиентов', async () => {
      await page.routeFromHAR(hars('ingredients.har'), {
        url: '**/api/ingredients',
        update: false
      });
    });

    await test.step('Переходим на главную страницу', async () => {
      await page.goto('/');
    });
  });

  test('ингредиенты загружаются из HAR-файла (мок)', async ({ page }) => {
    await test.step('Проверяем, что ингредиент «Краторная булка N-200i» отображается на странице', async () => {
      await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
    });
  });
});

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(hars('ingredients.har'), {
      url: '**/api/ingredients',
      update: false
    });
    await page.goto('/');
  });

  test('добавление булки и начинки в конструктор', async ({ page }) => {
    const burgerConstructor = page.getByTestId('burger-constructor');

    await test.step('Проверяем начальное состояние конструктора: видны плейсхолдеры', async () => {
      await expect(
        burgerConstructor.getByText('Выберите булки').first()
      ).toBeVisible();
      await expect(
        burgerConstructor.getByText('Выберите начинку')
      ).toBeVisible();
    });

    await test.step('Находим карточку булки и добавляем её в конструктор', async () => {
      const bunCard = page
        .getByTestId('ingredient')
        .filter({ hasText: 'Краторная булка N-200i' });
      await bunCard.getByRole('button', { name: 'Добавить' }).click();
    });

    await test.step('Проверяем, что булка отобразилась в конструкторе (верх и низ)', async () => {
      await expect(
        burgerConstructor.getByText('Краторная булка N-200i (верх)')
      ).toBeVisible();
      await expect(
        burgerConstructor.getByText('Краторная булка N-200i (низ)')
      ).toBeVisible();
    });

    await test.step('Находим карточку начинки и добавляем её в конструктор', async () => {
      const fillingCard = page
        .getByTestId('ingredient')
        .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
      await fillingCard.getByRole('button', { name: 'Добавить' }).click();
    });

    await test.step('Проверяем, что начинка появилась в конструкторе', async () => {
      await expect(
        burgerConstructor.getByText('Биокотлета из марсианской Магнолии')
      ).toBeVisible();
    });

    await test.step('Проверяем, что плейсхолдеры «Выберите булки» и «Выберите начинку» скрылись', async () => {
      await expect(burgerConstructor.getByText('Выберите булки')).toBeHidden();
      await expect(
        burgerConstructor.getByText('Выберите начинку')
      ).toBeHidden();
    });
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Мокаем запрос ингредиентов через HAR-файл', async () => {
      await page.routeFromHAR(hars('ingredients.har'), {
        url: '**/api/ingredients',
        update: false
      });
    });

    await test.step('Переходим на главную страницу', async () => {
      await page.goto('/');
    });
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    const overlay = page.getByTestId('modal-overlay');
    const modal = page.getByTestId('modal');

    await test.step('Проверяем, что модальное окно изначально скрыто', async () => {
      await expect(overlay).toBeHidden();
    });

    await test.step('Кликаем по карточке «Краторная булка N-200i»', async () => {
      await page
        .getByTestId('ingredient')
        .filter({ hasText: 'Краторная булка N-200i' })
        .getByRole('link')
        .click();
    });

    await test.step('Проверяем, что модалка открылась и заголовок — «Краторная булка N-200i»', async () => {
      await expect(overlay).toBeVisible();
      await expect(
        modal.getByRole('heading', { name: 'Краторная булка N-200i' })
      ).toBeVisible();
    });

    await test.step('Закрываем модалку по крестику', async () => {
      await page.getByTestId('modal-close-btn').click();
      await expect(overlay).toBeHidden();
    });

    await test.step('Кликаем по карточке «Биокотлета из марсианской Магнолии»', async () => {
      await page
        .getByTestId('ingredient')
        .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
        .click();
    });

    await test.step('Проверяем, что заголовок сменился на «Биокотлета из марсианской Магнолии»', async () => {
      await expect(overlay).toBeVisible();
      await expect(
        modal.getByRole('heading', {
          name: 'Биокотлета из марсианской Магнолии'
        })
      ).toBeVisible();
    });

    await test.step('Закрываем модалку кликом по оверлею', async () => {
      const box = await overlay.boundingBox();
      await page.mouse.click(box!.x + 10, box!.y + 10);
      await expect(overlay).toBeHidden();
    });
  });
});
