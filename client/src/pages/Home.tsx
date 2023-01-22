import { useState } from "react";
import Header from "../components/Header";
import styles from "./Home.module.css";

const Home = () => {
  interface Recipe {
    uri: string;
    label: string;
    image: string;
  }

  const [ingredientsInput, setIngredientsInput] = useState<string>("");
  const [recipeResults, setRecipeResults] = useState<Array<Recipe>>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRecipeResults([]);
    setLoading(true);

    const response = await fetch(
      `https://wastenot.onrender.com/recipes?ingredients=${ingredientsInput}`
    );

    if (response.status === 200) {
      const data = await response.json();
      setLoading(false);
      setRecipeResults(data);
    }
  };

  const getRecipeId = (uri: string) => {
    return uri.replace(
      "http://www.edamam.com/ontologies/edamam.owl#recipe_",
      ""
    );
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.top_fold}>
          <Header />
          <div className={styles.search}>
            <form className={styles.search_bar} onSubmit={handleSearch}>
              <input
                className={styles.search_bar_field}
                type="search"
                value={ingredientsInput}
                onChange={(event) => setIngredientsInput(event.target.value)}
              />
              <button className={styles.search_bar_button}>Search</button>
            </form>
          </div>
        </div>
        {loading && (
          <div className={styles.loading_container}>
            <div className={styles.loading_spin}></div>
          </div>
        )}
        {recipeResults && (
          <>
            <h2 className={styles.results_header}>Your recipes &#8594;</h2>
            <div className={styles.recipe_results}>
              {recipeResults.map((recipe: Recipe) => (
                <a href={`/recipe/${getRecipeId(recipe.uri)}`}>
                  <div className={styles.recipe_card} key={recipe.uri}>
                    <img
                      className={styles.recipe_image}
                      src={recipe.image}
                      alt={recipe.label}
                    />
                    <h3 className={styles.recipe_label}>{recipe.label}</h3>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
