// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

import { useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { heroCreated } from "../../store/slices/heroesSlice";
import { useHttp } from "../../hooks/http.hook";
import { selectAll } from "../../store/slices/filterSlice";
import store from "../../store";

const HeroesAddForm = () => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [element, setElement] = useState("");
  const filters = selectAll(store.getState());
  const { request } = useHttp();
  const dispatch = useDispatch();

  const renderFilters = (filters) => {
    const arr = filters.map((filter) => {
      // eslint-disable-next-line array-callback-return
      if (filter.name === "all") return;
      return (
        <option key={filter.name} value={filter.name}>
          {filter.description}
        </option>
      );
    });
    return (
      <>
        <option value="">Я владею элементом...</option>
        {arr}
      </>
    );
  };
  return (
    <form className="border p-4 shadow-lg rounded">
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">
          Имя нового героя
        </label>
        <input
          required
          type="text"
          name="name"
          className="form-control"
          id="name"
          placeholder="Как меня зовут?"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">
          Описание
        </label>
        <textarea
          required
          name="text"
          className="form-control"
          id="text"
          placeholder="Что я умею?"
          style={{ height: "130px" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="element" className="form-label">
          Выбрать элемент героя
        </label>
        <select
          required
          className="form-select"
          id="element"
          name="element"
          value={element}
          onChange={(e) => {
            setElement(e.target.value);
            console.dir(e.target.value);
          }}
        >
          {renderFilters(filters)}
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        onClick={(e) => {
          e.preventDefault();
          const hero = { id: uuidv4(), name, description: text, element };
          request(
            "http://localhost:3001/heroes",
            "POST",
            JSON.stringify(hero)
          ).then(() => {
            dispatch(heroCreated(hero));
            setElement("");
            setName("");
            setText("");
          });
        }}
      >
        Создать
      </button>
    </form>
  );
};

export default HeroesAddForm;
