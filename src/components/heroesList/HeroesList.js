import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { useHttp } from "../../hooks/http.hook";
import {
  fetchHeroes,
  heroDeleted,
  filteredHeroesSelector,
} from "../../store/slices/heroesSlice";

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";

import "./heroesList.scss";

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
  const filteredHeroes = useSelector(filteredHeroesSelector);
  const { heroesLoadingStatus } = useSelector((state) => state.heroes);
  const dispatch = useDispatch();
  const { request } = useHttp();

  useEffect(() => {
    dispatch(fetchHeroes());

    // eslint-disable-next-line
  }, []);
  const onDeleteItem = useCallback(
    (id) => {
      request(`http://localhost:3001/heroes/${id}`, "DELETE").then(() => {
        dispatch(heroDeleted(id));
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [request]
  );
  const renderHeroesList = (heroesList) => {
    if (heroesList.length === 0) {
      return <h5 className="text-center mt-5">Героев пока нет</h5>;
    }

    return (
      <TransitionGroup component={null}>
        {heroesList.map(({ id, ...props }) => {
          return (
            <CSSTransition key={id} timeout={500} classNames="item">
              <HeroesListItem {...props} onDelete={() => onDeleteItem(id)} />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  };
  if (heroesLoadingStatus === "loading") {
    return <Spinner />;
  } else if (heroesLoadingStatus === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  const elements = renderHeroesList(filteredHeroes);
  return <ul>{elements}</ul>;
};

export default HeroesList;
