import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import config from "@/config/config";
import queryId from "@/types/queryId";

interface Props {
  data: {
    _id: string;
    name: string;
    imageUrl: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    ingredients: string;
    instructions: string;
    calPerServing: number;
  };
}

const Recipe = ({ data }: Props) => {
  const [confirm, setConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isDeleting) {
      deleteRecipe();
    }
  }, [isDeleting]);

  const deleteRecipe = async () => {
    const recipeId = router.query.id;

    try {
      await fetch(`${config.PROD}${recipeId}`, {
        method: "DELETE",
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setConfirm(false);
  };

  const ConfirmWindow = () => {
    return (
      <div className="show-recipe__confirm">
        <h1>Are you sure?</h1>
        <div className="show-recipe__confirm-btns">
          <button onClick={() => setConfirm(false)}>Cancel</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
    );
  };

  const ingredientsString = Object.values(data.ingredients[0])
    .join("")
    .slice(0, -24);
  const instructionsString = Object.values(data.instructions[0])
    .join("")
    .slice(0, -24);

  return (
    <div className="show-recipe">
      {isDeleting ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <p className="heading">{data.name}</p>
          <div className="line-divide"></div>
          <div className="show-recipe__image">
            <div className="show-recipe__image-times">
              <p>
                Prep Time: <span>{data.prepTime} min</span>
              </p>
              <p>
                Cook Time: <span>{data.cookTime} min</span>
              </p>
            </div>
            <Image
              src={data.imageUrl}
              alt={data.name}
              style={{ objectFit: "cover", borderRadius: "10px" }}
              width={400}
              height={200}
              priority
            />
          </div>
          <h1 className="show-recipe__subheading">Ingredients</h1>
          <p className="show-recipe__p">{ingredientsString}</p>
          <h1 className="show-recipe__subheading">Instructions</h1>
          <p className="show-recipe__p">{instructionsString}</p>
          {data.servings ? (
            <p className="show-recipe__serves">
              Serves: <span>{data.servings}</span>
            </p>
          ) : (
            <></>
          )}
          {!confirm ? (
            <button
              className="show-recipe__delete"
              onClick={() => setConfirm(true)}
            >
              Delete
            </button>
          ) : (
            <ConfirmWindow />
          )}
        </>
      )}
    </div>
  );
};

export async function getServerSideProps({ query: { id } }: queryId) {
  const res = await fetch(`${config.PROD}${id}`);
  const { data } = await res.json();
  return { props: { data } };
}

export default Recipe;