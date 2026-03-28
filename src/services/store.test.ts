import { rootReducer } from './store';

describe('rootReducer', () => {
  test('инициализирует все редьюсеры без ошибок', () => {
    // Получаем объект со всеми редьюсерами
    const reducers = rootReducer();

    // Создаем тестовый экшен
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    // Проверяем что все редьюсеры работают без ошибок.
    // Учитывая, что в дальнейшем могут быть добавлены и другие редьюсеры.
    // Из объекта со всеми редьюсерами берем значения (функции-редьюсеры),
    // проверяем каждую, передавая неизвестный экшн и неопределенный стейт,
    // ожидаем, что не будет выброшена ошибка.
    Object.values(reducers).forEach((reducer) => {
      expect(() => {
        reducer(undefined, unknownAction);
      }).not.toThrow();
    });
  });
});
