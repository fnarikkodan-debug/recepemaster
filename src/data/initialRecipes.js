// Mock Database of Initial Recipes for RecipeMaster.com
// Includes rich details: country, state, spice level, cook time, review stars, ingredients, and steps

export const initialRecipes = [
  {
    id: "butter-chicken",
    title: "Classic Butter Chicken",
    description: "A rich, creamy, and velvety tomato curry with tender tandoori-spiced chicken, finished with heavy cream and aromatic fenugreek leaves.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800",
    country: "India",
    state: "Punjab",
    spiceLevel: "hot", // mild, medium, hot, insane
    cookTime: 45, // in minutes
    stars: 5,
    videoUrl: "https://www.youtube.com/embed/a03U45jFxOI",
    sections: [
      {
        title: "Tandoori Marinade",
        content: "Yogurt, lemon juice, garlic paste, ginger paste, garam masala, chili powder, and turmeric."
      },
      {
        title: "Makhani Gravy Base",
        content: "Roma tomatoes, butter, heavy cream, cashews, honey, dried fenugreek leaves (kasuri methi)."
      }
    ],
    ingredients: [
      "chicken breast",
      "plain yogurt",
      "lemon juice",
      "garlic paste",
      "ginger paste",
      "garam masala",
      "kashmiri chili powder",
      "turmeric",
      "butter",
      "tomato puree",
      "heavy cream",
      "cashew nuts",
      "fenugreek leaves"
    ],
    steps: [
      {
        number: 1,
        title: "Marinate the Chicken",
        text: "In a bowl, combine chicken cubes with yogurt, lemon juice, garlic, ginger, and marinade spices. Let it sit for at least 30 minutes (ideally overnight)."
      },
      {
        number: 2,
        title: "Sear Chicken Cubes",
        text: "Melt 1 tablespoon of butter in a large skillet over high heat. Add the chicken in batches and sear until browned on all sides, then remove and set aside. (It doesn't need to be cooked through yet)."
      },
      {
        number: 3,
        title: "Prepare Gravy Base",
        text: "In the same pan, melt another tablespoon of butter. Sauté ginger and garlic, then add tomato puree and cashew paste. Simmer for 10 minutes until tomatoes are cooked down."
      },
      {
        number: 4,
        title: "Blend and Add Cream",
        text: "Pour the gravy base into a blender and blend until completely smooth. Pour back into the pan, stir in the heavy cream, remaining butter, garam masala, and fenugreek leaves."
      },
      {
        number: 5,
        title: "Simmer Chicken",
        text: "Add the seared chicken back into the gravy. Simmer gently on low heat for 10-15 minutes until the chicken is tender and cooked through. Serve hot with Naan."
      }
    ],
    reviews: [
      { author: "Anita S.", rating: 5, comment: "Absolutely authentic taste! Reminds me of Punjab." },
      { author: "John D.", rating: 5, comment: "Best butter chicken recipe I have ever tried. The fenugreek leaves make all the difference." }
    ]
  },
  {
    id: "cacio-e-pepe",
    title: "Authentic Cacio e Pepe",
    description: "The minimalist Roman masterpiece. Perfectly al dente spaghetti tossed with freshly cracked black pepper and a velvety cheese cream made solely from Pecorino Romano and pasta cooking water.",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800",
    country: "Italy",
    state: "Lazio",
    spiceLevel: "mild",
    cookTime: 20,
    stars: 4.8,
    videoUrl: "https://www.youtube.com/embed/1vR_sO4fV_0",
    sections: [
      {
        title: "Serving Suggestion",
        content: "Serve immediately on warmed plates. Pair with a medium-bodied Italian white wine."
      }
    ],
    ingredients: [
      "spaghetti",
      "pecorino romano cheese",
      "black pepper",
      "salt"
    ],
    steps: [
      {
        number: 1,
        title: "Boil Pasta",
        text: "Bring a large pot of water to a boil. Salt it lightly (less than usual, as Pecorino is very salty). Cook spaghetti until 2 minutes before al dente."
      },
      {
        number: 2,
        title: "Toast Black Pepper",
        text: "While pasta cooks, grind whole black peppercorns directly into a wide skillet. Toast dry over medium heat for 1-2 minutes until fragrant."
      },
      {
        number: 3,
        title: "Temper the Pepper",
        text: "Ladle about half a cup of the starchy pasta water into the skillet with toasted pepper. The starch will emulsify with the pepper oil."
      },
      {
        number: 4,
        title: "Create Cheese Paste",
        text: "In a bowl, mix finely grated Pecorino Romano cheese with a splash of warm pasta cooking water. Whisk vigorously until a thick, smooth paste forms."
      },
      {
        number: 5,
        title: "Toss and Cream",
        text: "Transfer spaghetti directly to the skillet with pepper water. Toss for 1 minute. Remove skillet from heat entirely. Add cheese paste and toss rapidly. The cheese will melt into a creamy coating. Serve immediately."
      }
    ],
    reviews: [
      { author: "Matteo R.", rating: 5, comment: "Mamma mia! Simple and delicious. Essential to keep skillet off the heat when mixing cheese." }
    ]
  },
  {
    id: "tacos-al-pastor",
    title: "Tacos Al Pastor",
    description: "A legendary street food staple: thin pork shoulder marinated in a rich blend of guajillo chilies, achiote paste, and vinegar, seared crispy and topped with fresh pineapple.",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=800",
    country: "Mexico",
    state: "Puebla",
    spiceLevel: "medium",
    cookTime: 60,
    stars: 4.9,
    videoUrl: "https://www.youtube.com/embed/n4rJ0sCmqb4",
    sections: [
      {
        title: "Marinade Secret",
        content: "Achiote paste gives the pork its signature brick-red color and slightly earthy flavor."
      }
    ],
    ingredients: [
      "pork shoulder",
      "pineapple",
      "corn tortillas",
      "white onion",
      "cilantro",
      "achiote paste",
      "guajillo chilies",
      "white vinegar",
      "garlic cloves",
      "lime"
    ],
    steps: [
      {
        number: 1,
        title: "Prepare Marinade",
        text: "Rehydrate dried guajillo chilies in hot water. Blend them with achiote paste, vinegar, garlic, salt, and cumin until totally smooth."
      },
      {
        number: 2,
        title: "Marinate Pork",
        text: "Slice pork shoulder very thin. Coat slices thoroughly in marinade. Let marinate in the fridge for at least 4 hours."
      },
      {
        number: 3,
        title: "Sear Pork Slices",
        text: "Heat a cast-iron skillet until smoking. Add cooking oil and sear the pork slices in single layers until crispy and charred on edges. Chop pork into bite-sized pieces."
      },
      {
        number: 4,
        title: "Char the Pineapple",
        text: "Slice fresh pineapple into rings or chunks. Grill or pan-sear pineapple chunks until they are caramelized and slightly smoky."
      },
      {
        number: 5,
        title: "Assemble Tacos",
        text: "Warm corn tortillas. Heap sliced pork, top with finely diced onions, fresh cilantro, charred pineapple, and a squeeze of lime juice. Serve with salsa verde."
      }
    ],
    reviews: [
      { author: "Sofia M.", rating: 5, comment: "Tastes exactly like the taquerias in Puebla! The sweet pineapple matches the pork perfectly." }
    ]
  },
  {
    id: "kung-pao-chicken",
    title: "Kung Pao Chicken",
    description: "Sichuan's fiery stir-fry classic. Wok-tossed chicken breast, crunchy roasted peanuts, and vibrant bell peppers, engulfed in a dry-chili and Sichuan peppercorn sauce.",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=800",
    country: "China",
    state: "Sichuan",
    spiceLevel: "insane",
    cookTime: 25,
    stars: 4.7,
    videoUrl: "https://www.youtube.com/embed/Pj1GvX5wZ0Y",
    sections: [
      {
        title: "Heat Level Warning",
        content: "Contains dried red lantern chilies and tongue-numbing Sichuan peppercorns."
      }
    ],
    ingredients: [
      "chicken breast",
      "roasted peanuts",
      "bell pepper",
      "dried red chilies",
      "sichuan peppercorns",
      "soy sauce",
      "shaoxing wine",
      "ginger",
      "garlic paste",
      "cornstarch",
      "green onion"
    ],
    steps: [
      {
        number: 1,
        title: "Marinate Chicken",
        text: "Dice chicken breast into 1/2-inch cubes. Marinate with 1 tbsp soy sauce, 1 tbsp Shaoxing wine, and 1 tsp cornstarch. Set aside for 15 minutes."
      },
      {
        number: 2,
        title: "Prepare Sauce",
        text: "Whisk soy sauce, sugar, black vinegar, sesame oil, cornstarch, and water in a small bowl. This is the sauce that will bind everything in the wok."
      },
      {
        number: 3,
        title: "Wok Frying",
        text: "Heat oil in a wok. Add dried chilies and Sichuan peppercorns, frying until dark brown and aromatic. Add minced ginger and garlic."
      },
      {
        number: 4,
        title: "Stir-Fry Chicken",
        text: "Add chicken cubes to the wok and stir-fry at high heat until cooked through (about 4 minutes). Throw in chopped green onions and diced bell pepper."
      },
      {
        number: 5,
        title: "Finish & Serve",
        text: "Pour the sauce mixture into the wok, tossing rapidly until the sauce thickens and glazes the chicken. Stir in the roasted peanuts. Serve with steamed rice."
      }
    ],
    reviews: [
      { author: "Li W.", rating: 5, comment: "Excellent 'ma-la' (numbing & spicy) sensation! Truly authentic recipe." }
    ]
  },
  {
    id: "new-england-clam-chowder",
    title: "New England Clam Chowder",
    description: "A rich, creamy, hearty seafood soup filled with chopped sea clams, tender red potatoes, and smoky bacon, seasoned with fresh thyme.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800",
    country: "United States",
    state: "Massachusetts",
    spiceLevel: "mild",
    cookTime: 35,
    stars: 4.6,
    videoUrl: "https://www.youtube.com/embed/t0S2Qp8Kx5g",
    sections: [
      {
        title: "Fun Fact",
        content: "Traditionally served with oyster crackers to thicken the soup as you eat."
      }
    ],
    ingredients: [
      "clams",
      "potato",
      "bacon",
      "onion",
      "celery",
      "butter",
      "flour",
      "clam juice",
      "heavy cream",
      "thyme",
      "bay leaf"
    ],
    steps: [
      {
        number: 1,
        title: "Render Bacon",
        text: "In a Dutch oven, cook chopped bacon over medium-low heat until crisp. Remove bacon with a slotted spoon and set aside, leaving the fat in the pot."
      },
      {
        number: 2,
        title: "Sauté Aromatics",
        text: "Add diced onions and celery to the bacon fat. Sauté for 5 minutes until soft and translucent."
      },
      {
        number: 3,
        title: "Create Roux",
        text: "Melt butter into the pot. Add flour and stir constantly for 2 minutes to cook out the raw flour taste, forming a smooth roux."
      },
      {
        number: 4,
        title: "Simmer Potatoes",
        text: "Whisk in clam juice and heavy cream, ensuring no flour lumps remain. Add diced potatoes, a bay leaf, and fresh thyme. Simmer for 15-20 minutes until potatoes are tender."
      },
      {
        number: 5,
        title: "Add Clams",
        text: "Stir in chopped clams and cooked bacon. Cook for 5 more minutes until clams are tender and heated through. Adjust salt and pepper to taste."
      }
    ],
    reviews: [
      { author: "Emily K.", rating: 4, comment: "Wonderfully thick and creamy. Perfect with warm bread on a rainy evening." }
    ]
  }
];
