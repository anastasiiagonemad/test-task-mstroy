# MStroy Frontend Test Task

Решение тестового задания на `Vue 3`, `TypeScript`, `Vite` и `AgGrid`.

## Что реализовано

- `TreeStore` с методами:
  - `getAll`
  - `getItem`
  - `getChildren`
  - `getAllChildren`
  - `getAllParents`
  - `addItem`
  - `removeItem`
  - `updateItem`
- Индексы на `Map`/`Set` для быстрого доступа к элементам и дочерним связям.
- Vue-компонент с отображением дерева в `AgGrid`.
- Unit-тесты для `TreeStore` на `Vitest`.

## Запуск

```bash
npm install
npm run dev
```

## Проверка

```bash
npm test
npm run build
```

# test-task-mstroy
