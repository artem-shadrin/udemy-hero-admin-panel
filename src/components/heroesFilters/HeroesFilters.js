import classNames from "classnames";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../store/index";
import {
  fetchFilters,
  filterActiveChanged,
  selectAll,
} from "../../store/slices/filterSlice";
import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {
  const { activeFilter, filterActiveStatus } = useSelector(
    (state) => state.filters
  );
  const filters = selectAll(store.getState());
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFilters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderFilters = (filters) => {
    return filters.map((filter) => {
      const styles = classNames({
        btn: true,
        active: filter.name === activeFilter,
        "btn-outline-dark": filter.name === "all",
        "btn-danger": filter.name === "fire",
        "btn-primary": filter.name === "water",
        "btn-success": filter.name === "wind",
        "btn-secondary": filter.name === "earth",
      });
      return (
        <button
          key={filter.name}
          className={styles}
          onClick={() => {
            dispatch(filterActiveChanged(filter.name));
          }}
        >
          {filter.description}
        </button>
      );
    });
  };
  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <p className="card-text">Отфильтруйте героев по элементам</p>
        {filterActiveStatus === "loading" ? <Spinner /> : null}
        <div className="btn-group">{renderFilters(filters)}</div>
      </div>
    </div>
  );
};

export default HeroesFilters;
