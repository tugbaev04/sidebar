
---

# 📌 Sidebar Component

Это кастомный компонент **боковой панели навигации** на React с поддержкой:

* **Светлой и тёмной темы**
* **Открытого и компактного режима**
* **Анимированных подписей кнопок**
* **Подсказок (tooltip)** при наведении/фокусе
* **Иконок FontAwesome**
* **Адаптации под маршруты проекта**
* 
---

## 📂 Структура проекта

```
src/
 ├── assets/
 │    └── logo.png      # Логотип
 ├── components/
 │    └── Sidebar/
 │         ├── Sidebar.jsx
 │         ├── Sidebar.scss  # Стили (в примере импорт index.scss)
 ├── index.scss         # Общие стили
```

---

## ⚙️ Установка и запуск

1. **Установите зависимости**:

```bash
npm install
# или
yarn install
```

2. **Добавьте FontAwesome**:

```bash
npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core classnames prop-types
```

3. **Импортируйте компонент**:

```jsx
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  return (
    <div className="app">
      <Sidebar color="dark" />
    </div>
  );
}
```

---

## 🎨 Кастомизация

### Изменение маршрутов

Маршруты определены в двух массивах:

```js
const ROUTES = [
  { title: 'Home', icon: 'fas-solid fa-house', path: '/' },
  ...
];
const BOTTOM_ROUTES = [
  { title: 'Settings', icon: 'sliders', path: '/settings' },
  ...
];
```

* `title` — подпись кнопки
* `icon` — FontAwesome иконка
* `path` — путь для навигации

### Подключение маршрутизации

Замените:

```js
const goToRoute = useCallback((path) => {
  console.log(`going to "${path}"`);
}, []);
```

на:

```js
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

const goToRoute = useCallback((path) => {
  navigate(path);
}, [navigate]);
```

---

## 🛠️ Пропсы

| Проп  | Тип                 | По умолчанию | Описание              |
| ----- | ------------------- | ------------ | --------------------- |
| color | `'dark' \| 'light'` | `'dark'`     | Начальная тема панели |

---

## 📷 Пример

**Закрытая панель**
\[иконки с тултипами]

**Открытая панель**
\[иконки с подписями]

---

## 📌 Особенности реализации

* **clampY** — вспомогательная функция для ограничения положения tooltip внутри окна
* **NavButton** — отдельный компонент кнопки панели
* **useCallback + useRef** — оптимизация перерисовок
* **ARIA-атрибуты** — для доступности
* **classnames** — удобное управление классами

---
