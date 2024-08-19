import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import CreateNew from "./CreateNew";
import MasonryCards from "../../common/Masonry/MasonryCards";
import { CardData, Card, TagsData } from "../../../types/Card";
import { useFetchTags } from "../../../hooks/useFetchTags";
import { useFetchTasks } from "../../../hooks/useFetchTasks";

const Home: React.FC = () => {
  const [data, setData] = useState<Card[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pb = new PocketBase("http://127.0.0.1:8090");

  const { data: tags } = useFetchTags();
  const { data: tasks } = useFetchTasks();

  useEffect(() => {
    const fetchData = async () => {
      const tagsData: TagsData[] = (tags || []).map((tag) => {
        const { id, description, colour } = tag;
        return {
          id,
          description,
          colour,
        };
      });

      const cardData: Card[] =
        (tasks || [])
          .map((task: CardData) => {
            const { id, position, title, content, images, tags } = task;
            const tagsItems: TagsData[] = tags
              ?.map((tag: string) => {
                const tagData = tagsData.find((t) => t.id === tag);
                if (!tagData) return null;
                return tagData;
              })
              ?.filter(Boolean) as TagsData[];
            return {
              id,
              position: position || 0,
              title,
              content,
              images,
              tags: tagsItems,
            };
          })
          ?.sort((a, b) => a?.position - b?.position) || [];

      setData(cardData);
    };

    fetchData();
  }, [tags, tasks]);

  const handleLogin = async (login: boolean = true) => {
    if (login) {
      await pb.collection("users").authWithPassword("admin", "admin1234");
    } else {
      await pb.authStore.clear();
    }
    setIsLoggedIn(pb.authStore.isValid);
  };

  useEffect(() => {
    setIsLoggedIn(pb.authStore.isValid);
  }, [pb.authStore.isValid]);

  return (
    <>
      {isLoggedIn && (
        <>
          <MasonryCards data={data} />
          <CreateNew />
          {!isLoggedIn && (
            <button onClick={() => handleLogin(false)}>Log out</button>
          )}
        </>
      )}
      {!isLoggedIn && (
        <div>
          Not logged in <button onClick={() => handleLogin(true)}>Login</button>
        </div>
      )}
    </>
  );
};

export default Home;
